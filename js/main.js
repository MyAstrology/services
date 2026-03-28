// ============================================================
// মেইন লজিক ফাইল (সংশোধিত - ক্যাটাগরি অনুযায়ী আলাদা রেন্ডারার)
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
// ক্যাটাগরি অনুযায়ী আলাদা রেন্ডারার ফাংশন
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

// 2. ব্যবসার নাম (ব্যক্তিগত বৈশিষ্ট্য নেই!)
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

// 3. PIN কোড (ব্যক্তিগত বৈশিষ্ট্য নেই!)
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
            <div class="info-section"><h3><i class="fas fa-exclamation-triangle"></i> সতর্কতা</h3><p>প্রতি ৩ মাস অন্তর কোড পরিবর্তন করুন। ${data.luckyDay} দিনে কোড পরিবর্তন করলে বিশেষ ফল পাওয়া যায়।</p></div>
        </div>
    `;
}

// 4. গাড়ির নম্বর
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
            <div class="info-section"><h3><i class="fas fa-wrench"></i> রক্ষণাবেক্ষণ পরামর্শ</h3><p>${getVehicleMaintenanceTip(number)}</p></div>
        </div>
    `;
}

// 5. ব্যাংক অ্যাকাউন্ট
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

// 6. মূল্য নির্ধারণ
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

// 7. মূলাংক বিশ্লেষণ
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
            <div class="info-section"><h3><i class="fas fa-hand-sparkles"></i> প্রতিকার</h3><p>${escapeHtml(data.tip.description)}</p></div>
        </div>
    `;
}

// 8. মোবাইল নম্বর
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

// 9. শিশুর নাম
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

// 10. বিবাহ মিলন
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

// ============================================================
// হেল্পার ফাংশন (ব্যবসা, PIN, গাড়ি ইত্যাদির জন্য আলাদা)
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
        9: "মঙ্গল গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত সাহসী, উদ্যমী ও যোদ্ধা প্রকৃতির হন। মঙ্গল যেমন যুদ্ধের দেবতা, তেমনি আপনিও প্রতিযোগিতায় সিদ্ধহস্ত。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই সংখ্যার ব্যক্তি অনন্য বৈশিষ্ট্যের অধিকারী হন।`;
}

function getBusinessRootDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই ব্যবসার নাম অত্যন্ত শক্তিশালী ও নেতৃত্বমূলক। প্রশাসন, রাজনীতি, স্টার্টআপ, টেকনোলজি ফার্ম - এই ক্ষেত্রগুলোতে এই নাম অত্যন্ত সফল হবে। একক মালিকানা আপনার জন্য শ্রেয়। লাল ও সোনালি রঙের লোগো ব্যবহার করলে ব্র্যান্ড ভ্যালু বৃদ্ধি পায়।",
        2: "চন্দ্রের প্রভাবে এই ব্যবসার নামটি জনপ্রিয়তা ও গ্রাহক আকর্ষণে সিদ্ধ। রেস্টুরেন্ট, হোটেল, ট্রাভেল এজেন্সি, ইভেন্ট ম্যানেজমেন্ট - এই খাতে এই নাম অত্যন্ত কার্যকর। সাদা ও রূপালি রঙের ব্যবহার গ্রাহকদের মনে আস্থা তৈরি করে।",
        3: "বৃহস্পতির প্রভাবে এই ব্যবসার নামটি জ্ঞান ও বিশ্বাসের প্রতীক। শিক্ষা প্রতিষ্ঠান, কোচিং সেন্টার, পাবলিশিং হাউস, আইন সংস্থা - এই খাতে এই নাম অত্যন্ত সম্মানজনক। হলুদ ও সোনালি রঙের লোগো ব্যবহার করলে প্রতিষ্ঠানের মর্যাদা বৃদ্ধি পায়।",
        4: "রাহুর প্রভাবে এই ব্যবসার নামটি প্রযুক্তি ও গবেষণা নির্ভর ব্যবসার জন্য সেরা। আইটি সেক্টর, সাইবার সিকিউরিটি, ইমপোর্ট-এক্সপোর্ট - এই খাতে এই নাম অত্যন্ত কার্যকর। নীল ও কালো রঙের ব্যবহার করলে ব্যবসায় স্থিতিশীলতা আসে।",
        5: "বুধের প্রভাবে এই ব্যবসার নামটি যোগাযোগ ও বাণিজ্যের জন্য অত্যন্ত শুভ। ট্রেডিং, মার্কেটিং, ডিজিটাল মার্কেটিং, মিডিয়া - এই খাতে এই নাম অত্যন্ত সফল। সবুজ ও আকাশি রঙের ব্যবহার গ্রাহকদের দৃষ্টি আকর্ষণ করে।",
        6: "শুক্রের প্রভাবে এই ব্যবসার নামটি সৌন্দর্য ও বিলাস দ্রব্যের ব্যবসার জন্য সেরা। কসমেটিকস, ফ্যাশন হাউস, জুয়েলারি, আর্ট গ্যালারি - এই খাতে এই নাম অত্যন্ত আকর্ষণীয়। সাদা, গোলাপি ও হালকা নীল রঙের ব্যবহার করলে ব্র্যান্ডের সৌন্দর্য বৃদ্ধি পায়。",
        7: "কেতুর প্রভাবে এই ব্যবসার নামটি গবেষণা ও আধ্যাত্মিক ব্যবসার জন্য উত্তম। রিসার্চ সেন্টার, পাবলিশিং হাউস, আধ্যাত্মিক সংস্থা - এই খাতে এই নাম অত্যন্ত সম্মানজনক। হলুদ ও বেগুনি রঙের ব্যবহার করলে ব্যবসায় গভীরতা আসে。",
        8: "শনির প্রভাবে এই ব্যবসার নামটি শিল্প ও স্থায়ী ব্যবসার জন্য সেরা। ম্যানুফ্যাকচারিং, ইঞ্জিনিয়ারিং, কনস্ট্রাকশন, রিয়েল এস্টেট - এই খাতে এই নাম অত্যন্ত স্থিতিশীল। কালো, নীল ও গাঢ় সবুজ রঙের ব্যবহার করলে ব্যবসায় দীর্ঘমেয়াদী স্থিতিশীলতা আসে।",
        9: "মঙ্গলের প্রভাবে এই ব্যবসার নামটি প্রতিযোগিতামূলক ও শক্তি নির্ভর ব্যবসার জন্য সেরা। কনস্ট্রাকশন, ডিফেন্স কন্ট্রাক্ট, স্পোর্টস ক্লাব - এই খাতে এই নাম অত্যন্ত শক্তিশালী। লাল ও কমলা রঙের ব্যবহার করলে ব্যবসায় উদ্যম ও প্রতিযোগিতার শক্তি বৃদ্ধি পায়。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই ব্যবসার নামটি সাফল্য এনে দেবে।`;
}

function getPinDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই PIN কোডটি অত্যন্ত শক্তিশালী ও নিরাপদ। লাল রঙের ওয়ালেট ব্যবহার করলে নিরাপত্তা বৃদ্ধি পায়। প্রতি ৩ মাস অন্তর কোড পরিবর্তন করা শুভ।",
        2: "চন্দ্রের প্রভাবে এই PIN কোডটি আবেগপ্রবণ। জন্মতারিখ এড়িয়ে চলুন। সোমবারে কোড পরিবর্তন করলে মানসিক স্থিরতা আসে。",
        3: "বৃহস্পতির আশীর্বাদে এই PIN কোডটি জ্ঞান ও ভাগ্যের প্রতীক। হলুদ রঙের সাথে সম্পর্কিত। বৃহস্পতিবারে কোড পরিবর্তন করলে মঙ্গল।",
        4: "রাহুর প্রভাবে এই PIN কোডটি রহস্যময়। নীল খামে সংরক্ষণ করলে ভালো। শনিবারে কোড পরিবর্তন করুন।",
        5: "বুধের প্রভাবে এই PIN কোডটি চঞ্চল। প্রতি মাসে অন্তত একবার কোড পরিবর্তন করা উত্তম। বুধবারে কোড পরিবর্তন করলে যোগাযোগ দক্ষতা বৃদ্ধি পায়।",
        6: "শুক্রের কৃপায় এই PIN কোডটি সৌন্দর্যের প্রতীক। শুক্রবারে কোড পরিবর্তন করলে আর্থিক স্থিতিশীলতা আসে।",
        7: "কেতুর প্রভাবে এই PIN কোডটি আধ্যাত্মিক ও গভীর। বেগুনি রং ব্যবহার করুন। শুক্রবারে পরিবর্তন করুন।",
        8: "শনির প্রভাবে এই PIN কোডটি অত্যন্ত শক্তিশালী। শনিবারে কোড পরিবর্তন করলে দীর্ঘমেয়াদী নিরাপত্তা নিশ্চিত হয়।",
        9: "মঙ্গলের প্রভাবে এই PIN কোডটি সাহসী। মঙ্গলবারে কোড পরিবর্তন করলে আত্মবিশ্বাস বৃদ্ধি পায়。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই PIN কোডটি মাঝারি নিরাপত্তা প্রদান করে।`;
}

function getVehicleDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই গাড়ির নম্বরটি অত্যন্ত শক্তিশালী ও শুভ। পূর্ব দিকে যাত্রা করলে বিশেষ সাফল্য। সূর্যোদয়ের সময় যাত্রা শুরু করলে মঙ্গল। দ্রুত গতি এড়িয়ে চলুন।",
        2: "চন্দ্রের প্রভাবে এই গাড়ির নম্বরটি আবেগপ্রবণ। সোমবারে যাত্রা করলে মঙ্গল। উত্তর-পশ্চিম দিকে যাত্রা করলে ভালো ফল। অমাবস্যার দিন যাত্রা এড়িয়ে চলুন।",
        3: "বৃহস্পতির প্রভাবে এই গাড়ির নম্বরটি জ্ঞান ও আশাবাদের প্রতীক। শিক্ষা বা ব্যবসায়িক ভ্রমণে শুভ। বৃহস্পতিবার যাত্রা করলে মঙ্গল。",
        4: "রাহুর প্রভাবে এই গাড়ির নম্বরটি রহস্যময়। রাতের বেলা যাত্রা এড়িয়ে চলুন। শনিবারে যাত্রা করলে ভালো। যাত্রার আগে ধূপ জ্বালিয়ে নিন。",
        5: "বুধের প্রভাবে এই গাড়ির নম্বরটি চঞ্চল। স্বল্প দূরত্বের যাত্রায় শুভ। বুধবার যাত্রা করলে মঙ্গল। সিগন্যাল মেনে চলুন。",
        6: "শুক্রের প্রভাবে এই গাড়ির নম্বরটি সৌন্দর্যপ্রিয়। বিনোদন বা পারিবারিক ভ্রমণে উত্তম। শুক্রবার যাত্রা করলে ভালো。",
        7: "কেতুর প্রভাবে এই গাড়ির নম্বরটি আধ্যাত্মিক। তীর্থস্থান ভ্রমণে শুভ। শুক্রবার ও শনিবার যাত্রা করলে মঙ্গল。",
        8: "শনির প্রভাবে এই গাড়ির নম্বরটি ধৈর্যশীল। পার্বত্য অঞ্চলে সতর্ক থাকুন। শনিবার ও মঙ্গলবার যাত্রা করলে ভালো。",
        9: "মঙ্গলের প্রভাবে এই গাড়ির নম্বরটি সাহসী। প্রতিযোগিতামূলক ভ্রমণে শুভ। মঙ্গলবার ও রবিবার যাত্রা করলে মঙ্গল。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই গাড়ির নম্বরটি যাত্রার জন্য মধ্যম ফল দেবে。`;
}

