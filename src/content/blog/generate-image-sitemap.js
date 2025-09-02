const fs = require('fs');
const path = require('path');

// Base URL
const BASE_URL = 'https://astro.myastrology.in';

// JSON files paths
const jsonFiles = [
  path.join(__dirname, 'list.json'),     // blog
  path.join(__dirname, 'gallery.json'),  // gallery
  path.join(__dirname, 'assist.json'),   // assist
];

// Sitemap output path (root folder)
const imageSitemapPath = path.join(__dirname, '../../image-sitemap.xml');

// Read JSON safely
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

// Collect all items
let allItems = [];
jsonFiles.forEach(file => {
  allItems = allItems.concat(readJSON(file));
});

// Start XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

// Add images
allItems.forEach(item => {
  if (item.image) {
    const pageUrl = item.slug ? `${BASE_URL}/blog.html?post=${item.slug}` : BASE_URL;
    xml += `  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${BASE_URL}${item.image}</image:loc>
      <image:caption>${item.alt || item.title || ''}</image:caption>
    </image:image>
  </url>\n`;
  }
});

// Close XML
xml += `</urlset>`;

// Write sitemap to root folder
fs.writeFileSync(imageSitemapPath, xml, 'utf8');
console.log('✅ image-sitemap.xml তৈরি হয়েছে root folder-এ।');
