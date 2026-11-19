import type { Dictionary } from '@/content/dictionary'
import type { Step } from '@/content/process'
import type { Locale } from '@/lib/i18n'
import { RevealGroup, RevealItem } from '@/components/ui/motion'
import { SectionHeading } from '@/components/ui/section-heading'

type Props = { locale: Locale; dict: Dictionary['process']; steps: Step[] }

/**
 * Pașii colaborării, toți vizibili deodată: cinci coloane pe desktop, două pe tabletă, listă pe telefon.
 * Rezultatul fiecărui pas stă jos, aliniat pe același rând în toate coloanele.
 */
export function Process({ locale, dict, steps }: Props) {
  return (
    <section id="process" aria-labelledby="process-title" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHeading eyebrow={dict.eyebrow} title={dict.title} id="process-title" />

        <RevealGroup as="ol" gap={0.06} className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-5">
          {steps.map((step, i) => (
            <RevealItem as="li" key={i} className="relative flex flex-col border-t border-line pt-5 md:pt-6">
              <span aria-hidden="true" className="absolute -top-px left-0 h-px w-10 bg-ember" />
              <div className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-3">
                <span aria-hidden="true" className="font-display text-[2.25rem] leading-none text-ember lg:text-[3rem]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[1.625rem] leading-[1.1] tracking-[-0.01em] lg:text-[1.75rem]">{step.title[locale]}</h3>
              </div>
              <p className="mt-3 max-w-[34rem] text-[0.9375rem] text-mist">{step.body[locale]}</p>
              <div className="mt-auto pt-5">
                {/* Pe desktop, rezervă două rânduri ca liniile de deasupra să fie aliniate între coloane. */}
                <p className="border-t border-line pt-3 t-label text-mist lg:min-h-[2.75rem]">
                  <span className="text-paper">{dict.output}:</span> {step.output[locale]}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
