import type { Localized } from '@/lib/i18n'
import type { Testimonial } from './types'

/**
 * Recenzii reale, doar cu acordul autorului (consent: true). Cât timp lista e goală,
 * secțiunea de recenzii nu apare. Nu adăuga citate inventate sau parafrazate.
 *
 * Exemplu de format:
 * {
 *   quote: { ro: '…', en: '…' },
 *   name: 'Prenume Nume',
 *   role: { ro: 'Administrator', en: 'Managing director' },
 *   company: 'Firma SRL',
 *   project: 'truck-wash',
 *   consent: true,
 * }
 */
export const testimonials: Testimonial[] = []

/**
 * Avantajele concrete ale colaborării. Fiecare are o dovadă verificabilă pe site sau în ofertă.
 * Păstrează doar ce aplici în fiecare proiect.
 */
export const standards: { title: Localized; body: Localized; proof: Localized }[] = [
  {
    title: { ro: 'Vorbești direct cu cel care face site-ul', en: 'You talk to the person building your site' },
    body: {
      ro: 'Nu e nicio agenție la mijloc. Îmi scrii sau mă suni direct, iar răspunsul vine tot de la mine.',
      en: 'There’s no agency in between. You write or call me directly, and the answer comes from me.',
    },
    proof: { ro: 'Telefonul și e-mailul de pe site sunt ale mele', en: 'The phone and email on this site are mine' },
  },
  {
    title: { ro: 'Preț fix, stabilit în scris', en: 'A fixed price, in writing' },
    body: {
      ro: 'Știi de la început ce primești și cât costă. Nu apar costuri noi fără acordul tău.',
      en: 'You know from the start what you get and what it costs. No new costs appear without your agreement.',
    },
    proof: { ro: 'Oferta scrisă, înainte să încep', en: 'The written quote, before I start' },
  },
  {
    title: { ro: 'Rapid și ușor de folosit pe telefon', en: 'Fast and easy to use on a phone' },
    body: {
      ro: 'Mulți clienți te caută de pe telefon. De aceea fiecare pagină e gândită întâi pentru ecranul mic.',
      en: 'Many customers look you up on a phone. That’s why every page is designed for the small screen first.',
    },
    proof: { ro: 'Proiectele de mai sus și capturile lor de pe telefon', en: 'The projects above and their phone screenshots' },
  },
  {
    title: { ro: 'Site-ul rămâne al tău', en: 'The website stays yours' },
    body: {
      ro: 'Domeniul și găzduirea sunt pe numele tău. La final îți predau tot, cu instrucțiuni de actualizare.',
      en: 'The domain and hosting are in your name. At the end I hand everything over, with instructions for updates.',
    },
    proof: { ro: 'Ce predau e scris în ofertă, punct cu punct', en: 'The handover is listed in the quote, item by item' },
  },
]
