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
    
    return {
        totalScore: Math.round(total * 10) / 10,
        maxScore: 36,
        result: verdict,
        varna: varnaPts, vashya: vashyaPts, tara: taraPts, yoni: yoniPts,
        graha: grahaPts, gana: ganaPts, bhakoot: bhakootPts, nadi: nadiPts,
        manglik: {
            girl: { hasDosha: girlManglik.isManglik, full: girlManglik.description },
            boy: { hasDosha: boyManglik.isManglik, full: boyManglik.description },
            match: girlManglik.isManglik === boyManglik.isManglik
        },
        isRajaYotak: false,
        verdictFull: `মোট ${Math.round(total * 10) / 10} গুণ — ${verdict} মিলন।`,
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
