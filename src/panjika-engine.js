/**
 * panjika-engine.js — MyAstrology.in Bengali Panjika Core Engine
 * Dr. Prodyut Acharya, Ranaghat, Nadia, West Bengal
 *
 * PIPELINE:
 *   moon-ephemeris.js    → precise nakshatra/tithi change times
 *   combined-ephemeris.js → all planet positions
 *   panjika-engine.js    → all panchanga computations
 *   muhurta-engine.js    → auspicious time calculations
 *   panjika.html         → display
 *
 * Verified against Bishuddha Siddhanta Panjika:
 *   Apr 3, 2026 11:00 IST Kolkata: লগ্ন মিথুন 17°19'27" ✓
 *   Moon: তুলা 2°19'52" ✓, Sun: মীন 19°15'50" ✓, Mars: মীন 0°38'11" ✓
 */

'use strict';

// ════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════
const RASHI = ['মেষ','বৃষ','মিথুন','কর্কট','সিংহ','কন্যা','তুলা','বৃশ্চিক','ধনু','মকর','কুম্ভ','মীন'];
const RASHI_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const RASHI_LORD = ['মঙ্গল','শুক্র','বুধ','চন্দ্র','সূর্য','বুধ','শুক্র','মঙ্গল','বৃহস্পতি','শনি','শনি','বৃহস্পতি'];

const NAKS = [
  ['অশ্বিনী','কেতু'],['ভরণী','শুক্র'],['কৃত্তিকা','সূর্য'],['রোহিণী','চন্দ্র'],['মৃগশিরা','মঙ্গল'],
  ['আর্দ্রা','রাহু'],['পুনর্বসু','গুরু'],['পুষ্যা','শনি'],['আশ্লেষা','বুধ'],['মঘা','কেতু'],
  ['পূর্বফাল্গুনী','শুক্র'],['উত্তরফাল্গুনী','সূর্য'],['হস্তা','চন্দ্র'],['চিত্রা','মঙ্গল'],
  ['স্বাতী','রাহু'],['বিশাখা','গুরু'],['অনুরাধা','শনি'],['জ্যেষ্ঠা','বুধ'],['মূলা','কেতু'],
  ['পূর্বাষাঢ়া','শুক্র'],['উত্তরাষাঢ়া','সূর্য'],['শ্রবণা','চন্দ্র'],['ধনিষ্ঠা','মঙ্গল'],
  ['শতভিষা','রাহু'],['পূর্বভাদ্রপদ','গুরু'],['উত্তরভাদ্রপদ','শনি'],['রেবতী','বুধ']
];

const TNAMES = ['প্রতিপদ','দ্বিতীয়া','তৃতীয়া','চতুর্থী','পঞ্চমী','ষষ্ঠী','সপ্তমী','অষ্টমী',
  'নবমী','দশমী','একাদশী','দ্বাদশী','ত্রয়োদশী','চতুর্দশী','পূর্ণিমা',
  'প্রতিপদ','দ্বিতীয়া','তৃতীয়া','চতুর্থী','পঞ্চমী','ষষ্ঠী','সপ্তমী','অষ্টমী',
  'নবমী','দশমী','একাদশী','দ্বাদশী','ত্রয়োদশী','চতুর্দশী','অমাবস্যা'];

const YOGAS = [
  ['বিষ্কুম্ভ','✗'],['প্রীতি','✓'],['আয়ুষ্মান','✓'],['সৌভাগ্য','✓'],['শোভন','✓'],
  ['অতিগণ্ড','✗'],['সুকর্মা','✓'],['ধৃতি','✓'],['শূল','✗'],['গণ্ড','✗'],
  ['বৃদ্ধি','✓'],['ধ্রুব','✓'],['ব্যাঘাত','✗'],['হর্ষণ','✓'],['বজ্র','✗'],
  ['সিদ্ধি','✓'],['ব্যতীপাত','✗'],['বরীয়ান','✓'],['পরিঘ','✗'],['শিব','✓'],
  ['সিদ্ধ','✓'],['সাধ্য','✓'],['শুভ','✓'],['শুক্ল','✓'],['ব্রহ্ম','✓'],
  ['ইন্দ্র','✓'],['বৈধৃতি','✗']
];

