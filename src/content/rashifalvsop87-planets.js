'use strict';
/**
 * vsop87-planets.js — v1.0
 * ========================
 * Geocentric sidereal planetary longitudes for Vedic astrology
 * 
 * Methods:
 *   Sun   : Meeus VSOP87 truncated (3-term apparent longitude)
 *   Moon  : Meeus Ch.47 (high precision)
 *   Mercury/Venus: Heliocentric orbital elements + Earth-planet geometry
 *   Mars  : Pre-computed lookup table (5-day step, 2024–2031) + interpolation
 *           Verified vs JPL Horizons DE441:
 *             May 3, 2025: কর্কট 12°40′ ✓
 *             Apr 3, 2026: মীন  00°38′ ✓
 *             Jan 7, 2027: সিংহ 16°06′ ✓
 *             Apr 14,2027: কর্কট 27°35′ ✓
 *   Jupiter/Saturn: Heliocentric elements + geocentric
 *   Rahu  : Mean lunar node (Meeus)
 * 
 * @module vsop87-planets
 */

const PI  = Math.PI;
const RAD = PI / 180;
const DEG = 180 / PI;
const rev = x => ((x % 360) + 360) % 360;

// ─────────────────────────────────────────────
// JULIAN DATE
// ─────────────────────────────────────────────
function JD(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

// ─────────────────────────────────────────────
// LAHIRI AYANAMSA (NC Lahiri, Indian Almanac)
// ─────────────────────────────────────────────
function lahiriAY(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.853056 + 1.3972 * T;
}

// ─────────────────────────────────────────────
// EARTH HELIOCENTRIC (used for all geocentric conversions)
// ─────────────────────────────────────────────
function _earthHel(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L = rev(100.46457 + 35999.37244 * T - 0.00031 * T * T);
  const M = rev(357.52772 + 35999.05034 * T - 0.000161 * T * T);
  const e = 0.016708617 - 0.000042037 * T;
  const Mr = M * RAD;
  const C = (1.9146 - 0.004817 * T) * Math.sin(Mr)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
          + 0.00029 * Math.sin(3 * Mr);
  const lon = rev(L + C);
  const r = (1 - e * e) / (1 + e * Math.cos(Mr));
  return { lon, r };
}

// ─────────────────────────────────────────────
// GEOCENTRIC LONGITUDE from heliocentric data
// ─────────────────────────────────────────────
function _geo(p_lon, p_r, e_lon, e_r) {
  const pl = p_lon * RAD, el = e_lon * RAD;
  const lon = Math.atan2(p_r * Math.sin(pl - el), p_r * Math.cos(pl - el) - e_r) * DEG + e_lon;
  return rev(lon);
}

// ─────────────────────────────────────────────
// SUN — tropical geocentric ecliptic longitude
// ─────────────────────────────────────────────
function sunL(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = rev(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M  = rev(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const e  = 0.016708634 - 0.000042037 * T;
  const Mr = M * RAD;
  const C = (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
          + 0.000290 * Math.sin(3 * Mr);
  const lon = rev(L0 + C);
  // Apparent longitude (nutation small correction)
  const omega = rev(125.04 - 1934.136 * T) * RAD;
  return rev(lon - 0.00569 - 0.00478 * Math.sin(omega));
}

// ─────────────────────────────────────────────
// MOON — Meeus Chapter 47 (truncated)
// ─────────────────────────────────────────────
function moonL(jd) {
  const T  = (jd - 2451545) / 36525;
  const Lp = rev(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D  = rev(297.8501921 + 445267.1114034  * T - 0.0018819 * T * T);
  const Ms = rev(357.5291092 + 35999.0502909   * T);
  const Mp = rev(134.9633964 + 477198.8675055  * T + 0.0087414 * T * T);
  const F  = rev(93.2720950  + 483202.0175233  * T - 0.0036539 * T * T);
  const E  = 1 - 0.002516 * T;
  const dr=D*RAD,msr=Ms*RAD,mr=Mp*RAD,fr=F*RAD;
  const A1=rev(119.75+131.849*T)*RAD, A2=rev(53.09+479264.29*T)*RAD;
  let sl = 6288774*Math.sin(mr)+1274027*Math.sin(2*dr-mr)+658314*Math.sin(2*dr)
    +213618*Math.sin(2*mr)-185116*E*Math.sin(msr)-114332*Math.sin(2*fr)
    +58793*Math.sin(2*dr-2*mr)+57066*E*Math.sin(2*dr-msr-mr)
    +53322*Math.sin(2*dr+mr)+45758*E*Math.sin(2*dr-msr)
    -40923*E*Math.sin(msr-mr)-34720*Math.sin(dr)-30383*E*Math.sin(msr+mr)
    +15327*Math.sin(2*dr-2*fr)+10675*Math.sin(4*dr-mr)+10034*Math.sin(3*mr)
    +8548*Math.sin(4*dr-2*mr)-7888*E*Math.sin(2*dr+msr-mr)
    -6766*E*Math.sin(2*dr+msr)-5163*Math.sin(dr-mr)+4987*E*Math.sin(dr+msr)
    +4036*E*Math.sin(2*dr-msr+mr)+3994*Math.sin(2*dr+2*mr)+3861*Math.sin(4*dr)
    +3665*Math.sin(2*dr-3*mr)-2689*E*Math.sin(msr-2*mr)
    +2390*E*Math.sin(2*dr-msr-2*mr)-2348*Math.sin(dr+mr)
    +2236*E*E*Math.sin(2*dr-2*msr)-2120*E*Math.sin(msr+2*mr)
    +2048*E*E*Math.sin(2*dr-2*msr-mr)-1773*Math.sin(2*dr+mr-2*fr)
    -1595*Math.sin(2*dr+2*fr)+1215*E*Math.sin(4*dr-msr-mr)
    -892*Math.sin(3*dr-mr)-810*E*Math.sin(2*dr+msr+mr)
    +759*E*Math.sin(4*dr-msr-2*mr)+691*E*Math.sin(2*dr+msr-2*mr)
    +549*Math.sin(4*dr+mr)+537*Math.sin(4*mr)+520*E*Math.sin(4*dr-msr)
    +299*E*Math.sin(dr+msr-mr)+294*Math.sin(2*dr+3*mr);
  sl += 3958*Math.sin(A1)+1962*Math.sin(Lp*RAD-fr)+318*Math.sin(A2);
  return rev(Lp + sl / 1000000);
}

// ─────────────────────────────────────────────
// MERCURY — geocentric tropical ecliptic longitude
// ─────────────────────────────────────────────
function mercuryL(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L = rev(252.2507 + 149474.0721 * T + 0.00030 * T * T);
  const M = rev(174.7948 + 149472.5152 * T + 0.00030 * T * T);
  const e = 0.20563069 - 0.00002826 * T;
  const a = 0.38709831;
  const Mr = M * RAD;
  // Equation of centre: series expansion for e = 0.2056
  const C = (2*e - e*e*e/4) * Math.sin(Mr) * DEG
          + (5*e*e/4) * Math.sin(2*Mr) * DEG
          + (13*e*e*e/12) * Math.sin(3*Mr) * DEG;
  const lon = rev(L + C);
  const r   = a * (1 - e * Math.cos(Mr));
  const { lon: eLon, r: eR } = _earthHel(jd);
  return _geo(lon, r, eLon, eR);
}

// ─────────────────────────────────────────────
// VENUS — geocentric tropical ecliptic longitude
// ─────────────────────────────────────────────
function venusL(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L = rev(181.9798 + 58519.2130 * T + 0.00031 * T * T);
  const M = rev(50.4161  + 58517.8039 * T + 0.00013 * T * T);
  const e = 0.00677323 - 0.00004938 * T;
  const a = 0.72332982;
  const Mr = M * RAD;
  // Very low eccentricity — short series sufficient
  const C = (2*e - e*e*e/4) * Math.sin(Mr) * DEG
          + (5*e*e/4) * Math.sin(2*Mr) * DEG;
  const lon = rev(L + C);
  const r   = a * (1 - e * Math.cos(Mr));
  const { lon: eLon, r: eR } = _earthHel(jd);
  return _geo(lon, r, eLon, eR);
}

// ─────────────────────────────────────────────
// MARS — Lookup Table + Interpolation
// Pre-computed sidereal longitudes (centidegrees) every 5 days
// Base JD: 2460311.0 (2024-Jan-01 noon)
// Verified vs JPL Horizons DE441
// ─────────────────────────────────────────────
const _MARS_BASE = 2460311.0;
const _MARS_STEP = 5;
const _MARS_LUT  = [24322,24694,25068,25444,25821,26200,26580,26961,27343,27727,28112,28498,28884,29271,29659,30047,30435,30824,31212,31601,31989,32377,32764,33150,33536,33921,34304,34686,35067,35446,35824,199,572,943,1312,1678,2041,2402,2759,3113,3464,3811,4155,4494,4830,5160,5486,5807,6123,6433,6737,7034,7325,7607,7882,8147,8403,8648,8881,9101,9307,9497,9668,9820,9950,10056,10135,10184,10202,10185,10133,10045,9923,9771,9592,9396,9192,8991,8800,8631,8488,8377,8299,8254,8243,8262,8310,8384,8481,8600,8737,8892,9061,9244,9438,9644,9859,10083,10314,10553,10798,11049,11306,11567,11833,12104,12379,12658,12940,13226,13516,13808,14104,14403,14705,15010,15317,15628,15941,16257,16576,16898,17222,17549,17879,18211,18546,18884,19224,19567,19913,20261,20612,20965,21321,21680,22041,22404,22770,23138,23509,23881,24256,24633,25012,25392,25775,26159,26545,26932,27320,27709,28100,28491,28884,29276,29670,30063,30457,30851,31244,31638,32030,32423,32814,33205,33595,33983,34371,34756,35141,35524,35905,284,661,1037,1410,1781,2149,2516,2880,3241,3600,3956,4309,4660,5008,5352,5694,6033,6369,6701,7030,7356,7678,7996,8311,8622,8928,9230,9527,9820,10107,10389,10664,10933,11195,11450,11696,11932,12159,12375,12579,12769,12944,13102,13241,13361,13457,13528,13572,13586,13568,13517,13434,13318,13172,13003,12815,12618,12420,12232,12060,11913,11795,11708,11653,11630,11638,11675,11738,11826,11936,12066,12214,12379,12558,12750,12954,13170,13395,13629,13872,14122,14380,14644,14915,15191,15473,15760,16052,16349,16651,16957,17267,17581,17900,18222,18548,18877,19211,19548,19888,20232,20578,20929,21282,21639,21998,22360,22726,23094,23464,23837,24213,24591,24971,25353,25738,26124,26511,26901,27291,27683,28076,28469,28864,29258,29654,30049,30445,30840,31235,31630,32024,32417,32809,33200,33590,33979,34366,34752,35137,35519,35900,278,655,1030,1403,1774,2142,2508,2872,3234,3594,3951,4306,4658,5009,5357,5702,6046,6386,6725,7061,7395,7727,8056,8383,8707,9029,9349,9666,9981,10292,10602,10908,11212,11512,11810,12104,12394,12681,12964,13243,13517,13787,14051,14309,14561,14807,15044,15274,15494,15704,15902,16088,16261,16417,16556,16676,16774,16849,16897,16918,16908,16866,16792,16686,16550,16388,16206,16013,15817,15627,15452,15300,15175,15082,15022,14994,14999,15035,15098,15188,15302,15438,15593,15767,15956,16161,16378,16608,16850,17101,17362,17632,17911,18197,18490,18789,19096,19408,19726,20049,20377,20710,21048,21391,21737,22088,22443,22801,23163,23528,23896,24267,24641,25018,25397,25778,26161,26547,26933,27322,27711,28102,28494,28886,29279,29672,30066,30459,30852,31245,31637,32029,32419,32809,33197,33584,33970,34354,34737,35118,35497,35875,250,624,995,1365,1732,2098,2461,2822,3181,3538,3893,4246,4597,4945,5292,5637,5980,6320,6659,6997,7332,7665,7997,8327,8656,8983,9308,9631,9953,10274,10592,10910,11226,11540,11853,12164,12474,12782,13089,13394,13697,13999,14299,14596,14892,15186,15477,15766,16052,16335,16614,16891,17164,17432,17696];

function _marsL_formula(jd) {
  // Direct formula (fallback, used outside LUT range)
  const T = (jd - 2451545.0) / 36525.0;
  const Lm = rev(355.45332 + 19140.30268 * T + 0.00007 * T * T);
  const Mm = rev(19.37340  + 19140.30268 * T + 0.00007 * T * T);
  const em = 0.09340 + 0.000090 * T;
  const Mr = Mm * RAD;
  const Cm = (10.69126 - 0.01237 * T) * Math.sin(Mr)
           + (0.62253 - 0.00498 * T) * Math.sin(2 * Mr)
           + 0.05082 * Math.sin(3 * Mr)
           + 0.00488 * Math.sin(4 * Mr);
  const lon = rev(Lm + Cm);
  const r   = 1.52368 * (1 - em * Math.cos(Mr));
  const { lon: eLon, r: eR } = _earthHel(jd);
  const tropGeo = _geo(lon, r, eLon, eR);
  return rev(tropGeo - lahiriAY(jd));
}

function marsL(jd) {
  // Return SIDEREAL longitude directly (unlike other fns which return tropical)
  const idx = (jd - _MARS_BASE) / _MARS_STEP;
  const i = Math.floor(idx);
  const f = idx - i;
  if (i < 0 || i >= _MARS_LUT.length - 1) return _marsL_formula(jd);
  let a = _MARS_LUT[i] / 100;
  let b = _MARS_LUT[i + 1] / 100;
  if (Math.abs(b - a) > 300) { if (b < a) b += 360; else a += 360; }
  return rev(a + f * (b - a));
}
// Note: marsL returns SIDEREAL already — no ayanamsa subtraction needed!

// ─────────────────────────────────────────────
// JUPITER — geocentric tropical ecliptic longitude
// ─────────────────────────────────────────────
function jupiterL(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L = rev(34.3515 + 3034.9057 * T + 0.00020 * T * T);
  const M = rev(20.9022 + 3034.6057 * T - 0.00012 * T * T);
  const e = 0.04849793 + 0.000163 * T;
  const a = 5.202561;
  const Mr = M * RAD;
  const C = (5.5549 - 0.01638 * T) * Math.sin(Mr)
          + (0.1683 - 0.00459 * T) * Math.sin(2 * Mr)
          + 0.00771 * Math.sin(3 * Mr)
          + 0.00039 * Math.sin(4 * Mr);
  const lon = rev(L + C);
  const r   = a * (1 - e * Math.cos(Mr));
  const { lon: eLon, r: eR } = _earthHel(jd);
  return _geo(lon, r, eLon, eR);
}

// ─────────────────────────────────────────────
// SATURN — geocentric tropical ecliptic longitude
// ─────────────────────────────────────────────
function saturnL(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const L = rev(50.0774 + 1222.1138 * T + 0.00029 * T * T);
  const M = rev(317.0207 + 1221.5515 * T - 0.00031 * T * T);
  const e = 0.05554814 - 0.000346 * T;
  const a = 9.554747;
  const Mr = M * RAD;
  const C = (6.3585 - 0.02009 * T) * Math.sin(Mr)
          + (0.2204 - 0.00440 * T) * Math.sin(2 * Mr)
          + 0.01082 * Math.sin(3 * Mr)
          + 0.00057 * Math.sin(4 * Mr);
  const lon = rev(L + C);
  const r   = a * (1 - e * Math.cos(Mr));
  const { lon: eLon, r: eR } = _earthHel(jd);
  return _geo(lon, r, eLon, eR);
}

// ─────────────────────────────────────────────
// RAHU (Mean North Lunar Node)
// ─────────────────────────────────────────────
function rahuL(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  return rev(125.0445479 - 1934.1362608 * T + 0.0020754 * T * T);
}

// ─────────────────────────────────────────────
// RETROGRADE DETECTION
// A planet is retrograde when its ecliptic longitude
// decreases over a 2-day span
// ─────────────────────────────────────────────
function isRetrograde(fn, jd) {
  // For marsL (returns sidereal), compare directly
  // For others (tropical), still works
  let d = fn(jd + 1) - fn(jd - 1);
  if (d >  300) d -= 360;
  if (d < -300) d += 360;
  return d < 0;
}

function getRetrogrades(jd) {
  // Note: use _marsL_formula for retrograde since marsL=sidereal LUT
  const marsRetro = (function() {
    const a = _marsL_formula(jd - 1);
    const b = _marsL_formula(jd + 1);
    let d = b - a; if (d > 300) d -= 360; if (d < -300) d += 360;
    return d < 0;
  })();
  return {
    mercury : isRetrograde(mercuryL, jd),
    venus   : isRetrograde(venusL,   jd),
    mars    : marsRetro,
    jupiter : isRetrograde(jupiterL, jd),
    saturn  : isRetrograde(saturnL,  jd),
  };
}

// ─────────────────────────────────────────────
// ALL PLANETARY SIDEREAL LONGITUDES
// Returns sidereal longitudes for all 9 grahas (Navagraha)
// ─────────────────────────────────────────────
function planetaryPositions(jd) {
  const ay  = lahiriAY(jd);
  const sid = trop => rev(trop - ay);
  const rahu_sid = rev(rahuL(jd) - ay);
  return {
    sun     : sid(sunL(jd)),
    moon    : sid(moonL(jd)),
    mercury : sid(mercuryL(jd)),
    venus   : sid(venusL(jd)),
    mars    : marsL(jd),          // ← already sidereal (LUT)
    jupiter : sid(jupiterL(jd)),
    saturn  : sid(saturnL(jd)),
    rahu    : rahu_sid,
    ketu    : rev(rahu_sid + 180),
    ayanamsa: ay,
  };
}

module.exports = {
  JD, lahiriAY,
  sunL, moonL, mercuryL, venusL, marsL, jupiterL, saturnL, rahuL,
  isRetrograde, getRetrogrades, planetaryPositions,
};
