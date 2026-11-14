import type { Dictionary } from '@/content/dictionary'
import { faq } from '@/content/faq'
import { site } from '@/content/site'
import { type Locale, paths } from '@/lib/i18n'
import { NoBreak } from '@/components/ui/accent'
import { Button } from '@/components/ui/button'
import { Reveal, SplitLines } from '@/components/ui/motion'
import { FaqList } from './faq'
import { InquiryForm } from './inquiry-form'

type Props = { locale: Locale; dict: Dictionary }

export function FaqSection({ locale, dict }: Props) {
  const f = dict.faq
  const ask = <AskCard locale={locale} dict={dict} />
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line py-24 md:py-36">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-4 t-label text-faint">
              <span>(06)</span>
              <span>{f.eyebrow}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </div>
            <SplitLines lines={[f.title]} id="faq-title" className="mt-8 t-h2 text-balance" />
            <Reveal>
              <p className="mt-6 max-w-[30rem] text-mist"><NoBreak text={f.intro} /></p>
              <p className="mt-6 t-label text-faint">
                <span className="text-paper">{faq.length}</span> {f.count}
              </p>
            </Reveal>
            <Reveal className="mt-12 hidden lg:block">{ask}</Reveal>
          </div>
        </div>
        <Reveal className="col-span-12 lg:col-span-8">
          <FaqList items={faq} locale={locale} t={f} />
        </Reveal>
        <Reveal className="col-span-12 lg:hidden">{ask}</Reveal>
      </div>
    </section>
  )
}

/** Pentru întrebările care nu sunt în listă: drum direct spre contact. */
function AskCard({ locale, dict }: Props) {
  const f = dict.faq
  return (
    <div className="relative overflow-hidden border border-line-strong bg-ink-2/70 p-6 md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/3 -top-1/2 size-[24rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_61/0.16),transparent)]"
      />
      <div className="relative">
        <p className="t-h3">{f.askTitle}</p>
        <p className="mt-3 text-mist"><NoBreak text={f.askBody} /></p>
        <Button href={paths.section(locale, 'contact')} className="mt-6">
          {f.ask}
        </Button>
        <a href={`mailto:${site.email[locale]}`} className="mt-5 block w-fit py-1 font-mono text-[0.8125rem] text-mist transition-colors hover:text-ember">
          {site.email[locale]}
        </a>
        <a href={site.phone.href} className="block w-fit py-1 font-mono text-[0.8125rem] text-mist transition-colors hover:text-ember">
          {site.phone.display[locale]}
        </a>
      </div>
    </div>
  )
}

export function Contact({ locale, dict }: Props) {
  const c = dict.contact
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-24 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] top-0 size-[60rem] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_61/0.09),transparent)]"
      />
      <div className="shell relative">
        <div className="flex items-center gap-4 t-label text-faint">
          <span>(07)</span>
          <span>{c.eyebrow}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>
        <SplitLines lines={c.title} id="contact-title" className="mt-10 t-display" />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-16 md:mt-24">
          <Reveal className="col-span-12 lg:col-span-4">
            <p className="t-lead text-mist">
              <NoBreak text={c.intro} />
            </p>
            <ol className="mt-10 border-t border-line">
              {c.steps.map((step, i) => (
                <li key={i} className="flex gap-4 border-b border-line py-4">
                  <span className="t-label pt-1 text-ember">0{i + 1}</span>
                  <span>
                    <NoBreak text={step} />
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-12 t-label text-faint">{c.direct}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {site.emails.map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`} className="inline-block break-all py-1 font-display text-[1.75rem] leading-tight transition-colors hover:text-ember md:text-[2rem]">
                    {e}
                  </a>
                </li>
              ))}
              <li>
                <a href={site.phone.href} className="inline-block py-1 font-display text-[1.75rem] leading-tight transition-colors hover:text-ember md:text-[2rem]">
                  {site.phone.display[locale]}
                </a>
              </li>
            </ul>

            <p className="mt-10 t-label text-faint">{c.elsewhere}</p>
            <ul className="mt-3 flex gap-6">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-mist underline-offset-4 transition-colors hover:text-paper hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-7 lg:col-start-6" delay={0.1}>
            <InquiryForm locale={locale} t={dict.form} email={site.email[locale]} privacyHref={paths.privacy(locale)} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
