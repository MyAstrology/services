const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'public', 'video-sitemap.xml');

function extractLiteYouTube(html) {
  const videos = [];
  const regex = /<lite-youtube\s+[^>]*videoid="([a-zA-Z0-9_-]{11})"[^>]*playlabel="([^"]*)"[^>]*>/gi;
  let m;
  while ((m = regex.exec(html))) {
    videos.push({ id: m[1], title: m[2] });
  }
  return videos;
}

(function main() {
  const videoPagePath = path.join(process.cwd(), 'video.html');

  if (!fs.existsSync(videoPagePath)) {
    console.warn('⚠️ video.html not found');
    fs.writeFileSync(OUT_FILE, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"></urlset>`);
    return;
  }

  const html = fs.readFileSync(videoPagePath, 'utf8');
  const videos = extractLiteYouTube(html);
  console.log(`📺 Found ${videos.length} videos in video.html`);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/video.html</loc>\n`;

  for (const v of videos) {
    xml += `    <video:video>\n`;
    xml += `      <video:thumbnail_loc>https://img.youtube.com/vi/${v.id}/hqdefault.jpg</video:thumbnail_loc>\n`;
    xml += `      <video:title><![CDATA[${v.title}]]></video:title>\n`;
    xml += `      <video:description><![CDATA[${v.title}]]></video:description>\n`;
    xml += `      <video:content_loc>https://www.youtube.com/watch?v=${v.id}</video:content_loc>\n`;
    xml += `      <video:player_loc>https://www.youtube.com/embed/${v.id}</video:player_loc>\n`;
    xml += `    </video:video>\n`;
  }

  xml += `  </url>\n`;
  xml += `</urlset>\n`;

  fs.writeFileSync(OUT_FILE, xml, 'utf8');
  console.log(`✅ public/video-sitemap.xml → ${videos.length} videos`);
})();
