const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'public', 'image-sitemap.xml');

// ✅ এই ফোল্ডারগুলো scan করবে না
const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', '.astro',
  '.github', 'scripts', 'fonts', 'assets'
]);

// ✅ এই তিনটি জায়গায় HTML ফাইল খুঁজবে
const SCAN_DIRS = [
  process.cwd(),                         // root (index.html, astrology.html ইত্যাদি)
  path.join(process.cwd(), 'public'),    // public ফোল্ডার
  path.join(process.cwd(), 'src'),       // src ফোল্ডার
];

function walkDir(dir, extFilter = ['.html']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walkDir(full, extFilter));
    else if (extFilter.includes(path.extname(entry.name).toLowerCase())) results.push(full);
  }
  return results;
}

function extractImagesFromHtml(htmlContent) {
  const imgs = [];
  const imgTagRegex = /<img\b[^>]*>/gi;
  let m;
  while ((m = imgTagRegex.exec(htmlContent))) {
    const tag = m[0];
    const srcMatch = tag.match(/(?:src|data-src)\s*=\s*["']([^"']+)["']/i);
    const src = srcMatch ? srcMatch[1].trim() : null;
    if (src && !src.startsWith('data:')) {
      const altMatch = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
      imgs.push({ src, alt: altMatch ? altMatch[1] : '' });
    }
  }
  return imgs;
}

function ensureAbsUrl(u) {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const clean = u.startsWith('/') ? u : `/${u}`;
  return `${BASE_URL}${clean}`;
}

function escapeCDATA(str) {
  if (!str) return '';
  return `<![CDATA[${str.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

(function main() {
  console.log('🔎 Scanning for images...');
  const pageMap = new Map();

  // ✅ Duplicate HTML ফাইল বাদ দেওয়ার জন্য
  const seenFiles = new Set();
  const htmlFiles = SCAN_DIRS.flatMap(dir => walkDir(dir, ['.html']))
    .filter(f => {
      if (seenFiles.has(f)) return false;
      seenFiles.add(f);
      return true;
    });

  console.log(`📄 Found ${htmlFiles.length} HTML files.`);

  for (const htmlPath of htmlFiles) {
    try {
      const content = fs.readFileSync(htmlPath, 'utf8');
      const imgs = extractImagesFromHtml(content);
      if (!imgs.length) continue;

      const relPath = path.relative(process.cwd(), htmlPath)
        .split(path.sep).join('/');
      const pageUrl = `/${relPath}`;

      for (const { src, alt } of imgs) {
        const imageUrl = ensureAbsUrl(src);
        if (!imageUrl) continue;
        if (!pageMap.has(pageUrl)) pageMap.set(pageUrl, []);
        pageMap.get(pageUrl).push({ imageUrl, alt, title: alt });
      }
    } catch (err) {
      console.warn('⚠️ Skip:', htmlPath, err.message);
    }
  }

  // ✅ Blog post-এর ছবি list.json থেকে
  const blogJsonPath = path.join(process.cwd(), 'src/content/blog/list.json');
  if (fs.existsSync(blogJsonPath)) {
    try {
      const posts = JSON.parse(fs.readFileSync(blogJsonPath, 'utf8'));
      for (const p of posts) {
        const imageUrl = ensureAbsUrl(p.image || p.og_image || '');
        if (!imageUrl) continue;
        const pageUrl = `/blog.html?post=${p.slug || ''}`;
        if (!pageMap.has(pageUrl)) pageMap.set(pageUrl, []);
        pageMap.get(pageUrl).push({
          imageUrl,
          title: p.title || '',
          alt: p.og_image_alt || p.description || p.title || ''
        });
      }
      console.log(`📂 ${posts.length} blog posts loaded.`);
    } catch (err) {
      console.warn('⚠️ list.json read failed:', err.message);
    }
  }

  // ✅ XML তৈরি
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  let totalPages = 0;
  let totalImages = 0;

  for (const [page, images] of pageMap.entries()) {
    const seen = new Set();
    const unique = images.filter(it => {
      if (!it.imageUrl || seen.has(it.imageUrl)) return false;
      seen.add(it.imageUrl);
      return true;
    });
    if (!unique.length) continue;

    totalPages++;
    xml += `  <url>\n    <loc>${escapeXml(ensureAbsUrl(page))}</loc>\n`;
    for (const it of unique) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(it.imageUrl)}</image:loc>\n`;
      if (it.title) xml += `      <image:title>${escapeCDATA(it.title)}</image:title>\n`;
      if (it.alt)   xml += `      <image:caption>${escapeCDATA(it.alt)}</image:caption>\n`;
      xml += `    </image:image>\n`;
      totalImages++;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  fs.writeFileSync(OUT_FILE, xml, 'utf8');
  console.log(`✅ image-sitemap.xml → pages: ${totalPages}, images: ${totalImages}`);
})();
