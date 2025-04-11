import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import VitePluginPrerender from "vite-plugin-prerender"; // To‘g‘ri import qilish

export default defineConfig({
  plugins: [
    vue(),
    VitePluginPrerender({
      staticDir: 'dist',
      routes: ['/', '/ticket'], // kerakli sahifalaringni shu yerga yoz
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5001,
    strictPort: true,
    cors: true,
    watch: {
      usePolling: true,
    },
  },
});
