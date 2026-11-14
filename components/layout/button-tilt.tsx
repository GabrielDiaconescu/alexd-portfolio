'use client'

import { useEffect } from 'react'

const MAX_TILT = 10 // grade
const PULL = { x: 6, y: 4 } // px: butonul e „tras” ușor spre cursor

/**
 * Efectul 3D al butoanelor (.btn): pe desktop, butonul se înclină după cursor și e tras ușor spre el,
 * iar lumina din ::before urmărește mouse-ul. Un singur listener pe document, deci merge și pentru
 * butoanele care apar ulterior (formular, meniu). Pe touch și la „mișcare redusă” nu face nimic.
 */
export function ButtonTilt() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let current: HTMLElement | null = null
    let last: PointerEvent | null = null
    let frame = 0

    const reset = (el: HTMLElement) => {
      el.removeAttribute('data-tilting')
      for (const v of ['--rx', '--ry', '--tx', '--ty', '--gx', '--gy']) el.style.removeProperty(v)
    }

    const apply = () => {
      frame = 0
      if (!current || !last) return
      const r = current.getBoundingClientRect()
      const x = Math.min(1, Math.max(0, (last.clientX - r.left) / r.width))
      const y = Math.min(1, Math.max(0, (last.clientY - r.top) / r.height))
      // Partea de sub cursor se „apasă”: pe orizontală mai mult, pe verticală mai puțin (butoanele sunt late).
      current.style.setProperty('--rx', `${((0.5 - y) * MAX_TILT).toFixed(2)}deg`)
      current.style.setProperty('--ry', `${((x - 0.5) * MAX_TILT * 0.6).toFixed(2)}deg`)
      current.style.setProperty('--tx', `${((x - 0.5) * PULL.x).toFixed(2)}px`)
      current.style.setProperty('--ty', `${((y - 0.5) * PULL.y).toFixed(2)}px`)
      current.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
      current.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
    }

    const onMove = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>('.btn') : null
      if (el !== current) {
        if (current) reset(current)
        current = el
        current?.setAttribute('data-tilting', '')
      }
      if (!current) return
      last = e
      if (!frame) frame = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      if (current) reset(current)
      current = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      if (current) reset(current)
    }
  }, [])

  return null
}
