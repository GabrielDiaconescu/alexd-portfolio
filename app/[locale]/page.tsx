import { notFound } from 'next/navigation'
import { getDictionary } from '@/content/dictionary'
import { faq } from '@/content/faq'
import { process } from '@/content/process'
import { isLocale } from '@/lib/i18n'
import { About } from '@/components/home/about'
import { Contact, FaqSection } from '@/components/home/contact'
import { Hero } from '@/components/home/hero'
import { Process } from '@/components/home/process'
import { Services } from '@/components/home/services'
import { Trust } from '@/components/home/trust'
import { Work } from '@/components/home/work'

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Work locale={locale} dict={dict} />
      <Services locale={locale} dict={dict} />
      <Process locale={locale} dict={dict.process} steps={process} />
      <About locale={locale} dict={dict} />
      <Trust locale={locale} dict={dict} />
      <FaqSection locale={locale} dict={dict} />
      <Contact locale={locale} dict={dict} />
      {/* Întrebările frecvente ca date structurate (aceleași texte ca pe pagină). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: locale,
            mainEntity: faq.map((f) => ({
              '@type': 'Question',
              name: f.q[locale],
              acceptedAnswer: { '@type': 'Answer', text: f.a[locale] },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}
