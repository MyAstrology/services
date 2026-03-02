// ===============================
// astro.js  (Browser Module)
// NC Lahiri Based Panchanga Engine
// Enhanced with Transition Times
// ===============================

// ---------- Constants ----------
const TITHI_NAMES = [
  "Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami",
  "Ashtami","Navami","Dashami","Ekadashi","Dvadashi","Trayodashi","Chaturdashi","Purnima",
  "Pratipada","Dvitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami",
  "Ashtami","Navami","Dashami","Ekadashi","Dvadashi","Trayodashi","Chaturdashi","Amavasya"
];
const NAKSHATRA_NAMES = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu",
  "Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana",
  "Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"
];
const YOGA_NAMES = [
  "Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma",
  "Dhriti","Shoola","Ganda","Vriddhi","Dhruva","Vyaghata",
  "Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha",
  "Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"
];
const KARANA_MOVABLE = ["Bava","Balava","Kaulava","Taitila","Gara","Vanija","Vishti"];

// ---------- Utility ----------
function toJulian(date) {
  return (date.getTime() / 86400000) + 2440587.5;
}
function normalize(deg) {
  return (deg % 360 + 360) % 360;
}
// Local time → JD (IST = UTC+5.5)
function localToJD(date, offsetHours = 5.5) {
  return toJulian(date) - offsetHours / 24;
}
// JD → local HH:MM string
function jdToLocalTime(jd, offsetHours = 5.5) {
  const totalMins = Math.round(((jd + offsetHours / 24) % 1) * 1440);
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

// ---------- Ayanamsa (NC Lahiri) ----------
function lahiriAyanamsa(jd) {
  const T = (jd - 2451545.0) / 36525;
  return 22.460148 + 1.396042 * T + 0.000087 * T * T;
}

// ---------- Sun Longitude (accurate) ----------
function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = normalize(280.46646 + 36000.76983 * T);
  const M  = normalize(357.52911 + 35999.05029 * T);
  const Mr = M * Math.PI / 180;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           +  0.000289 * Math.sin(3 * Mr);
  return normalize(L0 + C);
}

