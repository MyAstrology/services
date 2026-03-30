/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: gochar/aspectEffects.js
 * কাজ: গ্রহের দৃষ্টির ভিত্তিতে রাশিফলের টেক্সট কাস্টমাইজেশন
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

/**
 * দৃষ্টির ভিত্তিতে প্রেমের ফল কাস্টমাইজ
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function enhanceLoveText(baseText, aspects) {
  let text = baseText;
  if (aspects.jupiter) {
    text += ' বৃহস্পতির দৃষ্টিতে সম্পর্কে সম্প্রসারণ আসবে।';
  }
  if (aspects.saturn) {
    text += ' শনির দৃষ্টিতে ধৈর্য ধরতে হবে।';
  }
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে কর্মের ফল কাস্টমাইজ
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function enhanceWorkText(baseText, aspects) {
  let text = baseText;
  if (aspects.jupiter) {
    text += ' বৃহস্পতির আশীর্বাদে কর্মক্ষেত্রে সাফল্য আসবে।';
  }
  if (aspects.saturn) {
    text += ' শনির দৃষ্টিতে পরিশ্রম বাড়বে, কিন্তু ফল পেতে বিলম্ব হবে।';
  }
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে স্বাস্থ্যের ফল কাস্টমাইজ
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function enhanceHealthText(baseText, aspects) {
  let text = baseText;
  if (aspects.saturn) {
    text += ' শনির দৃষ্টিতে হাড় ও জয়েন্টে যত্ন নিন।';
  }
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে আর্থিক ফল কাস্টমাইজ
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function enhanceFinanceText(baseText, aspects) {
  let text = baseText;
  if (aspects.jupiter) {
    text += ' বৃহস্পতির দৃষ্টিতে আর্থিক লাভের সম্ভাবনা।';
  }
  if (
