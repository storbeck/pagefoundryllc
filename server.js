import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  app.use(express.json())
  app.use('/.well-known', (_req, res) => res.status(404).end())
  app.use('/api/contact', async (req, res, next) => {
    console.log('[api/contact] hit', req.method, req.url)
    try {
      const module = await import('./api/contact.js')
      return module.default(req, res)
    } catch (err) {
      console.error('[api/contact] handler error', err)
      return next(err)
    }
  })

  // Create Vite server in middleware mode and configure the app type as 'custom'
  // This disables Vite's own HTML serving logic so parent server can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  // Static assets should run after Vite so module/asset requests with query params
  // (e.g. ?import) are handled by Vite instead of being served as raw files.
  app.use(express.static(path.resolve(__dirname, 'public')))

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template)

      // 3. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const { html: appHtml } = await render(vite, url)

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.error('SSR error', e)
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(5173, () => {
    console.log('Server running at http://localhost:5173')
  })
}

createServer()
