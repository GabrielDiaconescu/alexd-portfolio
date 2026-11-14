import Image from 'next/image'
import type { Shot as ShotType } from '@/content/types'
import type { Locale } from '@/lib/i18n'

type Props = {
  shot: ShotType
  locale: Locale
  sizes: string
  className?: string
  imageClassName?: string
  eager?: boolean
  /** Text scurt în bara browserului, ca la un site real. */
  url?: string
}

/** Afișează o captură în rama potrivită: browser, telefon sau liberă. */
export function Shot({ shot, locale, sizes, className = '', imageClassName = '', eager, url }: Props) {
  const image = (
    <Image
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={shot.alt[locale]}
      sizes={sizes}
      quality={85}
      loading={eager ? 'eager' : 'lazy'}
      className={`block h-auto w-full ${imageClassName}`}
    />
  )

  if (shot.frame === 'browser') {
    return (
      <div
        className={`overflow-hidden rounded-[0.625rem] border border-line-strong bg-ink-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.75)] ${className}`}
      >
        <div className="flex h-7 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          {url && (
            <span className="mx-auto max-w-[60%] truncate rounded-sm bg-ink-3 px-3 py-0.5 font-mono text-[0.625rem] text-faint">
              {url}
            </span>
          )}
        </div>
        <div className="overflow-hidden">{image}</div>
      </div>
    )
  }

  if (shot.frame === 'phone') {
    return (
      <div
        className={`rounded-[clamp(1.25rem,3.2vw,2.5rem)] border border-line-strong bg-[#050505] p-[3.5%] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ${className}`}
      >
        <div className="overflow-hidden rounded-[clamp(0.9rem,2.6vw,2rem)]">{image}</div>
      </div>
    )
  }

  return <div className={`overflow-hidden ${className}`}>{image}</div>
}
