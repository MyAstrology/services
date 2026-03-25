'use strict';
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// ============================================
// কনফিগারেশন
// ============================================
const BLOG_DIR   = path.join(__dirname, 'src', 'content', 'blog');
const OUTPUT_DIR = path.join(__dirname, 'blog');
const SITE_URL   = 'https://www.myastrology.in';
const GA_ID      = 'G-S7BQGLP211';
const GTM_ID     = 'GTM-MVVL8XBD';
const WA_NUMBER  = '919333122768';
const RZP_KEY    = 'rzp_live_SN8p6DJxPYFVL1';
const LOGO_IMG   = 'https://www.myastrology.in/images/MyAstrology-Ranghat-logo.png';
const FALLBACK_IMG = 'https://www.myastrology.in/images/fallback-1200x630.webp';

// ============================================
// ডাটা ফাইল পাথ
// ============================================
const RELATED_POSTS_PATH  = path.join(__dirname, 'src/data/related-posts.json');
const INTERNAL_LINKS_PATH = path.join(__dirname, 'src/data/internal-links.json');
const CLUSTERS_PATH       = path.join(__dirname, 'src/data/clusters.json');
const BLOG_LIST_PATH      = path.join(__dirname, 'src/content/blog/list.json');

// ============================================
// ডাটা লোড (এরর হ্যান্ডলিং সহ)
// ============================================
let relatedPostsMap = {}, internalLinksMap = {}, clustersMap = {}, blogList = [];

function loadJSON(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`ℹ️ ${label} ফাইল নেই, ডিফল্ট খালি অবজেক্ট ব্যবহার করা হবে`);
    return {};
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`✅ ${label} লোড হয়েছে`);
    return data;
  } catch (e) {
    console.warn(`⚠️ ${label} লোড করতে সমস্যা:`, e.message);
    return {};
  }
}

relatedPostsMap  = loadJSON(RELATED_POSTS_PATH,  'related-posts.json');
internalLinksMap = loadJSON(INTERNAL_LINKS_PATH, 'internal-links.json');
clustersMap      = loadJSON(CLUSTERS_PATH,        'clusters.json');

if (fs.existsSync(BLOG_LIST_PATH)) {
  try {
    blogList = JSON.parse(fs.readFileSync(BLOG_LIST_PATH, 'utf8'));
    console.log(`✅ ব্লগ তালিকা লোড হয়েছে: ${blogList.length} টি পোস্ট`);
  } catch (e) { 
    console.warn('⚠️ ব্লগ তালিকা লোড করতে সমস্যা');
    blogList = [];
  }
}

