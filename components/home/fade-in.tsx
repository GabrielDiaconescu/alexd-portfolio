'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { rise, transition } from '@/lib/motion'

/** Apariție la încărcare (nu la scroll), pentru elementele din primul ecran. */
export function FadeIn({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: rise / 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transition.slow, delay }}
    >
      {children}
    </motion.div>
  )
}
