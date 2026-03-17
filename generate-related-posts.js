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
  
  // থ্রেশহোল্ড সেটিংস
  THRESHOLDS: {
    MIN_RELEVANCE: 0.15,
    STRONG_RELEVANCE: 0.4,
    MEDIUM_RELEVANCE: 0.25,
    MAX_RELATED_POSTS: 8,
    MAX_TAG_LINKS: 4,
    MAX_PILLAR_LINKS: 3,
    MAX_CLUSTER_LINKS: 3
  },
  
  // ওয়েটেজ (ওজন)
  WEIGHTS: {
    TAG: 0.35,
    TITLE: 0.20,
    DESCRIPTION: 0.15,
    CLUSTER: 0.20,
    RECENCY: 0.10
  }
};

// ============================================
// ক্লাস্টার ম্যাপিং (AI-লাইক ক্যাটেগোরাইজেশন)
// ============================================
const CLUSTER_KEYWORDS = {
  'হস্তরেখা': {
    keywords: ['হস্তরেখা', 'হাতের রেখা', 'জীবনরেখা', 'হাতের চিহ্ন', 'স্টার চিহ্ন', 'ক্রস চিহ্ন', 'সামুদ্রিক শাস্ত্র', 'হস্তরেখা বিচার', 'পামিস্ট্রি', 'হাত দেখা', 'রেখা বিচার'],
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
// হেল্পার ফাংশন: টেক্সট ক্লিনিং
// ============================================
function cleanText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\u0980-\u09FF\u0041-\u005A\u0061-\u007A\s]/g, ' ') // শুধু বাংলা ও ইংরেজি অক্ষর রাখে
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// AI-লাইক ক্লাস্টার ডিটেকশন
// ============================================
function detectClusterAIStyle(tags, title, description) {
  const textForAnalysis = [
    ...(tags || []).map(t => t.toLowerCase()),
    cleanText(title || ''),
    cleanText(description || '')
  ].join(' ').toLowerCase();
  
  const clusterScores = {};
  
  // প্রতিটি ক্লাস্টারের জন্য স্কোর ক্যালকুলেট করুন
  for (const [cluster, data] of Object.entries(CLUSTER_KEYWORDS)) {
    let score = 0;
    let matches = 0;
    
    data.keywords.forEach(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const count = (textForAnalysis.match(regex) || []).length;
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
  
  // সর্বোচ্চ স্কোরের ক্লাস্টার খুঁজুন
  let bestCluster = 'অন্যান্য';
  let bestScore = 0;
  let bestParent = 'অন্যান্য';
  
  for (const [cluster, data] of Object.entries(clusterScores)) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestCluster = cluster;
      bestParent = data.parent;
    }
  }
  
  return {
    cluster: bestCluster,
    parent: bestParent,
    confidence: bestScore > 0 ? Math.min(1, bestScore / 10) : 0,
    allScores: clusterScores
  };
}

// ============================================
// অ্যাডভান্সড ট্যাগ সিমিলারিটি
// ============================================
function calculateAdvancedTagSimilarity(tags1, tags2) {
  if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0) return 0;
  
  const normalized1 = tags1.map(t => cleanText(t));
  const normalized2 = tags2.map(t => cleanText(t));
  
  let matchScore = 0;
  let totalPossible = 0;
  
  // এক্স্যাক্ট ম্যাচ
  normalized1.forEach(t1 => {
    normalized2.forEach(t2 => {
      totalPossible++;
      if (t1 === t2) {
        matchScore += 1;
      } else if (t1.includes(t2) || t2.includes(t1)) {
        matchScore += 0.5;
      }
    });
  });
  
  return totalPossible > 0 ? matchScore / totalPossible : 0;
}

// ============================================
// টাইটেল ও ডেসক্রিপশন সিমিলারিটি
// ============================================
function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const words1 = new Set(cleanText(text1).split(/\s+/).filter(w => w.length > 2));
  const words2 = new Set(cleanText(text2).split(/\s+/).filter(w => w.length > 2));
  
  // বাংলা স্টপ ওয়ার্ডস
  const stopWords = new Set([
    'এই', 'ওই', 'সেই', 'কোন', 'কিছু', 'জন্য', 'কাছে', 'পরে', 'আগে',
    'থেকে', 'দিয়ে', 'করে', 'হয়ে', 'এবং', 'অথবা', 'কিন্তু', 'তবে'
  ]);
  
  const filtered1 = [...words1].filter(w => !stopWords.has(w));
  const filtered2 = [...words2].filter(w => !stopWords.has(w));
  
  const intersection = filtered1.filter(w => filtered2.includes(w)).length;
  const union = new Set([...filtered1, ...filtered2]).size;
  
  return union === 0 ? 0 : intersection / union;
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
// রিসেন্সি ক্যালকুলেশন
// ============================================
function calculateRecencyScore(date1, date2) {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1) || isNaN(d2)) return 0;
    
    const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
    return Math.max(0, 1 - (diffDays / 180)); // 6 মাসের মধ্যে
  } catch (e) {
    return 0;
  }
}

