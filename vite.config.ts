import { sentryVitePlugin } from "@sentry/vite-plugin";
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 👈 важно для GitHub Pages
  base: '/',

  plugins: [react(), sentryVitePlugin({
    org: "pesherkino",
    project: "javascript-react"
  })],

  build: {
    sourcemap: true
  }
})