const KARANS = ['বব','বালব','কৌলব','তৈতিল','গর','বণিজ','বিষ্টি','শকুনি','চতুষ্পাদ','নাগ','কিংস্তুঘ্ন'];

const VDAYS = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
const VLORD = ['সূর্য','চন্দ্র','মঙ্গল','বুধ','বৃহস্পতি','শুক্র','শনি'];

// ════════════════════════════════════════════════════════════════
// JULIAN DATE UTILITIES
// ════════════════════════════════════════════════════════════════
function JD(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  var A = Math.floor(y/100), B = 2 - A + Math.floor(A/4);
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + d + B - 1524.5;
}

function lahiriAY(jd) {
  var T = (jd - 2451545) / 36525;
  return 23.853167 + 1.39694*T + 0.000617*T*T;
}

// ════════════════════════════════════════════════════════════════
// PANCHANGA COMPUTATIONS
// ════════════════════════════════════════════════════════════════

/** Tithi index 0-29 (0=Shukla Pratipada ... 29=Amavasya) */
function getTithiIdx(jd) {
  var ay = lahiriAY(jd);
  var sunLon, moonLon;
  
  // Use JPL if available
  if (typeof getEphLon !== 'undefined') {
    sunLon  = getEphLon('sun',  jd, ay);
    moonLon = getChandra ? getChandra(jd, ay) : getEphLon('sun', jd, ay);
  } else {
    sunLon  = sunL_formula(jd, ay);
    moonLon = moonL_formula(jd, ay);
  }
  
  return Math.floor(((moonLon - sunLon + 360) % 360) / 12) % 30;
}

/** Nakshatra index 0-26 */
function getNakIdx(jd, moonSidLon) {
  if (moonSidLon === undefined) {
    var ay = lahiriAY(jd);
    moonSidLon = typeof getChandra !== 'undefined' ? getChandra(jd, ay) : moonL_formula(jd, ay);
  }
  return Math.floor(moonSidLon / (360/27)) % 27;
}

/** Yoga index 0-26 */
function getYogaIdx(jd) {
  var ay = lahiriAY(jd);
  var sunSid  = typeof getEphLon !== 'undefined' ? getEphLon('sun', jd, ay) : sunL_formula(jd, ay);
  var moonSid = typeof getChandra !== 'undefined' ? getChandra(jd, ay) : moonL_formula(jd, ay);
  return Math.floor(((sunSid + moonSid) % 360) / (360/27)) % 27;
}

/** Karana index (0-10) at a given JD */
function getKaranaIdx(jd) {
  var ti = getTithiIdx(jd);
  var half = (ti * 2 + (/** fractional half */(((getChandra?getChandra(jd):0) - getEphLon?getEphLon('sun',jd):0 + 360)%360) % 12 > 6 ? 1 : 0)) % 2;
  // Simplified: return based on tithi
  return ti % 7;
}

// ════════════════════════════════════════════════════════════════
// SUNRISE/SUNSET (Ranaghat default: 23.167°N, 88.567°E)
// ════════════════════════════════════════════════════════════════
function sunTimes(y, m, d, lat, lng, tz) {
  lat = lat || 23.167; lng = lng || 88.567; tz = tz || 5.5;
  var jd0 = JD(y,m,d), n = jd0 - 2451545 + 0.5;
  var L = ((280.46646 + 0.9856474*n) % 360 + 360) % 360;
  var g = ((357.52911 + 0.9856003*n) % 360 + 360) * Math.PI/180;
  var lam = L + 1.914602*Math.sin(g) + 0.019993*Math.sin(2*g);
  var eps = 23.439*Math.PI/180, lamR = lam*Math.PI/180;
  var sinDec = Math.sin(eps)*Math.sin(lamR), dec = Math.asin(sinDec);
  var e2 = 0.016708634, y2 = Math.tan(eps/2)**2, lR = L*Math.PI/180;
  var EoT = 4*(y2*Math.sin(2*lR) - 2*e2*Math.sin(g) + 4*e2*y2*Math.sin(g)*Math.cos(2*lR)
              - 0.5*y2*y2*Math.sin(4*lR) - 1.25*e2*e2*Math.sin(2*g)) * 180/Math.PI;
  var latR = lat * Math.PI/180;
  var cosH = (Math.sin(0.267*Math.PI/180) - Math.sin(latR)*sinDec) / (Math.cos(latR)*Math.cos(dec));
  if (Math.abs(cosH) > 1) return {rise: 6, set: 18};
  var H = Math.acos(Math.min(1, Math.max(-1, cosH))) * 180/Math.PI;
  var noon = (720 - 4*lng - EoT) / 60 + tz;
  return {rise: noon - H/15, set: noon + H/15};
}

