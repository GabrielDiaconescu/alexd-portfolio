# Alex D. · Portofoliu

Portofoliul lui Diaconescu Alexandru (Alex D.): web design, development și motion. Bilingv (română / engleză), cu trei studii de caz ale unor **proiecte demonstrative** și un formular de proiect care nu pretinde niciodată că a trimis o cerere care nu a plecat.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion for React · GSAP 3.15 (ScrollTrigger, SplitText) · Lucide. Fără CMS, fără analiză, fără cookie-uri.

## Rulare

Cerințe: Node.js 20.9 sau mai nou (testat pe Node 24).

```bash
npm install
npm run dev        # http://localhost:3000 → te trimite la /ro sau /en după limba browserului
```

| Comandă | Ce face |
| --- | --- |
| `npm run dev` | Server de dezvoltare cu reîncărcare automată |
| `npm run build` | Build de producție (verifică și tipurile) |
| `npm start` | Pornește build-ul de producție |
| `npm run lint` | ESLint (reguli Next.js + accesibilitate) |
| `npm run typecheck` | Generează tipurile rutelor și rulează `tsc` |
| `npm run check` | Toate trei: lint + typecheck + build |

## Unde schimbi conținutul

Tot ce apare pe site stă în `content/`. Componentele nu conțin texte.

| Fișier | Conține |
| --- | --- |
| `content/site.ts` | Nume, rol, e-mailuri, linkuri sociale, date firmă, data politicii |
| `content/dictionary.ts` | Toate textele scurte ale interfeței, RO și EN (meniu, titluri, formular, mesaje) |
| `content/projects.ts` | Proiectele și studiile de caz. Ordinea din listă = ordinea pe site |
| `content/services.ts` | Cele trei servicii |
| `content/about.ts` | Prezentarea, felul de lucru, competențe, unelte, fotografia |
| `content/process.ts` | Etapele colaborării |
| `content/trust.ts` | Recenzii (goale deocamdată) și standardele de lucru |
| `content/faq.ts` | Întrebări frecvente |
| `content/privacy.ts` | Politica de confidențialitate |

**Titlurile cu accent:** cuvintele puse `*între steluțe*` apar în italic, în culoarea de accent.

**Proiect nou:**
1. Pune imaginile în `public/work/<slug>/`.
2. Copiază un bloc din `content/projects.ts` și schimbă-i slug-ul.
3. Pagina lui apare automat la `/ro/proiecte/<slug>` și `/en/work/<slug>`, în sitemap și în navigarea anterior/următor.

**Recenzie nouă:** adaug-o în `content/trust.ts`, cu `consent: true` doar după ce persoana a acceptat publicarea. Secțiunea apare singură.

## Formularul de proiect

`POST /api/inquiry` (`app/api/inquiry/route.ts`) face următoarele:
- validează datele pe server, cu aceleași reguli ca în browser (`lib/inquiry.ts`);
- verifică originea cererii, are un câmp-capcană pentru roboți și o limită de 5 cereri la 10 minute pe IP;
- trimite e-mailul prin Resend, cu un simplu `fetch`, fără bibliotecă.

**Până configurezi Resend**, formularul îi spune vizitatorului că nu e activ și îi deschide un e-mail precompletat către adresa ta. Nu afișează „trimis”.

