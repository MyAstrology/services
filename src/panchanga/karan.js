/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: panchanga/karan.js
 * কাজ: করণ গণনা
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { sunL, moonL } = require('../astronomy/planets');
const { KARANS } = require('../utils/constants');

/**
 * করণের নাম বের করা
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - করণের নাম
 */
function getKaranName(jd) {
  const diff = (moonL(jd) - sunL(jd) + 360) % 360;
  const n = Math.floor(diff / 6) % 60;
  const k = ((n % 60) + 60) % 60;
  
  if (k === 0) return KARANS[10];
  if (k === 57) return KARANS[7];
  if (k === 58) return KARANS[8];
  if (k === 59) return KARANS[9];
  return KARANS[(k - 1) % 7];
}

module.exports = { getKaranName };
