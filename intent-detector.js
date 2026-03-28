// intent-detector.js - Root এ js ফোল্ডারের ভিতরে রাখুন

const IntentDetector = {
    // বিভিন্ন প্যাটার্ন শনাক্ত করার রেগুলার এক্সপ্রেশন
    patterns: {
        DATE: /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{1,2}\s+(জানুয়ারি|ফেব্রুয়ারি|মার্চ|এপ্রিল|মে|জুন|জুলাই|আগস্ট|সেপ্টেম্বর|অক্টোবর|নভেম্বর|ডিসেম্বর)\s+\d{2,4})/i,
        PHONE: /^0?1[3-9]\d{9}$|^\+8801[3-9]\d{9}$/,
        VEHICLE: /^[A-Za-z]{2}\s?\d{2}\s?[A-Za-z]{2}\s?\d{4}$|^[A-Za-z]{2}\d{2}[A-Za-z]{2}\d{4}$/i,
        PRICE: /(\d{3,5})\s*(টাকা|টকা|taka)/i,
        BUSINESS_NAME: /(এন্টারপ্রাইজ|ফার্ম|ট্রেডার্স|ইন্ডাস্ট্রিজ|কোম্পানি|লিমিটেড|enterprise|firm|traders|company)/i,
        NAME: /^[ঙ-হa-zA-Z\s]{3,30}$/,  // সাধারণ নামের প্যাটার্ন
        BANK_ACCOUNT: /^\d{9,15}$/,
        PIN: /^\d{4,6}$/
    },
    
    // ইনটেন্ট সনাক্তকরণ
    detect: function(input) {
        const trimmed = input.trim();
        
        // ১. তারিখ শনাক্ত (মূলাংকের জন্য)
        if (this.patterns.DATE.test(trimmed)) {
            return {
                intent: "MULANK",
                confidence: 0.95,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // ২. মোবাইল নম্বর
        if (this.patterns.PHONE.test(trimmed)) {
            return {
                intent: "PHONE_NUMBER",
                confidence: 0.98,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // ৩. গাড়ির নম্বর
        if (this.patterns.VEHICLE.test(trimmed)) {
            return {
                intent: "VEHICLE_NUMBER",
                confidence: 0.92,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // ৪. মূল্য
        const priceMatch = this.patterns.PRICE.exec(trimmed);
        if (priceMatch) {
            return {
                intent: "PRODUCT_PRICE",
                confidence: 0.94,
                extracted: priceMatch[1],
                needsClarification: false
            };
        }
        
        // ৫. ব্যবসার নাম
        if (this.patterns.BUSINESS_NAME.test(trimmed)) {
            return {
                intent: "BUSINESS_NAME",
                confidence: 0.88,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // ৬. ব্যাংক অ্যাকাউন্ট
        if (this.patterns.BANK_ACCOUNT.test(trimmed) && trimmed.length >= 9) {
            return {
                intent: "BANK_ACCOUNT",
                confidence: 0.85,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // ৭. PIN কোড
        if (this.patterns.PIN.test(trimmed)) {
            return {
                intent: "PIN_NUMBER",
                confidence: 0.90,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // ৮. নাম (ডিফল্ট)
        if (this.patterns.NAME.test(trimmed)) {
            return {
                intent: "NAME_ANALYSIS",
                confidence: 0.75,
                extracted: trimmed,
                needsClarification: true,
                clarificationQuestion: "এটি কি আপনার নিজের নাম, নাকি ব্যবসার নাম?",
                options: ["ব্যক্তির নাম", "ব্যবসার নাম"]
            };
        }
        
        // ৯. ক্ল্যারিফিকেশন প্রয়োজন
        return {
            intent: "UNKNOWN",
            confidence: 0.3,
            extracted: trimmed,
            needsClarification: true,
            clarificationQuestion: "আপনি কী জানতে চান? দয়া করে স্পষ্ট করে লিখুন। উদাহরণ: জন্মতারিখ, নাম, মোবাইল নম্বর ইত্যাদি।"
        };
    },
    
    // সংখ্যার রুট মান বের করা
    getRootNumber: function(num) {
        if (typeof num !== 'number') {
            num = parseInt(num);
        }
        if (isNaN(num)) return null;
        
        while (num > 9) {
            num = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        }
        return num;
    },
    
    // নাম থেকে সংখ্যা বের করা (বাংলা ফনেটিক কনভার্ট করে)
    getNameNumber: function(name) {
        // বাংলা অক্ষরকে ইংরেজি ফনেটিক মানে কনভার্ট করার ম্যাপ
        const phoneticMap = {
            'অ': 'a', 'আ': 'aa', 'ই': 'i', 'ঈ': 'ee', 'উ': 'u', 'ঊ': 'oo',
            'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
            'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
            'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'ny',
            'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
            'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
            'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
            'য': 'y', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
            'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y',
            'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n'
        };
        
        // পিথাগোরাস পদ্ধতিতে অক্ষরের মান
        const letterValue = {
            'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
            'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
            's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
        };
        
        // নামকে ফনেটিক ইংরেজিতে কনভার্ট
        let phonetic = '';
        for (let char of name.toLowerCase()) {
            if (phoneticMap[char]) {
                phonetic += phoneticMap[char];
            } else {
                phonetic += char;
            }
        }
        
        // অক্ষরের মান যোগ
        let sum = 0;
        for (let char of phonetic) {
            if (letterValue[char]) {
                sum += letterValue[char];
            }
        }
        
        return this.getRootNumber(sum);
    }
};

// Export for browser
if (typeof window !== 'undefined') {
    window.IntentDetector = IntentDetector;
}
