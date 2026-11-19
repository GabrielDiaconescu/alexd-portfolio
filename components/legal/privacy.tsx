import { privacySections } from '@/content/privacy'
import { site } from '@/content/site'
import { type Locale, paths } from '@/lib/i18n'
import { legalRoute } from './legal-page'

/** Logica pentru /ro/confidentialitate și /en/privacy. */
export function privacyRoute(owner: Locale) {
  return legalRoute(owner, {
    title: (dict) => dict.privacy.title,
    description: {
      ro: 'Ce date colectează site-ul prin formularul de proiect, la ce sunt folosite, unde ajung și ce drepturi ai asupra lor.',
      en: 'What data this site collects through the project form, what it is used for, where it goes and what rights you have over it.',
    },
    path: paths.privacy,
    sections: privacySections,
    updated: site.privacyUpdated,
  })
}
