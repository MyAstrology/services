/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: gochar/aspects.js
 * কাজ: গ্রহের দৃষ্টি (aspect) গণনা – সব গুরুত্বপূর্ণ গ্রহের জন্য
 * প্রকল্প: Daily Rashifal Generator
 *
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { RASHI_NAMES } = require('../utils/constants');

// ==================== গ্রহের দৃষ্টির সংজ্ঞা (ভাব সংখ্যা) ====================
const ASPECT_DEFINITIONS = {
  saturn:  { houses: [3, 7, 10], strength: 'full', nature: 'neutral'  },
  jupiter: { houses: [5, 7,  9], strength: 'full', nature: 'positive' },
  mars:    { houses: [4, 7,  8], strength: 'full', nature: 'mixed'    },
  mercury: { houses: [7],        strength: 'full', nature: 'positive' },
  venus:   { houses: [7],        strength: 'full', nature: 'positive' }
};

// দৃষ্টির তীব্রতা (পূর্ণ/অর্ধ/ক্ষীণ)
const ASPECT_STRENGTH = {
  full: { name: 'পূর্ণ দৃষ্টি', multiplier: 1.0,  icon: '🔆' },
  half: { name: 'অর্ধ দৃষ্টি',  multiplier: 0.5,  icon: '🌓' },
  weak: { name: 'ক্ষীণ দৃষ্টি', multiplier: 0.25, icon: '🌙' }
};

