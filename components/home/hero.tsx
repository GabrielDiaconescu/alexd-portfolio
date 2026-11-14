import type { Dictionary } from '@/content/dictionary'
import { projects } from '@/content/projects'
import { site } from '@/content/site'
import { type Locale, paths } from '@/lib/i18n'
import { NoBreak } from '@/components/ui/accent'
import { Button } from '@/components/ui/button'
import { SplitLines } from '@/components/ui/motion'
import { FadeIn } from './fade-in'
import { HeroExit } from './hero-exit'
import { HeroVisual } from './hero-visual'

type Props = { locale: Locale; dict: Dictionary }

export function Hero({ locale, dict }: Props) {
  const h = dict.hero
  return (
    <section id="intro" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col pb-8 pt-24 md:pt-28">
      <HeroExit className="shell flex flex-1 flex-col">
        <FadeIn delay={0} className="flex items-center justify-between gap-6 t-label text-faint">
          <span>
            {site.displayName} — {h.eyebrow}
          </span>
          <span className="hidden sm:inline">{site.disciplines.join(' · ')}</span>
        </FadeIn>

        <div className="mt-10 grid flex-1 grid-cols-12 items-center gap-x-6 gap-y-12 md:mt-14 lg:mt-6">
          <div data-hero-title className="relative z-10 col-span-12 lg:col-span-7">
            <SplitLines
              as="h1"
              id="hero-title"
              trigger="mount"
              delay={0.1}
              lines={h.title}
              className="font-display text-[clamp(2.75rem,6.4vw,7rem)] leading-[0.94] tracking-[-0.03em]"
            />
            <FadeIn delay={0.55} className="mt-8 max-w-[34rem] md:mt-10">
              <p className="t-lead text-mist">
                <NoBreak text={h.lead} />
              </p>
            </FadeIn>
            <FadeIn delay={0.7} className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
              <Button href={paths.section(locale, 'contact')}>{h.primary}</Button>
              <Button href={paths.section(locale, 'work')} variant="matte" arrow={false}>
                {h.secondary}
              </Button>
            </FadeIn>
          </div>

          <div className="col-span-12 mx-auto mb-10 w-full max-w-[36rem] sm:max-w-[40rem] lg:col-span-5 lg:mb-0 lg:max-w-none lg:w-[calc(100%+6vw)] lg:translate-x-[2vw]">
            <div data-hero-visual>
              <HeroVisual projects={projects} locale={locale} label={h.visualLabel} />
            </div>
          </div>
        </div>

        <FadeIn delay={0.9} className="mt-12 flex items-end justify-between gap-6 border-t border-line pt-5 md:mt-8">
          <a href="#work" className="group hit flex items-center gap-3 t-label text-faint transition-colors hover:text-paper">
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="animate-scroll-cue absolute inset-0 bg-ember" />
            </span>
            {h.scroll}
          </a>
          <p className="flex items-center gap-2.5 t-label text-mist">
            <span aria-hidden="true" className="animate-pulse-dot size-1.5 rounded-full bg-ember" />
            {h.status}
          </p>
        </FadeIn>
      </HeroExit>
    </section>
  )
}
