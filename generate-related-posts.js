'use strict';
const fs = require('fs');
const path = require('path');

const BLOG_LIST_PATH = path.join(__dirname, 'src/content/blog/list.json');
const RELATED_OUTPUT_PATH = path.join(__dirname, 'src/data/related-posts.json');
const INTERNAL_LINKS_OUTPUT_PATH = path.join(__dirname, 'src/data/internal-links.json');
const CLUSTERS_PATH = path.join(__dirname, 'src/data/clusters.json'); // নতুন

// ১. ট্যাগ সিমিলারিটি (আপনার已有的)
function calculateTagSimilarity(post1, post2) {
  const tags1 = new Set((post1.tags || []).map(t => t.toLowerCase()));
  const tags2 = new Set((post2.tags || []).map(t => t.toLowerCase()));
  
  const intersection = [...tags1].filter(tag => tags2.has(tag)).length;
  const union = new Set([...tags1, ...tags2]).size;
  
  return union === 0 ? 0 : intersection / union;
}

// ২. নতুন: টাইটেল সিমিলারিটি
function calculateTitleSimilarity(title1, title2) {
  if (!title1 || !title2) return 0;
  
  const words1 = new Set(title1.toLowerCase().split(/\s+/));
  const words2 = new Set(title2.toLowerCase().split(/\s+/));
  
  // সাধারণ শব্দ বাদ দিন (stop words)
  const stopWords = new Set(['এর', 'তে', 'কে', 'ও', 'এবং', 'বা', 'করে', 'হয়ে']);
  const filtered1 = [...words1].filter(w => !stopWords.has(w) && w.length > 2);
  const filtered2 = [...words2].filter(w => !stopWords.has(w) && w.length > 2);
  
  const intersection = filtered1.filter(w => filtered2.includes(w)).length;
  const union = new Set([...filtered1, ...filtered2]).size;
  
  return union === 0 ? 0 : intersection / union;
}

// ৩. নতুন: ক্লাস্টার সিমিলারিটি
function calculateClusterSimilarity(post1, post2, clusters) {
  if (!clusters || !post1.cluster || !post2.cluster) return 0;
  
  // একই ক্লাস্টার হলে বেশি স্কোর
  if (post1.cluster === post2.cluster) return 0.5;
  
  // সম্পর্কিত ক্লাস্টার চেক করুন
  const cluster1 = clusters.find(c => c.name === post1.cluster);
  const cluster2 = clusters.find(c => c.name === post2.cluster);
  
  if (cluster1 && cluster2) {
    // যদি একই মূল বিষয় হয় (যেমন: হস্তরেখার সব উপবিভাগ)
    if (cluster1.parent === cluster2.parent) return 0.3;
  }
  
  return 0;
}

// ৪. নতুন: কন্টেন্ট লেংথ সিমিলারি
function calculateContentLengthSimilarity(post1, post2) {
  const len1 = post1.contentLength || 1000;
  const len2 = post2.contentLength || 1000;
  
  const ratio = Math.min(len1, len2) / Math.max(len1, len2);
  return ratio * 0.1; // 10% weight
}

// ৫. আপডেটেড রেলেভেন্স ক্যালকুলেশন
function calculateRelevance(currentPost, candidatePost, clusters) {
  const tagSim = calculateTagSimilarity(currentPost, candidatePost);
  const titleSim = calculateTitleSimilarity(currentPost.title, candidatePost.title);
  const clusterSim = calculateClusterSimilarity(currentPost, candidatePost, clusters);
  const lengthSim = calculateContentLengthSimilarity(currentPost, candidatePost);
  
  // ডেট বুস্ট
  const currentDate = new Date(currentPost.date);
  const candidateDate = new Date(candidatePost.date);
  const dateDiff = Math.abs(currentDate - candidateDate);
  const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
  const recencyBoost = Math.max(0, 1 - (daysDiff / 365)) * 0.15;
  
  // ওয়েটেড স্কোর
  const totalScore = 
    (tagSim * 0.4) +      // 40% ট্যাগ
    (titleSim * 0.25) +    // 25% টাইটেল
    (clusterSim * 0.2) +    // 20% ক্লাস্টার
    (lengthSim * 0.1) +     // 10% কন্টেন্ট লেংথ
    recencyBoost;           // 15% পর্যন্ত বুস্ট
  
  return totalScore;
}

