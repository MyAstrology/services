// match-making.js
// অষ্টকূট পদ্ধতিতে কুষ্ঠি মিলন (Match Making)
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার

// ==================== ১. নক্ষত্রের ডেটা ====================

// ২৭ নক্ষত্রের গণ (দেব/মনুষ্য/রাক্ষস)
const NAKSHATRA_GANA = {
    "অশ্বিনী": "দেব", "ভরণী": "মনুষ্য", "কৃত্তিকা": "রাক্ষস",
    "রোহিণী": "মনুষ্য", "মৃগশিরা": "দেব", "আর্দ্রা": "মনুষ্য",
    "পুনর্বসু": "দেব", "পুষ্যা": "দেব", "অশ্লেষা": "রাক্ষস",
    "মঘা": "রাক্ষস", "পূর্বফাল্গুনী": "মনুষ্য", "উত্তরফাল্গুনী": "মনুষ্য",
    "হস্তা": "দেব", "চিত্রা": "রাক্ষস", "স্বাতী": "দেব",
    "বিশাখা": "রাক্ষস", "অনুরাধা": "দেব", "জ্যেষ্ঠা": "রাক্ষস",
    "মূলা": "রাক্ষস", "পূর্বাষাঢ়া": "মনুষ্য", "উত্তরাষাঢ়া": "মনুষ্য",
    "শ্রবণা": "দেব", "ধনিষ্ঠা": "রাক্ষস", "শতভিষা": "রাক্ষস",
    "পূর্বভাদ্রপদ": "মনুষ্য", "উত্তরভাদ্রপদ": "মনুষ্য", "রেবতী": "দেব"
};

// নক্ষত্রের যোনি (পশু প্রকৃতি)
const NAKSHATRA_YONI = {
    "অশ্বিনী": "অশ্ব", "ভরণী": "গজ", "কৃত্তিকা": "মেষ",
    "রোহিণী": "সর্প", "মৃগশিরা": "সর্প", "আর্দ্রা": "শ্বান",
    "পুনর্বসু": "মার্জার", "পুষ্যা": "মেষ", "অশ্লেষা": "মার্জার",
    "মঘা": "মূষিক", "পূর্বফাল্গুনী": "মূষিক", "উত্তরফাল্গুনী": "গো",
    "হস্তা": "মহিষ", "চিত্রা": "ব্যাঘ্র", "স্বাতী": "মহিষ",
    "বিশাখা": "ব্যাঘ্র", "অনুরাধা": "মৃগ", "জ্যেষ্ঠা": "মৃগ",
    "মূলা": "শ্বান", "পূর্বাষাঢ়া": "বানর", "উত্তরাষাঢ়া": "নকুল",
    "শ্রবণা": "বানর", "ধনিষ্ঠা": "সিংহ", "শতভিষা": "অশ্ব",
    "পূর্বভাদ্রপদ": "সিংহ", "উত্তরভাদ্রপদ": "গো", "রেবতী": "গজ"
};

// নক্ষত্রের নাড়ি (আদ্য/মধ্য/অন্ত্য)
const NAKSHATRA_NADI = {
    "অশ্বিনী": "আদ্য", "ভরণী": "মধ্য", "কৃত্তিকা": "অন্ত্য",
    "রোহিণী": "অন্ত্য", "মৃগশিরা": "মধ্য", "আর্দ্রা": "আদ্য",
    "পুনর্বসু": "অন্ত্য", "পুষ্যা": "মধ্য", "অশ্লেষা": "অন্ত্য",
    "মঘা": "অন্ত্য", "পূর্বফাল্গুনী": "মধ্য", "উত্তরফাল্গুনী": "অন্ত্য",
    "হস্তা": "অন্ত্য", "চিত্রা": "মধ্য", "স্বাতী": "অন্ত্য",
    "বিশাখা": "মধ্য", "অনুরাধা": "মধ্য", "জ্যেষ্ঠা": "অন্ত্য",
    "মূলা": "অন্ত্য", "পূর্বাষাঢ়া": "মধ্য", "উত্তরাষাঢ়া": "অন্ত্য",
    "শ্রবণা": "অন্ত্য", "ধনিষ্ঠা": "মধ্য", "শতভিষা": "অন্ত্য",
    "পূর্বভাদ্রপদ": "আদ্য", "উত্তরভাদ্রপদ": "মধ্য", "রেবতী": "অন্ত্য"
};

