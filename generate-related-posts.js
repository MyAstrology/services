'use strict';
const fs = require('fs');
const path = require('path');

// ============================================
// কনফিগারেশন
// ============================================
const CONFIG = {
  BLOG_LIST_PATH: path.join(__dirname, 'src/content/blog/list.json'),
  RELATED_OUTPUT_PATH: path.join(__dirname, 'src/data/related-posts.json'),
  INTERNAL_LINKS_OUTPUT_PATH: path.join(__dirname, 'src/data/internal-links.json'),
  CLUSTER_OUTPUT_PATH: path.join(__dirname, 'src/data/clusters.json'),
  STATS_OUTPUT_PATH: path.join(__dirname, 'src/data/stats.json'),
  
  THRESHOLDS: {
    MIN_RELEVANCE: 0.15,
    STRONG_RELEVANCE: 0.4,
    MEDIUM_RELEVANCE: 0.25,
    MAX_RELATED_POSTS: 8,
    MAX_TAG_LINKS: 4,
    MAX_PILLAR_LINKS: 3,
    MAX_CLUSTER_LINKS: 3
  },
  
  WEIGHTS: {
    TAG: 0.35,
    TITLE: 0.20,
    DESCRIPTION: 0.15,
    CLUSTER: 0.20,
    RECENCY: 0.10
  }
};

// ============================================
// ক্লাস্টার ম্যাপিং
// ============================================
const CLUSTER_KEYWORDS = {
  'হস্তরেখা': {
    keywords: ['হস্তরেখা', 'হাতের রেখা', 'জীবনরেখা', 'হাতের চিহ্ন', 'স্টার চিহ্ন', 'ক্রস চিহ্ন', 'সামুদ্রিক শাস্ত্র', 'হস্তরেখা বিচার', 'পামিস্ট্রি', 'হাত দেখা', 'রেখা বিচার', 'হাতের রেখা বিচার'],
    weight: 1.0,
    parent: 'শারীরিক জ্যোতিষ'
  },
  'জ্যোতিষ': {
    keywords: ['জ্যোতিষ', 'গ্রহ', 'মঙ্গল', 'শনি', 'বৃহস্পতি', 'রাহু', 'কেতু', 'কুণ্ডলী', 'জন্মকুণ্ডলী', 'কুণ্ডলী মিলন', 'যোটোক', 'দোষ', 'মাঙ্গলিক', 'পিতৃদোষ', 'কালসর্প', 'গ্রহদশা', 'গ্রহের প্রভাব'],
    weight: 1.0,
    parent: 'শারীরিক জ্যোতিষ'
  },
  'জীবন দর্শন': {
    keywords: ['জীবন দর্শন', 'দর্শন', 'জীবনের অর্থ', 'আত্মউন্নয়ন', 'আত্মসচেতনতা', 'মানসিক শান্তি', 'সুখ', 'দুঃখ', 'কর্ম', 'ভাগ্য', 'নিয়তি', 'স্বাধীন ইচ্ছা', 'গীতা', 'বুদ্ধ', 'ধ্যান'],
    weight: 1.0,
    parent: 'আধ্যাত্মিক'
  },
  'সাফল্য': {
    keywords: ['সফলতা', 'সাফল্য', 'ব্যর্থতা', 'ক্যারিয়ার', 'পেশা', 'চাকরি', 'ব্যবসা', 'উন্নতি', 'অগ্রগতি', 'লক্ষ্য', 'উদ্দেশ্য'],
    weight: 0.9,
    parent: 'ব্যবহারিক জীবন'
  },
  'সম্পর্ক': {
    keywords: ['সম্পর্ক', 'প্রেম', 'বিয়ে', 'পরিবার', 'রাগ', 'ক্রোধ', 'ভালোবাসা', 'দাম্পত্য', 'স্বামী-স্ত্রী', 'বিবাহ', 'যোটোক'],
    weight: 0.9,
    parent: 'ব্যবহারিক জীবন'
  },
  'গল্প': {
    keywords: ['গল্প', 'জীবনী', 'জীবনসংগ্রাম', 'সত্য গল্প', 'অনুপ্রেরণা', 'উদাহরণ', 'কাহিনী', 'বাস্তব ঘটনা'],
    weight: 0.8,
    parent: 'সাহিত্য'
  },
  'বিজ্ঞান': {
    keywords: ['বিজ্ঞান', 'বৈজ্ঞানিক', 'গবেষণা', 'তত্ত্ব', 'প্রমাণ', 'যুক্তি', 'পরীক্ষা', 'নিউরোসায়েন্স', 'মস্তিষ্ক'],
    weight: 0.8,
    parent: 'শিক্ষা'
  }
};

