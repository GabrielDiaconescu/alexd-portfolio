/**
 * Pregătește folderul dist/ pentru urcat pe cPanel, după `next build`.
 * Conține doar ce rulează pe server: build-ul (.next), public/, pornirea și lista de pachete.
 * node_modules NU se urcă: se instalează pe server („Run NPM Install”), ca să vină variantele de Linux.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const root = process.cwd()
const out = join(root, 'dist')

if (!existsSync(join(root, '.next', 'BUILD_ID'))) {
  console.error('Nu există un build de producție. Rulează întâi `npm run build`.')
  process.exit(1)
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out)

// Din .next lăsăm deoparte cache-ul și fișierele de dezvoltare: sunt mari și nu folosesc pe server.
const skipInNext = new Set(['cache', 'dev', 'types', 'trace', 'diagnostics'])
cpSync(join(root, '.next'), join(out, '.next'), {
  recursive: true,
  filter: (src) => {
    const first = relative(join(root, '.next'), src).split(sep)[0]
    return !skipInNext.has(first)
  },
})

cpSync(join(root, 'public'), join(out, 'public'), { recursive: true })

// .env.production are doar valori publice. Cheile secrete se pun în cPanel, la variabilele aplicației.
for (const file of ['package.json', 'package-lock.json', 'next.config.mjs', 'server.cjs', '.env.production']) {
  cpSync(join(root, file), join(out, file))
}

console.log('Gata: folderul dist/ e pregătit. Arhivează-i conținutul și urcă-l în folderul aplicației din cPanel.')
