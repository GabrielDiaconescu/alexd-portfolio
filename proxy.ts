import { NextResponse, type NextRequest } from 'next/server'

/**
 * Doar pentru „/”: trimite vizitatorul la /ro sau /en după limba preferată din browser.
 * Implicit română (piața principală). Restul adreselor nu trec prin aici.
 */
export function proxy(request: NextRequest) {
  const header = request.headers.get('accept-language') ?? ''
  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: tag.toLowerCase().slice(0, 2), q: q ? Number(q) : 1 }
    })
    .filter((x) => x.lang === 'ro' || x.lang === 'en')
    .sort((a, b) => b.q - a.q)[0]?.lang
  const locale = preferred ?? 'ro'
  return NextResponse.redirect(new URL(`/${locale}`, request.url), 307)
}

export const config = {
  matcher: '/',
}
