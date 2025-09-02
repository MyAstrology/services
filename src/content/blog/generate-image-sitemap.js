const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';

// JSON ফাইলগুলোর absolute path
const jsonFiles = [
  { path: path.join(process.cwd(), 'src/content/blog/list.json'), type: 'blog' },
  { path: path.join(process.cwd(), 'src/content/gallery/gallery.json'), type: 'gallery' },
  { path: path.join(process.cwd(), 'src/content/assist/assist.json'), type: 'assist' },
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

// সব আইটেম একসাথে collect করা
let allItems = [];
jsonFiles.forEach(({ path: filePath, type }) => {
  const data = readJSON(filePath);
  data.forEach(item => item._type = type);
  allItems = allItems.concat(data);
});

// Duplicate images remove করা
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

// XML শুরু
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

// প্রতিটি item যোগ করা
allItems.forEach(item => {
  let pageUrl = BASE_URL;

  if (item._type === 'blog') pageUrl = `${BASE_URL}/blog.html?post=${item.slug}`;
  else if (item._type === 'gallery') pageUrl = `${BASE_URL}/gallery.html`;
  else if (item._type === 'assist') pageUrl = `${BASE_URL}/assist.html`;

  xml += `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${item._fullImageUrl}</image:loc>
      ${item.title || item.alt ? `<image:caption><![CDATA[${item.alt || item.title}]]></image:caption>` : ''}
    </image:image>
  </url>\n`;
});

// XML close
xml += `</urlset>`;

// Write to file
fs.writeFileSync(imageSitemapPath, xml, 'utf8');
console.log(`✅ image-sitemap.xml তৈরি হয়েছে: ${imageSitemapPath}`);
