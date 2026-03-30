
/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: generate.js
 * কাজ: সব মডিউল একত্রিত করে SEO-অপটিমাইজড দৈনিক রাশিফল HTML তৈরি করা
 * চালানো: node src/generate.js
 * 
 * SEO বৈশিষ্ট্য:
 *   - ডায়নামিক মেটা ট্যাগ (শিরোনাম, বিবরণ, কীওয়ার্ড)
 *   - JSON-LD স্কিমা (NewsArticle, FAQPage, BreadcrumbList, WebPage)
 *   - ডায়নামিক OG ইমেজ (Canvas)
 *   - মাস্টার আর্কাইভ মাস-ফিল্টার সহ
 *   - নিউজ সাইটম্যাপ ও প্রধান সাইটম্যাপ জেনারেশন
 *   - কোর ওয়েব ভাইটাল অপটিমাইজড
 * ============================================================
 */

const fs = require('fs');
const path = require('path');

// ==================== কনফিগ লোড ====================
let CFG = {};
const cfgPath = path.join(__dirname, 'config.json');
if (fs.existsSync(cfgPath)) {
  try {
    CFG = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  } catch (e) {
    console.warn('⚠️ config.json পড়তে সমস্যা — default ব্যবহার হবে');
  }
}

const SITE_URL = CFG.SITE_URL || 'https://www.myastrology.in';
const LAT = CFG.LAT ?? 23.18;
const LNG = CFG.LNG ?? 88.56;
const TZ = CFG.TZ ?? 5.5;
const WHATSAPP = CFG.WHATSAPP || '919333122768';

// ★★★ OUTPUT_DIR কাস্টমাইজেশন (টেস্টের জন্য এনভায়রনমেন্ট সাপোর্ট) ★★★
const CUSTOM_OUTPUT_DIR = process.env.OUTPUT_DIR;
const OUTPUT_DIR = CUSTOM_OUTPUT_DIR 
  ? path.join(__dirname, '..', CUSTOM_OUTPUT_DIR)
  : path.join(__dirname, CFG.OUTPUT_DIR || '../rashifal');

const CACHE_DIR = path.join(__dirname, CFG.CACHE_DIR || '../cache');
const TEMPLATE = path.join(__dirname, 'daily.template.html');

console.log(`📁 আউটপুট ডিরেক্টরি: ${OUTPUT_DIR}`);
console.log(`📦 ক্যাশ ডিরেক্টরি: ${CACHE_DIR}`);

// ==================== TARGET DATE (ভারতীয় সময় IST) ====================
let TARGET_DATE;

if (process.env.TARGET_DATE && process.env.TARGET_DATE !== '') {
  TARGET_DATE = new Date(process.env.TARGET_DATE + 'T00:00:00');
  console.log(`📅 Using TARGET_DATE from env: ${process.env.TARGET_DATE}`);
} else {
  // সরল পদ্ধতি: আগামীকালের রাশিফল তৈরি করুন
  TARGET_DATE = new Date();
  TARGET_DATE.setDate(TARGET_DATE.getDate() + 1);
  console.log(`📅 No TARGET_DATE env — using tomorrow: ${TARGET_DATE.toISOString().slice(0,10)}`);
}

if (isNaN(TARGET_DATE.getTime())) {
  console.error('❌ TARGET_DATE invalid, using tomorrow');
  TARGET_DATE = new Date();
  TARGET_DATE.setDate(TARGET_DATE.getDate() + 1);
}
// ==================== ইউটিলিটি ইম্পোর্ট ====================
const { toBn, getRahuKal, getGulikaKal, getYamaGhanta, getAbhijitMuhurta, fmtTime } = require('./utils/bengali');
const { generateOgImage, cleanupOldOgImages } = require('./utils/ogImage');

const {
  RASHI_NAMES, RASHI_ENG, RASHI_SYM, RASHI_LORD, RASHI_EL, RASHI_NAT,
  RASHI_GEM, LUCKY_DIRS, MANTRAS, GOOD_HOUSES, BAD_HOUSES,
  BN_MONTHS, EN_MONTHS, BN_WEEKDAY
} = require('./utils/constants');

// ==================== অ্যাস্ট্রোনমি ইম্পোর্ট ====================
const { JD } = require('./astronomy/jd');
const { sunL, moonL, saturnL, jupiterL, rahuL, getRashiIdx } = require('./astronomy/planets');
const { lahiriAY } = require('./astronomy/ayanamsa');
const { sunTimes } = require('./astronomy/sunTimes');

// ==================== পঞ্চাঙ্গ ইম্পোর্ট ====================
const { getTithiName, getTithiShort } = require('./panchanga/tithi');
const { getNakshatraName } = require('./panchanga/nakshatra');
const { getYogaName } = require('./panchanga/yoga');
const { getKaranName } = require('./panchanga/karan');
const { getBnDate, formatBnDate, formatBnDateFull } = require('./panchanga/bengaliDate');

// ==================== গোচর ইম্পোর্ট ====================
const { getHouseEffects } = require('./gochar/houseEffects');
const { SURYA_GOCHAR, SHANI_GOCHAR, GURU_GOCHAR, RAHU_GOCHAR, MARS_GOCHAR, MERCURY_GOCHAR, VENUS_GOCHAR } = require('./gochar/planetGochar');
const { ELEMENT_STYLES, getDeterministicElement } = require('./gochar/elementStyles');
const { isSaturnAspect, isJupiterAspect, isMarsAspect, isMercuryAspect, isVenusAspect, getAspectText, getAspectSummary, getAllAspects } = require('./gochar/aspects');
const { enhanceLoveTextAdvanced, enhanceWorkTextAdvanced, enhanceHealthTextAdvanced, enhanceFinanceTextAdvanced } = require('./gochar/aspectEffects');

// ==================== ক্যাশিং ====================
const { readCache, writeCache } = require('./utils/cache');

// ==================== গ্রহের অবস্থান গণনা (ক্যাশ সহ) ====================
function getPlanetPositions(date) {
  const dateStr = date.toISOString().slice(0, 10);
  
  const cached = readCache(CACHE_DIR, dateStr);
  if (cached) {
    console.log(`📦 ক্যাশ থেকে গ্রহের অবস্থান লোড: ${dateStr}`);
    return cached;
  }
  
  console.log(`🔭 গ্রহের অবস্থান গণনা: ${dateStr}`);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jd = JD(y, m, d) + 0.5;
  
  const positions = {
    jd,
    sun: sunL(jd),
    moon: moonL(jd),
    mars: marsL(jd),
    mercury: mercuryL(jd),
    venus: venusL(jd),
    saturn: saturnL(jd),
    jupiter: jupiterL(jd),
    rahu: rahuL(jd)
  };
  
  writeCache(CACHE_DIR, dateStr, positions);
  return positions;
}

// ==================== মঙ্গল, বুধ, শুক্রের দ্রাঘিমাংশ (যদি না থাকে) ====================
function marsL(jd) {
  const T = (jd - 2451545) / 36525;
  const L = ((355.433 + 19140.299 * T) % 360 + 360) % 360;
  const M = ((19.373 + 19140.299 * T) % 360 + 360) * Math.PI / 180;
  return ((L + 9.36 * Math.sin(M) + 0.93 * Math.sin(2 * M)) % 360 + 360) % 360;
}

function mercuryL(jd) {
  const T = (jd - 2451545) / 36525;
  const L = ((252.251 + 149472.674 * T) % 360 + 360) % 360;
  const M = ((174.791 + 149472.674 * T) % 360 + 360) * Math.PI / 180;
  return ((L + 23.44 * Math.sin(M) + 2.73 * Math.sin(2 * M)) % 360 + 360) % 360;
}

function venusL(jd) {
  const T = (jd - 2451545) / 36525;
  const L = ((181.979 + 58517.815 * T) % 360 + 360) % 360;
  const M = ((50.416 + 58517.815 * T) % 360 + 360) * Math.PI / 180;
  return ((L + 10.19 * Math.sin(M) + 0.64 * Math.sin(2 * M)) % 360 + 360) % 360;
}

