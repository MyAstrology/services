/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: panchanga/nakshatra.js
 * কাজ: নক্ষত্র গণনা
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { moonL } = require('../astronomy/planets');
const { lahiriAY } = require('../astronomy/ayanamsa');
const { NAKS } = require('../utils/constants');

/**
 * নক্ষত্রের নাম বের করা
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - নক্ষত্রের নাম
 */
function getNakshatraName(jd) {
  const ay = lahiriAY(jd);
  const moonPos = moonL(jd);
  const sidereal = (moonPos - ay + 360) % 360;
  const idx = Math.floor(sidereal / (360 / 27)) % 27;
  return NAKS[idx];
}

/**
 * নক্ষত্রের পাদ (চরণ) বের করা (১-৪)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ১-৪
 */
function getNakshatraPada(jd) {
  const ay = lahiriAY(jd);
  const moonPos = moonL(jd);
  const sidereal = (moonPos - ay + 360) % 360;
  const step = 360 / 27 / 4; // প্রতিটি পাদ ৩.৩৩৩ ডিগ্রি
  return Math.floor(sidereal / step) % 4 + 1;
}

module.exports = { getNakshatraName, getNakshatraPada };
