import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'pdfjs-dist/build/pdf.worker.entry': 'pdfjs-dist/build/pdf.worker.min.mjs' // fallback alias (shart emas, lekin xavfsiz)
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // manualChunks optional here, can remove if not needed
      },
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.min.mjs']
  },
  server: {
    host: '0.0.0.0',
    port: 5001,
    strictPort: true,
    open: false,
    cors: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
  }
})
