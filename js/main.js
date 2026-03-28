// ============================================================
// মেইন লজিক ফাইল
// ফাইল: js/main.js
// ============================================================

// ============================================================
// ১. গ্লোবাল ভেরিয়েবল
// ============================================================
let currentRawInput = '';
let currentNumberData = null;
let currentAnalysis = null;

// ============================================================
// ২. URL প্যারামিটার ফাংশন
// ============================================================
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ============================================================
// ৩. HTML এস্কেপ ফাংশন
// ============================================================
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ============================================================
// ৪. মাল্টি-ইনপুট চেক (সঠিক ভার্সন)
// ============================================================
function isMultiInput(input) {
    // স্পষ্ট বিভাজক চিহ্ন: +, এবং, &, , 
    const separators = /[\+\&\|\,\s+(এবং)\s+(and)\s+]+/i;
    const parts = input.split(separators).filter(p => p.trim().length > 0);
    
    // যদি ২ বা তার বেশি অংশ হয় এবং প্রতিটি অংশের দৈর্ঘ্য ১ এর বেশি হয়
    if (parts.length >= 2) {
        // চেক করুন এটি শুধু একটি শব্দ নয় (যেমন "Update" ভুলবশত split হয়ে গেলে)
        const allPartsAreShort = parts.every(p => p.trim().length <= 3);
        if (allPartsAreShort && parts.length === 2) {
            // "Up date" এর মতো হতে পারে — এটা মাল্টি-ইনপুট নয়
            const combined = parts.join(' ').toLowerCase();
            if (combined === 'up date' || combined === 'update') {
                return false;
            }
        }
        return true;
    }
    return false;
}

// ============================================================
// ৫. মাল্টি-ইনপুট পার্সিং
// ============================================================
function parseMultiInput(input) {
    const separators = /[\+\&\|\,\s+(এবং)\s+(and)\s+]+/i;
    const parts = input.split(separators).filter(p => p.trim().length > 0);
    
    if (parts.length < 2) {
        return [];
    }
    
    return parts.map(part => {
        const trimmed = part.trim();
        const numberData = NumberUtils.extractNumber(trimmed);
        return {
            raw: trimmed,
            type: NumberUtils.detectType(trimmed),
            number: numberData ? numberData.rootNumber : null,
            fullData: numberData
        };
    }).filter(item => item.number !== null);
}

// ============================================================
// ৬. অটো ডিটেক্ট ক্যাটাগরি (সিঙ্গেল ইনপুটের জন্য)
// ============================================================
function autoDetectCategory(input) {
    const type = NumberUtils.detectType(input);
    
    switch(type) {
        case 'date':
            return 'mulank';
        case 'mobile':
            return 'mobile_number';
        case 'vehicle':
            return 'car_number';
        case 'price':
            return 'product_price';
        case 'business':
            return 'business_name';
        case 'name':
            return 'personal_name';
        case 'pin':
            return 'pin_code';
        case 'bank':
            return 'bank_account';
        case 'number':
            const cleaned = input.replace(/[^0-9]/g, '');
            if (cleaned.length >= 4 && cleaned.length <= 6) return 'pin_code';
            if (cleaned.length >= 9 && cleaned.length <= 15) return 'bank_account';
            return 'pin_code';
        default:
            return 'personal_name';
    }
}

