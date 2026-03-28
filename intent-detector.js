// intent-detector.js - বাংলা ও ইংরেজি উভয় ভাষা সাপোর্ট সহ

const IntentDetector = {
    // বিভিন্ন প্যাটার্ন শনাক্ত করার রেগুলার এক্সপ্রেশন
    patterns: {
        // বাংলা ও ইংরেজি উভয় ভাষায় তারিখ
        DATE: /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{1,2}\s+(জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{2,4})/i,
        
        // বাংলাদেশি মোবাইল নম্বর (বাংলা ও ইংরেজি ডিজিট)
        PHONE: /(০১৭|০১৮|০১৯|০১৫|০১৬|০১৪|017|018|019|015|016|014)\d{8}/,
        
        // গাড়ির নম্বর (বাংলা ও ইংরেজি)
        VEHICLE: /([বঙচডড্ঢ়]|[A-Za-z]){2}\s?(\d{2})\s?([A-Za-z]{2})\s?(\d{4})/i,
        
        // মূল্য (টাকা, ডলার, ইত্যাদি)
        PRICE: /(\d{3,6})\s*(টাকা|টকা|taka|tk|BDT|৳)/i,
        
        // ব্যবসার নাম শনাক্তকরণ (বাংলা+ইংরেজি)
        BUSINESS_NAME: /(এন্টারপ্রাইজ|ফার্ম|ট্রেডার্স|ইন্ডাস্ট্রিজ|কোম্পানি|লিমিটেড|enterprise|firm|traders|industries|company|ltd|private|limited)/i,
        
        // ব্যাংক অ্যাকাউন্ট
        BANK_ACCOUNT: /^\d{9,15}$/,
        
        // PIN কোড
        PIN: /^\d{4,6}$/,
        
        // শুধু নাম (বাংলা বা ইংরেজি অক্ষর)
        NAME: /^[ঙ-হa-zA-Z\s]{3,40}$/
    },
    
    // বাংলা ডিজিটকে ইংরেজি ডিজিটে কনভার্ট
    convertBengaliDigits: function(str) {
        const bengaliDigits = {
            '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
            '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
        };
        
        let converted = str;
        for (let [bengali, english] of Object.entries(bengaliDigits)) {
            converted = converted.replace(new RegExp(bengali, 'g'), english);
        }
        return converted;
    },
    
    // ইনটেন্ট সনাক্তকরণ
    detect: function(input) {
        const trimmed = input.trim();
        
        // প্রথমে বাংলা ডিজিট কনভার্ট
        const normalizedInput = this.convertBengaliDigits(trimmed);
        
        // ১. তারিখ শনাক্ত (মূলাংকের জন্য)
        if (this.patterns.DATE.test(normalizedInput) || this.patterns.DATE.test(trimmed)) {
            // তারিখ থেকে দিন বের করার চেষ্টা
            const mulank = NumerologyDB.calculateMulank(normalizedInput);
            if (mulank) {
                return {
                    intent: "MULANK",
                    confidence: 0.95,
                    extracted: trimmed,
                    normalized: normalizedInput,
                    mulank: mulank,
                    needsClarification: false
                };
            }
        }
        
        // ২. মোবাইল নম্বর
        if (this.patterns.PHONE.test(normalizedInput) || this.patterns.PHONE.test(trimmed)) {
            const numberAnalysis = NumerologyDB.analyzeNumber(normalizedInput);
            return {
                intent: "PHONE_NUMBER",
                confidence: 0.98,
                extracted: trimmed,
                normalized: normalizedInput,
                analysis: numberAnalysis,
                needsClarification: false
            };
        }
        
        // ৩. গাড়ির নম্বর
        if (this.patterns.VEHICLE.test(trimmed) || this.patterns.VEHICLE.test(normalizedInput)) {
            const numberAnalysis = NumerologyDB.analyzeNumber(trimmed.replace(/[^0-9]/g, ''));
            return {
                intent: "VEHICLE_NUMBER",
                confidence: 0.92,
                extracted: trimmed,
                analysis: numberAnalysis,
                needsClarification: false
            };
        }
        
        // ৪. মূল্য
        const priceMatch = this.patterns.PRICE.exec(normalizedInput) || this.patterns.PRICE.exec(trimmed);
        if (priceMatch) {
            const priceAnalysis = NumerologyDB.analyzePrice(priceMatch[1]);
            return {
                intent: "PRODUCT_PRICE",
                confidence: 0.94,
                extracted: trimmed,
                price: priceMatch[1],
                analysis: priceAnalysis,
                needsClarification: false
            };
        }
        
        // ৫. ব্যবসার নাম
        if (this.patterns.BUSINESS_NAME.test(trimmed)) {
            const nameAnalysis = NumerologyDB.analyzeName(trimmed);
            return {
                intent: "BUSINESS_NAME",
                confidence: 0.88,
                extracted: trimmed,
                analysis: nameAnalysis,
                needsClarification: false
            };
        }
        
        // ৬. ব্যাংক অ্যাকাউন্ট
        if (this.patterns.BANK_ACCOUNT.test(normalizedInput)) {
            const numberAnalysis = NumerologyDB.analyzeNumber(normalizedInput);
            return {
                intent: "BANK_ACCOUNT",
                confidence: 0.85,
                extracted: trimmed,
                analysis: numberAnalysis,
                needsClarification: false
            };
        }
        
        // ৭. PIN কোড
        if (this.patterns.PIN.test(normalizedInput)) {
            const numberAnalysis = NumerologyDB.analyzeNumber(normalizedInput);
            return {
                intent: "PIN_NUMBER",
                confidence: 0.90,
                extracted: trimmed,
                analysis: numberAnalysis,
                needsClarification: false
            };
        }
        
        // ৮. নাম (বাংলা বা ইংরেজি)
        if (this.patterns.NAME.test(trimmed)) {
            const nameAnalysis = NumerologyDB.analyzeName(trimmed);
            return {
                intent: "NAME_ANALYSIS",
                confidence: 0.80,
                extracted: trimmed,
                analysis: nameAnalysis,
                needsClarification: true,
                clarificationQuestion: "এটি কি আপনার নিজের নাম, নাকি ব্যবসার নাম? / Is this your personal name or business name?",
                options: ["ব্যক্তির নাম / Personal Name", "ব্যবসার নাম / Business Name"]
            };
        }
        
        // ৯. জেনারেল কোয়েরি
        return {
            intent: "GENERAL",
            confidence: 0.3,
            extracted: trimmed,
            needsClarification: true,
            clarificationQuestion: "আপনি কী জানতে চান? দয়া করে স্পষ্ট করে লিখুন। উদাহরণ: জন্মতারিখ, নাম, মোবাইল নম্বর, ব্যবসার নাম ইত্যাদি। / What would you like to know? Please be specific. Examples: birth date, name, mobile number, business name etc."
        };
    },
    
    // শুধু নাম থেকে সংখ্যা বের করা (বাংলা+ইংরেজি)
    getNumberFromName: function(name) {
        return NumerologyDB.calculateNameNumber(name);
    },
    
    // শুধু সংখ্যা থেকে রুট বের করা
    getRootNumber: function(num) {
        return NumerologyDB.getRootNumber(num);
    }
};

// Export for browser
if (typeof window !== 'undefined') {
    window.IntentDetector = IntentDetector;
}
