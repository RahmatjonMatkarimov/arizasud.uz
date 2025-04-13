import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import router from '../../src/router/index';

// Sitemap stream yaratamiz
const sitemap = new SitemapStream({ hostname: 'https://arizasud.uz' }); // Saytingiz URL’ini o‘zgartiring

// Router’dan marshrutlarni olamiz
const routes = router.options.routes;

// Har bir marshrutni sitemap’ga qo‘shamiz
routes.forEach(route => {
  sitemap.write({ url: route.path, changefreq: 'daily', priority: 0.7 });
});

// Sitemap’ni yozishni tugatamiz
sitemap.end();

// Sitemap’ni faylga yozamiz
streamToPromise(sitemap)
  .then(data => {
    const writeStream = createWriteStream('public/sitemap.xml');
    writeStream.write(data.toString());
    writeStream.end();
  })
  .catch(err => {
    console.error('Xatolik:', err);
  });