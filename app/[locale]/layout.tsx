import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '../globals.css'
import { about } from '@/content/about'
import { getDictionary } from '@/content/dictionary'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { Ambient } from '@/components/layout/ambient'
import { ButtonTilt } from '@/components/layout/button-tilt'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CursorLabel } from '@/components/layout/cursor-label'
import { SmoothAnchors } from '@/components/layout/smooth-anchors'
import { SmoothScroll } from '@/components/layout/smooth-scroll'
import { MotionProvider } from '@/components/ui/motion'
import { fontVariables } from '@/lib/fonts'
import { defaultLocale, isLocale, languageAlternates, locales, ogLocales, paths } from '@/lib/i18n'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#05070d',
  colorScheme: 'dark',
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · ${site.displayName}` },
    description: dict.meta.description,
    applicationName: site.brand,
    authors: [{ name: site.displayName, url: paths.home(locale) }],
    creator: site.displayName,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    alternates: {
      canonical: paths.home(locale),
      languages: { ...languageAlternates(paths.home), 'x-default': paths.home(defaultLocale) },
    },
    openGraph: {
      type: 'website',
      siteName: site.displayName,
      ...ogLocales(locale),
      title: dict.meta.title,
      description: dict.meta.description,
      url: paths.home(locale),
    },
    twitter: { card: 'summary_large_image', title: dict.meta.title, description: dict.meta.description },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  // Datele structurate: site-ul, persoana și serviciul, legate prin @id, ca Google să le citească drept aceeași entitate.
  const abs = (p: string) => new URL(p, site.url).toString()
  const home = abs(paths.home(locale))
  const person = `${abs('/')}#person`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${abs('/')}#website`,
        url: home,
        name: site.displayName,
        description: dict.meta.description,
        inLanguage: locale,
        publisher: { '@id': person },
      },
      {
        '@type': 'Person',
        '@id': person,
        name: site.displayName,
        alternateName: [site.fullName, site.brand],
        jobTitle: site.role[locale],
        description: about.intro[locale][0],
        url: home,
        email: site.email[locale],
        telephone: site.phone.e164,
        ...(about.portrait && { image: abs(about.portrait.src) }),
        knowsAbout: ['Web Development', 'Web Design', 'Creare site-uri web', 'Next.js', 'React', 'TypeScript'],
        knowsLanguage: ['ro', 'en'],
        sameAs: site.socials.map((s) => s.href),
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${abs('/')}#service`,
        name: `${site.displayName} · Web Developer`,
        description: dict.meta.description,
        url: home,
        email: site.email[locale],
        telephone: site.phone.e164,
        ...(about.portrait && { image: abs(about.portrait.src) }),
        founder: { '@id': person },
        areaServed: [
          { '@type': 'City', name: 'Pitești' },
          { '@type': 'AdministrativeArea', name: 'Argeș' },
          { '@type': 'Country', name: 'Romania' },
        ],
        knowsLanguage: ['ro', 'en'],
        legalName: site.company.legalName,
        taxID: site.company.cui,
        address: { '@type': 'PostalAddress', addressLocality: 'Făcălețești', addressRegion: 'Argeș', addressCountry: 'RO' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: dict.services.eyebrow,
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.name[locale], description: `${s.lead[locale]} ${s.body[locale]}` },
          })),
        },
        sameAs: site.socials.map((s) => s.href),
      },
    ],
  }

  return (
    <html lang={locale} className={fontVariables}>
      <body id="top">
        <noscript>
          {/* Fără JavaScript, elementele care apar la scroll sunt afișate direct. */}
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <a
          href="#main"
          // sr-only, nu translate în afara ecranului: pe iPhone, Safari arată și zona de deasupra paginii la derulare.
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ember focus:px-4 focus:py-3 focus:text-ink"
        >
          {dict.skip}
        </a>
        <Ambient />
        <MotionProvider>
          <Header locale={locale} nav={dict.nav} emails={site.emails} phone={{ href: site.phone.href, label: site.phone.display[locale] }} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={locale} dict={dict} />
          <CursorLabel />
          <SmoothScroll />
          <SmoothAnchors />
          <ButtonTilt />
        </MotionProvider>
        <script
          type="application/ld+json"
          // Conținut static, generat din content/site.ts.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  )
}
