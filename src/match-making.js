  // ============================================================
// match-making.js (COMPLETE UPDATED VERSION)
// অষ্টকূট পদ্ধতিতে কুষ্ঠি মিলন + YotakBicharEngine
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার
// ============================================================

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

// ==================== ২. মাঙ্গলিক দোষ ====================

function checkManglikDosha(marsRashi, lagnaRashi) {
    const rashiOrder = ["মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"];
    const marsIdx = rashiOrder.indexOf(marsRashi);
    const lagnaIdx = rashiOrder.indexOf(lagnaRashi);
    
    if (marsIdx === -1 || lagnaIdx === -1) return { isManglik: false, house: -1, description: "তথ্য নেই" };
    
    const house = ((marsIdx - lagnaIdx + 12) % 12) + 1;
    const isManglik = [1, 2, 4, 7, 8, 12].includes(house);
    
    return {
        isManglik,
        hasDosha: isManglik,
        house,
        description: isManglik
            ? `মঙ্গল ${house}ম ভাবে — মাঙ্গলিক দোষ আছে`
            : `মঙ্গল ${house}ম ভাবে — মাঙ্গলিক দোষ নেই`
    };
}

// ==================== ৩. পূর্ণাঙ্গ মিলন (YotakBicharEngine সহ) ====================

function calculateMatchMaking(girlData, boyData) {
    // YotakBicharEngine ব্যবহার করে পূর্ণাঙ্গ গণনা
    if (typeof YotakBicharEngine !== 'undefined') {
        const engine = new YotakBicharEngine();
        const result = engine.match(girlData, boyData);
        
        return {
            totalScore: result.total,
            maxScore: result.max,
            result: result.verdict,
            varna: result.kootas.varna.points,
            vashya: result.kootas.vashya.points,
            tara: result.kootas.tara.points,
            yoni: result.kootas.yoni.points,
            graha: result.kootas.grahaMaitri.points,
            gana: result.kootas.gana.points,
            bhakoot: result.kootas.rashi.points,
            nadi: result.kootas.nadi.points,
            kootas: result.kootas,
            manglik: result.manglik,
            isRajaYotak: result.isRajaYotak,
            verdictFull: result.verdictFull,
            remedies: result.remedies,
            fullPredictions: {
                varna: result.kootas.varna.full,
                vashya: result.kootas.vashya.full,
                tara: result.kootas.tara.full,
                yoni: result.kootas.yoni.full,
                grahaMaitri: result.kootas.grahaMaitri.full,
                gana: result.kootas.gana.full,
                rashi: result.kootas.rashi.full,
                nadi: result.kootas.nadi.full
            }
        };
    }
    
    // ফলব্যাক: পুরনো পদ্ধতি
    console.warn("⚠️ YotakBicharEngine পাওয়া যায়নি, সরলীকৃত গণনা ব্যবহার করা হচ্ছে।");
    return fallbackMatchMaking(girlData, boyData);
}

/**
 * ফলব্যাক মিলন গণনা (যদি YotakBicharEngine লোড না হয়)
 */
function fallbackMatchMaking(girlData, boyData) {
    const girlNak = girlData.moonNakshatra;
    const boyNak = boyData.moonNakshatra;
    const girlRashi = girlData.moonRashi;
    const boyRashi = boyData.moonRashi;
    const girlNakIdx = girlData.moonNakshatraIndex;
    const boyNakIdx = boyData.moonNakshatraIndex;
    
    // বর্ণকূট (১)
    const varnaOrder = ["ব্রাহ্মণ", "ক্ষত্রিয়", "বৈশ্য", "শূদ্র"];
    const gv = NAKSHATRA_VARNA[girlNak] || "শূদ্র";
    const bv = NAKSHATRA_VARNA[boyNak] || "শূদ্র";
    const gvIdx = varnaOrder.indexOf(gv), bvIdx = varnaOrder.indexOf(bv);
    let varnaPts = 0;
    if (bvIdx >= gvIdx) varnaPts = 1;
    else if (bvIdx === gvIdx - 1) varnaPts = 0.5;
    
    // তারা কূট (৩)
    const taraDist = ((girlNakIdx - boyNakIdx + 27) % 27);
    const tara = (taraDist % 9) + 1;
    const taraPts = [3,5,7].includes(tara) ? 0 : 3;
    
    // যোনি কূট (৪)
    const gy = NAKSHATRA_YONI[girlNak] || "", by = NAKSHATRA_YONI[boyNak] || "";
    let yoniPts = 0;
    if (gy === by) yoniPts = 4;
    else if (gy && by && gy !== by) yoniPts = 2;
    
    // গ্রহমৈত্রী কূট (৫) - সরলীকৃত
    const grahaPts = 2.5;
    
    // গণ কূট (৬)
    const gg = NAKSHATRA_GANA[girlNak] || "", bg = NAKSHATRA_GANA[boyNak] || "";
    let ganaPts = 0;
    if (gg === bg) ganaPts = 6;
    else if (gg === "দেব" && bg === "মনুষ্য") ganaPts = 5;
    else if (gg === "মনুষ্য" && bg === "দেব") ganaPts = 3;
    else if (gg === "দেব" && bg === "রাক্ষস") ganaPts = 1;
    else if (gg === "মনুষ্য" && bg === "রাক্ষস") ganaPts = 3;
    else if (gg === "রাক্ষস" && bg === "মনুষ্য") ganaPts = 1;
    
    // ভকূট (৭) - সরলীকৃত
    const rashiOrder = ["মেষ","বৃষ","মিথুন","কর্কট","সিংহ","কন্যা","তুলা","বৃশ্চিক","ধনু","মকর","কুম্ভ","মীন"];
    const gri = rashiOrder.indexOf(girlRashi), bri = rashiOrder.indexOf(boyRashi);
    const dist = ((bri - gri + 12) % 12) + 1;
    let bhakootPts = 0;
    if ([1,7,4,10,3,11].includes(dist)) bhakootPts = 7;
    
    // নাড়ি কূট (৮)
    const gn = NAKSHATRA_NADI[girlNak] || "", bn = NAKSHATRA_NADI[boyNak] || "";
    const nadiPts = (gn && bn && gn !== bn) ? 8 : 0;
    
    // বশ্যকূট (২) - সরলীকৃত
    const vashyaPts = 1;
    
    const total = varnaPts + vashyaPts + taraPts + yoniPts + grahaPts + ganaPts + bhakootPts + nadiPts;
    
    let verdict = "";
    if (total >= 30) verdict = "শ্রেষ্ঠতম";
    else if (total >= 25) verdict = "উত্তম";
    else if (total >= 18) verdict = "মধ্যম";
    else verdict = "অশুভ";
    
    const girlMarsRashi = girlData.marsRashi || "মেষ";
    const boyMarsRashi = boyData.marsRashi || "মেষ";
    const girlLagna = girlData.lagnaRashi || "মেষ";
    const boyLagna = boyData.lagnaRashi || "মেষ";
    
    const girlManglik = checkManglikDosha(girlMarsRashi, girlLagna);
    const boyManglik = checkManglikDosha(boyMarsRashi, boyLagna);
    
    const totalRounded = Math.round(total * 10) / 10;
    return {
        totalScore: totalRounded,
        totalPoints: totalRounded,
        maxScore: 36,
        result: verdict,
        varna: varnaPts, vashya: vashyaPts, tara: taraPts, yoni: yoniPts,
        graha: grahaPts, gana: ganaPts, bhakoot: bhakootPts, nadi: nadiPts,
        kootas: {
            varna:       { points: varnaPts },
            vasu:        { points: vashyaPts },
            tara:        { points: taraPts },
            yoni:        { points: yoniPts },
            grahaMaitri: { points: grahaPts },
            gana:        { points: ganaPts },
            bhakoota:    { points: bhakootPts },
            nadi:        { points: nadiPts }
        },
        manglik: {
            girl: { hasDosha: girlManglik.isManglik, full: girlManglik.description },
            boy: { hasDosha: boyManglik.isManglik, full: boyManglik.description },
            match: girlManglik.isManglik === boyManglik.isManglik
        },
        isRajaYotak: false,
        verdictFull: `মোট ${totalRounded} গুণ — ${verdict} মিলন।`,
        remedies: ["বিস্তারিত জানতে YotakBicharEngine লোড করুন।"],
        fullPredictions: null
    };
}

