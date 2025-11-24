import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '../dist/server/entry-server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const template = fs.readFileSync(
  path.join(__dirname, '..', 'dist', 'index.html'),
  'utf-8'
)

export default async function handler(req, res) {
  const pathname = req?.url?.split('?')[0] || ''
  if (pathname === '/api/contact') {
    try {
      const { default: contactHandler } = await import('./contact.js')
      return contactHandler(req, res)
    } catch (error) {
      console.error('Contact handler error:', error)
      res.status(500).json({ error: 'contact handler failed' })
      return
    }
  }

  try {
    const { html } = await render(null, req.url)
    const page = template.replace('<!--ssr-outlet-->', html)
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(page)
  } catch (error) {
    console.error('SSR render error:', error)
    res.status(500).send('SSR render error')
  }
}
