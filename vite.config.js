import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf",
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    cors: true,
    watch: {
      usePolling: true,
    },
  },
});