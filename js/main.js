// ============================================================
// main.js — Numerology Intelligence Hub
// সম্পূর্ণ ২৪ ক্যাটাগরি রেন্ডারার + সব হেল্পার ফাংশন
// ============================================================

let currentRawInput = '';
let currentNumberData = null;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ============================================================
// RENDER FUNCTIONS — ২৪টি ক্যাটাগরি
// ============================================================

// 1. ব্যক্তির নাম
function renderPersonalName(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">${escapeHtml(data.identity.title)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | ব্যক্তির নামের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-star"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:15px">
                <span class="badge">🎨 শুভ রং: ${escapeHtml(data.luckyColor)}</span>
                <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
                <span class="badge">🧭 শুভ দিক: ${escapeHtml(data.luckyDirection)}</span>
                <span class="badge">💎 রত্নপাথর: ${escapeHtml(data.gemstone||'')}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-user"></i> ব্যক্তিত্ব ও স্বভাব</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশা</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ পরামর্শ</h3><p>${escapeHtml(data.investment.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> জ্যোতিষীয় প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 2. শিশুর নাম
function renderBabyName(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">শিশুর নামের অংক: ${number}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | শিশুর সম্ভাব্য ব্যক্তিত্ব</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-baby"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-baby"></i> শিশুর সম্ভাব্য ব্যক্তিত্ব</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-graduation-cap"></i> শিক্ষা ও ভবিষ্যৎ</h3><p>${getBabyFutureTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> শিশুর জন্য পরামর্শ</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 3. বিবাহ মিলন
function renderMarriage(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">বিবাহ মিলন বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | সামঞ্জস্যের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-heart"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-heart"></i> সামঞ্জস্যের বিশ্লেষণ</h3><p>${getMarriageTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-ring"></i> দাম্পত্য জীবনের সম্ভাবনা</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-comments"></i> পরামর্শ</h3><p>${getMarriageAdvice(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 4. প্রেম মিলন
function renderLove(input, number, data) {
    return renderMarriage(input, number, data);
}

// 5. পরিবার মিলন
function renderFamily(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">পরিবার মিলন বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | পারিবারিক সামঞ্জস্যের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-users"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-home"></i> পারিবারিক সামঞ্জস্য</h3><p>${getFamilyTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-dove"></i> পারিবারিক শান্তির উপায়</h3><p>${getFamilyPeace(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 6. শুভ যাত্রার দিন
function renderJourneyDate(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">শুভ যাত্রার দিন বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | যাত্রার অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-calendar-check"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${escapeHtml(data.travel.description)}</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:15px">
                <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
                <span class="badge">🧭 শুভ দিক: ${escapeHtml(data.luckyDirection)}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-clock"></i> যাত্রার শুভ সময়</h3><p>${getJourneyTime(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-compass"></i> যাত্রার দিকনির্দেশ</h3><p>${escapeHtml(data.travel.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-pray"></i> যাত্রার পূর্বে করণীয়</h3><p>${getJourneyRitual(number)}</p></div>
        </div>`;
}

// 7. নতুন বাড়ি
function renderNewHome(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">বাড়ির নম্বর: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | বসবাসের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-home"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getHomeDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-house-user"></i> বাড়ির প্রভাব ও পরিবেশ</h3><p>${getHomeInfluence(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-dove"></i> পারিবারিক শান্তি ও স্থিতিশীলতা</h3><p>${getHomePeace(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> বাড়ির জন্য প্রতিকার</h3><p>${getHomeRemedy(number, data)}</p></div>
        </div>`;
}

// 8. জন্মদিন বিশ্লেষণ
function renderBirthday(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">${escapeHtml(data.identity.title)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | জন্মদিনের অংক বিশ্লেষণ</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-birthday-cake"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-birthday-cake"></i> জন্মদিনের বিশেষ বৈশিষ্ট্য</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> জীবনের গুরুত্বপূর্ণ সময়</h3><p>${getLifeMilestones(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ার পথ</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 9. ব্যবসার নাম
function renderBusinessName(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">"${escapeHtml(input)}"</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | ব্যবসার নামের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-chart-line"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:15px">
                <span class="badge">🎨 শুভ রং: ${escapeHtml(data.luckyColor)}</span>
                <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-chart-bar"></i> ব্যবসার সম্ভাবনা ও ধরণ</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-handshake"></i> অংশীদারিত্বের পরামর্শ</h3><p>${getPartnerAdvice(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-trophy"></i> সাফল্যের মূলমন্ত্র</h3><p>${getSuccessMantra(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ পরামর্শ</h3><p>${escapeHtml(data.investment.description)}</p></div>
        </div>`;
}

// 10. অংশীদারিত্ব মিলন
function renderPartnership(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">অংশীদারিত্ব মিলন বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | ব্যবসায়িক সামঞ্জস্যের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-handshake"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-handshake"></i> অংশীদারিত্বের সামঞ্জস্য</h3><p>${getPartnerCompatibility(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> সাফল্যের সম্ভাবনা</h3><p>${getPartnerSuccess(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-trophy"></i> সাফল্যের মূলমন্ত্র</h3><p>${getSuccessMantra(number)}</p></div>
        </div>`;
}

// 11. স্টার্টআপ নাম
function renderStartupName(input, number, data) {
    return renderBusinessName(input, number, data);
}

// 12. লোগো রঙ নির্বাচন
function renderLogoColor(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">লোগো রঙ নির্বাচন বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | ব্র্যান্ড রঙের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-palette"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-paint-brush"></i> প্রাথমিক শুভ রং</h3><p><strong>${escapeHtml(data.luckyColor)}</strong> — ${escapeHtml(data.planet)}-এর প্রিয় রং। এই রং ব্র্যান্ডের গ্রহণযোগ্যতা বৃদ্ধি করে।</p></div>
            <div class="info-section"><h3><i class="fas fa-brain"></i> রঙের মনস্তাত্ত্বিক প্রভাব</h3><p>${getColorPsychology(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-drafting-compass"></i> লোগো ডিজাইন পরামর্শ</h3><p>${getLogoDesign(number)}</p></div>
        </div>`;
}

// 13. ব্যবসা উদ্বোধনের তারিখ
function renderLaunchDate(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">ব্যবসা উদ্বোধনের তারিখ বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | উদ্বোধনের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-calendar-alt"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-clock"></i> উদ্বোধনের শুভ সময়</h3><p>${getLaunchTime(number, data)}</p></div>
            <div class="info-section"><h3><i class="fas fa-crystal-ball"></i> ব্যবসার ভবিষ্যৎ সম্ভাবনা</h3><p>${getLaunchFuture(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> উদ্বোধনের আগে করণীয়</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 14. পণ্যের মূল্য নির্ধারণ
function renderProductPrice(input, number, data) {
    const isGood = [3,6,9].includes(number);
    const isAvoid = [4,8].includes(number);
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">মূল্য বিশ্লেষণ: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | মূল্য নির্ধারণের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-tag"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPriceDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-chart-pie"></i> সংখ্যাতাত্ত্বিক বিশ্লেষণ</h3>
                <p>${isGood ? '✅ এই মূল্য <strong>অত্যন্ত শুভ</strong> — ব্যবসার জন্য অনুকূল। ক্রেতারা এই মূল্যে আকৃষ্ট হবে।' : isAvoid ? '⚠️ এই মূল্যে <strong>সতর্কতা প্রয়োজন</strong>। বিকল্প মূল্য বিবেচনা করুন।' : '⚖️ এই মূল্য মধ্যম। সামান্য পরিবর্তনে আরও শুভ করা সম্ভব।'}</p>
            </div>
            <div class="info-section"><h3><i class="fas fa-lightbulb"></i> বিকল্প শুভ মূল্য</h3><p>${getAltPrice(number)}</p></div>
        </div>`;
}

// 15. গাড়ির নম্বর
function renderCarNumber(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">গাড়ির নম্বর: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | যাত্রার অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-car"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getTravelDesc(number, data)}</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:15px">
                <span class="badge">📅 শুভ দিন: ${escapeHtml(data.luckyDay)}</span>
                <span class="badge">🧭 শুভ দিক: ${escapeHtml(data.luckyDirection)}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-road"></i> যাত্রার শুভ-অশুভ</h3><p>${escapeHtml(data.travel.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-shield-alt"></i> নিরাপত্তা সতর্কতা</h3><p>${getVehicleSafety(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-tools"></i> রক্ষণাবেক্ষণ পরামর্শ</h3><p>প্রতি ${escapeHtml(data.luckyDay)} দিনে গাড়ির সর্ভিস করান। ${escapeHtml(data.luckyColor)} রঙের আনুষাঙ্গিক ব্যবহার শুভ।</p></div>
        </div>`;
}

// 16. বাইক নম্বর
function renderBikeNumber(input, number, data) {
    return renderCarNumber(input, number, data);
}

// 17. মোবাইল নম্বর
function renderMobileNumber(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">মোবাইল নম্বর: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | যোগাযোগের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-mobile-alt"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-phone-alt"></i> যোগাযোগের প্রভাব</h3><p>${escapeHtml(data.identity.description.substring(0, 300))}</p></div>
            <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ারের উপর প্রভাব</h3><p>${getPhoneCareer(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> শুভ করার উপায়</h3><p>এই নম্বর ব্যবহারের সময় ${escapeHtml(data.luckyDay)} দিনে গুরুত্বপূর্ণ কল করুন। ${escapeHtml(data.luckyColor)} রঙের ফোন কভার ব্যবহার শুভ।</p></div>
        </div>`;
}

// 18. ব্যাংক অ্যাকাউন্ট
function renderBankAccount(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">ব্যাংক অ্যাকাউন্ট বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | আর্থিক অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-university"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getBankDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-balance-scale"></i> আর্থিক স্থিতিশীলতা</h3><p>${getBankStability(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> বিনিয়োগের দিকনির্দেশনা</h3><p>${escapeHtml(data.investment.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> আর্থিক উন্নতির প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 19. PIN কোড
function renderPinCode(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">PIN কোড: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | নিরাপত্তার অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-lock"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPinDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-shield-alt"></i> নিরাপত্তা বিশ্লেষণ</h3><p>${getPinSecurity(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-clover"></i> ভাগ্যের উপর প্রভাব</h3><p>${getPinLuck(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-exclamation-triangle"></i> সতর্কতা</h3><p>PIN কোড কাউকে শেয়ার করবেন না। প্রতি ৩-৬ মাস অন্তর পরিবর্তন করুন।</p></div>
        </div>`;
}

// 20. শেয়ার বাজার
function renderStockMarket(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">শেয়ার বাজার বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | বিনিয়োগের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-chart-line"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-chart-bar"></i> বিনিয়োগের শুভ-অশুভ</h3><p>${getStockTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-calendar-alt"></i> লাভের সম্ভাবনা ও সময়</h3><p>${getStockTime(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ কৌশল</h3><p>${escapeHtml(data.investment.description)}</p></div>
        </div>`;
}

// 21. সম্পত্তি বিনিয়োগ
function renderProperty(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">সম্পত্তি বিনিয়োগ বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | স্থাবর সম্পত্তির অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-landmark"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-building"></i> সম্পত্তির শুভ-অশুভ</h3><p>${getPropertyTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-arrow-trend-up"></i> মূল্যবৃদ্ধির সম্ভাবনা</h3><p>${getPropertyGrowth(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ পরামর্শ</h3><p>${escapeHtml(data.investment.description)}</p></div>
        </div>`;
}

// 22. সোনা/রূপা বিনিয়োগ
function renderGoldSilver(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">সোনা/রূপা বিনিয়োগ বিশ্লেষণ</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | মূল্যবান ধাতুর অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-gem"></i> মূল সংখ্যা: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগের ফলাফল</h3><p>${getGoldTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-calendar-check"></i> কেনার শুভ সময়</h3><p>${getGoldTime(number, data)}</p></div>
            <div class="info-section"><h3><i class="fas fa-gem"></i> রত্নপাথর পরামর্শ</h3><p>${escapeHtml(data.gemstone||'')} — ${escapeHtml(data.planet)}-এর রত্নপাথর। বিশেষজ্ঞের পরামর্শে ধারণ করলে শুভফল পাবেন।</p></div>
        </div>`;
}

// 23. মূলাংক বিশ্লেষণ
function renderMulank(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">${escapeHtml(data.identity.title)}</h1>
            <p class="result-subtitle">${escapeHtml(data.planet)} | মূলাংক বিশ্লেষণ</p>
        </div>
        <div class="root-description">
            <div style="text-align:center;margin-bottom:15px">
                <span class="planet-badge"><i class="fas fa-star"></i> মূলাংক: ${number} — ${escapeHtml(data.planet)}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
            <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:15px">
                <span class="badge">🎨 রং: ${escapeHtml(data.luckyColor)}</span>
                <span class="badge">📅 দিন: ${escapeHtml(data.luckyDay)}</span>
                <span class="badge">🧭 দিক: ${escapeHtml(data.luckyDirection)}</span>
                <span class="badge">💎 রত্ন: ${escapeHtml(data.gemstone||'')}</span>
                <span class="badge">🌿 তত্ত্ব: ${escapeHtml(data.element||'')}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-user"></i> ব্যক্তিত্ব ও স্বভাব</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশা</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-plane"></i> যাত্রার পরামর্শ</h3><p>${escapeHtml(data.travel.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগ</h3><p>${escapeHtml(data.investment.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-magic"></i> জ্যোতিষীয় প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>`;
}

// 24. নামের অংক
function renderNameNumber(input, number, data) {
    return renderPersonalName(input, number, data);
}

// ============================================================
// HELPER FUNCTIONS — সংখ্যা ১-৯ এর বিশেষ তথ্য
// ============================================================

function getPersonalDesc(num, data) {
    const d={1:"সূর্য গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি জন্মগতভাবে নেতৃত্বের গুণে ভূষিত। আত্মবিশ্বাস, সৃজনশীলতা ও উদ্ভাবনী শক্তি আপনার প্রধান বৈশিষ্ট্য।",2:"চন্দ্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত আবেগপ্রবণ, কল্পনাপ্রবণ ও সৃজনশীল। মানুষের মন বুঝতে আপনার সেরা ক্ষমতা রয়েছে।",3:"বৃহস্পতি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত জ্ঞানী, আশাবাদী ও আধ্যাত্মিক। শিক্ষক, গুরু বা পরামর্শকের মতো মানুষ আপনাকে ভক্তি করে।",4:"রাহু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত রহস্যময়, গভীর চিন্তাবিদ ও উদ্ভাবক। সাধারণের পথে নয়, নতুন পথ তৈরি করতে ভালোবাসেন।",5:"বুধ গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত বুদ্ধিমান, চটপটে ও যোগাযোগ দক্ষ। ব্যবসায়িক বুদ্ধি সহজাত — মুখের কথায় মানুষ মুগ্ধ হয়।",6:"শুক্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি সৌন্দর্যপ্রিয়, শিল্পীহৃদয় ও রোমান্টিক। সম্পর্ক ও প্রেম আপনার জীবনের কেন্দ্রে।",7:"কেতু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি গভীরভাবে আধ্যাত্মিক ও দার্শনিক। একাকীত্ব আপনার শক্তি — রহস্য আপনার আকর্ষণ।",8:"শনি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত ধৈর্যশীল, পরিশ্রমী ও দায়িত্বশীল। কঠিন পথই আপনাকে মহান করে তোলে।",9:"মঙ্গল গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত সাহসী, উদ্যমী ও যোদ্ধা প্রকৃতির। যা করতে চান, তা যেকোনো মূল্যে করেন।"};
    return d[num]||`${data.planet} গ্রহের প্রভাবে এই সংখ্যার ব্যক্তি অনন্য বৈশিষ্ট্যের অধিকারী।`;
}

function getBusinessDesc(num, data) {
    const d={1:"সূর্যের প্রভাবে এই নামটি নেতৃত্ব ও ক্ষমতার প্রতীক। প্রশাসন, রাজনীতি, স্টার্টআপ, টেকনোলজি ফার্মে সফল। লাল ও সোনালি রঙের লোগো ব্যবহার করুন।",2:"চন্দ্রের প্রভাবে এই নামটি জনপ্রিয়তা ও গ্রাহক আকর্ষণে সিদ্ধ। রেস্টুরেন্ট, হোটেল, ট্রাভেল এজেন্সিতে সফল।",3:"বৃহস্পতির প্রভাবে এই নামটি জ্ঞান ও বিশ্বাসের প্রতীক। শিক্ষা প্রতিষ্ঠান, কোচিং সেন্টার, আইন সংস্থায় সফল।",4:"রাহুর প্রভাবে এই নামটি প্রযুক্তি ও গবেষণার জন্য সেরা। আইটি, সাইবার সিকিউরিটি, আন্তর্জাতিক বাণিজ্যে সফল।",5:"বুধের প্রভাবে এই নামটি যোগাযোগ ও বাণিজ্যের জন্য অত্যন্ত শুভ। ট্রেডিং, মার্কেটিং, মিডিয়ায় সফল।",6:"শুক্রের প্রভাবে এই নামটি সৌন্দর্য ও বিলাস দ্রব্যের ব্যবসার জন্য সেরা। কসমেটিকস, ফ্যাশন, হোটেলে সফল।",7:"কেতুর প্রভাবে এই নামটি গবেষণা ও আধ্যাত্মিক ব্যবসার জন্য উত্তম। রিসার্চ সেন্টার, পাবলিশিং হাউসে সফল।",8:"শনির প্রভাবে এই নামটি শিল্প ও স্থায়ী ব্যবসার জন্য সেরা। ম্যানুফ্যাকচারিং, কনস্ট্রাকশন, রিয়েল এস্টেটে সফল।",9:"মঙ্গলের প্রভাবে এই নামটি প্রতিযোগিতামূলক ব্যবসার জন্য সেরা। কনস্ট্রাকশন, ডিফেন্স, স্পোর্টসে সফল।"};
    return d[num]||`${data.planet} গ্রহের প্রভাবে এই নামটি সাফল্য এনে দেবে।`;
}

function getTravelDesc(num, data) {
    const d={1:"সূর্যের প্রভাবে অত্যন্ত শুভ। পূর্ব দিকে যাত্রা করলে সাফল্য। সূর্যোদয়ের সময় যাত্রা শুরু করুন।",2:"চন্দ্রের প্রভাবে আবেগপ্রবণ যাত্রা। সোমবার মঙ্গল। উত্তর-পশ্চিম দিকে যাত্রা করুন।",3:"বৃহস্পতির প্রভাবে জ্ঞান ও আশাবাদের যাত্রা। বৃহস্পতিবার মঙ্গল।",4:"রাহুর প্রভাবে রহস্যময় যাত্রা। রাতের বেলা যাত্রা এড়িয়ে চলুন। শনিবার শুভ।",5:"বুধের প্রভাবে চঞ্চল কিন্তু সফল যাত্রা। বুধবার মঙ্গল। ব্যবসায়িক যাত্রায় বিশেষ সাফল্য।",6:"শুক্রের প্রভাবে আনন্দময় যাত্রা। শুক্রবার শুভ। প্রিয়জনের সাথে যাত্রা বিশেষ মঙ্গলজনক।",7:"কেতুর প্রভাবে আধ্যাত্মিক যাত্রা। তীর্থস্থানে বিশেষ ফল।",8:"শনির প্রভাবে ধৈর্যের যাত্রা। শনিবার ও মঙ্গলবার শুভ। পার্বত্য অঞ্চলে বিশেষ সাফল্য।",9:"মঙ্গলের প্রভাবে সাহসী যাত্রা। মঙ্গলবার শুভ। দক্ষিণ দিকে যাত্রা করলে মঙ্গল।"};
    return d[num]||`${data.planet} গ্রহের প্রভাবে যাত্রায় মাঝারি ফল।`;
}

function getHomeDesc(num, data) {
    const d={1:"সূর্যের প্রভাবে এই বাড়িতে নেতৃত্ব ও আত্মবিশ্বাসের শক্তি বিরাজ করে। পূর্ব দিকে মুখ করে প্রধান দরজা রাখুন।",2:"চন্দ্রের প্রভাবে এই বাড়িতে পারিবারিক বন্ধন মজবুত হয়। উত্তর-পশ্চিম দিকে জলের উৎস রাখুন।",3:"বৃহস্পতির প্রভাবে এই বাড়িতে জ্ঞান ও শিক্ষার পরিবেশ তৈরি হয়। পূর্ব-উত্তর দিকে পূজা ঘর রাখুন।",4:"রাহুর প্রভাবে এই বাড়িতে রহস্যময়তা ও অস্থিরতার সম্ভাবনা। দক্ষিণ-পশ্চিম দিকে গাছ লাগান।",5:"বুধের প্রভাবে এই বাড়িতে সক্রিয়তা ও যোগাযোগের শক্তি বিরাজ করে। উত্তর দিকে বইয়ের আলমারি রাখুন।",6:"শুক্রের প্রভাবে এই বাড়িতে সৌন্দর্য ও প্রেম বিরাজ করে। দক্ষিণ-পূর্ব দিকে শো-পিস রাখুন।",7:"কেতুর প্রভাবে এই বাড়িতে আধ্যাত্মিক শক্তি ও একাকীত্বের পরিবেশ। উত্তর-পূর্ব দিকে ধ্যানের জায়গা রাখুন।",8:"শনির প্রভাবে এই বাড়িতে শৃঙ্খলা ও পরিশ্রমের পরিবেশ। পশ্চিম দিকে অফিসের জায়গা রাখুন।",9:"মঙ্গলের প্রভাবে এই বাড়িতে শক্তি ও সাহসের আবহ। দক্ষিণ দিকে ব্যায়ামের জায়গা রাখুন।"};
    return d[num]||`${data.planet} গ্রহের প্রভাবে এই বাড়ি বসবাসের জন্য শুভ।`;
}

function getPinDesc(num, data) {
    const d={1:"সূর্যের প্রভাবে অত্যন্ত শক্তিশালী ও নিরাপদ। লাল রঙের ওয়ালেট ব্যবহার করুন।",2:"চন্দ্রের প্রভাবে সংবেদনশীল। জন্মতারিখ PIN হিসেবে এড়িয়ে চলুন।",3:"বৃহস্পতির আশীর্বাদে শুভ ও নিরাপদ। বৃহস্পতিবারে PIN পরিবর্তন করুন।",4:"রাহুর প্রভাবে রহস্যময়। নিয়মিত পরিবর্তন করুন।",5:"বুধের প্রভাবে সক্রিয় ও কার্যকর। প্রতি মাসে পরিবর্তন করুন।",6:"শুক্রের কৃপায় সুখী ও নিরাপদ। শুক্রবারে PIN পরিবর্তন করুন।",7:"কেতুর প্রভাবে রহস্যময় ও নিরাপদ।",8:"শনির প্রভাবে শক্তিশালী ও দীর্ঘস্থায়ী। শনিবারে PIN পরিবর্তন করুন।",9:"মঙ্গলের প্রভাবে সাহসী ও কার্যকর। মঙ্গলবারে PIN পরিবর্তন করুন।"};
    return d[num]||`${data.planet} গ্রহের প্রভাবে এই PIN কোডটি মাঝারি নিরাপত্তা প্রদান করে।`;
}

function getBankDesc(num, data) {
    const d={1:"সূর্যের প্রভাবে অত্যন্ত স্থিতিশীল। দীর্ঘমেয়াদী সঞ্চয়ের জন্য উত্তম।",2:"চন্দ্রের প্রভাবে মাঝারি স্থিতিশীল। যৌথ মালিকানায় বেশি লাভজনক।",3:"বৃহস্পতির প্রভাবে শিক্ষা সংক্রান্ত বিনিয়োগে সেরা।",4:"রাহুর প্রভাবে অস্থিরতার সম্ভাবনা। একাধিক অ্যাকাউন্ট খোলা ভালো।",5:"বুধের প্রভাবে দ্রুত লেনদেনে উপযুক্ত। শেয়ার বাজারে সাফল্য আসে।",6:"শুক্রের প্রভাবে অত্যন্ত স্থিতিশীল ও লাভজনক।",7:"কেতুর প্রভাবে গোপনীয় ও স্থিতিশীল। গবেষণা খাতে বিনিয়োগে লাভ।",8:"শনির প্রভাবে দীর্ঘমেয়াদে অত্যন্ত স্থিতিশীল।",9:"মঙ্গলের প্রভাবে উদ্যমী ও সক্রিয় অ্যাকাউন্ট।"};
    return d[num]||`${data.planet} গ্রহের প্রভাবে এই অ্যাকাউন্ট মাঝারি স্থিতিশীলতা প্রদান করে।`;
}

function getPriceDesc(num, data) {
    const isGood=[3,6,9].includes(num);
    if(isGood) return `${data.planet} গ্রহের প্রভাবে এই মূল্যটি অত্যন্ত শুভ ও ব্যবসার জন্য অনুকূল।`;
    return `${data.planet} গ্রহের প্রভাবে এই মূল্যটিতে সতর্কতা প্রয়োজন। বিকল্প মূল্য হিসেবে ৩, ৬, ৯ সংখ্যার দাম নির্বাচন করুন।`;
}

// টিপস ফাংশন
function getBabyFutureTip(num) {
    const t={1:"এই শিশু ভবিষ্যতে নেতৃত্বদায়ী পদে অধিষ্ঠিত হবে। ব্যবসা, রাজনীতি বা প্রশাসনে উজ্জ্বল ক্যারিয়ার গড়ার সম্ভাবনা রয়েছে। শিশুর স্বাতন্ত্র্য ও সৃজনশীলতাকে প্রশ্রয় দিন।",2:"এই শিশু শিল্প, সংগীত বা সামাজিক কাজে সাফল্য পাবে। শিশুর আবেগকে সম্মান করুন ও সৃজনশীল পরিবেশ দিন।",3:"এই শিশু শিক্ষক, উপদেষ্টা হওয়ার সম্ভাবনা রাখে। শিশুর শিক্ষার প্রতি বিশেষ মনোযোগ দিন।",4:"এই শিশু প্রযুক্তি, গবেষণায় সাফল্য পাবে। মানসিক স্থিরতার দিকে মনোযোগ দিন।",5:"এই শিশু ব্যবসা, মিডিয়ায় উজ্জ্বল হবে। কৌতূহলকে উৎসাহিত করুন।",6:"এই শিশু শিল্পকলা, ফ্যাশনে সাফল্য পাবে। সৌন্দর্যসচেতন পরিবেশ দিন।",7:"এই শিশু দর্শন বা গবেষণায় সাফল্য পাবে। একাকী সময় ও গভীর পড়াশোনার সুযোগ দিন।",8:"এই শিশু ব্যবসা, আইনে দেরিতে হলেও স্থায়ী সাফল্য পাবে। নৈতিকতার শিক্ষা দিন।",9:"এই শিশু সামরিক, ক্রীড়ায় উজ্জ্বল হবে। শক্তিকে সঠিক দিকে পরিচালিত করুন।"};
    return t[num]||"এই শিশু সুপ্রতিভ ও সফল হবে। সঠিক পরিবেশ ও শিক্ষা দিন।";
}

function getMarriageTip(num) {
    const t={1:"সংখ্যা ১-এর জন্য আদর্শ সঙ্গী: ১, ৩, ৯ সংখ্যার ব্যক্তি। সূর্যের মিত্র বৃহস্পতি ও মঙ্গলের সাথে আদর্শ মিলন। দাম্পত্যে নেতৃত্ব নিতে চাইবেন — সঙ্গীকে এটি সহজভাবে নিতে হবে।",2:"সংখ্যা ২-এর জন্য আদর্শ সঙ্গী: ২, ৬, ৭ সংখ্যার ব্যক্তি। চন্দ্রের মিত্র শুক্র ও কেতুর সাথে সুখী দাম্পত্য। আবেগী হওয়ার কারণে সঙ্গীর সহানুভূতি প্রয়োজন।",3:"সংখ্যা ৩-এর জন্য আদর্শ সঙ্গী: ৩, ৬, ৯ সংখ্যার ব্যক্তি। জ্ঞান ও আধ্যাত্মিকতার সমন্বয়ে সুখী গৃহস্থালি।",4:"সংখ্যা ৪-এর জন্য আদর্শ সঙ্গী: ৪, ৮ সংখ্যার ব্যক্তি। সম্পর্কে অস্থিরতা থাকতে পারে — বিশেষ সতর্কতা প্রয়োজন।",5:"সংখ্যা ৫-এর জন্য আদর্শ সঙ্গী: ৫, ৩, ৬ সংখ্যার ব্যক্তি। যোগাযোগ ও বোঝাপড়ায় সম্পর্ক টিকে থাকে।",6:"সংখ্যা ৬-এর জন্য আদর্শ সঙ্গী: ৬, ২, ৩ সংখ্যার ব্যক্তি। প্রেম ও সৌন্দর্যের মিলনে সুখী জীবন।",7:"সংখ্যা ৭-এর জন্য আদর্শ সঙ্গী: ৭, ২, ৯ সংখ্যার ব্যক্তি। একাকীত্বকে সম্মান করে এমন সঙ্গী প্রয়োজন।",8:"সংখ্যা ৮-এর জন্য আদর্শ সঙ্গী: ৮, ৪ সংখ্যার ব্যক্তি। দেরিতে সুখ আসলেও স্থায়ী হয়।",9:"সংখ্যা ৯-এর জন্য আদর্শ সঙ্গী: ৯, ১, ৩ সংখ্যার ব্যক্তি। শক্তিশালী ও উদ্যমী দাম্পত্য জীবন।"};
    return t[num]||"সামঞ্জস্য ভালো। সম্পর্কের উন্নয়ন সম্ভব।";
}

function getMarriageAdvice(num) {
    const t={1:"অহংকার ও কর্তৃত্বপ্রিয়তা নিয়ন্ত্রণ করুন। সঙ্গীর মতামতকে গুরুত্ব দিন।",2:"আবেগকে নিয়ন্ত্রণ করুন। মানসিক অস্থিরতার সময় সিদ্ধান্ত নেবেন না।",3:"অতিরিক্ত পরামর্শ দেওয়ার প্রবণতা কমিয়ে আনুন। সঙ্গীকে স্বাধীনতা দিন।",4:"দাম্পত্যে স্থিরতা আনুন। সঙ্গীকে নিয়মিত সময় দিন।",5:"চঞ্চলতা নিয়ন্ত্রণ করুন। একটি সম্পর্কে মনোযোগ দিন।",6:"বিলাসিতার প্রতি মোহ সঙ্গীর মতামতকে গৌণ না করে।",7:"একাকীত্বের প্রয়োজন সঙ্গীকে ব্যাখ্যা করুন।",8:"কাজের চাপে দাম্পত্যে দূরত্ব যেন না হয়। সময় দিন।",9:"রাগকে নিয়ন্ত্রণ করুন। সঙ্গীর সাথে লড়াইয়ের মনোভাব ত্যাগ করুন।"};
    return t[num]||"সঙ্গীর সাথে নিয়মিত সময় কাটান ও সৎ যোগাযোগ বজায় রাখুন।";
}

function getFamilyTip(num) {
    const t={1:"পরিবারে নেতৃত্বের ভূমিকায় স্বাচ্ছন্দ্য বোধ করেন। অন্যদের মতামতকে গুরুত্ব দিন।",2:"পরিবারের মানসিক সংযোগের কেন্দ্রবিন্দু আপনি। পারিবারিক সমস্যায় মধ্যস্থতা করুন।",3:"পরিবারের গুরু বা পরামর্শক হিসেবে ভূমিকা রাখুন।",4:"পরিবারে স্থিরতা আনুন। সবার সাথে স্বচ্ছতা বজায় রাখুন।",5:"পারিবারিক যোগাযোগ সুদৃঢ় রাখুন। সবার মতামত শুনুন।",6:"পরিবারের সৌন্দর্য ও সুখকে কেন্দ্রে রাখুন। গৃহের পরিবেশ আনন্দময় করুন।",7:"পরিবারের সাথে আধ্যাত্মিক বন্ধন গড়ুন।",8:"পরিবারের আর্থিক নিরাপত্তা প্রদান আপনার শক্তি।",9:"পারিবারিক কার্যক্রমে সক্রিয়ভাবে অংশ নিন।"};
    return t[num]||"পরিবারের সদস্যদের মধ্যে বোঝাপড়া ও ভালোবাসা বজায় রাখুন।";
}

function getFamilyPeace(num) {
    const t={1:"রবিবারে পরিবারের সাথে একসাথে কার্যক্রম করুন।",2:"সোমবারে একসাথে খাবার খান ও মনের কথা বলুন।",3:"বৃহস্পতিবারে ধর্মীয় বা শিক্ষামূলক অনুষ্ঠান করুন।",4:"শনিবারে একসাথে প্রকৃতিতে সময় কাটান।",5:"বুধবারে একসাথে নতুন কিছু শিখুন বা আলোচনা করুন।",6:"শুক্রবারে একসাথে শিল্পচর্চা বা বিনোদন করুন।",7:"শুক্রবারে একসাথে ধ্যান বা আধ্যাত্মিক অনুশীলন করুন।",8:"শনিবারে একসাথে আর্থিক পরিকল্পনা করুন।",9:"মঙ্গলবারে একসাথে শারীরিক কার্যক্রম বা খেলাধুলা করুন।"};
    return t[num]||"পরিবারের সাথে নিয়মিত মানসম্পন্ন সময় কাটান।";
}

function getJourneyTime(num) {
    const t={1:"সকাল ৬-৮টা",2:"সন্ধ্যা ৬-৮টা",3:"সকাল ৮-১০টা",4:"সন্ধ্যা ৬টার পর",5:"দুপুর ১২-২টা",6:"সন্ধ্যার সময়",7:"ভোর ৪-৬টা",8:"সূর্যাস্তের পর",9:"দুপুর ১২-৩টা"};
    return t[num]||"সকালের দিকে যাত্রা শুরু করলে ভালো।";
}

function getJourneyRitual(num) {
    const t={1:"সূর্যকে নমস্কার জানান। গায়ত্রী মন্ত্র জপ করুন। তামার পাত্রে জল অর্পণ করুন।",2:"দুর্গা বা চন্দ্রমাকে স্মরণ করুন। সাদা মিষ্টি নিবেদন করুন।",3:"গুরু বা বৃহস্পতিকে প্রণাম করুন। হলুদ ফুল অর্পণ করুন।",4:"গণেশের পূজা করুন। ধূপ বা লোবান জ্বালান। কালো তিল দান করুন।",5:"গণেশকে প্রণাম করুন। সবুজ গাছে জল দিন। বুধ মন্ত্র জপ করুন।",6:"লক্ষ্মীর পূজা করুন। সুগন্ধি ফুল অর্পণ করুন।",7:"গণেশ বা শিবের পূজা করুন। নারিকেল দান করুন।",8:"হনুমান চালিসা পাঠ করুন। শনিদেবকে তেল অর্পণ করুন।",9:"হনুমান বা মঙ্গলকে প্রণাম করুন। লাল ফুল ও মিষ্টি অর্পণ করুন।"};
    return t[num]||"ঈশ্বরের কাছে প্রার্থনা করুন। নিরাপদ যাত্রার কামনা করুন।";
}

function getHomeInfluence(num) {
    const t={1:"এই বাড়িতে আত্মবিশ্বাস ও নেতৃত্বগুণ বৃদ্ধি পায়। ক্যারিয়ারে উন্নতি হয়।",2:"এই বাড়িতে পারিবারিক বন্ধন মজবুত হয়। মানসিক শান্তি আসে।",3:"এই বাড়িতে শিক্ষার পরিবেশ তৈরি হয়। সন্তানের পড়াশোনায় মনোযোগ বাড়ে।",4:"এই বাড়িতে অপ্রত্যাশিত ঘটনা ঘটতে পারে। বিদেশ যাওয়ার সুযোগ আসে।",5:"এই বাড়িতে ব্যবসায়িক যোগাযোগ ও কার্যক্রম বৃদ্ধি পায়।",6:"এই বাড়িতে প্রেম, সৌন্দর্য ও পারিবারিক সুখ বিরাজ করে।",7:"এই বাড়িতে ধ্যান ও আধ্যাত্মিক অনুশীলনে সাফল্য পাওয়া যায়।",8:"এই বাড়িতে কঠোর পরিশ্রমের পরিবেশ তৈরি হয়। দেরিতে হলেও সাফল্য আসে।",9:"এই বাড়িতে শক্তি ও সাহসের পরিবেশ তৈরি হয়।"};
    return t[num]||"এই বাড়িতে বসবাস পরিবারের জন্য শুভ।";
}

function getHomePeace(num) {
    const t={1:"বাড়ির পূর্ব দিকে সূর্যের আলো আসার ব্যবস্থা রাখুন। লাল বা সোনালি রং ব্যবহার করুন।",2:"বাড়িতে জলের উৎস রাখুন। সাদা ও নীল রং ব্যবহার করুন। সন্ধ্যায় দীপ জ্বালান।",3:"বাড়িতে বই ও জ্ঞানের পরিবেশ তৈরি করুন। হলুদ রং ব্যবহার করুন।",4:"বাড়ির দক্ষিণ-পশ্চিম কোণে বিশেষ সতর্কতা রাখুন। নীল বা ধূসর রং ব্যবহার করুন।",5:"বাড়িতে সবুজ গাছপালা রাখুন। উত্তর দিকে মুখ করে পড়ার ঘর তৈরি করুন।",6:"বাড়িতে সুন্দর ফুল ও সুগন্ধির ব্যবস্থা রাখুন। গোলাপি ও সাদা রং ব্যবহার করুন।",7:"বাড়িতে ধ্যানের কক্ষ তৈরি করুন। শান্ত একাকী পরিবেশ তৈরি করুন।",8:"বাড়িতে শৃঙ্খলা ও পরিচ্ছন্নতা বজায় রাখুন। কাজের পরিবেশ সুসজ্জিত রাখুন।",9:"বাড়িতে শক্তি ও উদ্যমের পরিবেশ তৈরি করুন। লাল রং বা শক্তিশালী মোটিফ ব্যবহার করুন।"};
    return t[num]||"বাড়িতে নিয়মিত ধূপ জ্বালান ও পরিষ্কার পরিচ্ছন্ন রাখুন।";
}

function getHomeRemedy(num, data) {
    return `${data.luckyColor} রঙের ব্যবহার বাড়িতে শান্তি বাড়ায়। ${data.luckyDay} দিনে বাড়িতে পূজা-অর্চনা করুন। ${data.gemstone||''} রত্নপাথর বাড়িতে রাখলে শুভফল পাবেন।`;
}

function getLifeMilestones(num) {
    const t={1:"আপনার জীবনে ২৮, ৩৬ ও ৪৫ বছর বয়সে বড় পরিবর্তন আসে। এই বছরগুলোতে গুরুত্বপূর্ণ সুযোগ কাজে লাগান।",2:"আপনার জীবনে ২৫, ৩৩ ও ৪২ বছর বয়সে বিশেষ ঘটনা ঘটে। সোমবার দিনটি বিশেষ গুরুত্বপূর্ণ।",3:"আপনার জীবনে ২৭, ৩৬ ও ৪৫ বছর বয়সে সাফল্যের শীর্ষে পৌঁছাবেন।",4:"আপনার জীবনে ৩২, ৪০ ও ৪৮ বছর বয়সে স্থিতিশীলতা আসে।",5:"আপনার জীবনে ২৫, ৩২ ও ৪১ বছর বয়সে দ্রুত পরিবর্তন আসে।",6:"আপনার জীবনে ২৮, ৩৩ ও ৪৪ বছর বয়সে সুখের শীর্ষে পৌঁছাবেন।",7:"আপনার জীবনে ৩৫, ৪২ ও ৪৯ বছর বয়সে আধ্যাত্মিক উন্নতি হয়।",8:"আপনার জীবনে ৩৬, ৪৪ ও ৫২ বছর বয়সে বড় সাফল্য আসে।",9:"আপনার জীবনে ২৭, ৩৬ ও ৪৫ বছর বয়সে গুরুত্বপূর্ণ সংগ্রাম ও সাফল্য আসে।"};
    return t[num]||"জীবনে নিয়মিত সংগ্রাম ও সাফল্যের বছর আসে। ধৈর্য ধরুন।";
}

function getPartnerAdvice(num) {
    const t={1:"একক মালিকানায় সেরা ফলাফল। অংশীদার করলে ১, ৩, ৯ সংখ্যার ব্যক্তির সাথে।",2:"অংশীদারিত্বে ভালো। ২, ৬, ৭ সংখ্যার ব্যক্তির সাথে উত্তম।",3:"৩, ৬, ৯ সংখ্যার ব্যক্তির সাথে অংশীদারিত্বে সাফল্য।",4:"৪, ৮ সংখ্যার সাথে সাবধানে অংশীদারিত্ব করুন।",5:"৫, ৩, ৬ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব শুভ।",6:"৬, ২, ৩ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব উত্তম।",7:"৭, ২, ৯ সংখ্যার সাথে অংশীদারিত্ব ভালো।",8:"৮, ৪ সংখ্যার সাথে ধৈর্যের সাথে অংশীদারিত্ব করুন।",9:"৯, ১, ৩ সংখ্যার সাথে অংশীদারিত্ব সাফল্য আনবে।"};
    return t[num]||"অংশীদার নির্বাচনে সতর্ক থাকুন। চুক্তি লিখিত রাখুন।";
}

function getSuccessMantra(num) {
    const t={1:"'আমি নেতা — নিজের পথ নিজেই তৈরি করব'",2:"'সহযোগিতা ও সম্পর্কই আমার মূলধন'",3:"'জ্ঞানই শক্তি — শিক্ষাই আমার পথ'",4:"'গবেষণা ও উদ্ভাবনই আমার সাফল্যের চাবিকাঠি'",5:"'যোগাযোগ ও গতিশীলতাই আমার মূলমন্ত্র'",6:"'সৌন্দর্য ও সম্পর্কই আমার ব্যবসার প্রাণ'",7:"'গুণগত মান ও সত্যই আমার পাথেয়'",8:"'ধৈর্য ও পরিশ্রমই আমার সাফল্যের মূল'",9:"'সাহস ও উদ্যমই আমার শক্তি'"};
    return t[num]||"সততা ও নিষ্ঠার সাথে কাজ করুন — সাফল্য আসবেই।";
}

function getPartnerCompatibility(num) {
    const t={1:"১, ৩, ৯",2:"২, ৬, ৭",3:"৩, ৬, ৯",4:"৪, ৮",5:"৫, ৩, ৬",6:"৬, ২, ৩",7:"৭, ২, ৯",8:"৮, ৪",9:"৯, ১, ৩"};
    return `${t[num]||'মিত্র সংখ্যা'} সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব করলে সাফল্য আসবে। গ্রহীয় মিত্রতায় ব্যবসায়িক সমন্বয় শক্তিশালী হয়।`;
}

function getPartnerSuccess(num) {
    const t={1:"নিজের দৃষ্টিভঙ্গিতে অটল থাকুন কিন্তু অংশীদারের মতামত শুনুন।",2:"টিম ওয়ার্ক ও মানসিক সংযোগই আপনার ব্যবসার শক্তি।",3:"জ্ঞান বিতরণ করুন — এটিই আপনার সেরা বিনিয়োগ।",4:"গবেষণা ও উদ্ভাবনে বিনিয়োগ করুন।",5:"সক্রিয় যোগাযোগ ও দ্রুত সিদ্ধান্তই সাফল্যের চাবিকাঠি।",6:"সৃজনশীলতা ও সৌন্দর্যবোধ ব্যবসায় প্রয়োগ করুন।",7:"গুণগত মান ও দীর্ঘমেয়াদী চিন্তায় ব্যবসা পরিচালনা করুন।",8:"সংগঠন ও শৃঙ্খলায় ব্যবসা পরিচালনা করুন।",9:"উদ্যম ও প্রতিযোগিতামূলক মনোভাব বজায় রাখুন।"};
    return t[num]||"সততা ও নিষ্ঠার সাথে অংশীদারিত্ব বজায় রাখুন।";
}

function getColorPsychology(num) {
    const t={1:"লাল রং আত্মবিশ্বাস ও নেতৃত্বের প্রতীক। এই রং দর্শকের মনে শক্তি ও উদ্যমের অনুভূতি জাগায়।",2:"সাদা ও রূপালি রং শান্তি ও বিশ্বাসযোগ্যতার প্রতীক। এই রং গ্রাহকের মনে নিরাপত্তার অনুভূতি দেয়।",3:"হলুদ ও সোনালি রং জ্ঞান ও ইতিবাচকতার প্রতীক। এই রং উৎসাহ ও আশাবাদের অনুভূতি তৈরি করে।",4:"নীল ও কালো রং রহস্য ও প্রযুক্তির প্রতীক। টেক কোম্পানি ও উদ্ভাবনী ব্র্যান্ডে আদর্শ।",5:"সবুজ রং সতেজতা, স্বাস্থ্য ও বৃদ্ধির প্রতীক। যোগাযোগ ও স্বাস্থ্য ব্যবসায় আদর্শ।",6:"গোলাপি ও সাদা রং ভালোবাসা ও সৌন্দর্যের প্রতীক। ফ্যাশন ও বিউটি ব্র্যান্ডে পারফেক্ট।",7:"বেগুনি রং আধ্যাত্মিকতা ও গভীরতার প্রতীক। স্পিরিচুয়াল ও ওয়েলনেস ব্যবসায় আদর্শ।",8:"কালো ও গাঢ় নীল রং শক্তি ও কর্তৃত্বের প্রতীক। কর্পোরেট ও আইন ব্যবসায় আদর্শ।",9:"লাল ও কমলা রং সাহস ও উদ্যমের প্রতীক। স্পোর্টস ও প্রতিযোগিতামূলক ব্র্যান্ডে সেরা।"};
    return t[num]||"শুভ রং ব্যবহার করলে ব্র্যান্ডের গ্রহণযোগ্যতা বৃদ্ধি পায়।";
}

function getLogoDesign(num) {
    const t={1:"বৃত্তাকার বা সূর্য-আকৃতির লোগো শুভ। সরল ও শক্তিশালী ডিজাইন বেছে নিন।",2:"অর্ধচন্দ্রাকার বা তরঙ্গ-আকৃতির লোগো শুভ। নরম ও আবেদনময় ডিজাইন বেছে নিন।",3:"ত্রিকোণাকার বা উর্ধ্বমুখী লোগো শুভ। জ্ঞান ও বৃদ্ধির প্রতীক ব্যবহার করুন।",4:"বর্গাকার বা হীরা-আকৃতির লোগো শুভ। প্রযুক্তি-সম্পর্কিত চিহ্ন ব্যবহার করুন।",5:"পাঁচকোণা তারকা বা গতিশীল আকৃতির লোগো শুভ। ডায়নামিক ডিজাইন বেছে নিন।",6:"হৃদয়াকার বা ফুলের আকৃতির লোগো শুভ। সুন্দর ও আবেদনময় ডিজাইন বেছে নিন।",7:"ষটভুজ বা আধ্যাত্মিক প্রতীকের লোগো শুভ।",8:"আয়তাকার বা শক্তিশালী জ্যামিতিক আকৃতির লোগো শুভ।",9:"তারকাকার বা মার্শাল-আর্ট আকৃতির লোগো শুভ।"};
    return t[num]||"সরল, স্মরণীয় ও শুভ রঙের লোগো ডিজাইন করুন।";
}

function getLaunchTime(num, data) {
    const t={1:"সকাল ৬-৮টা",2:"সন্ধ্যা ৬-৮টা",3:"সকাল ৮-১০টা",4:"সন্ধ্যা ৬টার পর",5:"দুপুর ১২-২টা",6:"সন্ধ্যা ৫-৭টা",7:"ভোর ৪-৬টা",8:"সন্ধ্যা ৬-৮টা",9:"দুপুর ১২-৩টা"};
    return `${data.luckyDay} দিনে ${t[num]||"সকালে"} উদ্বোধন করলে সাফল্য আসবে। এই সময়ে গ্রহের অবস্থান অনুকূল।`;
}

function getLaunchFuture(num) {
    const t={1:"প্রথম ৩ বছরে দ্রুত বৃদ্ধি, তারপর স্থিতিশীল সাফল্য।",2:"প্রথম ২ বছরে জনপ্রিয়তা বাড়বে, তারপর মুনাফা আসবে।",3:"৪ বছরেই শিক্ষামূলক খ্যাতি অর্জন করবে।",4:"৫-৬ বছরে স্থায়ী সাফল্য আসবে। প্রযুক্তি খাতে উজ্জ্বল ভবিষ্যৎ।",5:"প্রথম ২ বছরেই দ্রুত বৃদ্ধি। মার্কেটিং শক্তিশালী হবে।",6:"৩ বছরেই সৌন্দর্য শিল্পে পরিচিত নাম হবে।",7:"৬-৭ বছরে গবেষণা ও মানসম্পন্ন সেবায় পরিচিত হবে।",8:"৭-৮ বছরের কঠোর পরিশ্রমের পর দীর্ঘস্থায়ী সাফল্য।",9:"প্রথম ৩ বছরে প্রতিযোগিতামূলক বাজারে নিজের জায়গা তৈরি করবে।"};
    return t[num]||"সঠিক পরিকল্পনা ও পরিশ্রমে সাফল্য নিশ্চিত।";
}

function getAltPrice(num) {
    const t={1:"১১১, ৫৫৫, ৯৯৯ — সূর্যের শুভ সংখ্যা",2:"২২২, ৬৬৬, ৮৮৮ — চন্দ্রের শুভ সংখ্যা",3:"৩৩৩, ৬৬৬, ৯৯৯ — বৃহস্পতির শুভ সংখ্যা",4:"৩৩৩, ৬৬৬, ৯৯৯ — মিত্র গ্রহের শুভ সংখ্যা",5:"৫৫৫, ১১১, ৭৭৭ — বুধের শুভ সংখ্যা",6:"৬৬৬, ৯৯৯, ৩৩৩ — শুক্রের শুভ সংখ্যা",7:"৭৭৭, ১১১, ৫৫৫ — কেতুর শুভ সংখ্যা",8:"৩৩৩, ৬৬৬, ৯৯৯ — মিত্র গ্রহের শুভ সংখ্যা",9:"৯৯৯, ৫৫৫, ১১১ — মঙ্গলের শুভ সংখ্যা"};
    return `শুভ বিকল্প মূল্য: ${t[num]||'৩৩৩, ৬৬৬, ৯৯৯'} টাকা (বা এর গুণিতক)।`;
}

function getVehicleSafety(num) {
    const t={1:"দ্রুত গতি এড়িয়ে চলুন। সূর্যোদয়ের আগে যাত্রা শুরু করলে বিশেষ সুরক্ষা।",2:"রাতের বেলা সতর্ক থাকুন। কুয়াশার দিনে সতর্ক হন।",3:"নিয়মিত সার্ভিসিং করান। বৃহস্পতিবার বিশেষ সতর্কতা।",4:"রাতে দীর্ঘ যাত্রা এড়িয়ে চলুন। গাড়িতে নীল রঙের কিছু রাখুন।",5:"সিগন্যাল মেনে চলুন। বুধবার সতর্কতার সাথে গাড়ি চালান।",6:"আরামদায়ক গতিতে চলুন। গাড়ি সর্বদা পরিষ্কার রাখুন।",7:"যাত্রার সময় ফোন ব্যবহার করবেন না। শান্তভাবে গাড়ি চালান।",8:"ব্রেক নিয়মিত চেক করান। শনিবার দীর্ঘ যাত্রায় বিশেষ সতর্কতা।",9:"অতিরিক্ত গতি এড়িয়ে চলুন। রাগান্বিত অবস্থায় গাড়ি চালাবেন না।"};
    return t[num]||"সাবধানে গাড়ি চালান। ট্রাফিক নিয়ম মেনে চলুন।";
}

function getPhoneCareer(num) {
    const t={1:"নেতৃত্বের পদ, উদ্যোক্তা, প্রশাসনিক কাজে এই নম্বর বিশেষ সহায়ক।",2:"সৃজনশীল পেশা, শিল্পকলা, কাউন্সেলিং সেবায় এই নম্বর কার্যকর।",3:"শিক্ষকতা, পরামর্শ, আধ্যাত্মিক কাজে এই নম্বর শুভ।",4:"গবেষণা, প্রযুক্তি, বিদেশী বাণিজ্যে এই নম্বর সহায়ক।",5:"মার্কেটিং, সেলস, মিডিয়া কাজে এই নম্বর অত্যন্ত কার্যকর।",6:"শিল্পকলা, বিনোদন, ফ্যাশন শিল্পে এই নম্বর শুভ।",7:"গবেষণা, লেখালেখি, আধ্যাত্মিক কাজে এই নম্বর কার্যকর।",8:"প্রশাসন, ব্যবস্থাপনা, নির্মাণ শিল্পে এই নম্বর শুভ।",9:"উদ্যোক্তা, রাজনীতি, খেলাধুলায় এই নম্বর অত্যন্ত কার্যকর।"};
    return t[num]||"যোগাযোগমূলক পেশায় এই নম্বর বিশেষ কার্যকর।";
}

function getBankStability(num) {
    const t={1:"⭐⭐⭐⭐⭐ অত্যন্ত স্থিতিশীল — দীর্ঘমেয়াদী সঞ্চয়ে আদর্শ।",2:"⭐⭐⭐ মাঝারি স্থিতিশীল — যৌথ মালিকানায় বেশি লাভজনক।",3:"⭐⭐⭐⭐ শিক্ষা ও উন্নয়নমূলক বিনিয়োগে সেরা।",4:"⭐⭐ অস্থিরতার সম্ভাবনা — একাধিক অ্যাকাউন্ট রাখুন।",5:"⭐⭐⭐⭐ দ্রুত লেনদেনে উপযুক্ত — ব্যবসায়িক অ্যাকাউন্ট হিসেবে সেরা।",6:"⭐⭐⭐⭐⭐ অত্যন্ত স্থিতিশীল ও লাভজনক।",7:"⭐⭐⭐ দীর্ঘমেয়াদী সঞ্চয়ে ভালো।",8:"⭐⭐⭐⭐⭐ দীর্ঘমেয়াদে অত্যন্ত স্থিতিশীল।",9:"⭐⭐⭐⭐ শক্তিশালী ও সক্রিয় অ্যাকাউন্ট।"};
    return t[num]||"⭐⭐⭐ মাঝারি স্থিতিশীলতার অ্যাকাউন্ট।";
}

function getPinSecurity(num) {
    const t={1:"🔒 অত্যন্ত শক্তিশালী ও নিরাপদ PIN।",2:"🔑 সাধারণ মানের — নিয়মিত পরিবর্তন করুন।",3:"🔒 ভাগ্যবান ও নিরাপদ PIN।",4:"⚠️ মাঝারি — প্রতি ৩ মাসে পরিবর্তন করুন।",5:"🔑 চঞ্চল প্রকৃতির — প্রতি মাসে পরিবর্তন করুন।",6:"🔒 স্থিতিশীল ও নিরাপদ PIN।",7:"🔐 অত্যন্ত গোপনীয় — কেউ সহজে অনুমান করতে পারবে না।",8:"🔒 শক্তিশালী ও দীর্ঘস্থায়ী নিরাপত্তা।",9:"🔒 সাহসী ও কার্যকর নিরাপত্তা।"};
    return t[num]||"🔑 নিরাপদ PIN। নিয়মিত পরিবর্তন করুন।";
}

function getPinLuck(num) {
    const t={1:"আত্মবিশ্বাস ও সাফল্য বৃদ্ধি করবে।",2:"মানসিক শান্তি ও সৃজনশীলতা দেবে।",3:"জ্ঞান ও সৌভাগ্য বৃদ্ধি করবে।",4:"সতর্কতা প্রয়োজন — হঠকারী সিদ্ধান্ত এড়িয়ে চলুন।",5:"দ্রুত সিদ্ধান্ত ও ব্যবসায়িক সাফল্য আনবে।",6:"সুখ ও সমৃদ্ধি বাড়াবে।",7:"আধ্যাত্মিক উন্নতি ও অন্তর্দৃষ্টি দেবে।",8:"ধৈর্য ও দীর্ঘমেয়াদী সাফল্য নিশ্চিত করবে।",9:"সাহস ও শক্তি বৃদ্ধি করবে।"};
    return t[num]||"ভাগ্যের উপর ইতিবাচক প্রভাব ফেলবে।";
}

function getStockTip(num) {
    const t={1:"সরকারি খাত, প্রশাসন-সম্পর্কিত কোম্পানিতে দীর্ঘমেয়াদী বিনিয়োগ শুভ।",2:"ভোক্তা পণ্য, FMCG ও হোটেল খাতে বিনিয়োগ শুভ।",3:"শিক্ষা, স্বাস্থ্যসেবা ও প্রকাশনা খাতে বিনিয়োগ শুভ।",4:"প্রযুক্তি ও আন্তর্জাতিক শেয়ারে বিনিয়োগ করুন। হঠকারী সিদ্ধান্ত এড়িয়ে চলুন।",5:"মিডিয়া, টেলিকম ও স্বল্পমেয়াদী ট্রেডিংয়ে সাফল্য।",6:"বিনোদন, হোটেল ও ফ্যাশন খাতে বিনিয়োগ শুভ।",7:"ফার্মাসিউটিক্যাল ও গবেষণা খাতে দীর্ঘমেয়াদী বিনিয়োগ শুভ।",8:"রিয়েল এস্টেট, নির্মাণ ও অবকাঠামো খাতে দীর্ঘমেয়াদী বিনিয়োগ।",9:"প্রতিরক্ষা, স্পোর্টস ও শক্তি খাতে বিনিয়োগ শুভ।"};
    return t[num]||"বিনিয়োগের আগে গবেষণা করুন। বিশেষজ্ঞের পরামর্শ নিন।";
}

function getStockTime(num) {
    const t={1:"রবিবার বা সূর্যোদয়ের সময় শেয়ার কেনাবেচা শুভ।",2:"সোমবার বা পূর্ণিমার কাছাকাছি সময় শুভ।",3:"বৃহস্পতিবার সকালে শেয়ার কেনাবেচা শুভ।",4:"শনিবার বিকেলে সিদ্ধান্ত নিন।",5:"বুধবার দুপুরে শেয়ার কেনাবেচা শুভ।",6:"শুক্রবার সন্ধ্যায় শুভ।",7:"রবি বা সোমবার ভোরে সিদ্ধান্ত নিন।",8:"শনিবার দীর্ঘমেয়াদী সিদ্ধান্ত নিন।",9:"মঙ্গলবার দুপুরে শেয়ার কেনাবেচা শুভ।"};
    return t[num]||"শুভ দিন ও সময়ে লেনদেন করলে ভালো ফলাফল পাওয়া যায়।";
}

function getPropertyTip(num) {
    const t={1:"পূর্বমুখী বা প্রধান সড়কের পাশের সম্পত্তি শুভ।",2:"জলের ধারে বা শান্ত আবাসিক এলাকায় সম্পত্তি শুভ।",3:"শিক্ষাপ্রতিষ্ঠানের কাছে সম্পত্তি বিনিয়োগে ভালো রিটার্ন।",4:"প্রযুক্তি অঞ্চল বা বিশেষ অর্থনৈতিক অঞ্চলে সম্পত্তি শুভ।",5:"বাণিজ্যিক এলাকায় সম্পত্তি — ভাড়া আয়ে ভালো সম্ভাবনা।",6:"সৌন্দর্যপূর্ণ পরিবেশে পারিবারিক বাসস্থানের জন্য আদর্শ।",7:"শান্ত ও প্রাকৃতিক পরিবেশে সম্পত্তি বিনিয়োগ শুভ।",8:"শিল্প এলাকা বা নির্মাণস্থলে দীর্ঘমেয়াদী বিনিয়োগ লাভজনক।",9:"শক্তিশালী অবস্থানে বাণিজ্যিক সম্পত্তি — বিক্রয়যোগ্যতা ভালো।"};
    return t[num]||"শুভ দিকের সম্পত্তি নির্বাচন করুন এবং আইনি যাচাই করুন।";
}

function getPropertyGrowth(num) {
    const t={1:"৩-৫ বছরে দ্বিগুণ হওয়ার সম্ভাবনা। শহুরে এলাকায় বিশেষ সাফল্য।",2:"২-৩ বছরে ভালো মূল্যবৃদ্ধি। পারিবারিক বাড়িতে বিনিয়োগ লাভজনক।",3:"৪-৫ বছরে স্থিতিশীল মূল্যবৃদ্ধি। শিক্ষা অঞ্চলে বিশেষ লাভ।",4:"৫-৬ বছরে প্রযুক্তি অঞ্চলে বড় মূল্যবৃদ্ধি।",5:"১-২ বছরে দ্রুত মূল্যবৃদ্ধি। বাণিজ্যিক সম্পত্তিতে বিশেষ লাভ।",6:"৩-৪ বছরে আবাসিক সম্পত্তিতে ভালো মূল্যবৃদ্ধি।",7:"৬-৭ বছরে পরিবেশ-বান্ধব এলাকায় মূল্যবৃদ্ধি।",8:"৭-৮ বছরে শিল্প এলাকায় বড় মূল্যবৃদ্ধি।",9:"৩-৪ বছরে প্রতিযোগিতামূলক এলাকায় দ্রুত মূল্যবৃদ্ধি।"};
    return t[num]||"দীর্ঘমেয়াদী বিনিয়োগ করলে স্থাবর সম্পত্তিতে ভালো লাভ হবে।";
}

function getGoldTip(num) {
    const t={1:"সোনার বার বা কয়েনে দীর্ঘমেয়াদী বিনিয়োগ উত্তম।",2:"রূপার বিনিয়োগ — মুক্তা ও রূপার গহনায় বিনিয়োগ শুভ।",3:"সোনার বিনিয়োগ অত্যন্ত শুভ — পুখরাজ পাথরও বিনিয়োগ করুন।",4:"গোমেদ পাথরে বিনিয়োগ করুন। সোনা কেনার আগে বিশেষজ্ঞ পরামর্শ নিন।",5:"সোনা ও রূপা উভয়ে স্বল্পমেয়াদী বিনিয়োগ লাভজনক।",6:"হীরা ও সোনার গহনায় বিনিয়োগ শুভ — বিনিয়োগ ও সৌন্দর্য উভয়ই।",7:"বৈদুর্য্য পাথরে বিনিয়োগ করুন। সোনার বারে দীর্ঘমেয়াদী বিনিয়োগ শুভ।",8:"নীলা পাথরে বিনিয়োগ করুন। সোনার বারে ধৈর্যের সাথে বিনিয়োগ করুন।",9:"প্রবাল ও সোনায় বিনিয়োগ শুভ। সাহসী বিনিয়োগে লাভ।"};
    return t[num]||"সোনা ও রূপায় দীর্ঘমেয়াদী বিনিয়োগ সর্বদাই লাভজনক।";
}

function getGoldTime(num, data) {
    return `${data.luckyDay} দিনে সোনা-রূপা কেনা বিশেষ শুভ। সকালের দিকে কেনা ভালো। ${data.planet}-এর শুভ সময়ে ধাতু কিনলে বিশেষ ফল পাবেন।`;
}

// ============================================================
// AUTO-DETECT CATEGORY
// ============================================================
function autoDetectCategory(input) {
    if (!input) return 'personal_name';
    const type = NumberUtils.detectType(input.trim());
    switch(type) {
        case 'date':     return 'mulank';
        case 'mobile':   return 'mobile_number';
        case 'vehicle':  return 'car_number';
        case 'price':    return 'product_price';
        case 'business': return 'business_name';
        case 'name':     return 'personal_name';
        case 'pin':      return 'pin_code';
        case 'bank':     return 'bank_account';
        case 'number':   return 'name_number';
        default:         return 'personal_name';
    }
}

// ============================================================
// CATEGORY LIST
// ============================================================
const categories = [
    {id:"personal_name", name:"👤 ব্যক্তির নাম",       icon:"fa-user"},
    {id:"baby_name",     name:"🍼 শিশুর নাম",           icon:"fa-baby"},
    {id:"marriage",      name:"💍 বিবাহ মিলন",           icon:"fa-heart"},
    {id:"love",          name:"❤️ প্রেম মিলন",            icon:"fa-heartbeat"},
    {id:"family",        name:"👨‍👩‍👧 পরিবার মিলন",     icon:"fa-users"},
    {id:"journey_date",  name:"✈️ শুভ যাত্রার দিন",     icon:"fa-calendar-check"},
    {id:"new_home",      name:"🏠 নতুন বাড়ি",           icon:"fa-home"},
    {id:"birthday",      name:"🎂 জন্মদিন বিশ্লেষণ",    icon:"fa-birthday-cake"},
    {id:"business_name", name:"🏢 ব্যবসার নাম",           icon:"fa-building"},
    {id:"partnership",   name:"🤝 অংশীদারিত্ব মিলন",    icon:"fa-handshake"},
    {id:"startup_name",  name:"🚀 স্টার্টআপ নাম",        icon:"fa-rocket"},
    {id:"logo_color",    name:"🎨 লোগো রঙ নির্বাচন",    icon:"fa-palette"},
    {id:"launch_date",   name:"📈 ব্যবসা উদ্বোধনের তারিখ",icon:"fa-calendar-alt"},
    {id:"product_price", name:"💰 পণ্যের মূল্য নির্ধারণ",icon:"fa-tag"},
    {id:"car_number",    name:"🚗 গাড়ির নম্বর",          icon:"fa-car"},
    {id:"bike_number",   name:"🏍️ বাইক নম্বর",           icon:"fa-motorcycle"},
    {id:"mobile_number", name:"📱 মোবাইল নম্বর",         icon:"fa-mobile-alt"},
    {id:"bank_account",  name:"💳 ব্যাংক অ্যাকাউন্ট",   icon:"fa-university"},
    {id:"pin_code",      name:"🔢 PIN কোড",               icon:"fa-lock"},
    {id:"stock_market",  name:"📊 শেয়ার বাজার",          icon:"fa-chart-line"},
    {id:"property",      name:"🏘️ সম্পত্তি বিনিয়োগ",   icon:"fa-landmark"},
    {id:"gold_silver",   name:"✨ সোনা/রূপা বিনিয়োগ",   icon:"fa-gem"},
    {id:"mulank",        name:"🔮 মূলাংক বিশ্লেষণ",      icon:"fa-star"},
    {id:"name_number",   name:"📖 নামের অংক",             icon:"fa-book"}
];

// ============================================================
// SHOW CATEGORY SELECTION
// ============================================================
function showCategorySelection() {
    const contentDiv = document.getElementById('resultContent');
    const loadingDiv = document.getElementById('loading');

    let optHtml = '<div class="option-buttons">';
    categories.forEach(cat => {
        optHtml += `<button class="option-btn" onclick="selectAndShowResult('${cat.id}')"><i class="fas ${cat.icon}"></i> ${cat.name}</button>`;
    });
    optHtml += '</div>';

    contentDiv.innerHTML = `
        <div class="clarification-card">
            <i class="fas fa-question-circle" style="font-size:64px;color:var(--gold3)"></i>
            <h2 style="margin:16px 0 10px">"${escapeHtml(currentRawInput)}"</h2>
            <p style="margin-bottom:20px;font-size:17px;color:#8aabcb">এই তথ্যটি কোন ধরনের বিশ্লেষণের জন্য? একটি ক্যাটাগরি বেছে নিন:</p>
            ${optHtml}
        </div>`;
    contentDiv.style.display = 'block';
    if (loadingDiv) loadingDiv.style.display = 'none';
}

// ============================================================
// SELECT AND SHOW RESULT
// ============================================================
function selectAndShowResult(categoryId) {
    const numberData = currentNumberData;
    if (!numberData) return;

    const analysis = NumerologyDB.getNumberAnalysis(numberData.rootNumber);
    if (!analysis) {
        document.getElementById('resultContent').innerHTML = `
            <div class="result-card error-card">
                <i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--gold3)"></i>
                <h2>বিশ্লেষণ পাওয়া যায়নি</h2>
                <p>দুঃখিত, এই সংখ্যার বিশ্লেষণ পাওয়া যায়নি।</p>
                <a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a>
            </div>`;
        return;
    }

    const n = numberData.rootNumber;
    let resultHtml = '';

    switch(categoryId) {
        case 'personal_name':  resultHtml = renderPersonalName(currentRawInput, n, analysis); break;
        case 'baby_name':      resultHtml = renderBabyName(currentRawInput, n, analysis); break;
        case 'marriage':       resultHtml = renderMarriage(currentRawInput, n, analysis); break;
        case 'love':           resultHtml = renderLove(currentRawInput, n, analysis); break;
        case 'family':         resultHtml = renderFamily(currentRawInput, n, analysis); break;
        case 'journey_date':   resultHtml = renderJourneyDate(currentRawInput, n, analysis); break;
        case 'new_home':       resultHtml = renderNewHome(currentRawInput, n, analysis); break;
        case 'birthday':       resultHtml = renderBirthday(currentRawInput, n, analysis); break;
        case 'business_name':  resultHtml = renderBusinessName(currentRawInput, n, analysis); break;
        case 'partnership':    resultHtml = renderPartnership(currentRawInput, n, analysis); break;
        case 'startup_name':   resultHtml = renderStartupName(currentRawInput, n, analysis); break;
        case 'logo_color':     resultHtml = renderLogoColor(currentRawInput, n, analysis); break;
        case 'launch_date':    resultHtml = renderLaunchDate(currentRawInput, n, analysis); break;
        case 'product_price':  resultHtml = renderProductPrice(currentRawInput, n, analysis); break;
        case 'car_number':     resultHtml = renderCarNumber(currentRawInput, n, analysis); break;
        case 'bike_number':    resultHtml = renderBikeNumber(currentRawInput, n, analysis); break;
        case 'mobile_number':  resultHtml = renderMobileNumber(currentRawInput, n, analysis); break;
        case 'bank_account':   resultHtml = renderBankAccount(currentRawInput, n, analysis); break;
        case 'pin_code':       resultHtml = renderPinCode(currentRawInput, n, analysis); break;
        case 'stock_market':   resultHtml = renderStockMarket(currentRawInput, n, analysis); break;
        case 'property':       resultHtml = renderProperty(currentRawInput, n, analysis); break;
        case 'gold_silver':    resultHtml = renderGoldSilver(currentRawInput, n, analysis); break;
        case 'mulank':         resultHtml = renderMulank(currentRawInput, n, analysis); break;
        case 'name_number':    resultHtml = renderNameNumber(currentRawInput, n, analysis); break;
        default:               resultHtml = renderPersonalName(currentRawInput, n, analysis);
    }

    resultHtml += `
        <div style="margin-top:20px">
            <a href="numerology.html" class="back-btn"><i class="fas fa-arrow-left"></i> নতুন অনুসন্ধান</a>
        </div>
        <div class="share-buttons">
            <button class="share-btn" onclick="copyResult()"><i class="fas fa-copy"></i> কপি করুন</button>
            <button class="share-btn" onclick="shareResult()"><i class="fas fa-share-alt"></i> শেয়ার করুন</button>
            <button class="share-btn" onclick="window.print()"><i class="fas fa-print"></i> প্রিন্ট করুন</button>
        </div>`;

    document.getElementById('resultContent').innerHTML = resultHtml;
    document.getElementById('resultContent').style.display = 'block';
    if (document.getElementById('loading')) document.getElementById('loading').style.display = 'none';
}

// ============================================================
// UTILITIES
// ============================================================
function copyResult() {
    const t = document.getElementById('resultContent')?.innerText || '';
    if (t) {
        navigator.clipboard.writeText(t).then(() => alert('✅ ফলাফল কপি হয়েছে!')).catch(()=>{});
    }
}

function shareResult() {
    const t = document.getElementById('resultContent')?.innerText || '';
    if (navigator.share && t) {
        navigator.share({title:'MyAstrology — সংখ্যা জ্যোতিষ', text:t.substring(0,500), url:window.location.href});
    } else {
        copyResult();
    }
}

// ============================================================
// MULTI-INPUT DETECTION & PARSING
// ============================================================
function isExplicitMultiInput(input) {
    if (!input) return false;
    // + চিহ্ন বা এবং/and কীওয়ার্ড থাকলে multi-input
    const hasConnector = /[\+\&\|]|(\s+এবং\s+)|(\s+and\s+)/i.test(input);
    if (!hasConnector) return false;
    const parts = input.split(/[\+\&\|]|\s+(?:এবং|and)\s+/i).filter(p=>p.trim().length>0);
    return parts.length >= 2;
}

function parseMultiInput(input) {
    const parts = input.split(/[\+\&\|]|\s+(?:এবং|and)\s+/i).filter(p=>p.trim().length>0);
    if (parts.length < 2) return [];
    const result = [];
    for (let part of parts) {
        const trimmed = part.trim();
        const numberData = NumberUtils.extractNumber(trimmed);
        if (numberData && numberData.rootNumber) {
            result.push({
                raw: trimmed,
                type: NumberUtils.detectType(trimmed),
                number: numberData.rootNumber,
                fullData: numberData
            });
        }
    }
    return result;
}

function renderMultiResult(input, items, numbers) {
    const renderData = CompatibilityCore.prepareRenderData(input, items, numbers);
    if (!renderData) {
        return `<div class="result-card error-card">
            <i class="fas fa-exclamation-triangle" style="font-size:48px;color:var(--gold3)"></i>
            <h2>ক্ষমা করবেন!</h2>
            <p>সামঞ্জস্য বিশ্লেষণের জন্য কমপক্ষে ২টি উপাদান প্রয়োজন।</p>
            <a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a>
        </div>`;
    }
    // CompatibilityRenderer.render() already includes share buttons via renderShareButtons()
    // So we ONLY add the back button here — NO duplicate share buttons
    return CompatibilityRenderer.render(renderData) + `
        <div style="margin-top:16px;text-align:center">
            <a href="numerology.html" class="back-btn">
                <i class="fas fa-arrow-left"></i> নতুন অনুসন্ধান
            </a>
        </div>`;
}

// ============================================================
// MAIN — DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const query = getQueryParam('q');
    const catHint = getQueryParam('cat');

    if (!query) {
        window.location.href = 'numerology.html';
        return;
    }

    currentRawInput = decodeURIComponent(query);

    const contentDiv = document.getElementById('resultContent');
    const loadingDiv = document.getElementById('loading');

    // ── মাল্টি-ইনপুট চেক ──
    if (isExplicitMultiInput(currentRawInput)) {
        const items = parseMultiInput(currentRawInput);
        if (items.length >= 2) {
            const resultHtml = renderMultiResult(
                currentRawInput,
                items.map(i=>i.raw),
                items.map(i=>i.number)
            );
            if (contentDiv) { contentDiv.innerHTML = resultHtml; contentDiv.style.display = 'block'; }
            if (loadingDiv) loadingDiv.style.display = 'none';
            return;
        }
    }

    // ── সিঙ্গেল ইনপুট ──
    currentNumberData = NumberUtils.extractNumber(currentRawInput);

    if (!currentNumberData || !currentNumberData.rootNumber) {
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div class="result-card error-card">
                    <i class="fas fa-exclamation-triangle" style="font-size:64px;color:var(--gold3)"></i>
                    <h2>ক্ষমা করবেন!</h2>
                    <p>"${escapeHtml(currentRawInput)}" — এতে বিশ্লেষণযোগ্য কোনো তথ্য পাওয়া যায়নি।</p>
                    <a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a>
                </div>`;
            contentDiv.style.display = 'block';
        }
        if (loadingDiv) loadingDiv.style.display = 'none';
        return;
    }

    // ক্যাটাগরি হিন্ট থাকলে সরাসরি দেখাও
    if (catHint) {
        selectAndShowResult(catHint);
        return;
    }

    // যুক্তিপূর্ণ ইনপুট → সরাসরি রেজাল্ট
    if (NumberUtils.isMeaningful(currentRawInput)) {
        const category = autoDetectCategory(currentRawInput);
        selectAndShowResult(category);
        return;
    }

    // যুক্তিহীন ইনপুট → ২৪টি ক্যাটাগরি দেখাও
    if (loadingDiv) loadingDiv.style.display = 'none';
    showCategorySelection();
});
