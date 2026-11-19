/**
 * Urcă dist/ pe Hosterion prin FTPS, cu verificare pe conținut (nu doar pe mărime).
 *
 *   node scripts/deploy-ftp.mjs plan     compară dist/ cu serverul, nu schimbă nimic (implicit)
 *   node scripts/deploy-ftp.mjs apply    urcă ce diferă, în loturi mici, apoi verifică totul
 *   node scripts/deploy-ftp.mjs verify   descarcă fiecare fișier și compară sha256 cu dist/
 *
 * Datele de conectare: HOSTERION_FTP_FILE (implicit ~/.hosterion-ftp.json), JSON {host, port, user, password}.
 * Parola ajunge la curl printr-un fișier netrc temporar (șters la final) și nu apare în ieșire.
 * Rădăcina FTP a contului este folderul aplicației; REMOTE_DIR (implicit gol) e un prefix opțional.
 *
 * De ce așa: la ultimul deploy serverul a tăiat 32 de fișiere (rafale lungi, 451) iar comparația pe mărime a ratat un
 * fișier de aceeași lungime (BUILD_ID). Aici loturile sunt de 3 fișiere, iar verificarea compară hash-uri.
 *
 * După `apply` mai trebuie, în cPanel Terminal:
 *   cd ~/alexd-site && npm install --omit=dev      (doar dacă package.json s-a schimbat)
 *   rm -rf .next/server/route-cache && touch tmp/restart.txt
 */
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, relative } from 'node:path'

const mode = process.argv[2] || 'plan'
if (!['plan', 'apply', 'verify'].includes(mode)) {
  console.error('Folosire: node scripts/deploy-ftp.mjs [plan|apply|verify]')
  process.exit(2)
}

const dist = join(process.cwd(), 'dist')
if (!existsSync(join(dist, '.next', 'BUILD_ID'))) {
  console.error('Lipsește dist/. Rulează întâi `npm run package`.')
  process.exit(1)
}

const cfgFile = process.env.HOSTERION_FTP_FILE || join(homedir(), '.hosterion-ftp.json')
const cfg = JSON.parse(readFileSync(cfgFile, 'utf8'))
const remoteDir = (process.env.REMOTE_DIR || '').replace(/^\/|\/$/g, '')
const BATCH = Number(process.env.BATCH || 3)
const PAUSE = Number(process.env.PAUSE || 4)

