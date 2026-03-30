/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: gochar/aspectEffects.js
 * কাজ: গ্রহের দৃষ্টির ভিত্তিতে রাশিফলের টেক্সট কাস্টমাইজেশন
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

/**
 * বৃহস্পতির দৃষ্টির প্রভাব টেক্সট (ভাব অনুযায়ী ভিন্ন)
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @returns {string}
 */
function getJupiterAspectText(category) {
  const texts = {
    love: ' বৃহস্পতির দৃষ্টিতে সম্পর্কে সম্প্রসারণ ও বিশ্বাস বৃদ্ধি পাবে। প্রেমে আধ্যাত্মিকতা আসবে।',
    work: ' বৃহস্পতির আশীর্বাদে কর্মক্ষেত্রে সাফল্য ও উন্নতির সুযোগ আসবে। গুরুর সহায়তা পাবেন।',
    health: ' বৃহস্পতির দৃষ্টিতে স্বাস্থ্যের উন্নতি হবে। রোগ প্রতিরোধ ক্ষমতা বাড়বে।',
    finance: ' বৃহস্পতির দৃষ্টিতে আর্থিক লাভ ও সম্প্রসারণের সুযোগ আসবে। বিনিয়োগে সাফল্য।'
  };
  return texts[category] || texts.work;
}

/**
 * শনির দৃষ্টির প্রভাব টেক্সট (ভাব অনুযায়ী ভিন্ন)
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @returns {string}
 */
function getSaturnAspectText(category) {
  const texts = {
    love: ' শনির দৃষ্টিতে সম্পর্কে ধৈর্য ও দায়িত্ববোধ বাড়বে। তবে প্রকাশে সংযম প্রয়োজন।',
    work: ' শনির দৃষ্টিতে পরিশ্রম বাড়বে, ফল পেতে বিলম্ব হবে। ধৈর্য ধরলে সাফল্য আসবে।',
    health: ' শনির দৃষ্টিতে হাড়, জয়েন্ট ও দীর্ঘস্থায়ী রোগে সতর্কতা প্রয়োজন। নিয়মিত ব্যায়াম করুন।',
    finance: ' শনির দৃষ্টিতে সঞ্চয় ও ব্যয়ের ভারসাম্য রাখুন। দীর্ঘমেয়াদী বিনিয়োগে লাভ।'
  };
  return texts[category] || texts.work;
}

/**
 * মঙ্গলের দৃষ্টির প্রভাব টেক্সট (ভবিষ্যতে ব্যবহারের জন্য)
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @returns {string}
 */
function getMarsAspectText(category) {
  const texts = {
    love: ' মঙ্গলের দৃষ্টিতে সম্পর্কে উত্তেজনা ও আবেগ বাড়বে। তবে রাগ নিয়ন্ত্রণে রাখুন।',
    work: ' মঙ্গলের দৃষ্টিতে কর্মক্ষেত্রে প্রতিযোগিতা ও শক্তি বাড়বে। উদ্যোগ নিয়ে সাফল্য।',
    health: ' মঙ্গলের দৃষ্টিতে রক্তচাপ ও প্রদাহজনিত সমস্যা হতে পারে। সতর্ক থাকুন।',
    finance: ' মঙ্গলের দৃষ্টিতে আর্থিক ঝুঁকি নেওয়ার সময়। তবে হিসাব করে বিনিয়োগ করুন।'
  };
  return texts[category] || texts.work;
}

/**
 * বুধের দৃষ্টির প্রভাব টেক্সট (ভবিষ্যতে ব্যবহারের জন্য)
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @returns {string}
 */
function getMercuryAspectText(category) {
  const texts = {
    love: ' বুধের দৃষ্টিতে সম্পর্কে যোগাযোগ ও বোঝাপড়া বাড়বে। প্রিয়জনের সাথে মধুর সম্পর্ক।',
    work: ' বুধের দৃষ্টিতে ব্যবসা ও যোগাযোগে সাফল্য। আলোচনা ও চুক্তিতে সুবিধা।',
    health: ' বুধের দৃষ্টিতে স্নায়ুতন্ত্র ও শ্বাসতন্ত্রে যত্ন নিন।',
    finance: ' বুধের দৃষ্টিতে ছোট বিনিয়োগ ও লেনদেনে লাভ। ব্যবসায়িক যোগাযোগে সুবিধা।'
  };
  return texts[category] || texts.work;
}

/**
 * শুক্রের দৃষ্টির প্রভাব টেক্সট (ভবিষ্যতে ব্যবহারের জন্য)
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @returns {string}
 */
