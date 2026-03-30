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

// ==================== গ্রহের দৃষ্টির সংজ্ঞা (ভাব সংখ্যা) ====================
const ASPECT_DEFINITIONS = {
  saturn: { houses: [3, 7, 10], strength: 'full', nature: 'neutral' },
  jupiter: { houses: [5, 7, 9], strength: 'full', nature: 'positive' },
  mars: { houses: [4, 7, 8], strength: 'full', nature: 'mixed' },
  mercury: { houses: [7], strength: 'full', nature: 'positive' },
  venus: { houses: [7], strength: 'full', nature: 'positive' }
};

// দৃষ্টির তীব্রতা (পূর্ণ/অর্ধ/ক্ষীণ)
const ASPECT_STRENGTH = {
  full: { name: 'পূর্ণ দৃষ্টি', multiplier: 1.0, icon: '🔆' },
  half: { name: 'অর্ধ দৃষ্টি', multiplier: 0.5, icon: '🌓' },
  weak: { name: 'ক্ষীণ দৃষ্টি', multiplier: 0.25, icon: '🌙' }
};

// ==================== দৃষ্টির বিস্তারিত প্রভাব বর্ণনা ====================
const ASPECT_DESCRIPTIONS = {
  saturn: {
    positive: 'শনির দৃষ্টি: ধৈর্য, শৃঙ্খলা ও দীর্ঘমেয়াদী স্থিতিশীলতা আনবে। কঠোর পরিশ্রমের ফল মিলবে।',
    negative: 'শনির দৃষ্টি: বিলম্ব, বাধা ও কঠোর পরিশ্রমের প্রয়োজন। ধৈর্য ধরতে হবে, ফল পেতে সময় লাগবে।',
    neutral: 'শনির দৃষ্টি: দায়িত্ববোধ ও সংযমের শিক্ষা দেবে। জীবনে স্থিতিশীলতা আসবে।',
    career: 'কর্মক্ষেত্রে দায়িত্ব বৃদ্ধি পাবে। পদোন্নতি পেতে কঠোর পরিশ্রম করতে হবে।',
    health: 'হাড় ও জয়েন্টের সমস্যা হতে পারে। নিয়মিত ব্যায়াম ও ক্যালসিয়াম সমৃদ্ধ খাবার খান।',
    finance: 'সঞ্চয়ের ওপর জোর দিন। বড় বিনিয়োগ এড়িয়ে চলুন। ঋণ নিয়ন্ত্রণে রাখুন।',
    love: 'সম্পর্কে দূরত্ব আসতে পারে। ধৈর্য ধরুন, সঙ্গীকে সময় দিন।'
  },
  jupiter: {
    positive: 'বৃহস্পতির দৃষ্টি: শুভ ফল, সম্প্রসারণ ও জ্ঞানলাভ হবে। জীবনে সৌভাগ্য আসবে।',
    negative: 'বৃহস্পতির দৃষ্টি: অতিরিক্ত আশাবাদ ও অহংকার থেকে সাবধান। বাস্তবতার মূল্যায়ন করুন।',
    neutral: 'বৃহস্পতির দৃষ্টি: সৌভাগ্য ও উন্নতির সুযোগ আসবে। গুরুজনের আশীর্বাদ পাবেন।',
    career: 'কর্মক্ষেত্রে পদোন্নতি ও নতুন সুযোগ আসবে। শিক্ষা ও গবেষণায় সাফল্য।',
    health: 'স্বাস্থ্যের উন্নতি হবে। রোগ প্রতিরোধ ক্ষমতা বাড়বে। আধ্যাত্মিক চর্চা উপকারী।',
    finance: 'আর্থিক লাভ ও সম্প্রসারণের সুযোগ। দীর্ঘমেয়াদী বিনিয়োগে লাভ।',
    love: 'সম্পর্কে সম্প্রসারণ ও বিশ্বাস বৃদ্ধি পাবে। বিবাহ বা বাগদানের সুখবর আসতে পারে।'
  },
  mars: {
    positive: 'মঙ্গলের দৃষ্টি: সাহস, শক্তি ও প্রতিযোগিতায় সাফল্য আসবে। নতুন উদ্যোগে সাফল্য।',
    negative: 'মঙ্গলের দৃষ্টি: রাগ, সংঘর্ষ ও দুর্ঘটনার সম্ভাবনা। আবেগ নিয়ন্ত্রণে রাখুন।',
    neutral: 'মঙ্গলের দৃষ্টি: উদ্যম ও উদ্যোগ বাড়বে। প্রতিযোগিতায় সক্রিয় হোন।',
    career: 'কর্মক্ষেত্রে প্রতিযোগিতা বাড়বে। উদ্যোগ নিলে সাফল্য আসবে।',
    health: 'রক্তচাপ ও প্রদাহজনিত সমস্যা হতে পারে। রাগ নিয়ন্ত্রণে রাখুন।',
    finance: 'ঝুঁকিপূর্ণ বিনিয়োগ এড়িয়ে চলুন। প্রতিযোগিতামূলক ব্যবসায় লাভ।',
    love: 'সম্পর্কে উত্তেজনা ও আবেগ বাড়বে। রাগ নিয়ন্ত্রণে রাখুন, সংঘর্ষ এড়িয়ে চলুন।'
  },
  mercury: {
    positive: 'বুধের দৃষ্টি: বুদ্ধি, যোগাযোগ ও ব্যবসায় সাফল্য আসবে। নতুন জ্ঞান অর্জন হবে।',
    negative: 'বুধের দৃষ্টি: বাকবিতণ্ডা ও সিদ্ধান্তে দ্বিধা হতে পারে। স্পষ্টভাবে কথা বলুন।',
    neutral: 'বুধের দৃষ্টি: বুদ্ধিবৃত্তিক কাজে সহায়তা পাবেন। যোগাযোগ দক্ষতা বাড়বে।',
    career: 'ব্যবসা ও যোগাযোগ সংক্রান্ত কাজে সাফল্য। লেখালেখি ও উপস্থাপনায় দক্ষতা।',
    health: 'স্নায়ুতন্ত্র ও শ্বাসতন্ত্রের যত্ন নিন। যোগাযোগের মাধ্যমে মানসিক চাপ কমান।',
    finance: 'ছোট বিনিয়োগ ও লেনদেনে লাভ। ব্যবসায়িক যোগাযোগে সুবিধা।',
    love: 'সম্পর্কে যোগাযোগ উন্নত হবে। মনের কথা খুলে বললে ভুল বোঝাবুঝি কাটবে।'
  },
  venus: {
    positive: 'শুক্রের দৃষ্টি: প্রেম, সৌন্দর্য ও সম্পর্কে মধুরতা আসবে। সামাজিক জীবনে সাফল্য।',
    negative: 'শুক্রের দৃষ্টি: বিলাসিতায় অতিরিক্ত খরচ হতে পারে। সংযম রাখুন।',
    neutral: 'শুক্রের দৃষ্টি: সামাজিক সম্পর্ক ও আনন্দে দিন কাটবে। সৃজনশীলতা বাড়বে।',
    career: 'সৃজনশীল ও শিল্প সংক্রান্ত কাজে সাফল্য। সামাজিক সম্পর্ক কাজে লাগবে।',
    health: 'ত্বক ও হরমোনজনিত সমস্যা হতে পারে। সৌন্দর্য চর্চায় মন দিন।',
    finance: 'বিলাসিতায় খরচ বাড়তে পারে। বাজেট মেনে চলুন। সৌন্দর্য ও শিল্পে বিনিয়োগ।',
    love: 'প্রেম ও সম্পর্কে মধুরতা আসবে। সঙ্গীর সাথে আনন্দময় সময় কাটবে।'
  }
};

