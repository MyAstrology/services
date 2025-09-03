const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';
const sitemapPath = path.join(process.cwd(), 'my-sitemap.xml');

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

// blog.json থেকে ব্লগ লোড
function readBlogPosts() {
  const blogPath = path.join(process.cwd(), 'src/content/blog/list.json');
  try {
    const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    return posts.map(post => ({
      url: `${BASE_URL}/blog.html?post=${post.slug}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.85
    }));
  } catch (err) {
    console.warn("⚠️ Blog JSON read failed:", err.message);
    return [];
  }
}

// ফোল্ডার থেকে ইমেজ URL তৈরি
function readFolderImages(folder, pageUrl) {
  const dirPath = path.join(process.cwd(), 'public', folder);
  if (!fs.existsSync(dirPath)) return [];

  return fs.readdirSync(dirPath)
    .filter(file => /\.(png|jpe?g|webp|gif)$/i.test(file))
    .map(file => ({
      url: `${BASE_URL}${pageUrl}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.8
    }));
}

// সব ডেটা merge
let allUrls = [
  ...staticPages.map(p => ({ url: BASE_URL + p.loc, ...p })),
  ...readBlogPosts(),
  ...readFolderImages('gallery', '/gallery.html'),
  ...readFolderImages('assist', '/assist.html'),
  ...readFolderImages('images', '/index.html'),
];

// Duplicate remove
const seen = new Set();
allUrls = allUrls.filter(item => {
  if (seen.has(item.url)) return false;
  seen.add(item.url);
  return true;
});

// XML বানানো
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

allUrls.forEach(page => {
  xml += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
});

xml += `</urlset>`;

// Write
fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`✅ my-sitemap.xml তৈরি হয়েছে: ${sitemapPath}`);
