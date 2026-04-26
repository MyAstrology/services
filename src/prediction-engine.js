
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

    generateTaraAnalysis() {
        const moon = this.chartData.planets?.find(p => p.name === "চন্দ্র");
        if (!moon || !moon.nakshatra) return "";

        let output = "🌟 নবতারা চক্র (জন্মনক্ষত্র অনুযায়ী)\n";
        output += "─".repeat(40) + "\n";

        const engine = new NavaTaraGemEngine();
        const todayNak = moon.nakshatra;
        const tara = engine.getTara(moon.nakshatra, todayNak);

        if (tara.error) return "";

        output += `জন্মনক্ষত্র: ${moon.nakshatra}\n`;
        output += `জন্ম তারা: ${tara.icon} ${tara.taraName} (${tara.taraIndex}ম তারা) — ${tara.type}\n\n`;

        const table = engine.getFullTaraTable(moon.nakshatra);
        output += "নক্ষত্র → তারা ফল:\n";
        table.forEach(row => {
            const isBad = ["বিপৎ", "প্রত্যরি", "নিধন"].includes(row.taraName);
            output += `  ${row.icon} ${row.nakshatra} → ${row.taraName} (${isBad ? 'অশুভ' : 'শুভ'})\n`;
        });

        output += "\n";
        return output;
    }

    generateRatnaRecommendation() {
        const lagna = this.chartData.lagna;
        const planets = this.chartData.planets;
        if (!lagna || !planets) return "";

        let output = "💎 রত্ন পরামর্শ (পঞ্চমেশ + নবম ভাবস্থ গ্রহ)\n";
        output += "─".repeat(40) + "\n";

        const engine = new NavaTaraGemEngine();

        const allPlanetSigns = {};
        planets.forEach(p => {
            if (p.rashi !== undefined && p.name) allPlanetSigns[p.name] = p.rashi;
            else if (p.lon !== undefined && p.name) allPlanetSigns[p.name] = Math.floor(((p.lon % 360) + 360) % 360 / 30);
        });

        const lagnaRashi = lagna.rashi !== undefined ? lagna.rashi : Math.floor(((lagna.lon || 0) % 360 + 360) % 360 / 30);
        const { recommendations, warnings } = engine.getSafeGemRecommendations(lagnaRashi, allPlanetSigns);

        recommendations.forEach(r => {
            const icon = r.priority === 1 ? '🥇' : '🥈';
            output += `\n${icon} ${r.type}: ${r.gem}\n`;
            output += `   গ্রহ: ${r.planet} (${r.house})\n`;
            output += `   কারণ: ${r.reason}\n`;
            output += `   ধাতু: ${r.metal} | আঙুল: ${r.finger}\n`;
            output += `   ধারণের দিন: ${r.day} | ওজন: ${r.weight}\n`;
            output += `   মন্ত্র: ${r.mantra}\n`;
            output += `   উপকারিতা: ${r.benefits}\n`;
        });

        if (warnings.length > 0) {
            output += "\n⚠️ সতর্কতা:\n";
            warnings.forEach(w => output += `   • ${w}\n`);
        }

        output += "\n🕉️ রত্ন ধারণের নিয়ম: নির্দিষ্ট দিনে সকালে স্নান করে, মন্ত্র ১০৮ বার জপ করে, নির্দিষ্ট আঙুলে ধারণ করুন।\n\n";
        return output;
    }

    generateNadiTriIpapaHTML(containerId) {
        const moon = this.chartData.planets?.find(p => p.name === "চন্দ্র");
        if (!moon || !moon.nakshatra) return;
        const ui = new NavaTaraNadiUI();
        ui.renderAll(moon.nakshatra, containerId);
    }

    generateFullPredictionWithNewFeatures() {
        if (!this.userName) this.userName = "জাতক/জাতিকা";
        if (!this.chartData || !this.chartData.planets) {
            return "দুঃখিত, কুষ্ঠির ডেটা পাওয়া যায়নি।";
        }

        let output = "";
        output += `🪐 শ্রী ${this.userName}-এর পূর্ণাঙ্গ পূর্ব ভারতীয় কুষ্ঠি বিশ্লেষণ\n`;
        output += "═".repeat(50) + "\n\n";
        output += `প্রিয় ${this.userName},\n\n`;
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
        output += this.generateTaraAnalysis();
        output += this.generateRatnaRecommendation();
        output += this.generateRemedySection();

        output += "\n" + "═".repeat(50) + "\n";
        output += `✨ ${this.userName}, আপনার জীবন মঙ্গলময় হোক। ✨\n`;
        output += "\n© পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার | লাহিড়ী অয়নাংশ | VSOP87 নির্ভুল গণনা\n";

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
        rashiText.setAttribute("font-size", "11");
        rashiText.setAttribute("font-weight", i === lagnaRashi ? "bold" : "normal");
        rashiText.setAttribute("font-family", "Noto Sans Bengali,serif");
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
    
    // গ্রহ সংক্ষিপ্ত নাম
    const BCHRT_SHORT={"লগ্ন":"ল","সূর্য":"রবি","চন্দ্র":"চন্দ্র","মঙ্গল":"মঙ্গ",
        "বুধ":"বুধ","বৃহস্পতি":"বৃহ","শুক্র":"শুক্র","শনি":"শনি","রাহু":"রাহু","কেতু":"কেতু"};

    // গ্রহ বসানো (ভাব কুণ্ডলী অনুযায়ী)
    const rashiPlanets = Array(12).fill().map(() => []);
    
    bhavaData.planets.forEach(planet => {
        let chartPosIdx;
        if (planet.chalitBhava !== undefined) {
            chartPosIdx = (lagnaRashi + planet.chalitBhava - 1) % 12;
        } else {
            const normLon = ((planet.lon || 0) % 360 + 360) % 360;
            chartPosIdx = Math.floor(normLon / 30);
        }
        if (chartPosIdx >= 0 && chartPosIdx < 12) {
            const symbol = BCHRT_SHORT[planet.name] || planet.name.substring(0, 2);
            rashiPlanets[chartPosIdx].push(planet.changed ? symbol + '*' : symbol);
        }
    });
    
    const ns2 = "http://www.w3.org/2000/svg";
    CHART_POSITIONS.forEach((pos, i) => {
        const cnt = rashiPlanets[i].length;
        if (!cnt) return;
        const lH = cnt <= 2 ? 12 : 10;
        const fS = cnt <= 2 ? 11 : cnt <= 3 ? 10 : 9;
        const inBot = pos.y > 170;
        rashiPlanets[i].forEach((nm, ni) => {
            const t = document.createElementNS(ns2, "text");
            t.setAttribute("x", pos.x);
            const ty = inBot ? pos.y - 22 - ni * lH : pos.y + 12 + ni * lH;
            t.setAttribute("y", ty);
            t.setAttribute("text-anchor", "middle");
            t.setAttribute("fill", nm.endsWith("*") ? "#c62828" : "#1a1a2e");
            t.setAttribute("font-size", String(fS));
            t.setAttribute("font-weight", "bold");
            t.setAttribute("font-family", "Noto Sans Bengali,serif");
            t.textContent = nm;
            svg.appendChild(t);
        });
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

// ==================== প্রথম ভাগ ====================
// prediction-engine.js-এর নিচে এই ক্লাস দুটি যোগ করুন
// বিদ্যমান সব কোড অপরিবর্তিত রেখে, শুধু শেষে পেস্ট করুন

// ==================== NavaTaraGemEngine ====================
class NavaTaraGemEngine {
    constructor() {
        this.nakshatras = [
            "অশ্বিনী", "ভরণী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা",
            "পুনর্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূর্বফাল্গুনী", "উত্তরফাল্গুনী",
            "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা",
            "মূলা", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা", "শতভিষা",
            "পূর্বভাদ্রপদ", "উত্তরভাদ্রপদ", "রেবতী"
        ];

        this.taraNames = ["জন্ম", "সম্পদ", "বিপৎ", "ক্ষেম", "প্রত্যরি", "সাধক", "নিধন", "মিত্র", "অতিমিত্র"];
        
        this.taraNature = {
            "জন্ম": { type: "নিরপেক্ষ", icon: "🔸" },
            "সম্পদ": { type: "শুভ", icon: "✨" },
            "বিপৎ": { type: "অশুভ", icon: "⚠️" },
            "ক্ষেম": { type: "শুভ", icon: "✅" },
            "প্রত্যরি": { type: "অশুভ", icon: "⚡" },
            "সাধক": { type: "শুভ", icon: "🌟" },
            "নিধন": { type: "অশুভ", icon: "💀" },
            "মিত্র": { type: "শুভ", icon: "🤝" },
            "অতিমিত্র": { type: "শুভ", icon: "👑" }
        };

        this.signs = ["মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"];
        
        this.signLords = {
            "মেষ":"মঙ্গল","বৃষ":"শুক্র","মিথুন":"বুধ","কর্কট":"চন্দ্র",
            "সিংহ":"সূর্য","কন্যা":"বুধ","তুলা":"শুক্র","বৃশ্চিক":"মঙ্গল",
            "ধনু":"বৃহস্পতি","মকর":"শনি","কুম্ভ":"শনি","মীন":"বৃহস্পতি"
        };

        this.shadowPlanets = ["রাহু", "কেতু"];

        this.gemstones = {
            "সূর্য": { gem: "মাণিক্য (Ruby)", metal: "তামা", finger: "অনামিকা", day: "রবিবার", mantra: "ওঁ সূর্যায় নমঃ", weight: "৩-৬ ক্যারেট", benefits: "আত্মবিশ্বাস, নেতৃত্ব, পিতৃসুখ, হৃদরোগ প্রতিরোধ" },
            "চন্দ্র": { gem: "মুক্তা (Pearl)", metal: "রূপা", finger: "কনিষ্ঠা", day: "সোমবার", mantra: "ওঁ সোমায় নমঃ", weight: "২-৫ ক্যারেট", benefits: "মানসিক শান্তি, মাতৃসুখ, স্মৃতিশক্তি, অনিদ্রা দূর" },
            "মঙ্গল": { gem: "প্রবাল (Red Coral)", metal: "তামা", finger: "অনামিকা", day: "মঙ্গলবার", mantra: "ওঁ অং অঙ্গারকায় নমঃ", weight: "৫-৯ ক্যারেট", benefits: "সাহস, শক্তি, ভূমিলাভ, রক্তদোষ নাশ" },
            "বুধ": { gem: "পান্না (Emerald)", metal: "সোনা", finger: "কনিষ্ঠা", day: "বুধবার", mantra: "ওঁ বুধায় নমঃ", weight: "৩-৬ ক্যারেট", benefits: "বুদ্ধি, বাকপটুতা, ব্যবসায় সাফল্য" },
            "বৃহস্পতি": { gem: "পোখরাজ (Yellow Sapphire)", metal: "সোনা", finger: "তর্জনী", day: "বৃহস্পতিবার", mantra: "ওঁ বৃং বৃহস্পতয়ে নমঃ", weight: "৫-৭ ক্যারেট", benefits: "জ্ঞান, ধর্ম, সন্তানসুখ, আর্থিক সমৃদ্ধি" },
            "শুক্র": { gem: "হীরা (Diamond)", metal: "প্লাটিনাম/সোনা", finger: "মধ্যমা", day: "শুক্রবার", mantra: "ওঁ শুং শুক্রায় নমঃ", weight: "০.৫-২ ক্যারেট", benefits: "সৌন্দর্য, দাম্পত্য সুখ, প্রজনন স্বাস্থ্য" },
            "শনি": { gem: "নীলম (Blue Sapphire)", metal: "লোহা/পঞ্চধাতু", finger: "মধ্যমা", day: "শনিবার", mantra: "ওঁ শং শনৈশ্চরায় নমঃ", weight: "৫-৭ ক্যারেট", benefits: "ধৈর্য, কর্মসাফল্য, দীর্ঘায়ু, শত্রুনাশ" },
            "রাহু": { gem: "গোমেদ (Hessonite)", metal: "অষ্টধাতু", finger: "মধ্যমা", day: "শনিবার", mantra: "ওঁ রাং রাহবে নমঃ", weight: "৫-৭ ক্যারেট", benefits: "বিদেশ যাত্রা, প্রযুক্তিতে সাফল্য" },
            "কেতু": { gem: "লহসুনিয়া (Cat's Eye)", metal: "অষ্টধাতু", finger: "কনিষ্ঠা", day: "মঙ্গলবার", mantra: "ওঁ কেৎ কেতবে নমঃ", weight: "৩-৫ ক্যারেট", benefits: "আধ্যাত্মিকতা, গুপ্ত জ্ঞান, মোক্ষ" }
        };

        this.nakshatraNadi = {
            "অশ্বিনী":"আদ্য","আর্দ্রা":"আদ্য","পূর্বভাদ্রপদ":"আদ্য","পুনর্বসু":"আদ্য","হস্তা":"আদ্য",
            "জ্যেষ্ঠা":"আদ্য","মূলা":"আদ্য","শ্রবণা":"আদ্য","রেবতী":"আদ্য",
            "ভরণী":"মধ্য","মৃগশিরা":"মধ্য","পুষ্যা":"মধ্য","পূর্বফাল্গুনী":"মধ্য","চিত্রা":"মধ্য",
            "অনুরাধা":"মধ্য","পূর্বাষাঢ়া":"মধ্য","ধনিষ্ঠা":"মধ্য","উত্তরভাদ্রপদ":"মধ্য",
            "কৃত্তিকা":"অন্ত্য","রোহিণী":"অন্ত্য","অশ্লেষা":"অন্ত্য","মঘা":"অন্ত্য",
            "স্বাতী":"অন্ত্য","বিশাখা":"অন্ত্য","উত্তরাষাঢ়া":"অন্ত্য","শতভিষা":"অন্ত্য","উত্তরফাল্গুনী":"অন্ত্য"
        };
    }

    getTara(birthNak, targetNak) {
        const bi = this.nakshatras.indexOf(birthNak), ti = this.nakshatras.indexOf(targetNak);
        if (bi === -1 || ti === -1) return { error: "নক্ষত্র সঠিক নয়" };
        const dist = (ti - bi + 27) % 27, taraIdx = dist % 9, taraName = this.taraNames[taraIdx];
        return { birthNakshatra: birthNak, targetNakshatra: targetNak, taraIndex: taraIdx + 1, taraName, ...this.taraNature[taraName] };
    }

    getFullTaraTable(birthNak) {
        return this.nakshatras.map(n => ({ nakshatra: n, ...this.getTara(birthNak, n) }));
    }

    getHouseSign(lagnaSign, house) {
        const li = this.signs.indexOf(lagnaSign);
        return li === -1 ? null : this.signs[(li + house - 1) % 12];
    }

    getHouseLord(sign) { return this.signLords[sign] || null; }

    getSafeGemRecommendations(lagnaSign, allPlanetSigns = {}) {
        const recommendations = [], warnings = [];
        const fifthSign = this.getHouseSign(lagnaSign, 5), fifthLord = this.getHouseLord(fifthSign);
        
        recommendations.push({
            type: "পঞ্চমরত্ন (প্রধান)",
            planet: fifthLord,
            house: "৫ম পতি",
            gem: this.gemstones[fifthLord]?.gem || "—",
            metal: this.gemstones[fifthLord]?.metal || "—",
            finger: this.gemstones[fifthLord]?.finger || "—",
            day: this.gemstones[fifthLord]?.day || "—",
            mantra: this.gemstones[fifthLord]?.mantra || "—",
            weight: this.gemstones[fifthLord]?.weight || "—",
            benefits: this.gemstones[fifthLord]?.benefits || "—",
            priority: 1,
            reason: `পঞ্চম ভাব (৫ম) ত্রিকোণস্থান — সর্বদা শুভ। ${fifthLord} আপনার পঞ্চমেশ — এর রত্ন পুত্র, বিদ্যা, বুদ্ধি, সৃজনশীলতা ও পুণ্যকর্ম বৃদ্ধি করবে। যে কোনো অবস্থায় নির্ভয়ে ধারণ করতে পারেন।`
        });

        const ninthSign = this.getHouseSign(lagnaSign, 9);
        const planetInNinth = Object.entries(allPlanetSigns).find(([p, s]) => s === ninthSign);

        if (planetInNinth && !this.shadowPlanets.includes(planetInNinth[0])) {
            const [pn, ps] = planetInNinth;
            const badHouses = [];
            for (const [s, l] of Object.entries(this.signLords)) {
                if (l === pn) {
                    const h = (this.signs.indexOf(s) - this.signs.indexOf(lagnaSign) + 12) % 12 + 1;
                    if ([6, 8, 12].includes(h)) badHouses.push(h);
                }
            }
            if (badHouses.length === 0) {
                recommendations.push({
                    type: "ভাগ্যরত্ন (গৌণ)",
                    planet: pn,
                    house: "৯ম ভাবস্থ",
                    gem: this.gemstones[pn]?.gem || "—",
                    metal: this.gemstones[pn]?.metal || "—",
                    finger: this.gemstones[pn]?.finger || "—",
                    day: this.gemstones[pn]?.day || "—",
                    mantra: this.gemstones[pn]?.mantra || "—",
                    weight: this.gemstones[pn]?.weight || "—",
                    benefits: this.gemstones[pn]?.benefits || "—",
                    priority: 2,
                    reason: `${pn} আপনার নবম ভাবে (ভাগ্যস্থানে) অবস্থান করছে এবং শুধুমাত্র শুভ ভাবের অধিপতি। এই রত্ন আপনার ভাগ্য, ধর্ম ও সৌভাগ্য বৃদ্ধি করবে।`
                });
            } else {
                warnings.push(`নবম ভাবে ${pn} অশুভভাবাধিপতি (${badHouses.join(' ও ')} পতি) — এর রত্ন সুপারিশ করা যাচ্ছে না।`);
            }
        } else if (planetInNinth) {
            warnings.push(`নবম ভাবে ${planetInNinth[0]} — ছায়াগ্রহ, এর রত্ন সুপারিশ করা যাচ্ছে না।`);
        } else {
            warnings.push("নবম ভাবে কোনো গ্রহ অবস্থান করছে না — শুধু পঞ্চমেশের রত্নই যথেষ্ট।");
        }

        return { recommendations, warnings };
    }

    getNadiCompatibility(birthNak, partnerNak) {
        const bn = this.nakshatraNadi[birthNak], pn = this.nakshatraNadi[partnerNak];
        if (!bn || !pn) return { error: "নক্ষত্র সঠিক নয়" };
        const sameNadi = (bn === pn);
        const hasVedha = (bn === "আদ্য" && pn === "মধ্য") || (bn === "মধ্য" && pn === "আদ্য");
        return { birthNadi: bn, partnerNadi: pn, sameNadi, hasVedha, icon: sameNadi ? "⚠️" : hasVedha ? "⚡" : "✅" };
    }

    getTriIpapaStatus(birthNak, todayNak) {
        const bi = this.nakshatras.indexOf(birthNak), ti = this.nakshatras.indexOf(todayNak);
        if (bi === -1 || ti === -1) return { error: "নক্ষত্র সঠিক নয়" };
        const dist = (ti - bi + 27) % 27;
        const issues = [];
        if ([0, 9, 18].includes(dist)) issues.push({ type: "গ্রহণ", desc: "শুভ কাজ থেকে বিরত থাকুন" });
        if ([3, 12, 21].includes(dist)) issues.push({ type: "বিষ", desc: "খাদ্য ও ওষুধে সাবধান" });
        if ([6, 15, 24].includes(dist)) issues.push({ type: "পাপগ্রহ", desc: "দুর্ঘটনা ও বিবাদ থেকে সাবধান" });
        return issues.length === 0 ? { hasDosha: false, icon: "✅", desc: "ত্রিইপাপ দোষ মুক্ত দিন" } : { hasDosha: true, icon: "⚠️", issues, desc: issues.map(i => `${i.type}: ${i.desc}`).join(' | ') };
    }
}

// ==================== NavaTaraNadiUI ====================
class NavaTaraNadiUI {
    constructor() {
        this.engine = new NavaTaraGemEngine();
        this.nakshatras = this.engine.nakshatras;
        this.nakshatraNadi = this.engine.nakshatraNadi;
        this.taraNames = this.engine.taraNames;
        this.taraIcons = this.engine.taraNature;
    }

    getTaraTableHTML(birthNak) {
        const bi = this.nakshatras.indexOf(birthNak);
        if (bi === -1) return "<p>নক্ষত্র সঠিক নয়</p>";
        let html = `<div style="overflow-x:auto;margin:20px 0;"><h3 style="text-align:center;color:#5D4037;">🌟 নবতারা চক্র</h3>
            <p style="text-align:center;font-size:0.9rem;color:#666;">জন্মনক্ষত্র: <strong>${birthNak}</strong> থেকে অন্যান্য নক্ষত্রের তারা ফল</p>
            <table style="width:100%;border-collapse:collapse;text-align:center;font-size:0.85rem;">
            <thead><tr style="background:#5D4037;color:#fff;"><th>#</th><th>নক্ষত্র</th><th>তারা</th><th>ফল</th></tr></thead><tbody>`;
        for (let i = 0; i < 27; i++) {
            const dist = (i - bi + 27) % 27, taraName = this.taraNames[dist % 9], tara = this.taraIcons[taraName], isBad = ["বিপৎ","প্রত্যরি","নিধন"].includes(taraName);
            html += `<tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}"><td>${i + 1}</td><td>${this.nakshatras[i]} ${i === bi ? '⭐' : ''}</td><td>${tara.icon} ${taraName}</td><td style="color:${isBad ? '#c62828' : '#2e7d32'};font-weight:bold;">${isBad ? '⚠️ অশুভ' : '✅ শুভ'}</td></tr>`;
        }
        html += `</tbody></table></div>`; return html;
    }

    getTriIpapaTableHTML(birthNak) {
        const bi = this.nakshatras.indexOf(birthNak);
        if (bi === -1) return "<p>নক্ষত্র সঠিক নয়</p>";
        const grahan = [0,9,18], bisha = [3,12,21], papa = [6,15,24];
        let html = `<div style="overflow-x:auto;margin:20px 0;"><h3 style="text-align:center;color:#5D4037;">⚠️ ত্রিইপাপ চক্র</h3>
            <p style="text-align:center;font-size:0.9rem;color:#666;">জন্মনক্ষত্র: <strong>${birthNak}</strong> থেকে ত্রিইপাপ অবস্থান</p>
            <table style="width:100%;border-collapse:collapse;text-align:center;font-size:0.85rem;">
            <thead><tr style="background:#5D4037;color:#fff;"><th>#</th><th>নক্ষত্র</th><th>গ্রহণ</th><th>বিষ</th><th>পাপগ্রহ</th><th>অবস্থা</th></tr></thead><tbody>`;
        for (let i = 0; i < 27; i++) {
            const dist = (i - bi + 27) % 27, isG = grahan.includes(dist), isB = bisha.includes(dist), isP = papa.includes(dist), hasDosha = isG || isB || isP;
            html += `<tr style="background:${hasDosha ? '#FFF5F5' : (i % 2 === 0 ? '#fff' : '#fafafa')}"><td>${i + 1}</td><td>${this.nakshatras[i]} ${i === bi ? '⭐' : ''}</td><td>${isG ? '🌑' : '—'}</td><td>${isB ? '☠️' : '—'}</td><td>${isP ? '😈' : '—'}</td><td style="color:${hasDosha ? '#c62828' : '#2e7d32'};font-weight:bold;">${hasDosha ? '⚠️ দূষিত' : '✅ শুদ্ধ'}</td></tr>`;
        }
        html += `</tbody></table></div>`; return html;
    }

    getNadiChakraSVG(birthNak) {
        const bn = this.nakshatraNadi[birthNak];
        if (!bn) return "<p>নক্ষত্র সঠিক নয়</p>";
        const groups = { "আদ্য": [], "মধ্য": [], "অন্ত্য": [] };
        for (const [n, nd] of Object.entries(this.nakshatraNadi)) groups[nd].push(n);

        const w = 600, h = 420, cx = w / 2, cy = h / 2, outerR = 160, innerR = 60;
        const arr = ["আদ্য", "মধ্য", "অন্ত্য"], cols = ["#4FC3F7", "#FFB74D", "#81C784"];
        let svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#FFFEF9;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);">`;
        svg += `<text x="${cx}" y="28" text-anchor="middle" font-size="16" font-weight="bold" fill="#5D4037">🔄 ষড়নাড়ি চক্র</text>`;
        svg += `<text x="${cx}" y="48" text-anchor="middle" font-size="12" fill="#888">জন্মনক্ষত্র: ${birthNak} (${bn} নাড়ী)</text>`;

        for (let g = 0; g < 3; g++) {
            const sa = g * (2 * Math.PI / 3) - Math.PI / 2, ea = sa + (2 * Math.PI / 3);
            const x1 = cx + Math.cos(sa) * outerR, y1 = cy + Math.sin(sa) * outerR;
            const x2 = cx + Math.cos(ea) * outerR, y2 = cy + Math.sin(ea) * outerR;
            svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 1 1 ${x2} ${y2} Z" fill="${cols[g]}" fill-opacity="0.12" stroke="${cols[g]}" stroke-width="2"/>`;
            const la = sa + (ea - sa) / 2, lr = outerR - 30;
            svg += `<text x="${cx + Math.cos(la) * lr}" y="${cy + Math.sin(la) * lr}" text-anchor="middle" font-size="13" font-weight="bold" fill="${cols[g]}">${arr[g]}</text>`;

            const naks = groups[arr[g]];
            for (let i = 0; i < naks.length; i++) {
                const a = sa + i * ((ea - sa) / naks.length), r = outerR - 55;
                const nx = cx + Math.cos(a) * r, ny = cy + Math.sin(a) * r;
                const isBirth = naks[i] === birthNak;
                svg += `<text x="${nx}" y="${ny}" text-anchor="middle" font-size="${isBirth ? 11 : 9}" fill="${isBirth ? '#c62828' : '#555'}" font-weight="${isBirth ? 'bold' : 'normal'}">${naks[i]}${isBirth ? ' ⭐' : ''}</text>`;
            }
        }
        svg += `<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="#5D4037" fill-opacity="0.1" stroke="#5D4037" stroke-width="2"/><text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="13" font-weight="bold" fill="#5D4037">${birthNak}</text><text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="10" fill="#888">(${bn})</text></svg>`;
        svg += `<div style="display:flex;justify-content:center;gap:20px;margin-top:10px;flex-wrap:wrap;font-size:0.8rem;"><span>🔵 আদ্য (${groups["আদ্য"].length})</span><span>🟠 মধ্য (${groups["মধ্য"].length})</span><span>🟢 অন্ত্য (${groups["অন্ত্য"].length})</span></div>`;
        return svg;
    }

    getNavaTaraChakraSVG(birthNak, birthPlanets = {}) {
        const naks = this.nakshatras;
        const bi = naks.indexOf(birthNak);
        if (bi === -1) return '';
        const W = 600, H = 640, cx = 300, cy = 325;
        const outerR = 245, sectorR = 170, planetR = 140, innerR = 68;
        const bandMid = (outerR + sectorR) / 2;
        const PC = {
            "সূর্য":"#FF6B35","চন্দ্র":"#4169E1","মঙ্গল":"#DC143C","বুধ":"#2E8B57",
            "বৃহস্পতি":"#DAA520","শুক্র":"#C71585","শনি":"#4B0082","রাহু":"#2F4F4F","কেতু":"#8B4513"
        };
        const PS = {
            "সূর্য":"রবি","চন্দ্র":"চন্দ্র","মঙ্গল":"মঙ্গ","বুধ":"বুধ",
            "বৃহস্পতি":"বৃহ","শুক্র":"শুক্র","শনি":"শনি","রাহু":"রাহু","কেতু":"কেতু"
        };
        const nakPlanets = {};
        for (const [pl, nak] of Object.entries(birthPlanets)) {
            if (!nakPlanets[nak]) nakPlanets[nak] = [];
            nakPlanets[nak].push(pl);
        }
        // anticlockwise: sector 0 at top, going left (counterclockwise on screen)
        const SA = (2 * Math.PI) / 27;
        let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;background:#FFFEF9;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);">`;
        svg += `<text x="${cx}" y="28" text-anchor="middle" font-size="20" font-weight="bold" fill="#5D4037" font-family="Noto Sans Bengali,serif">🌟 নবতারা চক্র</text>`;
        svg += `<text x="${cx}" y="52" text-anchor="middle" font-size="12" fill="#888" font-family="Noto Sans Bengali,serif">জন্মনক্ষত্র: ${birthNak} | গ্রহের নক্ষত্র অবস্থান (anticlockwise)</text>`;
        svg += `<circle cx="${cx}" cy="${cy}" r="${outerR}" fill="#f8f4ec" stroke="#c9b07a" stroke-width="1"/>`;
        for (let i = 0; i < 27; i++) {
            // anticlockwise: start at top (-π/2), go left (decrease angle)
            const sa = -Math.PI/2 - i * SA;
            const ea = sa - SA;
            const ma = sa - SA / 2; // midpoint angle
            const isBirth = i === bi;
            const dist = (i - bi + 27) % 27, taraName = this.taraNames[dist % 9];
            const isBad = ["বিপৎ","প্রত্যরি","নিধন"].includes(taraName);
            const isGood = ["সম্পদ","ক্ষেম","সাধক","মিত্র","অতিমিত্র"].includes(taraName);
            let fill = '#faf7f0';
            if (isBirth) fill = '#FFD700';
            else if (isBad) fill = '#fff0f0';
            else if (isGood) fill = '#f0fff4';
            const ox1=cx+outerR*Math.cos(sa), oy1=cy+outerR*Math.sin(sa);
            const ox2=cx+outerR*Math.cos(ea), oy2=cy+outerR*Math.sin(ea);
            const sx1=cx+sectorR*Math.cos(sa), sy1=cy+sectorR*Math.sin(sa);
            const sx2=cx+sectorR*Math.cos(ea), sy2=cy+sectorR*Math.sin(ea);
            // outer arc anticlockwise (sweep=0), inner arc clockwise (sweep=1) to close sector
            svg += `<path d="M ${sx1.toFixed(1)} ${sy1.toFixed(1)} L ${ox1.toFixed(1)} ${oy1.toFixed(1)} A ${outerR} ${outerR} 0 0 0 ${ox2.toFixed(1)} ${oy2.toFixed(1)} L ${sx2.toFixed(1)} ${sy2.toFixed(1)} A ${sectorR} ${sectorR} 0 0 1 ${sx1.toFixed(1)} ${sy1.toFixed(1)} Z" fill="${fill}" stroke="#c9b07a" stroke-width="0.7"/>`;
            // label: clock-face rotation so text is always readable
            const lx=(cx+bandMid*Math.cos(ma)).toFixed(1), ly=(cy+bandMid*Math.sin(ma)).toFixed(1);
            let rot = ma * 180 / Math.PI + 90;
            if (Math.sin(ma) > 0) rot += 180; // flip bottom-half labels to stay readable
            svg += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="${isBirth?8:7}" fill="${isBirth?'#8B0000':'#555'}" font-weight="${isBirth?'bold':'normal'}" font-family="Noto Sans Bengali,serif" transform="rotate(${rot.toFixed(1)},${lx},${ly})" dy="0.35em">${naks[i]}</text>`;
        }
        svg += `<circle cx="${cx}" cy="${cy}" r="${sectorR}" fill="#FFFEF9"/>`;
        svg += `<circle cx="${cx}" cy="${cy}" r="${planetR}" fill="none" stroke="#e0d0b5" stroke-width="0.8" stroke-dasharray="3,3"/>`;
        for (const [nak, planets] of Object.entries(nakPlanets)) {
            const ni = naks.indexOf(nak);
            if (ni === -1) continue;
            // anticlockwise planet angle: same direction as sectors
            const baseMa = -Math.PI/2 - (ni + 0.5) * SA;
            planets.forEach((pl, pi) => {
                const spread = planets.length > 1 ? SA * 0.28 * (pi - (planets.length - 1) / 2) : 0;
                const angle = baseMa + spread;
                const px=(cx+planetR*Math.cos(angle)).toFixed(1), py=(cy+planetR*Math.sin(angle)).toFixed(1);
                const col = PC[pl] || '#888', sn = PS[pl] || pl.substring(0,2);
                svg += `<circle cx="${px}" cy="${py}" r="16" fill="${col}" opacity="0.9" stroke="#fff" stroke-width="1.5"/>`;
                svg += `<text x="${px}" y="${py}" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold" font-family="Noto Sans Bengali,serif" dy="0.35em">${sn}</text>`;
            });
        }
        svg += `<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="#f9f0e3" stroke="#8B6914" stroke-width="1.5"/>`;
        svg += `<text x="${cx}" y="${cy-16}" text-anchor="middle" font-size="13" font-weight="bold" fill="#5D4037" font-family="Noto Sans Bengali,serif">${birthNak}</text>`;
        svg += `<text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="10" fill="#888" font-family="Noto Sans Bengali,serif">জন্মনক্ষত্র</text>`;
        svg += `<text x="${cx}" y="${cy+22}" text-anchor="middle" font-size="9" fill="#5D4037" font-family="Noto Sans Bengali,serif">${bi+1}তম</text>`;
        const ly2 = cy + outerR + 45;
        [{col:'#FFD700',label:'জন্মনক্ষত্র'},{col:'#fff0f0',stroke:'#e09090',label:'অশুভ তারা'},{col:'#f0fff4',stroke:'#90c098',label:'শুভ তারা'},{col:'#faf7f0',stroke:'#c9b07a',label:'নিরপেক্ষ'}]
        .forEach((it, idx) => {
            const ix = 30 + idx * 140;
            svg += `<rect x="${ix}" y="${ly2-10}" width="14" height="14" fill="${it.col}" stroke="${it.stroke||'#c9b07a'}" stroke-width="1"/>`;
            svg += `<text x="${ix+18}" y="${ly2+2}" font-size="10" fill="#555" font-family="Noto Sans Bengali,serif">${it.label}</text>`;
        });
        svg += `</svg>`;
        return svg;
    }

    getNavaTaraPrediction(birthNak, birthPlanets = {}) {
        if (!Object.keys(birthPlanets).length) return '';
        const bi = this.nakshatras.indexOf(birthNak);
        if (bi === -1) return '';
        const EFF = {
            "জন্ম":      {t:"নিরপেক্ষ", msg:"স্বাস্থ্য ও ব্যক্তিত্বে প্রভাব — মিশ্র ফল দেয়।"},
            "সম্পদ":     {t:"শুভ",       msg:"ধন-সম্পদ, আর্থিক লাভ ও সুখ বৃদ্ধি করে।"},
            "বিপৎ":      {t:"অশুভ",      msg:"বিপদ, বাধা, অসুস্থতা ও শত্রুবৃদ্ধি পায়।"},
            "ক্ষেম":     {t:"শুভ",       msg:"সুখ, শান্তি ও পারিবারিক মঙ্গল প্রদান করে।"},
            "প্রত্যরি":  {t:"অশুভ",      msg:"শত্রুতা, বিবাদ ও মানসিক অশান্তি দেয়।"},
            "সাধক":      {t:"শুভ",       msg:"কার্যসিদ্ধি, উন্নতি ও সাফল্য প্রদান করে।"},
            "নিধন":      {t:"অশুভ",      msg:"ক্ষতি, গুরুতর বিপদ ও মৃত্যুভয় সৃষ্টি করে।"},
            "মিত্র":     {t:"শুভ",       msg:"বন্ধুত্ব, সহযোগিতা ও সাফল্য আনে।"},
            "অতিমিত্র": {t:"শুভ",       msg:"মহাশুভ — সর্বোচ্চ সাফল্য ও সমৃদ্ধি দেয়।"}
        };
        let html = `<div style="overflow-x:auto;margin:16px 0"><h3 style="text-align:center;color:#5D4037;margin-bottom:6px">📊 নবতারা গ্রহ বিশ্লেষণ</h3>
<p style="text-align:center;font-size:.88rem;color:#666;margin-bottom:10px">জন্মনক্ষত্র <strong>${birthNak}</strong> থেকে প্রতিটি গ্রহের তারা অবস্থান</p>
<table style="width:100%;border-collapse:collapse;font-size:.85rem">
<thead><tr style="background:#5D4037;color:#fff">
<th style="padding:8px 6px">গ্রহ</th><th style="padding:8px 6px">নক্ষত্র</th><th style="padding:8px 6px">তারা</th>
<th style="padding:8px 6px">প্রভাব</th><th style="padding:8px 6px">ফলাদেশ</th>
</tr></thead><tbody>`;
        for (const [planet, nak] of Object.entries(birthPlanets)) {
            const ni = this.nakshatras.indexOf(nak);
            if (ni === -1) continue;
            const dist = (ni - bi + 27) % 27, taraName = this.taraNames[dist % 9];
            const ti = this.taraIcons[taraName], eff = EFF[taraName] || {};
            const bad = eff.t === 'অশুভ', neu = eff.t === 'নিরপেক্ষ';
            const bg = bad ? '#fff5f5' : neu ? '#fffdf0' : '#f5fff8';
            const col = bad ? '#c62828' : neu ? '#8B6914' : '#2e7d32';
            html += `<tr style="background:${bg};border-bottom:1px solid #e8d5c0">
<td style="padding:7px 6px;font-weight:700;color:${col}">${planet}</td>
<td style="padding:7px 6px;color:#5D4037;font-weight:600">${nak}</td>
<td style="padding:7px 6px;text-align:center">${ti.icon} ${taraName}</td>
<td style="padding:7px 6px;text-align:center;font-weight:bold;color:${col}">${bad?'⚠️ অশুভ':neu?'🔸 নিরপেক্ষ':'✅ শুভ'}</td>
<td style="padding:7px 6px;color:${col};font-size:.82rem">${eff.msg||''}</td>
</tr>`;
        }
        html += `</tbody></table></div>`;
        return html;
    }

    renderAll(birthNak, containerId, transitNaks, birthPlanets) {
        const c = document.getElementById(containerId);
        if (!c) return;
        const bp = birthPlanets || {};
        let html = '<div style="text-align:center;overflow-x:auto;margin:20px 0;">' + this.getNavaTaraChakraSVG(birthNak, bp) + '</div>';
        html += this.getNavaTaraPrediction(birthNak, bp);
        html += '<hr style="margin:30px 0;">';
        html += this.getTaraTableHTML(birthNak);
        html += '<hr style="margin:30px 0;">';
        html += this.getTriIpapaTableHTML(birthNak);
        if (typeof ShannadiChakraEngine === 'function') {
            try {
                html += '<hr style="margin:30px 0;">';
                const eng = new ShannadiChakraEngine();
                html += eng.getShannadiTableHTML(birthNak, transitNaks || {}, bp);
            } catch(e) { console.warn('ShannadiChakraEngine error:', e); }
        }
        c.innerHTML = html;
    }
}

// ============================================================
// ষণ্ণাড়ী চক্র (6 Nadi Chakra) ইঞ্জিন
// Vedic Astrology | Transit Impact on 6 Nadis
// ============================================================
class ShannadiChakraEngine {
    constructor() {
        this.nakshatras = [
            "অশ্বিনী","ভরণী","কৃত্তিকা","রোহিণী","মৃগশিরা","আর্দ্রা",
            "পুনর্বসু","পুষ্যা","অশ্লেষা","মঘা","পূর্বফাল্গুনী","উত্তরফাল্গুনী",
            "হস্তা","চিত্রা","স্বাতী","বিশাখা","অনুরাধা","জ্যেষ্ঠা",
            "মূলা","পূর্বাষাঢ়া","উত্তরাষাঢ়া","শ্রবণা","ধনিষ্ঠা","শতভিষা",
            "পূর্বভাদ্রপদ","উত্তরভাদ্রপদ","রেবতী"
        ];
        this.nadiRules = {
            "জন্মনাড়ী": 1,
            "কর্মনাড়ী": 10,
            "সাংঘাতিক নাড়ী": 16,
            "সমুদয় নাড়ী": 18,
            "বিনাশ নাড়ী": 23,
            "মানস নাড়ী": 25
        };
        this.nadiDescriptions = {
            "জন্মনাড়ী":      { area: "শরীর ও স্বাস্থ্য",        badEffect: "দেহকষ্ট, পারিবারিক ঝঞ্ঝাট, গৃহে অশান্তি।",                                  icon: "🏥" },
            "কর্মনাড়ী":      { area: "কর্ম ও পেশা",             badEffect: "কর্মহানি, অর্থনাশ, চাকরিতে পদাবনতি।",                                       icon: "💼" },
            "সাংঘাতিক নাড়ী": { area: "বিপদ ও সংকট",             badEffect: "দুর্ঘটনা, শত্রুবৃদ্ধি, মামলা ও বন্ধনভয়।",                                   icon: "⚠️" },
            "সমুদয় নাড়ী":   { area: "সহযোগী ও পরিবেশ",          badEffect: "দুঃখ, শোক, উন্নতিতে বাধা, লোকনিন্দা।",                                     icon: "👥" },
            "বিনাশ নাড়ী":   { area: "কাজের বিনাশ",              badEffect: "কঠিন পীড়া, স্বজনবিয়োগ, সর্বনাশ।",                                          icon: "💀" },
            "মানস নাড়ী":    { area: "মানসিকতা ও মন",            badEffect: "মানসিক অশান্তি, আশাভঙ্গ, বন্ধুবিচ্ছেদ।",                                    icon: "🧠" }
        };
        this.papaGrahas = ["শনি","রাহু","কেতু","মঙ্গল","সূর্য"];
    }

    getShannadiChakra(birthNakshatra) {
        const bi = this.nakshatras.indexOf(birthNakshatra);
        if (bi === -1) return { error: "নক্ষত্র সঠিক নয়" };
        const chakra = {};
        for (const [name, rule] of Object.entries(this.nadiRules)) {
            const idx = (bi + rule - 1) % 27;
            chakra[name] = { nakshatra: this.nakshatras[idx], index: idx + 1, ...this.nadiDescriptions[name] };
        }
        chakra["জন্ম_নক্ষত্র"] = birthNakshatra;
        return chakra;
    }

    checkTransitImpact(birthNakshatra, transitPlanets = {}) {
        const chakra = this.getShannadiChakra(birthNakshatra);
        if (chakra.error) return chakra;
        const impacts = [];
        for (const [planet, transitNak] of Object.entries(transitPlanets)) {
            if (!this.papaGrahas.includes(planet)) continue;
            for (const [nadiName, nadiData] of Object.entries(chakra)) {
                if (nadiName === "জন্ম_নক্ষত্র") continue;
                if (nadiData.nakshatra === transitNak) {
                    impacts.push({
                        planet, nadiName, nadiData,
                        severity: (planet === "শনি" || planet === "রাহু") ? "তীব্র" :
                                  (planet === "মঙ্গল" || planet === "কেতু") ? "মধ্যম" : "সামান্য"
                    });
                }
            }
        }
        return { chakra, impacts, hasImpact: impacts.length > 0 };
    }

    getShannadiTableHTML(birthNakshatra, transitPlanets = {}, birthPlanets = {}) {
        const result = this.checkTransitImpact(birthNakshatra, transitPlanets);
        if (result.error) return `<p>${result.error}</p>`;
        const impactedNadis = {};
        result.impacts.forEach(imp => {
            if (!impactedNadis[imp.nadiName]) impactedNadis[imp.nadiName] = [];
            impactedNadis[imp.nadiName].push(imp.planet);
        });
        const hasTransit = Object.keys(transitPlanets).length > 0;

        // SVG nadi center positions (inside the triangular sections)
        const NADI_POS = {
            "কর্মনাড়ী":       {x:250,y:230},
            "সাংঘাতিক নাড়ী": {x:550,y:230},
            "মানস নাড়ী":      {x:650,y:340},
            "জন্মনাড়ী":       {x:150,y:340},
            "বিনাশ নাড়ী":    {x:550,y:450},
            "সমুদয় নাড়ী":   {x:250,y:450}
        };
        const PLANET_COL = {
            "সূর্য":"#FF6B35","চন্দ্র":"#4169E1","মঙ্গল":"#DC143C","বুধ":"#2E8B57",
            "বৃহস্পতি":"#DAA520","শুক্র":"#C71585","শনি":"#4B0082","রাহু":"#2F4F4F","কেতু":"#8B4513"
        };
        const PLANET_SH = {
            "সূর্য":"রবি","চন্দ্র":"চন্দ্র","মঙ্গল":"মঙ্গ","বুধ":"বুধ",
            "বৃহস্পতি":"বৃহ","শুক্র":"শুক্র","শনি":"শনি","রাহু":"রাহু","কেতু":"কেতু"
        };

        // Collect all planets (transit + birth) per nadi
        const nadiPlanets = {}; // nadiName → [{planet, isTransit}]
        for (const [nadiName, nadiData] of Object.entries(result.chakra)) {
            if (nadiName === "জন্ম_নক্ষত্র") continue;
            // transit planets already in impactedNadis; add birth planets
            const allForNadi = [];
            (impactedNadis[nadiName] || []).forEach(p => allForNadi.push({p, transit: true}));
            for (const [pl, nak] of Object.entries(birthPlanets)) {
                if (nak === nadiData.nakshatra) allForNadi.push({p: pl, transit: false});
            }
            if (allForNadi.length) nadiPlanets[nadiName] = allForNadi;
        }

        // ষড়নাড়ী চক্র SVG with planet markers
        let svgBody = ``;
        for (const [nadiName, plList] of Object.entries(nadiPlanets)) {
            const pos = NADI_POS[nadiName];
            if (!pos) continue;
            plList.forEach(({p, transit}, idx) => {
                const offX = (idx - (plList.length - 1) / 2) * 38;
                const col = PLANET_COL[p] || '#888', sn = PLANET_SH[p] || p.substring(0,2);
                const px = pos.x + offX, py = pos.y + 36;
                svgBody += `<circle cx="${px}" cy="${py}" r="17" fill="${col}" opacity="0.9" stroke="${transit?'#fff':'#FFD700'}" stroke-width="${transit?1.5:3}"/>`;
                svgBody += `<text x="${px}" y="${py}" text-anchor="middle" font-size="9" fill="#fff" font-weight="bold" font-family="Noto Sans Bengali,serif" dy="0.35em">${sn}</text>`;
            });
        }

        let html = `<div style="text-align:center;margin-bottom:20px;overflow-x:auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 580" width="100%" style="max-width:700px">
  <defs>
    <filter id="shad" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="800" height="580" fill="#FDF8F5"/>
  <rect x="15" y="15" width="770" height="550" fill="none" stroke="#E6D5C3" stroke-width="1.5"/>
  <rect x="20" y="20" width="760" height="540" fill="none" stroke="#E6D5C3" stroke-width="0.5"/>
  <text x="400" y="70" font-family="'Noto Sans Bengali','SolaimanLipi',sans-serif" font-size="46" font-weight="bold" fill="#DAA520" stroke="#5C4033" stroke-width="1.5" text-anchor="middle" filter="url(#shad)">ষড়নাড়ী চক্র</text>
  <line x1="260" y1="90" x2="540" y2="90" stroke="#8D6E63" stroke-width="2"/>
  <polygon points="260,90 255,86 250,90 255,94" fill="#8D6E63"/>
  <polygon points="540,90 545,86 550,90 545,94" fill="#8D6E63"/>
  <g stroke="#B28D67" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="100" y="130" width="600" height="400"/>
    <line x1="100" y1="130" x2="400" y2="530"/>
    <line x1="100" y1="530" x2="400" y2="130"/>
    <line x1="400" y1="130" x2="700" y2="530"/>
    <line x1="400" y1="530" x2="700" y2="130"/>
  </g>
  <g font-family="'Noto Sans Bengali','SolaimanLipi',sans-serif" font-size="28" font-weight="bold" fill="#C21E56" text-anchor="middle">
    <text x="250" y="230">কর্ম</text>
    <text x="550" y="230">সাংঘাতিক</text>
    <text x="650" y="340">মানস</text>
    <text x="150" y="340">জন্ম</text>
    <text x="550" y="450">বিনাশ</text>
    <text x="250" y="450">সমুদয়</text>
  </g>
  ${svgBody}
  <text x="120" y="565" font-family="'Noto Sans Bengali',sans-serif" font-size="11" fill="#888">⚪ সাদা বর্ডার = গোচর গ্রহ &nbsp;&nbsp; 🟡 সোনালি বর্ডার = জন্মগ্রহ</text>
</svg></div>`;

        html += `<div style="overflow-x:auto;margin:16px 0">
<h3 style="text-align:center;color:#5D4037;margin-bottom:4px">🔮 ষণ্ণাড়ী চক্র — নক্ষত্র তালিকা</h3>
<p style="text-align:center;font-size:.88rem;color:#666;margin-bottom:10px">জন্মনক্ষত্র: <strong>${birthNakshatra}</strong>${hasTransit ? ' | বর্তমান গোচর পাপগ্রহ বিশ্লেষণ' : ''}</p>
<table style="width:100%;border-collapse:collapse;font-size:.85rem">
<thead><tr style="background:#5D4037;color:#fff">
  <th style="padding:8px 6px">নাড়ী</th><th style="padding:8px 6px">নক্ষত্র</th><th style="padding:8px 6px">ক্রম</th><th style="padding:8px 6px">বিষয়</th>
  ${hasTransit ? '<th style="padding:8px 6px">পাপগ্রহ</th><th style="padding:8px 6px">অবস্থা</th>' : ''}
</tr></thead><tbody>`;

        for (const [name, data] of Object.entries(result.chakra)) {
            if (name === "জন্ম_নক্ষত্র") continue;
            const planetsHere = impactedNadis[name] || [];
            const hasImpact = planetsHere.length > 0;
            const bg = hasImpact ? '#FFF5F5' : (Object.keys(impactedNadis).length % 2 === 0 ? '#fff' : '#fefcf9');
            html += `<tr style="background:${bg};border-bottom:1px solid #e8d5c0">
  <td style="padding:7px 6px;font-weight:700">${data.icon} ${name}</td>
  <td style="padding:7px 6px;font-weight:700;color:#5D4037">${data.nakshatra}</td>
  <td style="padding:7px 6px;text-align:center">${data.index}তম</td>
  <td style="padding:7px 6px;color:#555">${data.area}</td>
  ${hasTransit ? `<td style="padding:7px 6px;color:${hasImpact?'#c62828':'#888'};font-weight:bold;text-align:center">${hasImpact?planetsHere.join(', '):'—'}</td>
  <td style="padding:7px 6px;font-weight:bold;text-align:center;color:${hasImpact?'#c62828':'#2e7d32'}">${hasImpact?'⚠️ অশুভ':'✅ শুদ্ধ'}</td>` : ''}
</tr>`;
        }

        html += `</tbody></table>`;

        if (hasTransit) {
            if (result.hasImpact) {
                html += `<div style="margin-top:12px;padding:12px;background:#FFF5F5;border-left:4px solid #c62828;border-radius:6px;font-size:.87rem">
<strong style="color:#c62828">⚠️ গোচর পাপগ্রহের প্রভাব:</strong><br>`;
                result.impacts.forEach(imp => {
                    html += `<span style="color:#c62828">●</span> <strong>${imp.nadiName}</strong> (${imp.nadiData.nakshatra}) — <strong>${imp.planet}</strong> [${imp.severity}]: ${imp.nadiData.badEffect}<br>`;
                });
                html += `</div>`;
            } else {
                html += `<div style="margin-top:12px;padding:12px;background:#E8F5E9;border-left:4px solid #2e7d32;border-radius:6px;font-size:.87rem">✅ এই মুহূর্তে কোনো পাপগ্রহ ষণ্ণাড়ীতে নেই — সময় তুলনামূলক শুভ।</div>`;
            }
        }

        html += `<p style="margin-top:10px;font-size:.82rem;color:#888;text-align:center">🕉️ ষণ্ণাড়ী চক্র — গোচরে পাপগ্রহের ট্রানজিটজনিত অশুভ প্রভাব নির্ণয়ের জন্য ব্যবহৃত</p></div>`;
        return html;
    }
}

/**
 * ============================================================
 * life-predictions.js (DETAILED VERSION)
 * Education, Career, Marriage, Fortune — Philosophical & Expanded
 * Language: Bengali (বাংলা) | Deep & Elaborate
 * ============================================================
 */

class LifePredictionEngine {
    constructor() {
        this.planetRelations = {
            "সূর্য": { friends: ["চন্দ্র","মঙ্গল","বৃহস্পতি"], enemies: ["শুক্র","শনি"] },
            "চন্দ্র": { friends: ["সূর্য","বুধ"], enemies: ["শুক্র","শনি"] },
            "মঙ্গল": { friends: ["সূর্য","চন্দ্র","বৃহস্পতি"], enemies: ["বুধ","শুক্র","শনি"] },
            "বুধ": { friends: ["সূর্য","শুক্র"], enemies: ["চন্দ্র"] },
            "বৃহস্পতি": { friends: ["সূর্য","চন্দ্র","মঙ্গল"], enemies: ["বুধ","শুক্র"] },
            "শুক্র": { friends: ["বুধ","শনি"], enemies: ["সূর্য","চন্দ্র"] },
            "শনি": { friends: ["বুধ","শুক্র"], enemies: ["সূর্য","চন্দ্র","মঙ্গল"] }
        };

        this.signs = ["মেষ","বৃষ","মিথুন","কর্কট","সিংহ","কন্যা","তুলা","বৃশ্চিক","ধনু","মকর","কুম্ভ","মীন"];
        this.signLords = {"মেষ":"মঙ্গল","বৃষ":"শুক্র","মিথুন":"বুধ","কর্কট":"চন্দ্র","সিংহ":"সূর্য","কন্যা":"বুধ","তুলা":"শুক্র","বৃশ্চিক":"মঙ্গল","ধনু":"বৃহস্পতি","মকর":"শনি","কুম্ভ":"শনি","মীন":"বৃহস্পতি"};
        this.exalted = {"সূর্য":"মেষ","চন্দ্র":"বৃষ","মঙ্গল":"মকর","বুধ":"কন্যা","বৃহস্পতি":"কর্কট","শুক্র":"মীন","শনি":"তুলা"};
        this.debilitated = {"সূর্য":"তুলা","চন্দ্র":"বৃশ্চিক","মঙ্গল":"কর্কট","বুধ":"মীন","বৃহস্পতি":"মকর","শুক্র":"কন্যা","শনি":"মেষ"};
    }

    getHouseSign(lagnaSign, house) { const li = this.signs.indexOf(lagnaSign); return li === -1 ? null : this.signs[(li + house - 1) % 12]; }
    getSignLord(sign) { return this.signLords[sign] || null; }
    getHouse(planetSign, lagnaSign) { const pi = this.signs.indexOf(planetSign); const li = this.signs.indexOf(lagnaSign); return (pi === -1 || li === -1) ? 0 : ((pi - li + 12) % 12) + 1; }
    areFriends(p1, p2) { return p1 === p2 || this.planetRelations[p1]?.friends?.includes(p2) || false; }
    areEnemies(p1, p2) { return this.planetRelations[p1]?.enemies?.includes(p2) || false; }

    getPlanetScore(planetName, chartData) {
        const p = chartData.planets?.find(pl => pl.name === planetName);
        if (!p) return 0;
        let score = 0;
        if ([1,4,5,7,9,10].includes(p.house)) score += 2;
        else if ([6,8,12].includes(p.house)) score -= 2;
        if (this.exalted[planetName] === p.rashi) score += 3;
        else if (this.debilitated[planetName] === p.rashi) score -= 3;
        return score;
    }

    // ==================== ১. পড়াশোনা ====================
    analyzeEducation(chartData) {
        const lagna = chartData.lagna;
        const planets = chartData.planets;
        if (!lagna || !planets) return null;

        const fifthLord = this.getSignLord(this.getHouseSign(lagna.rashi, 5));
        const ninthLord = this.getSignLord(this.getHouseSign(lagna.rashi, 9));
        const fourthLord = this.getSignLord(this.getHouseSign(lagna.rashi, 4));
        const secondLord = this.getSignLord(this.getHouseSign(lagna.rashi, 2));

        const fifthLordPlanet = planets.find(p => p.name === fifthLord);
        const ninthLordPlanet = planets.find(p => p.name === ninthLord);
        const mercury = planets.find(p => p.name === "বুধ");
        const jupiter = planets.find(p => p.name === "বৃহস্পতি");
        const moon = planets.find(p => p.name === "চন্দ্র");

        let score = 0;
        const goodLords = ["বৃহস্পতি", "বুধ", "শুক্র", "চন্দ্র"];
        const badLords = ["শনি", "মঙ্গল", "রাহু", "কেতু"];

        if (goodLords.includes(fifthLord)) score += 3; else if (badLords.includes(fifthLord)) score -= 1;
        if (goodLords.includes(ninthLord)) score += 3; else if (badLords.includes(ninthLord)) score -= 1;
        if (this.areFriends(fifthLord, ninthLord)) score += 2;
        if (this.areEnemies(fifthLord, ninthLord)) score -= 2;
        score += this.getPlanetScore("বুধ", chartData);
        score += this.getPlanetScore("বৃহস্পতি", chartData);
        score += this.getPlanetScore("চন্দ্র", chartData);

        const fifthHousePlanets = planets.filter(p => p.house === 5);
        const ninthHousePlanets = planets.filter(p => p.house === 9);
        const fourthHousePlanets = planets.filter(p => p.house === 4);

        for (const pp of fifthHousePlanets) { if (["রাহু","শনি","মঙ্গল","কেতু"].includes(pp.name)) score -= 1; else score += 1; }
        for (const pp of ninthHousePlanets) { if (["রাহু","শনি","মঙ্গল","কেতু"].includes(pp.name)) score -= 1; else score += 1; }
        for (const pp of fourthHousePlanets) { if (["রাহু","শনি","মঙ্গল","কেতু"].includes(pp.name)) score -= 1; }

        const dasha = chartData.dashaInfo?.currentMD;
        if (dasha && [fifthLord, ninthLord, "বুধ", "বৃহস্পতি"].includes(dasha.lord)) score += 2;

        // বিস্তারিত প্রেডিকশন
        let level = "", prediction = "";

        if (score >= 10) {
            level = "অসাধারণ";
            prediction = `আপনার কুষ্ঠিতে বিদ্যা ও উচ্চশিক্ষার যোগ অত্যন্ত প্রবল ও সুদৃঢ়। পঞ্চম ভাবের অধিপতি ${fifthLord} এবং নবম ভাবের অধিপতি ${ninthLord}—এই দুই গ্রহই আপনার জ্ঞানার্জনের পথে সহায়ক শক্তি হিসেবে দাঁড়িয়ে আছে। পঞ্চম পতি ${fifthLord} ${fifthLordPlanet ? (fifthLordPlanet.house + 'ম ভাবে অবস্থান করছেন, যা আপনার বুদ্ধিবৃত্তির বিকাশে সহায়ক।') : 'আপনার বুদ্ধির কারক হিসেবে কাজ করছেন।'} নবম পতি ${ninthLord} ${ninthLordPlanet ? (ninthLordPlanet.house + 'ম ভাবে আছেন—এটি উচ্চশিক্ষা ও ভাগ্যকে সংযুক্ত করছে।') : 'উচ্চশিক্ষার দ্বার উন্মুক্ত করছেন।'}

বুধ আপনার বুদ্ধির গ্রহ—${mercury ? (mercury.house + 'ম ভাবে ' + mercury.rashi + ' রাশিতে অবস্থান করছে।') : 'আপনার চিন্তাশক্তিকে প্রখর করছে।'} ${this.exalted["বুধ"] === mercury?.rashi ? 'বুধ তুঙ্গস্থ কন্যা রাশিতে—এটি আপনার বুদ্ধিমত্তাকে চরম শিখরে পৌঁছে দিয়েছে। আপনি যেকোনো বিষয় সহজেই আয়ত্ত করতে পারেন, জটিল তত্ত্বও আপনার কাছে জলভাত।' : ''} ${this.debilitated["বুধ"] === mercury?.rashi ? 'তবে বুধ নীচস্থ মীন রাশিতে—পড়ায় কিছুটা অস্থিরতা আসতে পারে, কিন্তু চেষ্টা করলে তা কাটিয়ে উঠবেন।' : ''}

বৃহস্পতি জ্ঞানের গ্রহ—${jupiter ? (jupiter.house + 'ম ভাবে ' + jupiter.rashi + ' রাশিতে আছেন।') : 'আপনার জ্ঞানপিপাসা জাগ্রত করছেন।'} ${this.exalted["বৃহস্পতি"] === jupiter?.rashi ? 'বৃহস্পতি তুঙ্গস্থ কর্কট রাশিতে—এটি পরম শুভ লক্ষণ। উচ্চশিক্ষা, গবেষণা ও বিদেশে পড়াশোনার পথ সম্পূর্ণ উন্মুক্ত।' : ''}

চন্দ্র আপনার মনের গ্রহ—${moon ? (moon.house + 'ম ভাবে আছেন।') : ''} ${moon && [1,4,5,7,9,10].includes(moon.house) ? 'চন্দ্র শুভ ভাবে থাকায় আপনার মন পড়াশোনায় স্থির থাকবে।' : 'চন্দ্র দুঃস্থানে থাকায় মাঝেমধ্যে পড়ায় মন বসাতে কষ্ট হতে পারে—তবে অভ্যাসে সবকিছু ঠিক হবে।'}

${dasha && [fifthLord, ninthLord, "বুধ", "বৃহস্পতি"].includes(dasha.lord) ? `বর্তমানে আপনার ${dasha.lord} মহাদশা চলছে—যা শিক্ষার পক্ষে অত্যন্ত অনুকূল। এই দশায় আপনি উচ্চশিক্ষায় বড় সাফল্য পাবেন।` : ''}

আপনি উচ্চশিক্ষায় অসামান্য সাফল্য পাবেন—গবেষণা, বিদেশে পড়াশোনা বা বৃত্তি লাভের সম্ভাবনা প্রবল। আপনার জ্ঞান শুধু ডিগ্রির জন্য নয়, সত্যিকারের বোধির জন্য—এই আপনার জীবনের সবচেয়ে বড় প্রাপ্তি। পঞ্চম ভাবের গ্রহগুলো আপনার সৃজনশীলতাকে জাগ্রত করবে, আর নবম ভাব আপনাকে দেবে দিশা। মনে রাখবেন—যে জ্ঞান অন্যের কল্যাণে লাগে, সেই জ্ঞানই প্রকৃত বিদ্যা।`;
        } else if (score >= 6) {
            level = "ভালো";
            prediction = `আপনার পড়াশোনার যোগ ভালো ও আশাপ্রদ। পঞ্চম পতি ${fifthLord} এবং নবম পতি ${ninthLord}—উভয়ের অবস্থান মোটামুটি শুভ, তবে কিছুটা চ্যালেঞ্জও আছে। ${fifthLordPlanet ? (fifthLordPlanet.house + 'ম ভাবে পঞ্চম পতি থাকায় আপনার বুদ্ধির বিকাশ স্বাভাবিক গতিতে হবে।') : ''} ${ninthLordPlanet ? ('নবম পতি ' + ninthLordPlanet.house + 'ম ভাবে থাকায় উচ্চশিক্ষার পথ প্রশস্ত হলেও, তার জন্য পরিশ্রম করতে হবে।') : ''}

${mercury ? ('বুধ আপনার ' + mercury.house + 'ম ভাবে ' + mercury.rashi + ' রাশিতে—এটি আপনার চিন্তাশক্তিকে শানিত করছে।') : ''} ${jupiter ? ('বৃহস্পতি ' + jupiter.house + 'ম ভাবে—জ্ঞানের পথ দেখাচ্ছেন, তবে কিছুটা ধীর গতিতে।') : ''}

আপনি দেশের ভালো প্রতিষ্ঠান থেকে ডিগ্রি লাভের সম্ভাবনা আছে। বিদেশে পড়ার সুযোগ এলে তাও গ্রহণ করতে পারেন—কিন্তু তা কিছুটা চ্যালেঞ্জিং হবে। ${dasha && [fifthLord, ninthLord, "বুধ", "বৃহস্পতি"].includes(dasha.lord) ? 'বর্তমান দশা শিক্ষার পক্ষে সহায়ক—এই সময়টার সদ্ব্যবহার করুন।' : 'বর্তমান দশা শিক্ষার জন্য বিশেষ সহায়ক নয়—তবে চেষ্টা চালিয়ে যান।'}

মনে রাখবেন—যে ফুল ধীরে ফোটে, তার ঘ্রাণ সবচেয়ে মিষ্টি হয়। যে বিদ্যা অর্জিত হয় পরিশ্রমে, তার মূল্য অপরিসীম। আপনার জ্ঞানার্জনের পথ বাধামুক্ত নয়, কিন্তু অসম্ভবও নয়। পড়াশোনার পাশাপাশি ব্যবহারিক জ্ঞানও অর্জন করুন—দুটোই আপনাকে সফল করবে।`;
        } else if (score >= 3) {
            level = "মধ্যম";
            prediction = `আপনার শিক্ষাজীবনে কিছু ওঠাপড়া থাকবে। পঞ্চমপতি ${fifthLord} বা নবমপতি ${ninthLord} কিছুটা দুর্বল অবস্থানে থাকায় পড়াশোনায় বাধা আসতে পারে। ${fifthLordPlanet ? (fifthLordPlanet.house + 'ম ভাবে পঞ্চম পতি থাকায় বুদ্ধির বিকাশে বাধা আসতে পারে।') : ''} ${ninthLordPlanet ? ('নবম পতি ' + ninthLordPlanet.house + 'ম ভাবে—উচ্চশিক্ষার পথ সুগম নয়, চেষ্টা করতে হবে।') : ''}

${fifthHousePlanets.filter(p => ["রাহু","শনি","মঙ্গল","কেতু"].includes(p.name)).length > 0 ? 'পঞ্চম ভাবে পাপগ্রহ থাকায় পড়ায় মনোযোগের অভাব বা বাধা আসতে পারে।' : ''} ${ninthHousePlanets.filter(p => ["রাহু","শনি","মঙ্গল","কেতু"].includes(p.name)).length > 0 ? 'নবম ভাবে পাপগ্রহ থাকায় উচ্চশিক্ষায় বিঘ্ন ঘটতে পারে।' : ''}

তবে এটি অসম্ভব নয়—চেষ্টা ও অধ্যবসায় দিয়ে আপনি সফল হবেন। পেশাদারি কোর্স, ডিপ্লোমা বা ভোকেশনাল ট্রেনিং আপনার জন্য বেশি উপযোগী হতে পারে। তাত্ত্বিক পড়াশোনার চেয়ে হাতেকলমে শেখা আপনার পক্ষে ভালো ফল দেবে। মনে রাখবেন—শিক্ষা শুধু বইয়ের পাতায় নয়, জীবনেও হয়। যে নদী পাহাড় ডিঙিয়ে আসে, তার স্রোত সবচেয়ে শক্তিশালী হয়—আপনার সংগ্রামই হোক আপনার শক্তি।`;
        } else {
            level = "চ্যালেঞ্জিং";
            prediction = `আপনার কুষ্ঠিতে উচ্চশিক্ষার পথ কিছুটা কঠিন ও চ্যালেঞ্জিং। পঞ্চম ও নবম ভাবের অধিপতি দুর্বল অবস্থানে থাকায়, এবং পাপগ্রহের প্রভাবে পড়াশোনায় বিঘ্ন আসতে পারে। ${fifthLordPlanet ? ('পঞ্চম পতি ' + fifthLordPlanet.house + 'ম ভাবে—দুর্বল অবস্থানে।') : ''} ${ninthLordPlanet ? ('নবম পতি ' + ninthLordPlanet.house + 'ম ভাবে—উচ্চশিক্ষার পথ রুদ্ধ।') : ''}

${fifthHousePlanets.length > 0 ? 'পঞ্চম ভাবে পাপগ্রহের প্রভাবে মন অস্থির থাকবে, পড়ায় বসতে কষ্ট হবে।' : ''} ${ninthHousePlanets.length > 0 ? 'নবম ভাবেও অশুভ প্রভাব—উচ্চশিক্ষার পরিকল্পনা বাধাগ্রস্ত হতে পারে।' : ''} ${fourthHousePlanets.length > 0 ? 'চতুর্থ ভাবেও পাপগ্রহ—পড়ার পরিবেশও অনুকূল নয়।' : ''}

কিন্তু হাল ছাড়বেন না। ব্যবহারিক জ্ঞান, হাতেকলমে শিক্ষা বা কারিগরি প্রশিক্ষণের দিকে ঝুঁকুন—সেখানেই আপনার সাফল্য লুকিয়ে আছে। তাত্ত্বিক ডিগ্রির পেছনে না ছুটে, দক্ষতা অর্জন করুন। ${dasha && ["শনি","মঙ্গল"].includes(dasha.lord) ? 'বর্তমান দশা কঠিন—কিন্তু এই সময়ই আপনাকে পরিণত করবে।' : ''}

মনে রাখবেন—অ্যালবার্ট আইনস্টাইন স্কুলে ফেল করেছিলেন, স্টিভ জবস কলেজ ড্রপআউট ছিলেন। শিক্ষা প্রতিষ্ঠানের গ্রেড কখনো মানুষের প্রকৃত মূল্য নির্ধারণ করে না। আপনার লড়াই, আপনার চেষ্টা—সেটাই আপনার প্রকৃত শিক্ষা।`;
        }

        return { area: "পড়াশোনা", level, score, prediction };
    }

    // ==================== ২. কর্ম ====================
    analyzeCareer(chartData) {
        const lagna = chartData.lagna;
        const planets = chartData.planets;
        if (!lagna || !planets) return null;

        const tenthLord = this.getSignLord(this.getHouseSign(lagna.rashi, 10));
        const sixthLord = this.getSignLord(this.getHouseSign(lagna.rashi, 6));
        const secondLord = this.getSignLord(this.getHouseSign(lagna.rashi, 2));
        const eleventhLord = this.getSignLord(this.getHouseSign(lagna.rashi, 11));

        const tenthLordPlanet = planets.find(p => p.name === tenthLord);
        const tenthHousePlanets = planets.filter(p => p.house === 10);
        const sun = planets.find(p => p.name === "সূর্য");
        const saturn = planets.find(p => p.name === "শনি");
        const mars = planets.find(p => p.name === "মঙ্গল");

        let score = 0;
        score += this.getPlanetScore(tenthLord, chartData);
        score += this.getPlanetScore("সূর্য", chartData);
        score += this.getPlanetScore("শনি", chartData);
        if ([1,4,5,7,9,10].includes(tenthLordPlanet?.house || 0)) score += 3;
        if ([6,8,12].includes(tenthLordPlanet?.house || 0)) score -= 3;

        let careerType = "";
        const sun10 = planets.find(p => p.name === "সূর্য" && p.house === 10);
        const sat10 = planets.find(p => p.name === "শনি" && p.house === 10);
        const mer10 = planets.find(p => p.name === "বুধ" && p.house === 10);
        const mar10 = planets.find(p => p.name === "মঙ্গল" && p.house === 10);
        const ven10 = planets.find(p => p.name === "শুক্র" && p.house === 10);
        const jup10 = planets.find(p => p.name === "বৃহস্পতি" && p.house === 10);

        if (sun10) careerType = "সরকারি চাকরি, প্রশাসনিক পদ, রাজনীতি, নেতৃত্বমূলক কাজ ও উচ্চপদস্থ অফিসার";
        else if (sat10) careerType = "ইঞ্জিনিয়ারিং, নির্মাণ শিল্প, খনি, আইন, বিচারক, দীর্ঘমেয়াদী প্রশাসনিক চাকরি";
        else if (mer10) careerType = "ব্যবসা-বাণিজ্য, লেখালেখি, সাংবাদিকতা, পরামর্শদাতা, আইটি, অ্যাকাউন্টিং, কূটনীতি";
        else if (mar10) careerType = "সেনাবাহিনী, পুলিশ, খেলাধুলা, সার্জন, ইঞ্জিনিয়ারিং, অগ্নিনির্বাপক, ক্রীড়া প্রশিক্ষক";
        else if (ven10) careerType = "শিল্পকলা, সঙ্গীত, ফ্যাশন ডিজাইন, বিলাসদ্রব্য, কূটনীতি, হোটেল ব্যবসা, বিউটি ইন্ডাস্ট্রি";
        else if (jup10) careerType = "শিক্ষকতা, ধর্মগুরু, আইন, ব্যাংকিং, প্রশাসন, পরামর্শদাতা, প্রকাশনা";
        else careerType = "মিশ্র—চাকরি ও ব্যবসা উভয়ই সম্ভব, অথবা ফ্রিল্যান্সিং";

        const dasha = chartData.dashaInfo?.currentMD;
        if (dasha && [tenthLord, sixthLord, eleventhLord].includes(dasha.lord)) score += 2;

        let level = "", prediction = "";

        if (score >= 10) {
            level = "অসাধারণ";
            prediction = `আপনার কর্মজীবন অত্যন্ত সফল ও সম্মানজনক হবে। দশম পতি ${tenthLord} অত্যন্ত বলবান অবস্থায় আছেন—${tenthLordPlanet ? (tenthLordPlanet.house + 'ম ভাবে ' + tenthLordPlanet.rashi + ' রাশিতে অবস্থান করছেন।') : 'আপনার কর্মজীবনের ভিত মজবুত করছেন।'} ${this.exalted[tenthLord] === tenthLordPlanet?.rashi ? tenthLord + ' তুঙ্গস্থ—এটি রাজযোগের ইঙ্গিত। আপনার কর্মক্ষেত্রে আপনি অপ্রতিদ্বন্দ্বী হয়ে উঠবেন।' : ''}

${careerType}—আপনার জন্য সবচেয়ে উপযোগী পেশা। আপনি কর্মক্ষেত্রে উচ্চপদ, সম্মান ও স্বীকৃতি পাবেন। আপনার নেতৃত্বগুণ এতটাই স্পষ্ট হবে যে সহকর্মীরা আপনাকে অনুসরণ করবে, উর্ধ্বতনরা আপনার উপর আস্থা রাখবে।

${sun && sun.house === 10 ? 'সূর্য দশম ভাবে থাকায় আপনি স্বভাবতই নেতা—প্রশাসন বা রাজনীতিতে আপনার বিশেষ সাফল্য আসবে।' : ''} ${saturn && saturn.house === 10 ? 'শনি দশম ভাবে—আপনি ধীরে ধীরে কিন্তু নিশ্চিতভাবে শিখরে পৌঁছাবেন। আপনার সাফল্য হবে দীর্ঘস্থায়ী।' : ''}

${dasha && [tenthLord].includes(dasha.lord) ? 'বর্তমানে আপনার দশম পতির মহাদশা/অন্তর্দশা চলছে—এটি কর্মজীবনের শ্রেষ্ঠ সময়। পদোন্নতি বা নতুন সুযোগ আসতে পারে।' : ''}

তবে সাফল্য যেন অহংকার না আনে। সূর্যের মতো বিনয়ী থেকে আলো ছড়ান। আপনার সাফল্যে অন্যরাও যেন আলোকিত হয়—এই আপনার জীবনের সবচেয়ে বড় কর্মযোগ।`;
        } else if (score >= 6) {
            level = "ভালো";
            prediction = `আপনার কর্মজীবন ধীরে ধীরে কিন্তু নিশ্চিতভাবে উন্নতি করবে। দশম পতি ${tenthLord}-এর অবস্থান মোটামুটি শুভ—${tenthLordPlanet ? (tenthLordPlanet.house + 'ম ভাবে আছেন।') : ''} ${careerType}—আপনার জন্য উপযুক্ত পেশা।

${tenthHousePlanets.length > 0 ? 'দশম ভাবে গ্রহের উপস্থিতি আপনার কর্মজীবনকে প্রভাবিত করছে—' + tenthHousePlanets.map(p => p.name).join(', ') + '।' : 'দশম ভাবে কোনো গ্রহ নেই—আপনার কর্মজীবন স্থিতিশীল থাকবে।'}

পরিশ্রম করুন, ধৈর্য ধরুন—যে গাছ ধীরে বাড়ে, তার শিকড় গভীরে যায়। ${saturn ? 'শনি আপনার কর্মজীবনে ধীর গতির ইঙ্গিত দিচ্ছে—কিন্তু শনির দেওয়া সাফল্যই সবচেয়ে স্থায়ী হয়।' : ''} ${dasha && [tenthLord, sixthLord, eleventhLord].includes(dasha.lord) ? 'বর্তমান দশা কর্মের পক্ষে সহায়ক।' : 'বর্তমান দশায় কিছু ধৈর্য ধরতে হবে।'}

মনে রাখবেন—যে মানুষ নিজের কাজকে ভালোবাসে, তার কাছে প্রতিদিনই ছুটির দিন। আপনি আপনার কাজকে ভালোবাসতে শিখুন, সাফল্য আপনার পেছনে ছুটবে।`;
        } else if (score >= 3) {
            level = "মধ্যম";
            prediction = `আপনার কর্মজীবনে ওঠাপড়া থাকবে। দশম পতি ${tenthLord} কিছুটা দুর্বল অবস্থানে—${tenthLordPlanet ? (tenthLordPlanet.house + 'ম ভাবে থাকায়') : ''} চাকরি বা ব্যবসায় স্থিতিশীলতা পেতে সময় লাগবে। ${careerType}—চেষ্টা করতে পারেন, তবে সাবধানতা প্রয়োজন।

${tenthHousePlanets.filter(p => ["রাহু","কেতু","শনি","মঙ্গল"].includes(p.name)).length > 0 ? 'দশম ভাবে পাপগ্রহের প্রভাবে কর্মক্ষেত্রে প্রতিযোগিতা ও ষড়যন্ত্রের সম্মুখীন হতে পারেন।' : ''}

কিন্তু হাল ছাড়বেন না—যে আগুন ধীরে জ্বলে, তার তাপ দীর্ঘস্থায়ী হয়। ${mars ? 'মঙ্গলের প্রভাবে আপনি লড়াই করতে জানেন—এই গুণই আপনাকে সফল করবে।' : ''} ${dasha && ["শনি","মঙ্গল"].includes(dasha.lord) ? 'বর্তমান দশা কঠিন—কিন্তু এই সময়ই আপনাকে ভবিষ্যতের জন্য প্রস্তুত করছে।' : ''}

মনে রাখবেন—যে সূর্য আজ মাথার উপরে, তাকেও সন্ধ্যায় অস্ত যেতে হয়। কিন্তু পরের দিন সে আবার ওঠে, আরও উজ্জ্বল হয়ে। আপনার ক্যারিয়ারও তেমনই—পতন মানেই শেষ নয়, তা নতুন উত্থানেরই পূর্বাভাস।`;
        } else {
            level = "চ্যালেঞ্জিং";
            prediction = `আপনার কর্মজীবন সংগ্রামপূর্ণ হতে পারে। দশম পতি ${tenthLord} দুর্বল অবস্থানে—${tenthLordPlanet ? (tenthLordPlanet.house + 'ম ভাবে, যা কর্মজীবনের জন্য চ্যালেঞ্জিং।') : ''} ${careerType}—ক্ষেত্রে গেলে বিশেষ সাবধানতা প্রয়োজন।

${tenthHousePlanets.length > 0 && tenthHousePlanets.every(p => ["রাহু","কেতু","শনি","মঙ্গল"].includes(p.name)) ? 'দশম ভাবে একাধিক পাপগ্রহ—কর্মক্ষেত্রে তীব্র প্রতিযোগিতা, ষড়যন্ত্র ও অনিশ্চয়তা থাকবে।' : ''}

কিন্তু এই সংগ্রামই আপনাকে শক্তিশালী করবে—যেমন নদী পাথর কেটে পথ তৈরি করে। ${saturn ? 'শনি আপনার ওপর কঠোর—কিন্তু শনি যাকে পরীক্ষা নেয়, তাকেই সাফল্যের শিখরে তোলে।' : ''}

${dasha && ["শনি","মঙ্গল","কেতু"].includes(dasha.lord) ? 'বর্তমান দশা অত্যন্ত কঠিন—ধৈর্য ও অধ্যবসায়ই আপনার একমাত্র সম্বল।' : ''} ফ্রিল্যান্সিং, নিজস্ব উদ্যোগ বা একাধিক উৎস থেকে আয়ের চেষ্টা করুন। এক জায়গায় নির্ভর না করে, বিকল্প পথ তৈরি করুন। মনে রাখবেন—যে পাখি ঝড়ে উড়তে শেখে, তার ডানা সবচেয়ে শক্তিশালী হয়।`;
        }

        return { area: "কর্ম", level, score, careerType, prediction };
    }

    // ==================== ৩. বিবাহ ====================
    analyzeMarriage(chartData) {
        const lagna = chartData.lagna;
        const planets = chartData.planets;
        if (!lagna || !planets) return null;

        const seventhLord = this.getSignLord(this.getHouseSign(lagna.rashi, 7));
        const eighthLord = this.getSignLord(this.getHouseSign(lagna.rashi, 8));

        const seventhLordPlanet = planets.find(p => p.name === seventhLord);
        const seventhHousePlanets = planets.filter(p => p.house === 7);
        const venus = planets.find(p => p.name === "শুক্র");
        const jupiter = planets.find(p => p.name === "বৃহস্পতি");
        const mars = planets.find(p => p.name === "মঙ্গল");

        let score = 0;
        score += this.getPlanetScore(seventhLord, chartData);
        score += this.getPlanetScore("শুক্র", chartData);
        score += this.getPlanetScore("বৃহস্পতি", chartData);

        const isManglik = mars && [1,2,4,7,8,12].includes(mars.house);
        if (isManglik) score -= 2;

        for (const pp of seventhHousePlanets) {
            if (["বৃহস্পতি","শুক্র","বুধ","চন্দ্র"].includes(pp.name)) score += 3;
            if (["রাহু","কেতু","শনি","মঙ্গল"].includes(pp.name)) score -= 2;
            if (pp.name === "শনি") score += 1;
        }

        const dasha = chartData.dashaInfo?.currentMD;
        if (dasha && [seventhLord, "শুক্র", "বৃহস্পতি"].includes(dasha.lord)) score += 2;

        let level = "", prediction = "";

        if (score >= 10) {
            level = "অসাধারণ";
            prediction = `আপনার দাম্পত্য জীবন অত্যন্ত সুখের হবে। সপ্তম পতি ${seventhLord} বলবান অবস্থায় আছেন—${seventhLordPlanet ? (seventhLordPlanet.house + 'ম ভাবে ' + seventhLordPlanet.rashi + ' রাশিতে।') : ''} শুক্র-বৃহস্পতির আশীর্বাদ আপনার উপর বর্ষিত হচ্ছে।

${venus ? ('শুক্র আপনার ' + venus.house + 'ম ভাবে ' + venus.rashi + ' রাশিতে—প্রেম ও দাম্পত্যের কারক হিসেবে শুভ ফল দিচ্ছেন।') : ''} ${jupiter ? ('বৃহস্পতি ' + jupiter.house + 'ম ভাবে—নারীর স্বামীকারক হিসেবে শুভ।') : ''}

${seventhHousePlanets.filter(p => ["বৃহস্পতি","শুক্র","বুধ","চন্দ্র"].includes(p.name)).length > 0 ? 'সপ্তম ভাবে শুভ গ্রহের উপস্থিতি আপনার দাম্পত্য জীবনকে স্বর্গীয় করে তুলবে।' : ''}

আপনার জীবনসঙ্গী হবেন গুণী, সুন্দর ও সহৃদয়। দাম্পত্য জীবন হবে পূর্ণিমার চাঁদের মতো—স্নিগ্ধ, শান্ত ও পরিপূর্ণ। ${isManglik ? 'মাঙ্গলিক দোষ থাকলেও অন্যান্য শুভ যোগের কারণে তার প্রভাব প্রশমিত হবে।' : 'মাঙ্গলিক দোষ নেই—নিশ্চিন্ত থাকুন।'}

${dasha && [seventhLord, "শুক্র", "বৃহস্পতি"].includes(dasha.lord) ? 'বর্তমান দশা বিবাহের পক্ষে অত্যন্ত অনুকূল—শীঘ্রই শুভ সংবাদ পেতে পারেন।' : ''}

মনে রাখবেন—প্রকৃত দাম্পত্য হলো দুই আত্মার মিলন, যা জন্ম-জন্মান্তরের বন্ধন।`;
        } else if (score >= 6) {
            level = "ভালো";
            prediction = `আপনার দাম্পত্য জীবন সুখের হবে। সপ্তম পতি ${seventhLord}-এর অবস্থান মোটামুটি শুভ—${seventhLordPlanet ? (seventhLordPlanet.house + 'ম ভাবে।') : ''}

${venus ? ('শুক্রের অবস্থান—' + venus.house + 'ম ভাবে, যা আপনার প্রেমজীবনকে প্রভাবিত করছে।') : ''} ${jupiter ? ('বৃহস্পতি ' + jupiter.house + 'ম ভাবে—দাম্পত্যে স্থিতিশীলতা দিচ্ছেন।') : ''}

${isManglik ? 'মাঙ্গলিক দোষ আছে—তবে তা সামান্য, প্রতিকারে কেটে যাবে। হনুমান পূজা ও মঙ্গলবার উপবাস করুন।' : 'মাঙ্গলিক দোষ নেই—নিশ্চিন্ত থাকুন।'}

${seventhHousePlanets.length > 0 ? 'সপ্তম ভাবে গ্রহের উপস্থিতি—আপনার জীবনসঙ্গী হবেন বিশেষ ব্যক্তিত্বের অধিকারী।' : ''}

আপনার জীবনসঙ্গী হবেন বিশ্বস্ত ও যত্নশীল। ${dasha && [seventhLord, "শুক্র", "বৃহস্পতি"].includes(dasha.lord) ? 'বর্তমান দশা অনুকূল—বিয়ের সম্ভাবনা আছে।' : 'বিয়ের জন্য সঠিক সময়ের অপেক্ষা করুন।'}

মনে রাখবেন—ভালোবাসা মানে পরস্পরকে বদলানো নয়, পরস্পরকে গ্রহণ করা।`;
        } else if (score >= 3) {
            level = "মধ্যম";
            prediction = `দাম্পত্য জীবনে কিছু চ্যালেঞ্জ আসবে। সপ্তম পতি ${seventhLord} কিছুটা দুর্বল বা পাপগ্রহের প্রভাবে থাকায়—${isManglik ? 'মাঙ্গলিক দোষ ও অন্যান্য বাধা রয়েছে।' : 'সম্পর্কে টানাপোড়েন আসতে পারে।'}

${seventhHousePlanets.filter(p => ["রাহু","কেতু","শনি","মঙ্গল"].includes(p.name)).length > 0 ? 'সপ্তম ভাবে পাপগ্রহ—দাম্পত্য জীবনে অশান্তি ও ভুল বোঝাবুঝির সম্ভাবনা আছে।' : ''} ${seventhHousePlanets.find(p => p.name === "শনি") ? 'শনি সপ্তম ভাবে—বিয়ে দেরিতে হবে, কিন্তু সম্পর্ক স্থায়ী হবে।' : ''}

তবে ধৈর্য ও বোঝাপড়া দিয়ে সব সমস্যার সমাধান হবে। ${isManglik ? 'মাঙ্গলিক দোষের প্রতিকার করুন—কুম্ভবিবাহ বা হনুমান পূজা উপকারী।' : ''} ${dasha && ["শনি","মঙ্গল"].includes(dasha.lord) ? 'বর্তমান দশায় বিয়েতে বিলম্ব হতে পারে।' : ''}

মনে রাখবেন—যে নদী বাঁক নেয়, সে-ই সাগরে পৌঁছায়। সম্পর্কেও বাঁক আসবে—সোজা পথে চলার চেষ্টা করবেন না, বাঁক মেনে চলুন।`;
        } else {
            level = "চ্যালেঞ্জিং";
            prediction = `দাম্পত্য জীবনে বড় চ্যালেঞ্জ আছে। সপ্তম ভাবে পাপগ্রহ বা সপ্তম পতি ${seventhLord} দুর্বল অবস্থানে। ${isManglik ? 'মাঙ্গলিক দোষ প্রবল—বিশেষ প্রতিকার আবশ্যক। কুম্ভবিবাহ, হনুমান চালিশা ও মঙ্গলবার উপবাস করুন।' : 'বিয়েতে দেরি ও অশান্তির সম্ভাবনা আছে।'}

${seventhHousePlanets.length > 0 ? 'সপ্তম ভাবে পাপগ্রহের আধিক্য—একাধিক বিয়ে, বিবাহ বিচ্ছেদ বা দাম্পত্য জীবনে চরম অশান্তির ইঙ্গিত।' : ''}

${dasha && ["শনি","মঙ্গল","রাহু","কেতু"].includes(dasha.lord) ? 'বর্তমান দশা বিবাহের পক্ষে অশুভ—তাড়াহুড়ো করবেন না।' : ''}

মনে রাখবেন—যে সম্পর্ক ঝড় সহ্য করে, তা-ই সবচেয়ে মজবুত হয়। কিন্তু ঝড় যদি সম্পর্ক ভেঙে দেয়, তবে বুঝতে হবে সেই সম্পর্ক দুর্বল ছিলই। নিজের আত্মসম্মান বজায় রাখুন—কারও জন্য নিজেকে ধ্বংস করবেন না।`;
        }

        return { area: "বিবাহ", level, score, isManglik, prediction };
    }

    // ==================== ৪. ভাগ্য ====================
    analyzeFortune(chartData) {
        const lagna = chartData.lagna;
        const planets = chartData.planets;
        if (!lagna || !planets) return null;

        const ninthLord = this.getSignLord(this.getHouseSign(lagna.rashi, 9));
        const ninthLordPlanet = planets.find(p => p.name === ninthLord);
        const ninthHousePlanets = planets.filter(p => p.house === 9);
        const jupiter = planets.find(p => p.name === "বৃহস্পতি");

        let score = 0;
        score += this.getPlanetScore(ninthLord, chartData);
        score += this.getPlanetScore("বৃহস্পতি", chartData);

        for (const pp of ninthHousePlanets) {
            if (["বৃহস্পতি","শুক্র","বুধ","চন্দ্র","সূর্য"].includes(pp.name)) score += 3;
            if (["রাহু","কেতু","শনি","মঙ্গল"].includes(pp.name)) score -= 2;
        }

        if (ninthLordPlanet && [1,4,5,7,9,10].includes(ninthLordPlanet.house)) score += 3;
        if (ninthLordPlanet && [6,8,12].includes(ninthLordPlanet.house)) score -= 3;

        const dasha = chartData.dashaInfo?.currentMD;
        if (dasha && [ninthLord, "বৃহস্পতি"].includes(dasha.lord)) score += 2;

        let level = "", prediction = "";

        if (score >= 10) {
            level = "অসাধারণ";
            prediction = `আপনার ভাগ্য অত্যন্ত প্রসন্ন ও শক্তিশালী। নবম পতি ${ninthLord} পরম শুভ অবস্থানে আছেন—${ninthLordPlanet ? (ninthLordPlanet.house + 'ম ভাবে ' + ninthLordPlanet.rashi + ' রাশিতে।') : ''} বৃহস্পতির অনুগ্রহ আপনার উপর সম্পূর্ণরূপে বর্ষিত হচ্ছে।

${jupiter ? ('বৃহস্পতি ' + jupiter.house + 'ম ভাবে ' + jupiter.rashi + ' রাশিতে—ভাগ্যের কারক হিসেবে অত্যন্ত শুভ।') : ''} ${this.exalted["বৃহস্পতি"] === jupiter?.rashi ? 'বৃহস্পতি তুঙ্গস্থ কর্কট রাশিতে—এটি পরম শুভ লক্ষণ। আপনার ভাগ্য স্বয়ং দেবগুরুর হাতে।' : ''}

${ninthHousePlanets.filter(p => ["বৃহস্পতি","শুক্র","বুধ","চন্দ্র","সূর্য"].includes(p.name)).length > 0 ? 'নবম ভাবে শুভ গ্রহের উপস্থিতি আপনার ভাগ্যকে বহুগুণে বাড়িয়ে দিয়েছে।' : ''}

আপনি যেখানেই হাত দেবেন, সাফল্য আসবে—যেন ভাগ্য নিজেই আপনার জন্য পথ তৈরি করে রেখেছে। জীবনে বড় কোনো অভাব স্পর্শ করবে না। ${dasha && [ninthLord, "বৃহস্পতি"].includes(dasha.lord) ? 'বর্তমান দশা ভাগ্যের পক্ষে অত্যন্ত অনুকূল—এই সময় যা শুরু করবেন, সফল হবেন।' : ''}

তীর্থযাত্রা ও দান-ধ্যানে আপনার ভাগ্য আরও বৃদ্ধি পাবে। মনে রাখবেন—ভাগ্য তাদেরই সহায় হয়, যারা পরিশ্রম করতে জানে।`;
        } else if (score >= 6) {
            level = "ভালো";
            prediction = `আপনার ভাগ্য সহায়। নবম পতি ${ninthLord}-এর অবস্থান শুভ—${ninthLordPlanet ? (ninthLordPlanet.house + 'ম ভাবে।') : ''} ${jupiter ? ('বৃহস্পতি ' + jupiter.house + 'ম ভাবে—ভাগ্যকে শক্তিশালী করছেন।') : ''}

আপনি পরিশ্রম করলে ভাগ্যও আপনার পাশে দাঁড়াবে। জীবনে বড় সাফল্য আসবে, তবে তার জন্য ধৈর্য ধরতে হবে। গুরুর আশীর্বাদ ও ধর্মপথে চলা আপনার ভাগ্যকে আরও শক্তিশালী করবে।

${ninthHousePlanets.length > 0 ? 'নবম ভাবে গ্রহের উপস্থিতি—আপনার ভাগ্য কখনও কখনও চমকপ্রদ ফল দেবে।' : ''} ${dasha && [ninthLord, "বৃহস্পতি"].includes(dasha.lord) ? 'বর্তমান দশা ভাগ্যের জন্য সহায়ক।' : ''}

মনে রাখবেন—মানুষের ভাগ্য আকাশের তারার মতো লেখা থাকে না, তা নিজের হাতে গড়ে নিতে হয়।`;
        } else if (score >= 3) {
            level = "মধ্যম";
            prediction = `ভাগ্য কখনও পাশে দাঁড়াবে, কখনও বিপক্ষে যাবে। নবম পতি ${ninthLord} কিছুটা দুর্বল বা পাপগ্রহের প্রভাবে থাকায়—${ninthLordPlanet ? (ninthLordPlanet.house + 'ম ভাবে।') : ''} ভাগ্যের পূর্ণ সহায়তা পেতে দেরি হবে।

${ninthHousePlanets.filter(p => ["রাহু","কেতু","শনি","মঙ্গল"].includes(p.name)).length > 0 ? 'নবম ভাবে পাপগ্রহ—ভাগ্য বাধাগ্রস্ত হবে, অপ্রত্যাশিত বিপর্যয় আসতে পারে।' : ''}

তবে হাল ছাড়বেন না—চেষ্টা করতে থাকুন, ভাগ্যও একদিন আপনার দিকে ফিরবে। ${dasha && ["শনি","মঙ্গল"].includes(dasha.lord) ? 'বর্তমান দশায় ভাগ্য কিছুটা প্রতিকূলে—ধৈর্য ধরুন।' : ''}

মনে রাখবেন—ভাগ্য বদলাতে একটি মাত্র মুহূর্ত লাগে। সেই মুহূর্ত আপনার জন্যও আসবে।`;
        } else {
            level = "চ্যালেঞ্জিং";
            prediction = `ভাগ্য আপনার প্রতিকূলে থাকবে—অন্তত এই সময়ে। নবম ভাবে পাপগ্রহ বা নবম পতি ${ninthLord} দুর্বল অবস্থানে থাকায়—${ninthLordPlanet ? (ninthLordPlanet.house + 'ম ভাবে।') : ''} বারবার বাধা আসবে।

${ninthHousePlanets.filter(p => ["রাহু","কেতু","শনি","মঙ্গল"].includes(p.name)).length > 0 ? 'নবম ভাবে পাপগ্রহ—ভাগ্যহানি, ধর্মে সংশয় ও পিতৃকষ্টের ইঙ্গিত।' : ''}

কিন্তু এই কষ্টই আপনাকে পরিণত করবে—যেমন সোনা আগুনে পুড়লেই খাঁটি হয়। ${dasha && ["শনি","রাহু","কেতু"].includes(dasha.lord) ? 'বর্তমান দশা অত্যন্ত কঠিন—কিন্তু এর পরেই শুভ সময় আসবে।' : ''}

দান-ধ্যান, তীর্থযাত্রা, পিতৃতর্পণ ও গুরুর সেবায় আপনার ভাগ্য ফিরবে। মনে রাখবেন—যার ভাগ্য সবচেয়ে খারাপ, তার ভাগ্য ফেরার সম্ভাবনাই সবচেয়ে বেশি।`;
        }

        return { area: "ভাগ্য", level, score, prediction };
    }

    // ==================== পূর্ণাঙ্গ বিশ্লেষণ ====================
    analyzeAll(chartData) {
        return {
            education: this.analyzeEducation(chartData),
            career: this.analyzeCareer(chartData),
            marriage: this.analyzeMarriage(chartData),
            fortune: this.analyzeFortune(chartData)
        };
    }

    formatReport(chartData) {
        const result = this.analyzeAll(chartData);
        const name = chartData.name || "জাতক/জাতিকা";
        let output = "";

        output += `╔══════════════════════════════════════════════════╗\n`;
        output += `║  🌟 ${name}-এর জীবন বিশ্লেষণ (চার অঙ্গ)\n`;
        output += `╚══════════════════════════════════════════════════╝\n\n`;

        const areas = [
            { key: "education", title: "🎓 পড়াশোনা", icon: "📚" },
            { key: "career", title: "💼 কর্মজীবন", icon: "💪" },
            { key: "marriage", title: "💑 বিবাহ", icon: "❤️" },
            { key: "fortune", title: "🍀 ভাগ্য", icon: "🌟" }
        ];

        for (const a of areas) {
            const r = result[a.key];
            if (!r) continue;
            const levelColor = r.level === "অসাধারণ" ? "🌟" : r.level === "ভালো" ? "✅" : r.level === "মধ্যম" ? "⚠️" : "💀";
            output += `${"═".repeat(50)}\n`;
            output += `${a.icon} ${a.title}: ${levelColor} ${r.level} (স্কোর: ${r.score})\n`;
            output += `${"═".repeat(50)}\n\n`;
            output += `${r.prediction}\n\n`;
            if (r.careerType) output += `💡 উপযোগী পেশা: ${r.careerType}\n\n`;
            if (r.isManglik !== undefined) output += `${r.isManglik ? '⚠️ মাঙ্গলিক দোষ: হ্যাঁ' : '✅ মাঙ্গলিক দোষ: নেই'}\n\n`;
        }

        output += `${"═".repeat(50)}\n`;
        output += `🕉️ জীবন চার অঙ্গের এই বিশ্লেষণ আপনার জন্মকুষ্ঠির গ্রহ-নক্ষত্রের অবস্থানের উপর ভিত্তি করে।\n`;
        output += `মনে রাখবেন—আপনার ইচ্ছাশক্তি ও কর্মই আপনার শ্রেষ্ঠ গ্রহ।\n`;

        return output;
    }
}

// Export
if (typeof module !== "undefined" && module.exports) {
    module.exports = LifePredictionEngine;
}

console.log("✅ life-predictions.js — DETAILED Education, Career, Marriage, Fortune ইঞ্জিন লোড");
console.log("🔍 ব্যবহার: new LifePredictionEngine().analyzeAll(chartData)");
console.log("🔍 রিপোর্ট: new LifePredictionEngine().formatReport(chartData)");
