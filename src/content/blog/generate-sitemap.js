const fs = require('fs');
const path = require('path');

// Workflow অনুযায়ী list.json ফোল্ডার
const blogListPath = path.join(__dirname, 'list.json'); // যদি generate-list.js src/content/blog/ এ থাকে

// Sitemap root folder-এ
const sitemapPath = path.join(process.cwd(), 'my-sitemap.xml'); // process.cwd() → repo root

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
  console.warn('⚠️ blog list not found. Proceeding with static pages only.');
}

// Start XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

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
  xml += `  <url>
    <loc>${BASE_URL}/blog.html?post=${blog.slug}</loc>
    <lastmod>${blog.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
});

// Close XML
xml += `</urlset>`;

// Write sitemap to root folder
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log('✅ my-sitemap.xml তৈরি হয়েছে root folder-এ।');
