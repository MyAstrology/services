'use strict';
/**
 * generate-rss.js
 * ================
 * কাজ: rashifal/ ফোল্ডারের .html ফাইল স্ক্যান করে
 *       RSS 2.0 ফিড তৈরি করে (Google News-অপটিমাইজড)
 *
 * চালানো: node src/content/rashifal/generate-rss.js
 * GitHub Actions প্রতিদিন রাশিফল জেনারেশনের পরে চালাবে
 *
 * ফাইল তৈরি হয়: rashifal/rss.xml
 */

const fs = require('fs');
const path = require('path');

// ════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════
const SITE_URL = 'https://www.myastrology.in';
const RASHIFAL_DIR = path.join(__dirname, '..', '..', '..', 'rashifal');
const OUTPUT_FILE = path.join(RASHIFAL_DIR, 'rss.xml');
const MAX_ITEMS = 30;  // সর্বশেষ ৩০টি রাশিফল RSS-এ রাখব

// ════════════════════════════════════════════════
// BENGALI UTILITIES
// ════════════════════════════════════════════════
const BD = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBn = n => String(Math.abs(Math.round(n))).replace(/[0-9]/g, d => BD[+d]);

const BN_MONTHS = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
                   'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];

// Bengali month starts (2024–2029 data — generate-rashifal.js থেকে হুবহু)
const BMS = [
  { y: 1431, m: 0, s: '2024-04-14' }, { y: 1431, m: 1, s: '2024-05-15' }, { y: 1431, m: 2, s: '2024-06-15' },
  { y: 1431, m: 3, s: '2024-07-16' }, { y: 1431, m: 4, s: '2024-08-17' }, { y: 1431, m: 5, s: '2024-09-17' },
  { y: 1431, m: 6, s: '2024-10-17' }, { y: 1431, m: 7, s: '2024-11-16' }, { y: 1431, m: 8, s: '2024-12-16' },
  { y: 1431, m: 9, s: '2025-01-14' }, { y: 1431, m: 10, s: '2025-02-13' }, { y: 1431, m: 11, s: '2025-03-14' },
  { y: 1432, m: 0, s: '2025-04-14' }, { y: 1432, m: 1, s: '2025-05-15' }, { y: 1432, m: 2, s: '2025-06-15' },
  { y: 1432, m: 3, s: '2025-07-16' }, { y: 1432, m: 4, s: '2025-08-17' }, { y: 1432, m: 5, s: '2025-09-17' },
  { y: 1432, m: 6, s: '2025-10-17' }, { y: 1432, m: 7, s: '2025-11-16' }, { y: 1432, m: 8, s: '2025-12-16' },
  { y: 1432, m: 9, s: '2026-01-15' }, { y: 1432, m: 10, s: '2026-02-14' }, { y: 1432, m: 11, s: '2026-03-15' },
  { y: 1433, m: 0, s: '2026-04-15' }, { y: 1433, m: 1, s: '2026-05-15' }, { y: 1433, m: 2, s: '2026-06-15' },
  { y: 1433, m: 3, s: '2026-07-17' }, { y: 1433, m: 4, s: '2026-08-17' }, { y: 1433, m: 5, s: '2026-09-17' },
  { y: 1433, m: 6, s: '2026-10-17' }, { y: 1433, m: 7, s: '2026-11-16' }, { y: 1433, m: 8, s: '2026-12-16' },
  { y: 1433, m: 9, s: '2027-01-15' }, { y: 1433, m: 10, s: '2027-02-13' }, { y: 1433, m: 11, s: '2027-03-14' },
  { y: 1434, m: 0, s: '2027-04-14' }, { y: 1434, m: 1, s: '2027-05-15' }, { y: 1434, m: 2, s: '2027-06-15' },
  { y: 1434, m: 3, s: '2027-07-16' }, { y: 1434, m: 4, s: '2027-08-17' }, { y: 1434, m: 5, s: '2027-09-17' },
  { y: 1434, m: 6, s: '2027-10-17' }, { y: 1434, m: 7, s: '2027-11-16' }, { y: 1434, m: 8, s: '2027-12-16' },
  { y: 1434, m: 9, s: '2028-01-15' }, { y: 1434, m: 10, s: '2028-02-14' }, { y: 1434, m: 11, s: '2028-03-14' },
  { y: 1435, m: 0, s: '2028-04-13' }, { y: 1435, m: 1, s: '2028-05-14' },
  { y: 1436, m: 0, s: '2029-04-14' },
];

function getBnDate(date) {
  const t = date.getTime();
  let idx = -1;
  for (let i = BMS.length - 1; i >= 0; i--) {
    if (t >= new Date(BMS[i].s + 'T00:00:00').getTime()) { idx = i; break; }
  }
  if (idx < 0) return null;
  const e = BMS[idx];
  const s = new Date(e.s + 'T00:00:00');
  const d = Math.floor((t - s.getTime()) / 86400000) + 1;
  return { y: e.y, m: e.m, d, name: BN_MONTHS[e.m] };
}

