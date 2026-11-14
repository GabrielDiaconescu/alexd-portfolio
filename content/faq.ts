import type { Localized } from '@/lib/i18n'

export type FaqTopic = 'start' | 'work' | 'tech' | 'after'
export type Faq = { topic: FaqTopic; q: Localized; a: Localized }

/**
 * Răspunsurile descriu cum se stabilesc lucrurile, nu promit termene, prețuri sau poziții în Google.
 * Ordinea din listă = ordinea de pe site; `topic` le grupează în filtre.
 */
export const faq: Faq[] = [
  {
    topic: 'start',
    q: { ro: 'Ce fel de site-uri realizezi?', en: 'What kind of websites do you build?' },
    a: {
      ro: 'În principal website-uri de prezentare pentru firme, redesign-uri și funcționalități personalizate, cum ar fi programări online sau formulare de ofertă. Pentru proiecte mai ample, ca aplicații web sau mobile, discutăm separat și îți spun sincer dacă sunt omul potrivit.',
      en: 'Mainly business websites, redesigns and custom features such as online booking or quote forms. For larger projects, like web or mobile apps, we talk separately and I’ll tell you honestly whether I’m the right fit.',
    },
  },
  {
    topic: 'start',
    q: { ro: 'Cât costă un site?', en: 'How much does a website cost?' },
    a: {
      ro: 'Depinde de numărul de pagini, de funcționalități și de cât conținut trebuie pregătit. După o discuție scurtă primești o ofertă cu preț fix, în scris, înainte să începem. Fără costuri ascunse.',
      en: 'It depends on the number of pages, the features and how much content needs preparing. After a short conversation you get a fixed-price quote in writing, before we start. No hidden costs.',
    },
  },
  {
    topic: 'start',
    q: { ro: 'Cât durează realizarea unui site?', en: 'How long does a website take?' },
    a: {
      ro: 'Depinde de dimensiunea proiectului și de cât de repede vin materialele și feedback-ul. Oferta include un calendar pe etape, stabilit împreună.',
      en: 'It depends on the size of the project and how quickly materials and feedback arrive. The quote includes a timeline by stage that we agree on together.',
    },
  },
  {
    topic: 'start',
    q: { ro: 'Lucrezi doar cu firme din Pitești?', en: 'Do you only work with businesses in Pitești?' },
    a: {
      ro: 'Nu. Sunt din Argeș, dar lucrez remote cu firme din toată România, în română sau în engleză.',
      en: 'No. I’m based in Argeș, but I work remotely with businesses across Romania, in Romanian or English.',
    },
  },
  {
    topic: 'work',
    q: { ro: 'Ce trebuie să pregătesc?', en: 'What do I need to prepare?' },
    a: {
      ro: 'Ideal: câteva informații despre afacere, logo-ul, fotografii și datele de contact. Dacă nu le ai pe toate, te ajut cu structura textelor și îți spun ce fotografii merită făcute.',
      en: 'Ideally: some information about the business, your logo, photos and contact details. If you don’t have it all, I’ll help with the structure of the copy and tell you which photos are worth taking.',
    },
  },
  {
    topic: 'work',
    q: { ro: 'Cum stabilim ce intră în proiect?', en: 'How do we agree on scope?' },
    a: {
      ro: 'Oferta scrisă cuprinde paginile, funcțiile, numărul de runde de revizii și ce nu e inclus. Lucrul începe doar după ce o aprobi.',
      en: 'The written quote lists the pages, the features, the number of revision rounds and what is not included. Work starts only once you approve it.',
    },
  },
  {
    topic: 'work',
    q: { ro: 'Cum comunicăm pe parcurs?', en: 'How do we communicate along the way?' },
    a: {
      ro: 'Pe e-mail, telefon sau apel video. Vezi progresul pe o adresă de test, ca să comentezi pe site-ul real, nu pe capturi de ecran.',
      en: 'By email, phone or video call. You follow progress on a preview link, so you comment on the real site rather than on screenshots.',
    },
  },
  {
    topic: 'work',
    q: { ro: 'Ești student. Cât de disponibil ești?', en: 'You’re a student. How available are you?' },
    a: {
      ro: 'Lucrez în paralel cu facultatea, așa că stabilim de la început un calendar realist și îl respect. Dacă ceva se schimbă, îți spun din timp.',
      en: 'I work alongside university, so we agree on a realistic timeline from the start and I stick to it. If anything changes, I tell you early.',
    },
  },
  {
    topic: 'tech',
    q: { ro: 'Site-ul va arăta bine pe telefon?', en: 'Will the site work well on a phone?' },
    a: {
      ro: 'Da. Fiecare pagină e construită și testată pe telefon, tabletă și desktop. Cei mai mulți vizitatori vin de pe telefon, așa că acolo trebuie să fie cel mai ușor de folosit.',
      en: 'Yes. Every page is built and tested on phone, tablet and desktop. Most visitors come from a phone, so that is where it has to be easiest to use.',
    },
  },
  {
    topic: 'tech',
    q: { ro: 'Va apărea site-ul pe Google?', en: 'Will the site show up on Google?' },
    a: {
      ro: 'Configurez SEO-ul tehnic: titluri și descrieri, sitemap, date structurate și viteză de încărcare. Nimeni nu poate garanta o poziție în Google, dar un site rapid și bine structurat pornește cu un avantaj real.',
      en: 'I set up the technical SEO: titles and descriptions, sitemap, structured data and loading speed. Nobody can guarantee a Google ranking, but a fast, well-structured site starts with a real advantage.',
    },
  },
  {
    topic: 'tech',
    q: { ro: 'Pot să actualizez singur site-ul?', en: 'Can I update the site myself?' },
    a: {
      ro: 'Da. Dacă schimbi des texte, poze sau prețuri, îți pot face un panou simplu de administrare. Altfel, primești instrucțiuni care arată exact unde se schimbă fiecare lucru.',
      en: 'Yes. If you change copy, photos or prices often, I can build you a simple admin panel. Otherwise, you get instructions showing exactly where each thing is changed.',
    },
  },
  {
    topic: 'after',
    q: { ro: 'Ce primesc la final?', en: 'What do I receive at the end?' },
    a: {
      ro: 'Site-ul publicat pe domeniul tău și instrucțiunile lui. Ce anume se predă (cod, conturi, fișiere) scriem clar în ofertă.',
      en: 'The site, live on your domain, and its instructions. Exactly what is handed over (code, accounts, files) is spelled out in the quote.',
    },
  },
  {
    topic: 'after',
    q: { ro: 'Mă ajuți cu domeniul și găzduirea?', en: 'Can you help with the domain and hosting?' },
    a: {
      ro: 'Da. Te ajut să alegi și să configurezi domeniul, găzduirea și adresa de e-mail pe domeniu. Conturile rămân pe numele tău.',
      en: 'Yes. I help you choose and set up the domain, hosting and an email address on your domain. The accounts stay in your name.',
    },
  },
  {
    topic: 'after',
    q: { ro: 'Ce se întâmplă după lansare?', en: 'What happens after launch?' },
    a: {
      ro: 'Dacă vrei, continuăm cu mentenanță: actualizări de conținut, pagini sau servicii noi, verificări și îmbunătățiri. Detaliile se stabilesc separat.',
      en: 'If you want, we continue with maintenance: content updates, new pages or services, checks and improvements. The details are agreed separately.',
    },
  },
]
