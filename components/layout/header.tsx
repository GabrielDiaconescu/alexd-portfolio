'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dictionary } from '@/content/dictionary'
import { type Locale, otherLocale, paths, translatePath } from '@/lib/i18n'
import { ease, stagger, transition } from '@/lib/motion'
import { ArrowSwap, buttonClass } from '@/components/ui/button'

type Props = {
  locale: Locale
  nav: Dictionary['nav']
  emails: readonly string[]
  phone: { href: string; label: string }
}

const sections = ['work', 'services', 'about', 'contact'] as const

export function Header({ locale, nav, emails, phone }: Props) {
  const pathname = usePathname()
  const isHome = pathname === paths.home(locale)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Antetul se retrage la scroll în jos și revine la scroll în sus.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    // Cât timp focusul e în antet, nu îl retragem (WCAG 2.4.11).
    const focused = headerRef.current?.contains(document.activeElement) ?? false
    setHidden(y > 480 && y > prev + 4 && !focused)
    if (y < prev - 4) setHidden(false)
  })

  const closeMenu = useCallback(() => setOpen(false), [])

  // Secțiunea activă, pentru indicatorul din navigație.
  useEffect(() => {
    if (!isHome) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of [...sections, 'intro', 'process', 'trust', 'faq']) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [isHome])

  const links = sections.map((id) => ({ id, label: nav[id], href: paths.section(locale, id) }))
  const alt = otherLocale(locale)

  return (
    <>
      <motion.header
        ref={headerRef}
        onFocusCapture={() => setHidden(false)}
        initial={false}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease: ease.out }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
          scrolled || open ? 'border-line bg-ink/75 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <Link href={paths.home(locale)} aria-label={nav.home} className="hit group flex items-baseline gap-2">
            <span className="whitespace-nowrap font-display text-[1.625rem] leading-none tracking-[-0.02em]">
              Alex D<span className="text-ember">.</span>
            </span>
          </Link>

          <nav aria-label={nav.menu} className="hidden md:block">
            <ul className="nav-pill flex items-center gap-0.5 p-1">
              {links.map((l) => (
                <li key={l.id}>
                  <Link
                    href={l.href}
                    className="relative block rounded-full px-4 py-2 text-[0.9375rem] text-mist transition-colors hover:text-paper aria-[current=true]:text-paper"
                    aria-current={active === l.id ? 'true' : undefined}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full bg-paper/[0.08]"
                        transition={transition.spring}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Limba curentă în hârtie, cealaltă în mist (7,9:1); tot linkul duce la cealaltă limbă. */}
            <Link
              href={translatePath(pathname, alt)}
              hrefLang={alt}
              lang={alt}
              aria-label={nav.switchTo}
              className="hit t-label whitespace-nowrap text-mist transition-colors hover:text-paper"
            >
              <span className={locale === 'ro' ? 'text-paper' : ''}>RO</span>
              <span aria-hidden="true" className="mx-1.5 text-faint">
                /
              </span>
              <span className={locale === 'en' ? 'text-paper' : ''}>EN</span>
            </Link>
            <div className="hidden sm:block">
              <Link href={paths.section(locale, 'contact')} className={buttonClass('primary', '!min-h-11 !px-5 !text-sm')}>
                <span>{nav.cta}</span>
                <ArrowSwap />
              </Link>
            </div>
            <MenuButton open={open} onToggle={() => setOpen((o) => !o)} nav={nav} />
          </div>
        </div>
      </motion.header>

      <MobileMenu open={open} onClose={closeMenu} locale={locale} nav={nav} links={links} emails={emails} phone={phone} />
    </>
  )
}

function MenuButton({ open, onToggle, nav }: { open: boolean; onToggle: () => void; nav: Dictionary['nav'] }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? nav.close : nav.menu}
      className="relative grid size-11 place-items-center md:hidden"
    >
      <span className="sr-only">{open ? nav.close : nav.menu}</span>
      <span aria-hidden="true" className="relative block h-3 w-6">
        <span
          className={`absolute left-0 h-px w-full bg-paper transition-transform duration-500 ease-[var(--ease-out-expo)] ${
            open ? 'top-1.5 rotate-45' : 'top-0'
          }`}
        />
        <span
          className={`absolute left-0 h-px w-full bg-paper transition-transform duration-500 ease-[var(--ease-out-expo)] ${
            open ? 'top-1.5 -rotate-45' : 'top-3'
          }`}
        />
      </span>
    </button>
  )
}

type MenuProps = {
  open: boolean
  onClose: () => void
  locale: Locale
  nav: Dictionary['nav']
  links: { id: string; label: string; href: string }[]
  emails: readonly string[]
  phone: { href: string; label: string }
}

function MobileMenu({ open, onClose, locale, nav, links, emails, phone }: MenuProps) {
  const panel = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    onClose()
    document.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]')?.focus()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    // preventScroll: linkul e încă sub marginea rândului lui (animația pornește de la y: 100%), iar focusul
    // simplu derula rândul (overflow: hidden) ca să-l arate. Pe iPhone Safari „Proiecte” lipsea câteva secunde.
    panel.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close()
      if (e.key !== 'Tab' || !panel.current) return
      // Focusul rămâne în meniu și pe butonul care îl închide.
      const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]')
      const items = [...panel.current.querySelectorAll<HTMLElement>('a, button'), ...(toggle ? [toggle] : [])]
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const onResize = () => window.innerWidth >= 768 && onClose()
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      root.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open, close, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={nav.menu}
          // Doar opacity + transform (compozitate pe GPU) și pornire imediată: meniul răspunde instant la atingere.
          // Un clip-path animat pe tot ecranul se redesena la fiecare cadru și întârzia pe telefoanele mai slabe.
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: ease.out } }}
          exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease: ease.out } }}
          className="fixed inset-0 z-40 flex flex-col bg-ink pt-16 md:hidden"
        >
          <nav aria-label={nav.menu} className="shell flex flex-1 flex-col justify-center">
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: stagger.tight, delayChildren: 0.05 } } }}
              className="border-t border-line"
            >
              {links.map((l, i) => (
                <li key={l.id} className="overflow-hidden border-b border-line">
                  <motion.div
                    variants={{ hidden: { y: '100%' }, show: { y: '0%', transition: { duration: 0.45, ease: ease.out } } }}
                  >
                    {/* Mărimea t-h2 de pe telefon (32px): meniul rămâne echilibrat și încape fără scroll pe 360x640. */}
                    <Link href={l.href} onClick={onClose} className="flex items-baseline justify-between py-4">
                      <span className="font-display text-[2rem] leading-none tracking-[-0.015em]">{l.label}</span>
                      <span className="t-label text-faint">0{i + 1}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </motion.ul>
          </nav>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.3 } }}
            className="shell flex flex-col gap-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <Link href={paths.section(locale, 'contact')} onClick={onClose} className={buttonClass('primary', 'w-full')}>
              <span>{nav.cta}</span>
              <ArrowSwap />
            </Link>
            <ul className="flex flex-col">
              {emails.map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`} className="inline-block py-3 font-mono text-sm text-mist">
                    {e}
                  </a>
                </li>
              ))}
              <li>
                <a href={phone.href} className="inline-block py-3 font-mono text-sm text-mist">
                  {phone.label}
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