// নক্ষত্রের বর্ণ
const NAKSHATRA_VARNA = {
    "অশ্বিনী": "ব্রাহ্মণ", "ভরণী": "ক্ষত্রিয়", "কৃত্তিকা": "ব্রাহ্মণ",
    "রোহিণী": "শূদ্র", "মৃগশিরা": "ক্ষত্রিয়", "আর্দ্রা": "ব্রাহ্মণ",
    "পুনর্বসু": "বৈশ্য", "পুষ্যা": "ক্ষত্রিয়", "অশ্লেষা": "শূদ্র",
    "মঘা": "শূদ্র", "পূর্বফাল্গুনী": "ব্রাহ্মণ", "উত্তরফাল্গুনী": "ক্ষত্রিয়",
    "হস্তা": "বৈশ্য", "চিত্রা": "শূদ্র", "স্বাতী": "বৈশ্য",
    "বিশাখা": "ক্ষত্রিয়", "অনুরাধা": "শূদ্র", "জ্যেষ্ঠা": "বৈশ্য",
    "মূলা": "শূদ্র", "পূর্বাষাঢ়া": "ব্রাহ্মণ", "উত্তরাষাঢ়া": "ক্ষত্রিয়",
    "শ্রবণা": "ব্রাহ্মণ", "ধনিষ্ঠা": "বৈশ্য", "শতভিষা": "শূদ্র",
    "পূর্বভাদ্রপদ": "ব্রাহ্মণ", "উত্তরভাদ্রপদ": "ক্ষত্রিয়", "রেবতী": "শূদ্র"
};

// ==================== ২. অষ্টকূট মিলন ====================

/**
 * ১. বর্ণ কূট (১ গুণ)
 * বর্ণের মিল অনুযায়ী পয়েন্ট
 */
function calculateVarnaKoota(girlNakshatra, boyNakshatra) {
    const girlVarna = NAKSHATRA_VARNA[girlNakshatra];
    const boyVarna = NAKSHATRA_VARNA[boyNakshatra];
    
    if (!girlVarna || !boyVarna) return { points: 0, max: 1, description: "তথ্য নেই" };
    
    const varnaOrder = ["ব্রাহ্মণ", "ক্ষত্রিয়", "বৈশ্য", "শূদ্র"];
    const girlIdx = varnaOrder.indexOf(girlVarna);
    const boyIdx = varnaOrder.indexOf(boyVarna);
    
    if (boyIdx >= girlIdx) return { points: 1, max: 1, description: `ছেলের বর্ণ ${boyVarna}, মেয়ের বর্ণ ${girlVarna} — উত্তম মিল` };
    if (boyIdx === girlIdx - 1) return { points: 0.5, max: 1, description: `ছেলের বর্ণ ${boyVarna}, মেয়ের বর্ণ ${girlVarna} — মধ্যম মিল` };
    return { points: 0, max: 1, description: `ছেলের বর্ণ ${boyVarna}, মেয়ের বর্ণ ${girlVarna} — অমিল` };
}

/**
 * ২. বসু কূট (২ গুণ)
 * রাশির গণনা অনুযায়ী
 */
function calculateVasuKoota(girlRashi, boyRashi) {
    const vasuRashi = {
        "মেষ": 0, "বৃষ": 1, "মিথুন": 2, "কর্কট": 3,
        "সিংহ": 4, "কন্যা": 5, "তুলা": 6, "বৃশ্চিক": 7,
        "ধনু": 8, "মকর": 9, "কুম্ভ": 10, "মীন": 11
    };
    
    const girlIdx = vasuRashi[girlRashi] || 0;
    const boyIdx = vasuRashi[boyRashi] || 0;
    
    if (girlIdx === boyIdx) return { points: 0, max: 2, description: "একই রাশি — অমিল" };
    if (girlIdx === (boyIdx + 12 - 1) % 12 || girlIdx === (boyIdx + 1) % 12) {
        return { points: 0, max: 2, description: "পার্শ্ববর্তী রাশি — অমিল" };
    }
    if (girlIdx === (boyIdx + 12 - 2) % 12 || girlIdx === (boyIdx + 2) % 12) {
        return { points: 1, max: 2, description: "দ্বিতীয় রাশি — মধ্যম মিল" };
    }
    return { points: 2, max: 2, description: "উত্তম মিল" };
}

