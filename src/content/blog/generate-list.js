const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let html = '';

files.forEach(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data } = matter(content);
  const slug = data?.slug || file.replace('.md','');
  const title = data?.title || 'No Title';
  const description = data?.description || '';
  const image = data?.image || '';

  html += `
    <a href="blog.html?post=${slug}" class="blog-card">
      <img src="${image}" alt="${title}">
      <div class="content">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
    </a>
  `;
});

const outputPath = path.join(process.cwd(), 'public', 'blog-container.html');
fs.writeFileSync(outputPath, html);
console.log('✅ Static blog HTML generated successfully');
