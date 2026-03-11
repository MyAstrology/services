
const fs=require('fs'),path=require('path');
const BLOG_DIR=path.join(__dirname,'src/content/blog');
const OUTPUT_DIR=path.join(__dirname,'blog');
const SITE_URL='https://www.myastrology.in';
const GA_ID='G-S7BQGLP211';

function parseFrontmatter(content){
  const match=content.match(/^---\n([\s\S]*?)\n---/);
  const meta={title:'',description:'',date:'',tags:[],image:''};
  if(!match)return meta;
  match[1].split('\n').forEach(line=>{
    const [key,...rest]=line.split(':');
    const val=rest.join(':').trim().replace(/^["']|["']$/g,'');
    if(key==='title')meta.title=val;
    if(key==='description')meta.description=val;
    if(key==='date')meta.date=val;
    if(key==='image')meta.image=val;
    if(key==='tags')meta.tags=val.replace(/[\[\]]/g,'').split(',').map(t=>t.trim());
  });
  return meta;
}

function markdownToHtml(md){
  return md
    .replace(/^---[\s\S]*?---\n?/,'')
    .replace(/^### (.+)$/gm,'<h3>$1</h3>')
    .replace(/^## (.+)$/gm,'<h2>$1</h2>')
    .replace(/^# (.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>')
    .replace(/^\- (.+)$/gm,'<li>$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>')
    .split(/\n{2,}/)
    .map(block=>{
      block=block.trim();
      if(!block)return '';
      if(/^<(h[1-6]|ul|blockquote|li)/.test(block))return block;
      return `<p>${block.replace(/\n/g,'<br>')}</p>`;
    }).join('\n');
}

function formatDate(d){
  if(!d)return '';
  const dt=new Date(d);
  if(isNaN(dt))return d;
  return dt.toLocaleDateString('bn-IN',{year:'numeric',month:'long',day:'numeric'});
}

function buildHtml(meta,body,slug){
  const url=`${SITE_URL}/blog/${slug}.html`;
  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${meta.title} | MyAstrology</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BlogPosting","headline":"${meta.title.replace(/"/g,'\\"')}","description":"${meta.description.replace(/"/g,'\\"')}","datePublished":"${meta.date}","author":{"@type":"Person","name":"Dr. Prodyut Acharya","url":"${SITE_URL}/about"},"url":"${url}"}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
<style>
:root{--primary:#8B4513;--accent:#D4AF37;--bg:#FFF9F0;--text:#2C1810;--muted:#6B4C3B;--border:#E8D5B7;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Noto Serif Bengali',serif;background:var(--bg);color:var(--text);line-height:1.85;font-size:1.05rem;}
header{background:var(--primary);padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
header a.logo{color:#fff;text-decoration:none;font-size:1.25rem;font-weight:700;}
header a.logo span{color:var(--accent);}
nav a{color:#ffffffcc;text-decoration:none;margin-left:18px;font-size:.9rem;}
main{max-width:780px;margin:0 auto;padding:40px 20px 60px;}
.post-header{margin-bottom:32px;border-bottom:2px solid var(--border);padding-bottom:24px;}
.post-header h1{font-size:clamp(1.5rem,4vw,2rem);color:var(--primary);line-height:1.4;margin-bottom:12px;}
.post-meta{font-size:.85rem;color:var(--muted);margin-bottom:12px;}
.post-body h2{color:var(--primary);margin:28px 0 10px;font-size:1.4rem;border-left:4px solid var(--accent);padding-left:12px;}
.post-body h3{color:var(--primary);margin:20px 0 8px;}
.post-body p{margin-bottom:18px;}
.post-body blockquote{border-left:4px solid var(--accent);padding:10px 20px;background:#fdf4e7;margin:20px 0;font-style:italic;color:var(--muted);}
.post-body a{color:var(--primary);}
.cta-box{background:linear-gradient(135deg,var(--primary),#6B3410);color:#fff;border-radius:12px;padding:28px 24px;margin:40px 0;text-align:center;}
.cta-box h3{color:var(--accent);margin-bottom:10px;}
.cta-box p{margin-bottom:18px;opacity:.9;}
.cta-box a{display:inline-block;background:var(--accent);color:#2C1810;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:6px;}
.back-link{display:inline-flex;align-items:center;gap:6px;color:var(--primary);text-decoration:none;font-size:.9rem;margin-bottom:24px;}
footer{background:var(--primary);color:#ffffffaa;text-align:center;padding:20px;font-size:.85rem;}
footer a{color:var(--accent);text-decoration:none;}
.whatsapp-float{position:fixed;bottom:24px;right:20px;z-index:999;}
.whatsapp-float a{display:flex;align-items:center;justify-content:center;width:54px;height:54px;background:#25D366;border-radius:50%;box-shadow:0 4px 14px rgba(0,0,0,.25);text-decoration:none;}
.whatsapp-float svg{width:30px;height:30px;fill:#fff;}
</style>
</head>
<body>
<header>
<a class="logo" href="${SITE_URL}">My<span>Astrology</span></a>
<nav>
<a href="${SITE_URL}">Home</a>
<a href="${SITE_URL}/blog-list.html">Blog</a>
<a href="https://wa.me/919333122768">WhatsApp</a>
</nav>
</header>
<main>
<a class="back-link" href="${SITE_URL}/blog-list.html">← সব পোস্ট দেখুন</a>
<article>
<div class="post-header">
<h1>${meta.title}</h1>
<div class="post-meta"><span>✍️ Dr. Prodyut Acharya</span> &nbsp; <span>📅 ${formatDate(meta.date)}</span></div>
</div>
<div class="post-body">${body}</div>
</article>
<div class="cta-box">
<h3>🔮 ব্যক্তিগত পরামর্শ নিন</h3>
<p>Dr. Prodyut Acharya-র সাথে সরাসরি কথা বলুন।</p>
<a href="https://wa.me/919333122768">WhatsApp করুন</a>
<a href="https://pages.razorpay.com/pl_PSd8AAe189ECFo/view">পরামর্শ বুক করুন</a>
</div>
</main>
<footer><p>&copy; 2025 MyAstrology – Dr. Prodyut Acharya | <a href="${SITE_URL}">myastrology.in</a> | Ranaghat, Nadia, West Bengal</p></footer>
<div class="whatsapp-float"><a href="https://wa.me/919333122768" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.5l5.797-1.522A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zM12 22c-1.885 0-3.651-.51-5.17-1.402l-.37-.22-3.44.903.92-3.35-.24-.384A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg></a></div>
</body>
</html>`;
}

if(!fs.existsSync(OUTPUT_DIR))fs.mkdirSync(OUTPUT_DIR,{recursive:true});
const files=fs.readdirSync(BLOG_DIR).filter(f=>f.endsWith('.md'));
let count=0;
files.forEach(file=>{
  const slug=file.replace('.md','');
  const content=fs.readFileSync(path.join(BLOG_DIR,file),'utf8');
  const meta=parseFrontmatter(content);
  if(!meta.title)meta.title=slug.replace(/-/g,' ');
  const body=markdownToHtml(content);
  const html=buildHtml(meta,body,slug);
  fs.writeFileSync(path.join(OUTPUT_DIR,`${slug}.html`),html,'utf8');
  count++;
  console.log(`OK: blog/${slug}.html`);
});
console.log(`Total: ${count} files generated`);