// ==================== দৃষ্টির মৌলিক ফাংশন ====================

/**
 * দৃষ্টি গণনার সাধারণ ফাংশন
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @param {Array} aspectHouses - দৃষ্টির ভাবের তালিকা
 * @returns {boolean}
 */
function hasAspect(sourceRashi, targetRashi, aspectHouses) {
  const diff = (targetRashi - sourceRashi + 12) % 12;
  return aspectHouses.includes(diff);
}

/**
 * শনির দৃষ্টি (3, 7, 10 – পূর্ণ দৃষ্টি)
 * @param {number} saturnRashi - শনির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isSaturnAspect(saturnRashi, targetRashi) {
  return hasAspect(saturnRashi, targetRashi, ASPECT_DEFINITIONS.saturn.houses);
}

/**
 * বৃহস্পতির দৃষ্টি (5, 7, 9 – পূর্ণ দৃষ্টি)
 * @param {number} jupiterRashi - বৃহস্পতির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isJupiterAspect(jupiterRashi, targetRashi) {
  return hasAspect(jupiterRashi, targetRashi, ASPECT_DEFINITIONS.jupiter.houses);
}

/**
 * মঙ্গলের দৃষ্টি (4, 7, 8 – পূর্ণ দৃষ্টি)
 * @param {number} marsRashi - মঙ্গলের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isMarsAspect(marsRashi, targetRashi) {
  return hasAspect(marsRashi, targetRashi, ASPECT_DEFINITIONS.mars.houses);
}

/**
 * বুধের দৃষ্টি (7 – পূর্ণ দৃষ্টি)
 * @param {number} mercuryRashi - বুধের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isMercuryAspect(mercuryRashi, targetRashi) {
  return hasAspect(mercuryRashi, targetRashi, ASPECT_DEFINITIONS.mercury.houses);
}

/**
 * শুক্রের দৃষ্টি (7 – পূর্ণ দৃষ্টি)
 * @param {number} venusRashi - শুক্রের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isVenusAspect(venusRashi, targetRashi) {
  return hasAspect(venusRashi, targetRashi, ASPECT_DEFINITIONS.venus.houses);
}

// ==================== উন্নত দৃষ্টি বিশ্লেষণ ====================

/**
 * দৃষ্টির তীব্রতা নির্ণয় (পূর্ণ/অর্ধ/ক্ষীণ)
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {string} planet - গ্রহের নাম
 * @returns {Object} - { strength, multiplier, icon, name }
 */
