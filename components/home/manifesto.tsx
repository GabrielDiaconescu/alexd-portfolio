'use client'

import { useRef } from 'react'
import { Accent, NoBreak } from '@/components/ui/accent'
import { gsap, media, SplitText, useGSAP } from '@/lib/gsap'

type Props = { label: string; text: string; body: string; note: string; pillars: string[] }

/**
 * Manifestul: secțiunea se fixează (pin), iar cuvintele se „aprind” pe rând pe măsură ce derulezi.
 * În dreapta, pe desktop, o planetă cu orbite: cele trei idei ale principiului se aprind odată cu textul,
 * iar orbitele și suprafața planetei se rotesc legat de scroll (scrub), deci fără animație continuă.
 * GSAP: SplitText (cuvinte) + ScrollTrigger (pin + scrub). La „mișcare redusă” totul e afișat normal.
 */
export function Manifesto({ label, text, body, note, pillars }: Props) {
  const root = useRef<HTMLElement>(null)
  const copy = useRef<HTMLParagraphElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const orbit = useRef<HTMLDivElement>(null)
  const planet = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motion, () => {
        const split = SplitText.create(copy.current!, { type: 'words', aria: 'auto' })
        const total = 0.4 + 0.12 * (split.words.length - 1)
        gsap.set(split.words, { opacity: 0.12 })
        const tl = gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: '+=150%', pin: true, scrub: 0.6 },
          })
          .to(split.words, { opacity: 1, ease: 'none', stagger: 0.12, duration: 0.4 })
          .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: total }, 0)
          .fromTo(orbit.current, { rotationZ: -30 }, { rotationZ: 50, ease: 'none', duration: total }, 0)
          // Sateliții se rotesc invers față de orbită, ca să rămână mereu cu fața (și lumina) spre privitor.
          .fromTo('[data-moon]', { rotationZ: 30 }, { rotationZ: -50, ease: 'none', duration: total }, 0)
          // Suprafața alunecă spre stânga: planeta se rotește cât timp citești.
          .fromTo(planet.current!.querySelectorAll('[data-spin]'), { xPercent: 0 }, { xPercent: -22, ease: 'none', duration: total }, 0)
        gsap.utils.toArray<HTMLElement>('[data-pillar]').forEach((el, i, all) => {
          tl.fromTo(el, { opacity: 0.2, x: 12 }, { opacity: 1, x: 0, ease: 'power2.out', duration: 0.5 }, (total * (i + 0.6)) / all.length)
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-label={label} className="relative flex min-h-[100svh] items-center overflow-hidden border-t border-line py-24">
      <Orbit ref={orbit} planet={planet} pillars={pillars} />
      <div className="shell relative w-full">
        <p className="flex items-center gap-4 t-label text-faint">
          <span>{label}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </p>
        <p
          ref={copy}
          className="mt-12 max-w-[24ch] font-display text-[clamp(2.375rem,6.8vw,7.5rem)] leading-[1] tracking-[-0.02em] text-paper md:mt-16"
        >
          <Accent text={text} />
        </p>
        <p className="mt-10 max-w-[38rem] t-lead text-mist md:mt-14">
          <NoBreak text={body} />
        </p>
        <div className="mt-12 flex items-center gap-6 md:mt-16">
          <span aria-hidden="true" className="relative block h-px w-40 overflow-hidden bg-line">
            <span ref={bar} className="absolute inset-0 origin-left bg-ember" />
          </span>
          <span className="t-label text-faint">{note}</span>
        </div>
      </div>
    </section>
  )
}

/** Pozițiile celor trei idei în jurul sferei (procente din cadru). */
const spots = ['left-[-8%] top-[16%]', 'right-[-6%] top-[6%]', 'left-[30%] bottom-[6%]']

const tilt = 'rotateX(68deg)'

function Orbit({ ref, planet, pillars }: { ref: React.Ref<HTMLDivElement>; planet: React.Ref<HTMLDivElement>; pillars: string[] }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[10%] right-[max(1.5rem,5vw)] hidden aspect-square w-[min(30vw,27rem)] lg:block [perspective:1400px]"
    >
      {/* Lumina din spatele planetei: rece în jur, caldă jos. */}
      <div className="absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,rgb(91_108_255/0.24),rgb(139_92_246/0.1)_55%,transparent)]" />
      <div className="absolute bottom-[-10%] left-[-10%] size-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_61/0.18),transparent)]" />

      {/* Planeta și orbitele în același context 3D: partea din față a orbitelor trece peste planetă. */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        <div className="absolute inset-0 [transform-style:preserve-3d]" style={{ transform: tilt }}>
          <div ref={ref} className="absolute inset-0 [transform-style:preserve-3d]">
            <div className="absolute inset-0 rounded-full border border-[rgb(139_124_246/0.4)] shadow-[0_0_40px_rgb(91_108_255/0.2),inset_0_0_40px_rgb(91_108_255/0.14)]" />
            <div className="absolute inset-[18%] rounded-full border border-dashed border-line-strong" />
            <Moon className="left-1/2 top-0 size-[4%]" colors={['#e4e9ff', '#7f95ff', '#1b2a7a']} glow="rgb(59 91 255/0.6)" />
            <Moon className="bottom-[18%] right-[18%] size-[3%]" colors={['#ffd6c4', '#ff6a3d', '#6b200e']} glow="rgb(255 106 61/0.6)" />
          </div>
        </div>

        <div ref={planet} className="absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2">
          <div className="planet-halo" />
          <div className="planet">
            <div className="planet-bands" />
            <div data-spin className="planet-surface" />
            <div data-spin className="planet-storms">
              <span className="planet-storm left-[16%]" />
              <span className="planet-storm left-[66%]" />
            </div>
            <div className="planet-light" />
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 top-[66%] h-[8%] w-[46%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.55),transparent)]" />

      {pillars.map((p, i) => (
        <p key={p} data-pillar className={`absolute flex items-center gap-3 whitespace-nowrap t-label text-paper ${spots[i]}`}>
          <span className="text-ember">0{i + 1}</span>
          <span className="h-px w-6 bg-line-strong" />
          {p}
        </p>
      ))}
    </div>
  )
}

/** Un satelit pe orbită: întors spre privitor (rotateX invers față de planul orbitei), luminat din stânga-sus. */
function Moon({ className, colors: [hi, mid, low], glow }: { className: string; colors: [string, string, string]; glow: string }) {
  return (
    <span className={`absolute -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] ${className}`}>
      <span
        data-moon
        className="block size-full rounded-full"
        style={{
          transform: 'rotateX(-68deg)',
          background: `radial-gradient(circle at 32% 28%, ${hi}, ${mid} 45%, ${low} 85%)`,
          boxShadow: `0 0 14px 3px ${glow}`,
        }}
      />
    </span>
  )
}
