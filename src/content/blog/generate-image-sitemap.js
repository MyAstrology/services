const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'image-sitemap.xml');

const IMAGE_DIRS = ['images', 'assist', 'blog', 'gallery'];
const SCAN_HTML_DIRS = [process.cwd(), path.join(process.cwd(), 'public'), path.join(process.cwd(), 'src')];
const IGNORE_DIRS = new Set(['node_modules', '.git', '.astro', 'dist', '.github']);
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

// এই ফাংশনটি আপনার ফাইলে ছিল না, যা এখন যোগ করা হলো
function scanHtmlImages() {
  const images = new Set();
  
  // HTML ফাইল থেকে ছবি খোঁজা
  SCAN_HTML_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = walkDir(dir).filter(f => f.endsWith('.html'));
      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const regex = /<img[^>]+src=["']([^"']+)["']/gi;
        let match;
        while ((match = regex.exec(content))) {
          let url = match[1];
          if (!/^https?:\/\//i.test(url)) {
            url = url.startsWith('/') ? url : '/' + url;
            url = BASE_URL + url;
          }
          images.add(url);
        }
      });
    }
  });
  return Array.from(images);
}

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

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// মূল জেনারেশন প্রসেস
(function main() {
  console.log("🚀 Scanning for images...");
  
  // ফাংশন কল করা হচ্ছে (যা এখন উপরে ডিফাইন করা আছে)
  const htmlImages = scanHtmlImages();
  const allImages = new Set(htmlImages);

  // নির্দিষ্ট ফোল্ডার থেকে ছবি খোঁজা
  IMAGE_DIRS.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    if (fs.existsSync(fullDir)) {
      walkDir(fullDir).forEach(f => {
        if (IMAGE_EXT.includes(path.extname(f).toLowerCase())) {
          const rel = path.relative(process.cwd(), f).split(path.sep).join('/');
          allImages.add(BASE_URL + '/' + rel);
        }
      });
    }
  });

  // XML তৈরি (শুরুতে কোনো স্পেস বা নিউ লাইন রাখা যাবে না)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url>\n    <loc>${BASE_URL}/</loc>`;

  allImages.forEach(img => {
    xml += `\n    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n    </image:image>`;
  });
  

  xml += `\n  </url>\n</urlset>`;

  fs.writeFileSync(OUT_FILE, xml.trim(), 'utf8');
  console.log(`✅ Success! image-sitemap.xml generated with ${allImages.size} images.`);
})();
