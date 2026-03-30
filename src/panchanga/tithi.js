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

module.exports = { getTithiName, getTithiShort, getTithiNumber };
