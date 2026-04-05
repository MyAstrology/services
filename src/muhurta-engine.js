/**
 * muhurta-engine.js — MyAstrology.in Muhurta (Auspicious Time) Engine
 * Dr. Prodyut Acharya, Ranaghat, Nadia, West Bengal
 *
 * Computes precise auspicious windows for:
 *   বিবাহ, গৃহপ্রবেশ, গৃহনির্মাণ, অন্নপ্রাশন, নামকরণ,
 *   গর্ভধারণ, ব্যবসা আরম্ভ, ঋণ গ্রহণ/দান, ক্রয়-বিক্রয়,
 *   দীক্ষা, রত্নধারণ, গ্রহপূজা, শান্তিস্বস্ত্যয়ন, সাধভক্ষণ,
 *   যাত্রা (+ শুভ দিক)
 *
 * Pipeline: panjika-engine.js + moon-hourly.js → muhurta-engine.js
 */

'use strict';

// ════════════════════════════════════════════════════════
// LAGNA SETS FOR EACH KARMA
// ════════════════════════════════════════════════════════
var MUHURTA_LAGNAS = {
  vivah:     [2,5,6,8,11],        // মিথুন,কন্যা,তুলা,ধনু,মীন
  griha:     [1,3,4,5,6,8,11],    // বৃষ,কর্কট,সিংহ,কন্যা,তুলা,ধনু,মীন
  nirman:    [1,4,5,6,8,11],      // গৃহনির্মাণ: বৃষ,কর্কট,কন্যা,তুলা,ধনু,মীন
  annaprashan:[1,2,4,5,6,7,9,10,11], // অন্নপ্রাশন
  namakaran: [1,2,3,4,5,6,7,8,9,10,11], // নামকরণ (যেকোনো শুভ লগ্ন)
  garb:      [2,4,5,6,7,8,9,10,11], // গর্ভধারণ
  busi:      [1,2,3,6,9,10,11],   // ব্যবসা আরম্ভ
  deeksha:   [1,4,5,8,9],         // দীক্ষা: মেষ,কর্কট,সিংহ,ধনু,মকর
  ratna:     [1,2,4,5,6,8,9,11],  // রত্নধারণ
  puja:      [1,2,4,5,6,7,8,9,10,11], // গ্রহপূজা
  sadh:      [1,2,3,4,5,6,7,8,9,10,11], // সাধভক্ষণ
  rin:       [2,3,6,9,10,11],     // ঋণ গ্রহণ/দান
  kroya:     [1,2,4,5,9,10,11],   // ক্রয়-বিক্রয়/বাণিজ্য
  bhumikroya:[1,4,5,8,9,10],      // ভূমি ক্রয়
  shanti:    [1,4,5,6,8,11],      // শান্তিস্বস্ত্যয়ন
};

var KARMA_NAMES = {
  vivah:'বিবাহ', griha:'গৃহপ্রবেশ', nirman:'গৃহনির্মাণ',
  annaprashan:'অন্নপ্রাশন', namakaran:'নামকরণ', garb:'গর্ভধারণ',
  busi:'ব্যবসা আরম্ভ', deeksha:'দীক্ষা', ratna:'রত্নধারণ',
  puja:'গ্রহপূজা', sadh:'সাধভক্ষণ', rin:'ঋণ গ্রহণ',
  kroya:'ক্রয়-বিক্রয়', bhumikroya:'ভূমি ক্রয়', shanti:'শান্তিস্বস্ত্যয়ন',
  yatra:'শুভ যাত্রা'
};

var LAGNA_BN = ['মেষ','বৃষ','মিথুন','কর্কট','সিংহ','কন্যা','তুলা','বৃশ্চিক','ধনু','মকর','কুম্ভ','মীন'];

// Shubha Var for each karma
var SHUBHA_VAR = {
  vivah:     [1,3,4,5],  // Mon,Wed,Thu,Fri
  griha:     [1,3,4,5],
  garb:      [1,3,4,5],
  busi:      [3,4,5],
  deeksha:   [1,4],
  yatra:     [1,2,3,4,5],
  all:       [1,3,4,5]
};