// ==================== ৪. পূর্ণাঙ্গ রিপোর্ট ====================

function generateMatchMakingReport(matchResult, girlName, boyName) {
    const gName = girlName || "কন্যা";
    const bName = boyName || "বর";
    
    // যদি YotakBicharEngine থেকে পূর্ণাঙ্গ ডেটা থাকে
    if (matchResult.fullPredictions) {
        let output = `╔══════════════════════════════════════════════════╗\n`;
        output += `║     💑 কুষ্ঠি মিলন — যোটক-বিচার ফলাফল     ║\n`;
        output += `╚══════════════════════════════════════════════════╝\n\n`;
        
        output += `👰 কন্যা: ${gName}\n🤵 বর: ${bName}\n\n`;
        output += `📊 মোট গুণ: ${matchResult.totalScore} / ${matchResult.maxScore}\n`;
        output += `📋 ফলাফল: ${matchResult.result}\n\n`;
        
        if (matchResult.isRajaYotak) output += `👑 রাজযোটক যোগ বিদ্যমান!\n\n`;
        output += matchResult.verdictFull + "\n\n";
        
        output += `📝 অষ্টকূট বিবরণ:\n${"═".repeat(50)}\n`;
        const kootaDefs = [
            { name: "বর্ণকূট", key: "varna", max: 1 },
            { name: "বশ্যকূট", key: "vashya", max: 2 },
            { name: "তারাকূট", key: "tara", max: 3 },
            { name: "যোনিকূট", key: "yoni", max: 4 },
            { name: "গ্রহমৈত্রীকূট", key: "grahaMaitri", max: 5 },
            { name: "গণমৈত্রীকূট", key: "gana", max: 6 },
            { name: "রাশিকূট (ভকূট)", key: "rashi", max: 7 },
            { name: "ত্রিনাড়ীকূট", key: "nadi", max: 8 }
        ];
        
        kootaDefs.forEach(k => {
            const pts = matchResult.kootas[k.key]?.points || 0;
            const icon = pts === k.max ? "✨" : pts === 0 ? "⚠️" : "🔸";
            output += `${icon} ${k.name}: ${pts}/${k.max} গুণ\n`;
        });
        
        output += `\n📖 বিস্তারিত ফলাফল:\n${"═".repeat(50)}\n\n`;
        
        kootaDefs.forEach(k => {
            const full = matchResult.fullPredictions[k.key];
            if (full) output += `🕉️ ${k.name}:\n${full}\n\n`;
        });
        
        output += `🔴 মাঙ্গলিক দোষ:\n${"═".repeat(50)}\n`;
        output += `👰 ${gName}: ${matchResult.manglik.girl.full}\n\n`;
        output += `🤵 ${bName}: ${matchResult.manglik.boy.full}\n\n`;
        
        if (matchResult.manglik.match) {
            output += `✅ উভয়ের মাঙ্গলিক অবস্থা সমান — দোষ পরস্পর বাতিল।\n\n`;
        } else {
            output += `⚠️ উভয়ের মাঙ্গলিক অবস্থা অসমান — প্রতিকার আবশ্যক।\n\n`;
        }
        
        output += `🙏 প্রতিকার:\n${"═".repeat(50)}\n`;
        (matchResult.remedies || []).forEach(r => output += r + "\n");
        
        output += `\n${"═".repeat(50)}\n`;
        output += `🕉️ ওঁ নমঃ শিবায়। বিবাহ মহাবন্ধন—সঠিক বিচার করে তবেই এই বন্ধনে আবদ্ধ হোন।\n`;
        output += `শুভম ভবতু। মাঙ্গল্যম ভবতু।\n`;
        
        return output;
    }
    
    // সরল রিপোর্ট (ফলব্যাক)
    let output = `💑 ${gName} ও ${bName}-এর কুষ্ঠি মিলন ফলাফল\n`;
    output += "═".repeat(50) + "\n\n";
    output += `📊 মোট গুণ: ${matchResult.totalScore} / ${matchResult.maxScore}\n`;
    output += `📋 ফলাফল: ${matchResult.result}\n\n`;
    
    const kootas = [
        { name: "বর্ণ", key: "varna", max: 1 },
        { name: "বসু", key: "vashya", max: 2 },
        { name: "তারা", key: "tara", max: 3 },
        { name: "যোনি", key: "yoni", max: 4 },
        { name: "গ্রহমৈত্রী", key: "graha", max: 5 },
        { name: "গণ", key: "gana", max: 6 },
        { name: "ভকূট", key: "bhakoot", max: 7 },
        { name: "নাড়ি", key: "nadi", max: 8 }
    ];
    
    output += "📝 অষ্টকূট:\n" + "─".repeat(40) + "\n";
    kootas.forEach(k => {
        const pts = matchResult[k.key] || 0;
        const icon = pts === k.max ? "✅" : pts === 0 ? "❌" : "⚠️";
        output += `${icon} ${k.name}: ${pts}/${k.max}\n`;
    });
    
    output += "\n🔴 মাঙ্গলিক:\n" + "─".repeat(40) + "\n";
    output += `মেয়ে: ${matchResult.manglik?.girl?.full || 'তথ্য নেই'}\n`;
    output += `ছেলে: ${matchResult.manglik?.boy?.full || 'তথ্য নেই'}\n`;
    
    output += "\n" + "═".repeat(50) + "\n";
    output += "🙏 ওঁ নমঃ শিবায়।\n";
    
    return output;
}

console.log("✅ match-making.js — YotakBicharEngine সহ সম্পূর্ণ লোড");
console.log("🔍 calculateMatchMaking(girlData, boyData)");
console.log("🔍 generateMatchMakingReport(result, 'মেয়ের নাম', 'ছেলের নাম')");

/**
 * ============================================================
 * yotak-bichar.js — COMPLETE UPDATED VERSION
 * Vedic Astrology Ashtakoot Match Making (যোটক-বিচার)
 * 8 Kootas × Detailed Philosophical Predictions
 * Language: Bengali (বাংলা) | Personal Address (আপনাদের)
 * Classical References + Remedies + Manglik Dosha
 * ============================================================
 */

