'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import type { Dictionary } from '@/content/dictionary'
import type { Faq as FaqItem, FaqTopic } from '@/content/faq'
import type { Locale } from '@/lib/i18n'
import { ease } from '@/lib/motion'
import { NoBreak } from '@/components/ui/accent'

type Props = { items: FaqItem[]; locale: Locale; t: Dictionary['faq'] }
type Filter = 'all' | FaqTopic

const topics: FaqTopic[] = ['start', 'work', 'tech', 'after']

/**
 * Acordeon accesibil (butoane cu aria-expanded, panouri legate prin aria-controls), cu filtre pe teme.
 * Numerotarea rămâne cea din lista completă, ca o întrebare să aibă același număr în orice filtru.
 */
export function FaqList({ items, locale, t }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()

  const visible = items.map((item, i) => ({ item, i })).filter(({ item }) => filter === 'all' || item.topic === filter)
  const count = (f: Filter) => (f === 'all' ? items.length : items.filter((it) => it.topic === f).length)

  const choose = (f: Filter) => {
    setFilter(f)
    setOpen(items.findIndex((it) => f === 'all' || it.topic === f))
  }

  return (
    <div>
      <div role="group" aria-label={t.filter} className="flex flex-wrap gap-2">
        {(['all', ...topics] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => choose(f)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.875rem] text-mist transition-colors duration-300 hover:border-paper hover:text-paper aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink"
          >
            {f === 'all' ? t.all : t.topics[f]}
            <span className="font-mono text-[0.6875rem] opacity-60">{count(f)}</span>
          </button>
        ))}
      </div>

      <motion.ul key={filter} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: ease.out }} className="mt-8 border-t border-line">
        {visible.map(({ item, i }) => {
          const isOpen = open === i
          const btn = `${base}-q${i}`
          const panel = `${base}-a${i}`
          return (
            <li key={i} className={`relative border-b border-line transition-colors duration-500 ${isOpen ? 'bg-[linear-gradient(90deg,rgb(255_106_61/0.06),transparent_70%)]' : ''}`}>
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-px origin-top bg-ember transition-transform duration-500 ease-[var(--ease-out-expo)] ${isOpen ? 'scale-y-100' : 'scale-y-0'}`} />
              <h3>
                <button
                  id={btn}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group grid w-full grid-cols-[2.75rem_1fr_auto] items-start gap-x-3 py-6 pl-3 text-left md:grid-cols-[3.75rem_1fr_auto] md:py-7 md:pl-5"
                >
                  <span className="t-label pt-[0.45em] text-faint transition-colors group-hover:text-ember group-aria-expanded:text-ember">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[1.0625rem] font-medium leading-snug transition-colors group-hover:text-ember md:text-[1.25rem]">
                    <NoBreak text={item.q[locale]} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-2 grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-mist transition-colors duration-300 group-hover:border-paper group-hover:text-paper group-aria-expanded:border-ember group-aria-expanded:bg-ember group-aria-expanded:text-ink"
                  >
                    <Plus className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-aria-expanded:rotate-45" />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panel}
                    role="region"
                    aria-labelledby={btn}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: ease.out }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-x-3 pb-7 pl-3 pr-3 md:grid-cols-[3.75rem_1fr] md:pl-5 md:pr-16">
                      <span aria-hidden="true" className="hidden md:block" />
                      <div>
                        <p className="max-w-[40rem] text-mist"><NoBreak text={item.a[locale]} /></p>
                        <p className="mt-4 t-label text-faint">{t.topics[item.topic]}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </motion.ul>
    </div>
  )
}