// ============================================
// টেক্সট ক্লিনিং
// ============================================
function cleanText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\u0980-\u09FF\u0041-\u005A\u0061-\u007A\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// ক্লাস্টার ডিটেকশন (ইম্প্রুভড)
// ============================================
function detectCluster(tags, title, description) {
  // যদি tags না থাকে, তাহলে ফাঁকা অ্যারে
  const safeTags = tags || [];
  
  // বিশ্লেষণের জন্য টেক্সট তৈরি
  const textForAnalysis = [
    ...safeTags.map(t => String(t).toLowerCase()),
    cleanText(title || ''),
    cleanText(description || '')
  ].join(' ').toLowerCase();
  
  const clusterScores = {};
  
  // প্রতিটি ক্লাস্টারের জন্য স্কোর ক্যালকুলেট
  for (const [cluster, data] of Object.entries(CLUSTER_KEYWORDS)) {
    let score = 0;
    let matches = 0;
    
    data.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      // কতবার ম্যাচ করেছে?
      let count = 0;
      let pos = -1;
      while ((pos = textForAnalysis.indexOf(keywordLower, pos + 1)) !== -1) {
        count++;
      }
      
      if (count > 0) {
        matches += count;
        score += count * data.weight;
      }
    });
    
    if (matches > 0) {
      clusterScores[cluster] = {
        score: score,
        matches: matches,
        parent: data.parent
      };
    }
  }
  
  // ডিফল্ট মান
  let bestCluster = 'অন্যান্য';
  let bestScore = 0;
  let bestParent = 'অন্যান্য';
  
  // সর্বোচ্চ স্কোরের ক্লাস্টার খুঁজুন
  for (const [cluster, data] of Object.entries(clusterScores)) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestCluster = cluster;
      bestParent = data.parent;
    }
  }
  
  // কনফিডেন্স ক্যালকুলেশন (০-১ এর মধ্যে)
  const confidence = bestScore > 0 ? Math.min(1, bestScore / 5) : 0;
  
  return {
    cluster: bestCluster,
    parent: bestParent,
    confidence: confidence,
    allScores: clusterScores
  };
}

// ============================================
// ট্যাগ সিমিলারিটি
// ============================================
function calculateTagSimilarity(tags1, tags2) {
  const safeTags1 = tags1 || [];
  const safeTags2 = tags2 || [];
  
  if (safeTags1.length === 0 || safeTags2.length === 0) return 0;
  
  const set1 = new Set(safeTags1.map(t => String(t).toLowerCase()));
  const set2 = new Set(safeTags2.map(t => String(t).toLowerCase()));
  
  const intersection = [...set1].filter(tag => set2.has(tag)).length;
  const union = new Set([...set1, ...set2]).size;
  
  return union === 0 ? 0 : intersection / union;
}

