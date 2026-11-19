'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { type FormEvent, useId, useMemo, useRef, useState } from 'react'
import type { Dictionary } from '@/content/dictionary'
import {
  budgetOptions,
  type Errors,
  type Field,
  fieldOrder,
  honeypotField,
  type Inquiry,
  type InquiryResponse,
  limits,
  projectOptions,
  validate,
} from '@/lib/inquiry'
import type { Locale } from '@/lib/i18n'
import { ease } from '@/lib/motion'
import { ArrowSwap, buttonClass } from '@/components/ui/button'

type Props = { locale: Locale; t: Dictionary['form']; email: string; privacyHref: string }
type Status = 'idle' | 'sending' | 'success' | 'not_configured' | 'failed' | 'rate_limited'

const empty = (locale: Locale): Inquiry => ({
  name: '',
  contact: '',
  project: '',
  budget: '',
  message: '',
  consent: false,
  locale,
  [honeypotField]: '',
})

// Aceeași referință de fiecare dată: resetarea erorilor nu provoacă o redare în plus.
const noErrors: Errors = {}

export function InquiryForm({ locale, t, email, privacyHref }: Props) {
  const [data, setData] = useState<Inquiry>(() => empty(locale))
  // Erorile întoarse de server; cele din browser se calculează la redare.
  const [serverErrors, setServerErrors] = useState<Errors>(noErrors)
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const form = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const uid = useId()
  const id = (f: string) => `${uid}-${f}`

  const set = <K extends keyof Inquiry>(key: K, value: Inquiry[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setServerErrors(noErrors)
  }

  // O singură validare per modificare, abia după prima încercare de trimitere.
  const errors = useMemo<Errors>(
    () => (submitted ? { ...serverErrors, ...validate(data) } : noErrors),
    [submitted, serverErrors, data],
  )

  const mailto = () => {
    const lines = [
      `${t.name}: ${data.name}`,
      `${t.contact}: ${data.contact}`,
      `${t.project}: ${data.project ? t.projects[data.project] : '—'}`,
      `${t.budget}: ${data.budget ? t.budgets[data.budget] : '—'}`,
      '',
      data.message,
    ]
    const subject = encodeURIComponent(`${t.mailSubject}: ${data.name}`)
    return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setServerErrors(noErrors)
    const found = validate(data)
    const first = fieldOrder.find((f) => found[f])
    if (first) {
      form.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus()
      return
    }

    setStatus('sending')
    let next: Status = 'failed'
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = (await res.json().catch(() => null)) as InquiryResponse | null
      if (res.ok && body?.ok === true) next = 'success'
      else if (body && !body.ok && body.code === 'not_configured') next = 'not_configured'
      else if (body && !body.ok && body.code === 'rate_limited') next = 'rate_limited'
      else if (body && !body.ok && body.code === 'invalid' && body.fields.length) {
        setServerErrors(Object.fromEntries(body.fields.map((f) => [f, true])))
        setStatus('idle')
        return
      }
    } catch {
      next = 'failed'
    }
    setStatus(next)
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  if (status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-line p-8 outline-none md:p-12">
        <p className="t-label text-ember">✓</p>
        <h3 className="mt-4 t-h3">{t.success.title}</h3>
        <p className="mt-4 text-mist">{t.success.body}</p>
        <button
          type="button"
          onClick={() => {
            setData(empty(locale))
            setSubmitted(false)
            setServerErrors(noErrors)
            setStatus('idle')
          }}
          className={buttonClass('glass', 'mt-8')}
        >
          {t.success.again}
        </button>
      </div>
    )
  }

  const errorCount = Object.keys(errors).length
  const describe = (f: Field, hint?: string) =>
    [errors[f] ? id(`${f}-error`) : null, hint].filter(Boolean).join(' ') || undefined

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-8">
      <p className="text-sm text-faint">{t.required}</p>

      <div aria-live="polite" className="empty:hidden">
        {submitted && errorCount > 0 && (
          <p className="border-l-2 border-ember pl-4 text-sm text-paper">{t.errors.summary}</p>
        )}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <TextField
          id={id('name')}
          label={t.name}
          value={data.name}
          onChange={(v) => set('name', v)}
          autoComplete="name"
          error={errors.name && t.errors.name}
          errorId={id('name-error')}
          describedBy={describe('name')}
          maxLength={limits.name[1]}
        />
        <TextField
          id={id('contact')}
          label={t.contact}
          value={data.contact}
          onChange={(v) => set('contact', v)}
          autoComplete="email"
          error={errors.contact && t.errors.contact}
          errorId={id('contact-error')}
          describedBy={describe('contact')}
          maxLength={limits.contact[1]}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <SelectField
          id={id('project')}
          label={t.project}
          placeholder={t.projectPlaceholder}
          value={data.project}
          onChange={(v) => set('project', v)}
          options={projectOptions}
          labels={t.projects}
          error={errors.project && t.errors.project}
          errorId={id('project-error')}
          describedBy={describe('project')}
        />
        <SelectField
          id={id('budget')}
          label={t.budget}
          optional={t.optional}
          placeholder={t.budgetPlaceholder}
          value={data.budget}
          onChange={(v) => set('budget', v)}
          options={budgetOptions}
          labels={t.budgets}
          error={errors.budget && t.errors.budget}
          errorId={id('budget-error')}
          describedBy={describe('budget')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={id('message')} className="text-sm text-mist">
          {t.message}
        </label>
        <textarea
          id={id('message')}
          value={data.message}
          onChange={(e) => set('message', e.target.value)}
          rows={5}
          maxLength={limits.message[1]}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe('message', id('message-hint'))}
          className={`${fieldClass(!!errors.message)} resize-y py-3`}
        />
        <p id={id('message-hint')} className="text-sm text-faint">
          {t.messageHint}
        </p>
        <FieldError id={id('message-error')} message={errors.message && t.errors.message} />
      </div>

      {/* Câmp-capcană pentru roboți: ascuns vizual și pentru cititoarele de ecran.
          `sr-only` îl decupează pe loc (1px), fără mutare în afara paginii, deci fără derulare orizontală. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={id(honeypotField)}>Website</label>
        <input
          id={id(honeypotField)}
          name={honeypotField}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data[honeypotField]}
          onChange={(e) => set(honeypotField, e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <input
            id={id('consent')}
            type="checkbox"
            checked={data.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describe('consent')}
            className={`checkbox mt-0.5 size-5 shrink-0 ${errors.consent ? 'border-ember' : ''}`}
          />
          <label htmlFor={id('consent')} className="text-sm leading-relaxed text-mist">
            {t.consentBefore}
            <Link
              href={privacyHref}
              target="_blank"
              className="text-paper underline underline-offset-4 hover:text-ember"
            >
              {t.consentLink}
            </Link>
            {t.consentAfter}
          </label>
        </div>
        <FieldError id={id('consent-error')} message={errors.consent && t.errors.consent} />
      </div>

      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className={buttonClass('primary', 'w-full disabled:opacity-60 sm:w-auto')}
        >
          <span>{status === 'sending' ? t.sending : t.submit}</span>
          <ArrowSwap />
        </button>
      </div>

      <AnimatePresence>
        {(status === 'not_configured' || status === 'failed' || status === 'rate_limited') && (
          <motion.div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.out }}
            className="border border-ember/60 p-6 outline-none md:p-8"
          >
            <h3 className="font-medium text-paper">
              {status === 'not_configured' ? t.notConfigured.title : t.failed.title}
            </h3>
            <p className="mt-2 text-mist">
              {status === 'not_configured'
                ? t.notConfigured.body
                : status === 'rate_limited'
                  ? t.failed.rate
                  : t.failed.body}
            </p>
            <a href={mailto()} className={buttonClass('primary', 'mt-6')}>
              <span>{status === 'not_configured' ? t.notConfigured.cta : t.failed.cta}</span>
              <ArrowSwap />
            </a>
            <p className="mt-4 font-mono text-sm text-mist">{email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

// `muted`: select-ul fără valoare își arată textul de început estompat, ca un placeholder.
const fieldClass = (invalid: boolean, muted = false) =>
  [
    'w-full border-0 border-b bg-transparent px-0 text-[1.0625rem] outline-none transition-colors',
    'placeholder:text-faint focus-visible:border-ember focus-visible:outline-none',
    muted ? 'text-faint' : 'text-paper',
    invalid ? 'border-ember' : 'border-faint hover:border-mist',
  ].join(' ')

function FieldError({ id, message }: { id: string; message?: string | false }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-ember">
      {message}
    </p>
  )
}

type TextProps = {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  optional?: string
  error?: string | false
  errorId?: string
  describedBy?: string
  autoComplete?: string
  inputMode?: 'email' | 'text'
  maxLength?: number
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  optional,
  error,
  errorId,
  describedBy,
  autoComplete,
  inputMode,
  maxLength,
}: TextProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-mist">
        {label} {optional && <span className="text-faint">({optional})</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${fieldClass(!!error)} h-12`}
      />
      {errorId && <FieldError id={errorId} message={error} />}
    </div>
  )
}

type SelectProps<T extends string> = {
  id: string
  label: string
  optional?: string
  placeholder: string
  value: T | ''
  onChange: (v: T | '') => void
  options: readonly T[]
  labels: Record<T, string>
  error?: string | false
  errorId: string
  describedBy?: string
}

function SelectField<T extends string>({
  id,
  label,
  optional,
  placeholder,
  value,
  onChange,
  options,
  labels,
  error,
  errorId,
  describedBy,
}: SelectProps<T>) {
  // Valoarea din DOM e un text oarecare: o acceptăm doar dacă e '' sau una dintre opțiuni.
  const pick = (raw: string) => {
    if (raw === '') return onChange('')
    const match = options.find((o) => o === raw)
    if (match !== undefined) onChange(match)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-mist">
        {label} {optional && <span className="text-faint">({optional})</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => pick(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${fieldClass(!!error, !value)} h-12 cursor-pointer appearance-none pr-8`}
        >
          {/* La un câmp opțional, varianta goală rămâne selectabilă, ca alegerea să poată fi anulată. */}
          <option value="" disabled={!optional} className="bg-ink text-paper">
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-ink text-paper">
              {labels[o]}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-mist"
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}
