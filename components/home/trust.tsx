import Link from 'next/link'
import type { Dictionary } from '@/content/dictionary'
import { getProject } from '@/content/projects'
import { site } from '@/content/site'
import { standards, testimonials } from '@/content/trust'
import { type Locale, paths } from '@/lib/i18n'
import { ArrowSwap } from '@/components/ui/button'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/motion'
import { SectionHeading } from '@/components/ui/section-heading'

type Props = { locale: Locale; dict: Dictionary }

export function Trust({ locale, dict }: Props) {
  const t = dict.trust
  const published = testimonials.filter((q) => q.consent)

  return (
    <section id="trust" aria-labelledby="trust-title" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} id="trust-title" />

        {published.length > 0 && (
          <div className="mt-10 md:mt-14">
            <h3 className="t-label text-faint">{t.testimonials}</h3>
            <RevealGroup className="mt-6 grid gap-px bg-line md:grid-cols-2">
              {published.map((q, i) => {
                const project = q.project ? getProject(q.project) : undefined
                return (
                  <RevealItem as="article" key={i} className="flex flex-col justify-between gap-8 bg-ink p-6 md:p-10">
                    <blockquote className="font-display text-[1.75rem] leading-[1.2] md:text-[2.125rem]">
                      {locale === 'ro' ? `„${q.quote.ro}”` : `“${q.quote.en}”`}
                    </blockquote>
                    <footer className="text-sm">
                      <p className="font-medium">{q.name}</p>
                      <p className="text-mist">
                        {q.role[locale]}
                        {q.company && `, ${q.company}`}
                      </p>
                      {project && (
                        <Link href={paths.project(locale, project.slug)} className="mt-3 inline-block text-ember underline-offset-4 hover:underline">
                          {project.name[locale]}
                        </Link>
                      )}
                    </footer>
                  </RevealItem>
                )
              })}
            </RevealGroup>
          </div>
        )}

        <RevealGroup className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 md:mt-14" gap={0.06}>
          {standards.map((s, i) => (
            <RevealItem key={i} className="flex flex-col gap-3 bg-ink p-6 md:p-8">
              <span className="t-label text-ember">0{i + 1}</span>
              <h3 className="t-h3">{s.title[locale]}</h3>
              <p className="text-mist">{s.body[locale]}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <p className="t-label text-faint">{t.profiles}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex min-h-11 items-center gap-2 border-b border-line-strong text-paper transition-colors hover:border-ember"
                >
                  {s.label}
                  <ArrowSwap className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
