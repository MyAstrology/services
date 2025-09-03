// src/content/blog/generate-image-sitemap.js
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'image-sitemap.xml');

// যেখানে HTML ফাইল থাকতে পারে (root-থেকে recursive search হবে)
const IGNORE_DIRS = ['node_modules', '.git'];

// বাড়তি: কোন ফাইল-স্থানে ইমেজ থাকতে পারে (লোকাল চেকে চেষ্টা করবে)
const LOCAL_SEARCH_PREFIXES = [
  process.cwd(),                        // project root (e.g., "/images/...")
  path.join(process.cwd(), 'services'), // services/images etc.
  path.join(process.cwd(), 'src'),      // src/...
  path.join(process.cwd(), 'public')    // public/...
];

function walkDir(dir, extFilter = ['.html']) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full, extFilter));
    } else {
      if (extFilter.includes(path.extname(entry.name).toLowerCase())) results.push(full);
    }
  }
  return results;
}

// HTML থেকে img src/srcset/data-src + alt বের করা
function extractImagesFromHtml(htmlContent) {
  const imgs = [];
  // match <img ...>
  const imgTagRegex = /<img\b[^>]*>/gi;
  let m;
  while ((m = imgTagRegex.exec(htmlContent))) {
    const tag = m[0];
    // src
    const srcMatch = tag.match(/(?:src|data-src)\s*=\s*["']([^"']+)["']/i);
    const src = srcMatch ? srcMatch[1].trim() : null;

    // srcset -> take first url before whitespace or comma
    let srcsetMatch = tag.match(/srcset\s*=\s*["']([^"']+)["']/i);
    if (!src && srcsetMatch) {
      const firstSrc = srcsetMatch[1].split(',')[0].trim().split(/\s+/)[0];
      if (firstSrc) {
        // maybe relative
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
  // make sure it starts with '/'
  const clean = u.startsWith('/') ? u : `/${u}`;
  return `${BASE_URL}${clean}`;
}

// try to resolve local file path for a given image src (relative/absolute)
function findLocalFile(imageSrc) {
  // strip query/hash
  const stripped = imageSrc.split('?')[0].split('#')[0];
  let candidatePaths = [];

  if (stripped.startsWith('/')) {
    // absolute path on website: try direct join with project root and also with 'services'
    const rel = stripped.slice(1); // remove leading slash
    for (const prefix of LOCAL_SEARCH_PREFIXES) {
      candidatePaths.push(path.join(prefix, rel));
    }
  } else {
    // relative path: we cannot know base without page context here,
    // so we will also try to find any file matching the basename anywhere under LOCAL_SEARCH_PREFIXES
    const base = path.basename(stripped);
    for (const prefix of LOCAL_SEARCH_PREFIXES) {
      // shallow search common dirs
      candidatePaths.push(path.join(prefix, 'images', base));
      candidatePaths.push(path.join(prefix, 'services', 'images', base));
      candidatePaths.push(path.join(prefix, base));
    }
  }

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// MAIN
(function main() {
  console.log('🔎 Scanning HTML files and blog JSON for images...');

  // 1) find all HTML files in repo (recursive)
  const htmlFiles = walkDir(process.cwd(), ['.html']);
  console.log(`📄 Found ${htmlFiles.length} HTML files.`);

  // 2) map: pageUrl -> array of { imageUrl, alt, localPath? }
  const pageMap = new Map();

  // process each HTML file
  for (const htmlPath of htmlFiles) {
    try {
      const content = fs.readFileSync(htmlPath, 'utf8');
      const imgs = extractImagesFromHtml(content);
      if (!imgs.length) continue;
      // compute pageUrl relative to project root, use filename with leading '/'
      const relPath = path.relative(process.cwd(), htmlPath).split(path.sep).join('/');
      const pageUrl = `/${relPath}`; // e.g., /index.html or /subdir/page.html
      for (const { src, alt } of imgs) {
        const imageUrl = ensureAbsUrl(src);
        const localFile = findLocalFile(src);
        if (!pageMap.has(pageUrl)) pageMap.set(pageUrl, []);
        pageMap.get(pageUrl).push({ imageUrl, alt: alt || '', localFile });
      }
    } catch (err) {
      console.warn('⚠️ Could not read HTML:', htmlPath, err.message);
    }
  }

  // 3) also include images from blog list.json (attach to blog post URLs)
  const blogJsonPath = path.join(process.cwd(), 'src/content/blog/list.json');
  if (fs.existsSync(blogJsonPath)) {
    try {
      const raw = fs.readFileSync(blogJsonPath, 'utf8');
      const posts = JSON.parse(raw);
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

  // 4) build XML grouped by page
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  let totalPages = 0;
  let totalImages = 0;
  for (const [page, images] of pageMap.entries()) {
    // dedupe images for this page
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
      if (it.alt) xml += `      <image:caption><![CDATA[${it.alt}]]></image:caption>\n`;
      xml += `    </image:image>\n`;
      totalImages++;
      // warn if local file not found
      if (!it.localFile) {
        console.warn(`⚠️ Local file not found for ${it.imageUrl} (referenced in ${page})`);
      }
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  // write out
  fs.writeFileSync(OUT_FILE, xml, 'utf8');
  console.log(`✅ Generated ${OUT_FILE} — pages: ${totalPages}, images: ${totalImages}`);
})();
