import type { Localized } from '@/lib/i18n'

export type FaqTopic = 'start' | 'work' | 'tech' | 'after'
export type Faq = { topic: FaqTopic; q: Localized; a: Localized }

/**
 * Răspunsurile descriu cum se stabilesc lucrurile, nu promit termene, prețuri sau poziții în Google.
 * Ordinea din listă = ordinea de pe site; `topic` le grupează în filtre. Fiecare temă are cel puțin o întrebare.
 * Nu repeta aici ce spun deja Serviciile, Procesul sau „De ce eu”.
 */
export const faq: Faq[] = [
  {
    topic: 'start',
    q: { ro: 'Cât costă un site?', en: 'How much does a website cost?' },
    a: {
      ro: 'Depinde de numărul de pagini și de funcții. După o discuție scurtă primești o ofertă scrisă, cu preț fix, care spune exact ce intră și ce nu.',
      en: 'It depends on the number of pages and features. After a short chat you get a written, fixed-price quote that says exactly what is and isn’t included.',
    },
  },
  {
    topic: 'start',
    q: { ro: 'Cât durează realizarea unui site?', en: 'How long does a website take?' },
    a: {
      ro: 'Depinde de mărimea proiectului și de cât de repede primesc textele și pozele. Calendarul pe etape e trecut în ofertă.',
      en: 'It depends on the size of the project and how quickly I get the copy and photos. The timeline by stage is in the quote.',
    },
  },
  {
    topic: 'work',
    q: { ro: 'Ce trebuie să pregătesc?', en: 'What do I need to prepare?' },
    a: {
      ro: 'Ideal, logo-ul, câteva poze și informații despre afacere. Dacă îți lipsește ceva, te ajut cu structura textelor și îți spun ce poze merită făcute.',
      en: 'Ideally your logo, a few photos and some information about the business. If something is missing, I’ll help structure the copy and tell you which photos are worth taking.',
    },
  },
  {
    topic: 'work',
    q: { ro: 'Cum comunicăm pe parcurs?', en: 'How do we communicate along the way?' },
    a: {
      ro: 'Pe e-mail, telefon sau apel video, cum îți e mai ușor. Vorbești mereu direct cu mine și vezi progresul pe linkul de test.',
      en: 'By email, phone or video call, whichever suits you. You always talk to me directly and can follow progress on the preview link.',
    },
  },
  {
    topic: 'work',
    q: { ro: 'Cât de disponibil ești pentru proiectul meu?', en: 'How available will you be for my project?' },
    a: {
      ro: 'Stabilim de la început un calendar realist, pe etape, și îl respect. Accept un număr limitat de proiecte deodată, în paralel cu facultatea, iar dacă se schimbă ceva te anunț din timp.',
      en: 'We agree on a realistic, stage-by-stage timeline from the start, and I stick to it. I take on a limited number of projects at a time, alongside university, and if anything changes I tell you early.',
    },
  },
  {
    topic: 'tech',
    q: { ro: 'Va apărea site-ul pe Google?', en: 'Will the site show up on Google?' },
    a: {
      ro: 'Configurez tot ce ține de site: titluri, descrieri, sitemap și viteză. Nimeni nu poate garanta un loc în Google, dar un site rapid și bine structurat are șanse mai bune.',
      en: 'I set up everything on the site side: titles, descriptions, sitemap and speed. Nobody can guarantee a Google ranking, but a fast, well-structured site has a better chance.',
    },
  },
  {
    topic: 'tech',
    q: { ro: 'Pot să actualizez singur site-ul?', en: 'Can I update the site myself?' },
    a: {
      ro: 'Da. Dacă schimbi des texte, poze sau prețuri, îți pot face un panou simplu. Altfel, primești instrucțiuni pas cu pas.',
      en: 'Yes. If you change copy, photos or prices often, I can build you a simple admin panel. Otherwise, you get step-by-step instructions.',
    },
  },
  {
    topic: 'after',
    q: { ro: 'Mă ajuți cu domeniul și găzduirea?', en: 'Can you help with the domain and hosting?' },
    a: {
      ro: 'Da. Te ajut să alegi și să configurezi domeniul, găzduirea și o adresă de e-mail pe domeniul tău.',
      en: 'Yes. I help you choose and set up the domain, hosting and an email address on your domain.',
    },
  },
  {
    topic: 'after',
    q: { ro: 'Ce se întâmplă după lansare?', en: 'What happens after launch?' },
    a: {
      ro: 'Dacă vrei, continuăm cu mentenanță: actualizări, pagini noi, verificări. Detaliile le stabilim separat.',
      en: 'If you want, we continue with maintenance: updates, new pages, checks. We agree the details separately.',
    },
  },
]
