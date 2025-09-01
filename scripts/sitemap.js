// scripts/sitemap.js
import fs from "fs";
import path from "path";

const siteUrl = "https://astro.myastrology.in";

const listPath = path.join(process.cwd(), "list.json"); // ব্লগ লিস্ট ফাইল
const sitemapPath = path.join(process.cwd(), "sitemap.xml");

const list = JSON.parse(fs.readFileSync(listPath, "utf-8"));

// স্ট্যাটিক পেজগুলো
const staticPages = [
  "",
  "astrology.html",
  "palmistry.html",
  "rashifal.html",
  "video.html",
  "vastu-science.html",
  "gallery.html",
  "about.html",
  "blog.html",
  "blog-list.html"
];

// XML তৈরি
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// স্ট্যাটিক পেজ যোগ করা
staticPages.forEach(page => {
  xml += `  <url>\n    <loc>${siteUrl}/${page}</loc>\n  </url>\n`;
});

// ব্লগ পোস্ট যোগ করা
list.forEach(post => {
  xml += `  <url>\n    <loc>${siteUrl}/blog/${post.slug}.html</loc>\n  </url>\n`;
});

xml += `</urlset>\n`;

fs.writeFileSync(sitemapPath, xml, "utf-8");
console.log("✅ Sitemap generated successfully!");
