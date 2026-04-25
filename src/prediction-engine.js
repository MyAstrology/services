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

    renderAll(birthNak, containerId) {
        const c = document.getElementById(containerId);
        if (!c) return;
        c.innerHTML = this.getTaraTableHTML(birthNak) + '<hr style="margin:30px 0;">' + this.getTriIpapaTableHTML(birthNak) + '<hr style="margin:30px 0;"><div style="text-align:center;">' + this.getNadiChakraSVG(birthNak) + '</div>';
    }
}

// ==================== দ্বিতীয় ভাগ ====================
// PredictionEngine ক্লাসের ভেতরে এই মেথডগুলো যোগ করুন
// (generateRemedySection() মেথডের পরে বসান)

/**
 * নবতারা চক্র বিশ্লেষণ
 */
generateTaraAnalysis() {
    const moon = this.chartData.planets?.find(p => p.name === "চন্দ্র");
    if (!moon || !moon.nakshatra) return "";

    let output = "🌟 নবতারা চক্র (জন্মনক্ষত্র অনুযায়ী)\n";
    output += "─".repeat(40) + "\n";

    const engine = new NavaTaraGemEngine();
    const todayNak = moon.nakshatra; // জন্মের দিনের চন্দ্র নক্ষত্র
    const tara = engine.getTara(moon.nakshatra, todayNak);

    if (tara.error) return "";

    output += `জন্মনক্ষত্র: ${moon.nakshatra}\n`;
    output += `আজকের তারা: ${tara.icon} ${tara.taraName} (${tara.taraIndex}ম তারা) — ${tara.type}\n\n`;

    // নবতারা টেবিল (সংক্ষিপ্ত)
    const table = engine.getFullTaraTable(moon.nakshatra);
    output += "নক্ষত্র → তারা ফল:\n";
    table.forEach(row => {
        const isBad = ["বিপৎ", "প্রত্যরি", "নিধন"].includes(row.taraName);
        output += `  ${row.icon} ${row.nakshatra} → ${row.taraName} (${isBad ? 'অশুভ' : 'শুভ'})\n`;
    });

    output += "\n";
    return output;
}

/**
 * দ্বি-রত্ন পরামর্শ
 */
generateRatnaRecommendation() {
    const lagna = this.chartData.lagna;
    const planets = this.chartData.planets;
    if (!lagna || !planets) return "";

    let output = "💎 রত্ন পরামর্শ (পঞ্চমেশ + নবম ভাবস্থ গ্রহ)\n";
    output += "─".repeat(40) + "\n";

    const engine = new NavaTaraGemEngine();

    // গ্রহদের রাশি ম্যাপ তৈরি
    const allPlanetSigns = {};
    planets.forEach(p => {
        if (p.rashi && p.name) allPlanetSigns[p.name] = p.rashi;
    });

    const { recommendations, warnings } = engine.getSafeGemRecommendations(lagna.rashi, allPlanetSigns);

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

    output += "\n🕉️ রত্ন ধারণের নিয়ম: নির্দিষ্ট দিনে সকালে স্নান করে, মন্ত্র ১০৮ বার জপ করে, নির্দিষ্ট আঙুলে ধারণ করুন।\n";
    output += "\n";
    return output;
}

/**
 * ষড়নাড়ি চক্র + ত্রিইপাপ (HTML ফরম্যাটে — kundali.html পেজের জন্য)
 */
generateNadiTriIpapaHTML(containerId) {
    const moon = this.chartData.planets?.find(p => p.name === "চন্দ্র");
    if (!moon || !moon.nakshatra) return;

    const ui = new NavaTaraNadiUI();
    ui.renderAll(moon.nakshatra, containerId);
}

/**
 * পূর্ণাঙ্গ প্রেডিকশনে এই নতুন সেকশন যোগ করার আপডেটেড generateFullPrediction()
 * (যদি আগের generateFullPrediction() আপডেট করতে চান)
 */
generateFullPredictionWithNewFeatures() {
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

    // ============ নতুন তিনটি সেকশন ============
    output += this.generateTaraAnalysis();        // নবতারা চক্র
    output += this.generateRatnaRecommendation(); // দ্বি-রত্ন পরামর্শ
    // =========================================

    output += this.generateRemedySection();

    output += "\n" + "═".repeat(50) + "\n";
    output += `✨ ${this.userName}, আপনার জীবন মঙ্গলময় হোক। ✨\n`;
    output += "\n© পূর্ব ভারতীয় কুষ্ঠি সফটওয়্যার | লাহিড়ী অয়নাংশ | VSOP87 নির্ভুল গণনা\n";

    return output;
}

console.log("✅ prediction-engine.js — দ্বিতীয় ভাগ: PredictionEngine-এ নতুন মেথড যোগ হয়েছে");
console.log("🔍 generateTaraAnalysis() — নবতারা চক্র");
console.log("🔍 generateRatnaRecommendation() — দ্বি-রত্ন পরামর্শ");
console.log("🔍 generateNadiTriIpapaHTML('container-id') — ষড়নাড়ি + ত্রিইপাপ (HTML)");
console.log("🔍 generateFullPredictionWithNewFeatures() — সব একসাথে");
