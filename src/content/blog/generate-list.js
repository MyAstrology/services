const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Markdown ফাইল যেখানে আছে সেই folder path
const blogDir = path.join(__dirname); // যদি 'generate-list.js' এই folder-এ থাকে
// const blogDir = path.join(__dirname, 'src/content/blog'); // যদি workflow থেকে relative path লাগে

// Markdown ফাইল filter
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

// সব post process করা
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

// JSON file লিখা
fs.writeFileSync(path.join(blogDir, 'list.json'), JSON.stringify(posts, null, 2));
console.log('✅ list.json generated successfully!');