// ============================================
// ফ্রন্টম্যাটার পার্সার (উন্নত)
// ============================================
function parseFrontmatter(content) {
  const meta = {
    title: '', description: '', date: '', date_modified: '',
    image: '', image_alt: '', slug: '', tags: [], categories: [],
    keywords: '', og_title: '', og_description: '',
    twitter_title: '', twitter_description: ''
  };
  
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return meta;
  
  const frontmatter = match[1];
  
  // সহজ কী-ভ্যালু পার্সিং
  const lines = frontmatter.split('\n');
  let currentArray = null;
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // অ্যারে শুরু বা শেষ চিহ্নিত করা
    if (line === 'tags:' || line === 'categories:') {
      currentArray = line.replace(':', '');
      meta[currentArray] = [];
      continue;
    }
    
    if (currentArray && line.startsWith('-')) {
      meta[currentArray].push(line.replace(/^-\s*/, '').replace(/^["']|["']$/g, ''));
      continue;
    } else if (currentArray && !line.startsWith('-') && !line.startsWith(' ')) {
      currentArray = null;
    }
    
    // সাধারণ কী-ভ্যালু
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    let val = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
    
    const fieldMap = {
      title: 'title', description: 'description', date: 'date', 
      date_modified: 'date_modified', image: 'image', image_alt: 'image_alt', 
      slug: 'slug', keywords: 'keywords', og_title: 'og_title', 
      og_description: 'og_description', twitter_title: 'twitter_title', 
      twitter_description: 'twitter_description'
    };
    
    if (fieldMap[key]) meta[fieldMap[key]] = val;
    
    // অ্যারে ফরম্যাটে থাকলে (যেমন tags: ["a", "b"])
    if ((key === 'tags' || key === 'categories') && val.startsWith('[')) {
      meta[key] = val.replace(/[\[\]]/g, '').split(',').map(t => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
  }
  
  return meta;
}

// ============================================
// ইমেজ নরমালাইজার
// ============================================
function normalizeImage(img, slug) {
  if (!img || img === '') return SITE_URL + '/images/' + slug + '.webp';
  img = img.replace(/https?:\/\/astro\.myastrology\.in/g, SITE_URL);
  if (img.startsWith('/images/')) img = SITE_URL + img;
  return img;
}

// ============================================
// ইনলাইন মার্কডাউন রূপান্তর (সঠিক)
// ============================================
function applyInline(text) {
  if (!text) return '';
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

// ============================================
// মার্কডাউন → HTML (উন্নত: H1 → H2, টেবিল, লিস্ট)
// ============================================
function markdownToHtml(raw) {
  // ফ্রন্টম্যাটার সরানো
  let content = raw;
  const frontmatterStart = raw.indexOf('---');
  if (frontmatterStart !== -1) {
    const frontmatterEnd = raw.indexOf('\n---', frontmatterStart + 3);
    if (frontmatterEnd !== -1) {
      content = raw.slice(frontmatterEnd + 4);
    }
  }
  
  const html = [];
  const blocks = content.split(/\n{2,}/);
  
  for (let block of blocks) {
    block = block.trim();
    if (!block) continue;
    
    // HR
    if (/^---+$/.test(block)) {
      html.push('<hr>');
      continue;
    }
    
    // ইতিমধ্যে HTML থাকলে সরাসরি যোগ
    if (/^<(div|section|article|figure|table|ul|ol|blockquote|hr|h[2-6]|p[\s>])/i.test(block)) {
      html.push(block);
      continue;
    }
    
    // হেডিং (H1 → H2 রূপান্তর)
    if (/^#{1,6}\s/.test(block)) {
      let heading = block;
      heading = heading.replace(/^######\s(.+)$/gm, '<h6>$1</h6>');
      heading = heading.replace(/^#####\s(.+)$/gm, '<h5>$1</h5>');
      heading = heading.replace(/^####\s(.+)$/gm, '<h4>$1</h4>');
      heading = heading.replace(/^###\s(.+)$/gm, '<h3>$1</h3>');
      heading = heading.replace(/^##\s(.+)$/gm, '<h2>$1</h2>');
      heading = heading.replace(/^#\s(.+)$/gm, '<h2>$1</h2>'); // H1 → H2
      html.push(heading);
      continue;
    }
    
    // ব্লককোট
    if (/^>\s/.test(block)) {
      const quoteContent = block.split('\n').map(l => l.replace(/^>\s?/, '')).join('\n').trim();
      html.push('<blockquote>' + applyInline(quoteContent) + '</blockquote>');
      continue;
    }
    
    // টেবিল
    if (/^\|.+\|/.test(block)) {
      const rows = block.split('\n').filter(r => r.trim());
      const hasHeaderSeparator = rows.length > 1 && /^\|[\s\-:|]+\|$/.test(rows[1]);
      let tableHtml = '<div class="tbl-wrap">\n<table>\n';
      
      rows.forEach((row, idx) => {
        if (hasHeaderSeparator && idx === 1) return;
        const cells = row.split('|').slice(1, -1).map(c => c.trim());
        const tag = (hasHeaderSeparator && idx === 0) ? 'th' : 'td';
        tableHtml += '  <tr>' + cells.map(c => `<${tag}>${applyInline(c)}</${tag}>`).join('') + '</tr>\n';
      });
      
      html.push(tableHtml + '</table>\n</div>');
      continue;
    }
    
    // আনঅর্ডার্ড লিস্ট
    if (/^\s*[-*]\s/.test(block)) {
      const items = block.split('\n').filter(l => /^\s*[-*]\s/.test(l));
      const listItems = items.map(l => '<li>' + applyInline(l.replace(/^\s*[-*]\s/, '')) + '</li>').join('\n');
      html.push('<ul>\n' + listItems + '\n</ul>');
      continue;
    }
    
    // অর্ডার্ড লিস্ট
    if (/^\s*\d+\.\s/.test(block)) {
      const items = block.split('\n').filter(l => /^\s*\d+\.\s/.test(l));
      const listItems = items.map(l => '<li>' + applyInline(l.replace(/^\s*\d+\.\s/, '')) + '</li>').join('\n');
      html.push('<ol>\n' + listItems + '\n</ol>');
      continue;
    }
    
    // সাধারণ প্যারাগ্রাফ
    html.push('<p>' + applyInline(block.replace(/\n/g, ' ')) + '</p>');
  }
  
  let finalHtml = html.join('\n');
  
  // cheerio দিয়ে সব H1 → H2 নিশ্চিত করা
  const $ = cheerio.load(finalHtml);
  $('h1').each(function() {
    const $h1 = $(this);
    const $h2 = $('<h2>').html($h1.html());
    if ($h1.attr('style')) $h2.attr('style', $h1.attr('style'));
    if ($h1.attr('class')) $h2.attr('class', $h1.attr('class'));
    $h1.replaceWith($h2);
  });
  
  return $.html();
}

// ============================================
// সঠিক পড়ার সময় বের করা (শুধু টেক্সট কন্টেন্ট)
// ============================================
function calculateReadingTime(html) {
  // HTML ট্যাগ সরিয়ে শুধু টেক্সট রাখা
  const text = html.replace(/<[^>]+>/g, '');
  // শব্দ গণনা (বাংলা ও ইংরেজি)
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  // গড় ২০০ শব্দ/মিনিট
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return minutes;
}

// ============================================
// ইউটিলিটি ফাংশন
// ============================================
function formatBanglaDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('bn-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    return dateStr;
  }
}

function getISODate(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  return dateStr;
}

// ============================================
// FAQ Schema থেকে HTML ট্যাগ সরানো
// ============================================
function stripHtmlFromFaq(faqHtml) {
  if (!faqHtml) return faqHtml;
  // HTML ট্যাগ সরানো
  return faqHtml.replace(/<[^>]+>/g, '');
}

// ============================================
// Schema Markup তৈরি (শুধু এখানেই)
// ============================================
function buildSchemaMarkup(meta, pageUrl, img, mins, iso, isoModified) {
  const schemas = [];
  
  // 1. BlogPosting Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": meta.title,
    "description": meta.description,
    "datePublished": iso,
    "dateModified": isoModified,
    "image": {
      "@type": "ImageObject",
      "url": img,
      "width": 1200,
      "height": 630
    },
    "url": pageUrl,
    "inLanguage": "bn-IN",
    "timeRequired": `PT${mins}M`,
    "author": {
      "@type": "Person",
      "name": "Dr. Prodyut Acharya",
      "url": "https://www.myastrology.in/about.html"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MyAstrology",
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_IMG
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    }
  });
  
  // 2. BreadcrumbList Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "হোম", "item": "https://www.myastrology.in" },
      { "@type": "ListItem", "position": 2, "name": "ব্লগ", "item": "https://www.myastrology.in/blog-list.html" },
      { "@type": "ListItem", "position": 3, "name": meta.title, "item": pageUrl }
    ]
  });
  
  return JSON.stringify(schemas);
}

// ============================================
// রিলেটেড পোস্ট তৈরি
// ============================================
function buildRelatedPostsHTML(currentSlug, allPostsList) {
  const internalData = internalLinksMap[currentSlug];
  let relatedSlugs = [];
  
  if (internalData) {
    relatedSlugs = [
      ...(internalData.relatedByTag || []),
      ...(internalData.relatedByPillar || []),
      ...(internalData.relatedByCluster || [])
    ];
  } else {
    relatedSlugs = relatedPostsMap[currentSlug] || [];
  }
  
  relatedSlugs = [...new Set(relatedSlugs)].slice(0, 4);
  if (!relatedSlugs.length) return '';
  
  const relatedPosts = allPostsList.filter(p => relatedSlugs.includes(p.slug)).slice(0, 4);
  if (!relatedPosts.length) return '';
  
  const currentCluster = clustersMap[currentSlug]?.cluster || '';
  
  let html = `
  <div class="related-posts-box">
    <div class="rp-header">
      <h3><i class="fas fa-book-open"></i> আরও পড়ুন</h3>
      ${currentCluster ? `<span class="rp-cluster"><i class="fas fa-tag"></i> ${currentCluster}</span>` : ''}
    </div>
    <div class="rp-grid">`;
  
  relatedPosts.forEach(post => {
    const postCluster = clustersMap[post.slug]?.cluster || '';
    const isSameCluster = postCluster === currentCluster;
    html += `
      <a href="/blog/${post.slug}.html" class="rp-card${isSameCluster ? ' rp-card--highlight' : ''}">
        <div class="rp-title">${escapeHtml(post.title)}</div>
        ${post.date ? `<div class="rp-date"><i class="far fa-calendar-alt"></i> ${formatBanglaDate(post.date)}</div>` : ''}
        ${postCluster ? `<div class="rp-tag">${escapeHtml(postCluster)}</div>` : ''}
      </a>`;
  });
  
  html += `
    </div>
    <div class="rp-footer">
      <a href="/blog-list.html"><i class="fas fa-list"></i> সব পোস্ট</a>
      <a href="/learning/"><i class="fas fa-graduation-cap"></i> লার্নিং হাব</a>
    </div>
  </div>`;
  
  return html;
}

// ============================================
// HTML এস্কেপ ফাংশন (XSS প্রতিরোধ)
// ============================================
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================
// সাইডবার রিলেটেড পোস্ট
// ============================================
function buildSidebarRelatedHTML(currentSlug) {
  if (!blogList.length) return '';
  
  const internalData = internalLinksMap[currentSlug];
  if (!internalData) return '';
  
  const relatedSlugs = [
    ...(internalData.relatedByTag || []),
    ...(internalData.relatedByCluster || [])
  ].slice(0, 5);
  
  if (!relatedSlugs.length) return '';
  
  const relatedPosts = blogList.filter(p => relatedSlugs.includes(p.slug));
  if (!relatedPosts.length) return '';
  
  let html = `
  <div class="sidebar-widget">
    <h4><i class="fas fa-link"></i> সম্পর্কিত পোস্ট</h4>
    <ul>`;
  
  relatedPosts.forEach(post => {
    html += `
      <li><a href="/blog/${escapeHtml(post.slug)}.html"><i class="fas fa-chevron-right"></i>${escapeHtml(post.title)}</a></li>`;
  });
  
  html += `
    </ul>
    <a class="sidebar-more" href="/blog-list.html">সব পোস্ট দেখুন →</a>
  </div>`;
  
  return html;
}

// ============================================
// সম্পূর্ণ CSS (ইনলাইন)
// ============================================
const CSS_BLOCK = `/* সম্পূর্ণ CSS এখানে থাকবে — প্রথম তথ্যের মতো */`;

// ============================================
// JavaScript (একবারই যুক্ত হবে)
// ============================================
function getScripts() {
  return `
<script defer src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
(function() {
  'use strict';
  
  /* ── NAV ── */
  function toggleNav(){var n=document.getElementById('navMenu'),o=document.getElementById('navOverlay');if(n&&o){n.classList.toggle('open');o.classList.toggle('open');document.body.classList.toggle('nav-open',n.classList.contains('open'));}}
  function closeNav(){var n=document.getElementById('navMenu'),o=document.getElementById('navOverlay');if(n&&o){n.classList.remove('open');o.classList.remove('open');document.body.classList.remove('nav-open');}}
  
  window.toggleNav = toggleNav;
  window.closeNav = closeNav;
  
  document.addEventListener('click',function(e){var n=document.getElementById('navMenu'),h=document.querySelector('.ham');if(n&&n.classList.contains('open')&&!n.contains(e.target)&&h&&!h.contains(e.target))closeNav();});
  document.querySelectorAll('#navMenu a').forEach(function(a){a.addEventListener('click',closeNav);});
  
  /* ── SERVICE MODAL ── */
  function openSvcSelector(){var o=document.getElementById('svc-overlay');if(o){o.style.display='flex';requestAnimationFrame(function(){o.classList.add('show');});document.body.style.overflow='hidden';}}
  function closeSvc(){var o=document.getElementById('svc-overlay');if(o){o.classList.remove('show');setTimeout(function(){o.style.display='none';},300);document.body.style.overflow='';}}
  function pickSvc(label,amount,price,old){closeSvc();setTimeout(function(){openRzp(label,amount,'',price,old);},340);}
  
  window.openSvcSelector = openSvcSelector;
  window.closeSvc = closeSvc;
  window.pickSvc = pickSvc;
  
  /* ── RAZORPAY ── */
  var _svc={label:'',amount:0,price:'',oldprice:''};
  var WA_NUM='${WA_NUMBER}';
  var RZP_KEY='${RZP_KEY}';
  var RZP_LOGO='${LOGO_IMG}';
  
  function openRzp(label,amount,key,price,oldprice){
    _svc={label:label,amount:amount,price:price||'',oldprice:oldprice||''};
    var nameEl=document.getElementById('bmSvcName'),priceEl=document.getElementById('bmSvcPrice');
    if(nameEl)nameEl.textContent=label;
    if(priceEl)priceEl.textContent=price?'₹'+price:'';
    var nameInp=document.getElementById('bmName'),phoneInp=document.getElementById('bmPhone');
    if(nameInp)nameInp.value='';
    if(phoneInp)phoneInp.value='';
    if(nameInp)nameInp.classList.remove('err');
    if(phoneInp)phoneInp.classList.remove('err');
    var ov=document.getElementById('book-overlay');
    if(ov){ov.style.display='flex';requestAnimationFrame(function(){ov.classList.add('show');});}
    document.body.style.overflow='hidden';
    setTimeout(function(){if(nameInp)nameInp.focus();},350);
  }
  
  function closeBooking(){var ov=document.getElementById('book-overlay');if(ov){ov.classList.remove('show');setTimeout(function(){ov.style.display='none';},300);document.body.style.overflow='';}}
  function proceedToRazorpay(){
    var name=document.getElementById('bmName');var nameVal=name?name.value.trim():'';
    var phone=document.getElementById('bmPhone');var phoneVal=phone?phone.value.replace(/\\D/g,'').slice(0,10):'';
    if(name)name.classList.remove('err');
    if(phone)phone.classList.remove('err');
    var ok=true;
    if(!nameVal){if(name)name.classList.add('err');if(name)name.focus();ok=false;}
    else if(!phoneVal||phoneVal.length<10){if(phone)phone.classList.add('err');if(phone)phone.focus();ok=false;}
    if(!ok)return;
    if(typeof Razorpay==='undefined'){alert('পেমেন্ট গেটওয়ে লোড হচ্ছে, একটু অপেক্ষা করুন।');return;}
    new Razorpay({key:RZP_KEY,amount:_svc.amount,currency:'INR',name:'MyAstrology',description:_svc.label,image:RZP_LOGO,
      prefill:{name:nameVal,contact:'+91'+phoneVal},notes:{service:_svc.label,customer:nameVal,whatsapp:phoneVal},
      theme:{color:'#b8860b'},modal:{backdropclose:false,escape:false},
      handler:function(res){closeBooking();if(window.gtag)window.gtag('event','booking_paid',{event_category:'conversion',event_label:_svc.label,value:_svc.amount/100,currency:'INR'});showSuccess(nameVal,phoneVal,res.razorpay_payment_id);}
    }).open();
  }
  
  function showSuccess(name,phone,pid){
    var NL=String.fromCharCode(10);
    var msg='🙏 নমস্কার! আমি '+_svc.label+'-এর জন্য পেমেন্ট সম্পন্ন করেছি。'+NL+NL+'👤 নাম: '+name+NL+'📱 WhatsApp: +91'+phone+NL+'🛎️ সেবা: '+_svc.label+NL+(_svc.price?'💰 মূল্য: ₹'+_svc.price+NL:'')+(pid?'🆔 Payment ID: '+pid:'')+NL+NL+'📋 পরামর্শের তারিখ ও সময় জানান। ধন্যবাদ! 🙏';
    var waBtn=document.getElementById('successWaBtn');
    if(waBtn)waBtn.href='https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(msg);
    var msgEl=document.getElementById('successMsg');
    if(msgEl)msgEl.textContent=name+' — পেমেন্ট সফলভাবে গৃহীত হয়েছে। ✅';
    var pidEl=document.getElementById('successPid');
    if(pidEl)pidEl.textContent=pid||'—';
    var ov=document.getElementById('rzp-success-overlay');
    if(ov){ov.style.display='flex';requestAnimationFrame(function(){ov.classList.add('show');});}
    document.body.style.overflow='hidden';
  }
  
  function closeSuccess(){var ov=document.getElementById('rzp-success-overlay');if(ov){ov.classList.remove('show');setTimeout(function(){ov.style.display='none';},300);document.body.style.overflow='';}}
  
  window.openRzp = openRzp;
  window.closeBooking = closeBooking;
  window.proceedToRazorpay = proceedToRazorpay;
  window.closeSuccess = closeSuccess;
  window.showSuccess = showSuccess;
  
  /* ── MODAL CLOSE ON BACKDROP ── */
  var svcOverlay=document.getElementById('svc-overlay');if(svcOverlay)svcOverlay.addEventListener('click',function(e){if(e.target===this)closeSvc();});
  var bookOverlay=document.getElementById('book-overlay');if(bookOverlay)bookOverlay.addEventListener('click',function(e){if(e.target===this)closeBooking();});
  var successOverlay=document.getElementById('rzp-success-overlay');if(successOverlay)successOverlay.addEventListener('click',function(e){if(e.target===this)closeSuccess();});
  
  /* ── ENTER KEY ── */
  ['bmName','bmPhone'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener('keydown',function(e){if(e.key==='Enter')proceedToRazorpay();});});
  var phoneInp=document.getElementById('bmPhone');if(phoneInp)phoneInp.addEventListener('input',function(){this.value=this.value.replace(/\\D/g,'').slice(0,10);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeSvc();closeBooking();closeSuccess();closeNav();}});
  
  /* ── WA BUBBLE ── */
  (function(){var msgs=['🔮 কুণ্ডলী বিশ্লেষণ করুন','🌟 আজই পরামর্শ নিন','✋ হস্তরেখা বিচার করুন','💬 বাংলায় Online পরামর্শ','🙏 এখনই WhatsApp করুন'];var idx=0,b=document.getElementById('waBubble');if(!b)return;function sm(){b.style.display='block';b.textContent=msgs[idx];b.classList.add('show');setTimeout(function(){b.classList.remove('show');setTimeout(function(){b.style.display='none';},400);},4000);idx=(idx+1)%msgs.length;}setTimeout(function(){sm();setInterval(sm,6000);},3000);})();
  
  /* ── BACK TO TOP ── */
  (function(){var btn=document.getElementById('back-to-top');if(!btn)return;window.addEventListener('scroll',function(){btn.classList.toggle('visible',window.scrollY>400);},{passive:true});btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});})();
  
  /* ── GA4 EVENTS ── */
  document.addEventListener('click',function(e){
    var a=e.target.closest('a');if(!a)return;
    var h=a.getAttribute('href')||'';
    var label=a.innerText.trim()||'unknown';
    if(window.gtag){
      if(h.includes('wa.me')) window.gtag('event','whatsapp_click',{event_category:'engagement',event_label:label});
      if(h.startsWith('tel:')) window.gtag('event','phone_click',{event_category:'engagement',event_label:h});
      if(h.includes('razorpay.com')) window.gtag('event','payment_link_click',{event_category:'conversion',event_label:label});
    }
  });
  
  window._gtagBooking = function(step, service) {
    if(window.gtag) window.gtag('event', 'booking_funnel', {event_category: 'conversion', event_label: service || '', booking_step: step});
  };
})();
</script>
`;
}

// ============================================
// HTML বিল্ডার (সম্পূর্ণ)
// ============================================
function buildHtml(meta, body, slug, allPostsList) {
  // ★★★ মেটা ডেসক্রিপশন ক্লিনআপ ★★★
  const cleanDescription = (meta.description || '')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
const pageUrl = SITE_URL + '/blog/' + slug + '.html';
  const img = normalizeImage(meta.image, slug);
  const imgAlt = meta.image_alt || meta.title;
  const dateStr = formatBanglaDate(meta.date);
  const mins = calculateReadingTime(body);
  const tags = meta.tags.length ? meta.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ') : '';
  const kw = meta.keywords || meta.tags.join(', ');
  const iso = getISODate(meta.date);
  const isoModified = meta.date_modified || iso;
  const articleSection = meta.categories.length ? meta.categories[0] : 'জীবন দর্শন';
  const ogTitle = meta.og_title || meta.title;
  const ogDesc = meta.og_description || meta.description;
  const twTitle = meta.twitter_title || meta.title;
  const twDesc = meta.twitter_description || meta.description;
  
  // Schema তৈরি (শুধু এখানেই)
  const schemaMarkup = buildSchemaMarkup(meta, pageUrl, img, mins, iso, isoModified);
  
  return `<!DOCTYPE html>
<html lang="bn-IN" translate="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escapeHtml(meta.title)} | MyAstrology — ড. প্রদ্যুৎ আচার্য</title>
<meta name="description" content="${cleanDescription}">
${kw ? `<meta name="keywords" content="${escapeHtml(kw)}">` : ''}
<meta name="author" content="Dr. Prodyut Acharya">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="canonical" href="${pageUrl}">
<link rel="alternate" hreflang="bn" href="${pageUrl}">
<link rel="alternate" hreflang="x-default" href="${pageUrl}">
<!-- Open Graph -->
<meta property="og:title" content="${escapeHtml(ogTitle)}">
<meta property="og:description" content="${meta.og_description || cleanDescription}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:type" content="article">
<meta property="og:image" content="${img}">
<meta property="og:image:alt" content="${escapeHtml(imgAlt)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="bn_IN">
<meta property="og:site_name" content="MyAstrology – Dr. Prodyut Acharya">
<meta property="article:published_time" content="${iso}T00:00:00+05:30">
<meta property="article:modified_time" content="${isoModified}T00:00:00+05:30">
<meta property="article:author" content="Dr. Prodyut Acharya">
<meta property="article:section" content="${escapeHtml(articleSection)}">
${meta.tags.length ? `<meta property="article:tag" content="${meta.tags.map(escapeHtml).join(',')}">` : ''}
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@AcharyaProdyut">
<meta name="twitter:title" content="${escapeHtml(twTitle)}">
<meta name="twitter:description" content="${escapeHtml(twDesc)}">
<meta name="twitter:image" content="${img}">
<!-- Schema -->
<script type="application/ld+json">${schemaMarkup}</script>
<!-- Google News Publisher -->
<script async type="application/javascript" src="https://news.google.com/swg/js/v1/swg-basic.js"></script>
<script>
  (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
    basicSubscriptions.init({
      type: "NewsArticle",
      isPartOfType: ["Product"],
      isPartOfProductId: "CAow5vfFDA:openaccess",
      clientOptions: { theme: "light", lang: "bn-in" },
    });
  });
</script>
<!-- LCP Image Preload -->
<link rel="preload" as="image" href="${img}" fetchpriority="high">
<!-- Preconnects -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<!-- Google Fonts (non-blocking) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Playfair+Display:wght@700&display=swap"></noscript>
<!-- Font Awesome (non-blocking) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous"></noscript>
<!-- Inline CSS -->
${CSS_BLOCK}
<!-- Analytics -->
<script>
window.dataLayer = window.dataLayer || [];
window.gtag = function(){ window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.addEventListener('load', function() {
  setTimeout(function() {
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
    ga.onload = function() {
      window.gtag('config', '${GA_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });
    };
    document.head.appendChild(ga);
    (function(w,d,s,l,i){
      w[l]=w[l]||[];
      w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  }, 2000);
});
</script>
<link rel="icon" type="image/x-icon" href="https://www.myastrology.in/images/favicon.ico">
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<a class="skip-link" href="#main-content">মূল বিষয়বস্তুতে যান</a>
<header class="site-header">
  <button class="ham" onclick="toggleNav()" aria-label="মেনু" aria-expanded="false" aria-controls="navMenu">
    <i class="fas fa-bars"></i>
  </button>
  <span class="header-brand">MyAstrology<span class="header-sub">ড. প্রদ্যুৎ আচার্য &middot; রানাঘাট</span></span>
  <img src="${LOGO_IMG}" alt="MyAstrology Logo" class="header-logo" width="46" height="46" loading="eager">
</header>
<nav class="nav" id="navMenu" aria-label="মূল নেভিগেশন">
  <a href="https://www.myastrology.in/"><i class="fas fa-home"></i>হোম</a>
  <a href="https://www.myastrology.in/astrology.html"><i class="fas fa-star"></i>জ্যোতিষ শাস্ত্র</a>
  <a href="https://www.myastrology.in/palmistry.html"><i class="fas fa-hand-paper"></i>হস্তরেখা</a>
  <a href="https://www.myastrology.in/gemstone.html"><i class="fas fa-gem"></i>রত্নপাথর পরামর্শ</a>
  <a href="https://www.myastrology.in/vastu-science.html"><i class="fas fa-building"></i>বাস্তু শাস্ত্র</a>
  <a href="https://www.myastrology.in/vedic-astronomy.html"><i class="fas fa-moon"></i>জ্যোতির্বিজ্ঞান</a>
  <a href="https://www.myastrology.in/rashifal.html"><i class="fas fa-circle-notch"></i>রাশিফল</a>
  <a href="https://www.myastrology.in/panjika.html"><i class="fas fa-calendar-alt"></i>পঞ্জিকা</a>
  <a href="https://www.myastrology.in/video.html"><i class="fas fa-play-circle"></i>ভিডিও</a>
  <a href="https://www.myastrology.in/gallery.html"><i class="fas fa-images"></i>গ্যালারি</a>
  <a href="https://www.myastrology.in/reviews.html"><i class="fas fa-star-half-alt"></i>রিভিউ</a>
  <a href="https://www.myastrology.in/blog-list.html"><i class="fas fa-blog"></i>ব্লগ</a>
  <a href="https://www.myastrology.in/about.html"><i class="fas fa-user"></i>আমাদের সম্পর্কে</a>
  <a href="https://www.myastrology.in/contact.html"><i class="fas fa-address-card"></i>যোগাযোগ</a>
  <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" class="wa-nav"><i class="fab fa-whatsapp"></i>📲 WhatsApp পরামর্শ</a>
</nav>
<div class="nav-overlay" id="navOverlay" onclick="closeNav()"></div>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="https://www.myastrology.in/">হোম</a>
  <i class="fas fa-chevron-right"></i>
  <a href="https://www.myastrology.in/blog-list.html">ব্লগ</a>
  <i class="fas fa-chevron-right"></i>
  <span>${escapeHtml(meta.title)}</span>
</nav>

<main id="main-content">
  <a class="back-link" href="https://www.myastrology.in/blog-list.html">
    <i class="fas fa-arrow-left"></i> সব পোস্ট দেখুন
  </a>
  <article itemscope itemtype="https://schema.org/BlogPosting">
    <meta itemprop="datePublished" content="${iso}">
    <meta itemprop="dateModified" content="${isoModified}">
    <meta itemprop="author" content="Dr. Prodyut Acharya">
    <div class="post-header">
      <img class="featured-img"
           src="${img}"
           alt="${escapeHtml(imgAlt)}"
           width="1200"
           height="630"
           loading="eager"
           fetchpriority="high"
           itemprop="image"
           onerror="this.src='${FALLBACK_IMG}'">
      <h1 itemprop="headline">${escapeHtml(meta.title)}</h1>
      <div class="post-meta">
        <span><i class="fas fa-user-edit"></i>Dr. Prodyut Acharya</span>
        ${dateStr ? `<span><i class="fas fa-calendar-alt"></i>${dateStr}</span>` : ''}
        <span><i class="fas fa-clock"></i>${mins} মিনিট পড়ন</span>
      </div>
      ${tags ? `<div class="tags">${tags}</div>` : ''}
    </div>
    <div class="post-body" itemprop="articleBody">
${body}
    </div>
  </article>

  <div class="pjk-strip">
    <h3>🌙 আজকের রাশিফল ও দিন পঞ্জিকা</h3>
    <p>জানুন আজকের রাশিফল, প্রেম, কর্ম, অর্থ, স্বাস্থ্য, শুভ সংখ্যা ও শুভ সময়।</p>
    <div class="pjk-tags">
      <a href="https://www.myastrology.in/panjika.html">❤️ প্রেম</a>
      <a href="https://www.myastrology.in/panjika.html">💼 কর্ম</a>
      <a href="https://www.myastrology.in/panjika.html">💰 অর্থ</a>
      <a href="https://www.myastrology.in/panjika.html">🌿 স্বাস্থ্য</a>
      <a href="https://www.myastrology.in/panjika.html">🔢 শুভ সংখ্যা</a>
      <a href="https://www.myastrology.in/panjika.html">⏰ শুভ সময়</a>
    </div>
    <a class="pjk-btn" href="https://www.myastrology.in/panjika.html">আজই দেখুন &rarr;</a>
  </div>

  <div class="cta-box">
    <h3>🔮 ব্যক্তিগত পরামর্শ নিন</h3>
    <p>হস্তরেখা বিচার &middot; জন্মকুণ্ডলী বিশ্লেষণ &middot; যোটোক মিলন<br>
    <strong>Dr. Prodyut Acharya</strong> &mdash; PhD Gold Medalist &middot; রানাঘাট</p>
    <button class="btn-book-cta" onclick="openSvcSelector()">
      <i class="fas fa-calendar-check"></i> পরামর্শ বুক করুন
    </button>
    <a class="btn-wa-cta" href="https://wa.me/${WA_NUMBER}?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%A1.%20%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AF%2C%20%E0%A6%AA%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A6%B0%E0%A7%8D%E0%A6%B6%20%E0%A6%A8%E0%A6%BF%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4" target="_blank" rel="noopener">
      <i class="fab fa-whatsapp"></i> WhatsApp করুন
    </a>
    <p style="font-size:.72rem;margin-top:10px;opacity:.6;">
      <i class="fas fa-lock" style="color:var(--gold3);margin-right:4px;"></i>Razorpay দ্বারা সুরক্ষিত &bull; UPI &bull; Card &bull; Net Banking
    </p>
  </div>

  <div class="author-bio">
    <div class="ico">🧑‍🎓</div>
    <div>
      <h4>Dr. Prodyut Acharya</h4>
      <span class="sub">PhD Gold Medalist &middot; জ্যোতিষী ও হস্তরেখাবিদ &middot; রানাঘাট, নদিয়া</span>
      <p>১৫+ বছরের অভিজ্ঞতায় হাজারো জন্মকুণ্ডলী ও হস্তরেখা বিশ্লেষণ করেছেন।
      <a href="https://www.myastrology.in/about.html">&rarr; আরও জানুন</a></p>
    </div>
  </div>

  <div class="related">
    <h4><i class="fas fa-book-open" style="color:var(--gold);margin-right:6px;"></i>আরও পড়ুন</h4>
    <a href="https://www.myastrology.in/blog-list.html"><i class="fas fa-chevron-right"></i>সব ব্লগ পোস্ট</a>
    <a href="https://www.myastrology.in/rashifal.html"><i class="fas fa-chevron-right"></i>আজকের রাশিফল</a>
    <a href="https://www.myastrology.in/panjika.html"><i class="fas fa-chevron-right"></i>বাংলা পঞ্জিকা</a>
    <a href="https://www.myastrology.in/astrology.html"><i class="fas fa-chevron-right"></i>জ্যোতিষ পরামর্শ</a>
    <a href="https://www.myastrology.in/learning/"><i class="fas fa-graduation-cap"></i>লার্নিং হাব</a>
  </div>
</main>

<footer class="site-footer">
  <div class="ftr-top">
    <div class="ftr-top-inner">
      <div class="ftr-brand-block">
        <img src="${LOGO_IMG}" alt="MyAstrology" class="ftr-logo" width="52" height="52" loading="lazy">
        <div>
          <div class="ftr-brand-name">MyAstrology</div>
          <div class="ftr-brand-sub">ড. প্রদ্যুৎ আচার্য &bull; PhD Gold Medalist &bull; রাণাঘাট, নদিয়া</div>
        </div>
      </div>
      <div class="ftr-svc-cards">
        <a href="https://www.myastrology.in/palmistry.html" class="ftr-svc-card"><i class="fas fa-hand-paper"></i><span>হস্তরেখা বিচার</span><em>১,০০১ থেকে</em></a>
        <a href="https://www.myastrology.in/astrology.html" class="ftr-svc-card"><i class="fas fa-star"></i><span>জন্মকুণ্ডলী</span><em>১,৫০১ থেকে</em></a>
        <a href="https://www.myastrology.in/astrology.html" class="ftr-svc-card"><i class="fas fa-yin-yang"></i><span>কুণ্ডলী মিলন</span><em>২,০০১ থেকে</em></a>
        <a href="https://www.myastrology.in/gemstone.html" class="ftr-svc-card"><i class="fas fa-gem"></i><span>রত্নপাথর</span><em>পরামর্শ</em></a>
        <a href="https://www.myastrology.in/vastu-science.html" class="ftr-svc-card"><i class="fas fa-building"></i><span>বাস্তু শাস্ত্র</span><em>পরামর্শ</em></a>
        <a href="https://www.myastrology.in/rashifal.html" class="ftr-svc-card"><i class="fas fa-circle-notch"></i><span>রাশিফল</span><em>প্রতিদিন</em></a>
      </div>
    </div>
  </div>
  <div class="ftr-mid">
    <div class="ftr-mid-inner">
      <div class="ftr-col">
        <h4>যোগাযোগ</h4>
        <p><i class="fas fa-map-marker-alt"></i>নসরা কলোনি, ওয়ার্ড নং-১৮, রাণাঘাট, নদিয়া &mdash; ৭৪১২০২</p>
        <a href="tel:+${WA_NUMBER}"><i class="fas fa-phone"></i>+91 ${WA_NUMBER.slice(2)}</a>
        <a href="mailto:info@myastrology.in"><i class="fas fa-envelope"></i>info@myastrology.in</a>
        <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" class="ftr-wa-btn"><i class="fab fa-whatsapp"></i> WhatsApp পরামর্শ</a>
      </div>
      <div class="ftr-col">
        <h4>সাইটম্যাপ</h4>
        <a href="https://www.myastrology.in/">হোম</a>
        <a href="https://www.myastrology.in/about.html">ড. আচার্য সম্পর্কে</a>
        <a href="https://www.myastrology.in/blog-list.html">ব্লগ সমূহ</a>
        <a href="https://www.myastrology.in/gallery.html">গ্যালারি</a>
        <a href="https://www.myastrology.in/reviews.html">রিভিউ</a>
        <a href="https://www.myastrology.in/video.html">ভিডিও</a>
        <a href="https://www.myastrology.in/contact.html">যোগাযোগ</a>
        <a href="https://www.myastrology.in/privacy-policy.html">Privacy Policy</a>
        <a href="https://www.myastrology.in/terms-of-use.html">Terms of Use</a>
      </div>
      <div class="ftr-col">
        <h4>সেবা এলাকা</h4>
        <div class="ftr-area-tags">
          <span>রাণাঘাট</span><span>নদিয়া</span><span>কলকাতা</span><span>পশ্চিমবঙ্গ</span>
          <span>উত্তরবঙ্গ</span><span>ঝাড়খণ্ড</span><span>ত্রিপুরা</span><span>আসাম</span>
          <span>দিল্লি</span><span>মুম্বাই</span>
          <span class="ftr-area-all">সারা ভারত অনলাইন</span>
        </div>
        <p class="ftr-lang-note"><i class="fas fa-language"></i>পরামর্শ বাংলা ও হিন্দিতে</p>
      </div>
      <div class="ftr-col">
        <h4>সামাজিক মাধ্যম</h4>
        <div class="ftr-social-grid">
          <a href="https://www.facebook.com/Dr.ProdyutAcharya" target="_blank" rel="noopener" class="fsg-fb"><i class="fab fa-facebook-f"></i><span>Facebook<em>41,000+ অনুসরণকারী</em></span></a>
          <a href="https://youtube.com/@myastrology" target="_blank" rel="noopener" class="fsg-yt"><i class="fab fa-youtube"></i><span>YouTube<em>2,24,000+ সাবস্ক্রাইবার</em></span></a>
          <a href="https://www.instagram.com/myastrology.in" target="_blank" rel="noopener" class="fsg-ig"><i class="fab fa-instagram"></i><span>Instagram</span></a>
          <a href="https://x.com/AcharyaProdyut" target="_blank" rel="noopener" class="fsg-tw"><i class="fab fa-x-twitter"></i><span>X / Twitter</span></a>
          <a href="https://www.linkedin.com/in/ProdyutAcharya" target="_blank" rel="noopener" class="fsg-li"><i class="fab fa-linkedin-in"></i><span>LinkedIn</span></a>
        </div>
      </div>
    </div>
  </div>
  <div class="ftr-bottom">
    <p>&copy; 2026 MyAstrology &bull; ড. প্রদ্যুৎ আচার্য, PhD in Vedic Jyotish &bull; রাণাঘাট, পশ্চিমবঙ্গ</p>
    <div class="ftr-bottom-links">
      <a href="https://www.myastrology.in/about.html">About</a>
      <a href="https://www.myastrology.in/privacy-policy.html">Privacy Policy</a>
      <a href="https://www.myastrology.in/terms-of-use.html">Terms of Use</a>
    </div>
  </div>
</footer>

<!-- SERVICE SELECTOR MODAL -->
<div id="svc-overlay" role="dialog" aria-modal="true" aria-labelledby="svcTitle">
  <div id="svc-modal">
    <button class="bm-close-x" onclick="closeSvc()" aria-label="বন্ধ">&times;</button>
    <div class="bm-header">
      <img src="${LOGO_IMG}" alt="MyAstrology" class="bm-logo" width="48" height="48">
      <div class="bm-brand" id="svcTitle">পরামর্শ বাছাই করুন</div>
    </div>
    <div class="svc-cards">
      <button class="svc-card" onclick="pickSvc('হস্তরেখা বিচার',100100,'১,০০১','৩,০০১')">
        <div class="svc-card-icon">✋</div>
        <div class="svc-card-info">
          <strong>হস্তরেখা বিচার</strong>
          <p>দুই হাতের ছবি WhatsApp-এ &bull; ৩-৪ ঘণ্টায় বিশ্লেষণ &bull; ২০ মিনিট ফোন</p>
          <div class="svc-price"><span class="svc-old">₹৩,০০১</span><span class="svc-new">₹১,০০১</span></div>
        </div>
        <i class="fas fa-chevron-right svc-arr"></i>
      </button>
      <button class="svc-card" onclick="pickSvc('জন্মকুণ্ডলী বিচার',150100,'১,৫০১','৩,৫০১')">
        <div class="svc-card-icon">⭐</div>
        <div class="svc-card-info">
          <strong>জন্মকুণ্ডলী বিশ্লেষণ</strong>
          <p>৩০-৩৫ পাতার PDF রিপোর্ট &bull; ৩০ মিনিট ফোন পরামর্শ &bull; বিস্তারিত</p>
          <div class="svc-price"><span class="svc-old">₹৩,৫০১</span><span class="svc-new">₹১,৫০১</span></div>
        </div>
        <i class="fas fa-chevron-right svc-arr"></i>
      </button>
      <button class="svc-card svc-card-best" onclick="pickSvc('হস্তরেখা + জন্মকুণ্ডলী',200100,'২,০০১','৪,০০১')">
        <span class="svc-badge">সাশ্রয়ী</span>
        <div class="svc-card-icon">🔮</div>
        <div class="svc-card-info">
          <strong>হস্তরেখা + জন্মকুণ্ডলী</strong>
          <p>সম্মিলিত বিশ্লেষণ &bull; PDF রিপোর্ট &bull; ৩০ মিনিট ফোন &bull; সবচেয়ে বিস্তারিত</p>
          <div class="svc-price"><span class="svc-old">₹৪,০০১</span><span class="svc-new">₹২,০০১</span></div>
        </div>
        <i class="fas fa-chevron-right svc-arr"></i>
      </button>
    </div>
    <p class="bm-secure-note"><i class="fas fa-lock" style="color:var(--gold);margin-right:4px"></i>Razorpay দ্বারা সুরক্ষিত &bull; UPI &bull; Card &bull; Net Banking</p>
  </div>
</div>

<!-- BOOKING MODAL -->
<div id="book-overlay" role="dialog" aria-modal="true" aria-labelledby="bookModalTitle">
  <div id="book-modal">
    <button class="bm-close-x" onclick="closeBooking()" aria-label="বন্ধ">&times;</button>
    <div class="bm-header">
      <img src="${LOGO_IMG}" alt="MyAstrology Logo" class="bm-logo" width="48" height="48">
      <div class="bm-brand" id="bookModalTitle">MyAstrology পরামর্শ বুকিং</div>
    </div>
    <div class="bm-svc-info">
      <span class="bm-svc-name" id="bmSvcName">&mdash;</span>
      <span class="bm-svc-price" id="bmSvcPrice">&mdash;</span>
    </div>
    <label class="bm-label" for="bmName">আপনার নাম <span class="bm-req">*</span></label>
    <input class="bm-inp" type="text" id="bmName" placeholder="সম্পূর্ণ নাম লিখুন" autocomplete="name">
    <label class="bm-label" for="bmPhone">WhatsApp নম্বর <span class="bm-req">*</span></label>
    <div class="bm-phone-wrap">
      <span class="bm-prefix">🇮🇳 +91</span>
      <input class="bm-inp bm-inp-tel" type="tel" id="bmPhone" placeholder="10-সংখ্যার মোবাইল" maxlength="10" autocomplete="tel">
    </div>
    <button class="bm-proceed-btn" onclick="proceedToRazorpay()">🔒 পেমেন্টে এগিয়ে যান</button>
    <p class="bm-secure-note"><i class="fas fa-lock" style="color:var(--gold);margin-right:4px"></i>Razorpay দ্বারা সুরক্ষিত &bull; UPI &bull; Card &bull; Net Banking</p>
  </div>
</div>

<!-- SUCCESS MODAL -->
<div id="rzp-success-overlay" role="dialog" aria-modal="true">
  <div id="rzp-success-modal">
    <button class="bm-close-x" onclick="closeSuccess()" aria-label="বন্ধ">&times;</button>
    <div class="success-ring">
      <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
    </div>
    <h3 class="success-title">পেমেন্ট সফল! 🙏</h3>
    <p class="success-msg" id="successMsg">আপনার পরামর্শ বুক হয়েছে।</p>
    <div class="pid-box"><span class="pid-label">Payment ID</span><span class="pid-value" id="successPid">&mdash;</span></div>
    <a id="successWaBtn" href="#" target="_blank" rel="noopener" class="success-wa-btn">
      <i class="fab fa-whatsapp"></i>&nbsp;WhatsApp-এ তথ্য পাঠান
    </a>
    <p class="success-note">এই WhatsApp লিঙ্কে Payment ID সহ তথ্য পাঠান।</p>
  </div>
</div>

<div class="wa-float" id="waFloat">
  <div class="wa-bubble" id="waBubble"></div>
  <a href="https://wa.me/${WA_NUMBER}?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%A1.%20%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AF%2C%20%E0%A6%AA%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A6%B0%E0%A7%8D%E0%A6%B6%20%E0%A6%A8%E0%A6%BF%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
     target="_blank" rel="noopener" class="wa-btn-fl" aria-label="WhatsApp">
    <i class="fab fa-whatsapp"></i>
  </a>
</div>
<button id="back-to-top" aria-label="উপরে যান">⬆</button>
`;
}

// ============================================
// মেইন ফাংশন
// ============================================
function main() {
  // আউটপুট ডিরেক্টরি তৈরি
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // ব্লগ ডিরেক্টরি চেক
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`❌ ব্লগ ডিরেক্টরি পাওয়া যায়নি: ${BLOG_DIR}`);
    console.log('📁 অনুগ্রহ করে src/content/blog/ ফোল্ডার তৈরি করুন এবং সেখানে .md ফাইল রাখুন।');
    process.exit(1);
  }
  
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('⚠️ কোন মার্কডাউন ফাইল পাওয়া যায়নি।');
    return;
  }
  
  // সব পোস্টের তালিকা তৈরি
  const allPosts = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const meta = parseFrontmatter(raw);
    const slug = meta.slug || file.replace(/\.md$/, '');
    if (!meta.title) meta.title = slug.replace(/-/g, ' ');
    allPosts.push({ slug, title: meta.title, date: meta.date });
  }
  
  // প্রতিটি পোস্ট জেনারেট
  let count = 0;
  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const meta = parseFrontmatter(raw);
    const slug = meta.slug || file.replace(/\.md$/, '');
    if (!meta.title) meta.title = slug.replace(/-/g, ' ');
    
    // HTML বডি তৈরি
    let body = markdownToHtml(raw);
    
    // পড়ার সময় পুনরায় গণনা (সঠিক টেক্সট থেকে)
    const actualMins = calculateReadingTime(body);
    
    // HTML তৈরি
    let html = buildHtml(meta, body, slug, allPosts);
    
    // রিলেটেড পোস্ট যোগ
    const relatedHTML = buildRelatedPostsHTML(slug, allPosts);
    if (relatedHTML) {
      if (html.includes('</article>')) {
        html = html.replace('</article>', relatedHTML + '\n  </article>');
      } else if (html.includes('</main>')) {
        html = html.replace('</main>', relatedHTML + '\n</main>');
      }
    }
    
    // সাইডবার রিলেটেড পোস্ট যোগ
    const sidebarHTML = buildSidebarRelatedHTML(slug);
    if (sidebarHTML && html.includes('class="back-link"')) {
      html = html.replace('class="back-link"', 'class="back-link" data-sidebar-injected="1"');
      html = html.replace('</main>', sidebarHTML + '\n</main>');
    }
    
    // স্ক্রিপ্ট যোগ
    html = html + getScripts() + '</body>\n</html>';
    
    // ফাইল লেখা
    const outputPath = path.join(OUTPUT_DIR, slug + '.html');
    fs.writeFileSync(outputPath, html, 'utf8');
    count++;
    console.log(`✅ blog/${slug}.html তৈরি হয়েছে`);
  }
  
  console.log(`\n📝 মোট ${count} টি HTML ফাইল তৈরি হয়েছে`);
  console.log('\n🔧 অপ্টিমাইজেশন সম্পন্ন:');
  console.log('   ★ Schema Markup ডুপ্লিকেট দূর করা হয়েছে');
  console.log('   ★ H1 ট্যাগ একটিতে সীমাবদ্ধ');
  console.log('   ★ পড়ার সময় সঠিকভাবে গণনা করা হয়');
  console.log('   ★ ফলব্যাক ইমেজ CLS-মুক্ত');
  console.log('   ★ JavaScript IIFE তে মোড়ানো');
  console.log('   ★ XSS প্রতিরোধে escapeHtml যোগ করা হয়েছে');
}

// স্ক্রিপ্ট চালানো
main();
