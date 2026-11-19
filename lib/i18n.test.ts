import { describe, expect, it } from 'vitest'
import {
  defaultLocale,
  isLocale,
  languageAlternates,
  locales,
  negotiateLocale,
  ogLocales,
  otherLocale,
  paths,
  translatePath,
} from '@/lib/i18n'

describe('isLocale', () => {
  it('acceptă doar limbile din listă', () => {
    for (const l of locales) expect(isLocale(l)).toBe(true)
    for (const v of ['', 'fr', 'RO', 'en-US', 'ro ']) expect(isLocale(v)).toBe(false)
  })
})

describe('otherLocale', () => {
  it('întoarce cealaltă limbă', () => {
    expect(otherLocale('ro')).toBe('en')
    expect(otherLocale('en')).toBe('ro')
  })

  it('nu întoarce niciodată limba primită', () => {
    for (const l of locales) expect(otherLocale(l)).not.toBe(l)
  })
})

describe('paths', () => {
  it('construiește adresele în ambele limbi', () => {
    expect(paths.home('ro')).toBe('/ro')
    expect(paths.home('en')).toBe('/en')
    expect(paths.section('ro', 'contact')).toBe('/ro#contact')
    expect(paths.section('en', 'contact')).toBe('/en#contact')
    expect(paths.project('ro', 'truck-wash')).toBe('/ro/proiecte/truck-wash')
    expect(paths.project('en', 'truck-wash')).toBe('/en/work/truck-wash')
    expect(paths.privacy('ro')).toBe('/ro/confidentialitate')
    expect(paths.privacy('en')).toBe('/en/privacy')
    expect(paths.terms('ro')).toBe('/ro/termeni')
    expect(paths.terms('en')).toBe('/en/terms')
  })
})

describe('translatePath', () => {
  it('traduce prima pagină', () => {
    expect(translatePath('/ro', 'en')).toBe('/en')
    expect(translatePath('/en', 'ro')).toBe('/ro')
    expect(translatePath('/ro/', 'en')).toBe('/en')
  })

  it('traduce pagina unui proiect în ambele direcții', () => {
    expect(translatePath('/ro/proiecte/barbershop', 'en')).toBe('/en/work/barbershop')
    expect(translatePath('/en/work/barbershop', 'ro')).toBe('/ro/proiecte/barbershop')
  })

  it('traduce pagina de confidențialitate în ambele direcții', () => {
    expect(translatePath('/ro/confidentialitate', 'en')).toBe('/en/privacy')
    expect(translatePath('/en/privacy', 'ro')).toBe('/ro/confidentialitate')
  })

  it('traduce pagina de termeni în ambele direcții', () => {
    expect(translatePath('/ro/termeni', 'en')).toBe('/en/terms')
    expect(translatePath('/en/terms', 'ro')).toBe('/ro/termeni')
  })

  it('păstrează pagina când ținta e aceeași limbă', () => {
    expect(translatePath('/en/work/codesprint', 'en')).toBe('/en/work/codesprint')
  })

  it('trimite la prima pagină pentru secțiunea de proiecte fără slug', () => {
    expect(translatePath('/ro/proiecte', 'en')).toBe('/en')
  })

  it('trimite la prima pagină pentru o secțiune necunoscută', () => {
    expect(translatePath('/ro/altceva', 'en')).toBe('/en')
    expect(translatePath('/en/unknown/deep/path', 'ro')).toBe('/ro')
  })
})

describe('ogLocales și languageAlternates', () => {
  it('dă codul Open Graph al limbii și al celorlalte', () => {
    expect(ogLocales('ro')).toEqual({ locale: 'ro_RO', alternateLocale: ['en_US'] })
    expect(ogLocales('en')).toEqual({ locale: 'en_US', alternateLocale: ['ro_RO'] })
  })

  it('are câte o alternativă hreflang pentru fiecare limbă', () => {
    expect(languageAlternates(paths.home)).toEqual({ ro: '/ro', en: '/en' })
    expect(Object.keys(languageAlternates(paths.privacy))).toHaveLength(locales.length)
  })
})

describe('negotiateLocale', () => {
  it('folosește limba implicită fără antet sau fără limbi cunoscute', () => {
    expect(negotiateLocale(null)).toBe(defaultLocale)
    expect(negotiateLocale('')).toBe(defaultLocale)
    expect(negotiateLocale('fr-FR,de;q=0.8,*;q=0.5')).toBe(defaultLocale)
  })

  it('alege după q, nu după ordine', () => {
    expect(negotiateLocale('ro;q=0.5,en;q=0.9')).toBe('en')
    expect(negotiateLocale('en-US,en;q=0.9,ro;q=0.8')).toBe('en')
    expect(negotiateLocale('fr,ro-RO;q=0.7, en; q=0.3')).toBe('ro')
  })

  it('la egalitate păstrează ordinea din antet', () => {
    expect(negotiateLocale('en,ro')).toBe('en')
    expect(negotiateLocale('ro,en')).toBe('ro')
  })

  it('tratează q=0 ca refuz', () => {
    expect(negotiateLocale('en;q=0,ro;q=0.1')).toBe('ro')
    expect(negotiateLocale('en;q=0')).toBe(defaultLocale)
    expect(negotiateLocale('ro;q=0,en;q=0.2')).toBe('en')
  })

  it('nu se încurcă la valori q invalide', () => {
    expect(negotiateLocale('en;q=abc,ro;q=0.9')).toBe('en')
    expect(negotiateLocale('ro;q=0.4,en;q=')).toBe('en')
    expect(negotiateLocale('en;q=0.2,ro;q=5')).toBe('ro')
  })
})
