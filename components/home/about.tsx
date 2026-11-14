import Image from 'next/image'
import { about } from '@/content/about'
import type { Dictionary } from '@/content/dictionary'
import { site } from '@/content/site'
import { type Locale, paths } from '@/lib/i18n'
import { NoBreak } from '@/components/ui/accent'
import { Button } from '@/components/ui/button'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/motion'
import { SectionHeading } from '@/components/ui/section-heading'

type Props = { locale: Locale; dict: Dictionary }

export function About({ locale, dict }: Props) {
  const a = dict.about
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 md:py-36">
      <div className="shell">
        <SectionHeading index="03" eyebrow={a.eyebrow} title={a.title} id="about-title" />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 md:mt-24">
          <Reveal className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-1">
            <Portrait label={a.portrait} alt={`${site.displayName}, ${site.role[locale]}`} />
          </Reveal>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Reveal className="flex flex-col gap-6">
              {about.intro[locale].map((p, i) => (
                <p key={i} className={i === 0 ? 't-h3 text-paper' : 't-lead text-mist'}>
                  <NoBreak text={p} />
                </p>
              ))}
            </Reveal>

            <h3 className="mt-16 t-label text-faint">{a.approach}</h3>
            <RevealGroup as="ol" className="mt-4 border-t border-line">
              {about.approach.map((item, i) => (
                <RevealItem as="li" key={i} className="grid grid-cols-12 gap-x-6 gap-y-2 border-b border-line py-6">
                  <span className="col-span-2 t-label text-ember sm:col-span-1">0{i + 1}</span>
                  <h4 className="col-span-10 font-medium sm:col-span-4">{item.title[locale]}</h4>
                  <p className="col-span-10 col-start-3 text-[0.9375rem] text-mist sm:col-span-7 sm:col-start-auto"><NoBreak text={item.body[locale]} /></p>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="t-label text-faint">{a.tools}</h3>
                <p className="mt-3 font-mono text-[0.8125rem] text-mist">{about.tools.join(' · ')}</p>
              </div>
              <Button href={paths.section(locale, 'contact')} variant="glass" className="shrink-0">
                {a.cta}
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Fotografia reală când există; altfel un placeholder clar marcat, nu o poză de stoc. */
function Portrait({ label, alt }: { label: string; alt: string }) {
  const corner = 'absolute size-4 border-ember'
  return (
    <figure className="relative aspect-[4/5] w-full">
      {about.portrait ? (
        <Image
          src={about.portrait.src}
          width={about.portrait.width}
          height={about.portrait.height}
          alt={alt}
          sizes="(min-width: 1024px) 30vw, 80vw"
          className="size-full object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center bg-ink-2">
          <span aria-hidden="true" className="font-display text-[clamp(6rem,14vw,11rem)] italic leading-none text-line-strong">
            AD
          </span>
          <figcaption className="absolute bottom-5 left-5 t-label text-faint">{label}</figcaption>
        </div>
      )}
      <span aria-hidden="true" className={`${corner} -left-2 -top-2 border-l border-t`} />
      <span aria-hidden="true" className={`${corner} -right-2 -top-2 border-r border-t`} />
      <span aria-hidden="true" className={`${corner} -bottom-2 -left-2 border-b border-l`} />
      <span aria-hidden="true" className={`${corner} -bottom-2 -right-2 border-b border-r`} />
    </figure>
  )
}
