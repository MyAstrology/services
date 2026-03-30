/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: gochar/aspects.js
 * কাজ: গ্রহের দৃষ্টি (aspect) গণনা – সব গুরুত্বপূর্ণ গ্রহের জন্য
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { RASHI_NAMES } = require('../utils/constants');

// গ্রহের দৃষ্টির সংজ্ঞা (ভাব সংখ্যা)
const ASPECT_DEFINITIONS = {
  saturn: [3, 7, 10],      // শনি: ৩, ৭, ১০ ভাবে পূর্ণ দৃষ্টি
  jupiter: [5, 7, 9],      // বৃহস্পতি: ৫, ৭, ৯ ভাবে পূর্ণ দৃষ্টি
  mars: [4, 7, 8],         // মঙ্গল: ৪, ৭, ৮ ভাবে পূর্ণ দৃষ্টি
  mercury: [7],            // বুধ: শুধু ৭ম ভাবে দৃষ্টি (কিছু মতে ৩, ৭)
  venus: [7]               // শুক্র: শুধু ৭ম ভাবে দৃষ্টি
};

// দৃষ্টির প্রভাব বর্ণনা (বিস্তারিত)
const ASPECT_DESCRIPTIONS = {
  saturn: {
    positive: 'শনির দৃষ্টি: ধৈর্য, শৃঙ্খলা ও দীর্ঘমেয়াদী স্থিতিশীলতা আনবে।',
    negative: 'শনির দৃষ্টি: বিলম্ব, বাধা ও কঠোর পরিশ্রমের প্রয়োজন।',
    neutral: 'শনির দৃষ্টি: দায়িত্ববোধ ও সংযমের শিক্ষা দেবে।'
  },
  jupiter: {
    positive: 'বৃহস্পতির দৃষ্টি: শুভ ফল, সম্প্রসারণ ও জ্ঞানলাভ হবে।',
    negative: 'বৃহস্পতির দৃষ্টি: অতিরিক্ত আশাবাদ ও অহংকার থেকে সাবধান।',
    neutral: 'বৃহস্পতির দৃষ্টি: সৌভাগ্য ও উন্নতির সুযোগ আসবে।'
  },
  mars: {
    positive: 'মঙ্গলের দৃষ্টি: সাহস, শক্তি ও প্রতিযোগিতায় সাফল্য আসবে।',
    negative: 'মঙ্গলের দৃষ্টি: রাগ, সংঘর্ষ ও দুর্ঘটনার সম্ভাবনা।',
    neutral: 'মঙ্গলের দৃষ্টি: উদ্যম ও উদ্যোগ বাড়বে।'
  },
  mercury: {
    positive: 'বুধের দৃষ্টি: বুদ্ধি, যোগাযোগ ও ব্যবসায় সাফল্য আসবে।',
    negative: 'বুধের দৃষ্টি: বাকবিতণ্ডা ও সিদ্ধান্তে দ্বিধা হতে পারে।',
    neutral: 'বুধের দৃষ্টি: বুদ্ধিবৃত্তিক কাজে সহায়তা পাবেন।'
  },
  venus: {
    positive: 'শুক্রের দৃষ্টি: প্রেম, সৌন্দর্য ও সম্পর্কে মধুরতা আসবে।',
    negative: 'শুক্রের দৃষ্টি: বিলাসিতায় অতিরিক্ত খরচ হতে পারে।',
    neutral: 'শুক্রের দৃষ্টি: সামাজিক সম্পর্ক ও আনন্দে দিন কাটবে।'
  }
};

/**
 * শনির দৃষ্টি (3, 7, 10 – পূর্ণ দৃষ্টি)
 * @param {number} saturnRashi - শনির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isSaturnAspect(saturnRashi, targetRashi) {
  const diff = (targetRashi - saturnRashi + 12) % 12;
  return ASPECT_DEFINITIONS.saturn.includes(diff);
}

/**
 * বৃহস্পতির দৃষ্টি (5, 7, 9 – পূর্ণ দৃষ্টি)
 * @param {number} jupiterRashi - বৃহস্পতির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isJupiterAspect(jupiterRashi, targetRashi) {
  const diff = (targetRashi - jupiterRashi + 12) % 12;
  return ASPECT_DEFINITIONS.jupiter.includes(diff);
}

/**
 * মঙ্গলের দৃষ্টি (4, 7, 8 – পূর্ণ দৃষ্টি)
 * @param {number} marsRashi - মঙ্গলের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isMarsAspect(marsRashi, targetRashi) {
  const diff = (targetRashi - marsRashi + 12) % 12;
  return ASPECT_DEFINITIONS.mars.includes(diff);
}

/**
 * বুধের দৃষ্টি (7 – পূর্ণ দৃষ্টি)
 * @param {number} mercuryRashi - বুধের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isMercuryAspect(mercuryRashi, targetRashi) {
  const diff = (targetRashi - mercuryRashi + 12) % 12;
  return ASPECT_DEFINITIONS.mercury.includes(diff);
}

/**
 * শুক্রের দৃষ্টি (7 – পূর্ণ দৃষ্টি)
 * @param {number} venusRashi - শুক্রের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isVenusAspect(venusRashi, targetRashi) {
  const diff = (targetRashi - venusRashi + 12) % 12;
  return ASPECT_DEFINITIONS.venus.includes(diff);
}

/**
 * সব গ্রহের দৃষ্টি একসাথে গণনা
 * @param {Object} planetRashis - { saturn, jupiter, mars, mercury, venus }
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @returns {Object} - { saturn, jupiter, mars, mercury, venus }
 */
