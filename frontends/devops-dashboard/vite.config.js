import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/dashboard/',      // <-- add this
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_GATEWAY_URL': JSON.stringify('https://d1edzu3nj8f784.cloudfront.net')
  },
  server: {
    port: 3002,
    host: true
  }
})