// ==================== দৃষ্টির বিস্তারিত প্রভাব বর্ণনা ====================
const ASPECT_DESCRIPTIONS = {

  saturn: {
    positive: 'শনির শুভ দৃষ্টি পড়েছে — কর্মফলের দেবতার এই দৃষ্টি বিরল আশীর্বাদ। দীর্ঘ সাধনার পর যেমন মাটি থেকে সোনা উঠে আসে, তেমনি কঠোর পরিশ্রমের প্রতিদান এখন স্পষ্ট হচ্ছে। শৃঙ্খলা ও সংযমের পথ ধরেই স্থায়ী উন্নতি আসবে।',
    negative: 'শনির দৃষ্টি পড়েছে — ন্যায়বিচারক এই গ্রহ এখন পরীক্ষা নিচ্ছেন। বিলম্ব ও বাধা আসলে বুঝবেন, কিছু পাওয়ার আগে আরও পরিপক্ব হওয়ার নির্দেশ আসছে। ধৈর্যই একমাত্র পথ — তাড়াহুড়া করলে ক্ষতি, শান্তিতে এগোলে ফল নিশ্চিত।',
    neutral:  'শনির দৃষ্টি জীবনকে একটি কঠোর শিক্ষকের মতো নির্দেশ দিচ্ছে। দায়িত্ব পালনে সংযম, বাণীতে মিতব্যয়িতা এবং কাজে একাগ্রতা — এই তিনটি গুণ এখন বিশেষভাবে প্রয়োজন। স্থিতিশীলতা আসবে, তবে সময়ের নিয়মে।',
    career:   'কর্মক্ষেত্রে শনির দৃষ্টি পড়েছে — দায়িত্ব বাড়বে, পরিশ্রম বাড়বে, তবে স্বীকৃতিও আসবে। যারা নিষ্ঠার সঙ্গে কাজ করেছেন, তাদের জন্য পদোন্নতির সুযোগ দূরে নয়। কিন্তু এড়িয়ে যাওয়ার মনোভাব রাখলে শনি কঠোর হবেন।',
    health:   'শনির প্রভাবে হাড়, জয়েন্ট ও দাঁতের দিকে মনোযোগ দেওয়া জরুরি। বয়সজনিত ক্লান্তি বা দীর্ঘস্থায়ী রোগ থাকলে অবহেলা নয়। নিয়মিত ব্যায়াম, ক্যালসিয়াম সমৃদ্ধ খাবার ও পর্যাপ্ত বিশ্রাম — এই তিনটি শনির ওষুধ।',
    finance:  'শনির দৃষ্টিতে অর্থের ক্ষেত্রে সংযম আবশ্যক। বড় বিনিয়োগে তাড়াহুড়া নয়, ঋণ নেওয়ার আগে দশবার ভাবুন। সঞ্চয়ই এই সময়ের সবচেয়ে নিরাপদ পথ — ক্ষুদ্র কিন্তু নিয়মিত সঞ্চয় ভবিষ্যতের ভিত তৈরি করবে।',
    love:     'শনির দৃষ্টিতে সম্পর্কে একটি দূরত্বের অনুভূতি আসতে পারে, কিন্তু এটি শেষ নয় — পরীক্ষা। যে সম্পর্ক সত্যিকারের, তা এই কঠিন সময়ে আরও গভীর হয়। সঙ্গীকে সময় ও মনোযোগ দিন, অভিমান গিলে ফেলুন।'
  },

  jupiter: {
    positive: 'বৃহস্পতির শুভ দৃষ্টি পড়েছে — এটি আকাশের সবচেয়ে মহৎ আলো। দেবগুরুর এই দৃষ্টি যেখানে পড়ে, সেখানে জ্ঞান, সম্প্রসারণ ও সৌভাগ্য একসাথে আসে। ভেতরের প্রজ্ঞা জেগে উঠছে, জীবনের গভীরতর অর্থ খুঁজে পাওয়ার সময় এসেছে।',
    negative: 'বৃহস্পতির দৃষ্টি আছে, তবে সাবধান — অতিরিক্ত আশাবাদ বা অহংকার এই শুভ শক্তিকে নষ্ট করতে পারে। গুরুর আশীর্বাদ তখনই ফলপ্রসূ হয়, যখন বিনয় থাকে। বাস্তবতার মাটিতে পা রেখে স্বপ্ন দেখুন।',
    neutral:  'বৃহস্পতির দৃষ্টি জীবনে একটি প্রসারমান শক্তি এনেছে। গুরুজনের আশীর্বাদ মিলবে, নতুন জ্ঞান আসবে, আত্মার গভীরতা বাড়বে। এই দৃষ্টি সৌভাগ্যের দ্বার খোলে — তবে কেবল তাদের জন্য যারা যোগ্যতার সঙ্গে এগিয়ে আসে।',
    career:   'বৃহস্পতির দৃষ্টিতে কর্মক্ষেত্রে উন্নতির দরজা খুলছে। পদোন্নতি, নতুন দায়িত্ব বা উচ্চশিক্ষার সুযোগ আসতে পারে। শিক্ষা, গবেষণা ও আইন সংক্রান্ত কাজে এই সময় বিশেষ অনুকূল।',
    health:   'বৃহস্পতির প্রভাবে রোগ প্রতিরোধ ক্ষমতা বাড়বে, শরীর ও মনে একটি প্রাণময়তা অনুভব হবে। তবে অতিভোজন ও অলসতা থেকে সাবধান। আধ্যাত্মিক চর্চা ও প্রকৃতির কাছাকাছি থাকুন।',
    finance:  'বৃহস্পতির দৃষ্টিতে আর্থিক সম্প্রসারণের সুযোগ আসছে। দীর্ঘমেয়াদী বিনিয়োগ — শিক্ষা, সম্পদ বা ব্যবসায় — এই সময়ে ফলদায়ক। তবে অতিরিক্ত সম্প্রসারণের প্রলোভন এড়িয়ে চলুন, ভিত মজবুত করুন।',
    love:     'বৃহস্পতির দৃষ্টিতে সম্পর্কে বিশ্বাস ও গভীরতা বাড়বে। বিবাহ, বাগদান বা সন্তানের সুখবর আসতে পারে। আত্মিক মিলনের এই সময় — সঙ্গীকে কেবল শরীর নয়, মন দিয়ে ভালোবাসুন।'
  },

  mars: {
    positive: 'মঙ্গলের শুভ দৃষ্টি পড়েছে — এটি যুদ্ধের দেবতার বিজয়ী হাত। সাহস, উদ্যম ও প্রতিযোগিতায় এগিয়ে যাওয়ার শক্তি এখন চরমে। নতুন উদ্যোগ শুরু করার, শত্রুকে পরাজিত করার এবং নিজেকে প্রমাণ করার এটাই শ্রেষ্ঠ সময়।',
    negative: 'মঙ্গলের দৃষ্টি পড়েছে — এই শক্তি আগুনের মতো, নিয়ন্ত্রণে রাখলে আলো দেয়, বেপরোয়া হলে পোড়ায়। রাগ, তর্ক ও দুর্ঘটনার সম্ভাবনা বেশি। মাথা ঠান্ডা রাখুন, সিদ্ধান্ত নেওয়ার আগে একবার নিশ্বাস ফেলুন।',
    neutral:  'মঙ্গলের দৃষ্টি উদ্যম ও কর্মশক্তি বাড়াচ্ছে। প্রতিযোগিতায় সক্রিয় হওয়ার সময় এসেছে। তবে এই শক্তিকে গঠনমূলক কাজে লাগান — অকারণ সংঘর্ষে নষ্ট করবেন না।',
    career:   'মঙ্গলের দৃষ্টিতে কর্মক্ষেত্রে প্রতিযোগিতা তীব্র হবে। যারা সাহস নিয়ে এগিয়ে আসবেন, তারা এগিয়ে যাবেন। নতুন প্রকল্পে নেতৃত্ব নিতে পারেন — মঙ্গল সাহসীদের পক্ষে।',
    health:   'মঙ্গলের প্রভাবে রক্তচাপ, প্রদাহ ও আঘাতের প্রবণতা বাড়তে পারে। রাগ নিয়ন্ত্রণ করুন, কারণ মানসিক উত্তেজনা সরাসরি শরীরে প্রভাব ফেলে। তীক্ষ্ণ যন্ত্র ও যানবাহনে সাবধান থাকুন।',
    finance:  'মঙ্গলের দৃষ্টিতে ঝুঁকিপূর্ণ বিনিয়োগ থেকে দূরে থাকুন। প্রতিযোগিতামূলক ব্যবসা বা ঠিকাদারিতে লাভ আসতে পারে। তবে চুক্তি সই করার আগে খুঁটিনাটি দেখুন।',
    love:     'মঙ্গলের দৃষ্টিতে সম্পর্কে আবেগ ও উত্তেজনা দুটোই বাড়বে। প্রেমের গভীরতা অনুভব করবেন, কিন্তু অহং ও জেদ সামলাতে হবে। ছোট্ট বিষয়কে বড় ঝগড়ায় পরিণত করবেন না — সংঘর্ষ নয়, সংলাপ বেছে নিন।'
  },

  mercury: {
    positive: 'বুধের শুভ দৃষ্টি পড়েছে — বুদ্ধির দেবতার এই দৃষ্টি মনকে তীক্ষ্ণ করে, ভাষাকে সাবলীল করে। যোগাযোগ, লেখালেখি, ব্যবসা বা পড়াশোনায় এই সময় বিশেষ অনুকূল। নতুন জ্ঞান দ্রুত আত্মস্থ হবে, ধারণাগুলো স্পষ্ট হবে।',
    negative: 'বুধের দৃষ্টি আছে, তবে সাবধান — বাকবিতণ্ডা, তথ্যের বিভ্রান্তি বা চুক্তিতে গোলমাল হতে পারে। কথা বলার আগে ভাবুন, কলম চালানোর আগে পড়ুন। দ্বিধার মুহূর্তে তৃতীয় কারও পরামর্শ নিন।',
    neutral:  'বুধের দৃষ্টি বুদ্ধিবৃত্তিক কাজে সহায়তা দিচ্ছে। বিশ্লেষণ, পরিকল্পনা ও যোগাযোগে দক্ষতা বাড়বে। এই সময় যা পড়বেন বা শিখবেন, তা দীর্ঘস্থায়ী ছাপ ফেলবে।',
    career:   'বুধের দৃষ্টিতে ব্যবসা, উপস্থাপনা ও যোগাযোগ-নির্ভর কাজে সাফল্য আসবে। লেখালেখি, সাংবাদিকতা, শিক্ষকতা বা আইটিতে বিশেষ সুবিধা। গুরুত্বপূর্ণ বৈঠক বা প্রস্তাব পেশ করার উপযুক্ত সময়।',
    health:   'বুধের প্রভাবে স্নায়ুতন্ত্র ও শ্বাসতন্ত্রের যত্ন নেওয়া জরুরি। অতিরিক্ত মানসিক চাপ স্নায়ুকে দুর্বল করে — মেডিটেশন ও গভীর শ্বাসের অভ্যাস করুন।',
    finance:  'বুধের দৃষ্টিতে ছোট ও মাঝারি বিনিয়োগে লাভ আসবে। ব্যবসায়িক চুক্তি ও অংশীদারিতে সুবিধা। তবে মৌখিক প্রতিশ্রুতিতে নির্ভর না করে সব লিখিতে রাখুন।',
    love:     'বুধের দৃষ্টিতে সম্পর্কে যোগাযোগের মান উন্নত হবে। যা মনে পুষে রাখছিলেন, তা বলার সাহস এখন আসবে। খোলামেলা কথোপকথনই এই সময়ের সেরা প্রেমের ভাষা।'
  },

  venus: {
    positive: 'শুক্রের শুভ দৃষ্টি পড়েছে — সৌন্দর্য ও প্রেমের দেবীর এই দৃষ্টি জীবনকে রঙিন করে তোলে। সম্পর্কে মাধুর্য আসবে, শিল্প ও সৌন্দর্যের প্রতি আগ্রহ বাড়বে, সামাজিক জীবনে নতুন বন্ধন তৈরি হবে।',
    negative: 'শুক্রের দৃষ্টি আছে, কিন্তু বিলাসিতা ও ইন্দ্রিয়সুখের প্রতি আকর্ষণ বিপদ ডাকতে পারে। অতিরিক্ত খরচ বা ভুল আকর্ষণে না জড়ানোই ভালো। সংযমের সঙ্গে সৌন্দর্য উপভোগ করুন।',
    neutral:  'শুক্রের দৃষ্টি সামাজিক ও সৃজনশীল জীবনে আলো এনেছে। নতুন বন্ধুত্ব বা পরিচয় হতে পারে। সৌন্দর্যবোধ ও শিল্পকলার প্রতি আগ্রহ বাড়বে। জীবনের ছোট ছোট আনন্দগুলো উপভোগ করুন।',
    career:   'শুক্রের দৃষ্টিতে শিল্প, সংগীত, ফ্যাশন, সৌন্দর্য ও বিনোদন শিল্পে বিশেষ সাফল্য আসবে। সামাজিক সম্পর্ক ও কূটনীতির কাজে শুক্র সহায়। নতুন ক্লায়েন্ট বা অংশীদারিত্বের সুযোগ আসতে পারে।',
    health:   'শুক্রের প্রভাবে ত্বক, কিডনি ও হরমোনজনিত বিষয়ে সচেতন থাকুন। অতিরিক্ত মিষ্টি ও চর্বিজাতীয় খাবার এড়িয়ে চলুন। মন ভালো থাকলে শরীরও সুস্থ থাকে — সৌন্দর্য চর্চা মনের ওষুধ।',
    finance:  'শুক্রের দৃষ্টিতে বিলাসিতায় খরচ বাড়ার প্রবণতা থাকবে — বাজেট মেনে চলুন। সৌন্দর্য, শিল্প বা বিনোদনে বিনিয়োগ লাভজনক হতে পারে। তবে আবেগে পড়ে বড় কোনো কেনাকাটা করবেন না।',
    love:     'শুক্রের দৃষ্টি প্রেম ও সম্পর্কে সবচেয়ে মধুর আলো ফেলে। সঙ্গীর সঙ্গে ঘনিষ্ঠতা বাড়বে, আনন্দময় মুহূর্ত তৈরি হবে। নতুন প্রেমের সম্ভাবনাও উড়িয়ে দেওয়া যায় না। হৃদয়কে খোলা রাখুন।'
  }

};

