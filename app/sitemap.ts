import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { site } from '@/content/site'
import { paths } from '@/lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, site.url).toString()
  const lastModified = new Date()
  const pair = (ro: string, en: string, priority: number) =>
    [ro, en].map((p) => ({
      url: url(p),
      lastModified,
      priority,
      alternates: { languages: { ro: url(ro), en: url(en) } },
    }))

  return [
    ...pair(paths.home('ro'), paths.home('en'), 1),
    ...projects.flatMap((p) => pair(paths.project('ro', p.slug), paths.project('en', p.slug), 0.8)),
    ...pair(paths.privacy('ro'), paths.privacy('en'), 0.2),
  ]
}