function formatBnDate(date) {
  const bn = getBnDate(date);
  if (!bn) return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  return `${toBn(bn.d)} ${bn.name} ${toBn(bn.y)}`;
}

// ════════════════════════════════════════════════
// RFC 822 DATE FORMATTER (Google News-এর জন্য অপরিহার্য)
// ════════════════════════════════════════════════
function formatRFC822Date(date) {
  // RFC 822 ফরম্যাট: Wed, 25 Mar 2026 00:00:00 +0530
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  // IST = UTC+5:30
  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} +0530`;
}

// ════════════════════════════════════════════════
// HTML থেকে সংক্ষিপ্ত বিবরণ তৈরি
// ════════════════════════════════════════════════
function extractDescription(htmlContent, date, moonRashiGuess) {
  // meta description বের করার চেষ্টা
  const metaMatch = htmlContent.match(/<meta name="description" content="([^"]+)"/);
  if (metaMatch && metaMatch[1]) {
    return metaMatch[1].substring(0, 500);
  }

  // description না পেলে ডিফল্ট
  const bnDate = formatBnDate(date);
  const moonRashi = moonRashiGuess || 'মেষ';
  return `${bnDate} তারিখের ১২ রাশির বিস্তারিত দৈনিক রাশিফল। চন্দ্র ${moonRashi} রাশিতে। প্রেম, কর্ম, স্বাস্থ্য, অর্থ ও সতর্কতা।`;
}

// ════════════════════════════════════════════════
// HTML থেকে চন্দ্র রাশি বের করা
// ════════════════════════════════════════════════
function extractMoonRashi(htmlContent) {
  const match = htmlContent.match(/চন্দ্র\s+([\u0980-\u09FF]+)\s+রাশিতে/);
  if (match && match[1]) return match[1];
  const match2 = htmlContent.match(/🌙 চন্দ্র\s+([\u0980-\u09FF]+)\s+রাশি/);
  if (match2 && match2[1]) return match2[1];
  return null;
}

// ════════════════════════════════════════════════
// RSS ফিড জেনারেটর (Google News-অপটিমাইজড)
// ════════════════════════════════════════════════
function generateRss() {
  if (!fs.existsSync(RASHIFAL_DIR)) {
    console.warn('⚠️ rashifal/ directory not found. Run generate-rashifal.js first.');
    process.exit(0);
  }

  const allFiles = fs.readdirSync(RASHIFAL_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.html$/.test(f))
    .sort()
    .reverse();

  if (allFiles.length === 0) {
    console.warn('⚠️ কোনো rashifal HTML ফাইল পাওয়া যায়নি।');
    process.exit(0);
  }

  const items = allFiles.slice(0, MAX_ITEMS);
  console.log(`📰 RSS ফিডে ${items.length}টি এন্ট্রি যোগ হবে:`);
  items.forEach(f => console.log(`   • ${f}`));

  const rssItems = items.map(f => {
    const iso = f.replace('.html', '');
    const date = new Date(iso + 'T00:00:00');
    const bnDate = formatBnDate(date);
    const pubDate = formatRFC822Date(date);  // ★ RFC 822 ফরম্যাট (Google News)

    let htmlContent = '';
    let moonRashi = null;
    try {
      htmlContent = fs.readFileSync(path.join(RASHIFAL_DIR, f), 'utf8');
      moonRashi = extractMoonRashi(htmlContent);
    } catch (err) {
      console.warn(`⚠️ ${f} পড়তে সমস্যা: ${err.message}`);
    }

    const description = extractDescription(htmlContent, date, moonRashi);
    const title = `${bnDate} দৈনিক রাশিফল — ১২ রাশির বিস্তারিত ফল`;
    const link = `${SITE_URL}/rashifal/${f}`;
    const guid = `${SITE_URL}/rashifal/${f}`;

    // ★ CDATA ব্যবহার করে XML-এ নিরাপদ এনকোডিং
    return `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${guid}</guid>
    </item>`;
  }).join('\n');

  const lastBuildDate = formatRFC822Date(new Date());
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MyAstrology দৈনিক রাশিফল</title>
    <link>${SITE_URL}/rashifal/</link>
    <description>ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল — ১২ রাশির বিস্তারিত ফল, প্রেম, কর্ম, স্বাস্থ্য, অর্থ ও সতর্কতা।</description>
    <language>bn</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rashifal/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/MyAstrology-Ranghat-logo.png</url>
      <title>MyAstrology দৈনিক রাশিফল</title>
      <link>${SITE_URL}/rashifal/</link>
    </image>
${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync(OUTPUT_FILE, rssXml, 'utf8');
  console.log(`\n✅ RSS ফিড তৈরি হয়েছে — ${items.length}টি এন্ট্রি`);
  console.log(`📍 ফাইল: ${OUTPUT_FILE}`);
  console.log('\n💡 পরবর্তী কাজ:');
  console.log('   • Google News Publisher Center-এ এই RSS জমা দিন');
  console.log('   • RSS URL: https://www.myastrology.in/rashifal/rss.xml');
  console.log('   • Feedly / Inoreader-এ সাবস্ক্রাইব করুন');
}

// ════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════
generateRss();
