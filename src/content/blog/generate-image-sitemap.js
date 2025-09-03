// src/content/blog/generate-image-sitemap.js (Fixed Version)
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'image-sitemap.xml');
const IGNORE_DIRS = ['node_modules', '.git'];
const LOCAL_SEARCH_PREFIXES = [
  process.cwd(),
  path.join(process.cwd(), 'services'),
  path.join(process.cwd(), 'src'),
  path.join(process.cwd(), 'public')
];

function walkDir(dir, extFilter = ['.html']) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
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
    let srcsetMatch = tag.match(/srcset\s*=\s*["']([^"']+)["']/i);
    if (!src && srcsetMatch) {
      const firstSrc = srcsetMatch[1].split(',')[0].trim().split(/\s+/)[0];
      if (firstSrc) {
        imgs.push({ src: firstSrc, alt: (tag.match(/alt\s*=\s*["']([^"']*)["']/i) || [])[1] || '' });
        continue;
      }
    }
    if (src) {
      const altMatch = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : '';
      imgs.push({ src, alt });
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

function findLocalFile(imageSrc) {
  const stripped = imageSrc.split('?')[0].split('#')[0];
  const candidatePaths = [];
  if (stripped.startsWith('/')) {
    const rel = stripped.slice(1);
    for (const prefix of LOCAL_SEARCH_PREFIXES) candidatePaths.push(path.join(prefix, rel));
  } else {
    const base = path.basename(stripped);
    for (const prefix of LOCAL_SEARCH_PREFIXES) {
      candidatePaths.push(path.join(prefix, 'images', base));
      candidatePaths.push(path.join(prefix, 'services', 'images', base));
      candidatePaths.push(path.join(prefix, base));
    }
  }
  for (const p of candidatePaths) if (fs.existsSync(p)) return p;
  return null;
}

// Escape alt text safely with CDATA
function escapeCDATA(str) {
  if (!str) return '';
  return `<![CDATA[${str.replace(']]>', ']]]]><![CDATA[>')}]]>`;
}

(function main() {
  console.log('🔎 Scanning HTML files and blog JSON for images...');
  const htmlFiles = walkDir(process.cwd(), ['.html']);
  console.log(`📄 Found ${htmlFiles.length} HTML files.`);

  const pageMap = new Map();

  for (const htmlPath of htmlFiles) {
    try {
      const content = fs.readFileSync(htmlPath, 'utf8');
      const imgs = extractImagesFromHtml(content);
      if (!imgs.length) continue;
      const relPath = path.relative(process.cwd(), htmlPath).split(path.sep).join('/');
      const pageUrl = `/${relPath}`;
      for (const { src, alt } of imgs) {
        const imageUrl = ensureAbsUrl(src);
        const localFile = findLocalFile(src);
        if (!pageMap.has(pageUrl)) pageMap.set(pageUrl, []);
        pageMap.get(pageUrl).push({ imageUrl, alt, localFile });
      }
    } catch (err) {
      console.warn('⚠️ Could not read HTML:', htmlPath, err.message);
    }
  }

  // Include blog images
  const blogJsonPath = path.join(process.cwd(), 'src/content/blog/list.json');
  if (fs.existsSync(blogJsonPath)) {
    try {
      const posts = JSON.parse(fs.readFileSync(blogJsonPath, 'utf8'));
      for (const p of posts) {
        if (!p.image) continue;
        const imageUrl = ensureAbsUrl(p.image);
        const slug = p.slug || '';
        const pageUrl = slug ? `/blog.html?post=${slug}` : '/blog-list.html';
        const alt = p.title || p.alt || '';
        const localFile = findLocalFile(p.image);
        if (!pageMap.has(pageUrl)) pageMap.set(pageUrl, []);
        pageMap.get(pageUrl).push({ imageUrl, alt, localFile });
      }
      console.log(`📂 Loaded ${posts.length} blog posts from list.json`);
    } catch (err) {
      console.warn('⚠️ Could not read blog list.json:', err.message);
    }
  }

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  let totalPages = 0;
  let totalImages = 0;
  for (const [page, images] of pageMap.entries()) {
    const seen = new Set();
    const imgsUnique = [];
    for (const it of images) {
      if (!it.imageUrl) continue;
      if (seen.has(it.imageUrl)) continue;
      seen.add(it.imageUrl);
      imgsUnique.push(it);
    }
    if (!imgsUnique.length) continue;
    totalPages++;
    xml += `  <url>\n    <loc>${ensureAbsUrl(page)}</loc>\n`;
    for (const it of imgsUnique) {
      xml += `    <image:image>\n      <image:loc>${it.imageUrl}</image:loc>\n`;
      if (it.alt) xml += `      <image:caption>${escapeCDATA(it.alt)}</image:caption>\n`;
      xml += `    </image:image>\n`;
      totalImages++;
      if (!it.localFile) console.warn(`⚠️ Local file not found for ${it.imageUrl} (referenced in ${page})`);
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  fs.writeFileSync(OUT_FILE, xml, 'utf8');
  console.log(`✅ Generated ${OUT_FILE} — pages: ${totalPages}, images: ${totalImages}`);
})();