// ════════════════════════════════════════════════════════════════
// ASCENDANT (Lagna) — Sidereal RAMC method
// Verified: Apr 3, 2026 11:00 IST Kolkata = মিথুন 17°19'27" ✓
// ════════════════════════════════════════════════════════════════
function calcLagnaAt(jd, lat, lng) {
  lat = lat || 23.167; lng = lng || 88.567;
  var T = (jd - 2451545) / 36525;
  var GMST = ((280.46061837 + 360.98564736629*(jd-2451545) + 0.000387933*T*T) % 360 + 360) % 360;
  var LMST = ((GMST + lng) % 360 + 360) % 360;
  var eps = 23.439 * Math.PI/180, latR = lat*Math.PI/180, R = LMST*Math.PI/180;
  var mc = ((Math.atan2(Math.sin(R), Math.cos(R)*Math.cos(eps)) * 180/Math.PI) + 360) % 360;
  var yA = -Math.cos(R), xA = Math.sin(eps)*Math.tan(latR) + Math.cos(eps)*Math.sin(R);
  var E = ((Math.atan2(yA, xA) * 180/Math.PI) + 360) % 360;
  var E2 = (E + 180) % 360;
  if ((E - mc + 360) % 360 < 90 || (E - mc + 360) % 360 > 270) E = E2;
  var ay = lahiriAY(jd);
  var sid = ((E - ay) % 360 + 360) % 360;
  return { sid: sid, ri: Math.floor(sid/30), deg: sid%30 };
}

// ════════════════════════════════════════════════════════════════
// RAHU / KETU
// ════════════════════════════════════════════════════════════════
function rahuSidLon(jd, ay) {
  var T = (jd - 2451545) / 36525;
  var trop = ((125.0445479 - 1934.1362608*T + 0.0020754*T*T) % 360 + 360) % 360;
  if (ay === undefined) ay = lahiriAY(jd);
  return ((trop - ay) % 360 + 360) % 360;
}
function ketuSidLon(jd, ay) { return (rahuSidLon(jd, ay) + 180) % 360; }

// ════════════════════════════════════════════════════════════════
// TRANSITION FINDER (bisection method)
// ════════════════════════════════════════════════════════════════
/**
 * Find exact time when a function crosses a threshold
 * @param {Function} fn - function of JD returning value
 * @param {number} targetVal - target value to cross
 * @param {number} jd0 - search start
 * @param {number} jd1 - search end
 * @returns {number} JD of crossing
 */
function findCrossing(fn, targetVal, jd0, jd1, tolerance) {
  tolerance = tolerance || 1e-6;
  for (var iter = 0; iter < 50; iter++) {
    var jdMid = (jd0 + jd1) / 2;
    if (jd1 - jd0 < tolerance) return jdMid;
    var v0 = fn(jd0) - targetVal, vm = fn(jdMid) - targetVal;
    if (v0 * vm < 0) jd1 = jdMid;
    else             jd0 = jdMid;
  }
  return (jd0 + jd1) / 2;
}

/**
 * Get tithi transitions for a day (returns array of {jd, tithiIdx, name})
 */
function getTithiTransitions(y, m, d, tz) {
  tz = tz || 5.5;
  var jd_start = JD(y,m,d) + (0 - tz) / 24;
  var jd_end   = JD(y,m,d) + (30 - tz) / 24;
  
  var transitions = [];
  var prevTi = getTithiIdx(jd_start);
  var step = 0.5/24; // 30 min steps
  
  for (var jd = jd_start + step; jd <= jd_end; jd += step) {
    var ti = getTithiIdx(jd);
    if (ti !== prevTi) {
      // Refine
      var jd_cross = findCrossing(
        function(j) { return getTithiIdx(j) === prevTi ? 0 : 1; },
        0.5, jd - step, jd
      );
      var ist = jd_cross + tz/24;
      var h = Math.floor((ist % 1) * 24);
      var mn = Math.round(((ist % 1) * 24 - h) * 60);
      transitions.push({
        jd: jd_cross,
        tithiIdx: ti,
        name: TNAMES[ti],
        paksha: ti < 15 ? 'শুক্লপক্ষ' : 'কৃষ্ণপক্ষ',
        pakDay: ti < 15 ? ti+1 : ti-14,
        timeStr: ('0'+h).slice(-2) + ':' + ('0'+mn).slice(-2)
      });
      prevTi = ti;
    }
  }
  return transitions;
}

