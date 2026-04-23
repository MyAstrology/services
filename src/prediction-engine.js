// prediction-engine.js (সংশোধিত)
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার

class PredictionEngine {
    constructor() {
        this.userName = "";
        this.chartData = {};
    }
    
    setUserName(name) {
        this.userName = name || "জাতক/জাতিকা";
    }
    
    setChartData(data) {
        this.chartData = data;
    }
    
    generateFullPrediction() {
        if (!this.userName) this.userName = "জাতক/জাতিকা";
        if (!this.chartData || !this.chartData.planets) {
            return "দুঃখিত, কুষ্ঠির ডেটা পাওয়া যায়নি।";
        }
        
        let output = "";
        
        output += `🪐 শ্রী ${this.userName}-এর পূর্ণাঙ্গ পূর্ব ভারতীয় কুষ্ঠি বিশ্লেষণ\n`;
        output += "═".repeat(50) + "\n\n";
        output += `প্রিয় ${this.userName},\n\n`;
        output += "আপনার জন্মছত্রের গ্রহ-নক্ষত্রের অবস্থানের উপর ভিত্তি করে এই পূর্ণাঙ্গ কুষ্ঠি বিশ্লেষণ প্রস্তুত করা হলো।\n\n";
        
        output += this.generateBirthDetails();
        output += this.generateMentalAnalysis();
        output += this.generateLagnaAnalysis();
        output += this.generateSunAnalysis();
        output += this.generatePlanetHouseAnalysis();
        output += this.generateTithiAnalysis();
        output += this.generateYogaAnalysis();
        output += this.generateKaranaAnalysis();
        
        output += "\n" + "═".repeat(50) + "\n";
        output += `✨ ${this.userName}, আপনার জীবন মঙ্গলময় হোক। ✨\n`;
        output += "\n© পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার | লাহিড়ী অয়নাংশ | VSOP87 নির্ভুল গণনা\n";
        
        return output;
    }
    
    generateBirthDetails() {
        const cd = this.chartData;
        let output = "📋 জন্ম বিবরণ\n";
        output += "─".repeat(40) + "\n";
        if (cd.birthDate) output += `তারিখ: ${cd.birthDate}\n`;
        if (cd.birthTime) output += `সময়: ${cd.birthTime}\n`;
        if (cd.birthPlace) output += `স্থান: ${cd.birthPlace}\n`;
        if (cd.lagna) output += `লগ্ন: ${cd.lagna.rashi}\n`;
        const moon = cd.planets?.find(p => p.name === "চন্দ্র");
        if (moon) output += `চন্দ্র রাশি: ${moon.rashi}\n`;
        const sun = cd.planets?.find(p => p.name === "সূর্য");
        if (sun) output += `সূর্য রাশি: ${sun.rashi}\n`;
        output += "\n";
        return output;
    }
    
    generateMentalAnalysis() {
        const moon = this.chartData.planets?.find(p => p.name === "চন্দ্র");
        if (!moon) return "";
        
        let output = "🧠 মানসিক প্রকৃতি (জন্ম নক্ষত্র অনুযায়ী)\n";
        output += "─".repeat(40) + "\n";
        
        // সরাসরি NAKSHATRA_RASHI_PREDICTIONS থেকে ডেটা নেওয়া
        if (typeof NAKSHATRA_RASHI_PREDICTIONS !== 'undefined') {
            const key = `${moon.nakshatra}_${moon.rashi}`;
            console.log("নক্ষত্র কম্বিনেশন খুঁজছে:", key);
            if (NAKSHATRA_RASHI_PREDICTIONS[key]) {
                output += NAKSHATRA_RASHI_PREDICTIONS[key].full + "\n\n";
            } else if (typeof getNakshatraPrediction === 'function') {
                output += getNakshatraPrediction(moon.nakshatra, moon.rashi) + "\n\n";
            } else {
                output += `আপনার চন্দ্র ${moon.nakshatra} নক্ষত্রে ${moon.rashi} রাশিতে অবস্থিত।\n\n`;
            }
        } else {
            output += `আপনার চন্দ্র ${moon.nakshatra} নক্ষত্রে ${moon.rashi} রাশিতে অবস্থিত।\n\n`;
        }
        
        return output;
    }
    
