'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

/**
 * GSAP e folosit doar pentru efectele legate de scroll, unde aduce ceva ce Motion nu face simplu:
 * secțiuni fixate (pin) cu scrub, SplitText, banda care reacționează la viteza de scroll.
 * Restul interfeței (apariții, hover, meniu, formular) rămâne în Motion.
 */
// Doar în browser: pe server (Cloudflare Workers) registerPlugin pornește ticker-ul GSAP,
// adică un setTimeout la încărcarea modulului, ceea ce Workers nu permite.
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** Condițiile comune pentru gsap.matchMedia(): toate efectele se opresc la „mișcare redusă”. */
export const media = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
} as const

export { gsap, ScrollTrigger, SplitText, useGSAP }
