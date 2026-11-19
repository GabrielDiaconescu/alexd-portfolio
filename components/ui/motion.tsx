'use client'

import { motion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'
import { fadeUp, inView, lineUp, stagger, staggerChildren } from '@/lib/motion'
import { Accent, plain } from './accent'

/** Respectă setarea „mișcare redusă” a sistemului pentru toate animațiile Motion. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'p' | 'section' | 'ul' | 'ol'
}

/** Apariție la scroll: urcă ușor și devine vizibil, o singură dată. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      data-reveal
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={fadeUp}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  )
}

/** Container care eșalonează copiii marcați cu <RevealItem>. */
export function RevealGroup({
  children,
  className,
  gap = stagger.base,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  gap?: number
  as?: 'div' | 'ul' | 'ol' | 'dl'
}) {
  const Tag = motion[as]
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={inView} variants={staggerChildren(gap)}>
      {children}
    </Tag>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const Tag = motion[as]
  return (
    <Tag data-reveal className={className} variants={fadeUp}>
      {children}
    </Tag>
  )
}

type SplitProps = {
  lines: readonly string[]
  as?: 'h1' | 'h2' | 'p'
  className?: string
  lineClassName?: string
  /** 'mount' pentru hero (la încărcare), 'view' pentru restul (la scroll). */
  trigger?: 'mount' | 'view'
  delay?: number
  id?: string
}

/**
 * Titlu care apare rând cu rând, din spatele unei măști.
 * Cititoarele de ecran primesc textul întreg, o singură dată.
 */
export function SplitLines({ lines, as = 'h2', className, lineClassName, trigger = 'view', delay = 0, id }: SplitProps) {
  const Tag = motion[as]
  const play = trigger === 'mount' ? { animate: 'show' } : { whileInView: 'show', viewport: inView }
  return (
    <Tag id={id} className={className} initial="hidden" {...play} variants={staggerChildren(stagger.loose, delay)}>
      <span className="sr-only">{lines.map(plain).join(' ')}</span>
      {/* Masca fiecărui rând depășește rândul sus (Î, Ă) și jos (ț, ș, g); marginile negative păstrează așezarea.
          flex-col: marginile rândurilor nu se comasează între ele sau cu titlul. */}
      <span aria-hidden="true" className="flex flex-col">
        {lines.map((line, i) => (
          <span key={i} className="-mb-[0.12em] -mt-[0.16em] block overflow-hidden pb-[0.12em] pt-[0.16em]">
            <motion.span data-reveal className={`block ${lineClassName ?? ''}`} variants={lineUp}>
              <Accent text={line} />
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  )
}
