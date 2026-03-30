/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: panchanga/bengaliDate.js
 * কাজ: বাংলা তারিখ গণনা (বাংলা মাস ও বছর)
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { BN_MONTHS, EN_MONTHS, BN_WEEKDAY } = require('../utils/constants');
const { toBn } = require('../utils/bengali');

// Bengali month starts — 2024 থেকে 2030 পর্যন্ত (UTC তারিখ)
// সতর্কতা: 2030 সালের পরে নতুন বছর যোগ করতে হবে
const BMS = [
  // 1431
  { y: 1431, m: 0, s: '2024-04-14' }, { y: 1431, m: 1, s: '2024-05-15' }, { y: 1431, m: 2, s: '2024-06-15' },
  { y: 1431, m: 3, s: '2024-07-16' }, { y: 1431, m: 4, s: '2024-08-17' }, { y: 1431, m: 5, s: '2024-09-17' },
  { y: 1431, m: 6, s: '2024-10-17' }, { y: 1431, m: 7, s: '2024-11-16' }, { y: 1431, m: 8, s: '2024-12-16' },
  { y: 1431, m: 9, s: '2025-01-14' }, { y: 1431, m: 10, s: '2025-02-13' }, { y: 1431, m: 11, s: '2025-03-14' },
  // 1432
  { y: 1432, m: 0, s: '2025-04-14' }, { y: 1432, m: 1, s: '2025-05-15' }, { y: 1432, m: 2, s: '2025-06-15' },
  { y: 1432, m: 3, s: '2025-07-16' }, { y: 1432, m: 4, s: '2025-08-17' }, { y: 1432, m: 5, s: '2025-09-17' },
  { y: 1432, m: 6, s: '2025-10-17' }, { y: 1432, m: 7, s: '2025-11-16' }, { y: 1432, m: 8, s: '2025-12-16' },
  { y: 1432, m: 9, s: '2026-01-15' }, { y: 1432, m: 10, s: '2026-02-14' }, { y: 1432, m: 11, s: '2026-03-15' },
  // 1433
  { y: 1433, m: 0, s: '2026-04-15' }, { y: 1433, m: 1, s: '2026-05-15' }, { y: 1433, m: 2, s: '2026-06-15' },
  { y: 1433, m: 3, s: '2026-07-17' }, { y: 1433, m: 4, s: '2026-08-17' }, { y: 1433, m: 5, s: '2026-09-17' },
  { y: 1433, m: 6, s: '2026-10-17' }, { y: 1433, m: 7, s: '2026-11-16' }, { y: 1433, m: 8, s: '2026-12-16' },
  { y: 1433, m: 9, s: '2027-01-15' }, { y: 1433, m: 10, s: '2027-02-13' }, { y: 1433, m: 11, s: '2027-03-14' },
  // 1434
  { y: 1434, m: 0, s: '2027-04-14' }, { y: 1434, m: 1, s: '2027-05-15' }, { y: 1434, m: 2, s: '2027-06-15' },
  { y: 1434, m: 3, s: '2027-07-16' }, { y: 1434, m: 4, s: '2027-08-17' }, { y: 1434, m: 5, s: '2027-09-17' },
  { y: 1434, m: 6, s: '2027-10-17' }, { y: 1434, m: 7, s: '2027-11-16' }, { y: 1434, m: 8, s: '2027-12-16' },
  { y: 1434, m: 9, s: '2028-01-15' }, { y: 1434, m: 10, s: '2028-02-14' }, { y: 1434, m: 11, s: '2028-03-14' },
  // 1435
  { y: 1435, m: 0, s: '2028-04-13' }, { y: 1435, m: 1, s: '2028-05-14' }, { y: 1435, m: 2, s: '2028-06-14' },
  { y: 1435, m: 3, s: '2028-07-16' }, { y: 1435, m: 4, s: '2028-08-16' }, { y: 1435, m: 5, s: '2028-09-16' },
  { y: 1435, m: 6, s: '2028-10-16' }, { y: 1435, m: 7, s: '2028-11-15' }, { y: 1435, m: 8, s: '2028-12-15' },
  { y: 1435, m: 9, s: '2029-01-14' }, { y: 1435, m: 10, s: '2029-02-13' }, { y: 1435, m: 11, s: '2029-03-14' },
  // 1436
  { y: 1436, m: 0, s: '2029-04-14' }, { y: 1436, m: 1, s: '2029-05-15' }, { y: 1436, m: 2, s: '2029-06-15' },
  { y: 1436, m: 3, s: '2029-07-16' }, { y: 1436, m: 4, s: '2029-08-17' }, { y: 1436, m: 5, s: '2029-09-16' },
  { y: 1436, m: 6, s: '2029-10-16' }, { y: 1436, m: 7, s: '2029-11-15' }, { y: 1436, m: 8, s: '2029-12-15' },
  { y: 1436, m: 9, s: '2030-01-14' }, { y: 1436, m: 10, s: '2030-02-13' }, { y: 1436, m: 11, s: '2030-03-14' },
  // 1437
  { y: 1437, m: 0, s: '2030-04-14' }, { y: 1437, m: 1, s: '2030-05-15' },
];