// ==================== রাশি নির্ধারণ ====================
function getRashiFromLongitude(lng, jd) {
  const ay = lahiriAY(jd);
  return Math.floor(((lng - ay) % 360 + 360) % 360 / 30);
}



// ==================== রাশিফল ডেটা জেনারেশন ====================
function generateRashifalData(date) {
  const planets = getPlanetPositions(date);
  const jd = planets.jd;
  const ay = lahiriAY(jd);
  
  const sid = lng => Math.floor(((lng - ay) % 360 + 360) % 360 / 30);
  
  const moonRashi = sid(planets.moon);
  const sunRashi = sid(planets.sun);
  const marsRashi = sid(planets.mars);
  const mercuryRashi = sid(planets.mercury);
  const venusRashi = sid(planets.venus);
  const saturnRashi = sid(planets.saturn);
  const jupiterRashi = sid(planets.jupiter);
  const rahuRashi = sid(planets.rahu);
  const ketuRashi = (rahuRashi + 6) % 12;
  
  const houseEffects = getHouseEffects();
  const data = [];
  
  for (let ri = 0; ri < 12; ri++) {
    const house = ((moonRashi - ri + 12) % 12) + 1;
    const g = houseEffects[house];
    
    // সব গ্রহের দৃষ্টি একসাথে
    const aspects = getAllAspects({
      mars: marsRashi,
      mercury: mercuryRashi,
      venus: venusRashi,
      saturn: saturnRashi,
      jupiter: jupiterRashi
    }, ri);
    
    const rashiElement = RASHI_EL[ri];
    const elemStyle = ELEMENT_STYLES[rashiElement] || ELEMENT_STYLES['পৃথিবী'];
    const dateStr = date.toISOString().slice(0, 10);
    
    let loveText = { ...g.love };
    let workText = { ...g.work };
    let healthText = { ...g.health };
    let financeText = { ...g.finance };
    
    if (elemStyle) {
      loveText.short = getDeterministicElement(elemStyle.short?.love || elemStyle.love, `${dateStr}-${ri}-love`);
      workText.short = getDeterministicElement(elemStyle.short?.work || elemStyle.work, `${dateStr}-${ri}-work`);
      healthText.short = getDeterministicElement(elemStyle.short?.health || elemStyle.health, `${dateStr}-${ri}-health`);
      financeText.short = getDeterministicElement(elemStyle.short?.finance || elemStyle.finance, `${dateStr}-${ri}-finance`);
      
      if (elemStyle.detailed) {
        loveText.detailed = getDeterministicElement(elemStyle.detailed.love || [loveText.detailed], `${dateStr}-${ri}-love-detailed`);
        workText.detailed = getDeterministicElement(elemStyle.detailed.work || [workText.detailed], `${dateStr}-${ri}-work-detailed`);
        healthText.detailed = getDeterministicElement(elemStyle.detailed.health || [healthText.detailed], `${dateStr}-${ri}-health-detailed`);
        financeText.detailed = getDeterministicElement(elemStyle.detailed.finance || [financeText.detailed], `${dateStr}-${ri}-finance-detailed`);
      }
      if (elemStyle.advice) {
        loveText.advice = getDeterministicElement(elemStyle.advice.love || [loveText.advice], `${dateStr}-${ri}-love-advice`);
        workText.advice = getDeterministicElement(elemStyle.advice.work || [workText.advice], `${dateStr}-${ri}-work-advice`);
        healthText.advice = getDeterministicElement(elemStyle.advice.health || [healthText.advice], `${dateStr}-${ri}-health-advice`);
        financeText.advice = getDeterministicElement(elemStyle.advice.finance || [financeText.advice], `${dateStr}-${ri}-finance-advice`);
      }
    }
    
    // ★★★ নতুন কোড: দৃষ্টির গভীর প্রভাব যুক্ত করা ★★★
    const context = {
      date: date,
      rashiElement: RASHI_EL[ri],
      targetRashi: ri,
      planetRashis: { 
        mars: marsRashi, 
        mercury: mercuryRashi, 
        venus: venusRashi, 
        saturn: saturnRashi, 
        jupiter: jupiterRashi 
      }
    };
    
    loveText.detailed = enhanceLoveTextAdvanced(loveText.detailed, aspects, context);
    workText.detailed = enhanceWorkTextAdvanced(workText.detailed, aspects, context);
    healthText.detailed = enhanceHealthTextAdvanced(healthText.detailed, aspects, context);
    financeText.detailed = enhanceFinanceTextAdvanced(financeText.detailed, aspects, context);
    // ★★★ নতুন কোড শেষ ★★★
    
    const sunHouse = ((sunRashi - ri + 12) % 12) + 1;
    const marsHouse = ((marsRashi - ri + 12) % 12) + 1;
    const mercuryHouse = ((mercuryRashi - ri + 12) % 12) + 1;
    const venusHouse = ((venusRashi - ri + 12) % 12) + 1;
    const saturnHouse = ((saturnRashi - ri + 12) % 12) + 1;
    const jupiterHouse = ((jupiterRashi - ri + 12) % 12) + 1;
    const rahuHouse = ((rahuRashi - ri + 12) % 12) + 1;
    
    const planetStatus = h => GOOD_HOUSES.has(h) ? 'good' : BAD_HOUSES.has(h) ? 'bad' : 'neutral';
    
    const planetsList = [
      { ico: '☀️', name: 'সূর্য', ...SURYA_GOCHAR[sunHouse], house: sunHouse, status: planetStatus(sunHouse), statusLabel: GOOD_HOUSES.has(sunHouse) ? 'শুভ' : BAD_HOUSES.has(sunHouse) ? 'অশুভ' : 'মধ্যম', houseLabel: `${toBn(sunHouse)}ম ভাবে` },
      { ico: '♂', name: 'মঙ্গল', ...MARS_GOCHAR[marsHouse], house: marsHouse, status: planetStatus(marsHouse), statusLabel: GOOD_HOUSES.has(marsHouse) ? 'শুভ' : BAD_HOUSES.has(marsHouse) ? 'অশুভ' : 'মধ্যম', houseLabel: `${toBn(marsHouse)}ম ভাবে` },
      { ico: '☿', name: 'বুধ', ...MERCURY_GOCHAR[mercuryHouse], house: mercuryHouse, status: planetStatus(mercuryHouse), statusLabel: GOOD_HOUSES.has(mercuryHouse) ? 'শুভ' : BAD_HOUSES.has(mercuryHouse) ? 'অশুভ' : 'মধ্যম', houseLabel: `${toBn(mercuryHouse)}ম ভাবে` },
      { ico: '♀', name: 'শুক্র', ...VENUS_GOCHAR[venusHouse], house: venusHouse, status: planetStatus(venusHouse), statusLabel: GOOD_HOUSES.has(venusHouse) ? 'শুভ' : BAD_HOUSES.has(venusHouse) ? 'অশুভ' : 'মধ্যম', houseLabel: `${toBn(venusHouse)}ম ভাবে` },
      { ico: '🪐', name: 'শনি', ...SHANI_GOCHAR[saturnHouse], house: saturnHouse, status: planetStatus(saturnHouse), statusLabel: GOOD_HOUSES.has(saturnHouse) ? 'শুভ' : BAD_HOUSES.has(saturnHouse) ? 'অশুভ' : 'মধ্যম', houseLabel: `${toBn(saturnHouse)}ম ভাবে` },
      { ico: '♃', name: 'বৃহস্পতি', ...GURU_GOCHAR[jupiterHouse], house: jupiterHouse, status: planetStatus(jupiterHouse), statusLabel: GOOD_HOUSES.has(jupiterHouse) ? 'শুভ' : BAD_HOUSES.has(jupiterHouse) ? 'অশুভ' : 'মধ্যম', houseLabel: `${toBn(jupiterHouse)}ম ভাবে` },
      { ico: '☊', name: 'রাহু', ...RAHU_GOCHAR[rahuHouse], house: rahuHouse, status: planetStatus(rahuHouse), statusLabel: GOOD_HOUSES.has(rahuHouse) ? 'শুভ' : BAD_HOUSES.has(rahuHouse) ? 'অশুভ' : 'মধ্যম', houseLabel: `${toBn(rahuHouse)}ম ভাবে` }
    ];
    
    const aspectSummary = getAspectSummary(aspects);
    if (aspectSummary) {
      planetsList.push({
        ico: '👁️',
        name: 'দৃষ্টি',
        tag: 'গ্রহের দৃষ্টি',
        txt: aspectSummary,
        col: '#8e44ad',
        status: 'neutral',
        statusLabel: 'মধ্যম',
        houseLabel: ''
      });
    }
    
    const planetFooter = `☀️ ${RASHI_NAMES[sunRashi]} · ♂ ${RASHI_NAMES[marsRashi]} · ☿ ${RASHI_NAMES[mercuryRashi]} · ♀ ${RASHI_NAMES[venusRashi]} · 🪐 ${RASHI_NAMES[saturnRashi]} · ♃ ${RASHI_NAMES[jupiterRashi]} · ☊ ${RASHI_NAMES[rahuRashi]} · ☋ ${RASHI_NAMES[ketuRashi]}`;
    const rashiInfo = `${RASHI_ENG[ri]} | অধিপতি: ${RASHI_LORD[ri]} | ${RASHI_EL[ri]} | ${RASHI_NAT[ri]}`;
    
    data.push({
      rashi: RASHI_NAMES[ri],
      rashiInfo,
      house,
      tag: g.tag,
      tagCol: g.tagCol,
      gocharLabel: g.gocharLabel,
      summary: g.summary + (aspectSummary ? `\n${aspectSummary}` : ''),
      score: g.score,
      love: loveText,
      work: workText,
      health: healthText,
      finance: financeText,
      spiritual: g.spiritual,
      lucky: { nums: g.lucky.nums, colors: g.lucky.colors, goodTime: g.lucky.goodTime, badTime: g.lucky.badTime, dir: LUCKY_DIRS[ri] },
      gem: RASHI_GEM[ri],
      caution: g.caution,
      mantra: MANTRAS[ri],
      planets: planetsList,
      planetFooter
    });
  }
  
  return { moonRashi, sunRashi, marsRashi, mercuryRashi, venusRashi, saturnRashi, jupiterRashi, rahuRashi, ketuRashi, data };
}      
      