// ============================================================
// ৭. সিঙ্গেল ইনপুট রেন্ডার (২৪টি ক্যাটাগরি)
// ============================================================
function renderSingleResult(input, number, analysis) {
    if (!analysis) {
        return `
            <div class="result-card error-card">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>ক্ষমা করবেন!</h2>
                <p>"${escapeHtml(input)}" - এই সংখ্যার বিশ্লেষণ পাওয়া যায়নি।</p>
            </div>
        `;
    }
    
    const rootDesc = getRootDescription(number, analysis, 'personal');
    
    return `
        <div class="result-header">
            <div class="result-number">
                <span class="big-number">${number}</span>
            </div>
            <h1 class="result-title">${analysis.identity.title}</h1>
            <p class="result-subtitle">${analysis.planet} | মূল সংখ্যা বিশ্লেষণ</p>
        </div>
        
        <div class="root-description">
            <div style="text-align: center; margin-bottom: 15px;">
                <span class="planet-badge">
                    <i class="fas fa-star"></i> মূল সংখ্যা: ${number} — ${analysis.planet}
                </span>
            </div>
            <p style="line-height: 1.8; text-align: justify;">${rootDesc}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
                <span class="badge"><i class="fas fa-palette"></i> শুভ রং: ${analysis.luckyColor}</span>
                <span class="badge"><i class="fas fa-calendar"></i> শুভ দিন: ${analysis.luckyDay}</span>
                <span class="badge"><i class="fas fa-compass"></i> শুভ দিক: ${analysis.luckyDirection}</span>
            </div>
        </div>
        
        <div class="result-card">
            <div class="info-section">
                <h3><i class="fas fa-user-astronaut"></i> ব্যক্তিত্ব ও স্বভাব</h3>
                <p>${escapeHtml(analysis.identity.description)}</p>
            </div>
            <div class="info-section">
                <h3><i class="fas fa-briefcase"></i> ক্যারিয়ার ও পেশা</h3>
                <p>${escapeHtml(analysis.business.description)}</p>
            </div>
            <div class="info-section">
                <h3><i class="fas fa-hand-sparkles"></i> জ্যোতিষীয় প্রতিকার</h3>
                <p>${escapeHtml(analysis.tip.description)}</p>
            </div>
        </div>
        
        <div class="share-buttons">
            <button class="share-btn" onclick="copyToClipboard()"><i class="fas fa-copy"></i> কপি করুন</button>
            <button class="share-btn" onclick="shareResult()"><i class="fas fa-share-alt"></i> শেয়ার করুন</button>
            <button class="share-btn" onclick="window.print()"><i class="fas fa-print"></i> প্রিন্ট করুন</button>
        </div>
    `;
}

