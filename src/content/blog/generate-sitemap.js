'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://www.myastrology.in';
const OUTPUT   = path.join(process.cwd(), 'sitemap.xml');
const TODAY    = new Date().toISOString().split('T')[0];

// ✅ প্রতিটি পেজের priority ও changefreq নিয়ম
const PAGE_CONFIG = {
  'index.html':            { priority: 1.00, changefreq: 'weekly'  },
  'astrology.html':        { priority: 0.95, changefreq: 'monthly' },
  'palmistry.html':        { priority: 0.95, changefreq: 'monthly' },
  'rashifal.html':         { priority: 0.90, changefreq: 'monthly' },
  'vastu-science.html':    { priority: 0.90, changefreq: 'monthly' },
  'vedic-astronomy.html':  { priority: 0.85, changefreq: 'monthly' },
  'panjika.html':          { priority: 0.92, changefreq: 'daily'   },
  'blog-list.html':        { priority: 0.92, changefreq: 'daily'   },
  'blog.html':             { priority: 0.90, changefreq: 'daily'   },
  'reviews.html':          { priority: 0.90, changefreq: 'daily'   },
  'video.html':            { priority: 0.82, changefreq: 'monthly' },
  'gallery.html':          { priority: 0.80, changefreq: 'monthly' },
  'about.html':            { priority: 0.75, changefreq: 'yearly'  },
  'content.html':          { priority: 0.75, changefreq: 'monthly' },
  'contact.html':          { priority: 0.72, changefreq: 'yearly'  },
  'privacy-policy.html':   { priority: 0.30, changefreq: 'yearly'  },
  'terms-of-use.html':     { priority: 0.30, changefreq: 'yearly'  },
};

// ✅ sitemap-এ আসবে না এমন ফাইল
const EXCLUDE = new Set(['404.html', 'offline.html', 'error.html', 'test.html', 'draft.html']);

// ✅ HTML পেজসমূহ — root folder স্বয়ংক্রিয় scan
function scanStaticPages() {
  const DEFAULT = { priority: 0.65, changefreq: 'monthly' };
  return fs.readdirSync(process.cwd())
    .filter(f => f.endsWith('.html') && !EXCLUDE.has(f))
    .sort()
    .flatMap(file => {
      const cfg = PAGE_CONFIG[file] || DEFAULT;
      if (file === 'index.html') {
        return [{ url: `${BASE_URL}/`, lastmod: TODAY, ...cfg }];
      }
      return [{ url: `${BASE_URL}/${file}`, lastmod: TODAY, ...cfg }];
    });
}

// ✅ Blog Posts — list.json থেকে auto-generate
function readBlogPosts() {
  const blogPath = path.join(process.cwd(), 'src/content/blog/list.json');
  try {
    const posts = JSON.parse(fs.readFileSync(blogPath, 'utf8'));
    return posts.map(post => ({
      url:        `${BASE_URL}/blog.html?post=${post.slug}`,
      lastmod:    post.date
                    ? new Date(post.date).toISOString().split('T')[0]
                    : TODAY,
      changefreq: 'monthly',
      priority:   0.80,
    }));
  } catch (err) {
    console.warn('list.json read failed:', err.message);
    return [];
  }
}

// ✅ Static + Blog একসাথে, priority অনুযায়ী sort
const staticPages = scanStaticPages();
const blogPosts   = readBlogPosts();
const allUrls     = [...staticPages, ...blogPosts]
                      .sort((a, b) => b.priority - a.priority);

// ✅ XML তৈরি
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(2)}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(OUTPUT, xml, 'utf8');
console.log(`✅ Sitemap generated: ${allUrls.length} URLs (${staticPages.length} static + ${blogPosts.length} blog posts)`);

// ================================================================
// ✅ Google Ping — sitemap generate হলেই Google notify হবে
// ================================================================
function pingGoogle() {
  const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
  const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;

  return new Promise((resolve) => {
    https.get(pingUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Google ping সফল — sitemap জমা দেওয়া হয়েছে।');
      } else {
        console.warn(`⚠️  Google ping response: HTTP ${res.statusCode}`);
      }
      resolve();
    }).on('error', (err) => {
      // CI environment-এ network না থাকলে নীরবে skip করবে
      console.warn(`⚠️  Google ping skip (network unavailable): ${err.message}`);
      resolve();
    });
  });
}

pingGoogle();