/**
 * UTC তারিখ তৈরি করা (টাইমজোন নিরপেক্ষ)
 * @param {string} dateStr - YYYY-MM-DD ফরম্যাটে তারিখ
 * @returns {Date}
 */
function toUTCDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * বাংলা তারিখের তথ্য বের করা
 * @param {Date} date - ইংরেজি তারিখ (লোকাল)
 * @returns {Object|null} - { y, m, d, name, ritu, vikram, saka }
 */
function getBnDate(date) {
  // UTC মধ্যরাতের জন্য তারিখ তৈরি
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const t = utcDate.getTime();
  
  let idx = -1;
  for (let i = BMS.length - 1; i >= 0; i--) {
    const bmDate = toUTCDate(BMS[i].s);
    if (t >= bmDate.getTime()) {
      idx = i;
      break;
    }
  }
  
  if (idx < 0) {
    console.warn(`⚠️ বাংলা তারিখ পাওয়া যায়নি: ${date.toISOString().slice(0,10)}`);
    return null;
  }
  
  const e = BMS[idx];
  const s = toUTCDate(e.s);
  const diffDays = Math.floor((t - s.getTime()) / 86400000);
  const d = diffDays + 1;
  
  const RITU = ['গ্রীষ্ম', 'গ্রীষ্ম', 'বর্ষা', 'বর্ষা', 'শরৎ', 'শরৎ',
                'হেমন্ত', 'হেমন্ত', 'শীত', 'শীত', 'বসন্ত', 'বসন্ত'];
  
  return {
    y: e.y,
    m: e.m,
    d: d,
    name: BN_MONTHS[e.m],
    ritu: RITU[e.m],
    vikram: e.y + 57,
    saka: e.y - 78,
    // অতিরিক্ত তথ্য
    enDate: `${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`,
    weekday: BN_WEEKDAY[date.getDay()]
  };
}

/**
 * বাংলা তারিখ ফরম্যাট (সংক্ষিপ্ত)
 * @param {Date} date - ইংরেজি তারিখ
 * @returns {string}
 */
function formatBnDate(date) {
  const bn = getBnDate(date);
  if (!bn) {
    return `${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  return `${toBn(bn.d)} ${bn.name} ${toBn(bn.y)}`;
}

/**
 * বাংলা তারিখ ফরম্যাট (পূর্ণ)
 * @param {Date} date - ইংরেজি তারিখ
 * @returns {string}
 */
function formatBnDateFull(date) {
  const bn = getBnDate(date);
  const wd = BN_WEEKDAY[date.getDay()];
  if (!bn) {
    return `${wd}, ${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  return `${wd}, ${toBn(bn.d)} ${bn.name} ${toBn(bn.y)} বঙ্গাব্দ | ${date.getDate()} ${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * বাংলা তারিখ ফরম্যাট (শুধু মাস ও বছর)
 * @param {Date} date - ইংরেজি তারিখ
 * @returns {string}
 */
function formatBnMonthYear(date) {
  const bn = getBnDate(date);
  if (!bn) {
    return `${EN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
  return `${bn.name} ${toBn(bn.y)} বঙ্গাব্দ`;
}

/**
 * BMS ডেটা ভ্যালিডেশন
 * @returns {boolean}
 */
function validateBMS() {
  if (!BMS || BMS.length === 0) {
    console.error('❌ BMS ডেটা খালি!');
    return false;
  }
  
  // চেক করুন তারিখগুলো সাজানো আছে কিনা
  for (let i = 1; i < BMS.length; i++) {
    const prev = toUTCDate(BMS[i-1].s);
    const curr = toUTCDate(BMS[i].s);
    if (curr <= prev) {
      console.warn(`⚠️ BMS ডেটা সাজানো নেই: ${BMS[i-1].s} → ${BMS[i].s}`);
    }
  }
  
  console.log(`✅ BMS ভ্যালিডেটেড: ${BMS.length}টি এন্ট্রি (${BMS[0].s} থেকে ${BMS[BMS.length-1].s})`);
  return true;
}

// এক্সপোর্ট
module.exports = { 
  BMS, 
  getBnDate, 
  formatBnDate, 
  formatBnDateFull,
  formatBnMonthYear,
  validateBMS,
  toUTCDate
};
