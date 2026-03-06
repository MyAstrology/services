// ... আগের সব ফাংশন (walkDir, extractImagesFromHtml, etc.) একই থাকবে ...

function generateXml(images){
  // ১ নম্বর লাইনের একদম শুরু থেকে কোড শুরু করা হয়েছে এবং .trim() যোগ করা হয়েছে
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<url>
<loc>${BASE_URL}/</loc>`.trim(); // ডুপ্লিকেট ইউআরএল এড়াতে '/' যোগ করা হয়েছে

  images.forEach(img=>{
    xml += `
<image:image>
<image:loc>${escapeXml(img)}</image:loc>
</image:image>`;
  });

  xml += `
</url>
</urlset>`;

  return xml.trim(); // একদম নিশ্চিত হতে আবারও trim() ব্যবহার
}

(function(){
  console.log("Scanning HTML images...");
  const htmlImages = scanHtmlImages();

  console.log("Scanning image folders...");
  const folderImages = scanImageFolders();

  const allImages = new Set([...htmlImages,...folderImages]);
  console.log("Total Images:",allImages.size);

  const xml = generateXml(allImages);

  // 'utf8' মোডে ফাইলটি সেভ করা হচ্ছে
  fs.writeFileSync(OUT_FILE, xml, 'utf8');

  console.log("✅ image-sitemap.xml generated without leading spaces");
})();
