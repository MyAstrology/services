const fs = require('fs');
const path = require('path');

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

// scan করা ডেটা তৈরি
const images = scanFolder('services/images', '/images.html');
const gallery = scanFolder('services/gallery', '/gallery.html');
const assist = scanFolder('services/assist', '/assist.html');
const blog = scanFolder('services/blog', '/blog.html'); // ⚠️ যদি আসল ফোল্ডার 'blog' হয়

// JSON ফাইল লিখে দেওয়া
fs.writeFileSync('src/content/images/images.json', JSON.stringify(images, null, 2));
fs.writeFileSync('src/content/gallery/gallery.json', JSON.stringify(gallery, null, 2));
fs.writeFileSync('src/content/assist/assist.json', JSON.stringify(assist, null, 2));
fs.writeFileSync('src/content/blog/list.json', JSON.stringify(blog, null, 2));

console.log('✅ images.json, gallery.json, assist.json, blog/list.json fresh তৈরি হয়ে গেছে!');
