// ============================================================
// main.js - সম্পূর্ণ সংশোধিত
// ============================================================

let currentRawInput = '';
let currentNumberData = null;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ============================================================
// ২৪টি ক্যাটাগরির রেন্ডারার ফাংশন
// ============================================================

// 1. ব্যক্তির নাম
function renderPersonalName(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">${data.identity.title}</h1>
            <p class="result-subtitle">${data.planet} | ব্যক্তির নামের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-star"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge">🎨 শুভ রং: ${data.luckyColor}</span>
                <span class="badge">📅 শুভ দিন: ${data.luckyDay}</span>
                <span class="badge">🧭 শুভ দিক: ${data.luckyDirection}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>👤 ব্যক্তিত্ব ও স্বভাব</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3>💼 ক্যারিয়ার ও পেশা</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3>✨ জ্যোতিষীয় প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>
    `;
}

// 2. শিশুর নাম
function renderBabyName(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">শিশুর নামের অংক: ${number}</h1>
            <p class="result-subtitle">${data.planet} | শিশুর সম্ভাব্য ব্যক্তিত্ব</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-baby"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🍼 শিশুর সম্ভাব্য ব্যক্তিত্ব</h3><p>${escapeHtml(data.identity.description.substring(0, 300))}</p></div>
            <div class="info-section"><h3>📚 শিক্ষা ও ভবিষ্যৎ</h3><p>${getBabyFutureTip(number)}</p></div>
        </div>
    `;
}

// 3. বিবাহ মিলন
function renderMarriage(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">বিবাহ মিলন বিশ্লেষণ</h1>
            <p class="result-subtitle">${data.planet} | সামঞ্জস্যের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-heart"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>💑 সামঞ্জস্যের বিশ্লেষণ</h3><p>${getMarriageTip(number)}</p></div>
            <div class="info-section"><h3>📝 পরামর্শ</h3><p>${getMarriageAdvice(number)}</p></div>
        </div>
    `;
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
            <p class="result-subtitle">${data.planet} | পারিবারিক সামঞ্জস্যের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-users"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🏠 পারিবারিক সামঞ্জস্য</h3><p>${getFamilyTip(number)}</p></div>
            <div class="info-section"><h3>🕊️ পারিবারিক শান্তির উপায়</h3><p>${getFamilyPeace(number)}</p></div>
        </div>
    `;
}

// 6. শুভ যাত্রার দিন
function renderJourneyDate(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">শুভ যাত্রার দিন বিশ্লেষণ</h1>
            <p class="result-subtitle">${data.planet} | যাত্রার অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-calendar-check"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getTravelDesc(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge">📅 শুভ দিন: ${data.luckyDay}</span>
                <span class="badge">🧭 শুভ দিক: ${data.luckyDirection}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>✈️ যাত্রার শুভ সময়</h3><p>${getJourneyTime(number)}</p></div>
            <div class="info-section"><h3>🕯️ যাত্রার পূর্বে করণীয়</h3><p>${getJourneyRitual(number)}</p></div>
        </div>
    `;
}

// 7. নতুন বাড়ি
function renderNewHome(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">বাড়ির নম্বর: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${data.planet} | বসবাসের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-home"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getHomeDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🏡 বাড়ির প্রভাব ও পরিবেশ</h3><p>${getHomeInfluence(number)}</p></div>
            <div class="info-section"><h3>🕊️ পারিবারিক শান্তি ও স্থিতিশীলতা</h3><p>${getHomePeace(number)}</p></div>
            <div class="info-section"><h3>✨ বাড়ির জন্য প্রতিকার</h3><p>${getHomeRemedy(number, data)}</p></div>
        </div>
    `;
}

// 8. জন্মদিন বিশ্লেষণ
function renderBirthday(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">${data.identity.title}</h1>
            <p class="result-subtitle">${data.planet} | জন্মদিনের অংক বিশ্লেষণ</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-birthday-cake"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🎂 জন্মদিনের বিশেষ বৈশিষ্ট্য</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3>📈 জীবনের গুরুত্বপূর্ণ সময়</h3><p>${getLifeMilestones(number)}</p></div>
        </div>
    `;
}

// 9. ব্যবসার নাম
function renderBusinessName(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">"${escapeHtml(input)}"</h1>
            <p class="result-subtitle">${data.planet} | ব্যবসার নামের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-chart-line"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge">🎨 শুভ রং: ${data.luckyColor}</span>
                <span class="badge">📅 শুভ দিন: ${data.luckyDay}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>📊 ব্যবসার সম্ভাবনা ও ধরণ</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3>🤝 অংশীদারিত্বের পরামর্শ</h3><p>${getPartnerAdvice(number)}</p></div>
            <div class="info-section"><h3>🏆 সাফল্যের মূলমন্ত্র</h3><p>${getSuccessMantra(number)}</p></div>
        </div>
    `;
}

// 10. অংশীদারিত্ব মিলন
function renderPartnership(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">অংশীদারিত্ব মিলন বিশ্লেষণ</h1>
            <p class="result-subtitle">${data.planet} | ব্যবসায়িক সামঞ্জস্যের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-handshake"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🤝 অংশীদারিত্বের সামঞ্জস্য</h3><p>${getPartnerCompatibility(number)}</p></div>
            <div class="info-section"><h3>📈 সাফল্যের সম্ভাবনা</h3><p>${getPartnerSuccess(number)}</p></div>
        </div>
    `;
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
            <h1 class="result-title">লোগো রঙ নির্বাচন</h1>
            <p class="result-subtitle">${data.planet} | ব্র্যান্ড রঙের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-palette"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🎨 প্রাথমিক শুভ রং</h3><p>${data.luckyColor}</p></div>
            <div class="info-section"><h3>🧠 রঙের মনস্তাত্ত্বিক প্রভাব</h3><p>${getColorPsychology(number)}</p></div>
            <div class="info-section"><h3>💡 লোগো ডিজাইন পরামর্শ</h3><p>${getLogoDesign(number)}</p></div>
        </div>
    `;
}

// 13. ব্যবসা উদ্বোধনের তারিখ
function renderLaunchDate(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">ব্যবসা উদ্বোধনের তারিখ বিশ্লেষণ</h1>
            <p class="result-subtitle">${data.planet} | উদ্বোধনের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-calendar-alt"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getBusinessDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>⏰ উদ্বোধনের শুভ সময়</h3><p>${getLaunchTime(number, data)}</p></div>
            <div class="info-section"><h3>🔮 ব্যবসার ভবিষ্যৎ সম্ভাবনা</h3><p>${getLaunchFuture(number)}</p></div>
        </div>
    `;
}

// 14. পণ্যের মূল্য নির্ধারণ
function renderProductPrice(input, number, data) {
    const isGood = [3,6,9].includes(number);
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">মূল্য: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${data.planet} | মূল্য নির্ধারণের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-tag"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPriceDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>📊 বিশ্লেষণ</h3><p>${isGood ? '✅ এই মূল্য শুভ এবং ব্যবসার জন্য অনুকূল।' : '⚠️ এই মূল্যে সতর্কতা প্রয়োজন।'}</p></div>
            <div class="info-section"><h3>💡 বিকল্প মূল্য</h3><p>${getAltPrice(number)}</p></div>
        </div>
    `;
}