function getBankDescription(number, data) {
    const desc = {
        1: "সূর্যের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অত্যন্ত স্থিতিশীল। দীর্ঘমেয়াদী সঞ্চয়ের জন্য উত্তম। লাল রঙের চেকবুক ব্যবহার করলে ভালো।",
        2: "চন্দ্রের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি মাঝারি স্থিতিশীল। যৌথ মালিকানা বেশি লাভজনক। সাদা রঙের পাসবুক ব্যবহার করলে ভালো。",
        3: "বৃহস্পতির প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি শিক্ষা সংক্রান্ত বিনিয়োগে সেরা। হলুদ রঙের চেক ব্যবহার করলে মঙ্গল。",
        4: "রাহুর প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অস্থিরতার সম্ভাবনা রাখে। নীল রঙের সাথে সম্পর্কিত。",
        5: "বুধের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি দ্রুত লেনদেন নির্দেশ করে। সবুজ রঙের পাসবুক ব্যবহার করলে লাভ।",
        6: "শুক্রের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি অত্যন্ত স্থিতিশীল ও লাভজনক। সাদা ও গোলাপি রঙের চেকবুক ব্যবহার করলে সাফল্য।",
        7: "কেতুর প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি গোপনীয় ও স্থিতিশীল। বেগুনি রঙের সাথে সম্পর্কিত।",
        8: "শনির প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি দীর্ঘমেয়াদে অত্যন্ত স্থিতিশীল। কালো ও নীল রঙের সাথে সম্পর্কিত。",
        9: "মঙ্গলের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি উদ্যমী ও সক্রিয়। লাল রঙের সাথে সম্পর্কিত。"
    };
    return desc[number] || `${data.planet} গ্রহের প্রভাবে এই ব্যাংক অ্যাকাউন্ট নম্বরটি মাঝারি স্থিতিশীলতা প্রদান করে。`;
}

function getPriceDescription(number, data) {
    const isGood = [3,6,9].includes(number);
    if (isGood) {
        return `${data.planet} গ্রহের প্রভাবে এই মূল্যটি অত্যন্ত শুভ ও ব্যবসার জন্য অনুকূল। এই সংখ্যার কম্পন আর্থিক স্থিতিশীলতা ও লাভের সম্ভাবনা বৃদ্ধি করে।`;
    } else {
        return `${data.planet} গ্রহের প্রভাবে এই মূল্যটি সতর্কতা প্রয়োজন। বিকল্প মূল্য হিসেবে ৩, ৬, ৯ সংখ্যার দাম নির্বাচন করলে লাভের সম্ভাবনা বাড়ে。`;
    }
}

// ============================================================
// সহায়ক টিপস ফাংশন
// ============================================================

function getPartnershipAdvice(num) {
    const tips = {
        1: "একক মালিকানা শ্রেয়। অংশীদারিত্ব করলে ১, ৩ বা ৯ সংখ্যার ব্যক্তিদের সাথে করুন。",
        2: "অংশীদারিত্ব শুভ। ২, ৬ ও ৭ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব করলে সাফল্য。",
        3: "৩, ৬ ও ৯ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব উত্তম। শিক্ষা খাতে অংশীদারি করলে সাফল্য。",
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
        1: "'আমি নেতা, আমি পথপ্রদর্শক' — এই বিশ্বাস নিয়ে এগিয়ে চলুন।",
        2: "'সহযোগিতা ও সম্পর্কই মূলধন' — টিম ওয়ার্কের মাধ্যমে ব্যবসা বাড়ান।",
        3: "'জ্ঞানই শক্তি, শিক্ষাই পথ' — জ্ঞান বিতরণের মাধ্যমে ব্যবসার প্রসার ঘটান。",
        4: "'গবেষণা ও উদ্ভাবনই সাফল্যের চাবিকাঠি' — নতুন পথ তৈরি করুন。",
        5: "'যোগাযোগ ও গতিশীলতাই মূলমন্ত্র' — দ্রুত সিদ্ধান্ত নিন。",
        6: "'সৌন্দর্য ও সম্পর্কই ব্যবসার প্রাণ' — ক্রিয়েটিভিটি ও নেটওয়ার্কিং করুন。",
        7: "'গুণগত মান ও আধ্যাত্মিকতাই পাথেয়' — গভীরে যান, সত্য আবিষ্কার করুন。",
        8: "'ধৈর্য ও সংগঠনই সাফল্যের মূল' — দীর্ঘমেয়াদী পরিকল্পনা করুন。",
        9: "'সাহস ও উদ্যমই শক্তি' — প্রতিযোগিতায় এগিয়ে থাকুন。"
    };
    return mantras[num] || "সৎ ও নিষ্ঠার সাথে কাজ করুন।";
}