/**
 * Get nakshatra transitions (uses hourly moon if available)
 */
function getNakTransitions(y, m, d, tz) {
  tz = tz || 5.5;
  var jd_start = JD(y,m,d) + (0 - tz) / 24;
  var jd_end   = JD(y,m,d) + (30 - tz) / 24;
  
  var transitions = [];
  var prevNak = getNakIdx(jd_start);
  var step = typeof getChandra !== 'undefined' ? 1/24 : 0.5/24; // 1-hr or 30-min
  
  for (var jd = jd_start + step; jd <= jd_end; jd += step) {
    var nak = getNakIdx(jd);
    if (nak !== prevNak) {
      var ist = jd + tz/24;
      var h = Math.floor((ist % 1) * 24);
      var mn = Math.round(((ist % 1) * 24 - h) * 60);
      if (mn >= 60) { h++; mn = 0; }
      transitions.push({
        jd: jd,
        nakIdx: nak,
        name: NAKS[nak][0],
        lord: NAKS[nak][1],
        timeStr: ('0'+h).slice(-2) + ':' + ('0'+mn).slice(-2)
      });
      prevNak = nak;
    }
  }
  return transitions;
}

// ════════════════════════════════════════════════════════════════
// BENGALI DATE (BMS)
// ════════════════════════════════════════════════════════════════
const BMS = [
  {y:1431,m:0,s:'2024-04-14'},{y:1431,m:1,s:'2024-05-15'},{y:1431,m:2,s:'2024-06-15'},
  {y:1431,m:3,s:'2024-07-16'},{y:1431,m:4,s:'2024-08-17'},{y:1431,m:5,s:'2024-09-17'},
  {y:1431,m:6,s:'2024-10-17'},{y:1431,m:7,s:'2024-11-16'},{y:1431,m:8,s:'2024-12-16'},
  {y:1431,m:9,s:'2025-01-14'},{y:1431,m:10,s:'2025-02-13'},{y:1431,m:11,s:'2025-03-14'},
  {y:1432,m:0,s:'2025-04-15'},{y:1432,m:1,s:'2025-05-16'},{y:1432,m:2,s:'2025-06-16'},
  {y:1432,m:3,s:'2025-07-17'},{y:1432,m:4,s:'2025-08-18'},{y:1432,m:5,s:'2025-09-18'},
  {y:1432,m:6,s:'2025-10-18'},{y:1432,m:7,s:'2025-11-17'},{y:1432,m:8,s:'2025-12-17'},
  {y:1432,m:9,s:'2026-01-15'},{y:1432,m:10,s:'2026-02-14'},{y:1432,m:11,s:'2026-03-16'},
  {y:1433,m:0,s:'2026-04-15'},{y:1433,m:1,s:'2026-05-16'},{y:1433,m:2,s:'2026-06-16'},
  {y:1433,m:3,s:'2026-07-18'},{y:1433,m:4,s:'2026-08-19'},{y:1433,m:5,s:'2026-09-17'},
  {y:1433,m:6,s:'2026-10-17'},{y:1433,m:7,s:'2026-11-18'},{y:1433,m:8,s:'2026-12-17'},
  {y:1433,m:9,s:'2027-01-15'},{y:1433,m:10,s:'2027-02-13'},{y:1433,m:11,s:'2027-03-14'},
  {y:1434,m:0,s:'2027-04-14'},{y:1434,m:1,s:'2027-05-15'},{y:1434,m:2,s:'2027-06-15'},
  {y:1434,m:3,s:'2027-07-16'},{y:1434,m:4,s:'2027-08-17'},{y:1434,m:5,s:'2027-09-17'},
  {y:1434,m:6,s:'2027-10-17'},{y:1434,m:7,s:'2027-11-16'},{y:1434,m:8,s:'2027-12-16'},
  {y:1434,m:9,s:'2028-01-15'},{y:1434,m:10,s:'2028-02-14'},{y:1434,m:11,s:'2028-03-14'},
  {y:1435,m:0,s:'2028-04-13'},{y:1435,m:1,s:'2028-05-14'},{y:1435,m:2,s:'2028-06-15'},
  {y:1435,m:3,s:'2028-07-16'},{y:1435,m:4,s:'2028-08-16'},{y:1435,m:5,s:'2028-09-16'},
  {y:1435,m:6,s:'2028-10-16'},{y:1435,m:7,s:'2028-11-15'},{y:1435,m:8,s:'2028-12-15'},
  {y:1435,m:9,s:'2029-01-14'},{y:1435,m:10,s:'2029-02-13'},{y:1435,m:11,s:'2029-03-14'},
  {y:1436,m:0,s:'2029-04-14'},{y:1436,m:1,s:'2029-05-15'},{y:1436,m:2,s:'2029-06-15'},
  {y:1436,m:3,s:'2029-07-17'},{y:1436,m:4,s:'2029-08-17'},{y:1436,m:5,s:'2029-09-17'},
  {y:1436,m:6,s:'2029-10-18'},{y:1436,m:7,s:'2029-11-17'},{y:1436,m:8,s:'2029-12-17'},
  {y:1436,m:9,s:'2030-01-15'},{y:1436,m:10,s:'2030-02-14'},{y:1436,m:11,s:'2030-03-16'},
  {y:1437,m:0,s:'2030-04-15'},{y:1437,m:1,s:'2030-05-16'},{y:1437,m:2,s:'2030-06-16'},
  {y:1437,m:3,s:'2030-07-18'},{y:1437,m:4,s:'2030-08-18'},{y:1437,m:5,s:'2030-09-18'},
  {y:1437,m:6,s:'2030-10-18'},{y:1437,m:7,s:'2030-11-17'},{y:1437,m:8,s:'2030-12-17'},
  {y:1437,m:9,s:'2031-01-15'},{y:1437,m:10,s:'2031-02-14'},{y:1437,m:11,s:'2031-03-16'},
  {y:1438,m:0,s:'2031-04-15'}
];

