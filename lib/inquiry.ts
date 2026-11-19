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
  extra_note: string
}

/**
 * Numele câmpului-capcană, același în formular și pe server.
 * Ales să nu semene cu nimic din ce completează automat browserele (nume, e-mail, adresă, site).
 */
export const honeypotField = 'extra_note' satisfies keyof Inquiry

export type Field = 'name' | 'contact' | 'project' | 'budget' | 'message' | 'consent'
export type Errors = Partial<Record<Field, true>>

/** Câmpurile în ordinea din formular. */
export const fieldOrder: readonly Field[] = ['name', 'contact', 'project', 'budget', 'message', 'consent']

/** Lungimi [minim, maxim], după trim. Singura sursă pentru validate(), parse() și maxLength din formular. */
export const limits = { name: [2, 100], contact: [1, 254], message: [20, 4000] } as const

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Telefon: cifre, cu +, spații, puncte, cratime sau paranteze; între 7 și 15 cifre. */
const PHONE = /^\+?[\d\s().-]+$/

/** Gardă de tip: `value` este una dintre valorile din `options`. */
export function isOneOf<const T extends readonly unknown[]>(options: T, value: unknown): value is T[number] {
  return options.includes(value)
}

export const isEmail = (value: string) => EMAIL.test(value.trim())

export function isContact(value: string) {
  const v = value.trim()
  if (v.length < limits.contact[0] || v.length > limits.contact[1]) return false
  if (isEmail(v)) return true
  const digits = v.replace(/\D/g, '').length
  return PHONE.test(v) && digits >= 7 && digits <= 15
}

export function validate(data: Inquiry): Errors {
  const errors: Errors = {}
  const name = data.name.trim()
  if (name.length < limits.name[0] || name.length > limits.name[1]) errors.name = true
  if (!isContact(data.contact)) errors.contact = true
  if (!isOneOf(projectOptions, data.project)) errors.project = true
  if (data.budget !== '' && !isOneOf(budgetOptions, data.budget)) errors.budget = true
  const message = data.message.trim()
  if (message.length < limits.message[0] || message.length > limits.message[1]) errors.message = true
  if (data.consent !== true) errors.consent = true
  return errors
}

/**
 * Normalizează un corp JSON necunoscut într-o cerere (pe server).
 * Textele sunt curățate de spații la capete și tăiate la maxim + 1 caractere:
 * memoria rămâne limitată, iar validate() respinge în continuare ce depășește limita.
 * O opțiune necunoscută devine '': proiectul pică la validate(), bugetul (opțional) e tratat ca necompletat.
 */
export function parse(body: unknown): Inquiry | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const b: Record<string, unknown> = { ...body }
  const str = (k: string, max: number, singleLine = false) => {
    const v = b[k]
    if (typeof v !== 'string') return ''
    // Câmpurile de un rând nu au voie să conțină CR/LF (ajung în subiectul și antetele e-mailului).
    return (singleLine ? v.replace(/[\r\n]+/g, ' ') : v).trim().slice(0, max + 1)
  }
  return {
    name: str('name', limits.name[1], true),
    contact: str('contact', limits.contact[1], true),
    project: isOneOf(projectOptions, b.project) ? b.project : '',
    budget: isOneOf(budgetOptions, b.budget) ? b.budget : '',
    message: str('message', limits.message[1]),
    consent: b.consent === true,
    locale: b.locale === 'en' ? 'en' : 'ro',
    [honeypotField]: str(honeypotField, 200, true),
  }
}

export type InquiryResponse =
  | { ok: true }
  | { ok: false; code: 'invalid'; fields: Field[] }
  | { ok: false; code: 'not_configured' | 'send_failed' | 'rate_limited' | 'forbidden' }
