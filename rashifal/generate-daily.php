#!/usr/bin/php
<?php
// Daily Rashifal Generator - Run via cron job
// Command: php /path/to/rashifal/generate-daily.php

$today = date('Y-m-d');
$outputFile = __DIR__ . '/' . $today . '.html';
$templateFile = __DIR__ . '/../src/daily.template.html';

// Check if already generated for today
if(file_exists($outputFile) && filesize($outputFile) > 10000) {
    echo "Rashifal for $today already exists. Skipping.\n";
    exit(0);
}

// Calculate today's panchanga
$moonRashi = calculateMoonRashi($today);
$tithi = calculateTithi($today);
$nakshatra = calculateNakshatra($today);
$sunRashi = calculateSunRashi($today);
$bnDate = getBengaliDate($today);

// Generate 12 rashis data
$rashis = generateAllRashis($today, $moonRashi);

// Create JSON for JavaScript
$rashifalJson = json_encode($rashis, JSON_UNESCAPED_UNICODE);

// Read template
$template = file_get_contents($templateFile);
if(!$template) {
    // If template doesn't exist, use embedded template
    $template = getEmbeddedTemplate();
}

// Replace placeholders
$html = str_replace(
    ['{{BN_DATE}}', '{{BN_DATE_FULL}}', '{{MOON_RASHI}}', '{{SUN_RASHI}}', 
     '{{TITHI}}', '{{NAKSHATRA}}', '{{RASHIFAL_DATA_JSON}}', '{{URL_DATE}}'],
    [$bnDate, getBengaliDateFull($today), $moonRashi, $sunRashi, 
     $tithi, $nakshatra, $rashifalJson, $today],
    $template
);

// Save file
file_put_contents($outputFile, $html);
echo "Generated: $outputFile\n";

// Update sitemap
updateSitemap($today);

// Update RSS feed
updateRSSFeed($today, $bnDate, $moonRashi);

// Helper functions
function calculateMoonRashi($date) {
    // Simplified calculation - replace with actual panchanga API
    $hash = crc32($date);
    $rashis = ['মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা', 'তুলা', 'বৃশ্চিক', 'ধনু', 'মকর', 'কুম্ভ', 'মীন'];
    return $rashis[$hash % 12];
}

function calculateTithi($date) {
    $tithis = ['প্রতিপদ', 'দ্বিতীয়া', 'তৃতীয়া', 'চতুর্থী', 'পঞ্চমী', 'ষষ্ঠী', 'সপ্তমী', 'অষ্টমী', 'নবমী', 'দশমী', 'একাদশী', 'দ্বাদশী', 'ত্রয়োদশী', 'চতুর্দশী', 'পূর্ণিমা', 'প্রতিপদ', 'দ্বিতীয়া', 'তৃতীয়া', 'চতুর্থী', 'পঞ্চমী', 'ষষ্ঠী', 'সপ্তমী', 'অষ্টমী', 'নবমী', 'দশমী', 'একাদশী', 'দ্বাদশী', 'ত্রয়োদশী', 'চতুর্দশী', 'অমাবস্যা'];
    $hash = crc32($date);
    return $tithis[$hash % 30];
}

function calculateNakshatra($date) {
    $nakshatras = ['অশ্বিনী', 'ভরণী', 'কৃত্তিকা', 'রোহিণী', 'মৃগশিরা', 'আর্দ্রা', 'পুনর্বসু', 'পুষ্যা', 'অশ্লেষা', 'মঘা', 'পূর্বাফাল্গুনী', 'উত্তরাফাল্গুনী', 'হস্তা', 'চিত্রা', 'স্বাতী', 'বিশাখা', 'অনুরাধা', 'জ্যেষ্ঠা', 'মূলা', 'পূর্বাষাঢ়া', 'উত্তরাষাঢ়া', 'শ্রবণা', 'ধনিষ্ঠা', 'শতভিষা', 'পূর্বাভাদ্রপদ', 'উত্তরাভাদ্রপদ', 'রেবতী'];
    $hash = crc32($date);
    return $nakshatras[$hash % 27];
}

function calculateSunRashi($date) {
    $month = (int)date('m', strtotime($date));
    $rashis = ['মকর', 'কুম্ভ', 'মীন', 'মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা', 'তুলা', 'বৃশ্চিক', 'ধনু'];
    $index = ($month - 1) % 12;
    return $rashis[$index];
}

function getBengaliDate($date) {
    $d = new DateTime($date);
    $months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    $weekdays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    return $weekdays[$d->format('w')] . ', ' . $d->format('j') . ' ' . $months[$d->format('n')-1] . ' ' . $d->format('Y');
}

function getBengaliDateFull($date) {
    $d = new DateTime($date);
    $months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    return $d->format('j') . ' ' . $months[$d->format('n')-1] . ', ' . $d->format('Y');
}

