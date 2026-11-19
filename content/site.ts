import type { Locale, Localized } from '@/lib/i18n'

/**
 * În producție, lipsa NEXT_PUBLIC_SITE_URL oprește build-ul: altfel canonical-urile și sitemap-ul
 * ar pleca cu localhost. În dezvoltare și în teste rămâne adresa locală.
 */
function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url) return url
  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SITE_URL lipsește. Seteaz-o (ex. în .env.production) înainte de build.')
  }
  return 'http://localhost:3000'
}

/**
 * Datele tale, într-un singur loc. Tot site-ul citește de aici.
 * Câmpurile goale ('') sau null nu apar pe site.
 */
export const site = {
  brand: 'Alex D.',
  fullName: 'Diaconescu Alexandru',
  /** Numele afișat în prima pagină, în ordinea prenume–nume. */
  displayName: 'Alexandru Diaconescu',
  role: {
    ro: 'Dezvoltator web',
    en: 'Web developer',
  } satisfies Localized,
  /** Apar la fel în ambele limbi (prima pagină, subsol): doar termeni care nu se traduc. */
  disciplines: ['Web design', 'Next.js', 'SEO'],

  /** Adresa finală a site-ului. Setează NEXT_PUBLIC_SITE_URL la publicare. */
  url: siteUrl(),

  /** Data ultimei modificări de conținut (AAAA-LL-ZZ), pentru sitemap. Schimb-o când editezi textele. */
  updated: '2026-11-15',

  /** Singura adresă de contact, folosită în ambele limbi (contact, subsol, meniu, formular). */
  email: {
    ro: 'contact@alexd.ro',
    en: 'contact@alexd.ro',
  } satisfies Localized,
  emails: ['contact@alexd.ro'],

  /** Telefonul: afișat în format local (RO) sau internațional (EN); linkul tel: e mereu internațional. */
  phone: {
    display: { ro: '0749 113 164', en: '+40 749 113 164' } satisfies Localized,
    href: 'tel:+40749113164',
    e164: '+40749113164',
  },

  location: {
    ro: 'Remote · clienți din Pitești, Argeș, din toată România și din străinătate',
    en: 'Remote · working with clients in Pitești, Argeș, across Romania and abroad',
  } satisfies Localized,
  languages: { ro: 'Română · Engleză', en: 'Romanian · English' } satisfies Localized,

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexandru-gabriel-diaconescu-49a5a9261/' },
    // Preluat din vechiul tău portofoliu (site.config.json). Șterge rândul dacă nu vrei să apară.
    { label: 'GitHub', href: 'https://github.com/GabrielDiaconescu' },
  ],

  /**
   * Datele PFA-ului, cerute de Legea 365/2002 când vinzi servicii online.
   * Preluate de pe in-balanta.ro (agregator). Verifică-le pe certificatul ONRC; nr. de registru e
   * afișat acolo în formatul nou (fără „F03/…”). Gol = nu apare.
   */
  company: {
    name: 'Diaconescu Alexandru-Gabriel PFA',
    legalName: 'DIACONESCU ALEXANDRU-GABRIEL PERSOANĂ FIZICĂ AUTORIZATĂ',
    cui: '55757830',
    registry: 'F2026047454004',
    address: 'Făcălețești nr. 74, jud. Argeș',
  },
  vat: { ro: 'Neplătitor de TVA', en: 'Not VAT registered' } satisfies Localized,

  /** [DE COMPLETAT] Data la care ai citit și aprobat politica de confidențialitate. Gol = nu apare. */
  privacyUpdated: { ro: '', en: '' } satisfies Localized,

  /** Data ultimei modificări a termenilor și condițiilor (content/terms.ts). */
  termsUpdated: { ro: '16 noiembrie 2026', en: '16 November 2026' } satisfies Localized,
} as const

export function emailFor(locale: Locale) {
  return site.email[locale]
}
