import type { Project } from './types'

/**
 * Proiectele, în ordinea afișării. Ca să adaugi unul: copiază un bloc, schimbă slug-ul
 * și pune imaginile în public/work/<slug>/. Ordinea din listă = ordinea de pe site.
 *
 * Toate proiectele sunt demonstrative (de prezentare), nu lucrări pentru clienți. Cifrele de mai jos
 * sunt măsurători tehnice din codul proiectelor. Nu adăuga cifre de business (vânzări, trafic, cereri).
 */
const demo = { kind: 'demo', kindLabel: { ro: 'Proiect demonstrativ', en: 'Demo project' } } as const
const personal = { kind: 'product', kindLabel: { ro: 'Proiect personal', en: 'Personal project' } } as const

export const projects: Project[] = [
  {
    slug: 'truck-wash',
    name: { ro: 'Spălătorie de camioane', en: 'Truck & fleet wash' },
    ...demo,
    year: '2026',
    category: { ro: 'Website de prezentare', en: 'Business website' },
    services: {
      ro: ['Web design', 'Development', 'Formulare & e-mail'],
      en: ['Web design', 'Development', 'Forms & email'],
    },
    tags: ['Next.js', 'TypeScript', 'Resend'],
    summary: {
      ro: 'Site de prezentare pentru o spălătorie de TIR-uri, capete tractor și semiremorci, cu cereri de programare online.',
      en: 'A business website for a wash bay serving trucks, tractor units and semi-trailers, with online booking requests.',
    },
    problem: {
      ro: 'Transportatorii și dispecerii caută de pe telefon, între două curse. Site-ul trebuia să arate în câteva secunde serviciile și programul și să transforme vizita într-o programare sau un apel.',
      en: 'Hauliers and dispatchers search on a phone, between runs. The site had to show the services and hours within seconds and turn a visit into a booking or a call.',
    },
    highlights: {
      ro: [
        'Serviciile explicate pe limba flotelor, de la spălarea exterioară la contracte B2B',
        'Cerere de programare în câțiva pași, confirmată apoi telefonic',
        'Bară fixă cu „Sună acum” și WhatsApp pe orice telefon',
        'Video în prima pagină, redus de la 5,2 MB la 1,2 MB',
      ],
      en: [
        'Services explained in the language of fleets, from exterior wash to B2B contracts',
        'A booking request in a few steps, then confirmed by phone',
        'A sticky “Call now” and WhatsApp bar on every phone',
        'A home page video cut from 5.2 MB to 1.2 MB',
      ],
    },
    accent: '#3B6FF0',
    cover: {
      src: '/work/truck-wash/desktop.jpg',
      width: 2160,
      height: 1350,
      frame: 'browser',
      alt: {
        ro: 'Prima pagină a site-ului: titlul „Spălătorie profesională pentru camioane și flote, în Pitești” peste un cadru video cu un camion în spălătorie.',
        en: 'Home page: the headline “Professional truck and fleet wash in Pitești” over a video frame of a truck inside the wash bay.',
      },
    },
    secondary: {
      src: '/work/truck-wash/mobile.png',
      width: 780,
      height: 1688,
      frame: 'phone',
      alt: {
        ro: 'Același site pe telefon, cu bara fixă „Sună acum” și „WhatsApp” în partea de jos.',
        en: 'The same site on a phone, with the sticky “Call now” and “WhatsApp” bar at the bottom.',
      },
    },
    // Site-ul nu e publicat, deci nu poate fi încorporat: capturi ale paginii principale, din build-ul de producție.
    preview: {
      mode: 'static',
      desktop: { src: '/work/truck-wash/page-desktop.jpg', width: 2160, height: 2420 },
      mobile: { src: '/work/truck-wash/page-mobile.jpg', width: 780, height: 4200 },
      alt: {
        ro: 'Pagina principală, de sus până jos: titlul „Spălătorie profesională pentru camioane și flote, în Pitești” peste un cadru video, apoi trei carduri (Servicii, Despre noi, Contact și program) și butoanele de programare și telefon.',
        en: 'The home page from top to bottom: the headline “Professional truck and fleet wash in Pitești” over a video frame, then three cards (Services, About us, Contact and hours) and the booking and phone buttons.',
      },
      note: {
        ro: 'Captură a paginii principale, fără subsol și fără butoanele fixe de pe ecran.',
        en: 'A capture of the home page, without the footer and the fixed on-screen buttons.',
      },
    },
    links: { live: null, repo: null },
    caseStudy: {
      context: {
        ro: 'Proiect demonstrativ: site-ul unei spălătorii pentru camioane, capete tractor și semiremorci, gândit pentru transportatori din România și din străinătate. Scopul: să explice serviciile pentru flote și să primească cereri de programare. Datele de contact sunt de exemplu.',
        en: 'A demo project: the website of a wash for trucks, tractor units and semi-trailers, designed for hauliers from Romania and abroad. The goal: explain the fleet services and take booking requests. Contact details are sample data.',
      },
      challenge: {
        ro: 'Clienții sunt transportatori și dispeceri care caută repede, de cele mai multe ori de pe telefon: ce servicii există, care e programul, cum fac o programare. Site-ul trebuia să răspundă în câteva secunde, să meargă pe orice telefon și să nu piardă nicio cerere.',
        en: 'Customers are hauliers and dispatchers searching in a hurry, usually on a phone: which services exist, what the hours are, how to book. The site had to answer within seconds, work on any phone and never lose a request.',
      },
      objectives: {
        ro: [
          'Cerere de programare în câțiva pași, confirmată apoi telefonic',
          'Telefonul și WhatsApp la un deget distanță, pe orice ecran de mobil',
          'Video de fundal fără să încetinească pagina',
          'Formulare care ajung sigur în e-mailul firmei',
          'Accesibilitate WCAG 2.1 AA și securitate de producție',
        ],
        en: [
          'A booking request in a few steps, then confirmed by phone',
          'Phone and WhatsApp one tap away on every mobile screen',
          'A background video that does not slow the page down',
          'Forms that reliably reach the business inbox',
          'WCAG 2.1 AA accessibility and production-grade security',
        ],
      },
      role: {
        ro: ['Structura paginilor și textele de interfață', 'Design vizual și componente', 'Dezvoltare Next.js + TypeScript', 'Rute API, validare, e-mail prin Resend', 'Teste automate și verificare în browser', 'Documentație de predare'],
        en: ['Page structure and interface copy', 'Visual design and components', 'Next.js + TypeScript development', 'API routes, validation, email via Resend', 'Automated tests and browser checks', 'Handover documentation'],
      },
      direction: {
        ro: 'Industrial și curat: alb, grafit și un singur albastru pentru acțiuni. Videoul de fundal stă în hero, sub un strat închis care păstrează contrastul textului la cel puțin 7,59:1.',
        en: 'Industrial and clean: white, graphite and a single blue for actions. The background video sits in the hero, under a dark overlay that keeps text contrast at 7.59:1 or better.',
      },
      process: [
        {
          title: { ro: 'Structură', en: 'Structure' },
          body: {
            ro: 'Cinci pagini (Acasă, Servicii, Despre, Contact, pagini legale) și toate datele firmei într-un singur fișier, ca o schimbare de program sau de telefon să se facă într-un loc.',
            en: 'Five pages (Home, Services, About, Contact, legal) with every business detail in a single file, so a change of hours or phone number happens in one place.',
          },
        },
        {
          title: { ro: 'Design', en: 'Design' },
          body: {
            ro: 'Componente simple, cu ținte de atingere de minimum 44 px și contraste calculate pentru fiecare pereche de culori.',
            en: 'Simple components with 44 px minimum touch targets and a contrast ratio calculated for every colour pair.',
          },
        },
        {
          title: { ro: 'Dezvoltare', en: 'Development' },
          body: {
            ro: 'Pagini generate static, iar cele două formulare au rute API pe server. Singurele dependențe de producție sunt next, react și react-dom.',
            en: 'Statically generated pages; the two forms have server-side API routes. The only production dependencies are next, react and react-dom.',
          },
        },
        {
          title: { ro: 'Verificare', en: 'Verification' },
          body: {
            ro: 'Teste unitare, un test end-to-end cu un server de e-mail fals și o verificare automată în Chrome la lățimi între 320 și 1440 px: scroll orizontal, tastatură, consolă, LCP și CLS.',
            en: 'Unit tests, an end-to-end test against a fake email server and an automated Chrome check from 320 to 1440 px: horizontal scroll, keyboard, console, LCP and CLS.',
          },
        },
      ],
      decisions: [
        {
          title: { ro: 'Videoul optimizat, nu eliminat', en: 'Optimise the video, don’t drop it' },
          body: {
            ro: 'Videoul sursă avea 5,2 MB. Acum are 1,2 MB pe desktop și 0,6 MB pe mobil, se încarcă abia după pagină, nu pornește dacă vizitatorul economisește date sau a cerut mișcare redusă și are buton de pauză.',
            en: 'The source video was 5.2 MB. It now weighs 1.2 MB on desktop and 0.6 MB on mobile, loads after the page, stays still for visitors on data saver or reduced motion, and has a pause button.',
          },
        },
        {
          title: { ro: 'Formulare protejate, fără biblioteci', en: 'Protected forms, no libraries' },
          body: {
            ro: 'Aceeași validare rulează în browser și pe server. Un câmp-capcană oprește roboții fără CAPTCHA, iar o limită de 5 trimiteri în 10 minute și verificarea originii opresc abuzurile. E-mailul pleacă printr-un simplu fetch către Resend.',
            en: 'The same validation runs in the browser and on the server. A honeypot field stops bots without a CAPTCHA; a 5-per-10-minutes limit and an origin check stop abuse. Email goes out through a plain fetch to Resend.',
          },
        },
        {
          title: { ro: 'Mesaje sincere', en: 'Honest messages' },
          body: {
            ro: 'Dacă trimiterea e-mailului nu e configurată, formularul spune asta și oferă numărul de telefon. Nu afișează niciodată „Mesaj trimis” pentru o cerere care nu a plecat.',
            en: 'When email delivery is not configured, the form says so and offers the phone number. It never shows “Message sent” for a request that did not leave.',
          },
        },
        {
          title: { ro: 'Harta Google, doar la cerere', en: 'Google Maps on request only' },
          body: {
            ro: 'Pagina de contact nu face nicio cerere către Google până când vizitatorul apasă „Încarcă harta”. Site-ul nu folosește cookie-uri proprii sau pixeli de urmărire.',
            en: 'The contact page makes no request to Google until the visitor presses “Load map”. The site uses no first-party cookies or tracking pixels.',
          },
        },
      ],
      gallery: [
        {
          src: '/work/truck-wash/services.png',
          width: 2160,
          height: 1350,
          frame: 'browser',
          alt: { ro: 'Pagina Servicii: șase carduri, de la spălare exterioară la contracte B2B.', en: 'Services page: six cards, from exterior wash to B2B contracts.' },
          caption: { ro: 'Serviciile, explicate în limbajul flotelor.', en: 'Services, written in the language of fleets.' },
        },
        {
          src: '/work/truck-wash/footage-brushes.webp',
          width: 1280,
          height: 720,
          frame: 'none',
          alt: { ro: 'Periile de spălare în funcțiune, cadru din videoclipul de fundal.', en: 'Wash brushes in motion, a frame from the background video.' },
          caption: { ro: 'Un cadru din videoclipul de fundal, optimizat pentru web.', en: 'A frame from the background video, optimised for the web.' },
        },
        {
          src: '/work/truck-wash/booking.png',
          width: 2160,
          height: 1350,
          frame: 'browser',
          alt: { ro: 'Formularul de programare cu tip de vehicul, număr de vehicule, dată și interval orar.', en: 'Booking form with vehicle type, number of vehicles, date and time slot.' },
          caption: { ro: 'Programarea: trei pași clari și confirmare telefonică.', en: 'Booking: three clear steps and a confirmation call.' },
        },
        {
          src: '/work/truck-wash/mobile.png',
          width: 780,
          height: 1688,
          frame: 'phone',
          alt: { ro: 'Prima pagină pe telefon, cu bara de apel și WhatsApp.', en: 'Home page on a phone, with the call and WhatsApp bar.' },
          caption: { ro: 'Pe telefon, apelul e mereu la un deget distanță.', en: 'On mobile, the call button is always one tap away.' },
        },
      ],
      stack: ['Next.js 16 (App Router)', 'React 19', 'TypeScript', 'Resend API', 'CSS custom properties', 'Node test runner', 'Chrome DevTools Protocol'],
      outcomes: {
        ro: [
          'Video de fundal: 5,2 MB → 1,2 MB pe desktop și 0,6 MB pe mobil',
          'Cea mai mare imagine din site: 76 KB',
          '3 dependențe de producție și 0 vulnerabilități la npm audit',
          'Verificat automat la lățimi între 320 și 1440 px',
        ],
        en: [
          'Background video: 5.2 MB → 1.2 MB on desktop and 0.6 MB on mobile',
          'Largest image on the site: 76 KB',
          '3 production dependencies and 0 vulnerabilities in npm audit',
          'Automatically checked at widths from 320 to 1440 px',
        ],
      },
      outcomesNote: {
        ro: 'Cifrele de mai sus sunt măsurători tehnice ale proiectului demonstrativ, nu rezultate de business.',
        en: 'The figures above are technical measurements of the demo project, not business results.',
      },
    },
  },
  {
    slug: 'barbershop',
    name: { ro: 'Briciul — Frizerie', en: 'Briciul — Barbershop' },
    ...demo,
    year: '2026',
    category: { ro: 'Website pentru servicii locale', en: 'Local business website' },
    services: {
      ro: ['Web design', 'Front-end', 'Motion'],
      en: ['Web design', 'Front-end', 'Motion'],
    },
    tags: ['Next.js', 'React', 'Motion', 'SVG'],
    summary: {
      ro: 'Site pentru o frizerie de cartier, cu un configurator de servicii care pregătește programarea pe WhatsApp.',
      en: 'A website for a neighbourhood barbershop, with a service builder that prepares the WhatsApp booking.',
    },
    problem: {
      ro: 'Frizeria primește programări la telefon și pe WhatsApp, fără un sistem de rezervări cu abonament. Site-ul trebuia să transforme interesul vizitatorului într-un mesaj complet: servicii, preț, durată, zi și oră.',
      en: 'The barbershop takes bookings by phone and WhatsApp, with no subscription booking system. The site had to turn a visitor’s interest into a complete message: services, price, duration, day and time.',
    },
    highlights: {
      ro: [
        'Configurator: alegi serviciile și vezi prețul și durata',
        'Mesaj de programare pregătit automat pentru WhatsApp',
        'Programul afișat pe loc: deschis acum sau când se deschide',
        'Design personalizat, gândit întâi pentru telefon',
      ],
      en: [
        'Builder: pick services and see the price and duration',
        'A booking message prepared automatically for WhatsApp',
        'Opening hours shown live: open now, or when it opens next',
        'A custom design, built for the phone first',
      ],
    },
    accent: '#7A1F1F',
    cover: {
      src: '/work/barbershop/desktop.jpg',
      width: 2160,
      height: 1350,
      frame: 'browser',
      alt: {
        ro: 'Prima pagină a demo-ului Briciul: titlul „Tunsoare bună, fără grabă și fără coadă.” lângă un stâlp de frizerie desenat într-o vitrină arcuită.',
        en: 'Home page of the Briciul demo: the headline “A good haircut, unhurried and without the queue” next to a barber pole drawn inside an arched window.',
      },
    },
    secondary: {
      src: '/work/barbershop/mobile.jpg',
      width: 780,
      height: 1688,
      frame: 'phone',
      alt: { ro: 'Demo-ul pe telefon, cu bara fixă „Sună” și „Programează-te”.', en: 'The demo on a phone, with the sticky “Call” and “Book” bar.' },
    },
    preview: { mode: 'live', src: '/demo/frizerie' },
    links: { live: '/demo/frizerie', repo: null },
    caseStudy: {
      context: {
        ro: 'Proiect demonstrativ: site-ul unei frizerii fictive, „Briciul”. Numele, adresa, telefonul, echipa și prețurile sunt date de exemplu, iar demo-ul se poate deschide și folosi direct din portofoliu.',
        en: 'A demo project: the website of a fictional barbershop, “Briciul”. The name, address, phone, team and prices are sample data, and the demo can be opened and used straight from the portfolio.',
      },
      challenge: {
        ro: 'O frizerie mică primește programări la telefon și pe WhatsApp, nu printr-un sistem de rezervări cu abonament. Site-ul trebuia să transforme interesul vizitatorului într-un mesaj de programare complet: ce servicii, cât costă, cât durează, în ce zi și la ce oră.',
        en: 'A small barbershop takes bookings by phone and WhatsApp, not through a subscription booking system. The site had to turn a visitor’s interest into a complete booking message: which services, what it costs, how long it takes, which day and when.',
      },
      objectives: {
        ro: [
          'Programare fără formular: totul se alege din lista de prețuri',
          'Totalul și durata, vizibile înainte de a scrie salonului',
          'Program și „Deschis acum” corecte, în ora României',
          'O identitate puternică fără nicio fotografie',
          'Apel și programare la un deget distanță pe telefon',
        ],
        en: [
          'Booking without a form: everything is chosen from the price list',
          'Total and duration visible before contacting the salon',
          'Correct opening hours and “Open now”, in Romanian time',
          'A strong identity without a single photograph',
          'Call and booking one tap away on mobile',
        ],
      },
      role: {
        ro: ['Concept și identitate vizuală', 'Design de interfață, desktop și mobil', 'Ilustrația SVG a stâlpului de frizerie', 'Front-end Next.js + React', 'Configuratorul de programare', 'Animație și accesibilitate'],
        en: ['Concept and visual identity', 'Interface design, desktop and mobile', 'SVG barber pole illustration', 'Next.js + React front-end', 'The booking builder', 'Animation and accessibility'],
      },
      direction: {
        ro: 'Frizerie clasică, citită editorial: fildeș, espresso, vișiniu și alamă. Fraunces pentru titluri și prețuri, Archivo îngustat pentru etichete. În locul fotografiilor, un stâlp de frizerie desenat în SVG, într-o vitrină arcuită, cu dungi care urcă la nesfârșit.',
        en: 'A classic barbershop read through an editorial lens: ivory, espresso, oxblood and brass. Fraunces for headlines and prices, condensed Archivo for labels. Instead of photography, an SVG barber pole in an arched shop window, its stripes rising endlessly.',
      },
      process: [
        {
          title: { ro: 'Întrebările clientului', en: 'The customer’s questions' },
          body: {
            ro: 'Pagina urmează ordinea în care se gândește un client nou: cât costă, când pot veni, cine mă tunde, unde e salonul.',
            en: 'The page follows a new customer’s train of thought: what does it cost, when can I come, who cuts my hair, where is it.',
          },
        },
        {
          title: { ro: 'Identitate fără poze', en: 'Identity without photos' },
          body: {
            ro: 'Un salon nou rareori are fotografii bune. Identitatea vine din tipografie, culoare și o singură ilustrație memorabilă.',
            en: 'A new salon rarely has good photography. The identity comes from type, colour and a single memorable illustration.',
          },
        },
        {
          title: { ro: 'Configuratorul', en: 'The booking builder' },
          body: {
            ro: 'Lista de prețuri e chiar interfața de programare. Fiecare alegere actualizează totalul, durata și mesajul.',
            en: 'The price list is the booking interface. Every choice updates the total, the duration and the message.',
          },
        },
        {
          title: { ro: 'Mobil întâi', en: 'Mobile first' },
          body: {
            ro: 'Pe telefon, „Sună” și „Programează-te” stau fixe jos, deasupra barei de gesturi, iar rezumatul urmează lista.',
            en: 'On phones, “Call” and “Book” stay fixed at the bottom, above the gesture bar, and the summary follows the list.',
          },
        },
      ],
      decisions: [
        {
          title: { ro: 'Lista de prețuri scrie mesajul', en: 'The price list writes the message' },
          body: {
            ro: 'Grupurile au reguli: un singur tip de tuns, un singur serviciu de barbă, oricâte extra. Mesajul conține serviciile, totalul, durata, ziua și intervalul, gata de trimis.',
            en: 'Groups have rules: one haircut, one beard service, any number of extras. The message contains the services, total, duration, day and time slot, ready to send.',
          },
        },
        {
          title: { ro: 'Demo onest', en: 'An honest demo' },
          body: {
            ro: 'Pe un site real, butonul ar deschide WhatsApp. Aici, mesajul apare într-un dialog și se poate copia, fără să plece nicăieri. Banda de sus spune clar că datele sunt de exemplu.',
            en: 'On a real site, the button would open WhatsApp. Here the message appears in a dialog and can be copied, without being sent anywhere. The top banner states clearly that the data is sample data.',
          },
        },
        {
          title: { ro: 'Ora României, oriunde', en: 'Romanian time, anywhere' },
          body: {
            ro: '„Deschis acum”, ziua evidențiată din program și zilele disponibile se calculează în fusul orar Europe/Bucharest, doar în browser, deci nu apar nepotriviri între server și client.',
            en: '“Open now”, today’s highlighted row and the bookable days are calculated in the Europe/Bucharest time zone, in the browser only, so server and client never disagree.',
          },
        },
        {
          title: { ro: 'Mișcare cu măsură', en: 'Motion in moderation' },
          body: {
            ro: 'Titlul apare rând cu rând, dungile stâlpului urcă, iar banda de servicii curge. La setarea „mișcare redusă”, totul stă pe loc.',
            en: 'The headline rises line by line, the pole’s stripes climb and the services band scrolls. With reduced motion enabled, everything stays still.',
          },
        },
      ],
      gallery: [
        {
          src: '/work/barbershop/booking.jpg',
          width: 2160,
          height: 1350,
          frame: 'browser',
          alt: { ro: 'Configuratorul: servicii bifate, totalul de 125 lei, ziua și intervalul alese.', en: 'The booking builder: ticked services, a 125 lei total, the chosen day and time slot.' },
          caption: { ro: 'Bifezi, vezi totalul și durata, alegi când vii.', en: 'Tick, see the total and duration, choose when to come.' },
        },
        {
          src: '/work/barbershop/message.jpg',
          width: 2160,
          height: 1350,
          frame: 'browser',
          alt: { ro: 'Dialogul cu mesajul de programare generat pentru WhatsApp.', en: 'The dialog with the generated WhatsApp booking message.' },
          caption: { ro: 'Mesajul se scrie singur. În demo, doar se afișează.', en: 'The message writes itself. In the demo, it is only displayed.' },
        },
        {
          src: '/work/barbershop/mobile-booking.jpg',
          width: 780,
          height: 1688,
          frame: 'phone',
          alt: { ro: 'Rezumatul programării pe telefon.', en: 'The booking summary on a phone.' },
          caption: { ro: 'Pe telefon, rezumatul urmează lista.', en: 'On mobile, the summary follows the list.' },
        },
        {
          src: '/work/barbershop/mobile.jpg',
          width: 780,
          height: 1688,
          frame: 'phone',
          alt: { ro: 'Prima pagină pe telefon.', en: 'The home page on a phone.' },
          caption: { ro: 'Apel și programare, mereu la îndemână.', en: 'Call and book, always within reach.' },
        },
      ],
      stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Motion', 'SVG', 'Intl API'],
      outcomes: {
        ro: [
          '0 fotografii: identitatea e construită din tipografie, culoare și SVG',
          'Pagina e generată static; doar configuratorul și ora rulează în browser',
          'Program și disponibilitate calculate în fusul orar al României',
          'Variantă completă pentru „mișcare redusă” și navigare din tastatură',
        ],
        en: [
          '0 photographs: the identity is built from type, colour and SVG',
          'The page is statically generated; only the builder and the clock run in the browser',
          'Opening hours and availability calculated in Romanian time',
          'A complete reduced-motion variant and full keyboard navigation',
        ],
      },
      outcomesNote: {
        ro: 'Deschide demo-ul și încearcă programarea: nimic nu se trimite.',
        en: 'Open the demo and try booking: nothing is sent.',
      },
    },
  },
  {
    slug: 'codesprint',
    name: { ro: 'CodeSprint', en: 'CodeSprint' },
    ...personal,
    year: '2026',
    category: { ro: 'Aplicație educațională', en: 'Educational app' },
    services: {
      ro: ['Product design', 'Development', 'Backend'],
      en: ['Product design', 'Development', 'Backend'],
    },
    tags: ['React Native', 'Expo', 'Supabase'],
    summary: {
      ro: 'Aplicație mobilă pentru învățat Python, cu lecții scurte, exerciții verificate și progres salvat în cont.',
      en: 'A mobile app for learning Python, with short lessons, checked exercises and progress saved to an account.',
    },
    problem: {
      ro: 'O aplicație educațională trebuie să fie corectă și să motiveze zilnic. Scopul a fost un produs complet, de la specificație la bază de date și teste, nu doar câteva ecrane.',
      en: 'An educational app has to be correct and motivating every day. The goal was a complete product, from specification to database and tests, not just a few screens.',
    },
    highlights: {
      ro: [
        'Lecții de câteva minute, cu exemple de cod',
        'Exerciții cu verificarea răspunsurilor',
        'XP, serii zilnice și clasamente protejate pe server',
        'Mod invitat, cu progresul păstrat la crearea contului',
      ],
      en: [
        'Lessons of a few minutes, with code examples',
        'Exercises with answer checking',
        'XP, daily streaks and leaderboards protected on the server',
        'Guest mode that keeps progress when an account is created',
      ],
    },
    accent: '#8B7CF6',
    cover: {
      src: '/work/codesprint/lesson.png',
      width: 1080,
      height: 2400,
      frame: 'phone',
      alt: {
        ro: 'Ecranul unei lecții: „Three more ways to do arithmetic”, cu cod Python și blocul Output.',
        en: 'A lesson screen: “Three more ways to do arithmetic”, with Python code and its Output block.',
      },
    },
    secondary: {
      src: '/work/codesprint/home.png',
      width: 1080,
      height: 2400,
      frame: 'phone',
      alt: { ro: 'Ecranul principal al aplicației.', en: 'The app’s home screen.' },
    },
    links: { live: null, repo: null },
    caseStudy: {
      context: {
        ro: 'Proiect personal: o aplicație mobilă construită cap-coadă, de la specificație la backend și teste, ca să arate lucrul pe un produs complet. „CodeSprint” este un nume de lucru.',
        en: 'A personal project: a mobile app built end to end, from specification to backend and tests, to show work on a complete product. “CodeSprint” is a working name.',
      },
      challenge: {
        ro: 'O aplicație educațională trebuie să fie corectă, pentru că o lecție care afirmă un rezultat greșit distruge încrederea. Trebuie să motiveze zilnic fără să poată fi trișată și să respecte regulile pentru utilizatorii minori.',
        en: 'An educational app has to be correct, because one lesson that claims the wrong output destroys trust. It has to motivate daily without being cheatable, and respect the rules for underage users.',
      },
      objectives: {
        ro: ['Lecții de câteva minute, gândite pentru telefon', 'Conținut corect, verificat automat', 'XP și clasamente care nu pot fi falsificate din aplicație', 'Mod invitat, cu progresul păstrat la crearea contului', 'Protecții pentru minori, impuse de baza de date'],
        en: ['Lessons of a few minutes, designed for the phone', 'Correct content, verified automatically', 'XP and leaderboards that cannot be faked from the app', 'Guest mode that keeps progress when an account is created', 'Minor protections, enforced by the database'],
      },
      role: {
        ro: ['Specificație și arhitectură', 'Design de interfață, temă light și dark', 'Aplicația React Native + Expo', 'Backend Supabase: tabele, politici, funcții', 'Pipeline de conținut', 'Teste unitare, pgTAP și E2E'],
        en: ['Specification and architecture', 'Interface design, light and dark themes', 'React Native + Expo app', 'Supabase backend: tables, policies, functions', 'Content pipeline', 'Unit, pgTAP and E2E tests'],
      },
      direction: {
        ro: 'Dark-first, în mov și indigo, cu cod monospaced și blocuri „Output” care arată exact ce afișează programul. Fiecare ecran are o singură idee.',
        en: 'Dark-first, in violet and indigo, with monospaced code and “Output” blocks that show exactly what the program prints. Every screen carries one idea.',
      },
      process: [
        {
          title: { ro: 'Specificație', en: 'Specification' },
          body: {
            ro: 'Un document unic cu scopul, fazele și regulile, iar fiecare fază se închide doar cu testele trecute.',
            en: 'A single source-of-truth document with scope, phases and rules; each phase closes only when its tests pass.',
          },
        },
        {
          title: { ro: 'Interfață', en: 'Interface' },
          body: {
            ro: 'Ecrane mici și clare: lecție, feedback, hartă de învățare, progres. Temele light și dark au fost gândite de la început.',
            en: 'Small, clear screens: lesson, feedback, learning map, progress. Light and dark themes were designed from day one.',
          },
        },
        {
          title: { ro: 'Backend', en: 'Backend' },
          body: {
            ro: 'Postgres pe Supabase, cu politici pe rânduri și funcții care sunt singurul drum prin care se scrie progresul.',
            en: 'Postgres on Supabase, with row-level policies and functions that are the only path through which progress is written.',
          },
        },
        {
          title: { ro: 'Lansare', en: 'Release' },
          body: {
            ro: 'Trei variante de build instalabile în paralel, capturi pentru magazine generate direct din aplicație și actualizări OTA pentru corecturi.',
            en: 'Three build variants installable side by side, store screenshots generated from the app itself and OTA updates for fixes.',
          },
        },
      ],
      decisions: [
        {
          title: { ro: 'Lecțiile sunt cod și sunt rulate', en: 'Lessons are code, and they run' },
          body: {
            ro: 'Lecțiile stau în fișiere YAML, revizuite ca orice cod. În CI, fiecare fragment rulează pe Python 3.12 și 3.14 și e comparat cu ce afirmă lecția. O lecție care spune 24 când programul afișează 25 oprește build-ul.',
            en: 'Lessons live in YAML files, reviewed like any code. In CI, every snippet runs on Python 3.12 and 3.14 and is compared with what the lesson claims. A lesson that says 24 when the program prints 25 fails the build.',
          },
        },
        {
          title: { ro: 'Progresul se scrie doar pe server', en: 'Progress is written only on the server' },
          body: {
            ro: 'XP-ul se scrie exclusiv printr-un registru append-only, din funcții Postgres. Răspunsurile corecte nu părăsesc niciodată baza de date.',
            en: 'XP is written only through an append-only ledger, from Postgres functions. Answer keys never leave the database.',
          },
        },
        {
          title: { ro: 'Invitat, fără pierderi', en: 'Guests lose nothing' },
          body: {
            ro: 'Contul de invitat se creează doar când utilizatorul alege „continuă ca invitat”, nu la pornire. Adăugarea unui e-mail păstrează același cont, cu tot progresul.',
            en: 'A guest account is created only when the user taps “continue as guest”, never on launch. Adding an email keeps the same account and all progress.',
          },
        },
        {
          title: { ro: 'Protecția minorilor, impusă de baza de date', en: 'Minor protection, enforced by the database' },
          body: {
            ro: 'Sub 13 ani, contul e șters, nu doar blocat. Sub 16 ani, baza de date dezactivează analiza, ascunde clasamentul și impune reclame nepersonalizate, orice ar trimite aplicația.',
            en: 'Under 13, the account is deleted, not just blocked. Under 16, the database turns analytics off, hides the leaderboard and forces non-personalised ads, whatever the app sends.',
          },
        },
      ],
      gallery: [
        {
          src: '/work/codesprint/home.png',
          width: 1080,
          height: 2400,
          frame: 'phone',
          alt: { ro: 'Ecranul principal.', en: 'Home screen.' },
          caption: { ro: 'Acasă: obiectivul zilei, dintr-o privire.', en: 'Home: today’s goal at a glance.' },
        },
        {
          src: '/work/codesprint/feedback.png',
          width: 1080,
          height: 2400,
          frame: 'phone',
          alt: { ro: 'Ecranul de feedback după un răspuns.', en: 'Feedback screen after an answer.' },
          caption: { ro: 'Feedback imediat, cu explicație.', en: 'Instant feedback, with an explanation.' },
        },
        {
          src: '/work/codesprint/learn.png',
          width: 1080,
          height: 2400,
          frame: 'phone',
          alt: { ro: 'Harta de învățare, cu modulele cursului.', en: 'Learning map with the course modules.' },
          caption: { ro: 'Harta de învățare.', en: 'The learning map.' },
        },
        {
          src: '/work/codesprint/progress.png',
          width: 1080,
          height: 2400,
          frame: 'phone',
          alt: { ro: 'Ecranul de progres.', en: 'Progress screen.' },
          caption: { ro: 'Progres calculat pe server.', en: 'Progress, calculated on the server.' },
        },
      ],
      stack: ['React Native', 'Expo (EAS)', 'TypeScript', 'Supabase (Postgres, Auth, Edge Functions)', 'TanStack Query', 'Zustand', 'Jest', 'pgTAP', 'Maestro'],
      outcomes: {
        ro: [
          'Construită în 22 de faze, fiecare închisă doar cu testele trecute',
          'Fiecare fragment de cod din lecții rulează în CI pe Python 3.12 și 3.14',
          'Suită E2E pe dispozitiv pentru fluxurile cheie: onboarding, plăți, export și ștergerea contului',
          'SDK-urile externe stau doar în src/services, regulă verificată de ESLint și de un test',
        ],
        en: [
          'Built in 22 phases, each closed only once its tests passed',
          'Every code snippet in the lessons runs in CI on Python 3.12 and 3.14',
          'On-device E2E suite for key flows: onboarding, purchases, data export and account deletion',
          'Third-party SDKs live only in src/services, a rule enforced by ESLint and a test',
        ],
      },
    },
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacent(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug)
  const n = projects.length
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] }
}
