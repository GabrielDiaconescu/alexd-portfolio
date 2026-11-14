import type { Transition, Variants } from 'motion/react'

/**
 * Sistemul de mișcare. Toate animațiile site-ului folosesc aceste valori,
 * ca ritmul să fie același peste tot. Se animă doar transform și opacity.
 */
export const ease = {
  /** Ieșire lungă și moale: apariții, măști, imagini. */
  out: [0.16, 1, 0.3, 1] as const,
  /** Simetric: meniuri, tranziții care pleacă și vin. */
  inOut: [0.76, 0, 0.24, 1] as const,
}

export const duration = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
  reveal: 1.1,
}

export const stagger = {
  tight: 0.05,
  base: 0.08,
  loose: 0.12,
}

export const transition = {
  base: { duration: duration.base, ease: ease.out } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.out } satisfies Transition,
  reveal: { duration: duration.reveal, ease: ease.out } satisfies Transition,
  spring: { type: 'spring', stiffness: 160, damping: 24, mass: 0.6 } satisfies Transition,
}

/** Distanța standard de urcare la apariție. */
export const rise = 28

/** Viewport-ul pentru aparițiile la scroll: o singură dată, puțin înainte să intre complet. */
export const inView = { once: true, margin: '0px 0px -12% 0px' } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: rise },
  show: { opacity: 1, y: 0, transition: transition.slow },
}

export const lineUp: Variants = {
  hidden: { y: '105%' },
  show: { y: '0%', transition: transition.reveal },
}

export const staggerChildren = (gap: number = stagger.base, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})
