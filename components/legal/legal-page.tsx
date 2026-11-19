import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary, type Dictionary } from '@/content/dictionary'
import { site } from '@/content/site'
import { type Locale, type Localized, isLocale, languageAlternates, ogLocales } from '@/lib/i18n'

type Params = Promise<{ locale: string }>

export type LegalSection = { title: Localized; body: Localized<string[]> }

type LegalConfig = {
  /** Titlul paginii, din dicționar. */
  title: (dict: Dictionary) => string
  description: Localized
  path: (l: Locale) => string
  sections: LegalSection[]
  /** Data ultimei actualizări, afișată sub titlu. Gol = nu apare. */
  updated: Localized
}

/**
 * Logica comună a paginilor legale (confidențialitate, termeni): metadate, verificarea limbii
 * și același aspect. Fiecare limbă are folderul ei de rută; `owner` e limba căreia îi aparține ruta.
 */
export function legalRoute(owner: Locale, config: LegalConfig) {
  return {
    generateMetadata: async ({ params }: { params: Params }): Promise<Metadata> => {
      const { locale } = await params
      if (locale !== owner) return {}
      const title = config.title(getDictionary(owner))
      const description = config.description[owner]
      return {
        title,
        description,
        alternates: { canonical: config.path(owner), languages: languageAlternates(config.path) },
        // Obiecte complete: openGraph și twitter de aici le înlocuiesc pe cele din layout.
        openGraph: {
          type: 'website',
          siteName: site.displayName,
          ...ogLocales(owner),
          title,
          description,
          url: config.path(owner),
        },
        twitter: { card: 'summary_large_image', title, description },
      }
    },
    Page: async function LegalPage({ params }: { params: Params }) {
      const { locale } = await params
      if (!isLocale(locale) || locale !== owner) notFound()
      const dict = getDictionary(locale)
      const updated = config.updated[locale]
      return (
        <article className="shell pb-24 pt-32 md:pb-36 md:pt-44">
          <div className="grid grid-cols-12 gap-x-6">
            <header className="col-span-12 lg:col-span-8">
              <h1 className="t-h1">{config.title(dict)}</h1>
              {updated && (
                <p className="mt-6 t-label text-faint">
                  {dict.privacy.updated}: {updated}
                </p>
              )}
            </header>
            <div className="col-span-12 mt-16 flex flex-col gap-12 lg:col-span-7 lg:col-start-5">
              {config.sections.map((s, i) => (
                <section key={i} className="border-t border-line pt-6">
                  <h2 className="flex gap-3 font-medium">
                    <span aria-hidden="true" className="t-label pt-1 text-ember">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.title[locale]}
                  </h2>
                  {s.body[locale].map((p, j) => (
                    <p key={j} className="mt-4 text-mist">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
              <section className="border-t border-line pt-6">
                <h2 className="font-medium">{dict.footer.contact}</h2>
                <p className="mt-4">
                  <a href={`mailto:${site.email[locale]}`} className="text-paper underline underline-offset-4 hover:text-ember">
                    {site.email[locale]}
                  </a>
                </p>
              </section>
            </div>
          </div>
        </article>
      )
    },
  }
}
