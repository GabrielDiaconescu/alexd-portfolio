import type { ReactNode } from 'react'
import { SplitLines } from './motion'

type Props = {
  eyebrow: string
  title: string
  id: string
  children?: ReactNode
}

/** Antetul de secțiune: eticheta mono + regulă subțire, apoi titlul mare. Fără numere (01)…(07), la cererea ta. */
export function SectionHeading({ eyebrow, title, id, children }: Props) {
  return (
    <header className="grid grid-cols-12 gap-x-6 gap-y-8">
      <div className="col-span-12 flex items-center gap-4 t-label text-faint">
        <span>{eyebrow}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
      <SplitLines lines={[title]} id={id} className="col-span-12 t-h2 text-balance lg:col-span-9" />
      {children && <div className="col-span-12 lg:col-span-6">{children}</div>}
    </header>
  )
}