// ==================== HTML বিল্ডার ====================
function buildRashiCards(rashifalData) {
  return rashifalData.data.map((d, i) => {
    const house = d.house;
    const dotClass = (house === 11 || house === 9 || house === 3) ? ' rg-good' : (house === 1 || house === 8 || house === 12) ? ' rg-bad' : '';
    return `<div class="rb${dotClass}" onclick="showRashi(${i})" role="button" aria-label="${RASHI_NAMES[i]} রাশিফল দেখুন">
  <div class="rb-s">${RASHI_SYM[i]}</div>
  <div class="rb-n">${RASHI_NAMES[i]}</div>
  <div class="rb-l" style="color:${d.tagCol}">${d.tag}</div>
</div>`;
  }).join('\n');
}

function buildDefaultRashiDetail(rashifalData) {
  const d = rashifalData.data[0];
  const stars = s => '★'.repeat(s) + '☆'.repeat(5 - s);
  const overScore = Math.round((d.score.love + d.score.work + d.score.health + d.score.finance) / 4);
  const oLabel = ['', 'কঠিন', 'সাধারণ', 'মধ্যম', 'ভালো', 'অত্যন্ত শুভ'];
  
  return `<div class="rf-detail" id="rfDetailDefault">
  <div class="rf-header">
    <div class="rf-sym">${RASHI_SYM[0]}</div>
    <div>
      <div class="rf-name">${RASHI_NAMES[0]} রাশি</div>
      <div class="rf-sub">${d.rashiInfo}</div>
      <div class="rf-chips">
        <span class="rc ${overScore >= 4 ? 'good' : (overScore <= 2 ? 'bad' : '')}">⭐ ${oLabel[overScore]}</span>
        <span class="rc" style="color:${d.tagCol};border-color:${d.tagCol};">🌙 ${d.gocharLabel}</span>
        <span class="rc">💎 ${d.gem}</span>
      </div>
    </div>
  </div>
  <div class="gochar-summary">
    <div class="gochar-label" style="color:${d.tagCol}">🌙 চন্দ্র গোচর বিচার — আজকের ফল</div>
    <div class="gochar-main">${d.gocharLabel} <span class="gochar-tag" style="background:${d.tagCol}">${d.tag}</span></div>
    <div class="gochar-text">${d.summary}</div>
  </div>
  <div class="score-grid">
    ${[['💑', 'প্রেম ও সম্পর্ক', 'love'], ['💼', 'কর্ম ও ব্যবসা', 'work'], ['🌿', 'স্বাস্থ্য', 'health'], ['💰', 'আর্থিক অবস্থা', 'finance']].map(([ico, title, k]) => {
      const sc = d.score[k];
      const cls = sc >= 4 ? 's4' : sc >= 3 ? 's3' : 's2';
      const bc = sc >= 4 ? 'var(--green)' : sc >= 3 ? 'var(--gold)' : 'var(--red)';
      return `<div class="scard">
        <div class="scard-head"><span class="scard-ico">${ico}</span><span class="scard-title">${title}</span><span class="scard-stars ${cls}">${stars(sc)}</span></div>
        <div class="scard-short">${d[k].short}</div>
        <div class="scard-detail">${d[k].detailed}</div>
        <div class="scard-advice">💡 ${d[k].advice}</div>
        <div class="score-bar"><div class="score-fill" style="width:${sc * 20}%;background:${bc}"></div></div>
      </div>`;
    }).join('')}
  </div>
  <div class="spiritual-box"><div class="ico">🕉️</div><p>${d.spiritual}</p></div>
  <div class="caution-box">
    <span class="caution-ico">⚠️</span>
    <div>
      <div class="caution-title">আজকের সতর্কতা</div>
      <ul class="caution-list">${d.caution.map(c => `<li>${c}</li>`).join('')}</ul>
    </div>
  </div>
</div>`;
}

function buildArchiveLinks(targetDate, rashifalResult) {
  const links = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(targetDate);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const filePath = path.join(OUTPUT_DIR, iso + '.html');
    if (i > 0 && !fs.existsSync(filePath)) continue;
    const isToday = (i === 0);
    const bn = getBnDate(d);
    const bnLabel = bn ? `${toBn(bn.d)} ${bn.name} ${toBn(bn.y)}` : iso;
    const moonLabel = (isToday && rashifalResult) ? `<span class="arc-moon">🌙 চন্দ্র ${RASHI_NAMES[rashifalResult.moonRashi]}</span>` : '';
    links.push(
      `<a href="/rashifal/${iso}.html" class="arc-link${isToday ? ' today' : ''}">` +
      `<span class="arc-bn">📅 ${bnLabel}</span>` +
      `<span class="arc-iso">${iso}</span>` +
      `<span class="arc-tag">মেষ–মীন রাশিফল</span>` +
      moonLabel + `</a>`
    );
    if (links.length >= 7) break;
  }
  if (links.length === 0) links.push('<span style="font-size:.8rem;color:var(--mu);">আর্কাইভ শীঘ্রই আসছে。</span>');
  return links.join('\n');
}

// ==================== SEO-অপটিমাইজড স্কিমা বিল্ডার ====================
function buildSchema(date, rashifalResult, ogImageUrl, panchang) {
  const iso = date.toISOString().slice(0, 10);
  const bnDate = formatBnDate(date);
  const bnDateFull = formatBnDateFull(date);
  const moonRashiName = RASHI_NAMES[rashifalResult.moonRashi];
  const sunRashiName = RASHI_NAMES[rashifalResult.sunRashi];
  const finalOgUrl = ogImageUrl || `${SITE_URL}/images/daily-rashifal-og.webp`;
  
  // শুভ ও অশুভ রাশি নির্ণয়
  const scores = rashifalResult.data.map((d, i) => ({ name: RASHI_NAMES[i], avg: (d.score.love + d.score.work + d.score.health + d.score.finance) / 4 }));
  const bestRashi = scores.reduce((a, b) => a.avg > b.avg ? a : b).name;
  const worstRashi = scores.reduce((a, b) => a.avg < b.avg ? a : b).name;
  
  return JSON.stringify([
    // NewsArticle Schema
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": `${bnDate} দৈনিক রাশিফল — ১২ রাশির বিস্তারিত ফল | MyAstrology`,
      "description": `${bnDate} তারিখের ১২ রাশির বিস্তারিত দৈনিক রাশিফল। চন্দ্র ${moonRashiName} রাশিতে, সূর্য ${sunRashiName} রাশিতে। প্রেম, কর্ম, স্বাস্থ্য, অর্থ ও সতর্কতা সহ সম্পূর্ণ বিশ্লেষণ। আজকের শুভ রাশি: ${bestRashi}, সতর্ক রাশি: ${worstRashi}।`,
      "datePublished": `${iso}T05:00:00+05:30`,
      "dateModified": `${iso}T05:00:00+05:30`,
      "image": { "@type": "ImageObject", "url": finalOgUrl, "width": 1200, "height": 630 },
      "url": `${SITE_URL}/rashifal/${iso}.html`,
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/rashifal/${iso}.html` },
      "inLanguage": "bn-IN",
      "author": {
        "@type": "Person",
        "name": "Dr. Prodyut Acharya",
        "url": `${SITE_URL}/about.html`,
        "jobTitle": "Vedic Astrologer & Palmist",
        "alumniOf": "University of Calcutta"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MyAstrology",
        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/images/MyAstrology-Ranghat-logo.png` },
        "url": SITE_URL,
        "sameAs": [
          "https://www.facebook.com/Dr.ProdyutAcharya",
          "https://www.youtube.com/@myastrology",
          "https://www.instagram.com/myastrology.in",
          "https://x.com/AcharyaProdyut"
        ]
      },
      "articleSection": "রাশিফল",
      "keywords": `দৈনিক রাশিফল, আজকের রাশিফল, বাংলা রাশিফল, ${bnDate} রাশিফল, চন্দ্র ${moonRashiName} রাশি, সূর্য ${sunRashiName} রাশি, মেষ রাশিফল, বৃষ রাশিফল, মিথুন রাশিফল, কর্কট রাশিফল, সিংহ রাশিফল, কন্যা রাশিফল, তুলা রাশিফল, বৃশ্চিক রাশিফল, ধনু রাশিফল, মকর রাশিফল, কুম্ভ রাশিফল, মীন রাশিফল, ড. প্রদ্যুৎ আচার্য`,
      "about": [
        { "@type": "Thing", "name": "দৈনিক রাশিফল" },
        { "@type": "Thing", "name": "বাংলা রাশিফল" },
        { "@type": "Thing", "name": "চন্দ্র গোচর" }
      ]
    },
    // BreadcrumbList Schema
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "হোম", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "রাশিফল সংগ্রহ", "item": `${SITE_URL}/rashifal/` },
        { "@type": "ListItem", "position": 3, "name": `${bnDate} রাশিফল`, "item": `${SITE_URL}/rashifal/${iso}.html` }
      ]
    },
    // Organization Schema
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "MyAstrology – Dr. Prodyut Acharya",
      "url": SITE_URL,
      "logo": `${SITE_URL}/images/MyAstrology-Ranghat-logo.png`,
      "description": "ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষ ও হস্তরেখা বিচার কেন্দ্র, রানাঘাট, নদিয়া, পশ্চিমবঙ্গ। দৈনিক রাশিফল, পঞ্জিকা, জন্মকুণ্ডলী বিশ্লেষণ, শুভ মুহূর্ত নির্ধারণ।",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Nasra Magur Khali, Tut Bagan, Post Nasra",
        "addressLocality": "Ranaghat",
        "addressRegion": "West Bengal",
        "postalCode": "741202",
        "addressCountry": "IN"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": LAT, "longitude": LNG },
      "telephone": `+91-${WHATSAPP}`,
      "email": "info@myastrology.in",
      "sameAs": [
        "https://www.facebook.com/Dr.ProdyutAcharya",
        "https://www.youtube.com/@myastrology",
        "https://www.instagram.com/myastrology.in",
        "https://x.com/AcharyaProdyut"
      ]
    }
  ]);
}

function buildFaqSchema(date, rashifalResult, panchang) {
  const moonRashiName = RASHI_NAMES[rashifalResult.moonRashi];
  const sunRashiName = RASHI_NAMES[rashifalResult.sunRashi];
  const marsRashiName = RASHI_NAMES[rashifalResult.marsRashi];
  const mercuryRashiName = RASHI_NAMES[rashifalResult.mercuryRashi];
  const venusRashiName = RASHI_NAMES[rashifalResult.venusRashi];
  const jupiRashiName = RASHI_NAMES[rashifalResult.jupiterRashi];
  const saniRashiName = RASHI_NAMES[rashifalResult.saturnRashi];
  const ketuRashiName = RASHI_NAMES[rashifalResult.ketuRashi];
  const bnDate = formatBnDate(date);
  
  const scores = rashifalResult.data.map((d, i) => ({ name: RASHI_NAMES[i], avg: (d.score.love + d.score.work + d.score.health + d.score.finance) / 4 }));
  const bestRashi = scores.reduce((a, b) => a.avg > b.avg ? a : b).name;
  const worstRashi = scores.reduce((a, b) => a.avg < b.avg ? a : b).name;
  
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `আজ ${bnDate}-এ চন্দ্র কোন রাশিতে আছে?`, "acceptedAnswer": { "@type": "Answer", "text": `আজ ${bnDate} তারিখে চন্দ্র ${moonRashiName} রাশিতে বিচরণ করছে। চন্দ্র গোচর অনুযায়ী দৈনিক রাশিফল নির্ধারিত হয়।` } },
      { "@type": "Question", "name": `আজ ${bnDate}-এর তিথি কী?`, "acceptedAnswer": { "@type": "Answer", "text": `আজ ${bnDate} তারিখের তিথি হল ${panchang.tithi}। বৈদিক জ্যোতিষে তিথি শুভ-অশুভ কাজের সময় নির্ধারণে গুরুত্বপূর্ণ।` } },
      { "@type": "Question", "name": `আজকের নক্ষত্র কোনটি?`, "acceptedAnswer": { "@type": "Answer", "text": `আজ ${bnDate} তারিখে চন্দ্র ${panchang.nakshatra} নক্ষত্রে অবস্থান করছে। ২৭টি নক্ষত্রের মধ্যে এটি আজকের দিনের বিশেষ প্রভাব নির্ধারণ করে।` } },
      { "@type": "Question", "name": `আজ কোন পঞ্চাঙ্গ যোগ?`, "acceptedAnswer": { "@type": "Answer", "text": `আজ ${bnDate} তারিখে ${panchang.yoga} যোগ বিদ্যমান। পঞ্চাঙ্গের ২৭টি যোগের মধ্যে এই যোগ আজকের কাজকর্মে বিশেষ প্রভাব রাখে।` } },
      { "@type": "Question", "name": `সূর্য এখন কোন রাশিতে আছে?`, "acceptedAnswer": { "@type": "Answer", "text": `বর্তমানে সূর্য ${sunRashiName} রাশিতে অবস্থান করছে। মঙ্গল ${marsRashiName} রাশিতে, বুধ ${mercuryRashiName} রাশিতে, শুক্র ${venusRashiName} রাশিতে, বৃহস্পতি ${jupiRashiName} রাশিতে, শনি ${saniRashiName} রাশিতে, রাহু ${RASHI_NAMES[rashifalResult.rahuRashi]} রাশিতে এবং কেতু ${ketuRashiName} রাশিতে আছে।` } },
      { "@type": "Question", "name": `আজ কোন রাশির জন্য সবচেয়ে শুভ দিন?`, "acceptedAnswer": { "@type": "Answer", "text": `আজ ${bnDate} তারিখে ${bestRashi} রাশির জাতকদের জন্য সবচেয়ে শুভ দিন। ${worstRashi} রাশির জাতকদের আজ বিশেষ সতর্কতা অবলম্বন করা উচিত।` } },
      { "@type": "Question", "name": "ড. প্রদ্যুৎ আচার্যের সাথে পরামর্শ নিতে কীভাবে যোগাযোগ করব?", "acceptedAnswer": { "@type": "Answer", "text": `WhatsApp (+91 ${WHATSAPP}) বা ওয়েবসাইটের মাধ্যমে পরামর্শ নিতে পারেন। হস্তরেখা বিচার (₹১০০১), জন্মকুণ্ডলী বিশ্লেষণ (₹১৫০১), শুভ মুহূর্ত নির্ধারণ (₹৫০১) — সব সেবা অনলাইনে পাওয়া যায়।` } },
      { "@type": "Question", "name": `আজকের রাশিফল কীভাবে তৈরি করা হয়?`, "acceptedAnswer": { "@type": "Answer", "text": `আজকের রাশিফল তৈরি হয়েছে বৈজ্ঞানিক জ্যোতির্বিদ্যার ভিত্তিতে — Meeus অ্যালগরিদম ও Lahiri Ayanamsa ব্যবহার করে সূর্য, চন্দ্র ও অন্যান্য গ্রহের সঠিক অবস্থান গণনা করে। চন্দ্র গোচর ও গ্রহের দৃষ্টি বিশ্লেষণ করে ১২টি রাশির জন্য বিস্তারিত ফল নির্ধারণ করা হয়েছে।` } }
    ]
  });
}

