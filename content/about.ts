import type { Localized } from '@/lib/i18n'

export const about = {
  /** Primul paragraf apare mare și e folosit și în datele structurate (Person.description). */
  intro: {
    ro: [
      'Sunt Alexandru Diaconescu, dezvoltator web și student în anul III la Calculatoare și Tehnologia Informației.',
      'Creez site-uri pentru afaceri care vor să arate profesionist online și să fie ușor de găsit și de contactat. Mă ocup de tot drumul: structură, design, cod, testare și publicare.',
      'Lucrez direct cu tine, fără intermediari. Știi mereu în ce stadiu e proiectul și cine răspunde de el: eu.',
    ],
    en: [
      'I’m Alexandru Diaconescu, a web developer and third-year Computer Science and Information Technology student.',
      'I build websites for businesses that want to look professional online and be easy to find and contact. I handle the whole journey: structure, design, code, testing and launch.',
      'You work with me directly, with no middlemen. You always know where the project stands and who is responsible for it: me.',
    ],
  } satisfies Localized<string[]>,

  approach: [
    {
      title: { ro: 'Practic, nu teoretic', en: 'Practical, not theoretical' },
      body: {
        ro: 'Pornesc de la ce trebuie să facă vizitatorul: să sune, să ceară o ofertă, să facă o programare. Restul se construiește în jurul acestui scop.',
        en: 'I start from what the visitor has to do: call, ask for a quote, book. Everything else is built around that goal.',
      },
    },
    {
      title: { ro: 'Atenție la detalii', en: 'Attention to detail' },
      body: {
        ro: 'Verific fiecare pagină pe telefon și pe desktop: texte, contraste, formulare, viteză. Detaliile mici fac diferența dintre un site corect și unul în care ai încredere.',
        en: 'I check every page on phone and desktop: copy, contrast, forms, speed. The small details are the difference between a site that works and one people trust.',
      },
    },
    {
      title: { ro: 'Design gândit pentru oameni', en: 'Design built around people' },
      body: {
        ro: 'Un design frumos contează, dar contează mai mult ca informația să se găsească ușor și ca site-ul să fie simplu de folosit.',
        en: 'Good looks matter, but it matters more that information is easy to find and the site is simple to use.',
      },
    },
    {
      title: { ro: 'Comunicare directă', en: 'Direct communication' },
      body: {
        ro: 'Îți explic deciziile pe înțelesul tău și îți spun de la început ce intră în proiect și ce nu.',
        en: 'I explain decisions in plain language and tell you from the start what is in scope and what isn’t.',
      },
    },
    {
      title: { ro: 'Răspund pentru ce livrez', en: 'I stand behind my work' },
      body: {
        ro: 'Proiectez, dezvolt și verific site-ul eu, iar după lansare rămân omul la care apelezi dacă apare o problemă.',
        en: 'I design, build and test the site myself, and after launch I remain the person you call if anything comes up.',
      },
    },
  ],

  tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'React Native', 'Expo', 'Supabase', 'Node.js', 'Cloudflare', 'Vercel', 'Git'],

  /**
   * Fotografia: fișierul stă în public/about/ (Next servește imagini doar din public/).
   * width / height = dimensiunile reale ale fișierului. Se decupează automat în format 4:5.
   * Poza actuală e decupată 4:5 (cap – mâini) și are 559 px lățime; una de minim 800 px ar fi mai clară pe ecrane retina.
   */
  portrait: { src: '/about/alexandru.jpg', width: 559, height: 699 } as null | { src: string; width: number; height: number },
}