// ৬. মেইন ফাংশন আপডেট
function generateRelatedAndInternalLinks() {
  try {
    // ব্লগ লিস্ট পড়ুন
    const blogList = JSON.parse(fs.readFileSync(BLOG_LIST_PATH, 'utf8'));
    
    // ক্লাস্টার পড়ুন (যদি থাকে)
    let clusters = [];
    if (fs.existsSync(CLUSTERS_PATH)) {
      clusters = JSON.parse(fs.readFileSync(CLUSTERS_PATH, 'utf8')).clusters || [];
    }
    
    const relatedPosts = {};
    const internalLinks = {};
    
    // প্রতিটি পোস্টের জন্য
    blogList.forEach((post, index) => {
      const otherPosts = blogList.filter((_, i) => i !== index);
      
      // রেলেভেন্ট পোস্ট খুঁজুন
      const related = otherPosts
        .map(candidate => ({
          slug: candidate.slug,
          title: candidate.title,
          cluster: candidate.cluster,
          relevance: calculateRelevance(post, candidate, clusters)
        }))
        .filter(r => r.relevance > 0.1) // মিনিমাম থ্রেশহোল্ড
        .sort((a, b) => b.relevance - a.relevance);
      
      // টপ ৬ রিলেটেড পোস্ট
      const topRelated = related.slice(0, 6);
      relatedPosts[post.slug] = topRelated.map(r => r.slug);
      
      // স্ট্রংলি রিলেটেড (ট্যাগ বা ক্লাস্টার ভিত্তিক)
      const stronglyRelated = topRelated
        .filter(r => r.relevance > 0.5)
        .map(r => r.slug);
      
      // মিডলি রিলেটেড
      const midRelated = topRelated
        .filter(r => r.relevance > 0.3 && r.relevance <= 0.5)
        .map(r => r.slug);
      
      internalLinks[post.slug] = {
        relatedByTag: stronglyRelated.slice(0, 4),
        relatedByPillar: midRelated.slice(0, 3),
        relatedByCluster: topRelated
          .filter(r => r.cluster === post.cluster)
          .map(r => r.slug)
          .slice(0, 3),
        manualLinks: []
      };
      
      console.log(`✅ ${post.slug}:`);
      console.log(`   - Strongly related: ${stronglyRelated.length}`);
      console.log(`   - Mid related: ${midRelated.length}`);
      console.log(`   - Top relevance: ${topRelated[0]?.relevance.toFixed(2) || 0}`);
    });
    
    // JSON ফাইল সেভ করুন
    fs.writeFileSync(RELATED_OUTPUT_PATH, JSON.stringify(relatedPosts, null, 2), 'utf8');
    fs.writeFileSync(INTERNAL_LINKS_OUTPUT_PATH, JSON.stringify(internalLinks, null, 2), 'utf8');
    
    // রিপোর্ট
    console.log('\n' + '='.repeat(50));
    console.log('📊 জেনারেশন রিপোর্ট');
    console.log('='.repeat(50));
    console.log(`📝 মোট পোস্ট: ${Object.keys(relatedPosts).length}`);
    console.log(`📁 related-posts.json: ${RELATED_OUTPUT_PATH}`);
    console.log(`📁 internal-links.json: ${INTERNAL_LINKS_OUTPUT_PATH}`);
    
    // স্ট্যাটিস্টিক্স
    const totalLinks = Object.values(internalLinks).reduce((acc, post) => {
      return acc + 
        (post.relatedByTag?.length || 0) + 
        (post.relatedByPillar?.length || 0) + 
        (post.relatedByCluster?.length || 0);
    }, 0);
    
    console.log(`🔗 মোট জেনারেটেড লিংক: ${totalLinks}`);
    console.log(`📈 গড় লিংক প্রতি পোস্ট: ${(totalLinks / Object.keys(internalLinks).length).toFixed(1)}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// স্ক্রিপ্ট রান করুন
generateRelatedAndInternalLinks();

// ৭. নতুন: ভ্যালিডেশন ফাংশন
function validateInternalLinks() {
  const internalLinks = JSON.parse(fs.readFileSync(INTERNAL_LINKS_OUTPUT_PATH, 'utf8'));
  const blogList = JSON.parse(fs.readFileSync(BLOG_LIST_PATH, 'utf8'));
  const validSlugs = new Set(blogList.map(p => p.slug));
  
  let invalidCount = 0;
  
  Object.entries(internalLinks).forEach(([slug, links]) => {
    const allLinks = [
      ...(links.relatedByTag || []),
      ...(links.relatedByPillar || []),
      ...(links.relatedByCluster || [])
    ];
    
    allLinks.forEach(link => {
      if (!validSlugs.has(link)) {
        console.warn(`⚠️ Invalid slug found: ${link} in ${slug}`);
        invalidCount++;
      }
    });
  });
  
  if (invalidCount === 0) {
    console.log('✅ All internal links are valid!');
  }
}
