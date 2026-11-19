import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content/dictionary'
import { getProject, projects } from '@/content/projects'
import type { Project } from '@/content/types'
import { site } from '@/content/site'
import { type Locale, isLocale, languageAlternates, ogLocales, paths } from '@/lib/i18n'
import { CaseStudy } from './case-study'

/**
 * Logica comună pentru /ro/proiecte/[slug] și /en/work/[slug].
 * Fiecare rută acceptă doar limba ei; restul combinațiilor dau 404.
 */
type Params = Promise<{ locale: string; slug: string }>

function resolve(owner: Locale, locale: string, slug: string) {
  if (!isLocale(locale) || locale !== owner) return null
  const project = getProject(slug)
  return project ? { locale, project } : null
}

export function caseRoute(owner: Locale) {
  return {
    // Întoarcem slug-urile pentru fiecare limbă părinte: dacă una primește o listă goală, Next 16.4
    // renunță la toate paginile rutei. Combinațiile greșite (ex. /en/proiecte/…) dau 404 din Page.
    generateStaticParams: async () => projects.map((p) => ({ slug: p.slug })),

    generateMetadata: async ({ params }: { params: Params }): Promise<Metadata> => {
      const { locale, slug } = await params
      const found = resolve(owner, locale, slug)
      if (!found) return {}
      const { project } = found
      const title = `${project.name[owner]} · ${project.category[owner]}`
      const description = snippet(project.summary[owner])
      return {
        title,
        description,
        alternates: {
          canonical: paths.project(owner, slug),
          languages: languageAlternates((l) => paths.project(l, slug)),
        },
        // openGraph și twitter nu se moștenesc pe câmpuri: obiectul de aici îl înlocuiește pe cel din layout, deci e complet.
        openGraph: {
          type: 'article',
          siteName: site.displayName,
          ...ogLocales(owner),
          title,
          description,
          url: paths.project(owner, slug),
        },
        twitter: { card: 'summary_large_image', title, description },
      }
    },

    Page: async function CasePage({ params }: { params: Params }) {
      const { locale, slug } = await params
      const found = resolve(owner, locale, slug)
      if (!found) notFound()
      const dict = getDictionary(found.locale)
      return (
        <>
          <CaseStudy project={found.project} locale={found.locale} dict={dict} />
          <script
            type="application/ld+json"
            // Conținut static, generat din content/projects.ts.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd(found.project, found.locale)).replace(/</g, '\\u003c') }}
          />
        </>
      )
    },
  }
}

/** Descrierea pentru Google (~160 de caractere): prima frază întreagă, sau textul tăiat la un cuvânt. */
function snippet(text: string, max = 160) {
  if (text.length <= max) return text
  const sentence = text.match(/^.+?[.!?](?=\s|$)/)?.[0]
  if (sentence && sentence.length <= max) return sentence
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

/**
 * Proiectul ca CreativeWork, plus firul de navigare (Acasă › proiect) pentru rezultatele Google.
 * Nu există o pagină cu lista proiectelor, iar un URL cu fragment (/ro#work) ar fi citit tot ca prima pagină.
 */
function caseJsonLd(project: Project, locale: Locale) {
  const abs = (p: string) => new URL(p, site.url).toString()
  const url = abs(paths.project(locale, project.slug))
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: project.name[locale],
        description: project.summary[locale],
        url,
        inLanguage: locale,
        dateCreated: project.year,
        genre: project.category[locale],
        keywords: project.tags.join(', '),
        ...(project.cover && { image: abs(project.cover.src) }),
        creator: { '@id': `${abs('/')}#person` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: site.displayName, item: abs(paths.home(locale)) },
          { '@type': 'ListItem', position: 2, name: project.name[locale], item: url },
        ],
      },
    ],
  }
}
