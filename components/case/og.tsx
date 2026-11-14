import { getProject, projects } from '@/content/projects'
import type { Locale } from '@/lib/i18n'
import { renderOg } from '@/lib/og'

/** Imaginea Open Graph pentru un studiu de caz, comună celor două rute. */
export function caseOg(owner: Locale) {
  return {
    // Vezi comentariul din route.tsx: nu întoarcem liste goale pentru nicio limbă.
    generateStaticParams: async () => projects.map((p) => ({ slug: p.slug })),
    Image: async function Image({ params }: { params: Promise<{ slug: string }> }) {
      const { slug } = await params
      const p = getProject(slug) ?? projects[0]
      return renderOg({ eyebrow: p.kindLabel[owner], title: p.name[owner], footer: p.category[owner], accent: p.accent })
    },
  }
}
