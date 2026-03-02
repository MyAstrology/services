const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';
const sitemapPath = path.join(process.cwd(), 'my-sitemap.xml');

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
    console.warn('⚠️ list.json read failed:', err.message);
    return [];
  }
}

const allUrls = readBlogPosts();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(sitemapPath, xml, 'utf8');
const sitemapPath = path.join(process.cwd(), 'public', 'my-sitemap.xml');
