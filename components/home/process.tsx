'use client'

import { useRef } from 'react'
import type { Dictionary } from '@/content/dictionary'
import type { Step } from '@/content/process'
import type { Locale } from '@/lib/i18n'
import { gsap, media, useGSAP } from '@/lib/gsap'
import { SectionHeading } from '@/components/ui/section-heading'

type Props = { locale: Locale; dict: Dictionary['process']; steps: Step[] }

/**
 * Pașii colaborării, pe același fundal ca restul site-ului. GSAP + ScrollTrigger:
 *  - desktop: secțiunea se fixează, iar pașii trec orizontal (scrub), cu bară de progres și contor;
 *    fiecare pas își animă conținutul când intră în cadru (containerAnimation);
 *  - telefon: listă verticală, linia din stânga se umple la scroll;
 *  - „mișcare redusă”: listă verticală simplă, fără niciun efect.
 * Clasele `lg:motion-safe:` fac aspectul orizontal doar când rulează și efectul.
 */
export function Process({ locale, dict, steps }: Props) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const line = useRef<HTMLSpanElement>(null)
  const total = String(steps.length).padStart(2, '0')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.desktop, () => {
        const el = track.current!
        // Cât trebuie să se deplaseze traseul ca ultimul pas să se oprească la marginea grilei (fără padding).
        const distance = () => {
          const box = el.parentElement!
          const pad = parseFloat(getComputedStyle(box).paddingLeft) + parseFloat(getComputedStyle(box).paddingRight)
          return Math.max(0, el.scrollWidth - (box.clientWidth - pad))
        }
        const slide = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(bar.current, { scaleX: self.progress })
              const i = Math.min(steps.length, Math.floor(self.progress * steps.length) + 1)
              if (counter.current) counter.current.textContent = String(i).padStart(2, '0')
            },
          },
        })

        gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step, i) => {
          if (i === 0) return
          gsap.from(step.querySelectorAll('[data-step-part]'), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, containerAnimation: slide, start: 'left 98%', end: 'left 72%', scrub: true },
          })
        })
      })

      mm.add(media.mobile, () => {
        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: track.current, start: 'top 70%', end: 'bottom 60%', scrub: true } },
        )
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="process"
      aria-labelledby="process-title"
      className="overflow-hidden border-t border-line lg:motion-safe:flex lg:motion-safe:h-[100svh] lg:motion-safe:flex-col lg:motion-safe:justify-center"
    >
      <div className="py-24 md:py-36 lg:motion-safe:py-0">
        <div className="shell">
          <SectionHeading index="04" eyebrow={dict.eyebrow} title={dict.title} id="process-title" />
        </div>

        <div className="shell relative mt-16 md:mt-20 lg:motion-safe:mt-14">
          <span aria-hidden="true" className="absolute bottom-0 left-4 top-0 w-px bg-line lg:motion-safe:hidden" />
          <span
            ref={line}
            aria-hidden="true"
            className="absolute left-4 top-0 h-full w-px origin-top bg-ember motion-reduce:hidden lg:hidden"
          />
          <ol ref={track} className="flex flex-col lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:gap-0">
            {steps.map((step, i) => (
              <li
                key={i}
                data-step
                className="grid grid-cols-[4.5rem_1fr] gap-x-4 pb-14 pl-6 sm:grid-cols-[6rem_1fr] sm:pl-10 md:pb-20 lg:motion-safe:flex lg:motion-safe:w-[min(31rem,36vw)] lg:motion-safe:flex-col lg:motion-safe:border-l lg:motion-safe:border-line lg:motion-safe:px-10 lg:motion-safe:pb-0"
              >
                <span
                  data-step-part
                  className="font-display text-[3.25rem] leading-[0.85] text-ember sm:text-[4.5rem] lg:motion-safe:text-[clamp(6rem,9vw,9rem)]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="lg:motion-safe:mt-10">
                  <h3 data-step-part className="t-h3">
                    {step.title[locale]}
                  </h3>
                  <p data-step-part className="mt-4 max-w-[34rem] text-mist">
                    {step.body[locale]}
                  </p>
                  <p data-step-part className="mt-5 inline-flex items-center gap-2 border-t border-line pt-3 t-label text-mist">
                    <span className="text-paper">{dict.output}:</span> {step.output[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div aria-hidden="true" className="shell mt-14 hidden items-center gap-6 lg:motion-safe:flex">
          <span className="t-label text-paper">
            <span ref={counter}>01</span> / {total}
          </span>
          <span className="relative block h-px flex-1 overflow-hidden bg-line">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-ember" />
          </span>
        </div>
      </div>
    </section>
  )
}
