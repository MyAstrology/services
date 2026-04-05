'use strict';

>
'use strict';

/* ████████████████████████████████████████████████████████████████████
   ██  বাংলা পঞ্জিকা — সম্পূর্ণ কোড সূচি                          ██
   ██  MyAstrology | Dr. Prodyut Acharya                             ██
   ████████████████████████████████████████████████████████████████████

   🔧 UTILITY / SETUP
      SECTION ①  HAMBURGER NAV      — মেনু খোলা/বন্ধ
      SECTION ②  CONFIG             — LAT/LNG/TZ (অবস্থান পরিবর্তন করুন)
      SECTION ③  HELPERS            — fmtT, slotT, toBn ইত্যাদি

   📅 পঞ্জিকা ডেটা  ← এখানে বেশিরভাগ আপডেট হবে
      SECTION ④  BENGALI MONTHS     — বাংলা মাসের তারিখ তালিকা (বছর যোগ করুন)
      SECTION ⑤  PANJIKA NAMES      — তিথি/নক্ষত্র/যোগ/করণের বাংলা নাম
      SECTION ⑥  FESTIVAL LIST      — উৎসব ও ব্রতের তালিকা (প্রতি বছর আপডেট)
      SECTION ⑦  ECLIPSE DATA       — গ্রহণের সময়সূচি ২০২৬–২০২৮ (বছর বাড়ালে যোগ করুন)

   🔭 ASTRONOMY ENGINE  ← সাধারণত পরিবর্তন দরকার নেই
      SECTION ⑧  ASTRONOMY          — JD, sunL, moonL, sunTimes গণনা
      SECTION ⑨  TRANSITION ENGINE  — তিথি/নক্ষত্র/যোগ/করণ পরিবর্তনের সময়
      SECTION ⑩  calcDay()          — মূল পঞ্চাঙ্গ গণনা ফাংশন

   🖥️ UI RENDERING  ← দেখতে পরিবর্তন করতে এখানে আসুন
      SECTION ⑪  HEADER             — আজকের তারিখ ব্যানার (উপরের চিপস)
      SECTION ⑫  CALENDAR           — মাসিক ক্যালেন্ডার গ্রিড
      SECTION ⑬  DETAIL PANEL       — তারিখে ক্লিক করলে বিস্তারিত প্যানেল

   🌟 রাশিফল  ← রাশিফল পরিবর্তন করতে এখানে আসুন
      SECTION ⑭  RASHI DATA         — ১২ রাশির তথ্য (প্রতীক/অধিপতি/রত্ন)
      SECTION ⑮  RASHIFAL TEXT DB   — প্রেম/কর্ম/স্বাস্থ্য/আর্থিক বার্তা ভাণ্ডার
      SECTION ⑯  RASHIFAL RENDER    — রাশিফল UI তৈরি ও score গণনা

   🚀 SECTION ⑰  INIT              — পেজ লোডের সময় প্রথমে চালু হয়

   ⚡ দ্রুত খুঁজে পেতে Ctrl+F → "SECTION ④" লিখুন
   ████████████████████████████████████████████████████████████████████ */

