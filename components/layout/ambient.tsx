'use client'

import { useEffect, useRef } from 'react'

/**
 * Fundalul întregului site: glow-uri (jar în stânga, albastru-violet în dreapta), o grilă discretă și stele.
 * Stă fix sub conținut, deci trece continuu prin toate secțiunile. Stilurile sunt în globals.css (.ambient).
 * Pe mouse, straturile se deplasează puțin, fiecare cu adâncimea lui; pe touch și la „mișcare redusă” stau pe loc.
 */
export function Ambient() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let x = 0
    let y = 0
    const onMove = (e: PointerEvent) => {
      x = e.clientX / window.innerWidth - 0.5
      y = e.clientY / window.innerHeight - 0.5
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        el.style.setProperty('--mx', x.toFixed(3))
        el.style.setProperty('--my', y.toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  const depth = (px: number) => ({ '--depth': px }) as React.CSSProperties

  return (
    <div ref={root} aria-hidden="true" className="ambient">
      <div className="ambient-layer" style={depth(40)}>
        <div className="ambient-glow ambient-glow--ember" />
        <div className="ambient-glow ambient-glow--blue" />
        <div className="ambient-glow ambient-glow--violet" />
      </div>
      <div className="ambient-layer" style={depth(10)}>
        <div className="ambient-grid" />
      </div>
      <div className="ambient-layer" style={depth(18)}>
        <div className="ambient-stars ambient-stars--far" />
      </div>
      <div className="ambient-layer" style={depth(36)}>
        <div className="ambient-stars ambient-stars--near" />
      </div>
    </div>
  )
}
