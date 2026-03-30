/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: astronomy/planets.js
 * কাজ: গ্রহের দ্রাঘিমাংশ গণনা (সূর্য, চন্দ্র, শনি, বৃহস্পতি, রাহু)
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { JD } = require('./jd');
const { lahiriAY } = require('./ayanamsa');

/**
 * সূর্যের দ্রাঘিমাংশ (Tropical)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-৩৬০ ডিগ্রি
 */
function sunL(jd) {
  const n = jd - 2451545;
  const L = ((280.46 + 0.9856474 * n) % 360 + 360) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360 + 360) * Math.PI / 180;
  return ((L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360 + 360) % 360;
}

/**
 * চন্দ্রের দ্রাঘিমাংশ (Meeus Chapter 47, 50+ terms)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-৩৬০ ডিগ্রি
 */
function moonL(jd) {
  const T = (jd - 2451545) / 36525;
  const Lp = ((218.3164477 + 481267.88123421 * T - 0.0015786 * T * T) % 360 + 360) % 360;
  const D = ((297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) % 360 + 360) % 360;
  const Ms = ((357.5291092 + 35999.0502909 * T) % 360 + 360) % 360;
  const Mp = ((134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) % 360 + 360) % 360;
  const F = ((93.2720950 + 483202.0175233 * T - 0.0036539 * T * T) % 360 + 360) % 360;
  const E = 1 - 0.002516 * T;
  
  const dr = D * Math.PI / 180;
  const msr = Ms * Math.PI / 180;
  const mr = Mp * Math.PI / 180;
  const fr = F * Math.PI / 180;
  
  const A1 = ((119.75 + 131.849 * T) % 360 + 360) * Math.PI / 180;
  const A2 = ((53.09 + 479264.29 * T) % 360 + 360) * Math.PI / 180;
  
  let sl = 6288774 * Math.sin(mr) + 1274027 * Math.sin(2 * dr - mr) + 658314 * Math.sin(2 * dr)
    + 213618 * Math.sin(2 * mr) - 185116 * E * Math.sin(msr) - 114332 * Math.sin(2 * fr)
    + 58793 * Math.sin(2 * dr - 2 * mr) + 57066 * E * Math.sin(2 * dr - msr - mr)
    + 53322 * Math.sin(2 * dr + mr) + 45758 * E * Math.sin(2 * dr - msr)
    - 40923 * E * Math.sin(msr - mr) - 34720 * Math.sin(dr) - 30383 * E * Math.sin(msr + mr)
    + 15327 * Math.sin(2 * dr - 2 * fr) + 10675 * Math.sin(4 * dr - mr) + 10034 * Math.sin(3 * mr)
    + 8548 * Math.sin(4 * dr - 2 * mr) - 7888 * E * Math.sin(2 * dr + msr - mr)
    - 6766 * E * Math.sin(2 * dr + msr) - 5163 * Math.sin(dr - mr) + 4987 * E * Math.sin(dr + msr)
    + 4036 * E * Math.sin(2 * dr - msr + mr) + 3994 * Math.sin(2 * dr + 2 * mr) + 3861 * Math.sin(4 * dr)
    + 3665 * Math.sin(2 * dr - 3 * mr) - 2689 * E * Math.sin(msr - 2 * mr)
    + 2390 * E * Math.sin(2 * dr - msr - 2 * mr) - 2348 * Math.sin(dr + mr)
    + 2236 * E * E * Math.sin(2 * dr - 2 * msr) - 2120 * E * Math.sin(msr + 2 * mr)
    + 2048 * E * E * Math.sin(2 * dr - 2 * msr - mr) - 1773 * Math.sin(2 * dr + mr - 2 * fr)
    - 1595 * Math.sin(2 * dr + 2 * fr) + 1215 * E * Math.sin(4 * dr - msr - mr)
    - 892 * Math.sin(3 * dr - mr) - 810 * E * Math.sin(2 * dr + msr + mr)
    + 759 * E * Math.sin(4 * dr - msr - 2 * mr) + 691 * E * Math.sin(2 * dr + msr - 2 * mr)
    + 549 * Math.sin(4 * dr + mr) + 537 * Math.sin(4 * mr) + 520 * E * Math.sin(4 * dr - msr)
    + 299 * E * Math.sin(dr + msr - mr) + 294 * Math.sin(2 * dr + 3 * mr);
  
  sl += 3958 * Math.sin(A1) + 1962 * Math.sin(Lp * Math.PI / 180 - fr) + 318 * Math.sin(A2);
  
  return ((Lp + sl / 1000000) % 360 + 360) % 360;
}

/**
 * শনির দ্রাঘিমাংশ
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-৩৬০ ডিগ্রি
 */
function saturnL(jd) {
  const T = (jd - 2451545) / 36525;
  const L = ((50.077444 + 1222.113777 * T) % 360 + 360) % 360;
  const M = ((316.967 + 1221.552 * T) % 360 + 360) * Math.PI / 180;
  return ((L + 6.3585 * Math.sin(M) + 0.2204 * Math.sin(2 * M)) % 360 + 360) % 360;
}

/**
 * বৃহস্পতির দ্রাঘিমাংশ
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-৩৬০ ডিগ্রি
 */
function jupiterL(jd) {
  const T = (jd - 2451545) / 36525;
  const L = ((34.351519 + 3034.905675 * T) % 360 + 360) % 360;
  const M = ((20.9 + 3034.9 * T) % 360 + 360) * Math.PI / 180;
  return ((L + 5.5549 * Math.sin(M) + 0.1683 * Math.sin(2 * M)) % 360 + 360) % 360;
}

/**
 * রাহুর দ্রাঘিমাংশ
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-৩৬০ ডিগ্রি
 */
function rahuL(jd) {
  const T = (jd - 2451545) / 36525;
  return ((125.0445479 - 1934.1362608 * T) % 360 + 360) % 360;
}

/**
 * রাশি নির্ধারণ (নিরয়ণ)
 * @param {number} longitude - দ্রাঘিমাংশ
 * @param {number} jd - জুলিয়ান দিন
 * @returns {number} - ০-১১ (মেষ=০)
 */
function getRashiIdx(longitude, jd) {
  const ay = lahiriAY(jd);
  return Math.floor(((longitude - ay) % 360 + 360) % 360 / 30);
}

/**
 * গ্রহের গতি নির্ণয় (বক্রগতি কিনা)
 * @param {function} positionFunc - গ্রহের অবস্থান ফাংশন (sunL, moonL, ইত্যাদি)
 * @param {number} jd - জুলিয়ান দিন
 * @returns {boolean} - true if retrograde
 */
function isRetrograde(positionFunc, jd) {
  const today = positionFunc(jd);
  const tomorrow = positionFunc(jd + 1);
  const diff = tomorrow - today;
  // বক্রগতি: দ্রাঘিমাংশ কমে যায় (diff < 0)
  return diff < 0;
}

module.exports = {
  sunL,
  moonL,
  saturnL,
  jupiterL,
  rahuL,
  getRashiIdx,
  isRetrograde
};
