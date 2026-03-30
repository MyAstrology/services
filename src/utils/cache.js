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
const path = require('path');

// ক্যাশ ফাইল রাখার সর্বোচ্চ সংখ্যা (ঐচ্ছিক)
const MAX_CACHE_FILES = 30;

/**
 * নিরাপদে JSON স্ট্রিংয়ে রূপান্তর (সার্কুলার রেফারেন্স হ্যান্ডেল)
 * @param {Object} obj - অবজেক্ট
 * @returns {string}
 */
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, 2);
}

/**
 * পুরনো ক্যাশ ফাইল মুছে ফেলা (সর্বোচ্চ MAX_CACHE_FILES রাখতে)
 * @param {string} cacheDir - ক্যাশ ডিরেক্টরি
 */
function cleanupOldCache(cacheDir) {
  try {
    if (!fs.existsSync(cacheDir)) return;
    
    const files = fs.readdirSync(cacheDir)
      .filter(f => f.startsWith('planets-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(cacheDir, f),
        mtime: fs.statSync(path.join(cacheDir, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime); // নতুন থেকে পুরনো
    
    // সর্বোচ্চ MAX_CACHE_FILES-এর বেশি হলে পুরনো ফাইল মুছে ফেলো
    if (files.length > MAX_CACHE_FILES) {
      const toDelete = files.slice(MAX_CACHE_FILES);
      toDelete.forEach(file => {
        try {
          fs.unlinkSync(file.path);
          console.log(`🗑️ পুরনো ক্যাশ মুছে ফেলা: ${file.name}`);
        } catch (e) {
          console.warn(`⚠️ পুরনো ক্যাশ মুছতে সমস্যা: ${file.name}`);
        }
      });
    }
  } catch (e) {
    console.warn(`⚠️ ক্যাশ ক্লিনআপ ব্যর্থ: ${e.message}`);
  }
}

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
      // ক্যাশ ফাইল করাপ্ট হলে মুছে ফেলি
      try {
        fs.unlinkSync(cacheFile);
        console.log(`🗑️ করাপ্ট ক্যাশ মুছে ফেলা: ${cacheFile}`);
      } catch (unlinkErr) {
        // ইগনোর
      }
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
    const jsonData = safeStringify(data);
    fs.writeFileSync(cacheFile, jsonData, 'utf8');
    console.log(`✅ ক্যাশ সংরক্ষিত: ${cacheFile}`);
    
    // পুরনো ক্যাশ ফাইল ক্লিনআপ
    cleanupOldCache(cacheDir);
  } catch (e) {
    console.warn(`⚠️ ক্যাশ লেখতে সমস্যা: ${cacheFile} - ${e.message}`);
  }
}

/**
 * ক্যাশ ফাইল মুছে ফেলা (ঐচ্ছিক – ডিবাগের জন্য)
 * @param {string} cacheDir - ক্যাশ ডিরেক্টরি
 * @param {string} dateStr - তারিখ (YYYY-MM-DD)
 * @returns {boolean} - সফল হলে true
 */
function deleteCache(cacheDir, dateStr) {
  const cacheFile = path.join(cacheDir, `planets-${dateStr}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      fs.unlinkSync(cacheFile);
      console.log(`🗑️ ক্যাশ মুছে ফেলা: ${cacheFile}`);
      return true;
    } catch (e) {
      console.warn(`⚠️ ক্যাশ মুছতে সমস্যা: ${cacheFile} - ${e.message}`);
      return false;
    }
  }
  return false;
}

/**
 * সব ক্যাশ ফাইল মুছে ফেলা
 * @param {string} cacheDir - ক্যাশ ডিরেক্টরি
 * @returns {number} - মুছে ফেলা ফাইলের সংখ্যা
 */
function clearAllCache(cacheDir) {
  let count = 0;
  try {
    if (!fs.existsSync(cacheDir)) return 0;
    
    const files = fs.readdirSync(cacheDir)
      .filter(f => f.startsWith('planets-') && f.endsWith('.json'));
    
    files.forEach(file => {
      try {
        fs.unlinkSync(path.join(cacheDir, file));
        count++;
      } catch (e) {
        console.warn(`⚠️ ক্যাশ মুছতে সমস্যা: ${file}`);
      }
    });
    
    console.log(`🗑️ ${count}টি ক্যাশ ফাইল মুছে ফেলা হয়েছে`);
  } catch (e) {
    console.warn(`⚠️ ক্যাশ ক্লিয়ার ব্যর্থ: ${e.message}`);
  }
  return count;
}

module.exports = { 
  readCache, 
  writeCache, 
  deleteCache,
  clearAllCache,
  cleanupOldCache
};
