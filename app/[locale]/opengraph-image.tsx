import { notFound } from 'next/navigation'
import { getDictionary } from '@/content/dictionary'
import { site } from '@/content/site'
import { isLocale, locales } from '@/lib/i18n'
import { ogSize, renderOg } from '@/lib/og'

export const size = ogSize
export const contentType = 'image/png'
export const alt = 'Alexandru Diaconescu · Web Developer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Limbă necunoscută: 404, nu imaginea în română.
  if (!isLocale(locale)) notFound()
  const title = getDictionary(locale).hero.title.join(' ').replace(/\*/g, '')
  return renderOg({ eyebrow: site.role[locale], title, footer: site.email[locale] })
}
