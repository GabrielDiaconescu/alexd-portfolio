import { describe, expect, it } from 'vitest'
import {
  budgetOptions,
  honeypotField,
  type Inquiry,
  isContact,
  isOneOf,
  limits,
  parse,
  projectOptions,
  validate,
} from './inquiry'

const valid: Inquiry = {
  name: 'Ana Popescu',
  contact: 'ana@example.com',
  project: 'website',
  budget: '1500-3000',
  message: 'Am o firmă de transport și vreau un site de prezentare.',
  consent: true,
  locale: 'ro',
  [honeypotField]: '',
}

describe('isOneOf', () => {
  it('acceptă doar valorile din listă', () => {
    expect(isOneOf(projectOptions, 'website')).toBe(true)
    expect(isOneOf(projectOptions, 'nope')).toBe(false)
    expect(isOneOf(projectOptions, '')).toBe(false)
    expect(isOneOf(budgetOptions, 42)).toBe(false)
    expect(isOneOf(budgetOptions, null)).toBe(false)
  })
})

describe('validate', () => {
  it('nu găsește erori într-o cerere validă', () => {
    expect(validate(valid)).toEqual({})
  })

  it('acceptă un telefon în loc de e-mail și bugetul necompletat', () => {
    expect(validate({ ...valid, contact: '+40 721 234 567', budget: '' })).toEqual({})
  })

  it('acceptă fiecare opțiune de proiect și de buget', () => {
    for (const project of projectOptions) expect(validate({ ...valid, project })).toEqual({})
    for (const budget of budgetOptions) expect(validate({ ...valid, budget })).toEqual({})
  })

  it('respinge numele prea scurt sau gol', () => {
    expect(validate({ ...valid, name: 'A' })).toEqual({ name: true })
    expect(validate({ ...valid, name: '   ' })).toEqual({ name: true })
  })

  it('respinge contactul care nu e nici e-mail, nici telefon', () => {
    const bad = ['', 'ana', 'ana@example', 'ana @example.com', '12345', '1234567890123456', 'tel: 0721234567']
    for (const contact of bad) {
      expect(validate({ ...valid, contact }), contact).toEqual({ contact: true })
    }
  })

  it('respinge proiectul nealeas', () => {
    expect(validate({ ...valid, project: '' })).toEqual({ project: true })
  })

  it('respinge mesajul prea scurt', () => {
    expect(validate({ ...valid, message: 'Salut' })).toEqual({ message: true })
  })

  it('respinge lipsa acordului', () => {
    expect(validate({ ...valid, consent: false })).toEqual({ consent: true })
  })

  it('aplică limitele exact, după trim', () => {
    const [nameMin, nameMax] = limits.name
    const [messageMin, messageMax] = limits.message
    expect(validate({ ...valid, name: 'a'.repeat(nameMin) })).toEqual({})
    expect(validate({ ...valid, name: ` ${'a'.repeat(nameMax)} ` })).toEqual({})
    expect(validate({ ...valid, name: 'a'.repeat(nameMax + 1) })).toEqual({ name: true })
    expect(validate({ ...valid, message: 'a'.repeat(messageMin - 1) })).toEqual({ message: true })
    expect(validate({ ...valid, message: 'a'.repeat(messageMin) })).toEqual({})
    expect(validate({ ...valid, message: 'a'.repeat(messageMax) })).toEqual({})
    expect(validate({ ...valid, message: 'a'.repeat(messageMax + 1) })).toEqual({ message: true })
  })

  it('respinge contactul peste lungimea maximă', () => {
    const max = limits.contact[1]
    const domain = '@example.com'
    expect(isContact('a'.repeat(max - domain.length) + domain)).toBe(true)
    expect(isContact('a'.repeat(max - domain.length + 1) + domain)).toBe(false)
  })

  it('raportează toate câmpurile greșite deodată', () => {
    const empty: Inquiry = { ...valid, name: '', contact: '', project: '', message: '', consent: false }
    expect(validate(empty)).toEqual({ name: true, contact: true, project: true, message: true, consent: true })
  })
})

