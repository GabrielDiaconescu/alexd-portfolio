import type { Localized } from '@/lib/i18n'

/**
 * [DE VERIFICAT] Schiță bazată pe ce face tehnic site-ul. Nu este consultanță juridică:
 * citește-o (ideal împreună cu un jurist), completează datele operatorului în content/site.ts
 * și setează site.privacyUpdated când o aprobi.
 */
export const privacySections: { title: Localized; body: Localized<string[]> }[] = [
  {
    title: { ro: 'Cine prelucrează datele', en: 'Who processes the data' },
    body: {
      ro: ['Operatorul datelor este DIACONESCU ALEXANDRU-GABRIEL PERSOANĂ FIZICĂ AUTORIZATĂ (Alex D.), CUI 55757830, Nr. Reg. Com. F2026047454004, cu sediul în Făcălețești nr. 74, jud. Argeș. Pentru orice întrebare despre date, scrie la adresa de e-mail de mai jos.'],
      en: ['The data controller is DIACONESCU ALEXANDRU-GABRIEL PERSOANĂ FIZICĂ AUTORIZATĂ (Alex D.), a Romanian sole trader, tax ID (CUI) 55757830, trade register no. F2026047454004, registered at Făcălețești 74, Argeș county, Romania. For any question about your data, write to the email address below.'],
    },
  },
  {
    title: { ro: 'Ce date colectăm', en: 'What we collect' },
    body: {
      ro: [
        'Doar ce completezi în formularul de proiect: numele, adresa de e-mail sau numărul de telefon, tipul proiectului, opțional intervalul de buget și descrierea proiectului.',
        'Site-ul nu folosește cookie-uri, instrumente de analiză sau pixeli de urmărire.',
      ],
      en: [
        'Only what you enter in the project form: your name, email address or phone number, the project type, optionally a budget range, and the project description.',
        'The site uses no cookies, analytics tools or tracking pixels.',
      ],
    },
  },
  {
    title: { ro: 'De ce și pe ce temei', en: 'Why, and on what basis' },
    body: {
      ro: ['Folosim datele doar ca să răspundem cererii tale și, dacă e cazul, ca să pregătim o propunere. Temeiul este consimțământul tău și demersurile făcute la cererea ta înainte de un eventual contract (art. 6 alin. (1) lit. (a) și (b) din GDPR).'],
      en: ['We use the data only to answer your request and, where relevant, to prepare a proposal. The legal basis is your consent and steps taken at your request before entering into a contract (GDPR Art. 6(1)(a) and (b)).'],
    },
  },
  {
    title: { ro: 'Unde ajung datele', en: 'Where the data goes' },
    body: {
      ro: [
        'Formularul trimite mesajul direct în căsuța de e-mail a operatorului, prin serverul de e-mail al găzduirii (Hosterion), fără un serviciu extern de trimitere a e-mailurilor. Site-ul nu salvează cererile într-o bază de date.',
        'Site-ul este găzduit la Hosterion, în România. Ca orice furnizor de găzduire, Hosterion păstrează pentru o perioadă limitată jurnale tehnice ale accesărilor (adresa IP, data și pagina cerută), folosite pentru securitate și depanare.',
        'Ca să oprim mesajele automate, serverul ține minte adresa IP de la care s-a trimis formularul timp de cel mult 10 minute, doar în memorie. Nu o salvează și nu o asociază cu mesajul.',
      ],
      en: [
        'The form sends your message straight to the controller’s inbox through the hosting provider’s email server (Hosterion), without a third-party email delivery service. The site does not store requests in a database.',
        'The site is hosted by Hosterion, in Romania. Like any hosting provider, Hosterion keeps technical access logs (IP address, date and requested page) for a limited time, used for security and troubleshooting.',
        'To stop automated messages, the server remembers the IP address a form was sent from for at most 10 minutes, in memory only. It is not stored and not linked to the message.',
      ],
    },
  },
  {
    title: { ro: 'Cât timp le păstrăm', en: 'How long we keep it' },
    body: {
      ro: ['E-mailurile cu cereri care nu devin proiecte se șterg după 24 de luni. Dacă începem să lucrăm împreună, corespondența se păstrează pe durata colaborării și cât cere legea pentru documentele contabile.'],
      en: ['Emails about requests that do not become projects are deleted after 24 months. If we start working together, the correspondence is kept for the length of the collaboration and for as long as the law requires for accounting records.'],
    },
  },
  {
    title: { ro: 'Drepturile tale', en: 'Your rights' },
    body: {
      ro: ['Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție, precum și dreptul de a-ți retrage consimțământul oricând. Poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP).'],
      en: ['You have the right of access, rectification, erasure, restriction, portability and objection, and you can withdraw consent at any time. You may lodge a complaint with the Romanian data protection authority (ANSPDCP).'],
    },
  },
]
