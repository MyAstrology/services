/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: utils/bengali.js
 * কাজ: বাংলা ভাষা সংক্রান্ত ইউটিলিটি ফাংশন
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

// কনস্ট্যান্ট লোড (ডিফল্ট সহ)
let BD, RAHU_SLOTS, GULIKA_SLOTS, YAMA_SLOTS;
try {
  const constants = require('./constants');
  BD = constants.BD;
  RAHU_SLOTS = constants.RAHU_SLOTS;
  GULIKA_SLOTS = constants.GULIKA_SLOTS;
  YAMA_SLOTS = constants.YAMA_SLOTS;
} catch (e) {
  // constants.js না থাকলে ডিফল্ট ব্যবহার
  BD = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  RAHU_SLOTS = [4, 2, 6, 5, 6, 4, 3];
  GULIKA_SLOTS = [6, 5, 4, 3, 2, 1, 7];
  YAMA_SLOTS = [5, 4, 3, 2, 1, 7, 6];
  console.warn('⚠️ constants.js না পাওয়ায় ডিফল্ট মান ব্যবহার করা হচ্ছে');
}

/**
 * বাংলা সংখ্যায় রূপান্তর
 * @param {number} n - ইংরেজি সংখ্যা
 * @returns {string} - বাংলা সংখ্যা
 */
function toBn(n) {
  const num = Math.abs(Math.round(n));
  return String(num).replace(/[0-9]/g, d => BD[+d]);
}

/**
 * সময় ফরম্যাট (বাংলা) – উন্নত ভার্সন
 * @param {number} h - ঘণ্টা (decimal, 0-24)
 * @returns {string} - ফরম্যাট করা সময় (যেমন: সকাল ৭:৩০)
 */
function fmtTime(h) {
  // ঘণ্টা ও মিনিট বের করা
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  
  // মিনিট ৬০ হলে ঘণ্টায় যোগ
  if (mm >= 60) {
    hh += Math.floor(mm / 60);
    mm = mm % 60;
  }
  
  // ২৪ ঘণ্টা ফরম্যাট -> ১২ ঘণ্টা ফরম্যাট
  const hour24 = hh % 24;
  const hh12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  
  // সময়ের অংশ নির্ধারণ
  let ampm;
  if (hour24 < 6) ampm = 'রাত';
  else if (hour24 < 12) ampm = 'সকাল';
  else if (hour24 < 15) ampm = 'দুপুর';
  else if (hour24 < 17) ampm = 'বিকেল';
  else if (hour24 < 20) ampm = 'সন্ধ্যা';
  else ampm = 'রাত';
  
  // মিনিট ফরম্যাট (দুই অঙ্ক)
  const mmStr = String(mm).padStart(2, '0').replace(/[0-9]/g, d => BD[+d]);
  
  return `${ampm} ${toBn(hh12)}:${mmStr}`;
}

/**
 * রাহুকাল/গুলিকাকাল/যমঘণ্টের স্লট সময় বের করা
 * @param {number} rise - সূর্যোদয়ের সময় (decimal)
 * @param {number} set - সূর্যাস্তের সময় (decimal)
 * @param {number} slot - স্লট নম্বর (1-8)
 * @returns {string} - ফরম্যাট করা সময়সীমা
 */
function slotTime(rise, set, slot) {
  const len = (set - rise) / 8;
  const start = rise + len * (slot - 1);
  const end = start + len;
  return `${fmtTime(start)} – ${fmtTime(end)}`;
}

/**
 * রাহুকাল বের করা
 * @param {number} rise - সূর্যোদয়
 * @param {number} set - সূর্যাস্ত
 * @param {number} weekday - বার (0-6, 0=রবিবার)
 * @returns {string}
 */
function getRahuKal(rise, set, weekday) {
  const slot = RAHU_SLOTS[weekday];
  return slotTime(rise, set, slot);
}

/**
 * গুলিকাকাল বের করা
 * @param {number} rise - সূর্যোদয়
 * @param {number} set - সূর্যাস্ত
 * @param {number} weekday - বার (0-6)
 * @returns {string}
 */
function getGulikaKal(rise, set, weekday) {
  const slot = GULIKA_SLOTS[weekday];
  return slotTime(rise, set, slot);
}

/**
 * যমঘণ্ট বের করা
 * @param {number} rise - সূর্যোদয়
 * @param {number} set - সূর্যাস্ত
 * @param {number} weekday - বার (0-6)
 * @returns {string}
 */
function getYamaGhanta(rise, set, weekday) {
  const slot = YAMA_SLOTS[weekday];
  return slotTime(rise, set, slot);
}

/**
 * অভিজিৎ মুহূর্ত বের করা (সূর্যোদয় ও সূর্যাস্তের মধ্যবিন্দু ±২৪ মিনিট)
 * @param {number} rise - সূর্যোদয়
 * @param {number} set - সূর্যাস্ত
 * @returns {string}
 */
function getAbhijitMuhurta(rise, set) {
  const mid = (rise + set) / 2;
  const start = mid - 24 / 60;
  const end = mid + 24 / 60;
  return `${fmtTime(start)} – ${fmtTime(end)}`;
}

module.exports = {
  toBn,
  fmtTime,
  slotTime,
  getRahuKal,
  getGulikaKal,
  getYamaGhanta,
  getAbhijitMuhurta
};
