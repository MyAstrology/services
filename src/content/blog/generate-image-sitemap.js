Const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'image-sitemap.xml');

const IMAGE_DIRS = [
  'images',
  'assist',
  'blog',
  'gallery'
];

const SCAN_HTML_DIRS = [
  process.cwd(),
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'src')
];

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.astro', 'dist', '.github'
]);

const IMAGE_EXT = ['.jpg','.jpeg','.png','.webp','.gif','.avif'];

function walkDir(dir){
  let results = [];
  if(!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir,{withFileTypes:true});

  for(const entry of list){

    if(IGNORE_DIRS.has(entry.name)) continue;

    const full = path.join(dir,entry.name);

    if(entry.isDirectory()){
      results = results.concat(walkDir(full));
    }
    else{
      results.push(full);
    }

  }

  return results;
}

function extractImagesFromHtml(content){

  const imgs = [];

  const regex = /<img[^>]+src=["']([^"']+)["']/gi;

  let match;

  while((match = regex.exec(content))){

    imgs.push(match[1]);

  }

  return imgs;
}

function ensureAbs(url){

  if(/^https?:\/\//i.test(url)) return url;

  if(url.startsWith('/')) return BASE_URL + url;

  return BASE_URL + '/' + url;

}

function escapeXml(str){

  return str
  .replace(/&/g,'&amp;')
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

}

function scanHtmlImages(){

  const images = new Set();

  for(const dir of SCAN_HTML_DIRS){

    const files = walkDir(dir).filter(f=>f.endsWith('.html'));

    for(const file of files){

      const content = fs.readFileSync(file,'utf8');

      const found = extractImagesFromHtml(content);

      found.forEach(i=>images.add(ensureAbs(i)));

    }

  }

  return images;

}

function scanImageFolders(){

  const images = new Set();

  for(const dir of IMAGE_DIRS){

    const fullDir = path.join(process.cwd(),dir);

    if(!fs.existsSync(fullDir)) continue;

    const files = walkDir(fullDir);

    for(const f of files){

      const ext = path.extname(f).toLowerCase();

      if(IMAGE_EXT.includes(ext)){

        const rel = path.relative(process.cwd(),f).split(path.sep).join('/');

        images.add(BASE_URL + '/' + rel);

      }

    }

  }

  return images;

}

function generateXml(images){

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  xml += `<url>\n`;
  xml += `<loc>${BASE_URL}</loc>\n`;

  images.forEach(img=>{

    xml += `<image:image>\n`;
    xml += `<image:loc>${escapeXml(img)}</image:loc>\n`;
    xml += `</image:image>\n`;

  });

  xml += `</url>\n`;

  xml += `</urlset>`;

  return xml;

}

(function(){

  console.log("Scanning HTML images...");

  const htmlImages = scanHtmlImages();

  console.log("Scanning image folders...");

  const folderImages = scanImageFolders();

  const allImages = new Set([...htmlImages,...folderImages]);

  console.log("Total Images:",allImages.size);

  const xml = generateXml(allImages);

  fs.writeFileSync(OUT_FILE,xml,'utf8');

  console.log("image-sitemap.xml generated");

})();const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.myastrology.in';
const OUT_FILE = path.join(process.cwd(), 'image-sitemap.xml');

const IMAGE_DIRS = [
  'images',
  'assist',
  'blog',
  'gallery'
];

const SCAN_HTML_DIRS = [
  process.cwd(),
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'src')
];

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.astro', 'dist', '.github'
]);

const IMAGE_EXT = ['.jpg','.jpeg','.png','.webp','.gif','.avif'];

function walkDir(dir){
  let results = [];
  if(!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir,{withFileTypes:true});

  for(const entry of list){

    if(IGNORE_DIRS.has(entry.name)) continue;

    const full = path.join(dir,entry.name);

    if(entry.isDirectory()){
      results = results.concat(walkDir(full));
    }
    else{
      results.push(full);
    }

  }

  return results;
}

function extractImagesFromHtml(content){

  const imgs = [];

  const regex = /<img[^>]+src=["']([^"']+)["']/gi;

  let match;

  while((match = regex.exec(content))){

    imgs.push(match[1]);

  }

  return imgs;
}

function ensureAbs(url){

  if(/^https?:\/\//i.test(url)) return url;

  if(url.startsWith('/')) return BASE_URL + url;

  return BASE_URL + '/' + url;

}

function escapeXml(str){

  return str
  .replace(/&/g,'&amp;')
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;');

}

function scanHtmlImages(){

  const images = new Set();

  for(const dir of SCAN_HTML_DIRS){

    const files = walkDir(dir).filter(f=>f.endsWith('.html'));

    for(const file of files){

      const content = fs.readFileSync(file,'utf8');

      const found = extractImagesFromHtml(content);

      found.forEach(i=>images.add(ensureAbs(i)));

    }

  }

  return images;

}

function scanImageFolders(){

  const images = new Set();

  for(const dir of IMAGE_DIRS){

    const fullDir = path.join(process.cwd(),dir);

    if(!fs.existsSync(fullDir)) continue;

    const files = walkDir(fullDir);

    for(const f of files){

      const ext = path.extname(f).toLowerCase();

      if(IMAGE_EXT.includes(ext)){

        const rel = path.relative(process.cwd(),f).split(path.sep).join('/');

        images.add(BASE_URL + '/' + rel);

      }

    }

  }

  return images;

}

function generateXml(images){

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  xml += `<url>\n`;
  xml += `<loc>${BASE_URL}</loc>\n`;

  images.forEach(img=>{

    xml += `<image:image>\n`;
    xml += `<image:loc>${escapeXml(img)}</image:loc>\n`;
    xml += `</image:image>\n`;

  });

  xml += `</url>\n`;

  xml += `</urlset>`;

  return xml;

}

(function(){

  console.log("Scanning HTML images...");

  const htmlImages = scanHtmlImages();

  console.log("Scanning image folders...");

  const folderImages = scanImageFolders();

  const allImages = new Set([...htmlImages,...folderImages]);

  console.log("Total Images:",allImages.size);

  const xml = generateXml(allImages);

  fs.writeFileSync(OUT_FILE,xml,'utf8');

  console.log("image-sitemap.xml generated");

})();
