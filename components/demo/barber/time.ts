import { dayNames, hours, monthNames, shop } from './data'

/** Ziua și ora curente în fusul orar al frizeriei, oriunde s-ar afla vizitatorul. */
export function shopNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: shop.timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return {
    weekday,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    year: Number(get('year')),
    month: Number(get('month')) - 1,
    day: Number(get('day')),
  }
}

const hh = (h: number) => `${String(h).padStart(2, '0')}:00`

/** „Deschis acum · închidem la 20:00” sau „Închis · deschidem mâine la 10:00”. */
export function openStatus(now = shopNow()) {
  const today = hours[now.weekday]
  if (today && now.minutes >= today[0] * 60 && now.minutes < today[1] * 60) {
    return { open: true, text: `Deschis acum · închidem la ${hh(today[1])}` }
  }
  if (today && now.minutes < today[0] * 60) {
    return { open: false, text: `Închis · deschidem azi la ${hh(today[0])}` }
  }
  for (let i = 1; i <= 7; i++) {
    const wd = (now.weekday + i) % 7
    const h = hours[wd]
    if (h) return { open: false, text: `Închis · deschidem ${i === 1 ? 'mâine' : dayNames[wd].toLowerCase()} la ${hh(h[0])}` }
  }
  return { open: false, text: 'Închis' }
}

export type BookableDay = { key: string; short: string; long: string }

/** Următoarele zile în care frizeria e deschisă (azi inclus, dacă mai e timp de o programare). */
export function bookableDays(count = 6, now = shopNow()): BookableDay[] {
  const days: BookableDay[] = []
  const base = Date.UTC(now.year, now.month, now.day)
  for (let i = 0; days.length < count && i < 14; i++) {
    const d = new Date(base + i * 86_400_000)
    const wd = d.getUTCDay()
    const h = hours[wd]
    if (!h) continue
    if (i === 0 && now.minutes > (h[1] - 1) * 60) continue
    const label = i === 0 ? 'Azi' : i === 1 ? 'Mâine' : dayNames[wd]
    days.push({
      key: d.toISOString().slice(0, 10),
      short: `${label} ${d.getUTCDate()}`,
      long: `${dayNames[wd]}, ${d.getUTCDate()} ${monthNames[d.getUTCMonth()]}`,
    })
  }
  return days
}
