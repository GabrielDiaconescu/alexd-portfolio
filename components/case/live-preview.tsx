'use client'

import { getImageProps } from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Maximize2, X } from 'lucide-react'
import { type CSSProperties, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { CustomEase } from 'gsap/CustomEase'
import { Flip } from 'gsap/Flip'
import type { Dictionary } from '@/content/dictionary'
import type { PageCapture, Preview, Project } from '@/content/types'
import type { Locale } from '@/lib/i18n'
import { gsap, media, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { ease } from '@/lib/motion'

// Flip și CustomEase sunt folosite doar aici, deci se încarcă doar pe paginile studiilor de caz.
// Doar în browser, din același motiv ca în lib/gsap.ts.
if (typeof window !== 'undefined') gsap.registerPlugin(Flip, CustomEase)

type Props = {
  project: Project
  preview: Preview
  locale: Locale
  t: Dictionary['caseStudy']['preview']
  stage: CSSProperties
}

type Phase = 'idle' | 'loading' | 'ready' | 'error'

/** Sub această lățime a ramei, demo-ul live rulează în varianta de telefon, la scară 1. */
const NARROW = 640
/** Pe ecrane mari, demo-ul live e randat ca pe un laptop și micșorat cât să încapă în ramă. */
const DESKTOP = 1280

const reduceQuery = '(prefers-reduced-motion: reduce)'
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(reduceQuery)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const getReduce = () => window.matchMedia(reduceQuery).matches
const serverReduce = () => false

/** Eșecurile cu variantă de rezervă rămân vizibile în dezvoltare, fără zgomot în producție. */
function warn(context: string, error: unknown) {
  if (process.env.NODE_ENV !== 'production') console.warn(`[LivePreview] ${context}`, error)
}

/**
 * Callback de scroll care nu are voie să dărâme pagina. ScrollTrigger îl poate apela sincron chiar la creare, adică
 * în efectul React al componentei: o excepție de acolo ajunge în ecranul de eroare Next și ia toată pagina cu ea.
 */
const safely = (context: string, fn: () => void) => () => {
  try {
    fn()
  } catch (error) {
    warn(context, error)
  }
}

/**
 * Ce are voie demo-ul din iframe. Fără allow-forms, allow-modals sau allow-downloads: nu le folosește.
 *  - allow-scripts: e o pagină React interactivă;
 *  - allow-same-origin: componenta îi derulează fereastra și îi ascultă tastele prin contentWindow, iar copierea
 *    în clipboard și resursele sub CSP 'self' cer originea reală. Demo-ul e pagina noastră, servită doar pe același
 *    domeniu (frame-ancestors 'self' în next.config.mjs), deci sandbox-ul e o plasă de siguranță, nu o izolare;
 *  - allow-popups(+escape): linkul către hartă se deschide în filă nouă, iar linkurile tel: au nevoie de el;
 *  - allow-top-navigation-by-user-activation: linkurile „înapoi la portofoliu” au target="_top".
 */
const SANDBOX = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'

// Aceleași curbe ca în Motion (lib/motion.ts), ca cele două biblioteci să se miște la fel.
const bezier = ([a, b, c, d]: readonly number[]) => `M0,0 C${a},${b} ${c},${d} 1,1`
let easesReady = false
function createEases() {
  if (easesReady) return
  CustomEase.create('lp-out', bezier(ease.out))
  CustomEase.create('lp-in-out', bezier(ease.inOut))
  easesReady = true
}

/**
 * Previzualizarea cinematică din studiul de caz: site-ul, într-o ramă de browser, parcurs odată cu scroll-ul.
 *
 * GSAP:
 *  - intrarea (timeline): rama urcă și apare, conținutul iese de sub o mască, bara browserului se compune;
 *  - apropierea (ScrollTrigger, scrub): rama crește ușor până se fixează;
 *  - parcurgerea (ScrollTrigger, scrub): cât timp rama e fixată (CSS sticky, fără pin), pagina din ea derulează
 *    de sus până jos. Distanța vine din înălțimea reală a conținutului, nu e o valoare fixă;
 *  - extinderea (Flip): aceeași ramă devine fereastră pe tot ecranul. Nu se mută în DOM, deci iframe-ul nu se reîncarcă.
 *
 * La „mișcare redusă” nu există nimic din cele de mai sus: captura se derulează direct în ramă,
 * iar extinderea se face fără animație.
 */
export function LivePreview({ project: p, preview, locale, t, stage }: Props) {
  const live = preview.mode === 'live'
  const track = useRef<HTMLDivElement>(null)
  const stageEl = useRef<HTMLDivElement>(null)
  const spacer = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const reveal = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const expandBtn = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  // Stările animațiilor stau în ref-uri: scroll-ul nu declanșează randări React.
  const progress = useRef({ p: 0 })
  const approach = useRef({ v: 1 })
  const expandedRef = useRef(false)
  const win = useRef<Window | null>(null)
  const setters = useRef<{ y?: (v: number) => void; scale?: (v: number) => void; bar?: (v: number) => void }>({})

  const [phase, setPhase] = useState<Phase>('idle')
  const [expanded, setExpanded] = useState(false)
  const [raised, setRaised] = useState(false)
  const reduced = useSyncExternalStore(subscribeReduce, getReduce, serverReduce)

  const name = p.name[locale]
  const status = live ? { idle: t.idle, loading: t.loading, ready: t.live, error: t.error }[phase] : t.static

  /** Câți pixeli are de parcurs captura statică în ramă. */
  const staticTravel = () => Math.max(0, (content.current?.offsetHeight ?? 0) - (viewport.current?.clientHeight ?? 0))

  /** Câți pixeli are de parcurs demo-ul live în propria fereastră. */
  const liveTravel = (w: Window) => Math.max(0, w.document.documentElement.scrollHeight - w.innerHeight)

  /** Aplică progresul scroll-ului: bara, contorul și poziția paginii din ramă. */
  const apply = () => {
    const { p: value } = progress.current
    setters.current.bar?.(value)
    if (counter.current) counter.current.textContent = `${Math.round(value * 100)}%`
    if (expandedRef.current) return
    if (!live) setters.current.y?.(-value * staticTravel())
    else if (win.current) {
      try {
        win.current.scrollTo({ top: value * liveTravel(win.current), behavior: 'instant' })
      } catch (error) {
        // Fereastra demo-ului nu mai e accesibilă (a navigat în altă parte sau a fost scoasă): rămâne captura.
        warn('nu pot derula demo-ul live', error)
        win.current = null
      }
    }
  }

  const applyApproach = () => {
    if (!expandedRef.current) setters.current.scale?.(0.9 + 0.1 * approach.current.v)
  }

  /** Iframe-ul e randat la lățimea unui laptop (sau a telefonului) și micșorat cât să umple rama. */
  const fit = () => {
    const vp = viewport.current
    const f = iframe.current
    if (!vp || !f) return
    const w = vp.clientWidth
    const h = vp.clientHeight
    const virtual = w < NARROW ? w : Math.max(w, DESKTOP)
    const s = w / virtual
    f.style.width = `${virtual}px`
    f.style.height = `${h / s}px`
    f.style.transform = `scale(${s})`
    // Altă înălțime a ferestrei din iframe înseamnă alt capăt al paginii: poziția se recalculează.
    if (!expandedRef.current) apply()
  }

  const { context } = useGSAP(
    () => {
      createEases()
      const mm = gsap.matchMedia()

      mm.add(media.motion, () => {
        const tr = track.current!
        const st = stageEl.current!
        const fr = frame.current!
        // Nu quickSetter(fr, 'scale'): quickSetter traduce aliasul în „scaleX,scaleY”, care nu e o proprietate de
        // transformare, deci GSAP ajunge la setAttribute('scaleX,scaleY'). Chrome-ul nou acceptă numele (și rama nu se
        // scalează deloc), dar Safari pe iOS și Chrome-ul mai vechi de pe Android aruncă InvalidCharacterError: pe telefon
        // eroarea pornește chiar la crearea ScrollTrigger-ului (rama e deja în ecran) și dărâmă pagina în ecranul de eroare Next.
        const scaleX = gsap.quickSetter(fr, 'scaleX') as (v: number) => void
        const scaleY = gsap.quickSetter(fr, 'scaleY') as (v: number) => void
        setters.current = {
          y: gsap.quickSetter(content.current!, 'y', 'px') as (v: number) => void,
          scale: (v) => {
            scaleX(v)
            scaleY(v)
          },
          bar: gsap.quickSetter(bar.current!, 'scaleX') as (v: number) => void,
        }
        const stickTop = () => parseFloat(getComputedStyle(st).top) || 0
        const extra = () => spacer.current?.offsetHeight ?? 0
        // Valoarea din CSS (pusă de React) se restaurează la curățare, nu se șterge: React nu o mai scrie la loc, iar
        // demo-ul live n-o recalculează. Altfel, după o curățare (Strict Mode în dezvoltare, schimbarea „mișcării reduse”),
        // rezerva rămânea 0 și parcurgerea sărea direct la 100%.
        const cssExtra = tr.style.getPropertyValue('--lp-extra')

        // Cât scroll ține rama fixată: proporțional cu cât are de parcurs captura, între 0,6 și 1,6 ecrane.
        // Demo-ul live păstrează valoarea din CSS (pagina lui e lungă și se încarcă mai târziu).
        const sizeTrack = () => {
          if (live) return
          const vh = window.innerHeight
          tr.style.setProperty('--lp-extra', `${Math.round(gsap.utils.clamp(vh * 0.6, vh * 1.6, staticTravel() * 1.15))}px`)
        }
        sizeTrack()
        ScrollTrigger.addEventListener('refreshInit', sizeTrack)

        // Intrarea: o singură dată, când rama ajunge în ecran.
        gsap
          .timeline({ defaults: { ease: 'lp-out' }, scrollTrigger: { trigger: st, start: 'top 90%', once: true } })
          .fromTo(fr, { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 1.4 })
          .fromTo(
            reveal.current,
            { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.14, transformOrigin: '50% 0%' },
            { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.7, clearProps: 'clipPath,transform' },
            0.2,
          )
          .fromTo(fr.querySelectorAll('[data-lp-chrome]'), { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.45)
          .fromTo(st.querySelectorAll('[data-lp-hud]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.8)

        // Apropierea: rama crește de la 90% la 100% până se fixează.
        approach.current.v = 0
        gsap.to(approach.current, {
          v: 1,
          ease: 'none',
          onUpdate: safely('apropierea ramei', applyApproach),
          scrollTrigger: { trigger: tr, start: 'top bottom', end: () => `top ${stickTop()}px`, scrub: 0.6 },
        })

        // Parcurgerea: pagina din ramă merge de sus până jos cât timp rama e fixată.
        gsap.to(progress.current, {
          p: 1,
          ease: 'none',
          onUpdate: safely('parcurgerea paginii', apply),
          scrollTrigger: { trigger: tr, start: () => `top ${stickTop()}px`, end: () => `+=${extra()}`, scrub: 0.8 },
        })

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', sizeTrack)
          tr.style.setProperty('--lp-extra', cssExtra)
          gsap.set([content.current, fr, bar.current], { clearProps: 'transform' })
          setters.current = {}
          progress.current.p = 0
          approach.current.v = 1
        }
      })
    },
    { dependencies: [live] },
  )

  // Demo-ul live se încarcă după pagină, când rama e aproape de ecran. Cu „economizor de date”, abia la deschidere.
  useEffect(() => {
    if (!live) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return
    const el = viewport.current
    if (!el) return
    let cancel = () => {}
    const load = () => setPhase((ph) => (ph === 'idle' ? 'loading' : ph))
    const start = () => {
      const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined
      if (idle) {
        const id = idle(load, { timeout: 2500 })
        cancel = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(load, 300)
        cancel = () => window.clearTimeout(id)
      }
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        if (document.readyState === 'complete') start()
        else window.addEventListener('load', start, { once: true })
      },
      { rootMargin: '50% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.removeEventListener('load', start)
      cancel()
    }
  }, [live])

  // Dacă demo-ul nu răspunde, rămâne captura, cu mesajul de eroare.
  useEffect(() => {
    if (phase !== 'loading') return
    const id = window.setTimeout(() => setPhase((ph) => (ph === 'loading' ? 'error' : ph)), 15000)
    return () => window.clearTimeout(id)
  }, [phase])

  // Iframe-ul își recalculează scara când se schimbă mărimea ramei (fereastră, extindere).
  const onResize = useEffectEvent(() => fit())
  useEffect(() => {
    if (phase === 'idle') return
    const vp = viewport.current
    if (!vp) return
    const ro = new ResizeObserver(() => onResize())
    ro.observe(vp)
    return () => ro.disconnect()
  }, [phase])

  const onFrameLoad = () => {
    try {
      const w = iframe.current!.contentWindow!
      const nav = w.performance.getEntriesByType('navigation')[0] as (PerformanceNavigationTiming & { responseStatus?: number }) | undefined
      if (!w.document.body || (nav?.responseStatus ?? 200) >= 400) throw new Error('preview unavailable')
      win.current = w
      fit()
      setPhase('ready')
      apply()
    } catch (error) {
      warn(`demo-ul live nu s-a încărcat (${preview.mode === 'live' ? preview.src : ''})`, error)
      win.current = null
      setPhase('error')
    }
  }

  // Animațiile pornite din evenimente intră în contextul GSAP al componentei, ca să fie curățate la demontare.
  const open = () => {
    if (expandedRef.current || !frame.current) return
    const fr = frame.current
    const animate = !getReduce()
    const state = animate ? Flip.getState(fr) : null
    expandedRef.current = true
    gsap.set(fr, { scale: 1 })
    flushSync(() => {
      if (live) setPhase((ph) => (ph === 'idle' ? 'loading' : ph))
      setRaised(true)
      setExpanded(true)
    })
    // Captura continuă din locul în care o lăsase scroll-ul.
    if (!live && viewport.current) {
      gsap.set(content.current, { y: 0 })
      const vp = viewport.current
      const top = progress.current.p * (vp.scrollHeight - vp.clientHeight)
      vp.scrollTop = top
      // Derularea setată aici se pierde în cadrul curent, cât rama își schimbă poziția; o reaplicăm în cadrul următor.
      requestAnimationFrame(() => {
        if (expandedRef.current) vp.scrollTop = top
      })
    }
    fit()
    closeBtn.current?.focus({ preventScroll: true })
    context.add(() => {
      if (state) {
        Flip.from(state, { duration: 0.9, ease: 'lp-in-out', scale: true })
        gsap.fromTo(backdrop.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'lp-out' })
      } else gsap.set(backdrop.current, { autoAlpha: 1 })
    })
  }

  const close = () => {
    if (!expandedRef.current || !frame.current) return
    const fr = frame.current
    const animate = !getReduce()
    const state = animate ? Flip.getState(fr) : null
    expandedRef.current = false
    flushSync(() => setExpanded(false))
    if (viewport.current) viewport.current.scrollTop = 0
    // Iframe-ul revine la mărimea ramei înainte de calcul, altfel poziția ar ține cont de fereastra mare.
    fit()
    apply()
    const done = () => {
      setRaised(false)
      if (setters.current.scale) gsap.to(fr, { scale: 0.9 + 0.1 * approach.current.v, duration: 0.4, ease: 'lp-out' })
    }
    context.add(() => {
      if (state) {
        Flip.from(state, { duration: 0.8, ease: 'lp-in-out', scale: true, onComplete: done })
        gsap.to(backdrop.current, { autoAlpha: 0, duration: 0.5, ease: 'lp-out' })
      } else {
        gsap.set(backdrop.current, { autoAlpha: 0 })
        done()
      }
    })
    // Focusul revine pe butonul care a deschis fereastra (stratul de clic dispare cât e deschisă).
    expandBtn.current?.focus({ preventScroll: true })
  }

  const onEscape = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    e.preventDefault()
    close()
  })

  // Fereastra extinsă: Escape închide, focusul rămâne în ea, pagina de dedesubt nu se derulează.
  useEffect(() => {
    if (!expanded) return
    const html = document.documentElement
    const before = { overflow: html.style.overflow, paddingRight: html.style.paddingRight }
    const gap = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    if (gap > 0) html.style.paddingRight = `${gap}px`
    // Modal real: tot ce e în afara ramei devine inert (fără focus, clicuri sau cititor de ecran), urcând din ramă
    // până la <body>. Fundalul rămâne activ, ca un clic pe el să închidă. Ce era deja inert nu e atins.
    const inerted: HTMLElement[] = []
    for (let el: HTMLElement | null = frame.current; el && el !== document.body; el = el.parentElement) {
      for (const sibling of Array.from(el.parentElement?.children ?? [])) {
        if (sibling === el || sibling === backdrop.current || !(sibling instanceof HTMLElement) || sibling.inert) continue
        sibling.inert = true
        inerted.push(sibling)
      }
    }
    const onFocus = (e: FocusEvent) => {
      if (frame.current && !frame.current.contains(e.target as Node)) closeBtn.current?.focus({ preventScroll: true })
    }
    document.addEventListener('keydown', onEscape)
    document.addEventListener('focusin', onFocus)
    return () => {
      for (const el of inerted) el.inert = false
      html.style.overflow = before.overflow
      html.style.paddingRight = before.paddingRight
      document.removeEventListener('keydown', onEscape)
      document.removeEventListener('focusin', onFocus)
    }
  }, [expanded])

  // Tastele apăsate în demo (iframe pe același domeniu) nu ajung în pagină, deci ascultăm și acolo.
  useEffect(() => {
    if (!expanded || phase !== 'ready') return
    let inner: Window | null = null
    try {
      inner = iframe.current?.contentWindow ?? null
      inner?.addEventListener('keydown', onEscape)
    } catch (error) {
      // Escape din interiorul demo-ului nu va închide fereastra; butonul „Închide” rămâne.
      warn('nu pot asculta tastele din demo', error)
      inner = null
    }
    return () => {
      try {
        inner?.removeEventListener('keydown', onEscape)
      } catch {
        // Curățare: fereastra demo-ului poate fi deja închisă sau navigată, deci nu mai e nimic de scos.
      }
    }
  }, [expanded, phase])

  const liveHref = live ? p.links.live : null
  const showOverlay = !expanded && (live || !reduced)
  const scrollable = !live && (expanded || reduced)

  return (
    <section aria-label={`${t.label}: ${name}`} className="shell">
      <div
        ref={track}
        data-lp-track
        // Rezerva de scroll în care rama stă fixată. Valoarea exactă o calculează GSAP pentru capturi.
        style={{ '--lp-extra': live ? '140svh' : '100svh' } as CSSProperties}
      >
        <div
          ref={stageEl}
          style={stage}
          className={`sticky top-[4.5rem] flex h-[calc(100svh-5.5rem)] max-h-[60rem] min-h-[28rem] flex-col p-3 sm:p-5 md:top-[5.5rem] md:h-[calc(100svh-6.5rem)] lg:p-8 ${raised ? 'z-[60]' : ''}`}
        >
          <div className="relative min-h-0 flex-1">
            <div
              ref={backdrop}
              aria-hidden="true"
              onClick={close}
              className="invisible fixed inset-0 bg-ink/90 opacity-0"
            />
            <div
              ref={frame}
              data-reveal
              {...(expanded ? { role: 'dialog', 'aria-modal': true, 'aria-label': `${t.label}: ${name}` } : {})}
              className={`flex flex-col overflow-hidden rounded-[0.625rem] border border-line-strong bg-ink-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.75)] motion-safe:opacity-0 ${
                expanded ? 'fixed inset-2 z-[1] sm:inset-4 lg:inset-x-[max(2rem,calc(50vw-48rem))] lg:inset-y-6' : 'absolute inset-0'
              }`}
            >
              {/* Bara browserului: separată de pagină, nu derulează cu ea. */}
              <div className="relative flex h-11 shrink-0 items-center gap-3 border-b border-line px-3">
                <span data-lp-chrome aria-hidden="true" className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-line-strong" />
                  <span className="size-2 rounded-full bg-line-strong" />
                  <span className="size-2 rounded-full bg-line-strong" />
                </span>
                <span
                  data-lp-chrome
                  aria-hidden="true"
                  className="mx-auto flex min-w-0 max-w-[55%] items-center gap-2 rounded-sm bg-ink-3 px-3 py-1 font-mono text-[0.6875rem] text-faint"
                >
                  <StatusDot live={live} phase={phase} />
                  <span className="truncate">{live ? preview.src : name}</span>
                </span>
                <span data-lp-chrome className="flex items-center gap-1">
                  {liveHref && (
                    <Link
                      href={liveHref}
                      prefetch={false}
                      aria-label={t.open}
                      title={t.open}
                      className="grid size-9 place-items-center text-mist transition-colors hover:text-paper"
                    >
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </Link>
                  )}
                  {expanded ? (
                    <button
                      ref={closeBtn}
                      type="button"
                      onClick={close}
                      className="flex min-h-9 items-center gap-2 px-2 text-[0.8125rem] text-paper transition-colors hover:text-ember"
                    >
                      <X aria-hidden="true" className="size-4" />
                      <span>{t.close}</span>
                    </button>
                  ) : (
                    <button
                      ref={expandBtn}
                      type="button"
                      onClick={open}
                      aria-haspopup="dialog"
                      aria-label={t.expandLabel}
                      className="flex min-h-9 items-center gap-2 px-2 text-[0.8125rem] text-mist transition-colors hover:text-paper"
                    >
                      <Maximize2 aria-hidden="true" className="size-3.5" />
                      <span className="hidden sm:inline">{t.expand}</span>
                    </button>
                  )}
                </span>
                <span ref={bar} aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-ember" />
              </div>

              <div
                ref={viewport}
                {...(scrollable ? { tabIndex: 0, role: 'region', 'aria-label': preview.mode === 'static' ? preview.alt[locale] : name } : {})}
                className={`relative min-h-0 flex-1 ${live ? 'bg-[#f3ede3]' : 'bg-white'} ${scrollable ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden'}`}
              >
                <div ref={reveal} className={live ? 'absolute inset-0' : undefined}>
                  <div ref={content}>
                    {preview.mode === 'static' ? (
                      <Capture desktop={preview.desktop} mobile={preview.mobile} alt={preview.alt[locale]} />
                    ) : (
                      p.cover && (
                        <Capture
                          desktop={p.cover}
                          mobile={p.secondary?.frame === 'phone' ? p.secondary : undefined}
                          alt={p.cover.alt[locale]}
                        />
                      )
                    )}
                  </div>
                  {live && phase !== 'idle' && (
                    <iframe
                      ref={iframe}
                      src={preview.src}
                      title={`${t.iframe}: ${name}`}
                      onLoad={onFrameLoad}
                      sandbox={SANDBOX}
                      inert={!expanded}
                      tabIndex={expanded ? 0 : -1}
                      referrerPolicy="same-origin"
                      className={`absolute left-0 top-0 origin-top-left border-0 bg-[#f3ede3] transition-opacity duration-700 ${
                        phase === 'ready' ? 'opacity-100' : 'opacity-0'
                      } ${expanded ? '' : 'pointer-events-none'}`}
                    />
                  )}
                </div>
                {showOverlay && (
                  // Pe mouse și pe touch, un clic sau o atingere pe previzualizare o deschide. Pentru tastatură e butonul din bară.
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    data-cursor={t.cursor}
                    onClick={open}
                    className="absolute inset-0 z-10 cursor-zoom-in"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-4 pt-3 t-label lg:pt-5">
            <p data-lp-hud aria-live="polite" className="flex min-w-0 items-center gap-2 text-paper">
              <StatusDot live={live} phase={phase} />
              <span>{status}</span>
            </p>
            <p data-lp-hud className="hidden text-mist md:block">
              {reduced ? t.hintReduced : t.hint}
            </p>
            <p data-lp-hud aria-hidden="true" className="tabular-nums text-faint motion-reduce:hidden">
              <span ref={counter}>0%</span>
            </p>
          </div>
        </div>
        {/* Un element, nu padding: sticky rămâne în interiorul conținutului părintelui, nu și în padding. */}
        <div ref={spacer} aria-hidden="true" className="motion-safe:h-[var(--lp-extra)]" />
      </div>
      {preview.mode === 'static' && preview.note && <p className="mt-4 t-label text-faint">{preview.note[locale]}</p>}
    </section>
  )
}

function StatusDot({ live, phase }: { live: boolean; phase: Phase }) {
  const tone = !live ? 'bg-mist' : phase === 'ready' ? 'animate-pulse-dot bg-ember' : phase === 'error' ? 'bg-smoke' : 'bg-faint'
  return <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${tone}`} />
}

/** Captura, cu varianta de telefon sub 640 px. Lățimea și înălțimea rezervă locul înainte de încărcare. */
function Capture({ desktop, mobile, alt }: { desktop: PageCapture; mobile?: PageCapture; alt: string }) {
  const common = { alt, quality: 85, sizes: '(min-width: 1440px) 1300px, 92vw', loading: 'eager', fetchPriority: 'high' } as const
  const d = getImageProps({ ...common, ...desktop }).props
  if (!mobile) {
    // Optimizată tot de Next (getImageProps); <img> simplu doar ca să aibă aceeași structură ca varianta cu <picture>.
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...d} alt={alt} className="block h-auto w-full" />
  }
  const m = getImageProps({ ...common, ...mobile }).props
  return (
    <picture>
      <source media="(min-width: 640px)" srcSet={d.srcSet} sizes={d.sizes} width={desktop.width} height={desktop.height} />
      <img {...m} alt={alt} className="block h-auto w-full" />
    </picture>
  )
}
