/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: panchanga/tithi.js
 * কাজ: তিথি গণনা
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { sunL, moonL } = require('../astronomy/planets');
const { TNAMES } = require('../utils/constants');

// তিথির বিশেষ নাম (ঐচ্ছিক)
const TITHI_SPECIAL = {
  1: { name: 'প্রতিপদ', type: 'শুভ' },
  2: { name: 'দ্বিতীয়া', type: 'শুভ' },
  3: { name: 'তৃতীয়া', type: 'শুভ' },
  4: { name: 'চতুর্থী', type: 'মধ্যম' },
  5: { name: 'পঞ্চমী', type: 'শুভ' },
  6: { name: 'ষষ্ঠী', type: 'মধ্যম' },
  7: { name: 'সপ্তমী', type: 'শুভ' },
  8: { name: 'অষ্টমী', type: 'অশুভ' },
  9: { name: 'নবমী', type: 'শুভ' },
  10: { name: 'দশমী', type: 'শুভ' },
  11: { name: 'একাদশী', type: 'অতি শুভ' },
  12: { name: 'দ্বাদশী', type: 'শুভ' },
  13: { name: 'ত্রয়োদশী', type: 'মধ্যম' },
  14: { name: 'চতুর্দশী', type: 'অশুভ' },
  15: { name: 'পূর্ণিমা', type: 'অতি শুভ' },
  16: { name: 'প্রতিপদ', type: 'শুভ' },
  17: { name: 'দ্বিতীয়া', type: 'শুভ' },
  18: { name: 'তৃতীয়া', type: 'শুভ' },
  19: { name: 'চতুর্থী', type: 'মধ্যম' },
  20: { name: 'পঞ্চমী', type: 'শুভ' },
  21: { name: 'ষষ্ঠী', type: 'মধ্যম' },
  22: { name: 'সপ্তমী', type: 'শুভ' },
  23: { name: 'অষ্টমী', type: 'অশুভ' },
  24: { name: 'নবমী', type: 'শুভ' },
  25: { name: 'দশমী', type: 'শুভ' },
  26: { name: 'একাদশী', type: 'অতি শুভ' },
  27: { name: 'দ্বাদশী', type: 'শুভ' },
  28: { name: 'ত্রয়োদশী', type: 'মধ্যম' },
  29: { name: 'চতুর্দশী', type: 'অশুভ' },
  30: { name: 'অমাবস্যা', type: 'অশুভ' }
};

/**
 * তিথির নাম (পক্ষসহ) বের করা
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - যেমন "শুক্লপক্ষ একাদশী"
 */
function getTithiName(jd) {
  const diff = (moonL(jd) - sunL(jd) + 360) % 360;
  const idx = Math.floor(diff / 12) % 30;
  const paksha = idx < 15 ? 'শুক্লপক্ষ' : 'কৃষ্ণপক্ষ';
  return `${paksha} ${TNAMES[idx]}`;
}

/**
 * শুধু তিথির নাম (পক্ষ ছাড়া) – FAQ-তে ব্যবহারের জন্য
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - যেমন "একাদশী"
 */
function getTithiShort(jd) {
  const diff = (moonL(jd) - sunL(jd) + 360) % 360;
  const idx = Math.floor(diff / 12) % 30;
  return TNAMES[idx];
}

/**
 * তিথির সংখ্যা (১-৩০) বের করা
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ১-৩০
 */
function getTithiNumber(jd) {
  const diff = (moonL(jd) - sunL(jd) + 360) % 360;
  return Math.floor(diff / 12) % 30 + 1;
}

/**
 * তিথির বিস্তারিত তথ্য
 * @param {number} jd - জুলিয়ান দিন
 * @returns {Object} - { number, name, paksha, fullName, type, isShukla, isKrishna }
 */
function getTithiDetails(jd) {
  const diff = (moonL(jd) - sunL(jd) + 360) % 360;
  const idx = Math.floor(diff / 12) % 30;
  const number = idx + 1;
  const paksha = idx < 15 ? 'শুক্লপক্ষ' : 'কৃষ্ণপক্ষ';
  const name = TNAMES[idx];
  const fullName = `${paksha} ${name}`;
  const special = TITHI_SPECIAL[number] || { type: 'মধ্যম' };
  
  // বিশেষ তিথি চিহ্নিত করা
  let specialTag = '';
  if (number === 15) specialTag = 'পূর্ণিমা';
  else if (number === 30) specialTag = 'অমাবস্যা';
  else if (number === 11 || number === 26) specialTag = 'একাদশী';
  
  return {
    number: number,
    name: name,
    paksha: paksha,
    fullName: fullName,
    type: special.type,
    specialTag: specialTag,
    isShukla: idx < 15,
    isKrishna: idx >= 15,
    isPurnima: number === 15,
    isAmavasya: number === 30,
    isEkadashi: number === 11 || number === 26,
    degreeDiff: diff.toFixed(2)
  };
}

/**
 * তিথির শেষ সময় (পরবর্তী তিথি কখন শুরু হবে) – আনুমানিক গণনা
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - জুলিয়ান দিনে তিথির শেষ সময়
 */
function getTithiEndTime(jd) {
  const currentDiff = (moonL(jd) - sunL(jd) + 360) % 360;
  const targetDiff = Math.floor(currentDiff / 12) * 12 + 12;
  if (targetDiff >= 360) return jd + 1; // পরের দিনের জন্য
  
  // আনুমানিক: চন্দ্র ও সূর্যের গতির পার্থক্য ~12° প্রতি ~24 ঘণ্টা
  const diffNeeded = targetDiff - currentDiff;
  const hoursNeeded = (diffNeeded / 12) * 24;
  return jd + hoursNeeded / 24;
}

/**
 * তিথির শুভ/অশুভ নির্ণয় (মুহূর্ত শাস্ত্র অনুযায়ী)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - 'shubha', 'ashubha', 'ati_shubha', 'madhyama'
 */
function getTithiShubha(jd) {
  const details = getTithiDetails(jd);
  
  // অতি শুভ তিথি
  if (details.isPurnima || details.isEkadashi) return 'ati_shubha';
  
  // শুভ তিথি
  const shubhaNumbers = [1, 2, 3, 5, 7, 9, 10, 11, 12, 15, 16, 17, 18, 20, 22, 24, 25, 26, 27];
  if (shubhaNumbers.includes(details.number)) return 'shubha';
  
  // অশুভ তিথি
  const ashubhaNumbers = [4, 6, 8, 13, 14, 19, 21, 23, 28, 29, 30];
  if (ashubhaNumbers.includes(details.number)) return 'ashubha';
  
  return 'madhyama';
}

module.exports = { 
  getTithiName, 
  getTithiShort, 
  getTithiNumber,
  getTithiDetails,
  getTithiEndTime,
  getTithiShubha
};
