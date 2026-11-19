'use client'

import { useEffect } from 'react'

const PULL = { x: 4, y: 3 } // px: cât e „tras” butonul spre cursor

/**
 * Pe desktop, butoanele (.btn) sunt trase ușor spre cursor; fără înclinare 3D și fără reflexii.
 * Un singur listener pe document, deci merge și pentru butoanele care apar ulterior (formular, meniu).
 * Pe touch și la „mișcare redusă” nu face nimic. Numele rămâne pentru importul din layout.
 */
export function ButtonTilt() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let current: HTMLElement | null = null
    let last: PointerEvent | null = null
    let frame = 0

    const reset = (el: HTMLElement) => {
      el.removeAttribute('data-pull')
      el.style.removeProperty('--tx')
      el.style.removeProperty('--ty')
    }

    const apply = () => {
      frame = 0
      if (!current || !last) return
      const r = current.getBoundingClientRect()
      const x = Math.min(1, Math.max(0, (last.clientX - r.left) / r.width))
      const y = Math.min(1, Math.max(0, (last.clientY - r.top) / r.height))
      current.style.setProperty('--tx', `${((x - 0.5) * PULL.x).toFixed(2)}px`)
      current.style.setProperty('--ty', `${((y - 0.5) * PULL.y).toFixed(2)}px`)
    }

    const onMove = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>('.btn') : null
      if (el !== current) {
        if (current) reset(current)
        current = el
        current?.setAttribute('data-pull', '')
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
