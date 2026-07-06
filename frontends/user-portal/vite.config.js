import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/user/',      // <-- add this
  plugins: [react()],
  server: {
    port: 3001,
    host: true
  }
})
