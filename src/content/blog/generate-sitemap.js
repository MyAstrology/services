const fs = require('fs');
const path = require('path');

// Repo root-এ sitemap generate হবে
const sitemapPath = path.join(process.cwd(), 'my-sitemap.xml');

// Base URL
const BASE_URL = 'https://astro.myastrology.in';

// Static pages
const staticPages = [
  { loc: '/', lastmod: '2025-08-30', changefreq: 'weekly', priority: 1.0 },
  { loc: '/index.html', lastmod: '2025-08-30', changefreq: 'weekly', priority: 1.0 },
  { loc: '/video.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: '/astrology.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { loc: '/palmistry.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { loc: '/rashifal.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { loc: '/vastu-science.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: '/gallery.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: '/about.html', lastmod: '2025-08-30', changefreq: 'yearly', priority: 0.7 },
  { loc: '/blog.html', lastmod: '2025-08-30', changefreq: 'daily', priority: 0.9 },
];

// Blog JSON path
const blogListPath = path.join(__dirname, 'list.json');

// Read blog list JSON safely
let blogList = [];
try {
  blogList = JSON.parse(fs.readFileSync(blogListPath, 'utf8'));
} catch (err) {
  console.warn('⚠️ blog list not found. Proceeding with static pages only.');
}

// Start XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static pages
staticPages.forEach(page => {
  xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
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

// Write sitemap
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`✅ my-sitemap.xml তৈরি হয়েছে: ${sitemapPath}`);