function getVenusAspectText(category) {
  const texts = {
    love: ' শুক্রের দৃষ্টিতে প্রেম ও রোমান্সে ভরপুর দিন। সম্পর্কে মাধুর্য আসবে।',
    work: ' শুক্রের দৃষ্টিতে সৃজনশীল কাজে সাফল্য। শিল্প ও সৌন্দর্য সংক্রান্ত কাজে লাভ।',
    health: ' শুক্রের দৃষ্টিতে ত্বক ও হরমোনজনিত সমস্যা হতে পারে। সতর্ক থাকুন।',
    finance: ' শুক্রের দৃষ্টিতে বিলাসিতা ও আনন্দে খরচ বাড়বে। বাজেট মেনে চলুন।'
  };
  return texts[category] || texts.work;
}

/**
 * দৃষ্টির ভিত্তিতে প্রেমের ফল কাস্টমাইজ (উন্নত)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য { saturn, jupiter, mars, mercury, venus }
 * @returns {string}
 */
function enhanceLoveText(baseText, aspects) {
  let text = baseText;
  const additions = [];
  
  if (aspects.jupiter) additions.push(getJupiterAspectText('love'));
  if (aspects.saturn) additions.push(getSaturnAspectText('love'));
  if (aspects.mars) additions.push(getMarsAspectText('love'));
  if (aspects.mercury) additions.push(getMercuryAspectText('love'));
  if (aspects.venus) additions.push(getVenusAspectText('love'));
  
  // একাধিক দৃষ্টি থাকলে সংক্ষেপে যুক্ত করা
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে কর্মের ফল কাস্টমাইজ (উন্নত)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function enhanceWorkText(baseText, aspects) {
  let text = baseText;
  const additions = [];
  
  if (aspects.jupiter) additions.push(getJupiterAspectText('work'));
  if (aspects.saturn) additions.push(getSaturnAspectText('work'));
  if (aspects.mars) additions.push(getMarsAspectText('work'));
  if (aspects.mercury) additions.push(getMercuryAspectText('work'));
  if (aspects.venus) additions.push(getVenusAspectText('work'));
  
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে স্বাস্থ্যের ফল কাস্টমাইজ (উন্নত)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function enhanceHealthText(baseText, aspects) {
  let text = baseText;
  const additions = [];
  
  if (aspects.jupiter) additions.push(getJupiterAspectText('health'));
  if (aspects.saturn) additions.push(getSaturnAspectText('health'));
  if (aspects.mars) additions.push(getMarsAspectText('health'));
  if (aspects.mercury) additions.push(getMercuryAspectText('health'));
  if (aspects.venus) additions.push(getVenusAspectText('health'));
  
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে আর্থিক ফল কাস্টমাইজ (উন্নত)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function enhanceFinanceText(baseText, aspects) {
  let text = baseText;
  const additions = [];
  
  if (aspects.jupiter) additions.push(getJupiterAspectText('finance'));
  if (aspects.saturn) additions.push(getSaturnAspectText('finance'));
  if (aspects.mars) additions.push(getMarsAspectText('finance'));
  if (aspects.mercury) additions.push(getMercuryAspectText('finance'));
  if (aspects.venus) additions.push(getVenusAspectText('finance'));
  
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির সংক্ষিপ্ত বিবরণ তৈরি
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function getAspectSummary(aspects) {
  const activeAspects = [];
  if (aspects.jupiter) activeAspects.push('♃ বৃহস্পতি');
  if (aspects.saturn) activeAspects.push('🪐 শনি');
  if (aspects.mars) activeAspects.push('♂ মঙ্গল');
  if (aspects.mercury) activeAspects.push('☿ বুধ');
  if (aspects.venus) activeAspects.push('♀ শুক্র');
  
  if (activeAspects.length === 0) return '';
  if (activeAspects.length === 1) return `${activeAspects[0]}র দৃষ্টি বিদ্যমান।`;
  return `${activeAspects.join(', ')}র দৃষ্টি বিদ্যমান।`;
}

module.exports = {
  enhanceLoveText,
  enhanceWorkText,
  enhanceHealthText,
  enhanceFinanceText,
  getAspectSummary,
  // পৃথক গ্রহের টেক্সট ফাংশন (প্রয়োজনে ব্যবহারের জন্য)
  getJupiterAspectText,
  getSaturnAspectText,
  getMarsAspectText,
  getMercuryAspectText,
  getVenusAspectText
};
