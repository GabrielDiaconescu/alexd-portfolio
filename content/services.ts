import type { Localized } from '@/lib/i18n'

export type Service = {
  id: string
  name: Localized
  /** Întrebarea sau ideea de deschidere, afișată mare. */
  lead: Localized
  body: Localized
  /** Titlul listei: „Ce include”, „Exemple” etc. */
  listLabel: Localized
  items: Localized<string[]>
}

/**
 * Cele trei servicii principale. Fără prețuri și fără garanții: le stabilești în oferta pentru fiecare proiect.
 * Proiectele mai ample (aplicații, baze de date, AI) stau separat, în `special`, ca să nu pară produsul principal.
 */
export const services: Service[] = [
  {
    id: 'website',
    name: { ro: 'Website-uri de prezentare', en: 'Business websites' },
    lead: {
      ro: 'Ai o afacere, dar nu ai încă un site sau cel actual nu te mai reprezintă?',
      en: 'You run a business, but have no website yet, or the current one no longer represents you?',
    },
    body: {
      ro: 'Creez site-ul de prezentare al firmei tale de la zero: structură, texte de interfață, design și cod. Clienții află repede cine ești, ce oferi și cum te contactează.',
      en: 'I build your company website from scratch: structure, interface copy, design and code. Customers quickly see who you are, what you offer and how to reach you.',
    },
    listLabel: { ro: 'Ce include', en: 'What’s included' },
    items: {
      ro: ['Design personalizat, nu un șablon', 'Pagini pentru servicii, prețuri și galerie', 'Telefon, WhatsApp și formular de contact', 'Adaptat pentru telefon, tabletă și desktop', 'SEO tehnic și încărcare rapidă', 'Publicare pe domeniul tău'],
      en: ['A custom design, not a template', 'Pages for services, prices and gallery', 'Phone, WhatsApp and a contact form', 'Built for phone, tablet and desktop', 'Technical SEO and fast loading', 'Launch on your own domain'],
    },
  },
  {
    id: 'redesign',
    name: { ro: 'Redesign și modernizare', en: 'Redesign & modernisation' },
    lead: {
      ro: 'Ai deja un site, dar arată învechit, se încarcă greu sau nu merge bine pe telefon?',
      en: 'You already have a site, but it looks dated, loads slowly or doesn’t work well on a phone?',
    },
    body: {
      ro: 'Îl reconstruiesc păstrând ce funcționează: informațiile importante, adresele indexate în Google și identitatea firmei.',
      en: 'I rebuild it while keeping what works: the key information, the addresses Google has indexed and your brand.',
    },
    listLabel: { ro: 'Ce include', en: 'What’s included' },
    items: {
      ro: ['Design actualizat, pe identitatea firmei', 'Informații reorganizate, ușor de găsit', 'Experiență bună pe telefon', 'Viteză de încărcare mai mare', 'Redirecționări pentru paginile vechi', 'Actualizări și mentenanță după lansare'],
      en: ['An updated design that keeps your brand', 'Information reorganised so it’s easy to find', 'A good experience on phones', 'Faster loading', 'Redirects for the old pages', 'Updates and maintenance after launch'],
    },
  },
  {
    id: 'custom',
    name: { ro: 'Funcționalități și soluții personalizate', en: 'Custom features & solutions' },
    lead: {
      ro: 'Vrei ca site-ul să lucreze pentru tine, nu doar să arate bine?',
      en: 'Want your website to work for you, not just look good?',
    },
    body: {
      ro: 'Adaug funcțiile care îți scurtează munca zilnică și le ușurează clienților drumul până la o cerere.',
      en: 'I add the features that cut down your daily work and make it easier for customers to get in touch.',
    },
    listLabel: { ro: 'Exemple', en: 'Examples' },
    items: {
      ro: ['Programări online sau prin WhatsApp', 'Formulare de ofertă și de contact', 'Liste de prețuri și meniuri interactive', 'Panou simplu pentru texte, poze și prețuri', 'Integrări cu hărți, plăți sau facturare'],
      en: ['Online or WhatsApp bookings', 'Quote and contact forms', 'Interactive price lists and menus', 'A simple panel for copy, photos and prices', 'Integrations with maps, payments or invoicing'],
    },
  },
]

/** Proiecte mai ample, discutate separat: apar sub serviciile principale, într-un bloc mai discret. */
export const special = {
  title: { ro: 'Proiecte speciale, la cerere', en: 'Special projects, on request' } satisfies Localized,
  body: {
    ro: 'Pentru idei care cer mai mult decât un site, lucrez și la proiecte dedicate. Le discutăm separat, ca să stabilim realist ce se poate face, în cât timp și cu ce buget.',
    en: 'For ideas that need more than a website, I also take on dedicated projects. We discuss them separately to agree realistically on what can be done, how long it takes and what it costs.',
  } satisfies Localized,
  items: {
    ro: ['Aplicații web cu conturi și bază de date', 'Aplicații mobile (React Native)', 'Integrări AI, de exemplu un asistent pentru clienți'],
    en: ['Web apps with accounts and a database', 'Mobile apps (React Native)', 'AI integrations, such as a customer assistant'],
  } satisfies Localized<string[]>,
}
