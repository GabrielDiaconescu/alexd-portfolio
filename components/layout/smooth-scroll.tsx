'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { setLenis } from '@/lib/lenis'

/**
 * Derulare lină cu Lenis, conectată la GSAP: un singur ceas (gsap.ticker) conduce Lenis, iar ScrollTrigger primește
 * poziția de la Lenis, ca secțiunile fixate (pin) și scrub-ul să rămână la fel de precise.
 *
 * - „Mișcare redusă”: Lenis nu pornește deloc (derulare nativă).
 * - Meniul mobil blochează <html> cu overflow:hidden (header.tsx): cât timp e blocat, Lenis stă pe pauză, altfel rotița ar
 *   derula pagina de sub meniu.
 * - Pe touch Lenis nu atinge gesturile (smoothTouch e oprit implicit): telefonul derulează nativ.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | null = null
    let tick: ((time: number) => void) | null = null
    let observer: MutationObserver | null = null

    const start = () => {
      if (lenis) return
      lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true })
      setLenis(lenis)
      lenis.on('scroll', ScrollTrigger.update)
      tick = (time) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      const root = document.documentElement
      const sync = () => (root.style.overflow === 'hidden' ? lenis?.stop() : lenis?.start())
      observer = new MutationObserver(sync)
      observer.observe(root, { attributes: true, attributeFilter: ['style'] })
      sync()
    }

    const stop = () => {
      observer?.disconnect()
      observer = null
      if (tick) gsap.ticker.remove(tick)
      tick = null
      lenis?.destroy()
      lenis = null
      setLenis(null)
    }

    const onChange = () => (query.matches ? stop() : start())
    if (!query.matches) start()
    query.addEventListener('change', onChange)
    return () => {
      query.removeEventListener('change', onChange)
      stop()
    }
  }, [])

  return null
}
