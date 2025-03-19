const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const router = require('./src/router/index').default;

// Sitemap stream yaratamiz
const sitemap = new SitemapStream({ hostname: 'https://arizasud.uz' });

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
    console.log('Sitemap muvaffaqiyatli yaratildi!');
  })
  .catch(err => {
    console.error('Xatolik:', err);
  });