// ============================================================
// ৮. মূল সংখ্যার বিস্তারিত ব্যাখ্যা
// ============================================================
function getRootDescription(number, data, categoryType) {
    const personalRoot = {
        1: "সূর্য গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি জন্মগতভাবে নেতৃত্বের গুণে ভূষিত হন। সূর্য যেমন সৌরজগতের কেন্দ্র, তেমনি আপনিও নিজের ক্ষেত্রে কেন্দ্রীয় ভূমিকা পালন করেন। আত্মবিশ্বাস, সৃজনশীলতা ও উদ্ভাবনী শক্তি আপনার প্রধান বৈশিষ্ট্য। স্বাধীনচেতা ও নিজের পায়ে দাঁড়াতে ভালোবাসেন। অহংকার ও কর্তৃত্বপ্রিয়তা আপনার দুর্বলতা হতে পারে। সূর্যের শক্তি আপনাকে সাফল্য ও খ্যাতি এনে দেয়।",
        2: "চন্দ্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত আবেগপ্রবণ, কল্পনাপ্রবণ ও সৃজনশীল হন। চন্দ্র যেমন সমুদ্রের জোয়ার-ভাটা নিয়ন্ত্রণ করে, তেমনি আপনার মনও আবেগের ঢেউয়ে বিচলিত হয়। মানুষের মন বুঝতে আপনার সেরা ক্ষমতা রয়েছে। সম্পর্কে আবদ্ধ থাকতে ভালোবাসেন এবং অন্যদের সেবা করাই আপনার স্বভাব। আপনার ভিতরে একজন শিল্পী, লেখক বা সঙ্গীতজ্ঞ লুকিয়ে থাকে। মানসিক অস্থিরতা আপনার প্রধান চ্যালেঞ্জ।",
        3: "বৃহস্পতি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত জ্ঞানী, আশাবাদী ও আধ্যাত্মিক হন। বৃহস্পতি গুরু গ্রহ হিসেবে পরিচিত, আর আপনিও অন্যদের পথ প্রদর্শনে সিদ্ধহস্ত। শিক্ষক, গুরু বা পরামর্শকের মতো মানুষ আপনাকে স্বাভাবিকভাবে ভক্তি করে। আপনার কথায় অন্যদের মনে প্রভাব ফেলতে পারেন। জ্ঞানার্জন ও তা বিতরণই আপনার জীবনের মূল উদ্দেশ্য। অতিরিক্ত আশাবাদ আপনার পতন ডেকে আনতে পারে।",
        4: "রাহু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত রহস্যময়, গভীর চিন্তাবিদ ও উদ্ভাবক হন। রাহু যেমন ছায়া গ্রহ, তেমনি আপনিও সাধারণের চোখের আড়ালে থাকতে ভালোবাসেন। যা অদৃশ্য, তা দেখতে আপনার বিশেষ ক্ষমতা রয়েছে। সাধারণের পথে চলতে চান না, বরং নতুন পথ তৈরি করতে ভালোবাসেন। জীবনে উঠা-পড়া থাকলেও শেষ পর্যন্ত জয়ী হন। বিদেশে সাফল্য পাওয়ার সম্ভাবনা বেশি।",
        5: "বুধ গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত বুদ্ধিমান, চটপটে ও যোগাযোগ দক্ষ হন। বুধ যেমন দেবতাদের দূত, তেমনি আপনিও তথ্য ও ধারণা আদান-প্রদানে সিদ্ধহস্ত। অল্প সময়ে অনেক কাজ করতে পারেন। ব্যবসায়িক বুদ্ধি আপনার সহজাত। যেকোনো পরিস্থিতির সাথে মানিয়ে নিতে পারেন। চঞ্চলতা ও অধৈর্যতা আপনার প্রধান দুর্বলতা。",
        6: "শুক্র গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি সৌন্দর্যপ্রিয়, বিলাসবহুল জীবন পছন্দ করেন। শুক্র যেমন সৌন্দর্য ও ভালোবাসার দেবতা, তেমনি আপনিও শিল্প, সঙ্গীত, নৃত্যে স্বাভাবিক দক্ষতা রাখেন। সম্পর্ক ও ভালোবাসা আপনার জীবনের প্রধান চালিকা শক্তি। মানুষকে আকর্ষণ করতে পারেন। অতিরিক্ত বিলাসিতা ও অনুভূতিপ্রবণতা আপনার দুর্বলতা。",
        7: "কেতু গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি আধ্যাত্মিক, গভীর চিন্তাবিদ ও গবেষক হন। কেতু যেমন মোক্ষের দিশারী, তেমনি আপনিও অদৃশ্য জগতের সাথে যোগাযোগ রাখতে পারেন। সাধারণের চেয়ে আলাদা চিন্তা করেন। একাকীত্ব ও বিষন্নতা আপনার প্রধান দুর্বলতা। লেখালেখি, গবেষণা ও আধ্যাত্মিক চর্চায় সিদ্ধিলাভ করেন。",
        8: "শনি গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত ধৈর্যশীল, পরিশ্রমী ও দায়িত্বশীল হন। শনি যেমন কর্মের ফলদাতা, তেমনি আপনিও জীবনে সংগ্রাম করে সবকিছু অর্জন করেন। বয়সের চেয়ে বেশি পরিণত বুদ্ধি রয়েছে। ন্যায়পরায়ণ ও শৃঙ্খলাপ্রিয়। জীবনের শুরুতে সংগ্রাম থাকলেও শেষে সাফল্য পাবেন। হতাশা ও নেতিবাচক চিন্তা আপনার দুর্বলতা।",
        9: "মঙ্গল গ্রহের প্রভাবে এই সংখ্যার অধিকারী ব্যক্তি অত্যন্ত সাহসী, উদ্যমী ও যোদ্ধা প্রকৃতির হন। মঙ্গল যেমন যুদ্ধের দেবতা, তেমনি আপনিও প্রতিযোগিতায় সিদ্ধহস্ত। যা করতে চান, তা যেকোনো মূল্যে করেন। প্রতিযোগিতায় আপনাকে হারানো কঠিন। রাগ ও আগ্রাসন আপনার প্রধান দুর্বলতা। সেনাবাহিনী, খেলাধুলা, প্রতিযোগিতামূলক ক্ষেত্রে সাফল্য লাভ করেন。"
    };
    
    return personalRoot[number] || `${data.planet} গ্রহের প্রভাবে এই সংখ্যার ব্যক্তি অনন্য বৈশিষ্ট্যের অধিকারী হন。`;
}

// ============================================================
// ৯. ক্যাটাগরি নির্বাচন UI (যুক্তিহীন ইনপুটের জন্য)
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

function showCategorySelection() {
    const contentDiv = document.getElementById('resultContent');
    const loadingDiv = document.getElementById('loading');
    
    let optionsHtml = '<div class="option-buttons">';
    categories.forEach(cat => {
        optionsHtml += `<button class="option-btn" onclick="selectAndShowResult('${cat.id}')">
            <i class="fas ${cat.icon}"></i> ${cat.name}
        </button>`;
    });
    optionsHtml += '</div>';
    
    const html = `
        <div class="clarification-card">
            <i class="fas fa-question-circle" style="font-size: 64px; color: #ffd700;"></i>
            <h2>"${escapeHtml(currentRawInput)}"</h2>
            <p style="margin: 15px 0; font-size: 18px;">আমি বুঝতে পারছি না। দয়া করে জানান আপনি কী জানতে চান:</p>
            ${optionsHtml}
        </div>
    `;
    
    contentDiv.innerHTML = html;
    contentDiv.style.display = 'block';
    loadingDiv.style.display = 'none';
}

