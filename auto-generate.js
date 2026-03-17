// auto-generate.js - সিম্পল অটোমেশন
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const BLOG_DIR = path.join(__dirname, 'src/content/blog');
let lastRun = 0;
let timeout = null;

console.log('\n' + '='.repeat(50));
console.log('🔄 Simple Auto-Generator Started');
console.log('='.repeat(50));
console.log(`📁 Watching: ${BLOG_DIR}`);
console.log('='.repeat(50) + '\n');

function runGenerator() {
  const now = Date.now();
  if (now - lastRun < 3000) return; // 3 second debounce
  
  if (timeout) clearTimeout(timeout);
  
  timeout = setTimeout(() => {
    lastRun = Date.now();
    console.log('\n📝 Change detected, regenerating...');
    
    exec('node generate-related-posts.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        return;
      }
      if (stderr) console.error(`⚠️ ${stderr}`);
      console.log(stdout);
      console.log('✅ Generation complete!\n');
    });
  }, 1000);
}

fs.watch(BLOG_DIR, { recursive: true }, (event, filename) => {
  if (filename && filename.endsWith('.md')) {
    runGenerator();
  }
});

console.log('✅ Watcher is running. Press Ctrl+C to stop.\n');

process.on('SIGINT', () => {
  console.log('\n👋 Stopped.');
  process.exit();
});
