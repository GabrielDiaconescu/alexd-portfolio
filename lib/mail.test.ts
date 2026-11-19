import { beforeEach, describe, expect, it, vi } from 'vitest'

const sendMail = vi.fn()
const createTransport = vi.fn<(options: unknown) => { sendMail: typeof sendMail }>(() => ({ sendMail }))
vi.mock('nodemailer', () => ({ default: { createTransport } }))

const { sendInquiryMail, smtpConfigFromEnv } = await import('./mail')

const env = {
  SMTP_HOST: 'mail.example.ro',
  SMTP_USER: 'formular@example.ro',
  SMTP_PASS: 'secret',
  INQUIRY_FROM_EMAIL: 'Site <formular@example.ro>',
  INQUIRY_TO_EMAIL: 'contact@example.ro',
}

describe('smtpConfigFromEnv', () => {
  it('citește configurarea completă, cu portul 465 implicit', () => {
    expect(smtpConfigFromEnv(env)).toEqual({
      config: {
        host: 'mail.example.ro',
        port: 465,
        user: 'formular@example.ro',
        pass: 'secret',
        from: 'Site <formular@example.ro>',
        to: 'contact@example.ro',
      },
    })
  })

  it('folosește SMTP_PORT când e setat', () => {
    expect(smtpConfigFromEnv({ ...env, SMTP_PORT: '587' })).toMatchObject({ config: { port: 587 } })
  })

  it('numește variabilele lipsă sau goale', () => {
    expect(smtpConfigFromEnv({ ...env, SMTP_PASS: '', INQUIRY_TO_EMAIL: undefined })).toEqual({
      missing: ['SMTP_PASS', 'INQUIRY_TO_EMAIL'],
    })
  })

  it('tratează un port invalid ca lipsă', () => {
    expect(smtpConfigFromEnv({ ...env, SMTP_PORT: 'abc' })).toEqual({ missing: ['SMTP_PORT'] })
    expect(smtpConfigFromEnv({ ...env, SMTP_PORT: '70000' })).toEqual({ missing: ['SMTP_PORT'] })
  })

  it('nu taie spațiile din parolă, dar le taie din celelalte valori', () => {
    const result = smtpConfigFromEnv({ ...env, SMTP_HOST: ' mail.example.ro ', SMTP_PASS: ' a b ' })
    expect(result).toMatchObject({ config: { host: 'mail.example.ro', pass: ' a b ' } })
  })
})

describe('sendInquiryMail', () => {
  const config = { host: 'mail.example.ro', port: 465, user: 'u', pass: 'p', from: 'F <f@x.ro>', to: 't@x.ro' }
  const message = { subject: 'Cerere', text: 'text', html: '<p>html</p>' }

  beforeEach(() => {
    sendMail.mockReset().mockResolvedValue({ messageId: '1' })
    createTransport.mockClear()
  })

  it('pe portul 465 folosește TLS direct, cu autentificare și limite de timp', async () => {
    await sendInquiryMail(config, message)
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'mail.example.ro',
        port: 465,
        secure: true,
        auth: { user: 'u', pass: 'p' },
        connectionTimeout: expect.any(Number),
        greetingTimeout: expect.any(Number),
        socketTimeout: expect.any(Number),
      }),
    )
  })

  it('pe alt port cere STARTTLS, nu trimite în clar', async () => {
    await sendInquiryMail({ ...config, port: 587 }, message)
    expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ secure: false, requireTLS: true }))
  })

  it('trimite de la expeditorul configurat către destinatar, cu reply-to când există', async () => {
    await sendInquiryMail(config, { ...message, replyTo: 'ana@example.com' })
    expect(sendMail).toHaveBeenCalledWith({
      from: 'F <f@x.ro>',
      to: 't@x.ro',
      replyTo: 'ana@example.com',
      subject: 'Cerere',
      text: 'text',
      html: '<p>html</p>',
    })
  })

  it('fără reply-to nu adaugă câmpul', async () => {
    await sendInquiryMail(config, message)
    expect(sendMail.mock.calls[0][0]).not.toHaveProperty('replyTo')
  })

  it('propagă eroarea serverului SMTP', async () => {
    sendMail.mockRejectedValue(Object.assign(new Error('Invalid login'), { code: 'EAUTH' }))
    await expect(sendInquiryMail(config, message)).rejects.toMatchObject({ code: 'EAUTH' })
  })
})
