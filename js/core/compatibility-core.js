// ============================================================
// সামঞ্জস্য গণনার কোর লজিক
// ফাইল: js/core/compatibility-core.js
// ============================================================

const CompatibilityCore = {
    // ============================================================
    // ১. জোড়াভিত্তিক বিশ্লেষণ
    // ============================================================
    
    /**
     * দুটি আইটেমের মধ্যে সামঞ্জস্য বিশ্লেষণ
     * @param {string} item1 - প্রথম আইটেমের বিবরণ
     * @param {string} item2 - দ্বিতীয় আইটেমের বিবরণ
     * @param {number} num1 - প্রথম সংখ্যা
     * @param {number} num2 - দ্বিতীয় সংখ্যা
     * @returns {object} বিশ্লেষণ ফলাফল
     */
    analyzePair: function(item1, item2, num1, num2) {
        // গ্রহের তথ্য
        const planet1 = PlanetRelations.planets[num1];
        const planet2 = PlanetRelations.planets[num2];
        
        // সম্পর্ক নির্ণয়
        const relation = PlanetRelations.getRelation(num1, num2);
        const score = PlanetRelations.getScore(num1, num2);
        
        // সম্পর্কের ধরন
        let relationType = '';
        let relationEmoji = '';
        
        switch(relation) {
            case 'special-friend':
                relationType = 'মিত্র (বিশেষ)';
                relationEmoji = '🌟';
                break;
            case 'friend':
                relationType = 'মিত্র';
                relationEmoji = '🤝';
                break;
            case 'neutral':
                relationType = 'নিরপেক্ষ';
                relationEmoji = '⚖️';
                break;
            case 'special-enemy':
                relationType = 'শত্রু (বিশেষ)';
                relationEmoji = '⚠️';
                break;
            case 'enemy':
                relationType = 'শত্রু';
                relationEmoji = '⚔️';
                break;
            case 'same':
                relationType = 'একই গ্রহ';
                relationEmoji = '🔄';
                break;
            default:
                relationType = 'নিরপেক্ষ';
                relationEmoji = '⚖️';
        }
        
        // স্কোরের স্তর
        const level = this.getScoreLevel(score);
        
        return {
            item1: item1,
            item2: item2,
            num1: num1,
            num2: num2,
            planet1: planet1.name,
            planet2: planet2.name,
            planet1En: planet1.nameEn,
            planet2En: planet2.nameEn,
            relation: relation,
            relationType: relationType,
            relationEmoji: relationEmoji,
            score: score,
            level: level,
            analysis: PlanetRelations.getAnalysis(num1, num2),
            remedy: PlanetRelations.getRemedy(num1, num2)
        };
    },

    // ============================================================
    // ২. সব জোড়ার সামগ্রিক বিশ্লেষণ
    // ============================================================
    
    /**
     * একাধিক আইটেমের সব জোড়ার সামঞ্জস্য বিশ্লেষণ
     * @param {array} items - আইটেমের অ্যারে ['নাম', 'তারিখ', ...]
     * @param {array} numbers - সংখ্যার অ্যারে [5, 6, 3, ...]
     * @returns {object} সম্পূর্ণ বিশ্লেষণ ফলাফল
     */
    analyzeAllPairs: function(items, numbers) {
        if (!items || !numbers || items.length < 2) {
            return null;
        }
        
        const pairs = [];
        const scores = [];
        
        // সব জোড়ার বিশ্লেষণ
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const pair = this.analyzePair(items[i], items[j], numbers[i], numbers[j]);
                pairs.push(pair);
                scores.push(pair.score);
            }
        }
        
        // গড় স্কোর
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const level = this.getScoreLevel(avgScore);
        
        // সবচেয়ে ভালো ও সবচেয়ে খারাপ জোড়া
        const bestPair = [...pairs].sort((a, b) => b.score - a.score)[0];
        const worstPair = [...pairs].sort((a, b) => a.score - b.score)[0];
        
        // সামগ্রিক বিশ্লেষণ
        const overallAnalysis = this.getOverallAnalysis(items, pairs, avgScore, level);
        const overallRemedy = this.getOverallRemedy(pairs);
        const summary = this.getSummary(pairs, avgScore, level);
        
        return {
            items: items,
            numbers: numbers,
            pairs: pairs,
            avgScore: avgScore,
            level: level,
            bestPair: bestPair,
            worstPair: worstPair,
            overallAnalysis: overallAnalysis,
            overallRemedy: overallRemedy,
            summary: summary
        };
    },

    // ============================================================
    // ৩. স্কোরের স্তর নির্ণয়
    // ============================================================
    
    /**
     * স্কোর অনুযায়ী স্তর নির্ণয়
     * @param {number} score - স্কোর (0-100)
     * @returns {object} স্তরের তথ্য
     */
    getScoreLevel: function(score) {
        if (score >= 85) {
            return {
                name: "অত্যন্ত শুভ",
                nameEn: "Excellent",
                emoji: "🌟",
                color: "#ffd700",
                description: "এই সামঞ্জস্য অত্যন্ত শুভ। গ্রহগুলো পরস্পরের মিত্র। জীবনে সাফল্য, স্থিতিশীলতা ও সুখ বয়ে আনবে।"
            };
        } else if (score >= 70) {
            return {
                name: "শুভ",
                nameEn: "Good",
                emoji: "✅",
                color: "#90be6d",
                description: "এই সামঞ্জস্য শুভ। অধিকাংশ গ্রহ পরস্পরের মিত্র বা নিরপেক্ষ। সচেতন থাকলে ভালো ফল পাবেন।"
            };
        } else if (score >= 50) {
            return {
                name: "মধ্যম",
                nameEn: "Average",
                emoji: "⚠️",
                color: "#f9c74f",
                description: "এই সামঞ্জস্য মধ্যম। কিছু ক্ষেত্রে সামঞ্জস্য থাকলেও কিছু ক্ষেত্রে সতর্কতা প্রয়োজন।"
            };
        } else {
            return {
                name: "অশুভ",
                nameEn: "Poor",
                emoji: "⚠️",
                color: "#f9844a",
                description: "এই সামঞ্জস্য অশুভ। গ্রহগুলো পরস্পরের শত্রু। বাধা ও দ্বন্দ্ব আসতে পারে। প্রতিকার প্রয়োজন।"
            };
        }
    },

    // ============================================================
    // ৪. সামগ্রিক বিশ্লেষণ তৈরি
    // ============================================================
    
    /**
     * সামগ্রিক বিশ্লেষণের বিস্তারিত ব্যাখ্যা
     * @param {array} items - আইটেমের অ্যারে
     * @param {array} pairs - জোড়ার অ্যারে
     * @param {number} avgScore - গড় স্কোর
     * @param {object} level - স্তরের তথ্য
     * @returns {string} বিস্তারিত ব্যাখ্যা
     */
    getOverallAnalysis: function(items, pairs, avgScore, level) {
        const itemCount = items.length;
        const pairCount = pairs.length;
        
        let analysis = `আপনার প্রদত্ত ${itemCount}টি উপাদানের মধ্যে `;
        
        if (avgScore >= 85) {
            analysis += `অত্যন্ত শুভ সামঞ্জস্য রয়েছে। সবগুলো জোড়ার গড় স্কোর ${avgScore}%। `;
            analysis += `গ্রহগুলো পরস্পরের মিত্র। আপনার জীবনে এই সমন্বয় সাফল্য, স্থিতিশীলতা ও সুখ বয়ে আনবে। `;
            
            const bestPair = pairs.reduce((a, b) => a.score > b.score ? a : b);
            analysis += `বিশেষ করে "${bestPair.item1}" ও "${bestPair.item2}"-এর মধ্যে সম্পর্ক অত্যন্ত শক্তিশালী।`;
            
        } else if (avgScore >= 70) {
            analysis += `শুভ সামঞ্জস্য রয়েছে। সবগুলো জোড়ার গড় স্কোর ${avgScore}%। `;
            analysis += `অধিকাংশ গ্রহ পরস্পরের মিত্র বা নিরপেক্ষ। কিছু সতর্কতা প্রয়োজন হলেও সামগ্রিকভাবে ফলপ্রসূ হবে। `;
            
            const neutralPairs = pairs.filter(p => p.relation === 'neutral');
            if (neutralPairs.length > 0) {
                analysis += `নিরপেক্ষ সম্পর্কের জোড়াগুলোতে সচেতন থাকলে ভালো ফল পাবেন।`;
            }
            
        } else if (avgScore >= 50) {
            analysis += `মধ্যম সামঞ্জস্য রয়েছে। সবগুলো জোড়ার গড় স্কোর ${avgScore}%। `;
            analysis += `কিছু জোড়ায় সামঞ্জস্য থাকলেও কিছু জোড়ায় সতর্কতা প্রয়োজন। `;
            
            const enemyPairs = pairs.filter(p => p.relation === 'enemy' || p.relation === 'special-enemy');
            if (enemyPairs.length > 0) {
                analysis += `শত্রু সম্পর্কের জোড়াগুলোতে বিশেষ নজর দিন।`;
            }
            
        } else {
            analysis += `অশুভ সামঞ্জস্য রয়েছে। সবগুলো জোড়ার গড় স্কোর ${avgScore}%। `;
            analysis += `গ্রহগুলো পরস্পরের শত্রু। এই সমন্বয়ে বাধা ও দ্বন্দ্ব আসতে পারে। `;
            analysis += `নিচের প্রতিকারগুলো অনুসরণ করুন।`;
        }
        
        return analysis;
    },

    // ============================================================
    // ৫. সামগ্রিক প্রতিকার তৈরি
    // ============================================================
    
    /**
     * সব জোড়ার ভিত্তিতে সামগ্রিক প্রতিকার তৈরি
     * @param {array} pairs - জোড়ার অ্যারে
     * @returns {string} সামগ্রিক প্রতিকার
     */
    getOverallRemedy: function(pairs) {
        const enemyPairs = pairs.filter(p => p.relation === 'enemy' || p.relation === 'special-enemy');
        
        if (enemyPairs.length === 0) {
            return "সামগ্রিকভাবে শুভ সম্পর্ক। আরও উন্নতির জন্য শুভ দিনে দান করুন ও নিয়মিত ধ্যান করুন।";
        }
        
        let remedy = "শত্রু সম্পর্কের জোড়াগুলোর জন্য বিশেষ প্রতিকার প্রয়োজন:\n\n";
        
        enemyPairs.forEach((pair, index) => {
            remedy += `${index + 1}. "${pair.item1}" ও "${pair.item2}" — ${pair.remedy}\n\n`;
        });
        
        remedy += "সকল প্রতিকার নিয়মিত অনুসরণ করলে সম্পর্কের উন্নতি হবে।";
        
        return remedy;
    },

    // ============================================================
    // ৬. সংক্ষিপ্ত সারাংশ তৈরি
    // ============================================================
    
    /**
     * ফলাফলের সংক্ষিপ্ত সারাংশ
     * @param {array} pairs - জোড়ার অ্যারে
     * @param {number} avgScore - গড় স্কোর
     * @param {object} level - স্তরের তথ্য
     * @returns {object} সংক্ষিপ্ত সারাংশ
     */
    getSummary: function(pairs, avgScore, level) {
        const friendCount = pairs.filter(p => p.relation === 'friend' || p.relation === 'special-friend').length;
        const neutralCount = pairs.filter(p => p.relation === 'neutral').length;
        const enemyCount = pairs.filter(p => p.relation === 'enemy' || p.relation === 'special-enemy').length;
        const sameCount = pairs.filter(p => p.relation === 'same').length;
        
        return {
            totalPairs: pairs.length,
            avgScore: avgScore,
            level: level.name,
            levelEmoji: level.emoji,
            friendCount: friendCount,
            neutralCount: neutralCount,
            enemyCount: enemyCount,
            sameCount: sameCount,
            summaryText: `${level.emoji} ${level.name} (${avgScore}%) — ${friendCount}টি মিত্র, ${neutralCount}টি নিরপেক্ষ, ${enemyCount}টি শত্রু সম্পর্ক।`
        };
    },

    // ============================================================
    // ৭. HTML রেন্ডারিংয়ের জন্য ডেটা প্রস্তুত
    // ============================================================
    
    /**
     * রেন্ডারিংয়ের জন্য সম্পূর্ণ ডেটা প্রস্তুত
     * @param {string} input - মূল ইনপুট
     * @param {array} items - আইটেমের অ্যারে
     * @param {array} numbers - সংখ্যার অ্যারে
     * @returns {object} রেন্ডারিংয়ের জন্য ডেটা
     */
    prepareRenderData: function(input, items, numbers) {
        const analysis = this.analyzeAllPairs(items, numbers);
        if (!analysis) return null;
        
        return {
            input: input,
            items: items,
            numbers: numbers,
            pairs: analysis.pairs,
            avgScore: analysis.avgScore,
            level: analysis.level,
            bestPair: analysis.bestPair,
            worstPair: analysis.worstPair,
            overallAnalysis: analysis.overallAnalysis,
            overallRemedy: analysis.overallRemedy,
            summary: analysis.summary
        };
    },

    // ============================================================
    // ৮. সহায়ক ফাংশন
    // ============================================================
    
    /**
     * দুটি সংখ্যার মধ্যে মিত্রতা কিনা চেক
     * @param {number} num1 - প্রথম সংখ্যা
     * @param {number} num2 - দ্বিতীয় সংখ্যা
     * @returns {boolean} মিত্র হলে true
     */
    isFriend: function(num1, num2) {
        const relation = PlanetRelations.getRelation(num1, num2);
        return relation === 'friend' || relation === 'special-friend';
    },
    
    /**
     * দুটি সংখ্যার মধ্যে শত্রুতা কিনা চেক
     * @param {number} num1 - প্রথম সংখ্যা
     * @param {number} num2 - দ্বিতীয় সংখ্যা
     * @returns {boolean} শত্রু হলে true
     */
    isEnemy: function(num1, num2) {
        const relation = PlanetRelations.getRelation(num1, num2);
        return relation === 'enemy' || relation === 'special-enemy';
    },
    
    /**
     * দুটি সংখ্যার মধ্যে নিরপেক্ষ কিনা চেক
     * @param {number} num1 - প্রথম সংখ্যা
     * @param {number} num2 - দ্বিতীয় সংখ্যা
     * @returns {boolean} নিরপেক্ষ হলে true
     */
    isNeutral: function(num1, num2) {
        const relation = PlanetRelations.getRelation(num1, num2);
        return relation === 'neutral';
    },
    
    /**
     * একাধিক সংখ্যার মধ্যে সবচেয়ে শুভ জোড়া খুঁজে বের করে
     * @param {array} numbers - সংখ্যার অ্যারে
     * @returns {object} সবচেয়ে শুভ জোড়া
     */
    findBestPair: function(numbers) {
        let bestScore = 0;
        let bestPair = null;
        
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                const score = PlanetRelations.getScore(numbers[i], numbers[j]);
                if (score > bestScore) {
                    bestScore = score;
                    bestPair = { num1: numbers[i], num2: numbers[j], score: score };
                }
            }
        }
        
        return bestPair;
    },
    
    /**
     * একাধিক সংখ্যার মধ্যে সবচেয়ে অশুভ জোড়া খুঁজে বের করে
     * @param {array} numbers - সংখ্যার অ্যারে
     * @returns {object} সবচেয়ে অশুভ জোড়া
     */
    findWorstPair: function(numbers) {
        let worstScore = 100;
        let worstPair = null;
        
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                const score = PlanetRelations.getScore(numbers[i], numbers[j]);
                if (score < worstScore) {
                    worstScore = score;
                    worstPair = { num1: numbers[i], num2: numbers[j], score: score };
                }
            }
        }
        
        return worstPair;
    }
};

// ============================================================
// Node.js ও Browser উভয় পরিবেশের জন্য এক্সপোর্ট
// ============================================================
if (typeof window !== 'undefined') {
    window.CompatibilityCore = CompatibilityCore;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompatibilityCore;
}
