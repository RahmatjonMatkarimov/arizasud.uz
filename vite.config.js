import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Vue komponentlariga to'g'ri yo'naltirish
    },
  },
  server: {
    host: '0.0.0.0',  // Hammasi uchun ochiq bo'lishi uchun
    port: 5001,  // Portni o'zgartirishingiz mumkin
    strictPort: true,  // Agar ko'rsatilgan port band bo'lsa, serverni boshlashni rad etadi
    cors: {
      origin: '*' // CORS siyosati (agar kerak bo'lsa)
    },
    watch: {
      usePolling: true, // File system monitoringni yaxshilash uchun pollingni yoqish
    },
  },
  build: {
    // Build jarayonini optimallashtirish
    outDir: 'dist',  // Build natijalarining chiqariladigan manzili
    sourcemap: true,  // Source map qo'shish (tezda xatolarni tuzatish uchun foydali)
  },
});
