const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
const rootDir = process.cwd();

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data } = matter(content);

  const slug = data?.slug || file.replace('.md', '');

  // ✅ FIX: astro.myastrology.in → www.myastrology.in
  const rawImage = data?.image || `/blog/${slug}.webp`;
  const image = rawImage.replace(
    'https://astro.myastrology.in',
    'https://www.myastrology.in'
  );

  return {
    slug,
    title:       data?.title       || 'No Title',
    description: data?.description || '',
    date:        data?.date        || new Date().toISOString().split('T')[0],
    image,
    tags:        data?.tags        || [],
  };
});

// ১. list.json তৈরি
fs.writeFileSync(path.join(blogDir, 'list.json'), JSON.stringify(posts, null, 2));

// ২. Sitemap তৈরি
const baseUrl = 'https://www.myastrology.in';
const urls = posts.map(post => `  <url>
    <loc>${baseUrl}/blog.html?post=${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

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