class YotakBicharEngine {
    constructor() {
        // ==================== মৌলিক ডেটা ====================
        this.rashiNames = [
            "মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা",
            "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"
        ];

        this.nakshatraNames = [
            "অশ্বিনী", "ভরণী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা",
            "পুনর্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূর্বফাল্গুনী", "উত্তরফাল্গুনী",
            "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা",
            "মূলা", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা", "শতভিষা",
            "পূর্বভাদ্রপদ", "উত্তরভাদ্রপদ", "রেবতী"
        ];

        // রাশি অনুযায়ী বর্ণ (শাস্ত্রীয়)
        this.rashiVarna = {
            "মীন": "বিপ্র", "কর্কট": "বিপ্র", "বৃশ্চিক": "বিপ্র",
            "মেষ": "ক্ষত্রিয়", "সিংহ": "ক্ষত্রিয়", "ধনু": "ক্ষত্রিয়",
            "বৃষ": "বৈশ্য", "কন্যা": "বৈশ্য", "মকর": "বৈশ্য",
            "মিথুন": "শূদ্র", "তুলা": "শূদ্র", "কুম্ভ": "শূদ্র"
        };
        this.varnaRank = { "বিপ্র": 4, "ক্ষত্রিয়": 3, "বৈশ্য": 2, "শূদ্র": 1 };

        // নক্ষত্র গণ
        this.nakshatraGana = {
            "অশ্বিনী":"দেব", "মৃগশিরা":"দেব", "পুনর্বসু":"দেব", "পুষ্যা":"দেব",
            "হস্তা":"দেব", "স্বাতী":"দেব", "অনুরাধা":"দেব", "শ্রবণা":"দেব", "রেবতী":"দেব",
            "ভরণী":"নর", "রোহিণী":"নর", "আর্দ্রা":"নর", "পূর্বফাল্গুনী":"নর",
            "উত্তরফাল্গুনী":"নর", "পূর্বাষাঢ়া":"নর", "উত্তরাষাঢ়া":"নর",
            "পূর্বভাদ্রপদ":"নর", "উত্তরভাদ্রপদ":"নর",
            "কৃত্তিকা":"রাক্ষস", "অশ্লেষা":"রাক্ষস", "মঘা":"রাক্ষস",
            "চিত্রা":"রাক্ষস", "বিশাখা":"রাক্ষস", "জ্যেষ্ঠা":"রাক্ষস",
            "মূলা":"রাক্ষস", "ধনিষ্ঠা":"রাক্ষস", "শতভিষা":"রাক্ষস"
        };

        // নক্ষত্র যোনি
        this.nakshatraYoni = {
            "অশ্বিনী":"অশ্ব", "শতভিষা":"অশ্ব",
            "স্বাতী":"মহিষ", "হস্তা":"মহিষ",
            "পূর্বভাদ্রপদ":"সিংহ", "ধনিষ্ঠা":"সিংহ",
            "ভরণী":"হস্তী", "রেবতী":"হস্তী",
            "কৃত্তিকা":"মেষ", "পুষ্যা":"মেষ",
            "পূর্বাষাঢ়া":"বানর", "শ্রবণা":"বানর",
            "রোহিণী":"সর্প", "মৃগশিরা":"সর্প",
            "জ্যেষ্ঠা":"হরিণ", "অনুরাধা":"হরিণ",
            "আর্দ্রা":"কুকুর", "মূলা":"কুকুর",
            "উত্তরফাল্গুনী":"গো", "উত্তরভাদ্রপদ":"গো",
            "চিত্রা":"ব্যাঘ্র", "বিশাখা":"ব্যাঘ্র",
            "অশ্লেষা":"বিড়াল", "পুনর্বসু":"বিড়াল",
            "মঘা":"ইন্দুর", "পূর্বফাল্গুনী":"ইন্দুর",
            "উত্তরাষাঢ়া":"নকুল"
        };

        // যোনি শত্রুতা
        this.yoniEnmity = {
            "গো":"ব্যাঘ্র", "ব্যাঘ্র":"গো", "হস্তী":"সিংহ", "সিংহ":"হস্তী",
            "অশ্ব":"মহিষ", "মহিষ":"অশ্ব", "কুকুর":"হরিণ", "হরিণ":"কুকুর",
            "সর্প":"নকুল", "নকুল":"সর্প", "বানর":"মেষ", "মেষ":"বানর",
            "বিড়াল":"ইন্দুর", "ইন্দুর":"বিড়াল"
        };

        // নক্ষত্র নাড়ী
        this.nakshatraNadi = {
            "অশ্বিনী":"আদ্য", "আর্দ্রা":"আদ্য", "পূর্বভাদ্রপদ":"আদ্য",
            "পুনর্বসু":"আদ্য", "হস্তা":"আদ্য", "জ্যেষ্ঠা":"আদ্য",
            "মূলা":"আদ্য", "শ্রবণা":"আদ্য", "রেবতী":"আদ্য",
            "ভরণী":"মধ্য", "মৃগশিরা":"মধ্য", "পুষ্যা":"মধ্য",
            "পূর্বফাল্গুনী":"মধ্য", "চিত্রা":"মধ্য", "অনুরাধা":"মধ্য",
            "পূর্বাষাঢ়া":"মধ্য", "ধনিষ্ঠা":"মধ্য", "উত্তরভাদ্রপদ":"মধ্য",
            "কৃত্তিকা":"অন্ত্য", "রোহিণী":"অন্ত্য", "অশ্লেষা":"অন্ত্য",
            "মঘা":"অন্ত্য", "উত্তরফাল্গুনী":"অন্ত্য", "স্বাতী":"অন্ত্য",
            "বিশাখা":"অন্ত্য", "উত্তরাষাঢ়া":"অন্ত্য", "শতভিষা":"অন্ত্য"
        };

        // রাশ্যাধিপতি
        this.rashiLords = {
            "মেষ":"মঙ্গল", "বৃষ":"শুক্র", "মিথুন":"বুধ", "কর্কট":"চন্দ্র",
            "সিংহ":"সূর্য", "কন্যা":"বুধ", "তুলা":"শুক্র", "বৃশ্চিক":"মঙ্গল",
            "ধনু":"বৃহস্পতি", "মকর":"শনি", "কুম্ভ":"শনি", "মীন":"বৃহস্পতি"
        };

        // গ্রহ মিত্রতা
        this.planetRelations = {
            "সূর্য":{f:["চন্দ্র","মঙ্গল","বৃহস্পতি"],e:["শুক্র","শনি"]},
            "চন্দ্র":{f:["সূর্য","বুধ"],e:["শুক্র","শনি"]},
            "মঙ্গল":{f:["সূর্য","চন্দ্র","বৃহস্পতি"],e:["বুধ","শুক্র","শনি"]},
            "বুধ":{f:["সূর্য","শুক্র"],e:["চন্দ্র"]},
            "বৃহস্পতি":{f:["সূর্য","চন্দ্র","মঙ্গল"],e:["বুধ","শুক্র"]},
            "শুক্র":{f:["বুধ","শনি"],e:["সূর্য","চন্দ্র"]},
            "শনি":{f:["বুধ","শুক্র"],e:["সূর্য","চন্দ্র","মঙ্গল"]}
        };

        this.manglikHouses = [1, 2, 4, 7, 8, 12];
    }

    getNakshatraIndex(nak) { return this.nakshatraNames.indexOf(nak); }
    getRashiIndex(rashi) { return this.rashiNames.indexOf(rashi); }

    /**
     * ১. বর্ণকূট (সর্বোচ্চ ১ গুণ)
     * বরের বর্ণ কন্যার সমান বা উচ্চ হলে শুভ
     */
    calcVarna(girlRashi, boyRashi) {
        const gv = this.rashiVarna[girlRashi] || "শূদ্র";
        const bv = this.rashiVarna[boyRashi] || "শূদ্র";
        const gRank = this.varnaRank[gv] || 1;
        const bRank = this.varnaRank[bv] || 1;

        let points = 0;
        if (bRank >= gRank) points = 1;
        else if (bRank === gRank - 1) points = 0.5;

        const full = bRank > gRank
            ? `বরের বর্ণ ${bv} এবং কন্যার বর্ণ ${gv}—বরের বর্ণ কন্যার অপেক্ষা শ্রেষ্ঠ, যা সম্পূর্ণ শাস্ত্রসম্মত। এই বর্ণমিলন দাম্পত্য জীবনে সম্মান ও মর্যাদা বয়ে আনে। বর হবেন সংসারের মেরুদণ্ড—যাঁর নেতৃত্বে পরিবার সুখী ও সমৃদ্ধ হবে। কন্যা পাবেন যোগ্য সম্মান ও নিরাপত্তা। যেমন আকাশে সূর্য উদিত হলে চন্দ্রের জ্যোৎস্না আরও মধুর হয়, তেমনি উচ্চবর্ণের স্বামী পেলে নারীর জীবন পূর্ণতা পায়। তবে মনে রাখবেন—বর্ণ দিয়ে মানুষ মাপা যায় না, গুণেই মানুষ প্রকৃত মহৎ হয়।`
            : bRank === gRank
            ? `বর ও কন্যা উভয়ের বর্ণ ${bv}—একই বর্ণের মিলন, যা সমমর্যাদার প্রতীক। এই যোগে দাম্পত্য জীবনে কেউ কাউকে ছোট করবে না, কেউ কারও কাছে নিজেকে বড়ও ভাববে না। যেমন দুই সমান শিখার প্রদীপ মিলে এক উজ্জ্বল আলো তৈরি করে, তেমনি সমবর্ণের দম্পতি মিলে এক শক্তিশালী সংসার গড়ে তোলে। সম্মান, শ্রদ্ধা ও বোঝাপড়াই হবে এই সম্পর্কের মূল ভিত্তি।`
            : `কন্যার বর্ণ ${gv} বরের বর্ণ ${bv} অপেক্ষা উচ্চতর—এটি শাস্ত্রসম্মত নয়। শাস্ত্রমতে কন্যার বর্ণ বরের চেয়ে উচ্চ হলে দাম্পত্য জীবনে অসম্মান, অশান্তি ও মনোমালিন্যের সম্ভাবনা থাকে। তবে এটি কোনো অভিশাপ নয়—ইতিহাস সাক্ষী, বহু সফল দাম্পত্য এই বর্ণ-ব্যবধান অতিক্রম করেছে। যদি প্রেম সত্য হয়, যদি হৃদয়ের বন্ধন অটুট থাকে, তবে বর্ণের এই ব্যবধান নদীর বুকে পাথরের মতো ডুবে যাবে—দেখা যাবে না, শুধু অনুভব করা যাবে।`;

        return { points, max: 1, girlVarna: gv, boyVarna: bv, full };
    }