function getAspectStrengthDetailed(sourceRashi, targetRashi, planet) {
  const def = ASPECT_DEFINITIONS[planet];
  if (!def) return ASPECT_STRENGTH.weak;
  
  const diff = (targetRashi - sourceRashi + 12) % 12;
  if (def.houses.includes(diff)) {
    return ASPECT_STRENGTH.full;
  }
  
  // কিছু গ্রহের অর্ধ দৃষ্টি থাকলে এখানে যোগ করা যেতে পারে
  // উদাহরণ: মঙ্গলের ৪র্থ ভাবে অর্ধ দৃষ্টি
  if (planet === 'mars' && diff === 4) {
    return ASPECT_STRENGTH.half;
  }
  
  return ASPECT_STRENGTH.weak;
}

/**
 * দৃষ্টির প্রকৃতি নির্ণয় (শুভ/অশুভ/মধ্যম)
 * @param {string} planet - গ্রহের নাম
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {Object} additionalFactors - অতিরিক্ত ফ্যাক্টর (ঐচ্ছিক)
 * @returns {string} - 'shubha', 'ashubha', 'madhyama'
 */
function getAspectNature(planet, targetRashi, additionalFactors = {}) {
  const def = ASPECT_DEFINITIONS[planet];
  if (!def) return 'madhyama';
  
  // গ্রহের স্বাভাবিক প্রকৃতি
  const naturalNatures = {
    saturn: 'ashubha',
    jupiter: 'shubha',
    mars: 'ashubha',
    mercury: 'shubha',
    venus: 'shubha'
  };
  
  let nature = naturalNatures[planet] || 'madhyama';
  
  // রাশিভেদে পরিবর্তন (উচ্চ/নীচ/মূলত্রিকোণ)
  const exaltationRashis = { sun: 0, moon: 2, mars: 9, mercury: 5, jupiter: 3, venus: 6, saturn: 6 };
  if (exaltationRashis[planet] === targetRashi) {
    nature = nature === 'shubha' ? 'shubha' : 'madhyama';
  }
  
  return nature;
}

/**
 * দৃষ্টির সম্পূর্ণ বিশ্লেষণ (গ্রহ, রাশি, তীব্রতা, প্রকৃতি, প্রভাব)
 * @param {string} planet - গ্রহের নাম
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {string} category - 'general', 'career', 'health', 'finance', 'love'
 * @returns {Object}
 */
function getAspectAnalysis(planet, sourceRashi, targetRashi, category = 'general') {
  const has = hasAspect(sourceRashi, targetRashi, ASPECT_DEFINITIONS[planet]?.houses || []);
  if (!has) return null;
  
  const strength = getAspectStrengthDetailed(sourceRashi, targetRashi, planet);
  const nature = getAspectNature(planet, targetRashi);
  const desc = ASPECT_DESCRIPTIONS[planet];
  
  let text = '';
  if (desc) {
    if (category === 'general') text = desc.neutral;
    else if (category === 'career') text = desc.career || desc.neutral;
    else if (category === 'health') text = desc.health || desc.neutral;
    else if (category === 'finance') text = desc.finance || desc.neutral;
    else if (category === 'love') text = desc.love || desc.neutral;
    else text = desc.neutral;
  }
  
  return {
    planet: planet,
    planetName: getPlanetName(planet),
    hasAspect: true,
    strength: strength.name,
    strengthIcon: strength.icon,
    multiplier: strength.multiplier,
    nature: nature,
    isShubha: nature === 'shubha',
    isAshubha: nature === 'ashubha',
    description: text,
    category: category
  };
}