// ==================== দৃষ্টির মৌলিক ফাংশন ====================

/**
 * দৃষ্টি গণনার সাধারণ ফাংশন
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @param {Array}  aspectHouses - দৃষ্টির ভাবের তালিকা
 * @returns {boolean}
 */
function hasAspect(sourceRashi, targetRashi, aspectHouses) {
  const diff = (targetRashi - sourceRashi + 12) % 12;
  return aspectHouses.includes(diff);
}

function isSaturnAspect(saturnRashi, targetRashi) {
  return hasAspect(saturnRashi, targetRashi, ASPECT_DEFINITIONS.saturn.houses);
}

function isJupiterAspect(jupiterRashi, targetRashi) {
  return hasAspect(jupiterRashi, targetRashi, ASPECT_DEFINITIONS.jupiter.houses);
}

function isMarsAspect(marsRashi, targetRashi) {
  return hasAspect(marsRashi, targetRashi, ASPECT_DEFINITIONS.mars.houses);
}

function isMercuryAspect(mercuryRashi, targetRashi) {
  return hasAspect(mercuryRashi, targetRashi, ASPECT_DEFINITIONS.mercury.houses);
}

function isVenusAspect(venusRashi, targetRashi) {
  return hasAspect(venusRashi, targetRashi, ASPECT_DEFINITIONS.venus.houses);
}