    /**
     * ২. বশ্যকূট (সর্বোচ্চ ২ গুণ)
     */
    calcVashya(girlRashi, boyRashi) {
        const vashyaMap = {
            "মেষ":["সিংহ","বৃষ"], "বৃষ":["মেষ","কর্কট"], "মিথুন":["তুলা","কুম্ভ"],
            "কর্কট":["মকর","মীন","বৃষ"], "সিংহ":["মেষ","ধনু","মীন"],
            "কন্যা":["মিথুন","তুলা"], "তুলা":["কন্যা","কুম্ভ","মিথুন"],
            "বৃশ্চিক":["মেষ","সিংহ","ধনু"], "ধনু":["মেষ","সিংহ"],
            "মকর":["কর্কট","মীন"], "কুম্ভ":["তুলা","মিথুন"], "মীন":["কর্কট","বৃশ্চিক"]
        };

        const girlVashya = vashyaMap[boyRashi]?.includes(girlRashi) || false;
        const boyVashya = vashyaMap[girlRashi]?.includes(boyRashi) || false;

        let points = 0;
        if (girlVashya && boyVashya) points = 2;
        else if (girlVashya) points = 1;
        else if (boyVashya) points = 0.5;

        const full = points === 2
            ? `পরস্পর সৌখ্য বশ্য—বিরল ও মহাশুভ যোগ। কন্যার রাশি বরের বশ্য এবং বরের রাশিও কন্যার বশ্য। এটি পরম প্রেমের প্রতীক—যেখানে কেউ কাউকে দাসত্ব করে না, বরং দুজনেই একে অপরের প্রতি স্বতঃস্ফূর্তভাবে আকৃষ্ট হয়। যেমন চাঁদ ও জোছনা—একে ছাড়া অপরের অস্তিত্ব অর্থহীন, তেমনি এই দম্পতি পরস্পরের পরিপূরক। এই যোগে দাম্পত্য জীবন হবে স্বর্গীয় সুখে পরিপূর্ণ।`
            : points === 1
            ? `কন্যার রাশি বরের বশ্য—একতরফা বশ্যতা, যা শাস্ত্রসম্মত। কন্যা স্বাভাবিকভাবেই স্বামীর প্রতি অনুরক্ত থাকবেন, তাঁর ইচ্ছাকে নিজের ইচ্ছা করে নেবেন। যেমন নদী সাগরের দিকে বয়, যেমন ফুল সূর্যের দিকে ঘোরে—তেমনি কন্যার মন আপনিই স্বামীর দিকে ধাবিত হবে। তবে বরকেও সচেতন থাকতে হবে—বশ্যতার এই উপহারকে কখনো অবদমন বা অত্যাচারে পরিণত করা যাবে না।`
            : points === 0.5
            ? `বরের রাশি কন্যার বশ্য—বৈপরীত্যের প্রতীক। এতে স্বামী স্ত্রীর প্রতি কিছুটা নির্ভরশীল থাকবেন, যা দাম্পত্য জীবনে ভারসাম্যহীনতা আনতে পারে। যেমন সিংহ যদি হরিণের পেছনে ছোটে, তবে বনের রাজত্ব টলে যায়—তেমনি এই বশ্যতা সম্পর্কে সম্মানের হানি ঘটাতে পারে। তবে ভালোবাসা যদি গভীর হয়, তবে এটাও এক অনন্য সম্পর্ক হয়ে উঠতে পারে—যেখানে পুরুষ তাঁর নারীর কাছে আত্মসমর্পণ করে প্রকৃত শক্তি খুঁজে পান।`
            : `বর ও কন্যার রাশি পরস্পর বৈর-ভক্ষ্য—কোনো বশ্যতা নেই। এটি অমিলের ইঙ্গিত—দাম্পত্য জীবনে কলহ, অশান্তি ও একগুঁয়েমির সম্ভাবনা থাকে। যেমন দুই ষাঁড় এক গোয়ালে বাঁধা থাকলে শান্তি থাকে না, তেমনি এই দম্পতির মধ্যে ক্ষমতার দ্বন্দ্ব লেগেই থাকবে। তবে চেষ্টা করলে সবই সম্ভব—পরস্পরকে বোঝার চেষ্টা করুন, শ্রদ্ধা দিন, দেখবেন বশ্যতার থেকেও বড় কিছু জন্ম নিয়েছে—বন্ধুত্ব।`;

        return { points, max: 2, girlVashya, boyVashya, full };
    }

    /**
     * ৩. তারাকূট (সর্বোচ্চ ৩ গুণ)
     */
    calcTara(girlNak, boyNak) {
        const gi = this.getNakshatraIndex(girlNak);
        const bi = this.getNakshatraIndex(boyNak);
        if (gi === -1 || bi === -1) return { points: 0, max: 3, full: "নক্ষত্রের তথ্য সঠিক নয়।" };

        const fromBoy = ((gi - bi + 27) % 27) + 1;
        const fromGirl = ((bi - gi + 27) % 27) + 1;
        const taraBoy = fromBoy % 9 === 0 ? 9 : fromBoy % 9;
        const taraGirl = fromGirl % 9 === 0 ? 9 : fromGirl % 9;

        const badTaras = [3, 5, 7];
        const boyGood = !badTaras.includes(taraBoy);
        const girlGood = !badTaras.includes(taraGirl);

        let points = 0;
        if (boyGood && girlGood) points = 3;
        else if (boyGood || girlGood) points = 1.5;

        const taraNames = ["","জন্ম","সম্পদ","বিপৎ","ক্ষেম","প্রত্যরি","সাধক","নিধন","মিত্র","অতিমিত্র"];

        const full = points === 3
            ? `বরের নক্ষত্র থেকে কন্যার তারা ${taraNames[taraBoy]} (${taraBoy}) এবং কন্যার নক্ষত্র থেকে বরের তারা ${taraNames[taraGirl]} (${taraGirl})—উভয়ই শুভ তারা। পরস্পর তারাশুদ্ধি সম্পন্ন, যা অত্যন্ত মঙ্গলজনক। এই যোগ দাম্পত্য জীবনে সুস্বাস্থ্য, দীর্ঘায়ু, সৌভাগ্য ও পারস্পরিক সুখ বয়ে আনে। জন্ম তারা হলে কর্মে সাফল্য, সম্পদ তারা হলে ধনাগম, ক্ষেম তারা হলে নিরাপত্তা, মিত্র তারা হলে বন্ধুত্বপূর্ণ সম্পর্ক—সবই মিলেমিশে এক সুন্দর সংসার গড়ে তোলে।`
            : points === 1.5
            ? `একজনের তারা শুভ, অপরজনের তারা অশুভ—আংশিক তারাশুদ্ধি। এর ফলে দাম্পত্য জীবনে কিছু প্রতিবন্ধকতা আসতে পারে—স্বাস্থ্যগত সমস্যা, আর্থিক টানাপোড়েন, কিংবা মানসিক অশান্তি। তবে সম্পূর্ণ অন্ধকার নয়—যে প্রদীপ অর্ধেক জ্বলে, তাও পথ দেখায়। সচেতনতা, প্রতিকার ও পরস্পরের প্রতি যত্নবান হলে এই আংশিক অশুভতাকে সম্পূর্ণরূপে জয় করা সম্ভব।`
            : `উভয়ের তারাই অশুভ—তারাদোষ বিদ্যমান। বিপৎ (৩), প্রত্যরি (৫) ও নিধন (৭) তারা—এই তিন মহাদোষ একত্রে মিলিত হয়েছে। এর ফলে দাম্পত্য জীবনে স্বাস্থ্যহানি, দুর্ঘটনা, আর্থিক সর্বনাশ বা অকালমৃত্যুর মতো গুরুতর বিপদের আশঙ্কা থাকে। এটি উপেক্ষা করা চরম ভুল হবে—বিবাহের পূর্বে অবশ্যই বিশেষ পূজা, দান ও প্রতিকার করতে হবে। মহামৃত্যুঞ্জয় মন্ত্র জপ, রুদ্রাভিষেক ও নবগ্রহ পূজা এই দোষ প্রশমনে সহায়ক।`;

        return { points, max: 3, taraBoy: taraNames[taraBoy], taraGirl: taraNames[taraGirl], full };
    }

