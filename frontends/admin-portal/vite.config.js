import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/admin/',      // <-- add this
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  }
})