const fs   = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');

  // Strip any lines before the first '---' (e.g. "💾 ফাইলের নাম:" lines)
  const fmStart = raw.indexOf('---');
  const content = fmStart > 0 ? raw.slice(fmStart) : raw;

  const { data } = matter(content);

  const slug = data?.slug || file.replace('.md', '');

  const rawImage = data?.image || `/blog/${slug}.webp`;

  return {
    slug,
    title:       data?.title       || 'No Title',
    description: data?.description || '',
    date:        data?.date        || new Date().toISOString().split('T')[0],
    image: rawImage,
    tags:        data?.tags        || [],
  };
});

// ✅ list.json তৈরি (date descending — নতুন পোস্ট আগে)
const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(path.join(blogDir, 'list.json'), JSON.stringify(sorted, null, 2));
console.log(`✅ list.json updated — ${sorted.length} posts`);

// ✅ NOTE: sitemap.xml generation এখান থেকে সরানো হয়েছে。
// generate-sitemap.js সম্পূর্ণ sitemap তৈরি করে (static + blog উভয়)।