// ==================== সাইটম্যাপ জেনারেশন ====================
function generateSitemaps(archive) {
  const sitemapDir = path.join(OUTPUT_DIR, '..');
  const baseUrl = SITE_URL;
  
  // প্রধান সাইটম্যাপ (রাশিফল পেজের জন্য)
  const urls = [];
  Object.values(archive).forEach(entry => {
    urls.push({
      loc: `${baseUrl}${entry.file}`,
      lastmod: new Date().toISOString().split('T')[0],
      priority: '0.8',
      changefreq: 'daily'
    });
  });
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(path.join(sitemapDir, 'sitemap-rashifal.xml'), sitemapXml, 'utf8');
  console.log(`✅ sitemap-rashifal.xml তৈরি (${urls.length}টি URL)`);
  
  // নিউজ সাইটম্যাপ
  const newsUrls = [];
  const today = new Date().toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  Object.values(archive).forEach(entry => {
    if (entry.iso >= lastWeek) {
      newsUrls.push({
        loc: `${baseUrl}${entry.file}`,
        title: `${entry.bnDate} দৈনিক রাশিফল | MyAstrology`,
        publication_date: `${entry.iso}T05:00:00+05:30`,
        keywords: `রাশিফল, বাংলা রাশিফল, ${entry.moonRashi} রাশি`
      });
    }
  });
  
  const newsSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <news:news>
      <news:publication>
        <news:name>MyAstrology</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${url.publication_date}</news:publication_date>
      <news:title>${url.title}</news:title>
      <news:keywords>${url.keywords}</news:keywords>
    </news:news>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync(path.join(sitemapDir, 'sitemap-news.xml'), newsSitemapXml, 'utf8');
  console.log(`✅ sitemap-news.xml তৈরি (${newsUrls.length}টি URL)`);
}

// ==================== আর্কাইভ ও ইনডেক্স ====================
function updateMasterArchive(date, rashifalResult, panchang) {
  const archivePath = path.join(OUTPUT_DIR, 'master-archive.json');
  let archive = {};
  if (fs.existsSync(archivePath)) {
    try { archive = JSON.parse(fs.readFileSync(archivePath, 'utf8')); } catch (e) { archive = {}; }
  }
  
  const iso = date.toISOString().slice(0, 10);
  const bn = getBnDate(date);
  archive[iso] = {
    iso,
    bnDate: formatBnDate(date),
    bnDateFull: formatBnDateFull(date),
    bnYear: bn ? bn.y : null,
    bnMonth: bn ? bn.m : null,
    bnMonthName: bn ? bn.name : null,
    moonRashi: RASHI_NAMES[rashifalResult.moonRashi],
    sunRashi: RASHI_NAMES[rashifalResult.sunRashi],
    marsRashi: RASHI_NAMES[rashifalResult.marsRashi],
    mercuryRashi: RASHI_NAMES[rashifalResult.mercuryRashi],
    venusRashi: RASHI_NAMES[rashifalResult.venusRashi],
    jupiterRashi: RASHI_NAMES[rashifalResult.jupiterRashi],
    saturnRashi: RASHI_NAMES[rashifalResult.saturnRashi],
    rahuRashi: RASHI_NAMES[rashifalResult.rahuRashi],
    ketuRashi: RASHI_NAMES[rashifalResult.ketuRashi],
    tithi: panchang.tithi,
    nakshatra: panchang.nakshatra,
    yoga: panchang.yoga,
    karan: panchang.karan,
    file: `/rashifal/${iso}.html`
  };
  
  const keys = Object.keys(archive).sort().reverse().slice(0, 365);
  const trimmed = {};
  keys.forEach(k => trimmed[k] = archive[k]);
  fs.writeFileSync(archivePath, JSON.stringify(trimmed, null, 2), 'utf8');
  console.log(`✅ master-archive.json updated — ${iso}`);
  return trimmed;
}