function generateAllRashis($date, $moonRashi) {
    $rashis = ['মেষ', 'বৃষ', 'মিথুন', 'কর্কট', 'সিংহ', 'কন্যা', 'তুলা', 'বৃশ্চিক', 'ধনু', 'মকর', 'কুম্ভ', 'মীন'];
    $data = [];
    foreach($rashis as $idx => $name) {
        $hash = crc32($date . $name);
        $isMoon = ($name === $moonRashi);
        $data[] = [
            'rashiName' => $name,
            'score' => ['love'=>rand(2,5), 'work'=>rand(2,5), 'health'=>rand(2,5), 'finance'=>rand(2,5)],
            'love' => ['short'=>($isMoon?'শুভ':'মধ্যম'), 'detailed'=>'আজকের দিন সম্পর্কের ক্ষেত্রে সতর্কতা প্রয়োজন', 'advice'=>'ধৈর্য ধরুন'],
            'work' => ['short'=>($isMoon?'উন্নতি':'স্থিতিশীল'), 'detailed'=>'কর্মক্ষেত্রে নতুন সুযোগ আসতে পারে', 'advice'=>'সুযোগ গ্রহণ করুন'],
            'health' => ['short'=>'স্বাভাবিক', 'detailed'=>'শারীরিক পরিশ্রম কমান', 'advice'=>'বিশ্রাম নিন'],
            'finance' => ['short'=>'স্থিতিশীল', 'detailed'=>'অনাকাঙ্ক্ষিত খরচ এড়িয়ে চলুন', 'advice'=>'বাজেট মেনে চলুন'],
            'lucky' => ['nums'=>'৩, ৭, ৯', 'colors'=>'লাল, সাদা', 'time'=>'সকাল ৯-১১টা', 'dir'=>'পূর্ব'],
            'gem' => ['পান্না', 'মুক্তা', 'পোখরাজ', 'নীলম'][$idx % 4],
            'gocharEffect' => $isMoon ? "চন্দ্র আপনার রাশিতে গোচর করছে" : "চন্দ্র $moonRashi রাশিতে",
            'caution' => ['অপ্রয়োজনীয় ঝুঁকি নেবেন না', 'কথায় সংযম রাখুন'],
            'spiritual' => 'ধ্যান ও প্রার্থনার জন্য উত্তম সময়'
        ];
    }
    return $data;
}

function updateSitemap($today) {
    $sitemap = __DIR__ . '/../sitemap-rashifal.xml';
    $files = glob(__DIR__ . '/*.html');
    $urls = [];
    foreach($files as $f) {
        if(preg_match('/(\d{4}-\d{2}-\d{2})\.html/', $f, $m)) {
            $urls[] = $m[1];
        }
    }
    rsort($urls);
    
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach($urls as $date) {
        $xml .= '<url>' . "\n";
        $xml .= '<loc>https://www.myastrology.in/rashifal/' . $date . '.html</loc>' . "\n";
        $xml .= '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
        $xml .= '<changefreq>daily</changefreq>' . "\n";
        $xml .= '<priority>0.8</priority>' . "\n";
        $xml .= '</url>' . "\n";
    }
    $xml .= '</urlset>';
    file_put_contents($sitemap, $xml);
    echo "Sitemap updated: $sitemap\n";
}

function updateRSSFeed($today, $bnDate, $moonRashi) {
    $rssFile = __DIR__ . '/rss.xml';
    $items = [];
    
    // Get recent 20 files
    $files = glob(__DIR__ . '/*.html');
    $dates = [];
    foreach($files as $f) {
        if(preg_match('/(\d{4}-\d{2}-\d{2})\.html/', $f, $m)) {
            $dates[] = $m[1];
        }
    }
    rsort($dates);
    $recent = array_slice($dates, 0, 20);
    
    foreach($recent as $date) {
        $items[] = [
            'date' => $date,
            'title' => "$date দৈনিক রাশিফল",
            'link' => "https://www.myastrology.in/rashifal/$date.html",
            'desc' => "$date তারিখের রাশিফল — ১২ রাশির বিস্তারিত ফল"
        ];
    }
    
    $rss = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $rss .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">' . "\n";
    $rss .= '<channel>' . "\n";
    $rss .= '<title>MyAstrology - দৈনিক রাশিফল</title>' . "\n";
    $rss .= '<link>https://www.myastrology.in/rashifal/</link>' . "\n";
    $rss .= '<description>ড. প্রদ্যুৎ আচার্যের বৈদিক জ্যোতিষভিত্তিক দৈনিক রাশিফল</description>' . "\n";
    $rss .= '<language>bn-in</language>' . "\n";
    $rss .= '<atom:link href="https://www.myastrology.in/rashifal/rss.xml" rel="self" type="application/rss+xml" />' . "\n";
    
    foreach($items as $item) {
        $rss .= '<item>' . "\n";
        $rss .= '<title>' . htmlspecialchars($item['title']) . '</title>' . "\n";
        $rss .= '<link>' . htmlspecialchars($item['link']) . '</link>' . "\n";
        $rss .= '<description>' . htmlspecialchars($item['desc']) . '</description>' . "\n";
        $rss .= '<pubDate>' . date('D, d M Y 00:00:00 +0530', strtotime($item['date'])) . '</pubDate>' . "\n";
        $rss .= '<guid>' . htmlspecialchars($item['link']) . '</guid>' . "\n";
        $rss .= '</item>' . "\n";
    }
    
    $rss .= '</channel></rss>';
    file_put_contents($rssFile, $rss);
    echo "RSS Feed updated: $rssFile\n";
}

function getEmbeddedTemplate() {
    return '<!DOCTYPE html><html><head><title>{{BN_DATE}} রাশিফল</title></head><body><h1>{{BN_DATE}} দৈনিক রাশিফল</h1><div id="app"></div><script>var data=' . '{{RASHIFAL_DATA_JSON}}' . ';console.log(data);</script></body></html>';
}

echo "\n✅ Generation completed successfully!\n";
?>