/**
 * ৩. তারা কূট (৩ গুণ)
 * নক্ষত্রের দূরত্ব অনুযায়ী
 */
function calculateTaraKoota(girlNakshatraIndex, boyNakshatraIndex) {
    const distance = ((girlNakshatraIndex - boyNakshatraIndex + 27) % 27);
    const tara = (distance % 9) + 1;
    
    if (tara === 3 || tara === 5 || tara === 7) {
        return { points: 0, max: 3, description: `${tara}ম তারা — অশুভ, অমিল` };
    }
    return { points: 3, max: 3, description: `${tara}ম তারা — শুভ, উত্তম মিল` };
}

/**
 * ৪. যোনি কূট (৪ গুণ)
 * পশু প্রকৃতির মিল
 */
function calculateYoniKoota(girlNakshatra, boyNakshatra) {
    const girlYoni = NAKSHATRA_YONI[girlNakshatra];
    const boyYoni = NAKSHATRA_YONI[boyNakshatra];
    
    if (!girlYoni || !boyYoni) return { points: 0, max: 4, description: "তথ্য নেই" };
    
    if (girlYoni === boyYoni) return { points: 4, max: 4, description: `উভয়ের যোনি ${girlYoni} — একই, সর্বোত্তম মিল` };
    
    // বন্ধু যোনি
    const friendYonis = {
        "অশ্ব": ["মহিষ"], "গজ": ["মূষিক"], "মেষ": ["মৃগ"],
        "সর্প": ["মার্জার"], "মার্জার": ["সর্প"], "মূষিক": ["গজ"],
        "মহিষ": ["অশ্ব"], "মৃগ": ["মেষ"], "শ্বান": ["বানর"],
        "বানর": ["শ্বান"], "ব্যাঘ্র": ["সিংহ"], "সিংহ": ["ব্যাঘ্র"],
        "গো": ["নকুল"], "নকুল": ["গো"]
    };
    
    if (friendYonis[girlYoni] && friendYonis[girlYoni].includes(boyYoni)) {
        return { points: 3, max: 4, description: `মেয়ের যোনি ${girlYoni}, ছেলের যোনি ${boyYoni} — বন্ধু যোনি, ভালো মিল` };
    }
    
    return { points: 0, max: 4, description: `মেয়ের যোনি ${girlYoni}, ছেলের যোনি ${boyYoni} — শত্রু যোনি, অমিল` };
}

/**
 * ৫. গ্রহমৈত্রী কূট (৫ গুণ)
 * রাশির অধিপতিদের সম্পর্ক
 */
function calculateGrahaMaitriKoota(girlRashi, boyRashi) {
    const rashiLords = {
        "মেষ": "মঙ্গল", "বৃষ": "শুক্র", "মিথুন": "বুধ", "কর্কট": "চন্দ্র",
        "সিংহ": "সূর্য", "কন্যা": "বুধ", "তুলা": "শুক্র", "বৃশ্চিক": "মঙ্গল",
        "ধনু": "বৃহস্পতি", "মকর": "শনি", "কুম্ভ": "শনি", "মীন": "বৃহস্পতি"
    };
    
    const friends = {
        "সূর্য": ["চন্দ্র", "মঙ্গল", "বৃহস্পতি"],
        "চন্দ্র": ["সূর্য", "বুধ"],
        "মঙ্গল": ["সূর্য", "চন্দ্র", "বৃহস্পতি"],
        "বুধ": ["সূর্য", "শুক্র"],
        "বৃহস্পতি": ["সূর্য", "চন্দ্র", "মঙ্গল"],
        "শুক্র": ["বুধ", "শনি"],
        "শনি": ["বুধ", "শুক্র"]
    };
    
    const girlLord = rashiLords[girlRashi];
    const boyLord = rashiLords[boyRashi];
    
    if (girlLord === boyLord) return { points: 5, max: 5, description: `উভয়ের রাশিপতি ${girlLord} — একই, সর্বোত্তম মিল` };
    if (friends[boyLord] && friends[boyLord].includes(girlLord)) {
        return { points: 4, max: 5, description: `ছেলের রাশিপতি ${boyLord}, মেয়ের রাশিপতি ${girlLord} — বন্ধু, ভালো মিল` };
    }
    return { points: 0, max: 5, description: `ছেলের রাশিপতি ${boyLord}, মেয়ের রাশিপতি ${girlLord} — শত্রু, অমিল` };
}