    generateLagnaAnalysis() {
        const lagna = this.chartData.lagna;
        if (!lagna) return "";
        
        let output = "💪 দেহ ও বাহ্যিক ব্যক্তিত্ব (লগ্ন অনুযায়ী)\n";
        output += "─".repeat(40) + "\n";
        
        // সরাসরি LAGNA_PREDICTIONS থেকে ডেটা নেওয়া
        if (typeof LAGNA_PREDICTIONS !== 'undefined' && LAGNA_PREDICTIONS[lagna.rashi]) {
            output += LAGNA_PREDICTIONS[lagna.rashi].full + "\n\n";
        } else if (typeof getLagnaPrediction === 'function') {
            output += getLagnaPrediction(lagna.rashi) + "\n\n";
        } else {
            output += `আপনার লগ্ন ${lagna.rashi}।\n\n`;
        }
        
        return output;
    }
    
    generateSunAnalysis() {
        const sun = this.chartData.planets?.find(p => p.name === "সূর্য");
        if (!sun) return "";
        
        let output = "☀️ আত্মার প্রকৃতি (সূর্যের অবস্থান অনুযায়ী)\n";
        output += "─".repeat(40) + "\n";
        
        // সরাসরি MONTH_SUN_PREDICTIONS থেকে ডেটা নেওয়া
        if (typeof MONTH_SUN_PREDICTIONS !== 'undefined') {
            const rashi = sun.rashi;
            const nakshatra = sun.nakshatra;
            const monthMap = { "মেষ":"বৈশাখ", "বৃষ":"জ্যৈষ্ঠ", "মিথুন":"আষাঢ়", "কর্কট":"শ্রাবণ", "সিংহ":"ভাদ্র", "কন্যা":"আশ্বিন", "তুলা":"কার্তিক", "বৃশ্চিক":"অগ্রহায়ণ", "ধনু":"পৌষ", "মকর":"মাঘ", "কুম্ভ":"ফাল্গুন", "মীন":"চৈত্র" };
            const month = monthMap[rashi];
            const key = `${month}_${nakshatra}`;
            console.log("মাস-সূর্য কম্বিনেশন খুঁজছে:", key);
            if (MONTH_SUN_PREDICTIONS[key]) {
                output += MONTH_SUN_PREDICTIONS[key].full + "\n\n";
            } else {
                output += `আপনার সূর্য ${rashi} রাশিতে ${nakshatra} নক্ষত্রে অবস্থিত।\n\n`;
            }
        } else {
            output += `আপনার সূর্য ${sun.rashi} রাশিতে ${sun.nakshatra} নক্ষত্রে অবস্থিত।\n\n`;
        }
        
        return output;
    }
    
