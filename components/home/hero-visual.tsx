'use client'

import Image from 'next/image'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'
import type { Project } from '@/content/types'
import type { Locale } from '@/lib/i18n'
import { ease } from '@/lib/motion'
import { Poster } from '@/components/ui/poster'

type Props = { projects: Project[]; locale: Locale; label: string }

/**
 * Compoziția 3D din hero: cele trei proiecte demonstrative, în perspectivă.
 * Pe mouse se înclină ușor după cursor; pe telefon și la „mișcare redusă” rămâne statică.
 * Doar CSS 3D (fără WebGL), deci se încarcă la fel de repede ca o imagine.
 */
export function HeroVisual({ projects, locale, label }: Props) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.8 })
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.8 })
  const rotateY = useTransform(sx, [-1, 1], [-22, -8])
  const rotateX = useTransform(sy, [-1, 1], [12, 4])

  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1)
      py.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, px, py])

  const [truck, barber, code] = projects
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: ease.out, delay },
  })

  return (
    <figure className="relative aspect-[10/9] w-full [perspective:1800px]" aria-label={label} role="img">
      <Stage />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ rotateY, rotateX }}
        initial={false}
      >
        {/* Podeaua: o grilă culcată în perspectivă, care se stinge spre margini. */}
        <div
          className="absolute -bottom-[18%] left-[-20%] h-[70%] w-[140%] bg-[linear-gradient(rgb(139_124_246/0.22)_1px,transparent_1px),linear-gradient(90deg,rgb(139_124_246/0.22)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_40%,#000,transparent_75%)]"
          style={{ transform: 'translateZ(-160px) rotateX(78deg)' }}
        />
        {/* Inelul orbital, în spatele capturilor. */}
        <div
          className="absolute left-[8%] top-[6%] aspect-square w-[84%] rounded-full border border-[rgb(139_124_246/0.28)] shadow-[0_0_40px_rgb(91_108_255/0.18),inset_0_0_40px_rgb(91_108_255/0.12)]"
          style={{ transform: 'translateZ(-260px) rotateX(64deg) rotateZ(-18deg)' }}
        />

        <Orb z={-200} className="right-[8%] top-[2%] size-[4.5%]" color="violet" delay="-2s" />
        <Orb z={60} className="left-[-3%] top-[46%] size-[3%]" color="blue" delay="-5s" />
        <Orb z={220} className="right-[18%] bottom-[6%] size-[5.5%]" color="ember" delay="-8s" />
        <Shard z={90} className="left-[-4%] top-[22%] size-[5%]" />
        <Shard z={-60} className="right-[-2%] top-[30%] size-[3.5%]" />

        <Layer z={-120} className="left-[2%] top-[4%] w-[76%]" delay="0s">
          <motion.div {...enter(0.35)}>
            <Browser project={truck} locale={locale} />
          </motion.div>
        </Layer>
        <Layer z={0} className="right-0 top-[40%] w-[64%]" delay="-3s">
          <motion.div {...enter(0.5)}>
            <Browser project={barber} locale={locale} />
          </motion.div>
        </Layer>
        {code.cover && (
          <Layer z={140} className="bottom-[-2%] left-[12%] w-[23%]" delay="-6s">
            <motion.div {...enter(0.65)}>
              <Phone src={code.cover.src} w={code.cover.width} h={code.cover.height} accent={code.accent} />
            </motion.div>
          </Layer>
        )}
      </motion.div>
      {/* Legenda: ce proiect e fiecare captură (descrierea completă e în aria-label). */}
      <figcaption aria-hidden="true" className="absolute -bottom-10 left-0 right-[8vw] flex flex-wrap gap-x-5 gap-y-1 t-label text-faint">
        {projects.map((p, i) => (
          <span key={p.slug}>
            <span className="text-ember">0{i + 1}</span> {p.name[locale].split(' · ')[0]}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

/**
 * Mediul din spatele compoziției: lumină difuză rece (albastru-violet) în centru, un accent cald jos
 * și umbra de pe podea. Doar gradienți radiali, fără blur animat.
 */
function Stage() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-[-14%]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(91_108_255/0.3),rgb(139_92_246/0.14)_50%,transparent)]" />
      <div className="absolute bottom-[8%] left-[2%] size-[58%] rounded-full bg-[radial-gradient(closest-side,rgb(255_106_61/0.26),transparent)]" />
      <div className="absolute right-[4%] top-[6%] size-[40%] rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.22),transparent)]" />
      <div className="absolute bottom-[10%] left-1/2 h-[10%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(0_0_0/0.7),transparent)]" />
      <Particles />
    </div>
  )
}

/** Particule fixe în jurul scenei; pozițiile sunt deterministe, deci identice pe server și în browser. */
const particles = [
  [12, 18, 2, 'rgb(255 255 255/0.7)'],
  [22, 72, 1.5, 'rgb(160 180 255/0.8)'],
  [35, 8, 1, 'rgb(255 255 255/0.5)'],
  [48, 88, 2, 'rgb(255 140 100/0.7)'],
  [63, 14, 1.5, 'rgb(190 160 255/0.8)'],
  [78, 64, 1, 'rgb(255 255 255/0.6)'],
  [86, 30, 2, 'rgb(160 180 255/0.7)'],
  [92, 82, 1.5, 'rgb(255 255 255/0.5)'],
  [6, 52, 1, 'rgb(255 200 180/0.6)'],
  [56, 46, 1, 'rgb(255 255 255/0.4)'],
] as const

function Particles() {
  return (
    <>
      {particles.map(([x, y, s, c], i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, background: c, boxShadow: `0 0 ${s * 4}px ${c}` }}
        />
      ))}
    </>
  )
}

const orbColors = {
  ember: ['#ffb08f', '#ff6a3d', '#7a2410', 'rgb(255 106 61/0.55)'],
  blue: ['#b8c4ff', '#3b5bff', '#0f1a5c', 'rgb(59 91 255/0.55)'],
  violet: ['#ddd0ff', '#8b5cf6', '#2e1766', 'rgb(139 92 246/0.55)'],
} as const

/** O sferă luminoasă: lumina cade din stânga-sus, iar glow-ul are culoarea ei. */
function Orb({ z, className, color, delay }: { z: number; className: string; color: keyof typeof orbColors; delay: string }) {
  const [hi, mid, low, glow] = orbColors[color]
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div
        className="animate-float aspect-square w-full rounded-full"
        style={{
          animationDelay: delay,
          background: `radial-gradient(circle at 32% 28%, ${hi}, ${mid} 45%, ${low} 85%)`,
          boxShadow: `0 0 24px 4px ${glow}, 0 12px 30px -8px rgb(0 0 0/0.8)`,
        }}
      />
    </div>
  )
}

/** Un romb de sticlă, cu muchii luminate. */
function Shard({ z, className }: { z: number; className: string }) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div className="aspect-square w-full">
        <div className="size-full rotate-45 border border-[rgb(190_200_255/0.45)] bg-[linear-gradient(135deg,rgb(255_255_255/0.18),rgb(139_92_246/0.08))] shadow-[0_0_20px_rgb(139_92_246/0.35)]" />
      </div>
    </div>
  )
}

function Layer({ z, className, delay, children }: { z: number; className: string; delay: string; children: React.ReactNode }) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div className="animate-drift" style={{ animationDelay: delay }}>
        {children}
      </div>
    </div>
  )
}

/** Ramă de browser: captura proiectului sau, dacă nu are, posterul lui tipografic. */
function Browser({ project, locale }: { project: Project; locale: Locale }) {
  const { cover, poster } = project
  return (
    <div
      className="overflow-hidden rounded-lg border border-line-strong bg-ink-2"
      style={{ boxShadow: `0 50px 100px -30px rgb(0 0 0/0.9), 0 0 70px -18px ${project.accent}` }}
    >
      <div className="flex h-5 items-center gap-1 border-b border-line px-2.5">
        <span className="size-1.5 rounded-full bg-line-strong" />
        <span className="size-1.5 rounded-full bg-line-strong" />
        <span className="size-1.5 rounded-full bg-line-strong" />
      </div>
      {cover ? (
        <Image
          src={cover.src}
          width={cover.width}
          height={cover.height}
          alt=""
          sizes="(min-width: 1024px) 34vw, 80vw"
          quality={85}
          loading="lazy"
          className="block h-auto w-full"
        />
      ) : (
        poster && <Poster id={poster} locale={locale} bare />
      )}
    </div>
  )
}

function Phone({ src, w, h, accent }: { src: string; w: number; h: number; accent: string }) {
  return (
    <>
      <div
        className="rounded-[1.4rem] border border-line-strong bg-[#050505] p-[5%]"
        style={{ boxShadow: `0 50px 100px -30px rgb(0 0 0/0.95), 0 0 60px -14px ${accent}` }}
      >
        <Image
          src={src}
          width={w}
          height={h}
          alt=""
          sizes="(min-width: 1024px) 11vw, 24vw"
          quality={85}
          loading="lazy"
          className="block h-auto w-full rounded-[1.05rem]"
        />
      </div>
    </>
  )
}
