import type { Localized } from '@/lib/i18n'

export type Step = { title: Localized; body: Localized; output: Localized }

export const process: Step[] = [
  {
    title: { ro: 'Discuție', en: 'First conversation' },
    body: {
      ro: 'Vorbim despre afacere, clienții tăi și ce vrei să obții de la site. Te întreb ce contează, nu ce sună tehnic.',
      en: 'We talk about your business, your customers and what you want the website to achieve. I ask about what matters, not what sounds technical.',
    },
    output: { ro: 'Obiective clare', en: 'Clear goals' },
  },
  {
    title: { ro: 'Ofertă și plan', en: 'Quote & plan' },
    body: {
      ro: 'Primești în scris paginile, funcțiile, prețul și calendarul pe etape. Lucrul începe doar după ce le aprobi.',
      en: 'You get the pages, features, price and timeline in writing. Work starts only once you approve them.',
    },
    output: { ro: 'Ofertă scrisă, preț fix', en: 'Written quote, fixed price' },
  },
  {
    title: { ro: 'Design și dezvoltare', en: 'Design & development' },
    body: {
      ro: 'Întâi structura și designul pentru telefon și desktop, apoi codul. Urmărești progresul pe o adresă de test, pe site-ul real.',
      en: 'Structure and design for phone and desktop first, then the code. You follow progress on a preview link, on the real site.',
    },
    output: { ro: 'Site funcțional, pe adresă de test', en: 'Working site on a preview link' },
  },
  {
    title: { ro: 'Revizii și testare', en: 'Review & testing' },
    body: {
      ro: 'Ajustăm împreună textele și detaliile. Verific fiecare pagină pe telefon și desktop: viteză, formulare, accesibilitate.',
      en: 'We refine copy and details together. I check every page on phone and desktop: speed, forms, accessibility.',
    },
    output: { ro: 'Versiune aprobată', en: 'Approved version' },
  },
  {
    title: { ro: 'Lansare', en: 'Launch' },
    body: {
      ro: 'Publicăm pe domeniul tău și verificăm indexarea în Google. Primești instrucțiuni clare despre cum se actualizează site-ul.',
      en: 'We go live on your domain and check Google indexing. You get clear instructions on how the site is updated.',
    },
    output: { ro: 'Site live, predat complet', en: 'Live site, fully handed over' },
  },
]
