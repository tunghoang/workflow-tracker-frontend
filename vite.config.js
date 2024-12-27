import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/workflow',
  build: {
    outDir: '../nginx-data/html/workflow',
    emptyOutDir: true, // also necessary
  }
})