    generatePlanetHouseAnalysis() {
        const planets = this.chartData.planets;
        if (!planets) return "";
        
        let output = "🌍 গ্রহের ভাবগত প্রভাব (জীবনের বিভিন্ন ক্ষেত্র)\n";
        output += "─".repeat(40) + "\n";
        
        const planetOrder = ["সূর্য", "চন্দ্র", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি", "রাহু", "কেতু"];
        const houseFunctions = {
            "সূর্য": 'SUN_HOUSE_PREDICTIONS',
            "চন্দ্র": 'MOON_HOUSE_PREDICTIONS',
            "মঙ্গল": 'MARS_HOUSE_PREDICTIONS',
            "বুধ": 'MERCURY_HOUSE_PREDICTIONS',
            "বৃহস্পতি": 'JUPITER_HOUSE_PREDICTIONS',
            "শুক্র": 'VENUS_HOUSE_PREDICTIONS',
            "শনি": 'SATURN_HOUSE_PREDICTIONS',
            "রাহু": 'RAHU_HOUSE_PREDICTIONS',
            "কেতু": 'KETU_HOUSE_PREDICTIONS'
        };
        
        planetOrder.forEach(planetName => {
            const planet = planets.find(p => p.name === planetName);
            if (!planet || !planet.house) return;
            
            const dataObjName = houseFunctions[planetName];
            const key = `${planetName}_ভাব_${planet.house}`;
            
            console.log(`খুঁজছে: ${dataObjName}['${key}']`);
            
            try {
                const dataObj = eval(dataObjName);
                if (dataObj && dataObj[key]) {
                    output += `◆ ${planetName} (${planet.house}ম ভাবে):\n${dataObj[key].full}\n\n`;
                }
            } catch(e) {
                console.warn(`${planetName} এর ভাব প্রেডিকশন পাওয়া যায়নি:`, e.message);
            }
        });
        
        return output;
    }
    
    generateTithiAnalysis() {
        const tithi = this.chartData.tithi;
        if (!tithi) return "";
        
        let output = "🌙 জন্ম তিথির প্রভাব\n";
        output += "─".repeat(40) + "\n";
        
        const key = `${tithi.paksha}_${tithi.name}`;
        console.log("তিথি খুঁজছে:", key);
        
        if (typeof TITHI_PREDICTIONS !== 'undefined' && TITHI_PREDICTIONS[key]) {
            output += TITHI_PREDICTIONS[key].full + "\n\n";
        } else if (typeof getTithiPrediction === 'function') {
            output += getTithiPrediction(tithi.paksha, tithi.name) + "\n\n";
        } else {
            output += `আপনার জন্ম ${tithi.paksha} ${tithi.name} তিথিতে।\n\n`;
        }
        
        return output;
    }
    
    generateYogaAnalysis() {
        const yoga = this.chartData.yoga;
        if (!yoga) return "";
        
        let output = "🕉️ জন্ম যোগের প্রভাব\n";
        output += "─".repeat(40) + "\n";
        
        console.log("যোগ খুঁজছে:", yoga.name);
        
        if (typeof YOGA_PREDICTIONS !== 'undefined' && YOGA_PREDICTIONS[yoga.name]) {
            output += YOGA_PREDICTIONS[yoga.name].full + "\n\n";
        } else if (typeof getYogaPrediction === 'function') {
            output += getYogaPrediction(yoga.name) + "\n\n";
        } else {
            output += `আপনার জন্ম ${yoga.name} যোগে।\n\n`;
        }
        
        return output;
    }
    
    generateKaranaAnalysis() {
        const karana = this.chartData.karana;
        if (!karana) return "";
        
        let output = "🌓 জন্ম করণের প্রভাব\n";
        output += "─".repeat(40) + "\n";
        
        console.log("করণ খুঁজছে:", karana.name);
        
        if (typeof KARANA_PREDICTIONS !== 'undefined' && KARANA_PREDICTIONS[karana.name]) {
            output += KARANA_PREDICTIONS[karana.name].full + "\n\n";
        } else if (typeof getKaranaPrediction === 'function') {
            output += getKaranaPrediction(karana.name) + "\n\n";
        } else {
            output += `আপনার জন্ম ${karana.name} করণে।\n\n`;
        }
        
        return output;
    }
}

// dasha-calculator.js
// বিংশোত্তরী মহাদশা গণনার ফাংশন
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার

// ==================== ১. কনস্ট্যান্ট ====================

// বিংশোত্তরী দশার গ্রহ ও তাদের সময়কাল (বছর)
const DASHA_PERIODS = {
    "সূর্য": 6,
    "চন্দ্র": 10,
    "মঙ্গল": 7,
    "রাহু": 18,
    "বৃহস্পতি": 16,
    "শনি": 19,
    "বুধ": 17,
    "কেতু": 7,
    "শুক্র": 20
};

// ২৭ নক্ষত্রের অধিপতি (বিংশোত্তরী ক্রম অনুযায়ী)
const NAKSHATRA_LORDS = [
    "কেতু",      // ১. অশ্বিনী
    "শুক্র",     // ২. ভরণী
    "সূর্য",     // ৩. কৃত্তিকা
    "চন্দ্র",    // ৪. রোহিণী
    "মঙ্গল",     // ৫. মৃগশিরা
    "রাহু",      // ৬. আর্দ্রা
    "বৃহস্পতি", // ৭. পুনর্বসু
    "শনি",      // ৮. পুষ্যা
    "বুধ",      // ৯. অশ্লেষা
    "কেতু",      // ১০. মঘা
    "শুক্র",     // ১১. পূর্বফাল্গুনী
    "সূর্য",     // ১২. উত্তরফাল্গুনী
    "চন্দ্র",    // ১৩. হস্তা
    "মঙ্গল",     // ১৪. চিত্রা
    "রাহু",      // ১৫. স্বাতী
    "বৃহস্পতি", // ১৬. বিশাখা
    "শনি",      // ১৭. অনুরাধা
    "বুধ",      // ১৮. জ্যেষ্ঠা
    "কেতু",      // ১৯. মূলা
    "শুক্র",     // ২০. পূর্বাষাঢ়া
    "সূর্য",     // ২১. উত্তরাষাঢ়া
    "চন্দ্র",    // ২২. শ্রবণা
    "মঙ্গল",     // ২৩. ধনিষ্ঠা
    "রাহু",      // ২৪. শতভিষা
    "বৃহস্পতি", // ২৫. পূর্বভাদ্রপদ
    "শনি",      // ২৬. উত্তরভাদ্রপদ
    "বুধ"       // ২৭. রেবতী
];

// বিংশোত্তরী দশাক্রম (মোট ১২০ বছর)
const DASHA_SEQUENCE = ["সূর্য", "চন্দ্র", "মঙ্গল", "রাহু", "বৃহস্পতি", "শনি", "বুধ", "কেতু", "শুক্র"];

// ==================== ২. দশা গণনার ফাংশন ====================

/**
 * চন্দ্রের দ্রাঘিমাংশ থেকে জন্মকালীন দশার তথ্য নির্ণয়
 * @param {number} moonLongitude - চন্দ্রের নিরয়ণ দ্রাঘিমাংশ (০-৩৬০)
 * @returns {object} দশার তথ্য
 */
function calculateBirthDasha(moonLongitude) {
    // চন্দ্র কোন নক্ষত্রে আছে?
    const nakshatraSpan = 360 / 27;
    const nakshatraIndex = Math.floor(moonLongitude / nakshatraSpan);
    
    // নক্ষত্রের অধিপতি
    const birthLord = NAKSHATRA_LORDS[nakshatraIndex];
    
    // নক্ষত্রে চন্দ্র কত ডিগ্রি অতিক্রম করেছে?
    const degreeInNakshatra = moonLongitude % nakshatraSpan;
    
    // কত শতাংশ অতিক্রম করেছে?
    const traversedFraction = degreeInNakshatra / nakshatraSpan;
    
    // অধিপতির মোট দশা সময়কাল
    const totalPeriod = DASHA_PERIODS[birthLord];
    
    // জন্মকালীন ভারসাম্য (কত বছর এখনও বাকি)
    const balanceYears = (1 - traversedFraction) * totalPeriod;
    
    // দশাক্রমে অধিপতির অবস্থান
    const lordIndex = DASHA_SEQUENCE.indexOf(birthLord);
    
    // জন্ম থেকে সমস্ত মহাদশার সময়সীমা তৈরি
    const dashaTimeline = [];
    let startYear = -balanceYears; // জন্মের আগে থেকে শুরু
    
    for (let i = 0; i < 9; i++) {
        const seqIndex = (lordIndex + i) % 9;
        const lord = DASHA_SEQUENCE[seqIndex];
        const period = DASHA_PERIODS[lord];
        
        dashaTimeline.push({
            lord: lord,
            period: period,
            start: startYear,
            end: startYear + period
        });
        
        startYear += period;
    }
    
    return {
        birthLord: birthLord,
        balanceYears: balanceYears,
        dashaTimeline: dashaTimeline
    };
}

/**
 * নির্দিষ্ট বয়সে কোন মহাদশা চলছে তা নির্ণয়
 * @param {object} dashaTimeline - calculateBirthDasha থেকে প্রাপ্ত
 * @param {number} ageYears - বর্তমান বয়স (বছর)
 * @returns {object} বর্তমান মহাদশার তথ্য
 */
function getCurrentMahaDasha(dashaTimeline, ageYears) {
    for (let i = 0; i < dashaTimeline.length; i++) {
        const dasha = dashaTimeline[i];
        if (ageYears >= dasha.start && ageYears < dasha.end) {
            return {
                ...dasha,
                elapsed: ageYears - dasha.start,
                remaining: dasha.end - ageYears,
                progress: (ageYears - dasha.start) / dasha.period
            };
        }
    }
    return null;
}

/**
 * বর্তমান অন্তর্দশা নির্ণয়
 * @param {object} currentMD - বর্তমান মহাদশার তথ্য
 * @returns {object} বর্তমান অন্তর্দশার তথ্য
 */
function getCurrentAntarDasha(currentMD) {
    if (!currentMD) return null;
    
    const mdLordIndex = DASHA_SEQUENCE.indexOf(currentMD.lord);
    const mdPeriod = currentMD.period;
    const elapsed = currentMD.elapsed;
    
    // অন্তর্দশার ক্রম
    const antarSequence = [];
    let startInMD = 0;
    
    for (let i = 0; i < 9; i++) {
        const seqIndex = (mdLordIndex + i) % 9;
        const lord = DASHA_SEQUENCE[seqIndex];
        const fraction = DASHA_PERIODS[lord] / 120; // ১২০ বছরের অনুপাত
        const period = fraction * mdPeriod;
        
        if (elapsed >= startInMD && elapsed < startInMD + period) {
            return {
                lord: lord,
                elapsed: elapsed - startInMD,
                total: period,
                progress: (elapsed - startInMD) / period,
                startInMD: startInMD,
                endInMD: startInMD + period
            };
        }
        
        startInMD += period;
    }
    
    return null;
}

/**
 * বর্তমান প্রত্যংতর দশা নির্ণয়
 * @param {object} currentMD - বর্তমান মহাদশা
 * @param {object} currentAD - বর্তমান অন্তর্দশা
 * @returns {object} বর্তমান প্রত্যংতর দশার তথ্য
 */
function getCurrentPratyantarDasha(currentMD, currentAD) {
    if (!currentMD || !currentAD) return null;
    
    const adLordIndex = DASHA_SEQUENCE.indexOf(currentAD.lord);
    const adTotal = currentAD.total;
    const adElapsed = currentAD.elapsed;
    
    let startInAD = 0;
    
    for (let i = 0; i < 9; i++) {
        const seqIndex = (adLordIndex + i) % 9;
        const lord = DASHA_SEQUENCE[seqIndex];
        const fraction = DASHA_PERIODS[lord] / 120;
        const period = fraction * currentMD.period * (currentAD.total / currentMD.period);
        
        if (adElapsed >= startInAD && adElapsed < startInAD + period) {
            return {
                lord: lord,
                elapsed: adElapsed - startInAD,
                total: period,
                progress: (adElapsed - startInAD) / period
            };
        }
        
        startInAD += period;
    }
    
    return null;
}

/**
 * সম্পূর্ণ দশা তথ্য প্রদান
 * @param {number} moonLongitude - চন্দ্রের নিরয়ণ দ্রাঘিমাংশ
 * @param {number} ageYears - বর্তমান বয়স
 * @returns {object} পূর্ণাঙ্গ দশা তথ্য
 */
function getFullDashaInfo(moonLongitude, ageYears) {
    const birth = calculateBirthDasha(moonLongitude);
    const currentMD = getCurrentMahaDasha(birth.dashaTimeline, ageYears);
    const currentAD = getCurrentAntarDasha(currentMD);
    const currentPD = getCurrentPratyantarDasha(currentMD, currentAD);
    
    return {
        birth: birth,
        currentMD: currentMD,
        currentAD: currentAD,
        currentPD: currentPD,
        allDasha: birth.dashaTimeline
    };
}

/**
 * জন্ম তারিখ থেকে বর্তমান বয়স নির্ণয়
 * @param {number} birthJD - জন্মের জুলিয়ান ডে
 * @returns {number} বয়স (বছর)
 */
function getAgeYears(birthJD) {
    const nowJD = Date.now() / 86400000 + 2440587.5; // বর্তমান JD
    return (nowJD - birthJD) / 365.25;
}

// ==================== ৩. টেস্টিং ====================
console.log("✅ দশা গণনার ফাংশন লোড সম্পন্ন হয়েছে।");
console.log("🔍 ব্যবহার: calculateBirthDasha(moonLongitude)");
console.log("🔍 ব্যবহার: getFullDashaInfo(moonLongitude, ageYears)");
