import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: resolve(fileURLToPath(new URL('.', import.meta.url)), 'index.html')
    }
  }
})