// ============================================
// মেইন রেলেভেন্স ক্যালকুলেশন
// ============================================
function calculateComprehensiveRelevance(post1, post2) {
  // 1. ট্যাগ সিমিলারিটি
  const tagSim = calculateAdvancedTagSimilarity(post1.tags, post2.tags);
  
  // 2. টাইটেল সিমিলারিটি
  const titleSim = calculateTextSimilarity(post1.title, post2.title);
  
  // 3. ডেসক্রিপশন সিমিলারিটি
  const descSim = calculateTextSimilarity(post1.description, post2.description);
  
  // 4. ক্লাস্টার সিমিলারিটি
  const cluster1 = detectClusterAIStyle(post1.tags, post1.title, post1.description);
  const cluster2 = detectClusterAIStyle(post2.tags, post2.title, post2.description);
  const clusterSim = calculateClusterSimilarity(cluster1, cluster2);
  
  // 5. রিসেন্সি স্কোর
  const recencyScore = calculateRecencyScore(post1.date, post2.date);
  
  // ওয়েটেড টোটাল স্কোর
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
function generateStatistics(blogList, internalLinks) {
  const stats = {
    totalPosts: blogList.length,
    clusters: {},
    parentClusters: {},
    tagsFrequency: {},
    avgLinksPerPost: 0,
    totalLinks: 0,
    postsWithNoLinks: 0,
    topRelatedPosts: []
  };
  
  // ক্লাস্টার এবং ট্যাগ ফ্রিকোয়েন্সি
  blogList.forEach(post => {
    const cluster = detectClusterAIStyle(post.tags, post.title, post.description);
    
    // ক্লাস্টার কাউন্ট
    stats.clusters[cluster.cluster] = (stats.clusters[cluster.cluster] || 0) + 1;
    stats.parentClusters[cluster.parent] = (stats.parentClusters[cluster.parent] || 0) + 1;
    
    // ট্যাগ ফ্রিকোয়েন্সি
    (post.tags || []).forEach(tag => {
      stats.tagsFrequency[tag] = (stats.tagsFrequency[tag] || 0) + 1;
    });
  });
  
  // লিংক স্ট্যাটিস্টিক্স
  Object.values(internalLinks).forEach(post => {
    const linksCount = 
      (post.relatedByTag?.length || 0) + 
      (post.relatedByPillar?.length || 0) + 
      (post.relatedByCluster?.length || 0);
    
    stats.totalLinks += linksCount;
    if (linksCount === 0) stats.postsWithNoLinks++;
  });
  
  stats.avgLinksPerPost = (stats.totalLinks / blogList.length).toFixed(2);
  
  return stats;
}

// ============================================
// মেইন জেনারেশন ফাংশন
// ============================================
function generateAdvancedRelatedAndInternalLinks() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 MyAstrology অ্যাডভান্সড রিলেটেড পোস্ট জেনারেটর');
  console.log('='.repeat(70));
  
  try {
    // ব্লগ লিস্ট পড়ুন
    console.log('\n📂 ব্লগ লিস্ট পড়া হচ্ছে...');
    if (!fs.existsSync(CONFIG.BLOG_LIST_PATH)) {
      throw new Error(`ব্লগ লিস্ট পাওয়া যায়নি: ${CONFIG.BLOG_LIST_PATH}`);
    }
    
    const blogList = JSON.parse(fs.readFileSync(CONFIG.BLOG_LIST_PATH, 'utf8'));
    console.log(`✅ ${blogList.length} টি পোস্ট পাওয়া গেছে\n`);
    
    // আউটপুট ডাটা স্ট্রাকচার
    const relatedPosts = {};
    const internalLinks = {};
    const clusterData = {};
    
    // প্রতিটি পোস্টের জন্য ক্লাস্টার ডিটেক্ট করুন
    console.log('🔍 ক্লাস্টার বিশ্লেষণ চলছে...');
    blogList.forEach(post => {
      const clusterInfo = detectClusterAIStyle(post.tags, post.title, post.description);
      clusterData[post.slug] = clusterInfo;
    });
    
    // রিলেটেড পোস্ট জেনারেট করুন
    console.log('🔗 রিলেটেড পোস্ট বিশ্লেষণ চলছে...');
    
    blogList.forEach((post, index) => {
      const otherPosts = blogList.filter((_, i) => i !== index);
      
      // প্রতিটি পোস্টের জন্য রেলেভেন্স স্কোর ক্যালকুলেট করুন
      const scoredPosts = otherPosts.map(candidate => {
        const relevance = calculateComprehensiveRelevance(post, candidate);
        return {
          slug: candidate.slug,
          title: candidate.title,
          cluster: clusterData[candidate.slug].cluster,
          relevance: relevance.score,
          components: relevance.components
        };
      });
      
      // ফিল্টার এবং সর্ট করুন
      const validPosts = scoredPosts
        .filter(p => p.relevance > CONFIG.THRESHOLDS.MIN_RELEVANCE)
        .sort((a, b) => b.relevance - a.relevance);
      
      // টপ রিলেটেড পোস্ট
      const topRelated = validPosts.slice(0, CONFIG.THRESHOLDS.MAX_RELATED_POSTS);
      relatedPosts[post.slug] = topRelated.map(p => p.slug);
      
      // স্ট্রংলি রিলেটেড
      const stronglyRelated = topRelated
        .filter(p => p.relevance > CONFIG.THRESHOLDS.STRONG_RELEVANCE)
        .map(p => p.slug);
      
      // মিডলি রিলেটেড
      const midRelated = topRelated
        .filter(p => p.relevance > CONFIG.THRESHOLDS.MEDIUM_RELEVANCE && 
                    p.relevance <= CONFIG.THRESHOLDS.STRONG_RELEVANCE)
        .map(p => p.slug);
      
      // একই ক্লাস্টারের পোস্ট
      const currentCluster = clusterData[post.slug].cluster;
      const sameCluster = topRelated
        .filter(p => p.cluster === currentCluster)
        .map(p => p.slug);
      
      // ইন্টারনাল লিংক স্ট্রাকচার তৈরি
      internalLinks[post.slug] = {
        relatedByTag: stronglyRelated.slice(0, CONFIG.THRESHOLDS.MAX_TAG_LINKS),
        relatedByPillar: midRelated.slice(0, CONFIG.THRESHOLDS.MAX_PILLAR_LINKS),
        relatedByCluster: sameCluster.slice(0, CONFIG.THRESHOLDS.MAX_CLUSTER_LINKS),
        topRelated: topRelated.slice(0, 3).map(p => ({
          slug: p.slug,
          score: p.relevance
        })),
        cluster: currentCluster,
        confidence: clusterData[post.slug].confidence,
        manualLinks: []
      };
      
      // প্রিন্ট প্রোগ্রেস
      if (index < 5 || index % 10 === 0) {
        console.log(`  📝 ${post.slug.substring(0, 30).padEnd(30)} | ক্লাস্টার: ${currentCluster.padEnd(15)} | রিলেটেড: ${topRelated.length}`);
      }
    });
    
    // ডাটা ডিরেক্টরি চেক/ক্রিয়েট
    const dataDir = path.join(__dirname, 'src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // JSON ফাইল সেভ করুন
    console.log('\n💾 ফাইল সেভ করা হচ্ছে...');
    
    fs.writeFileSync(CONFIG.RELATED_OUTPUT_PATH, JSON.stringify(relatedPosts, null, 2), 'utf8');
    console.log(`  ✅ related-posts.json (${Object.keys(relatedPosts).length} entries)`);
    
    fs.writeFileSync(CONFIG.INTERNAL_LINKS_OUTPUT_PATH, JSON.stringify(internalLinks, null, 2), 'utf8');
    console.log(`  ✅ internal-links.json (${Object.keys(internalLinks).length} entries)`);
    
    fs.writeFileSync(CONFIG.CLUSTER_OUTPUT_PATH, JSON.stringify(clusterData, null, 2), 'utf8');
    console.log(`  ✅ clusters.json (${Object.keys(clusterData).length} entries)`);
    
    // স্ট্যাটিস্টিক্স জেনারেট এবং সেভ
    const stats = generateStatistics(blogList, internalLinks);
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
        console.log(`   ${cluster.padEnd(15)} : ${count} টি পোস্ট`);
      });
    
    console.log('\n📊 জনপ্রিয় ট্যাগ (টপ ১০):');
    Object.entries(stats.tagsFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`   ${tag.padEnd(20)} : ${count} বার`);
      });
    
    console.log('\n' + '='.repeat(70));
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
generateAdvancedRelatedAndInternalLinks();
