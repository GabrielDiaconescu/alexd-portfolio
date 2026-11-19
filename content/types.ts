import type { Localized } from '@/lib/i18n'

export type Img = {
  src: string
  width: number
  height: number
  alt: Localized
}

export type Shot = Img & {
  /** Cum se afișează: într-o ramă de browser, de telefon, sau liber (fotografie). */
  frame: 'browser' | 'phone' | 'none'
  caption?: Localized
}

/** O pagină întreagă, capturată de sus până jos. */
export type PageCapture = { src: string; width: number; height: number }

/**
 * Previzualizarea din studiul de caz: pagina se parcurge într-o ramă de browser, odată cu scroll-ul.
 *  - `live`: pagina rulează în portofoliu (același domeniu) și se încarcă într-un iframe;
 *    până se încarcă, se vede `cover` (și `secondary` pe telefon);
 *  - `static`: captura paginii întregi, pentru proiectele care nu au un site public de încorporat.
 */
export type Preview =
  | { mode: 'live'; src: string }
  | { mode: 'static'; desktop: PageCapture; mobile?: PageCapture; alt: Localized; note?: Localized }

export type ProjectKind = 'demo' | 'client' | 'product'

/** Compoziții tipografice pentru proiectele fără capturi (components/ui/poster.tsx). */
export type PosterId = 'barbershop'

export type Project = {
  slug: string
  name: Localized
  /** Eticheta onestă despre natura proiectului: client, concept sau produs propriu. */
  kind: ProjectKind
  kindLabel: Localized
  year: string
  /** Data ultimei modificări (AAAA-LL-ZZ), pentru sitemap. */
  updated: string
  category: Localized
  services: Localized<string[]>
  tags: string[]
  summary: Localized
  /** Problema sau scopul proiectului, pe scurt (pagina principală). */
  problem: Localized
  /** Principalele funcționalități: lista scurtă din pagina principală. */
  highlights: Localized<string[]>
  /** Culoarea proiectului, folosită discret în hover și în studiul de caz. */
  accent: string
  /** Captura principală. Fără ea, proiectul folosește `poster`. */
  cover?: Shot
  poster?: PosterId
  /** A doua imagine pentru compoziția din listă (de obicei varianta de mobil). */
  secondary?: Shot
  /** Previzualizarea derulabilă din studiul de caz. Fără ea, studiul de caz arată `cover`. */
  preview?: Preview
  links: { live: string | null; repo: string | null }
  caseStudy: {
    context: Localized
    challenge: Localized
    objectives: Localized<string[]>
    role: Localized<string[]>
    direction: Localized
    process: { title: Localized; body: Localized }[]
    decisions: { title: Localized; body: Localized }[]
    gallery: Shot[]
    stack: string[]
    /** Doar fapte verificabile. Rezultatele de business se adaugă doar cu date reale. */
    outcomes: Localized<string[]>
    outcomesNote?: Localized
  }
}

export type Testimonial = {
  quote: Localized
  name: string
  role: Localized
  company?: string
  /** Linkul către proiectul despre care vorbește clientul (slug). */
  project?: string
  /** Confirmă că persoana a acceptat publicarea, altfel nu apare pe site. */
  consent: boolean
}
