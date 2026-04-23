// prediction-engine.js
// পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার
// প্রেডিকশন ইঞ্জিন - সমস্ত ডেটা ফাইল একত্রিত করে পূর্ণাঙ্গ বিশ্লেষণ তৈরি করে

class PredictionEngine {
    constructor() {
        this.userName = "";
        this.chartData = {};
    }
    
    /**
     * ব্যবহারকারীর নাম সেট করে
     * @param {string} name - ব্যবহারকারীর নাম
     */
    setUserName(name) {
        this.userName = name || "জাতক/জাতিকা";
    }
    
    /**
     * জন্মছকের সমস্ত ডেটা সেট করে
     * @param {object} data - গ্রহের অবস্থান, লগ্ন, তিথি ইত্যাদি
     */
    setChartData(data) {
        this.chartData = data;
    }
    
    /**
     * পূর্ণাঙ্গ কুষ্ঠি বিশ্লেষণ তৈরি করে
     * @returns {string} সম্পূর্ণ প্রেডিকশন
     */
    generateFullPrediction() {
        if (!this.userName) this.userName = "জাতক/জাতিকা";
        if (!this.chartData || !this.chartData.planets) {
            return "দুঃখিত, কুষ্ঠির ডেটা পাওয়া যায়নি। অনুগ্রহ করে প্রথমে গণনা করুন।";
        }
        
        let output = "";
        
        // ১. হেডার
        output += `🪐 শ্রী ${this.userName}-এর পূর্ণাঙ্গ পূর্ব ভারতীয় কুষ্ঠি বিশ্লেষণ\n`;
        output += "═".repeat(50) + "\n\n";
        
        // ২. শুভেচ্ছা বার্তা
        output += `প্রিয় ${this.userName},\n\n`;
        output += "আপনার জন্মছত্রের গ্রহ-নক্ষত্রের অবস্থানের উপর ভিত্তি করে এই পূর্ণাঙ্গ কুষ্ঠি বিশ্লেষণ প্রস্তুত করা হলো। এটি আপনার ব্যক্তিত্ব, মানসিকতা, কর্মজীবন ও জীবনের বিভিন্ন দিক সম্পর্কে গভীর অন্তর্দৃষ্টি প্রদান করবে।\n\n";
        
        // ৩. জন্ম বিবরণ
        output += this.generateBirthDetails();
        
        // ৪. মানসিক বিশ্লেষণ (নক্ষত্র ভিত্তিক)
        output += this.generateMentalAnalysis();
        
        // ৫. লগ্ন বিশ্লেষণ (শারীরিক ও বাহ্যিক)
        output += this.generateLagnaAnalysis();
        
        // ৬. সূর্যের অবস্থান (আত্মার বিশ্লেষণ)
        output += this.generateSunAnalysis();
        
        // ৭. গ্রহের ভাব বিশ্লেষণ (জীবনের বিভিন্ন ক্ষেত্র)
        output += this.generatePlanetHouseAnalysis();
        
        // ৮. তিথি বিশ্লেষণ
        output += this.generateTithiAnalysis();
        
        // ৯. যোগ বিশ্লেষণ
        output += this.generateYogaAnalysis();
        
        // ১০. করণ বিশ্লেষণ
        output += this.generateKaranaAnalysis();
        
        // ১১. সমাপ্তি বার্তা
        output += "\n" + "═".repeat(50) + "\n";
        output += `✨ ${this.userName}, আপনার জীবন মঙ্গলময় হোক। ✨\n`;
        output += "\n© পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার | লাহিড়ী অয়নাংশ | VSOP87 নির্ভুল গণনা\n";
        
        return output;
    }
    
    /**
     * জন্ম বিবরণ তৈরি করে
     */
    generateBirthDetails() {
        const cd = this.chartData;
        let output = "📋 জন্ম বিবরণ\n";
        output += "─".repeat(40) + "\n";
        
        if (cd.birthDate) output += `তারিখ: ${cd.birthDate}\n`;
        if (cd.birthTime) output += `সময়: ${cd.birthTime}\n`;
        if (cd.birthPlace) output += `স্থান: ${cd.birthPlace}\n`;
        
        // লগ্ন
        const lagna = cd.lagna || {};
        output += `লগ্ন: ${lagna.rashi || "অজানা"}\n`;
        
        // চন্দ্র রাশি
        const moon = cd.planets?.find(p => p.name === "চন্দ্র");
        if (moon) {
            output += `চন্দ্র রাশি: ${moon.rashi}\n`;
        }
        
        // সূর্য রাশি
        const sun = cd.planets?.find(p => p.name === "সূর্য");
        if (sun) {
            output += `সূর্য রাশি: ${sun.rashi}\n`;
        }
        
        output += "\n";
        return output;
    }
    