const tmp = mkdtempSync(join(tmpdir(), 'deploy-'))
const netrc = join(tmp, 'netrc')
writeFileSync(netrc, `machine ${cfg.host} login ${cfg.user} password ${cfg.password}\n`, { mode: 0o600 })
const base = `ftp://${cfg.host}:${cfg.port || 21}`
const common = ['--globoff', '--ssl-reqd', '--netrc-file', netrc, '--silent', '--show-error', '--connect-timeout', '20']
const enc = (p) => p.split('/').map(encodeURIComponent).join('/')
const rp = (rel) => (remoteDir ? remoteDir + "/" + rel : rel)
const url = (rel) => `${base}/${enc(rp(rel))}`
const sleep = (s) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, s * 1000)
const curl = (args) => spawnSync('curl', [...common, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
const q = (s) => `"${s.replace(/\\/g, '/').replace(/"/g, '\\"')}"`
const sha = (buf) => createHash('sha256').update(buf).digest('hex')

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}
const files = walk(dist).map((f) => ({ abs: f, rel: relative(dist, f).replace(/\\/g, '/') }))

/** Lista unui folder remote: nume → mărime. */
function remoteSizes(dir) {
  for (let t = 0; t < 5; t++) {
    const r = curl([dir ? `${base}/${enc(dir)}/` : `${base}/`])
    if (r.status === 0) {
      const m = new Map()
      for (const line of r.stdout.split('\n')) {
        const x = line.trim().match(/^\S+\s+\d+\s+\S+\s+\S+\s+(\d+)\s+\S+\s+\S+\s+\S+\s+(.+)$/)
        if (x) m.set(x[2], Number(x[1]))
      }
      return m
    }
    if (r.status === 78 || r.status === 19 || /550|No such|not found|directory/i.test(r.stderr || '')) return new Map()
    sleep(5)
  }
  throw new Error(`Nu pot lista ${dir}`)
}

/** Fișierele care lipsesc sau au altă mărime pe server. */
function bySize() {
  const dirs = new Map()
  for (const f of files) {
    const d = f.rel.includes('/') ? f.rel.slice(0, f.rel.lastIndexOf('/')) : ''
    if (!dirs.has(d)) dirs.set(d, [])
    dirs.get(d).push(f)
  }
  const diff = []
  for (const [d, list] of dirs) {
    const remote = remoteSizes(rp(d))
    for (const f of list) if (remote.get(f.rel.slice(f.rel.lastIndexOf('/') + 1)) !== statSync(f.abs).size) diff.push(f)
  }
  return diff
}

/** Descarcă fiecare fișier și compară sha256. Întoarce fișierele diferite sau imposibil de citit. */
function byHash(list) {
  const bad = []
  const out = join(tmp, 'dl')
  for (const f of list) {
    let ok = false
    for (let t = 0; t < 3 && !ok; t++) {
      const r = curl(['-o', out, url(f.rel)])
      if (r.status === 0 && existsSync(out)) ok = sha(readFileSync(out)) === sha(readFileSync(f.abs))
      rmSync(out, { force: true })
      if (!ok) sleep(3)
    }
    if (!ok) bad.push(f)
  }
  return bad
}

function upload(list) {
  let queue = list
  for (let round = 1; round <= 6 && queue.length; round++) {
    const failed = []
    for (let i = 0; i < queue.length; i += BATCH) {
      const batch = queue.slice(i, i + BATCH)
      const conf = join(tmp, 'batch.curlrc')
      writeFileSync(conf, batch.map((f) => `upload-file = ${q(f.abs)}\nurl = ${q(url(f.rel))}\n`).join(''))
      const r = curl(['--ftp-create-dirs', '--max-time', '120', '-w', '%{response_code} %{url_effective}\\n', '-K', conf])
      const ok = new Set((r.stdout || '').split('\n').filter((l) => /^2\d\d /.test(l)).map((l) => l.slice(4)))
      for (const f of batch) if (!ok.has(url(f.rel))) failed.push(f)
      sleep(PAUSE)
    }
    console.log(`runda ${round}: ${queue.length - failed.length} urcate, ${failed.length} de reluat`)
    queue = failed
    if (queue.length) sleep(20)
  }
  return queue
}

try {
  console.log(`dist/: ${files.length} fișiere → rădăcina FTP (${remoteDir || "."}) pe ${cfg.host}`)
  if (mode === 'verify') {
    const bad = byHash(files)
    console.log(bad.length ? `DIFERITE (${bad.length}):\n${bad.map((f) => f.rel).join('\n')}` : 'OK: toate fișierele coincid pe hash.')
    process.exitCode = bad.length ? 1 : 0
  } else {
    const diff = bySize()
    console.log(`${diff.length} fișiere lipsă sau cu altă mărime.`)
    console.log(diff.slice(0, 40).map((f) => '  ' + f.rel).join('\n'))
    if (mode === 'apply') {
      // Fișierele de aceeași mărime nu se văd după mărime (ex. BUILD_ID): urcăm explicit ce poate rămâne identic ca lungime.
      const always = files.filter((f) => /(^|\/)(BUILD_ID|build-manifest\.json|prerender-manifest\.json|routes-manifest\.json)$/.test(f.rel))
      const todo = [...new Map([...diff, ...always].map((f) => [f.rel, f])).values()]
      const left = upload(todo)
      if (left.length) {
        console.log(`NEURCATE (${left.length}):\n${left.map((f) => f.rel).join('\n')}`)
        process.exitCode = 1
      } else {
        // Fișiere cu aceeași mărime dar conținut diferit (ex. *_tree.segment.rsc) nu apar la comparația pe mărime: le urcăm după hash.
        let bad = byHash(files)
        if (bad.length) {
          console.log(`${bad.length} fișiere cu conținut diferit, le urc din nou.`)
          upload(bad)
          bad = byHash(bad)
        }
        console.log(bad.length ? `VERIFICARE EȘUATĂ (${bad.length}):\n${bad.map((f) => f.rel).join('\n')}` : 'Verificare pe hash: OK.')
        console.log('Urmează în cPanel Terminal: rm -rf ~/alexd-site/.next/server/route-cache && touch ~/alexd-site/tmp/restart.txt')
        process.exitCode = bad.length ? 1 : 0
      }
    } else {
      console.log('Plan doar. Nimic nu a fost modificat. Pentru urcare: node scripts/deploy-ftp.mjs apply')
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
