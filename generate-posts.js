'use strict';

const fs   = require('fs');
const path = require('path');

// ── Constants ──────────────────────────────────────────────────────
const BLOG_DIR    = path.join(__dirname, 'src', 'content', 'blog');
const OUTPUT_DIR  = path.join(__dirname, 'blog');
const SITE_URL    = 'https://www.myastrology.in';
const GA_ID       = 'G-S7BQGLP211';
const WA_NUMBER   = '919333122768';
const RAZORPAY_URL = 'https://pages.razorpay.com/pl_PSd8AAe189ECFo/view';
const DEFAULT_IMG = `${SITE_URL}/images/MyAstrology-Ranghat-logo.png`;

// ── Frontmatter parser ─────────────────────────────────────────────
// Reads: title, description, date, image, tags
// Extra fields (slug, keywords, etc.) are safely ignored
function parseFrontmatter(content) {
  const meta = { title: '', description: '', date: '', image: '', tags: [] };
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return meta;

  const lines = match[1].split('\n');
  let inTags = false;

  lines.forEach(line => {
    // tags: multiline array format
    if (/^tags\s*:/.test(line)) { inTags = true; return; }
    if (inTags) {
      if (/^\s{2,}-\s+/.test(line)) {
        meta.tags.push(line.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, '').trim());
        return;
      }
      // inline array format: tags: ["a","b"]
      if (/^\s*\[/.test(line) || line.includes('[')) {
        inTags = false;
      } else {
        inTags = false;
      }
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

    if (key === 'title')       meta.title       = val;
    if (key === 'description') meta.description = val;
    if (key === 'date')        meta.date        = val;
    if (key === 'image')       meta.image       = val;

    // inline tags: ["a","b","c"]
    if (key === 'tags' && val.includes('[')) {
      meta.tags = val
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(t => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
  });

  return meta;
}

// ── Image URL normalizer ───────────────────────────────────────────
// astro.myastrology.in → www.myastrology.in
function normalizeImage(img, slug) {
  if (!img) return `${SITE_URL}/blog/${slug}.webp`;
  return img
    .replace('https://astro.myastrology.in', SITE_URL)
    .replace('http://astro.myastrology.in',  SITE_URL);
}

// ── Safe JSON string escape ────────────────────────────────────────
function jsonStr(s) {
  return (s || '')
    .replace(/\\/g,        '\\\\')
    .replace(/"/g,         '\\"')
    .replace(/\n/g,        '\\n')
    .replace(/\r/g,        '\\r')
    .replace(/<\/script>/gi, '<\\/script>');
}

// ── Markdown → HTML ────────────────────────────────────────────────
// FIX 1: --- → <hr>
// FIX 2: HTML blocks not wrapped in <p>
// FIX 3: consecutive <li> wrapped in <ul>
function markdownToHtml(raw) {
  // Remove frontmatter
  let md = raw.replace(/^---[\s\S]*?---\n?/, '');

  // Split into blocks by blank lines
  const blocks = md.split(/\n{2,}/);
  const html   = [];

  blocks.forEach(block => {
    block = block.trim();
    if (!block) return;

    // ── HR ──
    if (/^---+$/.test(block)) {
      html.push('<hr>');
      return;
    }

    // ── Raw HTML block — pass through unchanged ──
    // Covers <div>, <blockquote style=...>, <ol>, <ul>, <table>, <figure>
    if (/^<(div|section|article|figure|table|ul|ol|blockquote|hr|h[1-6]|p\s)/i.test(block)) {
      html.push(block);
      return;
    }

    // ── Headings ──
    if (/^#{1,6}\s/.test(block)) {
      const hBlock = block
        .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
        .replace(/^##### (.+)$/gm,  '<h5>$1</h5>')
        .replace(/^#### (.+)$/gm,   '<h4>$1</h4>')
        .replace(/^### (.+)$/gm,    '<h3>$1</h3>')
        .replace(/^## (.+)$/gm,     '<h2>$1</h2>')
        .replace(/^# (.+)$/gm,      '<h1>$1</h1>');
      html.push(hBlock);
      return;
    }

    // ── Blockquote (markdown style) ──
    if (/^>\s/.test(block)) {
      const inner = block
        .replace(/^>\s?/gm, '')
        .trim();
      html.push(`<blockquote>${applyInline(inner)}</blockquote>`);
      return;
    }

    // ── Unordered list ──
    if (/^\s*[-*]\s/.test(block)) {
      const items = block
        .split('\n')
        .filter(l => /^\s*[-*]\s/.test(l))
        .map(l => `<li>${applyInline(l.replace(/^\s*[-*]\s/, ''))}</li>`)
        .join('\n');
      html.push(`<ul>\n${items}\n</ul>`);
      return;
    }

    // ── Ordered list ──
    if (/^\s*\d+\.\s/.test(block)) {
      const items = block
        .split('\n')
        .filter(l => /^\s*\d+\.\s/.test(l))
        .map(l => `<li>${applyInline(l.replace(/^\s*\d+\.\s/, ''))}</li>`)
        .join('\n');
      html.push(`<ol>\n${items}\n</ol>`);
      return;
    }

    // ── Paragraph ──
    const para = applyInline(block.replace(/\n/g, '<br>'));
    html.push(`<p>${para}</p>`);
  });

  return html.join('\n');
}

// Inline markdown: bold, italic, links
function applyInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>');
}

// ── Date formatter (Bengali) ───────────────────────────────────────
function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('bn-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ── HTML builder ───────────────────────────────────────────────────
function buildHtml(meta, body, slug) {
  const pageUrl  = `${SITE_URL}/blog/${slug}.html`;
  const ogImage  = normalizeImage(meta.image, slug);
  const tagsHtml = meta.tags.length
    ? meta.tags.map(t => `<span class="tag">${t}</span>`).join(' ')
    : '';

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
<meta property="og:site_name"   content="MyAstrology – Dr. Prodyut Acharya">

<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="${meta.title}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image"       content="${ogImage}">
<meta name="twitter:image:alt"   content="${meta.title}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline":      "${jsonStr(meta.title)}",
  "description":   "${jsonStr(meta.description)}",
  "datePublished": "${meta.date}",
  "dateModified":  "${meta.date}",
  "image":         "${jsonStr(ogImage)}",
  "url":           "${pageUrl}",
  "author": {
    "@type": "Person",
    "name":  "Dr. Prodyut Acharya",
    "url":   "${SITE_URL}/about.html"
  },
  "publisher": {
    "@type": "Organization",
    "name":  "MyAstrology",
    "logo":  { "@type": "ImageObject", "url": "${DEFAULT_IMG}" }
  }
}
</script>

<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_ID}');
</script>

<link rel="icon"        type="image/x-icon" href="${SITE_URL}/images/favicon.ico">
<link rel="apple-touch-icon"                href="${SITE_URL}/images/favicon.ico">
<link rel="preconnect"  href="https://fonts.googleapis.com">
<link rel="stylesheet"  href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;600;700&display=swap">

<style>
:root {
  --primary: #8B4513;
  --accent:  #D4AF37;
  --bg:      #FFF9F0;
  --text:    #2C1810;
  --muted:   #6B4C3B;
  --border:  #E8D5B7;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Noto Serif Bengali', serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.9;
  font-size: 1.05rem;
}

/* ── Header ── */
.site-header {
  background: var(--primary);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
}
.site-header a.logo {
  color: #fff;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 700;
}
.site-header a.logo span { color: var(--accent); }
.site-header nav a {
  color: #ffffffcc;
  text-decoration: none;
  margin-left: 18px;
  font-size: .9rem;
  transition: color .2s;
}
.site-header nav a:hover { color: var(--accent); }

/* ── Main ── */
main { max-width: 780px; margin: 0 auto; padding: 40px 20px 60px; }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary);
  text-decoration: none;
  font-size: .9rem;
  margin-bottom: 28px;
}
.back-link:hover { text-decoration: underline; }

/* ── Post header ── */
.post-header {
  margin-bottom: 32px;
  border-bottom: 2px solid var(--border);
  padding-bottom: 24px;
}
.post-header h1 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--primary);
  line-height: 1.4;
  margin-bottom: 12px;
}
.post-meta {
  font-size: .85rem;
  color: var(--muted);
  margin-bottom: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
}
.tags { margin-top: 10px; }
.tag {
  display: inline-block;
  background: #f5ead8;
  color: var(--primary);
  font-size: .78rem;
  padding: 3px 10px;
  border-radius: 20px;
  margin: 2px 3px 2px 0;
}
.featured-img {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
  display: block;
}

/* ── Post body ── */
.post-body h1,
.post-body h2 {
  color: var(--primary);
  margin: 32px 0 12px;
  font-size: 1.45rem;
  border-left: 4px solid var(--accent);
  padding-left: 12px;
  line-height: 1.4;
}
.post-body h3 {
  color: var(--primary);
  margin: 24px 0 8px;
  font-size: 1.2rem;
}
.post-body h4, .post-body h5, .post-body h6 {
  color: var(--muted);
  margin: 18px 0 6px;
}
.post-body p   { margin-bottom: 18px; }
.post-body hr  { border: none; border-top: 1px solid var(--border); margin: 28px 0; }
.post-body blockquote {
  border-left: 4px solid var(--accent);
  padding: 12px 20px;
  background: #fdf4e7;
  margin: 22px 0;
  font-style: italic;
  color: var(--muted);
  border-radius: 0 8px 8px 0;
}
.post-body a   { color: var(--primary); }
.post-body ul  { margin: 12px 0 18px 24px; }
.post-body ol  { margin: 12px 0 18px 24px; }
.post-body li  { margin-bottom: 7px; }
.post-body strong { color: var(--text); }
.post-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
}

/* ── CTA box ── */
.cta-box {
  background: linear-gradient(135deg, var(--primary), #6B3410);
  color: #fff;
  border-radius: 12px;
  padding: 28px 24px;
  margin: 44px 0 20px;
  text-align: center;
}
.cta-box h3  { color: var(--accent); margin-bottom: 10px; font-size: 1.2rem; }
.cta-box p   { margin-bottom: 18px; opacity: .9; }
.cta-box a {
  display: inline-block;
  background: var(--accent);
  color: #2C1810;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  margin: 6px;
  transition: opacity .2s;
}
.cta-box a:hover { opacity: .85; }

/* ── Footer ── */
.site-footer {
  background: var(--primary);
  color: #ffffffaa;
  text-align: center;
  padding: 22px 20px;
  font-size: .85rem;
}
.site-footer a { color: var(--accent); text-decoration: none; }

/* ── WhatsApp float ── */
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 999;
}
.whatsapp-float a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  background: #25D366;
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(0,0,0,.25);
  text-decoration: none;
  transition: transform .2s;
}
.whatsapp-float a:hover { transform: scale(1.1); }
.whatsapp-float svg { width: 30px; height: 30px; fill: #fff; }

@media (max-width: 600px) {
  .site-header nav { display: none; }
  main { padding: 24px 16px 48px; }
}
</style>
</head>
<body>

<header class="site-header">
  <a class="logo" href="${SITE_URL}">My<span>Astrology</span></a>
  <nav>
    <a href="${SITE_URL}">হোম</a>
    <a href="${SITE_URL}/astrology.html">জ্যোতিষ</a>
    <a href="${SITE_URL}/palmistry.html">হস্তরেখা</a>
    <a href="${SITE_URL}/blog-list.html">ব্লগ</a>
    <a href="https://wa.me/${WA_NUMBER}">WhatsApp</a>
  </nav>
</header>

<main>
  <a class="back-link" href="${SITE_URL}/blog-list.html">← সব পোস্ট দেখুন</a>

  <article>
    <div class="post-header">
      <img class="featured-img"
           src="${ogImage}"
           alt="${meta.title}"
           loading="eager"
           onerror="this.style.display='none'">
      <h1>${meta.title}</h1>
      <div class="post-meta">
        <span>✍️ Dr. Prodyut Acharya</span>
        <span>📅 ${formatDate(meta.date)}</span>
      </div>
      ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
    </div>

    <div class="post-body">
      ${body}
    </div>
  </article>

  <div class="cta-box">
    <h3>🔮 ব্যক্তিগত পরামর্শ নিন</h3>
    <p>Dr. Prodyut Acharya-র সাথে সরাসরি কথা বলুন।</p>
    <a href="https://wa.me/${WA_NUMBER}">💬 WhatsApp করুন</a>
    <a href="${RAZORPAY_URL}">📅 পরামর্শ বুক করুন</a>
  </div>
</main>

<footer class="site-footer">
  <p>&copy; 2025 MyAstrology – Dr. Prodyut Acharya |
     <a href="${SITE_URL}">myastrology.in</a> |
     Ranaghat, Nadia, West Bengal
  </p>
</footer>

<div class="whatsapp-float">
  <a href="https://wa.me/${WA_NUMBER}" aria-label="WhatsApp">
    <svg viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.5l5.797-1.522A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zM12 22c-1.885 0-3.651-.51-5.17-1.402l-.37-.22-3.44.903.92-3.35-.24-.384A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
  </a>
</div>

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
  // Strip any lines before the first '---' (e.g. "💾 ফাইলের নাম:" lines)
  const fmStart = raw.indexOf('---');
  const content = fmStart > 0 ? raw.slice(fmStart) : raw;
  const meta    = parseFrontmatter(content);

  if (!meta.title) meta.title = slug.replace(/-/g, ' ');

  const body = markdownToHtml(content);
  const html = buildHtml(meta, body, slug);

  fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.html`), html, 'utf8');
  count++;
  console.log(`✅ blog/${slug}.html`);
});

console.log(`\n📝 মোট: ${count}টি HTML ফাইল তৈরি হয়েছে`);
