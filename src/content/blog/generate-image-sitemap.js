const fs = require('fs');
const path = require('path');

// Blog, Gallery, Assist list paths
const blogListPath = path.join(__dirname, 'list.json');  // blog
const galleryListPath = path.join(__dirname, 'gallery.json');  // gallery
const assistListPath = path.join(__dirname, 'assist.json');  // assist

// Sitemap output path
const imageSitemapPath = path.join(__dirname, '../../image-sitemap.xml');

// Base URL
const BASE_URL = 'https://astro.myastrology.in';

// Function to read JSON safely
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

// Collect all images
const blogList = readJSON(blogListPath);
const galleryList = readJSON(galleryListPath);
const assistList = readJSON(assistListPath);

const allItems = [...blogList, ...galleryList, ...assistList];

// Start XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

// Add images
allItems.forEach(item => {
  if (item.image) {
    xml += `  <url>
    <loc>${BASE_URL}${item.slug ? '/blog.html?post=' + item.slug : '/'}</loc>
    <image:image>
      <image:loc>${BASE_URL}${item.image}</image:loc>
      <image:caption>${item.alt || item.title || ''}</image:caption>
    </image:image>
  </url>\n`;
  }
});

// Close XML
xml += `</urlset>`;

// Write to root
fs.writeFileSync(imageSitemapPath, xml, 'utf8');
console.log('✅ image-sitemap.xml তৈরি হয়েছে।');
