'use client'

import { useRef } from 'react'
import { gsap, media, SplitText, useGSAP } from '@/lib/gsap'

/**
 * „Alex D.” din subsol: literele urcă pe rând din spatele unei măști pe măsură ce subsolul intră în ecran.
 * GSAP: SplitText (litere, cu mască) + ScrollTrigger (scrub).
 */
export function Wordmark() {
  const ref = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motion, () => {
        const split = SplitText.create(ref.current!, { type: 'chars', mask: 'chars' })
        gsap.from(split.chars, {
          yPercent: 105,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'bottom 85%', scrub: 0.6 },
        })
        return () => split.revert()
      })
    },
    { scope: ref },
  )

  return (
    <p
      ref={ref}
      aria-hidden="true"
      // leading 1.08: masca fiecărei litere are înălțimea rândului, deci trebuie să cuprindă și ascendentele.
      className="-mb-[0.14em] -mt-[0.12em] select-none whitespace-nowrap font-display text-[clamp(3.5rem,15vw,11rem)] leading-[1.08] tracking-[-0.04em] text-paper"
    >
      Alex D<span className="text-ember">.</span>
    </p>
  )
}
