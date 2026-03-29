// ============================================================
// number-utils.js — সংখ্যা গণনা ও টাইপ ডিটেকশন ইউটিলিটি
// ফাইল: js/core/number-utils.js
// আপডেট: ভারতীয়, বাংলাদেশ, US/UK মোবাইল নম্বর detection যোগ
// ============================================================

const NumberUtils = {

    // ============================================================
    // ১. বাংলা ডিজিটকে ইংরেজি ডিজিটে কনভার্ট
    // ============================================================
    bengaliDigits: {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    },

    convertBengaliDigits: function(str) {
        if (!str) return str;
        let converted = str;
        for (let [bengali, english] of Object.entries(this.bengaliDigits)) {
            converted = converted.replace(new RegExp(bengali, 'g'), english);
        }
        return converted;
    },

    // ============================================================
    // ২. অক্ষর-সংখ্যা ম্যাপিং (কাবালা/Chaldean পদ্ধতি)
    // ============================================================
    letterValues: {
        // ইংরেজি
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
        'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
        's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
        // বাংলা স্বরবর্ণ
        'অ': 1, 'আ': 2, 'ই': 3, 'ঈ': 4, 'উ': 5, 'ঊ': 6, 'ঋ': 7, 'এ': 8, 'ঐ': 9,
        'ও': 1, 'ঔ': 2,
        // ক-বর্গ
        'ক': 1, 'খ': 2, 'গ': 3, 'ঘ': 4, 'ঙ': 5,
        // চ-বর্গ
        'চ': 6, 'ছ': 7, 'জ': 8, 'ঝ': 9, 'ঞ': 1,
        // ট-বর্গ
        'ট': 2, 'ঠ': 3, 'ড': 4, 'ঢ': 5, 'ণ': 6,
        // ত-বর্গ
        'ত': 7, 'থ': 8, 'দ': 9, 'ধ': 1, 'ন': 2,
        // প-বর্গ
        'প': 3, 'ফ': 4, 'ব': 5, 'ভ': 6, 'ম': 7,
        // য-বর্গ ও বিশেষ
        'য': 8, 'র': 9, 'ল': 1, 'শ': 2, 'ষ': 3, 'স': 4, 'হ': 5,
        'ড়': 9, 'ঢ়': 1, 'য়': 2, 'ং': 3, 'ঃ': 4, 'ঁ': 5
    },

    // ============================================================
    // ৩. ইনপুট থেকে সংখ্যা বের করার মূল ফাংশন
    // ============================================================
    extractNumber: function(input) {
        if (!input || input.trim() === "") return null;
        let converted = this.convertBengaliDigits(input);
        const digits = converted.match(/[0-9]/g);
        let numberSum = 0;
        if (digits && digits.length > 0) {
            for (let d of digits) numberSum += parseInt(d);
        }
        const lowerInput = input.toLowerCase();
        let letterSum = 0;
        for (let char of lowerInput) {
            if (this.letterValues[char]) letterSum += this.letterValues[char];
        }
        let totalSum = numberSum + letterSum;
        if (totalSum === 0) {
            for (let i = 0; i < input.length; i++) totalSum += input.charCodeAt(i);
        }
        let rootNumber = totalSum;
        while (rootNumber > 9) {
            rootNumber = rootNumber.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        }
        return { rootNumber, sum: totalSum, digits: digits || [], letterSum, numberSum };
    },

    // ============================================================
    // ৪. রুট নাম্বার হেল্পার
    // ============================================================
    getRootNumber: function(num) {
        if (typeof num !== 'number') num = parseInt(num);
        if (isNaN(num)) return null;
        let root = num;
        while (root > 9) {
            root = root.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        }
        return root;
    },

    // ============================================================
    // ৫. তারিখ থেকে মূলাংক বের করা
    // ============================================================
    getMulankFromDate: function(dateString) {
        if (!dateString) return null;
        let day = null;
        let match = dateString.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (match) day = parseInt(match[1]);
        if (!day) {
            match = dateString.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
            if (match) day = parseInt(match[3]);
        }
        if (!day && /^\d+$/.test(dateString)) {
            if (dateString.length === 8) day = parseInt(dateString.substring(0, 2));
            else if (dateString.length === 6) day = parseInt(dateString.substring(0, 2));
            else if (dateString.length === 4) day = parseInt(dateString.substring(0, 2));
            else if (dateString.length === 2) day = parseInt(dateString);
        }
        if (!day || isNaN(day)) return null;
        return this.getRootNumber(day);
    },

    // ============================================================
    // ৬. মোবাইল নম্বর যাচাই — India + Bangladesh + US/UK
    //    ★ আপডেট করা হয়েছে
    // ============================================================
    /**
     * মোবাইল নম্বর কিনা চেক করে
     * @param {string} str - যেকোনো ফরম্যাটে নম্বর (space, dash সহ)
     * @returns {boolean}
     * 
     * সমর্থিত ফরম্যাট:
     * — ভারত (India): 10 digit (6-9 দিয়ে শুরু) যেমন: 9333122768
     * — ভারত (India) country code: +91XXXXXXXXXX যেমন: 919333122768
     * — বাংলাদেশ: 11 digit (01[3-9]XXXXXXXX) যেমন: 01712345678
     * — বাংলাদেশ country code: +880-01XXXXXXXXX
     * — US/Canada: 10 digit (2-9 দিয়ে শুরু) যেমন: 2025551234
     * — US with country code: 1XXXXXXXXXX
     * — UK: 11 digit (07 দিয়ে শুরু) যেমন: 07911123456
     * — UK country code: 44XXXXXXXXXX
     */
    isPhoneNumber: function(str) {
        const cleaned = str.replace(/[\s\-\(\)\+\.]/g, '');

        // ভারত (India): 10 digits, starts with 6, 7, 8, or 9
        if (/^[6-9]\d{9}$/.test(cleaned)) return true;

        // ভারত country code +91: 12 digits total
        if (/^91[6-9]\d{9}$/.test(cleaned)) return true;

        // বাংলাদেশ: 11 digits, 01[3-9]XXXXXXXX
        if (/^01[3-9]\d{8}$/.test(cleaned)) return true;

        // বাংলাদেশ country code +880: 880-01XXXXXXXXX
        if (/^8801[3-9]\d{8}$/.test(cleaned)) return true;

        // US/Canada: 10 digits starting with 2-9
        if (/^[2-9]\d{9}$/.test(cleaned)) return true;

        // US/Canada with country code 1: 11 digits
        if (/^1[2-9]\d{9}$/.test(cleaned)) return true;

        // UK: 11 digits starting with 07
        if (/^07\d{9}$/.test(cleaned)) return true;

        // UK country code +44: 44 followed by 10 digits
        if (/^44\d{10}$/.test(cleaned)) return true;

        return false;
    },

    // ============================================================
    // ৭. ইনপুটের টাইপ ডিটেক্ট করা
    //    ★ মোবাইল detection আপডেট করা হয়েছে
    // ============================================================
    detectType: function(input) {
        const trimmed = input.trim();
        const converted = this.convertBengaliDigits(trimmed);

        // ১. তারিখ (DD-MM-YYYY বা DD/MM/YYYY)
        if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(converted)) {
            return 'date';
        }

        // ২. মোবাইল নম্বর (India + Bangladesh + US + UK)
        const digitsOnly = converted.replace(/[\s\-\(\)\+\.]/g, '');
        if (this.isPhoneNumber(trimmed)) {
            return 'mobile';
        }

        // ৩. গাড়ির নম্বর (AB12CD1234 প্যাটার্ন)
        if (/^[A-Za-zঙ-হ]{2}\s?\d{2}\s?[A-Za-zঙ-হ]{2}\s?\d{3,4}$/i.test(converted)) {
            return 'vehicle';
        }

        // ৪. মূল্য (টাকা / Rupee উল্লেখ থাকলে)
        if (/(\d{2,6})\s*(টাকা|টকা|taka|tk|BDT|INR|Rs|₹|৳)/i.test(trimmed)) {
            return 'price';
        }

        // ৫. ব্যবসার নাম (কীওয়ার্ড থাকলে)
        if (/(এন্টারপ্রাইজ|ফার্ম|ট্রেডার্স|ইন্ডাস্ট্রিজ|কোম্পানি|লিমিটেড|enterprise|firm|traders|industries|company|ltd|pvt|private|limited)/i.test(trimmed)) {
            return 'business';
        }

        // ৬. শুধু বাংলা অক্ষর (নাম)
        if (/^[\u0980-\u09FF\s]{3,40}$/.test(trimmed)) {
            return 'name';
        }

        // ৭. শুধু ইংরেজি অক্ষর (নাম)
        if (/^[A-Za-z\s]{3,40}$/.test(trimmed)) {
            return 'name';
        }

        // ৮. শুধু সংখ্যা
        if (/^\d+$/.test(digitsOnly) && digitsOnly === converted.replace(/\s/g,'')) {
            const n = digitsOnly;

            // DDMMYYYY তারিখ হতে পারে (8 digits)
            if (n.length === 8) {
                const day = parseInt(n.substring(0, 2));
                const month = parseInt(n.substring(2, 4));
                const year = parseInt(n.substring(4, 8));
                if (this.isValidDate(day, month, year)) return 'date';
            }
            // DDMMYY (6 digits)
            if (n.length === 6) {
                const day = parseInt(n.substring(0, 2));
                const month = parseInt(n.substring(2, 4));
                const year = 2000 + parseInt(n.substring(4, 6));
                if (this.isValidDate(day, month, year)) return 'date';
            }
            // DDMM (4 digits)
            if (n.length === 4) {
                const day = parseInt(n.substring(0, 2));
                const month = parseInt(n.substring(2, 4));
                if (day >= 1 && day <= 31 && month >= 1 && month <= 12) return 'date';
            }
            // দিন (2 digits)
            if (n.length === 2) {
                const day = parseInt(n);
                if (day >= 1 && day <= 31) return 'date';
            }
            // PIN কোড (4-6 digits)
            if (n.length >= 4 && n.length <= 6) return 'pin';
            // ব্যাংক অ্যাকাউন্ট (9-18 digits)
            if (n.length >= 9 && n.length <= 18) return 'bank';

            return 'number';
        }

        return 'unknown';
    },

    // ============================================================
    // ৮. তারিখ বৈধতা যাচাই
    // ============================================================
    isValidDate: function(day, month, year) {
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month === 2) {
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            if (day > (isLeap ? 29 : 28)) return false;
        } else {
            if (day > daysInMonth[month - 1]) return false;
        }
        return true;
    },

    // ============================================================
    // ৯. মাল্টি-ইনপুট পার্সিং
    // ============================================================
    parseMultiInput: function(input) {
        const separators = /[\+\&\|\,]+|\s+(?:এবং|and)\s+/i;
        const parts = input.split(separators).filter(p => p.trim().length > 0);
        return parts.map(part => {
            const trimmed = part.trim();
            const numberData = this.extractNumber(trimmed);
            return {
                raw: trimmed,
                type: this.detectType(trimmed),
                number: numberData ? numberData.rootNumber : null,
                fullData: numberData
            };
        }).filter(item => item.number !== null);
    },

    // ============================================================
    // ১০. মাল্টি-ইনপুট কিনা চেক
    // ============================================================
    isMultiInput: function(input) {
        const separators = /[\+\&\|\,]|\s+(?:এবং|and)\s+/i;
        const parts = input.split(separators).filter(p => p.trim().length > 0);
        return parts.length > 1;
    },

    // ============================================================
    // ১১. যুক্তিপূর্ণ ইনপুট চেক (স্মার্ট)
    //     ★ মোবাইল detection আপডেট করা হয়েছে
    // ============================================================
    isMeaningful: function(input) {
        const trimmed = input.trim();
        const converted = this.convertBengaliDigits(trimmed);

        // তারিখ
        if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(converted)) return true;

        // মোবাইল নম্বর (India + Bangladesh + US + UK)
        if (this.isPhoneNumber(trimmed)) return true;

        // গাড়ির নম্বর
        if (/^[A-Za-zঙ-হ]{2}\s?\d{2}\s?[A-Za-zঙ-হ]{2}\s?\d{4}$/i.test(converted)) return true;

        // মূল্য
        if (/(\d{2,6})\s*(টাকা|taka|INR|Rs)/i.test(trimmed)) return true;

        // ব্যবসার নাম
        if (/(এন্টারপ্রাইজ|ফার্ম|ট্রেডার্স|enterprise|firm|traders)/i.test(trimmed)) return true;

        // শুধু বাংলা অক্ষর (নাম)
        if (/^[\u0980-\u09FF\s]{3,40}$/.test(trimmed)) return true;

        // শুধু ইংরেজি অক্ষর (নাম)
        if (/^[A-Za-z\s]{3,40}$/.test(trimmed)) return true;

        // শুধু সংখ্যা
        const digitsOnly = converted.replace(/\D/g, '');
        if (/^\d+$/.test(digitsOnly)) {
            const n = digitsOnly;
            if (n.length === 8) {
                const day = parseInt(n.substring(0, 2));
                const month = parseInt(n.substring(2, 4));
                const year = parseInt(n.substring(4, 8));
                if (this.isValidDate(day, month, year)) return true;
            }
            if (n.length === 6) {
                const day = parseInt(n.substring(0, 2));
                const month = parseInt(n.substring(2, 4));
                const year = 2000 + parseInt(n.substring(4, 6));
                if (this.isValidDate(day, month, year)) return true;
            }
            if (n.length === 4) {
                const day = parseInt(n.substring(0, 2));
                const month = parseInt(n.substring(2, 4));
                if (day >= 1 && day <= 31 && month >= 1 && month <= 12) return true;
            }
            if (n.length === 2) {
                const day = parseInt(n);
                if (day >= 1 && day <= 31) return true;
            }
            return false;
        }

        return false;
    }

}; // end NumberUtils

// ============================================================
// Export
// ============================================================
if (typeof window !== 'undefined') {
    window.NumberUtils = NumberUtils;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberUtils;
}
