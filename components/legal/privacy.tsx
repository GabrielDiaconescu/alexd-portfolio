import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/content/dictionary'
import { privacySections } from '@/content/privacy'
import { site } from '@/content/site'
import { type Locale, isLocale, paths } from '@/lib/i18n'

type Params = Promise<{ locale: string }>

/** Logica comună pentru /ro/confidentialitate și /en/privacy. */
export function privacyRoute(owner: Locale) {
  return {
    generateMetadata: async ({ params }: { params: Params }): Promise<Metadata> => {
      const { locale } = await params
      if (locale !== owner) return {}
      return {
        title: getDictionary(owner).privacy.title,
        alternates: { canonical: paths.privacy(owner), languages: { ro: paths.privacy('ro'), en: paths.privacy('en') } },
      }
    },
    Page: async function PrivacyPage({ params }: { params: Params }) {
      const { locale } = await params
      if (!isLocale(locale) || locale !== owner) notFound()
      const dict = getDictionary(locale)
      const updated = site.privacyUpdated[locale]
      return (
        <article className="shell pb-24 pt-32 md:pb-36 md:pt-44">
          <div className="grid grid-cols-12 gap-x-6">
            <header className="col-span-12 lg:col-span-8">
              <h1 className="t-h1">{dict.privacy.title}</h1>
              {updated && (
                <p className="mt-6 t-label text-faint">
                  {dict.privacy.updated}: {updated}
                </p>
              )}
            </header>
            <div className="col-span-12 mt-16 flex flex-col gap-12 lg:col-span-7 lg:col-start-5">
              {privacySections.map((s, i) => (
                <section key={i} className="border-t border-line pt-6">
                  <h2 className="flex gap-3 font-medium">
                    <span className="t-label pt-1 text-ember">{String(i + 1).padStart(2, '0')}</span>
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
