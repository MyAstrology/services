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
const { YOGAS, YOGAS_FULL } = require('../utils/constants');

// যোগের বিস্তারিত তথ্য (যদি constants.js-এ YOGAS_FULL না থাকে)
const YOGA_DETAILS = {
  'বিষ্কুম্ভ': { nature: 'অশুভ', meaning: 'বাধা, অশান্তি' },
  'প্রীতি': { nature: 'শুভ', meaning: 'স্নেহ, আনন্দ' },
  'আয়ুষ্মান': { nature: 'শুভ', meaning: 'দীর্ঘায়ু, স্বাস্থ্য' },
  'সৌভাগ্য': { nature: 'শুভ', meaning: 'ভাগ্যোদয়' },
  'শোভন': { nature: 'শুভ', meaning: 'শোভা, সৌন্দর্য' },
  'অতিগণ্ড': { nature: 'অশুভ', meaning: 'বিপদ, সংকট' },
  'সুকর্মা': { nature: 'শুভ', meaning: 'সৎকর্ম, সাফল্য' },
  'ধৃতি': { nature: 'শুভ', meaning: 'ধৈর্য, স্থিরতা' },
  'শূল': { nature: 'অশুভ', meaning: 'শূল, যন্ত্রণা' },
  'গণ্ড': { nature: 'অশুভ', meaning: 'গণ্ডগোল, বাধা' },
  'বৃদ্ধি': { nature: 'শুভ', meaning: 'বৃদ্ধি, সমৃদ্ধি' },
  'ধ্রুব': { nature: 'শুভ', meaning: 'স্থিরতা, নিশ্চয়তা' },
  'ব্যাঘাত': { nature: 'অশুভ', meaning: 'বাধা, বিপত্তি' },
  'হর্ষণ': { nature: 'শুভ', meaning: 'আনন্দ, উল্লাস' },
  'বজ্র': { nature: 'অশুভ', meaning: 'বজ্রপাত, ধাক্কা' },
  'সিদ্ধি': { nature: 'শুভ', meaning: 'সিদ্ধি, সফলতা' },
  'ব্যতীপাত': { nature: 'অশুভ', meaning: 'বিপর্যয়, দুর্ঘটনা' },
  'বরীয়ান': { nature: 'শুভ', meaning: 'শ্রেষ্ঠতা, উন্নতি' },
  'পরিঘ': { nature: 'অশুভ', meaning: 'বাধা, সীমাবদ্ধতা' },
  'শিব': { nature: 'শুভ', meaning: 'মঙ্গল, শুভ' },
  'সিদ্ধ': { nature: 'শুভ', meaning: 'সিদ্ধি, সাফল্য' },
  'সাধ্য': { nature: 'শুভ', meaning: 'সাধন, সম্ভাবনা' },
  'শুভ': { nature: 'শুভ', meaning: 'মঙ্গল, কল্যাণ' },
  'শুক্ল': { nature: 'শুভ', meaning: 'শুভ্রতা, পবিত্রতা' },
  'ব্রহ্ম': { nature: 'শুভ', meaning: 'ব্রহ্মত্ব, জ্ঞান' },
  'ইন্দ্র': { nature: 'শুভ', meaning: 'ঐশ্বর্য, ক্ষমতা' },
  'বৈধৃতি': { nature: 'অশুভ', meaning: 'বিধি, সীমাবদ্ধতা' }
};

/**
 * যোগের সূচক বের করা (০-২৬)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-২৬
 */
function getYogaIndex(jd) {
  const ay = lahiriAY(jd);
  const sunPos = sunL(jd);
  const moonPos = moonL(jd);
  const sum = (sunPos - ay + moonPos - ay + 720) % 360;
  return Math.floor(sum / (360 / 27)) % 27;
}

/**
 * যোগের নাম বের করা
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - যোগের নাম
 */
function getYogaName(jd) {
  const idx = getYogaIndex(jd);
  
  // YOGAS যদি অ্যারে অফ অ্যারে হয়, তাহলে প্রথম এলিমেন্ট নেওয়া
  if (Array.isArray(YOGAS[0])) {
    return YOGAS[idx][0];
  }
  return YOGAS[idx];
}

/**
 * যোগের বিস্তারিত তথ্য
 * @param {number} jd - জুলিয়ান দিন
 * @returns {Object} - { name, index, nature, symbol, meaning, degreeRange }
 */
function getYogaDetails(jd) {
  const idx = getYogaIndex(jd);
  const step = 360 / 27;
  const startDeg = idx * step;
  const endDeg = (idx + 1) * step;
  
  let name, symbol, nature, meaning;
  
  // YOGAS_FULL থাকলে সেটি ব্যবহার করা
  if (YOGAS_FULL && YOGAS_FULL[idx]) {
    name = YOGAS_FULL[idx][0];
    symbol = YOGAS_FULL[idx][1];
  } else if (Array.isArray(YOGAS[0])) {
    name = YOGAS[idx][0];
    symbol = YOGAS[idx][1];
  } else {
    name = YOGAS[idx];
    symbol = '';
  }
  
  // যোগের প্রকৃতি ও অর্থ
  const details = YOGA_DETAILS[name] || { nature: 'মধ্যম', meaning: '—' };
  nature = details.nature;
  meaning = details.meaning;
  
  return {
    name: name,
    index: idx,
    symbol: symbol,
    nature: nature,
    isShubha: nature === 'শুভ',
    isAshubha: nature === 'অশুভ',
    meaning: meaning,
    degreeRange: {
      start: startDeg.toFixed(2),
      end: endDeg.toFixed(2),
      current: ((idx * step) + (step / 2)).toFixed(2)
    }
  };
}

/**
 * যোগের শুভ/অশুভ নির্ণয়
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - 'shubha', 'ashubha', 'madhyama'
 */
function getYogaShubha(jd) {
  const details = getYogaDetails(jd);
  if (details.isShubha) return 'shubha';
  if (details.isAshubha) return 'ashubha';
  return 'madhyama';
}

module.exports = { 
  getYogaName, 
  getYogaIndex,
  getYogaDetails,
  getYogaShubha
};
