const fs = require('fs');
const path = require('path');

// folder ensure করার function
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// scan করা function
function scanFolder(folder, pageUrl) {
  const dir = path.join(process.cwd(), folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => ({
      image: `/${folder}/${f}`,
      alt: f.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      pageUrl
    }));
}

// folders ensure করা
ensureDirSync('src/content/images');
ensureDirSync('src/content/gallery');
ensureDirSync('src/content/assist');
ensureDirSync('src/content/blog');

// scan করা
const images = scanFolder('services/images', '/images.html');
const gallery = scanFolder('services/gallery', '/gallery.html');
const assist = scanFolder('services/assist', '/assist.html');
const blog = scanFolder('services/blog', '/blog.html');

// JSON লিখে দেওয়া
fs.writeFileSync('src/content/images/images.json', JSON.stringify(images, null, 2));
fs.writeFileSync('src/content/gallery/gallery.json', JSON.stringify(gallery, null, 2));
fs.writeFileSync('src/content/assist/assist.json', JSON.stringify(assist, null, 2));
fs.writeFileSync('src/content/blog/list.json', JSON.stringify(blog, null, 2));

console.log('✅ সব JSON fresh তৈরি হয়ে গেছে!');
