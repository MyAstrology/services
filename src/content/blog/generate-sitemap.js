const fs = require('fs');
const path = require('path');

// Blog list JSON path
const blogListPath = path.join(__dirname, 'list.json'); // workflow অনুযায়ী list.json একই ফোল্ডারে আছে

// Sitemap output path (root folder)
const sitemapPath = path.join(__dirname, '../../my-sitemap.xml'); // root folder-এ Google-friendly

// Base site URL
const BASE_URL = 'https://astro.myastrology.in';

// Static pages
const staticPages = [
  { loc: `${BASE_URL}/`, lastmod: '2025-08-30', changefreq: 'weekly', priority: 1.0 },
  { loc: `${BASE_URL}/index.html`, lastmod: '2025-08-30', changefreq: 'weekly', priority: 1.0 },
  { loc: `${BASE_URL}/video.html`, lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: `${BASE_URL}/astrology.html`, lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { loc: `${BASE_URL}/palmistry.html`, lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { loc: `${BASE_URL}/rashifal.html`, lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { loc: `${BASE_URL}/vastu-science.html`, lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: `${BASE_URL}/gallery.html`, lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: `${BASE_URL}/about.html`, lastmod: '2025-08-30', changefreq: 'yearly', priority: 0.7 },
  { loc: `${BASE_URL}/blog.html`, lastmod: '2025-08-30', changefreq: 'daily', priority: 0.9 },
];

// Read blog list JSON
let blogList = [];
try {
  blogList = JSON.parse(fs.readFileSync(blogListPath, 'utf8'));
} catch (err) {
  console.warn('⚠️ blog list not found or invalid JSON. Proceeding with static pages only.');
}

// Start XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static pages
staticPages.forEach(page => {
  xml += `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
});

// Add blog posts
blogList.forEach(blog => {
  const slug = blog.slug;
  const lastmod = blog.lastmod || new Date().toISOString().split('T')[0];
  xml += `  <url>
    <loc>${BASE_URL}/blog.html?post=${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
});

// Close XML
xml += `</urlset>`;

// Write sitemap to root folder
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log('✅ my-sitemap.xml তৈরি হয়েছে root folder-এ।');
