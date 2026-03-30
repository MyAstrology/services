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
const { NAKS, NAKS_FULL } = require('../utils/constants');

// নক্ষত্রের পাদ অনুযায়ী প্রভাব (ঐচ্ছিক)
const PADA_EFFECTS = {
  1: { name: 'প্রথম পাদ', nature: 'শুভ', element: 'অগ্নি' },
  2: { name: 'দ্বিতীয় পাদ', nature: 'মধ্যম', element: 'পৃথিবী' },
  3: { name: 'তৃতীয় পাদ', nature: 'শুভ', element: 'বায়ু' },
  4: { name: 'চতুর্থ পাদ', nature: 'মধ্যম', element: 'জল' }
};

/**
 * নক্ষত্রের নাম বের করা (শুধু নাম)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {string} - নক্ষত্রের নাম
 */
function getNakshatraName(jd) {
  const ay = lahiriAY(jd);
  const moonPos = moonL(jd);
  const sidereal = (moonPos - ay + 360) % 360;
  const idx = Math.floor(sidereal / (360 / 27)) % 27;
  
  // NAKS যদি অ্যারে অফ অ্যারে হয়, তাহলে প্রথম এলিমেন্ট নেওয়া
  if (Array.isArray(NAKS[0])) {
    return NAKS[idx][0];
  }
  return NAKS[idx];
}

/**
 * নক্ষত্রের সম্পূর্ণ তথ্য (নাম, অধিপতি)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {Object} - { name, lord, index }
 */
function getNakshatraDetails(jd) {
  const ay = lahiriAY(jd);
  const moonPos = moonL(jd);
  const sidereal = (moonPos - ay + 360) % 360;
  const idx = Math.floor(sidereal / (360 / 27)) % 27;
  
  let name, lord;
  
  // NAKS_FULL থাকলে সেটি ব্যবহার করা
  if (NAKS_FULL && NAKS_FULL[idx]) {
    name = NAKS_FULL[idx][0];
    lord = NAKS_FULL[idx][1];
  } else if (Array.isArray(NAKS[0])) {
    name = NAKS[idx][0];
    lord = NAKS[idx][1];
  } else {
    name = NAKS[idx];
    lord = '—';
  }
  
  return {
    name: name,
    lord: lord,
    index: idx,
    siderealDeg: sidereal.toFixed(2),
    range: {
      start: (idx * 360 / 27).toFixed(2),
      end: ((idx + 1) * 360 / 27).toFixed(2)
    }
  };
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

/**
 * নক্ষত্রের পাদ বিস্তারিত তথ্য
 * @param {number} jd - জুলিয়ান দিন
 * @returns {Object} - { pada, name, nature, element, degrees }
 */
function getNakshatraPadaDetails(jd) {
  const pada = getNakshatraPada(jd);
  const nakshatra = getNakshatraDetails(jd);
  const ay = lahiriAY(jd);
  const moonPos = moonL(jd);
  const sidereal = (moonPos - ay + 360) % 360;
  const step = 360 / 27 / 4;
  const padaStart = Math.floor(sidereal / step) * step;
  const padaEnd = padaStart + step;
  
  return {
    pada: pada,
    nakshatra: nakshatra.name,
    nakshatraLord: nakshatra.lord,
    name: PADA_EFFECTS[pada]?.name || `পাদ ${pada}`,
    nature: PADA_EFFECTS[pada]?.nature || 'মধ্যম',
    element: PADA_EFFECTS[pada]?.element || '—',
    degrees: {
      start: padaStart.toFixed(2),
      end: padaEnd.toFixed(2),
      current: sidereal.toFixed(2)
    }
  };
}

/**
 * নক্ষত্রের সূচক বের করা (০-২৬)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-২৬
 */
function getNakshatraIndex(jd) {
  const ay = lahiriAY(jd);
  const moonPos = moonL(jd);
  const sidereal = (moonPos - ay + 360) % 360;
  return Math.floor(sidereal / (360 / 27)) % 27;
}

module.exports = { 
  getNakshatraName, 
  getNakshatraPada,
  getNakshatraDetails,
  getNakshatraPadaDetails,
  getNakshatraIndex
};
