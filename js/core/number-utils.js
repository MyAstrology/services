// ============================================================
// সংখ্যা গণনা ও টাইপ ডিটেকশন ইউটিলিটি
// ফাইল: js/core/number-utils.js
// ============================================================

const NumberUtils = {
    // ============================================================
    // ১. বাংলা ডিজিটকে ইংরেজি ডিজিটে কনভার্ট
    // ============================================================
    bengaliDigits: {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    },

    /**
     * বাংলা ডিজিটকে ইংরেজি ডিজিটে রূপান্তর
     * @param {string} str - ইনপুট স্ট্রিং
     * @returns {string} রূপান্তরিত স্ট্রিং
     */
    convertBengaliDigits: function(str) {
        if (!str) return str;
        let converted = str;
        for (let [bengali, english] of Object.entries(this.bengaliDigits)) {
            converted = converted.replace(new RegExp(bengali, 'g'), english);
        }
        return converted;
    },

    // ============================================================
    // ২. অক্ষর-সংখ্যা ম্যাপিং (কাবালা পদ্ধতি)
    // ============================================================
    // বাংলা ও ইংরেজি উভয় অক্ষরের জন্য মান নির্ধারণ
    letterValues: {
        // ইংরেজি অক্ষর (পিথাগোরাস/কাবালা পদ্ধতি)
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
        
        // য-বর্গ
        'য': 8, 'র': 9, 'ল': 1, 'শ': 2, 'ষ': 3, 'স': 4, 'হ': 5,
        
        // যুক্তাক্ষর ও বিশেষ
        'ড়': 9, 'ঢ়': 1, 'য়': 2, 'ং': 3, 'ঃ': 4, 'ঁ': 5
    },

    // ============================================================
    // ৩. ইনপুট থেকে সংখ্যা বের করার মূল ফাংশন
    // ============================================================
    
    /**
     * যেকোনো ইনপুট থেকে মূল সংখ্যা বের করে
     * @param {string} input - ইউজারের ইনপুট
     * @returns {object|null} { rootNumber, sum, digits, letterSum, numberSum }
     */
    extractNumber: function(input) {
        if (!input || input.trim() === "") return null;
        
        // ১. বাংলা ডিজিট কনভার্ট
        let converted = this.convertBengaliDigits(input);
        
        // ২. সংখ্যা বের করা
        const digits = converted.match(/[0-9]/g);
        let numberSum = 0;
        if (digits && digits.length > 0) {
            for (let d of digits) {
                numberSum += parseInt(d);
            }
        }
        
        // ৩. অক্ষর থেকে মান বের করা
        const lowerInput = input.toLowerCase();
        let letterSum = 0;
        for (let char of lowerInput) {
            if (this.letterValues[char]) {
                letterSum += this.letterValues[char];
            }
        }
        
        // ৪. মোট যোগফল
        let totalSum = numberSum + letterSum;
        
        // ৫. যদি কিছুই না পাওয়া যায় (খালি বা অজানা অক্ষর)
        if (totalSum === 0) {
            for (let i = 0; i < input.length; i++) {
                totalSum += input.charCodeAt(i);
            }
        }
        
        // ৬. রুট নাম্বারে নিয়ে আসা (১-৯)
        let rootNumber = totalSum;
        while (rootNumber > 9) {
            rootNumber = rootNumber.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        }
        
        return {
            rootNumber: rootNumber,
            sum: totalSum,
            digits: digits || [],
            letterSum: letterSum,
            numberSum: numberSum
        };
    },

    // ============================================================
    // ৪. রুট নাম্বার বের করার হেল্পার
    // ============================================================
    
    /**
     * যেকোনো সংখ্যাকে রুট নাম্বারে (১-৯) নিয়ে আসে
     * @param {number} num - যেকোনো সংখ্যা
     * @returns {number|null} রুট নাম্বার (১-৯)
     */
    getRootNumber: function(num) {
        if (typeof num !== 'number') {
            num = parseInt(num);
        }
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
    
    /**
     * জন্মতারিখ থেকে মূলাংক (দিনের অংক) বের করে
     * @param {string} dateString - তারিখ (DD-MM-YYYY বা DD/MM/YYYY বা YYYY-MM-DD)
     * @returns {number|null} মূলাংক (১-৯)
     */
    getMulankFromDate: function(dateString) {
        if (!dateString) return null;
        
        let day = null;
        
        // DD-MM-YYYY ফরম্যাট
        let match = dateString.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (match) {
            day = parseInt(match[1]);
        }
        
        // YYYY-MM-DD ফরম্যাট
        if (!day) {
            match = dateString.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
            if (match) {
                day = parseInt(match[3]);
            }
        }
        
        // শুধু সংখ্যা (DDMMYYYY বা DDMMYY)
        if (!day && /^\d+$/.test(dateString)) {
            if (dateString.length === 8) {
                day = parseInt(dateString.substring(0, 2));
            } else if (dateString.length === 6) {
                day = parseInt(dateString.substring(0, 2));
            } else if (dateString.length === 4) {
                day = parseInt(dateString.substring(0, 2));
            } else if (dateString.length === 2) {
                day = parseInt(dateString);
            }
        }
        
        if (!day || isNaN(day)) return null;
        
        return this.getRootNumber(day);
    },

    // ============================================================
    // ৬. ইনপুটের টাইপ ডিটেক্ট করা
    // ============================================================
    
    /**
     * ইনপুটের টাইপ নির্ণয়
     * @param {string} input - ইউজারের ইনপুট
     * @returns {string} টাইপ: 'date', 'mobile', 'vehicle', 'price', 'business', 'name', 'pin', 'bank', 'number', 'unknown'
     */
    detectType: function(input) {
        const trimmed = input.trim();
        
        // ১. তারিখ (DD-MM-YYYY বা DD/MM/YYYY)
        if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(trimmed)) {
            return 'date';
        }
        
        // ২. মোবাইল নম্বর (বাংলাদেশ: 01XXXXXXXXX)
        const cleaned = trimmed.replace(/[^0-9]/g, '');
        if (/^01[3-9]\d{8}$/.test(cleaned)) {
            return 'mobile';
        }
        
        // ৩. গাড়ির নম্বর (প্যাটার্ন: AB12CD1234 বা AB 12 CD 1234)
        if (/^[A-Za-zঙ-হ]{2}\s?\d{2}\s?[A-Za-zঙ-হ]{2}\s?\d{3,4}$/i.test(trimmed)) {
            return 'vehicle';
        }
        
        // ৪. মূল্য (টাকা উল্লেখ থাকলে)
        if (/(\d{3,6})\s*(টাকা|টকা|taka|tk|BDT|৳)/i.test(trimmed)) {
            return 'price';
        }
        
        // ৫. ব্যবসার নাম (কীওয়ার্ড থাকলে)
        if (/(এন্টারপ্রাইজ|ফার্ম|ট্রেডার্স|ইন্ডাস্ট্রিজ|কোম্পানি|লিমিটেড|enterprise|firm|traders|industries|company|ltd|private|limited)/i.test(trimmed)) {
            return 'business';
        }
        
        // ৬. শুধু বাংলা অক্ষর (নাম)
        if (/^[ঙ-হ\s]{3,40}$/.test(trimmed)) {
            return 'name';
        }
        
        // ৭. শুধু ইংরেজি অক্ষর (নাম)
        if (/^[A-Za-z\s]{3,40}$/.test(trimmed)) {
            return 'name';
        }
        
        // ৮. শুধু সংখ্যা
        if (/^\d+$/.test(trimmed)) {
            // 8 ডিজিট: DDMMYYYY তারিখ হতে পারে
            if (trimmed.length === 8) {
                const day = parseInt(trimmed.substring(0, 2));
                const month = parseInt(trimmed.substring(2, 4));
                const year = parseInt(trimmed.substring(4, 8));
                if (this.isValidDate(day, month, year)) {
                    return 'date';
                }
            }
            // 6 ডিজিট: DDMMYY তারিখ হতে পারে
            if (trimmed.length === 6) {
                const day = parseInt(trimmed.substring(0, 2));
                const month = parseInt(trimmed.substring(2, 4));
                const year = 2000 + parseInt(trimmed.substring(4, 6));
                if (this.isValidDate(day, month, year)) {
                    return 'date';
                }
            }
            // 4 ডিজিট: DDMM তারিখ হতে পারে
            if (trimmed.length === 4) {
                const day = parseInt(trimmed.substring(0, 2));
                const month = parseInt(trimmed.substring(2, 4));
                if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
                    return 'date';
                }
            }
            // 2 ডিজিট: দিন হতে পারে
            if (trimmed.length === 2) {
                const day = parseInt(trimmed);
                if (day >= 1 && day <= 31) {
                    return 'date';
                }
            }
            
            // PIN কোড (4-6 ডিজিট)
            if (trimmed.length >= 4 && trimmed.length <= 6) {
                return 'pin';
            }
            
            // ব্যাংক অ্যাকাউন্ট (9-15 ডিজিট)
            if (trimmed.length >= 9 && trimmed.length <= 15) {
                return 'bank';
            }
            
            return 'number';
        }
        
        return 'unknown';
    },

    // ============================================================
    // ৭. তারিখ বৈধতা যাচাই
    // ============================================================
    
    /**
     * তারিখ বৈধ কিনা যাচাই করে
     * @param {number} day - দিন (1-31)
     * @param {number} month - মাস (1-12)
     * @param {number} year - বছর
     * @returns {boolean} বৈধ হলে true
     */
    isValidDate: function(day, month, year) {
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // লিপ ইয়ার চেক
        if (month === 2) {
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            if (day > (isLeap ? 29 : 28)) return false;
        } else {
            if (day > daysInMonth[month - 1]) return false;
        }
        
        return true;
    },

    // ============================================================
    // ৮. মাল্টি-ইনপুট পার্সিং
    // ============================================================
    
    /**
     * "+", "এবং", "," ইত্যাদি দিয়ে আলাদা করা ইনপুট পার্স করে
     * @param {string} input - ইউজারের ইনপুট
     * @returns {array} পার্স করা আইটেমের অ্যারে [{raw, type, number}]
     */
    parseMultiInput: function(input) {
        const separators = /[\+\&\|\,\s+(এবং)\s+(and)\s+]+/i;
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
    // ৯. মাল্টি-ইনপুট কিনা চেক
    // ============================================================
    
    /**
     * ইনপুটে একাধিক আইটেম আছে কিনা চেক করে
     * @param {string} input - ইউজারের ইনপুট
     * @returns {boolean} একাধিক হলে true
     */
    isMultiInput: function(input) {
        const separators = /[\+\&\|\,\s+(এবং)\s+(and)\s+]+/i;
        const parts = input.split(separators).filter(p => p.trim().length > 0);
        return parts.length > 1;
    },

    // ============================================================
    // ১০. যুক্তিপূর্ণ ইনপুট কিনা চেক (স্মার্ট)
    // ============================================================
    
    /**
     * ইনপুট যুক্তিপূর্ণ কিনা চেক করে (অটো-ডিটেক্টের জন্য)
     * @param {string} input - ইউজারের ইনপুট
     * @returns {boolean} যুক্তিপূর্ণ হলে true
     */
    isMeaningful: function(input) {
        const trimmed = input.trim();
        
        // তারিখ ফরম্যাট
        if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(trimmed)) return true;
        
        // মোবাইল নম্বর
        if (/^01[3-9]\d{8}$/.test(trimmed.replace(/[^0-9]/g, ''))) return true;
        
        // গাড়ির নম্বর
        if (/^[A-Za-zঙ-হ]{2}\s?\d{2}\s?[A-Za-zঙ-হ]{2}\s?\d{4}$/i.test(trimmed)) return true;
        
        // মূল্য
        if (/(\d{3,6})\s*(টাকা|taka)/i.test(trimmed)) return true;
        
        // ব্যবসার নাম
        if (/(এন্টারপ্রাইজ|ফার্ম|ট্রেডার্স|enterprise|firm)/i.test(trimmed)) return true;
        
        // শুধু বাংলা অক্ষর (নাম)
        if (/^[ঙ-হ\s]{3,40}$/.test(trimmed)) return true;
        
        // শুধু ইংরেজি অক্ষর (নাম)
        if (/^[A-Za-z\s]{3,40}$/.test(trimmed)) return true;
        
        // শুধু সংখ্যা
        if (/^\d+$/.test(trimmed)) {
            // তারিখ হতে পারে কিনা চেক
            if (trimmed.length === 8) {
                const day = parseInt(trimmed.substring(0, 2));
                const month = parseInt(trimmed.substring(2, 4));
                const year = parseInt(trimmed.substring(4, 8));
                if (this.isValidDate(day, month, year)) return true;
            }
            if (trimmed.length === 6) {
                const day = parseInt(trimmed.substring(0, 2));
                const month = parseInt(trimmed.substring(2, 4));
                const year = 2000 + parseInt(trimmed.substring(4, 6));
                if (this.isValidDate(day, month, year)) return true;
            }
            if (trimmed.length === 4) {
                const day = parseInt(trimmed.substring(0, 2));
                const month = parseInt(trimmed.substring(2, 4));
                if (day >= 1 && day <= 31 && month >= 1 && month <= 12) return true;
            }
            if (trimmed.length === 2) {
                const day = parseInt(trimmed);
                if (day >= 1 && day <= 31) return true;
            }
            return false;
        }
        
        return false;
    }
};

// ============================================================
// Node.js ও Browser উভয় পরিবেশের জন্য এক্সপোর্ট
// ============================================================
if (typeof window !== 'undefined') {
    window.NumberUtils = NumberUtils;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberUtils;
}