// 15. গাড়ির নম্বর
function renderCarNumber(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">গাড়ির নম্বর: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${data.planet} | যাত্রার অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-car"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getTravelDesc(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge">📅 শুভ দিন: ${data.luckyDay}</span>
                <span class="badge">🧭 শুভ দিক: ${data.luckyDirection}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>✈️ যাত্রার শুভ-অশুভ</h3><p>${escapeHtml(data.travel.description)}</p></div>
            <div class="info-section"><h3>🛡️ নিরাপত্তা সতর্কতা</h3><p>${getVehicleSafety(number)}</p></div>
        </div>
    `;
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
            <p class="result-subtitle">${data.planet} | যোগাযোগের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-mobile-alt"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>📞 যোগাযোগের প্রভাব</h3><p>${escapeHtml(data.identity.description.substring(0, 250))}</p></div>
            <div class="info-section"><h3>💼 ক্যারিয়ারের উপর প্রভাব</h3><p>${getPhoneCareer(number)}</p></div>
        </div>
    `;
}

// 18. ব্যাংক অ্যাকাউন্ট
function renderBankAccount(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">ব্যাংক অ্যাকাউন্ট: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${data.planet} | আর্থিক অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-university"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getBankDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>📈 আর্থিক স্থিতিশীলতা</h3><p>${getBankStability(number)}</p></div>
            <div class="info-section"><h3>💰 বিনিয়োগের দিকনির্দেশনা</h3><p>${data.investment.description.substring(0, 250)}</p></div>
        </div>
    `;
}

// 19. PIN কোড
function renderPinCode(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">PIN কোড: ${escapeHtml(input)}</h1>
            <p class="result-subtitle">${data.planet} | নিরাপত্তার অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-lock"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPinDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🛡️ নিরাপত্তা বিশ্লেষণ</h3><p>${getPinSecurity(number)}</p></div>
            <div class="info-section"><h3>🍀 ভাগ্যের উপর প্রভাব</h3><p>${getPinLuck(number)}</p></div>
        </div>
    `;
}

// 20. শেয়ার বাজার
function renderStockMarket(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">শেয়ার বাজার বিশ্লেষণ</h1>
            <p class="result-subtitle">${data.planet} | বিনিয়োগের অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-chart-line"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>📊 বিনিয়োগের শুভ-অশুভ</h3><p>${getStockTip(number)}</p></div>
            <div class="info-section"><h3>⏰ লাভের সম্ভাবনা ও সময়</h3><p>${getStockTime(number)}</p></div>
        </div>
    `;
}

// 21. সম্পত্তি বিনিয়োগ
function renderProperty(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">সম্পত্তি বিনিয়োগ বিশ্লেষণ</h1>
            <p class="result-subtitle">${data.planet} | স্থাবর সম্পত্তির অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-landmark"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>🏘️ সম্পত্তির শুভ-অশুভ</h3><p>${getPropertyTip(number)}</p></div>
            <div class="info-section"><h3>📈 মূল্যবৃদ্ধির সম্ভাবনা</h3><p>${getPropertyGrowth(number)}</p></div>
        </div>
    `;
}

// 22. সোনা/রূপা বিনিয়োগ
function renderGoldSilver(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">সোনা/রূপা বিনিয়োগ বিশ্লেষণ</h1>
            <p class="result-subtitle">${data.planet} | মূল্যবান ধাতুর অংক</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-gem"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>💎 বিনিয়োগের ফলাফল</h3><p>${getGoldTip(number)}</p></div>
            <div class="info-section"><h3>⏰ কেনার শুভ সময়</h3><p>${getGoldTime(number, data)}</p></div>
        </div>
    `;
}

// 23. মূলাংক বিশ্লেষণ
function renderMulank(input, number, data) {
    return `
        <div class="result-header">
            <div class="result-number"><span class="big-number">${number}</span></div>
            <h1 class="result-title">${data.identity.title}</h1>
            <p class="result-subtitle">${data.planet} | মূলাংক বিশ্লেষণ</p>
        </div>
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge"><i class="fas fa-star"></i> মূল সংখ্যা: ${number} — ${data.planet}</span>
            </div>
            <p>${getPersonalDesc(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3>👤 ব্যক্তিত্ব ও স্বভাব</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3>💼 ক্যারিয়ার ও পেশা</h3><p>${escapeHtml(data.business.description)}</p></div>
        </div>
    `;
}

// 24. নামের অংক
function renderNameNumber(input, number, data) {
    return renderPersonalName(input, number, data);
}

// ============================================================
// হেল্পার ফাংশন (DESCRIPTIONS)
// ============================================================

function getPersonalDesc(num, data) {
    const desc = {
        1: "সূর্য গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি জন্মগতভাবে নেতৃত্বের গুণে ভূষিত হন। আত্মবিশ্বাস, সৃজনশীলতা ও উদ্ভাবনী শক্তি আপনার প্রধান বৈশিষ্ট্য।",
        2: "চন্দ্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত আবেগপ্রবণ, কল্পনাপ্রবণ ও সৃজনশীল হন। মানুষের মন বুঝতে আপনার সেরা ক্ষমতা রয়েছে।",
        3: "বৃহস্পতি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত জ্ঞানী, আশাবাদী ও আধ্যাত্মিক হন। শিক্ষক, গুরু বা পরামর্শকের মতো মানুষ আপনাকে ভক্তি করে।",
        4: "রাহু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত রহস্যময়, গভীর চিন্তাবিদ ও উদ্ভাবক হন। সাধারণের পথে চলতে চান না, নতুন পথ তৈরি করতে ভালোবাসেন।",
        5: "বুধ গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত বুদ্ধিমান, চটপটে ও যোগাযোগ দক্ষ হন। অল্প সময়ে অনেক কাজ করতে পারেন।",
        6: "শুক্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি সৌন্দর্যপ্রিয়, বিলাসবহুল জীবন পছন্দ করেন। শিল্প, সঙ্গীত, নৃত্যে স্বাভাবিক দক্ষতা রাখেন।",
        7: "কেতু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি আধ্যাত্মিক, গভীর চিন্তাবিদ ও গবেষক হন। অদৃশ্য জগতের সাথে যোগাযোগ রাখতে পারেন।",
        8: "শনি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত ধৈর্যশীল, পরিশ্রমী ও দায়িত্বশীল হন। জীবনে সংগ্রাম করে সবকিছু অর্জন করেন।",
        9: "মঙ্গল গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত সাহসী, উদ্যমী ও যোদ্ধা প্রকৃতির হন। যা করতে চান, তা যেকোনো মূল্যে করেন。"
    };
    return desc[num] || `${data.planet} গ্রহের প্রভাবে এই সংখ্যার ব্যক্তি অনন্য বৈশিষ্ট্যের অধিকারী হন।`;
}

function getBusinessDesc(num, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই ব্যবসার নাম অত্যন্ত শক্তিশালী ও নেতৃত্বমূলক। প্রশাসন, রাজনীতি, স্টার্টআপ, টেকনোলজি ফার্মে সফল। লাল ও সোনালি রঙের লোগো ব্যবহার করুন।",
        2: "চন্দ্রের প্রভাবে এই ব্যবসার নামটি জনপ্রিয়তা ও গ্রাহক আকর্ষণে সিদ্ধ। রেস্টুরেন্ট, হোটেল, ট্রাভেল এজেন্সিতে সফল। সাদা ও রূপালি রঙ ব্যবহার করুন।",
        3: "বৃহস্পতির প্রভাবে এই ব্যবসার নামটি জ্ঞান ও বিশ্বাসের প্রতীক। শিক্ষা প্রতিষ্ঠান, কোচিং সেন্টার, আইন সংস্থায় সফল। হলুদ ও সোনালি রঙের লোগো ব্যবহার করুন。",
        4: "রাহুর প্রভাবে এই ব্যবসার নামটি প্রযুক্তি ও গবেষণা নির্ভর ব্যবসার জন্য সেরা। আইটি, সাইবার সিকিউরিটি, ইমপোর্ট-এক্সপোর্টে সফল। নীল ও কালো রঙ ব্যবহার করুন。",
        5: "বুধের প্রভাবে এই ব্যবসার নামটি যোগাযোগ ও বাণিজ্যের জন্য অত্যন্ত শুভ। ট্রেডিং, মার্কেটিং, মিডিয়ায় সফল। সবুজ ও আকাশি রঙ ব্যবহার করুন।",
        6: "শুক্রের প্রভাবে এই ব্যবসার নামটি সৌন্দর্য ও বিলাস দ্রব্যের ব্যবসার জন্য সেরা। কসমেটিকস, ফ্যাশন, জুয়েলারিতে সফল। সাদা, গোলাপি ও হালকা নীল রঙ ব্যবহার করুন।",
        7: "কেতুর প্রভাবে এই ব্যবসার নামটি গবেষণা ও আধ্যাত্মিক ব্যবসার জন্য উত্তম। রিসার্চ সেন্টার, পাবলিশিং হাউসে সফল। হলুদ ও বেগুনি রঙ ব্যবহার করুন。",
        8: "শনির প্রভাবে এই ব্যবসার নামটি শিল্প ও স্থায়ী ব্যবসার জন্য সেরা। ম্যানুফ্যাকচারিং, কনস্ট্রাকশন, রিয়েল এস্টেটে সফল। কালো, নীল ও গাঢ় সবুজ রঙ ব্যবহার করুন。",
        9: "মঙ্গলের প্রভাবে এই ব্যবসার নামটি প্রতিযোগিতামূলক ও শক্তি নির্ভর ব্যবসার জন্য সেরা। কনস্ট্রাকশন, ডিফেন্স, স্পোর্টসে সফল। লাল ও কমলা রঙ ব্যবহার করুন。"
    };
    return desc[num] || `${data.planet} গ্রহের প্রভাবে এই ব্যবসার নামটি সাফল্য এনে দেবে。`;
}

function getTravelDesc(num, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই গাড়ির নম্বরটি অত্যন্ত শক্তিশালী ও শুভ। পূর্ব দিকে যাত্রা করলে সাফল্য। সূর্যোদয়ের সময় যাত্রা শুরু করুন。",
        2: "চন্দ্রের প্রভাবে এই গাড়ির নম্বরটি আবেগপ্রবণ। সোমবারে যাত্রা করলে মঙ্গল। উত্তর-পশ্চিম দিকে যাত্রা করুন। অমাবস্যার দিন যাত্রা এড়িয়ে চলুন।",
        3: "বৃহস্পতির প্রভাবে এই গাড়ির নম্বরটি জ্ঞান ও আশাবাদের প্রতীক। বৃহস্পতিবার যাত্রা করলে মঙ্গল。",
        4: "রাহুর প্রভাবে এই গাড়ির নম্বরটি রহস্যময়। রাতের বেলা যাত্রা এড়িয়ে চলুন। শনিবারে যাত্রা করলে ভালো।",
        5: "বুধের প্রভাবে এই গাড়ির নম্বরটি চঞ্চল। বুধবার যাত্রা করলে মঙ্গল। সিগন্যাল মেনে চলুন。",
        6: "শুক্রের প্রভাবে এই গাড়ির নম্বরটি সৌন্দর্যপ্রিয়। শুক্রবার যাত্রা করলে ভালো。",
        7: "কেতুর প্রভাবে এই গাড়ির নম্বরটি আধ্যাত্মিক। শুক্রবার ও শনিবার যাত্রা করলে মঙ্গল。",
        8: "শনির প্রভাবে এই গাড়ির নম্বরটি ধৈর্যশীল। শনিবার ও মঙ্গলবার যাত্রা করলে ভালো。",
        9: "মঙ্গলের প্রভাবে এই গাড়ির নম্বরটি সাহসী। মঙ্গলবার ও রবিবার যাত্রা করলে মঙ্গল。"
    };
    return desc[num] || `${data.planet} গ্রহের প্রভাবে এই গাড়ির নম্বরটি যাত্রার জন্য মধ্যম ফল দেবে。`;
}

function getHomeDesc(num, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই বাড়ির নম্বরটি অত্যন্ত শক্তিশালী ও শুভ। পূর্ব দিকে মুখ করে প্রধান দরজা রাখুন।",
        2: "চন্দ্রের প্রভাবে এই বাড়ির নম্বরটি আবেগপ্রবণ ও সৃজনশীল। উত্তর-পশ্চিম দিকে জল রাখুন।",
        3: "বৃহস্পতির প্রভাবে এই বাড়ির নম্বরটি জ্ঞান ও শিক্ষার কেন্দ্র। পূর্ব-উত্তর দিকে পূজা ঘর রাখুন।",
        4: "রাহুর প্রভাবে এই বাড়ির নম্বরটি রহস্যময় ও গভীর। দক্ষিণ-পশ্চিম দিকে গাছ লাগান。",
        5: "বুধের প্রভাবে এই বাড়ির নম্বরটি চঞ্চল ও যোগাযোগপ্রবণ। উত্তর দিকে বইয়ের আলমারি রাখুন。",
        6: "শুক্রের প্রভাবে এই বাড়ির নম্বরটি সৌন্দর্যপূর্ণ ও বিলাসবহুল। দক্ষিণ-পূর্ব দিকে শো-পিস রাখুন。",
        7: "কেতুর প্রভাবে এই বাড়ির নম্বরটি আধ্যাত্মিক ও গভীর। উত্তর-পূর্ব দিকে ধ্যানের জায়গা রাখুন。",
        8: "শনির প্রভাবে এই বাড়ির নম্বরটি স্থিতিশীল ও শৃঙ্খলাপূর্ণ। পশ্চিম দিকে অফিসের জায়গা রাখুন。",
        9: "মঙ্গলের প্রভাবে এই বাড়ির নম্বরটি সাহসী ও উদ্যমী। দক্ষিণ দিকে ব্যায়ামের জায়গা রাখুন。"
    };
    return desc[num] || `${data.planet} গ্রহের প্রভাবে এই বাড়ির নম্বরটি বসবাসের জন্য শুভ。`;
}

function getPinDesc(num, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই PIN কোডটি অত্যন্ত শক্তিশালী ও নিরাপদ। লাল রঙের ওয়ালেট ব্যবহার করুন। প্রতি ৩ মাস অন্তর কোড পরিবর্তন করুন।",
        2: "চন্দ্রের প্রভাবে এই PIN কোডটি আবেগপ্রবণ। জন্মতারিখ এড়িয়ে চলুন। সোমবারে কোড পরিবর্তন করুন。",
        3: "বৃহস্পতির আশীর্বাদে এই PIN কোডটি জ্ঞান ও ভাগ্যের প্রতীক। বৃহস্পতিবারে কোড পরিবর্তন করুন。",
        4: "রাহুর প্রভাবে এই PIN কোডটি রহস্যময়। নীল খামে সংরক্ষণ করুন। শনিবারে কোড পরিবর্তন করুন。",
        5: "বুধের প্রভাবে এই PIN কোডটি চঞ্চল। প্রতি মাসে অন্তত একবার কোড পরিবর্তন করুন。",
        6: "শুক্রের কৃপায় এই PIN কোডটি সৌন্দর্যের প্রতীক। শুক্রবারে কোড পরিবর্তন করুন。",
        7: "কেতুর প্রভাবে এই PIN কোডটি আধ্যাত্মিক ও গভীর। বেগুনি রং ব্যবহার করুন।",
        8: "শনির প্রভাবে এই PIN কোডটি অত্যন্ত শক্তিশালী। শনিবারে কোড পরিবর্তন করুন。",
        9: "মঙ্গলের প্রভাবে এই PIN কোডটি সাহসী। মঙ্গলবারে কোড পরিবর্তন করুন。"
    };
    return desc[num] || `${data.planet} গ্রহের প্রভাবে এই PIN কোডটি মাঝারি নিরাপত্তা প্রদান করে。`;
}

function getBankDesc(num, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অত্যন্ত স্থিতিশীল। দীর্ঘমেয়াদী সঞ্চয়ের জন্য উত্তম।",
        2: "চন্দ্রের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি মাঝারি স্থিতিশীল। যৌথ মালিকানা বেশি লাভজনক。",
        3: "বৃহস্পতির প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি শিক্ষা সংক্রান্ত বিনিয়োগে সেরা。",
        4: "রাহুর প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অস্থিরতার সম্ভাবনা রাখে। একাধিক অ্যাকাউন্ট খোলা ভালো。",
        5: "বুধের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি দ্রুত লেনদেন নির্দেশ করে। শেয়ার বাজারে সাফল্য আসে。",
        6: "শুক্রের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অত্যন্ত স্থিতিশীল ও লাভজনক。",
        7: "কেতুর প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি গোপনীয় ও স্থিতিশীল। গবেষণা খাতে বিনিয়োগ করলে লাভ。",
        8: "শনির প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি দীর্ঘমেয়াদে অত্যন্ত স্থিতিশীল。",
        9: "মঙ্গলের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি উদ্যমী ও সক্রিয়。"
    };
    return desc[num] || `${data.planet} গ্রহের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি মাঝারি স্থিতিশীলতা প্রদান করে。`;
}

function getPriceDesc(num, data) {
    const isGood = [3,6,9].includes(num);
    if (isGood) {
        return `${data.planet} গ্রহের প্রভাবে এই মূল্যটি অত্যন্ত শুভ ও ব্যবসার জন্য অনুকূল। এই সংখ্যার কম্পন আর্থিক স্থিতিশীলতা ও লাভের সম্ভাবনা বৃদ্ধি করে।`;
    } else {
        return `${data.planet} গ্রহের প্রভাবে এই মূল্যটি সতর্কতা প্রয়োজন। বিকল্প মূল্য হিসেবে ৩, ৬, ৯ সংখ্যার দাম নির্বাচন করলে লাভের সম্ভাবনা বাড়ে。`;
    }
}

// ============================================================
// হেল্পার ফাংশন (TIPS)
// ============================================================

function getBabyFutureTip(num) {
    const tips = {1:"নেতৃত্ব গুণাবলী বিকশিত হবে",2:"সৃজনশীল ও কল্পনাপ্রবণ হবে",3:"জ্ঞানী ও পণ্ডিত হবে",4:"গবেষক ও উদ্ভাবক হবে",5:"যোগাযোগে দক্ষ ও বুদ্ধিমান হবে",6:"শিল্পী ও সৌন্দর্যপ্রিয় হবে",7:"আধ্যাত্মিক ও গভীর চিন্তাবিদ হবে",8:"ধৈর্যশীল ও দায়িত্বশীল হবে",9:"সাহসী ও উদ্যমী হবে"};
    return tips[num] || "সুপ্রতিভ ও সফল হবে।";
}

function getMarriageTip(num) {
    const tips = {1:"সূর্যের প্রভাবে নেতৃত্বগুণী। আদর্শ সঙ্গী ১,৩,৯",2:"চন্দ্রের প্রভাবে আবেগপ্রবণ। আদর্শ সঙ্গী ২,৬,৭",3:"বৃহস্পতির প্রভাবে জ্ঞানী। আদর্শ সঙ্গী ৩,৬,৯",4:"রাহুর প্রভাবে রহস্যময়। আদর্শ সঙ্গী ৪,৮,১",5:"বুধের প্রভাবে বুদ্ধিমান। আদর্শ সঙ্গী ৫,৩,৬",6:"শুক্রের প্রভাবে সৌন্দর্যপ্রিয়। আদর্শ সঙ্গী ৬,২,৩",7:"কেতুর প্রভাবে আধ্যাত্মিক। আদর্শ সঙ্গী ৭,২,৯",8:"শনির প্রভাবে ধৈর্যশীল। আদর্শ সঙ্গী ৮,৪,১",9:"মঙ্গলের প্রভাবে সাহসী। আদর্শ সঙ্গী ৯,১,৩"};
    return tips[num] || "সামঞ্জস্য ভালো। সম্পর্কের উন্নয়ন সম্ভব।";
}

function getMarriageAdvice(num) {
    const advices = {1:"অহংকার নিয়ন্ত্রণ করুন",2:"আবেগ নিয়ন্ত্রণ করুন",3:"অতিরিক্ত আশাবাদ এড়িয়ে চলুন",4:"অস্থিরতা নিয়ন্ত্রণ করুন",5:"চঞ্চলতা কমিয়ে দিন",6:"অতিরিক্ত বিলাসিতা এড়িয়ে চলুন",7:"একাকীত্ব কাটিয়ে উঠুন",8:"কর্মব্যস্ততার মধ্যে সঙ্গীকে সময় দিন",9:"রাগ নিয়ন্ত্রণ করুন"};
    return advices[num] || "সঙ্গীর সাথে সময় কাটান।";
}

function getFamilyTip(num) {
    const tips = {1:"নেতৃত্বের গুণ থাকবে",2:"আবেগপ্রবণ ও সৃজনশীল হবে",3:"জ্ঞানী ও আশাবাদী হবে",4:"গভীরতা ও গবেষণার মনোভাব থাকবে",5:"চঞ্চল ও যোগাযোগপ্রবণ হবে",6:"সৌন্দর্যপ্রিয় ও সম্পর্কপ্রিয় হবে",7:"আধ্যাত্মিক ও গভীর হবে",8:"দায়িত্বশীল ও স্থিতিশীল হবে",9:"সাহসী ও উদ্যমী হবে"};
    return tips[num] || "পরিবারের সদস্যদের মধ্যে বোঝাপড়া বজায় রাখুন।";
}

function getFamilyPeace(num) {
    const tips = {1:"রবিবারে পরিবারের সাথে সময় কাটান",2:"সোমবারে একসাথে খাবার খান",3:"বৃহস্পতিবারে ধর্মীয় অনুষ্ঠান করুন",4:"শনিবারে একসাথে প্রকৃতিতে সময় কাটান",5:"বুধবারে একসাথে নতুন কিছু শিখুন",6:"শুক্রবারে একসাথে শিল্পচর্চা করুন",7:"শুক্রবারে একসাথে ধ্যান করুন",8:"শনিবারে একসাথে পরিকল্পনা করুন",9:"মঙ্গলবারে একসাথে খেলাধুলা করুন"};
    return tips[num] || "পরিবারের সাথে নিয়মিত সময় কাটান।";
}

function getJourneyTime(num) {
    const times = {1:"সকাল ৬-৮টা",2:"সন্ধ্যা ৬-৮টা",3:"সকাল ৮-১০টা",4:"সন্ধ্যা ৬টার পর",5:"দুপুর ১২-২টা",6:"সন্ধ্যার সময়",7:"ভোর ৪-৬টা",8:"সূর্যাস্তের পর",9:"দুপুর ১২-৩টা"};
    return times[num] || "সকালের দিকে যাত্রা শুরু করলে ভালো।";
}

function getJourneyRitual(num) {
    const rituals = {1:"সূর্যকে নমস্কার জানিয়ে যাত্রা শুরু করুন",2:"চাঁদকে স্মরণ করে যাত্রা শুরু করুন",3:"গুরুকে স্মরণ করে যাত্রা শুরু করুন",4:"যাত্রার আগে ধূপ জ্বালিয়ে নিন",5:"যাত্রার আগে সবুজ শাক দান করুন",6:"যাত্রার আগে সুগন্ধি ব্যবহার করুন",7:"যাত্রার আগে ধ্যান করুন",8:"যাত্রার আগে গরীবকে খাবার দান করুন",9:"যাত্রার আগে লাল চন্দন লাগান"};
    return rituals[num] || "যাত্রার আগে ঈশ্বরের কাছে প্রার্থনা করুন।";
}

function getHomeInfluence(num) {
    const tips = {1:"নেতৃত্ব ও আত্মবিশ্বাস বজায় থাকবে",2:"আবেগ ও সৃজনশীলতা বজায় থাকবে",3:"জ্ঞান ও আশাবাদ বজায় থাকবে",4:"গবেষণা ও গভীরতা থাকবে",5:"যোগাযোগ ও চঞ্চলতা থাকবে",6:"সৌন্দর্য ও বিলাসিতা থাকবে",7:"আধ্যাত্মিকতা ও গভীরতা থাকবে",8:"দায়িত্ব ও স্থিতিশীলতা থাকবে",9:"সাহস ও উদ্যম থাকবে"};
    return tips[num] || "পরিবারের সদস্যদের মধ্যে ভালোবাসা ও শ্রদ্ধা বজায় রাখুন。";
}

function getHomePeace(num) {
    const tips = {1:"পূর্ব দিকে প্রধান দরজা রাখুন",2:"উত্তর-পশ্চিম দিকে জল রাখুন",3:"পূর্ব-উত্তর দিকে পূজা ঘর রাখুন",4:"দক্ষিণ-পশ্চিম দিকে গাছ লাগান",5:"উত্তর দিকে বইয়ের আলমারি রাখুন",6:"দক্ষিণ-পূর্ব দিকে শো-পিস রাখুন",7:"উত্তর-পূর্ব দিকে ধ্যানের জায়গা রাখুন",8:"পশ্চিম দিকে অফিসের জায়গা রাখুন",9:"দক্ষিণ দিকে ব্যায়ামের জায়গা রাখুন"};
    return tips[num] || "বাড়িতে নিয়মিত ধূপ জ্বালান।";
}

function getHomeRemedy(num, data) {
    return `${data.luckyColor} রঙের ব্যবহার বাড়িতে শান্তি বাড়ায়। ${data.luckyDay} দিনে বাড়ির প্রধান দরজায় তোরণ লাগান।`;
}

function getLifeMilestones(num) {
    const milestones = {1:"৩০ বছর",2:"২৫ বছর",3:"২৮ বছর",4:"৩২ বছর",5:"২৭ বছর",6:"২৯ বছর",7:"৩৫ বছর",8:"৪০ বছর",9:"৩৩ বছর"};
    return milestones[num] || "৩৫-৪০ বছর বয়সের মধ্যে জীবনে স্থিতিশীলতা আসবে।";
}

function getPartnerAdvice(num) {
    const tips = {1:"একক মালিকানা শ্রেয়। অংশীদার ১,৩,৯",2:"অংশীদারিত্ব শুভ। অংশীদার ২,৬,৭",3:"অংশীদার ৩,৬,৯",4:"অংশীদার ৪,৮,১",5:"অংশীদার ৫,৩,৬",6:"অংশীদার ৬,২,৩",7:"অংশীদার ৭,২,৯",8:"অংশীদার ৮,৪,১",9:"অংশীদার ৯,১,৩"};
    return tips[num] || "অংশীদার নির্বাচনে সতর্ক থাকুন。";
}

function getSuccessMantra(num) {
    const mantras = {1:"'আমি নেতা, আমি পথপ্রদর্শক'",2:"'সহযোগিতা ও সম্পর্কই মূলধন'",3:"'জ্ঞানই শক্তি, শিক্ষাই পথ'",4:"'গবেষণা ও উদ্ভাবনই সাফল্যের চাবিকাঠি'",5:"'যোগাযোগ ও গতিশীলতাই মূলমন্ত্র'",6:"'সৌন্দর্য ও সম্পর্কই ব্যবসার প্রাণ'",7:"'গুণগত মান ও আধ্যাত্মিকতাই পাথেয়'",8:"'ধৈর্য ও সংগঠনই সাফল্যের মূল'",9:"'সাহস ও উদ্যমই শক্তি'"};
    return mantras[num] || "সৎ ও নিষ্ঠার সাথে কাজ করুন。";
}

function getPartnerCompatibility(num) {
    const tips = {1:"১,৩,৯",2:"২,৬,৭",3:"৩,৬,৯",4:"৪,৮,১",5:"৫,৩,৬",6:"৬,২,৩",7:"৭,২,৯",8:"৮,৪,১",9:"৯,১,৩"};
    return `${tips[num]} সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব করলে সাফল্য আসবে।`;
}

function getPartnerSuccess(num) {
    const tips = {1:"নিজের সিদ্ধান্তে অটল থাকুন",2:"টিম ওয়ার্ক করুন",3:"জ্ঞান বিতরণ করুন",4:"গবেষণা করুন",5:"যোগাযোগ বাড়ান",6:"সৃজনশীল হোন",7:"গুণগত মান বজায় রাখুন",8:"সংগঠিত হোন",9:"উদ্যমী থাকুন"};
    return tips[num] || "সৎ ও নিষ্ঠার সাথে কাজ করুন।";
}

function getColorPsychology(num) {
    const tips = {1:"লাল রং আত্মবিশ্বাস ও নেতৃত্বের প্রতীক",2:"সাদা রং শান্তি ও পবিত্রতার প্রতীক",3:"হলুদ রং জ্ঞান ও আশাবাদের প্রতীক",4:"নীল রং রহস্য ও স্থিতিশীলতার প্রতীক",5:"সবুজ রং সতেজতা ও বৃদ্ধির প্রতীক",6:"গোলাপি রং ভালোবাসা ও সৌন্দর্যের প্রতীক",7:"বেগুনি রং আধ্যাত্মিকতা ও গভীরতার প্রতীক",8:"কালো রং শক্তি ও স্থিতিশীলতার প্রতীক",9:"লাল ও কমলা রং সাহস ও উদ্যমের প্রতীক"};
    return tips[num] || "শুভ রং ব্যবহার করলে ব্র্যান্ডের গ্রহণযোগ্যতা বাড়ে。";
}

function getLogoDesign(num) {
    const tips = {1:"বৃত্তাকার লোগো শুভ",2:"অর্ধচন্দ্রাকার লোগো শুভ",3:"ত্রিকোণাকার লোগো শুভ",4:"বর্গাকার লোগো শুভ",5:"পাঁচকোণা লোগো শুভ",6:"হৃদয়াকার লোগো শুভ",7:"ওঁ-আকৃতির লোগো শুভ",8:"আয়তাকার লোগো শুভ",9:"তারকাকার লোগো শুভ"};
    return tips[num] || "সরল ও স্মরণীয় লোগো ডিজাইন করুন。";
}

function getLaunchTime(num, data) {
    const times = {1:"সকাল ৬-৮টা",2:"সন্ধ্যা ৬-৮টা",3:"সকাল ৮-১০টা",4:"সন্ধ্যা ৬টার পর",5:"দুপুর ১২-২টা",6:"সন্ধ্যা ৫-৭টা",7:"ভোর ৪-৬টা",8:"সন্ধ্যা ৬-৮টা",9:"দুপুর ১২-৩টা"};
    return `${data.luckyDay} দিনে ${times[num]} সময়ে উদ্বোধন করলে সাফল্য আসবে।`;
}

function getLaunchFuture(num) {
    const tips = {1:"৩ বছরেই সাফল্য আসবে",2:"২ বছরেই সাফল্য আসবে",3:"৪ বছরেই সাফল্য আসবে",4:"৫ বছরেই সাফল্য আসবে",5:"২ বছরেই সাফল্য আসবে",6:"৩ বছরেই সাফল্য আসবে",7:"৬ বছরেই সাফল্য আসবে",8:"৭ বছরেই সাফল্য আসবে",9:"৩ বছরেই সাফল্য আসবে"};
    return tips[num] || "সঠিক পরিকল্পনা করলে সাফল্য আসবেই。";
}

function getAltPrice(num) {
    const alts = {1:"১১১, ৫৫৫, ৯৯৯ টাকা",2:"২২২, ৬৬৬, ৮৮৮ টাকা",3:"৩৩৩, ৬৬৬, ৯৯৯ টাকা",4:"৩৩৩, ৬৬৬, ৯৯৯ টাকা",5:"৫৫৫, ১১১, ৭৭৭ টাকা",6:"৬৬৬, ৯৯৯, ৩৩৩ টাকা",7:"৭৭৭, ১১১, ৫৫৫ টাকা",8:"৩৩৩, ৬৬৬, ৯৯৯ টাকা",9:"৯৯৯, ৫৫৫, ১১১ টাকা"};
    return alts[num] || "৩৩৩, ৬৬৬, ৯৯৯ টাকা";
}

function getVehicleSafety(num) {
    const tips = {1:"দ্রুত গতি এড়িয়ে চলুন",2:"রাতে সতর্ক থাকুন",3:"নিয়মিত সার্ভিস করান",4:"রাতে যাত্রা এড়িয়ে চলুন",5:"সিগন্যাল মেনে চলুন",6:"আরামদায়ক গতিতে চলুন",7:"ফোন ব্যবহার করবেন না",8:"ব্রেক নিয়মিত চেক করান",9:"অতিরিক্ত গতি এড়িয়ে চলুন"};
    return tips[num] || "সাবধানে গাড়ি চালনা করুন。";
}

function getPhoneCareer(num) {
    const tips = {1:"নেতৃত্বের পদ, প্রশাসন",2:"সৃজনশীল পেশা, শিল্পকলা",3:"শিক্ষকতা, পরামর্শ",4:"গবেষণা, প্রযুক্তি",5:"মার্কেটিং, সেলস",6:"শিল্পকলা, বিনোদন",7:"আধ্যাত্মিকতা, লেখালেখি",8:"প্রশাসন, ব্যবস্থাপনা",9:"উদ্যোক্তা, রাজনীতি"};
    return tips[num] || "যোগাযোগমূলক পেশা উত্তম。";
}

function getBankStability(num) {
    const tips = {1:"অত্যন্ত স্থিতিশীল",2:"মাঝারি স্থিতিশীল",3:"শিক্ষা সংক্রান্ত বিনিয়োগে সেরা",4:"অস্থিরতার সম্ভাবনা",5:"দ্রুত লেনদেন",6:"অত্যন্ত স্থিতিশীল",7:"গোপনীয় ও স্থিতিশীল",8:"দীর্ঘমেয়াদে স্থিতিশীল",9:"উদ্যমী ও সক্রিয়"};
    return tips[num] || "স্থিতিশীল অ্যাকাউন্ট।";
}

function getPinSecurity(num) {
    const tips = {1:"শক্তিশালী, নিরাপদ",2:"সাধারণ, সতর্কতা প্রয়োজন",3:"ভাগ্যবান, নিরাপদ",4:"মাঝারি, নিয়মিত পরিবর্তন করুন",5:"চঞ্চল, সাবধান",6:"স্থিতিশীল, নিরাপদ",7:"গোপনীয়, ভালো",8:"শক্তিশালী, নিরাপদ",9:"ভাগ্যবান, ভালো"};
    return tips[num] || "নিরাপদ PIN, নিয়মিত পরিবর্তন করুন。";
}

function getPinLuck(num) {
    const tips = {1:"সাফল্য ও নেতৃত্বের গুণ বৃদ্ধি করবে",2:"মানসিক শান্তি দেবে",3:"জ্ঞান বৃদ্ধি করবে",4:"সতর্কতা প্রয়োজন",5:"দ্রুত সিদ্ধান্তে সাহায্য করবে",6:"সুখ ও সমৃদ্ধি দেবে",7:"আধ্যাত্মিক উন্নতি করবে",8:"ধৈর্য ও স্থিরতা দেবে",9:"সাহস ও শক্তি দেবে"};
    return tips[num] || "ভাগ্যের উপর ইতিবাচক প্রভাব ফেলবে。";
}

function getStockTip(num) {
    const tips = {1:"দীর্ঘমেয়াদী বিনিয়োগ উত্তম",2:"অল্প অল্প করে বিনিয়োগ করুন",3:"শিক্ষা খাতে বিনিয়োগ করুন",4:"প্রযুক্তি খাতে বিনিয়োগ করুন",5:"ট্রেডিং করুন",6:"বিলাস দ্রব্যে বিনিয়োগ করুন",7:"গবেষণা খাতে বিনিয়োগ করুন",8:"শিল্পে বিনিয়োগ করুন",9:"প্রতিযোগিতামূলক খাতে বিনিয়োগ করুন"};
    return tips[num] || "বিনিয়োগের আগে গবেষণা করুন।";
}

function getStockTime(num) {
    const tips = {1:"রবিবার বা সূর্যোদয়ের সময়",2:"সোমবার বা চাঁদ উঠার সময়",3:"বৃহস্পতিবার বা সকাল ৮-১০টা",4:"শনিবার বা সন্ধ্যার সময়",5:"বুধবার বা দুপুর ১২-২টা",6:"শুক্রবার বা সন্ধ্যার সময়",7:"শুক্রবার বা ভোর ৪-৬টা",8:"শনিবার বা সূর্যাস্তের সময়",9:"মঙ্গলবার বা দুপুর ১২-৩টা"};
    return tips[num] || "শুভ দিনে লেনদেন করুন।";
}

function getPropertyTip(num) {
    const tips = {1:"পূর্ব দিকের সম্পত্তি শুভ",2:"জলের ধারের সম্পত্তি শুভ",3:"শিক্ষাপ্রতিষ্ঠানের কাছের সম্পত্তি শুভ",4:"প্রযুক্তি অঞ্চলের সম্পত্তি শুভ",5:"বাণিজ্যিক এলাকার সম্পত্তি শুভ",6:"সৌন্দর্যপূর্ণ এলাকার সম্পত্তি শুভ",7:"আধ্যাত্মিক এলাকার সম্পত্তি শুভ",8:"শিল্প এলাকার সম্পত্তি শুভ",9:"প্রতিযোগিতামূলক এলাকার সম্পত্তি শুভ"};
    return tips[num] || "শুভ দিকের সম্পত্তি নির্বাচন করুন。";
}

function getPropertyGrowth(num) {
    const tips = {1:"৩-৫ বছরে দ্বিগুণ হবে",2:"২-৩ বছরে ভালো মূল্যবৃদ্ধি হবে",3:"৪-৫ বছরে মূল্যবৃদ্ধি হবে",4:"৫-৬ বছরে মূল্যবৃদ্ধি হবে",5:"১-২ বছরে দ্রুত মূল্যবৃদ্ধি হবে",6:"৩-৪ বছরে মূল্যবৃদ্ধি হবে",7:"৬-৭ বছরে মূল্যবৃদ্ধি হবে",8:"৭-৮ বছরে বড় মূল্যবৃদ্ধি হবে",9:"৩-৪ বছরে দ্রুত মূল্যবৃদ্ধি হবে"};
    return tips[num] || "দীর্ঘমেয়াদী বিনিয়োগ করলে লাভ হবে।";
}

function getGoldTip(num) {
    const tips = {1:"সোনার বিনিয়োগ উত্তম",2:"রূপার বিনিয়োগ উত্তম",3:"সোনার বিনিয়োগ উত্তম",4:"সতর্কতা প্রয়োজন",5:"স্বল্পমেয়াদী বিনিয়োগ লাভজনক",6:"সোনা ও রূপা উভয়ই শুভ",7:"ধৈর্য ধরুন",8:"বার বা কয়েন হিসেবে কিনুন",9:"প্রতিযোগিতামূলক দামে কিনুন"};
    return tips[num] || "দীর্ঘমেয়াদী বিনিয়োগ করলে লাভ হবে。";
}

function getGoldTime(num, data) {
    return `${data.luckyDay} দিনে সোনা-রূপা কেনা শুভ। সকালের দিকে কেনা ভালো।`;
}

// ============================================================
// ক্যাটাগরি লিস্ট
// ============================================================
const categories = [
    { id: "personal_name", name: "👤 ব্যক্তির নাম", icon: "fa-user" },
    { id: "baby_name", name: "🍼 শিশুর নাম", icon: "fa-baby" },
    { id: "marriage", name: "💍 বিবাহ মিলন", icon: "fa-heart" },
    { id: "love", name: "❤️ প্রেম মিলন", icon: "fa-heartbeat" },
    { id: "family", name: "👨‍👩‍👧 পরিবার মিলন", icon: "fa-users" },
    { id: "journey_date", name: "✈️ শুভ যাত্রার দিন", icon: "fa-calendar-check" },
    { id: "new_home", name: "🏠 নতুন বাড়ি", icon: "fa-home" },
    { id: "birthday", name: "🎂 জন্মদিন বিশ্লেষণ", icon: "fa-birthday-cake" },
    { id: "business_name", name: "🏢 ব্যবসার নাম", icon: "fa-building" },
    { id: "partnership", name: "🤝 অংশীদারিত্ব মিলন", icon: "fa-handshake" },
    { id: "startup_name", name: "🚀 স্টার্টআপ নাম", icon: "fa-rocket" },
    { id: "logo_color", name: "🎨 লোগো রঙ নির্বাচন", icon: "fa-palette" },
    { id: "launch_date", name: "📈 ব্যবসা উদ্বোধনের তারিখ", icon: "fa-calendar-alt" },
    { id: "product_price", name: "💰 পণ্যের মূল্য নির্ধারণ", icon: "fa-tag" },
    { id: "car_number", name: "🚗 গাড়ির নম্বর", icon: "fa-car" },
    { id: "bike_number", name: "🏍️ বাইক নম্বর", icon: "fa-motorcycle" },
    { id: "mobile_number", name: "📱 মোবাইল নম্বর", icon: "fa-mobile-alt" },
    { id: "bank_account", name: "💳 ব্যাংক অ্যাকাউন্ট", icon: "fa-university" },
    { id: "pin_code", name: "🔢 PIN কোড", icon: "fa-lock" },
    { id: "stock_market", name: "📊 শেয়ার বাজার", icon: "fa-chart-line" },
    { id: "property", name: "🏘️ সম্পত্তি বিনিয়োগ", icon: "fa-landmark" },
    { id: "gold_silver", name: "✨ সোনা/রূপা বিনিয়োগ", icon: "fa-gem" },
    { id: "mulank", name: "🔮 মূলাংক বিশ্লেষণ", icon: "fa-star" },
    { id: "name_number", name: "📖 নামের অংক", icon: "fa-book" }
];

function autoDetectCategory(input) {
    const type = NumberUtils.detectType(input);
    switch(type) {
        case 'date': return 'mulank';
        case 'mobile': return 'mobile_number';
        case 'vehicle': return 'car_number';
        case 'price': return 'product_price';
        case 'business': return 'business_name';
        case 'name': return 'personal_name';
        case 'pin': return 'pin_code';
        case 'bank': return 'bank_account';
        default: return 'personal_name';
    }
}

function showCategorySelection() {
    const contentDiv = document.getElementById('resultContent');
    const loadingDiv = document.getElementById('loading');
    
    let optionsHtml = '<div class="option-buttons">';
    categories.forEach(cat => {
        optionsHtml += `<button class="option-btn" onclick="selectAndShowResult('${cat.id}')"><i class="fas ${cat.icon}"></i> ${cat.name}</button>`;
    });
    optionsHtml += '</div>';
    
    contentDiv.innerHTML = `
        <div class="clarification-card">
            <i class="fas fa-question-circle" style="font-size: 64px; color: #ffd700;"></i>
            <h2>"${escapeHtml(currentRawInput)}"</h2>
            <p style="margin: 15px 0; font-size: 18px;">আমি বুঝতে পারছি না। দয়া করে জানান আপনি কী জানতে চান:</p>
            ${optionsHtml}
        </div>
    `;
    contentDiv.style.display = 'block';
    loadingDiv.style.display = 'none';
}

function selectAndShowResult(categoryId) {
    const numberData = currentNumberData;
    if (!numberData) return;
    
    const analysis = NumerologyDB.getNumberAnalysis(numberData.rootNumber);
    if (!analysis) return;
    
    let resultHtml = '';
    
    switch(categoryId) {
        case 'personal_name': resultHtml = renderPersonalName(currentRawInput, numberData.rootNumber, analysis); break;
        case 'baby_name': resultHtml = renderBabyName(currentRawInput, numberData.rootNumber, analysis); break;
        case 'marriage': resultHtml = renderMarriage(currentRawInput, numberData.rootNumber, analysis); break;
        case 'love': resultHtml = renderLove(currentRawInput, numberData.rootNumber, analysis); break;
        case 'family': resultHtml = renderFamily(currentRawInput, numberData.rootNumber, analysis); break;
        case 'journey_date': resultHtml = renderJourneyDate(currentRawInput, numberData.rootNumber, analysis); break;
        case 'new_home': resultHtml = renderNewHome(currentRawInput, numberData.rootNumber, analysis); break;
        case 'birthday': resultHtml = renderBirthday(currentRawInput, numberData.rootNumber, analysis); break;
        case 'business_name': resultHtml = renderBusinessName(currentRawInput, numberData.rootNumber, analysis); break;
        case 'partnership': resultHtml = renderPartnership(currentRawInput, numberData.rootNumber, analysis); break;
        case 'startup_name': resultHtml = renderStartupName(currentRawInput, numberData.rootNumber, analysis); break;
        case 'logo_color': resultHtml = renderLogoColor(currentRawInput, numberData.rootNumber, analysis); break;
        case 'launch_date': resultHtml = renderLaunchDate(currentRawInput, numberData.rootNumber, analysis); break;
        case 'product_price': resultHtml = renderProductPrice(currentRawInput, numberData.rootNumber, analysis); break;
        case 'car_number': resultHtml = renderCarNumber(currentRawInput, numberData.rootNumber, analysis); break;
        case 'bike_number': resultHtml = renderBikeNumber(currentRawInput, numberData.rootNumber, analysis); break;
        case 'mobile_number': resultHtml = renderMobileNumber(currentRawInput, numberData.rootNumber, analysis); break;
        case 'bank_account': resultHtml = renderBankAccount(currentRawInput, numberData.rootNumber, analysis); break;
        case 'pin_code': resultHtml = renderPinCode(currentRawInput, numberData.rootNumber, analysis); break;
        case 'stock_market': resultHtml = renderStockMarket(currentRawInput, numberData.rootNumber, analysis); break;
        case 'property': resultHtml = renderProperty(currentRawInput, numberData.rootNumber, analysis); break;
        case 'gold_silver': resultHtml = renderGoldSilver(currentRawInput, numberData.rootNumber, analysis); break;
        case 'mulank': resultHtml = renderMulank(currentRawInput, numberData.rootNumber, analysis); break;
        case 'name_number': resultHtml = renderNameNumber(currentRawInput, numberData.rootNumber, analysis); break;
        default: resultHtml = renderPersonalName(currentRawInput, numberData.rootNumber, analysis);
    }
    
    resultHtml += `
        <div class="share-buttons">
            <button class="share-btn" onclick="copyToClipboard()"><i class="fas fa-copy"></i> কপি করুন</button>
            <button class="share-btn" onclick="shareResult()"><i class="fas fa-share-alt"></i> শেয়ার করুন</button>
            <button class="share-btn" onclick="window.print()"><i class="fas fa-print"></i> প্রিন্ট করুন</button>
        </div>
    `;
    
    document.getElementById('resultContent').innerHTML = resultHtml;
    document.getElementById('resultContent').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

function copyToClipboard() {
    const text = document.getElementById('resultContent')?.innerText || '';
    if (text) navigator.clipboard.writeText(text).then(() => alert('ফলাফল কপি হয়েছে!'));
}

function shareResult() {
    const text = document.getElementById('resultContent')?.innerText || '';
    if (navigator.share && text) {
        navigator.share({ title: 'Numerology Intelligence Hub', text: text.substring(0, 500), url: window.location.href });
    } else { copyToClipboard(); }
}

// ============================================================
// মাল্টি-ইনপুট ফাংশন
// ============================================================
function isExplicitMultiInput(input) {
    const explicitSeparators = /[\+\&\|\,\s+(এবং)\s+(and)\s+]/i;
    if (!explicitSeparators.test(input)) return false;
    
    const parts = input.split(/[\+\&\|\,\s+(এবং)\s+(and)\s+]+/i).filter(p => p.trim().length > 0);
    return parts.length >= 2;
}

function parseMultiInput(input) {
    const separators = /[\+\&\|\,\s+(এবং)\s+(and)\s+]+/i;
    const parts = input.split(separators).filter(p => p.trim().length > 0);
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
        return `<div class="result-card error-card"><i class="fas fa-exclamation-triangle"></i><h2>ক্ষমা করবেন!</h2><p>সামঞ্জস্য বিশ্লেষণের জন্য কমপক্ষে ২টি উপাদান প্রয়োজন。</p></div>`;
    }
    return CompatibilityRenderer.render(renderData);
}

// ============================================================
// মেইন ফাংশন
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const query = getQueryParam('q');
    if (!query) { window.location.href = 'numerology.html'; return; }
    
    currentRawInput = decodeURIComponent(query);
    
    // মাল্টি-ইনপুট চেক (+, এবং, & থাকলেই)
    if (isExplicitMultiInput(currentRawInput)) {
        const items = parseMultiInput(currentRawInput);
        if (items.length >= 2) {
            const resultHtml = renderMultiResult(currentRawInput, items.map(i => i.raw), items.map(i => i.number));
            document.getElementById('resultContent').innerHTML = resultHtml;
            document.getElementById('resultContent').style.display = 'block';
            document.getElementById('loading').style.display = 'none';
            return;
        }
    }
    
    // সিঙ্গেল ইনপুট
    currentNumberData = NumberUtils.extractNumber(currentRawInput);
    if (!currentNumberData) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('resultContent').innerHTML = `
            <div class="result-card error-card">
                <i class="fas fa-exclamation-triangle" style="font-size:64px;color:#ffd700"></i>
                <h2>ক্ষমা করবেন!</h2>
                <p>"${escapeHtml(currentRawInput)}" - এতে কোনো সংখ্যা খুঁজে পাওয়া যায়নি।</p>
                <a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a>
            </div>
        `;
        document.getElementById('resultContent').style.display = 'block';
        return;
    }
    
    // যুক্তিপূর্ণ ইনপুট → সরাসরি রেজাল্ট
    if (NumberUtils.isMeaningful(currentRawInput)) {
        const category = autoDetectCategory(currentRawInput);
        selectAndShowResult(category);
        return;
    }
    
    // যুক্তিহীন ইনপুট → ২৪টি ক্যাটাগরি দেখাও
    showCategorySelection();
});