/**
 * গ্রহের বাংলা নাম
 * @param {string} planet - ইংরেজি নাম
 * @returns {string}
 */
function getPlanetName(planet) {
  const names = {
    saturn: 'শনি',
    jupiter: 'বৃহস্পতি',
    mars: 'মঙ্গল',
    mercury: 'বুধ',
    venus: 'শুক্র'
  };
  return names[planet] || planet;
}

// ==================== কম্বাইন্ড ফাংশন ====================

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
 * সব গ্রহের বিস্তারিত দৃষ্টি বিশ্লেষণ
 * @param {Object} planetRashis - { saturn, jupiter, mars, mercury, venus }
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {string} category - 'general', 'career', 'health', 'finance', 'love'
 * @returns {Array}
 */
function getAllAspectsDetailed(planetRashis, targetRashi, category = 'general') {
  const results = [];
  const planets = ['saturn', 'jupiter', 'mars', 'mercury', 'venus'];
  
  for (const planet of planets) {
    const sourceRashi = planetRashis[planet];
    if (sourceRashi !== undefined) {
      const analysis = getAspectAnalysis(planet, sourceRashi, targetRashi, category);
      if (analysis) {
        results.push(analysis);
      }
    }
  }
  
  return results;
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
 * দৃষ্টির বিস্তারিত বিবরণ (বিভাগভিত্তিক)
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {string} category - 'career', 'health', 'finance', 'love'
 * @returns {string}
 */
function getAspectTextByCategory(aspects, category) {
  const parts = [];
  
  if (aspects.saturn && ASPECT_DESCRIPTIONS.saturn[category]) {
    parts.push(ASPECT_DESCRIPTIONS.saturn[category]);
  }
  if (aspects.jupiter && ASPECT_DESCRIPTIONS.jupiter[category]) {
    parts.push(ASPECT_DESCRIPTIONS.jupiter[category]);
  }
  if (aspects.mars && ASPECT_DESCRIPTIONS.mars[category]) {
    parts.push(ASPECT_DESCRIPTIONS.mars[category]);
  }
  if (aspects.mercury && ASPECT_DESCRIPTIONS.mercury[category]) {
    parts.push(ASPECT_DESCRIPTIONS.mercury[category]);
  }
  if (aspects.venus && ASPECT_DESCRIPTIONS.venus[category]) {
    parts.push(ASPECT_DESCRIPTIONS.venus[category]);
  }
  
  if (parts.length === 0) return '';
  return parts.join(' ');
}

/**
 * দৃষ্টির তীব্রতা নির্ণয় (পূর্ণ দৃষ্টি / অর্ধ দৃষ্টি) – সরল সংস্করণ
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {Array} aspectHouses - দৃষ্টির ভাবের তালিকা
 * @returns {string} - 'full', 'half', 'none'
 */
function getAspectStrengthSimple(sourceRashi, targetRashi, aspectHouses) {
  const diff = (targetRashi - sourceRashi + 12) % 12;
  if (aspectHouses.includes(diff)) return 'full';
  return 'none';
}

module.exports = {
  // মৌলিক দৃষ্টি ফাংশন
  isSaturnAspect,
  isJupiterAspect,
  isMarsAspect,
  isMercuryAspect,
  isVenusAspect,
  hasAspect,
  
  // উন্নত বিশ্লেষণ
  getAspectStrengthDetailed,
  getAspectNature,
  getAspectAnalysis,
  getPlanetName,
  
  // কম্বাইন্ড ফাংশন
  getAllAspects,
  getAllAspectsDetailed,
  getAspectSummary,
  getAspectText,
  getAspectTextByCategory,
  getAspectStrengthSimple,
  
  // কনস্ট্যান্ট
  ASPECT_DEFINITIONS,
  ASPECT_DESCRIPTIONS,
  ASPECT_STRENGTH
};
