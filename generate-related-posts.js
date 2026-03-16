// generate-related-posts.js
const fs = require('fs');
const path = require('path');

const BLOG_LIST_PATH = path.join(__dirname, 'src/content/blog/list.json');
const OUTPUT_PATH = path.join(__dirname, 'src/data/related-posts.json');

// ট্যাগ similarity calculate করুন
function calculateTagSimilarity(post1, post2) {
  const tags1 = new Set(post1.tags.map(t => t.toLowerCase()));
  const tags2 = new Set(post2.tags.map(t => t.toLowerCase()));
  
  const intersection = [...tags1].filter(tag => tags2.has(tag)).length;
  const union = new Set([...tags1, ...tags2]).size;
  
  return intersection / union;
}

// Date অনুযায়ী relevance বাড়ান
function calculateRelevance(currentPost, candidatePost) {
  const tagSimilarity = calculateTagSimilarity(currentPost, candidatePost);
  const dateDiff = Math.abs(new Date(currentPost.date) - new Date(candidatePost.date));
  const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
  
  // সম্প্রতির weight যোগ করুন (কাছাকাছি পোস্টকে অগ্রাধিকার)
  const recencyBoost = Math.max(0, 1 - (daysDiff / 365)) * 0.2;
  
  return tagSimilarity + recencyBoost;
}

// Main function
function generateRelatedPosts() {
  const blogList = JSON.parse(fs.readFileSync(BLOG_LIST_PATH, 'utf8'));
  const relatedPosts = {};
  
  blogList.forEach((post, index) => {
    const otherPosts = blogList.filter((_, i) => i !== index);
    
    // প্রতিটি পোস্টের জন্য top 3-4 related posts খুঁজুন
    const related = otherPosts
      .map(candidate => ({
        slug: candidate.slug,
        title: candidate.title,
        relevance: calculateRelevance(post, candidate)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4); // শীর্ষ 4টি
    
    relatedPosts[post.slug] = related.map(r => r.slug);
    
    console.log(`✅ ${post.slug}: ${related.length} related posts found`);
  });
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(relatedPosts, null, 2), 'utf8');
  console.log(`\n📝 Related posts database created: ${OUTPUT_PATH}`);
}

generateRelatedPosts();
