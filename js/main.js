// ============================================================
// মেইন লজিক ফাইল (সম্পূর্ণ সংশোধিত - ২৪ ক্যাটাগরি)
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
// ২৪টি ক্যাটাগরির জন্য আলাদা রেন্ডারার ফাংশন
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge"><i class="fas fa-palette"></i> শুভ রং: ${data.luckyColor}</span>
                <span class="badge"><i class="fas fa-calendar"></i> শুভ দিন: ${data.luckyDay}</span>
                <span class="badge"><i class="fas fa-compass"></i> শুভ দিক: ${data.luckyDirection}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-user-astronaut"></i> ব্যক্তিত্ব ও স্বভাব</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশা</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-hand-sparkles"></i> জ্যোতিষীয় প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-baby"></i> শিশুর সম্ভাব্য ব্যক্তিত্ব</h3><p>${escapeHtml(data.identity.description.substring(0, 300))}</p></div>
            <div class="info-section"><h3><i class="fas fa-graduation-cap"></i> শিক্ষা ও ভবিষ্যৎ</h3><p>${getBabyFutureTip(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-heart"></i> সামঞ্জস্যের বিশ্লেষণ</h3><p>${getMarriageCompatibilityTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-handshake"></i> পরামর্শ</h3><p>${getMarriageAdviceTip(number)}</p></div>
        </div>
    `;
}

// 4. প্রেম মিলন (love) - বিবাহ মিলনের মতো
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-home"></i> পারিবারিক সামঞ্জস্য</h3><p>${getFamilyCompatibility(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-hand-sparkles"></i> পারিবারিক শান্তির উপায়</h3><p>${getFamilyPeaceTip(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getVehicleDescription(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge"><i class="fas fa-calendar"></i> শুভ দিন: ${data.luckyDay}</span>
                <span class="badge"><i class="fas fa-compass"></i> শুভ দিক: ${data.luckyDirection}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-plane"></i> যাত্রার শুভ সময়</h3><p>${getJourneyBestTime(number, data)}</p></div>
            <div class="info-section"><h3><i class="fas fa-hand-sparkles"></i> যাত্রার পূর্বে করণীয়</h3><p>${getJourneyRitual(number)}</p></div>
        </div>
    `;
}

// 7. নতুন বাড়ি (new_home) - গুরুত্বপূর্ণ!
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
            <p style="line-height: 1.8; text-align: justify;">${getHomeDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-home"></i> বাড়ির প্রভাব ও পরিবেশ</h3><p>${getHomeInfluence(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-peace"></i> পারিবারিক শান্তি ও স্থিতিশীলতা</h3><p>${getHomePeace(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-hand-sparkles"></i> বাড়ির জন্য প্রতিকার</h3><p>${getHomeRemedyTip(number, data)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-user-astronaut"></i> জন্মদিনের বিশেষ বৈশিষ্ট্য</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> জীবনের গুরুত্বপূর্ণ সময়</h3><p>${getLifeMilestones(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getBusinessRootDescription(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge"><i class="fas fa-palette"></i> শুভ রং: ${data.luckyColor}</span>
                <span class="badge"><i class="fas fa-calendar"></i> শুভ দিন: ${data.luckyDay}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> ব্যবসার সম্ভাবনা ও ধরণ</h3><p>${escapeHtml(data.business.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-handshake"></i> অংশীদারিত্বের পরামর্শ</h3><p>${getPartnershipAdvice(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-simple"></i> সাফল্যের মূলমন্ত্র</h3><p>${getBusinessSuccessMantra(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getBusinessRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-handshake"></i> অংশীদারিত্বের সামঞ্জস্য</h3><p>${getPartnershipCompatibility(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> সাফল্যের সম্ভাবনা</h3><p>${getPartnershipSuccess(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getBusinessRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-palette"></i> প্রাথমিক শুভ রং</h3><p>${data.luckyColor}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> রঙের মনস্তাত্ত্বিক প্রভাব</h3><p>${getColorPsychology(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-lightbulb"></i> লোগো ডিজাইন পরামর্শ</h3><p>${getLogoDesignTip(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getBusinessRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> উদ্বোধনের শুভ সময়</h3><p>${getLaunchBestTime(number, data)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-simple"></i> ব্যবসার ভবিষ্যৎ সম্ভাবনা</h3><p>${getLaunchFuture(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPriceDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-calculator"></i> বিশ্লেষণ</h3><p>${isGood ? '✅ এই মূল্য শুভ এবং ব্যবসার জন্য অনুকূল।' : '⚠️ এই মূল্যে সতর্কতা প্রয়োজন।'}</p></div>
            <div class="info-section"><h3><i class="fas fa-lightbulb"></i> বিকল্প মূল্য</h3><p>${getAlternativePrices(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getVehicleDescription(number, data)}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge"><i class="fas fa-calendar"></i> শুভ দিন: ${data.luckyDay}</span>
                <span class="badge"><i class="fas fa-compass"></i> শুভ দিক: ${data.luckyDirection}</span>
            </div>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-plane"></i> যাত্রার শুভ-অশুভ</h3><p>${escapeHtml(data.travel.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-shield-alt"></i> নিরাপত্তা সতর্কতা</h3><p>${getVehicleSafetyTip(number)}</p></div>
        </div>
    `;
}

// 16. বাইক নম্বর - গাড়ির নম্বরের মতো
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-comments"></i> যোগাযোগের প্রভাব</h3><p>${escapeHtml(data.identity.description.substring(0, 250))}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> ক্যারিয়ারের উপর প্রভাব</h3><p>${getPhoneCareerTip(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getBankDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> আর্থিক স্থিতিশীলতা</h3><p>${getBankStabilityTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-coins"></i> বিনিয়োগের দিকনির্দেশনা</h3><p>${data.investment.description.substring(0, 250)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPinDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-shield-alt"></i> নিরাপত্তা বিশ্লেষণ</h3><p>${getPinSecurityTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> ভাগ্যের উপর প্রভাব</h3><p>${getPinLuckTip(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> বিনিয়োগের শুভ-অশুভ</h3><p>${getStockInvestmentTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-simple"></i> লাভের সম্ভাবনা ও সময়</h3><p>${getStockProfitTime(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-home"></i> সম্পত্তির শুভ-অশুভ</h3><p>${getPropertyTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> মূল্যবৃদ্ধির সম্ভাবনা</h3><p>${getPropertyGrowth(number)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-gem"></i> সোনা/রূপা বিনিয়োগের ফলাফল</h3><p>${getGoldSilverTip(number)}</p></div>
            <div class="info-section"><h3><i class="fas fa-chart-line"></i> কেনার শুভ সময়</h3><p>${getGoldBuyTime(number, data)}</p></div>
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
            <p style="line-height: 1.8; text-align: justify;">${getPersonalRootDescription(number, data)}</p>
        </div>
        <div class="result-card">
            <div class="info-section"><h3><i class="fas fa-user-astronaut"></i> ব্যক্তিত্ব ও স্বভাব</h3><p>${escapeHtml(data.identity.description)}</p></div>
            <div class="info-section"><h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশা</h3><p>${escapeHtml(data.business.description)}</p></div>
        </div>
    `;
}

// 24. নামের অংক
function renderNameNumber(input, number, data) {
    return renderPersonalName(input, number, data);
}

// ============================================================
// হেল্পার ফাংশন (সমস্ত ক্যাটাগরির জন্য)
// ============================================================

function getPersonalRootDescription(number, data) {
    const desc = {
        1: "সূর্য গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি জন্মগতভাবে নেতৃত্বের গুণে ভূষিত হন। সূর্য যেমন সৌরজগতের কেন্দ্র, তেমনি আপনিও নিজের ক্ষেত্রে কেন্দ্রীয় ভূমিকা পালন করেন। আত্মবিশ্বাস, সৃজনশীলতা ও উদ্ভাবনী শক্তি আপনার প্রধান বৈশিষ্ট্য। স্বাধীনচেতা ও নিজের পায়ে দাঁড়াতে ভালোবাসেন।",
        2: "চন্দ্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত আবেগপ্রবণ, কল্পনাপ্রবণ ও সৃজনশীল হন। চন্দ্র যেমন সমুদ্রের জোয়ার-ভাটা নিয়ন্ত্রণ করে, তেমনি আপনার মনও আবেগের ঢেউয়ে বিচলিত হয়। মানুষের মন বুঝতে আপনার সেরা ক্ষমতা রয়েছে।",
        3: "বৃহস্পতি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত জ্ঞানী, আশাবাদী ও আধ্যাত্মিক হন। বৃহস্পতি গুরু গ্রহ হিসেবে পরিচিত, আর আপনিও অন্যদের পথ প্রদর্শনে সিদ্ধহস্ত। শিক্ষক, গুরু বা পরামর্শকের মতো মানুষ আপনাকে স্বাভাবিকভাবে ভক্তি করে।",
        4: "রাহু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত রহস্যময়, গভীর চিন্তাবিদ ও উদ্ভাবক হন। রাহু যেমন ছায়া গ্রহ, তেমনি আপনিও সাধারণের চোখের আড়ালে থাকতে ভালোবাসেন। যা অদৃশ্য, তা দেখতে আপনার বিশেষ ক্ষমতা রয়েছে।",
        5: "বুধ গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত বুদ্ধিমান, চটপটে ও যোগাযোগ দক্ষ হন। বুধ যেমন দেবতাদের দূত, তেমনি আপনিও তথ্য ও ধারণা আদান-প্রদানে সিদ্ধহস্ত। অল্প সময়ে অনেক কাজ করতে পারেন।",
        6: "শুক্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি সৌন্দর্যপ্রিয়, বিলাসবহুল জীবন পছন্দ করেন। শুক্র যেমন সৌন্দর্য ও ভালোবাসার দেবতা, তেমনি আপনিও শিল্প, সঙ্গীত, নৃত্যে স্বাভাবিক দক্ষতা রাখেন।",
        7: "কেতু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি আধ্যাত্মিক, গভীর চিন্তাবিদ ও গবেষক হন। কেতু যেমন মোক্ষের দিশারী, তেমনি আপনিও অদৃশ্য জগতের সাথে যোগাযোগ রাখতে পারেন।",
        8: "শনি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত ধৈর্যশীল, পরিশ্রমী ও দায়িত্বশীল হন। শনি যেমন কর্মের ফলদাতা, তেমনি আপনিও জীবনে সংগ্রাম করে সবকিছু অর্জন করেন।",
        9: "মঙ্গল গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত সাহসী, উদ্যমী ও যোদ্ধা প্রকৃতির হন। মঙ্গল যেমন যুদ্ধের দেবতা, তেমনি আপনিও প্রতিযোগিতায় সিদ্ধহস্ত।"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই সংখ্যার ব্যক্তি অনন্য বৈশিষ্ট্যের অধিকারী হন।`;
}

function getBusinessRootDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই ব্যবসার নাম অত্যন্ত শক্তিশালী ও নেতৃত্বমূলক। প্রশাসন, রাজনীতি, স্টার্টআপ, টেকনোলজি ফার্ম - এই ক্ষেত্রগুলোতে এই নাম অত্যন্ত সফল হবে। একক মালিকানা আপনার জন্য শ্রেয়।",
        2: "চন্দ্রের প্রভাবে এই ব্যবসার নামটি জনপ্রিয়তা ও গ্রাহক আকর্ষণে সিদ্ধ। রেস্টুরেন্ট, হোটেল, ট্রাভেল এজেন্সি, ইভেন্ট ম্যানেজমেন্ট - এই খাতে এই নাম অত্যন্ত কার্যকর।",
        3: "বৃহস্পতির প্রভাবে এই ব্যবসার নামটি জ্ঞান ও বিশ্বাসের প্রতীক। শিক্ষা প্রতিষ্ঠান, কোচিং সেন্টার, পাবলিশিং হাউস, আইন সংস্থা - এই খাতে এই নাম অত্যন্ত সম্মানজনক।",
        4: "রাহুর প্রভাবে এই ব্যবসার নামটি প্রযুক্তি ও গবেষণা নির্ভর ব্যবসার জন্য সেরা। আইটি সেক্টর, সাইবার সিকিউরিটি, ইমপোর্ট-এক্সপোর্ট - এই খাতে এই নাম অত্যন্ত কার্যকর।",
        5: "বুধের প্রভাবে এই ব্যবসার নামটি যোগাযোগ ও বাণিজ্যের জন্য অত্যন্ত শুভ। ট্রেডিং, মার্কেটিং, ডিজিটাল মার্কেটিং, মিডিয়া - এই খাতে এই নাম অত্যন্ত সফল।",
        6: "শুক্রের প্রভাবে এই ব্যবসার নামটি সৌন্দর্য ও বিলাস দ্রব্যের ব্যবসার জন্য সেরা। কসমেটিকস, ফ্যাশন হাউস, জুয়েলারি, আর্ট গ্যালারি - এই খাতে এই নাম অত্যন্ত আকর্ষণীয়।",
        7: "কেতুর প্রভাবে এই ব্যবসার নামটি গবেষণা ও আধ্যাত্মিক ব্যবসার জন্য উত্তম। রিসার্চ সেন্টার, পাবলিশিং হাউস, আধ্যাত্মিক সংস্থা - এই খাতে এই নাম অত্যন্ত সম্মানজনক।",
        8: "শনির প্রভাবে এই ব্যবসার নামটি শিল্প ও স্থায়ী ব্যবসার জন্য সেরা। ম্যানুফ্যাকচারিং, ইঞ্জিনিয়ারিং, কনস্ট্রাকশন, রিয়েল এস্টেট - এই খাতে এই নাম অত্যন্ত স্থিতিশীল।",
        9: "মঙ্গলের প্রভাবে এই ব্যবসার নামটি প্রতিযোগিতামূলক ও শক্তি নির্ভর ব্যবসার জন্য সেরা। কনস্ট্রাকশন, ডিফেন্স কন্ট্রাক্ট, স্পোর্টস ক্লাব - এই খাতে এই নাম অত্যন্ত শক্তিশালী।"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই ব্যবসার নামটি সাফল্য এনে দেবে।`;
}

function getHomeDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই বাড়ির নম্বরটি অত্যন্ত শক্তিশালী ও শুভ। পূর্ব দিকে মুখ করে প্রধান দরজা রাখুন। পরিবারের সদস্যরা স্বাধীনচেতা ও নেতৃত্বগুণী হবে।",
        2: "চন্দ্রের প্রভাবে এই বাড়ির নম্বরটি আবেগপ্রবণ ও সৃজনশীল। উত্তর-পশ্চিম দিকে জল রাখুন। পরিবারে শান্তি ও সম্প্রীতি বজায় থাকবে।",
        3: "বৃহস্পতির প্রভাবে এই বাড়ির নম্বরটি জ্ঞান ও শিক্ষার কেন্দ্র। পূর্ব-উত্তর দিকে পূজা ঘর রাখুন। সন্তানরা শিক্ষায় অগ্রগতি করবে।",
        4: "রাহুর প্রভাবে এই বাড়ির নম্বরটি রহস্যময় ও গভীর। দক্ষিণ-পশ্চিম দিকে গাছ লাগান। গোপনীয়তা ও গবেষণার পরিবেশ থাকবে।",
        5: "বুধের প্রভাবে এই বাড়ির নম্বরটি চঞ্চল ও যোগাযোগপ্রবণ। উত্তর দিকে বইয়ের আলমারি রাখুন। অতিথি আসা-যাওয়া বেশি হবে।",
        6: "শুক্রের প্রভাবে এই বাড়ির নম্বরটি সৌন্দর্যপূর্ণ ও বিলাসবহুল। দক্ষিণ-পূর্ব দিকে শো-পিস রাখুন। পারিবারিক বন্ধন দৃঢ় হবে।",
        7: "কেতুর প্রভাবে এই বাড়ির নম্বরটি আধ্যাত্মিক ও গভীর। উত্তর-পূর্ব দিকে ধ্যানের জায়গা রাখুন। পরিবারে শান্তি ও স্থিতিশীলতা আসবে।",
        8: "শনির প্রভাবে এই বাড়ির নম্বরটি স্থিতিশীল ও শৃঙ্খলাপূর্ণ। পশ্চিম দিকে অফিসের জায়গা রাখুন। দীর্ঘমেয়াদী স্থিতিশীলতা আসবে।",
        9: "মঙ্গলের প্রভাবে এই বাড়ির নম্বরটি সাহসী ও উদ্যমী। দক্ষিণ দিকে ব্যায়ামের জায়গা রাখুন। সক্রিয় ও প্রতিযোগিতামূলক পরিবেশ থাকবে।"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই বাড়ির নম্বরটি বসবাসের জন্য শুভ।`;
}

function getVehicleDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই গাড়ির নম্বরটি অত্যন্ত শক্তিশালী ও শুভ। পূর্ব দিকে যাত্রা করলে বিশেষ সাফল্য। সূর্যোদয়ের সময় যাত্রা শুরু করলে মঙ্গল।",
        2: "চন্দ্রের প্রভাবে এই গাড়ির নম্বরটি আবেগপ্রবণ। সোমবারে যাত্রা করলে মঙ্গল। উত্তর-পশ্চিম দিকে যাত্রা করলে ভালো ফল। অমাবস্যার দিন যাত্রা এড়িয়ে চলুন。",
        3: "বৃহস্পতির প্রভাবে এই গাড়ির নম্বরটি জ্ঞান ও আশাবাদের প্রতীক। শিক্ষা বা ব্যবসায়িক ভ্রমণে শুভ। বৃহস্পতিবার যাত্রা করলে মঙ্গল।",
        4: "রাহুর প্রভাবে এই গাড়ির নম্বরটি রহস্যময়। রাতের বেলা যাত্রা এড়িয়ে চলুন। শনিবারে যাত্রা করলে ভালো। যাত্রার আগে ধূপ জ্বালিয়ে নিন。",
        5: "বুধের প্রভাবে এই গাড়ির নম্বরটি চঞ্চল। স্বল্প দূরত্বের যাত্রায় শুভ। বুধবার যাত্রা করলে মঙ্গল। সিগন্যাল মেনে চলুন。",
        6: "শুক্রের প্রভাবে এই গাড়ির নম্বরটি সৌন্দর্যপ্রিয়। বিনোদন বা পারিবারিক ভ্রমণে উত্তম। শুক্রবার যাত্রা করলে ভালো。",
        7: "কেতুর প্রভাবে এই গাড়ির নম্বরটি আধ্যাত্মিক। তীর্থস্থান ভ্রমণে শুভ। শুক্রবার ও শনিবার যাত্রা করলে মঙ্গল。",
        8: "শনির প্রভাবে এই গাড়ির নম্বরটি ধৈর্যশীল। পার্বত্য অঞ্চলে সতর্ক থাকুন। শনিবার ও মঙ্গলবার যাত্রা করলে ভালো。",
        9: "মঙ্গলের প্রভাবে এই গাড়ির নম্বরটি সাহসী। প্রতিযোগিতামূলক ভ্রমণে শুভ। মঙ্গলবার ও রবিবার যাত্রা করলে মঙ্গল。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই গাড়ির নম্বরটি যাত্রার জন্য মধ্যম ফল দেবে।`;
}

function getPinDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই PIN কোডটি অত্যন্ত শক্তিশালী ও নিরাপদ। লাল রঙের ওয়ালেট ব্যবহার করলে নিরাপত্তা বৃদ্ধি পায়। প্রতি ৩ মাস অন্তর কোড পরিবর্তন করা শুভ।",
        2: "চন্দ্রের প্রভাবে এই PIN কোডটি আবেগপ্রবণ। জন্মতারিখ এড়িয়ে চলুন। সোমবারে কোড পরিবর্তন করলে মানসিক স্থিরতা আসে।",
        3: "বৃহস্পতির আশীর্বাদে এই PIN কোডটি জ্ঞান ও ভাগ্যের প্রতীক। হলুদ রঙের সাথে সম্পর্কিত। বৃহস্পতিবারে কোড পরিবর্তন করলে মঙ্গল।",
        4: "রাহুর প্রভাবে এই PIN কোডটি রহস্যময়। নীল খামে সংরক্ষণ করলে ভালো। শনিবারে কোড পরিবর্তন করুন।",
        5: "বুধের প্রভাবে এই PIN কোডটি চঞ্চল। প্রতি মাসে অন্তত একবার কোড পরিবর্তন করা উত্তম। বুধবারে কোড পরিবর্তন করলে যোগাযোগ দক্ষতা বৃদ্ধি পায়।",
        6: "শুক্রের কৃপায় এই PIN কোডটি সৌন্দর্যের প্রতীক। শুক্রবারে কোড পরিবর্তন করলে আর্থিক স্থিতিশীলতা আসে。",
        7: "কেতুর প্রভাবে এই PIN কোডটি আধ্যাত্মিক ও গভীর। বেগুনি রং ব্যবহার করুন। শুক্রবারে পরিবর্তন করুন。",
        8: "শনির প্রভাবে এই PIN কোডটি অত্যন্ত শক্তিশালী। শনিবারে কোড পরিবর্তন করলে দীর্ঘমেয়াদী নিরাপত্তা নিশ্চিত হয়।",
        9: "মঙ্গলের প্রভাবে এই PIN কোডটি সাহসী। মঙ্গলবারে কোড পরিবর্তন করলে আত্মবিশ্বাস বৃদ্ধি পায়。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই PIN কোডটি মাঝারি নিরাপত্তা প্রদান করে。`;
}

function getBankDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অত্যন্ত স্থিতিশীল। দীর্ঘমেয়াদী সঞ্চয়ের জন্য উত্তম। লাল রঙের চেকবুক ব্যবহার করলে ভালো।",
        2: "চন্দ্রের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি মাঝারি স্থিতিশীল। যৌথ মালিকানা বেশি লাভজনক। সাদা রঙের পাসবুক ব্যবহার করলে ভালো。",
        3: "বৃহস্পতির প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি শিক্ষা সংক্রান্ত বিনিয়োগে সেরা。 হলুদ রঙের চেক ব্যবহার করলে মঙ্গল。",
        4: "রাহুর প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অস্থিরতার সম্ভাবনা রাখে। নীল রঙের সাথে সম্পর্কিত。",
        5: "বুধের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি দ্রুত লেনদেন নির্দেশ করে। সবুজ রঙের পাসবুক ব্যবহার করলে লাভ।",
        6: "শুক্রের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অত্যন্ত স্থিতিশীল ও লাভজনক। সাদা ও গোলাপি রঙের চেকবুক ব্যবহার করলে সাফল্য।",
        7: "কেতুর প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি গোপনীয় ও স্থিতিশীল। বেগুনি রঙের সাথে সম্পর্কিত。",
        8: "শনির প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি দীর্ঘমেয়াদে অত্যন্ত স্থিতিশীল। কালো ও নীল রঙের সাথে সম্পর্কিত。",
        9: "মঙ্গলের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি উদ্যমী ও সক্রিয়। লাল রঙের সাথে সম্পর্কিত。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি মাঝারি স্থিতিশীলতা প্রদান করে。`;
}

function getPriceDescription(number, data) {
    const isGood = [3,6,9].includes(number);
    if (isGood) {
        return `${data.planet} গ্রহের প্রভাবে এই মূল্যটি অত্যন্ত শুভ ও ব্যবসার জন্য অনুকূল। এই সংখ্যার কম্পন আর্থিক স্থিতিশীলতা ও লাভের সম্ভাবনা বৃদ্ধি করে。`;
    } else {
        return `${data.planet} গ্রহের প্রভাবে এই মূল্যটি সতর্কতা প্রয়োজন। বিকল্প মূল্য হিসেবে ৩, ৬, ৯ সংখ্যার দাম নির্বাচন করলে লাভের সম্ভাবনা বাড়ে。`;
    }
}

// ============================================================
// সহায়ক টিপস ফাংশন
// ============================================================

function getBabyFutureTip(num) {
    const tips = {
        1: "নেতৃত্ব গুণাবলী বিকশিত হবে। ভবিষ্যতে প্রশাসক বা উদ্যোক্তা হতে পারে।",
        2: "সৃজনশীল ও কল্পনাপ্রবণ হবে। শিল্পী, লেখক বা সঙ্গীতজ্ঞ হতে পারে。",
        3: "জ্ঞানী ও পণ্ডিত হবে। শিক্ষক, গবেষক বা পরামর্শক হতে পারে。",
        4: "গবেষক ও উদ্ভাবক হবে। প্রযুক্তি ও বিজ্ঞান ক্ষেত্রে সাফল্য পাবে。",
        5: "যোগাযোগে দক্ষ ও বুদ্ধিমান হবে। মার্কেটিং, মিডিয়া বা ব্যবসায় সফল হবে。",
        6: "শিল্পী ও সৌন্দর্যপ্রিয় হবে। ফ্যাশন, আর্ট বা বিনোদন ক্ষেত্রে সাফল্য পাবে。",
        7: "আধ্যাত্মিক ও গভীর চিন্তাবিদ হবে। গবেষণা বা আধ্যাত্মিক পথে যাবে。",
        8: "ধৈর্যশীল ও দায়িত্বশীল হবে। প্রশাসন, শিল্প বা অর্থনৈতিক ক্ষেত্রে সফল হবে。",
        9: "সাহসী ও উদ্যমী হবে। সেনাবাহিনী, খেলাধুলা বা প্রতিযোগিতামূলক ক্ষেত্রে সাফল্য পাবে。"
    };
    return tips[num] || "সুপ্রতিভ ও সফল হবে。";
}

function getMarriageCompatibilityTip(num) {
    const tips = {
        1: "সূর্যের প্রভাবে এই সংখ্যার ব্যক্তি নেতৃত্বগুণী ও আত্মবিশ্বাসী। আদর্শ সঙ্গী হবে ১, ৩ বা ৯ সংখ্যার ব্যক্তি。",
        2: "চন্দ্রের প্রভাবে এই সংখ্যার ব্যক্তি আবেগপ্রবণ ও সৃজনশীল। আদর্শ সঙ্গী হবে ২, ৬ বা ৭ সংখ্যার ব্যক্তি。",
        3: "বৃহস্পতির প্রভাবে এই সংখ্যার ব্যক্তি জ্ঞানী ও আশাবাদী। আদর্শ সঙ্গী হবে ৩, ৬ বা ৯ সংখ্যার ব্যক্তি。",
        4: "রাহুর প্রভাবে এই সংখ্যার ব্যক্তি রহস্যময় ও গভীর চিন্তাবিদ। আদর্শ সঙ্গী হবে ৪, ৮ বা ১ সংখ্যার ব্যক্তি。",
        5: "বুধের প্রভাবে এই সংখ্যার ব্যক্তি বুদ্ধিমান ও চটপটে। আদর্শ সঙ্গী হবে ৫, ৩ বা ৬ সংখ্যার ব্যক্তি。",
        6: "শুক্রের প্রভাবে এই সংখ্যার ব্যক্তি সৌন্দর্যপ্রিয় ও সম্পর্কপ্রিয়। আদর্শ সঙ্গী হবে ৬, ২ বা ৩ সংখ্যার ব্যক্তি。",
        7: "কেতুর প্রভাবে এই সংখ্যার ব্যক্তি আধ্যাত্মিক ও গভীর চিন্তাবিদ। আদর্শ সঙ্গী হবে ৭, ২ বা ৯ সংখ্যার ব্যক্তি。",
        8: "শনির প্রভাবে এই সংখ্যার ব্যক্তি ধৈর্যশীল ও দায়িত্বশীল। আদর্শ সঙ্গী হবে ৮, ৪ বা ১ সংখ্যার ব্যক্তি。",
        9: "মঙ্গলের প্রভাবে এই সংখ্যার ব্যক্তি সাহসী ও উদ্যমী। আদর্শ সঙ্গী হবে ৯, ১ বা ৩ সংখ্যার ব্যক্তি。"
    };
    return tips[num] || "সামঞ্জস্য ভালো। সম্পর্কের উন্নয়ন সম্ভব。";
}

function getMarriageAdviceTip(num) {
    const advices = {
        1: "অহংকার নিয়ন্ত্রণ করুন। সঙ্গীকে সমান গুরুত্ব দিন。",
        2: "আবেগ নিয়ন্ত্রণ করুন। সঙ্গীর সাথে খোলামেলা কথা বলুন。",
        3: "অতিরিক্ত আশাবাদ এড়িয়ে চলুন। বাস্তববাদী হোন。",
        4: "অস্থিরতা নিয়ন্ত্রণ করুন। ধৈর্য ধরুন。",
        5: "চঞ্চলতা কমিয়ে দিন। সঙ্গীকে সময় দিন。",
        6: "অতিরিক্ত বিলাসিতা এড়িয়ে চলুন। সঞ্চয় করুন。",
        7: "একাকীত্ব কাটিয়ে উঠুন। সঙ্গীর সাথে সময় কাটান。",
        8: "কর্মব্যস্ততার মধ্যে সঙ্গীকে সময় দিন。",
        9: "রাগ নিয়ন্ত্রণ করুন। সঙ্গীর সাথে মৃদুভাবে কথা বলুন。"
    };
    return advices[num] || "সঙ্গীর সাথে সময় কাটান। ভালোবাসা ও শ্রদ্ধা বজায় রাখুন。";
}

function getFamilyCompatibility(num) {
    const tips = {
        1: "সূর্যের প্রভাবে এই পরিবারে নেতৃত্বের গুণ থাকবে। সদস্যরা স্বাধীনচেতা হবে। পারস্পরিক সম্মান বজায় থাকলে সম্পর্ক মজবুত হবে。",
        2: "চন্দ্রের প্রভাবে এই পরিবার আবেগপ্রবণ ও সৃজনশীল হবে। সদস্যদের মধ্যে মানসিক বন্ধন দৃঢ় হবে।",
        3: "বৃহস্পতির প্রভাবে এই পরিবার জ্ঞানী ও আশাবাদী হবে। শিক্ষা ও সংস্কৃতিচর্চা বাড়াবে。",
        4: "রাহুর প্রভাবে এই পরিবারে গভীরতা ও গবেষণার মনোভাব থাকবে। সদস্যরা একে অপরের গোপনীয়তা বুঝতে পারবে。",
        5: "বুধের প্রভাবে এই পরিবার চঞ্চল ও যোগাযোগপ্রবণ হবে। সদস্যদের মধ্যে কথাবার্তা চলবে।",
        6: "শুক্রের প্রভাবে এই পরিবার সৌন্দর্যপ্রিয় ও সম্পর্কপ্রিয় হবে। পারিবারিক বন্ধন দৃঢ় হবে।",
        7: "কেতুর প্রভাবে এই পরিবার আধ্যাত্মিক ও গভীর হবে। সদস্যরা একে অপরের থেকে শিক্ষা নেবে。",
        8: "শনির প্রভাবে এই পরিবার দায়িত্বশীল ও স্থিতিশীল হবে। সদস্যরা পরিশ্রমী হবে।",
        9: "মঙ্গলের প্রভাবে এই পরিবার সাহসী ও উদ্যমী হবে। সদস্যরা প্রতিযোগিতায় এগিয়ে থাকবে。"
    };
    return tips[num] || "পরিবারের সদস্যদের মধ্যে বোঝাপড়া বজায় রাখুন।";
}

function getFamilyPeaceTip(num) {
    const tips = {
        1: "রবিবারে পরিবারের সাথে সময় কাটান। লাল রঙের ব্যবহার শান্তি বাড়ায়。",
        2: "সোমবারে একসাথে খাবার খান। সাদা রঙের ব্যবহার মানসিক শান্তি দেয়。",
        3: "বৃহস্পতিবারে ধর্মীয় অনুষ্ঠান করুন। হলুদ রঙের ব্যবহার শুভ।",
        4: "শনিবারে একসাথে প্রকৃতিতে সময় কাটান। নীল রঙের ব্যবহার স্থিতিশীলতা দেয়。",
        5: "বুধবারে একসাথে নতুন কিছু শিখুন। সবুজ রঙের ব্যবহার সতেজতা দেয়。",
        6: "শুক্রবারে একসাথে শিল্পচর্চা করুন। গোলাপি রঙের ব্যবহার ভালোবাসা বাড়ায়。",
        7: "শুক্রবারে একসাথে ধ্যান করুন। বেগুনি রঙের ব্যবহার আধ্যাত্মিকতা দেয়。",
        8: "শনিবারে একসাথে পরিকল্পনা করুন। কালো রঙের ব্যবহার স্থিতিশীলতা দেয়。",
        9: "মঙ্গলবারে একসাথে খেলাধুলা করুন। লাল রঙের ব্যবহার উদ্যম বাড়ায়。"
    };
    return tips[num] || "পরিবারের সাথে নিয়মিত সময় কাটান。";
}

function getJourneyBestTime(num, data) {
    return `আপনার যাত্রার শুভ দিন হলো ${data.luckyDay}। এই দিনে যাত্রা করলে বিশেষ সাফল্য লাভ করবেন। শুভ দিক হলো ${data.luckyDirection}। ${getTimeAdvice(num)}`;
}

function getTimeAdvice(num) {
    const tips = {
        1: "সূর্যোদয়ের সময় যাত্রা শুরু করলে মঙ্গল। সকাল ৬-৮টার মধ্যে যাত্রা করুন。",
        2: "চাঁদ উঠার সময় যাত্রা শুরু করলে বিশেষ সাফল্য। সন্ধ্যা ৬-৮টার মধ্যে যাত্রা করুন。",
        3: "সকাল ৮-১০টার মধ্যে যাত্রা শুরু করলে সাফল্য।",
        4: "সূর্যাস্তের পর যাত্রা শুরু করলে সাফল্য। সন্ধ্যা ৬টার পরে যাত্রা করুন。",
        5: "দুপুর ১২-২টার মধ্যে যাত্রা শুরু করলে সাফল্য。",
        6: "সন্ধ্যার সময় যাত্রা শুরু করলে সাফল্য। সূর্যাস্তের সময় যাত্রা করলে ভালো।",
        7: "ভোর ৪-৬টায় যাত্রা শুরু করলে সাফল্য。",
        8: "সূর্যাস্তের পর যাত্রা শুরু করলে সাফল্য। রাত ৮টার আগে পৌঁছানোর চেষ্টা করুন。",
        9: "দুপুর ১২-৩টার মধ্যে যাত্রা শুরু করলে সাফল্য。"
    };
    return tips[num] || "সকালের দিকে যাত্রা শুরু করলে ভালো。";
}

function getJourneyRitual(num) {
    const tips = {
        1: "সূর্যকে নমস্কার জানিয়ে যাত্রা শুরু করুন। লাল ফুল দিয়ে পূজা করুন。",
        2: "চাঁদকে স্মরণ করে যাত্রা শুরু করুন। সাদা ফুল দিয়ে পূজা করুন。",
        3: "গুরুকে স্মরণ করে যাত্রা শুরু করুন। হলুদ ফুল দিয়ে পূজা করুন。",
        4: "যাত্রার আগে ধূপ বা লোবান জ্বালিয়ে নিন। কালো তিল দান করুন。",
        5: "যাত্রার আগে সবুজ শাক দান করুন। বুধ মন্ত্র জপ করুন。",
        6: "যাত্রার আগে সুগন্ধি ব্যবহার করুন। সাদা ফুল দিয়ে পূজা করুন。",
        7: "যাত্রার আগে ধ্যান করুন। বেগুনি রঙের বস্ত্র ব্যবহার করুন。",
        8: "যাত্রার আগে গরীবকে খাবার দান করুন। শনি মন্ত্র জপ করুন。",
        9: "যাত্রার আগে লাল চন্দন লাগান। মঙ্গল মন্ত্র জপ করুন。"
    };
    return tips[num] || "যাত্রার আগে ঈশ্বরের কাছে প্রার্থনা করুন。";
}

function getHomeInfluence(num) {
    const tips = {
        1: "সূর্যের প্রভাবে এই বাড়িতে নেতৃত্ব ও আত্মবিশ্বাস বজায় থাকবে। পূর্ব দিকে মুখ করে বসা শুভ।",
        2: "চন্দ্রের প্রভাবে এই বাড়িতে আবেগ ও সৃজনশীলতা বজায় থাকবে। উত্তর-পশ্চিম দিকে মুখ করে বসা শুভ。",
        3: "বৃহস্পতির প্রভাবে এই বাড়িতে জ্ঞান ও আশাবাদ বজায় থাকবে। পূর্ব-উত্তর দিকে মুখ করে বসা শুভ。",
        4: "রাহুর প্রভাবে এই বাড়িতে গবেষণা ও গভীরতা থাকবে। দক্ষিণ-পশ্চিম দিকে মুখ করে বসা শুভ。",
        5: "বুধের প্রভাবে এই বাড়িতে যোগাযোগ ও চঞ্চলতা থাকবে。 উত্তর দিকে মুখ করে বসা শুভ。",
        6: "শুক্রের প্রভাবে এই বাড়িতে সৌন্দর্য ও বিলাসিতা থাকবে। দক্ষিণ-পূর্ব দিকে মুখ করে বসা শুভ。",
        7: "কেতুর প্রভাবে এই বাড়িতে আধ্যাত্মিকতা ও গভীরতা থাকবে। উত্তর-পূর্ব দিকে মুখ করে বসা শুভ。",
        8: "শনির প্রভাবে এই বাড়িতে দায়িত্ব ও স্থিতিশীলতা থাকবে। পশ্চিম দিকে মুখ করে বসা শুভ。",
        9: "মঙ্গলের প্রভাবে এই বাড়িতে সাহস ও উদ্যম থাকবে। দক্ষিণ দিকে মুখ করে বসা শুভ。"
    };
    return tips[num] || "পরিবারের সদস্যদের মধ্যে ভালোবাসা ও শ্রদ্ধা বজায় রাখুন。";
}

function getHomePeace(num) {
    const tips = {
        1: "রবিবারে পরিবারের সাথে সময় কাটান। লাল রঙের ব্যবহার শান্তি বাড়ায়। পূর্ব দিকে প্রধান দরজা রাখুন।",
        2: "সোমবারে একসাথে খাবার খান। সাদা রঙের ব্যবহার মানসিক শান্তি দেয়। উত্তর-পশ্চিম দিকে জল রাখুন。",
        3: "বৃহস্পতিবারে ধর্মীয় অনুষ্ঠান করুন。 হলুদ রঙের ব্যবহার শুভ। পূর্ব-উত্তর দিকে পূজা ঘর রাখুন。",
        4: "শনিবারে একসাথে প্রকৃতিতে সময় কাটান। নীল রঙের ব্যবহার স্থিতিশীলতা দেয়。 দক্ষিণ-পশ্চিম দিকে গাছ লাগান。",
        5: "বুধবারে একসাথে নতুন কিছু শিখুন। সবুজ রঙের ব্যবহার সতেজতা দেয়। উত্তর দিকে বইয়ের আলমারি রাখুন。",
        6: "শুক্রবারে একসাথে শিল্পচর্চা করুন। গোলাপি রঙের ব্যবহার ভালোবাসা বাড়ায়। দক্ষিণ-পূর্ব দিকে শো-পিস রাখুন。",
        7: "শুক্রবারে একসাথে ধ্যান করুন। বেগুনি রঙের ব্যবহার আধ্যাত্মিকতা দেয়。 উত্তর-পূর্ব দিকে ধ্যানের জায়গা রাখুন。",
        8: "শনিবারে একসাথে পরিকল্পনা করুন। কালো রঙের ব্যবহার স্থিতিশীলতা দেয়। পশ্চিম দিকে অফিসের জায়গা রাখুন。",
        9: "মঙ্গলবারে একসাথে খেলাধুলা করুন। লাল রঙের ব্যবহার উদ্যম বাড়ায়। দক্ষিণ দিকে ব্যায়ামের জায়গা রাখুন。"
    };
    return tips[num] || "বাড়িতে নিয়মিত ধূপ জ্বালান। পরিবারের সাথে সময় কাটান。";
}

function getHomeRemedyTip(num, data) {
    return `${data.luckyColor} রঙের ব্যবহার বাড়িতে শান্তি বাড়ায়। ${data.luckyDay} দিনে বাড়ির প্রধান দরজায় তোরণ লাগান। নিয়মিত ধূপ জ্বালিয়ে পরিবেশ পবিত্র রাখুন。`;
}

function getLifeMilestones(num) {
    const milestones = {
        1: "৩০ বছর বয়সের পরে জীবনে স্থিতিশীলতা আসবে। ৪২ বছর বয়সে বড় সাফল্য আসতে পারে。",
        2: "২৫ বছর বয়সের পরে জীবনে সাফল্যের পথ খুলবে। ৩৫ বছর বয়সে সম্পর্কের ক্ষেত্রে সাফল্য আসবে。",
        3: "২৮ বছর বয়সের পরে জীবনে স্থিতিশীলতা আসবে। ৪০ বছর বয়সে শিক্ষাক্ষেত্রে সাফল্য আসবে。",
        4: "৩২ বছর বয়সের পরে জীবনে সাফল্য আসবে। ৪৫ বছর বয়সে গবেষণাক্ষেত্রে সাফল্য আসবে。",
        5: "২৭ বছর বয়সের পরে জীবনে স্থিতিশীলতা আসবে। ৩৮ বছর বয়সে ব্যবসায় সাফল্য আসবে。",
        6: "২৯ বছর বয়সের পরে জীবনে সাফল্য আসবে। ৪১ বছর বয়সে শিল্পক্ষেত্রে সাফল্য আসবে。",
        7: "৩৫ বছর বয়সের পরে জীবনে স্থিতিশীলতা আসবে। ৪৮ বছর বয়সে আধ্যাত্মিক ক্ষেত্রে সাফল্য আসবে。",
        8: "৪০ বছর বয়সের পরে জীবনে বড় সাফল্য আসবে。 ৫৫ বছর বয়সে অর্থনৈতিক স্থিতিশীলতা আসবে。",
        9: "৩৩ বছর বয়সের পরে জীবনে সাফল্য আসবে। ৪৫ বছর বয়সে প্রতিযোগিতামূলক ক্ষেত্রে সাফল্য আসবে。"
    };
    return milestones[num] || "৩৫-৪০ বছর বয়সের মধ্যে জীবনে স্থিতিশীলতা আসবে。";
}

function getPartnershipAdvice(num) {
    const tips = {
        1: "একক মালিকানা শ্রেয়। অংশীদারিত্ব করলে ১, ৩ বা ৯ সংখ্যার ব্যক্তিদের সাথে করুন।",
        2: "অংশীদারিত্ব শুভ। ২, ৬ ও ৭ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব করলে সাফল্য।",
        3: "৩, ৬ ও ৯ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব উত্তম। শিক্ষা খাতে অংশীদারি করলে সাফল্য।",
        4: "৪, ৮ ও ১ সংখ্যার ব্যক্তিদের সাথে সাবধানে অংশীদারিত্ব করুন। বিদেশী অংশীদারি লাভজনক。",
        5: "৫, ৩ ও ৬ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব উত্তম। মার্কেটিং খাতে অংশীদারি করলে লাভ。",
        6: "৬, ২ ও ৩ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব উত্তম। শিল্প খাতে অংশীদারি করলে সাফল্য。",
        7: "৭, ২ ও ৯ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব উত্তম। গবেষণা খাতে অংশীদারি করলে লাভ。",
        8: "৮, ৪ ও ১ সংখ্যার ব্যক্তিদের সাথে সাবধানে অংশীদারিত্ব করুন। শিল্প খাতে অংশীদারি করলে লাভ。",
        9: "৯, ১ ও ৩ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব উত্তম। প্রতিযোগিতামূলক খাতে অংশীদারি করলে সাফল্য。"
    };
    return tips[num] || "অংশীদার নির্বাচনে সতর্ক থাকুন।";
}

function getBusinessSuccessMantra(num) {
    const mantras = {
        1: "'আমি নেতা, আমি পথপ্রদর্শক' — এই বিশ্বাস নিয়ে এগিয়ে চলুন。",
        2: "'সহযোগিতা ও সম্পর্কই মূলধন' — টিম ওয়ার্কের মাধ্যমে ব্যবসা বাড়ান。",
        3: "'জ্ঞানই শক্তি, শিক্ষাই পথ' — জ্ঞান বিতরণের মাধ্যমে ব্যবসার প্রসার ঘটান。",
        4: "'গবেষণা ও উদ্ভাবনই সাফল্যের চাবিকাঠি' — নতুন পথ তৈরি করুন。",
        5: "'যোগাযোগ ও গতিশীলতাই মূলমন্ত্র' — দ্রুত সিদ্ধান্ত নিন。",
        6: "'সৌন্দর্য ও সম্পর্কই ব্যবসার প্রাণ' — ক্রিয়েটিভিটি ও নেটওয়ার্কিং করুন。",
        7: "'গুণগত মান ও আধ্যাত্মিকতাই পাথেয়' — গভীরে যান, সত্য আবিষ্কার করুন。",
        8: "'ধৈর্য ও সংগঠনই সাফল্যের মূল' — দীর্ঘমেয়াদী পরিকল্পনা করুন。",
        9: "'সাহস ও উদ্যমই শক্তি' — প্রতিযোগিতায় এগিয়ে থাকুন。"
    };
    return mantras[num] || "সৎ ও নিষ্ঠার সাথে কাজ করুন。";
}

function getPartnershipCompatibility(num) {
    const tips = {
        1: "সূর্যের প্রভাবে আপনার জন্য একক মালিকানা শ্রেয়। অংশীদার করলে ১, ৩ বা ৯ সংখ্যার ব্যক্তির সাথে করুন。",
        2: "চন্দ্রের প্রভাবে অংশীদারিত্ব শুভ। ২, ৬ ও ৭ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব করলে সাফল্য。",
        3: "বৃহস্পতির প্রভাবে ৩, ৬ ও ৯ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব উত্তম।",
        4: "রাহুর প্রভাবে ৪, ৮ ও ১ সংখ্যার ব্যক্তির সাথে সাবধানে অংশীদারিত্ব করুন।",
        5: "বুধের প্রভাবে ৫, ৩ ও ৬ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব উত্তম।",
        6: "শুক্রের প্রভাবে ৬, ২ ও ৩ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব উত্তম。",
        7: "কেতুর প্রভাবে ৭, ২ ও ৯ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব উত্তম。",
        8: "শনির প্রভাবে ৮, ৪ ও ১ সংখ্যার ব্যক্তির সাথে সাবধানে অংশীদারিত্ব করুন。",
        9: "মঙ্গলের প্রভাবে ৯, ১ ও ৩ সংখ্যার ব্যক্তির সাথে অংশীদারিত্ব উত্তম。"
    };
    return tips[num] || "অংশীদার নির্বাচনে সতর্ক থাকুন।";
}

function getPartnershipSuccess(num) {
    const tips = {
        1: "নিজের সিদ্ধান্তে অটল থাকলে সাফল্য আসবে।",
        2: "টিম ওয়ার্ক ও জনসংযোগের মাধ্যমে সাফল্য আসবে।",
        3: "জ্ঞান বিতরণ ও শিক্ষার মাধ্যমে সাফল্য আসবে।",
        4: "গবেষণা ও উদ্ভাবনের মাধ্যমে সাফল্য আসবে。",
        5: "যোগাযোগ ও দ্রুত সিদ্ধান্তের মাধ্যমে সাফল্য আসবে。",
        6: "সৃজনশীলতা ও সম্পর্কের মাধ্যমে সাফল্য আসবে。",
        7: "গুণগত মান ও আধ্যাত্মিকতার মাধ্যমে সাফল্য আসবে。",
        8: "সংগঠন ও দীর্ঘমেয়াদী পরিকল্পনার মাধ্যমে সাফল্য আসবে。",
        9: "উদ্যম ও সাহসের মাধ্যমে সাফল্য আসবে。"
    };
    return tips[num] || "সৎ ও নিষ্ঠার সাথে কাজ করুন。";
}

function getColorPsychology(num) {
    const tips = {
        1: "লাল রং আত্মবিশ্বাস ও নেতৃত্বের প্রতীক।",
        2: "সাদা রং শান্তি ও পবিত্রতার প্রতীক。",
        3: "হলুদ রং জ্ঞান ও আশাবাদের প্রতীক。",
        4: "নীল রং রহস্য ও স্থিতিশীলতার প্রতীক。",
        5: "সবুজ রং সতেজতা ও বৃদ্ধির প্রতীক。",
        6: "গোলাপি রং ভালোবাসা ও সৌন্দর্যের প্রতীক。",
        7: "বেগুনি রং আধ্যাত্মিকতা ও গভীরতার প্রতীক。",
        8: "কালো রং শক্তি ও স্থিতিশীলতার প্রতীক。",
        9: "লাল ও কমলা রং সাহস ও উদ্যমের প্রতীক。"
    };
    return tips[num] || "শুভ রং ব্যবহার করলে ব্র্যান্ডের গ্রহণযোগ্যতা বাড়ে。";
}

function getLogoDesignTip(num) {
    const tips = {
        1: "সরল ও শক্তিশালী ডিজাইন করুন। লাল ও সোনালি রঙ ব্যবহার করুন। বৃত্তাকার লোগো শুভ。",
        2: "নরম ও প্রবাহিত ডিজাইন করুন। সাদা ও রূপালি রঙ ব্যবহার করুন। অর্ধচন্দ্রাকার লোগো শুভ。",
        3: "জ্ঞানবাচক ডিজাইন করুন। হলুদ ও সোনালি রঙ ব্যবহার করুন। ত্রিকোণাকার লোগো শুভ。",
        4: "জটিল ও গভীর ডিজাইন করুন। নীল ও কালো রঙ ব্যবহার করুন। বর্গাকার লোগো শুভ。",
        5: "চটপটে ও আধুনিক ডিজাইন করুন। সবুজ ও আকাশি রঙ ব্যবহার করুন। পাঁচকোণা লোগো শুভ。",
        6: "সুন্দর ও আকর্ষণীয় ডিজাইন করুন। সাদা ও গোলাপি রঙ ব্যবহার করুন। হৃদয়াকার লোগো শুভ。",
        7: "গভীর ও অর্থপূর্ণ ডিজাইন করুন। হলুদ ও বেগুনি রঙ ব্যবহার করুন। ওঁ-আকৃতির লোগো শুভ。",
        8: "স্থিতিশীল ও কর্তৃত্বপূর্ণ ডিজাইন করুন。 কালো ও নীল রঙ ব্যবহার করুন। আয়তাকার লোগো শুভ。",
        9: "সাহসী ও গতিশীল ডিজাইন করুন। লাল ও কমলা রঙ ব্যবহার করুন। তারকাকার লোগো শুভ。"
    };
    return tips[num] || "সরল ও স্মরণীয় লোগো ডিজাইন করুন。";
}

function getLaunchBestTime(num, data) {
    return `আপনার ব্যবসা উদ্বোধনের শুভ দিন হলো ${data.luckyDay}। শুভ সময়: ${getLaunchTime(num)}।`;
}

function getLaunchTime(num) {
    const times = {
        1: "সকাল ৬-৮টা (সূর্যোদয়ের সময়)",
        2: "সন্ধ্যা ৬-৮টা (চাঁদ উঠার সময়)",
        3: "সকাল ৮-১০টা",
        4: "সন্ধ্যা ৬টার পর",
        5: "দুপুর ১২-২টা",
        6: "সন্ধ্যা ৫-৭টা",
        7: "ভোর ৪-৬টা",
        8: "সন্ধ্যা ৬-৮টা",
        9: "দুপুর ১২-৩টা"
    };
    return times[num] || "সকালের দিকে উদ্বোধন করলে ভালো。";
}

function getLaunchFuture(num) {
    const tips = {
        1: "নেতৃত্বমূলক ব্যবসা হবে। দ্রুত বৃদ্ধি পাবে। ৩ বছরেই সাফল্য আসবে。",
        2: "জনপ্রিয় ব্যবসা হবে। গ্রাহক আকর্ষণ ভালো হবে। ২ বছরেই সাফল্য আসবে。",
        3: "শিক্ষা নির্ভর ব্যবসা হবে। ধীরে ধীরে কিন্তু স্থিতিশীলভাবে বাড়বে。",
        4: "প্রযুক্তি নির্ভর ব্যবসা হবে। বিদেশী বাজারেও সাফল্য আসবে。",
        5: "দ্রুত লেনদেনের ব্যবসা হবে। চটপটে বাড়বে。",
        6: "সৌন্দর্য নির্ভর ব্যবসা হবে। সম্পর্কের মাধ্যমে বাড়বে。",
        7: "গবেষণা নির্ভর ব্যবসা হবে। ধীরে ধীরে কিন্তু নিশ্চিতভাবে বাড়বে。",
        8: "শিল্প নির্ভর ব্যবসা হবে। দীর্ঘমেয়াদী স্থিতিশীলতা আসবে。",
        9: "প্রতিযোগিতামূলক ব্যবসা হবে। দ্রুত বাড়বে。"
    };
    return tips[num] || "সঠিক পরিকল্পনা করলে সাফল্য আসবেই。";
}

function getAlternativePrices(num) {
    const alts = {
        1: "১১১, ৫৫৫, ৯৯৯ টাকা",
        2: "২২২, ৬৬৬, ৮৮৮ টাকা",
        3: "৩৩৩, ৬৬৬, ৯৯৯ টাকা",
        4: "৩৩৩, ৬৬৬, ৯৯৯ টাকা",
        5: "৫৫৫, ১১১, ৭৭৭ টাকা",
        6: "৬৬৬, ৯৯৯, ৩৩৩ টাকা",
        7: "৭৭৭, ১১১, ৫৫৫ টাকা",
        8: "৩৩৩, ৬৬৬, ৯৯৯ টাকা",
        9: "৯৯৯, ৫৫৫, ১১১ টাকা"
    };
    return alts[num] || "৩৩৩, ৬৬৬, ৯৯৯ টাকা";
}

function getVehicleSafetyTip(num) {
    const tips = {
        1: "দ্রুত গাড়ি চালানো এড়িয়ে চলুন। নিয়মিত ব্রেক চেক করান。",
        2: "রাতে সতর্ক থাকুন, হেডলাইট চেক করুন。",
        3: "নিয়মিত সার্ভিস করান।",
        4: "রাতে যাত্রা এড়িয়ে চলুন।",
        5: "সিগন্যাল মেনে চলুন, ওভারটেকিং এড়িয়ে চলুন。",
        6: "আরামদায়ক গতিতে চলুন。",
        7: "একাগ্র থাকুন, ফোন ব্যবহার করবেন না。",
        8: "ব্রেক ও টায়ার নিয়মিত চেক করান。",
        9: "অতিরিক্ত গতি এড়িয়ে চলুন。"
    };
    return tips[num] || "সাবধানে গাড়ি চালনা করুন।";
}

function getPinSecurityTip(num) {
    const tips = {
        1: "শক্তিশালী, চুরির সম্ভাবনা কম। প্রতি ৩ মাস অন্তর পরিবর্তন করুন。",
        2: "সাধারণ, সতর্কতা প্রয়োজন। জন্মতারিখ এড়িয়ে চলুন。",
        3: "ভাগ্যবান, নিরাপদ। হলুদ রঙের ওয়ালেট ব্যবহার করুন。",
        4: "মাঝারি, নিয়মিত পরিবর্তন করুন। নীল রঙের খামে রাখুন。",
        5: "চঞ্চল, সাবধান। প্রতি মাসে পরিবর্তন করুন。",
        6: "স্থিতিশীল, নিরাপদ। শুক্রবারে পরিবর্তন করুন。",
        7: "গোপনীয়, ভালো। বেগুনি রং ব্যবহার করুন。",
        8: "শক্তিশালী, নিরাপদ। শনিবারে পরিবর্তন করুন。",
        9: "ভাগ্যবান, ভালো। মঙ্গলবারে পরিবর্তন করুন。"
    };
    return tips[num] || "নিরাপদ PIN, নিয়মিত পরিবর্তন করুন。";
}

function getPinLuckTip(num) {
    const tips = {
        1: "সাফল্য ও নেতৃত্বের গুণ বৃদ্ধি করবে。",
        2: "মানসিক শান্তি ও সম্পর্কের উন্নতি ঘটাবে।",
        3: "জ্ঞান ও বুদ্ধির বিকাশ ঘটাবে。",
        4: "গবেষণা ও প্রযুক্তিতে সাফল্য দেবে。",
        5: "দ্রুত সিদ্ধান্ত ও যোগাযোগ দক্ষতা বৃদ্ধি করবে。",
        6: "আর্থিক স্থিতিশীলতা ও সুখ দেবে।",
        7: "আধ্যাত্মিক উন্নতি ও গোপন লাভ দেবে。",
        8: "ধৈর্য ও স্থিরতা দেবে。",
        9: "সাহস ও শক্তি দেবে。"
    };
    return tips[num] || "ভাগ্যের উপর ইতিবাচক প্রভাব ফেলবে。";
}

function getBankStabilityTip(num) {
    const tips = {
        1: "অত্যন্ত স্থিতিশীল। দীর্ঘমেয়াদী সঞ্চয়ের জন্য উত্তম。",
        2: "মাঝারি স্থিতিশীল। যৌথ মালিকানা বেশি লাভজনক。",
        3: "শিক্ষা সংক্রান্ত বিনিয়োগে সেরা。",
        4: "অস্থিরতার সম্ভাবনা। একাধিক অ্যাকাউন্ট খোলা ভালো。",
        5: "দ্রুত লেনদেন নির্দেশ করে。 শেয়ার বাজারে সাফল্য আসে。",
        6: "অত্যন্ত স্থিতিশীল ও লাভজনক。",
        7: "গোপনীয় ও স্থিতিশীল。 গবেষণা খাতে বিনিয়োগ করলে লাভ。",
        8: "দীর্ঘমেয়াদে অত্যন্ত স্থিতিশীল। শিল্প ও স্থাবর সম্পত্তিতে বিনিয়োগ করলে লাভ。",
        9: "উদ্যমী ও সক্রিয়। প্রতিযোগিতামূলক বিনিয়োগে সাফল্য。"
    };
    return tips[num] || "স্থিতিশীল অ্যাকাউন্ট。";
}

function getPhoneCareerTip(num) {
    const tips = {
        1: "নেতৃত্বের পদ, প্রশাসন, রাজনীতি",
        2: "সৃজনশীল পেশা, শিল্পকলা, সঙ্গীত",
        3: "শিক্ষকতা, পরামর্শ, আইন",
        4: "গবেষণা, প্রযুক্তি, আইটি",
        5: "মার্কেটিং, সেলস, ট্রেডিং",
        6: "শিল্পকলা, বিনোদন, ফ্যাশন",
        7: "আধ্যাত্মিকতা, লেখালেখি, গবেষণা",
        8: "প্রশাসন, ব্যবস্থাপনা, শিল্প",
        9: "উদ্যোক্তা, রাজনীতি, সেনাবাহিনী"
    };
    return tips[num] || "যোগাযোগমূলক পেশা উত্তম。";
}

function getStockInvestmentTip(num) {
    const tips = {
        1: "দীর্ঘমেয়াদী বিনিয়োগ উত্তম। সরকারি কোম্পানির শেয়ারে বিনিয়োগ করুন。",
        2: "অল্প অল্প করে বিনিয়োগ করুন। জলের সাথে সম্পর্কিত কোম্পানির শেয়ারে বিনিয়োগ করুন。",
        3: "শিক্ষা ও পরামর্শ খাতের শেয়ারে বিনিয়োগ করুন। দীর্ঘমেয়াদী লাভ হবে。",
        4: "প্রযুক্তি খাতের শেয়ারে বিনিয়োগ করুন। অস্থিরতা থাকবে, ধৈর্য ধরুন。",
        5: "দ্রুত লাভের জন্য ট্রেডিং করুন। যোগাযোগ খাতের শেয়ারে বিনিয়োগ করুন。",
        6: "বিলাস দ্রব্য ও ফ্যাশন খাতের শেয়ারে বিনিয়োগ করুন। স্থিতিশীল লাভ হবে。",
        7: "গবেষণা ও আধ্যাত্মিক খাতের শেয়ারে বিনিয়োগ করুন। ধীরে ধীরে লাভ হবে。",
        8: "শিল্প ও স্থাবর সম্পত্তি খাতের শেয়ারে বিনিয়োগ করুন। দীর্ঘমেয়াদী লাভ হবে。",
        9: "প্রতিযোগিতামূলক খাতের শেয়ারে বিনিয়োগ করুন। দ্রুত লাভের সম্ভাবনা。"
    };
    return tips[num] || "বিনিয়োগের আগে ভালোভাবে গবেষণা করুন。";
}

function getStockProfitTime(num) {
    const tips = {
        1: "রবিবার বা সূর্যোদয়ের সময় লেনদেন করলে লাভ। দীর্ঘমেয়াদে ৩-৫ বছরে লাভ হবে।",
        2: "সোমবার বা চাঁদ উঠার সময় লেনদেন করলে লাভ। ২-৩ বছরে স্থিতিশীল লাভ হবে।",
        3: "বৃহস্পতিবার বা সকাল ৮-১০টায় লেনদেন করলে লাভ। ৪-৫ বছরে বড় লাভ হবে。",
        4: "শনিবার বা সন্ধ্যার সময় লেনদেন করলে লাভ। ৫-৬ বছরে লাভ হবে।",
        5: "বুধবার বা দুপুর ১২-২টায় লেনদেন করলে লাভ। ১-২ বছরে দ্রুত লাভ হবে。",
        6: "শুক্রবার বা সন্ধ্যার সময় লেনদেন করলে লাভ। ৩-৪ বছরে স্থিতিশীল লাভ হবে。",
        7: "শুক্রবার বা ভোর ৪-৬টায় লেনদেন করলে লাভ। ৬-৭ বছরে লাভ হবে।",
        8: "শনিবার বা সূর্যাস্তের সময় লেনদেন করলে লাভ। ৭-৮ বছরে বড় লাভ হবে。",
        9: "মঙ্গলবার বা দুপুর ১২-৩টায় লেনদেন করলে লাভ。 ৩-৪ বছরে দ্রুত লাভ হবে。"
    };
    return tips[num] || "শুভ দিনে লেনদেন করলে লাভের সম্ভাবনা বাড়ে。";
}

function getPropertyTip(num) {
    const tips = {
        1: "পূর্ব দিকের সম্পত্তি শুভ। সরকারি নিলামের সম্পত্তি লাভজনক。",
        2: "জলের ধারের সম্পত্তি শুভ। উত্তর-পশ্চিম দিকের সম্পত্তি লাভজনক。",
        3: "শিক্ষাপ্রতিষ্ঠানের কাছের সম্পত্তি শুভ। পূর্ব-উত্তর দিকের সম্পত্তি লাভজনক。",
        4: "প্রযুক্তি অঞ্চলের সম্পত্তি শুভ। দক্ষিণ-পশ্চিম দিকের সম্পত্তি লাভজনক。",
        5: "বাণিজ্যিক এলাকার সম্পত্তি শুভ। উত্তর দিকের সম্পত্তি লাভজনক。",
        6: "সৌন্দর্যপূর্ণ এলাকার সম্পত্তি শুভ। দক্ষিণ-পূর্ব দিকের সম্পত্তি লাভজনক。",
        7: "আধ্যাত্মিক এলাকার সম্পত্তি শুভ। উত্তর-পূর্ব দিকের সম্পত্তি লাভজনক。",
        8: "শিল্প এলাকার সম্পত্তি শুভ। পশ্চিম দিকের সম্পত্তি লাভজনক。",
        9: "প্রতিযোগিতামূলক এলাকার সম্পত্তি শুভ। দক্ষিণ দিকের সম্পত্তি লাভজনক。"
    };
    return tips[num] || "শুভ দিকের সম্পত্তি নির্বাচন করুন。";
}

function getPropertyGrowth(num) {
    const tips = {
        1: "৩-৫ বছরে মূল্য দ্বিগুণ হবে। সরকারি প্রকল্পের কাছের সম্পত্তি দ্রুত বাড়বে。",
        2: "২-৩ বছরে ভালো মূল্যবৃদ্ধি হবে। জলের ধারের সম্পত্তি দ্রুত বাড়বে。",
        3: "৪-৫ বছরে মূল্যবৃদ্ধি হবে। শিক্ষাপ্রতিষ্ঠানের কাছের সম্পত্তি দ্রুত বাড়বে。",
        4: "৫-৬ বছরে মূল্যবৃদ্ধি হবে। প্রযুক্তি অঞ্চলের সম্পত্তি দ্রুত বাড়বে。",
        5: "১-২ বছরে দ্রুত মূল্যবৃদ্ধি হবে। বাণিজ্যিক এলাকার সম্পত্তি দ্রুত বাড়বে。",
        6: "৩-৪ বছরে মূল্যবৃদ্ধি হবে। সৌন্দর্যপূর্ণ এলাকার সম্পত্তি দ্রুত বাড়বে。",
        7: "৬-৭ বছরে মূল্যবৃদ্ধি হবে। আধ্যাত্মিক এলাকার সম্পত্তি ধীরে ধীরে বাড়বে。",
        8: "৭-৮ বছরে বড় মূল্যবৃদ্ধি হবে। শিল্প এলাকার সম্পত্তি দ্রুত বাড়বে。",
        9: "৩-৪ বছরে দ্রুত মূল্যবৃদ্ধি হবে। প্রতিযোগিতামূলক এলাকার সম্পত্তি দ্রুত বাড়বে。"
    };
    return tips[num] || "দীর্ঘমেয়াদী বিনিয়োগ করলে লাভ হবে。";
}

function getGoldSilverTip(num) {
    const tips = {
        1: "সোনার বিনিয়োগ উত্তম। দীর্ঘমেয়াদী বিনিয়োগ করলে লাভ হবে。",
        2: "রূপার বিনিয়োগ উত্তম। অল্প অল্প করে বিনিয়োগ করুন।",
        3: "সোনার বিনিয়োগ উত্তম। শিক্ষা ও বিবাহের জন্য সোনা কিনুন。",
        4: "সোনার বিনিয়োগে সতর্কতা প্রয়োজন। বিদেশী সোনায় বিনিয়োগ করুন。",
        5: "স্বল্পমেয়াদী সোনার বিনিয়োগ লাভজনক। ডিজিটাল গোল্ডে বিনিয়োগ করুন。",
        6: "সোনা ও রূপা উভয়ই শুভ। গহনা হিসেবে কিনুন。",
        7: "সোনার বিনিয়োগে ধৈর্য ধরুন। দীর্ঘমেয়াদী লাভ হবে。",
        8: "সোনার বিনিয়োগ উত্তম। বার বা কয়েন হিসেবে কিনুন。",
        9: "সোনার বিনিয়োগ উত্তম। প্রতিযোগিতামূলক দামে কিনুন。"
    };
    return tips[num] || "দীর্ঘমেয়াদী বিনিয়োগ করলে লাভ হবে。";
}

function getGoldBuyTime(num, data) {
    return `${data.luckyDay} দিনে সোনা-রূপা কেনা শুভ। ${data.luckyColor} রঙের পোশাক পরে কেনাকাটা করুন। সকালের দিকে কেনা ভালো。`;
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
    
    // ২৪টি ক্যাটাগরির জন্য আলাদা রেন্ডারার কল
    switch(categoryId) {
        case 'personal_name':
            resultHtml = renderPersonalName(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'baby_name':
            resultHtml = renderBabyName(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'marriage':
            resultHtml = renderMarriage(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'love':
            resultHtml = renderLove(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'family':
            resultHtml = renderFamily(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'journey_date':
            resultHtml = renderJourneyDate(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'new_home':
            resultHtml = renderNewHome(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'birthday':
            resultHtml = renderBirthday(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'business_name':
            resultHtml = renderBusinessName(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'partnership':
            resultHtml = renderPartnership(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'startup_name':
            resultHtml = renderStartupName(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'logo_color':
            resultHtml = renderLogoColor(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'launch_date':
            resultHtml = renderLaunchDate(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'product_price':
            resultHtml = renderProductPrice(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'car_number':
            resultHtml = renderCarNumber(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'bike_number':
            resultHtml = renderBikeNumber(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'mobile_number':
            resultHtml = renderMobileNumber(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'bank_account':
            resultHtml = renderBankAccount(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'pin_code':
            resultHtml = renderPinCode(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'stock_market':
            resultHtml = renderStockMarket(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'property':
            resultHtml = renderProperty(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'gold_silver':
            resultHtml = renderGoldSilver(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'mulank':
            resultHtml = renderMulank(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'name_number':
            resultHtml = renderNameNumber(currentRawInput, numberData.rootNumber, analysis);
            break;
        default:
            resultHtml = renderPersonalName(currentRawInput, numberData.rootNumber, analysis);
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
    if (parts.length >= 2) {
        let validParts = 0;
        for (let part of parts) {
            const trimmed = part.trim();
            if (/^[ঙ-হA-Za-z0-9\s]{2,}$/i.test(trimmed) || /^\d+$/.test(trimmed)) {
                validParts++;
            }
        }
        return validParts >= 2;
    }
    return false;
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
    
    // মাল্টি-ইনপুট চেক
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
