import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * 404 pentru adrese care nu corespund niciunei rute (nici măcar unei limbi). Bilingv.
 * Intenționat fără globals.css și fără next/font: resursele importate aici ajung preîncărcate
 * și în celelalte root layouts (de ex. /demo), deci pagina folosește doar stiluri inline și fonturi de sistem.
 */
export const metadata: Metadata = {
  title: '404 · Alex D.',
  description: 'Pagina nu există. · This page doesn’t exist.',
}

const css = `
  body{margin:0;min-height:100svh;display:flex;align-items:center;background:#05070d;color:#f1ede4;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  main{width:100%;max-width:90rem;margin:0 auto;padding:6rem clamp(1rem,4vw,3.5rem)}
  .brand{font:400 1.625rem/1 Georgia,serif;margin:0}
  .dot{color:#ff6a3d}
  .code{margin:4rem 0 0;font:500 .6875rem/1.4 ui-monospace,monospace;letter-spacing:.14em;color:#ff6a3d}
  h1{margin:1.5rem 0 0;font:400 clamp(2.75rem,6.6vw,6.75rem)/.95 Georgia,serif;letter-spacing:-.02em}
  .en{margin:.75rem 0 0;font:400 clamp(1.625rem,2.6vw,2.5rem)/1.1 Georgia,serif;color:#a8a294}
  nav{margin-top:3rem;display:flex;flex-wrap:wrap;gap:.75rem}
  a{display:inline-flex;align-items:center;min-height:3rem;padding:0 1.5rem;border:1px solid rgb(241 237 228/.22);
    color:inherit;text-decoration:none;transition:border-color .3s}
  a:hover{border-color:#f1ede4}
  a:focus-visible{outline:2px solid #ff6a3d;outline-offset:3px}
`

export default function GlobalNotFound() {
  return (
    <html lang="ro">
      <body>
        <style>{css}</style>
        <main>
          <p className="brand">
            Alex D<span className="dot">.</span>
          </p>
          <p className="code">404</p>
          <h1>Pagina nu există.</h1>
          <p lang="en" className="en">
            This page doesn’t exist.
          </p>
          <nav aria-label="Navigare">
            <Link href="/ro">Prima pagină</Link>
            <Link href="/en" lang="en">
              Home page
            </Link>
          </nav>
        </main>
      </body>
    </html>
  )
}
