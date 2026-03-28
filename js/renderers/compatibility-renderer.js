// ============================================================
// সামঞ্জস্য ফলাফল রেন্ডারার
// ফাইল: js/renderers/compatibility-renderer.js
// ============================================================

const CompatibilityRenderer = {
    // ============================================================
    // ১. মূল রেন্ডার ফাংশন
    // ============================================================
    
    /**
     * সম্পূর্ণ সামঞ্জস্য ফলাফল রেন্ডার করে
     * @param {object} data - CompatibilityCore.prepareRenderData() থেকে পাওয়া ডেটা
     * @returns {string} HTML স্ট্রিং
     */
    render: function(data) {
        if (!data) {
            return this.renderError();
        }
        
        return `
            <div class="compatibility-result">
                ${this.renderHeader(data)}
                ${this.renderScoreCard(data)}
                ${this.renderItemsList(data)}
                ${this.renderPairsAnalysis(data)}
                ${this.renderOverallAnalysis(data)}
                ${this.renderRemedy(data)}
                ${this.renderShareButtons()}
            </div>
        `;
    },
    
    // ============================================================
    // ২. হেডার রেন্ডার
    // ============================================================
    
    renderHeader: function(data) {
        return `
            <div class="result-header">
                <h1 class="result-title">
                    <i class="fas fa-link"></i> সামঞ্জস্য মিলন বিশ্লেষণ
                </h1>
                <p class="result-subtitle">
                    <i class="fas fa-search"></i> "${escapeHtml(data.input)}"
                </p>
            </div>
        `;
    },
    
    // ============================================================
    // ৩. স্কোর কার্ড রেন্ডার
    // ============================================================
    
    renderScoreCard: function(data) {
        const level = data.level;
        const avgScore = data.avgScore;
        
        return `
            <div class="result-card score-card">
                <div class="score-circle" style="border-color: ${level.color}">
                    <div class="score-number">${avgScore}%</div>
                    <div class="score-label">সামঞ্জস্য হার</div>
                </div>
                <div class="score-level" style="color: ${level.color}">
                    <span class="level-emoji">${level.emoji}</span>
                    <span class="level-name">${level.name}</span>
                </div>
                <div class="score-description">
                    ${level.description}
                </div>
                <div class="score-summary">
                    ${data.summary.summaryText}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${avgScore}%; background: ${level.color};"></div>
                </div>
            </div>
        `;
    },
    
    // ============================================================
    // ৪. আইটেম লিস্ট রেন্ডার
    // ============================================================
    
    renderItemsList: function(data) {
        const itemsHtml = data.items.map((item, index) => {
            const number = data.numbers[index];
            const planet = PlanetRelations.planets[number];
            
            return `
                <div class="item-badge">
                    <span class="item-number" style="background: ${this.getNumberColor(number)}">
                        ${number}
                    </span>
                    <span class="item-planet">${planet.name}</span>
                    <span class="item-type">${this.getItemTypeIcon(item)}</span>
                    <span class="item-value">${escapeHtml(item)}</span>
                </div>
            `;
        }).join('');
        
        return `
            <div class="result-card">
                <h3><i class="fas fa-list"></i> বিশ্লেষিত উপাদান</h3>
                <div class="items-list">
                    ${itemsHtml}
                </div>
            </div>
        `;
    },
    
    // ============================================================
    // ৫. জোড়াভিত্তিক বিশ্লেষণ রেন্ডার
    // ============================================================
    
    renderPairsAnalysis: function(data) {
        if (!data.pairs || data.pairs.length === 0) {
            return '';
        }
        
        const pairsHtml = data.pairs.map(pair => {
            return `
                <div class="pair-analysis ${pair.relation}">
                    <div class="pair-header">
                        <div class="pair-items">
                            <span class="pair-item">${escapeHtml(pair.item1)}</span>
                            <i class="fas ${this.getRelationIcon(pair.relation)}"></i>
                            <span class="pair-item">${escapeHtml(pair.item2)}</span>
                        </div>
                        <div class="pair-score" style="color: ${this.getScoreColor(pair.score)}">
                            ${pair.score}% (${pair.relationType})
                        </div>
                    </div>
                    <div class="pair-numbers">
                        <span class="num-badge">${pair.num1}</span> 
                        ${pair.planet1} 
                        <i class="fas fa-arrows-alt-h"></i> 
                        <span class="num-badge">${pair.num2}</span> 
                        ${pair.planet2}
                    </div>
                    <div class="pair-analysis-text">
                        <i class="fas fa-chart-line"></i> ${pair.analysis}
                    </div>
                    ${pair.remedy ? `
                        <div class="pair-remedy">
                            <i class="fas fa-hand-sparkles"></i> 
                            <strong>প্রতিকার:</strong> ${pair.remedy}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        return `
            <div class="result-card">
                <h3><i class="fas fa-link"></i> জোড়াভিত্তিক বিশ্লেষণ</h3>
                <div class="pairs-container">
                    ${pairsHtml}
                </div>
            </div>
        `;
    },
    
    // ============================================================
    // ৬. সামগ্রিক বিশ্লেষণ রেন্ডার
    // ============================================================
    
    renderOverallAnalysis: function(data) {
        return `
            <div class="result-card">
                <h3><i class="fas fa-chart-line"></i> সামগ্রিক বিশ্লেষণ</h3>
                <div class="overall-analysis">
                    <p>${data.overallAnalysis}</p>
                </div>
                ${data.bestPair ? `
                    <div class="best-pair">
                        <i class="fas fa-star"></i>
                        <strong>সর্বোচ্চ সামঞ্জস্য:</strong> 
                        "${escapeHtml(data.bestPair.item1)}" ও "${escapeHtml(data.bestPair.item2)}" 
                        (${data.bestPair.score}%)
                    </div>
                ` : ''}
                ${data.worstPair ? `
                    <div class="worst-pair">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>সর্বনিম্ন সামঞ্জস্য:</strong> 
                        "${escapeHtml(data.worstPair.item1)}" ও "${escapeHtml(data.worstPair.item2)}" 
                        (${data.worstPair.score}%)
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    // ============================================================
    // ৭. প্রতিকার রেন্ডার
    // ============================================================
    
    renderRemedy: function(data) {
        if (!data.overallRemedy) {
            return '';
        }
        
        // প্রতিকারের টেক্সট ফরম্যাটিং (নতুন লাইনকে <br> এ রূপান্তর)
        const remedyHtml = data.overallRemedy.replace(/\n/g, '<br>');
        
        return `
            <div class="result-card remedy-card">
                <h3><i class="fas fa-hand-sparkles"></i> প্রতিকার ও পরামর্শ</h3>
                <div class="remedy-content">
                    ${remedyHtml}
                </div>
                <div class="remedy-note">
                    <i class="fas fa-info-circle"></i> 
                    নিয়মিত প্রতিকার অনুসরণ করলে সম্পর্কের উন্নতি হবে এবং শুভ ফল পাওয়া যাবে।
                </div>
            </div>
        `;
    },
    
    // ============================================================
    // ৮. শেয়ার বাটন রেন্ডার
    // ============================================================
    
    renderShareButtons: function() {
        return `
            <div class="share-buttons">
                <button class="share-btn" onclick="window.copyToClipboard()">
                    <i class="fas fa-copy"></i> কপি করুন
                </button>
                <button class="share-btn" onclick="window.shareResult()">
                    <i class="fas fa-share-alt"></i> শেয়ার করুন
                </button>
                <button class="share-btn" onclick="window.print()">
                    <i class="fas fa-print"></i> প্রিন্ট করুন
                </button>
            </div>
        `;
    },
    
    // ============================================================
    // ৯. এরর রেন্ডার
    // ============================================================
    
    renderError: function() {
        return `
            <div class="result-card error-card">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>ক্ষমা করবেন!</h2>
                <p>সামঞ্জস্য বিশ্লেষণের জন্য কমপক্ষে ২টি উপাদান প্রয়োজন।</p>
                <p>উদাহরণ: <strong>রাহুল + ১৫-০৮-১৯৯০</strong> বা <strong>রাহুল + সুমন</strong></p>
                <a href="numerology.html" class="back-btn">← নতুন অনুসন্ধান</a>
            </div>
        `;
    },
    
    // ============================================================
    // ১০. হেল্পার ফাংশন
    // ============================================================
    
    /**
     * সংখ্যা অনুযায়ী রঙ পাওয়া
     */
    getNumberColor: function(number) {
        const colors = {
            1: "#ff6b6b",  // সূর্য - লাল
            2: "#f8c291",  // চন্দ্র - ক্রিম
            3: "#f6b93b",  // বৃহস্পতি - হলুদ
            4: "#2c3e50",  // রাহু - গাঢ় নীল
            5: "#78e08f",  // বুধ - সবুজ
            6: "#f5cd79",  // শুক্র - সোনালি
            7: "#a55d4b",  // কেতু - বাদামি
            8: "#4a69bd",  // শনি - নীল
            9: "#e55039"   // মঙ্গল - কমলা
        };
        return colors[number] || "#95a5a6";
    },
    
    /**
     * স্কোর অনুযায়ী রঙ পাওয়া
     */
    getScoreColor: function(score) {
        if (score >= 85) return "#2ecc71";
        if (score >= 70) return "#f1c40f";
        if (score >= 50) return "#e67e22";
        return "#e74c3c";
    },
    
    /**
     * সম্পর্ক অনুযায়ী আইকন পাওয়া
     */
    getRelationIcon: function(relation) {
        switch(relation) {
            case 'special-friend':
            case 'friend':
                return 'fa-handshake';
            case 'neutral':
                return 'fa-balance-scale';
            case 'special-enemy':
            case 'enemy':
                return 'fa-fist-raised';
            case 'same':
                return 'fa-sync-alt';
            default:
                return 'fa-question';
        }
    },
    
    /**
     * আইটেমের টাইপ অনুযায়ী আইকন পাওয়া
     */
    getItemTypeIcon: function(item) {
        const type = NumberUtils.detectType(item);
        const icons = {
            date: '📅',
            mobile: '📱',
            vehicle: '🚗',
            price: '💰',
            business: '🏢',
            name: '👤',
            pin: '🔢',
            bank: '💳',
            number: '#️⃣',
            unknown: '❓'
        };
        return icons[type] || '📌';
    }
};

// ============================================================
// Browser-এ এক্সপোর্ট
// ============================================================
if (typeof window !== 'undefined') {
    window.CompatibilityRenderer = CompatibilityRenderer;
    
    // গ্লোবাল ফাংশন (share/copy জন্য)
    window.copyToClipboard = function() {
        const text = document.querySelector('#resultContent')?.innerText || '';
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('ফলাফল কপি হয়েছে!');
            });
        }
    };
    
    window.shareResult = function() {
        const text = document.querySelector('#resultContent')?.innerText || '';
        if (navigator.share && text) {
            navigator.share({
                title: 'Numerology Intelligence Hub',
                text: text.substring(0, 500),
                url: window.location.href
            });
        } else {
            window.copyToClipboard();
        }
    };
}

// ============================================================
// Node.js এক্সপোর্ট
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompatibilityRenderer;
}