/**
 * ৬. গণ কূট (৬ গুণ)
 * দেব/মনুষ্য/রাক্ষস গণ
 */
function calculateGanaKoota(girlNakshatra, boyNakshatra) {
    const girlGana = NAKSHATRA_GANA[girlNakshatra];
    const boyGana = NAKSHATRA_GANA[boyNakshatra];
    
    if (!girlGana || !boyGana) return { points: 0, max: 6, description: "তথ্য নেই" };
    
    if (girlGana === boyGana) return { points: 6, max: 6, description: `উভয়ের গণ ${girlGana} — একই, সর্বোত্তম মিল` };
    
    if (girlGana === "দেব" && boyGana === "মনুষ্য") return { points: 5, max: 6, description: "দেব ও মনুষ্য — ভালো মিল" };
    if (girlGana === "মনুষ্য" && boyGana === "দেব") return { points: 3, max: 6, description: "মনুষ্য ও দেব — মধ্যম মিল" };
    if (girlGana === "দেব" && boyGana === "রাক্ষস") return { points: 1, max: 6, description: "দেব ও রাক্ষস — খারাপ মিল" };
    if (girlGana === "রাক্ষস" && boyGana === "দেব") return { points: 0, max: 6, description: "রাক্ষস ও দেব — অমিল" };
    if (girlGana === "মনুষ্য" && boyGana === "রাক্ষস") return { points: 3, max: 6, description: "মনুষ্য ও রাক্ষস — মধ্যম মিল" };
    if (girlGana === "রাক্ষস" && boyGana === "মনুষ্য") return { points: 1, max: 6, description: "রাক্ষস ও মনুষ্য — খারাপ মিল" };
    
    return { points: 0, max: 6, description: "অমিল" };
}

/**
 * ৭. ভকূট (৭ গুণ)
 * রাশির অবস্থান অনুযায়ী
 */
function calculateBhakoota(girlRashi, boyRashi) {
    const rashiOrder = ["মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"];
    const girlIdx = rashiOrder.indexOf(girlRashi);
    const boyIdx = rashiOrder.indexOf(boyRashi);
    
    const distance = ((boyIdx - girlIdx + 12) % 12) + 1;
    
    // ২-১২, ৩-১১, ৪-১০, ৫-৯, ৬-৮ ভকূট দোষ
    if (distance === 2 || distance === 12) return { points: 0, max: 7, description: `দ্বি-দ্বাদশ অবস্থান — ভকূট দোষ, অমিল` };
    if (distance === 5 || distance === 9) return { points: 0, max: 7, description: `পঞ্চম-নবম অবস্থান — ভকূট দোষ, অমিল` };
    if (distance === 1 || distance === 7) return { points: 7, max: 7, description: `এক-সপ্তম অবস্থান — উত্তম মিল` };
    
    return { points: 4, max: 7, description: "মধ্যম মিল" };
}

/**
 * ৮. নাড়ি কূট (৮ গুণ)
 */
function calculateNadiKoota(girlNakshatra, boyNakshatra) {
    const girlNadi = NAKSHATRA_NADI[girlNakshatra];
    const boyNadi = NAKSHATRA_NADI[boyNakshatra];
    
    if (!girlNadi || !boyNadi) return { points: 0, max: 8, description: "তথ্য নেই" };
    
    if (girlNadi === boyNadi) return { points: 0, max: 8, description: `উভয়ের নাড়ি ${girlNadi} — একই, নাড়ি দোষ, অমিল` };
    return { points: 8, max: 8, description: `মেয়ের নাড়ি ${girlNadi}, ছেলের নাড়ি ${boyNadi} — ভিন্ন, উত্তম মিল` };
}

