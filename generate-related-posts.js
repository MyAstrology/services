'use strict';
const fs = require('fs');
const path = require('path');

const BLOG_LIST_PATH = path.join(__dirname, 'src/content/blog/list.json');
const RELATED_OUTPUT_PATH = path.join(__dirname, 'src/data/related-posts.json');
const INTERNAL_LINKS_OUTPUT_PATH = path.join(__dirname, 'src/data/internal-links.json');

// ট্যাগ similarity calculate করুন
function calculateTagSimilarity(post1, post2) {
  const tags1 = new Set((post1.tags || []).map(t => t.toLowerCase()));
  const tags2 = new Set((post2.tags || []).map(t => t.toLowerCase()));
  
  const intersection = [...tags1].filter(tag => tags2.has(tag)).length;
  const union = new Set([...tags1, ...tags2]).size;
  
  return union === 0 ? 0 : intersection / union;
}

// Date অনুযায়ী relevance বাড়ান
function calculateRelevance(currentPost, candidatePost) {
  const tagSimilarity = calculateTagSimilarity(currentPost, candidatePost);
  const currentDate = new Date(currentPost.date);
  const candidateDate = new Date(candidatePost.date);
  const dateDiff = Math.abs(currentDate - candidateDate);
  const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
  
  const recencyBoost = Math.max(0, 1 - (daysDiff / 365)) * 0.2;
  
  return tagSimilarity + recencyBoost;
}

// Main function
function generateRelatedAndInternalLinks() {
  try {
    const blogList = JSON.parse(fs.readFileSync(BLOG_LIST_PATH, 'utf8'));
    const relatedPosts = {};
    const internalLinks = {};
    
    blogList.forEach((post, index) => {
      const otherPosts = blogList.filter((_, i) => i !== index);
      
      // Top related posts খুঁজুন
      const related = otherPosts
        .map(candidate => ({
          slug: candidate.slug,
          title: candidate.title,
          relevance: calculateRelevance(post, candidate)
        }))
        .filter(r => r.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 4);
      
      relatedPosts[post.slug] = related.map(r => r.slug);
      
      // internal-links structure তৈরি করুন
      internalLinks[post.slug] = {
        relatedByTag: related
          .filter(r => calculateTagSimilarity(post, blogList.find(p => p.slug === r.slug)) > 0.5)
          .map(r => r.slug)
          .slice(0, 3),
        relatedByPillar: related
          .filter(r => calculateTagSimilarity(post, blogList.find(p => p.slug === r.slug)) > 0.3)
          .map(r => r.slug)
          .slice(0, 3),
        manualLinks: []
      };
      
      console.log(`✅ ${post.slug}: ${related.length} related posts found`);
    });
    
    // Ensure directories exist
    const dataDir = path.join(__dirname, 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(RELATED_OUTPUT_PATH, JSON.stringify(relatedPosts, null, 2), 'utf8');
    fs.writeFileSync(INTERNAL_LINKS_OUTPUT_PATH, JSON.stringify(internalLinks, null, 2), 'utf8');
    
    console.log(`\n📝 Related posts database: ${RELATED_OUTPUT_PATH}`);
    console.log(`📝 Internal links database: ${INTERNAL_LINKS_OUTPUT_PATH}`);
    console.log(`✨ Total posts processed: ${Object.keys(relatedPosts).length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateRelatedAndInternalLinks();
