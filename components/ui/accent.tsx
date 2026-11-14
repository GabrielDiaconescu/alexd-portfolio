import { Fragment, type ReactNode } from 'react'

/**
 * Cuvintele cu cratimă („să-mi”, „le-am”, „site-uri”) nu se rup pe două rânduri: browserul ar lăsa
 * „să-” la capăt de rând și „mi” pe rândul următor. Le ținem întregi.
 */
function keepWhole(text: string, key: string): ReactNode {
  const parts = text.split(/(\S*\p{L}-\p{L}\S*)/u)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={`${key}-${i}`} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={`${key}-${i}`}>{part}</Fragment>
    ),
  )
}

/** Text obișnuit (paragrafe, liste) cu aceeași regulă: cuvintele cu cratimă rămân pe un singur rând. */
export function NoBreak({ text }: { text: string }) {
  return <>{keepWhole(text, 'nb')}</>
}

/** Transformă `*cuvinte*` în italic cu accent. Restul textului rămâne neschimbat. */
export function Accent({ text, className = 'text-ember' }: { text: string; className?: string }) {
  const parts = text.split(/\*(.+?)\*/)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className={`italic pr-[0.06em] ${className}`}>
            {keepWhole(part, String(i))}
          </em>
        ) : (
          <Fragment key={i}>{keepWhole(part, String(i))}</Fragment>
        ),
      )}
    </>
  )
}

export const plain = (text: string) => text.replace(/\*/g, '')
