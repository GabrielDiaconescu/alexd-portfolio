'use client'

import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { gsap, media, SplitText, useGSAP } from '@/lib/gsap'
import { ease, inView } from '@/lib/motion'

/**
 * Componente în stilul React Bits (reactbits.dev), adaptate la site: TypeScript + Tailwind, mișcare redusă respectată,
 * text accesibil, valorile din sistemul de mișcare (lib/motion.ts). Nu sunt copii identice cu cele din bibliotecă.
 *
 * - CountUp, BlurText: folosite în pagină.
 * - SplitTextFx, Magnet: disponibile, nefolosite deocamdată. Titlurile au deja SplitLines (ui/motion.tsx), iar butoanele
 *   au deja atracția din ButtonTilt; dublarea ar strica ritmul designului.
 */

/* ───────────── CountUp ───────────── */

type CountUpProps = {
  to: number
  from?: number
  /** Secunde. */
  duration?: number
  delay?: number
  /** Separator de mii, ex. '.' */
  separator?: string
  className?: string
}

const group = (n: number, separator: string) => {
  const s = Math.round(n).toString()
  return separator ? s.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : s
}

/**
 * Număr care crește la intrarea în ecran. Serverul și „mișcarea redusă” primesc direct valoarea finală
 * (textul rămâne corect fără JavaScript). Folosește-l doar pentru cifre reale.
 */
export function CountUp({ to, from = 0, duration = 1.4, delay = 0, separator = '', className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const visible = useInView(ref, inView)

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    el.textContent = group(from, separator)
  }, [from, separator, reduce])

  useEffect(() => {
    const el = ref.current
    if (!el || reduce || !visible) return
    const controls = animate(from, to, {
      duration,
      delay,
      ease: ease.out,
      onUpdate: (v) => {
        el.textContent = group(v, separator)
      },
      onComplete: () => {
        el.textContent = group(to, separator)
      },
    })
    return () => controls.stop()
  }, [visible, reduce, from, to, duration, delay, separator])

  return (
    <span ref={ref} className={className}>
      {group(to, separator)}
    </span>
  )
}

/* ───────────── BlurText ───────────── */

type BlurTextProps = {
  text: string
  as?: 'p' | 'h2' | 'h3' | 'span' | 'div'
  className?: string
  /** Secunde între cuvinte. */
  stagger?: number
  delay?: number
}

/** Cuvintele apar pe rând, din încețoșat; la „mișcare redusă” apar instant. Cititoarele de ecran primesc textul întreg, o singură dată. */
export function BlurText({ text, as = 'p', className, stagger = 0.06, delay = 0 }: BlurTextProps) {
  // Același markup pe server și pe client (altfel hidratarea eșuează, React #418): la „mișcare redusă” doar durata devine 0.
  const reduce = useReducedMotion()
  const Tag = as as ElementType
  const words = text.split(/ +/)
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block will-change-[filter,transform,opacity]"
            initial={{ filter: 'blur(10px)', opacity: 0, y: 12 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            viewport={inView}
            transition={reduce ? { duration: 0 } : { duration: 0.7, delay: delay + i * stagger, ease: ease.out }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </span>
    </Tag>
  )
}

/* ───────────── SplitText (GSAP) ───────────── */

type SplitTextProps = {
  text: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span'
  className?: string
  splitType?: 'chars' | 'words' | 'lines'
  /** Secunde între elemente. */
  stagger?: number
  duration?: number
  /** Pornește când elementul ajunge la această poziție din viewport. */
  start?: string
}

/** Text împărțit cu SplitText din GSAP, animat la scroll; la „mișcare redusă” rămâne static. */
export function SplitTextFx({ text, as = 'p', className, splitType = 'words', stagger = 0.04, duration = 0.8, start = 'top 85%' }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const Tag = as as ElementType

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(media.motion, () => {
        const split = SplitText.create(el, {
          type: splitType === 'chars' ? 'chars,words' : splitType === 'lines' ? 'lines' : 'words',
          autoSplit: true,
          onSplit: (self) => {
            const targets = splitType === 'chars' ? self.chars : splitType === 'lines' ? self.lines : self.words
            return gsap.from(targets, {
              opacity: 0,
              y: 24,
              duration,
              stagger,
              ease: 'expo.out',
              scrollTrigger: { trigger: el, start, once: true },
            })
          },
        })
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [text, splitType, stagger, duration, start] },
  )

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  )
}

/* ───────────── Magnet ───────────── */

type MagnetProps = {
  children: ReactNode
  /** Distanța (px) de la marginea elementului în care începe atracția. */
  padding?: number
  /** Cu cât e mai mare, cu atât atracția e mai slabă. */
  strength?: number
  className?: string
}

/** Elementul e tras spre cursor când acesta e aproape. Doar cu mouse; pe touch și la „mișcare redusă” nu face nimic. */
export function Magnet({ children, padding = 80, strength = 4, className }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const near = Math.abs(cx - e.clientX) < r.width / 2 + padding && Math.abs(cy - e.clientY) < r.height / 2 + padding
        setActive(near)
        el.style.transform = near ? `translate3d(${(e.clientX - cx) / strength}px, ${(e.clientY - cy) / strength}px, 0)` : ''
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }
  }, [padding, strength])

  return (
    <div ref={ref} className={`inline-block ${className ?? ''}`} style={{ transition: active ? 'transform 0.3s ease-out' : 'transform 0.5s ease-in-out' }}>
      {children}
    </div>
  )
}