    /**
     * ৪. যোনিকূট (সর্বোচ্চ ৪ গুণ)
     */
    calcYoni(girlNak, boyNak) {
        const gy = this.nakshatraYoni[girlNak];
        const by = this.nakshatraYoni[boyNak];
        if (!gy || !by) return { points: 0, max: 4, full: "যোনির তথ্য সঠিক নয়।" };

        let points = 0, relation = "";
        if (gy === by) { points = 4; relation = "একই যোনি—পরম মিত্র"; }
        else if (this.yoniEnmity[gy] === by) { points = 0; relation = "শত্রু যোনি—মহাবৈর"; }
        else if (this.yoniEnmity[by] === gy) { points = 0; relation = "শত্রু যোনি—মহাবৈর"; }
        else { points = 1.5; relation = "নিরপেক্ষ যোনি—মধ্যম"; }

        const full = points === 4
            ? `উভয়ের যোনি ${gy}—একই যোনির মিলন, যা পরম মিত্র যোগ। এই যোগ দাম্পত্য জীবনে গভীর শারীরিক ও মানসিক সামঞ্জস্য বয়ে আনে। যেমন একই প্রজাতির দুই পাখি একই সুরে গান গায়, একই খাদ্য খুঁজে খায়, একই নীড়ে বাস করে—তেমনি সমযোনির দম্পতি সহজেই একে অপরের মন বুঝতে পারে, একে অপরের চাহিদা পূরণ করতে পারে। এদের সম্পর্ক হবে স্বাভাবিক, স্বতঃস্ফূর্ত ও গভীর।`
            : points === 1.5
            ? `কন্যার যোনি ${gy} এবং বরের যোনি ${by}—নিরপেক্ষ যোনি, মধ্যম মিলন। যেমন বনের বাঘ ও হরিণের মধ্যে স্বাভাবিক শত্রুতা নেই, আবার গভীর বন্ধুত্বও নেই—তেমনি এই দম্পতির সম্পর্ক মধ্যম মানের হবে। কখনও সুখ, কখনও অশান্তি আসবে। তবে নিরপেক্ষতা মানেই অসম্ভব নয়—প্রচুর ভালোবাসা, যত্ন ও শ্রদ্ধা দিয়ে এই সম্পর্ককে অসাধারণ করে তোলা সম্ভব।`
            : `কন্যার যোনি ${gy} এবং বরের যোনি ${by}—পরস্পর শত্রু যোনি, মহাবৈর যোগ। এটি অত্যন্ত অশুভ লক্ষণ—যেমন সাপ ও নকুলের মধ্যে স্বাভাবিক শত্রুতা, যেমন বিড়াল ও ইঁদুরের মধ্যে চিরন্তন বৈরিতা, তেমনি এই দম্পতির মধ্যে গভীর অমিল থাকবে। দাম্পত্য জীবনে তীব্র অশান্তি, শারীরিক সমস্যা, এমনকি বিচ্ছেদের সম্ভাবনাও প্রবল। তবে শাস্ত্রে একটি ব্যতিক্রমের কথা বলা হয়েছে—যদি কন্যার রাশি বরের বশ্য হয়, তবে যোনি-বৈরিতার দোষ প্রশমিত হয়। বিশেষ পূজা ও প্রতিকার আবশ্যক।`;

        return { points, max: 4, girlYoni: gy, boyYoni: by, relation, full };
    }

    /**
     * ৫. গ্রহমৈত্রীকূট (সর্বোচ্চ ৫ গুণ)
     */
    calcGrahaMaitri(girlRashi, boyRashi) {
        const gl = this.rashiLords[girlRashi];
        const bl = this.rashiLords[boyRashi];
        if (!gl || !bl) return { points: 0, max: 5, full: "রাশিপতির তথ্য সঠিক নয়।" };

        let points = 0, relation = "";
        if (gl === bl) { points = 5; relation = "একই রাশিপতি—পরম মিত্র"; }
        else if (this.planetRelations[bl]?.f?.includes(gl)) { points = 4; relation = "বরের রাশিপতি কন্যার রাশিপতির মিত্র"; }
        else if (this.planetRelations[gl]?.f?.includes(bl)) { points = 3; relation = "কন্যার রাশিপতি বরের রাশিপতির মিত্র"; }
        else if (this.planetRelations[bl]?.e?.includes(gl)) { points = 0; relation = "পরস্পর শত্রু"; }
        else { points = 2; relation = "নিরপেক্ষ"; }

        const full = points === 5
            ? `কন্যা ও বরের রাশিপতি একই—${gl}। এটি অত্যন্ত শুভ যোগ। একই গ্রহের অধীনে থাকায় উভয়ের চিন্তাভাবনা, জীবনদর্শন, মূল্যবোধ ও মানসিকতা প্রায় একই রকম হবে। যেমন একই সূর্যের আলোয় দুইটি ফুল ফোটে—একটু ভিন্ন মাটিতে, কিন্তু একই আলোর উত্তরাধিকারী। এই দম্পতি সহজেই একে অপরকে বুঝবে, অকারণ কলহ হবে না, সংসার হবে শান্তিপূর্ণ ও সমৃদ্ধ।`
            : points === 4
            ? `কন্যার রাশিপতি ${gl} এবং বরের রাশিপতি ${bl}—বরের রাশিপতি কন্যার রাশিপতির মিত্র। এটি শুভ যোগ। যেমন দুই বন্ধু মিলে এক কাজ সহজে করতে পারে, তেমনি এই দুই গ্রহের মিত্রতা দাম্পত্য জীবনে সহযোগিতা ও পারস্পরিক বোঝাপড়া আনবে। বর হবেন কন্যার সবচেয়ে বড় সহায়ক, জীবনসঙ্গী হয়ে উঠবেন জীবনের সবচেয়ে বিশ্বস্ত বন্ধু।`
            : points === 3
            ? `কন্যার রাশিপতি ${gl} এবং বরের রাশিপতি ${bl}—কন্যার রাশিপতি বরের রাশিপতির মিত্র। এটি মধ্যম মিত্রতার যোগ। কন্যা হবেন বরের জীবনে সহায়ক শক্তি—যেমন লক্ষ্মী নারায়ণের সহচরী, তেমনি কন্যা বরের উন্নতির পথ প্রশস্ত করবেন। তবে বরকেও নিজের দায়িত্ব বুঝতে হবে—একতরফা সম্পর্ক কখনো টেকে না।`
            : points === 2
            ? `কন্যার রাশিপতি ${gl} এবং বরের রাশিপতি ${bl}—নিরপেক্ষ সম্পর্ক। এটি খুব খারাপ নয়, আবার খুব ভালোও নয়। যেমন অপরিচিত দুই পথিক একই পথে হাঁটে কিন্তু কথা বলে না—তেমনি এই দম্পতির মধ্যে প্রথম দিকে তেমন গভীর টান না থাকলেও, সময়ের সাথে সাথে সম্পর্কের গভীরতা বাড়তে পারে। চেষ্টা ও আন্তরিকতা রাখতে হবে।`
            : `কন্যার রাশিপতি ${gl} এবং বরের রাশিপতি ${bl}—পরস্পর শত্রু। এটি অশুভ যোগ। যেমন সিংহ ও হাতির মধ্যে স্বাভাবিক প্রতিদ্বন্দ্বিতা, তেমনি এই দুই গ্রহের শত্রুতা দাম্পত্য জীবনে অহংকারের সংঘাত, অশান্তি ও বিচ্ছেদ আনতে পারে। তবে রাজযোটক বা অন্যান্য শুভ যোগ থাকলে এই দোষ প্রশমিত হতে পারে। বিশেষ পূজা করে উভয় গ্রহকে শান্ত করা আবশ্যক।`;

        return { points, max: 5, girlLord: gl, boyLord: bl, relation, full };
    }