// ============================================
// টাইটেল ও ডেসক্রিপশন সিমিলারিটি
// ============================================
function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const words1 = new Set(cleanText(text1).split(/\s+/).filter(w => w.length > 1));
  const words2 = new Set(cleanText(text2).split(/\s+/).filter(w => w.length > 1));
  
  const stopWords = new Set(['এই', 'ওই', 'সেই', 'কোন', 'কিছু', 'জন্য', 'কাছে', 'পরে', 'আগে', 'থেকে', 'দিয়ে', 'করে', 'হয়ে', 'এবং', 'অথবা', 'কিন্তু', 'তবে']);
  
  const filtered1 = [...words1].filter(w => !stopWords.has(w));
  const filtered2 = [...words2].filter(w => !stopWords.has(w));
  
  if (filtered1.length === 0 || filtered2.length === 0) return 0;
  
  const intersection = filtered1.filter(w => filtered2.includes(w)).length;
  const union = new Set([...filtered1, ...filtered2]).size;
  
  return intersection / union;
}

// ============================================
// ক্লাস্টার সিমিলারিটি
// ============================================
function calculateClusterSimilarity(cluster1, cluster2) {
  if (!cluster1 || !cluster2) return 0;
  if (cluster1.cluster === cluster2.cluster) return 1.0;
  if (cluster1.parent === cluster2.parent) return 0.6;
  return 0;
}

// ============================================
// রিসেন্সি স্কোর
// ============================================
function calculateRecencyScore(date1, date2) {
  try {
    if (!date1 || !date2) return 0;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1) || isNaN(d2)) return 0;
    
    const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - (diffDays / 180));
  } catch (e) {
    return 0;
  }
}

// ============================================
// কম্প্রিহেনসিভ রেলেভেন্স
// ============================================
function calculateRelevance(post1, post2) {
  // ট্যাগ সিমিলারিটি
  const tagSim = calculateTagSimilarity(post1.tags, post2.tags);
  
  // টাইটেল সিমিলারিটি
  const titleSim = calculateTextSimilarity(post1.title, post2.title);
  
  // ডেসক্রিপশন সিমিলারিটি
  const descSim = calculateTextSimilarity(post1.description, post2.description);
  
  // ক্লাস্টার সিমিলারিটি
  const cluster1 = detectCluster(post1.tags, post1.title, post1.description);
  const cluster2 = detectCluster(post2.tags, post2.title, post2.description);
  const clusterSim = calculateClusterSimilarity(cluster1, cluster2);
  
  // রিসেন্সি স্কোর
  const recencyScore = calculateRecencyScore(post1.date, post2.date);
  
  // টোটাল স্কোর
  const totalScore = 
    (tagSim * CONFIG.WEIGHTS.TAG) +
    (titleSim * CONFIG.WEIGHTS.TITLE) +
    (descSim * CONFIG.WEIGHTS.DESCRIPTION) +
    (clusterSim * CONFIG.WEIGHTS.CLUSTER) +
    (recencyScore * CONFIG.WEIGHTS.RECENCY);
  
  return {
    score: Math.min(1, totalScore),
    components: {
      tag: tagSim,
      title: titleSim,
      description: descSim,
      cluster: clusterSim,
      recency: recencyScore
    }
  };
}

// ============================================
// স্ট্যাটিস্টিক্স জেনারেট
// ============================================
function generateStatistics(blogList, internalLinks, clusterData) {
  const stats = {
    totalPosts: blogList.length,
    clusters: {},
    parentClusters: {},
    tagsFrequency: {},
    avgLinksPerPost: 0,
    totalLinks: 0,
    postsWithNoLinks: 0,
    generatedAt: new Date().toISOString()
  };
  
  // ক্লাস্টার কাউন্ট
  Object.values(clusterData).forEach(data => {
    stats.clusters[data.cluster] = (stats.clusters[data.cluster] || 0) + 1;
    stats.parentClusters[data.parent] = (stats.parentClusters[data.parent] || 0) + 1;
  });
  
  // ট্যাগ ফ্রিকোয়েন্সি
  blogList.forEach(post => {
    (post.tags || []).forEach(tag => {
      stats.tagsFrequency[tag] = (stats.tagsFrequency[tag] || 0) + 1;
    });
  });
  
  // লিংক স্ট্যাটিস্টিক্স
  Object.values(internalLinks).forEach(links => {
    const linksCount = 
      (links.relatedByTag?.length || 0) + 
      (links.relatedByPillar?.length || 0) + 
      (links.relatedByCluster?.length || 0);
    
    stats.totalLinks += linksCount;
    if (linksCount === 0) stats.postsWithNoLinks++;
  });
  
  stats.avgLinksPerPost = blogList.length > 0 ? (stats.totalLinks / blogList.length).toFixed(2) : 0;
  
  return stats;
}