function getPinSecurityTip(num) {
    const tips = {
        1: "শক্তিশালী, চুরির সম্ভাবনা কম। প্রতি ৩ মাস অন্তর পরিবর্তন করুন।",
        2: "সাধারণ, সতর্কতা প্রয়োজন। জন্মতারিখ এড়িয়ে চলুন।",
        3: "ভাগ্যবান, নিরাপদ। হলুদ রঙের ওয়ালেট ব্যবহার করুন。",
        4: "মাঝারি, নিয়মিত পরিবর্তন করুন। নীল রঙের খামে রাখুন।",
        5: "চঞ্চল, সাবধান। প্রতি মাসে পরিবর্তন করুন।",
        6: "স্থিতিশীল, নিরাপদ। শুক্রবারে পরিবর্তন করুন।",
        7: "গোপনীয়, ভালো। বেগুনি রং ব্যবহার করুন。",
        8: "শক্তিশালী, নিরাপদ। শনিবারে পরিবর্তন করুন。",
        9: "ভাগ্যবান, ভালো। মঙ্গলবারে পরিবর্তন করুন。"
    };
    return tips[num] || "নিরাপদ PIN, নিয়মিত পরিবর্তন করুন।";
}

function getPinLuckTip(num) {
    const tips = {
        1: "সাফল্য ও নেতৃত্বের গুণ বৃদ্ধি করবে।",
        2: "মানসিক শান্তি ও সম্পর্কের উন্নতি ঘটাবে।",
        3: "জ্ঞান ও বুদ্ধির বিকাশ ঘটাবে।",
        4: "গবেষণা ও প্রযুক্তিতে সাফল্য দেবে।",
        5: "দ্রুত সিদ্ধান্ত ও যোগাযোগ দক্ষতা বৃদ্ধি করবে。",
        6: "আর্থিক স্থিতিশীলতা ও সুখ দেবে।",
        7: "আধ্যাত্মিক উন্নতি ও গোপন লাভ দেবে。",
        8: "ধৈর্য ও স্থিরতা দেবে।",
        9: "সাহস ও শক্তি দেবে。"
    };
    return tips[num] || "ভাগ্যের উপর ইতিবাচক প্রভাব ফেলবে。";
}

function getVehicleSafetyTip(num) {
    const tips = {
        1: "দ্রুত গাড়ি চালানো এড়িয়ে চলুন। নিয়মিত ব্রেক চেক করান。",
        2: "রাতে সতর্ক থাকুন, হেডলাইট চেক করুন。",
        3: "নিয়মিত সার্ভিস করান。",
        4: "রাতে যাত্রা এড়িয়ে চলুন。",
        5: "সিগন্যাল মেনে চলুন, ওভারটেকিং এড়িয়ে চলুন。",
        6: "আরামদায়ক গতিতে চলুন。",
        7: "একাগ্র থাকুন, ফোন ব্যবহার করবেন না。",
        8: "ব্রেক ও টায়ার নিয়মিত চেক করান。",
        9: "অতিরিক্ত গতি এড়িয়ে চলুন。"
    };
    return tips[num] || "সাবধানে গাড়ি চালনা করুন।";
}

function getVehicleMaintenanceTip(num) {
    const tips = {
        1: "প্রতি ৫০০০ কিলোমিটারে ইঞ্জিন অয়েল পরিবর্তন করুন。",
        2: "ব্যাটারি ও লাইটিং সিস্টেম নিয়মিত চেক করান。",
        3: "এয়ার ফিল্টার নিয়মিত পরিবর্তন করুন。",
        4: "টায়ার প্রেশার ও ব্রেক ফ্লুইড নিয়মিত চেক করান。",
        5: "কুলিং সিস্টেম নিয়মিত চেক করান。",
        6: "গাড়ির অভ্যন্তর ও বাহ্যিক পরিষ্কার রাখুন。",
        7: "সাসপেনশন ও স্টিয়ারিং নিয়মিত চেক করান。",
        8: "ট্রান্সমিশন ফ্লুইড নিয়মিত চেক করান。",
        9: "এক্সজস্ট সিস্টেম নিয়মিত চেক করান。"
    };
    return tips[num] || "গাড়ি নিয়মিত সার্ভিস করান。";
}