// ==================== উন্নত দৃষ্টি বিশ্লেষণ ====================

function getAspectStrengthDetailed(sourceRashi, targetRashi, planet) {
  const def = ASPECT_DEFINITIONS[planet];
  if (!def) return ASPECT_STRENGTH.weak;

  const diff = (targetRashi - sourceRashi + 12) % 12;
  if (def.houses.includes(diff)) return ASPECT_STRENGTH.full;

  // মঙ্গলের ৪র্থ ভাবে অর্ধ দৃষ্টি
  if (planet === 'mars' && diff === 4) return ASPECT_STRENGTH.half;

  return ASPECT_STRENGTH.weak;
}

function getAspectNature(planet, targetRashi, additionalFactors = {}) {
  const def = ASPECT_DEFINITIONS[planet];
  if (!def) return 'madhyama';

  const naturalNatures = {
    saturn:  'ashubha',
    jupiter: 'shubha',
    mars:    'ashubha',
    mercury: 'shubha',
    venus:   'shubha'
  };

  let nature = naturalNatures[planet] || 'madhyama';

  // উচ্চ রাশি তালিকা (0-indexed, মেষ=0 … মীন=11)
  // শুক্রের উচ্চ রাশি = মীন (11) | তুলা (6) = শুক্রের স্বক্ষেত্র, উচ্চ নয়
  const exaltationRashis = {
    sun:     0,   // মেষ
    moon:    2,   // বৃষ
    mars:    9,   // মকর
    mercury: 5,   // কন্যা
    jupiter: 3,   // কর্কট
    venus:   11,  // মীন ✓
    saturn:  6    // তুলা
  };

  if (exaltationRashis[planet] === targetRashi) {
    nature = nature === 'shubha' ? 'shubha' : 'madhyama';
  }

  return nature;
}

