/**
 * Fișierul de pornire pentru găzduirea cPanel („Setup Node.js App” → Application startup file).
 * E .cjs fiindcă Passenger îl încarcă cu require(), iar package.json are "type": "module".
 * Nu trece prin compilatorul Next: păstrează-l în JavaScript simplu.
 */
// Pe găzduire rulează mereu build-ul de producție, indiferent ce NODE_ENV setează panoul.
process.env.NODE_ENV = 'production'

async function main() {
  // import() în loc de require(): merge din CommonJS pe orice versiune de Node acceptată.
  const { createServer } = await import('node:http')
  const { default: next } = await import('next')

  const port = parseInt(process.env.PORT || '3000', 10)
  const app = next({ dev: false, dir: __dirname })
  const handle = app.getRequestHandler()
  await app.prepare()

  createServer((req, res) => {
    handle(req, res).catch((err) => {
      console.error('[server] cerere eșuată', req.url, err)
      if (!res.headersSent) res.statusCode = 500
      res.end()
    })
  }).listen(port, () => {
    console.log(`[server] pornit pe portul ${port}`)
  })
}

main().catch((err) => {
  console.error('[server] nu a pornit', err)
  process.exit(1)
})
