/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: utils/ogImage.js
 * কাজ: ডায়নামিক OG ইমেজ জেনারেট (Canvas)
 * 
 * নির্ভরতা: npm install canvas
 * লিনাক্সে: sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential
 * ============================================================
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// বাংলা সংখ্যা ও মাসের নাম (constants থেকে নেওয়া ভালো, কিন্তু ডিপেন্ডেন্সি এড়াতে এখানে রাখা)
const BD = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const BN_MONTHS = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
                   'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];

/**
 * বাংলা সংখ্যায় রূপান্তর
 */
function toBn(n) {
  return String(Math.abs(Math.round(n))).replace(/[0-9]/g, d => BD[+d]);
}

/**
 * বাংলা তারিখ ফরম্যাট (OG ইমেজের জন্য)
 */
function formatBnDateForOg(date) {
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  return `${toBn(d)} ${BN_MONTHS[m]} ${toBn(y)}`;
}

/**
 * ডায়নামিক OG ইমেজ তৈরি করে
 * @param {Date} date - তারিখ
 * @param {string} moonRashi - চন্দ্র রাশির নাম
 * @param {string} sunRashi - সূর্য রাশির নাম
 * @param {string} outputDir - আউটপুট ডিরেক্টরি
 * @returns {string} - ইমেজের URL
 */
async function generateOgImage(date, moonRashi, sunRashi, outputDir) {
  const iso = date.toISOString().slice(0, 10);
  const imagePath = path.join(outputDir, 'images', `${iso}-og.webp`);
  const imageUrl = `/rashifal/images/${iso}-og.webp`;
  
  // ইতিমধ্যে ইমেজ থাকলে ফেরত দিন
  if (fs.existsSync(imagePath)) {
    console.log(`🖼️ OG ইমেজ ইতিমধ্যে আছে: ${imagePath}`);
    return imageUrl;
  }
  
  // ইমেজ ডিরেক্টরি তৈরি
  const imageDir = path.join(outputDir, 'images');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }
  
  try {
    // Canvas সাইজ (Open Graph standard: 1200x630)
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // 1. ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a1628');   // গাঢ় নীল
    gradient.addColorStop(0.5, '#1a2a3a');  // মাঝারি নীল
    gradient.addColorStop(1, '#0a1628');    // গাঢ় নীল
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 2. গোল্ডেন বর্ডার
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    
    // 3. টাইটেল (বড়)
    ctx.fillStyle = '#c9a227';
    ctx.font = 'bold 48px "Baloo Da 2", "Noto Sans Bengali", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌟 দৈনিক রাশিফল 🌟', width / 2, 95);
    
    // 4. তারিখ (বাংলা)
    const bnDate = formatBnDateForOg(date);
    ctx.fillStyle = '#e8e8e8';
    ctx.font = '32px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
    ctx.fillText(bnDate, width / 2, 170);
    
    // 5. একটি সুন্দর ডিভাইডার লাইন
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 195);
    ctx.lineTo(width / 2 + 200, 195);
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 6. চন্দ্র তথ্য
    ctx.fillStyle = '#c9a227';
    ctx.font = '36px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`🌙 চন্দ্র`, width / 2 - 150, 280);
    ctx.fillStyle = '#e8e8e8';
    ctx.font = '36px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
    ctx.fillText(moonRashi, width / 2 + 50, 280);
    
    // 7. সূর্য তথ্য
    ctx.fillStyle = '#c9a227';
    ctx.font = '36px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`☀️ সূর্য`, width / 2 - 150, 350);
    ctx.fillStyle = '#e8e8e8';
    ctx.font = '36px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
    ctx.fillText(sunRashi, width / 2 + 50, 350);
    
    // 8. দ্বিতীয় ডিভাইডার
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 400);
    ctx.lineTo(width / 2 + 200, 400);
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 9. নিচের ট্যাগলাইন
    ctx.fillStyle = '#a0b0c8';
    ctx.font = '26px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
    ctx.fillText('ড. প্রদ্যুৎ আচার্য', width / 2, 490);
    ctx.font = '22px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
    ctx.fillText('MyAstrology — রানাঘাট, নদিয়া', width / 2, 540);
    
    // 10. URL
    ctx.fillStyle = '#c9a227';
    ctx.font = '20px monospace';
    ctx.fillText('www.myastrology.in', width / 2, 600);
    
    // 11. একটি ছোট ডেকোরেটিভ এলিমেন্ট (তারকা)
    ctx.fillStyle = '#c9a227';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(width - 50 - i * 40, height - 50, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = i % 2 === 0 ? '#c9a227' : '#e8e8e8';
    }
    
    // ইমেজ সেভ (WebP ফরম্যাটে – ভালো কম্প্রেশন)
    const buffer = canvas.toBuffer('image/webp', { quality: 0.85 });
    fs.writeFileSync(imagePath, buffer);
    console.log(`✅ OG ইমেজ তৈরি: ${imagePath}`);
    
    return imageUrl;
    
  } catch (err) {
    console.error(`❌ OG ইমেজ তৈরি ব্যর্থ: ${err.message}`);
    // ব্যর্থ হলে ডিফল্ট ইমেজ URL ফেরত দিন
    return '/rashifal/images/daily-rashifal-og.webp';
  }
}

/**
 * পুরনো OG ইমেজ মুছে ফেলা (ডিস্ক স্পেস বাঁচাতে)
 * @param {string} outputDir - আউটপুট ডিরেক্টরি
 * @param {number} daysToKeep - কত দিনের ইমেজ রাখবে (ডিফল্ট 30)
 */
function cleanupOldOgImages(outputDir, daysToKeep = 30) {
  const imagesDir = path.join(outputDir, 'images');
  if (!fs.existsSync(imagesDir)) return;
  
  const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
  let deletedCount = 0;
  
  try {
    const files = fs.readdirSync(imagesDir);
    for (const file of files) {
      if (file.endsWith('-og.webp')) {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        if (stats.mtimeMs < cutoff) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }
    }
    if (deletedCount > 0) {
      console.log(`🗑️ ${deletedCount}টি পুরনো OG ইমেজ মুছে ফেলা হয়েছে`);
    }
  } catch (err) {
    console.warn(`⚠️ OG ইমেজ ক্লিনআপ ব্যর্থ: ${err.message}`);
  }
}

module.exports = { 
  generateOgImage,
  cleanupOldOgImages
};