// ---------- Moon Longitude (accurate — Meeus Ch.47) ----------
function moonLongitude(jd) {
  const T  = (jd - 2451545.0) / 36525;
  const Lp = normalize(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D  = normalize(297.8501921 + 445267.1114034  * T - 0.0018819 * T * T);
  const Ms = normalize(357.5291092 + 35999.0502909   * T);
  const Mp = normalize(134.9633964 + 477198.8675055  * T + 0.0087414 * T * T);
  const F  = normalize(93.2720950  + 483202.0175233  * T - 0.0036539 * T * T);
  const E  = 1 - 0.002516 * T;

  const r = Math.PI / 180;
  const Dr=D*r, Msr=Ms*r, Mr=Mp*r, Fr=F*r;

  // Principal terms (arcseconds)
  let sl =
    6288774 * Math.sin(Mr)
  + 1274027 * Math.sin(2*Dr - Mr)
  +  658314 * Math.sin(2*Dr)
  +  213618 * Math.sin(2*Mr)
  - 185116 * E * Math.sin(Msr)
  - 114332 * Math.sin(2*Fr)
  +   58793 * Math.sin(2*Dr - 2*Mr)
  +   57066 * E * Math.sin(2*Dr - Msr - Mr)
  +   53322 * Math.sin(2*Dr + Mr)
  +   45758 * E * Math.sin(2*Dr - Msr)
  -   40923 * E * Math.sin(Msr - Mr)
  -   34720 * Math.sin(Dr)
  -   30383 * E * Math.sin(Msr + Mr)
  +   15327 * Math.sin(2*Dr - 2*Fr)
  -   12528 * Math.sin(Mp + 2*Fr)
  +   10980 * Math.sin(Mp - 2*Fr)
  +   10675 * Math.sin(4*Dr - Mr)
  +   10034 * Math.sin(3*Mr)
  +    8548 * Math.sin(4*Dr - 2*Mr)
  -    7888 * E * Math.sin(2*Dr + Msr - Mr)
  -    6766 * E * Math.sin(2*Dr + Msr)
  -    5163 * Math.sin(Dr - Mr)
  +    4987 * E * Math.sin(Dr + Msr)
  +    4036 * E * Math.sin(2*Dr - Msr + Mr)
  +    3994 * Math.sin(2*Dr + 2*Mr)
  +    3861 * Math.sin(4*Dr)
  +    3665 * Math.sin(2*Dr - 3*Mr)
  -    2689 * E * Math.sin(Msr - 2*Mr)
  -    2602 * Math.sin(2*Dr - Mp + 2*Fr)
  +    2390 * E * Math.sin(2*Dr - Msr - 2*Mr)
  -    2348 * Math.sin(Dr + Mr)
  +    2236 * E * E * Math.sin(2*Dr - 2*Msr)
  -    2120 * E * Math.sin(Msr + 2*Mr)
  -    2069 * E * E * Math.sin(2*Msr);

  // Additive corrections
  const A1 = normalize(119.75 + 131.849 * T) * r;
  const A2 = normalize(53.09  + 479264.29 * T) * r;
  sl += 3958 * Math.sin(A1)
      + 1962 * Math.sin(Lp * r - Fr)
      +  318 * Math.sin(A2);

  return normalize(Lp + sl / 1000000);
}

// ---------- Sidereal ----------
function sunSidereal(jd) {
  return normalize(sunLongitude(jd) - lahiriAyanamsa(jd));
}
function moonSidereal(jd) {
  return normalize(moonLongitude(jd) - lahiriAyanamsa(jd));
}

// ---------- Angle getters (index tracking) ----------
function diffAngle(jd) {
  return normalize(moonSidereal(jd) - sunSidereal(jd));
}
function sumAngle(jd) {
  return normalize(moonSidereal(jd) + sunSidereal(jd));
}

// ---------- Karana name from sequence number (0–59) ----------
function karanaName(kNum) {
  const n = ((kNum % 60) + 60) % 60;
  if (n === 0)  return "Kimstughna";  // শুক্ল প্রতিপদ ১ম অর্ধ
  if (n === 57) return "Shakuni";
  if (n === 58) return "Chatushpada";
  if (n === 59) return "Naga";
  return KARANA_MOVABLE[(n - 1) % 7];
}

// ---------- Binary search: boundary crossing time ----------
// getFn(jd) returns an integer index; find exact JD where it changes
function findBoundary(jdLo, jdHi, getFn) {
  for (let i = 0; i < 52; i++) {
    if (jdHi - jdLo < 1 / 86400 / 30) break; // ~2 second precision
    const mid = (jdLo + jdHi) / 2;
    if (getFn(mid) === getFn(jdLo)) jdLo = mid; else jdHi = mid;
  }
  return (jdLo + jdHi) / 2;
}

// ---------- Find all transitions within a JD range ----------
function findTransitions(jdStart, jdEnd, getFn, offsetHours) {
  const STEPS = 288; // every 5 minutes over 24h
  const results = [];
  let prevIdx = getFn(jdStart);

  for (let i = 1; i <= STEPS; i++) {
    const jd = jdStart + (jdEnd - jdStart) * i / STEPS;
    const curIdx = getFn(jd);
    if (curIdx !== prevIdx) {
      const boundary = findBoundary(
        jdStart + (jdEnd - jdStart) * (i - 1) / STEPS,
        jd,
        getFn
      );
      results.push({
        fromIdx: prevIdx,
        toIdx:   curIdx,
        jd:      boundary,
        time:    jdToLocalTime(boundary, offsetHours)
      });
      prevIdx = curIdx;
    }
  }
  return results;
}

// ---------- Build item list: [{name, endTime}] ----------
function buildItemList(startIdx, transitions, nameFn) {
  if (transitions.length === 0) {
    return [{ name: nameFn(startIdx), endTime: null }];
  }
  const list = [];
  let cur = startIdx;
  for (const t of transitions) {
    list.push({ name: nameFn(cur), endTime: t.time });
    cur = t.toIdx;
  }
  list.push({ name: nameFn(cur), endTime: null });
  return list;
}

// ---------- Tithi extra info ----------
function tithiInfo(idx) {
  const i = ((idx % 30) + 30) % 30;
  return {
    name:    TITHI_NAMES[i],
    paksha:  i < 15 ? "Shukla" : "Krishna",
    pakDay:  i < 15 ? i + 1 : i - 14
  };
}

// ============================================================
//  MAIN EXPORT — getPanchanga(date, tzOffset = 5.5)
//
//  Returns:
//  {
//    tithi:     [{name, paksha, pakDay, endTime}]  ← list
//    nakshatra: [{name, endTime}]
//    yoga:      [{name, auspicious, endTime}]
//    karana:    [{name, endTime}]
//  }
//  endTime = "HH:MM" local string, or null if continues past next sunrise
// ============================================================

export function getPanchanga(date, tzOffset = 5.5) {
  // Sunrise JD for this date (approx 6:00 AM local = 0.25 of JD day)
  // For precise sunrise, integrate with your sunTimes() function.
  // Here we use 6:00 AM local as default sunrise.
  const midnightJD = Math.floor(toJulian(date) - tzOffset / 24) + tzOffset / 24;
  const jdSunrise  = midnightJD + 6 / 24;   // ~6:00 AM local
  const jdNextSunrise = jdSunrise + 1;        // next day ~6:00 AM

  const diff0 = diffAngle(jdSunrise);
  const sum0  = sumAngle(jdSunrise);
  const moon0 = moonSidereal(jdSunrise);

  // Index at sunrise
  const tIdx0 = Math.floor(diff0 / 12) % 30;
  const nIdx0 = Math.floor(moon0 / (360 / 27)) % 27;
  const yIdx0 = Math.floor(sum0  / (360 / 27)) % 27;
  const kNum0 = Math.floor(diff0 / 6) % 60;

  // Index getter functions
  const getTIdx = jd => Math.floor(diffAngle(jd) / 12) % 30;
  const getNIdx = jd => Math.floor(moonSidereal(jd) / (360 / 27)) % 27;
  const getYIdx = jd => Math.floor(sumAngle(jd)  / (360 / 27)) % 27;
  const getKNum = jd => Math.floor(diffAngle(jd) / 6) % 60;

  // Find transitions
  const tTrans = findTransitions(jdSunrise, jdNextSunrise, getTIdx, tzOffset);
  const nTrans = findTransitions(jdSunrise, jdNextSunrise, getNIdx, tzOffset);
  const yTrans = findTransitions(jdSunrise, jdNextSunrise, getYIdx, tzOffset);
  const kTrans = findTransitions(jdSunrise, jdNextSunrise, getKNum, tzOffset);

  // Build lists
  const tithiList = buildItemList(tIdx0, tTrans, idx => tithiInfo(idx))
    .map(t => ({ ...t.name, endTime: t.endTime }));

  const nakList = buildItemList(nIdx0, nTrans, idx => ({
    name: NAKSHATRA_NAMES[idx % 27]
  })).map(t => ({ name: t.name.name, endTime: t.endTime }));

  const yogaList = buildItemList(yIdx0, yTrans, idx => ({
    name: YOGA_NAMES[idx % 27]
  })).map(t => ({ name: t.name.name, endTime: t.endTime }));

  const karanList = buildItemList(kNum0, kTrans, kNum => ({
    name: karanaName(kNum)
  })).map(t => ({ name: t.name.name, endTime: t.endTime }));

  return {
    tithi:     tithiList,     // [{name, paksha, pakDay, endTime}]
    nakshatra: nakList,       // [{name, endTime}]
    yoga:      yogaList,      // [{name, endTime}]
    karana:    karanList,     // [{name, endTime}]
  };
}

// ---------- Simple single-value API (backward compatible) ----------
export function getPanchangaSimple(date, tzOffset = 5.5) {
  const full = getPanchanga(date, tzOffset);
  return {
    tithi:     full.tithi[0].name,
    paksha:    full.tithi[0].paksha,
    pakDay:    full.tithi[0].pakDay,
    nakshatra: full.nakshatra[0].name,
    yoga:      full.yoga[0].name,
    karana:    full.karana[0].name,
  };
}
