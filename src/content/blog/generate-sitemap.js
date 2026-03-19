'use strict';

const fs   = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const ROOT     = process.cwd();
const TODAY    = new Date().toISOString().split('T')[0];

const PAGE_CONFIG = {
  'index.html':                          { priority: 1.00, changefreq: 'weekly'  },
  'astrology.html':                      { priority: 0.95, changefreq: 'monthly' },
  'palmistry.html':                      { priority: 0.95, changefreq: 'monthly' },
  'best-astrologer-in-kolkata.html':     { priority: 0.90, changefreq: 'monthly' }, // ← নতুন
  'best-astrologer-in-nadia.html':       { priority: 0.90, changefreq: 'monthly' }, // ← নতুন
  'rashifal.html':                       { priority: 0.90, changefreq: 'daily'   },
  'panjika.html':                        { priority: 0.92, changefreq: 'daily'   },
  'blog-list.html':                      { priority: 0.92, changefreq: 'daily'   },
  'blog.html':                           { priority: 0.90, changefreq: 'daily'   },
  'reviews.html':                        { priority: 0.90, changefreq: 'weekly'  },
  'vastu-science.html':                  { priority: 0.88, changefreq: 'monthly' },
  'vedic-astronomy.html':                { priority: 0.85, changefreq: 'monthly' },
  'gemstone.html':                       { priority: 0.82, changefreq: 'monthly' },
  'video.html':                          { priority: 0.82, changefreq: 'monthly' },
  'gallery.html':                        { priority: 0.80, changefreq: 'monthly' },
  'about.html':                          { priority: 0.75, changefreq: 'yearly'  },
  'contact.html':                        { priority: 0.72, changefreq: 'yearly'  },
  'privacy-policy.html':                 { priority: 0.30, changefreq: 'yearly'  },
  'terms-of-use.html':                   { priority: 0.30, changefreq: 'yearly'  },
};

// ── Subdirectory index pages (manually maintained) ─────────────────
// ROOT-এর ভেতরে subdirectory পেজ যেগুলো static scan-এ ধরা পড়ে না
const SUBDIR_PAGES = [
  {
    url:        `${BASE_URL}/learning/`,
    lastmod:    TODAY,
    changefreq: 'monthly',
    priority:   0.85,
  },
];

const EXCLUDE = new Set([
  '404.html', 'offline.html', 'error.html',
  'test.html', 'draft.html',
]);

// XML special chars escape
function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Safe readdir — returns [] instead of crashing
function safeReaddir(dir) {
  try {
    return fs.readdirSync(dir);
  } catch (e) {
    console.warn(`⚠️  Cannot read dir: ${dir} — ${e.message}`);
    return [];
  }
}

// ── Static pages ───────────────────────────────────────────────────
const staticPages = safeReaddir(ROOT)
  .filter(f => f.endsWith('.html') && !EXCLUDE.has(f))
  .sort()
  .map(file => {
    const cfg = PAGE_CONFIG[file] || { priority: 0.65, changefreq: 'monthly' };
    const url = file === 'index.html'
      ? `${BASE_URL}/`
      : `${BASE_URL}/${file}`;
    return { url: esc(url), lastmod: TODAY, ...cfg };
  });

// ── Blog posts — শুধুমাত্র /blog/*.html ───────────────────────────
// src/content/blog/*.md থেকে generate হওয়া HTML এখানে আসে
// অন্য কোনো subdirectory এখানে ধরা হয় না
const blogDir  = path.join(ROOT, 'blog');
const blogPages = safeReaddir(blogDir)
  .filter(f => f.endsWith('.html'))
  .sort()
  .map(file => ({
    url:        esc(`${BASE_URL}/blog/${file}`),
    lastmod:    TODAY,
    changefreq: 'monthly',
    priority:   0.80,
  }));

// ── Combine, deduplicate & sort by priority desc ───────────────────
const seen = new Set();
const allUrls = [...staticPages, ...SUBDIR_PAGES, ...blogPages]
  .filter(p => {
    if (seen.has(p.url)) return false;
    seen.add(p.url);
    return true;
  })
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

const sitemapPath = path.join(ROOT, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ sitemap.xml → ${allUrls.length} URLs`);
console.log(`   ${staticPages.length} static | ${SUBDIR_PAGES.length} subdir | ${blogPages.length} blog`);

// ── Priority warnings (catch misconfigured pages) ──────────────────
staticPages.forEach(p => {
  if (p.priority === 0.65) {
    const file = p.url.split('/').pop();
    console.warn(`⚠️  Default priority used for: ${file} — PAGE_CONFIG-এ যোগ করুন`);
  }
});
