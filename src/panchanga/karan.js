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
const { KARANS, KARANS_FULL } = require('../utils/constants');

// করণের ধরন সংক্রান্ত তথ্য (যদি constants.js-এ KARANS_FULL না থাকে)
const KARAN_TYPES = {
  'বব': 'চর', 'বালব': 'চর', 'কৌলব': 'চর', 'তৈতিল': 'চর',
  'গর': 'চর', 'বণিজ': 'চর', 'বিষ্টি': 'স্থির',
  'শকুনি': 'স্থির', 'চতুষ্পাদ': 'স্থির', 'নাগ': 'স্থির', 'কিংস্তুঘ্ন': 'স্থির'
};

/**
 * করণের নাম বের করা (শুধু নাম)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - করণের নাম
 */
function getKaranName(jd) {
  const diff = (moonL(jd) - sunL(jd) + 360) % 360;
  const n = Math.floor(diff / 6) % 60;
  const k = ((n % 60) + 60) % 60;
  
  // করণ নম্বর ০-৫৯
  // নিয়ম: ১-৭: পুনরাবৃত্তি, ৮-৫৬: প্রথম ৭টির পুনরাবৃত্তি, ৫৭-৫৯: স্থির করণ
  if (k === 0) return KARANS[10];      // ০ = ৬০তম করণ = কিংস্তুঘ্ন
  if (k === 57) return KARANS[7];      // ৫৭ = শকুনি
  if (k === 58) return KARANS[8];      // ৫৮ = চতুষ্পাদ
  if (k === 59) return KARANS[9];      // ৫৯ = নাগ
  return KARANS[(k - 1) % 7];          // ১-৫৬: প্রথম ৭টির পুনরাবৃত্তি
}

/**
 * করণের নাম ও ধরন বের করা (বিস্তারিত)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {Object} - { name, type, isChara, isSthira }
 */
function getKaranDetails(jd) {
  const name = getKaranName(jd);
  
  // KARANS_FULL থাকলে সেখান থেকে ধরন নেওয়া
  let type = KARAN_TYPES[name] || 'চর';
  if (KARANS_FULL) {
    const found = KARANS_FULL.find(k => k[0] === name);
    if (found) type = found[1];
  }
  
  return {
    name: name,
    type: type,
    isChara: type === 'চর',
    isSthira: type === 'স্থির'
  };
}

/**
 * করণের সংখ্যা বের করা (০-৫৯)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - করণ সংখ্যা (০-৫৯)
 */
function getKaranNumber(jd) {
  const diff = (moonL(jd) - sunL(jd) + 360) % 360;
  return Math.floor(diff / 6) % 60;
}

/**
 * করণের শুভ/অশুভ নির্ণয় (বৈদিক জ্যোতিষ অনুযায়ী)
 * @param {string} karanName - করণের নাম
 * @returns {string} - 'shubha', 'ashubha', 'madhyama'
 */
function getKaranShubha(karanName) {
  // সাধারণত: বব, বালব, কৌলব, তৈতিল, গর, বণিজ - শুভ
  // বিশিষ্টি, শকুনি, চতুষ্পাদ, নাগ, কিংস্তুঘ্ন - অশুভ
  const shubhaList = ['বব', 'বালব', 'কৌলব', 'তৈতিল', 'গর', 'বণিজ'];
  if (shubhaList.includes(karanName)) return 'shubha';
  return 'ashubha';
}

module.exports = { 
  getKaranName, 
  getKaranDetails, 
  getKaranNumber,
  getKaranShubha
};
