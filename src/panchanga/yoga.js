/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: panchanga/yoga.js
 * কাজ: যোগ গণনা
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { sunL, moonL } = require('../astronomy/planets');
const { lahiriAY } = require('../astronomy/ayanamsa');
const { YOGAS } = require('../utils/constants');

/**
 * যোগের নাম বের করা
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - যোগের নাম
 */
function getYogaName(jd) {
  const ay = lahiriAY(jd);
  const sunPos = sunL(jd);
  const moonPos = moonL(jd);
  const sum = (sunPos - ay + moonPos - ay + 720) % 360;
  const idx = Math.floor(sum / (360 / 27)) % 27;
  return YOGAS[idx];
}

module.exports = { getYogaName };
