const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(__dirname);
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data } = matter(content);

  return {
    slug: data.slug || file.replace('.md',''),
    title: data.title || 'No Title',
    image: data.image || '',
    description: data.description || ''
  };
});

fs.writeFileSync(path.join(blogDir, 'list.json'), JSON.stringify(posts, null, 2));
console.log('✅ list.json generated successfully!');
