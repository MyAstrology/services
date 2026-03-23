

'use strict';
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.myastrology.in';
const RASHIFAL_DIR = path.join(__dirname, '..', '..', '..', 'rashifal');
const OUTPUT_FILE = path.join(__dirname, '..', '..', '..', 'sitemap-news.xml');

const BMS = [
  {y:1431,m:0,s:'2024-04-14'},{y:1431,m:1,s:'2024-05-15'},{y:1431,m:2,s:'2024-06-15'},
  {y:1431,m:3,s:'2024-07-16'},{y:1431,m:4,s:'2024-08-17'},{y:1431,m:5,s:'2024-09-17'},
  {y:1431,m:6,s:'2024-10-17'},{y:1431,m:7,s:'2024-11-16'},{y:1431,m:8,s:'2024-12-16'},
  {y:1431,m:9,s:'2025-01-14'},{y:1431,m:10,s:'2025-02-13'},{y:1431,m:11,s:'2025-03-14'},
  {y:1432,m:0,s:'2025-04-14'},{y:1432,m:1,s:'2025-05-15'},{y:1432,m:2,s:'2025-06-15'},
  {y:1432,m:3,s:'2025-07-16'},{y:1432,m:4,s:'2025-08-17'},{y:1432,m:5,s:'2025-09-17'},
  {y:1432,m:6,s:'2025-10-17'},{y:1432,m:7,s:'2025-11-16'},{y:1432,m:8,s:'2025-12-16'},
  {y:1432,m:9,s:'2026-01-15'},{y:1432,m:10,s:'2026-02-14'},{y:1432,m:11,s:'2026-03-15'},
  {y:1433,m:0,s:'2026-04-15'},{y:1433,m:1,s:'2026-05-15'},{y:1433,m:2,s:'2026-06-15'},
  {y:1433,m:3,s:'2026-07-17'},{y:1433,m:4,s:'2026-08-17'},{y:1433,m:5,s:'2026-09-17'},
  {y:1433,m:6,s:'2026-10-17'},{y:1433,m:7,s:'2026-11-16'},{y:1433,m:8,s:'2026-12-16'},
  {y:1433,m:9,s:'2027-01-15'},{y:1433,m:10,s:'2027-02-13'},{y:1433,m:11,s:'2027-03-14'},
  {y:1434,m:0,s:'2027-04-14'},{y:1436,m:0,s:'2029-04-14'},
];
const BN_MONTHS = ['বৈশাখ','জ্যৈষ্ঠ','আষাঢ়','শ্রাবণ','ভাদ্র','আশ্বিন',
                   'কার্তিক','অগ্রহায়ণ','পৌষ','মাঘ','ফাল্গুন','চৈত্র'];
const BD = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
const toBn = n => String(Math.abs(Math.round(n))).replace(/[0-9]/g, d => BD[+d]);

function getBnDate(date) {
  const t = date.getTime();
  let idx = -1;
  for(let i = BMS.length-1; i >= 0; i--) {
    if(t >= new Date(BMS[i].s+'T00:00:00').getTime()) { idx=i; break; }
  }
  if(idx < 0) return null;
  const e = BMS[idx];
  const s = new Date(e.s+'T00:00:00');
  const d = Math.floor((t - s.getTime()) / 86400000) + 1;
  return { y: e.y, m: e.m, d, name: BN_MONTHS[e.m] };
}

function buildTitle(iso) {
  const date = new Date(iso+'T00:00:00');
  const bn = getBnDate(date);
  if(bn) {
    return `${toBn(bn.d)} ${bn.name} ${toBn(bn.y)} — দৈনিক রাশিফল | ১২ রাশির বিস্তারিত ফল`;
  }
  return `${iso} দৈনিক রাশিফল — ১২ রাশির বিস্তারিত ফল`;
}

if(!fs.existsSync(RASHIFAL_DIR)) {
  console.warn('⚠️ rashifal/ directory not found.');
  process.exit(0);
}

const allFiles = fs.readdirSync(RASHIFAL_DIR)
  .filter(f => /^\d{4}-\d{2}-\d{2}\.html$/.test(f));

if(allFiles.length === 0) {
  console.warn('⚠️ কোনো rashifal HTML ফাইল পাওয়া যায়নি।');
  process.exit(0);
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const yesterdayStr = yesterday.toISOString().slice(0,10);
const todayStr = today.toISOString().slice(0,10);
const tomorrowStr = tomorrow.toISOString().slice(0,10);

const entries = allFiles.filter(f => {
  const date = f.replace('.html','');
  return date === yesterdayStr || date === todayStr || date === tomorrowStr;
}).sort().reverse();

console.log(`📰 News sitemap-এ ${entries.length}টি entry:`);
entries.forEach(f => console.log(`   • ${f}`));

if(entries.length === 0) {
  console.warn('⚠️ কোনো ফাইল পাওয়া যায়নি।');
  process.exit(0);
}

const urlEntries = entries.map(f => {
  const iso = f.replace('.html','');
  const title = buildTitle(iso).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `  <url>
    <loc>${SITE_URL}/rashifal/${f}</loc>
    <news:news>
      <news:publication>
        <news:name>MyAstrology</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${iso}T05:00:00+05:30</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
    <lastmod>${iso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;

fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
console.log(`\n✅ sitemap-news.xml তৈরি হয়েছে — ${entries.length}টি entry`);