    /**
     * ৬. গণমৈত্রীকূট (সর্বোচ্চ ৬ গুণ)
     */
    calcGana(girlNak, boyNak) {
        const gg = this.nakshatraGana[girlNak];
        const bg = this.nakshatraGana[boyNak];
        if (!gg || !bg) return { points: 0, max: 6, full: "গণের তথ্য সঠিক নয়।" };

        let points = 0, relation = "";
        if (gg === bg) { points = 6; relation = "একই গণ—সর্বোত্তম"; }
        else if (gg === "দেব" && bg === "নর") { points = 5; relation = "দেব-নর—উত্তম"; }
        else if (gg === "নর" && bg === "দেব") { points = 3; relation = "নর-দেব—মধ্যম"; }
        else if (gg === "দেব" && bg === "রাক্ষস") { points = 1; relation = "দেব-রাক্ষস—অশুভ"; }
        else if (gg === "রাক্ষস" && bg === "দেব") { points = 0; relation = "রাক্ষস-দেব—মহাদোষ"; }
        else if (gg === "নর" && bg === "রাক্ষস") { points = 3; relation = "নর-রাক্ষস—মধ্যম"; }
        else if (gg === "রাক্ষস" && bg === "নর") { points = 1; relation = "রাক্ষস-নর—অশুভ"; }

        const full = points === 6
            ? `উভয়ের গণ ${gg}—একই গণ, সর্বোত্তম মিলন। যেমন দেব-দেব মিলনে স্বর্গীয় পবিত্রতা, নর-নর মিলনে মানবিক বোঝাপড়া, তেমনি সমগণের দম্পতি একই প্রকৃতির হওয়ায় সহজেই একে অপরের সাথে খাপ খাইয়ে নিতে পারে। অকারণ কলহ হবে না, মতবিরোধ হবে ক্ষণস্থায়ী, এবং সংসারে শান্তি বজায় থাকবে।`
            : points === 5
            ? `কন্যা দেবগণ এবং বর নরগণ—দেব-নর মিলন, অত্যন্ত শুভ। কন্যার পবিত্রতা ও দেবত্ব বরের মানবিক জীবনকে আলোকিত করবে, আর বরের বাস্তববুদ্ধি ও কর্মঠতা কন্যাকে নিরাপত্তা দেবে। যেমন গঙ্গার পবিত্র জল সাগরের নোনা জলের সাথে মিশেও নিজের পবিত্রতা রাখে, তেমনি এই কন্যা সংসারে থেকেও নিজের দেবীত্ব বজায় রাখবেন।`
            : points === 3
            ? `কন্যা নরগণ এবং বর দেবগণ—নর-দেব মিলন, মধ্যম। অথবা নর-রাক্ষস মিলন। এই যোগে সম্পর্ক মধ্যম মানের হবে—চরম সুখ আসবে না, আবার চরম দুঃখও আসবে না। যেমন শরৎকালের আকাশ—কখনও রোদ, কখনও মেঘ, তেমনি এই দাম্পত্য জীবনও কখনও হাসি, কখনও কান্নায় ভরা থাকবে। পরস্পরের প্রতি শ্রদ্ধাই হবে এই সম্পর্কের ভিত্তি।`
            : points === 1
            ? `গণ-বৈরিতা বিদ্যমান। দেব ও রাক্ষস, অথবা রাক্ষস ও নরের এই মিলনে স্বাভাবিক অমিল থাকবে—দাম্পত্য জীবনে অশান্তি, কলহ ও মানসিক দূরত্বের সম্ভাবনা প্রবল। বিশেষ পূজা-অর্চনা করে গণদোষ প্রশমিত করা আবশ্যক। শিব-পার্বতী পূজা ও রুদ্রাভিষেক এই দোষ কাটাতে সহায়ক।`
            : `গণ-মহাবৈরিতা—রাক্ষস ও দেবগণের মিলন। এটি অত্যন্ত অশুভ যোগ। রাক্ষস প্রকৃতির মানুষ দেবপ্রকৃতির মানুষকে সহজে সহ্য করতে পারে না—ফলে সংসারে চরম অশান্তি, এমনকি মৃত্যুও ঘটতে পারে। শাস্ত্রমতে এই গণ মিলনে বিবাহ করা উচিত নয়। যদি একান্তই করতে হয়, তবে অবশ্যই বিশেষ প্রতিকার ও পূজা করতে হবে।`;

        return { points, max: 6, girlGana: gg, boyGana: bg, relation, full };
    }

    /**
     * ৭. রাশিকূট / ভকূট (সর্বোচ্চ ৭ গুণ)
     * রাজযোটক, দ্বিদ্বাদশ, নবপঞ্চম, ষড়ষ্টক
     */
    calcRashi(girlRashi, boyRashi) {
        const gi = this.getRashiIndex(girlRashi);
        const bi = this.getRashiIndex(boyRashi);
        if (gi === -1 || bi === -1) return { points: 0, max: 7, full: "রাশির তথ্য সঠিক নয়।" };

        const dist = ((bi - gi + 12) % 12) + 1;
        let points = 0, type = "";

        if (dist === 1 || dist === 7) { points = 7; type = "রাজযোটক (এক-সপ্তম)"; }
        else if (dist === 4 || dist === 10) { points = 7; type = "রাজযোটক (চতুর্থ-দশম)"; }
        else if (dist === 3 || dist === 11) { points = 7; type = "রাজযোটক (তৃতীয়-একাদশ)"; }
        else if (dist === 2 || dist === 12) { points = 0; type = "দ্বিদ্বাদশ দোষ"; }
        else if (dist === 5) { points = 0; type = "পঞ্চম দোষ"; }
        else if (dist === 9) { points = 7; type = "নবম (শুভ)"; }
        else if (dist === 6 || dist === 8) { points = 0; type = "ষড়ষ্টক দোষ"; }

        const full = points === 7
            ? `বর ও কন্যার রাশি ${type} অবস্থানে রয়েছে—এটি রাজযোটক যোগ! ভৃগু, অত্রি, গর্গ প্রভৃতি মহর্ষিগণ বলে গেছেন: "রাজযোটকং যদা দৃষ্ট্বা গ্রহবৈরিতাদিদোষ ন বিদ্যতে"—অর্থাৎ রাজযোটক বিদ্যমান থাকলে গ্রহ-বৈরিতা, তারাদোষ, গণদোষ, বর্ণদোষ, এমনকি নাড়ীদোষ পর্যন্ত প্রশমিত হয়ে যায়। এই যোগ দাম্পত্য জীবনে রাজকীয় সুখ, বিপুল ঐশ্বর্য, দীর্ঘায়ু, পুত্রবতী ও পতিপ্রিয়া হওয়ার শুভ লক্ষণ বহন করে। যেমন রাজা ও রাণী একাসনে বসে রাজত্ব করেন, তেমনি এই দম্পতি সংসারে সুখ-সমৃদ্ধির সম্রাট ও সম্রাজ্ঞী হয়ে বাস করবেন। এ মিলন স্বর্গীয় আশীর্বাদপুষ্ট।`
            : `বর ও কন্যার রাশি ${type} অবস্থানে রয়েছে—এটি অশুভ মিলন। দাম্পত্য জীবনে আর্থিক ক্ষতি, অশান্তি, স্বাস্থ্যহানি বা বিচ্ছেদের সম্ভাবনা থাকে। তবে যদি রাশিপতি পরস্পর মিত্র হন বা রাজযোটকের মতোই অন্য কোনো মহাশুভ যোগ বিদ্যমান থাকে, তবে এই দোষ প্রশমিত হতে পারে। বিশেষ লক্ষ্মী-নারায়ণ পূজা, পীতবস্ত্র দান, বৃহস্পতিবার উপবাস ও রুদ্রাভিষেক করলে এই দোষের প্রভাব অনেকখানি কাটানো যায়।`;

        return { points, max: 7, distance: dist, type, full };
    }

    /**
     * ৮. ত্রিনাড়ীকূট (সর্বোচ্চ ৮ গুণ)
     */
    calcNadi(girlNak, boyNak) {
        const gn = this.nakshatraNadi[girlNak];
        const bn = this.nakshatraNadi[boyNak];
        if (!gn || !bn) return { points: 0, max: 8, full: "নাড়ীর তথ্য সঠিক নয়।" };

        let points = 8, type = "";
        if (gn === bn) {
            points = 0;
            if (gn === "আদ্য") type = "প্রাণনাড়ী বেধ—স্বামীর অকালমৃত্যুর আশঙ্কা";
            else if (gn === "মধ্য") type = "মধ্যনাড়ী বেধ—উভয়ের অকালমৃত্যুর আশঙ্কা";
            else type = "পৃষ্ঠনাড়ী বেধ—কন্যার অকালমৃত্যুর আশঙ্কা";
        }

        const full = points === 8
            ? `কন্যার নাড়ী ${gn} এবং বরের নাড়ী ${bn}—ভিন্ন নাড়ী, শুভ মিলন। নাড়ীবেধ না থাকায় দাম্পত্য জীবনে সুস্বাস্থ্য, দীর্ঘায়ু ও সন্তানসুখ বজায় থাকবে। সন্তান জন্মে কোনো বাধা থাকবে না—পরিবার পরিপূর্ণতা লাভ করবে। যেমন তিনটি পৃথক নদী এসে এক সাগরে মিলিত হয় কিন্তু নিজেদের পৃথক অস্তিত্ব রাখে, তেমনি এই দম্পতি এক হয়েও নিজেদের স্বকীয়তা বজায় রাখবে—এটাই সুখী দাম্পত্যের চাবিকাঠি।`
            : `কন্যা ও বর উভয়ের নাড়ী ${gn}—একই নাড়ী, ${type}। এটি অত্যন্ত গুরুতর দোষ। প্রাচীন শাস্ত্রে বলা হয়েছে: "নাড়ীবেধে ভবেৎ ক্লেশো দম্পত্যোঃ সর্বদা ভবেৎ"—নাড়ীবেধ থাকলে দম্পতির জীবনে চিরকাল ক্লেশ লেগেই থাকে। প্রাণনাড়ীগত হলে স্বামীর, পৃষ্ঠনাড়ীগত হলে কন্যার এবং মধ্যনাড়ীগত হলে উভয়েরই অকালমৃত্যুর আশঙ্কা থাকে। এই দোষকে কখনোই উপেক্ষা করা যাবে না। বিবাহের পূর্বে অবশ্যই কুম্ভবিবাহ, অশ্বত্থবৃক্ষ বা স্বর্ণনির্মিত বিষ্ণুপ্রতিমার সহিত বিবাহ দিয়ে তারপর প্রকৃত বিবাহ করতে হবে। মহামৃত্যুঞ্জয় জপ, স্বর্ণদান ও বিষ্ণুপূজা করা আবশ্যক।`;

        return { points, max: 8, girlNadi: gn, boyNadi: bn, full };
    }

    /**
     * মাঙ্গলিক দোষ
     */
    calcManglik(marsSign, lagnaSign, gender) {
        const mi = this.getRashiIndex(marsSign);
        const li = this.getRashiIndex(lagnaSign);
        if (mi === -1 || li === -1) return { hasDosha: false, house: -1, full: "গ্রহের তথ্য সঠিক নয়।" };

        const house = ((mi - li + 12) % 12) + 1;
        const hasDosha = this.manglikHouses.includes(house);

        const full = hasDosha
            ? `${gender === 'girl' ? 'কন্যার' : 'বরের'} লগ্ন থেকে মঙ্গল ${house}ম ভাবে অবস্থিত—মাঙ্গলিক দোষ বিদ্যমান। শাস্ত্রমতে: "লগ্নে ব্যয়েচ পাতালে যামিত্রেচাষ্টমে কুজে। কন্যা হরতি ভর্তারাং ভর্তা ভার্যাং বিনশ্যতি।"—অর্থাৎ লগ্ন, দ্বাদশ, চতুর্থ, সপ্তম বা অষ্টমে মঙ্গল থাকলে স্ত্রীর স্বামীনাশ ও স্বামীর স্ত্রীনাশ হয়। তবে উভয়ের মাঙ্গলিক দোষ সমান হলে পরস্পর বাতিল হয়ে যায়। প্রতিকার: কুম্ভবিবাহ, অশ্বত্থবৃক্ষ বা স্বর্ণনির্মিত বিষ্ণুপ্রতিমার সহিত বিবাহ। বরুণমন্ত্র: "বরুণাঙ্গস্বরূপত্তং জীবনানাং সমাশ্রয়, পতিং জীবয় কন্যায়াঃ চিরপুত্রসুখং কুরু। দেহি বিষো বরং দেব কন্যাংপালয় দুঃখতঃ।" পাঠ করে কন্যাকে অভিষিক্ত করিবে।`
            : `${gender === 'girl' ? 'কন্যার' : 'বরের'} লগ্ন থেকে মঙ্গল ${house}ম ভাবে—মাঙ্গলিক দোষ নেই। এটি শুভ লক্ষণ, দাম্পত্য জীবনে এই দোষের কারণে কোনো অশুভ ঘটবে না। নিশ্চিন্তে বিবাহ করা যাবে।`;

        return { hasDosha, house, full };
    }

    /**
     * দোষ প্রশমনের প্রতিকার
     */
    getRemedies(nadiPoints, rashiPoints, ganaPoints, manglikMatch) {
        const remedies = [];
        if (nadiPoints === 0) {
            remedies.push("🕉️ নাড়ীবেধ দোষ প্রশমনে: (ক) কুম্ভবিবাহ—বিবাহের পূর্বে কুম্ভ, অশ্বত্থবৃক্ষ বা স্বর্ণনির্মিত বিষ্ণুপ্রতিমার সহিত বিবাহ দিবে। (খ) মহামৃত্যুঞ্জয় মন্ত্রজপ—'ওঁ ত্র্যম্বকং যজামহে...' নিত্য ১০৮ বার জপ করিবে। (গ) স্বর্ণদান, তিলদান ও বিষ্ণুপূজা করিবে।");
        }
        if (rashiPoints === 0) {
            remedies.push("🕉️ ভকূট/রাশিদোষ প্রশমনে: (ক) লক্ষ্মী-নারায়ণ পূজা ও পীতবস্ত্র দান। (খ) বৃহস্পতিবার উপবাস ও কনকধারা স্তোত্র পাঠ। (গ) মাণিক্য রত্ন ধারণ করিতে পারেন।");
        }
        if (ganaPoints <= 1) {
            remedies.push("🕉️ গণদোষ প্রশমনে: (ক) শিব-পার্বতী পূজা ও রুদ্রাভিষেক। (খ) সোমবার উপবাস ও বেলপাতা নিবেদন। (গ) রুদ্রাক্ষ ধারণ ও 'ওঁ নমঃ শিবায়' জপ।");
        }
        if (!manglikMatch) {
            remedies.push("🕉️ মাঙ্গলিক অমিল প্রশমনে: (ক) কুম্ভবিবাহ ও হনুমান চালিশা পাঠ। (খ) মঙ্গলবার উপবাস ও মসুর ডাল দান। (গ) প্রবাল রত্ন ধারণ ও 'ওঁ অং অঙ্গারকায় নমঃ' জপ।");
        }
        if (remedies.length === 0) {
            remedies.push("✨ এই মিলনে কোনো বিশেষ দোষ নেই—তবুও সুখী দাম্পত্য জীবনের জন্য নিত্য লক্ষ্মী-নারায়ণ পূজা, পিতৃতর্পণ ও অতিথি সেবা করুন। প্রেম, শ্রদ্ধা ও বিশ্বাসই শ্রেষ্ঠ প্রতিকার।");
        }
        return remedies;
    }