// Yatra direction by weekday (0=Sun,1=Mon...)
var YATRA_DIRECTION = {
  0:'দক্ষিণ',1:'উত্তর',2:'পূর্ব',3:'উত্তর',4:'পূর্ব ও পশ্চিম',5:'পূর্ব ও পশ্চিম',6:'পশ্চিম'
};

// ════════════════════════════════════════════════════════
// LAGNA WINDOW CALCULATOR
// Verified: Jul 31, 2025 Thu মিথুন লগ্ন 01:53-04:07 ≈ ref 01:51-04:04 ✓
// ════════════════════════════════════════════════════════
function getLagnaWindows(y, m, d, lagnaSet, lat, lng, tz) {
  lat = lat || 23.167; lng = lng || 88.567; tz = tz || 5.5;
  var wins = [], prevRi = -1, startH = null;
  // Scan 18:00 to 30:00 IST (covers night and next morning)
  for (var i = 0; i <= 36*30; i++) {
    var h = 18 + i * (2/60);
    if (h >= 54) break;
    var hIST = h >= 24 ? h - 24 : h;
    var dayOff = h >= 24 ? 0 : -1;
    var jdT = JD(y, m, d + dayOff) + (hIST - tz + (dayOff ? 24 : 0)) / 24;
    var ri = calcLagnaAt(jdT, lat, lng).ri;
    if (ri !== prevRi) {
      if (prevRi !== -1 && lagnaSet.indexOf(prevRi) >= 0 && startH !== null) {
        wins.push({
          ri: prevRi, lagna: LAGNA_BN[prevRi],
          start: startH, end: hIST,
          nextDay: startH > hIST || hIST < 6
        });
      }
      startH = lagnaSet.indexOf(ri) >= 0 ? hIST : null;
      prevRi = ri;
    }
  }
  return wins;
}

// ════════════════════════════════════════════════════════
// SUTHIHIBUK YOGA CHECK
// বৃহস্পতিবার: মিথুন/ধনু লগ্নে = সুতহিবুকযোগ
// সোমবার: কর্কট লগ্নে, শুক্রবার: বৃষ/তুলা লগ্নে
// ════════════════════════════════════════════════════════
function isSuthihibuk(wd, lagnaRi) {
  if (wd === 4 && (lagnaRi === 2 || lagnaRi === 8)) return true; // Thu: Gemini/Sag
  if (wd === 1 && lagnaRi === 3) return true;  // Mon: Cancer
  if (wd === 5 && (lagnaRi === 1 || lagnaRi === 6)) return true; // Fri: Taurus/Libra
  return false;
}

// ════════════════════════════════════════════════════════
// ABHIJIT MUHURTA
// ════════════════════════════════════════════════════════
function getAbhijitMuhurta(rise, set) {
  var noon = (rise + set) / 2;
  return { start: noon - 24/60, end: noon + 24/60 };
}

