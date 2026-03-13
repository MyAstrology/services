'use strict';

const fs   = require('fs');
const path = require('path');

// ════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════
const BLOG_DIR    = path.join(__dirname, 'src', 'content', 'blog');
const OUTPUT_DIR  = path.join(__dirname, 'blog');
const SITE_URL    = 'https://www.myastrology.in';
const GA_ID       = 'G-S7BQGLP211';
const WA_NUMBER   = '919333122768';
const RZP_KEY     = 'rzp_live_SN8p6DJxPYFVL1';
const LOGO_IMG    = SITE_URL + '/images/MyAstrology-Ranghat-logo.png';
const FALLBACK_IMG = LOGO_IMG;

// Default service for blog CTA (general consultation)
const DEFAULT_SVC_LABEL  = '\u099c\u09cd\u09af\u09cb\u09a4\u09bf\u09b7 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6';
const DEFAULT_SVC_AMOUNT = 100100;   // ₹1001 in paise
const DEFAULT_SVC_PRICE  = '\u09e7\u09e6\u09e6\u09e7';
const DEFAULT_SVC_OLD    = '\u09e7\u09eb\u09e6\u09e7';
const WA_TEXT_ENC = '%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%A1.%20%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AF%2C%20%E0%A6%AA%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A6%B0%E0%A7%8D%E0%A6%B6%20%E0%A6%A8%E0%A6%BF%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4';