function getAllAspects(planetRashis, targetRashi) {
  return {
    saturn: planetRashis.saturn !== undefined ? isSaturnAspect(planetRashis.saturn, targetRashi) : false,
    jupiter: planetRashis.jupiter !== undefined ? isJupiterAspect(planetRashis.jupiter, targetRashi) : false,
    mars: planetRashis.mars !== undefined ? isMarsAspect(planetRashis.mars, targetRashi) : false,
    mercury: planetRashis.mercury !== undefined ? isMercuryAspect(planetRashis.mercury, targetRashi) : false,
    venus: planetRashis.venus !== undefined ? isVenusAspect(planetRashis.venus, targetRashi) : false
  };
}

/**
 * দৃষ্টির সংক্ষিপ্ত বিবরণ (যেমন: "শনি, বৃহস্পতির দৃষ্টি")
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function getAspectSummary(aspects) {
  const activeAspects = [];
  if (aspects.saturn) activeAspects.push('🪐 শনি');
  if (aspects.jupiter) activeAspects.push('♃ বৃহস্পতি');
  if (aspects.mars) activeAspects.push('♂ মঙ্গল');
  if (aspects.mercury) activeAspects.push('☿ বুধ');
  if (aspects.venus) activeAspects.push('♀ শুক্র');
  
  if (activeAspects.length === 0) return '';
  if (activeAspects.length === 1) return `${activeAspects[0]}র দৃষ্টি বিদ্যমান।`;
  return `${activeAspects.slice(0, -1).join(', ')} ও ${activeAspects.slice(-1)}র দৃষ্টি বিদ্যমান।`;
}

/**
 * দৃষ্টির বিস্তারিত বিবরণ (প্রভাব সহ)
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {string} tone - 'positive', 'negative', 'neutral' (ডিফল্ট: 'neutral')
 * @returns {string}
 */
function getAspectText(aspects, tone = 'neutral') {
  const parts = [];
  
  if (aspects.saturn) {
    const desc = ASPECT_DESCRIPTIONS.saturn[tone] || ASPECT_DESCRIPTIONS.saturn.neutral;
    parts.push(desc);
  }
  if (aspects.jupiter) {
    const desc = ASPECT_DESCRIPTIONS.jupiter[tone] || ASPECT_DESCRIPTIONS.jupiter.neutral;
    parts.push(desc);
  }
  if (aspects.mars) {
    const desc = ASPECT_DESCRIPTIONS.mars[tone] || ASPECT_DESCRIPTIONS.mars.neutral;
    parts.push(desc);
  }
  if (aspects.mercury) {
    const desc = ASPECT_DESCRIPTIONS.mercury[tone] || ASPECT_DESCRIPTIONS.mercury.neutral;
    parts.push(desc);
  }
  if (aspects.venus) {
    const desc = ASPECT_DESCRIPTIONS.venus[tone] || ASPECT_DESCRIPTIONS.venus.neutral;
    parts.push(desc);
  }
  
  if (parts.length === 0) return '';
  return parts.join(' ');
}

/**
 * দৃষ্টির তীব্রতা নির্ণয় (পূর্ণ দৃষ্টি / অর্ধ দৃষ্টি)
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {Array} aspectHouses - দৃষ্টির ভাবের তালিকা
 * @returns {string} - 'full', 'half', 'none'
 */
function getAspectStrength(sourceRashi, targetRashi, aspectHouses) {
  const diff = (targetRashi - sourceRashi + 12) % 12;
  if (aspectHouses.includes(diff)) return 'full';
  // কিছু গ্রহের অর্ধ দৃষ্টি থাকলে এখানে যোগ করা যেতে পারে
  return 'none';
}

module.exports = {
  // শনি ও বৃহস্পতি (বর্তমানে ব্যবহৃত)
  isSaturnAspect,
  isJupiterAspect,
  
  // ভবিষ্যতে ব্যবহারের জন্য
  isMarsAspect,
  isMercuryAspect,
  isVenusAspect,
  
  // কম্বাইন্ড ফাংশন
  getAllAspects,
  getAspectSummary,
  getAspectText,
  getAspectStrength,
  
  // কনস্ট্যান্ট
  ASPECT_DEFINITIONS,
  ASPECT_DESCRIPTIONS
};
