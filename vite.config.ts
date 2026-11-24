import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        foundation: fileURLToPath(new URL('./index.html', import.meta.url)),
        portfolio: fileURLToPath(new URL('./portfolio.html', import.meta.url)),
      },
      output: {
        codeSplitting: {
          groups: [{ name: 'three-core', test: /[\\/]three[\\/]build[\\/]three\.core\.js$/ }],
        },
      },
    },
  },
})
