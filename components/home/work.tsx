import Link from 'next/link'
import type { Dictionary } from '@/content/dictionary'
import { projects } from '@/content/projects'
import type { Project } from '@/content/types'
import { type Locale, paths } from '@/lib/i18n'
import { NoBreak } from '@/components/ui/accent'
import { ArrowSwap } from '@/components/ui/button'
import { Reveal } from '@/components/ui/motion'
import { SectionHeading } from '@/components/ui/section-heading'
import { type MediaLayout, ProjectMedia } from './project-media'

type Props = { locale: Locale; dict: Dictionary }

// Compozițiile se aleg după materialul proiectului: browser, telefoane sau poster tipografic.
const layoutFor = (p: Project): MediaLayout => {
  if (!p.cover) return 'poster'
  if (p.cover.frame === 'phone') return 'phones'
  return 'split'
}

export function Work({ locale, dict }: Props) {
  return (
    <section id="work" aria-labelledby="work-title" className="py-16 md:py-24">
      <div className="shell">
        <SectionHeading eyebrow={dict.work.eyebrow} title={dict.work.title} id="work-title">
          <p className="t-lead text-mist">
            <NoBreak text={dict.work.intro} />
          </p>
        </SectionHeading>

        <ol className="mt-10 flex flex-col gap-16 md:mt-14 md:gap-24">
          {projects.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} locale={locale} dict={dict} layout={layoutFor(p)} />
          ))}
        </ol>
      </div>
    </section>
  )
}

const linkClass =
  'group/btn inline-flex min-h-12 items-center gap-3 border-b border-line-strong pb-1 text-paper transition-colors hover:border-ember'

type RowProps = { project: Project; index: number; locale: Locale; dict: Dictionary; layout: MediaLayout }

function ProjectRow({ project: p, index, locale, dict, layout }: RowProps) {
  const href = paths.project(locale, p.slug)
  const num = String(index + 1).padStart(2, '0')
  const media = (
    <ProjectMedia
      project={p}
      locale={locale}
      layout={layout}
      href={href}
      cursor={dict.work.cursor}
      eager={index === 0}
    />
  )

  const meta = (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 t-label text-faint">
      <span className="text-mist">{p.kindLabel[locale]}</span>
      <span aria-hidden="true">/</span>
      <span>{p.category[locale]}</span>
    </p>
  )

  const title = (
    <h3 className="font-display text-[clamp(2.25rem,3.6vw,3.5rem)] leading-[1] tracking-[-0.015em]">
      <Link href={href} className="group/title inline-flex items-baseline gap-4">
        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover/title:bg-[length:100%_1px]">
          {p.name[locale]}
        </span>
      </Link>
    </h3>
  )

  const details = (
    <>
      <p className="text-mist">
        <NoBreak text={p.summary[locale]} />
      </p>
      <dl className="mt-6 flex flex-col gap-5 border-t border-line pt-5 text-sm">
        <div>
          <dt className="t-label text-faint">{dict.work.problem}</dt>
          <dd className="mt-2 text-mist">
            <NoBreak text={p.problem[locale]} />
          </dd>
        </div>
        <div>
          <dt className="t-label text-faint">{dict.caseStudy.stack}</dt>
          <dd className="mt-2 font-mono text-[0.8125rem] text-mist">{p.tags.join(' · ')}</dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        {p.links.live && (
          <a href={p.links.live} className={linkClass}>
            {dict.work.demo}
            <span className="sr-only">: {p.name[locale]}</span>
            <ArrowSwap />
          </a>
        )}
        <Link href={href} className={linkClass}>
          {p.links.live ? dict.work.view : dict.work.presentation}
          <span className="sr-only">: {p.name[locale]}</span>
          <ArrowSwap />
        </Link>
      </div>
    </>
  )

  // Același tipar pentru toate proiectele: imaginea în stânga, descrierea în dreapta.
  return (
    <li className="grid grid-cols-12 items-center gap-x-6 gap-y-8">
      <div className="col-span-12 lg:col-span-7">{media}</div>
      <Reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
        <span className="t-label text-ember">{num}</span>
        <div className="mt-3">{title}</div>
        <div className="mt-4">{meta}</div>
        <div className="mt-6">{details}</div>
      </Reveal>
    </li>
  )
}
