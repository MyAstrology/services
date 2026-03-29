// ============================================================
// compatibility-core.js — সামঞ্জস্য গণনার কোর লজিক
// ============================================================

const CompatibilityCore = {

    analyzePair: function(item1, item2, num1, num2) {
        const planet1 = PlanetRelations.planets[num1];
        const planet2 = PlanetRelations.planets[num2];
        const relation = PlanetRelations.getRelation(num1, num2);
        const score = PlanetRelations.getScore(num1, num2);

        let relationType = '';
        let relationEmoji = '';
        switch(relation) {
            case 'special-friend': relationType = 'মিত্র (বিশেষ)'; relationEmoji = '🌟'; break;
            case 'friend':         relationType = 'মিত্র';           relationEmoji = '🤝'; break;
            case 'neutral':        relationType = 'নিরপেক্ষ';        relationEmoji = '⚖️'; break;
            case 'special-enemy':  relationType = 'শত্রু (বিশেষ)';  relationEmoji = '⚠️'; break;
            case 'enemy':          relationType = 'শত্রু';            relationEmoji = '⚔️'; break;
            case 'same':           relationType = 'একই গ্রহ';         relationEmoji = '🔄'; break;
            default:               relationType = 'নিরপেক্ষ';        relationEmoji = '⚖️';
        }

        const level = this.getScoreLevel(score);

        return {
            item1, item2, num1, num2,
            planet1: planet1?.name || '?',
            planet2: planet2?.name || '?',
            planet1En: planet1?.nameEn || '',
            planet2En: planet2?.nameEn || '',
            relation, relationType, relationEmoji,
            score, level,
            analysis: PlanetRelations.getAnalysis(num1, num2),
            remedy: PlanetRelations.getRemedy(num1, num2)
        };
    },

    analyzeAllPairs: function(items, numbers) {
        if (!items || !numbers || items.length < 2) return null;

        const pairs = [];
        const scores = [];

        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const pair = this.analyzePair(items[i], items[j], numbers[i], numbers[j]);
                pairs.push(pair);
                scores.push(pair.score);
            }
        }

        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const level = this.getScoreLevel(avgScore);
        const bestPair = [...pairs].sort((a, b) => b.score - a.score)[0];
        const worstPair = [...pairs].sort((a, b) => a.score - b.score)[0];
        const overallAnalysis = this.getOverallAnalysis(items, pairs, avgScore, level);
        const overallRemedy = this.getOverallRemedy(pairs);
        const summary = this.getSummary(pairs, avgScore, level);

        return { items, numbers, pairs, avgScore, level, bestPair, worstPair, overallAnalysis, overallRemedy, summary };
    },

    getScoreLevel: function(score) {
        if (score >= 85) return { name:"অত্যন্ত শুভ", nameEn:"Excellent", emoji:"🌟", color:"#ffd700",
            description:"এই সামঞ্জস্য অত্যন্ত শুভ। গ্রহগুলো পরস্পরের মিত্র। জীবনে সাফল্য, স্থিতিশীলতা ও সুখ বয়ে আনবে।" };
        if (score >= 70) return { name:"শুভ", nameEn:"Good", emoji:"✅", color:"#90be6d",
            description:"এই সামঞ্জস্য শুভ। অধিকাংশ গ্রহ পরস্পরের মিত্র বা নিরপেক্ষ। সচেতন থাকলে ভালো ফল পাবেন।" };
        if (score >= 50) return { name:"মধ্যম", nameEn:"Average", emoji:"⚠️", color:"#f9c74f",
            description:"এই সামঞ্জস্য মধ্যম। কিছু ক্ষেত্রে সামঞ্জস্য থাকলেও কিছু ক্ষেত্রে সতর্কতা প্রয়োজন।" };
        return { name:"অশুভ", nameEn:"Poor", emoji:"⚠️", color:"#f9844a",
            description:"এই সামঞ্জস্য অশুভ। গ্রহগুলো পরস্পরের শত্রু। বাধা ও দ্বন্দ্ব আসতে পারে। প্রতিকার প্রয়োজন।" };
    },

    getOverallAnalysis: function(items, pairs, avgScore, level) {
        const itemCount = items.length;
        let analysis = `আপনার প্রদত্ত ${itemCount}টি উপাদানের মধ্যে `;

        if (avgScore >= 85) {
            analysis += `অত্যন্ত শুভ সামঞ্জস্য রয়েছে। সবগুলো জোড়ার গড় স্কোর ${avgScore}%। গ্রহগুলো পরস্পরের মিত্র। `;
            const bestPair = pairs.reduce((a,b) => a.score>b.score?a:b);
            analysis += `বিশেষ করে "${bestPair.item1}" ও "${bestPair.item2}"-এর মধ্যে সম্পর্ক অত্যন্ত শক্তিশালী।`;
        } else if (avgScore >= 70) {
            analysis += `শুভ সামঞ্জস্য রয়েছে। গড় স্কোর ${avgScore}%। অধিকাংশ গ্রহ পরস্পরের মিত্র বা নিরপেক্ষ। সচেতন থাকলে ভালো ফল পাবেন।`;
        } else if (avgScore >= 50) {
            analysis += `মধ্যম সামঞ্জস্য রয়েছে। গড় স্কোর ${avgScore}%। কিছু জোড়ায় সামঞ্জস্য থাকলেও কিছু জোড়ায় সতর্কতা প্রয়োজন।`;
        } else {
            analysis += `অশুভ সামঞ্জস্য রয়েছে। গড় স্কোর ${avgScore}%। গ্রহগুলো পরস্পরের শত্রু। নিচের প্রতিকারগুলো অনুসরণ করুন।`;
        }
        return analysis;
    },

    getOverallRemedy: function(pairs) {
        const enemyPairs = pairs.filter(p => p.relation === 'enemy' || p.relation === 'special-enemy');
        if (enemyPairs.length === 0) return "সামগ্রিকভাবে শুভ সম্পর্ক। আরও উন্নতির জন্য শুভ দিনে দান করুন ও নিয়মিত ধ্যান করুন।";
        let remedy = "শত্রু সম্পর্কের জোড়াগুলোর জন্য বিশেষ প্রতিকার প্রয়োজন:\n\n";
        enemyPairs.forEach((pair, index) => {
            remedy += `${index + 1}. "${pair.item1}" ও "${pair.item2}" — ${pair.remedy}\n\n`;
        });
        remedy += "সকল প্রতিকার নিয়মিত অনুসরণ করলে সম্পর্কের উন্নতি হবে।";
        return remedy;
    },

    getSummary: function(pairs, avgScore, level) {
        const friendCount  = pairs.filter(p => p.relation==='friend'||p.relation==='special-friend').length;
        const neutralCount = pairs.filter(p => p.relation==='neutral').length;
        const enemyCount   = pairs.filter(p => p.relation==='enemy'||p.relation==='special-enemy').length;
        const sameCount    = pairs.filter(p => p.relation==='same').length;
        return {
            totalPairs: pairs.length, avgScore, level: level.name, levelEmoji: level.emoji,
            friendCount, neutralCount, enemyCount, sameCount,
            summaryText: `${level.emoji} ${level.name} (${avgScore}%) — ${friendCount}টি মিত্র, ${neutralCount}টি নিরপেক্ষ, ${enemyCount}টি শত্রু সম্পর্ক।`
        };
    },

    prepareRenderData: function(input, items, numbers) {
        const analysis = this.analyzeAllPairs(items, numbers);
        if (!analysis) return null;
        return { input, items, numbers, ...analysis };
    },

    isFriend:  function(n1,n2){ const r=PlanetRelations.getRelation(n1,n2); return r==='friend'||r==='special-friend'; },
    isEnemy:   function(n1,n2){ const r=PlanetRelations.getRelation(n1,n2); return r==='enemy'||r==='special-enemy'; },
    isNeutral: function(n1,n2){ return PlanetRelations.getRelation(n1,n2)==='neutral'; },

    findBestPair: function(numbers) {
        let best=0, pair=null;
        for(let i=0;i<numbers.length;i++) for(let j=i+1;j<numbers.length;j++){
            const s=PlanetRelations.getScore(numbers[i],numbers[j]);
            if(s>best){best=s;pair={num1:numbers[i],num2:numbers[j],score:s};}
        }
        return pair;
    },

    findWorstPair: function(numbers) {
        let worst=100, pair=null;
        for(let i=0;i<numbers.length;i++) for(let j=i+1;j<numbers.length;j++){
            const s=PlanetRelations.getScore(numbers[i],numbers[j]);
            if(s<worst){worst=s;pair={num1:numbers[i],num2:numbers[j],score:s};}
        }
        return pair;
    }
};

if(typeof window!=='undefined') window.CompatibilityCore=CompatibilityCore;
if(typeof module!=='undefined'&&module.exports) module.exports=CompatibilityCore;
