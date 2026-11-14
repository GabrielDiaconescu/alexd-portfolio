'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

/**
 * O etichetă care urmărește mouse-ul peste elementele cu `data-cursor="Text"`.
 * Cursorul nativ rămâne vizibil; pe ecrane tactile și la „mișcare redusă” componenta nu face nimic.
 */
export function CursorLabel() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(mq.matches && !reduce)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]')
      setLabel(target?.dataset.cursor ?? null)
    }
    const leave = () => setLabel(null)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[70]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label && (
          <motion.div
            key="cursor"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="-ml-12 -mt-12 grid size-24 place-items-center rounded-full bg-ember text-ink"
          >
            <span className="flex items-center gap-1 t-label !tracking-[0.1em]">
              {label}
              <ArrowUpRight className="size-3.5" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
