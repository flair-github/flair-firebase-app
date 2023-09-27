import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://flair-api.flairlabs.ai',
        changeOrigin: true,
      },
    },
  },
})
