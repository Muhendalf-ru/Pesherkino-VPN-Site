// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // 👈 важно для GitHub Pages
  plugins: [react()],
})
