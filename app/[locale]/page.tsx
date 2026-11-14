import { notFound } from 'next/navigation'
import { getDictionary } from '@/content/dictionary'
import { process } from '@/content/process'
import { isLocale } from '@/lib/i18n'
import { About } from '@/components/home/about'
import { Contact, FaqSection } from '@/components/home/contact'
import { Hero } from '@/components/home/hero'
import { Manifesto } from '@/components/home/manifesto'
import { Marquee } from '@/components/home/marquee'
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
      <Manifesto {...dict.manifesto} />
      <Services locale={locale} dict={dict} />
      <Marquee {...dict.marquee} />
      <About locale={locale} dict={dict} />
      <Process locale={locale} dict={dict.process} steps={process} />
      <Trust locale={locale} dict={dict} />
      <FaqSection locale={locale} dict={dict} />
      <Contact locale={locale} dict={dict} />
    </>
  )
}
