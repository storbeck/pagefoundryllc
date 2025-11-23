import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'

export async function render(vite, url) {
  const app = createSSRApp(App)
  const ctx = {}
  const html = await renderToString(app, ctx)
  return { html }
}