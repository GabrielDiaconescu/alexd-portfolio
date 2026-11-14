'use client'

import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { ease } from '@/lib/motion'

// La prima încărcare pagina vine din HTML-ul static, fără animație (nu ascundem conținutul până la hidratare).
let firstLoad = true

/** Tranziția discretă la schimbarea paginii (template se montează din nou la fiecare navigare). */
export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => !firstLoad)
  useEffect(() => {
    firstLoad = false
  }, [])
  return (
    <motion.div
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: ease.out }}
    >
      {children}
    </motion.div>
  )
}
