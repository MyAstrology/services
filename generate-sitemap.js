const fs = require('fs');
const path = require('path');

// ব্লগ লিস্ট ফাইল
const blogListPath = path.join(__dirname, 'src/content/blog/list.json');
const sitemapPath = path.join(__dirname, 'site-map.xml');

// স্ট্যাটিক পেজগুলো
const staticPages = [
  { loc: 'https://astro.myastrology.in/', lastmod: '2025-08-30', changefreq: 'weekly', priority: 1.0 },
  { loc: 'https://astro.myastrology.in/index.html', lastmod: '2025-08-30', changefreq: 'weekly', priority: 1.0 },
  { loc: 'https://astro.myastrology.in/video.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.8 },
  { loc: 'https://astro.myastrology.in/astrology.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { loc: 'https://astro.myastrology.in/palmistry.html', lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  // আরও পেজ এখানে যোগ করুন
];

// ব্লগ লিস্ট পড়া
const blogList = JSON.parse(fs.readFileSync(blogListPath, 'utf8'));

// XML হেডার
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// স্ট্যাটিক পেজ যোগ করা
staticPages.forEach(page => {
  xml += `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
});

// ব্লগ পোস্ট যোগ করা
blogList.forEach(blog => {
  xml += `  <url>
    <loc>https://astro.myastrology.in/blog.html?post=${blog.slug}</loc>
    <lastmod>${blog.lastmod || '2025-08-30'}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
});

// XML ক্লোজিং ট্যাগ
xml += `</urlset>`;

// ফাইল লেখা
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log('✅ sitemap.xml তৈরি হয়েছে।');
