import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Dictionary } from '@/content/dictionary'
import { getAdjacent } from '@/content/projects'
import type { Project, Shot as ShotType } from '@/content/types'
import { type Locale, paths } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Reveal, RevealGroup, RevealItem, SplitLines } from '@/components/ui/motion'
import { Poster } from '@/components/ui/poster'
import { Shot } from '@/components/ui/shot'
import { FadeIn } from '@/components/home/fade-in'
import { LivePreview } from './live-preview'
import { CoverReveal, Parallax } from './parallax'

type Props = { project: Project; locale: Locale; dict: Dictionary }

export function CaseStudy({ project: p, locale, dict }: Props) {
  const t = dict.caseStudy
  const cs = p.caseStudy
  const { prev, next } = getAdjacent(p.slug)
  const stage = {
    background: `radial-gradient(55% 45% at 85% 105%, color-mix(in oklab, ${p.accent} 40%, transparent), transparent 70%), radial-gradient(45% 40% at 8% 95%, rgb(255 106 61 / 0.12), transparent 70%), radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, ${p.accent} 26%, #05070d), color-mix(in oklab, ${p.accent} 6%, #05070d) 70%)`,
  }

  return (
    <article>
      {/* Deschiderea */}
      <header className="pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="shell">
          <FadeIn>
            <Link href={paths.section(locale, 'work')} className="hit inline-flex items-center gap-2 t-label text-mist transition-colors hover:text-paper">
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              {t.back}
            </Link>
          </FadeIn>
          <FadeIn delay={0.05} className="mt-10 t-label text-ember">
            {p.kindLabel[locale]}
          </FadeIn>
          <SplitLines as="h1" trigger="mount" delay={0.1} lines={[p.name[locale]]} className="mt-4 t-display" />
          <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-14">
            <FadeIn delay={0.35} className="col-span-12 lg:col-span-6">
              <p className="t-lead text-mist">{p.summary[locale]}</p>
            </FadeIn>
            <FadeIn delay={0.45} className="col-span-12 lg:col-span-5 lg:col-start-8">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 text-[0.9375rem]">
                <Meta label={t.year}>{p.year}</Meta>
                <Meta label={t.category}>{p.category[locale]}</Meta>
                <Meta label={t.services}>{p.services[locale].join(', ')}</Meta>
                <Meta label={t.status}>{p.kindLabel[locale]}</Meta>
              </dl>
            </FadeIn>
          </div>
        </div>
      </header>

      {p.preview ? (
        <LivePreview project={p} preview={p.preview} locale={locale} t={t.preview} stage={stage} />
      ) : (
      <div className="shell">
        <CoverReveal className="relative overflow-hidden">
          {p.cover ? (
            <div style={stage} className="relative flex justify-center px-[6%] pt-[6%] md:px-[10%]">
              <Parallax amount={4} className={p.cover.frame === 'phone' ? 'w-[46%] sm:w-[34%] md:w-[26%]' : 'w-full'}>
                <Shot
                  shot={p.cover}
                  locale={locale}
                  eager
                  url={p.name[locale]}
                  sizes={p.cover.frame === 'phone' ? '(min-width: 768px) 26vw, (min-width: 640px) 34vw, 46vw' : '(min-width: 1024px) 80vw, 95vw'}
                  className="translate-y-[2%]"
                />
              </Parallax>
            </div>
          ) : (
            p.poster && (
              <div style={stage} className="px-[6%] py-[6%] md:px-[10%]">
                <Parallax amount={3}>
                  <Poster id={p.poster} locale={locale} className="shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]" />
                </Parallax>
              </div>
            )
          )}
        </CoverReveal>
      </div>
      )}

      {/* Conținutul, pe o grilă editorială: eticheta în stânga, textul în dreapta. */}
      <div className="shell mt-24 flex flex-col gap-20 md:mt-36 md:gap-28">
        <Block index="01" label={t.context}>
          <p className="t-h3 text-paper">{cs.context[locale]}</p>
        </Block>

        <Block index="02" label={t.challenge}>
          <p className="t-lead text-mist">{cs.challenge[locale]}</p>
        </Block>

        <Block index="03" label={t.objectives}>
          <NumberedList items={cs.objectives[locale]} />
        </Block>

        <Block index="04" label={t.role}>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {cs.role[locale].map((r) => (
              <li key={r} className="flex gap-3 border-b border-line py-4">
                <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-ember" />
                {r}
              </li>
            ))}
          </ul>
        </Block>

        <Block index="05" label={t.direction}>
          <p className="t-lead text-mist">{cs.direction[locale]}</p>
        </Block>
      </div>

      <Gallery shots={cs.gallery.slice(0, 2)} locale={locale} stage={stage} />

      <div className="shell mt-24 flex flex-col gap-20 md:mt-36 md:gap-28">
        <Block index="06" label={t.process}>
          <RevealGroup as="ol" className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {cs.process.map((step, i) => (
              <RevealItem as="li" key={i} className="flex flex-col gap-3 bg-ink p-6 md:p-8">
                <span className="t-label text-ember">0{i + 1}</span>
                <h3 className="font-medium">{step.title[locale]}</h3>
                <p className="text-[0.9375rem] text-mist">{step.body[locale]}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Block>

        <Block index="07" label={t.decisions}>
          <div className="flex flex-col">
            {cs.decisions.map((d, i) => (
              <Reveal key={i} className="grid grid-cols-12 gap-x-6 gap-y-3 border-t border-line py-8 last:border-b">
                <h3 className="col-span-12 t-h3 md:col-span-5">{d.title[locale]}</h3>
                <p className="col-span-12 text-mist md:col-span-7">{d.body[locale]}</p>
              </Reveal>
            ))}
          </div>
        </Block>
      </div>

      <Gallery shots={cs.gallery.slice(2)} locale={locale} stage={stage} />

      <div className="shell mt-24 flex flex-col gap-20 md:mt-36 md:gap-28">
        <Block index="08" label={t.stack}>
          <ul className="flex flex-wrap gap-2">
            {cs.stack.map((s) => (
              <li key={s} className="border border-line-strong px-3 py-1.5 font-mono text-[0.8125rem] text-mist">
                {s}
              </li>
            ))}
          </ul>
        </Block>

        <Block index="09" label={t.outcomes}>
          <ul className="flex flex-col">
            {cs.outcomes[locale].map((o) => (
              <li key={o} className="border-b border-line py-5 font-display text-[1.5rem] leading-snug md:text-[1.875rem]">
                {o}
              </li>
            ))}
          </ul>
          {cs.outcomesNote && <p className="mt-6 text-sm text-faint">{cs.outcomesNote[locale]}</p>}
          <div className="mt-10">
            {p.links.live ? (
              <Button
                href={p.links.live}
                // Demo-urile au alt root layout: navigarea reîncarcă pagina, deci prefetch-ul ar aduce doar fonturi nefolosite.
                prefetch={false}
                variant={p.links.live.startsWith('/') ? 'primary' : 'glass'}
                {...(p.links.live.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {t.live}
              </Button>
            ) : (
              <p className="t-label text-faint">{t.noLive}</p>
            )}
          </div>
        </Block>
      </div>

      {/* Discută un proiect asemănător */}
      <section aria-labelledby="case-cta" className="shell mt-28 md:mt-40">
        <Reveal className="flex flex-col items-start gap-8 border-t border-line pt-14 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="case-cta" className="t-h2">
              {t.ctaTitle}
            </h2>
            <p className="mt-4 max-w-md text-mist">{t.ctaBody}</p>
          </div>
          <Button href={paths.section(locale, 'contact')}>{t.cta}</Button>
        </Reveal>
      </section>

      {/* Proiectul anterior / următor */}
      <nav aria-label={`${t.prev} / ${t.next}`} className="shell mb-24 mt-20 md:mb-36">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
          <AdjacentLink project={prev} locale={locale} label={t.prev} dir="prev" />
          <AdjacentLink project={next} locale={locale} label={t.next} dir="next" />
        </ul>
      </nav>
    </article>
  )
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="t-label text-faint">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  )
}

function Block({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-12 gap-x-6 gap-y-6">
      <Reveal className="col-span-12 lg:col-span-3">
        <h2 className="flex gap-3 t-label text-faint">
          <span className="text-ember">{index}</span>
          {label}
        </h2>
      </Reveal>
      <Reveal className="col-span-12 lg:col-span-8 lg:col-start-5" delay={0.05}>
        {children}
      </Reveal>
    </section>
  )
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, i) => (
        <li key={item} className="grid grid-cols-[3rem_1fr] border-b border-line py-4 first:border-t">
          <span className="t-label pt-1 text-ember">{String(i + 1).padStart(2, '0')}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

/** Galeria: browserele pe toată lățimea, telefoanele câte două, fotografiile mari. */
function Gallery({ shots, locale, stage }: { shots: ShotType[]; locale: Locale; stage: React.CSSProperties }) {
  if (!shots.length) return null
  const phones = shots.filter((s) => s.frame === 'phone')
  const wide = shots.filter((s) => s.frame !== 'phone')
  return (
    <div className="shell mt-24 flex flex-col gap-6 md:mt-36 md:gap-8">
      {wide.map((s) => (
        <Reveal key={s.src}>
          <figure>
            {s.frame === 'none' ? (
              <Parallax amount={5} className="overflow-hidden">
                <Shot shot={s} locale={locale} sizes="(min-width: 1440px) 1330px, 95vw" imageClassName="scale-110" />
              </Parallax>
            ) : (
              <div style={stage} className="px-[5%] py-[5%] md:px-[8%]">
                <Shot shot={s} locale={locale} sizes="(min-width: 1024px) 80vw, 95vw" />
              </div>
            )}
            {s.caption && <figcaption className="mt-4 t-label text-faint">{s.caption[locale]}</figcaption>}
          </figure>
        </Reveal>
      ))}
      {phones.length > 0 && (
        <div className={`grid gap-6 md:gap-8 ${phones.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${phones.length > 2 ? 'lg:grid-cols-4' : ''}`}>
          {phones.map((s, i) => (
            <Reveal key={s.src} delay={i * 0.06}>
              <figure>
                <div style={stage} className="flex justify-center px-[14%] py-[12%]">
                  <Shot shot={s} locale={locale} sizes="(min-width: 1024px) 22vw, 40vw" className="w-full max-w-[22rem]" />
                </div>
                {s.caption && <figcaption className="mt-4 t-label text-faint">{s.caption[locale]}</figcaption>}
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

function AdjacentLink({ project, locale, label, dir }: { project: Project; locale: Locale; label: string; dir: 'prev' | 'next' }) {
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight
  return (
    <li className="bg-ink">
      <Link
        href={paths.project(locale, project.slug)}
        className={`group flex h-full flex-col gap-6 p-8 transition-colors hover:bg-ink-2 md:p-12 ${dir === 'next' ? 'md:items-end md:text-right' : ''}`}
      >
        <span className="flex items-center gap-2 t-label text-faint">
          {dir === 'prev' && <Icon aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-x-1" />}
          {label}
          {dir === 'next' && <Icon aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-1" />}
        </span>
        <span className="t-h2 transition-colors group-hover:text-ember">{project.name[locale]}</span>
        <span className="text-sm text-mist">{project.category[locale]}</span>
      </Link>
    </li>
  )
}
