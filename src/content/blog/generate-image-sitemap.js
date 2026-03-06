const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'video-sitemap.xml');

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
    // ফরোয়ার্ড স্ল্যাশ বা স্পেস ছাড়া সরাসরি শুরু
    fs.writeFileSync(OUT_FILE, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"></urlset>`);
    return;
  }

  const html = fs.readFileSync(videoPagePath, 'utf8');
  const videos = extractLiteYouTube(html);
  console.log(`📺 Found ${videos.length} videos in video.html`);

  // .trim() ব্যবহার করে নিশ্চিত করা হয়েছে যেন শুরুতে কোনো ফাঁকা লাইন না থাকে
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${BASE_URL}/video.html</loc>`.trim();

  for (const v of videos) {
    xml += `
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/${v.id}/hqdefault.jpg</video:thumbnail_loc>
      <video:title><![CDATA[${v.title}]]></video:title>
      <video:description><![CDATA[${v.title}]]></video:description>
      <video:content_loc>https://www.youtube.com/watch?v=${v.id}</video:content_loc>
      <video:player_loc>https://www.youtube.com/embed/${v.id}</video:player_loc>
    </video:video>`;
  }

  xml += `
  </url>
</urlset>`;

  fs.writeFileSync(OUT_FILE, xml.trim(), 'utf8');
  console.log(`✅ video-sitemap.xml generated successfully with ${videos.length} videos`);
})();
