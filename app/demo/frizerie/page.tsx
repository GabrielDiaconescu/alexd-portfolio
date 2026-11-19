import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Scissors } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/motion'
import { Booking } from '@/components/demo/barber/booking'
import { groups, shop, team, values } from '@/components/demo/barber/data'
import { HeroTitle } from '@/components/demo/barber/hero-title'
import { OpenStatus, Schedule } from '@/components/demo/barber/live'
import { ServiceMarquee } from '@/components/demo/barber/marquee'
import { BarberPole } from '@/components/demo/barber/pole'

export const metadata: Metadata = {
  title: 'Briciul · Barbershop în Pitești (demo)',
  description: 'Site demonstrativ pentru o frizerie: prețuri, programare pe WhatsApp, program și locație. Date de exemplu.',
}

const roman = ['I', 'II', 'III']
const serviceNames = groups.flatMap((g) => g.items.map((i) => i.name))

export default function BarberDemo() {
  return (
    <>
      {/* Banda de demo: clar, de la prima privire, că nu e o frizerie reală. */}
      <div className="on-dark bg-[#1b1714] text-[#f3ede3]">
        <div className="mx-auto flex max-w-[84rem] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2.5 text-[0.8rem] sm:px-8">
          <p>
            <span className="b-label mr-2 text-[#e3c88f]">Demo</span>
            Site demonstrativ realizat de Alex D. · date de exemplu, nimic nu se trimite.
          </p>
          <Link href={shop.portfolioHref} prefetch={false} target="_top" className="inline-flex min-h-8 items-center gap-1.5 underline-offset-4 hover:underline">
            <ArrowLeft aria-hidden="true" className="size-3.5" /> Înapoi la portofoliu
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#1b1714]/10 bg-[#f3ede3]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-6 px-4 sm:h-20 sm:px-8">
          <a href="#acasa" className="flex items-baseline gap-3">
            <span className="font-display text-[1.75rem] italic leading-none tracking-[-0.02em]">{shop.name}</span>
            <span className="b-label hidden text-[#6b5f55] sm:inline">{shop.tagline}</span>
          </a>
          <nav aria-label="Secțiuni" className="hidden md:block">
            <ul className="flex gap-8 text-[0.95rem]">
              <li><a href="#programare" className="hover:text-[#7a1f1f]">Prețuri</a></li>
              <li><a href="#echipa" className="hover:text-[#7a1f1f]">Echipa</a></li>
              <li><a href="#program" className="hover:text-[#7a1f1f]">Program</a></li>
            </ul>
          </nav>
          <a href="#programare" className="inline-flex min-h-11 items-center bg-[#7a1f1f] px-5 text-[0.95rem] font-medium text-[#f3ede3] transition-colors hover:bg-[#1b1714]">
            Programează-te
          </a>
        </div>
      </header>

      <main id="acasa" tabIndex={-1} className="pb-24 md:pb-0">
        {/* Hero */}
        <section aria-labelledby="hero" className="mx-auto grid max-w-[84rem] grid-cols-12 items-center gap-x-6 gap-y-12 px-4 pb-16 pt-12 sm:px-8 md:pb-24 md:pt-16">
          <div id="hero" className="col-span-12 lg:col-span-7">
            <p className="b-label flex items-center gap-3 text-[#7a1f1f]">
              <Scissors aria-hidden="true" className="size-4" /> Barbershop în Pitești
            </p>
            <div className="mt-6">
              <HeroTitle />
            </div>
            <Reveal className="mt-8 max-w-[34rem]">
              <p className="text-[1.125rem] leading-relaxed text-[#4a4038]">
                Frizerie de cartier, cu trei scaune și programări pe WhatsApp. Îți alegi serviciile, vezi prețul și vii la ora stabilită.
              </p>
            </Reveal>
            <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#programare" className="inline-flex min-h-13 items-center justify-center bg-[#7a1f1f] px-7 font-medium text-[#f3ede3] transition-colors hover:bg-[#1b1714]">
                Alege serviciile
              </a>
              <a href={shop.phoneHref} className="inline-flex min-h-13 items-center justify-center gap-2 border border-[#1b1714]/30 px-7 transition-colors hover:border-[#1b1714]">
                <Phone aria-hidden="true" className="size-4" /> {shop.phoneDisplay}
              </a>
            </Reveal>
            <div className="mt-8">
              <OpenStatus />
            </div>
          </div>
          <div className="col-span-12 mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:col-span-5 lg:max-w-[28rem]">
            <BarberPole className="h-auto w-full drop-shadow-[0_40px_60px_rgb(27_23_20/0.25)]" />
          </div>
        </section>

        {/* Banda de servicii */}
        <ServiceMarquee names={serviceNames} />

        {/* Valori */}
        <section aria-labelledby="valori" className="mx-auto max-w-[84rem] px-4 py-20 sm:px-8 md:py-28">
          <h2 id="valori" className="sr-only">De ce Briciul</h2>
          <RevealGroup className="grid gap-12 md:grid-cols-3 md:gap-8">
            {values.map((v, i) => (
              <RevealItem key={v.title} className="border-t-2 border-[#1b1714] pt-6">
                <span className="font-display text-[1.25rem] italic text-[#7a1f1f]">{roman[i]}.</span>
                <h3 className="mt-3 font-display text-[1.75rem] leading-tight">{v.title}</h3>
                <p className="mt-3 text-[#4a4038]">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* Prețuri și programare */}
        <section id="programare" aria-labelledby="preturi" className="border-t border-[#1b1714]/10 bg-[#ebe3d6]">
          <div className="mx-auto max-w-[84rem] px-4 py-20 sm:px-8 md:py-28">
            <Reveal className="max-w-[44rem]">
              <p className="b-label text-[#7a1f1f]">Prețuri și programare</p>
              <h2 id="preturi" className="mt-4 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1] tracking-[-0.02em]">
                Bifează, vezi totalul, <em className="text-[#7a1f1f]">alege când vii.</em>
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-[#4a4038]">
                După ce trimiți mesajul, îți confirmăm ora exactă pe WhatsApp, în programul salonului.
              </p>
            </Reveal>
            <div className="mt-14">
              <Booking />
            </div>
          </div>
        </section>

        {/* Echipa */}
        <section id="echipa" aria-labelledby="echipa-titlu" className="mx-auto max-w-[84rem] px-4 py-20 sm:px-8 md:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="echipa-titlu" className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1] tracking-[-0.02em]">
              Trei scaune, <em className="text-[#7a1f1f]">trei meseriași.</em>
            </h2>
            <p className="b-label text-[#6b5f55]">Nume de exemplu</p>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map((p) => (
              <RevealItem key={p.name} className="flex items-center gap-5 border border-[#1b1714]/15 p-6 sm:flex-col sm:items-start sm:p-8">
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-[#1b1714] font-display text-[1.5rem] italic text-[#e3c88f] sm:size-24 sm:text-[2.25rem]">
                  {p.initials}
                </span>
                <span>
                  <span className="block font-display text-[1.5rem] leading-tight">{p.name}</span>
                  <span className="mt-1 block text-[#4a4038]">{p.role}</span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* Program și locație */}
        <section id="program" aria-labelledby="program-titlu" className="on-dark bg-[#1b1714] text-[#f3ede3]">
          <div className="mx-auto grid max-w-[84rem] grid-cols-12 gap-x-6 gap-y-12 px-4 py-20 sm:px-8 md:py-28">
            <Reveal className="col-span-12 md:col-span-6">
              <p className="b-label text-[#e3c88f]">Program</p>
              <h2 id="program-titlu" className="mt-4 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1] tracking-[-0.02em]">
                Când ne <em className="text-[#e3c88f]">găsești.</em>
              </h2>
              <div className="mt-8">
                <OpenStatus tone="dark" />
              </div>
              <div className="mt-6">
                <Schedule />
              </div>
            </Reveal>
            <Reveal className="col-span-12 flex flex-col justify-end md:col-span-5 md:col-start-8">
              <p className="b-label text-[#e3c88f]">Unde</p>
              <p className="mt-4 flex items-start gap-3 font-display text-[1.75rem] leading-snug">
                <MapPin aria-hidden="true" className="mt-2 size-5 shrink-0 text-[#e3c88f]" /> {shop.address}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={shop.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center bg-[#e3c88f] px-6 font-medium text-[#1b1714] transition-colors hover:bg-[#f3ede3]"
                >
                  Deschide în Google Maps
                </a>
                <a href={shop.phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#f3ede3]/30 px-6 transition-colors hover:border-[#f3ede3]">
                  <Phone aria-hidden="true" className="size-4" /> Sună
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[84rem] flex-col gap-6 px-4 pb-28 pt-14 text-sm text-[#4a4038] sm:px-8 md:flex-row md:items-end md:justify-between md:pb-14">
        <div>
          <p className="font-display text-[2.5rem] italic leading-none text-[#1b1714]">{shop.name}</p>
          <p className="mt-3 max-w-md">Briciul este o frizerie fictivă. Numele, adresa, telefonul, echipa și prețurile sunt date de exemplu.</p>
        </div>
        <p>
          Site demonstrativ realizat de{' '}
          <Link href={shop.portfolioHref} prefetch={false} target="_top" className="font-medium text-[#7a1f1f] underline underline-offset-4">
            Alex D.
          </Link>
        </p>
      </footer>

      {/* Bara fixă de pe telefon */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-[#1b1714]/10 bg-[#f3ede3]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <a href={shop.phoneHref} className="flex min-h-12 items-center justify-center gap-2 border border-[#1b1714]/30 font-medium">
          <Phone aria-hidden="true" className="size-4" /> Sună
        </a>
        <a href="#programare" className="flex min-h-12 items-center justify-center bg-[#7a1f1f] font-medium text-[#f3ede3]">
          Programează-te
        </a>
      </div>
    </>
  )
}