function getAspectAnalysis(planet, sourceRashi, targetRashi, category = 'general') {
  const has = hasAspect(sourceRashi, targetRashi, ASPECT_DEFINITIONS[planet]?.houses || []);
  if (!has) return null;

  const strength = getAspectStrengthDetailed(sourceRashi, targetRashi, planet);
  const nature   = getAspectNature(planet, targetRashi);
  const desc     = ASPECT_DESCRIPTIONS[planet];

  let text = '';
  if (desc) {
    if      (category === 'career')  text = desc.career  || desc.neutral;
    else if (category === 'health')  text = desc.health  || desc.neutral;
    else if (category === 'finance') text = desc.finance || desc.neutral;
    else if (category === 'love')    text = desc.love    || desc.neutral;
    else                             text = desc.neutral;
  }

  return {
    planet:       planet,
    planetName:   getPlanetName(planet),
    hasAspect:    true,
    strength:     strength.name,
    strengthIcon: strength.icon,
    multiplier:   strength.multiplier,
    nature:       nature,
    isShubha:     nature === 'shubha',
    isAshubha:    nature === 'ashubha',
    description:  text,
    category:     category
  };
}

function getPlanetName(planet) {
  const names = {
    saturn:  'শনি',
    jupiter: 'বৃহস্পতি',
    mars:    'মঙ্গল',
    mercury: 'বুধ',
    venus:   'শুক্র'
  };
  return names[planet] || planet;
}

