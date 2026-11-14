import type { ReactNode } from 'react'
import { SplitLines } from './motion'

type Props = {
  index: string
  eyebrow: string
  title: string
  id: string
  children?: ReactNode
}

/** Antetul de secțiune: index mono + regulă subțire, apoi titlul mare. */
export function SectionHeading({ index, eyebrow, title, id, children }: Props) {
  return (
    <header className="grid grid-cols-12 gap-x-6 gap-y-8">
      <div className="col-span-12 flex items-center gap-4 t-label text-faint">
        <span>({index})</span>
        <span>{eyebrow}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
      <SplitLines lines={[title]} id={id} className="col-span-12 t-h2 text-balance lg:col-span-9" />
      {children && <div className="col-span-12 lg:col-span-6">{children}</div>}
    </header>
  )
}