function generateIndex(archive) {
  let entries = [];
  if (archive && Object.keys(archive).length > 0) {
    entries = Object.values(archive).sort((a, b) => b.iso.localeCompare(a.iso));
  } else {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => /^\d{4}-\d{2}-\d{2}\.html$/.test(f)).sort().reverse().slice(0, 60);
    entries = files.map(f => {
      const iso = f.replace('.html', '');
      const d = new Date(iso + 'T00:00:00');
      const bn = getBnDate(d);
      return { iso, bnDate: formatBnDate(d), bnYear: bn?.y, bnMonthName: bn?.name, moonRashi: '', tithi: '', file: `/rashifal/${f}` };
    });
  }
  
  const byMonth = {};
  entries.forEach(e => {
    const key = e.iso.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(e);
  });
  
  const monthKeys = Object.keys(byMonth).sort().reverse();
  const monthOptions = monthKeys.map(k => {
    const [y, m] = k.split('-');
    const mName = EN_MONTHS[parseInt(m, 10) - 1];
    return `<option value="${k}">${mName} ${y}</option>`;
  }).join('\n');
  
  const listHtml = monthKeys.map(k => {
    const items = byMonth[k].map(e => {
      const moonBadge = e.moonRashi ? `<span class="arc-moon">🌙 ${e.moonRashi}</span>` : '';
      const tithiBadge = e.tithi ? `<span class="arc-tithi">${e.tithi}</span>` : '';
      return `<a href="${e.file}" class="arc-link" data-month="${k}">
  <span class="arc-bn">📅 ${e.bnDate}</span>
  <span class="arc-iso">${e.iso}</span>
  ${moonBadge}${tithiBadge}
</a>`;
    }).join('\n');
    const [y, m] = k.split('-');
    const mName = EN_MONTHS[parseInt(m, 10) - 1];
    return `<div class="month-group" data-month="${k}">
  <div class="month-label">${mName} ${y}</div>
  ${items}
</div>`;
  }).join('\n');
  
  const css = `:root{--navy:#0a1730;--gold:#c9a227;--gold-lt:#f0c040;--bg:#0a1628;--bg2:#0d1e36;--bg3:#0f2240;--txt:#e8e8e8;--txt2:#a0b0c8;--border:rgba(201,162,39,.18);--mu:#8899aa;--red:#e74c3c;--green:#27ae60;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--txt);font-family:'Baloo Da 2',sans-serif;font-size:1rem;line-height:1.6;}
a{color:inherit;text-decoration:none;}
.site-header{display:flex;align-items:center;gap:12px;background:linear-gradient(90deg,#060f1e,#0a1628);border-bottom:1px solid var(--border);padding:10px 16px;position:sticky;top:0;z-index:100;}
.header-logo{width:40px;height:40px;border-radius:50%;}
.header-brand{flex:1;font-size:1rem;font-weight:700;color:var(--gold);}
.header-sub{display:block;font-size:.7rem;color:var(--txt2);font-weight:400;}
.hamburger{display:flex;flex-direction:column;gap:5px;cursor:pointer;padding:4px;}
.hamburger span{width:22px;height:2px;background:var(--txt);border-radius:2px;transition:.3s;}
.hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
.hamburger.open span:nth-child(2){opacity:0;}
.hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}
.sidenav{position:fixed;top:0;left:-260px;width:250px;height:100%;background:var(--bg3);border-right:1px solid var(--border);z-index:200;padding-top:60px;transition:.3s;}
.sidenav.open{left:0;}
.sidenav a{display:flex;align-items:center;gap:10px;padding:12px 20px;font-size:.88rem;border-bottom:1px solid var(--border);}
.sidenav a:hover,.sidenav a.active{color:var(--gold);}
.sidenav a i{width:16px;text-align:center;}
.sidenav-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:150;}
.sidenav-overlay.open{display:block;}
.sidenav-divider{border-top:2px solid var(--border);margin:8px 0;}
.wa-link{background:rgba(37,211,102,.1)!important;color:#25d366!important;}
.breadcrumb{padding:10px 16px;font-size:.78rem;color:var(--mu);}
.breadcrumb a{color:var(--gold);}
.breadcrumb i{font-size:.6rem;margin:0 6px;}
main{max-width:900px;margin:0 auto;padding:0 12px 40px;}
.hero-banner{background:linear-gradient(135deg,#0a192f,#0e1e38);border:1px solid var(--border);border-radius:16px;padding:28px 20px;text-align:center;margin-bottom:20px;}
.hero-banner h1{font-size:1.4rem;color:var(--gold);}
.hero-meta{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:12px;}
.hero-chip{background:rgba(201,162,39,.1);border:1px solid var(--border);border-radius:20px;padding:4px 12px;font-size:.78rem;color:var(--txt2);}
.filter-bar{display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:10px 14px;margin-bottom:16px;}
.filter-bar label{font-size:.8rem;color:var(--txt2);flex-shrink:0;}
.filter-bar select{background:var(--bg3);border:1px solid var(--border);border-radius:6px;color:var(--txt);padding:5px 10px;font-size:.82rem;flex:1;}
.filter-bar button{background:var(--gold);color:#000;border:none;border-radius:6px;padding:5px 14px;font-size:.8rem;cursor:pointer;font-weight:700;}
.rashifal-list{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:18px;}
.rashifal-list h2{font-size:1rem;color:var(--gold);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.month-group{margin-bottom:14px;}
.month-label{font-size:.72rem;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);padding-bottom:5px;margin-bottom:8px;}
.arc-link{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:9px 12px;border-radius:8px;border:1px solid var(--border);margin-bottom:6px;transition:.2s;}
.arc-link:hover{background:rgba(201,162,39,.07);border-color:var(--gold);}
.arc-bn{font-size:.85rem;font-weight:600;flex-shrink:0;}
.arc-iso{font-size:.72rem;color:var(--mu);flex-shrink:0;}
.arc-moon{font-size:.72rem;background:rgba(100,120,200,.15);border:1px solid rgba(100,120,200,.3);border-radius:10px;padding:2px 8px;color:#a0b8e8;}
.arc-tithi{font-size:.68rem;background:rgba(201,162,39,.1);border:1px solid var(--border);border-radius:10px;padding:2px 7px;color:var(--gold);}
.sitemap-links{text-align:center;margin-top:18px;padding:12px;font-size:.75rem;border-top:1px solid var(--border);}
.sitemap-links a{color:var(--gold);margin:0 8px;display:inline-block;}
.cta-box{background:linear-gradient(135deg,#0a192f,#0e1e38);border-top:2px solid var(--gold);color:#fff;border-radius:14px;padding:26px 20px;margin:24px 0;text-align:center;}
.btn-wa{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:11px 24px;border-radius:50px;font-weight:800;font-size:.9rem;margin:4px;}
.btn-book{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold-lt),#ffe88a);color:#5a1f0a;padding:11px 24px;border-radius:50px;font-weight:800;font-size:.9rem;border:2px solid rgba(181,134,13,.4);margin:4px;}
.site-footer{background:linear-gradient(135deg,var(--bg3),var(--bg2));border-top:1px solid var(--border);text-align:center;padding:1.5rem 1rem;color:var(--txt2);font-size:.77rem;}
.ftr-logo img{max-height:44px;margin:0 auto;display:block;}
.ftr-brand{font-weight:700;font-size:.85rem;color:var(--txt);}
.ftr-links{display:flex;justify-content:center;flex-wrap:wrap;gap:.5rem .85rem;margin:.55rem 0;}
.ftr-links a{font-size:.72rem;color:var(--txt2);}
.ftr-links a:hover{color:var(--gold);}
.ftr-social{display:flex;justify-content:center;flex-wrap:wrap;gap:.55rem;margin:.85rem 0;}
.ftr-social a{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.95rem;color:#fff;}
.fts-wa{background:#25d366;}.fts-fb{background:#1877f2;}.fts-yt{background:#ff0000;}.fts-ig{background:radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285aeb 90%);}.fts-tw{background:#000;}
.wa-float{position:fixed;bottom:24px;right:20px;z-index:9999;}
.wa-btn-fl{width:46px;height:46px;border-radius:50%;background:#25d366;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.3rem;}
#btt{position:fixed;bottom:24px;left:18px;z-index:9997;width:40px;height:40px;border-radius:50%;background:var(--navy);color:var(--gold);border:1.5px solid rgba(181,134,13,.4);cursor:pointer;font-size:.95rem;display:none;align-items:center;justify-content:center;}
#btt.visible{display:flex;}
@media(max-width:600px){.arc-link{flex-direction:column;align-items:flex-start;gap:4px;}}`;
  
  const html = `<!DOCTYPE html>
<html lang="bn-IN" translate="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="theme-color" content="#0a1628">
<meta name="google" content="notranslate">
<title>দৈনিক রাশিফল সংগ্রহ | ১২ রাশির বিস্তারিত ফল | MyAstrology</title>
<meta name="description" content="ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল সংগ্রহ। মেষ থেকে মীন — ১২ রাশির প্রেম, কর্ম, স্বাস্থ্য, অর্থ ও সতর্কতা। চন্দ্র গোচর ভিত্তিক তিথি ও নক্ষত্র সহ। Google-এ ৫★ রেটিং।">
<meta name="keywords" content="দৈনিক রাশিফল, রাশিফল সংগ্রহ, বাংলা রাশিফল, চন্দ্র গোচর, মেষ রাশিফল, বৃষ রাশিফল, মিথুন রাশিফল, কর্কট রাশিফল, সিংহ রাশিফল, কন্যা রাশিফল, তুলা রাশিফল, বৃশ্চিক রাশিফল, ধনু রাশিফল, মকর রাশিফল, কুম্ভ রাশিফল, মীন রাশিফল">
<meta name="author" content="Dr. Prodyut Acharya">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${SITE_URL}/rashifal/">
<link rel="alternate" hreflang="bn-IN" href="${SITE_URL}/rashifal/">
<meta property="og:title" content="দৈনিক রাশিফল সংগ্রহ | ১২ রাশির বিস্তারিত ফল | MyAstrology">
<meta property="og:description" content="ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল সংগ্রহ। চন্দ্র গোচর ও গ্রহের দৃষ্টি বিশ্লেষণ সহ ১২ রাশির বিস্তারিত ফল।">
<meta property="og:url" content="${SITE_URL}/rashifal/">
<meta property="og:type" content="website">
<meta property="og:image" content="${SITE_URL}/images/daily-rashifal-og.webp">
<meta property="og:locale" content="bn_IN">
<meta property="og:site_name" content="MyAstrology – Dr. Prodyut Acharya">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AcharyaProdyut">
<meta name="twitter:title" content="দৈনিক রাশিফল সংগ্রহ | MyAstrology">
<meta name="twitter:image" content="${SITE_URL}/images/daily-rashifal-og.webp">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", "name": "দৈনিক রাশিফল সংগ্রহ", "description": "ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল সংগ্রহ", "url": `${SITE_URL}/rashifal/` })}</script>
<script async src="https://news.google.com/swg/js/v1/swg-basic.js"></script>
<script>(self.SWG_BASIC=self.SWG_BASIC||[]).push(b=>{b.init({type:"CollectionPage",isPartOfType:["Product"],isPartOfProductId:"CAow5vfFDA:openaccess",clientOptions:{theme:"light",lang:"bn-in"}});});</script>
<link rel="preload" as="image" href="${SITE_URL}/images/daily-rashifal-og.webp" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/balooda2/v6/2-ch9J9j0IaUMQZwAy5m.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;600;700;800&family=Tiro+Bangla:ital@0;1&display=swap" media="print" onload="this.media='all'">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;600;700;800&family=Tiro+Bangla:ital@0;1&display=swap"></noscript>
<link rel="icon" type="image/x-icon" href="${SITE_URL}/images/favicon.ico">
<style>${css}</style>
</head>
<body>
<header class="site-header">
  <a href="${SITE_URL}/" style="display:flex;align-items:center;flex-shrink:0;">
    <img src="${SITE_URL}/images/MyAstrology-Ranghat-logo.png" alt="MyAstrology" class="header-logo" width="40" height="40" loading="eager">
  </a>
  <div class="header-brand">MyAstrology<span class="header-sub">ড. প্রদ্যুৎ আচার্য &middot; রানাঘাট</span></div>
  <div class="hamburger" id="hbg" aria-label="Menu" role="button" tabindex="0"><span></span><span></span><span></span></div>
</header>
<div class="sidenav-overlay" id="navOverlay"></div>
<nav class="sidenav" id="sideNav">
  <a href="${SITE_URL}/"><i class="fas fa-home"></i>হোম</a>
  <a href="${SITE_URL}/astrology.html"><i class="fas fa-star"></i>জ্যোতিষ শাস্ত্র</a>
  <a href="${SITE_URL}/palmistry.html"><i class="fas fa-hand-paper"></i>হস্তরেখা বিচার</a>
  <a href="${SITE_URL}/gemstone.html"><i class="fas fa-gem"></i>রত্নপাথর পরামর্শ</a>
  <a href="${SITE_URL}/vastu-science.html"><i class="fas fa-building"></i>বাস্তু শাস্ত্র</a>
  <a href="${SITE_URL}/panjika.html"><i class="fas fa-calendar-alt"></i>বাংলা পঞ্জিকা</a>
  <a href="${SITE_URL}/rashifal.html" class="active"><i class="fas fa-circle-notch"></i>রাশিফল</a>
  <a href="${SITE_URL}/video.html"><i class="fas fa-play-circle"></i>ভিডিও</a>
  <a href="${SITE_URL}/blog-list.html"><i class="fas fa-list"></i>ব্লগ</a>
  <a href="${SITE_URL}/contact.html"><i class="fas fa-address-card"></i>যোগাযোগ</a>
  <div class="sidenav-divider"></div>
  <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" class="wa-link"><i class="fab fa-whatsapp"></i>WhatsApp পরামর্শ</a>
</nav>
<nav class="breadcrumb"><a href="${SITE_URL}/">হোম</a> <i class="fas fa-chevron-right"></i> <span>রাশিফল সংগ্রহ</span></nav>
<main>
  <div class="hero-banner">
    <h1>🔮 দৈনিক রাশিফল সংগ্রহ</h1>
    <p style="color:#b0c4dc;margin-top:6px;">ড. প্রদ্যুৎ আচার্যের কলম থেকে — প্রতিদিনের বাংলা রাশিফল</p>
    <div class="hero-meta">
      <div class="hero-chip">⭐ বৈদিক জ্যোতিষ গণনা</div>
      <div class="hero-chip">🌙 চন্দ্র গোচর ভিত্তিক</div>
      <div class="hero-chip">📅 প্রতিদিন আপডেট</div>
      <div class="hero-chip">🪐 ৮টি গ্রহের গোচর সহ</div>
    </div>
  </div>

  <div class="rashifal-list">
    <h2><i class="fas fa-list" style="color:var(--gold)"></i> সম্পূর্ণ তালিকা</h2>
    <div class="filter-bar">
      <label>মাস বেছে নিন:</label>
      <select id="monthFilter" onchange="filterMonth(this.value)">
        <option value="all">সব মাস</option>
        ${monthOptions}
      </select>
      <button onclick="filterMonth('all')">সব দেখুন</button>
    </div>
    <div id="archiveList">
      ${listHtml}
    </div>
  </div>

  <div class="sitemap-links">
    <a href="/sitemap-news.xml" target="_blank">📰 Google News Sitemap</a> |
    <a href="/sitemap-rashifal.xml" target="_blank">🗺️ রাশিফল Sitemap</a> |
    <a href="/rashifal/rss.xml" target="_blank">📡 RSS Feed</a>
  </div>

  <div class="cta-box">
    <h3>🔮 ব্যক্তিগত পরামর্শ নিন</h3>
    <p>হস্তরেখা বিচার &middot; জন্মকুণ্ডলী বিশ্লেষণ &middot; বিবাহযোগ বিচার<br><strong>ড. প্রদ্যুৎ আচার্য</strong> — PhD Gold Medalist, রানাঘাট</p>
    <a class="btn-wa" href="https://wa.me/${WHATSAPP}?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp করুন</a>
    <a class="btn-book" href="${SITE_URL}/astrology.html#service-consult"><i class="fas fa-calendar-check"></i> পরামর্শ বুক করুন</a>
  </div>
</main>
<footer class="site-footer">
  <div class="ftr-logo"><img src="${SITE_URL}/images/MyAstrology-Ranghat-logo.png" alt="MyAstrology Logo" loading="lazy"></div>
  <div class="ftr-brand">Dr. Prodyut Acharya — Vedic Astrology &amp; Palmistry Consultant</div>
  <div class="ftr-sub" style="font-size:.75rem;color:var(--txt2);margin:.3rem 0;">রানাঘাট, নদিয়া, পশ্চিমবঙ্গ | 📞 <a href="tel:+91${WHATSAPP}" style="color:var(--gold);">+91 93331 22768</a></div>
  <div class="ftr-links">
    <a href="${SITE_URL}/">Home</a><a href="${SITE_URL}/astrology.html">Astrology</a>
    <a href="${SITE_URL}/palmistry.html">Palmistry</a><a href="${SITE_URL}/rashifal.html">Rashifal</a>
    <a href="${SITE_URL}/about.html">About</a><a href="${SITE_URL}/blog-list.html">Blog</a>
    <a href="${SITE_URL}/privacy-policy.html">Privacy</a><a href="${SITE_URL}/terms-of-use.html">Terms</a>
  </div>
  <div class="ftr-social">
    <a href="https://wa.me/${WHATSAPP}" target="_blank" class="fts-wa"><i class="fab fa-whatsapp"></i></a>
    <a href="https://www.facebook.com/Dr.ProdyutAcharya" target="_blank" class="fts-fb"><i class="fab fa-facebook-f"></i></a>
    <a href="https://www.youtube.com/@myastrology" target="_blank" class="fts-yt"><i class="fab fa-youtube"></i></a>
    <a href="https://www.instagram.com/myastrology.in" target="_blank" class="fts-ig"><i class="fab fa-instagram"></i></a>
    <a href="https://x.com/AcharyaProdyut" target="_blank" class="fts-tw"><i class="fab fa-x-twitter"></i></a>
  </div>
  <div style="font-size:.7rem;color:var(--mu);margin-top:.5rem;">&copy; 2025–2026 MyAstrology &middot; Dr. Prodyut Acharya &middot; <a href="${SITE_URL}" style="color:var(--gold);">myastrology.in</a></div>
</footer>
<div class="wa-float"><a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" class="wa-btn-fl"><i class="fab fa-whatsapp"></i></a></div>
<button id="btt" aria-label="উপরে যান">⬆</button>
<script>
(function(){
  var hbg=document.getElementById('hbg'),nav=document.getElementById('sideNav'),ov=document.getElementById('navOverlay');
  if(hbg){
    function openNav(){hbg.classList.add('open');nav.classList.add('open');ov.classList.add('open');}
    function closeNav(){hbg.classList.remove('open');nav.classList.remove('open');ov.classList.remove('open');}
    hbg.addEventListener('click',function(){nav.classList.contains('open')?closeNav():openNav();});
    ov.addEventListener('click',closeNav);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav();});
  }
  var btn=document.getElementById('btt');
  if(btn){
    window.addEventListener('scroll',function(){btn.classList.toggle('visible',window.scrollY>400);});
    btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  }
})();
function filterMonth(val) {
  document.querySelectorAll('.month-group').forEach(function(g){
    g.style.display = (val==='all' || g.dataset.month===val) ? '' : 'none';
  });
  document.getElementById('monthFilter').value = val;
}
</script>
</body>
</html>`;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html, 'utf8');
  console.log('✅ rashifal/index.html updated (মাস-ফিল্টার সহ)');
}