    /**
     * নক্ষত্র ভিত্তিক মানসিক বিশ্লেষণ
     */
    generateMentalAnalysis() {
        const moon = this.chartData.planets?.find(p => p.name === "চন্দ্র");
        if (!moon) return "";
        
        let output = "🧠 মানসিক প্রকৃতি (জন্ম নক্ষত্র অনুযায়ী)\n";
        output += "─".repeat(40) + "\n";
        
        try {
            // nakshatra-mental.js থেকে প্রেডিকশন
            if (typeof getNakshatraPrediction === 'function') {
                const prediction = getNakshatraPrediction(moon.nakshatra, moon.rashi);
                output += prediction + "\n\n";
            } else {
                output += `আপনার চন্দ্র ${moon.nakshatra} নক্ষত্রে ${moon.rashi} রাশিতে অবস্থিত।\n\n`;
            }
        } catch(e) {
            output += `আপনার চন্দ্র ${moon.nakshatra} নক্ষত্রে ${moon.rashi} রাশিতে অবস্থিত।\n\n`;
        }
        
        return output;
    }
    
    /**
     * লগ্ন বিশ্লেষণ
     */
    generateLagnaAnalysis() {
        const lagna = this.chartData.lagna;
        if (!lagna) return "";
        
        let output = "💪 দেহ ও বাহ্যিক ব্যক্তিত্ব (লগ্ন অনুযায়ী)\n";
        output += "─".repeat(40) + "\n";
        
        try {
            if (typeof getLagnaPrediction === 'function') {
                const prediction = getLagnaPrediction(lagna.rashi);
                output += prediction + "\n\n";
            } else {
                output += `আপনার লগ্ন ${lagna.rashi}।\n\n`;
            }
        } catch(e) {
            output += `আপনার লগ্ন ${lagna.rashi}।\n\n`;
        }
        
        return output;
    }
    
    /**
     * সূর্যের অবস্থান বিশ্লেষণ (মাস ভিত্তিক)
     */
    generateSunAnalysis() {
        const sun = this.chartData.planets?.find(p => p.name === "সূর্য");
        if (!sun) return "";
        
        let output = "☀️ আত্মার প্রকৃতি (সূর্যের অবস্থান অনুযায়ী)\n";
        output += "─".repeat(40) + "\n";
        
        try {
            if (typeof getMonthSunPrediction === 'function') {
                const prediction = getMonthSunPrediction(sun.longitude);
                output += prediction + "\n\n";
            } else {
                output += `আপনার সূর্য ${sun.rashi} রাশিতে ${sun.nakshatra} নক্ষত্রে অবস্থিত।\n\n`;
            }
        } catch(e) {
            output += `আপনার সূর্য ${sun.rashi} রাশিতে ${sun.nakshatra} নক্ষত্রে অবস্থিত।\n\n`;
        }
        
        return output;
    }
    
