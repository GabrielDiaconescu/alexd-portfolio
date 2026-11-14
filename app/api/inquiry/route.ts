import { NextResponse } from 'next/server'
import { getDictionary } from '@/content/dictionary'
import { type InquiryResponse, isEmail, parse, validate } from '@/lib/inquiry'

/**
 * POST /api/inquiry: validează cererea și o trimite pe e-mail prin Resend.
 * Răspunde { ok: true } doar dacă Resend a confirmat trimiterea.
 * Fără RESEND_API_KEY / INQUIRY_FROM_EMAIL / INQUIRY_TO_EMAIL → 503 'not_configured'.
 */

// Limită aproximativă: 5 cereri / 10 minute / IP. Pe găzduiri serverless memoria nu e comună între instanțe.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

const json = (body: InquiryResponse, status: number) => NextResponse.json(body, { status })

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function POST(request: Request) {
  // Acceptăm doar cereri trimise de pe propriul site.
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (!origin || !host || !URL.canParse(origin) || new URL(origin).host !== host) {
    return json({ ok: false, code: 'forbidden' }, 403)
  }
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ ok: false, code: 'forbidden' }, 415)

  // Pe Cloudflare IP-ul real vine în cf-connecting-ip; x-forwarded-for rămâne pentru next start.
  const ip =
    request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) return json({ ok: false, code: 'rate_limited' }, 429)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, code: 'invalid', fields: [] }, 400)
  }
  const data = parse(body)
  if (!data) return json({ ok: false, code: 'invalid', fields: [] }, 400)

  // Robot: răspundem ca la succes, dar nu trimitem nimic.
  if (data.website) return json({ ok: true }, 200)

  const errors = validate(data)
  const fields = Object.keys(errors) as (keyof typeof errors)[]
  if (fields.length) return json({ ok: false, code: 'invalid', fields }, 422)

  const key = process.env.RESEND_API_KEY
  const from = process.env.INQUIRY_FROM_EMAIL
  const to = process.env.INQUIRY_TO_EMAIL
  if (!key || !from || !to) return json({ ok: false, code: 'not_configured' }, 503)

  const labels = getDictionary('ro').form
  const contact = data.contact.trim()
  const rows: [string, string][] = [
    ['Nume', data.name.trim()],
    ['Contact', contact],
    ['Tip proiect', labels.projects[data.project as keyof typeof labels.projects]],
    ['Buget', data.budget ? labels.budgets[data.budget] : '—'],
    ['Limba site-ului', data.locale.toUpperCase()],
  ]
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${data.message.trim()}`
  const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#666">${escape(k)}</td><td>${escape(v)}</td></tr>`)
    .join('')}</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escape(data.message.trim())}</p>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        // Răspunsul merge direct la vizitator doar când a lăsat un e-mail; pentru telefon, îl suni.
        ...(isEmail(contact) && { reply_to: contact }),
        subject: `Cerere de ofertă: ${data.name.trim()}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return json({ ok: false, code: 'send_failed' }, 502)
  } catch {
    return json({ ok: false, code: 'send_failed' }, 502)
  }

  return json({ ok: true }, 200)
}
