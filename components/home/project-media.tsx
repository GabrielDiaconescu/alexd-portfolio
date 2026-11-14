'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { Project } from '@/content/types'
import type { Locale } from '@/lib/i18n'
import { Poster } from '@/components/ui/poster'
import { Shot } from '@/components/ui/shot'

export type MediaLayout = 'split' | 'phones' | 'poster'

type Props = {
  project: Project
  locale: Locale
  layout: MediaLayout
  href: string
  cursor: string
  className?: string
}

const aspect: Record<MediaLayout, string> = {
  split: 'aspect-[4/3]',
  phones: 'aspect-[4/3] md:aspect-[5/4]',
  poster: 'aspect-[4/3]',
}

/**
 * „Scena” unui proiect: fundal în culoarea proiectului, capturile în rame.
 * La scroll: masca se deschide, imaginea se apropie ușor, telefonul are parallax propriu.
 */
export function ProjectMedia({ project, locale, layout, href, cursor, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const clip = useTransform(scrollYProgress, [0, 0.4], ['inset(10% 5% 10% 5%)', 'inset(0% 0% 0% 0%)'])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.08, 1])
  const lift = useTransform(scrollYProgress, [0, 1], ['10%', '-14%'])

  const { cover, secondary } = project
  // În bara browserului: numele proiectului, nu un domeniu inventat.
  const host = project.name[locale]

  return (
    <Link
      href={href}
      tabIndex={-1}
      aria-hidden="true"
      data-cursor={cursor}
      className={`group/media block ${className}`}
    >
      <motion.div
        ref={ref}
        data-motion
        style={{ clipPath: clip }}
        className={`relative overflow-hidden ${aspect[layout]}`}
      >
        <motion.div
          data-motion
          style={{
            scale,
            background: `radial-gradient(55% 45% at 85% 105%, color-mix(in oklab, ${project.accent} 40%, transparent), transparent 70%), radial-gradient(45% 40% at 8% 95%, rgb(255 106 61 / 0.12), transparent 70%), radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, ${project.accent} 26%, #05070d), color-mix(in oklab, ${project.accent} 6%, #05070d) 70%)`,
          }}
          className="absolute inset-0"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,#000,transparent_80%)]"
          />
          {layout === 'poster' && project.poster && (
            <motion.div
              data-motion
              style={{ y: lift }}
              className="absolute left-[7%] top-[14%] w-[86%] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/media:-translate-y-2"
            >
              <Poster id={project.poster} locale={locale} />
            </motion.div>
          )}

          {layout === 'split' && cover && (
            <>
              <div className="absolute left-[6%] top-[11%] w-[80%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/media:-translate-y-2">
                <Shot shot={cover} locale={locale} url={host} sizes="(min-width: 1024px) 46vw, 90vw" />
              </div>
              {secondary && (
                <motion.div data-motion style={{ y: lift }} className="absolute bottom-[-12%] right-[5%] w-[25%]">
                  <Shot shot={secondary} locale={locale} sizes="(min-width: 1024px) 14vw, 30vw" />
                </motion.div>
              )}
            </>
          )}

          {layout === 'phones' && cover && (
            <>
              <div className="absolute left-[16%] top-[9%] w-[33%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/media:-translate-y-2">
                <Shot shot={cover} locale={locale} sizes="(min-width: 1024px) 20vw, 36vw" />
              </div>
              {secondary && (
                <motion.div data-motion style={{ y: lift }} className="absolute right-[12%] top-[22%] w-[30%]">
                  <Shot shot={secondary} locale={locale} sizes="(min-width: 1024px) 18vw, 32vw" />
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </Link>
  )
}