// ==================== MAIN ====================
(async function main() {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    
    const iso = TARGET_DATE.toISOString().slice(0, 10);
    const outFile = path.join(OUTPUT_DIR, iso + '.html');
    
    console.log(`\n🔮 রাশিফল জেনারেটর v3.0 শুরু হচ্ছে...`);
    console.log(`📅 তারিখ: ${iso}`);
    console.log(`📁 আউটপুট ডিরেক্টরি: ${OUTPUT_DIR}`);
    console.log(`📦 ক্যাশ ডিরেক্টরি: ${CACHE_DIR}`);
    
    if (!fs.existsSync(TEMPLATE)) {
      throw new Error(`টেমপ্লেট ফাইল পাওয়া যায়নি: ${TEMPLATE}`);
    }
    
    const templateContent = fs.readFileSync(TEMPLATE, 'utf8');
    const y = TARGET_DATE.getFullYear(), m = TARGET_DATE.getMonth() + 1, d = TARGET_DATE.getDate();
    const jd = JD(y, m, d) + 0.5;
    
    const rashifalResult = generateRashifalData(TARGET_DATE);
    const panchang = {
      tithi: getTithiName(jd),
      nakshatra: getNakshatraName(jd),
      yoga: getYogaName(jd),
      karan: getKaranName(jd)
    };
    const st = sunTimes(y, m, d, LAT, LNG, TZ);
    const rahuKal = getRahuKal(st.rise, st.set, TARGET_DATE.getDay());
    
    const bnDate = formatBnDate(TARGET_DATE);
    const bnDateFull = formatBnDateFull(TARGET_DATE);
    const moonRashiName = RASHI_NAMES[rashifalResult.moonRashi];
    const sunRashiName = RASHI_NAMES[rashifalResult.sunRashi];
    
    // ডায়নামিক OG ইমেজ তৈরি (এখন async function-এর ভিতরে)
    let ogImageUrl = `${SITE_URL}/images/daily-rashifal-og.webp`;
    try {
      ogImageUrl = await generateOgImage(TARGET_DATE, moonRashiName, sunRashiName, OUTPUT_DIR);
      console.log(`🖼️ OG ইমেজ তৈরি: ${ogImageUrl}`);
    } catch (err) {
      console.warn('⚠️ OG ইমেজ তৈরি ব্যর্থ, ডিফল্ট ব্যবহার:', err.message);
    }
    
    let html = templateContent
      .replace(/\{\{BN_DATE\}\}/g, bnDate)
      .replace(/\{\{BN_DATE_FULL\}\}/g, bnDateFull)
      .replace(/\{\{URL_DATE\}\}/g, iso)
      .replace(/\{\{ISO_DATE\}\}/g, iso)
      .replace(/\{\{MOON_RASHI\}\}/g, moonRashiName)
      .replace(/\{\{SUN_RASHI\}\}/g, sunRashiName)
      .replace(/\{\{TITHI\}\}/g, panchang.tithi)
      .replace(/\{\{NAKSHATRA\}\}/g, panchang.nakshatra)
      .replace(/\{\{YOGA\}\}/g, panchang.yoga)
      .replace(/\{\{KARAN\}\}/g, panchang.karan)
      .replace('{{SCHEMA_JSON}}', buildSchema(TARGET_DATE, rashifalResult, ogImageUrl, panchang))
      .replace('{{RASHI_CARDS}}', buildRashiCards(rashifalResult))
      .replace('{{DEFAULT_RASHI_DETAIL}}', buildDefaultRashiDetail(rashifalResult))
      .replace('{{ARCHIVE_LINKS}}', buildArchiveLinks(TARGET_DATE, rashifalResult))
      .replace('{{RASHIFAL_DATA_JSON}}', JSON.stringify(rashifalResult.data))
      .replace('{{FAQ_SCHEMA_JSON}}', buildFaqSchema(TARGET_DATE, rashifalResult, panchang));
    
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`✅ rashifal/${iso}.html — তৈরি হয়েছে`);
    console.log(`🌙 চন্দ্র: ${RASHI_NAMES[rashifalResult.moonRashi]} | ☀️ সূর্য: ${RASHI_NAMES[rashifalResult.sunRashi]}`);
    console.log(`📿 তিথি: ${panchang.tithi} | নক্ষত্র: ${panchang.nakshatra} | যোগ: ${panchang.yoga}`);
    
    const archive = updateMasterArchive(TARGET_DATE, rashifalResult, panchang);
    generateIndex(archive);
    generateSitemaps(archive);
    
    cleanupOldOgImages(OUTPUT_DIR, 30);
    
    console.log('\n🎉 সম্পন্ন! Daily rashifal generation v3.0 complete.');
    console.log('💡 SEO-অপটিমাইজড বৈশিষ্ট্য:');
    console.log('   ✓ মডুলার কোড স্ট্রাকচার (ফেজ ২)');
    console.log('   ✓ গ্রহের দৃষ্টি (মঙ্গল, বুধ, শুক্র, শনি, বৃহস্পতি) – ফেজ ৩');
    console.log('   ✓ ক্যাশিং সিস্টেম – দ্বিতীয়বার দ্রুত');
    console.log('   ✓ ৮টি গ্রহের গোচর (সূর্য, চন্দ্র, মঙ্গল, বুধ, শুক্র, শনি, বৃহস্পতি, রাহু, কেতু)');
    console.log('   ✓ ডায়নামিক OG ইমেজ');
    console.log('   ✓ JSON-LD স্কিমা (NewsArticle, FAQPage, BreadcrumbList, Organization)');
    console.log('   ✓ মাস্টার আর্কাইভ মাস-ফিল্টার সহ');
    console.log('   ✓ নিউজ সাইটম্যাপ ও প্রধান সাইটম্যাপ');
    
  } catch (err) {
    console.error('❌ Generation failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
  
  
