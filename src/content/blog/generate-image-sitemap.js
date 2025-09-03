const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astro.myastrology.in';

// JSON ফাইলগুলো
const jsonFiles = [
  { path: path.join(process.cwd(), 'src/content/blog/list.json'), type: 'blog' },
  { path: path.join(process.cwd(), 'src/content/gallery/gallery.json'), type: 'gallery' },
  { path: path.join(process.cwd(), 'src/content/assist/assist.json'), type: 'assist' },
  { path: path.join(process.cwd(), 'src/content/images/images.json'), type: 'images' },
];

const imageSitemapPath = path.join(process.cwd(), 'image-sitemap.xml');

function readJSON(filePath, type) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    console.log(`📂 Loaded ${data.length} items from ${type}`);
    return data;
  } catch (err) {
    console.warn(`⚠️ Could not read JSON from ${filePath} (${type}): ${err.message}`);
    return [];
  }
}

function ensureAbsUrl(u) {
  if (!u) return '';
  if (u.startsWith('http')) return u;
  return `${BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
}

function toArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v.filter(Boolean) : [v];
}

// collect all items
let allItems = [];
jsonFiles.forEach(({ path: filePath, type }) => {
  const data = readJSON(filePath, type);
  data.forEach(item => item._type = type);
  allItems = allItems.concat(data);
});

// normalize image URLs and drop items without image
allItems = allItems
  .map(item => {
    if (!item.image) {
      console.warn(`⚠️ Missing image field for ${item._type} item:`, item.title || item.slug || item);
      return null;
    }
    item._fullImageUrl = ensureAbsUrl(item.image);
    return item;
  })
  .filter(Boolean);

// start XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

// dedupe by (pageUrl + imageUrl)
const seenPairs = new Set();

allItems.forEach(item => {
  // determine pages this image should be attached to
  let pages = [];

  // explicit pageUrl or pageUrls in JSON (preferred)
  pages = pages.concat(toArray(item.pageUrl));
  pages = pages.concat(toArray(item.pageUrls));

  // blog fallback: if blog and slug provided, attach to blog post URL
  if (!pages.length && item._type === 'blog' && item.slug) {
    pages.push(`/blog.html?post=${item.slug}`);
  }

  if (!pages.length) {
    // আমরা এখন non-blog আইটেমগুলোতে ডিফল্ট পেজ ব্যবহার করব না — স্কিপ করে সতর্কবার্তা দেখাবো
    console.warn(`⏭️ Skipping ${item._type} image because no pageUrl/pageUrls found:`, item._fullImageUrl);
    return;
  }

  pages.forEach(p => {
    const pageAbs = ensureAbsUrl(p);
    const pairKey = `${pageAbs}||${item._fullImageUrl}`;
    if (seenPairs.has(pairKey)) return;
    seenPairs.add(pairKey);

    const caption = item.alt || item.title || '';
    xml += `  <url>
    <loc>${pageAbs}</loc>
    <image:image>
      <image:loc>${item._fullImageUrl}</image:loc>
      ${caption ? `<image:caption><![CDATA[${caption}]]></image:caption>` : ''}
    </image:image>
  </url>\n`;
  });
});

xml += `</urlset>`;

// write file
fs.writeFileSync(imageSitemapPath, xml, 'utf8');
console.log(`✅ image-sitemap.xml তৈরি হয়েছে: ${imageSitemapPath}`);
