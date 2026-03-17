// watch.js - সম্পূর্ণ অটোমেশন
const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🔍 MyAstrology Auto-Watcher Started');
console.log('='.repeat(60));
console.log('📁 Watching for changes in:');
console.log('   - src/content/blog/**/*.md');
console.log('   - src/content/blog/list.json');
console.log('   - generate-related-posts.js');
console.log('   - generate-posts.js');
console.log('='.repeat(60) + '\n');

let timeout;
let isRunning = false;

const runGenerator = (type) => {
  if (isRunning) {
    console.log('⏳ Generator already running, skipping...');
    return;
  }
  
  if (timeout) clearTimeout(timeout);
  
  timeout = setTimeout(() => {
    isRunning = true;
    console.log(`\n🔄 ${type} detected - regenerating...`);
    
    const startTime = Date.now();
    
    exec('npm run generate-all', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        isRunning = false;
        return;
      }
      if (stderr) console.error(`⚠️ ${stderr}`);
      
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(stdout);
      console.log(`✅ Regeneration complete! (${timeTaken}s)\n`);
      isRunning = false;
    });
  }, 1000); // Wait 1 second after last change
};

// Watch for changes
const watcher = chokidar.watch([
  path.join(__dirname, 'src/content/blog/**/*.md'),
  path.join(__dirname, 'src/content/blog/list.json'),
  path.join(__dirname, 'generate-related-posts.js'),
  path.join(__dirname, 'generate-posts.js')
], {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('add', path => {
    console.log(`📄 + ${path.split('/').pop()}`);
    runGenerator('New file');
  })
  .on('change', path => {
    console.log(`✏️ ~ ${path.split('/').pop()}`);
    runGenerator('Change');
  })
  .on('unlink', path => {
    console.log(`❌ - ${path.split('/').pop()}`);
    runGenerator('Deletion');
  });

console.log('✅ Watcher is active. Press Ctrl+C to stop.\n');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Watcher stopped.');
  process.exit();
});
