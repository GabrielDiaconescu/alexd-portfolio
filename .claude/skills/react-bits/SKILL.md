---
name: react-bits
description: React Bits (reactbits.dev) animated components in this Next.js site (alexd-portfolio): how to pick a component, add it, check its dependencies, keep it fast and accessible. Use when the user asks for an animated text/background/UI effect from React Bits.
license: MIT
---

# React Bits

> Scris de Claude din documentația publică reactbits.dev. Nu e un skill oficial. Comenzile exacte de instalare diferă pe fiecare componentă: se copiază de pe pagina ei, nu din memorie.

## Ce e
Bibliotecă de componente React animate (texte, fundaluri, animații, componente UI), **copiate în proiect** (cod propriu, nu pachet npm). Fiecare componentă există în 4 variante: JS sau TS, CSS sau Tailwind. Aici se folosește **TS + Tailwind**.

## Starea proiectului
- Next.js (App Router), React 19, Tailwind 4, `gsap` + `@gsap/react`, `motion` deja instalate.
- Nu există `components.json` (shadcn), deci instalarea prin registry shadcn nu e configurată; se poate copia codul manual sau configura registry-ul, la cererea proprietarului.
- Nu se adaugă componente sau dependențe fără acordul proprietarului: schimbă codul și package.json, deci cere build și republicare.

## Cum se adaugă o componentă
1. Se alege componenta pe reactbits.dev și se citește pagina ei (props, dependențe).
2. Se verifică dependențele: multe folosesc `gsap`, `motion`, `ogl` sau `three`. Cele grele (WebGL: `ogl`, `three`) se evită pe pagini critice pentru viteză și pe mobil.
3. Instalare, în ordinea preferinței:
   - copiere manuală a codului TS + Tailwind în `components/` (sub `components/ui/` sau `components/fx/`), cu stilurile adaptate la tokenii site-ului;
   - sau CLI-ul documentat pe pagina componentei (shadcn registry `@react-bits/...` ori jsrepo), după ce proiectul e pregătit pentru el.
4. Componentele cu stare, evenimente sau animații sunt Client Components: `'use client'` doar pe frunza care are nevoie.

## Reguli pentru acest site
- **Mișcare redusă:** orice efect respectă `prefers-reduced-motion: reduce` (fără animație sau variantă statică).
- **Performanță:** fără efecte continue în afara ecranului (pauză la ieșirea din viewport), fără `requestAnimationFrame` care rulează mereu; măsurat pe telefon, nu doar pe desktop.
- **Accesibilitate:** textul animat rămâne text real, citibil de cititoarele de ecran (nu litere împrăștiate fără etichetă); contrast și focus neafectate.
- **Consecvență:** culorile, fonturile și ritmul vin din designul existent al site-ului, nu din demo-ul React Bits.
- **GSAP:** dacă o componentă folosește `gsap`, se aplică regulile din skill-urile `gsap-*` (cleanup cu `useGSAP`, `gsap.matchMedia()`).
- **Licență:** React Bits e MIT pentru varianta gratuită; componentele Pro cer acces separat și nu se copiază fără el.
