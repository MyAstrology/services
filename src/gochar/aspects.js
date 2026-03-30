/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: gochar/aspects.js
 * কাজ: গ্রহের দৃষ্টি (aspect) গণনা – শনি ও বৃহস্পতি
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { RASHI_NAMES } = require('../utils/constants');

/**
 * শনির দৃষ্টি (3, 7, 10 – পূর্ণ দৃষ্টি)
 * @param {number} saturnRashi - শনির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isSaturnAspect(saturnRashi, targetRashi) {
  const diff = (targetRashi - saturnRashi + 12) % 12;
  return diff === 3 || diff === 7 || diff === 10;
}

/**
 * বৃহস্পতির দৃষ্টি (5, 7, 9 – পূর্ণ দৃষ্টি)
 * @param {number} jupiterRashi - বৃহস্পতির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isJupiterAspect(jupiterRashi, targetRashi) {
  const diff = (targetRashi - jupiterRashi + 12) % 12;
  return diff === 5 || diff === 7 || diff === 9;
}

/**
 * দৃষ্টির প্রভাব বর্ণনা
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function getAspectText(aspects) {
  const parts = [];
  if (aspects.saturn) parts.push('🪐 শনির দৃষ্টি: ধৈর্য ও বিলম্বের সম্ভাবনা');
  if (aspects.jupiter) parts.push('♃ বৃহস্পতির দৃষ্টি: শুভ ফল, সম্প্রসারণ');
  if (parts.length === 0) return '';
  return parts.join(' · ');
}

module.exports = {
  isSaturnAspect,
  isJupiterAspect,
  getAspectText
};