Configurare, o singură dată:
1. Creează un cont pe [resend.com](https://resend.com) și verifică domeniul (înregistrări DNS SPF/DKIM).
2. Creează o cheie API cu „Sending access”.
3. Copiază `.env.example` în `.env.local` și completează:
   - `NEXT_PUBLIC_SITE_URL`: adresa finală, de exemplu `https://alexd.ro`
   - `RESEND_API_KEY`
   - `INQUIRY_FROM_EMAIL`: expeditorul, pe domeniul verificat, de exemplu `Site Alex D. <formular@alexd.ro>`
   - `INQUIRY_TO_EMAIL`: unde primești cererile
4. Trimite o cerere de test și verifică și dosarul Spam.

## Publicare (Vercel) și domeniu

1. Urcă proiectul într-un repository GitHub (privat sau public).
2. Pe [vercel.com](https://vercel.com): „Add New → Project” și alege repository-ul. Setările implicite pentru Next.js sunt corecte.
3. Adaugă variabilele de mediu de mai sus în „Settings → Environment Variables”, apoi redeploy.
4. **Domeniul:**
   - În „Settings → Domains”, adaugă `alexd.ro`.
   - La firma de la care ai cumpărat domeniul, pune înregistrările indicate de Vercel: de obicei un `A` pentru domeniul principal și un `CNAME` pentru `www`.
   - Certificatul HTTPS se emite automat după propagarea DNS.
5. Verifică apoi `https://domeniul-tau/sitemap.xml`, `/robots.txt` și o previzualizare de link (de exemplu în LinkedIn Post Inspector).

> **Atenție la plan:** planul gratuit Hobby de la Vercel este pentru uz necomercial. Pentru un site prin care vinzi servicii, verifică termenii; probabil ai nevoie de Pro sau de altă găzduire Node.js (Netlify, VPS).

Site-ul are nevoie de o găzduire care rulează Node.js, din cauza formularului și a redirecționării după limbă. Restul paginilor sunt generate static.

## Ce mai ai de completat

| Ce | Unde |
| --- | --- |
| **Fotografia de pe LinkedIn.** LinkedIn nu permite descărcarea automată. Salvează poza ca `public/about/alex.jpg` și completează `portrait` | `content/about.ts` → `portrait` |
| Verifică datele PFA pe certificatul ONRC; au fost preluate de pe in-balanta.ro | `content/site.ts` → `company` |
| Link live pentru demo-uri, dacă le publici | `links.live` în `content/projects.ts` |
| Textul despre tine: verifică ce am preluat din vechiul portofoliu (studii, AI) | `content/about.ts`, `content/faq.ts` |
| Contul GitHub: preluat din vechiul `site.config.json`; șterge-l dacă nu-l vrei | `content/site.ts` → `socials` |
| Politica de confidențialitate: găzduirea, durata de păstrare, aprobarea | `content/privacy.ts`, apoi `site.privacyUpdated` |
| Intervalele de buget din formular (nu sunt prețurile tale) | `content/dictionary.ts` → `form.budgets` |
| Răspunsurile din FAQ: ajustează-le după cum lucrezi efectiv | `content/faq.ts` |
| Recenzii reale, cu acord | `content/trust.ts` |
| Contul Resend și variabilele de mediu | secțiunea „Formularul de proiect” |

## Decizii de design și tehnice

- **Direcția „Cadru”:** cerneală caldă (`#0D0D0B`), hârtie (`#F1EDE4`) și un singur accent („jar”, `#FF6A3D`). Tipografia: Instrument Serif pentru titluri, Inter Tight pentru text, JetBrains Mono pentru etichete și indexuri. Un singur capitol pe fundal deschis (Procesul), pentru ritm editorial. Contrastele sunt calculate în `app/globals.css`.
- **Hero 3D fără WebGL:** capturile reale ale celor trei proiecte, în perspectivă CSS 3D. Se înclină după mouse; pe ecrane tactile și la „mișcare redusă” rămân statice.
- **Sistemul de mișcare** e într-un singur loc (`lib/motion.ts`): durate, curbe, stagger. Se animă doar `transform`, `opacity` și `clip-path`. La `prefers-reduced-motion` dispar mișcarea, parallax-ul și măștile, din CSS, deci și înainte de hidratare.
- **Demo-ul frizeriei rulează în portofoliu**, la `/demo/frizerie`:
  - **Ce e:** frizeria fictivă „Briciul”, cu date de exemplu; nimic nu se trimite.
  - **Cod:** `app/demo/` are root layout-ul ei, cu alt sistem vizual și `noindex`. Componentele sunt în `components/demo/barber/`, iar datele (servicii, prețuri, program) în `components/demo/barber/data.ts`.
  - **Linkuri:** către și dinspre demo au `prefetch={false}`. Navigarea între root layouts reîncarcă pagina, iar prefetch-ul ar aduce fonturile celuilalt site.
- **Proiectele sunt demonstrative.** Toate trei sunt marcate „Proiect demonstrativ”, iar cifrele din studiile de caz sunt măsurători tehnice, nu rezultate de business. Un proiect fără capturi poate folosi o compoziție tipografică în culorile lui (`components/ui/poster.tsx`, câmpul `poster` din `content/projects.ts`).
- **Împărțirea Motion / GSAP:**
  - **Motion:** interfața, adică aparițiile, hover-ul, meniul, formularul, hero-ul 3D și măștile imaginilor.
  - **GSAP (`lib/gsap.ts`):** efectele de scroll în care aduce ceva în plus:

  | Efect | Fișier | Ce folosește din GSAP |
  | --- | --- | --- |
  | Manifestul fixat, cu cuvinte care se aprind | `components/home/manifesto.tsx` | SplitText (cuvinte) + ScrollTrigger (pin + scrub) |
  | Banda „pentru cine lucrez”, care accelerează, își schimbă sensul și se înclină după viteza scroll-ului | `components/home/marquee.tsx` | `gsap.ticker`, `ScrollTrigger.getVelocity()`, `quickTo`, `quickSetter` |
  | Procesul ca traseu orizontal fixat, cu contor și bară de progres (desktop) | `components/home/process.tsx` | ScrollTrigger (pin + scrub), `containerAnimation` pentru conținutul fiecărui pas |
  | Ieșirea din hero: titlul urcă, compoziția 3D se retrage | `components/home/hero-exit.tsx` | ScrollTrigger (scrub) |
  | Wordmark-ul din subsol, literă cu literă | `components/layout/wordmark.tsx` | SplitText (litere, cu mască) + ScrollTrigger |
  | Previzualizarea din studiile de caz: site-ul se parcurge într-o ramă de browser, odată cu scroll-ul, și se poate deschide pe tot ecranul | `components/case/live-preview.tsx` | timeline + CustomEase (intrarea), ScrollTrigger cu scrub (apropierea și parcurgerea), Flip (extinderea) |

  Toate folosesc `gsap.matchMedia()`: la „mișcare redusă” nu există pin și nicio animație, iar Procesul devine o listă verticală. `useGSAP` face curățenia la schimbarea paginii.
- **Previzualizările din studiile de caz** (câmpul `preview` din `content/projects.ts`):
  - **Frizeria (`live`):** demo-ul real, într-un iframe pe același domeniu. Doar `/demo/*` poate fi încadrat, și doar de site-ul însuși (`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN` în `next.config.ts`). Se încarcă după pagină; până atunci și dacă nu se încarcă se vede captura, cu mesajul potrivit.
  - **Spălătoria (`static`):** site-ul nu e publicat, deci se vede o captură a paginii principale, marcată „Captură statică”. Capturile (`public/work/truck-wash/page-*.jpg`) sunt făcute din build-ul de producție al proiectului, fără subsol (conține datele de contact ale firmei) și fără butoanele fixe.
  - **CodeSprint:** e o aplicație mobilă, nu un site, deci păstrează imaginea obișnuită.
  - **Cum funcționează:** rama stă fixată cu CSS `sticky`, fără pin. Distanța parcursă vine din înălțimea reală a capturii sau a paginii din iframe. Pe tot ecranul, demo-ul se poate folosi, iar Escape închide fereastra.
  - **Proiect nou:** pentru o captură, fă imaginea paginii întregi la 1440 px (desktop) și 390 px (telefon) și adaug-o ca `preview: { mode: 'static', ... }`.
- **Fără `scroll-behavior: smooth` în CSS:** interferează cu ScrollTrigger. Derularea lină la ancore e în `components/layout/smooth-anchors.tsx`.
- **Cursorul-etichetă** apare doar cu mouse și fără „mișcare redusă”, iar cursorul nativ rămâne vizibil.
- **Fără JavaScript**, conținutul animat e afișat direct (`<noscript>` în layout).
- **Securitate:** CSP, HSTS, X-Frame-Options, Referrer-Policy și Permissions-Policy, în `next.config.ts`.
- **Next 16.4:** dacă `generateStaticParams` dintr-un segment copil întoarce o listă goală pentru una dintre limbi, Next renunță la toate paginile rutei. De aceea, rutele de studii de caz generează slug-urile pentru ambele limbi, iar combinațiile greșite dau 404 din pagină. Comentariul e în `components/case/route.tsx`.
