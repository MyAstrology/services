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
        output += this.generateDashaAnalysis();
        output += this.generateRemedySection();

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
        
        if (typeof getNakshatraPrediction === 'function') {
            output += getNakshatraPrediction(moon.nakshatra, moon.rashi) + "\n\n";
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
            // data uses Bengali numerals (১,২...১২); convert Arabic→Bengali
            const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
            const toBn = n => String(n).split('').map(d=>bn[+d]||d).join('');
            const key = `${planetName}_ভাব_${toBn(planet.house)}`;
            
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

    generateDashaAnalysis() {
        const dashaInfo = this.chartData.dashaInfo;
        if (!dashaInfo || !dashaInfo.currentMD) return "";

        let output = "⏳ মহাদশা ও অন্তর্দশা ফলাদেশ\n";
        output += "─".repeat(40) + "\n";

        if (typeof getCurrentDashaPrediction === 'function') {
            output += getCurrentDashaPrediction(dashaInfo) + "\n";
        } else {
            const md = dashaInfo.currentMD;
            const ad = dashaInfo.currentAD;
            output += `বর্তমানে ${md.lord} মহাদশা চলছে।\n`;
            if (ad) {
                output += `অন্তর্দশা: ${ad.lord}।\n`;
                if (typeof getAntarDashaPrediction === 'function') {
                    output += getAntarDashaPrediction(md.lord, ad.lord) + "\n\n";
                }
            }
        }
        return output;
    }

    generateRemedySection() {
        const planets = this.chartData.planets;
        if (!planets) return "";

        let output = "🙏 গ্রহ শান্তি ও প্রতিকার\n";
        output += "─".repeat(40) + "\n";

        try {
            if (typeof determineAllRemedies === 'function') {
                const remedies = determineAllRemedies(this.chartData, this.chartData.shadbalaData);
                if (typeof generateRemedyPrediction === 'function') {
                    output += generateRemedyPrediction(remedies) + "\n";
                }
            } else if (typeof TRI_SHAKTI_REMEDIES !== 'undefined') {
                const planetOrder = ["সূর্য","চন্দ্র","মঙ্গল","বুধ","বৃহস্পতি","শুক্র","শনি","রাহু","কেতু"];
                planetOrder.forEach(pn => {
                    const r = TRI_SHAKTI_REMEDIES[pn];
                    if (!r) return;
                    output += `\n🔶 ${pn}:\n`;
                    if (r.puja)      output += `   পূজা: ${r.puja}\n`;
                    if (r.donation)  output += `   দান: ${r.donation}\n`;
                    if (r.seva)      output += `   সেবা: ${r.seva}\n`;
                });
                output += "\n";
            } else {
                output += "প্রতিকার তথ্য লোড হয়নি।\n\n";
            }
        } catch(e) {
            output += "প্রতিকার গণনায় সমস্যা হয়েছে।\n\n";
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

// bhava-chalit.js
// ভাব কুণ্ডলী (Bhava Chalit) গণনা ও SVG চার্ট
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার

// ==================== ১. ভাব সীমানা গণনা ====================

/**
 * লগ্ন ডিগ্রি থেকে ১২টি ভাবের সীমানা নির্ণয়
 * @param {number} lagnaDegree - লগ্নের নিরয়ণ ডিগ্রি (০-৩৬০)
 * @returns {array} ১২টি ভাবের সীমানা [{start, end, rashiStart, rashiEnd}]
 */
function calculateBhavaBoundaries(lagnaDegree) {
    const boundaries = [];

    for (let i = 0; i < 12; i++) {
        // প্রতিটি ভাবের মধ্যবিন্দু — লগ্নের পূর্ণ ডিগ্রি থেকে শুরু
        const midPoint = (lagnaDegree + i * 30) % 360;
        
        // মধ্যবিন্দু থেকে ১৫° আগে ও পরে = ভাবের সীমানা
        const start = ((midPoint - 15) + 360) % 360;
        const end = ((midPoint + 15) + 360) % 360;
        
        // এই ভাবটি কোন রাশিতে শুরু ও শেষ হচ্ছে?
        const rashiStart = Math.floor(start / 30) % 12;
        const rashiEnd = Math.floor(end / 30) % 12;
        
        boundaries.push({
            bhava: i + 1,               // ভাব নম্বর (১-১২)
            midPoint: midPoint % 360,   // মধ্যবিন্দুর ডিগ্রি
            start: start % 360,         // শুরুর ডিগ্রি
            end: end % 360,             // শেষের ডিগ্রি
            rashiOfMidPoint: Math.floor((midPoint % 360) / 30), // মধ্যবিন্দুর রাশি
            rashiStart: rashiStart,
            rashiEnd: rashiEnd,
            startDegreeInRashi: start % 30,
            endDegreeInRashi: end % 30
        });
    }
    
    return boundaries;
}

/**
 * ভাব কুণ্ডলী অনুযায়ী গ্রহের ভাব নির্ণয়
 * @param {number} planetLongitude - গ্রহের নিরয়ণ দ্রাঘিমাংশ (০-৩৬০)
 * @param {array} boundaries - calculateBhavaBoundaries থেকে প্রাপ্ত
 * @returns {number} গ্রহটি যে ভাবে আছে (১-১২)
 */
function getBhavaForPlanet(planetLongitude, boundaries) {
    for (let i = 0; i < boundaries.length; i++) {
        const b = boundaries[i];
        const lon = planetLongitude % 360;
        
        // সাধারণ ক্ষেত্রে: start < end
        if (b.start < b.end) {
            if (lon >= b.start && lon < b.end) {
                return b.bhava;
            }
        } 
        // রাশির সীমানা অতিক্রম করলে: start > end
        else {
            if (lon >= b.start || lon < b.end) {
                return b.bhava;
            }
        }
    }
    
    // যদি কোনো ভাবেই না পড়ে (সাধারণত হয় না), রাশি অনুযায়ী নির্ণয়
    const rashi = Math.floor(planetLongitude / 30);
    const lagnaRashi = Math.floor(boundaries[0].midPoint / 30);
    return ((rashi - lagnaRashi + 12) % 12) + 1;
}

/**
 * সম্পূর্ণ ভাব কুণ্ডলী তথ্য তৈরি করে
 * @param {number} lagnaDegree - লগ্নের ডিগ্রি
 * @param {array} planets - গ্রহের তালিকা [{name, lon}]
 * @returns {object} ভাব কুণ্ডলীর সম্পূর্ণ তথ্য
 */
function getBhavaChalitData(lagnaDegree, planets) {
    const boundaries = calculateBhavaBoundaries(lagnaDegree);
    
    // গ্রহদের ভাবগত অবস্থান
    const planetsInBhava = planets.map(p => ({
        ...p,
        rashiBhava: ((Math.floor(p.lon / 30) - Math.floor(lagnaDegree / 30) + 12) % 12) + 1,
        chalitBhava: getBhavaForPlanet(p.lon, boundaries),
        changed: false // পরে চেক করব
    }));
    
    // যেসব গ্রহের ভাব পরিবর্তন হয়েছে
    planetsInBhava.forEach(p => {
        p.changed = (p.rashiBhava !== p.chalitBhava);
    });
    
    return {
        lagnaDegree,
        boundaries,
        planets: planetsInBhava,
        changedPlanets: planetsInBhava.filter(p => p.changed)
    };
}

// ==================== ২. ভাব কুণ্ডলী SVG চার্ট ====================

// পূর্ব ভারতীয় ছকের অবস্থান
const CHART_POSITIONS = [
    {x: 170, y: 40},   // ০: মেষ (১ম ভাবের জন্য উপরের মাঝে)
    {x: 75, y: 35},    // ১: বৃষ
    {x: 35, y: 75},    // ২: মিথুন
    {x: 55, y: 170},   // ৩: কর্কট
    {x: 35, y: 265},   // ৪: সিংহ
    {x: 75, y: 305},   // ৫: কন্যা
    {x: 170, y: 300},  // ৬: তুলা
    {x: 265, y: 305},  // ৭: বৃশ্চিক
    {x: 305, y: 265},  // ৮: ধনু
    {x: 285, y: 170},  // ৯: মকর
    {x: 305, y: 75},   // ১০: কুম্ভ
    {x: 265, y: 35}    // ১১: মীন
];

/**
 * ভাব কুণ্ডলীর SVG চার্ট তৈরি করে
 * @param {string} svgId - SVG এলিমেন্টের ID
 * @param {object} bhavaData - getBhavaChalitData থেকে প্রাপ্ত
 * @param {array} rashiNames - ১২ রাশির নাম
 */
function drawBhavaChalitChart(svgId, bhavaData, rashiNames) {
    const svg = document.getElementById(svgId);
    if (!svg) {
        console.warn(`SVG element '${svgId}' পাওয়া যায়নি`);
        return;
    }
    
    // SVG ক্লিয়ার করা
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    
    // ব্যাকগ্রাউন্ড
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "340");
    rect.setAttribute("height", "340");
    rect.setAttribute("fill", "#fdfaf6");
    rect.setAttribute("stroke", "#8b0000");
    rect.setAttribute("stroke-width", "2");
    svg.appendChild(rect);
    
    // গ্রিড লাইন
    const lines = [
        {x1:113,y1:0,x2:113,y2:340}, {x1:227,y1:0,x2:227,y2:340},
        {x1:0,y1:113,x2:340,y2:113}, {x1:0,y1:227,x2:340,y2:227},
        {x1:0,y1:0,x2:113,y2:113}, {x1:340,y1:0,x2:227,y2:113},
        {x1:0,y1:340,x2:113,y2:227}, {x1:340,y1:340,x2:227,y2:227}
    ];
    
    lines.forEach(l => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", l.x1); line.setAttribute("y1", l.y1);
        line.setAttribute("x2", l.x2); line.setAttribute("y2", l.y2);
        line.setAttribute("stroke", "#8b0000");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
    });
    
    // রাশির নাম ও ভাব নম্বর
    const lagnaRashi = Math.floor(bhavaData.lagnaDegree / 30);
    
    CHART_POSITIONS.forEach((pos, i) => {
        // রাশির নাম
        const rashiText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        rashiText.setAttribute("x", pos.x);
        rashiText.setAttribute("y", pos.y - 12);
        rashiText.setAttribute("text-anchor", "middle");
        rashiText.setAttribute("fill", i === lagnaRashi ? "#8b0000" : "#8b6914");
        rashiText.setAttribute("font-size", "10");
        rashiText.setAttribute("font-weight", i === lagnaRashi ? "bold" : "normal");
        rashiText.textContent = i === lagnaRashi ? `[${rashiNames[i]}]` : rashiNames[i];
        svg.appendChild(rashiText);
        
        // ভাব নম্বর
        const bhavaNum = ((i - lagnaRashi + 12) % 12) + 1;
        const bhavaText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        bhavaText.setAttribute("x", pos.x);
        bhavaText.setAttribute("y", pos.y - 22);
        bhavaText.setAttribute("text-anchor", "middle");
        bhavaText.setAttribute("fill", "#2c1810");
        bhavaText.setAttribute("font-size", "8");
        bhavaText.textContent = `ভা:${bhavaNum}`;
        svg.appendChild(bhavaText);
    });
    
    // গ্রহ বসানো (ভাব কুণ্ডলী অনুযায়ী)
    const rashiPlanets = Array(12).fill().map(() => []);
    
    bhavaData.planets.forEach(planet => {
        // ভাব কুণ্ডলীতে গ্রহের রাশি
        const chalitRashi = CHART_POSITIONS.findIndex((pos, i) => {
            const rashiStart = i * 30;
            const rashiEnd = (i + 1) * 30;
            return planet.lon >= rashiStart && planet.lon < rashiEnd;
        });
        
        if (chalitRashi >= 0) {
            const symbol = planet.name.substring(0, 2);
            const marker = planet.changed ? `${symbol}*` : symbol;
            rashiPlanets[chalitRashi].push(marker);
        }
    });
    
    CHART_POSITIONS.forEach((pos, i) => {
        if (rashiPlanets[i].length > 0) {
            const planetText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            planetText.setAttribute("x", pos.x);
            planetText.setAttribute("y", pos.y + 8);
            planetText.setAttribute("text-anchor", "middle");
            planetText.setAttribute("fill", "#1a1a2e");
            planetText.setAttribute("font-size", "10");
            planetText.setAttribute("font-weight", "bold");
            planetText.textContent = rashiPlanets[i].join(',');
            svg.appendChild(planetText);
        }
    });
}

/**
 * ভাব কুণ্ডলীর তথ্য দেখানোর জন্য HTML টেবিল তৈরি করে
 * @param {object} bhavaData - getBhavaChalitData থেকে প্রাপ্ত
 * @returns {string} HTML টেবিল
 */
function getBhavaChalitTable(bhavaData) {
    let html = '<table class="planet-table"><thead><tr>';
    html += '<th>গ্রহ</th><th>রাশি ভাব</th><th>ভাব কুণ্ডলী</th><th>পরিবর্তন</th>';
    html += '</tr></thead><tbody>';
    
    bhavaData.planets.forEach(p => {
        if (p.name === 'লগ্ন') return;
        html += '<tr>';
        html += `<td><strong>${p.name}</strong></td>`;
        html += `<td>${p.rashiBhava}ম ভাব</td>`;
        html += `<td style="color:${p.changed ? '#d32f2f' : '#2c1810'}">${p.chalitBhava}ম ভাব</td>`;
        html += `<td>${p.changed ? '✅ পরিবর্তিত' : '—'}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    
    if (bhavaData.changedPlanets.length > 0) {
        html += `<p style="color:#d32f2f; margin-top:10px;">⚠️ ভাব কুণ্ডলীতে ${bhavaData.changedPlanets.length}টি গ্রহের ভাব পরিবর্তিত হয়েছে। ভাবফল বিচারে ভাব কুণ্ডলীর ভাবকেই প্রাধান্য দেওয়া হয়।</p>`;
    }
    
    return html;
}

// shadbala-calculator.js
// ষড়বল (Shadbala) গণনার ফাংশন
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার

// ==================== ১. কনস্ট্যান্ট ====================

// নৈসর্গিক বল (স্থায়ী)
const NAISARGIKA_BALA = {
    "সূর্য": 6.0,
    "চন্দ্র": 6.5,
    "মঙ্গল": 5.0,
    "বুধ": 7.0,
    "বৃহস্পতি": 6.5,
    "শুক্র": 5.5,
    "শনি": 5.0,
    "রাহু": 0,   // ছায়াগ্রহের নৈসর্গিক বল নেই
    "কেতু": 0
};

// উচ্চ রাশি ও ডিগ্রি (তুঙ্গস্থান)
const EXALTATION = {
    "সূর্য": { rashi: 0, degree: 10 },      // মেষ ১০°
    "চন্দ্র": { rashi: 1, degree: 3 },       // বৃষ ৩°
    "মঙ্গল": { rashi: 9, degree: 28 },       // মকর ২৮°
    "বুধ": { rashi: 5, degree: 15 },         // কন্যা ১৫°
    "বৃহস্পতি": { rashi: 3, degree: 5 },    // কর্কট ৫°
    "শুক্র": { rashi: 11, degree: 27 },      // মীন ২৭°
    "শনি": { rashi: 6, degree: 20 },         // তুলা ২০°
};

// নীচ রাশি (দুর্বলস্থান)
const DEBILITATION = {
    "সূর্য": { rashi: 6, degree: 10 },       // তুলা ১০°
    "চন্দ্র": { rashi: 7, degree: 3 },        // বৃশ্চিক ৩°
    "মঙ্গল": { rashi: 3, degree: 28 },        // কর্কট ২৮°
    "বুধ": { rashi: 11, degree: 15 },         // মীন ১৫°
    "বৃহস্পতি": { rashi: 9, degree: 5 },     // মকর ৫°
    "শুক্র": { rashi: 5, degree: 27 },        // কন্যা ২৭°
    "শনি": { rashi: 0, degree: 20 },          // মেষ ২০°
};

// নিজরাশি
const OWN_RASHI = {
    "সূর্য": [4],              // সিংহ
    "চন্দ্র": [3],             // কর্কট
    "মঙ্গল": [0, 7],           // মেষ, বৃশ্চিক
    "বুধ": [2, 5],             // মিথুন, কন্যা
    "বৃহস্পতি": [8, 11],      // ধনু, মীন
    "শুক্র": [1, 6],           // বৃষ, তুলা
    "শনি": [9, 10],            // মকর, কুম্ভ
};

// মিত্র রাশি
const FRIEND_RASHI = {
    "সূর্য": [3, 4, 8],        // কর্কট, সিংহ, ধনু
    "চন্দ্র": [0, 1, 4],       // মেষ, বৃষ, সিংহ
    "মঙ্গল": [4, 8, 11],       // সিংহ, ধনু, মীন
    "বুধ": [0, 4, 6],          // মেষ, সিংহ, তুলা
    "বৃহস্পতি": [0, 3, 4],    // মেষ, কর্কট, সিংহ
    "শুক্র": [2, 9, 10],       // মিথুন, মকর, কুম্ভ
    "শনি": [1, 2, 6],          // বৃষ, মিথুন, তুলা
};

// মৌলত্রিকোণ
const MOOLTRIKONA = {
    "সূর্য": { rashi: 4, start: 0, end: 20 },      // সিংহ ০°-২০°
    "চন্দ্র": { rashi: 1, start: 3, end: 30 },      // বৃষ ৩°-৩০°
    "মঙ্গল": { rashi: 0, start: 0, end: 12 },       // মেষ ০°-১২°
    "বুধ": { rashi: 5, start: 15, end: 20 },        // কন্যা ১৫°-২০°
    "বৃহস্পতি": { rashi: 8, start: 0, end: 10 },   // ধনু ০°-১০°
    "শুক্র": { rashi: 6, start: 0, end: 15 },       // তুলা ০°-১৫°
    "শনি": { rashi: 10, start: 0, end: 20 },        // কুম্ভ ০°-২০°
};

// গ্রহের দিক বল (Dik Bala)
const DIK_BALA_HOUSE = {
    "সূর্য": 10,
    "চন্দ্র": 4,
    "মঙ্গল": 10,
    "বুধ": 1,
    "বৃহস্পতি": 1,
    "শুক্র": 4,
    "শনি": 7,
};

// ==================== ২. বল গণনার ফাংশন ====================

/**
 * ১. স্থান বল (Sthana Bala) গণনা
 * গ্রহের রাশিগত অবস্থানের উপর ভিত্তি করে
 */
function calculateSthanaBala(planetName, rashiIndex, degreeInRashi) {
    let bala = 0;
    
    // উচ্চ বল (Uccha Bala)
    if (EXALTATION[planetName]) {
        const exalt = EXALTATION[planetName];
        if (rashiIndex === exalt.rashi) {
            const diff = Math.abs(degreeInRashi - exalt.degree);
            bala += Math.max(0, 60 - diff * 2); // সর্বোচ্চ ৬০ বিরূপ
        }
    }
    
    // সপ্তবর্গীয় বল (Saptavargiya Bala)
    // নিজরাশি
    if (OWN_RASHI[planetName] && OWN_RASHI[planetName].includes(rashiIndex)) {
        bala += 30;
    }
    // মিত্র রাশি
    else if (FRIEND_RASHI[planetName] && FRIEND_RASHI[planetName].includes(rashiIndex)) {
        bala += 15;
    }
    // উচ্চ রাশি
    else if (EXALTATION[planetName] && EXALTATION[planetName].rashi === rashiIndex) {
        bala += 20;
    }
    // মৌলত্রিকোণ
    if (MOOLTRIKONA[planetName]) {
        const mt = MOOLTRIKONA[planetName];
        if (rashiIndex === mt.rashi && degreeInRashi >= mt.start && degreeInRashi <= mt.end) {
            bala += 45;
        }
    }
    // নীচ রাশি
    if (DEBILITATION[planetName] && DEBILITATION[planetName].rashi === rashiIndex) {
        bala -= 30;
    }
    
    return Math.max(0, bala);
}

/**
 * ২. দিক বল (Dik Bala) গণনা
 * গ্রহ যে ভাবে আছে তার উপর ভিত্তি করে
 */
function calculateDikBala(planetName, house) {
    if (DIK_BALA_HOUSE[planetName] && house === DIK_BALA_HOUSE[planetName]) {
        return 60; // পূর্ণ দিক বল
    }
    return 0;
}

/**
 * ৩. কাল বল (Kala Bala) গণনা
 * সময়ের উপর ভিত্তি করে (সরলীকৃত)
 */
function calculateKalaBala(planetName, birthTimeHours, moonPhase) {
    let bala = 30; // বেস
    
    // চন্দ্রের জন্য পক্ষ বল
    if (planetName === "চন্দ্র") {
        if (moonPhase === "শুক্ল") bala += 15;
        else bala -= 15;
    }
    
    // সূর্যের জন্য দিনের সময়
    if (planetName === "সূর্য") {
        if (birthTimeHours >= 6 && birthTimeHours < 18) bala += 20; // দিন
        else bala -= 10; // রাত
    }
    
    // শনির জন্য রাত
    if (planetName === "শনি") {
        if (birthTimeHours >= 18 || birthTimeHours < 6) bala += 20; // রাত
        else bala -= 10;
    }
    
    return Math.max(0, bala);
}

/**
 * ৪. চেষ্টা বল (Chesta Bala) গণনা
 * গ্রহের গতির উপর ভিত্তি করে (সরলীকৃত)
 */
function calculateChestaBala(planetName, isRetrograde) {
    // বক্রী হলে অতিরিক্ত বল
    if (isRetrograde) {
        return 30;
    }
    // সূর্য ও চন্দ্র কখনো বক্রী হয় না
    if (planetName === "সূর্য" || planetName === "চন্দ্র") {
        return 20;
    }
    return 10;
}

/**
 * ৫. নৈসর্গিক বল (Naisargika Bala)
 * গ্রহের জন্মগত স্থায়ী শক্তি
 */
function calculateNaisargikaBala(planetName) {
    return NAISARGIKA_BALA[planetName] || 0;
}

/**
 * ৬. দৃক বল (Drik Bala)
 * গ্রহের উপর অন্যান্য গ্রহের দৃষ্টির প্রভাব (সরলীকৃত)
 */
function calculateDrikBala(planetName, aspects) {
    let bala = 0;
    
    if (!aspects) return bala;
    
    // শুভ গ্রহ (বুধ, বৃহস্পতি, শুক্র) থেকে দৃষ্টি = বল বৃদ্ধি
    // অশুভ গ্রহ (মঙ্গল, শনি, সূর্য) থেকে দৃষ্টি = বল হ্রাস
    const benefics = ["বুধ", "বৃহস্পতি", "শুক্র"];
    const malefics = ["মঙ্গল", "শনি", "সূর্য"];
    
    aspects.forEach(aspect => {
        if (benefics.includes(aspect.planet)) bala += 5;
        if (malefics.includes(aspect.planet)) bala -= 5;
    });
    
    return Math.max(-30, Math.min(30, bala));
}

/**
 * সম্পূর্ণ ষড়বল গণনা
 * @param {string} planetName - গ্রহের নাম
 * @param {object} planetData - গ্রহের ডেটা {rashiIndex, degreeInRashi, house, isRetrograde}
 * @param {object} birthInfo - জন্ম তথ্য {birthTimeHours, moonPhase, aspects}
 * @returns {object} ষড়বলের পূর্ণাঙ্গ তথ্য
 */
function calculateShadbala(planetName, planetData, birthInfo = {}) {
    const {
        rashiIndex = 0,
        degreeInRashi = 0,
        house = 1,
        isRetrograde = false,
        aspects = []
    } = planetData;
    
    const {
        birthTimeHours = 12,
        moonPhase = "শুক্ল"
    } = birthInfo;
    
    const sthanaBala = calculateSthanaBala(planetName, rashiIndex, degreeInRashi);
    const dikBala = calculateDikBala(planetName, house);
    const kalaBala = calculateKalaBala(planetName, birthTimeHours, moonPhase);
    const chestaBala = calculateChestaBala(planetName, isRetrograde);
    const naisargikaBala = calculateNaisargikaBala(planetName);
    const drikBala = calculateDrikBala(planetName, aspects);
    
    const totalVirupa = sthanaBala + dikBala + kalaBala + chestaBala + drikBala;
    const totalRupa = naisargikaBala + (totalVirupa / 60);
    
    let strength = "মধ্যম";
    if (totalRupa >= 8) strength = "অত্যন্ত শক্তিশালী";
    else if (totalRupa >= 6) strength = "শক্তিশালী";
    else if (totalRupa >= 4) strength = "মধ্যম";
    else if (totalRupa >= 2) strength = "দুর্বল";
    else strength = "অত্যন্ত দুর্বল";
    
    return {
        sthanaBala,
        dikBala,
        kalaBala,
        chestaBala,
        naisargikaBala,
        drikBala,
        totalVirupa,
        totalRupa: totalRupa.toFixed(2),
        strength
    };
}

/**
 * সমস্ত গ্রহের ষড়বল গণনা
 * @param {array} planets - গ্রহের তালিকা
 * @param {object} birthInfo - জন্ম তথ্য
 * @returns {object} সব গ্রহের ষড়বল
 */
function calculateAllShadbala(planets, birthInfo = {}) {
    const result = {};
    
    const planetNames = ["সূর্য", "চন্দ্র", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"];
    
    planetNames.forEach(name => {
        const planet = planets.find(p => p.name === name);
        if (planet) {
            result[name] = calculateShadbala(name, {
                rashiIndex: Math.floor(planet.lon / 30),
                degreeInRashi: planet.lon % 30,
                house: planet.house || 1,
                isRetrograde: planet.isRetrograde || false,
                aspects: planet.aspects || []
            }, birthInfo);
        }
    });
    
    return result;
}

/**
 * ষড়বলের HTML টেবিল তৈরি করে
 * @param {object} shadbalaData - calculateAllShadbala থেকে প্রাপ্ত
 * @returns {string} HTML টেবিল
 */
function getShadbalaTable(shadbalaData) {
    let html = '<table class="planet-table"><thead><tr>';
    html += '<th>গ্রহ</th><th>স্থান বল</th><th>দিক বল</th><th>কাল বল</th><th>চেষ্টা বল</th><th>নৈসর্গিক</th><th>দৃক বল</th><th>মোট রূপা</th><th>শক্তি</th>';
    html += '</tr></thead><tbody>';
    
    Object.entries(shadbalaData).forEach(([planet, data]) => {
        const color = data.strength.includes("শক্তিশালী") ? "#28a745" : 
                     data.strength.includes("দুর্বল") ? "#dc3545" : "#ffc107";
        
        html += '<tr>';
        html += `<td><strong>${planet}</strong></td>`;
        html += `<td>${data.sthanaBala}</td>`;
        html += `<td>${data.dikBala}</td>`;
        html += `<td>${data.kalaBala}</td>`;
        html += `<td>${data.chestaBala}</td>`;
        html += `<td>${data.naisargikaBala}</td>`;
        html += `<td>${data.drikBala}</td>`;
        html += `<td><strong>${data.totalRupa}</strong></td>`;
        html += `<td style="color:${color};font-weight:bold;">${data.strength}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
}

// remedy-determiner.js
// কার জন্য কী রেমেডি প্রয়োজন - নির্ধারণের ফাংশন
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার

/**
 * গ্রহের দুর্বলতা নির্ণয় করে
 * @param {string} planetName - গ্রহের নাম
 * @param {object} planetData - গ্রহের ডেটা
 * @param {object} shadbalaData - ষড়বলের ডেটা (ঐচ্ছিক)
 * @returns {object} দুর্বলতার তথ্য
 */
function checkPlanetWeakness(planetName, planetData, shadbalaData) {
    const reasons = [];
    let needsRemedy = false;
    let severity = "কোনো নয়"; // কোনোটিই নয়, সামান্য, মধ্যম, গুরুতর
    
    const rashi = planetData.rashi !== undefined ? planetData.rashi
                : planetData.rashiIndex !== undefined ? planetData.rashiIndex
                : Math.floor(((planetData.lon || 0) + 360) % 360 / 30);
    const { house, isRetrograde, nakshatra } = planetData;
    
    // ১. নীচস্থ চেক
    const debilitation = {
        "সূর্য": { rashi: 6, degree: 10 },   // তুলা
        "চন্দ্র": { rashi: 7, degree: 3 },    // বৃশ্চিক
        "মঙ্গল": { rashi: 3, degree: 28 },    // কর্কট
        "বুধ": { rashi: 11, degree: 15 },     // মীন
        "বৃহস্পতি": { rashi: 9, degree: 5 }, // মকর
        "শুক্র": { rashi: 5, degree: 27 },    // কন্যা
        "শনি": { rashi: 0, degree: 20 }       // মেষ
    };
    
    if (debilitation[planetName] && rashi === debilitation[planetName].rashi) {
        reasons.push(`${planetName} নীচস্থ (দুর্বলতম অবস্থায়)`);
        needsRemedy = true;
        severity = "গুরুতর";
    }
    
    // ২. শত্রু রাশি চেক
    const enemyRashis = {
        "সূর্য": [6, 10],           // তুলা, মকর
        "চন্দ্র": [7, 8, 9],        // বৃশ্চিক, ধনু, মকর
        "মঙ্গল": [1, 2, 3, 6],      // বৃষ, মিথুন, কর্কট, তুলা
        "বুধ": [11],                 // মীন
        "বৃহস্পতি": [1, 5, 6],      // বৃষ, কন্যা, তুলা
        "শুক্র": [0, 4],             // মেষ, সিংহ
        "শনি": [0, 3, 4, 11]        // মেষ, কর্কট, সিংহ, মীন
    };
    
    if (enemyRashis[planetName] && enemyRashis[planetName].includes(rashi)) {
        reasons.push(`${planetName} শত্রু রাশিতে অবস্থিত`);
        needsRemedy = true;
        if (severity === "কোনো নয়") severity = "মধ্যম";
    }
    
    // ৩. অশুভ ভাবে (৬, ৮, ১২) অবস্থান চেক
    if ([6, 8, 12].includes(house)) {
        reasons.push(`${planetName} অশুভ ভাবে (${house}ম) অবস্থিত`);
        needsRemedy = true;
        if (severity === "কোনো নয়") severity = "সামান্য";
    }
    
    // ৪. বক্রী চেক
    if (isRetrograde && planetName !== "সূর্য" && planetName !== "চন্দ্র") {
        reasons.push(`${planetName} বক্রী গতিতে আছে`);
        needsRemedy = true;
        if (severity === "কোনো নয়" || severity === "সামান্য") severity = "মধ্যম";
    }
    
    // ৫. ষড়বল চেক
    if (shadbalaData && shadbalaData[planetName]) {
        const bala = parseFloat(shadbalaData[planetName].totalRupa);
        if (bala < 3) {
            reasons.push(`${planetName} ষড়বলে অত্যন্ত দুর্বল (${bala} রূপা)`);
            needsRemedy = true;
            if (severity !== "গুরুতর") severity = "গুরুতর";
        } else if (bala < 5) {
            reasons.push(`${planetName} ষড়বলে দুর্বল (${bala} রূপা)`);
            needsRemedy = true;
            if (severity === "কোনো নয়") severity = "সামান্য";
        }
    }
    
    return {
        planet: planetName,
        needsRemedy,
        severity,
        reasons,
        rashi,
        house,
        isRetrograde
    };
}

/**
 * সমস্ত গ্রহের রেমেডি প্রয়োজনীয়তা পরীক্ষা করে
 * @param {object} chartData - পূর্ণাঙ্গ কুষ্ঠি ডেটা
 * @param {object} shadbalaData - ষড়বল ডেটা
 * @returns {array} রেমেডি প্রয়োজন এমন গ্রহের তালিকা
 */
function determineAllRemedies(chartData, shadbalaData) {
    const planets = chartData.planets || [];
    const remedies = [];
    
    // শুধু এই গ্রহগুলোর জন্য চেক করব
    const planetNames = ["সূর্য", "চন্দ্র", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"];
    
    planetNames.forEach(name => {
        const planet = planets.find(p => p.name === name);
        if (planet) {
            const result = checkPlanetWeakness(name, planet, shadbalaData);
            if (result.needsRemedy) {
                remedies.push(result);
            }
        }
    });
    
    // গুরুত্ব অনুযায়ী সাজানো (গুরুতর আগে)
    const severityOrder = { "গুরুতর": 0, "মধ্যম": 1, "সামান্য": 2 };
    remedies.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    return remedies;
}

/**
 * রেমেডি প্রেডিকশন তৈরি করে
 * @param {array} remedies - determineAllRemedies থেকে প্রাপ্ত
 * @returns {string} পূর্ণাঙ্গ রেমেডি প্রেডিকশন
 */
function generateRemedyPrediction(remedies) {
    if (!remedies || remedies.length === 0) {
        return "আপনার কুষ্ঠিতে সমস্ত গ্রহ শক্তিশালী অবস্থানে আছে। বিশেষ কোনো রেমেডির প্রয়োজন নেই। তবে নিয়মিত পূজা ও দান করুন।";
    }

    let output = "🙏 গ্রহ শান্তির জন্য পূজা বিধান ও প্রতিকার\n";
    output += "─".repeat(45) + "\n\n";

    remedies.forEach((remedy, index) => {
        const remedyData = (typeof TRI_SHAKTI_REMEDIES !== 'undefined') ? TRI_SHAKTI_REMEDIES[remedy.planet] : null;

        output += `🟊 ${remedy.planet} (${remedy.severity} দুর্বলতা)\n`;
        output += `   কারণ: ${remedy.reasons.join("; ")}\n\n`;

        if (remedyData) {
            if (remedyData.lalKitabTotka) output += `   📿 লাল কিতাব টোটকা:\n   ${remedyData.lalKitabTotka}\n\n`;
            if (remedyData.puja) output += `   🕉️ পূজা অর্চনা:\n   ${remedyData.puja}\n\n`;
            if (remedyData.seva) output += `   🌟 সেবা:\n   ${remedyData.seva}\n\n`;
            if (remedyData.donation) output += `   🎁 দান:\n   ${remedyData.donation}\n\n`;
            if (remedyData.caution) output += `   ⚠️ সতর্কতা:\n   ${remedyData.caution}\n`;
        }

        if (index < remedies.length - 1) output += "\n" + "─".repeat(30) + "\n\n";
    });

    output += "\n" + "─".repeat(45) + "\n";
    output += "⚠️ দ্রষ্টব্য: রেমেডিগুলি বিশ্বাস ও নিষ্ঠার সাথে করতে হবে। ফল পেতে সময় লাগতে পারে। ধৈর্য ধরুন।\n";

    return output;
}

console.log("✅ রেমেডি নির্ধারণের ফাংশন লোড সম্পন্ন হয়েছে।");
