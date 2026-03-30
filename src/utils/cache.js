/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: utils/cache.js
 * কাজ: গ্রহের অবস্থান ক্যাশিং – দ্বিতীয়বার জেনারেট করলে দ্রুত
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const fs = require('fs');
const path = require('path');  // ← যোগ করা হয়েছে

/**
 * ক্যাশ থেকে ডেটা পড়া
 * @param {string} cacheDir - ক্যাশ ডিরেক্টরি
 * @param {string} dateStr - তারিখ (YYYY-MM-DD)
 * @returns {Object|null}
 */
function readCache(cacheDir, dateStr) {
  const cacheFile = path.join(cacheDir, `planets-${dateStr}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      console.log(`📖 ক্যাশ থেকে পড়া: ${cacheFile}`);
      return data;
    } catch (e) {
      console.warn(`⚠️ ক্যাশ পড়তে সমস্যা: ${cacheFile} - ${e.message}`);
      return null;
    }
  }
  return null;
}

/**
 * ক্যাশে ডেটা লেখা
 * @param {string} cacheDir - ক্যাশ ডিরেক্টরি
 * @param {string} dateStr - তারিখ (YYYY-MM-DD)
 * @param {Object} data - সংরক্ষণযোগ্য ডেটা
 */
function writeCache(cacheDir, dateStr, data) {
  // ক্যাশ ডিরেক্টরি তৈরি (যদি না থাকে)
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  const cacheFile = path.join(cacheDir, `planets-${dateStr}.json`);
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ ক্যাশ সংরক্ষিত: ${cacheFile}`);
  } catch (e) {
    console.warn(`⚠️ ক্যাশ লেখতে সমস্যা: ${cacheFile} - ${e.message}`);
  }
}

/**
 * ক্যাশ ফাইল মুছে ফেলা (ঐচ্ছিক – ডিবাগের জন্য)
 * @param {string} cacheDir - ক্যাশ ডিরেক্টরি
 * @param {string} dateStr - তারিখ (YYYY-MM-DD)
 */
function deleteCache(cacheDir, dateStr) {
  const cacheFile = path.join(cacheDir, `planets-${dateStr}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      fs.unlinkSync(cacheFile);
      console.log(`🗑️ ক্যাশ মুছে ফেলা: ${cacheFile}`);
    } catch (e) {
      console.warn(`⚠️ ক্যাশ মুছতে সমস্যা: ${cacheFile}`);
    }
  }
}

module.exports = { readCache, writeCache, deleteCache };
