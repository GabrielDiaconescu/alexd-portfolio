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
      ro: 'Ai o afacere, dar nu ai încă un site?',
      en: 'You run a business, but don’t have a website yet?',
    },
    body: {
      ro: 'Fac site-ul firmei tale de la zero. Clienții văd repede cine ești, ce oferi și cum te contactează.',
      en: 'I build your company website from scratch. Customers quickly see who you are, what you offer and how to reach you.',
    },
    listLabel: { ro: 'Ce include', en: 'What’s included' },
    items: {
      ro: ['Design făcut pentru tine, nu un șablon', 'Pagini pentru servicii, prețuri și galerie', 'Telefon, WhatsApp și formular de contact', 'Arată bine pe telefon, tabletă și calculator', 'Publicat pe domeniul tău', 'Se încarcă repede și e configurat pentru Google'],
      en: ['A design made for you, not a template', 'Pages for services, prices and gallery', 'Phone, WhatsApp and a contact form', 'Looks right on phone, tablet and computer', 'Live on your own domain', 'Loads fast and is set up for Google'],
    },
  },
  {
    id: 'redesign',
    name: { ro: 'Redesign și modernizare', en: 'Redesign & modernisation' },
    lead: {
      ro: 'Ai deja un site, dar arată vechi sau merge greu pe telefon?',
      en: 'You already have a site, but it looks dated or struggles on a phone?',
    },
    body: {
      ro: 'Îl refac și păstrez ce merge: informațiile importante, paginile pe care Google le știe deja și identitatea firmei.',
      en: 'I rebuild it and keep what works: the key information, the pages Google already knows and your brand.',
    },
    listLabel: { ro: 'Ce include', en: 'What’s included' },
    items: {
      ro: ['Design nou, păstrând identitatea firmei', 'Informații reorganizate, ușor de găsit', 'Ușor de folosit pe telefon', 'Se încarcă mai repede', 'Linkurile vechi duc la paginile noi', 'Mentenanță după lansare, dacă vrei'],
      en: ['A new design that keeps your brand', 'Information reorganised so it’s easy to find', 'Easy to use on a phone', 'Loads faster', 'Old links lead to the new pages', 'Maintenance after launch, if you want it'],
    },
  },
  {
    id: 'custom',
    name: { ro: 'Funcționalități personalizate', en: 'Custom features' },
    lead: {
      ro: 'Vrei ca site-ul să facă și o parte din muncă?',
      en: 'Want your website to take on some of the work?',
    },
    body: {
      ro: 'Adaug funcții care îți economisesc timp și îi ajută pe clienți să-ți scrie mai ușor.',
      en: 'I add features that save you time and make it easier for customers to get in touch.',
    },
    listLabel: { ro: 'Exemple', en: 'Examples' },
    items: {
      ro: ['Programări online sau prin WhatsApp', 'Formulare de ofertă și de contact', 'Liste de prețuri și meniuri interactive', 'Un panou simplu ca să schimbi singur texte, poze și prețuri', 'Hărți, plăți online sau facturare, legate de site'],
      en: ['Online or WhatsApp bookings', 'Quote and contact forms', 'Interactive price lists and menus', 'A simple panel to change copy, photos and prices yourself', 'Maps, online payments or invoicing, linked to the site'],
    },
  },
]

/** Proiecte mai ample, discutate separat: apar sub serviciile principale, într-un bloc mai discret. */
export const special = {
  title: { ro: 'Proiecte speciale, la cerere', en: 'Special projects, on request' } satisfies Localized,
  body: {
    ro: 'Pentru idei care cer mai mult decât un site. Le discutăm separat și îți spun sincer ce se poate face, în cât timp și cu ce buget.',
    en: 'For ideas that need more than a website. We discuss them separately, and I’ll tell you honestly what can be done, how long it takes and what it costs.',
  } satisfies Localized,
  items: {
    ro: ['Aplicații web cu conturi și bază de date', 'Aplicații mobile (React Native)', 'Integrări AI, de exemplu un asistent pentru clienți'],
    en: ['Web apps with accounts and a database', 'Mobile apps (React Native)', 'AI integrations, such as a customer assistant'],
  } satisfies Localized<string[]>,
}
