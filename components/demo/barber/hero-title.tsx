'use client'

import { motion } from 'motion/react'

const lines: { text: string; italic?: boolean }[] = [{ text: 'Tunsoare bună,' }, { text: 'fără grabă', italic: true }, { text: 'și fără coadă.' }]

/** Titlul din hero: rândurile urcă pe rând din spatele unei măști. Textul întreg e disponibil pentru cititoare. */
export function HeroTitle() {
  return (
    <h1 className="font-display text-[clamp(3rem,8.4vw,7.75rem)] font-[420] leading-[0.95] tracking-[-0.03em] [font-variation-settings:'opsz'_144,'SOFT'_50]">
      <span className="sr-only">{lines.map((l) => l.text).join(' ')}</span>
      <span aria-hidden="true">
        {lines.map((l, i) => (
          <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
            <motion.span
              data-reveal
              className={`block ${l.italic ? 'italic text-[#7a1f1f]' : ''}`}
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 }}
            >
              {l.text}
            </motion.span>
          </span>
        ))}
      </span>
    </h1>
  )
}
