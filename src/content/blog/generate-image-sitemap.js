const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'image-sitemap.xml');

const IMAGE_DIRS = ['images', 'assist', 'blog', 'gallery'];
const SCAN_HTML_DIRS = [process.cwd(), path.join(process.cwd(), 'public'), path.join(process.cwd(), 'src')];
const IGNORE_DIRS = new Set(['node_modules', '.git', '.astro', 'dist', '.github']);
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

function walkDir(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function extractImagesFromHtml(content) {
  const imgs = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(content))) {
    imgs.push(match[1]);
  }
  return imgs;
}

function ensureAbs(url) {
  if (/^https?:\/\//i.test(url)) return url;
  const cleanUrl = url.startsWith('/') ? url : '/' + url;
  return BASE_URL + cleanUrl;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// মূল জেনারেশন ফাংশন
(function main() {
  console.log("🚀 Scanning for images...");
  const images = new Set();

  // ১. HTML ফাইল থেকে ছবি খোঁজা
  SCAN_HTML_DIRS.forEach(dir => {
    const files = walkDir(dir).filter(f => f.endsWith('.html'));
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      extractImagesFromHtml(content).forEach(i => images.add(ensureAbs(i)));
    });
  });

  // ২. নির্দিষ্ট ফোল্ডার থেকে ছবি খোঁজা
  IMAGE_DIRS.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    if (fs.existsSync(fullDir)) {
      walkDir(fullDir).forEach(f => {
        if (IMAGE_EXT.includes(path.extname(f).toLowerCase())) {
          const rel = path.relative(process.cwd(), f).split(path.sep).join('/');
          images.add(BASE_URL + '/' + rel);
        }
      });
    }
  });

  // ৩. XML তৈরি (কোনো স্পেস ছাড়া)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url>\n    <loc>${BASE_URL}/</loc>`;

  images.forEach(img => {
    xml += `\n    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n    </image:image>`;
  });

  xml += `\n  </url>\n</urlset>`;

  // ফাইল সেভ করা (শুরু ও শেষ ট্রিম করে)
  fs.writeFileSync(OUT_FILE, xml.trim(), 'utf8');
  console.log(`✅ Success! image-sitemap.xml generated with ${images.size} images.`);
})();
