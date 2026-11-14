'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getDictionary } from '@/content/dictionary'
import { defaultLocale, isLocale, paths } from '@/lib/i18n'
import { buttonClass } from '@/components/ui/button'

/** 404 în interiorul unei limbi, de exemplu un proiect care nu există. */
export default function NotFound() {
  const params = useParams<{ locale?: string }>()
  const locale = params.locale && isLocale(params.locale) ? params.locale : defaultLocale
  const t = getDictionary(locale).notFound
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pb-24 pt-32">
      <p className="t-label text-ember">404</p>
      <h1 className="mt-6 t-h1">{t.title}</h1>
      <p className="mt-6 max-w-md t-lead text-mist">{t.body}</p>
      <Link href={paths.home(locale)} className={buttonClass('glass', 'mt-10 self-start')}>
        <ArrowLeft aria-hidden="true" className="size-4" />
        <span>{t.home}</span>
      </Link>
    </section>
  )
}