// ════════════════════════════════════════
// FRONTMATTER PARSER
// ════════════════════════════════════════
function parseFrontmatter(content) {
  const meta = { title:'', description:'', date:'', image:'', slug:'', tags:[], keywords:'' };
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return meta;
  const lines = match[1].split('\n');
  let inTags = false, inAuthor = false;
  lines.forEach(line => {
    // tags block
    if (/^tags\s*:/.test(line)) { inTags = true; inAuthor = false; return; }
    if (/^author\s*:/.test(line)) { inAuthor = true; inTags = false; return; }
    if (inTags) {
      if (/^\s{2,}-\s+/.test(line)) {
        meta.tags.push(line.replace(/^\s+-\s+/,'').replace(/^["']|["']$/g,'').trim());
        return;
      } else if (/^\S/.test(line)) { inTags = false; }
      else return;
    }
    if (inAuthor) {
      if (/^\s+\w/.test(line)) return; // skip nested author fields
      else inAuthor = false;
    }
    const ci = line.indexOf(':');
    if (ci === -1) return;
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci+1).trim().replace(/^["']|["']$/g,'');
    if (key === 'title')       meta.title       = val;
    if (key === 'description') meta.description = val;
    if (key === 'date')        meta.date        = val;
    if (key === 'image')       meta.image       = val;
    if (key === 'slug')        meta.slug        = val;
    if (key === 'keywords')    meta.keywords    = val;
    if (key === 'tags' && val.includes('[')) {
      meta.tags = val.replace(/[\[\]]/g,'').split(',')
        .map(t => t.trim().replace(/^["']|["']$/g,'')).filter(Boolean);
    }
  });
  return meta;
}

// ════════════════════════════════════════
// IMAGE NORMALIZER
// ════════════════════════════════════════
function normalizeImage(img, slug) {
  if (!img) return SITE_URL + '/images/' + slug + '.webp';
  // Fix broken subdomain references
  img = img.replace(/https?:\/\/astro\.myastrology\.in/g, SITE_URL);
  // Fix missing domain
  if (img.startsWith('/images/')) img = SITE_URL + img;
  return img;
}

// ════════════════════════════════════════
// SAFE JSON STRING
// ════════════════════════════════════════
function jsonStr(s) {
  return (s||'')
    .replace(/\\/g,'\\\\').replace(/"/g,'\\"')
    .replace(/\n/g,'\\n').replace(/\r/g,'\\r')
    .replace(/<\/script>/gi,'<\\/script>');
}

// ════════════════════════════════════════
// INLINE MARKDOWN
// ════════════════════════════════════════
function applyInline(t) {
  return t
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/`(.+?)`/g,           '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>');
}

// ════════════════════════════════════════
// BLOCK MARKDOWN → HTML
// ════════════════════════════════════════
function markdownToHtml(raw) {
  // Strip frontmatter — FIX: use !== -1 not > 0
  let md = raw;
  const fmStart = raw.indexOf('---');
  if (fmStart !== -1) {
    const fmEnd = raw.indexOf('\n---', fmStart + 3);
    if (fmEnd !== -1) md = raw.slice(fmEnd + 4);
  }

  const html = [];
  md.split(/\n{2,}/).forEach(block => {
    block = block.trim();
    if (!block) return;

    // HR divider
    if (/^---+$/.test(block)) { html.push('<hr>'); return; }

    // Raw HTML passthrough
    if (/^<(div|section|article|figure|table|ul|ol|blockquote|hr|h[1-6]|p[\s>])/i.test(block)) {
      html.push(block); return;
    }

    // Headings (with optional span anchors)
    if (/^#{1,6}\s/.test(block)) {
      html.push(block
        .replace(/^######\s(.+)$/gm,'<h6>$1</h6>')
        .replace(/^#####\s(.+)$/gm, '<h5>$1</h5>')
        .replace(/^####\s(.+)$/gm,  '<h4>$1</h4>')
        .replace(/^###\s(.+)$/gm,   '<h3>$1</h3>')
        .replace(/^##\s(.+)$/gm,    '<h2>$1</h2>')
        .replace(/^#\s(.+)$/gm,     '<h2>$1</h2>')  // h1 in body → h2 (SEO: only 1 h1 per page)
      ); return;
    }

    // Blockquote
    if (/^>\s/.test(block)) {
      const inner = block.split('\n')
        .map(l => l.replace(/^>\s?/,''))
        .join('\n');
      html.push('<blockquote>' + applyInline(inner.trim()) + '</blockquote>');
      return;
    }

    // Table
    if (/^\|.+\|/.test(block)) {
      const rows = block.split('\n').filter(r => r.trim());
      const isHdr = rows.length > 1 && /^\|[\s\-:|]+\|$/.test(rows[1]);
      let t = '<div class="tbl-wrap"><table>\n';
      rows.forEach((row, i) => {
        if (isHdr && i === 1) return;
        const cells = row.split('|').slice(1,-1).map(c=>c.trim());
        const tag   = (isHdr && i===0) ? 'th' : 'td';
        t += '<tr>' + cells.map(c=>'<'+tag+'>'+applyInline(c)+'</'+tag+'>').join('') + '</tr>\n';
      });
      html.push(t + '</table></div>'); return;
    }

    // Unordered list
    if (/^\s*[-*]\s/.test(block)) {
      html.push('<ul>\n' + block.split('\n')
        .filter(l => /^\s*[-*]\s/.test(l))
        .map(l => '<li>' + applyInline(l.replace(/^\s*[-*]\s/,'')) + '</li>')
        .join('\n') + '\n</ul>');
      return;
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(block)) {
      html.push('<ol>\n' + block.split('\n')
        .filter(l => /^\s*\d+\.\s/.test(l))
        .map(l => '<li>' + applyInline(l.replace(/^\s*\d+\.\s/,'')) + '</li>')
        .join('\n') + '\n</ol>');
      return;
    }

    // Paragraph
    html.push('<p>' + applyInline(block.replace(/\n/g,' ')) + '</p>');
  });
  return html.join('\n');
}

// ════════════════════════════════════════
// DATE FORMATTER (Bengali locale)
// ════════════════════════════════════════
function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d + 'T00:00:00');
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('bn-IN', { year:'numeric', month:'long', day:'numeric' });
}

// ════════════════════════════════════════
// ESTIMATED READING TIME
// ════════════════════════════════════════
function readingTime(html) {
  const words = html.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ════════════════════════════════════════
// HTML BUILDER
// ════════════════════════════════════════
function buildHtml(meta, body, slug) {
  const pageUrl  = SITE_URL + '/blog/' + slug + '.html';
  const ogImage  = normalizeImage(meta.image, slug);
  const tagsHtml = meta.tags.length
    ? meta.tags.map(t => '<span class="tag">' + t + '</span>').join(' ') : '';
  const dateStr  = formatDate(meta.date);
  const minRead  = readingTime(body);
  const keywords = meta.keywords || meta.tags.join(', ');

  return '<!DOCTYPE html>\n'
+ '<html lang="bn-IN" translate="no">\n'
+ '<head>\n'
+ '<meta charset="UTF-8">\n'
+ '<meta name="viewport" content="width=device-width,initial-scale=1.0">\n'
+ '<title>' + meta.title + ' | MyAstrology</title>\n'
+ '<meta name="description" content="' + meta.description + '">\n'
+ (keywords ? '<meta name="keywords" content="' + keywords + '">\n' : '')
+ '<meta name="author" content="Dr. Prodyut Acharya">\n'
+ '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">\n'
+ '<link rel="canonical" href="' + pageUrl + '">\n'
+ '<meta property="og:title"       content="' + meta.title + '">\n'
+ '<meta property="og:description" content="' + meta.description + '">\n'
+ '<meta property="og:url"         content="' + pageUrl + '">\n'
+ '<meta property="og:type"        content="article">\n'
+ '<meta property="og:image"       content="' + ogImage + '">\n'
+ '<meta property="og:image:alt"   content="' + meta.title + '">\n'
+ '<meta property="og:locale"      content="bn_IN">\n'
+ '<meta property="og:site_name"   content="MyAstrology \u2013 Dr. Prodyut Acharya">\n'
+ '<meta name="twitter:card"        content="summary_large_image">\n'
+ '<meta name="twitter:title"       content="' + meta.title + '">\n'
+ '<meta name="twitter:description" content="' + meta.description + '">\n'
+ '<meta name="twitter:image"       content="' + ogImage + '">\n'
+ '<script type="application/ld+json">\n'
+ '{"@context":"https://schema.org","@type":"BlogPosting",'
+ '"headline":"' + jsonStr(meta.title) + '",'
+ '"description":"' + jsonStr(meta.description) + '",'
+ '"datePublished":"' + meta.date + '","dateModified":"' + meta.date + '",'
+ '"image":"' + jsonStr(ogImage) + '","url":"' + pageUrl + '",'
+ '"inLanguage":"bn-IN",'
+ '"author":{"@type":"Person","name":"Dr. Prodyut Acharya","url":"' + SITE_URL + '/about.html"},'
+ '"publisher":{"@type":"Organization","name":"MyAstrology",'
+ '"logo":{"@type":"ImageObject","url":"' + LOGO_IMG + '"}},'
+ '"mainEntityOfPage":{"@type":"WebPage","@id":"' + pageUrl + '"}}\n'
+ '</script>\n'
// GTM
+ '<!-- Google Tag Manager -->\n'
+ '<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-MVVL8XBD");</script>\n'
+ '<!-- End Google Tag Manager -->\n'
+ '<script async src="https://www.googletagmanager.com/gtag/js?id=' + GA_ID + '"></script>\n'
+ '<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + GA_ID + '");</script>\n'
// Razorpay — defer so it doesn't block render
+ '<script defer src="https://checkout.razorpay.com/v1/checkout.js"></script>\n'
+ '<link rel="icon" type="image/x-icon" href="' + SITE_URL + '/images/favicon.ico">\n'
+ '<link rel="apple-touch-icon"         href="' + SITE_URL + '/images/favicon.ico">\n'
+ '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
+ '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Playfair+Display:wght@700&display=swap">\n'
+ '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" media="print" onload="this.media=\'all\'">\n'
+ '<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous"></noscript>\n'
+ CSS_BLOCK
+ '</head>\n'
+ '<body>\n\n'
// GTM noscript
+ '<!-- Google Tag Manager (noscript) -->\n'
+ '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MVVL8XBD" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n'
+ '<!-- End Google Tag Manager (noscript) -->\n\n'
+ '<a class="skip-link" href="#main-content">\u09ae\u09c2\u09b2 \u09ac\u09bf\u09b7\u09af\u09bc\u09ac\u09b8\u09cd\u09a4\u09c1\u09a4\u09c7 \u09af\u09be\u09a8</a>\n\n'
+ HEADER_HTML
+ NAV_HTML
+ '<main id="main-content">\n'
+ '  <a class="back-link" href="' + SITE_URL + '/blog-list.html">\n'
+ '    <i class="fas fa-arrow-left"></i> \u09b8\u09ac \u09aa\u09cb\u09b8\u09cd\u099f \u09a6\u09c7\u0996\u09c1\u09a8\n'
+ '  </a>\n\n'
+ '  <article>\n'
+ '    <div class="post-header">\n'
+ '      <img class="featured-img"\n'
+ '           src="' + ogImage + '"\n'
+ '           alt="' + meta.title + '"\n'
+ '           loading="eager"\n'
+ '           onerror="this.src=\'' + FALLBACK_IMG + '\'">\n'
+ '      <h1>' + meta.title + '</h1>\n'
+ '      <div class="post-meta">\n'
+ '        <span><i class="fas fa-user-edit"></i>Dr. Prodyut Acharya</span>\n'
+ (dateStr ? '        <span><i class="fas fa-calendar-alt"></i>' + dateStr + '</span>\n' : '')
+ '        <span><i class="fas fa-clock"></i>' + minRead + ' \u09ae\u09bf\u09a8\u09bf\u099f \u09aa\u09dc\u09a8</span>\n'
+ '      </div>\n'
+ (tagsHtml ? '      <div class="tags">' + tagsHtml + '</div>\n' : '')
+ '    </div>\n\n'
+ '    <div class="post-body">\n'
+      body + '\n'
+ '    </div>\n'
+ '  </article>\n\n'
+ PJK_STRIP
+ CTA_BOX
+ AUTHOR_BIO
+ RELATED_BOX
+ '</main>\n\n'
+ FOOTER_HTML
+ RZP_MODALS
+ WA_FLOAT
+ BTT_BUTTON
+ SCRIPTS;
}

// ════════════════════════════════════════
// CSS — exact from index.html + blog extras
// ════════════════════════════════════════
const CSS_BLOCK = `<style>
:root{
  --navy:#0a192f;--navy2:#0e1e38;--navy3:#112240;
  --gold:#b8860b;--gold2:#c8950c;--gold3:#ffd700;
  --gold-lt:#fff4ca;--gold-bg:#fdf8ed;
  --bg:#FFF9F0;--tx:#2C1810;--mu:#6B4C3B;--bd:#E8D5B7;
  --red:#780b0b;--blue:#123d87;
  --fh:'Playfair Display',Georgia,serif;
  --fb:'Noto Serif Bengali','Segoe UI',sans-serif;
  --r:10px;--shadow:0 4px 28px rgba(0,0,0,.09);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;overflow-x:clip;}
body{font-family:var(--fb);background:var(--bg);color:var(--tx);line-height:1.9;font-size:1.05rem;padding-top:66px;overflow-x:clip;}
img{max-width:100%;height:auto;display:block;}
a{text-decoration:none;color:inherit;}
code{background:#f0f0f8;padding:2px 6px;border-radius:4px;font-size:.88rem;}

/* SKIP LINK */
.skip-link{position:absolute;top:-40px;left:0;background:var(--navy);color:var(--gold-lt);padding:8px 14px;z-index:9999;font-size:.85rem;transition:top .2s;}
.skip-link:focus{top:0;}

/* HEADER — index.html exact */
.site-header{position:fixed;width:100%;top:0;z-index:900;display:flex;align-items:center;gap:12px;padding:0 20px;height:66px;background:var(--navy);box-shadow:0 2px 18px rgba(0,0,0,.5);border-bottom:2px solid var(--gold);}
.ham{background:rgba(255,255,255,.06);border:1.5px solid rgba(184,134,11,.45);cursor:pointer;color:var(--gold-lt);font-size:1.25rem;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:7px;flex-shrink:0;transition:background .2s;}
.ham:hover{background:rgba(184,134,11,.18);}
.header-brand{font-family:var(--fh);font-size:1.18rem;font-weight:700;color:var(--gold-lt);letter-spacing:.05em;flex:1;text-align:center;line-height:1.2;}
.header-sub{font-size:.65rem;font-weight:400;color:#8aabcb;letter-spacing:.04em;display:block;margin-top:1px;}
.header-logo{width:46px;height:46px;border-radius:8px;object-fit:contain;background:var(--navy);padding:2px;flex-shrink:0;}

/* NAV — index.html exact */
.nav{display:none;flex-direction:column;position:fixed;top:66px;left:0;right:0;background:var(--navy2);border-top:2px solid var(--gold);z-index:899;max-height:82vh;overflow-y:auto;box-shadow:0 10px 30px rgba(0,0,0,.45);}
.nav.open{display:flex;}
.nav-overlay{display:none;position:fixed;inset:0;top:66px;background:rgba(0,0,0,.45);z-index:898;}
.nav-overlay.open{display:block;}
.nav a{color:#b0c4dc;padding:12px 22px;font-size:.93rem;font-weight:600;border-bottom:1px solid rgba(255,255,255,.06);transition:background .2s,color .2s;}
.nav a i{width:20px;margin-right:9px;color:var(--gold3);opacity:.85;}
.nav a:hover,.nav a:focus{background:rgba(184,134,11,.12);color:var(--gold-lt);}
.nav a.wa-nav{color:#4ade80;font-weight:700;}
body.nav-open{overflow-y:hidden;}
body.nav-open .wa-float,body.nav-open #back-to-top{display:none!important;}

/* MAIN */
main{max-width:780px;margin:0 auto;padding:32px 18px 60px;}
.back-link{display:inline-flex;align-items:center;gap:6px;color:var(--gold);font-size:.87rem;margin-bottom:22px;opacity:.8;}
.back-link:hover{opacity:1;text-decoration:underline;}

/* POST HEADER */
.post-header{margin-bottom:26px;border-bottom:2px solid var(--bd);padding-bottom:20px;}
.post-header h1{font-family:var(--fh);font-size:clamp(1.4rem,4vw,1.9rem);color:#1a2e48;line-height:1.35;margin-bottom:12px;}
.post-meta{font-size:.83rem;color:var(--mu);margin-bottom:10px;display:flex;flex-wrap:wrap;gap:5px 14px;}
.post-meta i{color:var(--gold);margin-right:4px;}
.tags{margin-top:10px;}
.tag{display:inline-block;background:var(--gold-bg);color:var(--gold);font-size:.76rem;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid rgba(184,134,11,.28);margin:2px 3px 2px 0;}
.featured-img{width:100%;max-height:420px;object-fit:cover;border-radius:var(--r);margin-bottom:18px;display:block;border-top:4px solid var(--gold);background:var(--gold-bg);}

/* POST BODY */
.post-body h2{font-family:var(--fh);color:#1a2e48;margin:30px 0 12px;font-size:1.35rem;border-left:4px solid var(--gold);padding-left:12px;line-height:1.4;}
.post-body h3{font-family:var(--fh);color:#1a2e48;margin:22px 0 8px;font-size:1.1rem;padding-left:4px;}
.post-body h4,.post-body h5,.post-body h6{font-family:var(--fh);color:var(--mu);margin:16px 0 6px;}
.post-body p{margin-bottom:16px;}
.post-body hr{border:none;border-top:1px solid var(--bd);margin:28px 0;}
.post-body blockquote{border-left:4px solid var(--gold);padding:14px 20px;background:var(--gold-bg);margin:22px 0;font-style:italic;color:var(--mu);border-radius:0 var(--r) var(--r) 0;font-family:var(--fh);font-size:1.02rem;line-height:1.75;}
.post-body a{color:var(--blue);border-bottom:1px dotted;}
.post-body a:hover{color:var(--gold);}
.post-body ul,.post-body ol{margin:10px 0 16px 24px;}
.post-body li{margin-bottom:7px;}
.post-body strong{color:var(--tx);font-weight:700;}
.post-body em{font-style:italic;}
.post-body code{background:#f0f0f8;padding:2px 6px;border-radius:4px;font-size:.88rem;}
.post-body img{max-width:100%;border-radius:var(--r);margin:16px 0;box-shadow:var(--shadow);}

/* TABLE */
.tbl-wrap{overflow-x:auto;margin:18px 0 22px;border-radius:var(--r);border:1px solid var(--bd);box-shadow:var(--shadow);}
.tbl-wrap table{width:100%;border-collapse:collapse;font-size:.9rem;}
.tbl-wrap th{background:var(--navy);color:var(--gold-lt);padding:11px 14px;text-align:left;font-weight:600;font-family:var(--fh);}
.tbl-wrap td{padding:9px 14px;border-bottom:1px solid var(--bd);vertical-align:top;}
.tbl-wrap tr:nth-child(even) td{background:var(--gold-bg);}
.tbl-wrap tr:last-child td{border-bottom:none;}
.tbl-wrap tr:hover td{background:rgba(184,134,11,.06);}

/* PANJIKA STRIP */
.pjk-strip{background:linear-gradient(135deg,#0d1547,#0a0f3d,#12122a);border-radius:14px;padding:18px 20px;margin:34px 0;border:1.5px solid rgba(255,180,0,.3);box-shadow:0 8px 32px rgba(0,0,0,.35);text-align:center;}
.pjk-strip h3{font-family:var(--fh);color:#f5b800;font-size:1rem;margin:0 0 6px;text-shadow:0 2px 10px rgba(255,180,0,.4);}
.pjk-strip p{color:#8a9fc8;font-size:.84rem;margin:0 0 12px;line-height:1.5;}
.pjk-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-bottom:12px;}
.pjk-tags a{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#c8d8f0;font-size:.76rem;font-weight:600;padding:4px 10px;border-radius:50px;text-decoration:none;transition:.2s;}
.pjk-tags a:hover{background:rgba(255,180,0,.12);color:#f5d080;border-color:rgba(255,180,0,.4);}
.pjk-btn{display:inline-block;background:linear-gradient(135deg,#f5b800,#e8a200);color:#1a0e00;font-weight:800;font-size:.9rem;padding:9px 32px;border-radius:50px;text-decoration:none;box-shadow:0 4px 16px rgba(245,184,0,.45);transition:all .3s;}
.pjk-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,184,0,.6);}

/* CTA BOX */
.cta-box{background:linear-gradient(135deg,var(--navy),var(--navy2));border-top:2px solid var(--gold);color:#fff;border-radius:14px;padding:28px 22px;margin:38px 0 20px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.3);}
.cta-box h3{font-family:var(--fh);color:var(--gold-lt);margin-bottom:8px;font-size:1.15rem;}
.cta-box p{margin-bottom:16px;opacity:.85;font-size:.9rem;line-height:1.7;}
.cta-box strong{color:var(--gold3);}
.btn-book-cta{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold-lt),#ffe88a);color:#5a1f0a;padding:12px 26px;border-radius:50px;font-weight:800;margin:5px;font-size:.92rem;cursor:pointer;border:2px solid rgba(184,134,11,.4);transition:all .2s;font-family:var(--fb);}
.btn-book-cta:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(184,134,11,.4);}
.btn-wa-cta{display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:12px 26px;border-radius:50px;font-weight:800;margin:5px;font-size:.92rem;text-decoration:none;box-shadow:0 4px 16px rgba(37,211,102,.4);transition:all .2s;font-family:var(--fb);}
.btn-wa-cta:hover{background:#1ebe5d;transform:translateY(-2px);}

/* AUTHOR BIO */
.author-bio{display:flex;align-items:flex-start;gap:14px;background:var(--gold-bg);border:1px solid var(--bd);border-radius:var(--r);padding:18px;margin:0 0 20px;}
.author-bio .ico{font-size:2.5rem;line-height:1;flex-shrink:0;}
.author-bio h4{font-family:var(--fh);margin:0 0 3px;color:#1a2e48;font-size:.95rem;}
.author-bio .sub{font-size:.8rem;color:var(--gold);margin:0 0 5px;font-weight:600;display:block;}
.author-bio p{font-size:.86rem;color:var(--mu);line-height:1.65;margin:0;}
.author-bio a{color:var(--gold);font-weight:600;border-bottom:1px dotted;}

/* RELATED */
.related{background:var(--gold-bg);border:1px solid var(--bd);border-radius:var(--r);padding:16px 18px;}
.related h4{font-family:var(--fh);margin:0 0 10px;color:#1a2e48;font-size:.92rem;}
.related a{display:flex;align-items:center;gap:8px;color:var(--blue);font-size:.88rem;line-height:2;padding:2px 0;}
.related a i{color:var(--gold);font-size:.78rem;flex-shrink:0;}
.related a:hover{color:var(--gold);}

/* FOOTER — index.html exact 4-column grid */
.site-footer{background:linear-gradient(180deg,#0a1628 0%,#060e1a 100%);border-top:3px solid var(--gold);color:#6888a8;margin-top:50px;}
.footer-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1.1fr;gap:0;max-width:1080px;margin:0 auto;padding:44px 24px 36px;border-bottom:1px solid rgba(255,255,255,.05);}
.footer-col{padding:0 28px 0 0;border-right:1px solid rgba(255,255,255,.05);}
.footer-col:first-child{padding-left:0;}
.footer-col:last-child{padding-right:0;border-right:none;}
.footer-col + .footer-col{padding-left:28px;}
.footer-col h4{font-family:var(--fh);color:var(--gold);font-size:.8rem;letter-spacing:.13em;text-transform:uppercase;margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid rgba(184,134,11,.25);}
.footer-col p,.footer-col a{font-size:.82rem;color:#8aabcb;display:block;margin-bottom:8px;transition:color .2s;line-height:1.65;}
.footer-col a:hover{color:var(--gold-lt);}
.footer-col i{width:15px;margin-right:7px;opacity:.75;color:var(--gold);font-size:.78rem;}
.footer-bottom{max-width:1080px;margin:0 auto;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.footer-bottom p{font-size:.76rem;color:#3d5570;}
.footer-bottom a{color:#5a7a9a;border-bottom:1px solid #3d5570;}
.social-row{display:flex;gap:8px;flex-wrap:wrap;}
.social-row a{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.9rem;color:#fff;transition:transform .2s,filter .2s;filter:brightness(.8);}
.social-row a:hover{transform:translateY(-3px);filter:brightness(1);}
.s-wa{background:#25d366;}.s-fb{background:#1877f2;}.s-yt{background:#ff0000;}
.s-ig{background:radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285aeb 90%);}
.s-tw{background:#14171a;}.s-li{background:#0077b5;}

/* RAZORPAY MODALS — index.html exact */
#book-overlay,#rzp-success-overlay{display:none;position:fixed;inset:0;background:rgba(8,14,30,.82);z-index:9400;align-items:center;justify-content:center;backdrop-filter:blur(6px);opacity:0;transition:opacity .3s ease;padding:16px;}
#book-overlay.show,#rzp-success-overlay.show{opacity:1;}
#book-modal{background:#fff;border-radius:20px;padding:32px 28px 28px;max-width:420px;width:100%;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(184,134,11,.2);transform:translateY(24px) scale(.97);transition:transform .35s cubic-bezier(.34,1.56,.64,1),opacity .3s;opacity:0;}
#book-overlay.show #book-modal{transform:translateY(0) scale(1);opacity:1;}
.bm-close-x{position:absolute;top:14px;right:16px;background:#f0f0f8;border:none;width:32px;height:32px;border-radius:50%;font-size:1rem;cursor:pointer;color:#666;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s;line-height:1;}
.bm-close-x:hover{background:#e0e0f0;color:var(--navy);}
.bm-header{text-align:center;margin-bottom:16px;}
.bm-logo{height:48px;width:auto;display:block;margin:0 auto 8px;}
.bm-brand{font-family:var(--fh);font-weight:800;font-size:1.1rem;color:var(--navy);}
.bm-svc-info{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#f8f4ff,#fff8e1);border:1px solid #e0d4f0;border-radius:10px;padding:10px 14px;margin-bottom:16px;}
.bm-svc-name{font-family:var(--fb);font-weight:700;font-size:.92rem;color:var(--navy);}
.bm-svc-price{font-family:var(--fb);font-weight:900;font-size:1.1rem;color:var(--red);}
.bm-label{display:block;font-family:var(--fb);font-size:.82rem;font-weight:700;color:var(--navy);margin-bottom:5px;margin-top:12px;}
.bm-req{color:var(--red);}
.bm-inp{width:100%;padding:13px 16px;border:2px solid #e8e0f0;border-radius:10px;font-family:var(--fb);font-size:.95rem;color:var(--tx);background:#fafafa;outline:none;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;}
.bm-inp:focus{border-color:var(--navy);box-shadow:0 0 0 3px rgba(10,25,47,.1);background:#fff;}
.bm-inp.err{border-color:var(--red);animation:bm-shake .35s;box-shadow:0 0 0 3px rgba(120,11,11,.1);}
.bm-phone-wrap{display:flex;align-items:center;border:2px solid #e8e0f0;border-radius:10px;overflow:hidden;transition:border-color .2s,box-shadow .2s;background:#fafafa;}
.bm-phone-wrap:focus-within{border-color:var(--navy);box-shadow:0 0 0 3px rgba(10,25,47,.1);background:#fff;}
.bm-prefix{background:#eef2ff;padding:0 12px;font-family:var(--fb);font-size:.88rem;font-weight:700;color:var(--navy);border-right:1px solid #e0d4f0;height:48px;display:flex;align-items:center;white-space:nowrap;flex-shrink:0;}
.bm-inp-tel{border:none!important;border-radius:0!important;box-shadow:none!important;flex:1;background:transparent;}
.bm-inp-tel:focus{background:transparent!important;box-shadow:none!important;}
.bm-proceed-btn{width:100%;padding:15px;background:linear-gradient(135deg,var(--navy),#1e3a5f);color:var(--gold3);border:none;border-radius:50px;font-family:var(--fb);font-weight:800;font-size:1rem;cursor:pointer;transition:transform .2s,box-shadow .2s;box-shadow:0 6px 20px rgba(10,25,47,.35);letter-spacing:.3px;margin-top:14px;}
.bm-proceed-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(10,25,47,.45);}
.bm-secure-note{text-align:center;font-size:.7rem;color:#aaa;margin-top:10px;font-family:var(--fb);}
@keyframes bm-shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}
#rzp-success-modal{background:#fff;border-radius:22px;padding:36px 28px 30px;max-width:400px;width:100%;text-align:center;position:relative;box-shadow:0 30px 90px rgba(0,0,0,.5);transform:scale(.85) translateY(20px);transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .3s;opacity:0;}
#rzp-success-overlay.show #rzp-success-modal{transform:scale(1) translateY(0);opacity:1;}
.success-ring{width:72px;height:72px;margin:0 auto 16px;}
.success-checkmark{width:72px;height:72px;border-radius:50%;display:block;stroke-width:2;stroke:#25a244;stroke-miterlimit:10;animation:sc-scale .3s ease-in-out .9s both;}
.checkmark-circle{stroke-dasharray:166;stroke-dashoffset:166;stroke-width:2;stroke:#25a244;fill:none;animation:sc-stroke .6s cubic-bezier(.65,0,.45,1) forwards;}
.checkmark-check{transform-origin:50% 50%;stroke-dasharray:48;stroke-dashoffset:48;animation:sc-stroke .3s cubic-bezier(.65,0,.45,1) .8s forwards;}
@keyframes sc-stroke{100%{stroke-dashoffset:0;}}
@keyframes sc-scale{0%,100%{transform:none;}50%{transform:scale3d(1.1,1.1,1);}}
.success-title{font-family:var(--fh);color:var(--navy);font-size:1.35rem;margin:0 0 8px;}
.success-msg{font-size:.9rem;color:#555;margin-bottom:16px;line-height:1.65;}
.pid-box{background:#f0f0fa;border:1px dashed #c0b8e0;border-radius:10px;padding:10px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:8px;}
.pid-label{font-size:.72rem;font-weight:700;color:#888;font-family:var(--fb);text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;}
.pid-value{font-family:monospace;font-size:.8rem;color:var(--navy);word-break:break-all;text-align:right;font-weight:700;}
.success-wa-btn{display:inline-flex;align-items:center;gap:9px;background:#25D366;color:#fff;padding:14px 30px;border-radius:50px;font-weight:800;font-size:.96rem;text-decoration:none;border:none;box-shadow:0 4px 18px rgba(37,211,102,.38);transition:transform .2s,box-shadow .2s;font-family:var(--fb);cursor:pointer;}
.success-wa-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(37,211,102,.52);}
.success-note{font-size:.7rem;color:#aaa;margin-top:12px;font-family:var(--fb);}

/* FLOATING WHATSAPP — ডানে (index.html exact) */
.wa-float{position:fixed;bottom:26px;right:22px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
.wa-bubble{background:#fff;border-radius:8px;padding:6px 10px;font-size:.72rem;font-weight:600;color:#111;box-shadow:0 4px 20px rgba(0,0,0,.2);max-width:150px;text-align:center;display:none;}
.wa-bubble.show{display:block;animation:popIn .4s ease;}
.wa-btn-fl{width:44px;height:44px;border-radius:50%;background:#25d366;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:#fff;text-decoration:none;box-shadow:0 4px 20px rgba(37,211,102,.5);animation:waPulse 2.4s infinite;}
.wa-btn-fl:hover{background:#1ebe5d;animation:none;transform:scale(1.07);}
@keyframes waPulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.5);}50%{box-shadow:0 4px 34px rgba(37,211,102,.8),0 0 0 8px rgba(37,211,102,.1);}}
@keyframes popIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}

/* BACK TO TOP — বাঁয়ে (index.html exact) */
#back-to-top{position:fixed;bottom:22px;left:18px;width:44px;height:44px;background:transparent;color:var(--gold3);border:none;border-radius:50%;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(14px);transition:opacity .3s,transform .3s;z-index:800;}
#back-to-top.visible{opacity:1;transform:translateY(0);}
#back-to-top:hover{background:var(--navy2);}

/* RESPONSIVE */
@media(max-width:860px){.footer-grid{grid-template-columns:1fr 1fr;gap:0;}.footer-col{border-right:none;padding:0 0 24px 0!important;}.footer-col + .footer-col{padding-left:0!important;}}
@media(max-width:480px){.footer-grid{grid-template-columns:1fr;}.footer-bottom{flex-direction:column;text-align:center;}}
@media(max-width:600px){main{padding:20px 14px 48px;}.post-header h1{font-size:1.4rem;}}
</style>
`;

// ════════════════════════════════════════
// HEADER — index.html exact
// ════════════════════════════════════════
const HEADER_HTML =
'<!-- HEADER -->\n'
+ '<header class="site-header">\n'
+ '  <button class="ham" onclick="toggleNav()" aria-label="\u09ae\u09c7\u09a8\u09c1 \u0996\u09c1\u09b2\u09c1\u09a8">\n'
+ '    <i class="fas fa-bars"></i>\n'
+ '  </button>\n'
+ '  <span class="header-brand">MyAstrology\n'
+ '    <span class="header-sub">\u09a1. \u09aa\u09cd\u09b0\u09a6\u09cd\u09af\u09c1\u09ce \u0986\u099a\u09be\u09b0\u09cd\u09af \u00b7 \u09b0\u09be\u09a8\u09be\u0998\u09be\u099f</span>\n'
+ '  </span>\n'
+ '  <img src="' + LOGO_IMG + '" alt="MyAstrology Ranaghat Logo" class="header-logo" width="46" height="46" loading="eager">\n'
+ '</header>\n\n';

// ════════════════════════════════════════
// NAV — index.html exact
// ════════════════════════════════════════
const NAV_HTML =
'<!-- NAV -->\n'
+ '<nav class="nav" id="navMenu" aria-label="\u09ae\u09c2\u09b2 \u09a8\u09c7\u09ad\u09bf\u0997\u09c7\u09b6\u09a8">\n'
+ '  <a href="' + SITE_URL + '/"><i class="fas fa-home"></i>\u09b9\u09cb\u09ae</a>\n'
+ '  <a href="' + SITE_URL + '/astrology.html"><i class="fas fa-star"></i>\u099c\u09cd\u09af\u09cb\u09a4\u09bf\u09b7 \u09b6\u09be\u09b8\u09cd\u09a4\u09cd\u09b0</a>\n'
+ '  <a href="' + SITE_URL + '/palmistry.html"><i class="fas fa-hand-paper"></i>\u09b9\u09b8\u09cd\u09a4\u09b0\u09c7\u0996\u09be</a>\n'
+ '  <a href="' + SITE_URL + '/gemstone.html"><i class="fas fa-gem"></i>\u09b0\u09a4\u09cd\u09a8\u09aa\u09be\u09a5\u09b0 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6</a>\n'
+ '  <a href="' + SITE_URL + '/vastu-science.html"><i class="fas fa-building"></i>\u09ac\u09be\u09b8\u09cd\u09a4\u09c1 \u09b6\u09be\u09b8\u09cd\u09a4\u09cd\u09b0</a>\n'
+ '  <a href="' + SITE_URL + '/vedic-astronomy.html"><i class="fas fa-moon"></i>\u099c\u09cd\u09af\u09cb\u09a4\u09bf\u09b0\u09cd\u09ac\u09bf\u099c\u09cd\u099e\u09be\u09a8</a>\n'
+ '  <a href="' + SITE_URL + '/rashifal.html"><i class="fas fa-circle-notch"></i>\u09b0\u09be\u09b6\u09bf\u09ab\u09b2</a>\n'
+ '  <a href="' + SITE_URL + '/panjika.html"><i class="fas fa-calendar-alt"></i>\u09aa\u099e\u09cd\u099c\u09bf\u0995\u09be</a>\n'
+ '  <a href="' + SITE_URL + '/video.html"><i class="fas fa-play-circle"></i>\u09ad\u09bf\u09a1\u09bf\u0993</a>\n'
+ '  <a href="' + SITE_URL + '/gallery.html"><i class="fas fa-images"></i>\u0997\u09cd\u09af\u09be\u09b2\u09be\u09b0\u09bf</a>\n'
+ '  <a href="' + SITE_URL + '/reviews.html"><i class="fas fa-star-half-alt"></i>\u09b0\u09bf\u09ad\u09bf\u0989</a>\n'
+ '  <a href="' + SITE_URL + '/blog-list.html"><i class="fas fa-blog"></i>\u09ac\u09cd\u09b2\u0997</a>\n'
+ '  <a href="' + SITE_URL + '/about.html"><i class="fas fa-user"></i>\u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995\u09c7</a>\n'
+ '  <a href="' + SITE_URL + '/contact.html"><i class="fas fa-address-card"></i>\u09af\u09cb\u0997\u09be\u09af\u09cb\u0997</a>\n'
+ '  <a href="https://wa.me/' + WA_NUMBER + '" target="_blank" rel="noopener" class="wa-nav"><i class="fab fa-whatsapp"></i>\ud83d\udcf2 WhatsApp \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6</a>\n'
+ '</nav>\n'
+ '<div class="nav-overlay" id="navOverlay" onclick="closeNav()"></div>\n\n';

// ════════════════════════════════════════
// PANJIKA STRIP
// ════════════════════════════════════════
const PJK_STRIP =
'  <!-- \u09aa\u099e\u09cd\u099c\u09bf\u0995\u09be strip -->\n'
+ '  <div class="pjk-strip">\n'
+ '    <h3>\ud83c\udf19 \u0986\u099c\u0995\u09c7\u09b0 \u09b0\u09be\u09b6\u09bf\u09ab\u09b2 \u0993 \u09a6\u09bf\u09a8 \u09aa\u099e\u09cd\u099c\u09bf\u0995\u09be</h3>\n'
+ '    <p>\u099c\u09be\u09a8\u09c1\u09a8 \u0986\u099c\u0995\u09c7\u09b0 \u09b0\u09be\u09b6\u09bf\u09ab\u09b2, \u09aa\u09cd\u09b0\u09c7\u09ae, \u0995\u09b0\u09cd\u09ae, \u0985\u09b0\u09cd\u09a5, \u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af, \u09b6\u09c1\u09ad \u09b8\u0982\u0996\u09cd\u09af\u09be, \u09b6\u09c1\u09ad \u09b0\u0982 \u0993 \u09b6\u09c1\u09ad \u09b8\u09ae\u09af\u09bc\u0964</p>\n'
+ '    <div class="pjk-tags">\n'
+ '      <a href="' + SITE_URL + '/panjika.html">\u2764\ufe0f \u09aa\u09cd\u09b0\u09c7\u09ae</a>\n'
+ '      <a href="' + SITE_URL + '/panjika.html">\ud83d\udcbc \u0995\u09b0\u09cd\u09ae</a>\n'
+ '      <a href="' + SITE_URL + '/panjika.html">\ud83d\udcb0 \u0985\u09b0\u09cd\u09a5</a>\n'
+ '      <a href="' + SITE_URL + '/panjika.html">\ud83c\udf3f \u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af</a>\n'
+ '      <a href="' + SITE_URL + '/panjika.html">\ud83d\udd22 \u09b6\u09c1\u09ad \u09b8\u0982\u0996\u09cd\u09af\u09be</a>\n'
+ '      <a href="' + SITE_URL + '/panjika.html">\u23f0 \u09b6\u09c1\u09ad \u09b8\u09ae\u09af\u09bc</a>\n'
+ '    </div>\n'
+ '    <a class="pjk-btn" href="' + SITE_URL + '/panjika.html">\u0986\u099c\u0987 \u09a6\u09c7\u0996\u09c1\u09a8 \u2192</a>\n'
+ '  </div>\n\n';

// ════════════════════════════════════════
// CTA BOX — uses real openRzp() like index.html
// ════════════════════════════════════════
const CTA_BOX =
'  <!-- CTA -->\n'
+ '  <div class="cta-box">\n'
+ '    <h3>\ud83d\udd2e \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf\u0997\u09a4 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6 \u09a8\u09bf\u09a8</h3>\n'
+ '    <p>\u099c\u09a8\u09cd\u09ae\u0995\u09c1\u09a3\u09cd\u09a1\u09b2\u09c0 \u09ac\u09bf\u099a\u09be\u09b0 \u00b7 \u09b9\u09b8\u09cd\u09a4\u09b0\u09c7\u0996\u09be \u09ac\u09bf\u09b6\u09cd\u09b2\u09c7\u09b7\u09a3 \u00b7 \u09af\u09cb\u099f\u09cb\u0995 \u09ae\u09bf\u09b2\u09a8<br>\n'
+ '       <strong>Dr. Prodyut Acharya</strong> \u2014 PhD Gold Medalist \u00b7 \u09b0\u09be\u09a8\u09be\u0998\u09be\u099f, \u09aa\u09b6\u09cd\u099c\u09bf\u09ae\u09ac\u0999\u09cd\u0997</p>\n'
+ '    <button class="btn-book-cta"\n'
+ '       onclick="openRzp(\'' + DEFAULT_SVC_LABEL + '\',' + DEFAULT_SVC_AMOUNT + ',\'\u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6\',\'' + DEFAULT_SVC_PRICE + '\',\'' + DEFAULT_SVC_OLD + '\')">\n'
+ '      <i class="fas fa-calendar-check"></i> \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6 \u09ac\u09c1\u0995 \u0995\u09b0\u09c1\u09a8\n'
+ '    </button>\n'
+ '    <a class="btn-wa-cta"\n'
+ '       href="https://wa.me/' + WA_NUMBER + '?text=' + WA_TEXT_ENC + '"\n'
+ '       target="_blank" rel="noopener">\n'
+ '      <i class="fab fa-whatsapp"></i> WhatsApp \u0995\u09b0\u09c1\u09a8\n'
+ '    </a>\n'
+ '    <p style="font-size:.72rem;margin-top:10px;opacity:.6;">\n'
+ '      <i class="fas fa-lock" style="color:var(--gold3);margin-right:4px;"></i>\n'
+ '      Razorpay \u09a6\u09cd\u09ac\u09be\u09b0\u09be \u09b8\u09c1\u09b0\u0995\u09cd\u09b7\u09bf\u09a4 &nbsp;\u00b7\u00a0 UPI \u00b7 Card \u00b7 Net Banking\n'
+ '    </p>\n'
+ '  </div>\n\n';

// ════════════════════════════════════════
// AUTHOR BIO
// ════════════════════════════════════════
const AUTHOR_BIO =
'  <!-- Author bio -->\n'
+ '  <div class="author-bio">\n'
+ '    <div class="ico">\ud83e\uddd1\u200d\ud83c\udf93</div>\n'
+ '    <div>\n'
+ '      <h4>Dr. Prodyut Acharya</h4>\n'
+ '      <span class="sub">PhD Gold Medalist \u00b7 \u099c\u09cd\u09af\u09cb\u09a4\u09bf\u09b7\u09c0 \u0993 \u09b9\u09b8\u09cd\u09a4\u09b0\u09c7\u0996\u09be\u09ac\u09bf\u09a6 \u00b7 \u09b0\u09be\u09a8\u09be\u0998\u09be\u099f, \u09a8\u09a6\u09bf\u09af\u09bc\u09be</span>\n'
+ '      <p>\u09e7\u09eb+ \u09ac\u099b\u09b0\u09c7\u09b0 \u0985\u09ad\u09bf\u099c\u09cd\u099e\u09a4\u09be\u09af\u09bc \u09b9\u09be\u099c\u09be\u09b0\u09cb \u099c\u09a8\u09cd\u09ae\u0995\u09c1\u09a3\u09cd\u09a1\u09b2\u09c0 \u0993 \u09b9\u09b8\u09cd\u09a4\u09b0\u09c7\u0996\u09be \u09ac\u09bf\u09b6\u09cd\u09b2\u09c7\u09b7\u09a3 \u0995\u09b0\u09c7\u099b\u09c7\u09a8\u0964 '
+ '<a href="' + SITE_URL + '/about.html">\u2192 \u0986\u09b0\u0993 \u099c\u09be\u09a8\u09c1\u09a8</a></p>\n'
+ '    </div>\n'
+ '  </div>\n\n';

// ════════════════════════════════════════
// RELATED POSTS BOX
// ════════════════════════════════════════
const RELATED_BOX =
'  <!-- Related -->\n'
+ '  <div class="related">\n'
+ '    <h4><i class="fas fa-book-open" style="color:var(--gold);margin-right:6px;"></i>\u0986\u09b0\u0993 \u09aa\u09dc\u09c1\u09a8</h4>\n'
+ '    <a href="' + SITE_URL + '/blog-list.html"><i class="fas fa-chevron-right"></i>\u09b8\u09ac \u09ac\u09cd\u09b2\u0997 \u09aa\u09cb\u09b8\u09cd\u099f \u09a6\u09c7\u0996\u09c1\u09a8</a>\n'
+ '    <a href="' + SITE_URL + '/rashifal.html"><i class="fas fa-chevron-right"></i>\u0986\u099c\u0995\u09c7\u09b0 \u09b0\u09be\u09b6\u09bf\u09ab\u09b2</a>\n'
+ '    <a href="' + SITE_URL + '/panjika.html"><i class="fas fa-chevron-right"></i>\u09ac\u09be\u0982\u09b2\u09be \u09aa\u099e\u09cd\u099c\u09bf\u0995\u09be</a>\n'
+ '    <a href="' + SITE_URL + '/astrology.html"><i class="fas fa-chevron-right"></i>\u099c\u09cd\u09af\u09cb\u09a4\u09bf\u09b7 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6</a>\n'
+ '  </div>\n\n';

// ════════════════════════════════════════
// FOOTER — index.html exact 4-column
// ════════════════════════════════════════
const FOOTER_HTML =
'<!-- FOOTER -->\n'
+ '<footer class="site-footer">\n'
+ '  <div class="footer-grid">\n'
+ '    <div class="footer-col">\n'
+ '      <h4>MyAstrology</h4>\n'
+ '      <p><i class="fas fa-map-marker-alt"></i>\u09b0\u09be\u09a3\u09be\u0998\u09be\u099f, \u09a8\u09a6\u09bf\u09af\u09bc\u09be, \u09aa\u09b6\u09cd\u099c\u09bf\u09ae\u09ac\u0999\u09cd\u0997 \u2014 \u09ed\u09ea\u09e7\u09e8\u09e6\u09e8</p>\n'
+ '      <p><i class="fas fa-phone"></i>+91 93331 22768</p>\n'
+ '      <p><i class="fas fa-envelope"></i>info@myastrology.in</p>\n'
+ '      <a href="https://wa.me/' + WA_NUMBER + '" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i>WhatsApp \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6</a>\n'
+ '      <a href="' + SITE_URL + '/astrology.html"><i class="fas fa-calendar-check"></i>\u0985\u09a8\u09b2\u09be\u0987\u09a8 \u09ac\u09c1\u0995\u09bf\u0982</a>\n'
+ '    </div>\n'
+ '    <div class="footer-col">\n'
+ '      <h4>\u09b8\u09c7\u09ac\u09be\u09b8\u09ae\u09c2\u09b9</h4>\n'
+ '      <a href="' + SITE_URL + '/palmistry.html">\u09b9\u09b8\u09cd\u09a4\u09b0\u09c7\u0996\u09be \u09ac\u09bf\u099a\u09be\u09b0</a>\n'
+ '      <a href="' + SITE_URL + '/astrology.html">\u099c\u09a8\u09cd\u09ae\u0995\u09c1\u09a3\u09cd\u09a1\u09b2\u09c0 \u09ac\u09bf\u09b6\u09cd\u09b2\u09c7\u09b7\u09a3</a>\n'
+ '      <a href="' + SITE_URL + '/astrology.html">\u0995\u09c1\u09a3\u09cd\u09a1\u09b2\u09c0 \u09ae\u09bf\u09b2\u09a8</a>\n'
+ '      <a href="' + SITE_URL + '/vastu-science.html">\u09ac\u09be\u09b8\u09cd\u09a4\u09c1 \u09b6\u09be\u09b8\u09cd\u09a4\u09cd\u09b0</a>\n'
+ '      <a href="' + SITE_URL + '/gemstone.html">\u09b0\u09a4\u09cd\u09a8\u09aa\u09be\u09a5\u09b0 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6</a>\n'
+ '      <a href="' + SITE_URL + '/rashifal.html">\u09a6\u09c8\u09a8\u09a8\u09cd\u09a6\u09bf\u09a8 \u09b0\u09be\u09b6\u09bf\u09ab\u09b2</a>\n'
+ '      <a href="' + SITE_URL + '/panjika.html">\u09aa\u099e\u09cd\u099c\u09bf\u0995\u09be</a>\n'
+ '    </div>\n'
+ '    <div class="footer-col">\n'
+ '      <h4>\u09a4\u09a5\u09cd\u09af</h4>\n'
+ '      <a href="' + SITE_URL + '/about.html">\u09a1. \u0986\u099a\u09be\u09b0\u09cd\u09af \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995\u09c7</a>\n'
+ '      <a href="' + SITE_URL + '/blog-list.html">\u09ac\u09cd\u09b2\u0997 \u09b8\u09ae\u09c2\u09b9</a>\n'
+ '      <a href="' + SITE_URL + '/gallery.html">\u0997\u09cd\u09af\u09be\u09b2\u09be\u09b0\u09bf</a>\n'
+ '      <a href="' + SITE_URL + '/reviews.html">\u09b8\u09ae\u09b8\u09cd\u09a4 \u09b0\u09bf\u09ad\u09bf\u0989</a>\n'
+ '      <a href="' + SITE_URL + '/vedic-astronomy.html">\u099c\u09cd\u09af\u09cb\u09a4\u09bf\u09b0\u09cd\u09ac\u09bf\u099c\u09cd\u099e\u09be\u09a8</a>\n'
+ '      <a href="' + SITE_URL + '/contact.html">\u09af\u09cb\u0997\u09be\u09af\u09cb\u0997</a>\n'
+ '      <a href="' + SITE_URL + '/privacy-policy.html">Privacy Policy</a>\n'
+ '      <a href="' + SITE_URL + '/terms-of-use.html">Terms of Use</a>\n'
+ '    </div>\n'
+ '    <div class="footer-col">\n'
+ '      <h4>\u09b8\u09c7\u09ac\u09be \u098f\u09b2\u09be\u0995\u09be</h4>\n'
+ '      <p>\u09b0\u09be\u09a3\u09be\u0998\u09be\u099f &middot; \u09a8\u09a6\u09bf\u09af\u09bc\u09be &middot; \u0995\u09b2\u0995\u09be\u09a4\u09be &middot; \u09aa\u09b6\u09cd\u099c\u09bf\u09ae\u09ac\u0999\u09cd\u0997 &middot; \u0989\u09a4\u09cd\u09a4\u09b0\u09ac\u0999\u09cd\u0997 &middot; \u099d\u09be\u09dc\u0996\u09a3\u09cd\u09a1 &middot; \u09a4\u09cd\u09b0\u09bf\u09aa\u09c1\u09b0\u09be &middot; \u0986\u09b8\u09be\u09ae &middot; \u09a6\u09bf\u09b2\u09cd\u09b2\u09bf &middot; \u09ae\u09c1\u09ae\u09cd\u09ac\u09be\u0987 &middot; \u09b8\u09be\u09b0\u09be \u09ad\u09be\u09b0\u09a4\u09c7 \u0985\u09a8\u09b2\u09be\u0987\u09a8</p>\n'
+ '      <p style="margin-top:10px;font-size:.78rem;color:var(--gold);letter-spacing:.04em">&#9654; \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6 \u09b6\u09c1\u09a7\u09c1\u09ae\u09be\u09a4\u09cd\u09b0 \u09ac\u09be\u0982\u09b2\u09be \u0993 \u09b9\u09bf\u09a8\u09cd\u09a6\u09bf\u09a4\u09c7</p>\n'
+ '    </div>\n'
+ '  </div>\n'
+ '  <div class="footer-bottom">\n'
+ '    <p>&#169; 2026 MyAstrology &nbsp;&middot;&nbsp; \u09a1. \u09aa\u09cd\u09b0\u09a6\u09cd\u09af\u09c1\u09ce \u0986\u099a\u09be\u09b0\u09cd\u09af, PhD in Vedic Jyotish &nbsp;&middot;&nbsp; \u09b0\u09be\u09a3\u09be\u0998\u09be\u099f &nbsp;&middot;&nbsp;\n'
+ '      <a href="' + SITE_URL + '/about.html">About</a> &nbsp;&middot;&nbsp;\n'
+ '      <a href="' + SITE_URL + '/privacy-policy.html">Privacy Policy</a> &nbsp;&middot;&nbsp;\n'
+ '      <a href="' + SITE_URL + '/terms-of-use.html">Terms of Use</a>\n'
+ '    </p>\n'
+ '    <div class="social-row">\n'
+ '      <a href="https://wa.me/' + WA_NUMBER + '" target="_blank" rel="noopener" class="s-wa" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>\n'
+ '      <a href="https://www.facebook.com/Dr.ProdyutAcharya" target="_blank" rel="noopener" class="s-fb" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>\n'
+ '      <a href="https://youtube.com/@myastrology" target="_blank" rel="noopener" class="s-yt" aria-label="YouTube"><i class="fab fa-youtube"></i></a>\n'
+ '      <a href="https://www.instagram.com/myastrology.in" target="_blank" rel="noopener" class="s-ig" aria-label="Instagram"><i class="fab fa-instagram"></i></a>\n'
+ '      <a href="https://x.com/AcharyaProdyut" target="_blank" rel="noopener" class="s-tw" aria-label="X Twitter"><i class="fab fa-x-twitter"></i></a>\n'
+ '      <a href="https://www.linkedin.com/in/ProdyutAcharya" target="_blank" rel="noopener" class="s-li" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>\n'
+ '    </div>\n'
+ '  </div>\n'
+ '</footer>\n\n';

// ════════════════════════════════════════
// RAZORPAY MODALS — index.html exact
// ════════════════════════════════════════
const RZP_MODALS =
'<!-- STEP 1: BOOKING MODAL -->\n'
+ '<div id="book-overlay" role="dialog" aria-modal="true" aria-labelledby="bookModalTitle">\n'
+ '  <div id="book-modal">\n'
+ '    <button class="bm-close-x" onclick="closeBooking()" aria-label="\u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8">&times;</button>\n'
+ '    <div class="bm-header">\n'
+ '      <img src="' + LOGO_IMG + '" alt="MyAstrology Logo" class="bm-logo">\n'
+ '      <div class="bm-brand" id="bookModalTitle">MyAstrology \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6 \u09ac\u09c1\u0995\u09bf\u0982</div>\n'
+ '    </div>\n'
+ '    <div class="bm-svc-info">\n'
+ '      <span class="bm-svc-name" id="bmSvcName">\u2014</span>\n'
+ '      <span class="bm-svc-price" id="bmSvcPrice">\u2014</span>\n'
+ '    </div>\n'
+ '    <div>\n'
+ '      <label class="bm-label" for="bmName">\u0986\u09aa\u09a8\u09be\u09b0 \u09a8\u09be\u09ae <span class="bm-req">*</span></label>\n'
+ '      <input class="bm-inp" type="text" id="bmName" placeholder="\u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09a8\u09be\u09ae \u09b2\u09bf\u0996\u09c1\u09a8" autocomplete="name">\n'
+ '      <label class="bm-label" for="bmPhone">WhatsApp \u09a8\u09ae\u09cd\u09ac\u09b0 <span class="bm-req">*</span></label>\n'
+ '      <div class="bm-phone-wrap">\n'
+ '        <span class="bm-prefix">\ud83c\uddee\ud83c\uddf3 +91</span>\n'
+ '        <input class="bm-inp bm-inp-tel" type="tel" id="bmPhone" placeholder="10-\u09b8\u0982\u0996\u09cd\u09af\u09be\u09b0 \u09ae\u09cb\u09ac\u09be\u0987\u09b2" maxlength="10" autocomplete="tel">\n'
+ '      </div>\n'
+ '    </div>\n'
+ '    <button class="bm-proceed-btn" onclick="proceedToRazorpay()">\ud83d\udd12 \u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f\u09c7 \u098f\u0997\u09bf\u09af\u09bc\u09c7 \u09af\u09be\u09a8</button>\n'
+ '    <p class="bm-secure-note"><i class="fas fa-lock" style="color:var(--gold);margin-right:4px"></i>Razorpay \u09a6\u09cd\u09ac\u09be\u09b0\u09be \u09b8\u09c1\u09b0\u0995\u09cd\u09b7\u09bf\u09a4 &nbsp;\u00b7\u00a0 UPI \u00b7 Card \u00b7 Net Banking</p>\n'
+ '  </div>\n'
+ '</div>\n\n'
// Step 2 success modal
+ '<!-- STEP 2: SUCCESS MODAL -->\n'
+ '<div id="rzp-success-overlay" role="dialog" aria-modal="true">\n'
+ '  <div id="rzp-success-modal">\n'
+ '    <button class="bm-close-x" onclick="closeSuccess()" aria-label="\u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8">&times;</button>\n'
+ '    <div class="success-ring">\n'
+ '      <svg class="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">\n'
+ '        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>\n'
+ '        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>\n'
+ '      </svg>\n'
+ '    </div>\n'
+ '    <h3 class="success-title">\u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u09b8\u09ab\u09b2! \ud83d\ude4f</h3>\n'
+ '    <p class="success-msg" id="successMsg">\u0986\u09aa\u09a8\u09be\u09b0 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6 \u09ac\u09c1\u0995 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964</p>\n'
+ '    <div class="pid-box">\n'
+ '      <span class="pid-label">Payment ID</span>\n'
+ '      <span class="pid-value" id="successPid">\u2014</span>\n'
+ '    </div>\n'
+ '    <a id="successWaBtn" href="#" target="_blank" rel="noopener" class="success-wa-btn">\n'
+ '      <i class="fab fa-whatsapp"></i>&nbsp;WhatsApp-\u098f \u09a4\u09a5\u09cd\u09af \u09aa\u09be\u09a0\u09be\u09a8</a>\n'
+ '    <p class="success-note">\u098f\u0987 WhatsApp \u09b2\u09bf\u0999\u09cd\u0995\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u09ac\u09bf\u09b8\u09cd\u09a4\u09be\u09b0\u09bf\u09a4 \u09a4\u09a5\u09cd\u09af \u0993 Payment ID \u09aa\u09be\u09a0\u09be\u09a8\u0964</p>\n'
+ '  </div>\n'
+ '</div>\n\n';

// ════════════════════════════════════════
// FLOATING WHATSAPP — right
// ════════════════════════════════════════
const WA_FLOAT =
'<!-- FLOATING WHATSAPP -->\n'
+ '<div class="wa-float" id="waFloat">\n'
+ '  <div class="wa-bubble" id="waBubble"></div>\n'
+ '  <a href="https://wa.me/' + WA_NUMBER + '?text=' + WA_TEXT_ENC + '"\n'
+ '     target="_blank" rel="noopener" class="wa-btn-fl" aria-label="Chat on WhatsApp">\n'
+ '    <i class="fab fa-whatsapp"></i>\n'
+ '  </a>\n'
+ '</div>\n\n';

// ════════════════════════════════════════
// BACK TO TOP — left
// ════════════════════════════════════════
const BTT_BUTTON =
'<!-- BACK TO TOP -->\n'
+ '<button id="back-to-top" aria-label="\u0989\u09aa\u09b0\u09c7 \u09af\u09be\u09a8" title="\u0989\u09aa\u09b0\u09c7 \u09af\u09be\u09a8">\u2b06</button>\n\n';

// ════════════════════════════════════════
// SCRIPTS — index.html exact + Razorpay
// ════════════════════════════════════════
const SCRIPTS =
'<script data-cfasync="false">\n'
+ '/* Nav toggle */\n'
+ 'function toggleNav(){\n'
+ '  var nav=document.getElementById(\'navMenu\'),ov=document.getElementById(\'navOverlay\');\n'
+ '  nav.classList.toggle(\'open\');\n'
+ '  ov.classList.toggle(\'open\');\n'
+ '  document.body.classList.toggle(\'nav-open\',nav.classList.contains(\'open\'));\n'
+ '}\n'
+ 'function closeNav(){\n'
+ '  document.getElementById(\'navMenu\').classList.remove(\'open\');\n'
+ '  document.getElementById(\'navOverlay\').classList.remove(\'open\');\n'
+ '  document.body.classList.remove(\'nav-open\');\n'
+ '}\n'
+ '/* Close nav on outside click */\n'
+ 'document.addEventListener(\'click\',function(e){\n'
+ '  var nav=document.getElementById(\'navMenu\'),ham=document.querySelector(\'.ham\');\n'
+ '  if(nav.classList.contains(\'open\')&&!nav.contains(e.target)&&!ham.contains(e.target)){closeNav();}\n'
+ '});\n'
+ '/* Close nav when link clicked */\n'
+ 'document.querySelectorAll(\'#navMenu a\').forEach(function(a){\n'
+ '  a.addEventListener(\'click\',function(){closeNav();});\n'
+ '});\n\n'
+ '/* ── 2-STEP RAZORPAY PAYMENT FLOW (index.html exact) ── */\n'
+ 'var _svc={label:\'\',amount:0,price:\'\',oldprice:\'\'};\n'
+ 'var WA_NUM=\'' + WA_NUMBER + '\';\n'
+ 'var RZP_KEY=\'' + RZP_KEY + '\';\n'
+ 'var RZP_LOGO=\'' + LOGO_IMG + '\';\n\n'
+ 'function openRzp(label,amount,key,price,oldprice){\n'
+ '  _svc={label:label,amount:amount,price:price||\'\'  ,oldprice:oldprice||\'\'};\n'
+ '  document.getElementById(\'bmSvcName\').textContent=label;\n'
+ '  document.getElementById(\'bmSvcPrice\').textContent=price?\'\\u20b9\'+price:\'\';\n'
+ '  document.getElementById(\'bmName\').value=\'\';\n'
+ '  document.getElementById(\'bmPhone\').value=\'\';\n'
+ '  document.getElementById(\'bmName\').classList.remove(\'err\');\n'
+ '  document.getElementById(\'bmPhone\').classList.remove(\'err\');\n'
+ '  var ov=document.getElementById(\'book-overlay\');\n'
+ '  ov.style.display=\'flex\';\n'
+ '  requestAnimationFrame(function(){ov.classList.add(\'show\');});\n'
+ '  document.body.style.overflow=\'hidden\';\n'
+ '  setTimeout(function(){document.getElementById(\'bmName\').focus();},350);\n'
+ '}\n'
+ 'function closeBooking(){\n'
+ '  var ov=document.getElementById(\'book-overlay\');\n'
+ '  ov.classList.remove(\'show\');\n'
+ '  setTimeout(function(){ov.style.display=\'none\';},300);\n'
+ '  document.body.style.overflow=\'\';\n'
+ '}\n'
+ 'function proceedToRazorpay(){\n'
+ '  var name=document.getElementById(\'bmName\').value.trim();\n'
+ '  var phone=document.getElementById(\'bmPhone\').value.replace(/\\D/g,\'\').slice(0,10);\n'
+ '  var nameEl=document.getElementById(\'bmName\');\n'
+ '  var phoneEl=document.getElementById(\'bmPhone\');\n'
+ '  nameEl.classList.remove(\'err\');phoneEl.classList.remove(\'err\');\n'
+ '  var ok=true;\n'
+ '  if(!name){nameEl.classList.add(\'err\');nameEl.focus();ok=false;}\n'
+ '  else if(!phone||phone.length<10){phoneEl.classList.add(\'err\');phoneEl.focus();ok=false;}\n'
+ '  if(!ok)return;\n'
+ '  if(typeof Razorpay===\'undefined\'){alert(\'\u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u0997\u09c7\u099f\u0993\u09af\u09bc\u09c7 \u09b2\u09cb\u09a1 \u09b9\u099a\u09cd\u099b\u09c7, \u098f\u0995\u099f\u09c1 \u0985\u09aa\u09c7\u0995\u09cd\u09b7\u09be \u0995\u09b0\u09c1\u09a8\u0964\');return;}\n'
+ '  var rzp=new Razorpay({\n'
+ '    key:RZP_KEY,amount:_svc.amount,currency:\'INR\',\n'
+ '    name:\'MyAstrology\',description:_svc.label,image:RZP_LOGO,\n'
+ '    prefill:{name:name,contact:\'+91\'+phone},\n'
+ '    notes:{service:_svc.label,customer:name,whatsapp:phone},\n'
+ '    theme:{color:\'#b8860b\'},modal:{backdropclose:false,escape:false},\n'
+ '    handler:function(res){\n'
+ '      closeBooking();\n'
+ '      if(typeof gtag!==\'undefined\')gtag(\'event\',\'booking_paid\',{event_category:\'conversion\',event_label:_svc.label,value:_svc.amount/100});\n'
+ '      showSuccess(name,phone,res.razorpay_payment_id);\n'
+ '    }\n'
+ '  });\n'
+ '  rzp.on(\'payment.failed\',function(resp){alert(\'\u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u09ac\u09bf\u09ab\u09b2 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964 \u09aa\u09c1\u09a8\u09b0\u09be\u09af\u09bc \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09c1\u09a8\u0964\\n\'+(resp.error.description||\'\'));});\n'
+ '  rzp.open();\n'
+ '}\n'
+ 'function showSuccess(name,phone,pid){\n'
+ '  var NL=\'\\n\';\n'
+ '  var msg=\'\ud83d\ude4f \u09a8\u09ae\u09b8\u09cd\u0995\u09be\u09b0! \u0986\u09ae\u09bf \'+_svc.label+\'-\u098f\u09b0 \u099c\u09a8\u09cd\u09af \u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8 \u0995\u09b0\u09c7\u099b\u09bf\u0964\'+NL+NL\n'
+ '        +\'\ud83d\udc64 \u09a8\u09be\u09ae: \'+name+NL\n'
+ '        +\'\ud83d\udcf1 WhatsApp: +91\'+phone+NL\n'
+ '        +\'\ud83d\uded2 \u09b8\u09c7\u09ac\u09be: \'+_svc.label+NL\n'
+ '        +(_svc.price?\'\ud83d\udcb0 \u09ae\u09c2\u09b2\u09cd\u09af: \u20b9\'+_svc.price+NL:\'\')\n'
+ '        +(pid?\'\ud83c\udd94 Payment ID: \'+pid:\'\')+NL+NL\n'
+ '        +\'\ud83d\udccb \u0985\u09a8\u09c1\u0997\u09cd\u09b0\u09b9 \u0995\u09b0\u09c7 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6\u09c7\u09b0 \u09a4\u09be\u09b0\u09bf\u0996 \u0993 \u09b8\u09ae\u09af\u09bc \u099c\u09be\u09a8\u09be\u09a8\u0964 \u09a7\u09a8\u09cd\u09af\u09ac\u09be\u09a6! \ud83d\ude4f\';\n'
+ '  document.getElementById(\'successWaBtn\').href=\'https://wa.me/\'+WA_NUM+\'?text=\'+encodeURIComponent(msg);\n'
+ '  document.getElementById(\'successMsg\').textContent=name+\' \u2014 \u0986\u09aa\u09a8\u09be\u09b0 \u09aa\u09c7\u09ae\u09c7\u09a8\u09cd\u099f \u09b8\u09ab\u09b2\u09ad\u09be\u09ac\u09c7 \u0997\u09c3\u09b9\u09c0\u09a4 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964 \u2705\';\n'
+ '  document.getElementById(\'successPid\').textContent=pid||\'—\';\n'
+ '  var ov=document.getElementById(\'rzp-success-overlay\');\n'
+ '  ov.style.display=\'flex\';\n'
+ '  requestAnimationFrame(function(){ov.classList.add(\'show\');});\n'
+ '  document.body.style.overflow=\'hidden\';\n'
+ '}\n'
+ 'function closeSuccess(){\n'
+ '  var ov=document.getElementById(\'rzp-success-overlay\');\n'
+ '  ov.classList.remove(\'show\');\n'
+ '  setTimeout(function(){ov.style.display=\'none\';},300);\n'
+ '  document.body.style.overflow=\'\';\n'
+ '}\n'
+ 'document.getElementById(\'book-overlay\').addEventListener(\'click\',function(e){if(e.target===this)closeBooking();});\n'
+ 'document.getElementById(\'rzp-success-overlay\').addEventListener(\'click\',function(e){if(e.target===this)closeSuccess();});\n'
+ '[\'bmName\',\'bmPhone\'].forEach(function(id){var el=document.getElementById(id);if(el)el.addEventListener(\'keydown\',function(e){if(e.key===\'Enter\')proceedToRazorpay();});});\n'
+ 'document.getElementById(\'bmPhone\').addEventListener(\'input\',function(){this.value=this.value.replace(/\\D/g,\'\').slice(0,10);});\n'
+ 'document.addEventListener(\'keydown\',function(e){if(e.key===\'Escape\'){closeBooking();closeSuccess();closeNav();}});\n\n'
+ '/* Rotating WA Flash Messages */\n'
+ '(function(){\n'
+ '  var msgs=[\'\ud83d\udd2e \u0995\u09c1\u09a3\u09cd\u09a1\u09b2\u09c0 \u09ac\u09bf\u09b6\u09cd\u09b2\u09c7\u09b7\u09a3 \u0995\u09b0\u09c1\u09a8\',\'\ud83c\udf1f \u0986\u099c\u0987 \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6 \u09a8\u09bf\u09a8\',\'\u270b \u09b9\u09b8\u09cd\u09a4\u09b0\u09c7\u0996\u09be \u09ac\u09bf\u099a\u09be\u09b0 \u0995\u09b0\u09c1\u09a8\',\'\u2b50 \u09e7\u09e6,\u09e6\u09e6\u09e6+ \u09b8\u09a8\u09cd\u09a4\u09c1\u09b7\u09cd\u099f \u0997\u09cd\u09b0\u09be\u09b9\u0995\',\'\ud83d\udcac \u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc Online \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6\',\'\ud83d\ude4f \u098f\u0996\u09a8\u0987 WhatsApp \u0995\u09b0\u09c1\u09a8\',\'\ud83d\udcbf Jyotish \u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6 \u09a8\u09bf\u09a8\',\'\ud83d\udc8d \u09af\u09cb\u099f\u09cb\u0995 \u09ac\u09bf\u099a\u09be\u09b0 \u0995\u09b0\u09c1\u09a8\'];\n'
+ '  var idx=0,bubble=document.getElementById(\'waBubble\');\n'
+ '  if(!bubble)return;\n'
+ '  function showMsg(){\n'
+ '    bubble.style.display=\'block\';bubble.textContent=msgs[idx];bubble.classList.add(\'show\');\n'
+ '    setTimeout(function(){bubble.classList.remove(\'show\');setTimeout(function(){bubble.style.display=\'none\';},400);},4000);\n'
+ '    idx=(idx+1)%msgs.length;\n'
+ '  }\n'
+ '  setTimeout(function(){showMsg();setInterval(showMsg,6000);},2500);\n'
+ '})();\n\n'
+ '/* Back To Top */\n'
+ '(function(){\n'
+ '  var btn=document.getElementById(\'back-to-top\');if(!btn)return;\n'
+ '  window.addEventListener(\'scroll\',function(){btn.classList.toggle(\'visible\',window.scrollY>400);},{passive:true});\n'
+ '  btn.addEventListener(\'click\',function(){window.scrollTo({top:0,behavior:\'smooth\'});});\n'
+ '})();\n\n'
+ '/* GA4 */\n'+ 'document.addEventListener(\'click\',function(e){'+ 'var a=e.target.closest(\'a\');if(!a)return;'+ 'var h=a.getAttribute(\'href\')||\'\';'+ 'if(h.includes(\'wa.me\')&&typeof gtag!==\'undefined\')gtag(\'event\',\'whatsapp_click\',{event_category:\'engagement\',event_label:a.innerText.trim()||\'WhatsApp\'});'+ 'if(h.startsWith(\'tel:\')&&typeof gtag!==\'undefined\')gtag(\'event\',\'phone_click\',{event_category:\'engagement\'});'+ '});\n'
+ '</script>\n'
+ '</body>\n</html>';

// ════════════════════════════════════════
// MAIN
// ════════════════════════════════════════
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
let count = 0;

files.forEach(file => {
  const raw     = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const meta    = parseFrontmatter(raw);
  // slug: use frontmatter slug, else filename without .md
  const slug    = meta.slug || file.replace(/\.md$/, '');
  if (!meta.title) meta.title = slug.replace(/-/g, ' ');
  const body    = markdownToHtml(raw);
  const html    = buildHtml(meta, body, slug);
  fs.writeFileSync(path.join(OUTPUT_DIR, slug + '.html'), html, 'utf8');
  count++;
  console.log('\u2705 blog/' + slug + '.html');
});

console.log('\n\ud83d\udcdd \u09ae\u09cb\u099f: ' + count + '\u099f\u09bf HTML \u09ab\u09be\u0987\u09b2 \u09a4\u09c8\u09b0\u09bf \u09b9\u09af\u09bc\u09c7\u099b\u09c7');
