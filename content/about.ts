import type { Localized } from '@/lib/i18n'

export const about = {
  /** Primul paragraf apare mare și e folosit și în datele structurate (Person.description). */
  intro: {
    ro: [
      'Sunt Alexandru Diaconescu, dezvoltator web și student în anul III la Calculatoare, în Pitești.',
      'Pun accent pe site-uri moderne, rapide și ușor de folosit, în care informația este organizată clar, iar vizitatorii găsesc rapid ceea ce caută.',
      'Mă ocup personal de fiecare etapă a proiectului: de la structură și design până la dezvoltare, testare și publicare. Astfel, ai un singur punct de contact și știi mereu cine lucrează la site-ul tău.',
      'Lucrez independent și aleg să gestionez un număr limitat de proiecte simultan, pentru a acorda fiecăruia atenția necesară.',
    ],
    en: [
      'I’m Alexandru Diaconescu, a web developer and third-year Computer Science student in Pitești, Romania.',
      'I focus on modern, fast, easy-to-use websites where information is clearly organised and visitors quickly find what they’re looking for.',
      'I personally handle every stage of the project, from structure and design to development, testing and launch. That way you have a single point of contact and always know who is working on your website.',
      'I work independently and choose to take on a limited number of projects at a time, so each one gets the attention it needs.',
    ],
  } satisfies Localized<string[]>,

  /** Tehnologiile, grupate pe categorii. Eticheta categoriei e tradusă; numele tehnologiilor rămân la fel. */
  tools: [
    { label: { ro: 'Frontend', en: 'Frontend' }, items: ['Next.js', 'React', 'TypeScript'] },
    { label: { ro: 'Design și UI', en: 'Design & UI' }, items: ['Tailwind CSS', 'Motion'] },
    { label: { ro: 'Backend', en: 'Backend' }, items: ['Node.js', 'Supabase'] },
    { label: { ro: 'Mobil', en: 'Mobile' }, items: ['React Native', 'Expo'] },
    { label: { ro: 'Dezvoltare', en: 'Development' }, items: ['Git'] },
  ] satisfies { label: Localized; items: string[] }[],

  /**
   * Fotografia: fișierul stă în public/about/ (Next servește imagini doar din public/).
   * width / height = dimensiunile reale ale fișierului. Se decupează automat în format 4:5.
   * Poza actuală e decupată 4:5 (cap – mâini) și are 559 px lățime; una de minim 800 px ar fi mai clară pe ecrane retina.
   */
  portrait: { src: '/about/alexandru.jpg', width: 559, height: 699 } as null | { src: string; width: number; height: number },
}