// ==================== ৩. মাঙ্গলিক দোষ ====================

function checkManglikDosha(marsRashi, lagnaRashi) {
    const rashiOrder = ["মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"];
    const marsIdx = rashiOrder.indexOf(marsRashi);
    const lagnaIdx = rashiOrder.indexOf(lagnaRashi);
    
    const house = ((marsIdx - lagnaIdx + 12) % 12) + 1;
    
    // ১, ৪, ৭, ৮, ১২ ভাবে মঙ্গল = মাঙ্গলিক দোষ
    if ([1, 4, 7, 8, 12].includes(house)) {
        return { hasDosha: true, house, description: `মঙ্গল ${house}ম ভাবে — মাঙ্গলিক দোষ আছে` };
    }
    return { hasDosha: false, house, description: `মঙ্গল ${house}ম ভাবে — মাঙ্গলিক দোষ নেই` };
}

// ==================== ৪. পূর্ণাঙ্গ মিলন ====================

function calculateMatchMaking(girlData, boyData) {
    const girlNakshatra = girlData.moonNakshatra;
    const boyNakshatra = boyData.moonNakshatra;
    const girlNakshatraIndex = girlData.moonNakshatraIndex;
    const boyNakshatraIndex = boyData.moonNakshatraIndex;
    const girlRashi = girlData.moonRashi;
    const boyRashi = boyData.moonRashi;
    const girlMarsRashi = girlData.marsRashi;
    const boyMarsRashi = boyData.marsRashi;
    const girlLagna = girlData.lagnaRashi;
    const boyLagna = boyData.lagnaRashi;
    
    // অষ্টকূট গণনা
    const varna = calculateVarnaKoota(girlNakshatra, boyNakshatra);
    const vasu = calculateVasuKoota(girlRashi, boyRashi);
    const tara = calculateTaraKoota(girlNakshatraIndex, boyNakshatraIndex);
    const yoni = calculateYoniKoota(girlNakshatra, boyNakshatra);
    const grahaMaitri = calculateGrahaMaitriKoota(girlRashi, boyRashi);
    const gana = calculateGanaKoota(girlNakshatra, boyNakshatra);
    const bhakoota = calculateBhakoota(girlRashi, boyRashi);
    const nadi = calculateNadiKoota(girlNakshatra, boyNakshatra);
    
    const totalPoints = varna.points + vasu.points + tara.points + yoni.points + 
                       grahaMaitri.points + gana.points + bhakoota.points + nadi.points;
    const maxPoints = varna.max + vasu.max + tara.max + yoni.max + 
                     grahaMaitri.max + gana.max + bhakoota.max + nadi.max;
    
    // মাঙ্গলিক দোষ
    const girlManglik = checkManglikDosha(girlMarsRashi, girlLagna);
    const boyManglik = checkManglikDosha(boyMarsRashi, boyLagna);
    
    // ফলাফল
    let result = "";
    if (totalPoints >= 32) result = "অত্যুত্তম — বিবাহের জন্য সর্বোত্তম যোগ";
    else if (totalPoints >= 25) result = "উত্তম — বিবাহের জন্য ভালো যোগ";
    else if (totalPoints >= 18) result = "মধ্যম — বিবাহ সম্ভব, তবে কিছু প্রতিকার প্রয়োজন";
    else if (totalPoints >= 12) result = "সাধারণ — বিবাহের আগে সতর্কতা ও প্রতিকার প্রয়োজন";
    else result = "অশুভ — বিবাহ সুপারিশ করা যায় না";
    
    return {
        kootas: { varna, vasu, tara, yoni, grahaMaitri, gana, bhakoota, nadi },
        totalPoints,
        maxPoints,
        result,
        manglik: {
            girl: girlManglik,
            boy: boyManglik,
            match: girlManglik.hasDosha === boyManglik.hasDosha
        },
        doshaWarnings: getDoshaWarnings(nadi.points, bhakoota.points, gana.points)
    };
}

