/**
 * Validarea cererii de ofertă, folosită identic în browser și pe server.
 * Fără biblioteci: câmpurile sunt puține și regulile simple.
 */
export const projectOptions = ['website', 'redesign', 'custom', 'special', 'unsure'] as const
export const budgetOptions = ['lt1500', '1500-3000', '3000-6000', 'gt6000', 'unsure'] as const

export type Inquiry = {
  name: string
  /** E-mail sau telefon: vizitatorul alege cum vrea să fie contactat. */
  contact: string
  project: (typeof projectOptions)[number] | ''
  /** Opțional. */
  budget: (typeof budgetOptions)[number] | ''
  message: string
  consent: boolean
  locale: 'ro' | 'en'
  /** Câmp-capcană: oamenii nu îl văd, roboții îl completează. */
  website: string
}

export type Field = 'name' | 'contact' | 'project' | 'budget' | 'message' | 'consent'
export type Errors = Partial<Record<Field, true>>

export const limits = { name: [2, 100], message: [20, 4000] } as const

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Telefon: cifre, cu +, spații, puncte, cratime sau paranteze; între 7 și 15 cifre. */
const PHONE = /^\+?[\d\s().-]+$/

export const isEmail = (value: string) => EMAIL.test(value.trim())

export function isContact(value: string) {
  const v = value.trim()
  if (v.length > 254) return false
  if (isEmail(v)) return true
  const digits = v.replace(/\D/g, '').length
  return PHONE.test(v) && digits >= 7 && digits <= 15
}

export function validate(data: Inquiry): Errors {
  const errors: Errors = {}
  const name = data.name.trim()
  if (name.length < limits.name[0] || name.length > limits.name[1]) errors.name = true
  if (!isContact(data.contact)) errors.contact = true
  if (!projectOptions.includes(data.project as never)) errors.project = true
  if (data.budget !== '' && !budgetOptions.includes(data.budget as never)) errors.budget = true
  const message = data.message.trim()
  if (message.length < limits.message[0] || message.length > limits.message[1]) errors.message = true
  if (data.consent !== true) errors.consent = true
  return errors
}

/** Normalizează un corp JSON necunoscut într-o cerere (pe server). */
export function parse(body: unknown): Inquiry | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  const str = (k: string, max: number) => (typeof b[k] === 'string' ? (b[k] as string).slice(0, max) : '')
  return {
    name: str('name', 200),
    contact: str('contact', 300),
    project: str('project', 40) as Inquiry['project'],
    budget: str('budget', 40) as Inquiry['budget'],
    message: str('message', 5000),
    consent: b.consent === true,
    locale: b.locale === 'en' ? 'en' : 'ro',
    website: str('website', 200),
  }
}

export type InquiryResponse =
  | { ok: true }
  | { ok: false; code: 'invalid'; fields: Field[] }
  | { ok: false; code: 'not_configured' | 'send_failed' | 'rate_limited' | 'forbidden' }
