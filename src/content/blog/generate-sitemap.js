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

// সব JSON ফাইল এবং type
const jsonFiles = [
  { path: path.join(process.cwd(), 'src/content/blog/list.json'), type: 'blog' },
  { path: path.join(process.cwd(), 'src/content/gallery/gallery.json'), type: 'gallery' },
  { path: path.join(process.cwd(), 'src/content/assist/assist.json'), type: 'assist' },
  { path: path.join(process.cwd(), 'src/content/images/images.json'), type: 'images' },
];

// সব item একত্রিত করার জন্য
let allItems = [];

// JSON safely read করা
function readJSON(filePath, type) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📂 Loaded ${data.length} items from ${type}`);
    return data;
  } catch (err) {
    console.warn(`⚠️ Could not read JSON from ${filePath} (${type}): ${err.message}`);
    return [];
  }
}

// সব JSON থেকে items collect
jsonFiles.forEach(({ path: filePath, type }) => {
  const data = readJSON(filePath, type);
  data.forEach(item => item._type = type);
  allItems = allItems.concat(data);
});

// Duplicate remove এবং URL তৈরি
const seenUrls = new Set();
allItems = allItems.filter(item => {
  let pageUrl = BASE_URL;

  if (item._type === 'blog') {
    if (!item.slug) return false;
    pageUrl += `/blog.html?post=${item.slug}`;
  } else if (item._type === 'gallery') {
    pageUrl += `/gallery.html`;
  } else if (item._type === 'assist') {
    pageUrl += `/assist.html`;
  } else if (item._type === 'images') {
    pageUrl += `/images.html`;
  } else {
    return false;
  }

  if (seenUrls.has(pageUrl)) return false;
  seenUrls.add(pageUrl);
  item._fullUrl = pageUrl;
  return true;
});

// XML শুরু
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Static pages যোগ করা
staticPages.forEach(page => {
  xml += `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
});

// JSON থেকে pages যোগ করা
allItems.forEach(item => {
  xml += `  <url>
    <loc>${item._fullUrl}</loc>
    <lastmod>${item.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
});

// XML close
xml += `</urlset>`;

// Write to file
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`✅ my-sitemap.xml তৈরি হয়েছে: ${sitemapPath}`);