// ==================== কম্বাইন্ড ফাংশন ====================

function getAllAspects(planetRashis, targetRashi) {
  return {
    saturn:  planetRashis.saturn  !== undefined ? isSaturnAspect(planetRashis.saturn,   targetRashi) : false,
    jupiter: planetRashis.jupiter !== undefined ? isJupiterAspect(planetRashis.jupiter, targetRashi) : false,
    mars:    planetRashis.mars    !== undefined ? isMarsAspect(planetRashis.mars,       targetRashi) : false,
    mercury: planetRashis.mercury !== undefined ? isMercuryAspect(planetRashis.mercury, targetRashi) : false,
    venus:   planetRashis.venus   !== undefined ? isVenusAspect(planetRashis.venus,     targetRashi) : false
  };
}

function getAllAspectsDetailed(planetRashis, targetRashi, category = 'general') {
  const results = [];
  const planets = ['saturn', 'jupiter', 'mars', 'mercury', 'venus'];

  for (const planet of planets) {
    const sourceRashi = planetRashis[planet];
    if (sourceRashi !== undefined) {
      const analysis = getAspectAnalysis(planet, sourceRashi, targetRashi, category);
      if (analysis) results.push(analysis);
    }
  }

  return results;
}

function getAspectSummary(aspects) {
  const activeAspects = [];
  if (aspects.saturn)  activeAspects.push('🪐 শনি');
  if (aspects.jupiter) activeAspects.push('♃ বৃহস্পতি');
  if (aspects.mars)    activeAspects.push('♂ মঙ্গল');
  if (aspects.mercury) activeAspects.push('☿ বুধ');
  if (aspects.venus)   activeAspects.push('♀ শুক্র');

  if (activeAspects.length === 0) return '';
  if (activeAspects.length === 1) return `${activeAspects[0]}র দৃষ্টি বিদ্যমান।`;
  return `${activeAspects.slice(0, -1).join(', ')} ও ${activeAspects.slice(-1)}র দৃষ্টি বিদ্যমান।`;
}

function getAspectText(aspects, tone = 'neutral') {
  const parts = [];
  const planets = ['saturn', 'jupiter', 'mars', 'mercury', 'venus'];

  for (const planet of planets) {
    if (aspects[planet]) {
      const desc = ASPECT_DESCRIPTIONS[planet];
      parts.push(desc[tone] || desc.neutral);
    }
  }

  return parts.join(' ');
}

function getAspectTextByCategory(aspects, category) {
  const parts = [];
  const planets = ['saturn', 'jupiter', 'mars', 'mercury', 'venus'];

  for (const planet of planets) {
    if (aspects[planet] && ASPECT_DESCRIPTIONS[planet][category]) {
      parts.push(ASPECT_DESCRIPTIONS[planet][category]);
    }
  }

  return parts.join(' ');
}

function getAspectStrengthSimple(sourceRashi, targetRashi, aspectHouses) {
  const diff = (targetRashi - sourceRashi + 12) % 12;
  return aspectHouses.includes(diff) ? 'full' : 'none';
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
