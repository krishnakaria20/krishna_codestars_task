import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // forwards /api calls to Express in dev, so the client never
    // needs to know the backend's port or deal with CORS
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
