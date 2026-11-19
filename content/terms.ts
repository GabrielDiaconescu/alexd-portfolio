import type { LegalSection } from '@/components/legal/legal-page'

/**
 * Termeni și condiții. Nu este consultanță juridică. Condițiile comerciale pe care nu le-ai stabilit
 * încă (avans, număr de revizii, termene exacte) nu sunt inventate aici: textul trimite la oferta scrisă.
 * Când schimbi textul, actualizează site.termsUpdated.
 */
export const termsSections: LegalSection[] = [
  {
    title: { ro: 'Cine sunt', en: 'Who I am' },
    body: {
      ro: [
        'Site-ul alexd.ro aparține DIACONESCU ALEXANDRU-GABRIEL PERSOANĂ FIZICĂ AUTORIZATĂ (Alex D.), CUI 55757830, Nr. Reg. Com. F2026047454004, cu sediul în Făcălețești nr. 74, jud. Argeș. Nu sunt plătitor de TVA.',
        'Mă poți contacta la contact@alexd.ro sau la 0749 113 164.',
      ],
      en: [
        'alexd.ro belongs to DIACONESCU ALEXANDRU-GABRIEL PERSOANĂ FIZICĂ AUTORIZATĂ (Alex D.), a Romanian sole trader, tax ID (CUI) 55757830, trade register no. F2026047454004, registered at Făcălețești 74, Argeș county, Romania. I am not VAT registered.',
        'You can reach me at contact@alexd.ro or +40 749 113 164.',
      ],
    },
  },
  {
    title: { ro: 'Ce acoperă acești termeni', en: 'What these terms cover' },
    body: {
      ro: [
        'Acești termeni se aplică folosirii site-ului și cererilor trimise prin el. Fiecare proiect are o ofertă scrisă proprie, care descrie lucrul, prețul și termenele. Dacă oferta sau contractul spun altceva decât acești termeni, au prioritate oferta și contractul.',
      ],
      en: [
        'These terms apply to using the site and to requests sent through it. Every project gets its own written quote describing the work, price and timeline. Where the quote or contract differs from these terms, the quote and contract prevail.',
      ],
    },
  },
  {
    title: { ro: 'Oferte și prețuri', en: 'Quotes and prices' },
    body: {
      ro: [
        'O cerere trimisă prin site nu este o comandă și nu te obligă la nimic. După ce discutăm, primești o ofertă scrisă, cu prețul fix și ce include.',
        'Prețurile sunt în lei (RON) și sunt finale: nu sunt plătitor de TVA, deci nu se adaugă TVA. Prețurile afișate pe site, dacă există, sunt prețuri de pornire („de la”); prețul exact este cel din oferta scrisă.',
      ],
      en: [
        'A request sent through the site is not an order and does not commit you to anything. After we talk, you get a written quote with a fixed price and what it includes.',
        'Prices are in Romanian lei (RON) and are final: I am not VAT registered, so no VAT is added. Any prices shown on the site are starting prices ("from"); the exact price is the one in the written quote.',
      ],
    },
  },
  {
    title: { ro: 'Începerea lucrului și plata', en: 'Starting work and payment' },
    body: {
      ro: [
        'Încep lucrul doar după ce accepți oferta în scris (de exemplu prin e-mail). Modul de plată și eventualele tranșe sunt trecute în ofertă. Pentru fiecare plată primești factură.',
        'Orice lucru în plus față de ofertă se face doar cu acordul tău, după ce îți spun cât costă.',
      ],
      en: [
        'I start work only after you accept the quote in writing (for example by email). Payment method and any instalments are set out in the quote. You get an invoice for every payment.',
        'Anything beyond the quote is done only with your agreement, after I tell you what it costs.',
      ],
    },
  },
  {
    title: { ro: 'Dreptul de retragere (persoane fizice)', en: 'Right of withdrawal (consumers)' },
    body: {
      ro: [
        'Dacă ești persoană fizică și încheiem contractul la distanță (de exemplu prin e-mail), te poți retrage în 14 zile de la încheierea lui, fără să dai un motiv, potrivit OUG nr. 34/2014. Îmi trimiți decizia la contact@alexd.ro.',
        'Dacă îmi ceri explicit să încep lucrul în cele 14 zile și te retragi după ce am început, plătești doar partea de lucru făcută până atunci. Dacă serviciul a fost prestat complet, la cererea ta, dreptul de retragere nu se mai aplică.',
        'Dreptul de retragere nu se aplică firmelor și persoanelor fizice autorizate care cumpără în scop profesional.',
      ],
      en: [
        'If you are a consumer and we conclude the contract at a distance (for example by email), you may withdraw within 14 days of concluding it, without giving a reason, under Romanian Emergency Ordinance 34/2014. Send your decision to contact@alexd.ro.',
        'If you expressly ask me to start work within those 14 days and withdraw after I have started, you pay only for the work done until then. Once the service has been fully performed at your request, the right of withdrawal no longer applies.',
        'The right of withdrawal does not apply to companies or sole traders buying for business purposes.',
      ],
    },
  },
  {
    title: { ro: 'Proiectele de pe site', en: 'Projects shown on the site' },
    body: {
      ro: [
        'Proiectele prezentate pe site sunt proiecte demonstrative și personale, făcute de mine ca exemple. Nu sunt lucrări comandate de clienți, iar numele, prețurile și datele de contact din ele sunt de exemplu.',
      ],
      en: [
        'The projects shown on the site are demo and personal projects I built as examples. They are not client commissions, and the names, prices and contact details in them are examples.',
      ],
    },
  },
  {
    title: { ro: 'Drepturi de autor', en: 'Copyright' },
    body: {
      ro: [
        'Textele, designul și codul acestui site îmi aparțin. Nu le copia fără acordul meu. Drepturile asupra site-ului pe care îl construiesc pentru tine se stabilesc în ofertă sau în contract.',
      ],
      en: [
        'The text, design and code of this site are mine. Please do not copy them without my permission. Rights to the site I build for you are set out in the quote or contract.',
      ],
    },
  },
  {
    title: { ro: 'Reclamații', en: 'Complaints' },
    body: {
      ro: [
        'Dacă nu ești mulțumit, scrie-mi la contact@alexd.ro. Îți răspund în cel mult 30 de zile și încercăm să rezolvăm direct.',
      ],
      en: [
        'If you are not happy, write to me at contact@alexd.ro. I reply within 30 days at the latest and we try to resolve it directly.',
      ],
    },
  },
  {
    title: { ro: 'Soluționarea alternativă a litigiilor', en: 'Alternative dispute resolution' },
    body: {
      ro: [
        'Dacă ești consumator și nu ajungem la o înțelegere, te poți adresa procedurii de Soluționare Alternativă a Litigiilor (SAL) a ANPC, la reclamatiisal.anpc.ro, sau instanțelor din România.',
      ],
      en: [
        'If you are a consumer and we cannot reach an agreement, you can use the Romanian consumer authority’s Alternative Dispute Resolution procedure (ANPC SAL) at reclamatiisal.anpc.ro, or the Romanian courts.',
      ],
    },
  },
  {
    title: { ro: 'Legea aplicabilă și modificări', en: 'Governing law and changes' },
    body: {
      ro: [
        'Acești termeni se supun legii române. Îi pot actualiza; data ultimei modificări apare sus, iar o ofertă deja acceptată rămâne la termenii de la data acceptării.',
      ],
      en: [
        'These terms are governed by Romanian law. I may update them; the date of the last change is shown at the top, and a quote already accepted keeps the terms in force when it was accepted.',
      ],
    },
  },
]
