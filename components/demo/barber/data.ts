/**
 * Datele demo-ului „Briciul”. Toate sunt de exemplu: frizeria nu există, numărul și adresa sunt fictive,
 * iar butonul de programare doar arată mesajul care s-ar trimite.
 */
export const shop = {
  name: 'Briciul',
  tagline: 'Barbershop · Pitești',
  address: 'Strada Exemplu nr. 1, Pitești',
  phoneDisplay: '0700 000 000',
  phoneHref: 'tel:+40700000000',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Pitesti',
  timeZone: 'Europe/Bucharest',
  portfolioHref: '/ro/proiecte/barbershop',
}

export type Service = { id: string; name: string; note?: string; price: number; minutes: number }
export type ServiceGroup = { id: string; title: string; hint: string; exclusive: boolean; items: Service[] }

export const groups: ServiceGroup[] = [
  {
    id: 'tuns',
    title: 'Tuns',
    hint: 'Alege un singur tip',
    exclusive: true,
    items: [
      { id: 'clasic', name: 'Tuns clasic', note: 'foarfecă și mașină', price: 60, minutes: 40 },
      { id: 'fade', name: 'Fade', note: 'skin, low, mid sau high', price: 70, minutes: 45 },
      { id: 'copii', name: 'Tuns copii', note: 'sub 12 ani', price: 45, minutes: 30 },
    ],
  },
  {
    id: 'barba',
    title: 'Barbă',
    hint: 'Opțional',
    exclusive: true,
    items: [
      { id: 'aranjat', name: 'Aranjat barbă', note: 'contur cu briciul', price: 35, minutes: 20 },
      { id: 'prosop', name: 'Bărbierit cu prosop cald', note: 'ritualul complet', price: 50, minutes: 30 },
    ],
  },
  {
    id: 'extra',
    title: 'Extra',
    hint: 'Oricâte',
    exclusive: false,
    items: [
      { id: 'styling', name: 'Spălat și styling', price: 20, minutes: 10 },
      { id: 'sprancene', name: 'Conturare sprâncene', price: 15, minutes: 5 },
    ],
  },
]

export const allServices = groups.flatMap((g) => g.items)

/** Programul, pe zilele săptămânii (0 = duminică). null = închis. Orele sunt în fusul orar al României. */
export const hours: Record<number, [number, number] | null> = {
  1: [10, 20],
  2: [10, 20],
  3: [10, 20],
  4: [10, 20],
  5: [10, 20],
  6: [9, 15],
  0: null,
}

export const dayNames = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
export const monthNames = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie']

export const slots = [
  { id: 'dimineata', label: 'Dimineața', range: 'până la 12:00' },
  { id: 'pranz', label: 'La prânz', range: '12:00 – 15:00' },
  { id: 'dupa-amiaza', label: 'După-amiaza', range: 'după 15:00' },
]

export const values = [
  { title: 'Programare, nu coadă', body: 'Îți alegi ziua și intervalul, iar noi confirmăm ora exactă. Fără așteptat pe scaun.' },
  { title: 'Unelte curate, mereu', body: 'Pieptenii, lamele și prosoapele se schimbă după fiecare client.' },
  { title: 'Prețul e cel afișat', body: 'Vezi totalul înainte să vii. Fără „mai adăugăm ceva” la casă.' },
]

export const team = [
  { initials: 'AM', name: 'Andrei M.', role: 'Fade-uri și tunsori scurte' },
  { initials: 'RC', name: 'Radu C.', role: 'Clasic și bărbierit cu prosop cald' },
  { initials: 'IS', name: 'Ionuț S.', role: 'Barbă și conturări' },
]