describe('parse', () => {
  it('întoarce null pentru corpuri care nu sunt obiecte', () => {
    for (const body of [null, undefined, '', 'text', 0, 42, true, false, [], [valid]]) {
      expect(parse(body), JSON.stringify(body)).toBeNull()
    }
  })

  it('păstrează o cerere validă neschimbată', () => {
    const data = parse({ ...valid })
    expect(data).toEqual(valid)
    expect(data && validate(data)).toEqual({})
  })

  it('completează câmpurile lipsă sau de alt tip cu valori goale', () => {
    const empty = {
      name: '',
      contact: '',
      project: '',
      budget: '',
      message: '',
      consent: false,
      locale: 'ro',
      [honeypotField]: '',
    }
    expect(parse({})).toEqual(empty)
    expect(
      parse({ name: 1, contact: ['a@b.ro'], project: {}, budget: 5, message: null, consent: 'true', locale: 7 }),
    ).toEqual(empty)
  })

  it('acceptă doar consent === true și doar limbile cunoscute', () => {
    expect(parse({ consent: 1 })?.consent).toBe(false)
    expect(parse({ consent: true })?.consent).toBe(true)
    expect(parse({ locale: 'en' })?.locale).toBe('en')
    expect(parse({ locale: 'de' })?.locale).toBe('ro')
  })

  it('golește opțiunile necunoscute', () => {
    const data = parse({ ...valid, project: 'spaceship', budget: 'a-lot' })
    expect(data?.project).toBe('')
    expect(data?.budget).toBe('')
    // Proiectul e obligatoriu, deci pică; bugetul e opțional, deci e tratat ca necompletat.
    expect(data && validate(data)).toEqual({ project: true })
  })

  it('nu ia opțiuni din proprietățile listei', () => {
    expect(parse({ ...valid, project: 'length' })?.project).toBe('')
    expect(parse({ ...valid, budget: 'constructor' })?.budget).toBe('')
  })

  it('scoate CR/LF din câmpurile de un rând', () => {
    const data = parse({
      ...valid,
      name: 'Ana\r\nBcc: x@evil.test',
      contact: 'ana@example.com\n',
      [honeypotField]: 'a\rb',
    })
    expect(data?.name).toBe('Ana Bcc: x@evil.test')
    expect(data?.contact).toBe('ana@example.com')
    expect(data?.[honeypotField]).toBe('a b')
    expect(`${data?.name}${data?.contact}`).not.toMatch(/[\r\n]/)
  })

  it('un CR/LF în mijlocul contactului îl face invalid, nu îl lipește', () => {
    const data = parse({ ...valid, contact: 'ana@example.com\r\nBcc: x@evil.test' })
    expect(data && validate(data)).toEqual({ contact: true })
  })

  it('păstrează rândurile noi din mesaj', () => {
    const message = 'Primul rând al mesajului.\r\nAl doilea rând.'
    expect(parse({ ...valid, message })?.message).toBe(message)
  })

  it('taie spațiile de la capete', () => {
    const data = parse({
      ...valid,
      name: '  Ana Popescu  ',
      contact: ' ana@example.com ',
      message: `\n${valid.message}\n`,
    })
    expect(data).toEqual(valid)
  })

  it('taie textele prea lungi, dar le lasă peste limită, ca validate() să le respingă', () => {
    const data = parse({
      ...valid,
      name: 'a'.repeat(10_000),
      contact: `${'a'.repeat(10_000)}@example.com`,
      message: 'a'.repeat(100_000),
    })
    expect(data?.name).toHaveLength(limits.name[1] + 1)
    expect(data?.contact).toHaveLength(limits.contact[1] + 1)
    expect(data?.message).toHaveLength(limits.message[1] + 1)
    expect(data && validate(data)).toEqual({ name: true, contact: true, message: true })
  })

  it('nu taie textele aflate exact la limită', () => {
    const name = 'a'.repeat(limits.name[1])
    const message = 'a'.repeat(limits.message[1])
    const data = parse({ ...valid, name, message })
    expect(data?.name).toBe(name)
    expect(data?.message).toBe(message)
    expect(data && validate(data)).toEqual({})
  })

  it('păstrează câmpul-capcană completat de roboți', () => {
    const data = parse({ ...valid, [honeypotField]: 'https://spam.test' })
    expect(data?.[honeypotField]).toBe('https://spam.test')
  })
})
