/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: astronomy/jd.js
 * কাজ: জুলিয়ান দিন (Julian Day) গণনা
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

/**
 * জুলিয়ান দিন সংখ্যা গণনা (JD)
 * Meeus Astronomical Algorithms থেকে নেওয়া
 * @param {number} y - বছর
 * @param {number} m - মাস (1-12)
 * @param {number} d - দিন
 * @returns {number} - জুলিয়ান দিন সংখ্যা
 */
function JD(y, m, d) {
  if (m <= 2) {
    y--;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

module.exports = { JD };
