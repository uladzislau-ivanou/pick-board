import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// The GitHub Pages demo is served from /<repo>/; every other build (including a
// local `vite preview`) is served from the root.
const base = process.env.GITHUB_PAGES === 'true' ? '/pick-board/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    // One alias for the whole app. `@/entities/pick` already names its FSD
    // layer out loud; the ESLint boundary rules enforce the rest.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
  },
})