// ════════════════════════════════════════════════════════
// MAIN MUHURTA CALCULATOR
// Returns auspicious times for any karma type on a given date
// ════════════════════════════════════════════════════════
function getMuhurtaTimes(dateStr, karmaType, lat, lng, tz) {
  lat = lat || 23.167; lng = lng || 88.567; tz = tz || 5.5;
  var pts = dateStr.split('-');
  var y = +pts[0], m = +pts[1], d = +pts[2];
  var dt = new Date(dateStr + 'T12:00:00');
  var c = calcDay ? calcDay(dt) : null;
  if (!c) return null;

  var result = {
    karmaType: karmaType,
    karmaName: KARMA_NAMES[karmaType] || karmaType,
    dateStr: dateStr,
    vara: c.vara,
    tithiName: c.tName,
    paksha: c.paksha,
    nakName: c.nak ? c.nak[0] : '',
    lagnaWindows: [],
    shubhaStart: null,
    garbTime: null,
    yatraDir: null,
    abhijit: null,
    mrityu: c.dd || null,
    warnings: []
  };

  // Abhijit muhurta
  if (c.st) result.abhijit = getAbhijitMuhurta(c.st.rise, c.st.set);

  // Check bad vara
  var shubhaVars = SHUBHA_VAR[karmaType] || SHUBHA_VAR.all;
  if (shubhaVars.indexOf(c.w) < 0) {
    result.warnings.push(c.vara + ' — এই বারে ' + (KARMA_NAMES[karmaType]||karmaType) + ' অশুভ');
  }

  // Dosha warnings
  if (c.dd && c.dd.total > 0) {
    result.warnings.push(c.dd.name + ' আছে');
  }

  // Lagna windows
  var lSet = MUHURTA_LAGNAS[karmaType] || MUHURTA_LAGNAS.griha;
  var wins = getLagnaWindows(y, m, d, lSet, lat, lng, tz);

  // Tag suthihibuk
  wins.forEach(function(w) {
    w.suthihibuk = isSuthihibuk(c.w, w.ri);
  });
  result.lagnaWindows = wins;

  // First shubha time (after baarbell, at or near abhijit)
  var lastBBend = 0;
  if (c.bb) c.bb.forEach(function(b) { if (b.en > lastBBend) lastBBend = b.en; });
  var abhStart = result.abhijit ? result.abhijit.start : (c.noon - 24/60);
  result.shubhaStart = Math.max(lastBBend > abhStart ? lastBBend : abhStart, c.st ? c.st.rise : 6);

  // Special: garbh = night amrita time
  if (karmaType === 'garb') {
    result.garbTime = (c.amN && c.amN.length) ? c.amN[0].st : (c.st ? c.st.set + 3.5 : 21);
  }

  // Yatra direction
  result.yatraDir = YATRA_DIRECTION[c.w || 0];

  return result;
}

// ════════════════════════════════════════════════════════
// MRITYU DOSHA DETAIL
// Returns full detail with bar/tithi/nak components + transitions
// ════════════════════════════════════════════════════════
function getMrityuDoshaDetail(c, nakTrans) {
  if (!c) return null;
  var tInPak = c.pakDay ? c.pakDay - 1 : 0;
  var ni = c.nak ? (c.nak[2] || 0) : 0; // nakIdx
  var dd = calcMrityuDosha ? calcMrityuDosha(c.w, tInPak, ni) : {total:0,name:'দোষ নেই'};

  var transitions = [];
  if (nakTrans && nakTrans.length > 0) {
    // Each nak transition may change dosha level
    nakTrans.forEach(function(tr) {
      var newDd = calcMrityuDosha ? calcMrityuDosha(c.w, tInPak, tr.nakIdx) : {total:0};
      transitions.push({
        time: tr.timeStr,
        nakName: tr.name,
        dosha: newDd.name
      });
    });
  }

  return {
    current: dd,
    components: {
      bar: ['রবি','মঙ্গল','শনি'].indexOf(c.vara) >= 0 ? c.vara + ' দোষ' : null,
      tithi: ['দ্বিতীয়া','সপ্তমী','দ্বাদশী'].indexOf(c.tName) >= 0 ? c.tName + ' দোষ' : null,
      nak: MRITYU_NAK ? (MRITYU_NAK[ni] || null) : null
    },
    transitions: transitions
  };
}

