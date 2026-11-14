import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google'

// Fonturile sunt descărcate la build și servite de pe site (fără cereri către Google la vizită).
export const display = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const sans = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`