function getBankStabilityTip(num) {
    const tips = {
        1: "অত্যন্ত স্থিতিশীল। দীর্ঘমেয়াদী সঞ্চয়ের জন্য উত্তম。",
        2: "মাঝারি স্থিতিশীল。 যৌথ মালিকানা বেশি লাভজনক।",
        3: "শিক্ষা সংক্রান্ত বিনিয়োগে সেরা。",
        4: "অস্থিরতার সম্ভাবনা। একাধিক অ্যাকাউন্ট খোলা ভালো。",
        5: "দ্রুত লেনদেন নির্দেশ করে। শেয়ার বাজারে সাফল্য আসে。",
        6: "অত্যন্ত স্থিতিশীল ও লাভজনক。",
        7: "গোপনীয় ও স্থিতিশীল। গবেষণা খাতে বিনিয়োগ করলে লাভ।",
        8: "দীর্ঘমেয়াদে অত্যন্ত স্থিতিশীল। শিল্প ও স্থাবর সম্পত্তিতে বিনিয়োগ করলে লাভ।",
        9: "উদ্যমী ও সক্রিয়। প্রতিযোগিতামূলক বিনিয়োগে সাফল্য。"
    };
    return tips[num] || "স্থিতিশীল অ্যাকাউন্ট।";
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

function getBabyFutureTip(num) {
    const tips = {
        1: "নেতৃত্ব গুণাবলী বিকশিত হবে। ভবিষ্যতে প্রশাসক বা উদ্যোক্তা হতে পারে。",
        2: "সৃজনশীল ও কল্পনাপ্রবণ হবে। শিল্পী, লেখক বা সঙ্গীতজ্ঞ হতে পারে。",
        3: "জ্ঞানী ও পণ্ডিত হবে। শিক্ষক, গবেষক বা পরামর্শক হতে পারে。",
        4: "গবেষক ও উদ্ভাবক হবে। প্রযুক্তি ও বিজ্ঞান ক্ষেত্রে সাফল্য পাবে。",
        5: "যোগাযোগে দক্ষ ও বুদ্ধিমান হবে। মার্কেটিং, মিডিয়া বা ব্যবসায় সফল হবে。",
        6: "শিল্পী ও সৌন্দর্যপ্রিয় হবে। ফ্যাশন, আর্ট বা বিনোদন ক্ষেত্রে সাফল্য পাবে。",
        7: "আধ্যাত্মিক ও গভীর চিন্তাবিদ হবে। গবেষণা বা আধ্যাত্মিক পথে যাবে。",
        8: "ধৈর্যশীল ও দায়িত্বশীল হবে। প্রশাসন, শিল্প বা অর্থনৈতিক ক্ষেত্রে সফল হবে。",
        9: "সাহসী ও উদ্যমী হবে。 সেনাবাহিনী, খেলাধুলা বা প্রতিযোগিতামূলক ক্ষেত্রে সাফল্য পাবে。"
    };
    return tips[num] || "সুপ্রতিভ ও সফল হবে।";
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
        8: "শনির প্রভাবে এই সংখ্যার ব্যক্তি ধৈর্যশীল ও দায়িত্বশীল。 আদর্শ সঙ্গী হবে ৮, ৪ বা ১ সংখ্যার ব্যক্তি。",
        9: "মঙ্গলের প্রভাবে এই সংখ্যার ব্যক্তি সাহসী ও উদ্যমী। আদর্শ সঙ্গী হবে ৯, ১ বা ৩ সংখ্যার ব্যক্তি。"
    };
    return tips[num] || "সামঞ্জস্য ভালো। সম্পর্কের উন্নয়ন সম্ভব।";
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

// ============================================================
// মাল্টি-ইনপুট চেক ফাংশন
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
// ক্যাটাগরি লিস্ট (২৪টি)
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
    
    // ক্যাটাগরি অনুযায়ী সঠিক রেন্ডারার কল
    switch(categoryId) {
        case 'personal_name':
            resultHtml = renderPersonalName(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'baby_name':
            resultHtml = renderBabyName(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'marriage':
        case 'love':
            resultHtml = renderMarriage(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'business_name':
        case 'startup_name':
            resultHtml = renderBusinessName(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'car_number':
        case 'bike_number':
            resultHtml = renderCarNumber(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'pin_code':
            resultHtml = renderPinCode(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'bank_account':
            resultHtml = renderBankAccount(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'product_price':
            resultHtml = renderProductPrice(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'mulank':
            resultHtml = renderMulank(currentRawInput, numberData.rootNumber, analysis);
            break;
        case 'mobile_number':
            resultHtml = renderMobileNumber(currentRawInput, numberData.rootNumber, analysis);
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
