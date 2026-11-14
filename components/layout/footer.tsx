import Link from 'next/link'
import { ArrowUp } from 'lucide-react'
import type { Dictionary } from '@/content/dictionary'
import { site } from '@/content/site'
import { type Locale, paths } from '@/lib/i18n'
import { Wordmark } from './wordmark'

type Props = { locale: Locale; dict: Dictionary }

export function Footer({ locale, dict }: Props) {
  const year = new Date().getFullYear()
  const nav = [
    { label: dict.nav.work, href: paths.section(locale, 'work') },
    { label: dict.nav.services, href: paths.section(locale, 'services') },
    { label: dict.nav.about, href: paths.section(locale, 'about') },
    { label: dict.nav.contact, href: paths.section(locale, 'contact') },
  ]
  const company = site.company
  const companyLine = [
    company.legalName,
    company.cui && `CUI ${company.cui}`,
    company.registry && `Nr. Reg. Com. ${company.registry}`,
    company.address,
    site.vat[locale],
  ].filter(Boolean)

  return (
    <footer className="relative overflow-hidden border-t border-line pt-16 md:pt-24">
      <div className="shell grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <p className="max-w-sm text-mist">{dict.footer.tagline}</p>
          <p className="mt-6 t-label text-faint">{site.disciplines.join(' · ')}</p>
        </div>

        <FooterCol title={dict.footer.nav} className="md:col-span-2 md:col-start-7">
          {nav.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hit text-mist transition-colors hover:text-paper">
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title={dict.footer.contact} className="md:col-span-2">
          {site.emails.map((e) => (
            <li key={e}>
              <a href={`mailto:${e}`} className="hit break-all text-mist transition-colors hover:text-paper">
                {e}
              </a>
            </li>
          ))}
          <li>
            <a href={site.phone.href} className="hit whitespace-nowrap text-mist transition-colors hover:text-paper">
              {site.phone.display[locale]}
            </a>
          </li>
          {site.socials.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="hit text-mist transition-colors hover:text-paper">
                {s.label}
              </a>
            </li>
          ))}
        </FooterCol>

        <FooterCol title={dict.footer.legal} className="md:col-span-2">
          <li>
            <Link href={paths.privacy(locale)} className="hit text-mist transition-colors hover:text-paper">
              {dict.footer.privacy}
            </Link>
          </li>
        </FooterCol>
      </div>

      <div className="shell mt-20 md:mt-28">
        <Wordmark />
      </div>

      <div className="shell mt-8 flex flex-col gap-4 border-t border-line py-8 text-sm text-faint md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p>
            © {year} {site.fullName}. {dict.footer.rights}
          </p>
          {companyLine.length > 0 && <p>{companyLine.join(' · ')}</p>}
        </div>
        <a href="#top" className="hit inline-flex items-center gap-2 transition-colors hover:text-paper">
          {dict.footer.top}
          <ArrowUp aria-hidden="true" className="size-4" />
        </a>
      </div>
    </footer>
  )
}

function FooterCol({ title, className = '', children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <h2 className="t-label text-faint">{title}</h2>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  )
}
