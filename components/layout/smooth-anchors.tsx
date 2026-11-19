'use client'

import { useEffect } from 'react'
import { getLenis } from '@/lib/lenis'

/**
 * Derulare lină la linkurile către o secțiune de pe aceeași pagină (#work, #contact…).
 * Înlocuiește `scroll-behavior: smooth` din CSS, care interferează cu ScrollTrigger. Cu Lenis activ derulează prin el
 * (lenis.scrollTo), altfel prin scrollIntoView.
 * La „mișcare redusă” saltul e instant. Focusul ajunge pe secțiune, pentru tastatură.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]')
      if (!link) return
      const url = new URL(link.href, location.href)
      if (url.pathname !== location.pathname || !url.hash) return
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (!target) return
      e.preventDefault()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Din meniul mobil: pagina e încă blocată (overflow: hidden pe <html>). O derulare lină pornită acum
      // așteaptă închiderea meniului, apoi mai durează o secundă; pe iPhone Safari ajungea la ~3 s.
      // Deblocăm imediat și sărim direct: meniul acoperă tot ecranul, iar când dispare secțiunea e deja acolo.
      const fromMenu = link.closest('[role="dialog"]') !== null
      if (fromMenu) document.documentElement.style.overflow = ''
      const lenis = reduce ? null : getLenis()
      if (lenis) lenis.scrollTo(target, { duration: 1.2, immediate: fromMenu })
      else target.scrollIntoView({ behavior: reduce || fromMenu ? 'auto' : 'smooth', block: 'start' })
      history.pushState(null, '', url.hash)
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
    // Faza de capture: rulăm înaintea <Link> din Next, care altfel ar sări direct la secțiune.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
