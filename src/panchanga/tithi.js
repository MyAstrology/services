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
  const diff = (moonL(jd) - sunL(j
