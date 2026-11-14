'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, media, useGSAP } from '@/lib/gsap'

/**
 * Ieșirea din hero, legată de scroll (scrub): titlul urcă și se stinge, compoziția 3D se retrage în adâncime.
 * Se aplică pe containerele [data-hero-title] și [data-hero-visual], nu pe elementele animate de Motion.
 */
export function HeroExit({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motion, () => {
        const scrollTrigger = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5 }
        gsap.to('[data-hero-title]', { yPercent: -22, opacity: 0.1, ease: 'none', scrollTrigger })
        gsap.to('[data-hero-visual]', { y: -90, scale: 0.9, opacity: 0.25, ease: 'none', scrollTrigger })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
