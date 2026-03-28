// intent-detector.js - স্মার্ট ইনটেন্ট ডিটেকশন (যেকোনো ইনপুট হ্যান্ডেল করে)

const IntentDetector = {
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
    
    // শুধু ইংরেজি অক্ষর কিনা চেক
    isOnlyEnglishLetters: function(str) {
        return /^[A-Za-z\s]+$/.test(str);
    },
    
    // শুধু বাংলা অক্ষর কিনা চেক
    isOnlyBengaliLetters: function(str) {
        return /^[ঙ-হ\s]+$/.test(str);
    },
    
    // মিশ্র অক্ষর (বাংলা+ইংরেজি+সংখ্যা) কিনা
    isMixed: function(str) {
        const hasBengali = /[ঙ-হ]/.test(str);
        const hasEnglish = /[A-Za-z]/.test(str);
        const hasNumber = /[0-9]/.test(str);
        return (hasBengali && hasEnglish) || (hasBengali && hasNumber) || (hasEnglish && hasNumber);
    },
    
    // গাড়ির নম্বর প্যাটার্ন চেক
    isVehicleNumber: function(str) {
        const cleaned = str.replace(/\s/g, '');
        // প্যাটার্ন: 2-3 অক্ষর + 2 সংখ্যা + 2 অক্ষর + 4 সংখ্যা
        const pattern1 = /^[A-Za-zঙ-হ]{2,3}[0-9]{2}[A-Za-zঙ-হ]{2}[0-9]{4}$/;
        // প্যাটার্ন: 2 অক্ষর + 2 সংখ্যা + 2 অক্ষর + 3-4 সংখ্যা
        const pattern2 = /^[A-Za-zঙ-হ]{2}[0-9]{2}[A-Za-zঙ-হ]{2}[0-9]{3,4}$/;
        return pattern1.test(cleaned) || pattern2.test(cleaned);
    },
    
    // মোবাইল নম্বর চেক (বাংলাদেশ)
    isPhoneNumber: function(str) {
        const cleaned = str.replace(/[^0-9]/g, '');
        // 11 ডিজিট, 01 দিয়ে শুরু
        return /^01[3-9]\d{8}$/.test(cleaned);
    },
    
    // তারিখ চেক (দিন-মাস-বছর)
    isDate: function(str) {
        const cleaned = str.replace(/[^0-9\/\-]/g, '');
        const patterns = [
            /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/,  // DD-MM-YYYY or DD/MM/YYYY
            /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/   // YYYY-MM-DD or YYYY/MM/DD
        ];
        for (let pattern of patterns) {
            if (pattern.test(cleaned)) {
                // দিন বের করে 1-31 এর মধ্যে কিনা চেক
                let day = null;
                if (cleaned.includes('-') || cleaned.includes('/')) {
                    const parts = cleaned.split(/[\/\-]/);
                    if (parts[0].length === 4) {
                        day = parseInt(parts[2]);
                    } else {
                        day = parseInt(parts[0]);
                    }
                }
                if (day && day >= 1 && day <= 31) {
                    return true;
                }
            }
        }
        return false;
    },
    
    // শুধু সংখ্যা চেক (PIN, ব্যাংক অ্যাকাউন্ট)
    isOnlyNumbers: function(str) {
        const cleaned = str.replace(/[^0-9]/g, '');
        return cleaned.length === str.replace(/\s/g, '').length && cleaned.length > 0;
    },
    
    // মূল্য চেক (টাকা উল্লেখ থাকলে)
    isPrice: function(str) {
        return /(\d{3,6})\s*(টাকা|টকা|taka|tk|BDT|৳)/i.test(str);
    },
    
    // ব্যবসার নাম চেক (কীওয়ার্ড থাকলে)
    isBusinessName: function(str) {
        const keywords = /(এন্টারপ্রাইজ|ফার্ম|ট্রেডার্স|ইন্ডাস্ট্রিজ|কোম্পানি|লিমিটেড|enterprise|firm|traders|industries|company|ltd|private|limited)/i;
        return keywords.test(str);
    },
    
    // নাম চেক (বাংলা বা ইংরেজি অক্ষর)
    isName: function(str) {
        const cleaned = str.trim();
        // শুধু অক্ষর এবং স্পেস
        const onlyLetters = /^[ঙ-হA-Za-z\s]+$/.test(cleaned);
        // দৈর্ঘ্য 3-50 অক্ষর
        const validLength = cleaned.length >= 2 && cleaned.length <= 50;
        // ব্যবসার নামের কীওয়ার্ড নেই
        const notBusiness = !this.isBusinessName(cleaned);
        return onlyLetters && validLength && notBusiness;
    },
    
    // প্রধান ডিটেকশন ফাংশন
    detect: function(input) {
        const trimmed = input.trim();
        const normalized = this.convertBengaliDigits(trimmed);
        
        // 1. খালি ইনপুট চেক
        if (!trimmed) {
            return {
                intent: "EMPTY",
                confidence: 1,
                extracted: trimmed,
                needsClarification: true,
                clarificationQuestion: "দয়া করে কিছু লিখুন। যেমন: আপনার জন্মতারিখ, নাম, মোবাইল নম্বর ইত্যাদি।"
            };
        }
        
        // 2. মূল্য ডিটেক্ট
        if (this.isPrice(trimmed)) {
            const priceMatch = trimmed.match(/(\d{3,6})/);
            if (priceMatch) {
                return {
                    intent: "PRODUCT_PRICE",
                    confidence: 0.95,
                    extracted: trimmed,
                    priceValue: priceMatch[1],
                    needsClarification: false
                };
            }
        }
        
        // 3. গাড়ির নম্বর ডিটেক্ট
        if (this.isVehicleNumber(trimmed)) {
            return {
                intent: "VEHICLE_NUMBER",
                confidence: 0.92,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // 4. মোবাইল নম্বর ডিটেক্ট
        if (this.isPhoneNumber(normalized)) {
            return {
                intent: "PHONE_NUMBER",
                confidence: 0.98,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // 5. তারিখ ডিটেক্ট
        if (this.isDate(trimmed)) {
            const mulank = NumerologyDB.calculateMulank(normalized);
            if (mulank) {
                return {
                    intent: "MULANK",
                    confidence: 0.95,
                    extracted: trimmed,
                    mulank: mulank,
                    needsClarification: false
                };
            }
        }
        
        // 6. শুধু সংখ্যা (PIN, ব্যাংক অ্যাকাউন্ট)
        if (this.isOnlyNumbers(trimmed)) {
            const digits = trimmed.replace(/[^0-9]/g, '');
            if (digits.length === 4 || digits.length === 5 || digits.length === 6) {
                return {
                    intent: "PIN_NUMBER",
                    confidence: 0.90,
                    extracted: trimmed,
                    needsClarification: false
                };
            } else if (digits.length >= 9 && digits.length <= 15) {
                return {
                    intent: "BANK_ACCOUNT",
                    confidence: 0.85,
                    extracted: trimmed,
                    needsClarification: false
                };
            } else {
                // সাধারণ সংখ্যা (যেমন: 1234, 56789 ইত্যাদি)
                return {
                    intent: "GENERAL_NUMBER",
                    confidence: 0.70,
                    extracted: trimmed,
                    needsClarification: true,
                    clarificationQuestion: "এটি কোন ধরনের নম্বর? দয়া করে নির্বাচন করুন:",
                    options: ["মোবাইল নম্বর", "গাড়ির নম্বর", "PIN কোড", "ব্যাংক অ্যাকাউন্ট", "শুধু সংখ্যা বিশ্লেষণ"]
                };
            }
        }
        
        // 7. ব্যবসার নাম ডিটেক্ট
        if (this.isBusinessName(trimmed)) {
            return {
                intent: "BUSINESS_NAME",
                confidence: 0.88,
                extracted: trimmed,
                needsClarification: false
            };
        }
        
        // 8. নাম ডিটেক্ট (বাংলা বা ইংরেজি অক্ষর)
        if (this.isName(trimmed)) {
            return {
                intent: "NAME_ANALYSIS",
                confidence: 0.80,
                extracted: trimmed,
                needsClarification: true,
                clarificationQuestion: "এটি কি ধরনের নাম?",
                options: ["ব্যক্তির নাম", "ব্যবসার নাম", "শিশুর নামকরণের জন্য"]
            };
        }
        
        // 9. মিশ্র অক্ষর বা অজানা ইনপুট
        if (this.isMixed(trimmed) || trimmed.length > 0) {
            return {
                intent: "UNKNOWN",
                confidence: 0.3,
                extracted: trimmed,
                needsClarification: true,
                clarificationQuestion: "আমি বুঝতে পারছি না। দয়া করে জানান আপনি কী জানতে চান:",
                options: ["জন্মতারিখ", "নাম বিশ্লেষণ", "মোবাইল নম্বর", "গাড়ির নম্বর", "ব্যবসার নাম", "পণ্যের মূল্য", "শুধু সংখ্যা"]
            };
        }
        
        // 10. ডিফল্ট
        return {
            intent: "GENERAL",
            confidence: 0.2,
            extracted: trimmed,
            needsClarification: true,
            clarificationQuestion: "আপনি কী জানতে চান? উদাহরণ: জন্মতারিখ, নাম, মোবাইল নম্বর, ব্যবসার নাম, পণ্যের মূল্য ইত্যাদি।"
        };
    },
    
    // নাম থেকে সংখ্যা বের করা
    getNumberFromName: function(name) {
        return NumerologyDB.calculateNameNumber(name);
    },
    
    // সংখ্যা থেকে রুট বের করা
    getRootNumber: function(num) {
        return NumerologyDB.getRootNumber(num);
    }
};

if (typeof window !== 'undefined') {
    window.IntentDetector = IntentDetector;
}
