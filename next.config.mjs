// Fișier .mjs, nu .ts: pe găzduire rulează fără pachetul typescript (devDependencies nu se instalează acolo).
const isDev = process.env.NODE_ENV === 'development'

// Paginile statice Next.js au scripturi inline, deci script-src are nevoie de 'unsafe-inline'.
// Varianta cu nonce ar face toate paginile dinamice. Site-ul nu afișează conținut trimis de vizitatori.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // În C:\Users\Alexandru există un package-lock.json rătăcit; fixăm rădăcina proiectului aici.
  turbopack: { root: process.cwd() },
  // Testare de pe telefon/alt PC din rețeaua locală (next dev blochează altfel resursele de dev).
  // 169.254.* e adresa adaptorului Tailscale, pe care next dev o afișează la „Network”.
  allowedDevOrigins: ['192.168.1.*', '169.254.*.*'],
  images: {
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    globalNotFound: true,
    agentUpgrade: 'security',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      {
        // Demo-urile se încarcă și în previzualizările din studiile de caz: iframe, doar pe același domeniu.
        // Regula vine după cea generală, deci o înlocuiește pentru aceste două antete.
        source: '/demo/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp.replace("frame-ancestors 'none'", "frame-ancestors 'self'") },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
