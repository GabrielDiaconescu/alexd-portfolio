'use client'

import { useEffect, useState } from 'react'
import { dayNames, hours } from './data'
import { openStatus, shopNow } from './time'

/** Hook comun: ora frizeriei, actualizată la fiecare minut. Pe server (și la prima randare) e null. */
function useShopNow() {
  const [now, setNow] = useState<ReturnType<typeof shopNow> | null>(null)
  useEffect(() => {
    const tick = () => setNow(shopNow())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [])
  return now
}

/** Pastila „Deschis acum · închidem la 20:00”, calculată în fusul orar al României. */
export function OpenStatus({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const now = useShopNow()
  const status = now ? openStatus(now) : null
  const text = tone === 'light' ? 'text-[#1b1714]' : 'text-[#f3ede3]'
  return (
    <p className={`inline-flex min-h-6 items-center gap-2.5 text-sm ${text}`} aria-live="polite">
      <span
        aria-hidden="true"
        className={`relative size-2 rounded-full ${status ? (status.open ? 'bg-[#3f7d4e]' : 'bg-[#7a1f1f]') : 'bg-current opacity-30'}`}
      >
        {status?.open && <span className="absolute inset-0 animate-ping rounded-full bg-[#3f7d4e] opacity-60 motion-reduce:hidden" />}
      </span>
      <span>{status ? status.text : 'Program: L–V 10–20, S 9–15'}</span>
    </p>
  )
}

const order = [1, 2, 3, 4, 5, 6, 0]
const fmt = (h: [number, number] | null) => (h ? `${String(h[0]).padStart(2, '0')}:00 – ${h[1]}:00` : 'Închis')

/** Tabelul de program, cu ziua de azi evidențiată. */
export function Schedule() {
  const now = useShopNow()
  return (
    <table className="w-full text-left">
      <caption className="sr-only">Programul frizeriei</caption>
      <tbody>
        {order.map((d) => {
          const today = now?.weekday === d
          return (
            <tr key={d} className={`border-b border-[#f3ede3]/15 ${today ? 'text-[#e3c88f]' : ''}`}>
              <th scope="row" className="py-3.5 font-normal">
                {dayNames[d]}
                {today && <span className="ml-3 align-middle b-label">azi</span>}
              </th>
              <td className="py-3.5 text-right tabular-nums">{fmt(hours[d])}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
