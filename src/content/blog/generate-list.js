const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Blog folder-এর সঠিক path
const blogDir = path.join(__dirname); // এই ফোল্ডারে সব .md ফাইল থাকলে ঠিক আছে

// Blog ফোল্ডারের সব ফাইল পড়া
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

if (files.length === 0) {
  console.warn('⚠️ কোনো Markdown (.md) ব্লগ পোস্ট পাওয়া যায়নি।');
} else {
  console.log(`ℹ️ ${files.length} টি ব্লগ পোস্ট পাওয়া গেছে।`);
}

// সব post process করা
const posts = files.map(file => {
  const filePath = path.join(blogDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(content);

  return {
    slug: data?.slug || file.replace('.md', ''),
    title: data?.title || 'No Title',
    image: data?.image || '',
    description: data?.description || '',
    date: data?.date || '' // Optional: date থাকলে পরে sorting কাজে লাগবে
  };
});

// date অনুসারে sort করা (নতুন পোস্ট আগে)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// list.json তৈরি করা
const outputPath = path.join(blogDir, 'list.json');
fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));

console.log(`✅ list.json তৈরি হয়েছে: ${outputPath}`);
console.log(`📦 মোট ${posts.length} টি পোস্ট যুক্ত হয়েছে।`);