// ════════════════════════════════════════════════════════
// FORMAT HELPER
// ════════════════════════════════════════════════════════
function fmtMuhurtaHTML(result) {
  if (!result) return '<div style="color:#b52020;padding:.5rem;">তারিখ তথ্য পাওয়া যায়নি।</div>';

  var html = '<div style="padding:.5rem .65rem;">';
  html += '<div style="font-size:.78rem;font-weight:700;color:var(--gold-d);margin-bottom:.4rem;">'+result.karmaName+' — শুভ সময়</div>';
  html += '<div style="font-size:.67rem;color:var(--txt2);margin-bottom:.4rem;">'
    + result.dateStr + ' | ' + result.vara + ' | '
    + result.paksha + ' ' + result.tithiName + ' | ' + result.nakName + '</div>';

  // Warnings
  result.warnings.forEach(function(w) {
    html += '<div style="font-size:.66rem;color:#b52020;padding:.25rem .4rem;background:rgba(181,32,32,.06);border-radius:6px;margin-bottom:.3rem;">⚠️ ' + w + '</div>';
  });

  // Lagna windows
  if (result.lagnaWindows && result.lagnaWindows.length) {
    html += '<div style="display:flex;flex-direction:column;gap:.28rem;margin-bottom:.4rem;">';
    result.lagnaWindows.forEach(function(w) {
      function _ft(h){var hh=Math.floor(((h%24)+24)%24),mm=Math.round((h-Math.floor(h))*60);if(mm>=60){hh=(hh+1)%24;mm=0;}return('0'+hh).slice(-2)+':'+('0'+mm).slice(-2);}
      var nd = w.nextDay ? ' (পরদিন)' : '';
      var tag = w.suthihibuk ? '<span style="font-size:.58rem;background:rgba(37,102,37,.15);border-radius:4px;padding:.08rem .3rem;margin-left:.3rem;">সুতহিবুকযোগ</span>' : '';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:.35rem .5rem;'
        + 'background:rgba(37,102,37,.08);border-radius:8px;border:1px solid rgba(37,102,37,.18);">'
        + '<span style="font-size:.71rem;font-weight:700;color:var(--green);">' + w.lagna + ' লগ্ন' + tag + '</span>'
        + '<span style="font-size:.69rem;color:var(--txt);">' + _ft(w.start) + ' – ' + _ft(w.end) + nd + '</span></div>';
    });
    html += '</div>';
  } else {
    html += '<div style="padding:.4rem .5rem;background:rgba(181,32,32,.06);border-radius:8px;font-size:.7rem;color:#b52020;margin-bottom:.35rem;">⚠️ আজ শুভ লগ্ন নেই</div>';
  }

  // Abhijit
  if (result.abhijit) {
    function _ft2(h){var hh=Math.floor(((h%24)+24)%24),mm=Math.round((h-Math.floor(h))*60);if(mm>=60){hh=(hh+1)%24;mm=0;}return('0'+hh).slice(-2)+':'+('0'+mm).slice(-2);}
    html += '<div style="font-size:.68rem;color:var(--txt2);margin-bottom:.28rem;">⭐ অভিজিৎ মুহূর্ত: '
      + _ft2(result.abhijit.start) + ' – ' + _ft2(result.abhijit.end) + '</div>';
  }

  // Garb time
  if (result.garbTime) {
    function _ft3(h){var hh=Math.floor(((h%24)+24)%24),mm=Math.round((h-Math.floor(h))*60);if(mm>=60){hh=(hh+1)%24;mm=0;}return('0'+hh).slice(-2)+':'+('0'+mm).slice(-2);}
    html += '<div style="padding:.35rem .5rem;background:rgba(37,102,37,.08);border-radius:8px;font-size:.7rem;color:var(--green);margin-bottom:.28rem;">🌙 রাত্রি ' + _ft3(result.garbTime) + ' পরে গর্ভধারণ শুভ</div>';
  }

  // Yatra
  if (result.yatraDir && result.karmaType === 'yatra') {
    html += '<div style="font-size:.7rem;color:var(--txt);margin-bottom:.28rem;">🧭 শুভ দিক: ' + result.yatraDir + '</div>';
  }

  html += '</div>';
  return html;
}

if (typeof module !== 'undefined') {
  module.exports = { getMuhurtaTimes, getLagnaWindows, getMrityuDoshaDetail,
                     fmtMuhurtaHTML, MUHURTA_LAGNAS, KARMA_NAMES, LAGNA_BN };
}
