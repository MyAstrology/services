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

const { BD, RAHU_SLOTS, GULIKA_SLOTS, YAMA_SLOTS } = require('./constants');

/**
 * বাংলা সংখ্যায় রূপান্তর
 * @param {number} n - ইংরেজি সংখ্যা
 * @returns {string} - বাংলা সংখ্যা
 */
function toBn(n) {
  return String(Math.abs(Math.round(n))).replace(/[0-9]/g, d => BD[+d]);
}

/**
 * সময় ফরম্যাট (বাংলা)
 * @param {number} h - ঘণ্টা (decimal)
 * @returns {string} - ফরম্যাট করা সময় (যেমন: সকাল ৭:৩০)
 */
function fmtTime(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const hh12 = hh % 12 === 0 ? 12 : hh % 12;
  
  let ampm;
  if (hh < 6) ampm = 'রাত';
  else if (hh < 12) ampm = 'সকাল';
  else if (hh < 15) ampm = 'দুপুর';
  else if (hh < 17) ampm = 'বিকেল';
  else if (hh < 20) ampm = 'সন্ধ্যা';
  else ampm = 'রাত';
  
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
  return slotTime(rise, set, RAHU_SLOTS[weekday]);
}

/**
 * গুলিকাকাল বের করা
 * @param {number} rise - সূর্যোদয়
 * @param {number} set - সূর্যাস্ত
 * @param {number} weekday - বার (0-6)
 * @returns {string}
 */
function getGulikaKal(rise, set, weekday) {
  return slotTime(rise, set, GULIKA_SLOTS[weekday]);
}

/**
 * যমঘণ্ট বের করা
 * @param {number} rise - সূর্যোদয়
 * @param {number} set - সূর্যাস্ত
 * @param {number} weekday - বার (0-6)
 * @returns {string}
 */
function getYamaGhanta(rise, set, weekday) {
  return slotTime(rise, set, YAMA_SLOTS[weekday]);
}

/**
 * অভিজিৎ মুহূর্ত বের করা (সূর্যোদয় ও সূর্যাস্তের মধ্যবিন্দু ±২৪ মিনিট)
 * @param {number} rise - সূর্যোদয়
 * @param {number} set - सूर्यास्त
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
