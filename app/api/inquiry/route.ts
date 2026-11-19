import { NextResponse } from 'next/server'
import { getDictionary } from '@/content/dictionary'
import { fieldOrder, honeypotField, type InquiryResponse, isEmail, parse, validate } from '@/lib/inquiry'
import { sendInquiryMail, smtpConfigFromEnv } from '@/lib/mail'

/**
 * POST /api/inquiry: validează cererea și o trimite pe e-mail prin serverul SMTP al găzduirii.
 * Răspunde { ok: true } doar dacă serverul de e-mail a acceptat mesajul.
 * Fără SMTP_HOST / SMTP_USER / SMTP_PASS / INQUIRY_FROM_EMAIL / INQUIRY_TO_EMAIL → 503 'not_configured'.
 */

// Limită aproximativă: 5 cereri / 10 minute / IP. Memoria ține cât procesul Node și nu e comună între instanțe.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
// Cererile fără IP cunoscut împart o singură găleată. Cu limita per-IP, vizitatorii reali s-ar bloca
// între ei; fără nicio limită, ar fi o portiță. Deci: găleată separată, cu limită mai largă.
const UNKNOWN_IP = 'unknown'
const MAX_UNKNOWN_PER_WINDOW = 30
const MAX_KEYS = 5000

/**
 * Câte proxy-uri de încredere stau în fața aplicației. Fiecare adaugă la dreapta în x-forwarded-for
 * adresa de la care a primit cererea, deci doar ultimele TRUSTED_PROXIES valori sunt scrise de
 * infrastructură; tot ce e mai la stânga vine de la client și poate fi inventat.
 * 1 = doar reverse proxy-ul găzduirii (Hosterion). Cu un CDN în față (ex. Cloudflare) → 2.
 * 0 = fără proxy: antetul nu e de încredere și toate cererile merg în găleata comună.
 * cf-connecting-ip nu e folosit intenționat: fără Cloudflare în față, clientul îl poate trimite singur.
 */
const TRUSTED_PROXIES = 1

function clientIp(request: Request) {
  if (TRUSTED_PROXIES < 1) return UNKNOWN_IP
  const hops = (request.headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
  // Valoarea adăugată de proxy-ul cel mai din exterior în care avem încredere = adresa reală a clientului.
  return hops.at(-TRUSTED_PROXIES)?.slice(0, 64) || UNKNOWN_IP
}

const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  // Reintroducem cheia la coadă: ordinea din Map devine „cel mai vechi activ primul”.
  hits.delete(ip)
  hits.set(ip, recent)
  if (hits.size > MAX_KEYS) evict(now)
  return recent.length > (ip === UNKNOWN_IP ? MAX_UNKNOWN_PER_WINDOW : MAX_PER_WINDOW)
}

/** Scoate întâi intrările expirate, apoi pe cele mai vechi, până la 90% din plafon. Contoarele active rămân. */
function evict(now: number) {
  for (const [key, times] of hits) {
    if (now - (times.at(-1) ?? 0) >= WINDOW_MS) hits.delete(key)
  }
  const target = Math.floor(MAX_KEYS * 0.9)
  for (const key of hits.keys()) {
    if (hits.size <= target) break
    hits.delete(key)
  }
}

const json = (body: InquiryResponse, status: number) => NextResponse.json(body, { status })

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

// Jurnal: doar context tehnic, niciodată mesajul sau datele de contact ale vizitatorului.
const LOG = '[inquiry]'
const clip = (s: string | null, max = 200) => (s === null ? null : s.slice(0, max))

export async function POST(request: Request) {
  // Acceptăm doar cereri trimise de pe propriul site.
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host || !URL.canParse(origin) || new URL(origin).host !== host) {
    console.error(`${LOG} origin respins`, { origin: clip(origin), host: clip(host) })
    return json({ ok: false, code: 'forbidden' }, 403)
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ ok: false, code: 'forbidden' }, 415)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, code: 'invalid', fields: [] }, 400)
  }

  // Numărăm abia acum: cererile fără JSON valid nu consumă din limita unui vizitator real.
  if (rateLimited(clientIp(request))) return json({ ok: false, code: 'rate_limited' }, 429)

  const data = parse(body)
  if (!data) return json({ ok: false, code: 'invalid', fields: [] }, 400)

  // Robot: răspundem ca la succes, dar nu trimitem nimic.
  if (data[honeypotField]) {
    console.warn(`${LOG} câmpul-capcană a fost completat; cererea a fost ignorată`)
    return json({ ok: true }, 200)
  }

  const errors = validate(data)
  const fields = fieldOrder.filter((f) => errors[f])
  const { project } = data
  // `project === ''` e deja prins de validate(); aici doar îngustează tipul.
  if (fields.length || project === '') return json({ ok: false, code: 'invalid', fields }, 422)

  const smtp = smtpConfigFromEnv()
  if ('missing' in smtp) {
    console.error(`${LOG} trimiterea nu e configurată; lipsesc variabilele de mediu`, smtp.missing)
    return json({ ok: false, code: 'not_configured' }, 503)
  }

  // parse() a curățat deja spațiile de la capete și CR/LF din câmpurile de un rând.
  const labels = getDictionary('ro').form
  const rows: [string, string][] = [
    ['Nume', data.name],
    ['Contact', data.contact],
    ['Tip proiect', labels.projects[project]],
    ['Buget', data.budget ? labels.budgets[data.budget] : '—'],
    ['Limba site-ului', data.locale.toUpperCase()],
  ]
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${data.message}`
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#666">${escape(k)}</td><td>${escape(v)}</td></tr>`)
    .join('')}</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escape(data.message)}</p>`

  try {
    await sendInquiryMail(smtp.config, {
      subject: `Cerere de ofertă: ${data.name}`,
      text,
      html,
      // Răspunsul merge direct la vizitator doar când a lăsat un e-mail; pentru telefon, îl suni.
      ...(isEmail(data.contact) && { replyTo: data.contact }),
    })
  } catch (error) {
    // Doar detaliile tehnice ale serverului SMTP; mesajul și datele vizitatorului nu ajung în jurnal.
    const { code, responseCode, command, response } = (error ?? {}) as {
      code?: string
      responseCode?: number
      command?: string
      response?: string
    }
    console.error(`${LOG} serverul de e-mail a refuzat mesajul sau nu a răspuns`, {
      code,
      responseCode,
      command,
      response: clip(response ?? null),
    })
    return json({ ok: false, code: 'send_failed' }, 502)
  }

  return json({ ok: true }, 200)
}
