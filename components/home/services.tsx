import type { Dictionary } from '@/content/dictionary'
import { services, special } from '@/content/services'
import { type Locale, paths } from '@/lib/i18n'
import { NoBreak } from '@/components/ui/accent'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/motion'
import { SectionHeading } from '@/components/ui/section-heading'

type Props = { locale: Locale; dict: Dictionary }

export function Services({ locale, dict }: Props) {
  const s = dict.services
  return (
    <section id="services" aria-labelledby="services-title" className="border-t border-line py-16 md:py-24">
      <div className="shell">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} id="services-title">
          <p className="t-lead text-mist">
            <NoBreak text={s.intro} />
          </p>
        </SectionHeading>

        <ol className="mt-10 border-t border-line md:mt-14">
          {services.map((svc, i) => (
            <li key={svc.id} id={`service-${svc.id}`} className="group scroll-mt-24 border-b border-line">
              <Reveal className="grid grid-cols-12 gap-x-6 gap-y-6 py-8 md:py-10">
                <div className="col-span-12 lg:col-span-4">
                  <span className="t-label text-ember">0{i + 1}</span>
                  <h3 className="mt-3 t-h3 text-balance">{svc.name[locale]}</h3>
                </div>

                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                  <p className="font-display text-[1.375rem] italic leading-[1.25] text-paper md:text-[1.5rem]">
                    <NoBreak text={svc.lead[locale]} />
                  </p>
                  <p className="mt-4 text-mist">
                    <NoBreak text={svc.body[locale]} />
                  </p>
                </div>

                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                  <p className="t-label text-faint">{svc.listLabel[locale]}</p>
                  <ItemList items={svc.items[locale]} />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Proiectele ample stau separat, mai discret: titlul și textul în stânga, lista în dreapta. */}
        <Reveal className="mt-8 grid grid-cols-12 gap-x-6 gap-y-5 border border-line bg-ink-2/60 p-6 md:mt-10 md:p-8">
          <div className="col-span-12 md:col-span-6 lg:col-span-7">
            <h3 className="t-label text-ember">{special.title[locale]}</h3>
            <p className="mt-4 max-w-[36rem] text-mist">
              <NoBreak text={special.body[locale]} />
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <ItemList items={special.items[locale]} />
          </div>
        </Reveal>

        <Reveal className="mt-8 grid grid-cols-12 gap-x-6 gap-y-6 md:mt-10">
          <p className="col-span-12 font-medium text-paper md:col-span-8 lg:col-span-5 lg:col-start-5">
            <NoBreak text={s.note} />
          </p>
          <div className="col-span-12 md:col-span-4 md:justify-self-end lg:col-span-3">
            <Button href={paths.section(locale, 'contact')}>{s.cta}</Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex flex-col">
      {items.map((d) => (
        <li key={d} className="flex gap-3 border-b border-line py-2 text-[0.9375rem] last:border-0">
          <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-ember" />
          <NoBreak text={d} />
        </li>
      ))}
    </ul>
  )
}
