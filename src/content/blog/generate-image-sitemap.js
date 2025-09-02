const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';

const jsonFiles = [
  { path: path.join(__dirname, 'list.json'), type: 'blog' },
  { path: path.join(__dirname, 'gallery.json'), type: 'gallery' },
  { path: path.join(__dirname, 'assist.json'), type: 'assist' },
];

const imageSitemapPath = path.join(process.cwd(), 'image-sitemap.xml');

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.warn(`⚠️ Could not read JSON from ${filePath}: ${err.message}`);
    return [];
  }
}

let allItems = [];
jsonFiles.forEach(({ path: filePath, type }) => {
  const data = readJSON(filePath);
  // data-তে type যোগ করা
  data.forEach(item => item._type = type);
  allItems = allItems.concat(data);
});

// Remove duplicates based on full image URL
const seenImages = new Set();
allItems = allItems.filter(item => {
  if (!item.image) return false;

  const imageUrl = item.image.startsWith('http')
    ? item.image
    : `${BASE_URL}${item.image}`;

  if (seenImages.has(imageUrl)) return false;
  seenImages.add(imageUrl);
  item._fullImageUrl = imageUrl;
  return true;
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

allItems.forEach(item => {
  let pageUrl = BASE_URL;

  if (item._type === 'blog') {
    pageUrl = `${BASE_URL}/blog.html?post=${item.slug}`;
  } else if (item._type === 'gallery') {
    pageUrl = `${BASE_URL}/gallery.html`;
  } else if (item._type === 'assist') {
    pageUrl = `${BASE_URL}/assist.html`;
  }

  xml += `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${item._fullImageUrl}</image:loc>
      ${item.title || item.alt ? `<image:caption><![CDATA[${item.alt || item.title}]]></image:caption>` : ''}
    </image:image>
  </url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync(imageSitemapPath, xml, 'utf8');
console.log(`✅ image-sitemap.xml তৈরি হয়েছে: ${imageSitemapPath}`);
