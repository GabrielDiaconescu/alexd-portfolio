import { notFound } from 'next/navigation'
import { getProject, projects } from '@/content/projects'
import type { Locale } from '@/lib/i18n'
import { renderOg } from '@/lib/og'

/** Imaginea Open Graph pentru un studiu de caz, comună celor două rute. */
export function caseOg(owner: Locale) {
  return {
    // Vezi comentariul din route.tsx: nu întoarcem liste goale pentru nicio limbă.
    // Și `locale`: imaginea OG e o rută proprie, fără layout-ul care dă limba, iar cu dynamicParams=false
    // perechile fără limbă nu se generau deloc (404 pe alexd.ro).
    generateStaticParams: async () => projects.map((p) => ({ locale: owner, slug: p.slug })),
    Image: async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
      const { locale, slug } = await params
      const p = getProject(slug)
      // La fel ca pagina: slug necunoscut sau limba greșită (ex. /en/proiecte/…) dau 404, nu imaginea altui proiect.
      if (!p || locale !== owner) notFound()
      return renderOg({ eyebrow: p.kindLabel[owner], title: p.name[owner], footer: p.category[owner], accent: p.accent })
    },
  }
}
