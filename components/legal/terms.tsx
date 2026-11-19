import { site } from '@/content/site'
import { termsSections } from '@/content/terms'
import { type Locale, paths } from '@/lib/i18n'
import { legalRoute } from './legal-page'

/** Logica pentru /ro/termeni și /en/terms. */
export function termsRoute(owner: Locale) {
  return legalRoute(owner, {
    title: (dict) => dict.terms.title,
    description: {
      ro: 'Cine sunt, cum se stabilesc ofertele și prețurile, dreptul de retragere, reclamațiile și soluționarea alternativă a litigiilor (ANPC SAL).',
      en: 'Who I am, how quotes and prices are set, the right of withdrawal, complaints and alternative dispute resolution (ANPC SAL).',
    },
    path: paths.terms,
    sections: termsSections,
    updated: site.termsUpdated,
  })
}
