'use strict';

const fs   = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const ROOT     = process.cwd();
const TODAY    = new Date().toISOString().split('T')[0];

const PAGE_CONFIG = {
  'index.html':           { priority: 1.00, changefreq: 'weekly'  },
  'astrology.html':       { priority: 0.95, changefreq: 'monthly' },
  'palmistry.html':       { priority: 0.95, changefreq: 'monthly' },
  'rashifal.html':        { priority: 0.90, changefreq: 'monthly' },
  'vastu-science.html':   { priority: 0.90, changefreq: 'monthly' },
  'vedic-astronomy.html': { priority: 0.85, changefreq: 'monthly' },
  'panjika.html':         { priority: 0.92, changefreq: 'daily'   },
  'blog-list.html':       { priority: 0.92, changefreq: 'daily'   },
  'blog.html':            { priority: 0.90, changefreq: 'daily'   },
  'reviews.html':         { priority: 0.90, changefreq: 'daily'   },
  'video.html':           { priority: 0.82, changefreq: 'monthly' },
  'gallery.html':         { priority: 0.80, changefreq: 'monthly' },
  'gemstone.html':        { priority: 0.80, changefreq: 'monthly' },
  'about.html':           { priority: 0.75, changefreq: 'yearly'  },
  'contact.html':         { priority: 0.72, changefreq: 'yearly'  },
  'privacy-policy.html':  { priority: 0.30, changefreq: 'yearly'  },
  'terms-of-use.html':    { priority: 0.30, changefreq: 'yearly'  },
};

const EXCLUDE = new Set([
  '404.html','offline.html','error.html','test.html','draft.html'
]);

// ── Static pages ───────────────────────────────────────────────────
const staticPages = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html') && !EXCLUDE.has(f))
  .sort()
  .map(file => {
    const cfg = PAGE_CONFIG[file] || { priority: 0.65, changefreq: 'monthly' };
    const url = file === 'index.html' ? `${BASE_URL}/` : `${BASE_URL}/${file}`;
    return { url, lastmod: TODAY, ...cfg };
  });

// ── Blog posts ─────────────────────────────────────────────────────
const blogDir = path.join(ROOT, 'blog');
let blogPages = [];
if (fs.existsSync(blogDir)) {
  blogPages = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.html'))
    .sort()
    .map(file => ({
      url:        `${BASE_URL}/blog/${file}`,
      lastmod:    TODAY,
      changefreq: 'monthly',
      priority:   0.80,
    }));
}

// ── Combine & sort ─────────────────────────────────────────────────
const allUrls = [...staticPages, ...blogPages]
  .sort((a, b) => b.priority - a.priority);

// ── Write sitemap.xml ──────────────────────────────────────────────
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(2)}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`✅ sitemap.xml → ${allUrls.length} URLs (${staticPages.length} static + ${blogPages.length} blog)`);