    /**
     * পূর্ণাঙ্গ যোটক-বিচার
     */
    match(girlData, boyData) {
        const gr = girlData.moonRashi, br = boyData.moonRashi;
        const gn = girlData.moonNakshatra, bn = boyData.moonNakshatra;
        const gMars = girlData.marsRashi || girlData.moonRashi;
        const bMars = boyData.marsRashi || boyData.moonRashi;
        const gLagna = girlData.lagnaRashi || girlData.moonRashi;
        const bLagna = boyData.lagnaRashi || boyData.moonRashi;

        const kootas = {
            varna: this.calcVarna(gr, br),
            vashya: this.calcVashya(gr, br),
            tara: this.calcTara(gn, bn),
            yoni: this.calcYoni(gn, bn),
            grahaMaitri: this.calcGrahaMaitri(gr, br),
            gana: this.calcGana(gn, bn),
            rashi: this.calcRashi(gr, br),
            nadi: this.calcNadi(gn, bn)
        };

        const manglik = {
            girl: this.calcManglik(gMars, gLagna, 'girl'),
            boy: this.calcManglik(bMars, bLagna, 'boy'),
            match: this.calcManglik(gMars, gLagna, 'girl').hasDosha === this.calcManglik(bMars, bLagna, 'boy').hasDosha
        };

        const isRajaYotak = kootas.rashi.points === 7;
        let total = 0;
        for (const k of Object.keys(kootas)) total += kootas[k].points;

        const remedies = this.getRemedies(kootas.nadi.points, kootas.rashi.points, kootas.gana.points, manglik.match);

        let verdict = "", verdictFull = "";
        if (isRajaYotak && total >= 18) {
            verdict = "শ্রেষ্ঠতম (রাজযোটক)";
            verdictFull = `👑 রাজযোটক যোগ বিদ্যমান—এটি বিবাহের জন্য পরমোত্তম মিলন। ভৃগু-অত্রি-গর্গাদি ঋষিগণ বলেছেন: "রাজযোটকং যদা দৃষ্ট্বা গ্রহবৈরিতাদিদোষ বিনশ্যতি"—রাজযোটক থাকলে অন্যান্য সমস্ত দোষ (বর্ণ, গণ, নাড়ী, তারা, ভকূট) সম্পূর্ণরূপে প্রশমিত হয়ে যায়। এই মিলন দাম্পত্য জীবনে রাজকীয় সুখ, বিপুল ঐশ্বর্য, দীর্ঘায়ু, পুত্রবতী ও পতিপ্রিয়া হওয়ার শুভ লক্ষণ বহন করে। নিঃসন্দেহে এই বিবাহ সম্পন্ন করা যায়—এ মিলন স্বর্গীয় আশীর্বাদপুষ্ট। ${total} গুণের সাথে রাজযোটক যুক্ত হয়ে এর মহিমা বহুগুণে বৃদ্ধি পেয়েছে।`;
        } else if (total >= 30) {
            verdict = "শ্রেষ্ঠতম";
            verdictFull = `মোট ${total} গুণ (৩৬-এর মধ্যে)—এটি শ্রেষ্ঠতম মিলন। বিবাহ অত্যন্ত শুভ হবে, দাম্পত্য জীবনে সুখ, শান্তি, প্রেম, সন্তানসুখ ও আর্থিক সমৃদ্ধি বিরাজ করবে। বর-কন্যা পরস্পরের পরিপূরক—একসাথে জীবনের সকল উত্থান-পতন হাসিমুখে অতিক্রম করবেন। এত উচ্চ গুণের মিলন সহজে মেলে না—একে ঈশ্বরের আশীর্বাদ জেনে গ্রহণ করুন।`;
        } else if (total >= 25) {
            verdict = "উত্তম";
            verdictFull = `মোট ${total} গুণ (৩৬-এর মধ্যে)—উত্তম মিলন। বিবাহ শুভ হবে, দাম্পত্য জীবনে অধিকাংশ সময় সুখ ও শান্তি বজায় থাকবে। ছোটখাটো অমিল থাকলেও ভালোবাসা, শ্রদ্ধা ও পারস্পরিক বোঝাপড়ার মাধ্যমে সহজেই তা কাটিয়ে ওঠা সম্ভব। প্রতিকারগুলি করলে জীবন আরও মসৃণ হবে—সুখের সাগরে ছোট্ট একটি ঢেউ মাত্র।`;
        } else if (total >= 18) {
            verdict = "মধ্যম";
            verdictFull = `মোট ${total} গুণ (৩৬-এর মধ্যে)—মধ্যম মিলন। বিবাহ করা যেতে পারে, তবে দাম্পত্য জীবনে কিছু চ্যালেঞ্জ আসবে। সচেতনতা, পরস্পরের প্রতি শ্রদ্ধা ও উপরের প্রতিকারগুলি গুরুত্ব সহকারে করলে সুখী হওয়া সম্ভব। প্রেম যদি গভীর হয়, তবে মধ্যম গুণও অসাধারণ ফল দিতে পারে—যেমন নিম্নভূমির ফুলও সূর্যের আলোয় ফোটে। তবে বড় সিদ্ধান্ত নেওয়ার আগে অভিজ্ঞ জ্যোতিষীর পরামর্শ নেওয়া শ্রেয়।`;
        } else {
            verdict = "অশুভ";
            verdictFull = `মোট ${total} গুণ (৩৬-এর মধ্যে)—অশুভ মিলন। এত কম গুণে বিবাহ করা অত্যন্ত ঝুঁকিপূর্ণ—দাম্পত্য জীবনে তীব্র অশান্তি, স্বাস্থ্যহানি, আর্থিক সর্বনাশ ও বিচ্ছেদের সম্ভাবনা প্রবল। প্রেম যদি সত্যিই গভীর হয়, তবেই কেবল অভিজ্ঞ গুরুর পরামর্শক্রমে বিশেষ প্রতিকার করে তবেই বিবাহ করার কথা ভাববেন। মনে রাখবেন—বিবাহ শুধু দুটি মানুষের মিলন নয়, দুটি পরিবারের, দুটি বংশের মিলন। শুভ চিন্তা করেই সিদ্ধান্ত নিন।`;
        }

        return { kootas, total, max: 36, verdict, verdictFull, manglik, isRajaYotak, remedies };
    }

    /**
     * ফরম্যাট আউটপুট
     */
    format(girlName, boyName, result) {
        const g = girlName || "কন্যা", b = boyName || "বর";
        let out = `\n╔══════════════════════════════════════════════════╗\n║  💑 যোটক-বিচার (অষ্টকূট মিলন)\n║  ${g} ও ${b}-এর কুষ্ঠি মিলন ফলাফল\n╚══════════════════════════════════════════════════╝\n\n`;
        out += `📊 মোট গুণ: ${result.total} / ${result.max}\n📋 ফলাফল: ${result.verdict}\n\n${result.verdictFull}\n\n`;

        out += `📝 অষ্টকূট বিবরণ:\n${"═".repeat(50)}\n`;
        const kootaDefs = [
            { name: "বর্ণকূট", key: "varna", max: 1 },
            { name: "বশ্যকূট", key: "vashya", max: 2 },
            { name: "তারাকূট", key: "tara", max: 3 },
            { name: "যোনিকূট", key: "yoni", max: 4 },
            { name: "গ্রহমৈত্রীকূট", key: "grahaMaitri", max: 5 },
            { name: "গণমৈত্রীকূট", key: "gana", max: 6 },
            { name: "রাশিকূট (ভকূট)", key: "rashi", max: 7 },
            { name: "ত্রিনাড়ীকূট", key: "nadi", max: 8 }
        ];

        for (const k of kootaDefs) {
            const pts = result.kootas[k.key]?.points || 0;
            const icon = pts === k.max ? "✨" : pts === 0 ? "⚠️" : "🔸";
            out += `${icon} ${k.name}: ${pts}/${k.max} গুণ\n`;
        }

        out += `\n📖 বিস্তারিত ফলাফল:\n${"═".repeat(50)}\n`;
        for (const k of kootaDefs) {
            out += `\n🕉️ ${k.name}:\n${result.kootas[k.key]?.full || "তথ্য নেই"}\n`;
        }

        out += `\n🔴 মাঙ্গলিক দোষ:\n${"═".repeat(50)}\n`;
        out += `${result.manglik.girl.full}\n\n${result.manglik.boy.full}\n\n`;
        if (result.manglik.match) out += `✅ উভয়ের মাঙ্গলিক অবস্থা সমান — দোষ পরস্পর বাতিল।\n\n`;
        else out += `⚠️ উভয়ের মাঙ্গলিক অবস্থা অসমান — প্রতিকার আবশ্যক।\n\n`;

        out += `🙏 প্রতিকার:\n${"═".repeat(50)}\n`;
        result.remedies.forEach(r => out += r + "\n");

        out += `\n${"═".repeat(50)}\n🕉️ ওঁ নমঃ শিবায়। যেখানে প্রেম সত্য, সেখানেই ভগবান।\nশুভম ভবতু। মাঙ্গল্যম ভবতু।\n`;
        return out;
    }
}

// Export
if (typeof module !== "undefined" && module.exports) {
    module.exports = YotakBicharEngine;
}

console.log("✅ yotak-bichar.js — YotakBicharEngine লোড সম্পন্ন");
console.log("🔍 ব্যবহার: new YotakBicharEngine().match(girlData, boyData)");
