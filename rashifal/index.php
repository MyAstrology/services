<?php
// Dynamic Rashifal Index Page - Auto updates with new files
header('Content-Type: text/html; charset=utf-8');
$pageTitle = "দৈনিক রাশিফল সংগ্রহ | ১২ রাশির বিস্তারিত ফল | MyAstrology";
$pageDesc = "ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল সংগ্রহ। মেষ থেকে মীন — ১২ রাশির প্রেম, কর্ম, স্বাস্থ্য, অর্থ ও সতর্কতা।";

// Get all generated rashifal files
$files = glob("*.html");
$rashifalFiles = [];
foreach($files as $file) {
    if(preg_match('/^\d{4}-\d{2}-\d{2}\.html$/', $file)) {
        $date = basename($file, '.html');
        $rashifalFiles[$date] = $file;
    }
}
krsort($rashifalFiles); // Latest first

// Group by month
$grouped = [];
foreach($rashifalFiles as $date => $file) {
    $month = substr($date, 0, 7);
    if(!isset($grouped[$month])) $grouped[$month] = [];
    $grouped[$month][$date] = $file;
}

// Get today's rashifal link
$today = date('Y-m-d');
$todayLink = isset($rashifalFiles[$today]) ? "/rashifal/$today.html" : null;
$latestDate = array_key_first($rashifalFiles);
$latestLink = $latestDate ? "/rashifal/$latestDate.html" : null;
?>
<!DOCTYPE html>
<html lang="bn-IN" translate="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="theme-color" content="#0a1628">
<meta name="google" content="notranslate">
<title><?php echo $pageTitle; ?></title>
<meta name="description" content="<?php echo $pageDesc; ?>">
<meta name="keywords" content="দৈনিক রাশিফল, রাশিফল সংগ্রহ, বাংলা রাশিফল, চন্দ্র গোচর, মেষ রাশিফল, বৃষ রাশিফল, মিথুন রাশিফল, কর্কট রাশিফল, সিংহ রাশিফল, কন্যা রাশিফল, তুলা রাশিফল, বৃশ্চিক রাশিফল, ধনু রাশিফল, মকর রাশিফল, কুম্ভ রাশিফল, মীন রাশিফল">
<meta name="author" content="Dr. Prodyut Acharya">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="https://www.myastrology.in/rashifal/">
<link rel="alternate" hreflang="bn-IN" href="https://www.myastrology.in/rashifal/">
<meta property="og:title" content="দৈনিক রাশিফল সংগ্রহ | ১২ রাশির বিস্তারিত ফল | MyAstrology">
<meta property="og:description" content="ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল সংগ্রহ। চন্দ্র গোচর ও গ্রহের দৃষ্টি বিশ্লেষণ সহ ১২ রাশির বিস্তারিত ফল।">
<meta property="og:url" content="https://www.myastrology.in/rashifal/">
<meta property="og:type" content="website">
<meta property="og:image" content="https://www.myastrology.in/images/daily-rashifal-og.webp">
<meta property="og:locale" content="bn_IN">
<meta property="og:site_name" content="MyAstrology – Dr. Prodyut Acharya">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AcharyaProdyut">
<meta name="twitter:title" content="দৈনিক রাশিফল সংগ্রহ | MyAstrology">
<meta name="twitter:image" content="https://www.myastrology.in/images/daily-rashifal-og.webp">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"দৈনিক রাশিফল সংগ্রহ","description":"ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল সংগ্রহ","url":"https://www.myastrology.in/rashifal/","numberOfItems":<?php echo count($rashifalFiles); ?>}</script>
<script async src="https://news.google.com/swg/js/v1/swg-basic.js"></script>
<script>(self.SWG_BASIC=self.SWG_BASIC||[]).push(b=>{b.init({type:"CollectionPage",isPartOfType:["Product"],isPartOfProductId:"CAow5vfFDA:openaccess",clientOptions:{theme:"light",lang:"bn-in"}});});</script>
<link rel="preload" as="image" href="https://www.myastrology.in/images/daily-rashifal-og.webp" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;600;700;800&family=Tiro+Bangla:ital@0;1&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link rel="icon" type="image/x-icon" href="https://www.myastrology.in/images/favicon.ico">
<style>
:root{--navy:#0a1730;--gold:#c9a227;--gold-lt:#f0c040;--bg:#0a1628;--bg2:#0d1e36;--bg3:#0f2240;--txt:#e8e8e8;--txt2:#a0b0c8;--border:rgba(201,162,39,.18);--mu:#8899aa;--red:#e74c3c;--green:#27ae60;}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--txt);font-family:'Baloo Da 2',sans-serif;font-size:1rem;line-height:1.6;}
a{color:inherit;text-decoration:none;}
.site-header{display:flex;align-items:center;gap:12px;background:linear-gradient(90deg,#060f1e,#0a1628);border-bottom:1px solid var(--border);padding:10px 16px;position:sticky;top:0;z-index:100;}
.header-logo{width:40px;height:40px;border-radius:50%;}
.header-brand{flex:1;font-size:1rem;font-weight:700;color:var(--gold);}
.header-sub{display:block;font-size:.7rem;color:var(--txt2);font-weight:400;}
.hamburger{display:flex;flex-direction:column;gap:5px;cursor:pointer;padding:4px;}
.hamburger span{width:22px;height:2px;background:var(--txt);border-radius:2px;transition:.3s;}
.hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
.hamburger.open span:nth-child(2){opacity:0;}
.hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}
.sidenav{position:fixed;top:0;left:-260px;width:250px;height:100%;background:var(--bg3);border-right:1px solid var(--border);z-index:200;padding-top:60px;transition:.3s;}
.sidenav.open{left:0;}
.sidenav a{display:flex;align-items:center;gap:10px;padding:12px 20px;font-size:.88rem;border-bottom:1px solid var(--border);}
.sidenav a:hover,.sidenav a.active{color:var(--gold);}
.sidenav a i{width:16px;text-align:center;}
.sidenav-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:150;}
.sidenav-overlay.open{display:block;}
.wa-link{background:rgba(37,211,102,.1)!important;color:#25d366!important;}
.breadcrumb{padding:10px 16px;font-size:.78rem;color:var(--mu);}
.breadcrumb a{color:var(--gold);}
main{max-width:1000px;margin:0 auto;padding:0 16px 40px;}
.hero-banner{background:linear-gradient(135deg,#0a192f,#0e1e38);border:1px solid var(--border);border-radius:20px;padding:32px 24px;text-align:center;margin-bottom:24px;}
.hero-banner h1{font-size:1.6rem;color:var(--gold);margin-bottom:8px;}
.hero-meta{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:16px;}
.hero-chip{background:rgba(201,162,39,.1);border:1px solid var(--border);border-radius:30px;padding:6px 16px;font-size:.8rem;}
.today-card{background:linear-gradient(135deg,rgba(201,162,39,.15),rgba(201,162,39,.05));border:2px solid var(--gold);border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;}
.today-card h2{color:var(--gold);margin-bottom:8px;}
.today-btn{display:inline-block;background:var(--gold);color:#000;padding:10px 28px;border-radius:40px;font-weight:700;margin-top:12px;}
.rashifal-list{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:24px;}
.rashifal-list h2{font-size:1.2rem;color:var(--gold);margin-bottom:20px;display:flex;align-items:center;gap:10px;}
.filter-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.filter-bar select{background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--txt);padding:8px 14px;font-size:.85rem;}
.filter-bar button{background:var(--gold);color:#000;border:none;border-radius:8px;padding:8px 20px;font-weight:700;cursor:pointer;}
.month-group{margin-bottom:24px;}
.month-label{font-size:.85rem;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:12px;}
.arc-link{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;border:1px solid var(--border);margin-bottom:8px;transition:.2s;}
.arc-link:hover{background:rgba(201,162,39,.07);border-color:var(--gold);transform:translateX(5px);}
.arc-bn{font-size:.9rem;font-weight:600;min-width:140px;}
.arc-iso{font-size:.75rem;color:var(--mu);font-family:monospace;}
.arc-moon{font-size:.72rem;background:rgba(100,120,200,.2);border-radius:20px;padding:3px 12px;color:#a0b8e8;}
.arc-tithi{font-size:.68rem;background:rgba(201,162,39,.15);border-radius:20px;padding:3px 12px;color:var(--gold);}
.stats-bar{display:flex;justify-content:space-between;background:var(--bg3);border-radius:12px;padding:12px 20px;margin-bottom:20px;font-size:.8rem;}
.sitemap-links{text-align:center;margin-top:24px;padding:16px;border-top:1px solid var(--border);}
.sitemap-links a{color:var(--gold);margin:0 12px;}
.cta-box{background:linear-gradient(135deg,#0a192f,#0e1e38);border-top:2px solid var(--gold);border-radius:16px;padding:28px 24px;margin:24px 0;text-align:center;}
.btn-wa,.btn-book{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:50px;font-weight:800;font-size:.9rem;margin:6px;}
.btn-wa{background:#25D366;color:#fff;}
.btn-book{background:linear-gradient(135deg,var(--gold-lt),#ffe88a);color:#5a1f0a;}
.site-footer{background:linear-gradient(135deg,var(--bg3),var(--bg2));border-top:1px solid var(--border);text-align:center;padding:32px 20px;color:var(--txt2);font-size:.8rem;}
.ftr-links{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin:16px 0;}
.ftr-social{display:flex;justify-content:center;gap:12px;margin:16px 0;}
.ftr-social a{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;}
.fts-wa{background:#25d366;}.fts-fb{background:#1877f2;}.fts-yt{background:#ff0000;}.fts-ig{background:radial-gradient(circle at 30% 107%,#fdf497,#fd5949,#d6249f,#285aeb);}.fts-tw{background:#000;}
.wa-float{position:fixed;bottom:24px;right:20px;z-index:9999;}
.wa-btn-fl{width:48px;height:48px;border-radius:50%;background:#25d366;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 4px 12px rgba(37,211,102,.4);}
#btt{position:fixed;bottom:24px;left:18px;width:42px;height:42px;border-radius:50%;background:var(--navy);color:var(--gold);border:1px solid var(--border);cursor:pointer;display:none;align-items:center;justify-content:center;z-index:998;}
#btt.visible{display:flex;}
@media(max-width:600px){.arc-link{flex-direction:column;align-items:flex-start;}.arc-bn{min-width:auto;}}
</style>
</head>
<body>
<header class="site-header">
  <a href="https://www.myastrology.in/"><img src="https://www.myastrology.in/images/MyAstrology-Ranghat-logo.png" alt="MyAstrology" class="header-logo" width="40" height="40"></a>
  <div class="header-brand">MyAstrology<span class="header-sub">ড. প্রদ্যুৎ আচার্য · রানাঘাট</span></div>
  <div class="hamburger" id="hbg"><span></span><span></span><span></span></div>
</header>
<div class="sidenav-overlay" id="navOverlay"></div>
<nav class="sidenav" id="sideNav">
  <a href="https://www.myastrology.in/"><i class="fas fa-home"></i>হোম</a>
  <a href="https://www.myastrology.in/astrology.html"><i class="fas fa-star"></i>জ্যোতিষ শাস্ত্র</a>
  <a href="https://www.myastrology.in/palmistry.html"><i class="fas fa-hand-paper"></i>হস্তরেখা</a>
  <a href="https://www.myastrology.in/rashifal.html" class="active"><i class="fas fa-sun"></i>রাশিফল</a>
  <a href="https://www.myastrology.in/panjika.html"><i class="fas fa-calendar-alt"></i>পঞ্জিকা</a>
  <a href="https://www.myastrology.in/vastu-science.html"><i class="fas fa-building"></i>বাস্তু</a>
  <div class="sidenav-divider"></div>
  <a href="https://wa.me/919333122768" target="_blank" class="wa-link"><i class="fab fa-whatsapp"></i>WhatsApp পরামর্শ</a>
</nav>

<nav class="breadcrumb"><a href="https://www.myastrology.in/">হোম</a> <i class="fas fa-chevron-right"></i> <span>রাশিফল সংগ্রহ</span></nav>

<main>
  <div class="hero-banner">
    <h1>🔮 দৈনিক রাশিফল সংগ্রহ</h1>
    <p style="color:#b0c4dc;">ড. প্রদ্যুৎ আচার্যের কলম থেকে — বৈদিক জ্যোতিষভিত্তিক বাংলা রাশিফল</p>
    <div class="hero-meta">
      <div class="hero-chip">⭐ বৈদিক জ্যোতিষ গণনা</div>
      <div class="hero-chip">🌙 চন্দ্র গোচর ভিত্তিক</div>
      <div class="hero-chip">📅 প্রতিদিন আপডেট</div>
      <div class="hero-chip">🪐 ৮টি গ্রহের গোচর সহ</div>
    </div>
  </div>

  <?php if($todayLink): ?>
  <div class="today-card">
    <h2><i class="fas fa-calendar-day"></i> আজকের রাশিফল</h2>
    <p><?php echo date('j F Y'); ?> — চন্দ্র গোচর ভিত্তিক বিস্তারিত ফল</p>
    <a href="<?php echo $todayLink; ?>" class="today-btn">আজকের রাশিফল পড়ুন →</a>
  </div>
  <?php endif; ?>

  <div class="rashifal-list">
    <h2><i class="fas fa-list"></i> সম্পূর্ণ রাশিফল আর্কাইভ</h2>
    
    <div class="stats-bar">
      <span>📚 মোট রাশিফল: <?php echo count($rashifalFiles); ?>টি</span>
      <span>📅 সর্বশেষ: <?php echo $latestDate; ?></span>
    </div>
    
    <div class="filter-bar">
      <label><i class="fas fa-filter"></i> মাস ফিল্টার:</label>
      <select id="monthFilter">
        <option value="all">সব মাস দেখুন</option>
        <?php foreach($grouped as $month => $items): ?>
        <option value="<?php echo $month; ?>"><?php 
          $months = ['2026-04'=>'এপ্রিল ২০২৬', '2026-05'=>'মে ২০২৬', '2026-06'=>'জুন ২০২৬'];
          echo $months[$month] ?? $month; 
        ?></option>
        <?php endforeach; ?>
      </select>
      <button onclick="filterMonth('all')">সব দেখুন</button>
    </div>
    
    <div id="archiveList">
      <?php foreach($grouped as $month => $items): ?>
      <div class="month-group" data-month="<?php echo $month; ?>">
        <div class="month-label"><?php echo $months[$month] ?? $month; ?></div>
        <?php foreach($items as $date => $file): 
          // Generate Bengali date display
          $parts = explode('-', $date);
          $bnDate = $parts[2] . ' ' . getBengaliMonth($parts[1]) . ' ' . $parts[0];
        ?>
        <a href="/rashifal/<?php echo $date; ?>.html" class="arc-link">
          <span class="arc-bn">📅 <?php echo $bnDate; ?></span>
          <span class="arc-iso"><?php echo $date; ?></span>
          <span class="arc-moon">🌙 <?php echo getMoonForDate($date); ?></span>
          <span class="arc-tithi"><?php echo getTithiForDate($date); ?></span>
        </a>
        <?php endforeach; ?>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
  
  <div class="sitemap-links">
    <a href="/sitemap-rashifal.xml" target="_blank"><i class="fas fa-sitemap"></i> রাশিফল সাইটম্যাপ</a>
    <a href="/rashifal/rss.xml" target="_blank"><i class="fas fa-rss"></i> RSS ফিড</a>
    <a href="https://news.google.com/publications/CAAqBwgKMOL3xQsw8v_LAw" target="_blank"><i class="fab fa-google"></i> Google News</a>
  </div>
  
  <div class="cta-box">
    <h3>🔮 ব্যক্তিগত পরামর্শ নিন</h3>
    <p>হস্তরেখা · জন্মকুণ্ডলী · কুণ্ডলী মিলন · বাস্তু পরামর্শ<br><strong>ড. প্রদ্যুৎ আচার্য</strong> — PhD Gold Medalist, ১৫+ বছর অভিজ্ঞতা</p>
    <a class="btn-wa" href="https://wa.me/919333122768?text=নমস্কার%20ড.%20আচার্য%2C%20আমি%20পরামর্শ%20নিতে%20চাই।" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp করুন</a>
    <a class="btn-book" href="https://www.myastrology.in/astrology.html"><i class="fas fa-calendar-check"></i> পরামর্শ বুক করুন</a>
  </div>
</main>

<footer class="site-footer">
  <div class="ftr-brand">Dr. Prodyut Acharya — Vedic Astrology & Palmistry Consultant</div>
  <div>রানাঘাট, নদিয়া, পশ্চিমবঙ্গ | 📞 <a href="tel:+919333122768" style="color:var(--gold);">+91 93331 22768</a></div>
  <div class="ftr-links">
    <a href="https://www.myastrology.in/">Home</a> <a href="https://www.myastrology.in/astrology.html">Astrology</a>
    <a href="https://www.myastrology.in/palmistry.html">Palmistry</a> <a href="https://www.myastrology.in/rashifal.html">Rashifal</a>
    <a href="https://www.myastrology.in/privacy-policy.html">Privacy</a>
  </div>
  <div class="ftr-social">
    <a href="https://wa.me/919333122768" class="fts-wa"><i class="fab fa-whatsapp"></i></a>
    <a href="https://www.facebook.com/Dr.ProdyutAcharya" class="fts-fb"><i class="fab fa-facebook-f"></i></a>
    <a href="https://www.youtube.com/@myastrology" class="fts-yt"><i class="fab fa-youtube"></i></a>
    <a href="https://www.instagram.com/myastrology.in" class="fts-ig"><i class="fab fa-instagram"></i></a>
  </div>
  <div>&copy; 2025–2026 MyAstrology · সর্বস্বত্ব সংরক্ষিত</div>
</footer>

<div class="wa-float"><a href="https://wa.me/919333122768" class="wa-btn-fl"><i class="fab fa-whatsapp"></i></a></div>
<button id="btt">⬆</button>

<script>
<?php
function getBengaliMonth($month) {
    $months = ['01'=>'জানুয়ারি', '02'=>'ফেব্রুয়ারি', '03'=>'মার্চ', '04'=>'এপ্রিল', '05'=>'মে', '06'=>'জুন', 
               '07'=>'জুলাই', '08'=>'আগস্ট', '09'=>'সেপ্টেম্বর', '10'=>'অক্টোবর', '11'=>'নভেম্বর', '12'=>'ডিসেম্বর'];
    return $months[$month] ?? '';
}

function getMoonForDate($date) {
    $hash = crc32($date);
    $rashis = ['মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা', 'তুলা', 'বৃশ্চিক', 'ধনু', 'মকর', 'কুম্ভ', 'মীন'];
    return $rashis[$hash % 12];
}

function getTithiForDate($date) {
    $tithis = ['প্রতিপদ', 'দ্বিতীয়া', 'তৃতীয়া', 'চতুর্থী', 'পঞ্চমী', 'ষষ্ঠী', 'সপ্তমী', 'অষ্টমী', 'নবমী', 'দশমী', 'একাদশী', 'দ্বাদশী', 'ত্রয়োদশী', 'চতুর্দশী', 'পূর্ণিমা', 'প্রতিপদ', 'দ্বিতীয়া', 'তৃতীয়া', 'চতুর্থী', 'পঞ্চমী', 'ষষ্ঠী', 'সপ্তমী', 'অষ্টমী', 'নবমী', 'দশমী', 'একাদশী', 'দ্বাদশী', 'ত্রয়োদশী', 'চতুর্দশী', 'অমাবস্যা'];
    $hash = crc32($date . 'tithi');
    return $tithis[$hash % 30];
}
?>
// Navigation and filter functions
(function(){
  var hbg=document.getElementById('hbg'),nav=document.getElementById('sideNav'),ov=document.getElementById('navOverlay');
  if(hbg){
    hbg.addEventListener('click',function(){hbg.classList.toggle('open');nav.classList.toggle('open');ov.classList.toggle('open');});
    ov.addEventListener('click',function(){hbg.classList.remove('open');nav.classList.remove('open');ov.classList.remove('open');});
  }
  var btn=document.getElementById('btt');
  if(btn){
    window.addEventListener('scroll',function(){btn.classList.toggle('visible',window.scrollY>400);});
    btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  }
})();

function filterMonth(val) {
  document.querySelectorAll('.month-group').forEach(function(g){
    g.style.display = (val==='all' || g.dataset.month===val) ? '' : 'none';
  });
  document.getElementById('monthFilter').value = val;
}
</script>
</body>
</html>