const BNM = ['বৈশাখ','জ্যৈষ্ঠ','আষাঢ়','শ্রাবণ','ভাদ্র','আশ্বিন','কার্তিক','অগ্রহায়ণ','পৌষ','মাঘ','ফাল্গুন','চৈত্র'];
const RITU = ['গ্রীষ্ম','গ্রীষ্ম','বর্ষা','বর্ষা','শরৎ','শরৎ','হেমন্ত','হেমন্ত','শীত','শীত','বসন্ত','বসন্ত'];

function getBnDate(date) {
  var t = date.getTime();
  var idx = -1;
  for (var i = BMS.length-1; i >= 0; i--) {
    if (t >= new Date(BMS[i].s + 'T00:00:00').getTime()) { idx = i; break; }
  }
  if (idx < 0) return null;
  var e = BMS[idx];
  var s = new Date(e.s + 'T00:00:00');
  var d = Math.floor((t - s.getTime()) / 86400000) + 1;
  return { y: e.y, m: e.m, d: d, name: BNM[e.m], ritu: RITU[e.m], vikram: e.y+57, saka: e.y-78 };
}

// ════════════════════════════════════════════════════════════════
// INAUSPICIOUS PERIODS (Baarbell, Kaalratri, Amrita)
// Verified: Apr 1 2026 (Wed) বারবেলা 8:36-10:08 ✓, অমৃত 5:33-7:11 ✓
// ════════════════════════════════════════════════════════════════
const BB_T   = [[4,7],[2,6],[6,2],[3,5],[5,7],[1,5],[8,4]];
const KR_T   = [5,3,7,7,7,3,6];
const AM_D   = [[5,6,11,12],[1,2,8,9,12,13],[3,4,10,11,14,15],[1,2,6,7,13,14],[3,4,10,11],[1,2,5,6,12,13],[2,3,8,9,14,15]];
const MH_D   = [[8,9],[12,13],[7,8],[11,12],[6,7],[9,10],[5,6]];
const AM_N   = [[6,7,13,14],[3,4,9,10,11,12,13,14,15],[4,5,11,12],[2,3,4,10,11,12,13,14,15],[4,5,12,13],[1,2,7,8,14,15],[3,4,10,11]];
const RS     = [4,2,6,5,6,4,3];
const GS     = [6,5,4,3,2,1,7];
const YS     = [5,4,3,2,1,7,6];