// ============================================
// মেইন ফাংশন
// ============================================
function generateAll() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 MyAstrology অ্যাডভান্সড রিলেটেড পোস্ট জেনারেটর v2.0');
  console.log('='.repeat(70));
  
  try {
    // ব্লগ লিস্ট চেক
    console.log('\n📂 ব্লগ লিস্ট পড়া হচ্ছে...');
    if (!fs.existsSync(CONFIG.BLOG_LIST_PATH)) {
      throw new Error(`❌ ব্লগ লিস্ট পাওয়া যায়নি: ${CONFIG.BLOG_LIST_PATH}`);
    }
    
    const blogList = JSON.parse(fs.readFileSync(CONFIG.BLOG_LIST_PATH, 'utf8'));
    console.log(`✅ ${blogList.length} টি পোস্ট পাওয়া গেছে\n`);
    
    if (blogList.length === 0) {
      throw new Error('❌ ব্লগ লিস্ট খালি!');
    }
    
    // প্রথম পোস্ট দেখান (ডিবাগ)
    console.log('📝 প্রথম পোস্টের নমুনা:');
    console.log(JSON.stringify(blogList[0], null, 2));
    console.log('');
    
    // ক্লাস্টার ডাটা জেনারেট
    console.log('🔍 ক্লাস্টার বিশ্লেষণ চলছে...');
    const clusterData = {};
    
    blogList.forEach((post, index) => {
      const clusterInfo = detectCluster(post.tags, post.title, post.description);
      clusterData[post.slug] = clusterInfo;
      console.log(`  ${index + 1}. ${post.slug} → ${clusterInfo.cluster} (${(clusterInfo.confidence * 100).toFixed(0)}%)`);
    });
    
    console.log(`\n✅ ক্লাস্টার বিশ্লেষণ সম্পন্ন: ${Object.keys(clusterData).length} টি পোস্ট\n`);
    
    // রিলেটেড পোস্ট জেনারেট
    console.log('🔗 রিলেটেড পোস্ট বিশ্লেষণ চলছে...');
    
    const relatedPosts = {};
    const internalLinks = {};
    
    blogList.forEach((post, index) => {
      const otherPosts = blogList.filter((_, i) => i !== index);
      
      const scoredPosts = otherPosts.map(candidate => {
        const relevance = calculateRelevance(post, candidate);
        return {
          slug: candidate.slug,
          title: candidate.title,
          cluster: clusterData[candidate.slug].cluster,
          relevance: relevance.score,
          components: relevance.components
        };
      });
      
      const validPosts = scoredPosts
        .filter(p => p.relevance > CONFIG.THRESHOLDS.MIN_RELEVANCE)
        .sort((a, b) => b.relevance - a.relevance);
      
      const topRelated = validPosts.slice(0, CONFIG.THRESHOLDS.MAX_RELATED_POSTS);
      relatedPosts[post.slug] = topRelated.map(p => p.slug);
      
      const stronglyRelated = topRelated
        .filter(p => p.relevance > CONFIG.THRESHOLDS.STRONG_RELEVANCE)
        .map(p => p.slug);
      
      const midRelated = topRelated
        .filter(p => p.relevance > CONFIG.THRESHOLDS.MEDIUM_RELEVANCE && p.relevance <= CONFIG.THRESHOLDS.STRONG_RELEVANCE)
        .map(p => p.slug);
      
      const currentCluster = clusterData[post.slug].cluster;
      const sameCluster = topRelated
        .filter(p => p.cluster === currentCluster)
        .map(p => p.slug);
      
      internalLinks[post.slug] = {
        relatedByTag: stronglyRelated.slice(0, CONFIG.THRESHOLDS.MAX_TAG_LINKS),
        relatedByPillar: midRelated.slice(0, CONFIG.THRESHOLDS.MAX_PILLAR_LINKS),
        relatedByCluster: sameCluster.slice(0, CONFIG.THRESHOLDS.MAX_CLUSTER_LINKS),
        topRelated: topRelated.slice(0, 3).map(p => ({ slug: p.slug, score: p.relevance })),
        cluster: currentCluster,
        confidence: clusterData[post.slug].confidence,
        manualLinks: []
      };
      
      if (index < 5 || index % 10 === 0) {
        console.log(`  📝 ${String(index + 1).padStart(2)}. ${post.slug.substring(0, 25).padEnd(25)} | ক্লাস্টার: ${currentCluster.padEnd(12)} | রিলেটেড: ${topRelated.length}`);
      }
    });
    
    // ডাটা ডিরেক্টরি তৈরি
    const dataDir = path.join(__dirname, 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log(`\n📁 ডিরেক্টরি তৈরি করা হয়েছে: ${dataDir}`);
    }
    
    // JSON ফাইল সেভ
    console.log('\n💾 ফাইল সেভ করা হচ্ছে...');
    
    fs.writeFileSync(CONFIG.RELATED_OUTPUT_PATH, JSON.stringify(relatedPosts, null, 2), 'utf8');
    console.log(`  ✅ related-posts.json (${Object.keys(relatedPosts).length} entries)`);
    
    fs.writeFileSync(CONFIG.INTERNAL_LINKS_OUTPUT_PATH, JSON.stringify(internalLinks, null, 2), 'utf8');
    console.log(`  ✅ internal-links.json (${Object.keys(internalLinks).length} entries)`);
    
    fs.writeFileSync(CONFIG.CLUSTER_OUTPUT_PATH, JSON.stringify(clusterData, null, 2), 'utf8');
    console.log(`  ✅ clusters.json (${Object.keys(clusterData).length} entries)`);
    
    const stats = generateStatistics(blogList, internalLinks, clusterData);
    fs.writeFileSync(CONFIG.STATS_OUTPUT_PATH, JSON.stringify(stats, null, 2), 'utf8');
    console.log(`  ✅ stats.json\n`);
    
    // ফাইনাল রিপোর্ট
    console.log('='.repeat(70));
    console.log('📊 জেনারেশন রিপোর্ট');
    console.log('='.repeat(70));
    
    console.log(`📝 মোট পোস্ট: ${stats.totalPosts}`);
    console.log(`🔗 মোট জেনারেটেড লিংক: ${stats.totalLinks}`);
    console.log(`📈 গড় লিংক প্রতি পোস্ট: ${stats.avgLinksPerPost}`);
    console.log(`⚠️  লিংকবিহীন পোস্ট: ${stats.postsWithNoLinks}`);
    
    console.log('\n📊 ক্লাস্টার ওয়াইজ পোস্ট:');
    Object.entries(stats.clusters)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cluster, count]) => {
        const percentage = ((count / stats.totalPosts) * 100).toFixed(1);
        console.log(`   ${cluster.padEnd(15)} : ${count} টি (${percentage}%)`);
      });
    
    console.log('\n📊 জনপ্রিয় ট্যাগ (টপ ১০):');
    Object.entries(stats.tagsFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`   ${tag.padEnd(20)} : ${count} বার`);
      });
    
    console.log('\n⏰ জেনারেশন সময়: ' + new Date().toLocaleString('bn-IN'));
    console.log('='.repeat(70));
    console.log('✨ জেনারেশন সম্পন্ন হয়েছে!');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ এরর:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ============================================
// স্ক্রিপ্ট এক্সিকিউট
// ============================================
generateAll();