// ════════════════════════════════════════════════════════
// SECTION ① — HAMBURGER NAV
// কাজ: হ্যামবার্গার মেনু টগল করে
// পরিবর্তন: সাধারণত দরকার নেই
// ════════════════════════════════════════════════════════
function toggleNav(){
  document.getElementById('hbg').classList.toggle('open');
  document.getElementById('sideNav').classList.toggle('open');
  document.getElementById('navOverlay').classList.toggle('open');
}
function closeNav(){
  document.getElementById('hbg').classList.remove('open');
  document.getElementById('sideNav').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
(function(){
  var hbg=document.getElementById('hbg');
  var ov=document.getElementById('navOverlay');
  if(hbg)hbg.addEventListener('click',toggleNav);
  if(ov)ov.addEventListener('click',closeNav);
})();

// ════════════════════════════════════════════════════════
// SECTION ② — CONFIG (সাইটের অবস্থান ও সময় জোন)
// কাজ: সূর্যোদয়/সূর্যাস্ত ও রাহুকালের সময় নির্ভর করে এর উপর
// পরিবর্তন: শহর বদলালে LAT/LNG আপডেট করুন
//   রানাঘাট: LAT=23.18, LNG=88.56
//   কলকাতা:  LAT=22.57, LNG=88.36
//   ঢাকা:    LAT=23.72, LNG=90.41 (TZ=6)
// ════════════════════════════════════════════════════════
const TODAY=new Date();
const LAT=23.18,LNG=88.56,TZ=5.5;

// ════════════════════════════════════════════════════════
// SECTION ③ — HELPERS (সহায়ক ফাংশন)
// কাজ: সময় ফরম্যাট, বাংলা সংখ্যা, রাহুকাল slot গণনা
// পরিবর্তন: সাধারণত দরকার নেই
// ════════════════════════════════════════════════════════
const BD=['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
const toBn=n=>String(Math.abs(Math.round(n))).replace(/[0-9]/g,d=>BD[+d]);
const EMS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const EMSh=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const VDAYS=['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
const VLORD=['সূর্য','চন্দ্র','মঙ্গল','বুধ','বৃহস্পতি','শুক্র','শনি'];
function fmtT(h,m){m=Math.round(m||0);if(m>=60){h+=Math.floor(m/60);m=m%60;}if(m<0){h--;m+=60;}h=((h%24)+24)%24;const l=h>=4.5&&h<6?'ভোর':h<6?'রাত':h<12?'সকাল':h<14?'দুপুর':h<17?'বিকেল':h<20?'সন্ধ্যা':'রাত';const hh=h%12===0?12:h%12;return`${l} ${toBn(hh)}:${String(m).padStart(2,'0').replace(/[0-9]/g,d=>BD[+d])}`;}
function slotT(rise,set,s){const len=(set-rise)/8,st=rise+len*(s-1),en=st+len;const sh=Math.floor(st),sm=Math.round((st-sh)*60);const eh=Math.floor(en),em=Math.round((en-eh)*60);return`${fmtT(sh,sm)} – ${fmtT(eh,em)}`;}
function abhiT(rise,set){const n=(rise+set)/2,s=n-24/60,e=n+24/60;return`${fmtT(Math.floor(s),Math.round((s-Math.floor(s))*60))} – ${fmtT(Math.floor(e),Math.round((e-Math.floor(e))*60))}`;}
function dStr(d){return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}

// ════════════════════════════════════════════════════════
// SECTION ④ — BENGALI MONTH STARTS (বাংলা মাসের শুরুর তারিখ)
// কাজ: প্রতিটি বাংলা মাস কোন ইংরেজি তারিখে শুরু হয় তা ধরে রাখে
// পরিবর্তন: নতুন বছর যোগ করতে BMS array-এ entries যোগ করুন
//   format: {y: বাংলা বছর, m: মাস index (0=বৈশাখ), s: 'YYYY-MM-DD'}
//   ⚠️ শেষ entry টি পরের বছরের প্রথম দিন হতে হবে
// ════════════════════════════════════════════════════════
const BNM_NAMES=['বৈশাখ','জ্যৈষ্ঠ','আষাঢ়','শ্রাবণ','ভাদ্র','আশ্বিন','কার্তিক','অগ্রহায়ণ','পৌষ','মাঘ','ফাল্গুন','চৈত্র'];
const RITU=['গ্রীষ্ম','গ্রীষ্ম','বর্ষা','বর্ষা','শরৎ','শরৎ','হেমন্ত','হেমন্ত','শীত','শীত','বসন্ত','বসন্ত'];
// ═══ বাংলা মাস — বিশুদ্ধ সিদ্ধান্ত, সম্পূর্ণ যাচাইকৃত ═══
const BMS=[
  {y:1431,m:0,s:'2024-04-14'},{y:1431,m:1,s:'2024-05-15'},{y:1431,m:2,s:'2024-06-15'},
  {y:1431,m:3,s:'2024-07-16'},{y:1431,m:4,s:'2024-08-17'},{y:1431,m:5,s:'2024-09-17'},
  {y:1431,m:6,s:'2024-10-17'},{y:1431,m:7,s:'2024-11-16'},{y:1431,m:8,s:'2024-12-16'},
  {y:1431,m:9,s:'2025-01-14'},{y:1431,m:10,s:'2025-02-13'},{y:1431,m:11,s:'2025-03-14'},
  {y:1432,m:0,s:'2025-04-15'},{y:1432,m:1,s:'2025-05-16'},{y:1432,m:2,s:'2025-06-16'},
  {y:1432,m:3,s:'2025-07-17'},{y:1432,m:4,s:'2025-08-18'},{y:1432,m:5,s:'2025-09-18'},
  {y:1432,m:6,s:'2025-10-18'},{y:1432,m:7,s:'2025-11-17'},{y:1432,m:8,s:'2025-12-17'},
  {y:1432,m:9,s:'2026-01-15'},{y:1432,m:10,s:'2026-02-14'},{y:1432,m:11,s:'2026-03-16'},
  {y:1433,m:0,s:'2026-04-15'},{y:1433,m:1,s:'2026-05-16'},{y:1433,m:2,s:'2026-06-16'},
  {y:1433,m:3,s:'2026-07-18'},{y:1433,m:4,s:'2026-08-19'},{y:1433,m:5,s:'2026-09-17'},
  {y:1433,m:6,s:'2026-10-17'},{y:1433,m:7,s:'2026-11-18'},{y:1433,m:8,s:'2026-12-17'},
  {y:1433,m:9,s:'2027-01-15'},{y:1433,m:10,s:'2027-02-13'},{y:1433,m:11,s:'2027-03-14'},
  {y:1434,m:0,s:'2027-04-14'},{y:1434,m:1,s:'2027-05-15'},{y:1434,m:2,s:'2027-06-15'},
  {y:1434,m:3,s:'2027-07-16'},{y:1434,m:4,s:'2027-08-17'},{y:1434,m:5,s:'2027-09-17'},
  {y:1434,m:6,s:'2027-10-17'},{y:1434,m:7,s:'2027-11-16'},{y:1434,m:8,s:'2027-12-16'},
  {y:1434,m:9,s:'2028-01-15'},{y:1434,m:10,s:'2028-02-14'},{y:1434,m:11,s:'2028-03-14'},
  {y:1435,m:0,s:'2028-04-13'},{y:1435,m:1,s:'2028-05-14'},{y:1435,m:2,s:'2028-06-15'},
  {y:1435,m:3,s:'2028-07-16'},{y:1435,m:4,s:'2028-08-16'},{y:1435,m:5,s:'2028-09-16'},
  {y:1435,m:6,s:'2028-10-16'},{y:1435,m:7,s:'2028-11-15'},{y:1435,m:8,s:'2028-12-15'},
  {y:1435,m:9,s:'2029-01-14'},{y:1435,m:10,s:'2029-02-13'},{y:1435,m:11,s:'2029-03-14'},
  {y:1436,m:0,s:'2029-04-14'},{y:1436,m:1,s:'2029-05-15'},{y:1436,m:2,s:'2029-06-15'},
  {y:1436,m:3,s:'2029-07-17'},{y:1436,m:4,s:'2029-08-17'},{y:1436,m:5,s:'2029-09-17'},
  {y:1436,m:6,s:'2029-10-18'},{y:1436,m:7,s:'2029-11-17'},{y:1436,m:8,s:'2029-12-17'},
  {y:1436,m:9,s:'2030-01-15'},{y:1436,m:10,s:'2030-02-14'},{y:1436,m:11,s:'2030-03-16'},
  {y:1437,m:0,s:'2030-04-15'},{y:1437,m:1,s:'2030-05-16'},{y:1437,m:2,s:'2030-06-16'},
  {y:1437,m:3,s:'2030-07-18'},{y:1437,m:4,s:'2030-08-18'},{y:1437,m:5,s:'2030-09-18'},
  {y:1437,m:6,s:'2030-10-18'},{y:1437,m:7,s:'2030-11-17'},{y:1437,m:8,s:'2030-12-17'},
  {y:1437,m:9,s:'2031-01-15'},{y:1437,m:10,s:'2031-02-14'},{y:1437,m:11,s:'2031-03-16'},
  {y:1438,m:0,s:'2031-04-15'}
];
function getBnInfo(date){const t=date.getTime();let idx=-1;for(let i=BMS.length-1;i>=0;i--){if(t>=new Date(BMS[i].s+'T00:00:00').getTime()){idx=i;break;}}if(idx<0)return null;const e=BMS[idx];const s=new Date(e.s+'T00:00:00');const d=Math.floor((t-s.getTime())/86400000)+1;return{y:e.y,m:e.m,d,name:BNM_NAMES[e.m],ritu:RITU[e.m],vikram:e.y+57,saka:e.y-78};}
function getBnMonthDays(idx){const e=BMS[idx];if(!e||idx+1>=BMS.length)return[];const s=new Date(e.s+'T00:00:00');const nx=new Date(BMS[idx+1].s+'T00:00:00');const days=[];let d=new Date(s),bn=1;while(d<nx){days.push({date:new Date(d),bnDay:bn});d.setDate(d.getDate()+1);bn++;}return days;}
function findTodayIdx(){const t=TODAY.getTime();for(let i=BMS.length-1;i>=0;i--){if(t>=new Date(BMS[i].s+'T00:00:00').getTime())return i;}return 0;}

// ════════════════════════════════════════════════════════
// SECTION ⑧ — ASTRONOMY ENGINE (জ্যোতির্বিদ্যার গণনা)
// কাজ: সূর্য/চন্দ্রের অবস্থান, সূর্যোদয়/সূর্যাস্ত গণনা
//   • JD()       — Julian Date রূপান্তর
//   • sunL()     — সূর্যের দ্রাঘিমাংশ (Tropical)
//   • moonL()    — চন্দ্রের দ্রাঘিমাংশ (Meeus Ch.47, ৫০+ পদ)
//   • sunTimes() — সূর্যোদয় ও সূর্যাস্তের সময়
// পরিবর্তন: সাধারণত দরকার নেই
// ════════════════════════════════════════════════════════
function JD(y,m,d){if(m<=2){y--;m+=12;}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;}
function sunL(jd){const n=jd-2451545,L=((280.46+0.9856474*n)%360+360)%360,g=((357.528+0.9856003*n)%360+360)*Math.PI/180;return((L+1.915*Math.sin(g)+0.02*Math.sin(2*g))%360+360)%360;}
function moonL(jd){const T=(jd-2451545)/36525;const Lp=((218.3164477+481267.88123421*T-0.0015786*T*T)%360+360)%360;const D=((297.8501921+445267.1114034*T-0.0018819*T*T)%360+360)%360;const Ms=((357.5291092+35999.0502909*T)%360+360)%360;const Mp=((134.9633964+477198.8675055*T+0.0087414*T*T)%360+360)%360;const F=((93.2720950+483202.0175233*T-0.0036539*T*T)%360+360)%360;const E=1-0.002516*T;const dr=D*Math.PI/180,msr=Ms*Math.PI/180,mr=Mp*Math.PI/180,fr=F*Math.PI/180;const A1=((119.75+131.849*T)%360+360)*Math.PI/180,A2=((53.09+479264.29*T)%360+360)*Math.PI/180;let sl=6288774*Math.sin(mr)+1274027*Math.sin(2*dr-mr)+658314*Math.sin(2*dr)+213618*Math.sin(2*mr)-185116*E*Math.sin(msr)-114332*Math.sin(2*fr)+58793*Math.sin(2*dr-2*mr)+57066*E*Math.sin(2*dr-msr-mr)+53322*Math.sin(2*dr+mr)+45758*E*Math.sin(2*dr-msr)-40923*E*Math.sin(msr-mr)-34720*Math.sin(dr)-30383*E*Math.sin(msr+mr)+15327*Math.sin(2*dr-2*fr)+10675*Math.sin(4*dr-mr)+10034*Math.sin(3*mr)+8548*Math.sin(4*dr-2*mr)-7888*E*Math.sin(2*dr+msr-mr)-6766*E*Math.sin(2*dr+msr)-5163*Math.sin(dr-mr)+4987*E*Math.sin(dr+msr)+4036*E*Math.sin(2*dr-msr+mr)+3994*Math.sin(2*dr+2*mr)+3861*Math.sin(4*dr)+3665*Math.sin(2*dr-3*mr)-2689*E*Math.sin(msr-2*mr)+2390*E*Math.sin(2*dr-msr-2*mr)-2348*Math.sin(dr+mr)+2236*E*E*Math.sin(2*dr-2*msr)-2120*E*Math.sin(msr+2*mr)+2048*E*E*Math.sin(2*dr-2*msr-mr)-1773*Math.sin(2*dr+mr-2*fr)-1595*Math.sin(2*dr+2*fr)+1215*E*Math.sin(4*dr-msr-mr)-892*Math.sin(3*dr-mr)-810*E*Math.sin(2*dr+msr+mr)+759*E*Math.sin(4*dr-msr-2*mr)+691*E*Math.sin(2*dr+msr-2*mr)+549*Math.sin(4*dr+mr)+537*Math.sin(4*mr)+520*E*Math.sin(4*dr-msr)+299*E*Math.sin(dr+msr-mr)+294*Math.sin(2*dr+3*mr);sl+=3958*Math.sin(A1)+1962*Math.sin(Lp*Math.PI/180-fr)+318*Math.sin(A2);return((Lp+sl/1000000)%360+360)%360;}
// ── NC Lahiri Ayanamsa (সঠিক) ──
// N.C. Lahiri AY ✓
function lahiriAY(jd){const T=(jd-2451545)/36525;return 23.853167+1.39694*T+0.000617*T*T;}
// ── ধীর গ্রহ (Slow Planets) ──
function saturnL(jd){const T=(jd-2451545)/36525;const L=((50.077444+1222.113777*T)%360+360)%360;const M=((316.967+1221.552*T)%360+360)*Math.PI/180;return((L+6.3585*Math.sin(M)+0.2204*Math.sin(2*M))%360+360)%360;}
function jupiterL(jd){const T=(jd-2451545)/36525;const L=((34.351519+3034.905675*T)%360+360)%360;const M=((20.9+3034.9*T)%360+360)*Math.PI/180;return((L+5.5549*Math.sin(M)+0.1683*Math.sin(2*M))%360+360)%360;}
function rahuL(jd){const T=(jd-2451545)/36525;return((125.0445479-1934.1362608*T+0.0020754*T*T)%360+360)%360;}

// ════════════════════════════════════════════════════════════════
// JPL Horizons DE441 Ephemeris (Sun, Moon, Mars) — 2026-2032
// Accuracy: ±30 arc-seconds vs reference charts ✓
// ════════════════════════════════════════════════════════════════
/**
 * jpl-ephemeris.js — JPL Horizons DE441 Ephemeris Data
 * 
 * Source: NASA JPL Horizons (https://ssd.jpl.nasa.gov/horizons/)
 * Body: Sun(10), Moon(301), Mars(499)
 * Type: Observer ecliptic longitude (tropical), geocentric
 * Period: 2026-Jan-01 to 2032-Jan-01 (daily at 00:00 UT)
 * Reference frame: ICRF, Obliquity-based ecliptic
 * 
 * Accuracy verification (Apr 3, 2026 11:00 IST, Kolkata):
 *   Mars: মীন 0°38′27″ ≈ ref 0°38′11″ (±16″) ✓
 *   Sun:  মীন 19°15′16″ ≈ ref 19°15′50″ (±34″) ✓  
 *   Moon: তুলা 2°19′27″ ≈ ref 2°19′52″ (±25″) ✓
 * 
 * Usage: getJplLongitude(body, jd) → tropical ecliptic degrees
 *   body: 'sun', 'moon', 'mars'
 *   jd: Julian Date (e.g. JD(2026,4,3)+5.5/24 for 11:00 IST Apr 3)
 */

// Start JD (2026-Jan-01 00:00 UT = JD 2461041.5)

// ═══════════════════════════════════════════════════════════════════════
//  বহু-গ্রহ JPL ইন্টারপোলেশন ইঞ্জিন — নতুন ও উন্নত
//  সমস্ত ডেটা: NASA JPL Horizons DE441 (সম্পূর্ণ, কাটছাঁট নেই)
//  JD_2026 = 2461041.5  → সূর্য, চন্দ্র (দৈনিক, 2026-2032)
//  JD_2025 = 2460676.5  → শুক্র, বৃহস্পতি, শনি (দৈনিক, 2025-2031)
//  JD_MARS = 2436934.5  → মঙ্গল (৫-দিন, 1960-2040)
//  JD_MONH = 2460676.5  → চন্দ্র (ঘণ্টাভিত্তিক, 2025-2031)
// ═══════════════════════════════════════════════════════════════════════
const JD_2026=2461041.5, JD_2025=2460676.5, JD_MARS=2436934.5;

/** linear interpolation with 0°/360° wrap */
function _eph(arr, J, jdStart, step) {
  const raw=(J-jdStart)/step;
  let i=Math.floor(raw);
  if(i<0) i=0;
  if(i>=arr.length-1) i=arr.length-2;
  const f=raw-i; let a=arr[i], b=arr[i+1];
  if(Math.abs(b-a)>180){ b>a ? (a+=360) : (b+=360); }
  return (a+f*(b-a)+360)%360;
}

/** Lahiri ayanamsa (চিত্রাপক্ষ) */
function lahiriAY(J) {
  const T=(J-2451545)/36525;
  return 23.8561 + T*(50.2772*100/3600);
}

/** tropical → sidereal */
function _sid(lon, J) { return (lon - lahiriAY(J) + 360) % 360; }

// ─── Tropical longitudes from JPL ───────────────────────────────────
function sunL(J)  { return _eph(SUN_D,J,JD_2026,1); }
function moonLd(J){ return _eph(MON_D,J,JD_2026,1); }  // daily
function moonLh(J){ // hourly (high precision)
  if(typeof MON_H!=='undefined'&&J>=JD_2025&&J<=JD_2025+MON_H.length/24)
    return _eph(MON_H,J,JD_2025,1/24);
  return moonLd(J);
}
function venusL(J) { return typeof VEN_D!=='undefined'?_eph(VEN_D,J,JD_2025,1):null; }
function jupL(J)   { return typeof JUP_D!=='undefined'?_eph(JUP_D,J,JD_2025,1):null; }
function satL(J)   { return typeof SAT_D!=='undefined'?_eph(SAT_D,J,JD_2025,1):null; }
function marsL(J)  { return typeof MAR_D!=='undefined'?_eph(MAR_D,J,JD_MARS,5):null; }

// Mercury: analytical (Meeus) — JPL data pending
// ত্রুটি ≤ ~1° (বুধ খুব দ্রুত সরে, analytical-এই চলে)
function mercuryL(J) {
  const T=(J-2451545)/36525;
  const L=(252.250906+149474.0722491*T)%360;
  const M=Math.PI/180*((174.7948+149472.5151*T)%360);
  const C=(23.4400-0.0490*T)*Math.sin(M)+2.9818*Math.sin(2*M)+0.5255*Math.sin(3*M);
  return (L+C+360)%360;
}

// Rahu (mean node, tropical)
function rahuTrop(J) {
  const T=(J-2451545)/36525;
  return ((125.0445479-1934.1362608*T+0.0020754*T**2)%360+360)%360;
}

// ─── Sidereal longitudes ─────────────────────────────────────────────
function sunLon(J)    { return _sid(sunL(J),J); }
function moonLon(J)   { return _sid(moonLd(J),J); }
function moonLonH(J)  { return _sid(moonLh(J),J); }  // hourly
function marsLon(J)   { const v=marsL(J); return v!==null?_sid(v,J):null; }
function venusLon(J)  { const v=venusL(J); return v!==null?_sid(v,J):null; }
function jupLon(J)    { const v=jupL(J); return v!==null?_sid(v,J):null; }
function satLon(J)    { const v=satL(J); return v!==null?_sid(v,J):null; }
function mercuryLon(J){ return _sid(mercuryL(J),J); }
function rahuLon(J)   { return _sid(rahuTrop(J),J); }

// Legacy aliases (পুরনো কোড compatibility)
const marsLon_jpl=marsLon;
function getJplLongitude(body,J){
  if(body==='sun')  return sunL(J);
  if(body==='moon') return moonLd(J);
  if(body==='mars'){const v=marsL(J);return v!==null?v:0;}
  return 0;
}
function getJplSiderealLon(body,J){ return _sid(getJplLongitude(body,J),J); }
function getMarsLong(J){ return marsLon(J)||0; }
function isMarsRetro(J){
  const m1=marsL(J-0.5), m2=marsL(J+0.5);
  if(m1===null||m2===null) return false;
  let d=m2-m1; if(d>180)d-=360; if(d<-180)d+=360; return d<0;
}
function jupiterL(J){ return jupL(J)||0; }
function saturnL(J) { return satL(J)||0; }
function jupiterSid(J){ return jupLon(J)||0; }
function saturnSid(J) { return satLon(J)||0; }
function moonL(J){ return moonLd(J); }
function rahuL(J){ return rahuTrop(J); }

// ─── GMST / LST / Lagna ─────────────────────────────────────────────
function _gmst(J){
  const T=(J-2451545)/36525;
  return((280.46061837+360.98564736629*(J-2451545)+0.000387933*T*T-T*T*T/38710000)+360000*360)%360;
}
function calcLagnaAt(J, lat, lon) {
  const lst=(_gmst(J)+lon+360)%360;
  const T=(J-2451545)/36525;
  const eps=Math.PI/180*(23.439291111-0.013004167*T);
  const L=Math.PI/180*lat, R=Math.PI/180*lst;
  const y=Math.cos(R), x=-(Math.sin(R)*Math.cos(eps)+Math.tan(L)*Math.sin(eps));
  let asc=(Math.atan2(y,x)*180/Math.PI+360)%360;
  // Quadrant correction
  const diff=(asc-lst+360)%360;
  if(diff<90||diff>270) asc=(asc+180)%360;
  const sid=(asc-lahiriAY(J)+360)%360;
  return {sid, ri:Math.floor(sid/30), tropical:asc};
}
function calcSunriseLagna(jdR,lat,lng){
  const r=calcLagnaAt(jdR,lat,lng);
  return {ascSid:r.sid,ri:r.ri,descRi:Math.floor(((r.sid+180)%360)/30)};
}

// ─── সব ৯ গ্রহের সম্পূর্ণ অবস্থান ──────────────────────────────────
function getAllPlanetPositions(jdSunrise) {
  const ay=lahiriAY(jdSunrise);
  function mkGraha(name, trop, isRetro) {
    if(trop===null||isNaN(trop)) return null;
    const sid=(trop-ay+360)%360;
    const ri=Math.floor(sid/30), di=sid%30;
    const ni=Math.floor(sid/(360/27)), degN=sid%(360/27);
    const pada=Math.floor(degN/(360/108))+1;
    const d=Math.floor(di), m=Math.floor((di-d)*60), s=Math.round(((di-d)*60-m)*60);
    return{name,sid,ri,rashi:L_BN[ri],deg:d,min:m,sec:s,
           ni,nak:NAKS[ni][0],nakLord:NAKS[ni][1],pada,isRetro:isRetro||false};
  }
  const rahSid=rahuLon(jdSunrise), ketSid=(rahSid+180)%360;
  return {
    sun: mkGraha('সূর্য',   sunL(jdSunrise),        false),
    mon: mkGraha('চন্দ্র',  moonLd(jdSunrise),       false),
    mar: mkGraha('মঙ্গল',   marsL(jdSunrise),        isMarsRetro(jdSunrise)),
    mer: mkGraha('বুধ',     mercuryL(jdSunrise),     false),
    ven: mkGraha('শুক্র',   venusL(jdSunrise),       false),
    jup: mkGraha('বৃহস্পতি',jupL(jdSunrise),         false),
    sat: mkGraha('শনি',     satL(jdSunrise),         false),
    rah: {name:'রাহু', sid:rahSid, ri:Math.floor(rahSid/30), rashi:L_BN[Math.floor(rahSid/30)],
          ni:Math.floor(rahSid/(360/27)), nak:NAKS[Math.floor(rahSid/(360/27))][0],
          deg:Math.floor(rahSid%30), min:Math.floor((rahSid%30-Math.floor(rahSid%30))*60),
          pada:Math.floor((rahSid%(360/27))/(360/108))+1, isRetro:true},
    ket: {name:'কেতু', sid:ketSid, ri:Math.floor(ketSid/30), rashi:L_BN[Math.floor(ketSid/30)],
          ni:Math.floor(ketSid/(360/27)), nak:NAKS[Math.floor(ketSid/(360/27))][0],
          deg:Math.floor(ketSid%30), min:Math.floor((ketSid%30-Math.floor(ketSid%30))*60),
          pada:Math.floor((ketSid%(360/27))/(360/108))+1, isRetro:true},
  };
}

// ─── অমৃতযোগ ─────────────────────────────────────────────────────────
// দিনে: নির্দিষ্ট বার + নক্ষত্রের সংযোগ
const AMRITA_D_NAK={0:12,1:4,2:0,3:16,4:7,5:26,6:3}; // weekday→nakIdx
const AMRITA_D_HR = [ // দিনের কোন অংশে (1-8, প্রতি অংশ dayLen/8)
  [7,8],[2,3],[1,2],[6,7],[5,6],[4,5],[3,4] // রবি-শনি
];
// রাতে: সন্ধ্যার পর নির্দিষ্ট নক্ষত্র
const AMRITA_N_NAK={0:3,1:26,2:16,3:7,4:0,5:12,6:4};

// ─── মাহেন্দ্র যোগ ───────────────────────────────────────────────────
// লগ্ন নক্ষত্র থেকে চন্দ্র নক্ষত্রের ব্যবধান = 4,7,10,13,16,19,22,25
const MAHENDRA_DIFFS=new Set([4,7,10,13,16,19,22,25]);
function checkMahendraYoga(lagNakIdx, moonNakIdx) {
  const diff=(moonNakIdx-lagNakIdx+27)%27;
  return MAHENDRA_DIFFS.has(diff);
}

// ─── সর্বার্থসিদ্ধি যোগ ─────────────────────────────────────────────
const SARVARTHA={
  0:[12,4,7,26,0,11],1:[3,4,7,16,18,13,26],2:[0,2,6,11,22,20],
  3:[3,5,4,12,13,17],4:[7,12,11,20,25,26],5:[0,16,11,3,7,26,4],
  6:[3,14,15,16,25,26]
};
const RAVI_YOGA={0:[0,12,22],1:[3,11,15],2:[4,13,21],3:[7,5,18],4:[9,16,26],5:[2,19,25],6:[6,23,17]};
const AMRITA_YOGA={0:12,1:4,2:0,3:16,4:7,5:26,6:3};

function getSpecialYogas(weekday, nakIdx, lagNakIdx) {
  const y=[];
  if(SARVARTHA[weekday]&&SARVARTHA[weekday].includes(nakIdx))
    y.push({name:'সর্বার্থসিদ্ধি যোগ',icon:'✨',short:'সর্বসিদ্ধি',
      desc:'সব কাজে সিদ্ধি লাভের শ্রেষ্ঠ যোগ। বিবাহ, গৃহপ্রবেশ, ব্যবসা সর্বত্র শুভ।'});
  if(RAVI_YOGA[weekday]&&RAVI_YOGA[weekday].includes(nakIdx))
    y.push({name:'রবিযোগ',icon:'☀️',short:'রবিযোগ',
      desc:'সূর্যের শুভ প্রভাবে সাফল্যের যোগ।'});
  if(AMRITA_YOGA[weekday]===nakIdx)
    y.push({name:'অমৃতযোগ',icon:'🌙',short:'অমৃত',
      desc:'অমৃতের মতো ফলদায়ক — সব শুভ কার্যে উত্তম।'});
  if(lagNakIdx!==undefined&&checkMahendraYoga(lagNakIdx,nakIdx))
    y.push({name:'মাহেন্দ্র যোগ',icon:'⚡',short:'মাহেন্দ্র',
      desc:'লগ্ন ও চন্দ্র নক্ষত্রের মাহেন্দ্র ব্যবধান — দীর্ঘস্থায়ী সমৃদ্ধির যোগ।'});
  return y;
}

// ─── অমৃতযোগের সময় (দিন + রাত) ──────────────────────────────────────
function calcAmritaD(rise,set,w){
  const seg=(set-rise)/8, slots=AMRITA_D_HR[w]||[];
  return slots.map(s=>({st:rise+(s-1)*seg,en:rise+s*seg}));
}
function calcAmritaN(set,nextRise,w){
  // নিশীথকালে (রাত ১১টা-১টা অঞ্চল) অমৃতযোগ
  const seg=(nextRise+24-set)/8; const slot=[2,3,4,5,6,7,8,1][w]||3;
  return [{st:set+(slot-1)*seg, en:set+slot*seg}];
}

// ─── মাহেন্দ্রযোগের সময় ─────────────────────────────────────────────
function calcMahendra(rise,set,w){
  // দিনের মধ্যভাগে (৫ম-৬ষ্ঠ অংশ)
  const seg=(set-rise)/8;
  return [{st:rise+4*seg,en:rise+6*seg}];
}

// ─── নক্ষত্র পরিবর্তনের মিনিট পর্যন্ত সময় ───────────────────────────
function getMoonNakTransitions(y,m,d) {
  const jd0=JD(y,m,d), res=[]; let prev=-1;
  for(let hIST=0; hIST<48; hIST+=1/60) {
    const hUT=hIST-TZ;
    const J=jd0+hUT/24;
    const sid=moonLonH(J);
    const ni=Math.floor(sid/(360/27));
    if(ni!==prev&&prev!==-1&&res.length<4) {
      res.push({timeIST:hIST,nakIdx:ni,nak:NAKS[ni][0],
               lord:NAKS[ni][1],pada:1,timeStr:fmtT(hIST)});
    }
    prev=ni;
  }
  return res;
}

// ─── মৃত্যু দোষ (সময়ভিত্তিক) ────────────────────────────────────────
const MD_BAR=new Set([0,2,6]);      // রবি,মঙ্গল,শনি
const MD_TITHI=new Set([2,7,12]);   // দ্বিতীয়া,সপ্তমী,দ্বাদশী
const MD_NAK=new Set([2,6,11,15,20,24]); // 0-based nakIdx

function getMrityuDoshaFull(y,m,d,weekday,st) {
  const jd0=JD(y,m,d), segs=[]; let prevNak=-1, segStart=st.rise;
  for(let hIST=st.rise; hIST<=st.rise+25; hIST+=1/60) {
    const J=jd0+(hIST-TZ)/24;
    const monSid=moonLonH(J);
    const ni=Math.floor(monSid/(360/27));
    const sunSid=sunLon(J);
    const tithiNum=Math.floor(((monSid-sunSid+360)%360)/12)+1;
    if(ni!==prevNak) {
      if(prevNak!==-1) {
        const bW=MD_BAR.has(weekday)?1:0;
        const tW=MD_TITHI.has(tithiNum)?1:0;
        const nW=MD_NAK.has(prevNak)?2:0;
        const sc=bW+tW+nW;
        const nm=['দোষমুক্ত','একপাদ দোষ','দ্বিপাদ দোষ','ত্রিপাদ দোষ','পুষ্কর দোষ'];
        let pt='';
        if(sc===4){const bv=[1,2,3,4,5,6,7][weekday];const r=(bv+35)%3;
          pt=r===0?'মর্ত্যবাসী':r===1?'স্বর্গবাসী':'পাতালবাসী';}
        segs.push({start:segStart,end:hIST,nakIdx:prevNak,nak:NAKS[prevNak][0],
          score:sc,name:sc>0?nm[sc]:'দোষমুক্ত',pushkar:pt,
          barDosha:bW>0,tithiDosha:tW>0,nakDosha:nW>0,
          startStr:fmtT(segStart),endStr:fmtT(hIST)});
      }
      segStart=hIST; prevNak=ni;
      if(segs.length>=4) break;
    }
  }
  return segs;
}

// ─── বিবাহের লগ্ন window ─────────────────────────────────────────────
const VV_L=[2,5,6,8,11]; // মিথুন,কন্যা,তুলা,ধনু,কুম্ভ (0-based rashi)
const GH_L=[1,3,4,5,6,8,11]; // গৃহপ্রবেশ
const GB_L=[2,4,5,6,8,9,11]; // গর্ভধারণ
const BS_L=[1,3,6,9,10,11];  // ব্যবসা

function getLagnaWins(y,m,d,lSet,lat,lng,tz) {
  lat=lat||LAT; lng=lng||LNG; tz=tz||TZ;
  const w=[]; let pR=-1, sH=null;
  for(let i=0; i<=36*30; i++) {
    const h=18+i*2/60; if(h>=54) break;
    const hi=h>=24?h-24:h;
    const jT=JD(y,m,h>=24?d:d-1)+(hi-tz+(h>=24?0:24))/24;
    const ri=calcLagnaAt(jT,lat,lng).ri;
    if(ri!==pR){
      if(pR>-1&&lSet.includes(pR)&&sH!==null)
        w.push({ri:pR,n:L_BN[pR],s:sH,e:hi,nd:sH>hi||hi<6});
      sH=lSet.includes(ri)?hi:null; pR=ri;
    }
  }
  return w;
}

// ─── লগ্ন ট্রানজিট তালিকা ─────────────────────────────────────────────
function getLagnaTransits(y,m,d,lat,lng,tz) {
  lat=lat||LAT; lng=lng||LNG; tz=tz||TZ;
  const r=[]; let prev=-1;
  for(let i=0; i<48*4; i++) {
    const hIST=i*0.25;
    const hUT=hIST-tz;
    const J=JD(y,m,d)+hUT/24;
    const ri=calcLagnaAt(J,lat,lng).ri;
    if(ri!==prev) {
      r.push({hIST,ri,lagna:L_BN[ri],hStr:fmtT(hIST)});
      prev=ri;
    }
  }
  return r;
}

// ─── Retrograde check for all planets ───────────────────────────────
function getRetroStatus(jdR){
  function isRetro(fn,J){
    const a=fn(J-0.5),b=fn(J+0.5);
    if(a===null||b===null) return false;
    let d=b-a; if(d>180)d-=360; if(d<-180)d+=360; return d<0;
  }
  return {
    mars: isMarsRetro(jdR),
    jup:  isRetro(jupL,jdR),
    sat:  isRetro(satL,jdR),
    ven:  isRetro(venusL,jdR),
    mer:  isRetro(mercuryL,jdR),
    rahu: true, ketu: true
  };
}

// ════ বক্রগতি ════
function _isRG(fn,jd){let d=(fn(jd+0.5)-fn(jd-0.5)+360)%360;if(d>180)d-=360;return d<0;}
function getRetroStatus(jdR){
  // Mars: check JPL data for retrograde
  var mD=getJplLongitude("mars",jdR+1)-getJplLongitude("mars",jdR-1);
  if(mD>180)mD-=360; if(mD<-180)mD+=360;
  return{mars:mD<0,jup:_isRG(jupiterL,jdR),sat:_isRG(saturnL,jdR),rahu:true,ketu:true};}

// ════ বারবেলা / কালরাত্রি / অমৃতযোগ ════
const BB_T=[[4,7],[2,6],[6,2],[3,5],[5,7],[1,5],[8,4]];
function calcBaarbell(r,s,w){const p=(s-r)*60/8;return BB_T[w].map(sl=>({st:r+(sl-1)*p/60,en:r+sl*p/60}));}
const KR_T=[5,3,7,7,7,3,6];
function calcKaalratri(ss,nr,w){const nm=((nr+24)-ss)*60,p=nm/8,sl=KR_T[w]-1;return{st:ss+sl*p/60,en:ss+(sl+1)*p/60};}
const AM_D=[[5,6,11,12],[1,2,8,9,12,13],[3,4,10,11,14,15],[1,2,6,7,13,14],[3,4,10,11],[1,2,5,6,12,13],[2,3,8,9,14,15]];
const MH_D=[[8,9],[12,13],[7,8],[11,12],[6,7],[9,10],[5,6]];
const AM_N=[[6,7,13,14],[3,4,9,10,11,12,13,14,15],[4,5,11,12],[2,3,4,10,11,12,13,14,15],[4,5,12,13],[1,2,7,8,14,15],[3,4,10,11]];
function _mkP(sl,b,m){const r=[];let i=0;while(i<sl.length){const s=sl[i]-1;let e=sl[i];while(i+1<sl.length&&sl[i+1]===sl[i]+1){i++;e=sl[i];}r.push({st:b+s*m/60,en:b+e*m/60});i++;}return r;}
function calcAmritaD(r,s,w){return _mkP(AM_D[w],r,(s-r)*60/15);}
function calcAmritaN(ss,nr,w){return _mkP(AM_N[w],ss,((nr+24)-ss)*60/15);}
function calcMahendra(r,s,w){const sl=MH_D[w],m=(s-r)*60/15;return sl&&sl.length?{st:r+(sl[0]-1)*m/60,en:r+sl[sl.length-1]*m/60}:null;}

// ════ মৃত্যু দোষ ════
const DD_BAR=[0,2,6],DD_TI=[1,6,11],DD_NAK=[2,6,11,15,20,24];
const DD_NM=["দোষ নেই","একপাদ দোষ","দ্বিপাদ দোষ","ত্রিপাদ দোষ","পুষ্কর দোষ"];
function calcDD(wd,tiInPak,ni){const bar=DD_BAR.includes(wd)?1:0,ti=DD_TI.includes(tiInPak%15)?1:0,nak=DD_NAK.includes(ni%27)?2:0,tot=bar+ti+nak;let pk="";if(tot===4){const wv=[1,2,3,4,5,6,7][wd]||1;const r=(wv+35)%3;pk=r===1?" (স্বর্গবাসী)":r===2?" (পাতালবাসী)":" (মর্ত্যবাসী)";}return{total:tot,name:(DD_NM[tot]||"পুষ্কর দোষ")+pk};}
const MRITYU_DOSHA=["","সর্বদোষ","গো-দোষ","","","সর্বদোষ","","","সর্পদোষ","পিতৃদোষ","সর্বদোষ","দ্বিপাদদোষ","","","সর্বদোষ","","","সর্বদোষ","পিতৃদোষ","সর্বদোষ","","","","সর্পদোষ","দ্বিপাদদোষ","",""];

// ════ লগ্ন ════
const L_BN=["মেষ","বৃষ","মিথুন","কর্কট","সিংহ","কন্যা","তুলা","বৃশ্চিক","ধনু","মকর","কুম্ভ","মীন"];
function calcLagnaAt(jd,lat,lng){const T=(jd-2451545)/36525,G=((280.46061837+360.98564736629*(jd-2451545)+0.000387933*T*T)%360+360)%360,Lm=((G+lng)%360+360)%360,eps=23.439*Math.PI/180,latR=lat*Math.PI/180,R=Lm*Math.PI/180;const mc=((Math.atan2(Math.sin(R),Math.cos(R)*Math.cos(eps))*180/Math.PI)+360)%360;const yA=-Math.cos(R),xA=Math.sin(eps)*Math.tan(latR)+Math.cos(eps)*Math.sin(R);let E=((Math.atan2(yA,xA)*180/Math.PI)+360)%360,E2=(E+180)%360;if((E-mc+360)%360<90||(E-mc+360)%360>270)E=E2;const ay=lahiriAY(jd),sid=((E-ay)%360+360)%360;return{sid,ri:Math.floor(sid/30),deg:sid%30};}
function calcSunriseLagna(jdR,lat,lng){const r=calcLagnaAt(jdR,lat,lng);return{ascSid:r.sid,ri:r.ri,descRi:Math.floor(((r.sid+180)%360)/30)};}

// ════ শুভকর্ম লগ্ন ════
const VV_L=[2,5,6,8,11]; const GH_L=[1,3,4,5,6,8,11]; const GB_L=[2,4,5,6,8,9,11]; const BS_L=[1,3,6,9,10,11];
function getLagnaWins(y,m,d,lSet,lat,lng,tz){lat=lat||LAT;lng=lng||LNG;tz=tz||TZ;const w=[];let pR=-1,sH=null;for(let i=0;i<=36*30;i++){const h=18+i*2/60;if(h>=54)break;const hi=h>=24?h-24:h;const jT=JD(y,m,h>=24?d:d-1)+(hi-tz+(h>=24?0:24))/24;const ri=calcLagnaAt(jT,lat,lng).ri;if(ri!==pR){if(pR>-1&&lSet.includes(pR)&&sH!==null)w.push({ri:pR,n:L_BN[pR],s:sH,e:hi,nd:sH>hi||hi<6});sH=lSet.includes(ri)?hi:null;pR=ri;}}return w;}

function sunTimes(y,m,d){const jd0=JD(y,m,d),n=jd0-2451545+0.5;const L=((280.46646+0.9856474*n)%360+360)%360,g=((357.52911+0.9856003*n)%360+360)*Math.PI/180;const lam=L+1.914602*Math.sin(g)+0.019993*Math.sin(2*g);const eps=23.439*Math.PI/180,lamR=lam*Math.PI/180,sinDec=Math.sin(eps)*Math.sin(lamR),dec=Math.asin(sinDec);const e2=0.016708634,y2=Math.tan(eps/2)**2,lR=L*Math.PI/180;const EoT=4*(y2*Math.sin(2*lR)-2*e2*Math.sin(g)+4*e2*y2*Math.sin(g)*Math.cos(2*lR)-0.5*y2*y2*Math.sin(4*lR)-1.25*e2*e2*Math.sin(2*g))*180/Math.PI;const latR=LAT*Math.PI/180,cosH=(Math.sin(0.267*Math.PI/180)-Math.sin(latR)*sinDec)/(Math.cos(latR)*Math.cos(dec));if(Math.abs(cosH)>1)return{rise:6,set:18};const H=Math.acos(Math.min(1,Math.max(-1,cosH)))*180/Math.PI;const noon=(720-4*LNG-EoT)/60+TZ;return{rise:noon-H/15,set:noon+H/15};}

// ════════════════════════════════════════════════════════
// SECTION ⑤ — PANJIKA NAMES (পঞ্চাঙ্গের বাংলা নামের তালিকা)
// কাজ: তিথি, নক্ষত্র, যোগ, করণের নাম ধরে রাখে
//   • TNAMES[30]  — ৩০টি তিথির নাম (শুক্ল প্রতিপদ → কৃষ্ণ অমাবস্যা)
//   • NAKS[27]    — ২৭টি নক্ষত্রের নাম ও অধিপতি গ্রহ
//   • YOGAS[27]   — ২৭টি যোগের নাম ও শুভ/অশুভ চিহ্ন
//   • KARANS[11]  — করণের নাম (৭টি চর + ৪টি স্থির)
// পরিবর্তন: নামের বানান ঠিক করতে এখানে আসুন
// ════════════════════════════════════════════════════════
const TNAMES=['প্রতিপদ','দ্বিতীয়া','তৃতীয়া','চতুর্থী','পঞ্চমী','ষষ্ঠী','সপ্তমী','অষ্টমী','নবমী','দশমী','একাদশী','দ্বাদশী','ত্রয়োদশী','চতুর্দশী','পূর্ণিমা','প্রতিপদ','দ্বিতীয়া','তৃতীয়া','চতুর্থী','পঞ্চমী','ষষ্ঠী','সপ্তমী','অষ্টমী','নবমী','দশমী','একাদশী','দ্বাদশী','ত্রয়োদশী','চতুর্দশী','অমাবস্যা'];
const NAKS=[['অশ্বিনী','কেতু'],['ভরণী','শুক্র'],['কৃত্তিকা','সূর্য'],['রোহিণী','চন্দ্র'],['মৃগশিরা','মঙ্গল'],['আর্দ্রা','রাহু'],['পুনর্বসু','গুরু'],['পুষ্যা','শনি'],['আশ্লেষা','বুধ'],['মঘা','কেতু'],['পূর্বফাল্গুনী','শুক্র'],['উত্তরফাল্গুনী','সূর্য'],['হস্তা','চন্দ্র'],['চিত্রা','মঙ্গল'],['স্বাতী','রাহু'],['বিশাখা','গুরু'],['অনুরাধা','শনি'],['জ্যেষ্ঠা','বুধ'],['মূলা','কেতু'],['পূর্বাষাঢ়া','শুক্র'],['উত্তরাষাঢ়া','সূর্য'],['শ্রবণা','চন্দ্র'],['ধনিষ্ঠা','মঙ্গল'],['শতভিষা','রাহু'],['পূর্বভাদ্র','গুরু'],['উত্তরভাদ্র','শনি'],['রেবতী','বুধ']];
const YOGAS=[['বিষ্কুম্ভ','✗'],['প্রীতি','✓'],['আয়ুষ্মান','✓'],['সৌভাগ্য','✓'],['শোভন','✓'],['অতিগণ্ড','✗'],['সুকর্মা','✓'],['ধৃতি','✓'],['শূল','✗'],['গণ্ড','✗'],['বৃদ্ধি','✓'],['ধ্রুব','✓'],['ব্যাঘাত','✗'],['হর্ষণ','✓'],['বজ্র','✗'],['সিদ্ধি','✓'],['ব্যতীপাত','✗'],['বরীয়ান','✓'],['পরিঘ','✗'],['শিব','✓'],['সিদ্ধ','✓'],['সাধ্য','✓'],['শুভ','✓'],['শুক্ল','✓'],['ব্রহ্ম','✓'],['ইন্দ্র','✓'],['বৈধৃতি','✗']];
const KARANS=['বব','বালব','কৌলব','তৈতিল','গর','বণিজ','বিষ্টি','শকুনি','চতুষ্পাদ','নাগ','কিংস্তুঘ্ন'];
const RS=[4,2,6,5,6,4,3],GS=[6,5,4,3,2,1,7],YS=[5,4,3,2,1,7,6];
// ════════════════════════════════════════════════════════
// SECTION ⑥ — FESTIVAL LIST (উৎসব ও ব্রতের তালিকা)
// কাজ: ক্যালেন্ডার ও detail panel-এ উৎসব দেখায়
// পরিবর্তন: প্রতি বছর নতুন উৎসব যোগ করুন
//   format: {d:'YYYY-MM-DD', n:'উৎসবের নাম', i:'🎉'}
// ════════════════════════════════════════════════════════
const FESTS=[
  {d:'2025-04-14',n:'পয়লা বৈশাখ – বাংলা নববর্ষ ১৪৩২',i:'🎉'},{d:'2025-04-30',n:'অক্ষয় তৃতীয়া',i:'🌟'},
  {d:'2025-05-12',n:'বুদ্ধ পূর্ণিমা',i:'☸️'},{d:'2025-06-27',n:'রথযাত্রা',i:'🎡'},
  {d:'2025-08-09',n:'জন্মাষ্টমী',i:'🦚'},{d:'2025-08-27',n:'গণেশ চতুর্থী',i:'🐘'},
  {d:'2025-09-29',n:'মহালয়া',i:'🌙'},{d:'2025-10-02',n:'মহাষষ্ঠী',i:'🪔'},
  {d:'2025-10-03',n:'মহাসপ্তমী',i:'🪔'},{d:'2025-10-04',n:'মহাঅষ্টমী',i:'🪔'},
  {d:'2025-10-05',n:'মহানবমী',i:'🪔'},{d:'2025-10-06',n:'বিজয়াদশমী',i:'🎊'},
  {d:'2025-10-20',n:'কোজাগরী লক্ষ্মীপূজা',i:'🌕'},{d:'2025-10-29',n:'কালীপূজা / দীপাবলি',i:'🪔'},
  {d:'2025-11-05',n:'ভাইফোঁটা',i:'💛'},{d:'2025-12-25',n:'বড়দিন',i:'🎄'},
  {d:'2026-01-01',n:'ইংরেজি নববর্ষ',i:'🎆'},{d:'2026-01-15',n:'পৌষ সংক্রান্তি / মকরসংক্রান্তি',i:'🌾'},
  {d:'2026-01-26',n:'প্রজাতন্ত্র দিবস',i:'🇮🇳'},{d:'2026-02-18',n:'মহাশিবরাত্রি',i:'🔱'},
  {d:'2026-03-04',n:'দোল পূর্ণিমা / হোলি',i:'🎨'},{d:'2026-03-22',n:'চৈত্র নবরাত্রি',i:'🌸'},
  {d:'2026-03-29',n:'রামনবমী',i:'🏹'},{d:'2026-04-14',n:'মহাবিষুব সংক্রান্তি',i:'🕉️'},
  {d:'2026-04-15',n:'পয়লা বৈশাখ – বাংলা নববর্ষ ১৪৩৩',i:'🎉'},{d:'2026-05-01',n:'মে দিবস',i:'✊'},
  {d:'2026-05-31',n:'বুদ্ধ পূর্ণিমা',i:'☸️'},{d:'2026-07-17',n:'রথযাত্রা',i:'🎡'},
  {d:'2026-08-15',n:'স্বাধীনতা দিবস',i:'🇮🇳'},{d:'2026-08-28',n:'জন্মাষ্টমী',i:'🦚'},
  {d:'2026-09-17',n:'গণেশ চতুর্থী',i:'🐘'},{d:'2026-10-17',n:'মহালয়া',i:'🌙'},
  {d:'2026-10-20',n:'মহাষষ্ঠী',i:'🪔'},{d:'2026-10-21',n:'মহাসপ্তমী',i:'🪔'},
  {d:'2026-10-22',n:'মহাঅষ্টমী',i:'🪔'},{d:'2026-10-23',n:'মহানবমী',i:'🪔'},
  {d:'2026-10-24',n:'বিজয়াদশমী',i:'🎊'},{d:'2026-11-08',n:'কালীপূজা',i:'🪔'},
  {d:'2026-12-25',n:'বড়দিন',i:'🎄'},
];
// ════════════════════════════════════════════════════════
// SECTION ⑦ — ECLIPSE DATA (গ্রহণের সময়সূচি ২০২৬–২০২৮)
// কাজ: গ্রহণের দিনে ক্যালেন্ডারে বেগুনি রঙে দেখায়
//       detail panel-এ সম্পূর্ণ সময়তালিকা দেখায়
// পরিবর্তন: নতুন বছরের গ্রহণ যোগ করতে ECLIPSE_DATA array-এ entry যোগ করুন
//   format: { d:'YYYY-MM-DD', type:'চন্দ্রগ্রহণ', sub:'পূর্ণগ্রাস',
//             icon:'🌑', visible:'...', grasamana:'১.১০৬',
//             times:[{l:'গ্রহণ স্পর্শ', t:'দিবা ঘ ৩|২০'}, ...] }
//   তথ্যসূত্র: বিশুদ্ধ সিদ্ধান্ত পঞ্জিকা / NASA eclipse.gsfc.nasa.gov
// ════════════════════════════════════════════════════════
const ECLIPSE_DATA = [
  // ── ২০২৬ ──
  {
    d:'2026-03-03', type:'চন্দ্রগ্রহণ', sub:'পূর্ণগ্রাস',
    icon:'🌑', visible:'ভারতে সন্ধ্যার পর দৃশ্যমান',
    grasamana:'১.১০৬',
    times:[
      {l:'উপচ্ছায়া প্রবেশ', t:'দিবা ঘ ২|১৩'},
      {l:'গ্রহণ স্পর্শ',     t:'দিবা ঘ ৩|২০'},
      {l:'নিমীলন',           t:'সন্ধ্যা ঘ ৪|৩৪'},
      {l:'গ্রহণ মধ্য',       t:'সন্ধ্যা ঘ ৫|১৫'},
      {l:'উন্মীলন',          t:'সন্ধ্যা ঘ ৫|৩৩'},
      {l:'গ্রহণমোক্ষ',       t:'রাত্রি ঘ ৬|৪৮'},
      {l:'উপচ্ছায়া ত্যাগ',  t:'রাত্রি ঘ ৭|৫৫'},
    ]
  },
  {
    d:'2026-08-12', type:'সূর্যগ্রহণ', sub:'পূর্ণগ্রাস',
    icon:'🌞', visible:'ভারতে আংশিক দৃশ্যমান (উত্তর-পশ্চিম)',
    grasamana:'—',
    times:[
      {l:'গ্রহণ স্পর্শ',  t:'দিবা ঘ ১১|৫০'},
      {l:'গ্রহণ মধ্য',    t:'দিবা ঘ ১৩|২৮'},
      {l:'গ্রহণমোক্ষ',    t:'দিবা ঘ ১৫|০৭'},
    ]
  },
  {
    d:'2026-09-28', type:'চন্দ্রগ্রহণ', sub:'আংশিক',
    icon:'🌕', visible:'ভারতে রাত্রে সম্পূর্ণ দৃশ্যমান',
    grasamana:'০.০৩',
    times:[
      {l:'উপচ্ছায়া প্রবেশ', t:'রাত্রি ঘ ১২|৩২'},
      {l:'গ্রহণ স্পর্শ',     t:'রাত্রি ঘ ১|৩৪'},
      {l:'গ্রহণ মধ্য',       t:'রাত্রি ঘ ২|১৪'},
      {l:'গ্রহণমোক্ষ',       t:'রাত্রি ঘ ২|৫৪'},
      {l:'উপচ্ছায়া ত্যাগ',  t:'রাত্রি ঘ ৩|৫৬'},
    ]
  },
  // ── ২০২৭ ──
  {
    d:'2027-02-20', type:'চন্দ্রগ্রহণ', sub:'পূর্ণগ্রাস',
    icon:'🌑', visible:'ভারতে সম্পূর্ণ দৃশ্যমান',
    grasamana:'১.৫১১',
    times:[
      {l:'উপচ্ছায়া প্রবেশ', t:'রাত্রি ঘ ১০|৩১'},
      {l:'গ্রহণ স্পর্শ',     t:'রাত্রি ঘ ১১|৪৪'},
      {l:'নিমীলন',           t:'রাত্রি ঘ ১২|৫৬'},
      {l:'গ্রহণ মধ্য',       t:'রাত্রি ঘ ১|৪৭'},
      {l:'উন্মীলন',          t:'রাত্রি ঘ ২|৩৮'},
      {l:'গ্রহণমোক্ষ',       t:'রাত্রি ঘ ৩|৫১'},
      {l:'উপচ্ছায়া ত্যাগ',  t:'রাত্রি ঘ ৫|০৩'},
    ]
  },
  {
    d:'2027-08-02', type:'সূর্যগ্রহণ', sub:'পূর্ণগ্রাস',
    icon:'🌞', visible:'ভারতে সংকীর্ণ পথে দৃশ্যমান (মধ্যভারত)',
    grasamana:'—',
    times:[
      {l:'গ্রহণ স্পর্শ',  t:'দিবা ঘ ৯|০৭'},
      {l:'পূর্ণগ্রাস শুরু', t:'দিবা ঘ ১০|০৭'},
      {l:'গ্রহণ মধ্য',    t:'দিবা ঘ ১০|৩৮'},
      {l:'পূর্ণগ্রাস শেষ', t:'দিবা ঘ ১১|০৯'},
      {l:'গ্রহণমোক্ষ',    t:'দিবা ঘ ১২|১৪'},
    ]
  },
  {
    d:'2027-08-17', type:'চন্দ্রগ্রহণ', sub:'আংশিক',
    icon:'🌕', visible:'ভারতে ভোরের দিকে দৃশ্যমান',
    grasamana:'০.১৪',
    times:[
      {l:'উপচ্ছায়া প্রবেশ', t:'রাত্রি ঘ ৩|০২'},
      {l:'গ্রহণ স্পর্শ',     t:'রাত্রি ঘ ৪|৪১'},
      {l:'গ্রহণ মধ্য',       t:'ভোর ঘ ৫|৩১'},
      {l:'গ্রহণমোক্ষ',       t:'ভোর ঘ ৬|২০'},
      {l:'উপচ্ছায়া ত্যাগ',  t:'ভোর ঘ ৭|৫৯'},
    ]
  },
  // ── ২০২৮ ──
  {
    d:'2028-01-12', type:'চন্দ্রগ্রহণ', sub:'আংশিক',
    icon:'🌕', visible:'ভারতে রাত্রে দৃশ্যমান',
    grasamana:'০.০৭',
    times:[
      {l:'উপচ্ছায়া প্রবেশ', t:'রাত্রি ঘ ৮|২৮'},
      {l:'গ্রহণ স্পর্শ',     t:'রাত্রি ঘ ৯|৫১'},
      {l:'গ্রহণ মধ্য',       t:'রাত্রি ঘ ১০|১৫'},
      {l:'গ্রহণমোক্ষ',       t:'রাত্রি ঘ ১০|৩৯'},
      {l:'উপচ্ছায়া ত্যাগ',  t:'রাত্রি ঘ ১২|০২'},
    ]
  },
  {
    d:'2028-07-06', type:'সূর্যগ্রহণ', sub:'পূর্ণগ্রাস',
    icon:'🌞', visible:'ভারতে দৃশ্যমান নয় (অস্ট্রেলিয়া পথ)',
    grasamana:'—',
    times:[
      {l:'গ্রহণ স্পর্শ', t:'দিবা ঘ ১৩|১১'},
      {l:'গ্রহণ মধ্য',   t:'দিবা ঘ ১৫|০১'},
      {l:'গ্রহণমোক্ষ',   t:'দিবা ঘ ১৬|৫০'},
    ]
  },
  {
    d:'2028-12-31', type:'চন্দ্রগ্রহণ', sub:'পূর্ণগ্রাস',
    icon:'🌑', visible:'ভারতে সন্ধ্যার পর দৃশ্যমান',
    grasamana:'১.২৪৬',
    times:[
      {l:'উপচ্ছায়া প্রবেশ', t:'সন্ধ্যা ঘ ৫|৩৩'},
      {l:'গ্রহণ স্পর্শ',     t:'সন্ধ্যা ঘ ৬|৫২'},
      {l:'নিমীলন',           t:'রাত্রি ঘ ৮|০৪'},
      {l:'গ্রহণ মধ্য',       t:'রাত্রি ঘ ৮|৫২'},
      {l:'উন্মীলন',          t:'রাত্রি ঘ ৯|৩৯'},
      {l:'গ্রহণমোক্ষ',       t:'রাত্রি ঘ ১০|৫২'},
      {l:'উপচ্ছায়া ত্যাগ',  t:'রাত্রি ঘ ১২|১০'},
    ]
  },
];
function getEclipse(ds){return ECLIPSE_DATA.filter(e=>e.d===ds);}
const getFests=ds=>FESTS.filter(f=>f.d===ds);
// ════════════════════════════════════════════════════════
// SECTION ⑨ — TRANSITION ENGINE (পঞ্চাঙ্গ পরিবর্তনের সময় গণনা)
// কাজ: দিনের মধ্যে তিথি/নক্ষত্র/যোগ/করণ কখন বদলায় তা বের করে
//   • _getTithiIdx()  — তিথির index (0–29)
//   • _getNakIdx()    — নক্ষত্রের index (0–26)
//   • _getYogaIdx()   — যোগের index (Sidereal পদ্ধতি)
//   • _getKaranNum()  — করণ নম্বর (0–59)
//   • _findTrans()    — 5 মিনিট অন্তর sample নিয়ে পরিবর্তন খোঁজে
//   • _buildList()    — [{val, endTime}] list তৈরি করে
// পরিবর্তন: সাধারণত দরকার নেই
// ════════════════════════════════════════════════════════
function _getTithiIdx(jd){return Math.floor(((moonL(jd)-sunL(jd)+360)%360)/12)%30;}
function _getNakIdx(jd){const ay2=lahiriAY(jd);return Math.floor(((moonL(jd)-ay2+360)%360)/(360/27))%27;}
function _getYogaIdx(jd){const a=lahiriAY(jd);return Math.floor(((sunL(jd)-a+moonL(jd)-a+720)%360)/(360/27))%27;}
function _getKaranNum(jd){return Math.floor(((moonL(jd)-sunL(jd)+360)%360)/6)%60;}
function _karanaName(n){const k=((n%60)+60)%60;if(k===0)return KARANS[10];if(k===57)return KARANS[7];if(k===58)return KARANS[8];if(k===59)return KARANS[9];return KARANS[(k-1)%7];}
function _findTrans(jdStart,jdEnd,getFn,y,m,d){
  const STEPS=288;const results=[];let prev=getFn(jdStart);
  for(let i=1;i<=STEPS;i++){
    const jd=jdStart+(jdEnd-jdStart)*i/STEPS;const cur=getFn(jd);
    if(cur!==prev){
      let lo=jdStart+(jdEnd-jdStart)*(i-1)/STEPS,hi=jd;
      for(let j=0;j<52;j++){if(hi-lo<1/86400/30)break;const mid=(lo+hi)/2;if(getFn(mid)===prev)lo=mid;else hi=mid;}
      const bnd=(lo+hi)/2;
      const localH=(bnd-JD(y,m,d))*24+TZ;
      const hh=((Math.floor(localH)%24)+24)%24;
      let mm=Math.round((localH-Math.floor(localH))*60);
      const fh=mm>=60?hh+1:hh,fm=mm>=60?0:mm;
      results.push({fromIdx:prev,toIdx:cur,time:fmtT(fh,fm)});prev=cur;
    }
  }
  return results;
}
function _buildList(startIdx,trans,nameFn){
  if(!trans.length)return[{val:nameFn(startIdx),endTime:null}];
  const list=[];let cur=startIdx;
  for(const t of trans){list.push({val:nameFn(cur),endTime:t.time});cur=t.toIdx;}
  list.push({val:nameFn(cur),endTime:null});
  return list;
}

// ════════════════════════════════════════════════════════
// SECTION ⑩ — calcDay() (মূল পঞ্চাঙ্গ গণনা ফাংশন)
// কাজ: একটি তারিখের সব পঞ্চাঙ্গ তথ্য return করে
//   return: { tithiList, nakList, yogaList, karanList,
//             vara, st (sunrise/set), rahu, gulika, yam, abhi,
//             fests, eclipses, bn (বাংলা তারিখ) }
// পরিবর্তন: সাধারণত দরকার নেই
// ════════════════════════════════════════════════════════
function calcDay(date){
  const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate(),w=date.getDay();
  const st=sunTimes(y,m,d);const bn=getBnInfo(date);
  // Sunrise JD
  const jdRise=JD(y,m,d)+(st.rise-TZ)/24;
  // Next sunrise JD
  const nd=new Date(date);nd.setDate(nd.getDate()+1);
  const stN=sunTimes(nd.getFullYear(),nd.getMonth()+1,nd.getDate());
  const jdNext=JD(nd.getFullYear(),nd.getMonth()+1,nd.getDate())+(stN.rise-TZ)/24;
  // Starting indices at sunrise
  const tIdx0=_getTithiIdx(jdRise);
  const nIdx0=_getNakIdx(jdRise);
  const yIdx0=_getYogaIdx(jdRise);
  const kNum0=_getKaranNum(jdRise);
  // Transitions
  const tTrans=_findTrans(jdRise,jdNext,_getTithiIdx,y,m,d);
  const nTrans=_findTrans(jdRise,jdNext,_getNakIdx,y,m,d);
  const yTrans=_findTrans(jdRise,jdNext,_getYogaIdx,y,m,d);
  const kTrans=_findTrans(jdRise,jdNext,_getKaranNum,y,m,d);
  // Build lists
  const tithiList=_buildList(tIdx0,tTrans,idx=>{const i=((idx%30)+30)%30;return{name:TNAMES[i],paksha:i<15?'শুক্লপক্ষ':'কৃষ্ণপক্ষ',pakShort:i<15?'শু':'কৃ',pakDay:i<15?i+1:i-14};});
  const nakList=_buildList(nIdx0,nTrans,idx=>({name:NAKS[idx%27][0],lord:NAKS[idx%27][1]}));
  const yogaList=_buildList(yIdx0,yTrans,idx=>({name:YOGAS[idx%27][0],sym:YOGAS[idx%27][1]}));
  const karanList=_buildList(kNum0,kTrans,kn=>({name:_karanaName(kn)}));
  const p=tithiList[0].val;
  const tN=p.pakDay+(p.paksha==='কৃষ্ণপক্ষ'?15:0);
  const bb=calcBaarbell(st.rise,st.set,w);
  const kr=calcKaalratri(st.set,stN.rise,w);
  const amD=calcAmritaD(st.rise,st.set,w);
  const mhD=calcMahendra(st.rise,st.set,w);
  const amN=calcAmritaN(st.set,stN.rise,w);
  const lgn=calcSunriseLagna(jdRise,LAT,LNG);
  const nakDosha=MRITYU_DOSHA[nIdx0%27]||'';
  const nakDoshaEnd=(nakDosha&&nTrans.length>0)?nTrans[0].time:null;
  const retro=getRetroStatus(jdRise);
  const dd=calcDD(w,p.pakDay-1,nIdx0);
  const noon=(st.rise+st.set)/2;
  const abhijit_start=noon-24/60,abhijit_end=noon+24/60;
  return{w,bn,tN,tName:p.name,paksha:p.paksha,pakDay:p.pakDay,
    nak:NAKS[nIdx0],yoga:YOGAS[yIdx0],karan:karanList[0].val.name,
    vara:VDAYS[w],varaL:VLORD[w],st,
    rahu:slotT(st.rise,st.set,RS[w]),gulika:slotT(st.rise,st.set,GS[w]),
    yam:slotT(st.rise,st.set,YS[w]),abhi:abhiT(st.rise,st.set),
    bb,kr,amD,mhD,amN,lgn,nakDosha,nakDoshaEnd,retro,dd,noon,abhijit_start,abhijit_end,
    eclipses:getEclipse(dStr(date)),fests:getFests(dStr(date)),
    tithiList,nakList,yogaList,karanList};}
function moonEmoji(t){if(t===15)return'🌕';if(t===30||t===1)return'🌑';if(t<8)return'🌒';if(t===8)return'🌓';if(t<15)return'🌔';if(t<23)return'🌖';if(t===23)return'🌗';return'🌘';}

// ════════════════════════════════════════════════════════
// SECTION ⑪ — HEADER RENDER (আজকের তারিখ ব্যানার)
// কাজ: পেজের উপরে আজকের বাংলা তারিখ ও chip গুলো দেখায়
// পরিবর্তন: chip-এ কী দেখাবে তা বদলাতে এখানে আসুন
// ════════════════════════════════════════════════════════
function renderHeader(){
  const c=calcDay(TODAY),bn=c.bn;if(!bn)return;
  document.getElementById('tb-bn').textContent=`${toBn(bn.d)} ${bn.name} ${toBn(bn.y)} বঙ্গাব্দ`;
  document.getElementById('tb-en').textContent=`${TODAY.getDate()} ${EMS[TODAY.getMonth()]} ${TODAY.getFullYear()} | ${c.vara} | ${bn.ritu} ঋতু`;
  const rh=Math.floor(c.st.rise),rm=Math.round((c.st.rise-rh)*60);
  const lC=c.lgn?L_BN[c.lgn.ri]+' লগ্ন':'';
  const dC=c.dd&&c.dd.total>0?'⚠️ '+c.dd.name:'';
  document.getElementById('tb-chips').innerHTML=
    [c.paksha,c.tName,c.nak[0],
     toBn(rh)+':'+String(rm).padStart(2,'0').replace(/[0-9]/g,d=>BD[+d])+' উদয়',
     lC,dC].filter(Boolean).map(x=>`<div class="chip">${x}</div>`).join('');
}

// ════════════════════════════════════════════════════════
// SECTION ⑫ — CALENDAR RENDER (মাসিক ক্যালেন্ডার)
// কাজ: বাংলা মাসের ক্যালেন্ডার grid তৈরি করে
//   • shiftM(±1)    — আগের/পরের মাসে যায়
//   • renderCal()   — সম্পূর্ণ calendar আবার draw করে
// পরিবর্তন: cell-এ কী দেখাবে (তিথি/উৎসব) তা বদলাতে এখানে আসুন
// ════════════════════════════════════════════════════════
let calIdx=findTodayIdx(),selDate=null;
function shiftM(d){calIdx=Math.max(0,Math.min(BMS.length-2,calIdx+d));renderCal();}
function renderCal(){const days=getBnMonthDays(calIdx);if(!days.length)return;const e=BMS[calIdx];const f=days[0].date,l=days[days.length-1].date;const enRange=f.getMonth()===l.getMonth()?`${EMS[f.getMonth()]} ${f.getFullYear()}`:`${EMSh[f.getMonth()]}–${EMSh[l.getMonth()]} ${l.getFullYear()}`;document.getElementById('cmbn').textContent=`${BNM_NAMES[e.m]} ${toBn(e.y)} বঙ্গাব্দ`;document.getElementById('cmen').textContent=enRange;const first=days[0].date.getDay();let h='';for(let i=0;i<first;i++)h+=`<div class="cd ce"></div>`;days.forEach(({date,bnDay})=>{const wd=date.getDay();const isT=date.toDateString()===TODAY.toDateString();const isS=selDate&&date.toDateString()===selDate.toDateString();const c=calcDay(date);const fests=c.fests;const ds_=dStr(date);const enLbl=`${date.getDate()} ${EMSh[date.getMonth()]}`;const tsh=c.tithiList.length>1?`${c.tithiList[0].val.pakShort} ${c.tithiList[0].val.name}/${c.tithiList[1].val.pakShort} ${c.tithiList[1].val.name}`:`${c.tithiList[0].val.pakShort} ${c.tithiList[0].val.name}`;let cls='cd';if(wd===0)cls+=' ds';if(wd===6)cls+=' dsa';if(isT)cls+=' ct';if(isS)cls+=' cs';h+=`<div class="${cls}" onclick="showDetail(new Date('${ds_}'))">${isT?'<div class="tdot"></div>':''}<div class="db">${toBn(bnDay)}</div><div class="de">${enLbl}</div><div class="dti">${tsh}</div>${(c.eclipses&&c.eclipses.length)?`<div class="df" style="color:#7b2fbe;">${c.eclipses[0].icon} ${c.eclipses[0].type}</div>`:fests.length?`<div class="df">${fests[0].i} ${fests[0].n}</div>`:''}</div>`;});document.getElementById('cbody').innerHTML=h;}

// ════════════════════════════════════════════════════════
// SECTION ⑬ — DETAIL PANEL (দিনের বিস্তারিত প্যানেল)
// কাজ: তারিখে click করলে পঞ্চাঙ্গ বিস্তারিত দেখায়
//   • _panItem()       — তিথি/নক্ষত্র/যোগ/করণ transition সহ HTML তৈরি
//   • _festHtml()      — উৎসব ও গ্রহণের HTML তৈরি
//   • _brahmaT()       — ব্রাহ্ম মুহূর্তের সময় তৈরি
//   • showDetail(date) — panel খোলে ও তথ্য দেখায়
//   • closeD()         — panel বন্ধ করে
// পরিবর্তন: detail panel-এর layout বদলাতে এখানে আসুন
// ════════════════════════════════════════════════════════

// পঞ্চাঙ্গ item HTML তৈরি (transition সহ)
function _panItem(ico, label, list, mainFn, subFn) {
  var rows = '';
  for (var i = 0; i < list.length; i++) {
    var x = list[i];
    var nm = mainFn(x.val);
    var sb = subFn ? subFn(x.val) : '';
    var arrow = i > 0 ? '<div style="font-size:.42rem;color:var(--txt2);text-align:center;line-height:1;">&#9660;</div>' : '';
    var timing = x.endTime
      ? '<div class="dis" style="font-size:.58rem;">' + x.endTime + ' পর্যন্ত</div>'
      : '<div class="dis" style="font-size:.55rem;color:var(--green);">&#9654; চলতি</div>';
    rows += arrow + '<div class="div2">' + nm + '</div>' + (sb ? '<div class="dis">' + sb + '</div>' : '') + timing;
  }
  return '<div class="di"><div class="dii">' + ico + '</div><div class="dil">' + label + '</div>' + rows + '</div>';
}

// উৎসব ও গ্রহণের HTML তৈরি
function _festHtml(c) {
  var html = '';
  if (c.eclipses && c.eclipses.length) {
    for (var ei = 0; ei < c.eclipses.length; ei++) {
      var ec = c.eclipses[ei];
      var trows = '';
      for (var ti = 0; ti < ec.times.length; ti++) {
        trows += '<div class="eclipse-row"><span class="eclipse-lbl">' + ec.times[ti].l + '</span><span class="eclipse-val">' + ec.times[ti].t + '</span></div>';
      }
      html += '<div class="eclipse-box">'
        + '<div class="eclipse-head"><span style="font-size:1.4rem;">' + ec.icon + '</span>'
        + '<span class="eclipse-type">' + ec.type + '</span>'
        + '<span class="eclipse-sub">' + ec.sub + '</span></div>'
        + '<div class="eclipse-visible">&#128205; ' + ec.visible + '</div>'
        + (ec.grasamana !== '&#8212;' ? '<div class="eclipse-mag">&#2455;&#2509;&#2480;&#2494;&#2488;&#2478;&#2494;&#2472;: ' + ec.grasamana + '</div>' : '')
        + trows + '</div>';
    }
  }
  if (c.fests && c.fests.length) {
    for (var fi = 0; fi < c.fests.length; fi++) {
      html += '<div class="fi"><div class="fiico">' + c.fests[fi].i + '</div><div class="fin">' + c.fests[fi].n + '</div></div>';
    }
  }
  if (!html) { html = '<div class="nofest">এই দিনে বিশেষ উৎসব নেই।</div>'; }
  return html;
}

// ব্রাহ্ম মুহূর্ত (সূর্যোদয়ের ৯৬–৪৮ মিনিট আগে)
function _brahmaT(rise) {
  var b1 = rise - 96 / 60, b2 = rise - 48 / 60;
  var h1 = Math.floor(b1), m1 = Math.round((b1 - h1) * 60);
  var h2 = Math.floor(b2), m2 = Math.round((b2 - h2) * 60);
  return fmtT(h1, m1) + ' \u2013 ' + fmtT(h2, m2);
}

// গ্রাসমান — symbol fix
(function() {
  for (var i = 0; i < ECLIPSE_DATA.length; i++) {
    if (ECLIPSE_DATA[i].grasamana === '—') { ECLIPSE_DATA[i].grasamana = '&#8212;'; }
  }
}());

function showDetail(date) {
  if (!(date instanceof Date)) { date = new Date(date); }
  selDate = date;
  renderCal();
  var c = calcDay(date), bn = c.bn;
  var y = date.getFullYear(), mo = date.getMonth(), d = date.getDate();
  document.getElementById('dtbn').textContent = bn ? toBn(bn.d) + ' ' + bn.name + ' ' + toBn(bn.y) + ' বঙ্গাব্দ' : '';
  document.getElementById('dten').textContent = d + ' ' + EMS[mo] + ' ' + y + ' | ' + c.vara + ' | ' + (bn ? bn.ritu + ' ঋতু' : '');
  document.getElementById('dtmoon').textContent = moonEmoji(c.tN);
  document.getElementById('dtpaksha').textContent = c.paksha + ' \u2014 ' + c.tName + ' (' + toBn(c.pakDay) + ' তিথি)';
  document.getElementById('dtvara').textContent = 'বার-অধিপতি: ' + c.varaL;
  var pct = c.tN <= 15 ? (c.tN / 15 * 100) : ((30 - c.tN) / 15 * 100);
  document.getElementById('dtprog').style.width = pct + '%';
  document.getElementById('dtplbl').textContent = c.tN <= 15
    ? 'পূর্ণিমা পর্যন্ত ' + toBn(15 - c.tN) + ' তিথি'
    : 'অমাবস্যা পর্যন্ত ' + toBn(30 - c.tN) + ' তিথি';
  var extraItems = [{i:'☀️',l:'বার',v:c.vara,s:'অধিপতি: '+c.varaL},{i:'🌿',l:'ঋতু',v:bn?bn.ritu:'—',s:bn?bn.name+' মাস':''},{i:'📅',l:'বিক্রম সম্বত',v:bn?toBn(bn.vikram):'—',s:''},{i:'🕉️',l:'শক সম্বত',v:bn?toBn(bn.saka):'—',s:''}];
  var extraHtml = '';
  for (var xi = 0; xi < extraItems.length; xi++) {
    var x = extraItems[xi];
    extraHtml += '<div class="di"><div class="dii">'+x.i+'</div><div class="dil">'+x.l+'</div><div class="div2">'+x.v+'</div>'+(x.s?'<div class="dis">'+x.s+'</div>':'')+'</div>';
  }
  document.getElementById('dtpan').innerHTML =
    _panItem('🌙', 'তিথি', c.tithiList, function(v){ return v.pakShort + ' ' + v.name; }, function(v){ return v.paksha; }) +
    _panItem('⭐', 'নক্ষত্র', c.nakList, function(v){ return v.name; }, function(v){ return 'অধিপতি: ' + v.lord; }) +
    _panItem('🌟', 'যোগ', c.yogaList, function(v){ return v.name; }, function(v){ return v.sym === '✓' ? 'শুভ যোগ' : 'অশুভ যোগ'; }) +
    _panItem('🎴', 'করণ', c.karanList, function(v){ return v.name; }, null) +
    extraHtml;
  var rh = Math.floor(c.st.rise), rm = Math.round((c.st.rise - rh) * 60);
  var sh = Math.floor(c.st.set),  sm = Math.round((c.st.set  - sh) * 60);
  // Row 1: সূর্যোদয় · সূর্যাস্ত · ব্রাহ্ম মুহূর্ত  → 3 column
  var row1 = [
    {ico:'🌅', cls:'shubha', l:'সূর্যোদয়',      v:fmtT(rh, rm)},
    {ico:'🌇', cls:'',       l:'সূর্যাস্ত',       v:fmtT(sh, sm)},
    {ico:'🌄', cls:'shubha', l:'ব্রাহ্ম মুহূর্ত',  v:_brahmaT(c.st.rise)}
  ];
  // Row 2: রাহুকাল · গুলিকাকাল · অভিজিৎ · যমঘণ্ট → 2 column
  var row2 = [
    {ico:'⚡', cls:'rahu',   l:'রাহুকাল',         v:c.rahu},
    {ico:'🕯️', cls:'rahu',   l:'গুলিকাকাল',       v:c.gulika},
    {ico:'💫', cls:'shubha', l:'অভিজিৎ মুহূর্ত',  v:c.abhi},
    {ico:'🔥', cls:'',       l:'যমঘণ্ট',          v:c.yam}
  ];
  function fT(v){var hh=Math.floor(((v%24)+24)%24),mm=Math.round((v-Math.floor(v))*60);if(mm>=60){hh=(hh+1)%24;mm=0;}return fmtT(hh,mm);}
  var mkCard=function(t){return '<div class="dtime '+t.cls+'"><div class="dtl">'+t.ico+' '+t.l+'</div><div class="dtv">'+t.v+'</div></div>';};
  var lgnR=c.lgn?'<div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:.42rem;"><div class="dtime shubha"><div class="dtl">🌅 উদয় লগ্ন</div><div class="dtv">'+L_BN[c.lgn.ri]+'</div></div><div class="dtime"><div class="dtl">🌇 অস্ত লগ্ন</div><div class="dtv">'+L_BN[c.lgn.descRi]+'</div></div></div>':'';
  var ddBg=!c.dd?'':c.dd.total===0?'rgba(37,102,37,.08)':c.dd.total<=2?'rgba(181,134,13,.08)':'rgba(181,32,32,.08)';
  var ddFg=!c.dd?'':c.dd.total===0?'var(--green)':c.dd.total<=2?'var(--gold)':'#b52020';
  var ddR=c.dd?'<div class="dtime" style="border-color:'+ddBg+';background:'+ddBg+';margin-bottom:.42rem;"><div class="dtl">💀 মৃত্যু দোষ</div><div class="dtv" style="color:'+ddFg+';">'+c.dd.name+(c.nakDoshaEnd?' পর্যন্ত '+c.nakDoshaEnd:c.dd.total===0?' সারাদিন':'')+'</div></div>':'';
  var bbR='<div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:.42rem;">';
  if(c.bb&&c.bb.length){c.bb.forEach(function(b,i){bbR+='<div class="dtime rahu"><div class="dtl">🚫 বারবেলা '+(i+1)+'</div><div class="dtv">'+fT(b.st)+' – '+fT(b.en)+'</div></div>';});}
  if(c.kr){bbR+='<div class="dtime rahu"><div class="dtl">🌑 কালরাত্রি</div><div class="dtv">'+fT(c.kr.st)+' – '+fT(c.kr.en)+'</div></div>';}
  bbR+='</div>';
  var amR='';
  if(c.amD&&c.amD.length)amR+='<div class="dtime shubha" style="margin-bottom:.42rem;"><div class="dtl">✨ অমৃতযোগ (দিন)</div><div class="dtv" style="font-size:.64rem;line-height:1.5;">'+c.amD.map(function(a){return fT(a.st)+' – '+fT(a.en);}).join(' | ')+'</div></div>';
  if(c.mhD&&c.mhD.st)amR+='<div class="dtime shubha" style="margin-bottom:.42rem;"><div class="dtl">🌠 মাহেন্দ্রযোগ</div><div class="dtv">'+fT(c.mhD.st)+' – '+fT(c.mhD.en)+'</div></div>';
  if(c.amN&&c.amN.length)amR+='<div class="dtime shubha" style="margin-bottom:.42rem;"><div class="dtl">🌙 অমৃতযোগ (রাত্রি)</div><div class="dtv" style="font-size:.64rem;line-height:1.5;">'+c.amN.map(function(a){return fT(a.st)+' – '+fT(a.en);}).join(' | ')+'</div></div>';
  var vkR='';if(c.retro){var vg=[];if(c.retro.mars)vg.push('মঙ্গল');if(c.retro.jup)vg.push('বৃহস্পতি');if(c.retro.sat)vg.push('শনি');vg.push('রাহু/কেতু');vkR='<div class="dtime" style="margin-bottom:.42rem;"><div class="dtl">↩️ আজ বক্রগতি</div><div class="dtv" style="font-size:.7rem;">'+vg.join(', ')+'</div></div>';}
  var rfD=dStr(selDate||TODAY);var rfUrl='https://www.myastrology.in/rashifal/'+rfD+'.html';
  var rfCard='<a href="'+rfUrl+'" target="_blank" style="display:block;text-decoration:none;padding:.5rem .65rem;background:linear-gradient(135deg,#0a1730,#0f2248);border-radius:10px;border:1px solid rgba(201,162,39,.3);margin-bottom:.42rem;text-align:center;"><div style="color:#c9a227;font-size:.78rem;font-weight:700;">📅 আজকের রাশিফল দেখুন →</div><div style="color:rgba(255,255,255,.6);font-size:.63rem;">'+rfD+'</div></a>';
  var ds_=dStr(selDate||TODAY);
  var shBtn='<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;margin-top:.35rem;">'
    +'<button onclick="showShubhaKarma(\''+ds_+'\',\'vivah\')" class="btn-sk">💒 বিবাহ</button>'
    +'<button onclick="showShubhaKarma(\''+ds_+'\',\'griha\')" class="btn-sk">🏠 গৃহপ্রবেশ</button>'
    +'<button onclick="showShubhaKarma(\''+ds_+'\',\'garb\')" class="btn-sk">🤱 গর্ভধারণ</button>'
    +'<button onclick="showShubhaKarma(\''+ds_+'\',\'busi\')" class="btn-sk">💼 ব্যবসা</button>'
    +'<button onclick="showShubhaKarma(\''+ds_+'\',\'sadh\')" class="btn-sk">🍚 সাধভক্ষণ</button>'
    +'<button onclick="showShubhaKarma(\''+ds_+'\',\'yatra\')" class="btn-sk">🚶 যাত্রা</button>'
    +'</div>';
  var timesHtml='<div style="padding:.42rem .5rem 0;">'
    +rfCard
    +'<div class="dsec" style="padding:.2rem 0 .25rem;">☀️ সূর্যোদয়/অস্ত ও ব্রাহ্ম মুহূর্ত</div>'
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.42rem;margin-bottom:.5rem;">'+row1.map(mkCard).join('')+'</div>'
    +'<div class="dsec" style="padding:.2rem 0 .25rem;">⚡ রাহুকাল · গুলিকাকাল · যমঘণ্ট · অভিজিৎ</div>'
    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.42rem;margin-bottom:.5rem;">'+row2.map(mkCard).join('')+'</div>'
    +'<div class="dsec" style="padding:.2rem 0 .25rem;">🚫 বারবেলা ও কালরাত্রি</div>'+bbR
    +'<div class="dsec" style="padding:.2rem 0 .25rem;">✨ অমৃতযোগ ও মাহেন্দ্রযোগ</div>'+amR
    +'<div class="dsec" style="padding:.2rem 0 .25rem;">🌅 লগ্ন · মৃত্যু দোষ · বক্রগতি</div>'
    +lgnR+ddR+vkR
    +'<div class="dsec" style="padding:.2rem 0 .25rem;">🌸 শুভকর্মের সময়</div>'
    +shBtn+'</div>';
  document.getElementById('dttimes').innerHTML=timesHtml;
  document.getElementById('dtfests').innerHTML=_festHtml(c);
  var p=document.getElementById('dtp');p.classList.add('show');
  if(!_initLoad){setTimeout(function(){p.scrollIntoView({behavior:'smooth',block:'start'});},100);}
}
function closeD() { document.getElementById('dtp').classList.remove('show'); selDate = null; renderCal(); }

// ════════════════════════════════════════════════════════
// SECTION ⑭ — TAB NAVIGATION HELPERS
// ════════════════════════════════════════════════════════
function switchDTab(idx, el) {
  document.querySelectorAll('.dtab').forEach(function(t){t.classList.remove('act');});
  document.querySelectorAll('.dtab-pane').forEach(function(p){p.classList.remove('show');});
  el.classList.add('act');
  document.getElementById('dtpane'+idx).classList.add('show');
}
function switchCalcTab(idx, el) {
  document.querySelectorAll('.calc-sec-tab').forEach(function(t){t.classList.remove('act');});
  document.querySelectorAll('.calc-sec-pane').forEach(function(p){p.classList.remove('show');});
  el.classList.add('act');
  document.getElementById('calcPane'+idx).classList.add('show');
}

// ════════════════════════════════════════════════════════
// SECTION ⑮ — TODAY EVENTS RENDER (আজকের বিশেষ দিন)
// ════════════════════════════════════════════════════════
function renderTodayEvents() {
  var ds = dStr(TODAY);
  var mmdd = ds.slice(5); // MM-DD
  var evts = getPanjikaEvents(ds, mmdd);
  var c = calcDay(TODAY);
  var specialYogas = checkSpecialYogas(TODAY.getDay(), c.nakList[0].val ? Math.floor(((moonL(JD(TODAY.getFullYear(),TODAY.getMonth()+1,TODAY.getDate())+0.5)-lahiriAY(JD(TODAY.getFullYear(),TODAY.getMonth()+1,TODAY.getDate())+0.5)+360)%360)/(360/27))%27 : 0, TODAY.getDay());
  var html = '';

  // মলমাস
  if (evts.malmas) {
    var ml = evts.malmas;
    html += '<div class="sd-card malmas"><div class="sd-head"><span class="sd-icon">📿</span><span class="sd-name">'+ml.monthName+'</span><span class="sd-type malmas">মলমাস</span></div>';
    html += '<div class="sd-sig">'+ml.significance+'</div>';
    html += '<div class="sd-mantra">মন্ত্র: '+ml.mantra+'</div></div>';
  }

  // ধর্মীয় উৎসব
  evts.festivals.forEach(function(f){
    html += '<div class="sd-card festival"><div class="sd-head"><span class="sd-icon">'+f.icon+'</span><span class="sd-name">'+f.name+'</span><span class="sd-type festival">উৎসব</span></div>';
    html += '<div class="sd-sig">'+f.significance+'</div>';
    if(f.mantra) html += '<div class="sd-mantra">🕉️ '+f.mantra+'</div>';
    html += '<div class="sd-works" style="margin-top:.25rem;">⏰ পূজার সময়: '+f.pujaTime+'</div></div>';
  });

  // জন্মদিন
  evts.births.forEach(function(b){
    html += '<div class="sd-card birthday"><div class="sd-head"><span class="sd-icon">'+b.icon+'</span><span class="sd-name">'+b.name+'</span><span class="sd-type birthday">জন্মদিন</span></div>';
    html += '<div class="sd-sig">'+b.birthYear+'–'+b.deathYear+' | '+b.message+'</div>';
    html += '<div class="sd-quote">'+b.quote+'</div>';
    if(b.notableWorks && b.notableWorks.length) html += '<div class="sd-works">📚 উল্লেখযোগ্য: '+b.notableWorks.join(', ')+'</div>';
    html += '</div>';
  });

  // তিরোধান
  evts.deaths.forEach(function(d){
    html += '<div class="sd-card death"><div class="sd-head"><span class="sd-icon">'+d.icon+'</span><span class="sd-name">'+d.name+'</span><span class="sd-type death">তিরোধান</span></div>';
    html += '<div class="sd-sig">'+d.tribute+'</div></div>';
  });

  // আধুনিক দিবস
  evts.modern.forEach(function(m){
    html += '<div class="sd-card modern"><div class="sd-head"><span class="sd-icon">'+m.icon+'</span><span class="sd-name">'+m.name+'</span><span class="sd-type modern">দিবস</span></div>';
    html += '<div class="sd-sig">'+m.message+'</div>';
    if(m.loveMantra) html += '<div class="sd-mantra">'+m.loveMantra+'</div>';
    html += '</div>';
  });

  // বিশেষ যোগ
  try {
    var nIdx = _getNakIdx(JD(TODAY.getFullYear(),TODAY.getMonth()+1,TODAY.getDate()) + 0.5);
    var syogas = checkSpecialYogas(TODAY.getDay(), nIdx);
    syogas.forEach(function(y){
      html += '<div class="sd-card yoga"><div class="sd-head"><span class="sd-icon">'+y.icon+'</span><span class="sd-name">'+y.name+'</span><span class="sd-type yoga">বিশেষ যোগ</span></div>';
      html += '<div class="sd-sig">'+y.significance+'</div>';
      html += '<div class="sd-works">উপযোগী কাজ: '+y.suitableWork.join(', ')+'</div></div>';
    });
  } catch(e){}

  if (!html) html = '<div class="sd-empty">আজ বিশেষ কোনো দিন নেই।</div>';
  document.getElementById('specialDayList').innerHTML = html;
}

// ════════════════════════════════════════════════════════
// SECTION ⑯ — MONTH EVENTS RENDER (মাসের গুরুত্বপূর্ণ দিন)
// ════════════════════════════════════════════════════════
function renderMonthEvents() {
  var days = getBnMonthDays(calIdx);
  if (!days.length) return;
  var e = BMS[calIdx];
  document.getElementById('monthEventsTitle').textContent = '📅 ' + BNM_NAMES[e.m] + ' ' + toBn(e.y) + ' বঙ্গাব্দের গুরুত্বপূর্ণ দিন';

  var rows = [];
  days.forEach(function(item){
    var dt = item.date;
    var ds = dStr(dt);
    var mmdd = ds.slice(5);
    var evts = getPanjikaEvents(ds, mmdd);
    var allEvts = [];
    evts.festivals.forEach(function(f){ allEvts.push({icon:f.icon, name:f.name, type:'উৎসব'}); });
    evts.births.forEach(function(b){ allEvts.push({icon:b.icon, name:b.name, type:'জন্মদিন'}); });
    evts.deaths.forEach(function(d){ allEvts.push({icon:d.icon, name:d.name, type:'তিরোধান'}); });
    evts.modern.forEach(function(m){ allEvts.push({icon:m.icon, name:m.name, type:'দিবস'}); });
    if(evts.malmas) allEvts.push({icon:'📿', name:evts.malmas.monthName, type:'মলমাস'});
    // existing FESTS
    var fests = getFests(ds);
    fests.forEach(function(f){
      if(!evts.festivals.find(function(x){return x.date===ds;}))
        allEvts.push({icon:f.i, name:f.n, type:'উৎসব'});
    });
    allEvts.forEach(function(ev){
      rows.push({date:dt, bnDay:item.bnDay, event:ev, ds:ds});
    });
  });

  if (!rows.length) {
    document.getElementById('monthEventsList').innerHTML = '<div class="sd-empty">এই মাসে কোনো বিশেষ দিন নেই।</div>';
    return;
  }

  var html = '';
  rows.forEach(function(r){
    var dayName = VDAYS[r.date.getDay()];
    html += '<div class="me-row" onclick="showDetail(new Date(\''+r.ds+'\'))">';
    html += '<span class="me-date">'+toBn(r.date.getDate())+'</span>';
    html += '<span class="me-icon">'+r.event.icon+'</span>';
    html += '<span class="me-name">'+r.event.name+'</span>';
    html += '<span class="me-tag">'+dayName+' · '+r.event.type+'</span>';
    html += '</div>';
  });
  document.getElementById('monthEventsList').innerHTML = html;
}

// ════════════════════════════════════════════════════════
// SECTION ⑰ — GUIDE CARDS (শুভ সময় গাইড)
// ════════════════════════════════════════════════════════
function renderGuideCards() {
  var guides = PANJIKA_DATA.auspiciousGuides;
  var html = '';
  Object.keys(guides).forEach(function(key){
    var g = guides[key];
    html += '<div class="guide-card" onclick="toggleGuide(this)">';
    html += '<div class="guide-card-head"><span class="guide-card-ico">'+g.icon+'</span><span class="guide-card-title">'+g.title+'</span></div>';
    html += '<div class="guide-good-days">✅ শুভ বার: '+g.goodDays.join(', ')+'</div>';
    html += '<div class="guide-good-naks">⭐ শুভ নক্ষত্র: '+g.goodNakshatras.slice(0,5).join(', ')+(g.goodNakshatras.length>5?' …':'')+'</div>';
    html += '<div class="guide-expand">';
    html += '<div class="guide-row">';
    html += '<div><div class="guide-label">শুভ তিথি</div><div class="guide-val good">'+g.goodTithis.join(', ')+'</div></div>';
    html += '<div><div class="guide-label">শুভ লগ্ন</div><div class="guide-val good">'+(g.goodLagnas||[]).join(', ')+'</div></div>';
    html += '</div>';
    if(g.badDays) html += '<div style="margin-bottom:.3rem;"><div class="guide-label">বর্জনীয় বার</div><div class="guide-val bad">'+g.badDays.join(', ')+'</div></div>';
    if(g.badTithis) html += '<div style="margin-bottom:.3rem;"><div class="guide-label">বর্জনীয় তিথি</div><div class="guide-val bad">'+g.badTithis.join(', ')+'</div></div>';
    html += '<div class="guide-mantra">'+g.mantra+'</div>';
    html += '<p style="font-size:.7rem;color:var(--txt2);margin-top:.5rem;line-height:1.55;">'+g.procedure+'</p>';
    html += '</div>';
    html += '</div>';
  });
  document.getElementById('guideGrid').innerHTML = html;
}
function toggleGuide(el) {
  var exp = el.querySelector('.guide-expand');
  exp.classList.toggle('show');
}

// ════════════════════════════════════════════════════════
// SECTION ⑱ — AUSPICIOUS COUNTER (শুভ দিনের কাউন্টার)
// ════════════════════════════════════════════════════════
var SHUBHA_TITHIS_VIVAH = [1,2,4,6,9,10,12]; // 0-indexed (দ্বিতীয়া=1...)
var SHUBHA_TITHIS_GRIHA  = [0,1,2,4,6,9,10,12];
var SHUBHA_NAKS_VIVAH   = [3,4,7,12,13,14,16,11,20,25,26];
var SHUBHA_NAKS_GRIHA   = [3,4,7,12,13,11,20,25,26];
var SHUBHA_NAKS_NIRMAN  = [3,4,7,12,13,11,20,25,26];
var SHUBHA_NAKS_GARB    = [0,3,6,7,12,13,14,16,11,20,25,26];
var SHUBHA_NAKS_BIZ     = [0,7,12,16,18,11,26];
var SHUBHA_NAKS_TRAVEL  = [0,7,14,12,16,18,26];
var BAD_DAYS_VW = [2,6]; // মঙ্গল, শনি (0=রবি)
var BAD_TITHIS_GEN = [14,7,8,29]; // চতুর্দশী,অষ্টমী,নবমী,অমাবস্যা

function _isMalmasDt(dt) {
  var t = dt.getTime();
  return PANJIKA_DATA.malmas.some(function(ml){
    return t >= new Date(ml.startDate+'T00:00:00').getTime() && t <= new Date(ml.endDate+'T23:59:59').getTime();
  });
}

function _isShubhaDay(dt, nakNeed, tithiNeed) {
  if (BAD_DAYS_VW.includes(dt.getDay())) return false;
  if (_isMalmasDt(dt)) return false;
  try {
    var c = calcDay(dt);
    var ti = c.tithiList[0].val;
    var tN = ti.pakDay - 1 + (ti.paksha==='কৃষ্ণপক্ষ' ? 15 : 0);
    if (BAD_TITHIS_GEN.includes(tN)) return false;
    if (tithiNeed && !tithiNeed.includes(tN)) return false;
    var nIdx = c.nakList[0].val ? NAKS.findIndex(function(n){return n[0]===c.nakList[0].val.name;}) : -1;
    if (nIdx === -1) return false;
    if (nakNeed && !nakNeed.includes(nIdx)) return false;
    return true;
  } catch(e){ return false; }
}

function _getMonthShubhaDays(nakNeed, tithiNeed, extraBadDays) {
  var days = getBnMonthDays(calIdx);
  return days.filter(function(item){
    if (extraBadDays && extraBadDays.includes(item.date.getDay())) return false;
    return _isShubhaDay(item.date, nakNeed, tithiNeed);
  });
}

function renderAuspiciousCounter() {
  var CATS = [
    {label:'বিবাহের শুভ দিন', icon:'💒', nakNeed:SHUBHA_NAKS_VIVAH, tithiNeed:SHUBHA_TITHIS_VIVAH},
    {label:'গৃহপ্রবেশের শুভ দিন', icon:'🏠', nakNeed:SHUBHA_NAKS_GRIHA, tithiNeed:SHUBHA_TITHIS_GRIHA},
    {label:'গৃহ নির্মাণের শুভ দিন', icon:'🏗️', nakNeed:SHUBHA_NAKS_NIRMAN, tithiNeed:SHUBHA_TITHIS_GRIHA},
    {label:'গর্ভধারণের শুভ দিন', icon:'🤰', nakNeed:SHUBHA_NAKS_GARB, tithiNeed:null},
    {label:'ব্যবসা শুরুর শুভ দিন', icon:'💼', nakNeed:SHUBHA_NAKS_BIZ, tithiNeed:null},
    {label:'যাত্রার শুভ দিন', icon:'✈️', nakNeed:SHUBHA_NAKS_TRAVEL, tithiNeed:null},
  ];
  var html = '';
  CATS.forEach(function(cat, ci){
    var result = _getMonthShubhaDays(cat.nakNeed, cat.tithiNeed);
    html += '<div class="ac-card" onclick="openAcModal('+ci+')">';
    html += '<div class="ac-ico">'+cat.icon+'</div>';
    html += '<div class="ac-count">'+toBn(result.length)+'</div>';
    html += '<div class="ac-label">'+cat.label+'</div>';
    html += '</div>';
  });
  document.getElementById('acGrid').innerHTML = html;
}

var _acCats = [
  {label:'বিবাহের শুভ দিন', icon:'💒', nakNeed:SHUBHA_NAKS_VIVAH, tithiNeed:SHUBHA_TITHIS_VIVAH},
  {label:'গৃহপ্রবেশের শুভ দিন', icon:'🏠', nakNeed:SHUBHA_NAKS_GRIHA, tithiNeed:SHUBHA_TITHIS_GRIHA},
  {label:'গৃহ নির্মাণের শুভ দিন', icon:'🏗️', nakNeed:SHUBHA_NAKS_NIRMAN, tithiNeed:SHUBHA_TITHIS_GRIHA},
  {label:'গর্ভধারণের শুভ দিন', icon:'🤰', nakNeed:SHUBHA_NAKS_GARB, tithiNeed:null},
  {label:'ব্যবসা শুরুর শুভ দিন', icon:'💼', nakNeed:SHUBHA_NAKS_BIZ, tithiNeed:null},
  {label:'যাত্রার শুভ দিন', icon:'✈️', nakNeed:SHUBHA_NAKS_TRAVEL, tithiNeed:null},
];

function openAcModal(catIdx) {
  var cat = _acCats[catIdx];
  var days = _getMonthShubhaDays(cat.nakNeed, cat.tithiNeed);
  document.getElementById('acModalTitle').textContent = cat.icon + ' ' + cat.label;
  var html = '';
  if (!days.length) {
    html = '<p style="font-size:.82rem;color:var(--txt2);padding:.5rem;">এই মাসে শুভ দিন নেই।</p>';
  } else {
    days.forEach(function(item){
      var c = calcDay(item.date);
      var ds = dStr(item.date);
      html += '<div class="ac-day-row" onclick="closeAcModal();showDetail(new Date(\''+ds+'\'))">';
      html += '<span class="ac-day-date">'+item.date.getDate()+' '+EMSh[item.date.getMonth()]+'</span>';
      html += '<span class="ac-day-info">'+VDAYS[item.date.getDay()]+' | '+c.tName+' | '+c.nak[0]+'</span>';
      html += '</div>';
    });
  }
  document.getElementById('acModalBody').innerHTML = html;
  document.getElementById('acModalOverlay').classList.add('open');
}
function closeAcModal() {
  document.getElementById('acModalOverlay').classList.remove('open');
}

// ════════════════════════════════════════════════════════
// SECTION ⑲ — BIRTH RASHI CALCULATOR (জন্মরাশি নির্ধারণ)
// ════════════════════════════════════════════════════════
var RASHI_NAMES_FULL=['মেষ','বৃষ','মিথুন','কর্কট','সিংহ','কন্যা','তুলা','বৃশ্চিক','ধনু','মকর','কুম্ভ','মীন'];
var RASHI_LORDS=['মঙ্গল','শুক্র','বুধ','চন্দ্র','সূর্য','বুধ','শুক্র','মঙ্গল','গুরু','শনি','শনি','গুরু'];
var LAGNA_NAMES=['মেষ','বৃষ','মিথুন','কর্কট','সিংহ','কন্যা','তুলা','বৃশ্চিক','ধনু','মকর','কুম্ভ','মীন'];
var MANGAL_DOSHA_LAGNA=[0,3,6,7]; // মেষ,কর্কট,তুলা,বৃশ্চিক লগ্নে মঙ্গল ১/৪/৭/৮/১২তে

function _calcBirthData(dateStr, hourF, lat, lng) {
  var parts = dateStr.split('-');
  var y=+parts[0], m=+parts[1], d=+parts[2];
  var tz = 5.5; // IST
  var jd = JD(y,m,d) + (hourF - tz)/24;
  var ay = lahiriAY(jd);
  var ml = moonL(jd);
  var sl = sunL(jd);
  var moonSid = ((ml - ay) % 360 + 360) % 360;
  var sunSid  = ((sl - ay) % 360 + 360) % 360;
  var moonRashi = Math.floor(moonSid / 30);
  var sunRashi  = Math.floor(sunSid  / 30);
  var nakIdx    = Math.floor(moonSid / (360/27)) % 27;
  // ✅ Lagna — correct formula (no noon bug)
  var _lr=calcLagnaAt(jd,lat,lng);var lagnaRashi=_lr.ri,ascSid=_lr.sid;
  // ✅ JPL-accurate Mars, Moon, Sun
  var _marsSid=marsLon(jd);  // JPL DE441 if in range
  var marsRashi=Math.floor(_marsSid/30);
  lagnaRashi=((lagnaRashi%12)+12)%12;
  var marsHouse=((marsRashi-lagnaRashi+12)%12)+1;
  var hasMangalDosha=[1,4,7,8,12].includes(marsHouse);
  // Use JPL moon for accurate nakshatra
  var moonSidJpl=moonLon(jd);  // JPL if available
  var nakIdxJpl=Math.floor(moonSidJpl/(360/27))%27;
  var moonPada=Math.floor(moonSidJpl/(360/108))%4+1;
  // Sun sidereal
  var sunSidJpl=sunLon(jd);
  var sunRashiJpl=Math.floor(sunSidJpl/30);
  // Rahu
  var _rs=((rahuL(jd)-ay)%360+360)%360;
  var rahuRashi=Math.floor(_rs/30),ketuRashi=(rahuRashi+6)%12;
  return{moonRashi:Math.floor(moonSidJpl/30),sunRashi:sunRashiJpl,nakIdx:nakIdxJpl,
         lagnaRashi,hasMangalDosha,marsHouse,marsRashi,
         rahuRashi,ketuRashi,moonPada,moonDeg:moonSidJpl.toFixed(2)};
}

function _showBirthResult(data,elId){
  var RL=['মঙ্গল','শুক্র','বুধ','চন্দ্র','সূর্য','বুধ','শুক্র','মঙ্গল','গুরু','শনি','শনি','গুরু'];
  var html='<div class="calc-result-head">🔮 জন্মরাশি ফলাফল — JPL Horizons DE441 ✓</div>';
  html+='<div class="calc-result-grid">';
  html+='<div class="calc-result-item"><div class="lbl">জন্মরাশি (চন্দ্র)</div><div class="val">'+L_BN[data.moonRashi]+'</div></div>';
  html+='<div class="calc-result-item"><div class="lbl">নক্ষত্র (পাদ)</div><div class="val">'+NAKS[data.nakIdx][0]+' ('+(data.moonPada||1)+'ম পাদ)</div></div>';
  html+='<div class="calc-result-item"><div class="lbl">জন্মলগ্ন</div><div class="val">'+L_BN[data.lagnaRashi]+'</div></div>';
  html+='<div class="calc-result-item"><div class="lbl">সূর্যরাশি</div><div class="val">'+L_BN[data.sunRashi]+'</div></div>';
  html+='<div class="calc-result-item"><div class="lbl">রাশির অধিপতি</div><div class="val">'+RL[data.moonRashi]+'</div></div>';
  html+='<div class="calc-result-item"><div class="lbl">নক্ষত্রের অধিপতি</div><div class="val">'+NAKS[data.nakIdx][1]+'</div></div>';
  if(data.rahuRashi!==undefined){html+='<div class="calc-result-item"><div class="lbl">রাহু রাশি</div><div class="val">'+L_BN[data.rahuRashi]+'</div></div><div class="calc-result-item"><div class="lbl">কেতু রাশি</div><div class="val">'+L_BN[data.ketuRashi]+'</div></div>';}
  html+='</div>';
  var mg=data.hasMangalDosha;
  html+='<div style="margin-top:.42rem;padding:.42rem .58rem;border-radius:9px;font-size:.71rem;line-height:1.6;background:'+(mg?'rgba(181,32,32,.06)':'rgba(37,102,37,.06)')+';border:1px solid '+(mg?'rgba(181,32,32,.18)':'rgba(37,102,37,.18)')+';color:var(--txt);">';
  html+=mg?'⚠️ <strong>মঙ্গল দোষ আছে</strong> ('+data.marsHouse+'ম ভাবে — রাশি: '+L_BN[data.marsRashi||0]+') — বিবাহের আগে পরামর্শ নিন।':'✅ <strong>মঙ্গল দোষ নেই</strong> ('+data.marsHouse+'ম ভাবে — রাশি: '+L_BN[data.marsRashi||0]+')';
  html+='</div>';
  html+='<div style="margin-top:.3rem;font-size:.61rem;color:var(--txt2);padding:.28rem .4rem;background:rgba(37,102,37,.04);border-radius:6px;border:1px solid rgba(37,102,37,.12);">✅ সূর্য · চন্দ্র · মঙ্গল: JPL Horizons DE441 (±30″ নির্ভুলতা) | লগ্ন: সিদ্ধান্ত পদ্ধতি ✓</div>';
  document.getElementById(elId).innerHTML=html;
  document.getElementById(elId).classList.add('show');
}

function calcBirthRashiMain() {
  var d = document.getElementById('birthDateMain').value;
  var h = +document.getElementById('birthHourMain').value || 6;
  var mn = +document.getElementById('birthMinMain').value || 0;
  var lat = +document.getElementById('birthLatMain').value || LAT;
  var lng = +document.getElementById('birthLngMain').value || LNG;
  if (!d) { alert('জন্ম তারিখ দিন।'); return; }
  try { var data = _calcBirthData(d, h + mn/60, lat, lng); _showBirthResult(data, 'birthResultMain'); }
  catch(e) { document.getElementById('birthResultMain').innerHTML = '<p style="color:red">গণনায় ত্রুটি: '+e.message+'</p>'; document.getElementById('birthResultMain').classList.add('show'); }
}
function calcBirthRashi2() {
  var d = document.getElementById('birthDate2').value;
  var h = +document.getElementById('birthHour2').value || 6;
  var mn = +document.getElementById('birthMin2').value || 0;
  var lat = +document.getElementById('birthLat2').value || LAT;
  var lng = +document.getElementById('birthLng2').value || LNG;
  if (!d) { alert('জন্ম তারিখ দিন।'); return; }
  try { var data = _calcBirthData(d, h + mn/60, lat, lng); _showBirthResult(data, 'birthResult2'); }
  catch(e) { document.getElementById('birthResult2').innerHTML = '<p style="color:red">ত্রুটি: '+e.message+'</p>'; document.getElementById('birthResult2').classList.add('show'); }
}

// ════════════════════════════════════════════════════════
// SECTION ⑳ — DEATH DOSHA CALCULATOR (মৃত্যু দোষ গণনা)
// ════════════════════════════════════════════════════════
function _calcDeathData(dateStr, hourF) {
  var dt = new Date(dateStr + 'T00:00:00');
  var c = calcDay(dt);
  // দশাহ (১০ দিন সূতক)
  var dashaha = new Date(dt); dashaha.setDate(dashaha.getDate() + 10);
  // তেরো দিন
  var thirteenth = new Date(dt); thirteenth.setDate(thirteenth.getDate() + 13);
  // মাসিক শ্রাদ্ধ (মৃত্যু তিথিতে প্রতি মাসে)
  var tithiName = c.tName;
  var paksha = c.paksha;
  // বার্ষিক শ্রাদ্ধ (মৃত্যু তিথিতে পরের বছর)
  var nextYear = new Date(dt); nextYear.setFullYear(nextYear.getFullYear()+1);
  var shraddhaYear = nextYear.toLocaleDateString('bn-IN',{day:'numeric',month:'long',year:'numeric'});
  // সূতক কাল
  var sutakEnd = new Date(dashaha);
  return {c, tithiName, paksha, dashahaDate:dashaha, thirteenth, shraddhaYear, sutakEnd};
}

function _showDeathResult(data, elId) {
  var html = '<div class="calc-result-head">📿 মৃত্যু দোষ ও পিণ্ডদান ফলাফল</div>';
  html += '<div class="calc-result-grid">';
  html += '<div class="calc-result-item"><div class="lbl">মৃত্যুর তিথি</div><div class="val">'+data.c.paksha.slice(0,2)+' '+data.tithiName+'</div></div>';
  html += '<div class="calc-result-item"><div class="lbl">মৃত্যুর বার</div><div class="val">'+data.c.vara+'</div></div>';
  html += '<div class="calc-result-item"><div class="lbl">দশাহ শেষ</div><div class="val">'+data.dashahaDate.toLocaleDateString('bn-IN')+'</div></div>';
  html += '<div class="calc-result-item"><div class="lbl">তেরোদিন</div><div class="val">'+data.thirteenth.toLocaleDateString('bn-IN')+'</div></div>';
  html += '</div>';
  html += '<div style="margin-top:.6rem;padding:.6rem .7rem;border-radius:9px;background:rgba(181,134,13,.06);border:1px solid rgba(181,134,13,.18);font-size:.72rem;line-height:1.7;color:var(--txt);">';
  html += '<div style="font-weight:700;color:var(--gold-d);margin-bottom:.3rem;">📿 পিণ্ডদান ও তর্পণ বিধি</div>';
  html += '• সূতক কাল দশাহ পর্যন্ত। এর মধ্যে কোনো শুভ কাজ করবেন না।<br>';
  html += '• ১০ দিনের দিন দশাহ ক্রিয়া সম্পন্ন করুন।<br>';
  html += '• ১৩তম দিনে তেরো পিণ্ড দান করুন।<br>';
  html += '• প্রতি মাসে মৃত্যু তিথিতে ('+data.paksha.slice(0,2)+' '+data.tithiName+') মাসিক শ্রাদ্ধ করুন।<br>';
  html += '• মৃত্যুর এক বছর পরে বার্ষিক শ্রাদ্ধ: '+data.shraddhaYear+'।<br>';
  html += '• গয়া পিণ্ডদান করলে বিশেষ মুক্তি লাভ হয়।<br>';
  html += '• তর্পণ মন্ত্র: <em>ওঁ আগচ্ছন্তু মে পিতরঃ সর্বে</em>';
  html += '</div>';
  var el = document.getElementById(elId);
  el.innerHTML = html;
  el.classList.add('show');
}

function calcDeathDoshaMain() {
  var d = document.getElementById('deathDateMain').value;
  var h = +document.getElementById('deathHourMain').value || 0;
  if (!d) { alert('মৃত্যুর তারিখ দিন।'); return; }
  try { var data = _calcDeathData(d, h); _showDeathResult(data, 'deathResultMain'); }
  catch(e) { document.getElementById('deathResultMain').innerHTML = '<p style="color:red">ত্রুটি: '+e.message+'</p>'; document.getElementById('deathResultMain').classList.add('show'); }
}
function calcDeathDosha2() {
  var d = document.getElementById('deathDate2').value;
  var h = +document.getElementById('deathHour2').value || 0;
  if (!d) { alert('মৃত্যুর তারিখ দিন।'); return; }
  try { var data = _calcDeathData(d, h); _showDeathResult(data, 'deathResult2'); }
  catch(e) { document.getElementById('deathResult2').innerHTML = '<p style="color:red">ত্রুটি: '+e.message+'</p>'; document.getElementById('deathResult2').classList.add('show'); }
}

// ════════════════════════════════════════════════════════
// SECTION ㉑ — UPDATED showDetail (৭ ট্যাব সহ)
// ════════════════════════════════════════════════════════
function showDetail(date) {
  if (!(date instanceof Date)) { date = new Date(date); }
  selDate = date;
  renderCal();
  var c = calcDay(date), bn = c.bn;
  var y = date.getFullYear(), mo = date.getMonth(), d = date.getDate();
  document.getElementById('dtbn').textContent = bn ? toBn(bn.d) + ' ' + bn.name + ' ' + toBn(bn.y) + ' বঙ্গাব্দ' : '';
  document.getElementById('dten').textContent = d + ' ' + EMS[mo] + ' ' + y + ' | ' + c.vara + ' | ' + (bn ? bn.ritu + ' ঋতু' : '');
  document.getElementById('dtmoon').textContent = moonEmoji(c.tN);
  document.getElementById('dtpaksha').textContent = c.paksha + ' — ' + c.tName + ' (' + toBn(c.pakDay) + ' তিথি)';
  document.getElementById('dtvara').textContent = 'বার-অধিপতি: ' + c.varaL;
  var pct = c.tN <= 15 ? (c.tN / 15 * 100) : ((30 - c.tN) / 15 * 100);
  document.getElementById('dtprog').style.width = pct + '%';
  document.getElementById('dtplbl').textContent = c.tN <= 15 ? 'পূর্ণিমা পর্যন্ত ' + toBn(15 - c.tN) + ' তিথি' : 'অমাবস্যা পর্যন্ত ' + toBn(30 - c.tN) + ' তিথি';

  // ── ট্যাব ০: পঞ্চাঙ্গ ──
  var extraItems = [{i:'☀️',l:'বার',v:c.vara,s:'অধিপতি: '+c.varaL},{i:'🌿',l:'ঋতু',v:bn?bn.ritu:'—',s:bn?bn.name+' মাস':''},{i:'📅',l:'বিক্রম সম্বত',v:bn?toBn(bn.vikram):'—',s:''},{i:'🕉️',l:'শক সম্বত',v:bn?toBn(bn.saka):'—',s:''}];
  var extraHtml = '';
  for (var xi = 0; xi < extraItems.length; xi++) {
    var x = extraItems[xi];
    extraHtml += '<div class="di"><div class="dii">'+x.i+'</div><div class="dil">'+x.l+'</div><div class="div2">'+x.v+'</div>'+(x.s?'<div class="dis">'+x.s+'</div>':'')+'</div>';
  }
  document.getElementById('dtpan').innerHTML =
    _panItem('🌙','তিথি',c.tithiList,function(v){return v.pakShort+' '+v.name;},function(v){return v.paksha;})+
    _panItem('⭐','নক্ষত্র',c.nakList,function(v){return v.name;},function(v){return 'অধিপতি: '+v.lord;})+
    _panItem('🌟','যোগ',c.yogaList,function(v){return v.name;},function(v){return v.sym==='✓'?'শুভ যোগ':'অশুভ যোগ';})+
    _panItem('🎴','করণ',c.karanList,function(v){return v.name;},null)+extraHtml;
  var rh=Math.floor(c.st.rise),rm=Math.round((c.st.rise-rh)*60);
  var sh=Math.floor(c.st.set),sm=Math.round((c.st.set-sh)*60);
  var row1=[{ico:'🌅',cls:'shubha',l:'সূর্যোদয়',v:fmtT(rh,rm)},{ico:'🌇',cls:'',l:'সূর্যাস্ত',v:fmtT(sh,sm)},{ico:'🌄',cls:'shubha',l:'ব্রাহ্ম মুহূর্ত',v:_brahmaT(c.st.rise)}];
  var row2=[{ico:'⚡',cls:'rahu',l:'রাহুকাল',v:c.rahu},{ico:'🕯️',cls:'rahu',l:'গুলিকাকাল',v:c.gulika},{ico:'💫',cls:'shubha',l:'অভিজিৎ মুহূর্ত',v:c.abhi},{ico:'🔥',cls:'',l:'যমঘণ্ট',v:c.yam}];
  var mkCard=function(t){return '<div class="dtime '+t.cls+'"><div class="dtl">'+t.ico+' '+t.l+'</div><div class="dtv">'+t.v+'</div></div>';};
  document.getElementById('dttimes').innerHTML=
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.52rem;margin-bottom:.52rem;">'+row1.map(mkCard).join('')+'</div>'+
    '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.52rem;">'+row2.map(mkCard).join('')+'</div>';

  // ── ট্যাব ১: শুভ সময় ──
  var ds2 = dStr(date);
  var isGood = !BAD_DAYS_VW.includes(date.getDay()) && !_isMalmasDt(date);
  var tN = c.tN, nakName = c.nak[0], nakIdx2 = NAKS.findIndex(function(n){return n[0]===nakName;});
  var shubhaHtml = '';
  var GUIDE = PANJIKA_DATA.auspiciousGuides;
  Object.keys(GUIDE).forEach(function(key){
    var g = GUIDE[key];
    var goodNak = nakIdx2>=0 && g.goodNakshatras && g.goodNakshatras.includes(nakName);
    var badTithi = g.badTithis && g.badTithis.some(function(bt){ return c.tName.includes(bt) || (bt==='অমাবস্যা'&&c.tN===30) || (bt==='পূর্ণিমা'&&c.tN===15); });
    var goodDay = !g.badDays || !g.badDays.includes(c.vara);
    var status = (!isGood || badTithi) ? 'bad' : (goodNak && goodDay) ? 'good' : 'neutral';
    var badgeText = status==='good' ? '✅ শুভ' : status==='bad' ? '❌ অশুভ' : '⚠️ মধ্যম';
    shubhaHtml += '<div class="shubha-row"><div class="shubha-row-head">';
    shubhaHtml += '<span class="shubha-ico">'+g.icon+'</span><span class="shubha-name">'+g.title+'</span>';
    shubhaHtml += '<span class="shubha-badge '+status+'">'+badgeText+'</span></div>';
    if (status==='good') shubhaHtml += '<div class="shubha-detail">আজকের নক্ষত্র ('+nakName+') ও বার এই কাজের জন্য শুভ।</div>';
    else if (status==='bad') shubhaHtml += '<div class="shubha-detail">আজ '+c.vara+' বা তিথি ('+c.tName+') এই কাজের জন্য প্রতিকূল।</div>';
    else shubhaHtml += '<div class="shubha-detail">মিশ্র যোগ। Dr. Prodyut Acharya-র সাথে পরামর্শ করুন।</div>';
    shubhaHtml += '</div>';
  });
  document.getElementById('dtshubha').innerHTML = shubhaHtml;

  // ── ট্যাব ২: উৎসব ──
  var festHtml2 = _festHtml(c);
  var evts2 = getPanjikaEvents(ds2, ds2.slice(5));
  var specHtml = '';
  evts2.festivals.forEach(function(f){ specHtml += '<div class="fi"><div class="fiico">'+f.icon+'</div><div class="fin">'+f.name+'</div></div>'; });
  evts2.births.forEach(function(b){ specHtml += '<div class="fi"><div class="fiico">'+b.icon+'</div><div class="fin">'+b.name+' — জন্মদিন ('+b.birthYear+')</div></div>'; });
  evts2.deaths.forEach(function(d2){ specHtml += '<div class="fi"><div class="fiico">'+d2.icon+'</div><div class="fin">'+d2.name+' — তিরোধান ('+d2.deathYear+')</div></div>'; });
  evts2.modern.forEach(function(m){ specHtml += '<div class="fi"><div class="fiico">'+m.icon+'</div><div class="fin">'+m.name+'</div></div>'; });
  try {
    var nIdx3 = _getNakIdx(JD(y,mo+1,d)+0.5);
    var syogas2 = checkSpecialYogas(date.getDay(), nIdx3);
    syogas2.forEach(function(yg){ specHtml += '<div class="fi"><div class="fiico">'+yg.icon+'</div><div class="fin">'+yg.name+'</div></div>'; });
  } catch(e){}
  document.getElementById('dtfests').innerHTML = festHtml2;
  document.getElementById('dtspecial').innerHTML = specHtml || '';

  // ── ট্যাব ৩: মন্ত্র ও বিধি ──
  var mantraHtml = '';
  var mantraEvts = evts2.festivals.concat(evts2.births.map(function(b){return {name:b.name, mantra:'', pujaVidhi:b.message};}));
  if (evts2.malmas) mantraEvts.push({name:evts2.malmas.monthName, mantra:evts2.malmas.mantra, pujaVidhi:evts2.malmas.do.join(', ')});
  if (mantraEvts.length) {
    mantraEvts.forEach(function(f){
      if(f.mantra||f.pujaVidhi){
        mantraHtml += '<div class="sd-card festival" style="margin:.42rem 1.2rem;"><div class="sd-name">'+f.name+'</div>';
        if(f.mantra) mantraHtml += '<div class="sd-mantra">🕉️ মন্ত্র: '+f.mantra+'</div>';
        if(f.pujaVidhi) mantraHtml += '<div class="sd-sig" style="margin-top:.3rem;">📿 বিধি: '+f.pujaVidhi+'</div>';
        mantraHtml += '</div>';
      }
    });
  }
  var yogaMantras={'বিষ্কুম্ভ':'আজ বিশ্রাম নিন। নতুন কাজ শুরু করবেন না।','প্রীতি':'সম্পর্ক মধুর হয়। প্রিয়জনের সাথে সময় কাটান।','সৌভাগ্য':'আজ ভাগ্য সহায়। নতুন উদ্যোগ নিন।','সিদ্ধি':'কাজে সিদ্ধি লাভ হবে।','শুভ':'সব শুভ কাজের জন্য আদর্শ দিন।','ধ্রুব':'স্থায়ী সিদ্ধান্ত নেওয়ার দিন।','বৃদ্ধি':'উন্নতির যোগ।','বৈধৃতি':'শুভ কাজ এড়িয়ে চলুন।','ব্যতীপাত':'সতর্কতার দিন।'};
  var yName = c.yogaList[0].val.name;
  if (yogaMantras[yName]) mantraHtml += '<div class="fi" style="margin:.42rem 1.2rem;"><div class="fiico">🌟</div><div class="fin">'+yName+' যোগ — '+yogaMantras[yName]+'</div></div>';
  if (!mantraHtml) mantraHtml = '<div class="nofest" style="margin:1rem;">আজকের বিশেষ মন্ত্র বা বিধি নেই।</div>';
  document.getElementById('dtmantra').innerHTML = mantraHtml;

  // ── ট্যাব ৪: মলমাস ──
  var malmasHtml = '';
  if (evts2.malmas) {
    var ml = evts2.malmas;
    malmasHtml += '<div class="sd-card malmas" style="margin:.6rem 1.2rem 0;"><div class="sd-head"><span class="sd-icon">📿</span><span class="sd-name">'+ml.monthName+'</span></div>';
    malmasHtml += '<div class="sd-sig">'+ml.significance+'</div>';
    malmasHtml += '<div style="margin-top:.4rem;"><div style="color:var(--green);font-size:.7rem;font-weight:700;margin-bottom:.18rem;">✅ করণীয়:</div>';
    ml.do.forEach(function(d3){ malmasHtml += '<div style="font-size:.72rem;color:var(--txt);padding:.1rem 0;">• '+d3+'</div>'; });
    malmasHtml += '</div><div style="margin-top:.35rem;"><div style="color:var(--red);font-size:.7rem;font-weight:700;margin-bottom:.18rem;">❌ বর্জনীয়:</div>';
    ml.dont.forEach(function(d4){ malmasHtml += '<div style="font-size:.72rem;color:var(--txt);padding:.1rem 0;">• '+d4+'</div>'; });
    malmasHtml += '</div><div class="sd-mantra" style="margin-top:.4rem;">'+ml.mantra+'</div></div>';
    malmasHtml += '<div style="font-size:.7rem;color:var(--txt2);padding:.5rem 1.2rem;">সময়কাল: '+ml.startDate+' থেকে '+ml.endDate+'</div>';
  } else {
    malmasHtml = '<div class="nofest" style="margin:1rem;">এই দিনে মলমাস নেই।</div>';
  }
  document.getElementById('dtmalmas').innerHTML = malmasHtml;

  // পেন ৫ ও ৬ (ক্যালকুলেটর) — ফর্ম রিসেট
  ['birthResult2','deathResult2'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){el.classList.remove('show');el.innerHTML='';}
  });
  if(document.getElementById('birthDate2')) document.getElementById('birthDate2').value = dStr(date);

  // ট্যাব ০ activate
  document.querySelectorAll('.dtab').forEach(function(t,i){t.classList.toggle('act',i===0);});
  document.querySelectorAll('.dtab-pane').forEach(function(p,i){p.classList.toggle('show',i===0);});

  var p = document.getElementById('dtp');
  p.classList.add('show');
  if (!_initLoad) { setTimeout(function(){ p.scrollIntoView({behavior:'smooth', block:'start'}); }, 100); }
}
function closeD() { document.getElementById('dtp').classList.remove('show'); selDate = null; renderCal(); }

// ════════════════════════════════════════════════════════
// SECTION ㉒ — UPDATED renderCal (ইভেন্ট আইকন সহ)
// ════════════════════════════════════════════════════════
// override renderCal to add event icons from PANJIKA_DATA
var _origRenderCal = renderCal;
function renderCal(){
  var days=getBnMonthDays(calIdx);
  if(!days.length)return;
  var e=BMS[calIdx];
  var f=days[0].date,l=days[days.length-1].date;
  var enRange=f.getMonth()===l.getMonth()?EMS[f.getMonth()]+' '+f.getFullYear():EMSh[f.getMonth()]+'–'+EMSh[l.getMonth()]+' '+l.getFullYear();
  document.getElementById('cmbn').textContent=BNM_NAMES[e.m]+' '+toBn(e.y)+' বঙ্গাব্দ';
  document.getElementById('cmen').textContent=enRange;
  var first=days[0].date.getDay();
  var h='';
  for(var i=0;i<first;i++)h+='<div class="cd ce"></div>';
  days.forEach(function(item){
    var date=item.date;var bnDay=item.bnDay;
    var wd=date.getDay();
    var isT=date.toDateString()===TODAY.toDateString();
    var isS=selDate&&date.toDateString()===selDate.toDateString();
    var c=calcDay(date);
    var ds_=dStr(date);
    var mmdd=ds_.slice(5);
    var fests=c.fests;
    var enLbl=date.getDate()+' '+EMSh[date.getMonth()];
    var tsh=c.tithiList.length>1?c.tithiList[0].val.pakShort+' '+c.tithiList[0].val.name+'/'+c.tithiList[1].val.pakShort+' '+c.tithiList[1].val.name:c.tithiList[0].val.pakShort+' '+c.tithiList[0].val.name;
    var cls='cd';
    if(wd===0)cls+=' ds';if(wd===6)cls+=' dsa';if(isT)cls+=' ct';if(isS)cls+=' cs';
    // event icons from PANJIKA_DATA
    var evts2=getPanjikaEvents(ds_,mmdd);
    var malmasOnDay=evts2.malmas;
    var iconDots='';
    if(malmasOnDay) iconDots+='<span class="cd-dot" title="মলমাস">📿</span>';
    if(evts2.festivals.length) iconDots+='<span class="cd-dot" title="'+evts2.festivals[0].name+'">'+evts2.festivals[0].icon+'</span>';
    if(evts2.births.length) iconDots+='<span class="cd-dot" title="'+evts2.births[0].name+'">🕉️</span>';
    if(evts2.deaths.length) iconDots+='<span class="cd-dot" title="'+evts2.deaths[0].name+'">🕯️</span>';
    if(evts2.modern.length) iconDots+='<span class="cd-dot" title="'+evts2.modern[0].name+'">'+evts2.modern[0].icon+'</span>';
    // special yogas
    try{var nIdx4=_getNakIdx(JD(date.getFullYear(),date.getMonth()+1,date.getDate())+0.5);var sy=checkSpecialYogas(date.getDay(),nIdx4);if(sy.length)iconDots+='<span class="cd-dot" title="'+sy[0].name+'">✨</span>';}catch(er){}
    var festDisp='';
    if(c.eclipses&&c.eclipses.length)festDisp='<div class="df" style="color:#7b2fbe;">'+c.eclipses[0].icon+' '+c.eclipses[0].type+'</div>';
    else if(evts2.festivals.length)festDisp='<div class="df">'+evts2.festivals[0].icon+' '+evts2.festivals[0].name+'</div>';
    else if(fests.length)festDisp='<div class="df">'+fests[0].i+' '+fests[0].n+'</div>';
    h+='<div class="'+cls+'" onclick="showDetail(new Date(\''+ds_+'\'))">'+(isT?'<div class="tdot"></div>':'')+'<div class="db">'+toBn(bnDay)+'</div><div class="de">'+enLbl+'</div><div class="dti">'+tsh+'</div>'+festDisp+(iconDots?'<div class="cd-icons">'+iconDots+'</div>':'')+'</div>';
  });
  document.getElementById('cbody').innerHTML=h;
  // refresh month events when calendar changes
  if(typeof renderMonthEvents==='function') renderMonthEvents();
  if(typeof renderAuspiciousCounter==='function') renderAuspiciousCounter();
}

// ════════════════════════════════════════════════════════
// SECTION ㉓ — INIT
// ════════════════════════════════════════════════════════
let _initLoad=true;
try {
  renderHeader();
  renderCal();
  renderTodayEvents();
  renderMonthEvents();
  renderGuideCards();
  renderAuspiciousCounter();
  showDetail(TODAY);
} catch(e) {
  console.error('Panjika init error:', e);
  const dbg = document.createElement('div');
  dbg.style.cssText = 'background:#ffeeee;border:2px solid red;padding:1rem;margin:1rem;border-radius:8px;font-family:monospace;font-size:.85rem;color:#c00;z-index:9999;position:relative;';
  dbg.textContent = '⚠️ পঞ্জিকা লোড ত্রুটি: ' + e.message;
  document.body.insertBefore(dbg, document.body.firstChild);
}
_initLoad=false;


// ══ WhatsApp bubble flash ══
(function(){
  var b=document.getElementById('waBubble');
  if(!b)return;
  function show(){
    b.classList.add('show');
    setTimeout(function(){b.classList.remove('show');},4000);
  }
  setTimeout(show,3000);
  setInterval(show,20000);
})();

// ══ Scroll-to-top button ══
(function(){
  var stb=document.getElementById('stb');
  if(!stb)return;
  window.addEventListener('scroll',function(){
    if(window.scrollY>300){stb.classList.add('show');}
    else{stb.classList.remove('show');}
  },{passive:true});
})();



  // ════════════════════════════════════════════════════════
// PAYMENT MODAL — Razorpay Integration
// ⚠️ আপনার Razorpay Key ID নিচে বসান
// ════════════════════════════════════════════════════════
var RZP_KEY = 'rzp_live_SN8p6DJxPYFVL1';

var _pay = { name:'', price:0, icon:'', custName:'', custPhone:'' };

function openPayModal(svcName, price, icon) {
  _pay.name  = svcName;
  _pay.price = price;
  _pay.icon  = icon;

  document.getElementById('paySvcIco').textContent = icon;
  document.getElementById('paySvcNm').textContent  = svcName;
  document.getElementById('paySvcPr').textContent  = '₹ ' + price.toLocaleString('bn-BD');

  document.getElementById('payName').value  = '';
  document.getElementById('payPhone').value = '';
  document.getElementById('payName').classList.remove('error');
  document.getElementById('payPhone').classList.remove('error');
  document.getElementById('payNameErr').classList.remove('show');
  document.getElementById('payPhoneErr').classList.remove('show');

  document.getElementById('payFormWrap').style.display = '';
  document.getElementById('paySuccess').classList.remove('show');

  var btn = document.getElementById('paySubmitBtn');
  btn.classList.remove('loading');
  document.getElementById('payBtnTxt').textContent = 'নিরাপদ পেমেন্ট করুন — ₹ ' + price.toLocaleString('bn-BD');

  document.getElementById('payOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(function(){ document.getElementById('payName').focus(); }, 350);
}

function closePayModal() {
  document.getElementById('payOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('payOverlay')) closePayModal();
}

document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closePayModal();
});

// এখানে শেষ অংশ (পেমেন্ট ফাংশন) পুরোপুরি এভাবে বসান:
function initiatePayment() {
  var name  = document.getElementById('payName').value.trim();
  var phone = document.getElementById('payPhone').value.trim();
  var valid = true;

  if (!name || name.length < 2) {
    document.getElementById('payName').classList.add('error');
    document.getElementById('payNameErr').classList.add('show');
    valid = false;
  } else {
    document.getElementById('payName').classList.remove('error');
    document.getElementById('payNameErr').classList.remove('show');
  }

  if (!/^\d{10}$/.test(phone)) {
    document.getElementById('payPhone').classList.add('error');
    document.getElementById('payPhoneErr').classList.add('show');
    valid = false;
  } else {
    document.getElementById('payPhone').classList.remove('error');
    document.getElementById('payPhoneErr').classList.remove('show');
  }

  if (!valid) return;

  _pay.custName  = name;
  _pay.custPhone = phone;

  var btn = document.getElementById('paySubmitBtn');
  btn.classList.add('loading');
  document.getElementById('payBtnTxt').innerHTML = '<i class="fas fa-spinner fa-spin"></i> অপেক্ষা করুন...';

  var options = {
    key: RZP_KEY,
    amount: _pay.price * 100,
    currency: 'INR',
    name: 'MyAstrology',
    description: _pay.name,
    image: 'https://www.myastrology.in/images/logo.png',
    prefill: { name: name, contact: '+91' + phone },
    notes: { service: _pay.name, customer_name: name, customer_phone: phone },
    theme: { color: '#b5860d' },
    handler: function(response) { onPaymentSuccess(response); }
  };

  try {
    var rzp = new Razorpay(options);
    rzp.open();
  } catch(err) {
    btn.classList.remove('loading');
    document.getElementById('payBtnTxt').textContent = 'নিরাপদ পেমেন্ট করুন — ₹ ' + _pay.price.toLocaleString('bn-BD');
    alert('Razorpay লোড হয়নি।');
  }
}

function onPaymentSuccess(response) {
  var btn = document.getElementById('paySubmitBtn');
  btn.classList.remove('loading');

  var waMsg = '🙏 আমি ' + _pay.name + ' পরিষেবার জন্য ' + _pay.price + ' টাকা পেমেন্ট করেছি।\n\n👤 নাম: ' + _pay.custName + '\n📱 মোবাইল: ' + _pay.custPhone + '\n💳 Payment ID: ' + (response.razorpay_payment_id || 'N/A');

  var waUrl = 'https://wa.me/919333122768?text=' + encodeURIComponent(waMsg);

  document.getElementById('payFormWrap').style.display = 'none';
  document.getElementById('paySuccess').classList.add('show');
  document.getElementById('payWaLink').href = waUrl;

  setTimeout(() => window.open(waUrl, '_blank'), 1500);
}
</script>
<style>
.btn-sk{background:linear-gradient(135deg,#0a1730,#0f2248);color:#c9a227;border:1px solid rgba(201,162,39,.3);border-radius:8px;padding:.4rem .25rem;font-size:.67rem;font-weight:600;cursor:pointer;font-family:'Baloo Da 2',sans-serif;transition:all .18s;touch-action:manipulation;}
.btn-sk:hover,.btn-sk:active{background:rgba(201,162,39,.15);border-color:#c9a227;}
</style>

<script>
var YATRA_DIR={0:'দক্ষিণ',1:'উত্তর',2:'পূর্ব',3:'উত্তর',4:'পূর্ব',5:'পূর্ব ও পশ্চিম',6:'পশ্চিম'};
function showShubhaKarma(dateStr, karmaType) {
  var pts=dateStr.split('-');
  var y=+pts[0],m=+pts[1],d=+pts[2];
  var dt=new Date(dateStr+'T12:00:00');
  var c=calcDay(dt);
  if(!c){document.getElementById('dtfests').innerHTML='<div style="padding:.6rem;color:#b52020;">তারিখ তথ্য পাওয়া যায়নি।</div>';return;}
  var titles={vivah:'💒 বিবাহের শুভ লগ্ন ও সময়',griha:'🏠 গৃহপ্রবেশের শুভ সময়',
    garb:'🤱 গর্ভধারণের শুভ সময়',busi:'💼 ব্যবসা আরম্ভের শুভ সময়',
    sadh:'🍚 সাধভক্ষণের শুভ সময়',yatra:'🚶 শুভ যাত্রার সময় ও দিক'};
  var html='<div style="padding:.5rem .65rem;">';
  html+='<div style="font-size:.78rem;font-weight:700;color:var(--gold-d);margin-bottom:.45rem;">'+titles[karmaType]+'</div>';
  html+='<div style="font-size:.68rem;color:var(--txt2);margin-bottom:.45rem;">'+dateStr+' | '+c.vara+' | '+c.paksha+' '+c.tName+' | '+c.nak[0]+'</div>';
  if(c.dd&&c.dd.total>0)html+='<div style="font-size:.67rem;color:#b52020;padding:.28rem .4rem;background:rgba(181,32,32,.05);border-radius:6px;margin-bottom:.4rem;">⚠️ '+c.dd.name+' আছে</div>';
  function fmtT2(v){var hh=Math.floor(((v%24)+24)%24),mm=Math.round((v-Math.floor(v))*60);if(mm>=60){hh=(hh+1)%24;mm=0;}return ('0'+hh).slice(-2)+':'+('0'+mm).slice(-2);}
  var lastBB=0;if(c.bb&&c.bb.length)c.bb.forEach(function(b){if(b.en>lastBB)lastBB=b.en;});
  var abh_s=c.abhijit_start||c.noon-24/60;
  var shubhaStart=abh_s;
  if(lastBB>abh_s&&lastBB<c.st.set)shubhaStart=lastBB;
  if(c.bb)c.bb.forEach(function(b){if(b.st<=abh_s+24/60&&b.en>abh_s)shubhaStart=Math.max(shubhaStart,b.en);});
  if(karmaType==='vivah'){
    var wins=getLagnaWins(y,m,d,VV_L);
    if(!wins||!wins.length){html+='<div style="padding:.5rem;background:rgba(181,32,32,.08);border-radius:8px;font-size:.72rem;color:#b52020;">⚠️ এই তারিখে বিবাহের শুভ লগ্ন নেই।</div>';}
    else{html+='<div style="display:flex;flex-direction:column;gap:.32rem;">';
      wins.forEach(function(w){
        var nd=w.nd?' (পরদিন)':'';
        var suti=(c.vara==='বৃহস্পতিবার'&&(w.ri===2||w.ri===8))||(c.vara==='সোমবার'&&w.ri===5)||(c.vara==='শুক্রবার'&&w.ri===6);
        html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:.38rem .5rem;background:rgba(37,102,37,.08);border-radius:8px;border:1px solid rgba(37,102,37,.2);">'
          +'<span style="font-size:.71rem;font-weight:700;color:var(--green);">'+w.n+' লগ্নে'+(suti?' সুতহিবুকযোগে':'')+'</span>'
          +'<span style="font-size:.7rem;color:var(--txt);">'+fmtT2(w.s)+' – '+fmtT2(w.e)+nd+'</span></div>';});
      html+='</div>';}
  } else if(karmaType==='garb'){
    var garbTime=(c.amN&&c.amN.length)?c.amN[0].st:c.st.set+3.5;
    html+='<div style="padding:.45rem .55rem;background:rgba(37,102,37,.08);border-radius:9px;border:1px solid rgba(37,102,37,.2);">';
    html+='<div style="font-size:.72rem;color:var(--green);font-weight:700;">🌙 রাত্রি '+fmtT2(garbTime)+' পরে গর্ভধারণ শুভ</div>';
    html+='<div style="font-size:.68rem;color:var(--txt2);margin-top:.2rem;">'+fmtT2(garbTime)+' – '+fmtT2(garbTime+2)+'</div></div>';
  } else if(karmaType==='yatra'){
    var ydirIdx=c.w||0;var yDir=YATRA_DIR[ydirIdx]||'পূর্ব';
    var isOK=!['মঙ্গলবার','শনিবার'].includes(c.vara)&&(!c.dd||c.dd.total<3);
    html+='<div style="padding:.45rem .55rem;background:'+(isOK?'rgba(37,102,37,.08)':'rgba(181,32,32,.08)')+';border-radius:9px;border:1px solid '+(isOK?'rgba(37,102,37,.2)':'rgba(181,32,32,.2)')+';">';
    if(isOK){html+='<div style="font-size:.72rem;color:var(--green);font-weight:700;">✅ শুভ যাত্রা</div><div style="font-size:.7rem;color:var(--txt);margin-top:.3rem;">⏰ সময়: '+fmtT2(Math.max(shubhaStart,c.st.rise))+' পরে</div><div style="font-size:.7rem;color:var(--txt);margin-top:.18rem;">🧭 শুভ দিক: '+yDir+'</div>';}
    else html+='<div style="font-size:.72rem;color:#b52020;font-weight:700;">⚠️ আজ শুভ যাত্রা নেই ('+c.vara+')</div>';
    html+='</div>';
  } else {
    var lsets={griha:GH_L,busi:BS_L,sadh:VV_L};
    var lnames={griha:'গৃহপ্রবেশ',busi:'ব্যবসা আরম্ভ',sadh:'সাধভক্ষণ'};
    var wins2=getLagnaWins(y,m,d,lsets[karmaType]||GH_L);
    html+='<div style="padding:.45rem .55rem;background:rgba(37,102,37,.08);border-radius:9px;border:1px solid rgba(37,102,37,.2);margin-bottom:.4rem;">';
    html+='<div style="font-size:.72rem;color:var(--green);font-weight:700;">⏰ প্রথম শুভ সময়</div>';
    html+='<div style="font-size:.7rem;color:var(--txt);margin-top:.28rem;">'+fmtT2(shubhaStart)+' পরে '+lnames[karmaType]+' শুভ</div></div>';
    if(wins2&&wins2.length){html+='<div style="display:flex;flex-direction:column;gap:.28rem;">';
      wins2.slice(0,4).forEach(function(w){var nd=w.nd?' (পরদিন)':'';
        html+='<div style="display:flex;justify-content:space-between;padding:.32rem .45rem;background:rgba(37,102,37,.06);border-radius:7px;border:1px solid rgba(37,102,37,.15);">'
          +'<span style="font-size:.7rem;font-weight:600;color:var(--green);">'+w.n+' লগ্ন</span>'
          +'<span style="font-size:.69rem;color:var(--txt);">'+fmtT2(w.s)+' – '+fmtT2(w.e)+nd+'</span></div>';});
      html+='</div>';}
  }
  html+='</div>';
  document.getElementById('dtfests').innerHTML=html;
  var panel=document.getElementById('dtp');if(!panel.classList.contains('show'))panel.classList.add('show');
}



// ════ নতুন রেন্ডার ফাংশনস ════════════════════════════════════════════

function renderGrahaGrid9() {
  const el=document.getElementById('grahaGrid9'); if(!el) return;
  const c=calcDay(TODAY); if(!c) return;
  const jdR=JD(TODAY.getFullYear(),TODAY.getMonth()+1,TODAY.getDate())+(c.st.rise-TZ)/24;
  const pos=getAllPlanetPositions(jdR);
  if(!pos){el.innerHTML='<div style="grid-column:1/-1;text-align:center;color:#b52020">ডেটা পাওয়া যায়নি</div>';return;}
  const order=['sun','mon','mar','mer','ven','jup','sat','rah','ket'];
  const icons={sun:'☀️',mon:'🌙',mar:'🔴',mer:'💚',ven:'⚪',jup:'🟡',sat:'🔵',rah:'🌑',ket:'🌒'};
  el.innerHTML=order.map(k=>{
    const g=pos[k]; if(!g) return '';
    return `<div class="g9-card">${g.isRetro?'<span class="g9-retro">®</span>':''}
      <div class="g9-name">${icons[k]} ${g.name}</div>
      <div class="g9-rashi">${g.rashi}</div>
      <div class="g9-deg">${g.deg}°${String(g.min).padStart(2,'0')}′</div>
      <div class="g9-nak">${g.nak} ${toBn(g.pada)}পদ</div></div>`;
  }).join('');
}

function renderNakTransit() {
  const el=document.getElementById('nakTransitWrap'); if(!el) return;
  const y=TODAY.getFullYear(),m=TODAY.getMonth()+1,d=TODAY.getDate();
  const tr=getMoonNakTransitions(y,m,d);
  if(!tr||!tr.length){el.style.display='none';return;}
  el.style.display='block';
  document.getElementById('nakTransitBody').innerHTML=
    tr.map(t=>`<div class="nak-slot">
      <span class="nak-time">${t.timeStr}</span>
      <span class="nak-arr">→</span>
      <span>${t.nak} (${t.lord} অধিপতি)</span></div>`).join('');
}

function renderMrituFull() {
  const el=document.getElementById('mrituFullWrap'); if(!el) return;
  const c=calcDay(TODAY); if(!c) return;
  const segs=getMrityuDoshaFull(TODAY.getFullYear(),TODAY.getMonth()+1,TODAY.getDate(),TODAY.getDay(),c.st);
  if(!segs||!segs.length){el.innerHTML='';return;}
  const headCls={0:'doshmukta',1:'ekpada',2:'dwipada',3:'tripada',4:'pushkar'};
  el.innerHTML=segs.map(s=>`
    <div class="mritu-seg-row">
      <span class="mritu-seg-time">${s.startStr} – ${s.endStr}</span>
      <span class="mritu-seg-name ${headCls[s.score]||''}">${s.name}${s.pushkar?' ('+s.pushkar+')':''}</span>
    </div>`).join('');
}

function renderVivahFull() {
  const el=document.getElementById('vivahFullSection'); if(!el) return;
  const y=TODAY.getFullYear(),m=TODAY.getMonth()+1,d=TODAY.getDate();
  const wins=getLagnaWins(y,m,d,VV_L);
  if(!wins||!wins.length){
    el.innerHTML='<div class="no-vivah">আজ বিবাহের শুভ লগ্ন নেই</div>'; return;
  }
  const c=calcDay(TODAY);
  el.innerHTML=wins.map(w=>{
    const suti=(c&&c.vara==='বৃহস্পতিবার'&&(w.ri===2||w.ri===8));
    return `<div class="vivah-row">
      <div class="vr-lagna">${w.n} লগ্ন${suti?' — সুতহিবুকযোগ':''}</div>
      <div class="vr-time">${fmtT(w.s)} – ${fmtT(w.e)}${w.nd?' (পরদিন)':''}</div>
    </div>`;
  }).join('');
}

function renderShubhaKarmaFull() {
  const el=document.getElementById('shubhaKarmaFull'); if(!el) return;
  const c=calcDay(TODAY); if(!c) return;
  const st=c.st, abh_s=c.abhijit_start, abh_e=c.abhijit_end;
  const dir=YATRA_DIR[TODAY.getDay()]||'পূর্ব';
  const tN=c.tN;
  const items=[
    {n:'বিবাহ',emoji:'💒',t:'বিস্তারিত নিচে দেখুন',note:'শুভ লগ্নে',good:true},
    {n:'গৃহপ্রবেশ',emoji:'🏠',t:fmtT(st.rise)+' – '+fmtT(st.rise+2.5),note:'সকালে শুভ লগ্নে',good:[1,3,5].includes(TODAY.getDay())},
    {n:'গৃহ নির্মাণ',emoji:'🏗️',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'অভিজিৎ মুহূর্ত',good:true},
    {n:'ব্যবসা আরম্ভ',emoji:'💼',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'অভিজিৎ মুহূর্ত',good:true},
    {n:'নামকরণ',emoji:'👶',t:fmtT(st.rise+1)+' – '+fmtT(st.rise+3),note:'পুষ্যা/হস্তা শ্রেষ্ঠ',good:true},
    {n:'অন্নপ্রাশন',emoji:'🍚',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'শুক্লপক্ষে শুভ',good:tN<=15},
    {n:'রত্নধারণ',emoji:'💎',t:fmtT(st.rise)+' – '+fmtT(st.rise+1.5),note:'সূর্যোদয়ে পূজা করে',good:true},
    {n:'গর্ভধারণ',emoji:'🤱',t:fmtT(st.set+2)+' – '+fmtT(st.set+5),note:'শুক্লপক্ষ ৪-১৬ তিথি',good:tN>=4&&tN<=16},
    {n:'শুভ যাত্রা',emoji:'✈️',t:fmtT(st.rise+1)+' – '+fmtT(c.rahu.st),note:'দিক: '+dir,good:true},
    {n:'ভূমি ক্রয়-বিক্রয়',emoji:'🏡',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'একাদশীতে শ্রেষ্ঠ',good:tN===11||tN===26},
    {n:'দীক্ষা গ্রহণ',emoji:'🙏',t:fmtT(st.rise)+' – '+fmtT(st.rise+2),note:'একাদশী/পূর্ণিমায়',good:tN===11||tN===15},
    {n:'শান্তিস্বস্ত্যয়ন',emoji:'🕯️',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'অভিজিৎ মুহূর্ত',good:true},
    {n:'ঋণ গ্রহণ',emoji:'📋',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'বৃহস্পতি/শুক্রে শুভ',good:[4,5].includes(TODAY.getDay())},
    {n:'সাধভক্ষণ',emoji:'🍛',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'শুক্লপক্ষে',good:tN<=15},
    {n:'গ্রহ পূজা',emoji:'🪐',t:fmtT(st.rise)+' – '+fmtT(st.rise+2),note:'সূর্যোদয়ে মন্ত্র সহ',good:true},
    {n:'শিল্পারম্ভ',emoji:'🎨',t:fmtT(abh_s)+' – '+fmtT(abh_e),note:'বুধ/শুক্রে শুভ',good:[3,5].includes(TODAY.getDay())},
  ];
  el.innerHTML=items.map(it=>`<div class="sk-row">
    <span class="sk-emoji">${it.emoji}</span>
    <div class="sk-info">
      <div class="sk-name">${it.n}</div>
      <div class="sk-time">⏰ ${it.t}</div>
      <div class="sk-note">${it.note}</div>
    </div>
    <span class="sk-badge ${it.good?'sk-good':'sk-warn'}">${it.good?'শুভ':'মধ্যম'}</span>
  </div>`).join('');
}

function renderSpecialYogas() {
  const el=document.getElementById('specialYogaWrap'); if(!el) return;
  const c=calcDay(TODAY); if(!c) return;
  const nakIdx=NAKS.findIndex(n=>n[0]===c.nak[0]);
  const lagNakIdx=c.lgn?Math.floor(c.lgn.ascSid/(360/27)):-1;
  const yogas=getSpecialYogas(TODAY.getDay(),nakIdx,lagNakIdx);
  // Amrita time
  const amD=c.amD, amN=c.amN, mh=c.mhD;
  el.innerHTML=`
    <div class="yoga-row ${amD&&amD.length?'yoga-active':''}">
      <span class="yoga-icon">🌙</span>
      <div>
        <div class="yoga-name">অমৃতযোগ (দিন)</div>
        <div class="yoga-time">${amD&&amD.length?fmtT(amD[0].st)+' – '+fmtT(amD[0].en):'আজ নেই'}</div>
      </div>
    </div>
    <div class="yoga-row ${amN&&amN.length?'yoga-active':''}">
      <span class="yoga-icon">🌑</span>
      <div>
        <div class="yoga-name">অমৃতযোগ (রাত)</div>
        <div class="yoga-time">${amN&&amN.length?fmtT(amN[0].st)+' – '+fmtT(amN[0].en):'আজ নেই'}</div>
      </div>
    </div>
    <div class="yoga-row ${mh&&mh.length?'yoga-active':''}">
      <span class="yoga-icon">⚡</span>
      <div>
        <div class="yoga-name">মাহেন্দ্র যোগ</div>
        <div class="yoga-time">${mh&&mh.length?fmtT(mh[0].st)+' – '+fmtT(mh[0].en):'আজ নেই'}</div>
      </div>
    </div>
    ${yogas.map(y=>`<div class="yoga-row yoga-active">
      <span class="yoga-icon">${y.icon}</span>
      <div><div class="yoga-name">${y.name}</div><div class="yoga-desc">${y.desc}</div></div>
    </div>`).join('')}`;
}

function setupRashifalLink() {
  const now=new Date();
  const ds=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  const links=document.querySelectorAll('.rashifal-auto-link');
  links.forEach(l=>{ l.href='https://www.myastrology.in/rashifal/'+ds+'.html'; });
  const de=document.getElementById('rashifalDateStr');
  if(de){
    const BM=['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
    de.textContent=toBn(now.getDate())+' '+BM[now.getMonth()]+' '+toBn(now.getFullYear());
  }
}

function initNewRenders(){
  setupRashifalLink();
  setTimeout(function(){
    renderGrahaGrid9();
    renderNakTransit();
    renderMrituFull();
    renderVivahFull();
    renderShubhaKarmaFull();
    renderSpecialYogas();
  },150);
}
