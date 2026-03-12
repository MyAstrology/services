'use strict';

const fs   = require('fs');
const path = require('path');

// ── Constants ──────────────────────────────────────────────────────
const BLOG_DIR     = path.join(__dirname, 'src', 'content', 'blog');
const OUTPUT_DIR   = path.join(__dirname, 'blog');
const SITE_URL     = 'https://www.myastrology.in';
const GA_ID        = 'G-S7BQGLP211';
const WA_NUMBER    = '919333122768';
const RAZORPAY_URL = 'https://pages.razorpay.com/pl_PSd8AAe189ECFo/view';
const DEFAULT_IMG  = `${SITE_URL}/images/MyAstrology-Ranghat-logo.png`;
const LOGO_IMG     = `${SITE_URL}/images/MyAstrology-Ranghat-logo.png`;

// ── Frontmatter parser ─────────────────────────────────────────────
function parseFrontmatter(content) {
  const meta = { title:'', description:'', date:'', image:'', tags:[] };
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return meta;
  const lines = match[1].split('\n');
  let inTags = false;
  lines.forEach(line => {
    if (/^tags\s*:/.test(line)) { inTags = true; return; }
    if (inTags) {
      if (/^\s{2,}-\s+/.test(line)) {
        meta.tags.push(line.replace(/^\s+-\s+/,'').replace(/^["']|["']$/g,'').trim());
        return;
      }
      inTags = false;
    }
    const ci = line.indexOf(':');
    if (ci === -1) return;
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci+1).trim().replace(/^["']|["']$/g,'');
    if (key === 'title')       meta.title       = val;
    if (key === 'description') meta.description = val;
    if (key === 'date')        meta.date        = val;
    if (key === 'image')       meta.image       = val;
    if (key === 'tags' && val.includes('[')) {
      meta.tags = val.replace(/[\[\]]/g,'').split(',')
        .map(t => t.trim().replace(/^["']|["']$/g,'')).filter(Boolean);
    }
  });
  return meta;
}

// ── Image URL normalizer ───────────────────────────────────────────
function normalizeImage(img, slug) {
  if (!img) return `${SITE_URL}/images/${slug}.webp`;
  return img
    .replace('https://astro.myastrology.in', SITE_URL)
    .replace('http://astro.myastrology.in',  SITE_URL);
}

// ── Safe JSON string ───────────────────────────────────────────────
function jsonStr(s) {
  return (s||'')
    .replace(/\\/g,'\\\\').replace(/"/g,'\\"')
    .replace(/\n/g,'\\n').replace(/\r/g,'\\r')
    .replace(/<\/script>/gi,'<\\/script>');
}

// ── Markdown → HTML ────────────────────────────────────────────────
function markdownToHtml(raw) {
  let md = raw.replace(/^---[\s\S]*?---\n?/, '');
  const html = [];
  md.split(/\n{2,}/).forEach(block => {
    block = block.trim();
    if (!block) return;
    // HR
    if (/^---+$/.test(block)) { html.push('<hr>'); return; }
    // Raw HTML
    if (/^<(div|section|article|figure|table|ul|ol|blockquote|hr|h[1-6]|p\s)/i.test(block)) {
      html.push(block); return;
    }
    // Headings
    if (/^#{1,6}\s/.test(block)) {
      html.push(block
        .replace(/^######\s(.+)$/gm,'<h6>$1</h6>')
        .replace(/^#####\s(.+)$/gm, '<h5>$1</h5>')
        .replace(/^####\s(.+)$/gm,  '<h4>$1</h4>')
        .replace(/^###\s(.+)$/gm,   '<h3>$1</h3>')
        .replace(/^##\s(.+)$/gm,    '<h2>$1</h2>')
        .replace(/^#\s(.+)$/gm,     '<h1>$1</h1>')
      ); return;
    }
    // Blockquote
    if (/^>\s/.test(block)) {
      html.push(`<blockquote>${applyInline(block.replace(/^>\s?/gm,'').trim())}</blockquote>`);
      return;
    }
    // Table
    if (/^\|.+\|/.test(block)) {
      const rows = block.split('\n').filter(r => r.trim());
      const isHdr = rows.length > 1 && /^\|[-\s|:]+\|$/.test(rows[1]);
      let t = '<div class="tbl-wrap"><table>\n';
      rows.forEach((row, i) => {
        if (isHdr && i === 1) return;
        const cells = row.split('|').map(c=>c.trim()).filter(c=>c!=='');
        const tag = (isHdr && i===0) ? 'th' : 'td';
        t += '<tr>' + cells.map(c=>`<${tag}>${applyInline(c)}</${tag}>`).join('') + '</tr>\n';
      });
      html.push(t + '</table></div>'); return;
    }
    // UL
    if (/^\s*[-*]\s/.test(block)) {
      html.push('<ul>\n' + block.split('\n')
        .filter(l=>/^\s*[-*]\s/.test(l))
        .map(l=>`<li>${applyInline(l.replace(/^\s*[-*]\s/,''))}</li>`).join('\n') + '\n</ul>');
      return;
    }
    // OL
    if (/^\s*\d+\.\s/.test(block)) {
      html.push('<ol>\n' + block.split('\n')
        .filter(l=>/^\s*\d+\.\s/.test(l))
        .map(l=>`<li>${applyInline(l.replace(/^\s*\d+\.\s/,''))}</li>`).join('\n') + '\n</ol>');
      return;
    }
    // Paragraph
    html.push(`<p>${applyInline(block.replace(/\n/g,'<br>'))}</p>`);
  });
  return html.join('\n');
}

function applyInline(t) {
  return t
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>');
}

// ── Date formatter (Bengali) ───────────────────────────────────────
function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('bn-IN', { year:'numeric', month:'long', day:'numeric' });
}

// ── HTML builder ───────────────────────────────────────────────────
function buildHtml(meta, body, slug) {
  const pageUrl  = `${SITE_URL}/blog/${slug}.html`;
  const ogImage  = normalizeImage(meta.image, slug);
  const tagsHtml = meta.tags.length
    ? meta.tags.map(t=>`<span class="tag">${t}</span>`).join(' ') : '';

  return `<!DOCTYPE html>
<html lang="bn-IN" translate="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${meta.title} | MyAstrology</title>
<meta name="description" content="${meta.description}">
<meta name="author" content="Dr. Prodyut Acharya">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="canonical" href="${pageUrl}">
<meta property="og:title"       content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url"         content="${pageUrl}">
<meta property="og:type"        content="article">
<meta property="og:image"       content="${ogImage}">
<meta property="og:image:alt"   content="${meta.title}">
<meta property="og:locale"      content="bn_IN">
<meta property="og:site_name"   content="MyAstrology \u2013 Dr. Prodyut Acharya">
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="${meta.title}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image"       content="${ogImage}">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BlogPosting",
"headline":"${jsonStr(meta.title)}","description":"${jsonStr(meta.description)}",
"datePublished":"${meta.date}","dateModified":"${meta.date}",
"image":"${jsonStr(ogImage)}","url":"${pageUrl}",
"author":{"@type":"Person","name":"Dr. Prodyut Acharya","url":"${SITE_URL}/about.html"},
"publisher":{"@type":"Organization","name":"MyAstrology",
"logo":{"@type":"ImageObject","url":"${DEFAULT_IMG}"}}}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
<link rel="icon" type="image/x-icon" href="${SITE_URL}/images/favicon.ico">
<link rel="apple-touch-icon"         href="${SITE_URL}/images/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&family=Playfair+Display:wght@700&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous"></noscript>
<style>
:root{
  --navy:#0a192f;--navy2:#0e1e38;--navy3:#112240;
  --gold:#b8860b;--gold2:#c8950c;--gold3:#ffd700;
  --gold-lt:#fff4ca;--gold-bg:#fdf8ed;
  --bg:#FFF9F0;--tx:#2C1810;--mu:#6B4C3B;--bd:#E8D5B7;
  --fh:'Playfair Display',Georgia,serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Noto Serif Bengali',serif;background:var(--bg);color:var(--tx);line-height:1.9;font-size:1.05rem;padding-top:66px;}
img{max-width:100%;height:auto;display:block;}
a{text-decoration:none;color:inherit;}

/* ── Skip link ── */
.skip-link{position:absolute;top:-40px;left:0;background:var(--navy);color:var(--gold-lt);padding:8px 14px;z-index:9999;font-size:.85rem;transition:top .2s;}
.skip-link:focus{top:0;}

/* ════════════════════════
   HEADER — index.html exact
   ════════════════════════ */
.site-header{
  position:fixed;width:100%;top:0;z-index:900;
  display:flex;align-items:center;gap:12px;
  padding:0 20px;height:66px;
  background:var(--navy);
  box-shadow:0 2px 18px rgba(0,0,0,.5);
  border-bottom:2px solid var(--gold);
}
/* হ্যামবার্গার — বাঁয়ে */
.ham{
  background:rgba(255,255,255,.06);
  border:1.5px solid rgba(184,134,11,.45);
  cursor:pointer;color:var(--gold-lt);
  font-size:1.25rem;width:44px;height:44px;
  display:flex;align-items:center;justify-content:center;
  border-radius:7px;flex-shrink:0;transition:background .2s;
}
.ham:hover{background:rgba(184,134,11,.18);}
/* Brand — মাঝে */
.header-brand{
  font-family:var(--fh);font-size:1.18rem;font-weight:700;
  color:var(--gold-lt);letter-spacing:.05em;flex:1;text-align:center;
}
/* Logo — ডানে */
.header-logo{
  width:46px;height:46px;border-radius:8px;
  object-fit:contain;background:var(--navy);
  padding:2px;flex-shrink:0;
}

/* ════════════════════════
   NAV — full-width dropdown
   ════════════════════════ */
.nav{
  display:none;flex-direction:column;
  position:fixed;top:66px;left:0;right:0;
  background:var(--navy2);border-top:2px solid var(--gold);
  z-index:899;max-height:82vh;overflow-y:auto;
  box-shadow:0 10px 30px rgba(0,0,0,.45);
}
.nav.open{display:flex;}
.nav-overlay{display:none;position:fixed;inset:0;top:66px;background:rgba(0,0,0,.45);z-index:898;}
.nav-overlay.open{display:block;}
.nav a{
  color:#b0c4dc;padding:12px 22px;
  font-size:.93rem;font-weight:600;
  border-bottom:1px solid rgba(255,255,255,.06);
  transition:background .2s,color .2s;
}
.nav a i{width:20px;margin-right:9px;color:var(--gold3);opacity:.85;}
.nav a:hover{background:rgba(184,134,11,.12);color:var(--gold-lt);}
.nav a.wa-nav{color:#4ade80;font-weight:700;}
body.nav-open{overflow-y:hidden;}
body.nav-open .wa-float,body.nav-open #back-to-top{display:none!important;}

/* ════════════
   MAIN
   ════════════ */
main{max-width:780px;margin:0 auto;padding:32px 18px 60px;}

.back-link{
  display:inline-flex;align-items:center;gap:6px;
  color:var(--gold);text-decoration:none;font-size:.87rem;
  margin-bottom:22px;opacity:.8;
}
.back-link:hover{opacity:1;text-decoration:underline;}
.back-link i{font-size:.8rem;}

/* ── Post header ── */
.post-header{margin-bottom:26px;border-bottom:2px solid var(--bd);padding-bottom:20px;}
.post-header h1{
  font-family:var(--fh);
  font-size:clamp(1.4rem,4vw,1.9rem);
  color:#1a2e48;line-height:1.35;margin-bottom:12px;
}
.post-meta{font-size:.83rem;color:var(--mu);margin-bottom:10px;display:flex;flex-wrap:wrap;gap:5px 14px;}
.post-meta i{color:var(--gold);margin-right:4px;}
.tags{margin-top:10px;}
.tag{
  display:inline-block;background:var(--gold-bg);
  color:var(--gold);font-size:.76rem;font-weight:700;
  padding:3px 10px;border-radius:20px;
  border:1px solid rgba(184,134,11,.28);
  margin:2px 3px 2px 0;
}
.featured-img{
  width:100%;max-height:400px;object-fit:cover;
  border-radius:10px;margin-bottom:18px;display:block;
  border-top:4px solid var(--gold);
}

/* ── Post body ── */
.post-body h2{
  font-family:var(--fh);
  color:#1a2e48;margin:28px 0 12px;font-size:1.35rem;
  border-left:4px solid var(--gold);padding-left:12px;line-height:1.4;
}
.post-body h3{
  font-family:var(--fh);
  color:#1a2e48;margin:22px 0 8px;font-size:1.1rem;padding-left:4px;
}
.post-body h4,.post-body h5,.post-body h6{color:var(--mu);margin:16px 0 6px;}
.post-body p{margin-bottom:16px;}
.post-body hr{border:none;border-top:1px solid var(--bd);margin:26px 0;}
.post-body blockquote{
  border-left:4px solid var(--gold);padding:12px 18px;
  background:var(--gold-bg);margin:20px 0;font-style:italic;
  color:var(--mu);border-radius:0 8px 8px 0;
  font-family:var(--fh);
}
.post-body a{color:#123d87;border-bottom:1px dotted;}
.post-body ul,.post-body ol{margin:10px 0 16px 22px;}
.post-body li{margin-bottom:7px;}
.post-body strong{color:var(--tx);}
.post-body img{max-width:100%;border-radius:8px;margin:14px 0;}

/* ── Table ── */
.tbl-wrap{overflow-x:auto;margin:16px 0 20px;border-radius:8px;border:1px solid var(--bd);}
.tbl-wrap table{width:100%;border-collapse:collapse;font-size:.9rem;}
.tbl-wrap th{background:var(--navy);color:var(--gold-lt);padding:10px 14px;text-align:left;font-weight:600;font-family:var(--fh);}
.tbl-wrap td{padding:9px 14px;border-bottom:1px solid var(--bd);vertical-align:top;}
.tbl-wrap tr:nth-child(even) td{background:var(--gold-bg);}
.tbl-wrap tr:last-child td{border-bottom:none;}

/* ── Panjika / Rashifal strip ── */
.pjk-strip{
  background:linear-gradient(135deg,#0d1547,#0a0f3d,#12122a);
  border-radius:12px;padding:16px 20px;margin:32px 0;
  border:1.5px solid rgba(255,180,0,.3);
  box-shadow:0 8px 32px rgba(0,0,0,.35);
  text-align:center;
}
.pjk-strip h3{
  font-family:var(--fh);color:#f5b800;font-size:1rem;
  margin:0 0 6px;text-shadow:0 2px 10px rgba(255,180,0,.4);
}
.pjk-strip p{color:#8a9fc8;font-size:.84rem;margin:0 0 12px;line-height:1.5;}
.pjk-tags{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-bottom:12px;}
.pjk-tags a{
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);
  color:#c8d8f0;font-size:.76rem;font-weight:600;
  padding:4px 10px;border-radius:50px;text-decoration:none;
  transition:.2s;
}
.pjk-tags a:hover{background:rgba(255,180,0,.12);color:#f5d080;border-color:rgba(255,180,0,.4);}
.pjk-btn{
  display:inline-block;
  background:linear-gradient(135deg,#f5b800,#e8a200);
  color:#1a0e00;font-weight:800;font-size:.9rem;
  padding:8px 30px;border-radius:50px;text-decoration:none;
  box-shadow:0 4px 16px rgba(245,184,0,.45);transition:all .3s;
}
.pjk-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(245,184,0,.6);}

/* ── CTA box ── */
.cta-box{
  background:linear-gradient(135deg,var(--navy),var(--navy2));
  border-top:2px solid var(--gold);
  color:#fff;border-radius:14px;padding:28px 22px;margin:38px 0 20px;text-align:center;
  box-shadow:0 8px 32px rgba(0,0,0,.3);
}
.cta-box h3{font-family:var(--fh);color:var(--gold-lt);margin-bottom:8px;font-size:1.15rem;}
.cta-box p{margin-bottom:16px;opacity:.85;font-size:.9rem;}
.cta-box strong{color:var(--gold3);}
.btn-wa-cta{
  display:inline-flex;align-items:center;gap:8px;
  background:#25D366;color:#fff;
  padding:11px 24px;border-radius:50px;font-weight:800;
  margin:5px;font-size:.9rem;text-decoration:none;
  box-shadow:0 4px 16px rgba(37,211,102,.4);transition:all .2s;
}
.btn-wa-cta:hover{background:#1ebe5d;transform:translateY(-2px);}
.btn-pay-cta{
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,var(--gold-lt),#ffe88a);
  color:#5a1f0a;
  padding:11px 24px;border-radius:50px;font-weight:800;
  margin:5px;font-size:.9rem;text-decoration:none;
  border:2px solid rgba(184,134,11,.4);transition:all .2s;
}
.btn-pay-cta:hover{transform:translateY(-2px);}

/* ── Author bio ── */
.author-bio{
  display:flex;align-items:flex-start;gap:14px;
  background:var(--gold-bg);border:1px solid var(--bd);
  border-radius:10px;padding:16px 18px;margin:0 0 20px;
}
.author-bio .ico{font-size:2.5rem;line-height:1;flex-shrink:0;}
.author-bio h4{font-family:var(--fh);margin:0 0 3px;color:#1a2e48;font-size:.95rem;}
.author-bio .sub{font-size:.8rem;color:var(--gold);margin:0 0 5px;font-weight:600;}
.author-bio p{font-size:.86rem;color:var(--mu);line-height:1.65;margin:0;}
.author-bio a{color:var(--gold);font-weight:600;border-bottom:1px dotted;}

/* ── Related posts ── */
.related{
  background:var(--gold-bg);border:1px solid var(--bd);
  border-radius:10px;padding:14px 18px;
}
.related h4{font-family:var(--fh);margin:0 0 10px;color:#1a2e48;font-size:.92rem;}
.related a{
  display:flex;align-items:center;gap:8px;
  color:#123d87;font-size:.88rem;line-height:2;
}
.related a i{color:var(--gold);font-size:.78rem;}
.related a:hover{color:var(--gold);}

/* ════════════════════════════════════
   FOOTER — index.html exact
   ════════════════════════════════════ */
.site-footer{
  background:linear-gradient(180deg,#0a1628 0%,#060e1a 100%);
  border-top:3px solid var(--gold);
  color:#6888a8;
  margin-top:50px;
}
.footer-grid{
  display:grid;
  grid-template-columns:1.6fr 1fr 1fr 1.1fr;
  gap:0;max-width:1080px;margin:0 auto;
  padding:44px 24px 36px;
  border-bottom:1px solid rgba(255,255,255,.05);
}
.footer-col{padding:0 28px 0 0;border-right:1px solid rgba(255,255,255,.05);}
.footer-col:first-child{padding-left:0;}
.footer-col:last-child{padding-right:0;border-right:none;}
.footer-col + .footer-col{padding-left:28px;}
.footer-col h4{
  font-family:var(--fh);color:var(--gold);
  font-size:.8rem;letter-spacing:.13em;text-transform:uppercase;
  margin-bottom:18px;padding-bottom:10px;
  border-bottom:1px solid rgba(184,134,11,.25);
}
.footer-col p,.footer-col a{
  font-size:.82rem;color:#8aabcb;
  display:block;margin-bottom:8px;
  transition:color .2s;line-height:1.65;
}
.footer-col a:hover{color:var(--gold-lt);}
.footer-col i{width:15px;margin-right:7px;opacity:.75;color:var(--gold);font-size:.78rem;}
.footer-bottom{
  max-width:1080px;margin:0 auto;padding:22px 24px;
  display:flex;align-items:center;justify-content:space-between;
  gap:12px;flex-wrap:wrap;
}
.footer-bottom p{font-size:.76rem;color:#3d5570;}
.footer-bottom a{color:#5a7a9a;border-bottom:1px solid #3d5570;}
.social-row{display:flex;gap:8px;flex-wrap:wrap;}
.social-row a{
  width:38px;height:38px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:.9rem;color:#fff;
  transition:transform .2s,filter .2s;filter:brightness(.8);
}
.social-row a:hover{transform:translateY(-3px);filter:brightness(1);}
.s-wa{background:#25d366;}.s-fb{background:#1877f2;}.s-yt{background:#ff0000;}
.s-ig{background:radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285aeb 90%);}
.s-tw{background:#14171a;}.s-li{background:#0077b5;}

/* ════════════════════
   FLOATING WHATSAPP — ডানে
   ════════════════════ */
.wa-float{position:fixed;bottom:26px;right:22px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
.wa-bubble{
  background:#fff;border-radius:8px;padding:6px 10px;
  font-size:.72rem;font-weight:600;color:#111;
  box-shadow:0 4px 20px rgba(0,0,0,.2);
  max-width:150px;text-align:center;display:none;
  font-family:'Noto Serif Bengali',serif;
}
.wa-bubble.show{display:block;animation:popIn .4s ease;}
.wa-btn-fl{
  width:44px;height:44px;border-radius:50%;
  background:#25d366;display:flex;align-items:center;
  justify-content:center;font-size:1.3rem;color:#fff;
  cursor:pointer;text-decoration:none;
  box-shadow:0 4px 20px rgba(37,211,102,.5);
  animation:waPulse 2.4s infinite;
}
.wa-btn-fl:hover{background:#1ebe5d;animation:none;transform:scale(1.07);}
@keyframes waPulse{
  0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.5);}
  50%{box-shadow:0 4px 34px rgba(37,211,102,.8),0 0 0 8px rgba(37,211,102,.1);}
}
@keyframes popIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}

/* ════════════════
   BACK TO TOP — বাঁয়ে
   ════════════════ */
#back-to-top{
  position:fixed;bottom:22px;left:18px;
  width:44px;height:44px;
  background:transparent;color:var(--gold3);
  border:none;border-radius:50%;font-size:1.1rem;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  opacity:0;transform:translateY(14px);
  transition:opacity .3s,transform .3s;z-index:800;
}
#back-to-top.visible{opacity:1;transform:translateY(0);}
#back-to-top:hover{background:var(--navy2);}

/* ════════════════
   RESPONSIVE
   ════════════════ */
@media(max-width:860px){
  .footer-grid{grid-template-columns:1fr 1fr;gap:0;}
  .footer-col{border-right:none;padding:0 0 24px 0!important;}
  .footer-col + .footer-col{padding-left:0!important;}
}
@media(max-width:480px){
  .footer-grid{grid-template-columns:1fr;}
  .footer-bottom{flex-direction:column;text-align:center;}
  .pjk-tags{gap:4px;}
}
@media(max-width:600px){
  main{padding:20px 14px 48px;}
}
</style>
</head>
<body>

<a class="skip-link" href="#main-content">মূল বিষয়বস্তুতে যান</a>

<!-- ══ HEADER ══════════════════════════════════════════════ -->
<header class="site-header">
  <button class="ham" onclick="toggleNav()" aria-label="মেনু খুলুন">
    <i class="fas fa-bars"></i>
  </button>
  <span class="header-brand">MyAstrology</span>
  <img src="${LOGO_IMG}" alt="MyAstrology Ranaghat Logo" class="header-logo" width="46" height="46" loading="eager">
</header>

<!-- ══ NAV ═════════════════════════════════════════════════ -->
<nav class="nav" id="navMenu" aria-label="মূল নেভিগেশন">
  <a href="${SITE_URL}/"><i class="fas fa-home"></i>হোম</a>
  <a href="${SITE_URL}/astrology.html"><i class="fas fa-star"></i>জ্যোতিষ শাস্ত্র</a>
  <a href="${SITE_URL}/palmistry.html"><i class="fas fa-hand-paper"></i>হস্তরেখা</a>
  <a href="${SITE_URL}/gemstone.html"><i class="fas fa-gem"></i>রত্নপাথর পরামর্শ</a>
  <a href="${SITE_URL}/vastu-science.html"><i class="fas fa-building"></i>বাস্তু শাস্ত্র</a>
  <a href="${SITE_URL}/vedic-astronomy.html"><i class="fas fa-moon"></i>জ্যোতির্বিজ্ঞান</a>
  <a href="${SITE_URL}/rashifal.html"><i class="fas fa-circle-notch"></i>রাশিফল</a>
  <a href="${SITE_URL}/panjika.html"><i class="fas fa-calendar-alt"></i>পঞ্জিকা</a>
  <a href="${SITE_URL}/video.html"><i class="fas fa-play-circle"></i>ভিডিও</a>
  <a href="${SITE_URL}/gallery.html"><i class="fas fa-images"></i>গ্যালারি</a>
  <a href="${SITE_URL}/reviews.html"><i class="fas fa-star-half-alt"></i>রিভিউ</a>
  <a href="${SITE_URL}/blog-list.html"><i class="fas fa-blog"></i>ব্লগ</a>
  <a href="${SITE_URL}/about.html"><i class="fas fa-user"></i>আমাদের সম্পর্কে</a>
  <a href="${SITE_URL}/contact.html"><i class="fas fa-address-card"></i>যোগাযোগ</a>
  <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" class="wa-nav">
    <i class="fab fa-whatsapp"></i>📲 WhatsApp পরামর্শ
  </a>
</nav>
<div class="nav-overlay" id="navOverlay" onclick="closeNav()"></div>

<!-- ══ MAIN ════════════════════════════════════════════════ -->
<main id="main-content">
  <a class="back-link" href="${SITE_URL}/blog-list.html">
    <i class="fas fa-arrow-left"></i> সব পোস্ট দেখুন
  </a>

  <article>
    <div class="post-header">
      <img class="featured-img"
           src="${ogImage}"
           alt="${meta.title}"
           loading="eager"
           onerror="this.style.display='none'">
      <h1>${meta.title}</h1>
      <div class="post-meta">
        <span><i class="fas fa-user-edit"></i>Dr. Prodyut Acharya</span>
        <span><i class="fas fa-calendar-alt"></i>${formatDate(meta.date)}</span>
      </div>
      ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
    </div>

    <div class="post-body">
      ${body}
    </div>
  </article>

  <!-- আজকের রাশিফল ও পঞ্জিকা -->
  <div class="pjk-strip">
    <h3><i class="fas fa-moon"></i> আজকের রাশিফল ও দিন পঞ্জিকা</h3>
    <p>জানুন আজকের রাশিফল, প্রেম, কর্ম, অর্থ, স্বাস্থ্য, শুভ সংখ্যা, শুভ রং ও শুভ সময়।</p>
    <div class="pjk-tags">
      <a href="${SITE_URL}/panjika.html">❤️ প্রেম</a>
      <a href="${SITE_URL}/panjika.html">💼 কর্ম</a>
      <a href="${SITE_URL}/panjika.html">💰 অর্থ</a>
      <a href="${SITE_URL}/panjika.html">🌿 স্বাস্থ্য</a>
      <a href="${SITE_URL}/panjika.html">🔢 শুভ সংখ্যা</a>
      <a href="${SITE_URL}/panjika.html">⏰ শুভ সময়</a>
    </div>
    <a class="pjk-btn" href="${SITE_URL}/panjika.html">এখনই দেখুন →</a>
  </div>

  <!-- CTA -->
  <div class="cta-box">
    <h3>🔮 ব্যক্তিগত পরামর্শ নিন</h3>
    <p>জন্মকুণ্ডলী বিচার · হস্তরেখা বিশ্লেষণ · যোটোক মিলন<br>
       <strong>Dr. Prodyut Acharya</strong> — PhD Gold Medalist · রানাঘাট, পশ্চিমবঙ্গ</p>
    <a class="btn-wa-cta" href="https://wa.me/${WA_NUMBER}?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%A1.%20%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AF%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%AA%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A6%B0%E0%A7%8D%E0%A6%B6%20%E0%A6%A8%E0%A6%BF%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4" target="_blank" rel="noopener">
      <i class="fab fa-whatsapp"></i> WhatsApp করুন
    </a>
    <a class="btn-pay-cta" href="${RAZORPAY_URL}" target="_blank" rel="noopener">
      <i class="fas fa-calendar-check"></i> পরামর্শ বুক করুন
    </a>
  </div>

  <!-- Author bio -->
  <div class="author-bio">
    <div class="ico">🧑‍🎓</div>
    <div>
      <h4>Dr. Prodyut Acharya</h4>
      <p class="sub">PhD Gold Medalist · জ্যোতিষী ও হস্তরেখাবিদ · রানাঘাট, নদিয়া</p>
      <p>১৫+ বছরের অভিজ্ঞতায় হাজারো জন্মকুণ্ডলী ও হস্তরেখা বিশ্লেষণ করেছেন।
         বৈদিক জ্যোতিষ, হস্তরেখা ও দার্শনিক দৃষ্টিভঙ্গির সমন্বয়ে জীবনের দিকনির্দেশনা দেন।
         <a href="${SITE_URL}/about.html">→ আরও জানুন</a></p>
    </div>
  </div>

  <!-- Related posts -->
  <div class="related">
    <h4><i class="fas fa-book-open" style="color:var(--gold);margin-right:6px;"></i>আরও পড়ুন</h4>
    <a href="${SITE_URL}/blog-list.html"><i class="fas fa-chevron-right"></i>সব ব্লগ পোস্ট দেখুন</a>
    <a href="${SITE_URL}/rashifal.html"><i class="fas fa-chevron-right"></i>আজকের রাশিফল</a>
    <a href="${SITE_URL}/panjika.html"><i class="fas fa-chevron-right"></i>বাংলা পঞ্জিকা</a>
    <a href="${SITE_URL}/astrology.html"><i class="fas fa-chevron-right"></i>জ্যোতিষ পরামর্শ</a>
  </div>
</main>

<!-- ══ FOOTER ══════════════════════════════════════════════ -->
<footer class="site-footer">
  <div class="footer-grid">
    <div class="footer-col">
      <h4>MyAstrology</h4>
      <p><i class="fas fa-map-marker-alt"></i>রাণাঘাট, নদিয়া, পশ্চিমবঙ্গ — ৭৪১২০২</p>
      <p><i class="fas fa-phone"></i>+91 93331 22768</p>
      <p><i class="fas fa-envelope"></i>info@myastrology.in</p>
      <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">
        <i class="fab fa-whatsapp"></i>WhatsApp পরামর্শ
      </a>
      <a href="${SITE_URL}/astrology.html">
        <i class="fas fa-calendar-check"></i>অনলাইন বুকিং
      </a>
    </div>
    <div class="footer-col">
      <h4>সেবাসমূহ</h4>
      <a href="${SITE_URL}/palmistry.html">হস্তরেখা বিচার</a>
      <a href="${SITE_URL}/astrology.html">জন্মকুণ্ডলী বিশ্লেষণ</a>
      <a href="${SITE_URL}/astrology.html">কুণ্ডলী মিলন</a>
      <a href="${SITE_URL}/vastu-science.html">বাস্তু শাস্ত্র</a>
      <a href="${SITE_URL}/gemstone.html">রত্নপাথর পরামর্শ</a>
      <a href="${SITE_URL}/rashifal.html">দৈনন্দিন রাশিফল</a>
      <a href="${SITE_URL}/panjika.html">পঞ্জিকা</a>
    </div>
    <div class="footer-col">
      <h4>তথ্য</h4>
      <a href="${SITE_URL}/about.html">ড. আচার্য সম্পর্কে</a>
      <a href="${SITE_URL}/blog-list.html">ব্লগ সমূহ</a>
      <a href="${SITE_URL}/gallery.html">গ্যালারি</a>
      <a href="${SITE_URL}/reviews.html">সমস্ত রিভিউ</a>
      <a href="${SITE_URL}/vedic-astronomy.html">জ্যোতির্বিজ্ঞান</a>
      <a href="${SITE_URL}/contact.html">যোগাযোগ</a>
      <a href="${SITE_URL}/privacy-policy.html">Privacy Policy</a>
      <a href="${SITE_URL}/terms-of-use.html">Terms of Use</a>
    </div>
    <div class="footer-col">
      <h4>সেবা এলাকা</h4>
      <p>রাণাঘাট &middot; নদিয়া &middot; কলকাতা &middot; পশ্চিমবঙ্গ &middot; উত্তরবঙ্গ &middot; ঝাড়খণ্ড &middot; ত্রিপুরা &middot; আসাম &middot; দিল্লি &middot; মুম্বাই &middot; সারা ভারতে অনলাইন</p>
      <p style="margin-top:10px;font-size:.78rem;color:var(--gold);letter-spacing:.04em">&#9654; পরামর্শ শুধুমাত্র বাংলা ও হিন্দিতে</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&#169; 2026 MyAstrology &nbsp;&middot;&nbsp; ড. প্রদ্যুৎ আচার্য, PhD in Vedic Jyotish &nbsp;&middot;&nbsp; রাণাঘাট, পশ্চিমবঙ্গ &nbsp;&middot;&nbsp;
      <a href="${SITE_URL}/about.html">About</a> &nbsp;&middot;&nbsp;
      <a href="${SITE_URL}/privacy-policy.html">Privacy Policy</a> &nbsp;&middot;&nbsp;
      <a href="${SITE_URL}/terms-of-use.html">Terms of Use</a>
    </p>
    <div class="social-row">
      <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" class="s-wa" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      <a href="https://www.facebook.com/Dr.ProdyutAcharya" target="_blank" rel="noopener" class="s-fb" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
      <a href="https://youtube.com/@myastrology" target="_blank" rel="noopener" class="s-yt" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
      <a href="https://www.instagram.com/myastrology.in" target="_blank" rel="noopener" class="s-ig" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
      <a href="https://x.com/AcharyaProdyut" target="_blank" rel="noopener" class="s-tw" aria-label="X Twitter"><i class="fab fa-x-twitter"></i></a>
      <a href="https://www.linkedin.com/in/ProdyutAcharya" target="_blank" rel="noopener" class="s-li" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
    </div>
  </div>
</footer>

<!-- ══ FLOATING WHATSAPP — ডানে, rotating flash messages ══ -->
<div class="wa-float" id="waFloat">
  <div class="wa-bubble" id="waBubble"></div>
  <a href="https://wa.me/${WA_NUMBER}?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%20%E0%A6%A1.%20%E0%A6%86%E0%A6%9A%E0%A6%BE%E0%A6%B0%E0%A7%8D%E0%A6%AF%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%8F%E0%A6%95%E0%A6%9F%E0%A6%BF%20%E0%A6%AA%E0%A6%B0%E0%A6%BE%E0%A6%AE%E0%A6%B0%E0%A7%8D%E0%A6%B6%20%E0%A6%AC%E0%A7%81%E0%A6%95%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
     target="_blank" rel="noopener" class="wa-btn-fl" aria-label="Chat on WhatsApp">
    <i class="fab fa-whatsapp"></i>
  </a>
</div>

<!-- ══ BACK TO TOP — বাঁয়ে ══ -->
<button id="back-to-top" aria-label="উপরে যান" title="উপরে যান">⬆</button>

<script>
/* ── Nav toggle ── */
function toggleNav(){
  var n=document.getElementById('navMenu'),o=document.getElementById('navOverlay');
  var open=n.classList.toggle('open');
  o.classList.toggle('open',open);
  document.body.classList.toggle('nav-open',open);
}
function closeNav(){
  document.getElementById('navMenu').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('open');
  document.body.classList.remove('nav-open');
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav();});

/* ── Rotating WhatsApp Flash Messages ── */
(function(){
  var msgs=[
    '🔮 কুণ্ডলী বিশ্লেষণ করুন',
    '🌟 আজই পরামর্শ নিন',
    '✋ হস্তরেখা বিচার করুন',
    '⭐ ১০,০০০+ সন্তুষ্ট গ্রাহক',
    '💬 বাংলায় Online পরামর্শ',
    '🙏 এখনই WhatsApp করুন',
    '📿 Jyotish পরামর্শ নিন',
    '💍 যোটোক বিচার করুন'
  ];
  var idx=0,bubble=document.getElementById('waBubble');
  if(!bubble)return;
  function showMsg(){
    bubble.style.display='block';
    bubble.textContent=msgs[idx];
    bubble.classList.add('show');
    setTimeout(function(){
      bubble.classList.remove('show');
      setTimeout(function(){bubble.style.display='none';},400);
    },4000);
    idx=(idx+1)%msgs.length;
  }
  setTimeout(function(){showMsg();setInterval(showMsg,6000);},2500);
})();

/* ── Back To Top ── */
(function(){
  var btn=document.getElementById('back-to-top');
  if(!btn)return;
  window.addEventListener('scroll',function(){
    if(window.scrollY>400)btn.classList.add('visible');
    else btn.classList.remove('visible');
  },{passive:true});
  btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
})();

/* ── GA4 click tracking ── */
document.addEventListener('click',function(e){
  var a=e.target.closest('a');if(!a)return;
  var href=a.getAttribute('href')||'';
  if(href.includes('wa.me')&&typeof gtag!=='undefined')
    gtag('event','whatsapp_click',{event_category:'engagement',event_label:a.innerText.trim()||'WhatsApp'});
  if(href.startsWith('tel:')&&typeof gtag!=='undefined')
    gtag('event','phone_click',{event_category:'engagement'});
});
</script>

</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────────────
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
let count = 0;

files.forEach(file => {
  const slug    = file.replace('.md', '');
  const raw     = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const fmStart = raw.indexOf('---');
  const content = fmStart > 0 ? raw.slice(fmStart) : raw;
  const meta    = parseFrontmatter(content);
  if (!meta.title) meta.title = slug.replace(/-/g,' ');
  const body = markdownToHtml(content);
  const html = buildHtml(meta, body, slug);
  fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.html`), html, 'utf8');
  count++;
  console.log(`\u2705 blog/${slug}.html`);
});

console.log(`\n\uD83D\uDCDD \u09AE\u09CB\u099F: ${count}\u099F\u09BF HTML \u09AB\u09BE\u0987\u09B2 \u09A4\u09C8\u09B0\u09BF \u09B9\u09AF\u09BC\u09C7\u099B\u09C7`);
