import Image from 'next/image'
import { about } from '@/content/about'
import type { Dictionary } from '@/content/dictionary'
import { site } from '@/content/site'
import type { Locale } from '@/lib/i18n'
import { NoBreak } from '@/components/ui/accent'
import { Reveal } from '@/components/ui/motion'
import { BlurText } from '@/components/ui/react-bits'
import { SectionHeading } from '@/components/ui/section-heading'

type Props = { locale: Locale; dict: Dictionary }

export function About({ locale, dict }: Props) {
  const a = dict.about
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} id="about-title" />

        {/* Fotografia și textul sunt centrate vertical una față de alta, fără gol sub poză. */}
        <div className="mt-10 grid grid-cols-12 items-center gap-x-6 gap-y-10 md:mt-14">
          <Reveal className="col-span-12 w-full max-w-[20rem] md:col-span-5 md:max-w-none lg:col-span-4">
            <Portrait label={a.portrait} alt={`${site.displayName}, ${site.role[locale]}`} />
          </Reveal>

          <div className="col-span-12 md:col-span-7 lg:col-start-6">
            <Reveal className="flex flex-col gap-5">
              {about.intro[locale].map((p, i) =>
                i === 0 ? (
                  <BlurText key={i} text={p} className="t-h3 text-paper" />
                ) : (
                  <p key={i} className="t-lead text-mist">
                    <NoBreak text={p} />
                  </p>
                ),
              )}
            </Reveal>

            <Reveal className="mt-10 flex flex-col gap-6 border-t border-line pt-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="t-label text-faint">{a.tools}</h3>
                <dl className="mt-4 grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2.5">
                  {about.tools.map((group) => (
                    <div key={group.label.en} className="contents">
                      <dt className="t-label text-faint">{group.label[locale]}</dt>
                      <dd className="font-mono text-[0.8125rem] text-mist">{group.items.join(' · ')}</dd>
                    </div>
                  ))}
                </dl>
              </div>
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
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 320px"
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