function getDoshaWarnings(nadiPoints, bhakootaPoints, ganaPoints) {
    const warnings = [];
    if (nadiPoints === 0) warnings.push("⚠️ নাড়ি দোষ বিদ্যমান — সন্তান জন্মে সমস্যা হতে পারে। বিশেষ পূজা ও দান করে এই দোষ প্রশমিত করা যায়।");
    if (bhakootaPoints === 0) warnings.push("⚠️ ভকূট দোষ বিদ্যমান — দাম্পত্য জীবনে টানাপোড়েন আসতে পারে। নিয়মিত লক্ষ্মী-নারায়ণ পূজা করলে এই দোষ কাটে।");
    if (ganaPoints <= 1) warnings.push("⚠️ গণ দোষ বিদ্যমান — মানসিক অমিল হতে পারে। শিব-পার্বতী পূজা করলে এই দোষ প্রশমিত হয়।");
    return warnings;
}

/**
 * কুষ্ঠি মিলনের পূর্ণাঙ্গ রিপোর্ট তৈরি করে
 */
function generateMatchMakingReport(matchResult, girlName, boyName) {
    const gName = girlName || "মেয়ে";
    const bName = boyName || "ছেলে";
    
    let output = `💑 ${gName} ও ${bName}-এর কুষ্ঠি মিলন ফলাফল\n`;
    output += "═".repeat(50) + "\n\n";
    
    // মোট গুণ
    output += `📊 মোট গুণ: ${matchResult.totalPoints} / ${matchResult.maxPoints}\n`;
    output += `📋 ফলাফল: ${matchResult.result}\n\n`;
    
    // অষ্টকূট টেবিল
    output += "📝 অষ্টকূট বিবরণ:\n";
    output += "─".repeat(40) + "\n";
    
    const kootas = matchResult.kootas;
    const kootaNames = [
        { name: "বর্ণ", data: kootas.varna },
        { name: "বসু", data: kootas.vasu },
        { name: "তারা", data: kootas.tara },
        { name: "যোনি", data: kootas.yoni },
        { name: "গ্রহমৈত্রী", data: kootas.grahaMaitri },
        { name: "গণ", data: kootas.gana },
        { name: "ভকূট", data: kootas.bhakoota },
        { name: "নাড়ি", data: kootas.nadi }
    ];
    
    kootaNames.forEach(k => {
        const status = k.data.points === k.data.max ? "✅" : k.data.points === 0 ? "❌" : "⚠️";
        output += `${status} ${k.name}: ${k.data.points}/${k.data.max} — ${k.data.description}\n`;
    });
    
    output += "\n";
    
    // মাঙ্গলিক দোষ
    output += "🔴 মাঙ্গলিক দোষ:\n";
    output += "─".repeat(40) + "\n";
    output += `মেয়ে: ${matchResult.manglik.girl.description}\n`;
    output += `ছেলে: ${matchResult.manglik.boy.description}\n`;
    
    if (matchResult.manglik.match) {
        output += "✅ উভয়ের মাঙ্গলিক অবস্থা সমান — এই দোষ প্রশমিত হয়।\n";
    } else {
        output += "⚠️ উভয়ের মাঙ্গলিক অবস্থা অসমান — প্রতিকার প্রয়োজন।\n";
    }
    
    output += "\n";
    
    // দোষ সতর্কতা
    if (matchResult.doshaWarnings.length > 0) {
        output += "⚠️ বিশেষ সতর্কতা:\n";
        output += "─".repeat(40) + "\n";
        matchResult.doshaWarnings.forEach(w => {
            output += w + "\n";
        });
        output += "\n";
    }
    
    output += "═".repeat(50) + "\n";
    output += "🙏 ওঁ নমঃ শিবায়। বিবাহ মহাবন্ধন—সঠিক বিচার করে তবেই এই বন্ধনে আবদ্ধ হোন।\n";
    
    return output;
}

console.log("✅ কুষ্ঠি মিলন (Match Making) সিস্টেম লোড সম্পন্ন হয়েছে।");
console.log("🔍 ব্যবহার: calculateMatchMaking(girlData, boyData)");
console.log("🔍 ব্যবহার: generateMatchMakingReport(result, 'মেয়ের নাম', 'ছেলের নাম')");
