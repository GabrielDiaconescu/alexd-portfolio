export const locales = ['ro', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ro'

/** Un text în ambele limbi. */
export type Localized<T = string> = Record<Locale, T>

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ro' ? 'en' : 'ro'
}

/** Segmentele de URL traduse. Slug-urile proiectelor sunt aceleași în ambele limbi. */
const segments = {
  work: { ro: 'proiecte', en: 'work' },
  privacy: { ro: 'confidentialitate', en: 'privacy' },
} satisfies Record<string, Localized>

export const paths = {
  home: (l: Locale) => `/${l}`,
  section: (l: Locale, id: string) => `/${l}#${id}`,
  project: (l: Locale, slug: string) => `/${l}/${segments.work[l]}/${slug}`,
  privacy: (l: Locale) => `/${l}/${segments.privacy[l]}`,
}

export const workSegment = segments.work
export const privacySegment = segments.privacy

/** Adresa aceleiași pagini în cealaltă limbă (pentru comutatorul de limbă). */
export function translatePath(pathname: string, target: Locale): string {
  const [, , section, slug] = pathname.split('/')
  if (!section) return paths.home(target)
  if (section === segments.work.ro || section === segments.work.en) {
    return slug ? paths.project(target, slug) : paths.home(target)
  }
  if (section === segments.privacy.ro || section === segments.privacy.en) return paths.privacy(target)
  return paths.home(target)
}
