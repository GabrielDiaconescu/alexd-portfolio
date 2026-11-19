import type { Localized } from '@/lib/i18n'

export type Step = { title: Localized; body: Localized; output: Localized }

export const process: Step[] = [
  {
    title: { ro: 'Discuție', en: 'First conversation' },
    body: {
      ro: 'Vorbim despre afacerea ta și despre ce vrei să facă site-ul. Fără termeni tehnici.',
      en: 'We talk about your business and what you want the website to do. No jargon.',
    },
    output: { ro: 'Obiective clare', en: 'Clear goals' },
  },
  {
    title: { ro: 'Ofertă și plan', en: 'Quote & plan' },
    body: {
      ro: 'Primești în scris ce pagini și funcții intră, cât costă și când e gata. Încep doar după ce aprobi.',
      en: 'You get in writing which pages and features are included, what it costs and when it’s ready. I start only once you approve.',
    },
    output: { ro: 'Ofertă scrisă, preț fix', en: 'Written quote, fixed price' },
  },
  {
    title: { ro: 'Design și dezvoltare', en: 'Design & development' },
    body: {
      ro: 'Întâi designul, apoi construcția. Vezi progresul pe un link de test, direct pe site, nu în poze.',
      en: 'Design first, then the build. You follow progress on a preview link, on the real site, not in screenshots.',
    },
    output: { ro: 'Site funcțional, pe un link de test', en: 'Working site on a preview link' },
  },
  {
    title: { ro: 'Revizii și testare', en: 'Review & testing' },
    body: {
      ro: 'Îmi spui ce vrei schimbat și ajustăm împreună. Apoi testez fiecare pagină, formularele și viteza.',
      en: 'You tell me what to change and we adjust it together. Then I test every page, the forms and the speed.',
    },
    output: { ro: 'Versiune aprobată', en: 'Approved version' },
  },
  {
    title: { ro: 'Lansare', en: 'Launch' },
    body: {
      ro: 'Publicăm site-ul pe domeniul tău. Îl trimit apoi la Google, ca să poată apărea în căutări.',
      en: 'We put the site live on your domain. Then I submit it to Google so it can show up in search.',
    },
    output: { ro: 'Site live, predat complet', en: 'Live site, fully handed over' },
  },
]