function _mkP(sl,b,m){ var r=[],i=0;while(i<sl.length){var s=sl[i]-1,e=sl[i];while(i+1<sl.length&&sl[i+1]===sl[i]+1){i++;e=sl[i];}r.push({st:b+s*m/60,en:b+e*m/60});i++;}return r; }

function calcBaarbell(r,s,w){ var p=(s-r)*60/8;return BB_T[w].map(function(sl){return{st:r+(sl-1)*p/60,en:r+sl*p/60};});}
function calcKaalratri(ss,nr,w){ var nm=((nr+24)-ss)*60,p=nm/8,sl=KR_T[w]-1;return{st:ss+sl*p/60,en:ss+(sl+1)*p/60};}
function calcAmritaD(r,s,w){return _mkP(AM_D[w],r,(s-r)*60/15);}
function calcAmritaN(ss,nr,w){return _mkP(AM_N[w],ss,((nr+24)-ss)*60/15);}
function calcMahendra(r,s,w){var sl=MH_D[w],m=(s-r)*60/15;return sl&&sl.length?{st:r+(sl[0]-1)*m/60,en:r+sl[sl.length-1]*m/60}:null;}
function slotTime(r,s,slot){ var p=(s-r)*60/8;return{st:r+(slot-1)*p/60,en:r+slot*p/60};}
function abhijitTime(r,s){ var m=(s-r)*60/15;return{st:r+7*m/60,en:r+8*m/60};}

// ════════════════════════════════════════════════════════════════
// MRITYU DOSHA (Death Dosha)
// Verified: 2 Nov 2025 (Sun) → ত্রিপাদ→পুষ্কর→দ্বিপাদ→একপাদ ✓
// ════════════════════════════════════════════════════════════════
const DD_BAR = [0,2,6];   // Sun, Tue, Sat
const DD_TI  = [1,6,11];  // Dwitiya, Saptami, Dwadashi
const DD_NAK = [2,6,11,15,20,24]; // Krittika, Punarvasu, UttarPhal, Vishakha, UttaraAsha, PurvaBhadra

function calcMrityuDosha(wd, tithiInPaksha, nakIdx) {
  var bar = DD_BAR.includes(wd) ? 1 : 0;
  var ti  = DD_TI.includes(tithiInPaksha % 15) ? 1 : 0;
  var nak = DD_NAK.includes(nakIdx % 27) ? 2 : 0;
  var tot = bar + ti + nak;
  var names = {0:'দোষ নেই',1:'একপাদ দোষ',2:'দ্বিপাদ দোষ',3:'ত্রিপাদ দোষ',4:'পুষ্কর দোষ'};
  var pk = '';
  if (tot === 4) {
    var wv = [1,2,3,4,5,6,7][wd] || 1;
    var r = (wv + 35) % 3;
    pk = r===1 ? ' (স্বর্গবাসী)' : r===2 ? ' (পাতালবাসী)' : ' (মর্ত্যবাসী)';
  }
  return { total: tot, name: (names[tot]||'পুষ্কর দোষ')+pk, bar: bar, tithi: ti, nak: nak };
}

const MRITYU_NAK = ['','সর্বদোষ','গো-দোষ','','','সর্বদোষ','','','সর্পদোষ','পিতৃদোষ',
  'সর্বদোষ','দ্বিপাদদোষ','','','সর্বদোষ','','','সর্বদোষ','পিতৃদোষ','সর্বদোষ',
  '','','','সর্পদোষ','দ্বিপাদদোষ','',''];

if (typeof module !== 'undefined') {
  module.exports = {
    JD, lahiriAY, RASHI, NAKS, TNAMES, YOGAS, KARANS, VDAYS, BNM,
    sunTimes, calcLagnaAt, rahuSidLon, ketuSidLon,
    getTithiIdx, getNakIdx, getYogaIdx, getTithiTransitions, getNakTransitions,
    calcBaarbell, calcKaalratri, calcAmritaD, calcAmritaN, calcMahendra,
    calcMrityuDosha, MRITYU_NAK, getBnDate, BMS,
    findCrossing, slotTime, abhijitTime
  };
}
