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
      ro: 'Fără agenție și fără intermediari. Întrebările ajung la mine, iar răspunsurile vin de la mine.',
      en: 'No agency, no middlemen. Your questions reach me, and the answers come from me.',
    },
    proof: { ro: 'Contact direct pe e-mail și telefon', en: 'Direct contact by email and phone' },
  },
  {
    title: { ro: 'Preț fix, stabilit în scris', en: 'A fixed price, in writing' },
    body: {
      ro: 'Știi de la început ce primești și cât costă. Nu apar costuri noi pe parcurs fără acordul tău.',
      en: 'You know from the start what you get and what it costs. No new costs appear along the way without your agreement.',
    },
    proof: { ro: 'Oferta scrisă, înainte de start', en: 'The written quote, before work starts' },
  },
  {
    title: { ro: 'Rapid și ușor de folosit pe telefon', en: 'Fast and easy to use on a phone' },
    body: {
      ro: 'Cei mai mulți clienți te caută de pe telefon. Fiecare pagină e construită și testată întâi acolo, cu atenție la viteză și accesibilitate.',
      en: 'Most customers look you up on a phone. Every page is built and tested there first, with care for speed and accessibility.',
    },
    proof: { ro: 'Toate cele trei proiecte de mai sus', en: 'All three projects above' },
  },
  {
    title: { ro: 'Site-ul rămâne al tău', en: 'The website stays yours' },
    body: {
      ro: 'Domeniul și găzduirea sunt pe numele tău, iar la final primești instrucțiuni despre cum se actualizează conținutul.',
      en: 'The domain and hosting are in your name, and at the end you get instructions on how to update the content.',
    },
    proof: { ro: 'Documentația predată cu fiecare proiect', en: 'The documentation handed over with every project' },
  },
]
