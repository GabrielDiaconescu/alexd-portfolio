---
name: lenis
description: Lenis smooth scroll in this Next.js site (alexd-portfolio): install, React provider, sync with GSAP ScrollTrigger, anchors, reduced motion. Use when the user asks for smooth/inertial scrolling or scroll-linked animation with Lenis.
license: MIT
---

# Lenis (smooth scroll)

> Scris de Claude din documentația publică Lenis (github.com/darkroomengineering/lenis). Nu e un skill oficial: verifică API-ul față de versiunea instalată înainte să te bazezi pe el.

## Starea proiectului
- Lenis **nu e instalat** (nu e în package.json). Site-ul folosește `gsap` + `@gsap/react`, `motion`, Tailwind 4.
- Derularea la ancore e făcută de `components/layout/smooth-anchors.tsx`, care a înlocuit `scroll-behavior: smooth` tocmai pentru că acesta strică ScrollTrigger. Dacă se adaugă Lenis, ancorele trec pe `lenis.scrollTo()` și `SmoothAnchors` se scoate. Nu rămân amândouă.
- Nu se instalează nimic fără acordul proprietarului: schimbă package.json, deci cere build și republicare.

## Instalare
```bash
npm i lenis
```
Stiluri recomandate de Lenis (o dată, în layout): `import 'lenis/dist/lenis.css'`.

## React (App Router)
Componentă client, montată o singură dată (de ex. în layout):
```tsx
'use client'
import { ReactLenis } from 'lenis/react'
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <ReactLenis root options={{ autoRaf: false }}>{children}</ReactLenis>
}
```
- `root` = derulează pagina (nu un container).
- `autoRaf: false` când se sincronizează cu GSAP (vezi mai jos); altfel `autoRaf: true`.
- Instanța: `useLenis()` (hook) sau `ref.current?.lenis` pe `ReactLenis`.

## Sincronizare cu GSAP ScrollTrigger
Un singur ceas: GSAP conduce Lenis.
```ts
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ autoRaf: false })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```
La curățare (unmount): `gsap.ticker.remove(...)` pentru aceeași funcție și `lenis.destroy()`.

## Ancore și poziționare
```ts
lenis.scrollTo('#contact', { offset: -80, duration: 1.2 })
lenis.scrollTo(0, { immediate: true }) // salt instant
```
Oprire/pornire (meniu mobil deschis, dialoguri): `lenis.stop()` / `lenis.start()`.

## Reguli pentru acest site
- **Mișcare redusă:** la `prefers-reduced-motion: reduce` nu se pornește Lenis (derulare nativă) și ancorele sar instant, ca acum.
- Elementele cu derulare internă (liste, modale) primesc `data-lenis-prevent`.
- Nu se combină cu `scroll-behavior: smooth` din CSS.
- Atenție la performanță pe telefoane: se testează cu emulatorul și pe un dispozitiv real înainte de publicare.
- Meniul mobil blochează `<html>` cu `overflow: hidden`: acolo se folosește `lenis.stop()`, nu se contrazic cele două mecanisme.
