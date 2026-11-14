import type { Metadata, Viewport } from 'next'
import { Archivo, Fraunces } from 'next/font/google'
import './demo.css'
import { MotionProvider } from '@/components/ui/motion'

/**
 * Layout separat pentru demo-urile din portofoliu (/demo/...): alt sistem vizual, fără antetul portofoliului.
 * Demo-urile nu se indexează: sunt exemple, nu firme reale.
 */
const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-fraunces',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#f3ede3' }

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
