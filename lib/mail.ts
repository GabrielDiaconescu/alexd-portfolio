import nodemailer from 'nodemailer'

/**
 * Trimiterea cererilor din formular prin serverul de e-mail al găzduirii (SMTP, cu autentificare).
 * Doar pe server: citește parola din mediu și deschide conexiuni de rețea.
 */

export type SmtpConfig = {
  host: string
  port: number
  user: string
  pass: string
  /** Expeditorul, de exemplu `Site Alex D. <formular@alexd.ro>`. */
  from: string
  /** Unde ajung cererile. */
  to: string
}

export type InquiryMail = {
  subject: string
  text: string
  html: string
  /** Adresa vizitatorului, doar când a lăsat un e-mail valid. */
  replyTo?: string
}

const DEFAULT_PORT = 465
// Cât așteptăm la fiecare pas (conectare, salut, transfer), ca o cerere să nu atârne la nesfârșit.
const TIMEOUT_MS = 10_000

type Env = Record<string, string | undefined>

/** Configurarea din variabilele de mediu sau lista celor lipsă/invalide, în ordinea din documentație. */
export function smtpConfigFromEnv(env: Env = process.env): { config: SmtpConfig } | { missing: string[] } {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'INQUIRY_FROM_EMAIL', 'INQUIRY_TO_EMAIL'] as const
  const missing: string[] = required.filter((name) => !env[name]?.trim())

  const rawPort = env.SMTP_PORT?.trim()
  const port = rawPort ? Number(rawPort) : DEFAULT_PORT
  if (!Number.isInteger(port) || port < 1 || port > 65535) missing.unshift('SMTP_PORT')

  if (missing.length) return { missing }
  return {
    config: {
      host: env.SMTP_HOST!.trim(),
      port,
      user: env.SMTP_USER!.trim(),
      // Parola rămâne exact cum a fost scrisă: spațiile pot face parte din ea.
      pass: env.SMTP_PASS!,
      from: env.INQUIRY_FROM_EMAIL!.trim(),
      to: env.INQUIRY_TO_EMAIL!.trim(),
    },
  }
}

/** Trimite cererea. Aruncă eroarea nodemailer (cu `code`, `responseCode`) dacă serverul refuză. */
export async function sendInquiryMail(config: SmtpConfig, mail: InquiryMail): Promise<void> {
  const implicitTls = config.port === 465
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // 465: TLS de la început. Altfel (587): STARTTLS obligatoriu, deci parola nu circulă niciodată în clar.
    secure: implicitTls,
    requireTLS: !implicitTls,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  })

  await transport.sendMail({
    from: config.from,
    to: config.to,
    ...(mail.replyTo && { replyTo: mail.replyTo }),
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  })
}
