import type { PosterId } from '@/content/types'
import type { Locale } from '@/lib/i18n'

type Props = { id: PosterId; locale: Locale; className?: string; /** Fără ramă proprie (când stă deja într-o ramă). */ bare?: boolean }

/**
 * Compoziții tipografice pentru proiectele fără capturi de ecran.
 * Se scalează cu containerul (unități cqw), deci arată la fel în hero, în listă și în studiul de caz.
 */
export function Poster({ id, locale, className = '', bare }: Props) {
  if (id === 'barbershop') return <BarberPoster locale={locale} className={className} bare={bare} />
  return null
}

const barberCopy = {
  ro: {
    alt: 'Compoziție tipografică pentru proiectul Frizerie: titlul „Un look impecabil” și o listă de prețuri cu servicii bifate.',
    label: 'Frizerie & barbershop',
    title: ['Un look', '*impecabil.*'],
    lead: 'Bifezi serviciile, vezi totalul, trimiți pe WhatsApp.',
    rows: [
      ['Tuns clasic', '50', true],
      ['Aranjat barbă', '25', true],
      ['Spălat și stilizat', '15', false],
    ] as const,
    total: 'Total',
    cta: 'Trimite pe WhatsApp',
  },
  en: {
    alt: 'Typographic composition for the Barbershop project: the headline “An impeccable look” and a price list with ticked services.',
    label: 'Barbershop',
    title: ['An', '*impeccable look.*'],
    lead: 'Tick the services, see the total, send it on WhatsApp.',
    rows: [
      ['Classic cut', '50', true],
      ['Beard trim', '25', true],
      ['Wash & style', '15', false],
    ] as const,
    total: 'Total',
    cta: 'Send on WhatsApp',
  },
}

const gold = '#c9a45c'

function BarberPoster({ locale, className, bare }: { locale: Locale; className: string; bare?: boolean }) {
  const t = barberCopy[locale]
  const total = t.rows.filter((r) => r[2]).reduce((sum, r) => sum + Number(r[1]), 0)
  return (
    <div
      role="img"
      aria-label={t.alt}
      className={`@container relative aspect-[16/10] w-full overflow-hidden bg-[#16110d] ${bare ? '' : 'rounded-[0.625rem] border border-[#c9a45c]/25'} ${className}`}
      style={{
        // Cărămidă: un model SVG cu rânduri decalate, plus o lumină caldă de sus.
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3Cpath d='M0 .5H120M0 30.5H120M.5 0V30M60.5 30V60' stroke='%23000' stroke-opacity='.6' fill='none'/%3E%3C/svg%3E"),
          radial-gradient(80% 70% at 30% 20%, rgb(201 164 92 / 0.16), transparent 70%)`,
        backgroundSize: '12cqw 6cqw, 100% 100%',
      }}
    >
      {/* O rază de lumină aurie, în diagonală. */}
      <span aria-hidden="true" className="absolute -left-[10%] top-[58%] h-px w-[70%] -rotate-[14deg] bg-gradient-to-r from-transparent via-[#c9a45c]/50 to-transparent" />

      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-[1.2fr_1fr] items-center gap-[5cqw] px-[6.5cqw] py-[6cqw]">
        <div>
          <p className="flex items-center gap-[1.2cqw] font-mono text-[1.35cqw] uppercase tracking-[0.2em]" style={{ color: gold }}>
            <span className="inline-block h-px w-[3.5cqw]" style={{ background: gold }} />✂ {t.label}
          </p>
          <p className="mt-[2.5cqw] font-display text-[7.6cqw] leading-[0.95] tracking-[-0.02em] text-[#f3ece0]">
            {t.title.map((line, i) => (
              <span key={i} className="block">
                {line.startsWith('*') ? (
                  <em className="italic" style={{ color: gold }}>
                    {line.replace(/\*/g, '')}
                  </em>
                ) : (
                  line
                )}
              </span>
            ))}
          </p>
          <p className="mt-[2.5cqw] max-w-[30cqw] text-[1.55cqw] leading-snug text-[#cfc5b4]">{t.lead}</p>
        </div>

        <div className="rounded-[1.4cqw] border border-[#c9a45c]/30 bg-black/35 p-[2.8cqw]">
          <ul className="flex flex-col gap-[1.9cqw]">
            {t.rows.map(([name, price, on]) => (
              <li key={name} className="flex items-center gap-[1.2cqw] text-[1.55cqw] text-[#f3ece0]">
                <span
                  className="grid size-[2.2cqw] shrink-0 place-items-center rounded-full border text-[1.3cqw] leading-none"
                  style={{ borderColor: gold, background: on ? gold : 'transparent', color: '#16110d' }}
                >
                  {on ? '✓' : ''}
                </span>
                <span className="whitespace-nowrap">{name}</span>
                <span className="h-0 flex-1 border-b border-dotted border-[#c9a45c]/40" />
                <span className="font-mono" style={{ color: gold }}>
                  {price} RON
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-[2.4cqw] flex items-center justify-between border-t border-[#c9a45c]/25 pt-[2cqw]">
            <span className="font-mono text-[1.15cqw] uppercase tracking-[0.18em] text-[#cfc5b4]">{t.total}</span>
            <span className="font-mono text-[2.6cqw]" style={{ color: gold }}>
              {total} RON
            </span>
          </div>
          <span className="mt-[2cqw] block rounded-full py-[1.1cqw] text-center text-[1.4cqw] font-medium text-[#16110d]" style={{ background: gold }}>
            {t.cta}
          </span>
        </div>
      </div>
    </div>
  )
}