    /**
     * গ্রহের ভাব বিশ্লেষণ
     */
    generatePlanetHouseAnalysis() {
        const planets = this.chartData.planets;
        const lagna = this.chartData.lagna;
        if (!planets || !lagna) return "";
        
        let output = "🌍 গ্রহের ভাবগত প্রভাব (জীবনের বিভিন্ন ক্ষেত্র)\n";
        output += "─".repeat(40) + "\n";
        
        // গ্রহের ক্রম অনুসারে
        const planetOrder = ["সূর্য", "চন্দ্র", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি", "রাহু", "কেতু"];
        
        planetOrder.forEach(planetName => {
            const planet = planets.find(p => p.name === planetName);
            if (!planet) return;
            
            const house = planet.house;
            if (!house) return;
            
            // planet-house-predictions.js থেকে প্রেডিকশন
            let prediction = null;
            
            try {
                switch(planetName) {
                    case "সূর্য":
                        if (typeof getSunHousePrediction === 'function') prediction = getSunHousePrediction(house);
                        break;
                    case "চন্দ্র":
                        if (typeof getMoonHousePrediction === 'function') prediction = getMoonHousePrediction(house);
                        break;
                    case "মঙ্গল":
                        if (typeof getMarsHousePrediction === 'function') prediction = getMarsHousePrediction(house);
                        break;
                    case "বুধ":
                        if (typeof getMercuryHousePrediction === 'function') prediction = getMercuryHousePrediction(house);
                        break;
                    case "বৃহস্পতি":
                        if (typeof getJupiterHousePrediction === 'function') prediction = getJupiterHousePrediction(house);
                        break;
                    case "শুক্র":
                        if (typeof getVenusHousePrediction === 'function') prediction = getVenusHousePrediction(house);
                        break;
                    case "শনি":
                        if (typeof getSaturnHousePrediction === 'function') prediction = getSaturnHousePrediction(house);
                        break;
                    case "রাহু":
                        if (typeof getRahuHousePrediction === 'function') prediction = getRahuHousePrediction(house);
                        break;
                    case "কেতু":
                        if (typeof getKetuHousePrediction === 'function') prediction = getKetuHousePrediction(house);
                        break;
                }
            } catch(e) {
                // ফাংশন না থাকলে কিছু করবে না
            }
            
            if (prediction) {
                output += `◆ ${planetName} (${house}ম ভাবে):\n${prediction}\n\n`;
            }
        });
        
        return output;
    }
    
    /**
     * তিথি বিশ্লেষণ
     */
    generateTithiAnalysis() {
        const tithi = this.chartData.tithi;
        if (!tithi) return "";
        
        let output = "🌙 জন্ম তিথির প্রভাব\n";
        output += "─".repeat(40) + "\n";
        
        try {
            if (typeof getTithiPrediction === 'function') {
                const prediction = getTithiPrediction(tithi.paksha, tithi.name);
                output += prediction + "\n\n";
            } else {
                output += `আপনার জন্ম ${tithi.paksha} ${tithi.name} তিথিতে।\n\n`;
            }
        } catch(e) {
            output += `আপনার জন্ম ${tithi.paksha} ${tithi.name} তিথিতে।\n\n`;
        }
        
        return output;
    }
    
    /**
     * যোগ বিশ্লেষণ
     */
    generateYogaAnalysis() {
        const yoga = this.chartData.yoga;
        if (!yoga) return "";
        
        let output = "🕉️ জন্ম যোগের প্রভাব\n";
        output += "─".repeat(40) + "\n";
        
        try {
            if (typeof getYogaPrediction === 'function') {
                const prediction = getYogaPrediction(yoga.name);
                output += prediction + "\n\n";
            } else {
                output += `আপনার জন্ম ${yoga.name} যোগে।\n\n`;
            }
        } catch(e) {
            output += `আপনার জন্ম ${yoga.name} যোগে।\n\n`;
        }
        
        return output;
    }
    
    /**
     * করণ বিশ্লেষণ
     */
    generateKaranaAnalysis() {
        const karana = this.chartData.karana;
        if (!karana) return "";
        
        let output = "🌓 জন্ম করণের প্রভাব\n";
        output += "─".repeat(40) + "\n";
        
        try {
            if (typeof getKaranaPrediction === 'function') {
                const prediction = getKaranaPrediction(karana.name);
                output += prediction + "\n\n";
            } else {
                output += `আপনার জন্ম ${karana.name} করণে।\n\n`;
            }
        } catch(e) {
            output += `আপনার জন্ম ${karana.name} করণে।\n\n`;
        }
        
        return output;
    }
}

// গ্লোবাল ইন্সট্যান্স তৈরি
const predictionEngine = new PredictionEngine();

// কনসোল লগ
console.log("✅ প্রেডিকশন ইঞ্জিন লোড সম্পন্ন হয়েছে।");
console.log("🔍 ব্যবহার: predictionEngine.setUserName('নাম'); predictionEngine.setChartData(data); predictionEngine.generateFullPrediction();");
