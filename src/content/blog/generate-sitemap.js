const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const OUTPUT = path.join(process.cwd(), 'sitemap.xml');

// ✅ HTML পেজসমূহ (Static Pages)
const staticPages = [
  { url: `${BASE_URL}/`,                    lastmod: '2025-08-30', changefreq: 'weekly',  priority: 1.0  },
  { url: `${BASE_URL}/index.html`,          lastmod: '2025-08-30', changefreq: 'weekly',  priority: 1.0  },
  { url: `${BASE_URL}/astrology.html`,      lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { url: `${BASE_URL}/palmistry.html`,      lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { url: `${BASE_URL}/rashifal.html`,       lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.85 },
  { url: `${BASE_URL}/vastu-science.html`,  lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.80 },
  { url: `${BASE_URL}/vedic-astronomy.html`,lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.80 },
  { url: `${BASE_URL}/panjika.html`,        lastmod: '2025-08-30', changefreq: 'daily',   priority: 0.85 },
  { url: `${BASE_URL}/video.html`,          lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.80 },
  { url: `${BASE_URL}/gallery.html`,        lastmod: '2025-08-30', changefreq: 'monthly', priority: 0.80 },
  { url: `${BASE_URL}/about.html`,          lastmod: '2025-08-30', changefreq: 'yearly',  priority: 0.70 },
  { url: `${BASE_URL}/blog-list.html`,      lastmod: '2025-08-30', changefreq: 'daily',   priority: 0.90 },
  { url: `${BASE_URL}/blog.html`,           lastmod: '2025-08-30', changefreq: 'daily',   priority: 0.90 },
  { url: `${BASE_URL}/reviews.html`,        lastmod: '2025-08-30', changefreq: 'daily',   priority: 0.90 },
];

// ✅ Blog Posts (list.json থেকে auto-generate)
function readBlogPosts() {
  const blogPath = path.join(process.cwd(), 'src/content/blog/list.json');
  try {
    const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    return posts.map(post => ({
      url: `${BASE_URL}/blog.html?post=${post.slug}`,
      lastmod: post.date
        ? new Date(post.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.85
    }));
  } catch (err) {
    console.warn('list.json read failed:', err.message);
    return [];
  }
}

// ✅ Static + Blog একসাথে
const allUrls = [...staticPages, ...readBlogPosts()];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(OUTPUT, xml, 'utf8');
console.log(`✅ Total URLs: ${allUrls.length} (${staticPages.length} static + ${allUrls.length - staticPages.length} blog posts)`);
