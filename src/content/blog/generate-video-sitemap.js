const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'video-sitemap.xml');
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', '.astro', '.github']);
const SCAN_DIRS = [
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'src'),
];

function walkDir(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(walkDir(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

function extractYouTubeIds(html) {
  const ids = new Set();
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/g,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/g,
  ];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(html))) ids.add(m[1]);
  }
  return [...ids];
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : '';
}

(function main() {
  console.log('🔎 Scanning for YouTube videos...');
  const htmlFiles = SCAN_DIRS.flatMap(dir => walkDir(dir));
  console.log(`📄 Found ${htmlFiles.length} HTML files.`);

  const pageMap = new Map();

  for (const htmlPath of htmlFiles) {
    try {
      const content = fs.readFileSync(htmlPath, 'utf8');
      const ids = extractYouTubeIds(content);
      if (!ids.length) continue;

      const relPath = path.relative(
        path.join(process.cwd(), 'public'), htmlPath
      ).split(path.sep).join('/');

      const pageUrl = relPath.startsWith('..')
        ? `/${path.relative(process.cwd(), htmlPath).split(path.sep).join('/')}`
        : `/${relPath}`;

      const title = extractTitle(content);
      pageMap.set(pageUrl, { ids, title });
    } catch (err) {
      console.warn('⚠️ Skip:', htmlPath, err.message);
    }
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

  let totalPages = 0;
  let totalVideos = 0;

  for (const [page, { ids, title }] of pageMap.entries()) {
    totalPages++;
    xml += `  <url>\n    <loc>${BASE_URL}${page}</loc>\n`;
    for (const id of ids) {
      xml += `    <video:video>\n`;
      xml += `      <video:thumbnail_loc>https://img.youtube.com/vi/${id}/hqdefault.jpg</video:thumbnail_loc>\n`;
      xml += `      <video:title><![CDATA[${title}]]></video:title>\n`;
      xml += `      <video:description><![CDATA[${title}]]></video:description>\n`;
      xml += `      <video:content_loc>https://www.youtube.com/watch?v=${id}</video:content_loc>\n`;
      xml += `      <video:player_loc>https://www.youtube.com/embed/${id}</video:player_loc>\n`;
      xml += `    </video:video>\n`;
      totalVideos++;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  fs.writeFileSync(OUT_FILE, xml, 'utf8');
  console.log(`✅ video-sitemap.xml → pages: ${totalPages}, videos: ${totalVideos}`);
})();
