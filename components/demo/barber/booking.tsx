'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, MessageCircle, X } from 'lucide-react'
import { useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { allServices, groups, shop, slots } from './data'
import { type BookableDay, bookableDays } from './time'

const noop = () => () => {}
const noDays: BookableDay[] = []
const serverDays = () => noDays
let cachedDays: BookableDay[] | null = null
const clientDays = () => (cachedDays ??= bookableDays())

/**
 * Configuratorul de programare: servicii → total și durată → zi și interval → mesajul de WhatsApp.
 * Fiind demo, mesajul nu pleacă nicăieri: se afișează într-un dialog și se poate copia.
 */
export function Booking() {
  const [selected, setSelected] = useState<string[]>(['fade'])
  // Zilele depind de data de azi în România: pe server (și la hidratare) lista e goală, apoi se completează.
  const days = useSyncExternalStore(noop, clientDays, serverDays)
  const [day, setDay] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const uid = useId()

  const toggle = (groupId: string, id: string) => {
    const group = groups.find((g) => g.id === groupId)!
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((s) => s !== id)
      const without = group.exclusive ? cur.filter((s) => !group.items.some((i) => i.id === s)) : cur
      return [...without, id]
    })
  }

  const chosen = allServices.filter((s) => selected.includes(s.id))
  const total = chosen.reduce((sum, s) => sum + s.price, 0)
  const minutes = chosen.reduce((sum, s) => sum + s.minutes, 0)
  const dayLabel = days.find((d) => d.key === day)?.long
  const slotLabel = slots.find((s) => s.id === slot)
  const missing = [!chosen.length && 'un serviciu', !day && 'ziua', !slot && 'intervalul'].filter(Boolean) as string[]

  const message = useMemo(
    () =>
      [
        `Bună ziua! Aș dori o programare la ${shop.name}.`,
        `• Servicii: ${chosen.map((s) => s.name).join(', ')}`,
        `• Total estimat: ${total} lei (aprox. ${minutes} min)`,
        `• Ziua: ${dayLabel ?? '—'}`,
        `• Interval: ${slotLabel ? `${slotLabel.label.toLowerCase()} (${slotLabel.range})` : '—'}`,
        name.trim() ? `Numele meu: ${name.trim()}` : null,
        'Mulțumesc!',
      ]
        .filter(Boolean)
        .join('\n'),
    [chosen, total, minutes, dayLabel, slotLabel, name],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
      {/* Lista de prețuri */}
      <div className="col-span-12 flex flex-col gap-12 lg:col-span-7">
        {groups.map((g) => (
          <fieldset key={g.id}>
            <legend className="flex w-full items-baseline justify-between border-b-2 border-[#1b1714] pb-3">
              <span className="font-display text-[2rem] leading-none">{g.title}</span>
              <span className="b-label text-[#6b5f55]">{g.hint}</span>
            </legend>
            <ul>
              {g.items.map((s) => {
                const on = selected.includes(s.id)
                const id = `${uid}-${s.id}`
                return (
                  <li key={s.id} className="border-b border-[#1b1714]/15">
                    <label
                      htmlFor={id}
                      className={`group flex cursor-pointer items-center gap-4 px-2 py-4 transition-colors sm:gap-5 ${on ? 'bg-[#7a1f1f]/[0.06]' : 'hover:bg-[#1b1714]/[0.03]'}`}
                    >
                      <input id={id} type="checkbox" checked={on} onChange={() => toggle(g.id, s.id)} className="peer sr-only" />
                      <span
                        aria-hidden="true"
                        className={`grid size-6 shrink-0 place-items-center border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#7a1f1f] ${
                          g.exclusive ? 'rounded-full' : 'rounded-[4px]'
                        } ${on ? 'border-[#7a1f1f] bg-[#7a1f1f] text-[#f3ede3]' : 'border-[#1b1714]/40 group-hover:border-[#1b1714]'}`}
                      >
                        {on && <Check className="size-3.5" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-[1.375rem] leading-tight">{s.name}</span>
                        {s.note && <span className="block text-sm text-[#6b5f55]">{s.note}</span>}
                      </span>
                      <span aria-hidden="true" className="hidden h-0 flex-1 border-b border-dotted border-[#1b1714]/30 sm:block" />
                      <span className="ml-auto shrink-0 text-right sm:ml-0">
                        <span className="block font-display text-[1.375rem] tabular-nums">{s.price} lei</span>
                        <span className="block text-sm tabular-nums text-[#6b5f55]">{s.minutes} min</span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        ))}
      </div>

      {/* Rezumatul și programarea */}
      <aside aria-labelledby={`${uid}-sum`} className="col-span-12 lg:col-span-5">
        <div className="bg-[#1b1714] p-7 text-[#f3ede3] sm:p-9 lg:sticky lg:top-24">
          <h3 id={`${uid}-sum`} className="b-label text-[#e3c88f]">
            Programarea ta
          </h3>

          <ul className="mt-5 flex min-h-[3.5rem] flex-col gap-1.5 text-[0.95rem]" aria-live="polite">
            {chosen.length === 0 && <li className="text-[#f3ede3]/60">Alege cel puțin un serviciu din listă.</li>}
            <AnimatePresence initial={false}>
              {chosen.map((s) => (
                <motion.li
                  key={s.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-between gap-4"
                >
                  <span>{s.name}</span>
                  <span className="tabular-nums text-[#f3ede3]/70">{s.price} lei</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-6 flex items-end justify-between border-t border-[#f3ede3]/15 pt-5">
            <div>
              <p className="b-label text-[#f3ede3]/60">Total estimat</p>
              <p className="font-display text-[3rem] leading-none tabular-nums">
                {total} <span className="text-[1.5rem]">lei</span>
              </p>
            </div>
            <p className="pb-1 text-right text-sm tabular-nums text-[#f3ede3]/70">≈ {minutes} min</p>
          </div>

          <fieldset className="mt-8">
            <legend className="b-label text-[#f3ede3]/60">Ziua</legend>
            <div className="mt-3 flex min-h-[2.75rem] flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  aria-pressed={day === d.key}
                  onClick={() => setDay(d.key)}
                  className="min-h-11 border border-[#f3ede3]/25 px-3.5 text-sm transition-colors hover:border-[#e3c88f] aria-pressed:border-[#e3c88f] aria-pressed:bg-[#e3c88f] aria-pressed:text-[#1b1714]"
                >
                  {d.short}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="b-label text-[#f3ede3]/60">Intervalul</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={slot === s.id}
                  onClick={() => setSlot(s.id)}
                  className="flex min-h-14 flex-col items-center justify-center border border-[#f3ede3]/25 px-1 text-center text-[0.8125rem] transition-colors hover:border-[#e3c88f] aria-pressed:border-[#e3c88f] aria-pressed:bg-[#e3c88f] aria-pressed:text-[#1b1714] sm:px-2 sm:text-sm"
                >
                  <span className="whitespace-nowrap">{s.label}</span>
                  <span className="text-[0.7rem] opacity-70">{s.range}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor={`${uid}-name`} className="mt-6 block b-label text-[#f3ede3]/60">
            Numele tău <span className="normal-case tracking-normal">(opțional)</span>
          </label>
          <input
            id={`${uid}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
            maxLength={40}
            className="mt-2 h-11 w-full border-0 border-b border-[#f3ede3]/40 bg-transparent text-[#f3ede3] outline-none transition-colors focus:border-[#e3c88f]"
          />

          <button
            type="button"
            disabled={missing.length > 0}
            aria-describedby={missing.length ? `${uid}-missing` : undefined}
            onClick={() => dialog.current?.showModal()}
            className="mt-8 flex min-h-13 w-full items-center justify-center gap-3 bg-[#e3c88f] px-6 py-3.5 font-medium text-[#1b1714] transition-colors hover:bg-[#f3ede3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
            Pregătește mesajul de programare
          </button>
          {missing.length > 0 && (
            <p id={`${uid}-missing`} className="mt-3 text-center text-sm text-[#f3ede3]/60">
              Mai alege: {missing.join(', ')}.
            </p>
          )}
        </div>
      </aside>

      <dialog
        ref={dialog}
        aria-labelledby={`${uid}-dlg`}
        className="m-auto w-[min(32rem,calc(100%-2rem))] bg-[#f3ede3] p-0 text-[#1b1714] backdrop:bg-[#1b1714]/70 backdrop:backdrop-blur-sm"
      >
        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <h3 id={`${uid}-dlg`} className="font-display text-[1.75rem] leading-tight">
              Mesajul tău de programare
            </h3>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Închide" className="grid size-11 shrink-0 place-items-center hover:bg-[#1b1714]/5">
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <p className="mt-6 whitespace-pre-line rounded-[1rem] rounded-tr-sm bg-[#dcf2c8] p-5 text-[0.95rem] leading-relaxed text-[#1b1714] shadow-sm">
            {message}
          </p>
          <p className="mt-5 border-l-2 border-[#7a1f1f] pl-4 text-sm text-[#6b5f55]">
            Acesta e un site demonstrativ: nimic nu se trimite. Pe site-ul unei frizerii reale, butonul ar deschide WhatsApp cu acest mesaj,
            gata de trimis către salon.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copy}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-[#1b1714] px-5 text-[#f3ede3] transition-colors hover:bg-[#7a1f1f]"
            >
              {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
              <span aria-live="polite">{copied ? 'Copiat' : 'Copiază mesajul'}</span>
            </button>
            <button type="button" onClick={() => dialog.current?.close()} className="min-h-12 flex-1 border border-[#1b1714]/30 px-5 hover:border-[#1b1714]">
              Închide
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
