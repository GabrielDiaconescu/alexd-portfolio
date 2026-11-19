import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { site } from '@/content/site'
import { type Locale, defaultLocale, languageAlternates, locales, paths } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, site.url).toString()
  // Câte o intrare pentru fiecare limbă, cu toate variantele ca alternative.
  const page = (path: (l: Locale) => string, lastModified: string, priority: number) =>
    locales.map((l) => ({
      url: url(path(l)),
      lastModified,
      priority,
      alternates: {
        languages: { ...languageAlternates((alt) => url(path(alt))), 'x-default': url(path(defaultLocale)) },
      },
    }))

  // Prima pagină listează proiectele, deci preia cea mai nouă dată (datele ISO se compară ca text).
  const homeUpdated = [site.updated, ...projects.map((p) => p.updated)].sort().at(-1)!

  return [
    ...page(paths.home, homeUpdated, 1),
    ...projects.flatMap((p) => page((l) => paths.project(l, p.slug), p.updated, 0.8)),
    ...page(paths.privacy, site.updated, 0.2),
    ...page(paths.terms, '2026-11-16', 0.2),
  ]
}