function selectAndShowResult(categoryId) {
    const numberData = currentNumberData;
    if (!numberData) return;
    
    const analysis = NumerologyDB.getNumberAnalysis(numberData.rootNumber);
    if (!analysis) return;
    
    let resultHtml = renderSingleResult(currentRawInput, numberData.rootNumber, analysis);
    
    document.getElementById('resultContent').innerHTML = resultHtml;
    document.getElementById('resultContent').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

// ============================================================
// ১০. মাল্টি-ইনপুট রেন্ডার (সামঞ্জস্য মিলন)
// ============================================================
function renderMultiResult(input, items, numbers) {
    const renderData = CompatibilityCore.prepareRenderData(input, items, numbers);
    
    if (!renderData) {
        return `
            <div class="result-card error-card">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>ক্ষমা করবেন!</h2>
                <p>সামঞ্জস্য বিশ্লেষণের জন্য কমপক্ষে ২টি উপাদান প্রয়োজন।</p>
            </div>
        `;
    }
    
    return CompatibilityRenderer.render(renderData);
}

// ============================================================
// ১১. কপি ও শেয়ার ফাংশন
// ============================================================
function copyToClipboard() {
    const text = document.getElementById('resultContent')?.innerText || '';
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('ফলাফল কপি হয়েছে!');
        });
    }
}

function shareResult() {
    const text = document.getElementById('resultContent')?.innerText || '';
    if (navigator.share && text) {
        navigator.share({
            title: 'Numerology Intelligence Hub',
            text: text.substring(0, 500),
            url: window.location.href
        });
    } else {
        copyToClipboard();
    }
}

// ============================================================
// ১২. মেইন ফাংশন (পেজ লোড হলে চালু হয়)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const query = getQueryParam('q');
    
    if (!query) {
        window.location.href = 'numerology.html';
        return;
    }
    
    currentRawInput = decodeURIComponent(query);
    
    // ============================================================
    // ধাপ ১: মাল্টি-ইনপুট চেক (স্পষ্ট বিভাজক চিহ্ন থাকলেই)
    // ============================================================
    const hasExplicitSeparator = /[\+\&\|\,\s+(এবং)\s+(and)\s+]/i.test(currentRawInput);
    const partsCount = currentRawInput.split(/[\+\&\|\,\s+(এবং)\s+(and)\s+]+/i).filter(p => p.trim().length > 0).length;
    
    if (hasExplicitSeparator && partsCount >= 2) {
        const items = parseMultiInput(currentRawInput);
        
        if (items.length >= 2) {
            const validItems = items.map(i => i.raw);
            const validNumbers = items.map(i => i.number);
            const resultHtml = renderMultiResult(currentRawInput, validItems, validNumbers);
            
            document.getElementById('resultContent').innerHTML = resultHtml;
            document.getElementById('resultContent').style.display = 'block';
            document.getElementById('loading').style.display = 'none';
            return;
        }
    }
    
    // ============================================================
    // ধাপ ২: সিঙ্গেল ইনপুট (যুক্তিপূর্ণ) - সরাসরি রেজাল্ট
    // ============================================================
    if (NumberUtils.isMeaningful(currentRawInput)) {
        currentNumberData = NumberUtils.extractNumber(currentRawInput);
        
        if (currentNumberData) {
            const category = autoDetectCategory(currentRawInput);
            selectAndShowResult(category);
            return;
        }
    }
    
    // ============================================================
    // ধাপ ৩: সিঙ্গেল ইনপুট (যুক্তিহীন) - ক্যাটাগরি জিজ্ঞেস করবে
    // ============================================================
    currentNumberData = NumberUtils.extractNumber(currentRawInput);
    
    if (currentNumberData) {
        showCategorySelection();
    } else {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('resultContent').innerHTML = `
            <div class="result-card error-card">
                <i class="fas fa-exclamation-triangle" style="font-size:64px;color:#ffd700"></i>
                <h2>ক্ষমা করবেন!</h2>
                <p>"${escapeHtml(currentRawInput)}" - এতে কোনো সংখ্যা খুঁজে পাওয়া যায়নি।</p>
                <p>দয়া করে সংখ্যা সম্বলিত কিছু লিখুন (যেমন: নাম, তারিখ, নম্বর)</p>
                <a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a>
            </div>
        `;
        document.getElementById('resultContent').style.display = 'block';
    }
});
