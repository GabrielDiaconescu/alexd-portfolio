import { NextResponse, type NextRequest } from 'next/server'
import { site } from '@/content/site'
import { negotiateLocale } from '@/lib/i18n'

/**
 * 1. www.alexd.ro → alexd.ro (308, păstrează calea și parametrii), ca Google să vadă o singură adresă.
 * 2. „/”: trimite vizitatorul la limba preferată din browser, dintre cele din `locales`. Implicit română.
 */
export function proxy(request: NextRequest) {
  const canonicalHost = new URL(site.url).hostname
  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0]
  if (host === `www.${canonicalHost}`) {
    const { pathname, search } = request.nextUrl
    return NextResponse.redirect(new URL(pathname + search, site.url), 308)
  }
  if (request.nextUrl.pathname === '/') {
    const locale = negotiateLocale(request.headers.get('accept-language'))
    return NextResponse.redirect(new URL(`/${locale}`, request.url), 307)
  }
  return NextResponse.next()
}

export const config = {
  // Toate paginile, fără fișierele statice din _next (nu au nevoie de redirect-ul de limbă).
  matcher: '/((?!_next/).*)',
}
