export const locales = ['ro', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ro'

/** Un text în ambele limbi. */
export type Localized<T = string> = Record<Locale, T>

/**
 * Codurile fiecărei limbi. O limbă nouă = o intrare în `locales` și una aici
 * (plus textele din content/, pe care TypeScript le cere singur).
 */
export const localeConfig = {
  ro: { hreflang: 'ro', og: 'ro_RO' },
  en: { hreflang: 'en', og: 'en_US' },
} satisfies Record<Locale, { hreflang: string; og: string }>

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Limba următoare din listă (cu două limbi: cealaltă). */
export function otherLocale(locale: Locale): Locale {
  return locales[(locales.indexOf(locale) + 1) % locales.length]
}

/** Codul Open Graph al limbii curente și ale celorlalte. */
export function ogLocales(locale: Locale) {
  return {
    locale: localeConfig[locale].og,
    alternateLocale: locales.filter((l) => l !== locale).map((l) => localeConfig[l].og),
  }
}

/** Alternativele hreflang ale unei pagini: { ro: …, en: … }. `href` primește limba și întoarce adresa. */
export function languageAlternates(href: (l: Locale) => string): Record<string, string> {
  return Object.fromEntries(locales.map((l) => [localeConfig[l].hreflang, href(l)]))
}

/**
 * Alege limba după antetul Accept-Language. Intrările cu q=0 sunt refuzate explicit de browser,
 * iar un q lipsă sau invalid contează ca 1. La egalitate câștigă ordinea din antet.
 */
export function negotiateLocale(header: string | null | undefined): Locale {
  const accepted = (header ?? '')
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.split(';').map((s) => s.trim())
      const raw = params.find((p) => p.toLowerCase().startsWith('q='))
      const parsed = raw ? Number.parseFloat(raw.slice(2)) : 1
      const q = Number.isNaN(parsed) ? 1 : Math.min(Math.max(parsed, 0), 1)
      return { lang: tag.toLowerCase().split('-')[0], q }
    })
    .filter((x): x is { lang: Locale; q: number } => x.q > 0 && isLocale(x.lang))
    .sort((a, b) => b.q - a.q)
  return accepted[0]?.lang ?? defaultLocale
}

/** Segmentele de URL traduse. Slug-urile proiectelor sunt aceleași în ambele limbi. */
const segments = {
  work: { ro: 'proiecte', en: 'work' },
  privacy: { ro: 'confidentialitate', en: 'privacy' },
  terms: { ro: 'termeni', en: 'terms' },
} satisfies Record<string, Localized>

export const paths = {
  home: (l: Locale) => `/${l}`,
  section: (l: Locale, id: string) => `/${l}#${id}`,
  project: (l: Locale, slug: string) => `/${l}/${segments.work[l]}/${slug}`,
  privacy: (l: Locale) => `/${l}/${segments.privacy[l]}`,
  terms: (l: Locale) => `/${l}/${segments.terms[l]}`,
}

export const workSegment = segments.work
export const privacySegment = segments.privacy

const isSegment = (segment: Localized, value: string) => locales.some((l) => segment[l] === value)

/** Adresa aceleiași pagini în cealaltă limbă (pentru comutatorul de limbă). */
export function translatePath(pathname: string, target: Locale): string {
  const [, , section, slug] = pathname.split('/')
  if (!section) return paths.home(target)
  if (isSegment(segments.work, section)) {
    return slug ? paths.project(target, slug) : paths.home(target)
  }
  if (isSegment(segments.privacy, section)) return paths.privacy(target)
  if (isSegment(segments.terms, section)) return paths.terms(target)
  return paths.home(target)
}
