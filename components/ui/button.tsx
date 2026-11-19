import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

/**
 * Variantele butoanelor (stilurile, în globals.css la .btn-*):
 *  - primary: plin, hârtie cu text cerneală; la hover devine jar (acțiunea principală);
 *  - matte, glass: secundare, discrete, cu contur subțire. Arată la fel; ambele nume rămân pentru compatibilitate.
 */
type Variant = 'primary' | 'matte' | 'glass'

const variants: Record<Variant, string> = {
  primary: 'btn-solid',
  matte: 'btn-quiet',
  glass: 'btn-quiet',
}

type Props = Omit<ComponentProps<typeof Link>, 'className'> & {
  children: ReactNode
  variant?: Variant
  className?: string
  /** Săgeata în diagonală indică un link; o ascunzi pentru acțiuni neutre. */
  arrow?: boolean
}

export const buttonClass = (variant: Variant = 'primary', extra = '') =>
  `btn ${variants[variant]} group/btn inline-flex min-h-12 items-center justify-center gap-2.5 px-6 text-[0.9375rem] font-medium tracking-[-0.005em] ${extra}`

/** Săgeata care iese pe diagonală și revine dinspre colțul opus. */
export function ArrowSwap({ className = 'size-4' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative inline-block overflow-hidden ${className}`}>
      <ArrowUpRight className="absolute inset-0 size-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-full group-hover/btn:-translate-y-full motion-reduce:transition-none" />
      <ArrowUpRight className="absolute inset-0 size-full -translate-x-full translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0 motion-reduce:transition-none" />
    </span>
  )
}

export function Button({ children, variant = 'primary', className = '', arrow = true, ...props }: Props) {
  return (
    <Link {...props} className={buttonClass(variant, className)}>
      <span>{children}</span>
      {arrow && <ArrowSwap />}
    </Link>
  )
}
