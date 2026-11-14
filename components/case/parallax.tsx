'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { type ReactNode, useRef } from 'react'

/** Parallax discret: conținutul se mișcă puțin mai încet decât pagina. Oprit la „mișcare redusă”. */
export function Parallax({ children, className, amount = 8 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${amount}%`, `-${amount}%`])
  return (
    <div ref={ref} className={className}>
      <motion.div data-motion style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}

/** Imaginea mare de deschidere: apare din spatele unei măști la încărcare. */
export function CoverReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ clipPath: 'inset(8% 6% 8% 6%)', opacity: 0 }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
