
// ================================================================
// main.js — Numerology Intelligence Hub v3.0
// সব সংশোধনী: ১১ পয়েন্ট সম্পূর্ণ
// ================================================================
'use strict';

let currentRawInput = '';
let currentNumberData = null;
let currentInputType = 'other';

// ── utils ──
function getQueryParam(p){return new URLSearchParams(window.location.search).get(p);}
function escapeHtml(t){if(!t)return'';return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

// ================================================================
// INPUT TYPE — নাম | তারিখ | অন্য  (Point 1)
// ================================================================
function detectInputType(input){
  if(!input)return'other';
  const t=input.trim();
  const conv=NumberUtils.convertBengaliDigits(t);
  if(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(conv))return'date';
  const dig=conv.replace(/\D/g,'');
  if(dig.length===8){const d=+dig.slice(0,2),m=+dig.slice(2,4),y=+dig.slice(4);if(d>=1&&d<=31&&m>=1&&m<=12&&y>=1900&&y<=2100)return'date';}
  if(/^[\u0980-\u09FF\s]{2,40}$/.test(t))return'name';
  if(/^[A-Za-z\s]{2,40}$/.test(t))return'name';
  return'other';
}

function getNumberLabel(type){
  if(type==='name')return'নামাংক';
  if(type==='date')return'ভাগ্যাংক';
  return'মূলাংক';
}

// ================================================================
// INPUT IDENTITY BANNER (Point 1)
// ================================================================
function renderInputBanner(input,number,data,type){
  const label=getNumberLabel(type);
  const icon=type==='name'?'📝':type==='date'?'📅':'🔢';
  return `<div class="iib">
    <div class="iib-row">
      <div class="iib-icon">${icon}</div>
      <div class="iib-body">
        <div class="iib-input">${escapeHtml(input)}</div>
        <div class="iib-meta">
          <span class="iib-label">${label}</span>
          <span class="iib-number">${number}</span>
          <span class="iib-planet">${escapeHtml(data.planet)}</span>
        </div>
      </div>
    </div>
  </div>`;
}

// ── helpers ──
function planetBadge(icon,num,planet){
  return`<div style="text-align:center;margin-bottom:14px">
    <span class="planet-badge"><i class="fas ${icon}"></i> মূল সংখ্যা: ${num} — ${escapeHtml(planet)}</span>
  </div>`;
}
function luckBadges(data){
  return`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
    <span class="badge">🎨 ${escapeHtml(data.luckyColor)}</span>
    <span class="badge">📅 ${escapeHtml(data.luckyDay)}</span>
    <span class="badge">🧭 ${escapeHtml(data.luckyDirection)}</span>
    <span class="badge">💎 ${escapeHtml(data.gemstone||'')}</span>
  </div>`;
}
function bottomButtons(){
  return`<div style="margin-top:20px;text-align:center">
    <a href="numerology.html" class="back-btn"><i class="fas fa-arrow-left"></i> নতুন অনুসন্ধান</a>
  </div>
  <div class="share-buttons">
    <button class="share-btn" onclick="copyResult()"><i class="fas fa-copy"></i> কপি করুন</button>
    <button class="share-btn" onclick="shareResult()"><i class="fas fa-share-alt"></i> শেয়ার করুন</button>
    <button class="share-btn" onclick="window.print()"><i class="fas fa-print"></i> প্রিন্ট করুন</button>
  </div>`;
}

// ================================================================
// RENDER FUNCTIONS — ২৪ ক্যাটাগরি
// প্রতিটি নিজস্ব বিষয় দিয়ে শুরু (Point 4 & 8)
// ================================================================

// 1. ব্যক্তির নাম
function renderPersonalName(input,num,data,type){
  return renderInputBanner(input,num,data,'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">${escapeHtml(data.identity.title)}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · নামাংক ${num}</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-user',num,data.planet)}
    <p><strong>"${escapeHtml(input)}"</strong> — এই নামের নামাংক <strong>${num}</strong>। ${getNamankDeep(num)}</p>
    ${luckBadges(data)}
    ${getVedicIdentity(num)}
  </div>
  <div class="result-card">
    <div class="info-section">
      <h3><i class="fas fa-star"></i> গ্রহীয় দর্শন — ${escapeHtml(data.planet)}</h3>
      <p>${getPlanetPhilosophy(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-id-card"></i> নামের শক্তি ও প্রভাব</h3>
      <p>${getNamankDeep(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-user"></i> ব্যক্তিত্ব ও জীবনদর্শন</h3>
      <p>${getPersonalDeep(num, data)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশার পথ</h3>
      <p>${escapeHtml(data.business.description)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-heart"></i> সম্পর্ক ও প্রেমের সামঞ্জস্য</h3>
      <p>${getRelationTip(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-coins"></i> বিনিয়োগ ও অর্থনৈতিক পরামর্শ</h3>
      <p>${escapeHtml(data.investment.description)}</p>
    </div>
    ${getLifeAreaAnalysis(num)}
    ${getFamousPersonalities(num)}
    ${getVedicChants(num)}
    <div class="info-section">
      <h3><i class="fas fa-magic"></i> শাস্ত্রীয় প্রতিকার</h3>
      <p>${escapeHtml(data.tip.description)}</p>
    </div>
  </div>`+bottomButtons();
}

// 2. শিশুর নাম
function renderBabyName(input,num,data,type){
  return renderInputBanner(input,num,data,'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">"${escapeHtml(input)}" — শিশুর নামাংক ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · শিশু নামাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-baby',num,data.planet)}
    <p>নাম <strong>"${escapeHtml(input)}"</strong>-এর নামাংক <strong>${num}</strong>। ${escapeHtml(data.planet)}-এর শক্তিতে শিশুর জীবন পরিচালিত হবে।</p>
    ${getVedicIdentity(num)}
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-star"></i> নামের শুভত্ব বিচার</h3><p>${getBabyNameEffect(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-baby"></i> শিশুর সম্ভাব্য ব্যক্তিত্ব</h3><p>${escapeHtml(data.identity.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-graduation-cap"></i> শিক্ষা ও ভবিষ্যৎ</h3><p>${getBabyFutureTip(num)}</p></div>
    ${getLifeAreaAnalysis(num)}
    ${getFamousPersonalities(num)}
    ${getVedicChants(num)}
    <div class="info-section"><h3><i class="fas fa-shield-alt"></i> শিশুর সুরক্ষা ও পরামর্শ</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>`+bottomButtons();
}

// 3. বিবাহ মিলন (single — নিজের বিচার)
function renderMarriage(input,num,data,type){
  return renderInputBanner(input,num,data,type||'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">বিবাহ যোগ্যতা — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · বিবাহযোগ্যতার অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-ring',num,data.planet)}
    <p>${escapeHtml(data.planet)} গ্রহ পরিচালিত সংখ্যা ${num}-এর বিবাহযোগ্যতা। কোন সংখ্যার সাথে বিবাহ শুভ তা জানুন।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-heart"></i> বিবাহযোগ্য সংখ্যা বিচার</h3><p>${getMarriageTip(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-ring"></i> দাম্পত্য জীবনের সম্ভাবনা</h3><p>${getMarriageLifePotential(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-comments"></i> সঙ্গী নির্বাচনের পরামর্শ</h3><p>${getMarriageAdvice(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> বিবাহ শুভ করার প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>
  <div class="result-card" style="background:rgba(255,180,0,.06);border-color:rgba(255,180,0,.25)">
    <p style="color:#f5d060;font-size:.9rem;text-align:center"><i class="fas fa-info-circle"></i>&nbsp;সম্পূর্ণ বিবাহ মিলনের জন্য উভয়ের তথ্য একসাথে দিন।&nbsp;<a href="numerology.html" style="color:#f5b800;text-decoration:underline">সামঞ্জস্য মিলন →</a></p>
  </div>`+bottomButtons();
}

// 4. প্রেম মিলন
function renderLove(input,num,data,type){
  return renderInputBanner(input,num,data,type||'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">প্রেম সামঞ্জস্য — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · প্রেমের অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-heart',num,data.planet)}
    <p>${escapeHtml(data.planet)} গ্রহের প্রভাবে প্রেমে আপনার স্বভাব বিশ্লেষণ।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-heart"></i> প্রেমে স্বভাব ও আকর্ষণ</h3><p>${getLoveTrait(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-users"></i> কোন সংখ্যার সাথে প্রেম শুভ</h3><p>${getMarriageTip(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-exclamation-triangle"></i> সতর্কতা ও পরামর্শ</h3><p>${getMarriageAdvice(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>
  <div class="result-card" style="background:rgba(255,180,0,.06);border-color:rgba(255,180,0,.25)">
    <p style="color:#f5d060;font-size:.9rem;text-align:center"><i class="fas fa-info-circle"></i>&nbsp;দুজনের প্রেম সামঞ্জস্য দেখতে উভয়ের নাম একসাথে লিখুন।&nbsp;<a href="numerology.html" style="color:#f5b800;text-decoration:underline">প্রেম মিলন →</a></p>
  </div>`+bottomButtons();
}

// 5. পরিবার মিলন
function renderFamily(input,num,data,type){
  return renderInputBanner(input,num,data,type||'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">পারিবারিক সামঞ্জস্য — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · পারিবারিক অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-users',num,data.planet)}
    <p>${escapeHtml(data.planet)} গ্রহের প্রভাবে পারিবারিক জীবনে আপনার ভূমিকা বিশ্লেষণ।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-home"></i> পারিবারিক ভূমিকা</h3><p>${getFamilyRole(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-handshake"></i> পারিবারিক সামঞ্জস্য</h3><p>${getFamilyTip(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-dove"></i> শান্তির উপায়</h3><p>${getFamilyPeace(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>`+bottomButtons();
}

// 6. শুভ যাত্রার দিন
function renderJourneyDate(input,num,data,type){
  return renderInputBanner(input,num,data,type||'date')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">শুভ যাত্রার দিন বিশ্লেষণ</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · যাত্রার অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-plane',num,data.planet)}
    <p>${escapeHtml(data.travel.description)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
      <span class="badge">🧭 শুভ দিক: ${escapeHtml(data.luckyDirection)}</span>
    </div>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-clock"></i> যাত্রার শুভ সময়</h3><p>${getJourneyTime(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-compass"></i> শুভ দিকনির্দেশনা</h3><p>শুভ দিক: <strong>${escapeHtml(data.luckyDirection)}</strong>। দীর্ঘ যাত্রায় এই দিকে মুখ করে যাত্রা শুরু করুন।</p></div>
    <div class="info-section"><h3><i class="fas fa-exclamation-triangle"></i> যাত্রায় সতর্কতা</h3><p>${getJourneyCaution(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-pray"></i> যাত্রার পূর্বে করণীয়</h3><p>${getJourneyRitual(num)}</p></div>
  </div>`+bottomButtons();
}

// 7. নতুন বাড়ি
function renderNewHome(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">বাড়ির নম্বর "${escapeHtml(input)}" — সংখ্যাজ্যোতিষ</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · বসবাসের মূলাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-home',num,data.planet)}
    <p>বাড়ির নম্বর মূলাংক <strong>${num}</strong>। ${escapeHtml(data.planet)}-এর শক্তিতে পরিচালিত। ${getHomeDesc(num,data)}</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-house-user"></i> বাড়ির সামগ্রিক প্রভাব</h3><p>${getHomeInfluence(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-users"></i> পারিবারিক জীবনে প্রভাব</h3><p>${getHomeFamilyEffect(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-coins"></i> আর্থিক প্রভাব</h3><p>${getHomeFinanceEffect(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-drafting-compass"></i> বাস্তু পরামর্শ</h3><p>${getHomePeace(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> গৃহ প্রতিকার</h3><p>${getHomeRemedy(num,data)}</p></div>
  </div>`+bottomButtons();
}

// 8. জন্মদিন বিশ্লেষণ
function renderBirthday(input,num,data,type){
  const bhagyank=(NumerologyDB.calculateBhagyank?NumerologyDB.calculateBhagyank(input):null)||num;
  const mulank=num;
  const bhData=NumerologyDB.getNumberAnalysis(bhagyank)||data;
  return renderInputBanner(input,num,data,'date')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${mulank}</span></div>
    <h1 class="result-title">${escapeHtml(data.identity.title)}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · জন্মদিন — মূলাংক বিশ্লেষণ</p>
  </div>
  <div class="root-description">
    <div style="display:flex;flex-wrap:wrap;gap:9px;margin-bottom:14px">
      <div style="background:rgba(245,184,0,.2);border:1.5px solid rgba(245,184,0,.5);border-radius:12px;padding:10px 18px;text-align:center;flex:1;min-width:130px">
        <div style="font-size:.74rem;color:#c8d8f0;margin-bottom:3px">🔮 মূলাংক (জন্মদিনের অঙ্ক)</div>
        <div style="font-size:2rem;font-weight:900;color:#f5b800;font-family:var(--fh)">${mulank}</div>
        <div style="font-size:.76rem;color:#c8d8f0">${escapeHtml(data.planet)}</div>
      </div>
      <div style="background:rgba(100,140,255,.12);border:1.5px solid rgba(100,140,255,.3);border-radius:12px;padding:10px 18px;text-align:center;flex:1;min-width:130px">
        <div style="font-size:.74rem;color:#c8d8f0;margin-bottom:3px">⭐ ভাগ্যাংক (পুরো তারিখের অঙ্ক)</div>
        <div style="font-size:2rem;font-weight:900;color:#a0c4ff;font-family:var(--fh)">${bhagyank}</div>
        <div style="font-size:.76rem;color:#c8d8f0">${escapeHtml(bhData.planet||data.planet)}</div>
      </div>
    </div>
    <p><strong>মূলাংক ${mulank}</strong> (শুধু জন্মদিনের দিনের সংখ্যা) আপনার মৌলিক স্বভাব দেখায়। <strong>ভাগ্যাংক ${bhagyank}</strong> (পুরো জন্মতারিখের সংখ্যার যোগফল) আপনার জীবনের মূল উদ্দেশ্য ও নিয়তি নির্দেশ করে।</p>
    ${getVedicIdentity(mulank)}
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-calendar-star"></i> জন্মদিনের বিশেষ তাৎপর্য — মূলাংক ${mulank}</h3><p>${getBirthdaySignificance(mulank)}</p></div>
    <div class="info-section"><h3><i class="fas fa-user"></i> ব্যক্তিত্ব ও জীবনশৈলী</h3><p>${escapeHtml(data.identity.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-chart-line"></i> জীবনের গুরুত্বপূর্ণ বছর</h3><p>${getLifeMilestones(mulank)}</p></div>
    <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ার পথ</h3><p>${escapeHtml(data.business.description)}</p></div>
    ${getLifeAreaAnalysis(mulank)}
    ${getFamousPersonalities(mulank)}
    ${getVedicChants(mulank)}
    <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>`+bottomButtons();
}

// 9. ব্যবসার নাম
function renderBusinessName(input,num,data,type){
  return renderInputBanner(input,num,data,'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">"${escapeHtml(input)}" — ব্যবসার নামাংক ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · ব্যবসায়িক নামের অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-building',num,data.planet)}
    <p>ব্যবসার নাম <strong>"${escapeHtml(input)}"</strong>-এর নামাংক <strong>${num}</strong>। ${getBusinessNameDeep(num, data)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <span class="badge">🎨 শুভ রং: ${escapeHtml(data.luckyColor)}</span>
      <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
      <span class="badge">🧭 শুভ দিক: ${escapeHtml(data.luckyDirection)}</span>
    </div>
  </div>
  <div class="result-card">
    <div class="info-section">
      <h3><i class="fas fa-star"></i> গ্রহীয় শক্তি বিচার — ${escapeHtml(data.planet)}</h3>
      <p>${getPlanetPhilosophy(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-gem"></i> নামের ব্যবসায়িক শক্তি ও ব্র্যান্ড মূল্য</h3>
      <p>${getBusinessNameDeep(num, data)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-chart-bar"></i> উপযুক্ত ব্যবসার ক্ষেত্র ও সম্ভাবনা</h3>
      <p>${escapeHtml(data.business.description)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-handshake"></i> আদর্শ অংশীদার ও সহযোগী</h3>
      <p>${getPartnerAdvice(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-trophy"></i> সাফল্যের মূলমন্ত্র ও জীবনদর্শন</h3>
      <p>${getSuccessMantra(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-coins"></i> বিনিয়োগ ও আর্থিক কৌশল</h3>
      <p>${escapeHtml(data.investment.description)}</p>
    </div>
    ${getBusinessIcons(num)}
    ${getBusinessMantra(num, data)}
    <div class="info-section">
      <h3><i class="fas fa-magic"></i> ব্যবসায়িক প্রতিকার ও মন্ত্র</h3>
      <p>${escapeHtml(data.tip.description)}</p>
    </div>
  </div>`+bottomButtons();
}
// 10. অংশীদারিত্ব
function renderPartnership(input,num,data,type){
  return renderInputBanner(input,num,data,type||'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">অংশীদারিত্ব যোগ্যতা — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · অংশীদারিত্বের অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-handshake',num,data.planet)}
    <p>${escapeHtml(data.planet)} গ্রহ পরিচালিত সংখ্যা ${num}-এর অংশীদারিত্বের যোগ্যতা বিশ্লেষণ।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-users-cog"></i> অংশীদারিত্বের যোগ্যতা</h3><p>${getPartnerCompatibility(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-chart-line"></i> সাফল্যের সম্ভাবনা</h3><p>${getPartnerSuccess(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-trophy"></i> সাফল্যের মূলমন্ত্র</h3><p>${getSuccessMantra(num)}</p></div>
  </div>
  <div class="result-card" style="background:rgba(255,180,0,.06);border-color:rgba(255,180,0,.25)">
    <p style="color:#f5d060;font-size:.9rem;text-align:center"><i class="fas fa-info-circle"></i>&nbsp;দুজনের অংশীদারিত্ব মিলন দেখতে উভয়ের নাম লিখুন।&nbsp;<a href="numerology.html" style="color:#f5b800;text-decoration:underline">মিলন বিশ্লেষণ →</a></p>
  </div>`+bottomButtons();
}

// 11. স্টার্টআপ নাম
function renderStartupName(input,num,data,type){
  return renderInputBanner(input,num,data,'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">"${escapeHtml(input)}" — স্টার্টআপ নামাংক ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · উদ্যোক্তা নামের অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-rocket',num,data.planet)}
    <p>স্টার্টআপ নাম <strong>"${escapeHtml(input)}"</strong>-এর নামাংক <strong>${num}</strong>। ${getBusinessDesc(num,data)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <span class="badge">🎨 ব্র্যান্ড রং: ${escapeHtml(data.luckyColor)}</span>
      <span class="badge">📅 লঞ্চ দিন: ${escapeHtml(data.luckyDay)}</span>
    </div>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-rocket"></i> নামের উদ্যোক্তা শক্তি</h3><p>${getBusinessNamePower(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-chart-line"></i> উপযুক্ত ব্যবসার ক্ষেত্র</h3><p>${escapeHtml(data.business.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-users"></i> আদর্শ টিম সংখ্যা</h3><p>${getPartnerAdvice(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-trophy"></i> সাফল্যের মূলমন্ত্র</h3><p>${getSuccessMantra(num)}</p></div>
  </div>`+bottomButtons();
}

// 12. লোগো রঙ
function renderLogoColor(input,num,data,type){
  return renderInputBanner(input,num,data,type||'name')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">লোগো রঙ নির্বাচন — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · ব্র্যান্ড রঙের অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-palette',num,data.planet)}
    <p>সংখ্যা ${num}-এর শুভ রং <strong>${escapeHtml(data.luckyColor)}</strong>। এই রং ব্র্যান্ডের আকর্ষণ বৃদ্ধি করে।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-paint-brush"></i> প্রাথমিক শুভ রং</h3><p><strong>${escapeHtml(data.luckyColor)}</strong> — ${escapeHtml(data.planet)}-এর শক্তিশালী রং।</p></div>
    <div class="info-section"><h3><i class="fas fa-brain"></i> রঙের মনস্তাত্ত্বিক প্রভাব</h3><p>${getColorPsychology(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-drafting-compass"></i> লোগো ডিজাইন পরামর্শ</h3><p>${getLogoDesign(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-ban"></i> এড়িয়ে চলুন</h3><p>${getAvoidColor(num)}</p></div>
  </div>`+bottomButtons();
}

// 13. উদ্বোধনের তারিখ
function renderLaunchDate(input,num,data,type){
  const isGood=[1,3,5,6,9].includes(num);
  return renderInputBanner(input,num,data,'date')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">উদ্বোধনের তারিখ "${escapeHtml(input)}" — বিচার</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · উদ্বোধনের ভাগ্যাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-calendar-alt',num,data.planet)}
    <p>ভাগ্যাংক <strong>${num}</strong> — ${isGood?'✅ এই তারিখটি উদ্বোধনের জন্য শুভ।':'⚠️ এই তারিখে সতর্কতা প্রয়োজন।'}</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-clock"></i> উদ্বোধনের শুভ সময়</h3><p>${getLaunchTime(num,data)}</p></div>
    <div class="info-section"><h3><i class="fas fa-star"></i> তারিখের শুভত্ব বিচার</h3><p>${getLaunchAuspiciousness(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-chart-line"></i> ব্যবসার ভবিষ্যৎ সম্ভাবনা</h3><p>${getLaunchFuture(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> উদ্বোধনের আগে করণীয়</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>`+bottomButtons();
}

// 14. পণ্যের মূল্য
function renderProductPrice(input,num,data,type){
  const g=[3,6,9].includes(num),b=[4,8].includes(num);
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">মূল্য "${escapeHtml(input)}" — সংখ্যাজ্যোতিষ বিচার</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · মূল্যের মূলাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-tag',num,data.planet)}
    <p>${g?'✅ অত্যন্ত শুভ মূল্য।':b?'⚠️ সতর্কতা প্রয়োজন।':'⚖️ মধ্যম মূল্য।'} ${getPriceDesc(num,data)}</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-balance-scale"></i> মূল্যের শুভত্ব বিচার</h3><p>${g?`✅ সংখ্যা ${num} ব্যবসার জন্য লাভজনক। ক্রেতারা মনস্তাত্ত্বিকভাবে আকৃষ্ট হবেন।`:b?`⚠️ সংখ্যা ${num} প্রতিকূল। নিচের বিকল্প মূল্য বিবেচনা করুন।`:`⚖️ সামান্য পরিবর্তনে আরও শুভ করা সম্ভব।`}</p></div>
    <div class="info-section"><h3><i class="fas fa-lightbulb"></i> শুভ বিকল্প মূল্য</h3><p>${getAltPrice(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-chart-pie"></i> মূল্য নির্ধারণ কৌশল</h3><p>${getPriceStrategy(num)}</p></div>
  </div>`+bottomButtons();
}

// 15. গাড়ির নম্বর
function renderCarNumber(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">গাড়ির নম্বর "${escapeHtml(input)}" — সংখ্যাজ্যোতিষ</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · যানবাহনের মূলাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-car',num,data.planet)}
    <p>মূলাংক <strong>${num}</strong>। ${escapeHtml(data.planet)}-এর প্রভাবে পরিচালিত এই যানবাহন।</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
      <span class="badge">🧭 শুভ দিক: ${escapeHtml(data.luckyDirection)}</span>
    </div>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-road"></i> যাত্রার শুভ-অশুভ বিচার</h3><p>${escapeHtml(data.travel.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-shield-alt"></i> নিরাপত্তা সতর্কতা</h3><p>${getVehicleSafety(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-tools"></i> রক্ষণাবেক্ষণ পরামর্শ</h3><p>${escapeHtml(data.luckyDay)}-এ সার্ভিসিং শুভ। ${escapeHtml(data.luckyColor)} রঙের আনুষাঙ্গিক শুভ।</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.planet)}-এর মন্ত্র জপ করুন। ${escapeHtml(data.luckyColor)} রঙের কিছু গাড়িতে রাখুন।</p></div>
  </div>`+bottomButtons();
}

// 16. বাইক নম্বর
function renderBikeNumber(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">বাইক নম্বর "${escapeHtml(input)}" — সংখ্যাজ্যোতিষ</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · দ্বিচক্রযানের মূলাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-motorcycle',num,data.planet)}
    <p>মূলাংক <strong>${num}</strong>। ${escapeHtml(data.planet)}-এর প্রভাবে পরিচালিত।</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
      <span class="badge">🧭 শুভ দিক: ${escapeHtml(data.luckyDirection)}</span>
    </div>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-road"></i> যাত্রার শুভ-অশুভ বিচার</h3><p>${escapeHtml(data.travel.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-shield-alt"></i> নিরাপত্তা সতর্কতা</h3><p>${getVehicleSafety(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>`+bottomButtons();
}

// 17. মোবাইল নম্বর
function renderMobileNumber(input,num,data,type){
  const allDigits=input.replace(/\D/g,'');
  const digitSum=allDigits.split('').reduce((a,b)=>a+parseInt(b),0);
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">মোবাইল "${escapeHtml(input)}" — সংখ্যাজ্যোতিষ বিচার</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · যোগাযোগের মূলাংক ${num}</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-mobile-alt',num,data.planet)}
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
      <span class="badge">➕ অঙ্কের যোগফল: ${digitSum}</span>
      <span class="badge">🔮 মূলাংক: ${num}</span>
      <span class="badge">🪐 গ্রহ: ${escapeHtml(data.planet)}</span>
      <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
    </div>
    <p>${getMobileDeepAnalysis(num)}</p>
  </div>
  <div class="result-card">
    <div class="info-section">
      <h3><i class="fas fa-star"></i> গ্রহীয় দর্শন — ${escapeHtml(data.planet)}</h3>
      <p>${getPlanetPhilosophy(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-phone-alt"></i> যোগাযোগে শক্তি ও প্রভাব</h3>
      <p>${getMobileDeepAnalysis(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশাগত প্রভাব</h3>
      <p>${getMobileCareerDeep(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-heart"></i> সম্পর্ক ও সামাজিক প্রভাব</h3>
      <p>${getMobileRelationDeep(num)}</p>
    </div>
    <div class="info-section">
      <h3><i class="fas fa-magic"></i> শাস্ত্রীয় প্রতিকার ও মন্ত্র</h3>
      <p>${getMobileRemedyDeep(num, data)}</p>
    </div>
  </div>`+bottomButtons();
}

// 18. ব্যাংক অ্যাকাউন্ট
function renderBankAccount(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">ব্যাংক অ্যাকাউন্ট — আর্থিক সংখ্যাজ্যোতিষ</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · আর্থিক মূলাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-university',num,data.planet)}
    <p>অ্যাকাউন্টের মূলাংক <strong>${num}</strong>। ${getBankDesc(num,data)}</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-balance-scale"></i> আর্থিক স্থিতিশীলতা</h3><p>${getBankStability(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-coins"></i> সঞ্চয় ও বিনিয়োগ নির্দেশনা</h3><p>${escapeHtml(data.investment.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-chart-line"></i> আর্থিক বৃদ্ধির পরামর্শ</h3><p>${getBankGrowthTip(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>`+bottomButtons();
}

// 19. পাসওয়ার্ড / PIN Security  ← Point 3: Renamed
function renderPinCode(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">পাসওয়ার্ড ও PIN Security বিশ্লেষণ</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · নিরাপত্তার মূলাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-lock',num,data.planet)}
    <p>এই PIN / পাসওয়ার্ডের মূলাংক <strong>${num}</strong>। ${getPinDesc(num,data)}</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-shield-alt"></i> নিরাপত্তা শক্তি বিচার</h3><p>${getPinSecurity(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-clover"></i> ভাগ্যের উপর প্রভাব</h3><p>${getPinLuck(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-sync"></i> পরিবর্তনের শুভ সময়</h3><p>প্রতি <strong>${escapeHtml(data.luckyDay)}</strong>-এ পাসওয়ার্ড পরিবর্তন শুভ। প্রতি ৩ মাস অন্তর বাধ্যতামূলক।</p></div>
    <div class="info-section"><h3><i class="fas fa-exclamation-triangle"></i> গুরুত্বপূর্ণ সতর্কতা</h3><p>PIN বা পাসওয়ার্ড কখনো শেয়ার করবেন না। জন্মতারিখ বা ফোন নম্বর PIN করবেন না।</p></div>
  </div>`+bottomButtons();
}

// 20. শেয়ার বাজার
function renderStockMarket(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">শেয়ার বাজার বিনিয়োগ — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · বিনিয়োগের মূলাংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-chart-line',num,data.planet)}
    <p>${escapeHtml(data.planet)}-এর প্রভাবে এই সংখ্যার বিনিয়োগ বিচার।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-chart-bar"></i> বিনিয়োগের শুভ-অশুভ</h3><p>${getStockTip(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-calendar-check"></i> বিনিয়োগের শুভ সময়</h3><p>${getStockTime(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ কৌশল</h3><p>${escapeHtml(data.investment.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-exclamation-triangle"></i> ঝুঁকি সতর্কতা</h3><p>${getStockRisk(num)}</p></div>
  </div>`+bottomButtons();
}

// 21. সম্পত্তি বিনিয়োগ
function renderProperty(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">সম্পত্তি বিনিয়োগ — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · স্থাবর সম্পত্তির অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-landmark',num,data.planet)}
    <p>${escapeHtml(data.planet)}-এর প্রভাবে সম্পত্তি বিনিয়োগের বিচার।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-building"></i> সম্পত্তির শুভ-অশুভ</h3><p>${getPropertyTip(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-arrow-trend-up"></i> মূল্যবৃদ্ধির সম্ভাবনা</h3><p>${getPropertyGrowth(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-map-marker-alt"></i> শুভ দিক ও অবস্থান</h3><p>শুভ দিক: <strong>${escapeHtml(data.luckyDirection)}</strong>। এই দিকের সম্পত্তিতে বিনিয়োগ শুভ।</p></div>
    <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ পরামর্শ</h3><p>${escapeHtml(data.investment.description)}</p></div>
  </div>`+bottomButtons();
}

// 22. সোনা/রূপা
function renderGoldSilver(input,num,data,type){
  return renderInputBanner(input,num,data,'other')+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">সোনা ও রূপা বিনিয়োগ — সংখ্যা ${num}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · মূল্যবান ধাতুর অংক</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-gem',num,data.planet)}
    <p>${escapeHtml(data.planet)}-এর প্রভাবে সোনা-রূপা বিনিয়োগের বিচার।</p>
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগের ফলাফল</h3><p>${getGoldTip(num)}</p></div>
    <div class="info-section"><h3><i class="fas fa-calendar-check"></i> কেনার শুভ সময়</h3><p>${getGoldTime(num,data)}</p></div>
    <div class="info-section"><h3><i class="fas fa-gem"></i> রত্নপাথর সংযোগ</h3><p>${escapeHtml(data.gemstone||'')} — বিশেষজ্ঞের পরামর্শে ধারণ করুন।</p></div>
    <div class="info-section"><h3><i class="fas fa-chart-line"></i> ভবিষ্যৎ বিনিয়োগ পরিকল্পনা</h3><p>${escapeHtml(data.investment.description)}</p></div>
  </div>`+bottomButtons();
}

// 23. মূলাংক
function renderMulank(input,num,data,type){
  const it=type||'date';
  const bh=(NumerologyDB.calculateBhagyank?NumerologyDB.calculateBhagyank(input):num)||num;
  const ml=(NumerologyDB.calculateMulank?NumerologyDB.calculateMulank(input):num)||num;
  return renderInputBanner(input,num,data,it)+`
  <div class="result-header">
    <div class="result-number"><span class="big-number">${num}</span></div>
    <h1 class="result-title">${escapeHtml(data.identity.title)}</h1>
    <p class="result-subtitle">${escapeHtml(data.planet)} · ${it==='date'?'মূলাংক ও ভাগ্যাংক':'মূলাংক'} বিশ্লেষণ</p>
  </div>
  <div class="root-description">
    ${planetBadge('fa-star',num,data.planet)}
    ${it==='date'?`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      <span class="badge">🔮 মূলাংক: ${ml}</span>
      <span class="badge">⭐ ভাগ্যাংক: ${bh}</span>
      <span class="badge">🌿 তত্ত্ব: ${escapeHtml(data.element||'')}</span>
    </div>`:''}
    <p>গ্রহাধিপতি <strong>${escapeHtml(data.planet)}</strong>-এর প্রভাবে জীবন পরিচালিত। ${getPlanetRulerEffect(num,data)}</p>
    ${luckBadges(data)}
    ${getVedicIdentity(num)}
  </div>
  <div class="result-card">
    <div class="info-section"><h3><i class="fas fa-user"></i> ব্যক্তিত্ব ও স্বভাব</h3><p>${escapeHtml(data.identity.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশা</h3><p>${escapeHtml(data.business.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-plane"></i> যাত্রা পরামর্শ</h3><p>${escapeHtml(data.travel.description)}</p></div>
    <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ</h3><p>${escapeHtml(data.investment.description)}</p></div>
    ${getLifeAreaAnalysis(num)}
    ${getFamousPersonalities(num)}
    ${getVedicChants(num)}
    <div class="info-section"><h3><i class="fas fa-magic"></i> জ্যোতিষীয় প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
  </div>`+bottomButtons();
}
// 24. নামের অংক
function renderNameNumber(input,num,data,type){return renderPersonalName(input,num,data,'name');}

// ================================================================
// HELPER FUNCTIONS
// ================================================================

function getPersonalDesc(n,d){
  const t={1:"সূর্য গ্রহের প্রভাবে আপনি জন্মগত নেতা। আত্মবিশ্বাস, সৃজনশীলতা ও উদ্ভাবনী শক্তি আপনার প্রধান বৈশিষ্ট্য।",2:"চন্দ্র গ্রহের প্রভাবে আবেগপ্রবণ, কল্পনাপ্রবণ ও সৃজনশীল। মানুষের মন বুঝতে অসাধারণ।",3:"বৃহস্পতির প্রভাবে জ্ঞানী, আশাবাদী ও আধ্যাত্মিক। শিক্ষক বা পরামর্শক হিসেবে অসাধারণ।",4:"রাহুর প্রভাবে রহস্যময়, গভীর চিন্তাবিদ ও উদ্ভাবক। নতুন পথ তৈরি করতে ভালোবাসেন।",5:"বুধের প্রভাবে বুদ্ধিমান, চটপটে ও যোগাযোগ দক্ষ। ব্যবসায়িক বুদ্ধি সহজাত।",6:"শুক্রের প্রভাবে সৌন্দর্যপ্রিয়, শিল্পীহৃদয় ও রোমান্টিক।",7:"কেতুর প্রভাবে আধ্যাত্মিক ও দার্শনিক। একাকীত্ব আপনার শক্তি।",8:"শনির প্রভাবে ধৈর্যশীল, পরিশ্রমী ও দায়িত্বশীল। কঠিন পথই আপনাকে মহান করে।",9:"মঙ্গলের প্রভাবে সাহসী, উদ্যমী ও যোদ্ধা প্রকৃতির।"};
  return t[n]||`${d.planet} গ্রহের প্রভাবে অনন্য বৈশিষ্ট্যের অধিকারী।`;
}

function getBusinessDesc(n,d){
  const t={1:"সূর্যের প্রভাবে নেতৃত্ব ও ক্ষমতার প্রতীক। প্রশাসন, স্টার্টআপ, টেকনোলজিতে সফল।",2:"চন্দ্রের প্রভাবে জনপ্রিয়তার প্রতীক। হোটেল, রেস্টুরেন্ট, সেবামূলক প্রতিষ্ঠানে সফল।",3:"বৃহস্পতির প্রভাবে জ্ঞান ও বিশ্বাসের প্রতীক। শিক্ষা, আইন, কনসালটেন্সিতে সফল।",4:"রাহুর প্রভাবে প্রযুক্তির প্রতীক। আইটি, আন্তর্জাতিক বাণিজ্যে সফল।",5:"বুধের প্রভাবে যোগাযোগ ও বাণিজ্যের প্রতীক। মিডিয়া, মার্কেটিং, ট্রেডিংয়ে সফল।",6:"শুক্রের প্রভাবে সৌন্দর্যের প্রতীক। ফ্যাশন, কসমেটিকস, বিনোদনে সফল।",7:"কেতুর প্রভাবে গবেষণার প্রতীক। পাবলিশিং, রিসার্চে সফল।",8:"শনির প্রভাবে স্থায়িত্বের প্রতীক। নির্মাণ, রিয়েল এস্টেটে সফল।",9:"মঙ্গলের প্রভাবে প্রতিযোগিতামূলক শক্তির প্রতীক। কনস্ট্রাকশন, স্পোর্টসে সফল।"};
  return t[n]||`${d.planet} গ্রহের প্রভাবে সাফল্য আনবে।`;
}

function getHomeDesc(n,d){
  const t={1:"সূর্যের প্রভাবে নেতৃত্ব ও আত্মবিশ্বাসের পরিবেশ।",2:"চন্দ্রের প্রভাবে পারিবারিক বন্ধন মজবুত হয়।",3:"বৃহস্পতির প্রভাবে জ্ঞান ও শিক্ষার পরিবেশ।",4:"রাহুর প্রভাবে রহস্যময়তা — সতর্কতা দরকার।",5:"বুধের প্রভাবে সক্রিয় পরিবেশ।",6:"শুক্রের প্রভাবে সৌন্দর্য ও প্রেমের পরিবেশ।",7:"কেতুর প্রভাবে আধ্যাত্মিক ও শান্ত পরিবেশ।",8:"শনির প্রভাবে শৃঙ্খলা ও পরিশ্রমের পরিবেশ।",9:"মঙ্গলের প্রভাবে শক্তি ও সাহসের পরিবেশ।"};
  return t[n]||`${d.planet} গ্রহের প্রভাবে এই বাড়ি শুভ।`;
}

function getPinDesc(n,d){
  const t={1:"সূর্যের প্রভাবে শক্তিশালী ও নিরাপদ।",2:"চন্দ্রের প্রভাবে সংবেদনশীল।",3:"বৃহস্পতির আশীর্বাদে শুভ ও নিরাপদ।",4:"রাহুর প্রভাবে মাঝারি।",5:"বুধের প্রভাবে সক্রিয়।",6:"শুক্রের কৃপায় শুভ।",7:"কেতুর প্রভাবে গোপনীয় ও নিরাপদ।",8:"শনির প্রভাবে শক্তিশালী।",9:"মঙ্গলের প্রভাবে সাহসী।"};
  return t[n]||`${d.planet} গ্রহের প্রভাবে মাঝারি নিরাপত্তা।`;
}

function getBankDesc(n,d){
  const t={1:"সূর্যের প্রভাবে অত্যন্ত স্থিতিশীল।",2:"চন্দ্রের প্রভাবে মাঝারি স্থিতিশীল।",3:"বৃহস্পতির প্রভাবে উন্নয়নমূলক বিনিয়োগে সেরা।",4:"রাহুর প্রভাবে অস্থিরতার সম্ভাবনা।",5:"বুধের প্রভাবে দ্রুত লেনদেনে উপযুক্ত।",6:"শুক্রের প্রভাবে অত্যন্ত স্থিতিশীল।",7:"কেতুর প্রভাবে দীর্ঘমেয়াদী সঞ্চয়ে ভালো।",8:"শনির প্রভাবে দীর্ঘমেয়াদে স্থিতিশীল।",9:"মঙ্গলের প্রভাবে সক্রিয়।"};
  return t[n]||`${d.planet} গ্রহের প্রভাবে মাঝারি স্থিতিশীলতা।`;
}

function getPriceDesc(n,d){
  return [3,6,9].includes(n)?`${d.planet} গ্রহের প্রভাবে অত্যন্ত শুভ মূল্য।`:`${d.planet} গ্রহের প্রভাবে সতর্কতা প্রয়োজন। ৩, ৬, ৯ সংখ্যার মূল্য শুভ।`;
}

// Extra helpers
function getNamankEffect(n){
  const t={1:"এই নামে সূর্যের শক্তি — স্বাভাবিকভাবে নেতৃত্বে আকৃষ্ট। অন্যরা অনুসরণ করে।",2:"এই নামে চন্দ্রের শক্তি — মানুষের হৃদয় জয় করে। সম্পর্কে স্বাভাবিক সৌহার্দ্য।",3:"এই নামে বৃহস্পতির শক্তি — জ্ঞান ও প্রজ্ঞার আলো ছড়ায়।",4:"এই নামে রাহুর শক্তি — গভীর চিন্তায় পারদর্শী। উদ্ভাবনী শক্তি অসাধারণ।",5:"এই নামে বুধের শক্তি — যোগাযোগে অসাধারণ। মানুষকে প্রভাবিত করে।",6:"এই নামে শুক্রের শক্তি — সৌন্দর্য ও সম্পর্কে আকৃষ্ট। জীবন আনন্দময়।",7:"এই নামে কেতুর শক্তি — গভীর প্রজ্ঞায় পথ দেখায়।",8:"এই নামে শনির শক্তি — ধৈর্য ও দৃঢ়তায় সাফল্য।",9:"এই নামে মঙ্গলের শক্তি — সাহস ও শক্তিতে অনুপ্রেরণা দেয়।"};
  return t[n]||"এই নামে বিশেষ শক্তি নিহিত।";
}

function getRelationTip(n){
  const t={1:"সংখ্যা ১,৩,৯-এর সাথে সম্পর্ক শুভ।",2:"সংখ্যা ২,৬,৭-এর সাথে সম্পর্ক শুভ।",3:"সংখ্যা ৩,৬,৯-এর সাথে সম্পর্ক শুভ।",4:"সংখ্যা ৪,৮-এর সাথে সম্পর্ক শুভ।",5:"সংখ্যা ৫,৩,৬-এর সাথে সম্পর্ক শুভ।",6:"সংখ্যা ৬,২,৩-এর সাথে সম্পর্ক শুভ।",7:"সংখ্যা ৭,২,৯-এর সাথে সম্পর্ক শুভ।",8:"সংখ্যা ৮,৪-এর সাথে সম্পর্ক শুভ।",9:"সংখ্যা ৯,১,৩-এর সাথে সম্পর্ক শুভ।"};
  return t[n]||"বোঝাপড়া ও শ্রদ্ধাই সম্পর্কের মূল।";
}

function getBabyNameEffect(n){
  const t={1:"নামে সূর্যের শক্তি — শিশু নেতৃত্বে অগ্রণী হবে। স্বাধীনচেতা ও আত্মবিশ্বাসী।",2:"নামে চন্দ্রের শক্তি — শিশু সৃজনশীল ও আবেগপ্রবণ হবে।",3:"নামে বৃহস্পতির শক্তি — শিশু জ্ঞানী ও বিদ্বান হবে।",4:"নামে রাহুর শক্তি — শিশু উদ্ভাবনী ও রহস্যময় হবে।",5:"নামে বুধের শক্তি — শিশু মেধাবী ও যোগাযোগে দক্ষ হবে।",6:"নামে শুক্রের শক্তি — শিশু শিল্পীমনা ও সৌন্দর্যপ্রিয় হবে।",7:"নামে কেতুর শক্তি — শিশু আধ্যাত্মিক ও দার্শনিক হবে।",8:"নামে শনির শক্তি — শিশু পরিশ্রমী ও দায়িত্বশীল হবে।",9:"নামে মঙ্গলের শক্তি — শিশু সাহসী ও উদ্যমী হবে।"};
  return t[n]||"এই নামে শিশুর জন্য শুভ শক্তি নিহিত।";
}

function getBabyFutureTip(n){
  const t={1:"নেতৃত্বগুণ বিকশিত হবে। ব্যবসা, রাজনীতি বা প্রশাসনে উজ্জ্বল ক্যারিয়ার।",2:"শিল্প, সংগীত বা সামাজিক কাজে সাফল্য। আবেগকে সম্মান করুন।",3:"শিক্ষকতা বা পরামর্শ পেশায় সাফল্য। শিক্ষায় মনোযোগ দিন।",4:"প্রযুক্তি বা গবেষণায় সাফল্য। মানসিক স্থিরতায় মনোযোগ দিন।",5:"ব্যবসা বা মিডিয়ায় উজ্জ্বল। কৌতূহলকে উৎসাহিত করুন।",6:"শিল্পকলা বা ফ্যাশনে সাফল্য। সৌন্দর্যসচেতন পরিবেশ দিন।",7:"দর্শন বা গবেষণায় সাফল্য। গভীর পড়াশোনার সুযোগ দিন।",8:"ব্যবসা বা আইনে দেরিতে স্থায়ী সাফল্য। নৈতিকতার শিক্ষা দিন।",9:"সামরিক বা ক্রীড়ায় উজ্জ্বল। শক্তিকে সঠিক দিকে পরিচালিত করুন।"};
  return t[n]||"সঠিক পরিবেশ ও শিক্ষায় শিশু সফল হবে।";
}

function getMarriageTip(n){
  const t={1:"আদর্শ সঙ্গী: ১, ৩, ৯। সূর্যের মিত্র বৃহস্পতি ও মঙ্গলের সাথে আদর্শ মিলন।",2:"আদর্শ সঙ্গী: ২, ৬, ৭। চন্দ্রের মিত্র শুক্র ও কেতুর সাথে সুখী দাম্পত্য।",3:"আদর্শ সঙ্গী: ৩, ৬, ৯। জ্ঞান ও আধ্যাত্মিকতার সমন্বয়ে সুখী গৃহস্থালি।",4:"আদর্শ সঙ্গী: ৪, ৮। সম্পর্কে বিশেষ সতর্কতা প্রয়োজন।",5:"আদর্শ সঙ্গী: ৫, ৩, ৬। যোগাযোগ ও বোঝাপড়ায় সম্পর্ক টিকে থাকে।",6:"আদর্শ সঙ্গী: ৬, ২, ৩। প্রেম ও সৌন্দর্যের মিলনে সুখী জীবন।",7:"আদর্শ সঙ্গী: ৭, ২, ৯। একাকীত্বকে সম্মান করে এমন সঙ্গী প্রয়োজন।",8:"আদর্শ সঙ্গী: ৮, ৪। দেরিতে সুখ আসলেও স্থায়ী।",9:"আদর্শ সঙ্গী: ৯, ১, ৩। শক্তিশালী ও উদ্যমী দাম্পত্য।"};
  return t[n]||"সামঞ্জস্য ভালো। সম্পর্কের উন্নয়ন সম্ভব।";
}

function getMarriageLifePotential(n){
  const t={1:"দাম্পত্যে নেতৃত্বের ভূমিকা নেন। সঙ্গীকে ছাড় দেওয়া শিখলে সুখী।",2:"দাম্পত্যে অত্যন্ত আবেগী। সঙ্গীর যত্ন নেওয়া সহজাত।",3:"দাম্পত্যে আশাবাদী ও উৎসাহী। বিবাহিত জীবন আনন্দময় হয়।",4:"দাম্পত্যে বিশ্বস্ত ও দায়িত্বশীল।",5:"দাম্পত্যে সক্রিয় ও মজাদার।",6:"দাম্পত্যে সবচেয়ে সুখী হয়। প্রেম ও সংসার স্বাভাবিক জগৎ।",7:"দাম্পত্যে গভীর বন্ধন তৈরি করে।",8:"দাম্পত্যে দেরিতে সুখী হয়। ধৈর্য ধরলে স্থায়ী।",9:"দাম্পত্যে উদ্যমী ও সাহসী।"};
  return t[n]||"সঠিক সঙ্গীর সাথে সুখী দাম্পত্য সম্ভব।";
}

function getMarriageAdvice(n){
  const t={1:"অহংকার নিয়ন্ত্রণ করুন। সঙ্গীর মতামতকে গুরুত্ব দিন।",2:"আবেগ নিয়ন্ত্রণ করুন। অস্থিরতায় সিদ্ধান্ত নেবেন না।",3:"অতিরিক্ত পরামর্শ দেওয়া কমান। সঙ্গীকে স্বাধীনতা দিন।",4:"দাম্পত্যে স্থিরতা আনুন। নিয়মিত সময় দিন।",5:"চঞ্চলতা নিয়ন্ত্রণ করুন।",6:"বিলাসিতার কারণে সঙ্গীকে উপেক্ষা করবেন না।",7:"একাকীত্বের প্রয়োজন সঙ্গীকে বুঝিয়ে বলুন।",8:"কাজের চাপে দাম্পত্যে দূরত্ব যেন না হয়।",9:"রাগ নিয়ন্ত্রণ করুন। লড়াইয়ের মনোভাব ত্যাগ করুন।"};
  return t[n]||"সঙ্গীর সাথে সৎ যোগাযোগ বজায় রাখুন।";
}

function getLoveTrait(n){
  const t={1:"প্রেমে নেতৃত্ব দিতে ভালোবাসেন। অহংকার এড়িয়ে চলুন।",2:"প্রেমে অত্যন্ত আবেগী ও রোমান্টিক। গভীর সংযোগ চান।",3:"প্রেমে আশাবাদী ও উৎসাহী।",4:"প্রেমে রহস্যময় ও গভীর। একবার ভালোবাসলে চিরকাল।",5:"প্রেমে চঞ্চল ও আকর্ষণীয়।",6:"প্রেমে সবচেয়ে নিবেদিত।",7:"প্রেমে গভীর ও দার্শনিক। আত্মিক সংযোগ চান।",8:"প্রেমে ধীর কিন্তু স্থায়ী।",9:"প্রেমে সাহসী ও আবেগময়।"};
  return t[n]||"প্রেমে বিশ্বাস ও সততাই মূল।";
}

function getFamilyTip(n){
  const t={1:"পরিবারে নেতৃত্বের ভূমিকা। অন্যদের মতামতকে গুরুত্ব দিন।",2:"পারিবারিক মানসিক সংযোগের কেন্দ্রবিন্দু।",3:"পরিবারের জ্ঞান ও পরামর্শের উৎস।",4:"পরিবারে স্থিরতা আনুন।",5:"পারিবারিক যোগাযোগ সুদৃঢ় রাখুন।",6:"পরিবারের সৌন্দর্য ও সুখকে কেন্দ্রে রাখুন।",7:"পরিবারের সাথে আধ্যাত্মিক বন্ধন গড়ুন।",8:"পরিবারের আর্থিক নিরাপত্তা প্রদান শক্তি।",9:"পারিবারিক কার্যক্রমে সক্রিয়ভাবে অংশ নিন।"};
  return t[n]||"বোঝাপড়া ও ভালোবাসা বজায় রাখুন।";
}

function getFamilyRole(n){
  const t={1:"পরিবারের স্বাভাবিক নেতা। অন্যরা পরামর্শ মানে।",2:"পরিবারের আবেগী কেন্দ্রবিন্দু।",3:"পরিবারের জ্ঞান ও পরামর্শের উৎস।",4:"পরিবারে রহস্যময় কিন্তু বিশ্বস্ত।",5:"পরিবারের সক্রিয় যোগাযোগের সেতু।",6:"পরিবারের সৌন্দর্য ও সুখের উৎস।",7:"পরিবারের আধ্যাত্মিক শক্তি।",8:"পরিবারের আর্থিক নিরাপত্তাদাতা।",9:"পরিবারের সাহস ও শক্তির উৎস।"};
  return t[n]||"পরিবারে গুরুত্বপূর্ণ ভূমিকা পালন করেন।";
}

function getFamilyPeace(n){
  const t={1:"রবিবারে পরিবারের সাথে একসাথে কার্যক্রম করুন।",2:"সোমবারে একসাথে খাবার খান।",3:"বৃহস্পতিবারে শিক্ষামূলক অনুষ্ঠান করুন।",4:"শনিবারে প্রকৃতিতে সময় কাটান।",5:"বুধবারে নতুন কিছু শিখুন।",6:"শুক্রবারে বিনোদন করুন।",7:"শুক্রবারে ধ্যান করুন।",8:"শনিবারে পরিকল্পনা করুন।",9:"মঙ্গলবারে একসাথে খেলাধুলা করুন।"};
  return t[n]||"নিয়মিত মানসম্পন্ন সময় কাটান।";
}

function getJourneyTime(n){
  const t={1:"সকাল ৬-৮টা",2:"সন্ধ্যা ৬-৮টা",3:"সকাল ৮-১০টা",4:"সন্ধ্যা ৬টার পর",5:"দুপুর ১২-২টা",6:"সন্ধ্যার সময়",7:"ভোর ৪-৬টা",8:"সূর্যাস্তের পর",9:"দুপুর ১২-৩টা"};
  return `যাত্রার শুভ সময়: <strong>${t[n]||'সকাল'}</strong>। এই সময়ে গ্রহের অবস্থান অনুকূল।`;
}

function getJourneyCaution(n){
  const t={1:"বিরোধী বা শত্রু নম্বরের দিনে দীর্ঘ যাত্রা এড়িয়ে চলুন।",2:"অমাবস্যার দিন যাত্রা এড়িয়ে চলুন।",3:"যাত্রার সময় অহংকার করবেন না।",4:"রাতের বেলা একা দীর্ঘ যাত্রা এড়িয়ে চলুন।",5:"গতির দিকে সতর্ক থাকুন।",6:"মনোমালিন্যের দিন যাত্রা এড়িয়ে চলুন।",7:"গভীর রাতে যাত্রা এড়িয়ে চলুন।",8:"মঙ্গলবারে দীর্ঘ যাত্রায় সতর্ক থাকুন।",9:"রাগান্বিত অবস্থায় গাড়ি চালাবেন না।"};
  return t[n]||"যাত্রায় সতর্ক থাকুন, ট্রাফিক নিয়ম মেনে চলুন।";
}

function getJourneyRitual(n){
  const t={1:"সূর্যকে নমস্কার জানিয়ে যাত্রা শুরু করুন।",2:"দুর্গা বা চন্দ্রমাকে স্মরণ করুন।",3:"গুরুকে প্রণাম করুন।",4:"ধূপ বা লোবান জ্বালিয়ে নিন।",5:"গণেশকে প্রণাম করুন।",6:"লক্ষ্মীর পূজা করুন।",7:"গণেশ বা শিবের পূজা করুন।",8:"হনুমান চালিসা পাঠ করুন।",9:"হনুমানকে প্রণাম করুন। লাল ফুল অর্পণ করুন।"};
  return t[n]||"ঈশ্বরের কাছে নিরাপদ যাত্রার প্রার্থনা করুন।";
}

function getHomeInfluence(n){
  const t={1:"আত্মবিশ্বাস ও নেতৃত্বগুণ বৃদ্ধি পায়।",2:"পারিবারিক বন্ধন মজবুত হয়।",3:"শিক্ষার পরিবেশ তৈরি হয়।",4:"অপ্রত্যাশিত পরিবর্তন ঘটতে পারে।",5:"ব্যবসায়িক যোগাযোগ বাড়ে।",6:"প্রেম ও সৌন্দর্য বিরাজ করে।",7:"ধ্যান ও আধ্যাত্মিকতায় সাফল্য।",8:"পরিশ্রমের পরিবেশ তৈরি হয়।",9:"শক্তি ও সাহসের পরিবেশ।"};
  return t[n]||"এই বাড়িতে বসবাস পরিবারের জন্য শুভ।";
}

function getHomeFamilyEffect(n){
  const t={1:"পরিবারে নেতৃত্বের পরিবেশ।",2:"পারিবারিক বন্ধন মজবুত হয়।",3:"সন্তানের শিক্ষায় মনোযোগ বাড়ে।",4:"পারিবারিক উত্থান-পতন থাকতে পারে।",5:"পারিবারিক যোগাযোগ সক্রিয় থাকে।",6:"পরিবারে প্রেম ও আনন্দ বিরাজ করে।",7:"পারিবারিক শান্তি ও মানসিক প্রশান্তি।",8:"পরিবারে দায়িত্বশীলতার পরিবেশ।",9:"পরিবারে উৎসাহ ও শক্তি।"};
  return t[n]||"পারিবারিক জীবনে ইতিবাচক প্রভাব।";
}

function getHomeFinanceEffect(n){
  const t={1:"আর্থিক সমৃদ্ধি ধীরে ধীরে বাড়ে।",2:"যৌথ সম্পদে বৃদ্ধি পায়।",3:"শিক্ষামূলক বিনিয়োগে লাভ।",4:"আর্থিক উত্থান-পতন থাকতে পারে।",5:"ব্যবসায়িক আয় বাড়ে।",6:"সম্পদ ও সমৃদ্ধি বিরাজ করে।",7:"দীর্ঘমেয়াদী আর্থিক স্থিতিশীলতা।",8:"কঠোর পরিশ্রমে আর্থিক লাভ।",9:"উদ্যোক্তামূলক সুযোগ বাড়ে।"};
  return t[n]||"আর্থিক জীবনে ইতিবাচক প্রভাব।";
}

function getHomePeace(n){
  const t={1:"পূর্ব দিকে প্রধান দরজা রাখুন।",2:"উত্তর-পশ্চিম দিকে জলের উৎস রাখুন।",3:"পূর্ব-উত্তর দিকে পূজা ঘর রাখুন।",4:"দক্ষিণ-পশ্চিম দিকে গাছ লাগান।",5:"উত্তর দিকে বইয়ের আলমারি রাখুন।",6:"দক্ষিণ-পূর্ব দিকে সুন্দর শো-পিস রাখুন।",7:"উত্তর-পূর্ব দিকে ধ্যানের জায়গা রাখুন।",8:"পশ্চিম দিকে অফিসের জায়গা রাখুন।",9:"দক্ষিণ দিকে ব্যায়ামের জায়গা রাখুন।"};
  return t[n]||"নিয়মিত ধূপ জ্বালান ও পরিষ্কার রাখুন।";
}

function getHomeRemedy(n,d){return`${d.luckyColor} রঙের ব্যবহার বাড়িতে শান্তি বাড়ায়। ${d.luckyDay} দিনে বাড়িতে পূজা করুন। ${d.gemstone||''} রত্নপাথর বাড়িতে রাখলে শুভফল পাবেন।`;}

function getLifeMilestones(n){
  const t={1:"২৮, ৩৬ ও ৪৫ বছরে বড় পরিবর্তন।",2:"২৫, ৩৩ ও ৪২ বছরে বিশেষ ঘটনা।",3:"২৭, ৩৬ ও ৪৫ বছরে সাফল্যের শীর্ষে।",4:"৩২, ৪০ ও ৪৮ বছরে স্থিতিশীলতা।",5:"২৫, ৩২ ও ৪১ বছরে দ্রুত পরিবর্তন।",6:"২৮, ৩৩ ও ৪৪ বছরে সুখের শীর্ষে।",7:"৩৫, ৪২ ও ৪৯ বছরে আধ্যাত্মিক উন্নতি।",8:"৩৬, ৪৪ ও ৫২ বছরে বড় সাফল্য।",9:"২৭, ৩৬ ও ৪৫ বছরে সংগ্রাম ও সাফল্য।"};
  return t[n]||"জীবনে নিয়মিত সংগ্রাম ও সাফল্যের বছর আসে।";
}

function getPartnerAdvice(n){
  const t={1:"একক মালিকানায় সেরা। অংশীদার: ১, ৩, ৯।",2:"অংশীদারিত্বে ভালো। অংশীদার: ২, ৬, ৭।",3:"অংশীদার: ৩, ৬, ৯।",4:"অংশীদার: ৪, ৮। সাবধানে করুন।",5:"অংশীদার: ৫, ৩, ৬।",6:"অংশীদার: ৬, ২, ৩।",7:"অংশীদার: ৭, ২, ৯।",8:"অংশীদার: ৮, ৪।",9:"অংশীদার: ৯, ১, ৩।"};
  return t[n]||"অংশীদার নির্বাচনে সতর্ক থাকুন।";
}

function getSuccessMantra(n){
  const t={1:"'আমি নেতা — নিজের পথ নিজেই তৈরি করব'",2:"'সহযোগিতা ও সম্পর্কই আমার মূলধন'",3:"'জ্ঞানই শক্তি — শিক্ষাই আমার পথ'",4:"'গবেষণা ও উদ্ভাবনই সাফল্যের চাবিকাঠি'",5:"'যোগাযোগ ও গতিশীলতাই মূলমন্ত্র'",6:"'সৌন্দর্য ও সম্পর্কই ব্যবসার প্রাণ'",7:"'গুণগত মান ও সত্যই পাথেয়'",8:"'ধৈর্য ও পরিশ্রমই সাফল্যের মূল'",9:"'সাহস ও উদ্যমই শক্তি'"};
  return t[n]||"সততা ও নিষ্ঠার সাথে কাজ করুন।";
}

function getPartnerCompatibility(n){
  const t={1:"১, ৩, ৯",2:"২, ৬, ৭",3:"৩, ৬, ৯",4:"৪, ৮",5:"৫, ৩, ৬",6:"৬, ২, ৩",7:"৭, ২, ৯",8:"৮, ৪",9:"৯, ১, ৩"};
  return `${t[n]||'মিত্র সংখ্যা'} সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব সফল হওয়ার সম্ভাবনা বেশি।`;
}

function getPartnerSuccess(n){
  const t={1:"নিজের দৃষ্টিভঙ্গিতে অটল থাকুন কিন্তু অংশীদারের মতামত শুনুন।",2:"টিম ওয়ার্ক ও মানসিক সংযোগই শক্তি।",3:"জ্ঞান বিতরণ করুন।",4:"গবেষণায় বিনিয়োগ করুন।",5:"সক্রিয় যোগাযোগ বজায় রাখুন।",6:"সৃজনশীলতা প্রয়োগ করুন।",7:"গুণগত মান বজায় রাখুন।",8:"সংগঠিতভাবে কাজ করুন।",9:"উদ্যম বজায় রাখুন।"};
  return t[n]||"সততা ও নিষ্ঠার সাথে অংশীদারিত্ব বজায় রাখুন।";
}

function getColorPsychology(n){
  const t={1:"লাল রং আত্মবিশ্বাস ও নেতৃত্বের প্রতীক। শক্তি ও উদ্যমের অনুভূতি জাগায়।",2:"সাদা রং শান্তি ও পবিত্রতার প্রতীক। বিশ্বাসযোগ্যতা তৈরি করে।",3:"হলুদ রং জ্ঞান ও ইতিবাচকতার প্রতীক। উৎসাহ তৈরি করে।",4:"নীল রং রহস্য ও স্থিতিশীলতার প্রতীক। প্রযুক্তিতে আদর্শ।",5:"সবুজ রং সতেজতা ও বৃদ্ধির প্রতীক।",6:"গোলাপি রং ভালোবাসা ও সৌন্দর্যের প্রতীক।",7:"বেগুনি রং আধ্যাত্মিকতার প্রতীক।",8:"কালো রং শক্তি ও কর্তৃত্বের প্রতীক। কর্পোরেটে আদর্শ।",9:"লাল ও কমলা রং সাহস ও উদ্যমের প্রতীক।"};
  return t[n]||"শুভ রং ব্যবহারে ব্র্যান্ডের গ্রহণযোগ্যতা বাড়ে।";
}

function getLogoDesign(n){
  const t={1:"বৃত্তাকার বা সূর্য-আকৃতির লোগো শুভ।",2:"অর্ধচন্দ্রাকার বা তরঙ্গ-আকৃতির লোগো শুভ।",3:"ত্রিকোণাকার লোগো শুভ।",4:"বর্গাকার লোগো শুভ।",5:"পাঁচকোণা তারকা শুভ।",6:"হৃদয়াকার বা ফুলের আকৃতি শুভ।",7:"ষটভুজ বা আধ্যাত্মিক প্রতীক শুভ।",8:"আয়তাকার শক্তিশালী জ্যামিতিক আকৃতি শুভ।",9:"তারকাকার লোগো শুভ।"};
  return t[n]||"সরল, স্মরণীয় ও শুভ রঙের লোগো তৈরি করুন।";
}

function getAvoidColor(n){
  const t={1:"কালো বা গাঢ় ধূসর রং এড়িয়ে চলুন।",2:"তীব্র লাল বা কমলা রং এড়িয়ে চলুন।",3:"কালো বা গাঢ় বেগুনি রং এড়িয়ে চলুন।",4:"উজ্জ্বল হলুদ বা সোনালি রং এড়িয়ে চলুন।",5:"কালো বা গাঢ় বাদামি রং এড়িয়ে চলুন।",6:"কালো বা গাঢ় সবুজ রং এড়িয়ে চলুন।",7:"লাল বা কমলা রং এড়িয়ে চলুন।",8:"উজ্জ্বল হলুদ রং এড়িয়ে চলুন।",9:"নীল বা ধূসর রং এড়িয়ে চলুন।"};
  return t[n]||"বিপরীত রং এড়িয়ে শুভ রঙে ব্র্যান্ড তৈরি করুন।";
}

function getLaunchTime(n,d){
  const t={1:"সকাল ৬-৮টা",2:"সন্ধ্যা ৬-৮টা",3:"সকাল ৮-১০টা",4:"সন্ধ্যা ৬টার পর",5:"দুপুর ১২-২টা",6:"সন্ধ্যা ৫-৭টা",7:"ভোর ৪-৬টা",8:"সন্ধ্যা ৬-৮টা",9:"দুপুর ১২-৩টা"};
  return `${d.luckyDay} দিনে ${t[n]||'সকালে'} উদ্বোধন করলে সাফল্য আসবে।`;
}

function getLaunchAuspiciousness(n){
  const t={1:"রবিবার সকালে অত্যন্ত শুভ। সূর্যের শক্তিতে ব্যবসা আলোকিত।",2:"সোমবার সন্ধ্যায় শুভ। জনপ্রিয়তা দ্রুত বাড়বে।",3:"বৃহস্পতিবার সকালে অত্যন্ত শুভ।",4:"শনিবার বিকেলে শুভ।",5:"বুধবার দুপুরে শুভ।",6:"শুক্রবার সন্ধ্যায় শুভ।",7:"রবিবার ভোরে শুভ।",8:"শনিবার সন্ধ্যায় শুভ।",9:"মঙ্গলবার দুপুরে শুভ।"};
  return t[n]||"শুভ দিন ও সময়ে উদ্বোধন করলে সাফল্য নিশ্চিত।";
}

function getLaunchFuture(n){
  const t={1:"প্রথম ৩ বছরে দ্রুত বৃদ্ধি।",2:"২ বছরে জনপ্রিয়তা বাড়বে।",3:"৪ বছরে শিক্ষামূলক খ্যাতি।",4:"৫-৬ বছরে স্থায়ী সাফল্য।",5:"প্রথম ২ বছরেই দ্রুত বৃদ্ধি।",6:"৩ বছরে সৌন্দর্য শিল্পে পরিচিত।",7:"৬-৭ বছরে মানসম্পন্ন সেবায় পরিচিত।",8:"৭-৮ বছরের পরিশ্রমে দীর্ঘস্থায়ী সাফল্য।",9:"৩ বছরে প্রতিযোগিতামূলক বাজারে জায়গা।"};
  return t[n]||"সঠিক পরিকল্পনা ও পরিশ্রমে সাফল্য নিশ্চিত।";
}

function getAltPrice(n){
  const t={1:"১১১, ৫৫৫, ৯৯৯ — সূর্যের শুভ সংখ্যা",2:"২২২, ৬৬৬, ৮৮৮ — চন্দ্রের শুভ সংখ্যা",3:"৩৩৩, ৬৬৬, ৯৯৯ — বৃহস্পতির শুভ সংখ্যা",4:"৩৩৩, ৬৬৬, ৯৯৯ — মিত্র গ্রহের শুভ সংখ্যা",5:"৫৫৫, ১১১, ৭৭৭ — বুধের শুভ সংখ্যা",6:"৬৬৬, ৯৯৯, ৩৩৩ — শুক্রের শুভ সংখ্যা",7:"৭৭৭, ১১১, ৫৫৫ — কেতুর শুভ সংখ্যা",8:"৩৩৩, ৬৬৬, ৯৯৯ — মিত্র গ্রহের শুভ সংখ্যা",9:"৯৯৯, ৫৫৫, ১১১ — মঙ্গলের শুভ সংখ্যা"};
  return `শুভ বিকল্প মূল্য: ${t[n]||'৩৩৩, ৬৬৬, ৯৯৯'} টাকা বা এর গুণিতক।`;
}

function getPriceStrategy(n){
  const t={1:"মূল্য শেষে ১ রাখুন। যেমন: ৩০১, ৫০১।",2:"মূল্য শেষে ২ রাখুন। যেমন: ৩০২, ৫০২।",3:"মূল্য শেষে ৩ বা ৯ রাখুন। যেমন: ৯৯৯, ৩৩৩।",4:"মূল্য ৩, ৬, ৯-এর সংখ্যায় পরিবর্তন করুন।",5:"মূল্য শেষে ৫ রাখুন। যেমন: ৩০৫, ৫০৫।",6:"মূল্য শেষে ৬ রাখুন। যেমন: ৩০৬, ৫০৬।",7:"মূল্য শেষে ৭ রাখুন। যেমন: ৩০৭, ৫০৭।",8:"মূল্য ৩, ৬, ৯-এর সংখ্যায় পরিবর্তন করুন।",9:"মূল্য শেষে ৯ রাখুন। যেমন: ৩০৯, ৯৯৯।"};
  return t[n]||"শুভ সংখ্যায় মূল্য নির্ধারণ করলে বিক্রি বাড়ে।";
}

function getVehicleSafety(n){
  const t={1:"দ্রুত গতি এড়িয়ে চলুন। সূর্যোদয়ের আগে যাত্রায় বিশেষ সুরক্ষা।",2:"রাতে সতর্ক থাকুন। কুয়াশার দিনে সতর্ক হন।",3:"নিয়মিত সার্ভিসিং করান।",4:"রাতে দীর্ঘ যাত্রা এড়িয়ে চলুন।",5:"সিগন্যাল মেনে চলুন।",6:"আরামদায়ক গতিতে চলুন।",7:"ফোন ব্যবহার করবেন না।",8:"ব্রেক নিয়মিত চেক করান।",9:"অতিরিক্ত গতি এড়িয়ে চলুন। রাগান্বিত অবস্থায় চালাবেন না।"};
  return t[n]||"সাবধানে চালান। ট্রাফিক নিয়ম মেনে চলুন।";
}

function getMobileEffect(n){
  const t={1:"কথোপকথন প্রভাবশালী হয়। সিদ্ধান্তে দৃঢ়তা আসে।",2:"সম্পর্কের কথোপকথন মধুর হয়।",3:"জ্ঞানপূর্ণ কথোপকথন কার্যকর।",4:"গভীর আলোচনায় কার্যকর।",5:"দ্রুত ও কার্যকর যোগাযোগ।",6:"সম্পর্কের কথোপকথন সুন্দর হয়।",7:"আধ্যাত্মিক ও গভীর আলোচনায় কার্যকর।",8:"ব্যবসায়িক কথোপকথনে দৃঢ়তা।",9:"প্রভাবশালী ও সাহসী কথোপকথন।"};
  return t[n]||"এই নম্বরে যোগাযোগ কার্যকর।";
}

function getMobileRelationEffect(n){
  const t={1:"পেশাদার সম্পর্কে বিশেষ কার্যকর।",2:"ব্যক্তিগত ও পারিবারিক সম্পর্কে শুভ।",3:"শিক্ষামূলক সম্পর্কে কার্যকর।",4:"গবেষণামূলক সম্পর্কে কার্যকর।",5:"সমস্ত সম্পর্কে কার্যকর।",6:"প্রেম ও পারিবারিক সম্পর্কে বিশেষ শুভ।",7:"আধ্যাত্মিক সম্পর্কে কার্যকর।",8:"ব্যবসায়িক সম্পর্কে শুভ।",9:"সমস্ত সম্পর্কে শক্তিশালী প্রভাব।"};
  return t[n]||"এই নম্বর সম্পর্কে ইতিবাচক প্রভাব ফেলে।";
}

function getPhoneCareer(n){
  const t={1:"নেতৃত্বের পদ, উদ্যোক্তা, প্রশাসন।",2:"সৃজনশীল পেশা, কাউন্সেলিং।",3:"শিক্ষকতা, পরামর্শ।",4:"গবেষণা, প্রযুক্তি।",5:"মার্কেটিং, সেলস, মিডিয়া।",6:"শিল্পকলা, বিনোদন, ফ্যাশন।",7:"গবেষণা, লেখালেখি।",8:"প্রশাসন, ব্যবস্থাপনা।",9:"উদ্যোক্তা, রাজনীতি, খেলাধুলা।"};
  return t[n]||"যোগাযোগমূলক পেশায় বিশেষ কার্যকর।";
}

function getBankStability(n){
  const t={1:"⭐⭐⭐⭐⭐ অত্যন্ত স্থিতিশীল।",2:"⭐⭐⭐ মাঝারি স্থিতিশীল।",3:"⭐⭐⭐⭐ উন্নয়নে সেরা।",4:"⭐⭐ অস্থিরতার সম্ভাবনা।",5:"⭐⭐⭐⭐ দ্রুত লেনদেনে উপযুক্ত।",6:"⭐⭐⭐⭐⭐ অত্যন্ত স্থিতিশীল।",7:"⭐⭐⭐ দীর্ঘমেয়াদে ভালো।",8:"⭐⭐⭐⭐⭐ দীর্ঘমেয়াদে স্থিতিশীল।",9:"⭐⭐⭐⭐ সক্রিয় অ্যাকাউন্ট।"};
  return t[n]||"⭐⭐⭐ মাঝারি স্থিতিশীলতার অ্যাকাউন্ট।";
}

function getBankGrowthTip(n){
  const t={1:"দীর্ঘমেয়াদী সঞ্চয় ও FD উত্তম।",2:"যৌথ অ্যাকাউন্টে বেশি লাভজনক।",3:"শিক্ষা বা স্বাস্থ্য বিনিয়োগে রিটার্ন ভালো।",4:"আন্তর্জাতিক বিনিয়োগে সুযোগ।",5:"শেয়ার বাজার ও মিউচুয়াল ফান্ডে লাভ।",6:"রিয়েল এস্টেট ও গহনায় বিনিয়োগ।",7:"দীর্ঘমেয়াদী বন্ড ও সরকারি বিনিয়োগ।",8:"জমি ও শিল্পে বিনিয়োগ।",9:"উদ্যোক্তামূলক বিনিয়োগে লাভ।"};
  return t[n]||"সঠিক বিনিয়োগে আর্থিক বৃদ্ধি সম্ভব।";
}

function getPinSecurity(n){
  const t={1:"🔒 অত্যন্ত শক্তিশালী ও নিরাপদ।",2:"🔑 সাধারণ মানের — নিয়মিত পরিবর্তন করুন।",3:"🔒 ভাগ্যবান ও নিরাপদ।",4:"⚠️ মাঝারি — ৩ মাসে পরিবর্তন করুন।",5:"🔑 প্রতি মাসে পরিবর্তন করুন।",6:"🔒 স্থিতিশীল ও নিরাপদ।",7:"🔐 অত্যন্ত গোপনীয়।",8:"🔒 শক্তিশালী ও দীর্ঘস্থায়ী।",9:"🔒 সাহসী ও কার্যকর।"};
  return t[n]||"🔑 নিরাপদ। নিয়মিত পরিবর্তন করুন।";
}

function getPinLuck(n){
  const t={1:"আত্মবিশ্বাস ও সাফল্য বৃদ্ধি করবে।",2:"মানসিক শান্তি দেবে।",3:"জ্ঞান ও সৌভাগ্য বৃদ্ধি করবে।",4:"সতর্কতা প্রয়োজন।",5:"দ্রুত সিদ্ধান্তে সাহায্য করবে।",6:"সুখ ও সমৃদ্ধি দেবে।",7:"আধ্যাত্মিক উন্নতি করবে।",8:"ধৈর্য ও স্থিরতা দেবে।",9:"সাহস ও শক্তি বৃদ্ধি করবে।"};
  return t[n]||"ভাগ্যের উপর ইতিবাচক প্রভাব ফেলবে।";
}

function getStockTip(n){
  const t={1:"সরকারি খাতে দীর্ঘমেয়াদী বিনিয়োগ শুভ।",2:"FMCG ও হোটেল খাতে বিনিয়োগ শুভ।",3:"শিক্ষা ও স্বাস্থ্যসেবায় বিনিয়োগ শুভ।",4:"প্রযুক্তি ও আন্তর্জাতিক শেয়ারে বিনিয়োগ।",5:"মিডিয়া, টেলিকম ও ট্রেডিংয়ে সাফল্য।",6:"বিনোদন, হোটেল ও ফ্যাশন খাতে শুভ।",7:"ফার্মাসিউটিক্যাল ও গবেষণায় দীর্ঘমেয়াদী।",8:"রিয়েল এস্টেট ও অবকাঠামোয় দীর্ঘমেয়াদী।",9:"প্রতিরক্ষা, স্পোর্টস ও শক্তি খাতে শুভ।"};
  return t[n]||"বিনিয়োগের আগে গবেষণা করুন।";
}

function getStockTime(n){
  const t={1:"রবিবার বা সূর্যোদয়ের সময়।",2:"সোমবার বা পূর্ণিমার কাছাকাছি।",3:"বৃহস্পতিবার সকালে।",4:"শনিবার বিকেলে।",5:"বুধবার দুপুরে।",6:"শুক্রবার সন্ধ্যায়।",7:"রবি বা সোমবার ভোরে।",8:"শনিবার দীর্ঘমেয়াদী সিদ্ধান্ত।",9:"মঙ্গলবার দুপুরে।"};
  return `শুভ বিনিয়োগের সময়: ${t[n]||'শুভ দিন'}`;}

function getStockRisk(n){
  const t={1:"হঠকারী বিনিয়োগ এড়িয়ে চলুন।",2:"আবেগের বশে বিনিয়োগ করবেন না।",3:"অতিরিক্ত আশাবাদী হবেন না।",4:"ঝুঁকিপূর্ণ বিনিয়োগ থেকে দূরে থাকুন।",5:"দ্রুত লাভের লোভে পড়বেন না।",6:"বিলাসবহুল পণ্যে অতিরিক্ত বিনিয়োগ এড়ান।",7:"দীর্ঘমেয়াদী চিন্তা করুন।",8:"দ্রুত মুনাফার চেষ্টা করবেন না।",9:"প্রতিযোগিতামূলক উত্তেজনায় ভুল সিদ্ধান্ত নেবেন না।"};
  return t[n]||"বিশেষজ্ঞের পরামর্শ ছাড়া বড় বিনিয়োগ করবেন না।";
}

function getPropertyTip(n){
  const t={1:"পূর্বমুখী বা প্রধান সড়কের পাশের সম্পত্তি শুভ।",2:"জলের ধারে বা শান্ত এলাকায় শুভ।",3:"শিক্ষাপ্রতিষ্ঠানের কাছে ভালো রিটার্ন।",4:"প্রযুক্তি অঞ্চলে শুভ।",5:"বাণিজ্যিক এলাকায় শুভ।",6:"সৌন্দর্যপূর্ণ পরিবেশে শুভ।",7:"শান্ত প্রাকৃতিক পরিবেশে শুভ।",8:"শিল্প এলাকায় দীর্ঘমেয়াদে লাভজনক।",9:"শক্তিশালী বাণিজ্যিক অবস্থানে শুভ।"};
  return t[n]||"শুভ দিকের সম্পত্তি নির্বাচন করুন।";
}

function getPropertyGrowth(n){
  const t={1:"৩-৫ বছরে দ্বিগুণ হওয়ার সম্ভাবনা।",2:"২-৩ বছরে ভালো মূল্যবৃদ্ধি।",3:"৪-৫ বছরে স্থিতিশীল বৃদ্ধি।",4:"৫-৬ বছরে বড় মূল্যবৃদ্ধি।",5:"১-২ বছরে দ্রুত মূল্যবৃদ্ধি।",6:"৩-৪ বছরে মূল্যবৃদ্ধি।",7:"৬-৭ বছরে পরিবেশ-বান্ধব এলাকায় বৃদ্ধি।",8:"৭-৮ বছরে শিল্প এলাকায় বড় বৃদ্ধি।",9:"৩-৪ বছরে দ্রুত মূল্যবৃদ্ধি।"};
  return t[n]||"দীর্ঘমেয়াদী বিনিয়োগে ভালো লাভ।";
}

function getGoldTip(n){
  const t={1:"সোনার বার বা কয়েনে দীর্ঘমেয়াদী বিনিয়োগ।",2:"রূপার বিনিয়োগ শুভ।",3:"সোনার বিনিয়োগ অত্যন্ত শুভ।",4:"গোমেদ পাথরে বিনিয়োগ করুন।",5:"স্বল্পমেয়াদী বিনিয়োগ লাভজনক।",6:"হীরা ও সোনায় বিনিয়োগ শুভ।",7:"বৈদুর্য্য পাথরে বিনিয়োগ করুন।",8:"সোনার বারে ধৈর্যের সাথে বিনিয়োগ।",9:"প্রবাল ও সোনায় বিনিয়োগ শুভ।"};
  return t[n]||"দীর্ঘমেয়াদী সোনা বিনিয়োগ লাভজনক।";
}

function getGoldTime(n,d){return `${d.luckyDay} দিনে সোনা-রূপা কেনা বিশেষ শুভ। সকালের দিকে কেনা ভালো।`;}

function getBirthdaySignificance(n){
  const t={1:"সূর্যের সন্তান — নেতৃত্বের জন্য সৃষ্টি।",2:"চন্দ্রের কিরণ — অনুভূতির গভীরতা অসীম।",3:"বৃহস্পতির আশীর্বাদে জন্ম — জ্ঞান ও প্রজ্ঞায় অতুলনীয়।",4:"রাহুর শক্তিতে পরিচালিত — উদ্ভাবন ও রহস্যে অনন্য।",5:"বুধের মেধায় সমৃদ্ধ — যোগাযোগে অসাধারণ।",6:"শুক্রের সৌন্দর্যে আবৃত — ভালোবাসার পূজারি।",7:"কেতুর রহস্যে আলোকিত — আধ্যাত্মিকতায় উন্নত।",8:"শনির কঠোর পথে — সংগ্রামই সাফল্যের পথ।",9:"মঙ্গলের শক্তিতে বলীয়ান — যোদ্ধা ও বিজয়ী।"};
  return t[n]||"এই জন্মদিনে বিশেষ গ্রহীয় শক্তি নিহিত।";
}

function getBusinessNamePower(n){
  const t={1:"সূর্যের শক্তিতে ব্র্যান্ড নেতৃস্থানীয় হবে।",2:"চন্দ্রের শক্তিতে গ্রাহকের মন জয় করবে।",3:"বৃহস্পতির শক্তিতে বিশ্বাসযোগ্যতা দ্রুত অর্জিত।",4:"রাহুর শক্তিতে উদ্ভাবনী ব্র্যান্ড হবে।",5:"বুধের শক্তিতে মার্কেটিংয়ে অসাধারণ।",6:"শুক্রের শক্তিতে সৌন্দর্য শিল্পে অপ্রতিদ্বন্দ্বী।",7:"কেতুর শক্তিতে গুণগত মানের জন্য বিখ্যাত।",8:"শনির শক্তিতে দীর্ঘমেয়াদী টেকসই ব্র্যান্ড।",9:"মঙ্গলের শক্তিতে প্রতিযোগিতামূলক বাজারে শক্তিশালী।"};
  return t[n]||"এই নামে বিশেষ ব্যবসায়িক শক্তি নিহিত।";
}

function getPlanetRulerEffect(n,d){
  const t={1:"সূর্য নম্বর ১-এর অধিপতি। সূর্যের মতোই আপনি উজ্জ্বল ও শক্তিশালী।",2:"চন্দ্র নম্বর ২-এর অধিপতি। চাঁদের মতো আবেগ ও কল্পনায় পরিপূর্ণ।",3:"বৃহস্পতি নম্বর ৩-এর অধিপতি। গুরুর মতো জ্ঞান ও প্রজ্ঞায় সমৃদ্ধ।",4:"রাহু নম্বর ৪-এর অধিপতি। রহস্যের আলোয় ভবিষ্যৎ গড়েন।",5:"বুধ নম্বর ৫-এর অধিপতি। বুদ্ধির দীপ্তিতে পথ দেখান।",6:"শুক্র নম্বর ৬-এর অধিপতি। সৌন্দর্য ও প্রেমের দেবতার আশীর্বাদে ধন্য।",7:"কেতু নম্বর ৭-এর অধিপতি। আধ্যাত্মিক শক্তিতে অনন্য।",8:"শনি নম্বর ৮-এর অধিপতি। পরিশ্রম ও ধৈর্যই আপনার হাতিয়ার।",9:"মঙ্গল নম্বর ৯-এর অধিপতি। সাহস ও শক্তিতে অজেয়।"};
  return t[n]||`${d.planet} গ্রহের প্রভাবে বিশেষ শক্তির অধিকারী।`;
}

// ================================================================
// AMBIGUITY DETECTION — Point 5
// ================================================================
function detectAmbiguity(input){
  const t=input.trim();
  const conv=NumberUtils.convertBengaliDigits(t);
  const dig=conv.replace(/\D/g,'');

  // 10-11 অঙ্ক → মোবাইল নাকি ব্যাংক?
  if(/^\d{10,11}$/.test(dig)){
    if(NumberUtils.isPhoneNumber(t)) return null; // নিশ্চিত মোবাইল
    return{type:'mobile_vs_bank', options:[
      {id:'mobile_number',label:'📱 মোবাইল নম্বর'},
      {id:'bank_account',label:'💳 ব্যাংক অ্যাকাউন্ট'}
    ]};
  }
  // 4-8 alphanumeric → PIN নাকি গাড়ির নম্বর?
  if(/^[A-Za-z0-9]{4,8}$/.test(t)&&/[A-Za-z]/.test(t)&&/\d/.test(t)){
    return{type:'pin_vs_vehicle', options:[
      {id:'pin_code',label:'🔐 পাসওয়ার্ড / PIN Security'},
      {id:'car_number',label:'🚗 গাড়ির নম্বর'},
      {id:'bike_number',label:'🏍️ বাইক নম্বর'}
    ]};
  }
  // 9-18 অঙ্ক → ব্যাংক
  if(/^\d{12,18}$/.test(dig)) return null; // ব্যাংক নিশ্চিত

  return null;
}

// ================================================================
// SINGLE CATEGORIES — Point 2
// ================================================================
const singleCats=[
  {id:'personal_name',  name:'👤 ব্যক্তির নাম',          icon:'fa-user'},
  {id:'baby_name',      name:'🍼 শিশুর নাম',              icon:'fa-baby'},
  {id:'birthday',       name:'🎂 জন্মদিন বিশ্লেষণ',      icon:'fa-birthday-cake'},
  {id:'journey_date',   name:'✈️ শুভ যাত্রার দিন',        icon:'fa-calendar-check'},
  {id:'new_home',       name:'🏠 নতুন বাড়ি',              icon:'fa-home'},
  {id:'business_name',  name:'🏢 ব্যবসার নাম',             icon:'fa-building'},
  {id:'startup_name',   name:'🚀 স্টার্টআপ নাম',           icon:'fa-rocket'},
  {id:'logo_color',     name:'🎨 লোগো রঙ নির্বাচন',       icon:'fa-palette'},
  {id:'launch_date',    name:'📈 উদ্বোধনের তারিখ',         icon:'fa-calendar-alt'},
  {id:'product_price',  name:'💰 পণ্যের মূল্য নির্ধারণ',  icon:'fa-tag'},
  {id:'car_number',     name:'🚗 গাড়ির নম্বর',             icon:'fa-car'},
  {id:'bike_number',    name:'🏍️ বাইক নম্বর',              icon:'fa-motorcycle'},
  {id:'mobile_number',  name:'📱 মোবাইল নম্বর',            icon:'fa-mobile-alt'},
  {id:'bank_account',   name:'💳 ব্যাংক অ্যাকাউন্ট',      icon:'fa-university'},
  {id:'pin_code',       name:'🔐 পাসওয়ার্ড / PIN Security',icon:'fa-lock'},
  {id:'stock_market',   name:'📊 শেয়ার বাজার',             icon:'fa-chart-line'},
  {id:'property',       name:'🏘️ সম্পত্তি বিনিয়োগ',      icon:'fa-landmark'},
  {id:'gold_silver',    name:'✨ সোনা/রূপা বিনিয়োগ',      icon:'fa-gem'},
  {id:'mulank',         name:'🔮 মূলাংক বিশ্লেষণ',         icon:'fa-star'},
  {id:'name_number',    name:'📖 নামের অংক',                icon:'fa-book'}
];

// DUAL CATEGORIES — Point 2
const dualCats=[
  {id:'marriage',       name:'💍 বিবাহ মিলন',              icon:'fa-heart'},
  {id:'love',           name:'❤️ প্রেম মিলন',               icon:'fa-heartbeat'},
  {id:'family',         name:'👨‍👩‍👧 পরিবার মিলন',      icon:'fa-users'},
  {id:'partnership',    name:'🤝 অংশীদারিত্ব মিলন',       icon:'fa-handshake'}
];

// ================================================================
// SHOW CATEGORY SELECTION — single vs dual (Point 2)
// ================================================================
function showCategorySelection(isDual){
  const div=document.getElementById('resultContent');
  const ld=document.getElementById('loading');
  const cats=isDual?dualCats:singleCats;
  let btns=cats.map(c=>`<button class="option-btn" onclick="selectAndShowResult('${c.id}')"><i class="fas ${c.icon}"></i> ${c.name}</button>`).join('');
  div.innerHTML=`<div class="clarification-card">
    <i class="fas fa-question-circle" style="font-size:56px;color:var(--gold3)"></i>
    <h2 style="margin:14px 0 8px">"${escapeHtml(currentRawInput)}"</h2>
    <p>এই তথ্যটি কোন ধরনের বিশ্লেষণের জন্য?</p>
    <div class="option-buttons">${btns}</div>
  </div>`;
  div.style.display='block';
  if(ld)ld.style.display='none';
}

// Ambiguity clarification
function showAmbiguityClarification(amb){
  const div=document.getElementById('resultContent');
  const ld=document.getElementById('loading');
  const labels={mobile_vs_bank:'এই নম্বরটি কি মোবাইল নম্বর নাকি ব্যাংক অ্যাকাউন্ট?',
                 pin_vs_vehicle:'এটি কি পাসওয়ার্ড/PIN নাকি গাড়ি/বাইকের নম্বর?'};
  let btns=amb.options.map(o=>`<button class="option-btn" onclick="selectAndShowResult('${o.id}')">${o.label}</button>`).join('');
  div.innerHTML=`<div class="clarification-card">
    <i class="fas fa-question-circle" style="font-size:56px;color:var(--gold3)"></i>
    <h2 style="margin:14px 0 8px">"${escapeHtml(currentRawInput)}"</h2>
    <p>${labels[amb.type]||'এটি কোন ধরনের বিষয়?'}</p>
    <div class="option-buttons">${btns}</div>
  </div>`;
  div.style.display='block';
  if(ld)ld.style.display='none';
}

// ================================================================
// AUTO-DETECT CATEGORY
// ================================================================
function autoDetectCategory(input){
  const type=NumberUtils.detectType(input.trim());
  switch(type){
    case'date':     return'mulank';
    case'mobile':   return'mobile_number';
    case'vehicle':  return'car_number';
    case'price':    return'product_price';
    case'business': return'business_name';
    case'name':     return'personal_name';
    case'pin':      return'pin_code';
    case'bank':     return'bank_account';
    case'number':   return'name_number';
    default:        return'personal_name';
  }
}

// ================================================================
// SELECT AND SHOW RESULT
// ================================================================
function selectAndShowResult(catId){
  const nd=currentNumberData;
  if(!nd)return;
  const an=NumerologyDB.getNumberAnalysis(nd.rootNumber);
  if(!an){
    document.getElementById('resultContent').innerHTML=`<div class="result-card error-card"><i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--gold3)"></i><h2>বিশ্লেষণ পাওয়া যায়নি</h2><p>দুঃখিত।</p><a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a></div>`;
    return;
  }
  const n=nd.rootNumber, it=currentInputType;
  let h='';
  switch(catId){
    case'personal_name':  h=renderPersonalName(currentRawInput,n,an,it); break;
    case'baby_name':      h=renderBabyName(currentRawInput,n,an,it); break;
    case'marriage':       h=renderMarriage(currentRawInput,n,an,it); break;
    case'love':           h=renderLove(currentRawInput,n,an,it); break;
    case'family':         h=renderFamily(currentRawInput,n,an,it); break;
    case'journey_date':   h=renderJourneyDate(currentRawInput,n,an,it); break;
    case'new_home':       h=renderNewHome(currentRawInput,n,an,it); break;
    case'birthday':       h=renderBirthday(currentRawInput,n,an,it); break;
    case'business_name':  h=renderBusinessName(currentRawInput,n,an,it); break;
    case'partnership':    h=renderPartnership(currentRawInput,n,an,it); break;
    case'startup_name':   h=renderStartupName(currentRawInput,n,an,it); break;
    case'logo_color':     h=renderLogoColor(currentRawInput,n,an,it); break;
    case'launch_date':    h=renderLaunchDate(currentRawInput,n,an,it); break;
    case'product_price':  h=renderProductPrice(currentRawInput,n,an,it); break;
    case'car_number':     h=renderCarNumber(currentRawInput,n,an,it); break;
    case'bike_number':    h=renderBikeNumber(currentRawInput,n,an,it); break;
    case'mobile_number':  h=renderMobileNumber(currentRawInput,n,an,it); break;
    case'bank_account':   h=renderBankAccount(currentRawInput,n,an,it); break;
    case'pin_code':       h=renderPinCode(currentRawInput,n,an,it); break;
    case'stock_market':   h=renderStockMarket(currentRawInput,n,an,it); break;
    case'property':       h=renderProperty(currentRawInput,n,an,it); break;
    case'gold_silver':    h=renderGoldSilver(currentRawInput,n,an,it); break;
    case'mulank':         h=renderMulank(currentRawInput,n,an,it); break;
    case'name_number':    h=renderNameNumber(currentRawInput,n,an,it); break;
    default:              h=renderPersonalName(currentRawInput,n,an,it);
  }
  const div=document.getElementById('resultContent');
  div.innerHTML=h;
  div.style.display='block';
  const ld=document.getElementById('loading');
  if(ld)ld.style.display='none';
  div.scrollIntoView({behavior:'smooth',block:'start'});
}

// ================================================================
// UTILITIES
// ================================================================
function copyResult(){
  const t=document.getElementById('resultContent')?.innerText||'';
  if(t)navigator.clipboard.writeText(t).then(()=>alert('✅ ফলাফল কপি হয়েছে!')).catch(()=>{});
}
function shareResult(){
  const t=document.getElementById('resultContent')?.innerText||'';
  if(navigator.share&&t)navigator.share({title:'MyAstrology সংখ্যা জ্যোতিষ',text:t.substring(0,500),url:window.location.href});
  else copyResult();
}

// ================================================================
// MULTI-INPUT
// ================================================================
function isMultiInput(input){
  if(!input)return false;
  const has=/[\+\&\|]|(\s+এবং\s+)|(\s+and\s+)/i.test(input);
  if(!has)return false;
  const parts=input.split(/[\+\&\|]|\s+(?:এবং|and)\s+/i).filter(p=>p.trim().length>0);
  return parts.length>=2;
}

function parseMulti(input){
  const parts=input.split(/[\+\&\|]|\s+(?:এবং|and)\s+/i).filter(p=>p.trim().length>0);
  const r=[];
  for(const p of parts){
    const t=p.trim();
    const nd=NumberUtils.extractNumber(t);
    if(nd&&nd.rootNumber)r.push({raw:t,number:nd.rootNumber});
  }
  return r;
}

function renderMultiResult(input,items,numbers){
  const rd=CompatibilityCore.prepareRenderData(input,items,numbers);
  if(!rd)return`<div class="result-card error-card"><h2>ক্ষমা করবেন!</h2><p>সামঞ্জস্য বিশ্লেষণের জন্য ২টি উপাদান প্রয়োজন।</p><a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a></div>`;
  return CompatibilityRenderer.render(rd)+`<div style="margin-top:16px;text-align:center"><a href="numerology.html" class="back-btn"><i class="fas fa-arrow-left"></i> নতুন অনুসন্ধান</a></div>`;
}

// ================================================================
// DEEP NUMEROLOGY HELPER FUNCTIONS — দার্শনিক ও সাহিত্যিক ভাষায়
// শাস্ত্রীয় নিয়ম মেনে বিস্তারিত বিশ্লেষণ
// ================================================================

// ── গ্রহের দার্শনিক পরিচয় ──
function getPlanetPhilosophy(n) {
    const d = {
        1: `সূর্য — মহাজাগতিক আলোকের উৎস, নেতৃত্বের অধিদেবতা। বৈদিক শাস্ত্রে সূর্য হলেন "আত্মকারক" — আত্মার প্রতীক। যে মানুষের জীবনে সূর্যের প্রাধান্য, সে শুধু নিজে আলো বহন করে না, অন্যকেও আলোকিত করে।`,
        2: `চন্দ্র — মনের অধিপতি, অনুভূতির সমুদ্র। বৈদিক জ্যোতিষে চন্দ্র "মনকারক" — মনের প্রতীক। চন্দ্রের মানুষ জলের মতো — প্রতিটি পাত্রে নিজেকে ঢালতে পারেন, প্রতিটি আবেগকে স্পর্শ করতে পারেন।`,
        3: `বৃহস্পতি — জ্ঞানের দেবতা, গুরুর গুরু। সংস্কৃতে "গুরু" অর্থ অন্ধকার দূরকারী। বৃহস্পতি মানুষকে শুধু বিদ্যা দেন না — জ্ঞানের আলোয় জীবনকে অর্থময় করে তোলেন।`,
        4: `রাহু — মায়ার অধিপতি, রহস্যের ছায়া। রাহু হলেন সেই শক্তি যা স্থিতাবস্থাকে চ্যালেঞ্জ করে। রাহুর মানুষ পৃথিবীকে নতুন চোখে দেখে — সমাজের প্রচলিত পথে নয়, নিজের পথে হাঁটে।`,
        5: `বুধ — বুদ্ধির দেবতা, বাণিজ্যের পৃষ্ঠপোষক। বুধ হলেন দেবতা ও মানুষের মধ্যে দূত। বুধের মানুষ শব্দে জাদু করে — তার কথায় মানুষ মুগ্ধ হয়, সিদ্ধান্ত পরিবর্তন করে।`,
        6: `শুক্র — সৌন্দর্যের দেবতা, প্রেমের অধিদেবতা। শুক্র শুধু দৈহিক সৌন্দর্য নন — তিনি জীবনের সমস্ত কলা ও রসের প্রতীক। শুক্রের মানুষ পৃথিবীকে একটি শিল্পকর্ম হিসেবে দেখে।`,
        7: `কেতু — মোক্ষের পথপ্রদর্শক, আধ্যাত্মিকতার ধ্বজা। কেতু হলেন সেই শক্তি যা মানুষকে মায়ার বাইরে নিয়ে যায়। কেতুর মানুষ পৃথিবীতে থেকেও পৃথিবীর নন — তাঁর দৃষ্টি সর্বদা অনন্তে।`,
        8: `শনি — কর্মের দেবতা, ন্যায়বিচারের প্রতীক। শনি হলেন মহাজগতের নিরপেক্ষ বিচারক — যা বপন করেছ, তাই কাটবে। শনির মানুষ জীবনের কঠিন বিদ্যালয়ে শিক্ষিত হয়, তাই তাদের অর্জন অমূল্য।`,
        9: `মঙ্গল — শক্তির দেবতা, সংগ্রামের প্রতীক। মঙ্গল হলেন সেই অগ্নিশক্তি যা অসম্ভবকে সম্ভব করে। মঙ্গলের মানুষ ভয়কে জানে না — প্রতিটি বাধাকে সে একটি সুযোগ হিসেবে দেখে।`
    };
    return d[n] || `এই গ্রহের শক্তি জীবনকে বিশেষভাবে পরিচালিত করে।`;
}

// ── মোবাইল নম্বরের গভীর বিশ্লেষণ ──
function getMobileDeepAnalysis(n) {
    const d = {
        1: `সূর্যের আলোয় উদ্ভাসিত এই মোবাইল নম্বর আপনার যোগাযোগের জগতকে নেতৃত্বের শক্তিতে পরিপূর্ণ করে। এই নম্বর থেকে যখন আপনি কথা বলেন, আপনার কণ্ঠে এক অদৃশ্য কর্তৃত্ব থাকে — মানুষ মনোযোগ দেয়, অনুসরণ করে। সূর্যের সংখ্যায় আপনার প্রথম কলটি সর্বদা স্মরণীয় হয়। ব্যবসায়িক আলোচনা, গুরুত্বপূর্ণ সিদ্ধান্ত ও নেতৃত্বমূলক যোগাযোগে এই নম্বর বিশেষ শক্তি দেয়।`,
        2: `চন্দ্রের কোমল আলোয় আবৃত এই নম্বর আপনার যোগাযোগকে আবেগের গভীরতায় সমৃদ্ধ করে। এই নম্বরে কথোপকথন সম্পর্কের সূক্ষ্ম তার স্পর্শ করে — মানুষ আপনার কথায় সান্ত্বনা পায়, অনুভব করে যে আপনি সত্যিই তাদের কথা শুনছেন। পারিবারিক বন্ধন, বন্ধুত্ব ও মানবিক সম্পর্কের ক্ষেত্রে এই নম্বর অনন্য ফলদায়ক।`,
        3: `বৃহস্পতির জ্ঞানের আলোয় এই নম্বর আপনার প্রতিটি কথোপকথনকে জ্ঞানের বৈঠকে পরিণত করে। এই নম্বর থেকে যে পরামর্শ যায়, তা মানুষ বিশ্বাস করে। শিক্ষকতা, পরামর্শ, উপদেষ্টা কাজ ও আধ্যাত্মিক কথোপকথনে এই নম্বর বিশেষভাবে শুভ। মানুষ স্বতঃস্ফূর্তভাবে আপনার কাছে পথ চাইতে আসে।`,
        4: `রাহুর রহস্যময় শক্তিতে এই নম্বর প্রযুক্তি ও উদ্ভাবনের ক্ষেত্রে অসাধারণ কার্যকর। আন্তর্জাতিক যোগাযোগ, বিদেশী সম্পর্ক ও অপ্রচলিত ব্যবসায়িক আলোচনায় এই নম্বর বিশেষ ফল দেয়। তবে সন্ধ্যার পর গুরুত্বপূর্ণ কথোপকথন এড়িয়ে চলুন — রাহু রাতে আরও শক্তিশালী হয়।`,
        5: `বুধের বুদ্ধির ছোঁয়ায় এই নম্বর আপনার কথাকে যাদুদণ্ডে পরিণত করে। বিক্রয়, বিপণন, আলোচনা ও চুক্তি সম্পাদনে এই নম্বর অতুলনীয়। এই নম্বর থেকে যে প্রস্তাব যায়, তা সহজে প্রত্যাখ্যান করা যায় না। মিডিয়া, সাংবাদিকতা ও ব্যবসায়িক নেটওয়ার্কিংয়ে এই নম্বর রীতিমতো জাদুকরী।`,
        6: `শুক্রের সৌন্দর্যে এই নম্বর আপনার সমস্ত যোগাযোগে একটি মনোরম সুর যোগ করে। প্রেম, বন্ধুত্ব, শিল্পকলা ও সৌন্দর্য সংক্রান্ত আলোচনায় এই নম্বর অসাধারণ। এই নম্বরে আসা কল সর্বদা শুভ সংবাদ বহন করে। পেশাদার সম্পর্ক সুদৃঢ় করতে ও হৃদয়ের কথা বলতে এই নম্বর আপনার সেরা সঙ্গী।`,
        7: `কেতুর আধ্যাত্মিক শক্তিতে এই নম্বর স্বাভাবিক যোগাযোগের বাইরে এক গভীর আত্মিক সংযোগ তৈরি করে। গবেষণা, অন্বেষণ ও সত্যের সন্ধানী কথোপকথনে এই নম্বর বিশেষ। যারা আপনাকে এই নম্বরে ডাকে, তারা সাধারণত গভীর ও গুরুত্বপূর্ণ বিষয় নিয়ে কথা বলতে চায়।`,
        8: `শনির সুদীর্ঘ হাত এই মোবাইল নম্বরের প্রতিটি অঙ্কে তাঁর কর্মের দর্শন খোদাই করে দিয়েছে। সংখ্যা ৮ — যা শনির পবিত্র সংখ্যা — এই নম্বরে যখন বাজে, তখন বাতাসে একটি অদৃশ্য গাম্ভীর্য ছড়িয়ে পড়ে। শনির যোগাযোগ কখনো হালকা নয় — প্রতিটি কথা দায়িত্বের ভার বহন করে, প্রতিটি কল একটি কর্তব্যের স্মরণ। এই নম্বর দিয়ে যারা কথা বলেন, তারা শুধু কথা বলেন না — তারা প্রতিশ্রুতি দেন। ব্যবসা, প্রশাসন ও নেতৃত্বের দায়িত্বশীল কথোপকথনে এই নম্বর এক অমোঘ শক্তি।`,
        9: `মঙ্গলের সাহসী শিখায় এই নম্বর আপনার যোগাযোগে যোদ্ধার দৃঢ়তা এনে দেয়। কঠিন আলোচনা, চ্যালেঞ্জিং পরিস্থিতি ও প্রতিযোগিতামূলক যোগাযোগে এই নম্বর অপ্রতিরোধ্য। এই নম্বরে আসা কল সাধারণত দ্রুত সিদ্ধান্ত ও সাহসী পদক্ষেপের ডাক দেয়।`
    };
    return d[n] || `এই নম্বরের গ্রহীয় শক্তি যোগাযোগকে বিশেষভাবে প্রভাবিত করে।`;
}

// ── মোবাইল ও ক্যারিয়ার — বিস্তারিত ──
function getMobileCareerDeep(n) {
    const d = {
        1: `সূর্যের শক্তিতে এই নম্বর আপনার পেশাদার পরিচয়কে আরও উজ্জ্বল করে। রাজনীতি, প্রশাসন, উদ্যোক্তা ও ব্যবস্থাপনার উচ্চ পদে এই নম্বর থেকে করা কল বিশেষ প্রভাব ফেলে। যখন আপনি এই নম্বর থেকে কোনো সিদ্ধান্তের কথা জানান — মানুষ মেনে নেয়, কারণ সূর্যের কর্তৃত্বে কথা বলা হচ্ছে।`,
        2: `চন্দ্রের কোমল শক্তিতে এই নম্বর সৃজনশীল পেশায় বিশেষ কার্যকর। শিল্পকলা, সাহিত্য, কাউন্সেলিং, মানবসম্পদ ব্যবস্থাপনা ও সামাজিক কাজে এই নম্বর থেকে যোগাযোগ করলে আপনার সহানুভূতিশীল ভাবমূর্তি আরও শক্তিশালী হয়।`,
        3: `বৃহস্পতির জ্ঞানের প্রভাবে শিক্ষা, আইন, প্রকাশনা, ধর্মীয় সংস্থা ও পরামর্শ পেশায় এই নম্বর রীতিমতো আশীর্বাদ। আপনার পেশাদার যোগাযোগে একটি বিশ্বাসযোগ্যতা স্বাভাবিকভাবে আসে — মানুষ আপনাকে বিশেষজ্ঞ হিসেবে দেখে।`,
        4: `রাহুর বৈচিত্র্যময় শক্তিতে প্রযুক্তি, গবেষণা, আন্তর্জাতিক ব্যবসা ও অপ্রচলিত পেশায় এই নম্বর বিশেষ সুযোগ আনে। এই নম্বর থেকে হওয়া যোগাযোগ প্রায়ই অপ্রত্যাশিত সুযোগের দরজা খুলে দেয়।`,
        5: `বুধের বাণিজ্যিক প্রতিভায় এই নম্বর বিক্রয়, মার্কেটিং, মিডিয়া, প্রকাশনা ও যোগাযোগ শিল্পে অসাধারণ ফলপ্রসূ। এই নম্বর থেকে করা প্রতিটি ব্যবসায়িক কল একটি সম্ভাব্য চুক্তি বহন করে।`,
        6: `শুক্রের লাবণ্যে বিনোদন, ফ্যাশন, হোটেল, বিউটি ইন্ডাস্ট্রি, ইভেন্ট ম্যানেজমেন্ট ও শিল্পকলার পেশায় এই নম্বর এক বিশেষ আকর্ষণ তৈরি করে। ক্লায়েন্ট সম্পর্ক উষ্ণ করতে এই নম্বর অতুলনীয়।`,
        7: `কেতুর গভীরতায় গবেষণা, বিজ্ঞান, দর্শন, আধ্যাত্মিক পরামর্শ ও লেখালেখির পেশায় এই নম্বর থেকে হওয়া যোগাযোগ বিশেষ মর্যাদা পায়। আপনার কথায় একটি অন্তর্দৃষ্টির গভীরতা থাকে।`,
        8: `শনির কঠোর কিন্তু ন্যায্য দৃষ্টিতে এই নম্বর প্রশাসন, আইন, নির্মাণ শিল্প, রিয়েল এস্টেট ও ব্যবস্থাপনায় এক অপ্রতিদ্বন্দ্বী শক্তি হিসেবে কাজ করে। এই নম্বর থেকে যে নির্দেশ আসে — তা পালিত হয়। যে চুক্তি হয় — তা টেকসই হয়। শনির নম্বরে কথা হালকা হয় না — প্রতিটি শব্দে দায়িত্ব থাকে। কর্পোরেট নেতৃত্ব, উচ্চপদস্থ প্রশাসন ও আইনি ক্ষেত্রে এই নম্বর আপনার পেশাদার ভাবমূর্তিকে এক অনন্য মর্যাদা দেয়।`,
        9: `মঙ্গলের যোদ্ধা চেতনায় সামরিক, পুলিশ, খেলাধুলা, ফিটনেস, নির্মাণ ও প্রতিযোগিতামূলক পেশায় এই নম্বর বিজয়ের পথ খুলে দেয়। সংকটকালীন যোগাযোগে এই নম্বর বিশেষভাবে কার্যকর।`
    };
    return d[n] || `এই নম্বর পেশাদার জীবনে বিশেষ প্রভাব ফেলে।`;
}

// ── মোবাইল ও সম্পর্ক — গভীর বিশ্লেষণ ──
function getMobileRelationDeep(n) {
    const d = {
        1: `সূর্যের উজ্জ্বলতায় এই নম্বর পেশাদার সম্পর্ক ও সামাজিক নেটওয়ার্ককে বিশেষভাবে মজবুত করে। তবে ব্যক্তিগত সম্পর্কে কখনো কখনো কর্তৃত্বের ভার হালকা করুন — সূর্য যেন উত্তাপে পোড়ায় না, আলোয় উষ্ণ রাখে।`,
        2: `চন্দ্রের আবেগময় শক্তিতে এই নম্বর পারিবারিক বন্ধন, বন্ধুত্ব ও রোমান্টিক সম্পর্কে এক বিশেষ উষ্ণতা আনে। পূর্ণিমার রাতে এই নম্বর থেকে ফোন করলে সম্পর্ক আরও গভীর হয়।`,
        3: `বৃহস্পতির জ্ঞানময় সম্পর্কে এই নম্বর গুরু-শিষ্য, পরামর্শদাতা-গ্রাহক ও বুদ্ধিবৃত্তিক সম্পর্কে অসাধারণ। মানুষ আপনার পরামর্শের জন্য অপেক্ষা করে।`,
        4: `রাহুর অপ্রচলিত শক্তিতে এই নম্বর অনলাইন সম্পর্ক, আন্তর্জাতিক বন্ধুত্ব ও ভিন্ন সংস্কৃতির মানুষের সাথে যোগাযোগে বিশেষ ফলপ্রসূ।`,
        5: `বুধের সক্রিয় শক্তিতে এই নম্বর সমস্ত ধরনের সম্পর্ক তৈরি ও বজায় রাখতে অসাধারণ। আপনার সামাজিক বৃত্ত স্বাভাবিকভাবে বড় হয়।`,
        6: `শুক্রের প্রেমময় শক্তিতে এই নম্বর রোমান্টিক সম্পর্ক ও গভীর বন্ধুত্বে বিশেষভাবে কার্যকর। এই নম্বর থেকে যে ভালোবাসার বার্তা যায় — তা হৃদয় স্পর্শ করে।`,
        7: `কেতুর আধ্যাত্মিক শক্তিতে এই নম্বর গভীর আত্মিক সম্পর্ক ও আধ্যাত্মিক বন্ধনে বিশেষ। যারা সত্যিকারের বন্ধু — তারাই এই নম্বরে থাকে।`,
        8: `শনির ন্যায়পরায়ণ শক্তিতে এই নম্বর দীর্ঘস্থায়ী ও বিশ্বস্ত সম্পর্ক গড়ে তোলে। শনি কখনো মিথ্যা সম্পর্ক টিকিয়ে রাখেন না — এই নম্বরে যারা থাকে, তারা সত্যিকারের বিশ্বস্ত। পেশাদার সম্পর্কে এই নম্বর এক অটল বিশ্বাসযোগ্যতা তৈরি করে। ব্যবসায়িক অংশীদার, উপদেষ্টা ও দীর্ঘমেয়াদী ক্লায়েন্টরা এই নম্বরের প্রতি বিশেষ শ্রদ্ধাশীল থাকেন। তবে ব্যক্তিগত সম্পর্কে সময় দিতে ভুলবেন না — শনির কঠোরতা যেন প্রিয়জনের সাথে দূরত্ব না তৈরি করে।`,
        9: `মঙ্গলের সাহসী শক্তিতে এই নম্বর জোরালো বন্ধুত্ব ও দৃঢ় পেশাদার সম্পর্কে বিশেষ। যারা এই নম্বরে ফোন করে — তারা জানে আপনি সংকটে পাশে থাকবেন।`
    };
    return d[n] || `এই নম্বর সম্পর্কে ইতিবাচক প্রভাব ফেলে।`;
}

// ── মোবাইল প্রতিকার — শাস্ত্রীয় মন্ত্র ও বিধান ──
function getMobileRemedyDeep(n, data) {
    const mantras = {
        1: 'ওঁ ঘৃণি সূর্যায় নমঃ',
        2: 'ওঁ শ্রাং শ্রীং শ্রৌঁ সঃ চন্দ্রায় নমঃ',
        3: 'ওঁ গুং গ্রহপতয়ে নমঃ',
        4: 'ওঁ রাং রাহবে নমঃ',
        5: 'ওঁ বুঁ বুধায় নমঃ',
        6: 'ওঁ দ্রাং দ্রীং দ্রৌঁ সঃ শুক্রায় নমঃ',
        7: 'ওঁ কেং কেতবে নমঃ',
        8: 'ওঁ প্রাং প্রীং প্রৌঁ সঃ শনৈশ্চরায় নমঃ',
        9: 'ওঁ ক্রাং ক্রীং ক্রৌঁ সঃ ভৌমায় নমঃ'
    };
    const remedies = {
        1: `প্রতিদিন সূর্যোদয়ের সময় এই নম্বরটি হাতে রেখে গায়ত্রী মন্ত্র জপ করুন। রবিবার প্রথম কলটি ঈশ্বরকে স্মরণ করে করুন। লাল বা সোনালি রঙের ফোন কভার ব্যবহার করুন। ফোনের ওয়ালপেপারে সূর্যের ছবি রাখুন।`,
        2: `সোমবার সন্ধ্যায় এই নম্বর থেকে প্রিয়জনকে ফোন করুন। সাদা বা রূপালি কভার ব্যবহার করুন। পূর্ণিমার রাতে গুরুত্বপূর্ণ কল করবেন না। ফোনের পাশে চাঁদের শুভ্র আলোর ওয়ালপেপার রাখুন।`,
        3: `বৃহস্পতিবার সকালে এই নম্বর থেকে গুরুত্বপূর্ণ আলোচনা করুন। হলুদ বা সোনালি কভার ব্যবহার করুন। ফোনে বৃহস্পতি মন্ত্র সংরক্ষণ করুন এবং সকালে পাঠ করুন।`,
        4: `শনিবার দুপুরের পর গুরুত্বপূর্ণ কল করুন। নীল বা ধূসর কভার ব্যবহার করুন। গণেশ মন্ত্র জপ করে কল করলে বাধা কমে।`,
        5: `বুধবার দুপুরে গুরুত্বপূর্ণ ব্যবসায়িক কল করুন। সবুজ বা পান্নার রঙের কভার ব্যবহার করুন। ফোনে বুধ যন্ত্র সংরক্ষণ করুন।`,
        6: `শুক্রবার সন্ধ্যায় এই নম্বর থেকে কল করলে বিশেষ ফল পাবেন। গোলাপি বা সাদা কভার ব্যবহার করুন। ফোনে সুন্দর প্রকৃতির ওয়ালপেপার রাখুন।`,
        7: `রবিবার ভোরে গুরুত্বপূর্ণ কল করুন। বাদামি বা ক্রিম রঙের কভার ব্যবহার করুন। গণেশের ছবি ফোনে রাখুন।`,
        8: `শনিবার সকালে গুরুত্বপূর্ণ ব্যবসায়িক কল করুন — শনির নিজের দিনে তাঁর শক্তি সর্বোচ্চ। কালো বা গাঢ় নীল রঙের কভার ব্যবহার করুন — শনির প্রিয় রং। ফোন রক্ষা করতে প্রতি শনিবার হনুমান চালিসা পাঠ করুন। নীলা বা নীলামণি পাথর ফোনের কভারে যুক্ত করতে পারেন। মন্ত্র: <strong>"${mantras[8]}"</strong> — ১০৮ বার জপ করলে শনির প্রভাব শুভ হয়।`,
        9: `মঙ্গলবার সকালে গুরুত্বপূর্ণ কল করুন। লাল বা কমলা কভার ব্যবহার করুন। হনুমান চালিসা পাঠ করে ফোন শুরু করুন।`
    };
    const mantra = mantras[n];
    const remedy = remedies[n];
    return `${remedy} <br><br><strong>গ্রহ মন্ত্র:</strong> <em>"${mantra}"</em> — প্রতিদিন সকালে ১০৮ বার জপ করলে ${data.planet}-এর আশীর্বাদ লাভ হয়।`;
}

// ── নামাংক — গভীর বিশ্লেষণ ──
function getNamankDeep(n) {
    const d = {
        1: `সূর্যের আলোয় উদ্ভাসিত এই নামটি তার ধারণকারীকে জীবনের মঞ্চে একটি বিশেষ আসন দেয়। পিথাগোরাস বলেছিলেন, "সংখ্যা জগতের শাসক।" আর এই নামে সূর্যের সংখ্যা ১ — শাসকের সংখ্যা। এই নামটি মানুষের মুখে মুখে উচ্চারিত হলে একটি বিশেষ শক্তি বায়ুতে ছড়ায় — নেতৃত্বের শক্তি, আলোর শক্তি।`,
        2: `চন্দ্রের জোয়ারের মতো এই নামটি মানুষের আবেগের গভীরে প্রবেশ করে। সংখ্যা ২ — সহযোগিতার সংখ্যা, ভালোবাসার সংখ্যা। এই নামটি শুনলে মানুষ স্বস্তি অনুভব করে, বিশ্বাস করে।`,
        3: `বৃহস্পতির জ্ঞানের ভাণ্ডার এই নামে নিহিত। সংখ্যা ৩ — ত্রিভুজের মতো সুদৃঢ়, ত্রিমাত্রিক সত্যের প্রতীক। এই নামটি এমন এক কম্পন তৈরি করে যা জ্ঞান, প্রজ্ঞা ও আশাবাদকে আহ্বান করে।`,
        4: `রাহুর রহস্যময় শক্তি এই নামে এক অনন্য বৈশিষ্ট্য দিয়েছে। সংখ্যা ৪ — স্থিরতার সংখ্যা, চার দিকের প্রতীক। এই নামটি প্রচলিত ধারার বাইরে এক নিজস্ব পথ তৈরি করে।`,
        5: `বুধের চটপটে শক্তি এই নামে এক অসাধারণ গতিশীলতা এনেছে। সংখ্যা ৫ — পাঁচ ইন্দ্রিয়ের প্রতীক, পৃথিবীর তাৎক্ষণিকতার প্রতীক। এই নামটি যোগাযোগের জাদু বহন করে।`,
        6: `শুক্রের সৌন্দর্যের ছোঁয়ায় এই নামটি সমৃদ্ধ। সংখ্যা ৬ — পরিপূর্ণতার সংখ্যা, সৌন্দর্যের প্রতীক। এই নামটি মানুষের হৃদয়ে একটি বিশেষ উষ্ণতা তৈরি করে।`,
        7: `কেতুর আধ্যাত্মিক আলোয় এই নামটি সমুজ্জ্বল। সংখ্যা ৭ — পবিত্রতার সংখ্যা, সপ্তর্ষির সংখ্যা। এই নামটি গভীরতা ও রহস্যের প্রতিনিধি।`,
        8: `শনির কর্মের দর্শনে এই নামটি গড়া। সংখ্যা ৮ — অসীমতার প্রতীক (৮ শুইয়ে দিলে ∞ হয়), কর্মফলের সংখ্যা। এই নামটি সময়ের সাথে আরও শক্তিশালী হয়।`,
        9: `মঙ্গলের যোদ্ধার চেতনায় এই নামটি অসাধারণ। সংখ্যা ৯ — পূর্ণতার সংখ্যা, সমস্ত সংখ্যার মধ্যে সবচেয়ে শক্তিশালী। এই নামটি সাহস ও উদ্যমের প্রতীক।`
    };
    return d[n] || `এই নামে বিশেষ সংখ্যার শক্তি নিহিত।`;
}

// ── ব্যক্তিত্ব বিশ্লেষণ — দার্শনিক ভাষায় ──
function getPersonalDeep(n, data) {
    const d = {
        1: `আপনি জগতের সেই বিরল মানুষদের একজন যারা আলো খোঁজেন না — আলো তৈরি করেন। সূর্যের মতো আপনি নিজে জ্বলে অন্যকে আলোকিত করেন। আত্মবিশ্বাস আপনার সহজাত বর্ম — সংকটে আপনি যেখানে দাঁড়ান, সেখান থেকে পিছু হাঁটেন না। সৃজনশীলতা আপনার প্রাণের ভাষা — আপনি সমস্যার মধ্যেও সম্ভাবনা দেখেন। তবে মনে রাখবেন, সূর্য একা থাকলে তার আলো মূল্যহীন — পৃথিবীকে উষ্ণ করতেই তার সার্থকতা। অহংকারকে আত্মবিশ্বাস থেকে আলাদা রাখুন।`,
        2: `আপনি সেই বিরল মানুষ যারা অন্যের ব্যথা নিজের মনে অনুভব করতে পারেন। চাঁদ যেমন নিজে আলো তৈরি করে না, কিন্তু সূর্যের আলোকে পৃথিবীতে নিয়ে আসে — আপনিও তেমনই। আপনার উপস্থিতিতে মানুষ স্বস্তি পায়, কারণ আপনি শোনার শিল্প জানেন। আবেগের গভীরতা আপনার শক্তি, কিন্তু এই একই গভীরতা কখনো কখনো আপনাকে অস্থির করে। মানসিক ভারসাম্য বজায় রাখুন।`,
        3: `আপনি বৃহস্পতির আলোয় জন্মানো সেই বিরল আত্মা যারা জ্ঞানকে শুধু সংগ্রহ করেন না — বিতরণ করেন। "গুরু" শব্দের অর্থ অন্ধকার দূরকারী — আপনি জীবনের সেই গুরু যার উপস্থিতিতে মানুষ পথ খুঁজে পায়। আশাবাদ আপনার সবচেয়ে বড় উপহার — আপনি যখন বলেন "হবে", মানুষ বিশ্বাস করে।`,
        4: `আপনি সেই রহস্যময় পথিক যে প্রচলিত পথে হাঁটে না — নিজের পথ নিজে তৈরি করে। রাহুর শক্তি আপনাকে দিয়েছে এক অনন্য দৃষ্টিভঙ্গি — যেখানে অন্যরা দেয়াল দেখে, আপনি দরজা দেখেন। উদ্ভাবনী চিন্তা আপনার সবচেয়ে বড় সম্পদ। তবে স্থিরতা অর্জন করা জরুরি — রাহুর অস্থিরতাকে জয় করতে পারলেই আপনি অপরাজেয়।`,
        5: `আপনি বুধের মতো — দ্রুত, বুদ্ধিমান ও সর্বত্র বিচরণশীল। শব্দ আপনার হাতিয়ার, কথা আপনার শিল্প। যেকোনো পরিস্থিতিতে সঠিক কথা বলার ক্ষমতা আপনার বিশেষ দান। তবে গতির মধ্যে কখনো কখনো থামুন — কারণ জীবনের গভীরতম সত্যগুলো নীরবতায় পাওয়া যায়।`,
        6: `শুক্রের সৌন্দর্যে আপনি পৃথিবীকে একটি শিল্পকর্ম হিসেবে দেখেন। আপনার চারপাশে সৌন্দর্য তৈরি করার এক অপূর্ব ক্ষমতা আছে — আপনি যেখানে থাকেন, সেখানে একটি বিশেষ পরিবেশ তৈরি হয়। প্রেম আপনার জীবনের কেন্দ্র — কিন্তু মনে রাখবেন, নিজেকে ভালোবাসা না শিখলে অন্যকে ভালোবাসা সম্ভব নয়।`,
        7: `আপনি কেতুর আলোয় এক আধ্যাত্মিক পথিক। পৃথিবীতে থেকেও পৃথিবীর নন — আপনার দৃষ্টি সর্বদা অনন্তের দিকে। একাকীত্ব আপনার দুর্বলতা নয় — এটি আপনার শক্তির উৎস। গভীর নীরবতায় আপনি যা আবিষ্কার করেন, তা হাজারো বইয়ে লেখা নেই।`,
        8: `শনির কঠোর বিদ্যালয়ে আপনার শিক্ষা। জীবন আপনাকে সহজ পথ দেয়নি — কিন্তু এই কঠিন পথই আপনাকে মহান করেছে। ধৈর্য আপনার সবচেয়ে শক্তিশালী অস্ত্র। যা আপনি অর্জন করেছেন — শ্রম, সংগ্রাম ও অধ্যবসায় দিয়ে — তা কেউ কেড়ে নিতে পারবে না। শনি ন্যায়বিচারী — দেরি করেন, কিন্তু বঞ্চিত করেন না।`,
        9: `মঙ্গলের যোদ্ধার চেতনায় আপনি জন্মেছেন। ভয় আপনার অভিধানে নেই — প্রতিটি বাধা আপনার কাছে একটি সুযোগ। সাহস আপনার সহজাত ধর্ম। কিন্তু মনে রাখবেন, সত্যিকারের যোদ্ধা শুধু যুদ্ধ জানে না — শান্তিও জানে। রাগকে শক্তিতে পরিণত করুন — বিনাশে নয়।`
    };
    return d[n] || `${data.planet} গ্রহের প্রভাবে আপনি অনন্য বৈশিষ্ট্যের অধিকারী।`;
}

// ── সামঞ্জস্য মিলন ভূমিকা ──
function getCompatibilityIntro(n1, n2, planet1, planet2, relation, score) {
    const relDesc = {
        'special-friend': `মহাজাগতিক মিত্রতা — দুটি গ্রহ যেন একই নক্ষত্রের দুই আলোকবিন্দু। ${planet1} ও ${planet2}-এর মিলন প্রকৃতির সবচেয়ে শুভ সমীকরণগুলোর একটি।`,
        'friend': `গ্রহীয় মিত্রতা — ${planet1} ও ${planet2} পরস্পরের শক্তিকে বাড়িয়ে তোলে। এই মিলনে একে অপরের দুর্বলতা পূরণ হয়, শক্তি দ্বিগুণ হয়।`,
        'neutral': `গ্রহীয় নিরপেক্ষতা — ${planet1} ও ${planet2}-এর মধ্যে না মিত্রতা, না শত্রুতা। সচেতন প্রচেষ্টায় এই সম্পর্ক শুভ করা সম্ভব।`,
        'enemy': `গ্রহীয় দ্বন্দ্ব — ${planet1} ও ${planet2} ভিন্ন দিকে টানে। কিন্তু বিপরীত মেরু আকর্ষণ করে — সঠিক বোঝাপড়ায় এই দ্বন্দ্বই শক্তিতে পরিণত হতে পারে।`,
        'special-enemy': `মহাগ্রহীয় দ্বন্দ্ব — ${planet1} ও ${planet2}-এর মধ্যে শাস্ত্রীয় বিরোধ। বিশেষ প্রতিকার ও সচেতনতায় এই সম্পর্ক পরিচালনা সম্ভব।`,
        'same': `একই গ্রহের শক্তি — ${planet1} ও ${planet1} একসাথে। একই শক্তির দ্বিগুণ প্রকাশ — একে অপরকে গভীরভাবে বোঝার সুযোগ।`
    };
    return relDesc[relation] || `${planet1} ও ${planet2}-এর মিলন বিচার।`;
}

// ── সংখ্যার দার্শনিক পরিচয় (মূলাংক/ভাগ্যাংক) ──
function getMulankDeep(n, data) {
    const d = {
        1: `মূলাংক ১ — সূর্যের সন্তান। সংখ্যাশাস্ত্রে ১ হলো সৃষ্টির প্রথম অঙ্ক — যার থেকে সমস্ত সংখ্যার উৎপত্তি। যেমন সূর্য ছাড়া পৃথিবীতে জীবন সম্ভব নয়, তেমনই ১ ছাড়া কোনো সংখ্যা সম্পূর্ণ নয়। আপনার জীবনে নেতৃত্ব একটি স্বাভাবিক ধর্ম — আপনাকে নেতৃত্ব খুঁজতে হয় না, নেতৃত্ব আপনাকে খোঁজে।`,
        2: `মূলাংক ২ — চন্দ্রের আলিঙ্গন। সংখ্যাশাস্ত্রে ২ হলো দ্বৈততার সংখ্যা — যিন ও ইয়াং, শিব ও শক্তি, আলো ও ছায়া। চন্দ্র শুধু আলো দেন না — জোয়ার-ভাটায় সমুদ্রকে নিয়ন্ত্রণ করেন। আপনার আবেগও সেই চাঁদের মতো — কখনো পূর্ণিমা, কখনো অমাবস্যা।`,
        3: `মূলাংক ৩ — বৃহস্পতির আশীর্বাদ। সংখ্যাশাস্ত্রে ৩ হলো ত্রিত্বের সংখ্যা — ব্রহ্মা-বিষ্ণু-মহেশ্বর, অতীত-বর্তমান-ভবিষ্যৎ, সত্য-শিব-সুন্দর। বৃহস্পতি হলেন দেবতাদের গুরু — আপনার মধ্যেও সেই গুরুত্বের বীজ রোপিত।`,
        4: `মূলাংক ৪ — রাহুর রহস্য। সংখ্যাশাস্ত্রে ৪ হলো স্থিরতার সংখ্যা — চার দিক, চার বেদ, চার যুগ। রাহু দৃশ্যমান নন, কিন্তু তাঁর প্রভাব অনুভব করা যায় — গ্রহণের মতো। আপনার শক্তিও সেই লুকানো প্রভাবের মতো।`,
        5: `মূলাংক ৫ — বুধের বরদান। সংখ্যাশাস্ত্রে ৫ হলো পরিবর্তনের সংখ্যা — পাঁচ মহাভূত, পাঁচ ইন্দ্রিয়, পাঁচ প্রাণ। বুধ হলেন গতির দেবতা — থামেন না, থামতে পারেন না। আপনার জীবনেও এই গতিশীলতা।`,
        6: `মূলাংক ৬ — শুক্রের বরদান। সংখ্যাশাস্ত্রে ৬ হলো পরিপূর্ণতার সংখ্যা — ষড়ঋতু, ষড়রস, ষড়দর্শন। শুক্র সমস্ত কলার অধিদেবতা — সংগীত, নৃত্য, চিত্রকলা, কবিতা। আপনার জীবনে এই সৌন্দর্যের ছোঁয়া আছে।`,
        7: `মূলাংক ৭ — কেতুর দীপ্তি। সংখ্যাশাস্ত্রে ৭ হলো পবিত্রতার সংখ্যা — সপ্তর্ষি, সপ্তসুর, সপ্তাহের সাত দিন। কেতু হলেন মোক্ষের পথপ্রদর্শক — যিনি মানুষকে সাংসারিক মায়া থেকে মুক্তির দিকে নিয়ে যান।`,
        8: `মূলাংক ৮ — শনির কর্মশালা। সংখ্যাশাস্ত্রে ৮ হলো অসীমতার সংখ্যা — ৮ শুইয়ে দিলে ∞ হয়। শনি সময়ের দেবতা, কর্মের দেবতা। যা বপন করেছ তাই কাটবে — এই নিয়মের নিরপেক্ষ বিচারক তিনি। মূলাংক ৮-এর মানুষ জীবনের কঠিন পরীক্ষায় উত্তীর্ণ হয়ে সত্যিকারের সোনায় পরিণত হয়।`,
        9: `মূলাংক ৯ — মঙ্গলের শৌর্য। সংখ্যাশাস্ত্রে ৯ হলো পূর্ণতার সংখ্যা — নবগ্রহ, নবরস, নবদুর্গা। ৯ সংখ্যাটি অদ্ভুত — যেকোনো সংখ্যায় ৯ যোগ করলে বা গুণ করলে আবার ৯ আসে। এই সংখ্যার মানুষ যা করে, তার প্রভাব সর্বত্র ছড়ায়।`
    };
    return d[n] || `এই মূলাংক আপনার জীবনকে বিশেষভাবে পরিচালিত করে।`;
}

// ── ব্যবসার নামের গভীর বিশ্লেষণ ──
function getBusinessNameDeep(n, data) {
    const d = {
        1: `নামের সংখ্যা ১ — সূর্যের আলোয় রাঙা এই ব্যবসায়িক নামটি বাজারে একটি বিশেষ কর্তৃত্ব নিয়ে আসে। গ্রাহকরা এই নামটি শুনলে নেতৃত্বের অনুভূতি পান। ব্র্যান্ড হিসেবে এই নামটি সহজে বাজারে শীর্ষ স্থান দখল করার ক্ষমতা রাখে। লাল ও সোনালি রঙে এই নামের লোগো করলে সূর্যের শক্তি দ্বিগুণ হয়।`,
        2: `নামের সংখ্যা ২ — চন্দ্রের আলোয় আবৃত এই ব্যবসায়িক নামটি গ্রাহকের মনে একটি বিশ্বাসযোগ্য স্থান তৈরি করে। জনমানসে এই নামটি দ্রুত প্রিয় হয়ে ওঠে। সেবামূলক ব্যবসায় এই নাম বিশেষভাবে শুভ।`,
        3: `নামের সংখ্যা ৩ — বৃহস্পতির জ্ঞানের ভাণ্ডার এই নামে। শিক্ষা, প্রশিক্ষণ, পরামর্শ ও প্রকাশনায় এই নাম রীতিমতো আশীর্বাদ। এই নামের ব্যবসা সময়ের সাথে একটি বিশ্বস্ত প্রতিষ্ঠানে পরিণত হয়।`,
        4: `নামের সংখ্যা ৪ — রাহুর উদ্ভাবনী শক্তি এই নামে। প্রযুক্তি, গবেষণা ও আন্তর্জাতিক ব্যবসায় এই নাম এক বিপ্লবী পরিচয় তৈরি করে। প্রচলিত ধারাকে চ্যালেঞ্জ করার সাহস এই নামে আছে।`,
        5: `নামের সংখ্যা ৫ — বুধের বাণিজ্যিক প্রতিভায় এই নাম বাজারে দ্রুত পরিচিতি পায়। যোগাযোগ, মিডিয়া ও ট্রেডিংয়ে এই নাম অপ্রতিদ্বন্দ্বী। ব্র্যান্ডের ভাষা স্মার্ট ও গতিশীল হয়।`,
        6: `নামের সংখ্যা ৬ — শুক্রের সৌন্দর্যে এই নাম ফ্যাশন, বিউটি ও বিনোদন শিল্পে রাণীর আসনে বসে। গ্রাহকরা এই নামের প্রতি স্বাভাবিকভাবে আকৃষ্ট হন।`,
        7: `নামের সংখ্যা ৭ — কেতুর গভীরতায় এই নাম গুণগত মানের প্রতীক হয়। গবেষণা, বিজ্ঞান ও আধ্যাত্মিক সেবায় এই নাম এক অনন্য বিশ্বাসযোগ্যতা অর্জন করে।`,
        8: `নামের সংখ্যা ৮ — শনির দৃঢ়তায় এই ব্যবসায়িক নামটি বাজারে এক অটল অবস্থান তৈরি করে। শনির ব্যবসা কখনো দ্রুত বড় হয় না, কিন্তু যখন বড় হয় — তা অজেয় হয়। নির্মাণ, রিয়েল এস্টেট, শিল্প ও ব্যবস্থাপনায় এই নাম দশকের পর দশক টিকে থাকার ক্ষমতা রাখে। গ্রাহকরা এই নামকে পেশাদারিত্ব ও বিশ্বাসযোগ্যতার প্রতীক হিসেবে দেখেন।`,
        9: `নামের সংখ্যা ৯ — মঙ্গলের শক্তিতে এই নাম প্রতিযোগিতামূলক বাজারে বজ্রের মতো আঘাত করে। স্পোর্টস, ডিফেন্স, নির্মাণ ও শক্তি শিল্পে এই নাম এক অপ্রতিরোধ্য শক্তি।`
    };
    return d[n] || `এই নামে বিশেষ ব্যবসায়িক শক্তি নিহিত।`;
}


// ================================================================
// MAIN — DOMContentLoaded
// ================================================================
document.addEventListener('DOMContentLoaded',function(){
  const query=getQueryParam('q');
  const catHint=getQueryParam('cat');
  if(!query){window.location.href='numerology.html';return;}

  currentRawInput=decodeURIComponent(query);
  currentInputType=detectInputType(currentRawInput);

  const div=document.getElementById('resultContent');
  const ld=document.getElementById('loading');

  // ── মাল্টি-ইনপুট ──
  if(isMultiInput(currentRawInput)){
    const items=parseMulti(currentRawInput);
    if(items.length>=2){
      const h=renderMultiResult(currentRawInput,items.map(i=>i.raw),items.map(i=>i.number));
      if(div){div.innerHTML=h;div.style.display='block';}
      if(ld)ld.style.display='none';
      return;
    }
  }

  // ── সিঙ্গেল ইনপুট ──
  currentNumberData=NumberUtils.extractNumber(currentRawInput);
  if(!currentNumberData||!currentNumberData.rootNumber){
    if(div){div.innerHTML=`<div class="result-card error-card"><i class="fas fa-exclamation-triangle" style="font-size:64px;color:#f5b800"></i><h2 style="color:#fff;margin:10px 0">ক্ষমা করবেন!</h2><p>"${escapeHtml(currentRawInput)}" — বিশ্লেষণযোগ্য তথ্য পাওয়া যায়নি।</p><a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a></div>`;div.style.display='block';}
    if(ld)ld.style.display='none';
    return;
  }

  // ★ CRITICAL FIX: তারিখ হলে মূলাংক (দিনের সংখ্যা) primary হিসেবে ব্যবহার করো
  // extractNumber() সব অঙ্ক যোগ করে ভাগ্যাংক দেয়, কিন্তু birthday/mulank-এ মূলাংক দরকার
  if(currentInputType==='date'){
    // bhagyank সংরক্ষণ করো (full date sum)
    currentNumberData.bhagyank=currentNumberData.rootNumber;
    // mulank বের করো (শুধু দিনের সংখ্যা)
    const ml=NumerologyDB.calculateMulank?NumerologyDB.calculateMulank(currentRawInput):null;
    if(ml&&ml>=1&&ml<=9){
      currentNumberData.mulank=ml;
      // mulank কে primary rootNumber করো
      currentNumberData.rootNumber=ml;
    } else {
      currentNumberData.mulank=currentNumberData.rootNumber;
    }
  }

  // catHint → সরাসরি
  if(catHint){selectAndShowResult(catHint);return;}

  // যুক্তিপূর্ণ → auto-detect
  if(NumberUtils.isMeaningful(currentRawInput)){
    // Ambiguity check — Point 5
    const amb=detectAmbiguity(currentRawInput);
    if(amb){if(ld)ld.style.display='none';showAmbiguityClarification(amb);return;}
    const cat=autoDetectCategory(currentRawInput);
    selectAndShowResult(cat);
    return;
  }

  // যুক্তিহীন → single category list (NOT dual — Point 2)
  if(ld)ld.style.display='none';
  showCategorySelection(false);
});
// ================================================================
// বৈদিক তথ্য ফাংশন (শেষের দিকে যোগ করুন)
// ================================================================
// 1. বৈদিক পরিচয় (গুছানো সংস্করণ)
function getVedicIdentity(number) {
    const data = NumerologyDB.getNumberAnalysis(number);
    if (!data) return '';
    
    const vedicData = {
        1: { sanskrit: "একম", vedicName: "সূর্য", element: "অগ্নি", guna: "সাত্ত্বিক", deity: "ভগবান সূর্য", mantra: "ওঁ ঘৃণি সূর্যায় নমঃ", bodyPart: "হৃদয়, চোখ", yoga: "সূর্য নমস্কার" },
        2: { sanskrit: "দ্বে", vedicName: "চন্দ্র", element: "জল", guna: "রাজসিক", deity: "ভগবান চন্দ্র", mantra: "ওঁ শ্রাং শ্রীং শ্রৌঁ সঃ চন্দ্রায় নমঃ", bodyPart: "মন, বুক", yoga: "চন্দ্র নমস্কার" },
        3: { sanskrit: "ত্রীণি", vedicName: "গুরু", element: "আকাশ", guna: "সাত্ত্বিক", deity: "বৃহস্পতি", mantra: "ওঁ গুং গ্রহপতয়ে নমঃ", bodyPart: "মস্তিষ্ক", yoga: "গুরু প্রণাম" },
        4: { sanskrit: "চত্বারি", vedicName: "রাহু", element: "বায়ু", guna: "তামসিক", deity: "রাহু", mantra: "ওঁ রাং রাহবে নমঃ", bodyPart: "পা, হাড়", yoga: "গভীর ধ্যান" },
        5: { sanskrit: "পঞ্চ", vedicName: "বুধ", element: "পৃথিবী", guna: "রাজসিক", deity: "বুধ", mantra: "ওঁ বুঁ বুধায় নমঃ", bodyPart: "হাত, স্নায়ু", yoga: "বজ্রাসন" },
        6: { sanskrit: "ষট্", vedicName: "শুক্র", element: "জল", guna: "রাজসিক", deity: "শুক্র", mantra: "ওঁ দ্রাং দ্রীং দ্রৌঁ সঃ শুক্রায় নমঃ", bodyPart: "মুখ, কিডনি", yoga: "উষ্ট্রাসন" },
        7: { sanskrit: "সপ্ত", vedicName: "কেতু", element: "আকাশ", guna: "সাত্ত্বিক", deity: "কেতু", mantra: "ওঁ কেং কেতবে নমঃ", bodyPart: "মেরুদণ্ড", yoga: "পদ্মাসন" },
        8: { sanskrit: "অষ্ট", vedicName: "শনি", element: "বায়ু", guna: "তামসিক", deity: "শনি", mantra: "ওঁ প্রাং প্রীং প্রৌঁ সঃ শনৈশ্চরায় নমঃ", bodyPart: "হাড়, দাঁত", yoga: "শবাসন" },
        9: { sanskrit: "নব", vedicName: "মঙ্গল", element: "অগ্নি", guna: "রাজসিক", deity: "মঙ্গল", mantra: "ওঁ ক্রাং ক্রীং ক্রৌঁ সঃ ভৌমায় নমঃ", bodyPart: "রক্ত, পেশী", yoga: "বীরভদ্রাসন" }
    };
    
    const v = vedicData[number] || {};
    
    // গুছানো ২-কলামের গ্রিড
    return `
        <div class="vedic-card">
            <h4><i class="fas fa-om"></i> বৈদিক পরিচয় — ${data.planet}</h4>
            <div class="vedic-grid-2col">
                <div><span class="vedic-label">🕉️ সংস্কৃত নাম</span> ${v.sanskrit || ''}</div>
                <div><span class="vedic-label">🌟 বৈদিক নাম</span> ${v.vedicName || ''}</div>
                <div><span class="vedic-label">🌿 তত্ত্ব</span> ${v.element || ''}</div>
                <div><span class="vedic-label">⚖️ প্রকৃতি</span> ${v.guna || ''}</div>
                <div><span class="vedic-label">🔱 দেবতা</span> ${v.deity || ''}</div>
                <div><span class="vedic-label">🕉️ মন্ত্র</span> ${v.mantra || ''}</div>
                <div><span class="vedic-label">💪 অঙ্গপ্রত্যঙ্গ</span> ${v.bodyPart || ''}</div>
                <div><span class="vedic-label">🧘 যোগাসন</span> ${v.yoga || ''}</div>
            </div>
        </div>
    `;
}

// 2. জীবনক্ষেত্র বিশ্লেষণ (স্বাস্থ্য, শিক্ষা, সম্পর্ক)
function getLifeAreaAnalysis(number) {
    const areas = {
        1: {
            health: "শক্তি ও জীবনীশক্তি অসীম। তবে হৃদরোগ ও রক্তচাপের ঝুঁকি আছে। নিয়মিত ব্যায়াম ও সূর্য নমস্কার করুন। খাবারে মিষ্টি জাতীয় পদ কম খান।",
            education: "নেতৃত্বগুণ বিকাশের জন্য প্রশাসন ও আইন শিক্ষা উত্তম। সৃজনশীলতাকে উৎসাহ দিন। বিদেশে পড়ার সুযোগ এলে গ্রহণ করুন।",
            relationship: "আপনি সম্পর্কে নেতৃত্ব দিতে চান। সঙ্গীকে ছাড় দিতে শিখুন। অহংকার পরিহার করুন। বন্ধু নির্বাচনে সচেতন হোন।"
        },
        2: {
            health: "মানসিক চাপ ও হজমের সমস্যা হতে পারে। নিয়মিত মেডিটেশন ও সঠিক খাদ্য গ্রহণ করুন। রাতে পর্যাপ্ত ঘুম জরুরি।",
            education: "সৃজনশীল ও মানবিক শিক্ষায় ভালো। শিল্পকলা, সাহিত্য, সঙ্গীতে দক্ষতা অর্জন করুন। শিক্ষাক্ষেত্রে সাফল্য আসবে।",
            relationship: "আপনি সম্পর্কে আবেগী ও সংবেদনশীল। সঙ্গীর যত্ন নিন, তবে নিজের জন্যও সময় রাখুন। পরিবারের সঙ্গে সময় কাটান।"
        },
        3: {
            health: "শ্বাসকষ্ট ও স্নায়বিক সমস্যার ঝুঁকি। যোগব্যায়াম ও প্রাণায়াম নিয়মিত করুন। ধূমপান ও মদ্যপান এড়িয়ে চলুন।",
            education: "শিক্ষাক্ষেত্রে অসাধারণ সাফল্য। আইন, দর্শন, ধর্মতত্ত্ব, শিক্ষকতায় দক্ষতা। জ্ঞান অর্জনে মনোযোগ দিন।",
            relationship: "আপনি সম্পর্কে আশাবাদী ও উৎসাহী। সঙ্গীকে অনুপ্রাণিত করুন, তবে অতিরিক্ত পরামর্শ দেবেন না। সন্তানের প্রতি যত্নশীল হোন।"
        },
        4: {
            health: "হজমের সমস্যা ও ত্বকের রোগ হতে পারে। নিয়মিত ব্যায়াম ও পরিষ্কার-পরিচ্ছন্নতা জরুরি। ভাত ও পানীয়তে সতর্ক হোন।",
            education: "প্রযুক্তি ও গবেষণায় ভালো। বিদেশে শিক্ষাগ্রহণ শুভ। নিয়মিত পড়ার অভ্যাস করুন। গণিতে দক্ষতা বাড়বে।",
            relationship: "আপনি সম্পর্কে গভীর ও বিশ্বস্ত। একবার বন্ধু হলে চিরকাল। ধৈর্য ধরুন। কারো সাথে দ্রুত সম্পর্ক গড়বেন না।"
        },
        5: {
            health: "স্নায়বিক সমস্যা ও ক্লান্তি হতে পারে। পর্যাপ্ত বিশ্রাম ও পুষ্টিকর খাবার খান। চা-কফি কম পান করুন।",
            education: "যোগাযোগ ও বাণিজ্য শিক্ষায় ভালো। মিডিয়া, মার্কেটিং, ব্যবসায় প্রশাসনে দক্ষ। ভাষা শিক্ষায় মনোযোগ দিন।",
            relationship: "আপনি সম্পর্কে স্বাধীনতা চান। সঙ্গীকেও স্বাধীনতা দিন। চঞ্চলতা নিয়ন্ত্রণ করুন। সম্পর্কে সৎ থাকুন।"
        },
        6: {
            health: "প্রেমের কারণে মানসিক চাপ। কিডনি ও ত্বকের যত্ন নিন। নিয়মিত ঘুম জরুরি। সপ্তাহে একদিন উপবাস করুন।",
            education: "শিল্পকলা, ফ্যাশন, নৃত্যে দক্ষ। সৌন্দর্যশাস্ত্র, সংগীতে উৎকর্ষ অর্জন করুন। বিদেশে শিক্ষার সুযোগ আসতে পারে।",
            relationship: "আপনি সম্পর্কে সবচেয়ে নিবেদিত। পরিবার আপনার কেন্দ্র। বিলাসিতায় মিতাচার করুন। প্রিয়জনকে সময় দিন।"
        },
        7: {
            health: "স্নায়বিক সমস্যা ও অনিদ্রার ঝুঁকি। ধ্যান, যোগ ও নিয়মিত হাঁটাহাঁটি করুন। সন্ধ্যার পর হালকা খাবার খান।",
            education: "গবেষণা, দর্শন, বিজ্ঞান ও আধ্যাত্মিক শিক্ষায় উৎকর্ষ। গভীর অধ্যয়ন করুন। বিদেশে পড়ার সুযোগ এলে গ্রহণ করুন।",
            relationship: "আপনি সম্পর্কে গভীর ও আধ্যাত্মিক। একাকীত্বের প্রয়োজন সঙ্গীকে বুঝিয়ে বলুন। সত্যিকারের বন্ধু অল্প হলেও যথেষ্ট।"
        },
        8: {
            health: "হাড় ও জয়েন্টের সমস্যা। নিয়মিত ব্যায়াম, ক্যালসিয়াম সমৃদ্ধ খাবার ও বিশ্রাম জরুরি। সপ্তাহে একদিন ম্যাসাজ করুন।",
            education: "ব্যবস্থাপনা, আইন, প্রশাসন শিক্ষায় সফল। দীর্ঘমেয়াদী লক্ষ্য নির্ধারণ করুন। ধৈর্য ধরে পড়াশোনা চালিয়ে যান।",
            relationship: "আপনি সম্পর্কে ধৈর্যশীল ও বিশ্বস্ত। কাজের চাপে সম্পর্কে দূরত্ব তৈরি করবেন না। পরিবারের সঙ্গে সময় কাটান।"
        },
        9: {
            health: "রক্তচাপ ও দুর্ঘটনার ঝুঁকি। রাগ নিয়ন্ত্রণ করুন। নিয়মিত ব্যায়াম ও যোগব্যায়াম করুন। লবণ কম খান।",
            education: "সামরিক, ক্রীড়া, প্রকৌশলে অসাধারণ। প্রতিযোগিতায় অগ্রগামী। সাহসী সিদ্ধান্ত নিন। শারীরিক শিক্ষায় মনোযোগ দিন।",
            relationship: "আপনি সম্পর্কে সাহসী ও রক্ষণশীল। সঙ্গীর পাশে থাকুন, কিন্তু রাগ নিয়ন্ত্রণ করুন। ঝগড়া এড়িয়ে চলুন।"
        }
    };
    
    const area = areas[number] || {};
    
    return `
        <div class="life-areas-card">
            <h4><i class="fas fa-chart-line"></i> জীবনক্ষেত্র বিশ্লেষণ</h4>
            <div class="life-areas-grid">
                <div class="life-area">
                    <i class="fas fa-heartbeat"></i>
                    <strong>স্বাস্থ্য</strong>
                    <p>${area.health || 'স্বাস্থ্যের দিকে বিশেষ নজর রাখুন। নিয়মিত ব্যায়াম ও সঠিক খাদ্যাভ্যাস জরুরি।'}</p>
                </div>
                <div class="life-area">
                    <i class="fas fa-graduation-cap"></i>
                    <strong>শিক্ষা ও ক্যারিয়ার</strong>
                    <p>${area.education || 'শিক্ষাক্ষেত্রে সাফল্যের সম্ভাবনা। নিজের দক্ষতা বিকাশে মনোযোগ দিন।'}</p>
                </div>
                <div class="life-area">
                    <i class="fas fa-heart"></i>
                    <strong>সম্পর্ক ও দাম্পত্য</strong>
                    <p>${area.relationship || 'সম্পর্কে বোঝাপড়া গুরুত্বপূর্ণ। সৎ যোগাযোগ বজায় রাখুন।'}</p>
                </div>
            </div>
        </div>
    `;
}
// 3. বিখ্যাত ব্যক্তিত্ব (একই সংখ্যার বিখ্যাত মানুষ)
function getFamousPersonalities(number) {
    const personalities = {
        1: ["স্বামী বিবেকানন্দ", "নেতাজি সুভাষচন্দ্র বসু", "মহাত্মা গান্ধী"],
        2: ["রবীন্দ্রনাথ ঠাকুর", "লতা মঙ্গেশকর", "মাদার টেরেসা"],
        3: ["ডঃ মুহম্মদ ইউনুস", "আলবার্ট আইনস্টাইন", "স্টিভ জবস"],
        4: ["সত্যজিৎ রায়", "আমর্ত্য সেন", "নিকোলা টেসলা"],
        5: ["বঙ্গবন্ধু শেখ মুজিবুর রহমান", "মার্ক জাকারবার্গ", "বারাক ওবামা"],
        6: ["কাজী নজরুল ইসলাম", "মেরিলিন মনরো", "লিওনার্দো দা ভিঞ্চি"],
        7: ["পরমহংস যোগানন্দ", "গৌতম বুদ্ধ", "আদি শঙ্করাচার্য"],
        8: ["শ্রী অরবিন্দ", "মাদার (শ্রী অরবিন্দ আশ্রম)", "মোহাম্মদ আলী"],
        9: ["ভগৎ সিং", "চে গেভারা", "নেপোলিয়ন বোনাপার্ট"]
    };
    
    const list = personalities[number] || [];
    if (list.length === 0) return '';
    
    return `
        <div class="famous-card">
            <h4><i class="fas fa-crown"></i> একই সংখ্যার বিখ্যাত ব্যক্তিত্ব</h4>
            <div class="famous-list">
                ${list.map(name => `<span class="famous-name">${name}</span>`).join('')}
            </div>
            <p class="famous-note">তাদের মতো আপনারও এই সংখ্যার গুণাবলী বিদ্যমান। তাদের জীবন থেকে অনুপ্রেরণা নিন।</p>
        </div>
    `;
}
// 4. শাস্ত্রীয় মন্ত্র (বাংলা ভাষায়)
function getVedicChants(number) {
    const chants = {
        1: "ওঁ ঘৃণি সূর্যায় নমঃ। ওঁ আদিত্যায় বিদ্মহে দিবাকরায় ধীমহি তন্নো সূর্যঃ প্রচোদয়াৎ।",
        2: "ওঁ শ্রাং শ্রীং শ্রৌঁ সঃ চন্দ্রায় নমঃ। দধিশঙ্খতুষারাভং ক্ষীরোদার্ণবসম্ভবম্। নমামি শশিনং সোমং শম্ভোর্মুকুটভূষণম্।।",
        3: "ওঁ গুং গ্রহপতয়ে নমঃ। দেবানাং চ ঋষীণাং চ গুরুং কাঞ্চনসন্নিভম্। বুদ্ধিভূতং ত্রিলোকেশং তং নমামি বৃহস্পতিম্।।",
        4: "ওঁ রাং রাহবে নমঃ। অর্ধকায়ং মহাবীর্যং চন্দ্রাদিত্যবিমর্দনম্। সিংহিকাগর্ভসম্ভূতং তং রাহুং প্রণমাম্যহম্।।",
        5: "ওঁ বুঁ বুধায় নমঃ। প্রিয়ঙ্গুকলিকাশ্যামং রূপেণাপ্রতিমং বুধম্। সৌম্যং সৌম্যগুণোপেতং তং বুধং প্রণমাম্যহম্।।",
        6: "ওঁ দ্রাং দ্রীং দ্রৌঁ সঃ শুক্রায় নমঃ। হিমকুন্দমৃণালাভং দৈত্যানাং পরমং গুরুম্। সর্বশাস্ত্রপ্রবক্তারং ভার্গবং প্রণমাম্যহম্।।",
        7: "ওঁ কেং কেতবে নমঃ। পলাশপুষ্পসংকাশং তারাগ্রহমস্তকম্। রৌদ্রং রৌদ্রাত্মকং ঘোরং তং কেতুং প্রণমাম্যহম্।।",
        8: "ওঁ প্রাং প্রীং প্রৌঁ সঃ শনৈশ্চরায় নমঃ। নীলাঞ্জনসমাভাসং রবিপুত্রং যমাগ্রজম্। ছায়ামার্তাণ্ডসম্ভূতং তং নমামি শনৈশ্চরম্।।",
        9: "ওঁ ক্রাং ক্রীং ক্রৌঁ সঃ ভৌমায় নমঃ। ধরণীগর্ভসম্ভূতং বিদ্যুৎকান্তিসমপ্রভম্। কুমারং শক্তিহস্তং চ মঙ্গলং প্রণমাম্যহম্।।"
    };
    
    const mantra = chants[number] || "ওঁ নমঃ শিবায়। সর্বগ্রহ শান্তি মন্ত্র।";
    
    return `
        <div class="mantra-card">
            <h4><i class="fas fa-pray"></i> শাস্ত্রীয় মন্ত্র</h4>
            <p class="mantra-text-bangla">${mantra}</p>
            <p class="mantra-note">প্রতিদিন সকালে স্নানের পর এই মন্ত্র ১০৮ বার জপ করলে গ্রহের আশীর্বাদ লাভ হয়। মন্ত্র জপের সময় মুখ পূর্ব দিকে রাখুন।</p>
        </div>
    `;
}

// ব্যবসার জন্য বিশেষ মন্ত্র (শুধুমাত্র মন্ত্র অংশ)
function getBusinessMantra(number, data) {
    const businessMantras = {
        1: "ওঁ ঘৃণি সূর্যায় নমঃ। ব্যবসায় সাফল্যের জন্য প্রতিদিন সূর্যোদয়ের সময় এই মন্ত্র ১০৮ বার জপ করুন। লাল ও সোনালি রঙের ব্যবহার ব্যবসায় উন্নতি আনে।",
        2: "ওঁ শ্রাং শ্রীং শ্রৌঁ সঃ চন্দ্রায় নমঃ। সোমবারে সাদা বস্ত্র দান করুন। রূপালি রঙের ব্যবহার গ্রাহক আকর্ষণ বাড়ায়।",
        3: "ওঁ গুং গ্রহপতয়ে নমঃ। বৃহস্পতিবারে হলুদ বস্ত্র দান করুন। শিক্ষা ও পরামর্শ সংক্রান্ত ব্যবসায় এই মন্ত্র বিশেষ ফলদায়ক।",
        4: "ওঁ রাং রাহবে নমঃ। শনিবারে নীল বস্ত্র দান করুন। প্রযুক্তি ও গবেষণা সংক্রান্ত ব্যবসায় এই মন্ত্র জপ করুন।",
        5: "ওঁ বুঁ বুধায় নমঃ। বুধবারে সবুজ বস্ত্র দান করুন। যোগাযোগ ও বাণিজ্য সংক্রান্ত ব্যবসায় এই মন্ত্র সাফল্য আনে।",
        6: "ওঁ দ্রাং দ্রীং দ্রৌঁ সঃ শুক্রায় নমঃ। শুক্রবারে সাদা ও গোলাপি বস্ত্র দান করুন। ফ্যাশন ও সৌন্দর্য সংক্রান্ত ব্যবসায় এই মন্ত্র শুভ।",
        7: "ওঁ কেং কেতবে নমঃ। রবিবার ভোরে ধ্যান করে এই মন্ত্র জপ করুন। গবেষণা ও আধ্যাত্মিক ব্যবসায় সাফল্য আসে।",
        8: "ওঁ প্রাং প্রীং প্রৌঁ সঃ শনৈশ্চরায় নমঃ। শনিবারে কালো তিল ও লোহার বস্তু দান করুন। শিল্প ও নির্মাণ ব্যবসায় এই মন্ত্র শুভ।",
        9: "ওঁ ক্রাং ক্রীং ক্রৌঁ সঃ ভৌমায় নমঃ। মঙ্গলবারে লাল বস্ত্র দান করুন। প্রতিযোগিতামূলক ব্যবসায় সাফল্যের জন্য এই মন্ত্র জপ করুন।"
    };
    
    const mantra = businessMantras[number] || "ওঁ নমঃ শিবায়। ব্যবসায় সাফল্যের জন্য প্রতিদিন এই মন্ত্র ১০৮ বার জপ করুন।";
    
    return `
        <div class="mantra-card">
            <h4><i class="fas fa-pray"></i> ব্যবসায়িক সাফল্যের মন্ত্র</h4>
            <p class="mantra-text-bangla">${mantra}</p>
            <p class="mantra-note">প্রতিদিন সকালে স্নানের পর এই মন্ত্র ১০৮ বার জপ করলে ব্যবসায় উন্নতি হয়।</p>
        </div>
    `;
}

// ব্যবসার জন্য বিখ্যাত কোম্পানি ও ব্যবসায়ী (ইংরেজি ভাষায়)
function getBusinessIcons(number) {
    const businessIcons = {
        1: ["Tata Group", "Ratan Tata", "Samsung"],
        2: ["Coca-Cola", "McDonald's", "Amazon"],
        3: ["Microsoft", "Bill Gates", "Google"],
        4: ["Tesla", "Elon Musk", "IBM"],
        5: ["Facebook", "Mark Zuckerberg", "Flipkart"],
        6: ["Apple", "Steve Jobs", "Louis Vuitton"],
        7: ["SpaceX", "IT Sector", "Research Lab"],
        8: ["Reliance", "Mukesh Ambani", "Berri"],
        9: ["Nike", "Adidas", "Ferrari"]
    };
    
    const list = businessIcons[number] || [];
    if (list.length === 0) return '';
    
    return `
        <div class="famous-card">
            <h4><i class="fas fa-chart-line"></i> একই সংখ্যার বিখ্যাত ব্যবসা ও উদ্যোক্তা</h4>
            <div class="famous-list">
                ${list.map(name => `<span class="famous-name">${name}</span>`).join('')}
            </div>
            <p class="famous-note">এই সংখ্যার শক্তি সাফল্যের পথ দেখিয়েছে। আপনার ব্যবসায়ও এই শক্তি কাজে লাগান।</p>
        </div>
    `;
}
