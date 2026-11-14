'use client'

import { useRef } from 'react'
import { gsap, media, ScrollTrigger, useGSAP } from '@/lib/gsap'

type Props = { label: string; lead: string; rows: [string[], string[]]; note: string }

/**
 * Banda „pentru cine lucrez”: două rânduri care curg în sensuri opuse.
 * GSAP: ticker pentru mișcarea continuă, ScrollTrigger.getVelocity() pentru accelerare și sens,
 * quickTo pentru înclinarea după viteză. Rulează doar cât timp banda e pe ecran.
 * La „mișcare redusă” rândurile sunt statice și se rup pe mai multe linii.
 */
export function Marquee({ label, lead, rows, note }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motion, () => {
        const tracks = gsap.utils.toArray<HTMLElement>('[data-track]')
        const state = tracks.map((el, i) => ({
          el,
          x: i % 2 ? -el.scrollWidth / 2 : 0,
          dir: i % 2 ? 1 : -1,
          set: gsap.quickSetter(el, 'x', 'px') as (v: number) => void,
        }))
        const skew = gsap.quickTo(tracks, 'skewX', { duration: 0.6, ease: 'power3.out' })
        let boost = 0
        let direction = 1

        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            direction = self.direction
            boost = gsap.utils.clamp(-1, 1, self.getVelocity() / 3000)
            skew(boost * -7)          },
          // Ieșită din ecran, banda nu mai e animată: o readucem drept, ca să nu revină înclinată.
          onToggle: (self) => {
            if (!self.isActive) {
              boost = 0
              gsap.set(tracks, { skewX: 0 })
            }
          },
        })

        const tick = (_: number, delta: number) => {
          if (!trigger.isActive) return
          boost *= 0.94
          if (Math.abs(boost) < 0.02) skew(0)
          const speed = 46 + Math.abs(boost) * 900 // px/s
          for (const s of state) {
            const half = s.el.scrollWidth / 2
            s.x = gsap.utils.wrap(-half, 0, s.x + s.dir * direction * speed * (delta / 1000))
            s.set(s.x)
          }
        }
        gsap.ticker.add(tick)
        return () => gsap.ticker.remove(tick)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="domains-title" className="overflow-hidden border-y border-line py-10 md:py-14">
      <div className="shell mb-8 flex items-center gap-4 t-label text-faint md:mb-12">
        <h2 id="domains-title">{label}</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
        <span>{lead}</span>
      </div>
      <ul className="sr-only">
        {rows.flat().map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="flex flex-col gap-2 md:gap-4">
        {rows.map((items, r) => (
          <div key={r} data-track className="flex w-max will-change-transform motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:px-4">
            {[0, 1].map((copy) => (
              <div key={copy} className={`flex shrink-0 items-center ${copy ? 'motion-reduce:hidden' : 'motion-reduce:flex-wrap'}`}>
                {items.map((item) => (
                  <span key={item} className="flex items-center">
                    <span
                      className={
                        r === 0
                          ? 'whitespace-nowrap px-5 font-display text-[clamp(2.5rem,6.5vw,6.5rem)] italic leading-[1.05] text-paper md:px-8'
                          : 'whitespace-nowrap px-5 text-[clamp(2rem,4.8vw,4.75rem)] font-semibold uppercase leading-[1.1] tracking-[-0.02em] text-transparent [-webkit-text-stroke:1px_var(--color-faint)] md:px-8'
                      }
                    >
                      {item}
                    </span>
                    <span className={r === 0 ? 'text-[clamp(1.25rem,2.4vw,2.25rem)] text-ember' : 'size-2 rounded-full bg-ember'}>
                      {r === 0 ? '✳' : ''}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="shell mt-8 text-mist md:mt-12">{note}</p>
    </section>
  )
}
