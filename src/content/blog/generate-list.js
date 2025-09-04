const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Markdown source ফোল্ডার
const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');

// Markdown ফাইলগুলো filter
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

// সব পোস্ট process করা
const posts = files.map(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data } = matter(content);

  return {
    slug: data?.slug || file.replace('.md', ''),
    title: data?.title || 'No Title',
    image: data?.image || '',
    description: data?.description || ''
  };
});

// ⚠️ Public ফোল্ডারে write করা
const outputPath = path.join(process.cwd(), 'public', 'blog', 'list.json');
fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));

console.log(`✅ list.json generated successfully at ${outputPath}`);
