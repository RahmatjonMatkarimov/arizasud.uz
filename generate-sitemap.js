import { create } from 'xmlbuilder2';
import fs from 'fs';
import { routes } from './src/router/routes.js';

const baseURL = 'https://arizasud.uz';

const generateSitemap = () => {
  console.log('Starting sitemap generation...');
  
  const flattenRoutes = (routes, parentPath = '') => {
    const flattened = [];
    
    routes.forEach(route => {

      const fullPath = route.path.startsWith('/')
        ? route.path
        : `${parentPath}/${route.path}`.replace(/\/+/g, '/');

      console.log(`Processing route: ${fullPath}`);
      
      if (
        !route.path.includes(':') &&
        route.path !== '/:catchAll(.*)' &&
        (!route.meta?.requiresAuth || !route.meta?.allowedRoles)
      ) {
        flattened.push({
          loc: `${baseURL}${fullPath}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: route.name === 'home' ? '1.0' : '0.8',
        });
      }
      
      // Process children recursively
      if (route.children) {
        flattened.push(...flattenRoutes(route.children, fullPath));
      }
    });
    
    return flattened;
  };
  
  // Get all URLs
  const urls = flattenRoutes(routes);
  console.log('Generated URLs:', urls);
  
  // Create sitemap structure
  const sitemapObj = {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: urls,
    },
  };
  
  // Generate XML
  const sitemapXML = create(sitemapObj).end({ prettyPrint: true });
  
  // Save to file
  try {
    // Ensure public directory exists
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    fs.writeFileSync('public/sitemap.xml', sitemapXML);
    console.log('sitemap.xml generated successfully at public/sitemap.xml!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap();