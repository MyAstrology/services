const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
const rootDir = process.cwd(); // সitemap মূল ডিরেক্টরিতে সেভ করার জন্য

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data } = matter(content);
  return {
    slug: data?.slug || file.replace('.md', ''),
    title: data?.title || 'No Title',
    date: data?.date || new Date().toISOString().split('T')[0] // তারিখের জন্য
  };
});

// ১. list.json তৈরি
fs.writeFileSync(path.join(blogDir, 'list.json'), JSON.stringify(posts, null, 2));

// ২. সitemap তৈরি (বাড়তি স্পেস ছাড়া)
const baseUrl = 'https://www.myastrology.in';
const urls = posts.map(post => `  <url>
    <loc>${baseUrl}/blog.html?post=${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

// একদম শুরু থেকে কোড শুরু হচ্ছে (কোনো এন্টার বা স্পেস নেই)
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${urls}
</urlset>`.trim();

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapContent);
console.log('✅ list.json and sitemap.xml updated successfully!');
