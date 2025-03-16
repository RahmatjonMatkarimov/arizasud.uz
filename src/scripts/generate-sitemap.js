import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { format } from "date-fns";
import router from "../router/index.js"; // Vue Router import

// __dirname ni olish
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Localhost yoki haqiqiy domen
const baseUrl = process.env.NODE_ENV === "production"
  ? "https://mysite.com" // Real sayt uchun
  : "http://localhost:5173"; // Localhost uchun

// Sitemap joylashuvi
const sitemapPath = path.join(__dirname, "../../public/sitemap.xml");

// Vue Router'dagi yo‘llarni olish
const routes = router.getRoutes().map(route => route.path);

// Hozirgi sana
const lastMod = format(new Date(), "yyyy-MM-dd");

// XML yaratish
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(route => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${lastMod}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `)
    .join("")}
</urlset>`;

// XML faylni yozish
fs.writeFileSync(sitemapPath, sitemapContent, "utf8");
console.log(`✅ Sitemap yaratildi: ${sitemapPath}`);
