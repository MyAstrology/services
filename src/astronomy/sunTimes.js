/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: astronomy/sunTimes.js
 * কাজ: সূর্যোদয় ও সূর্যাস্তের সময় গণনা
 * প্রকল্প: Daily Rashifal Generator
 * 
 * এই ফাইলটি শুধুমাত্র দৈনিক রাশিফল জেনারেটরের অংশ।
 * অন্য কোনো প্রকল্পের সাথে মিশিয়ে ফেলবেন না।
 * ============================================================
 */

const { JD } = require('./jd');

/**
 * সূর্যোদয় ও সূর্যাস্তের সময় গণনা
 * @param {number} y - বছর
 * @param {number} m - মাস (1-12)
 * @param {number} d - দিন
 * @param {number} lat - অক্ষাংশ (ডিগ্রি)
 * @param {number} lng - দ্রাঘিমাংশ (ডিগ্রি)
 * @param {number} tz - সময় অঞ্চল (ঘণ্টায়)
 * @returns {Object} - { rise, set } (decimal hours)
 */
function sunTimes(y, m, d, lat, lng, tz) {
  const jd0 = JD(y, m, d);
  const n = jd0 - 2451545 + 0.5;
  
  const L = ((280.46646 + 0.9856474 * n) % 360 + 360) % 360;
  const g = ((357.52911 + 0.9856003 * n) % 360 + 360) * Math.PI / 180;
  
  const lam = L + 1.914602 * Math.sin(g) + 0.019993 * Math.sin(2 * g);
  const eps = 23.439 * Math.PI / 180;
  const lamR = lam * Math.PI / 180;
  
  const sinDec = Math.sin(eps) * Math.sin(lamR);
  const dec = Math.asin(sinDec);
  
  const e2 = 0.016708634;
  const y2 = Math.tan(eps / 2) ** 2;
  const lR = L * Math.PI / 180;
  
  const EoT = 4 * (y2 * Math.sin(2 * lR) - 2 * e2 * Math.sin(g) + 
    4 * e2 * y2 * Math.sin(g) * Math.cos(2 * lR) -
    0.5 * y2 * y2 * Math.sin(4 * lR) - 1.25 * e2 * e2 * Math.sin(2 * g)) * 180 / Math.PI;
  
  const latR = lat * Math.PI / 180;
  const cosH = (Math.sin(-0.8333 * Math.PI / 180) - Math.sin(latR) * sinDec) / (Math.cos(latR) * Math.cos(dec));
  
  if (Math.abs(cosH) > 1) {
    return { rise: 6, set: 18 };
  }
  
  const H = Math.acos(Math.min(1, Math.max(-1, cosH))) * 180 / Math.PI;
  const noon = (720 - 4 * lng - EoT) / 60 + tz;
  
  return {
    rise: noon - H / 15,
    set: noon + H / 15
  };
}

module.exports = { sunTimes };
