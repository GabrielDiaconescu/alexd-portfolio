'use client'

import { Pause, Play, Scissors } from 'lucide-react'
import { useState } from 'react'

/** Banda de servicii: se oprește la hover, la focus și cu butonul de pauză (WCAG 2.2.2). */
export function ServiceMarquee({ names }: { names: string[] }) {
  const [paused, setPaused] = useState(false)

  return (
    <div className="barber-marquee-wrap relative overflow-hidden bg-[#7a1f1f] py-5 text-[#f3ede3]">
      <p className="sr-only">Servicii: {names.join(', ')}.</p>
      <div aria-hidden="true" data-paused={paused} className="barber-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {names.map((n) => (
              <span key={n} className="flex items-center whitespace-nowrap font-display text-[clamp(1.5rem,3vw,2.25rem)] italic">
                <span className="px-7">{n}</span>
                <Scissors className="size-5 text-[#e3c88f]" />
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? 'Pornește banda de servicii' : 'Oprește banda de servicii'}
        className="barber-marquee-toggle absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-[#f3ede3]/40 bg-[#7a1f1f] transition-colors hover:border-[#e3c88f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3ede3]"
      >
        {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
      </button>
    </div>
  )
}
