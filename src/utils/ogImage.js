/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: utils/ogImage.js
 * কাজ: ডায়নামিক OG ইমেজ জেনারেট (Canvas)
 * ============================================================
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

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
    return imageUrl;
  }
  
  // ইমেজ ডিরেক্টরি তৈরি
  const imageDir = path.join(outputDir, 'images');
  if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
  
  // Canvas সাইজ
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0a1628');
  gradient.addColorStop(0.5, '#1a2a3a');
  gradient.addColorStop(1, '#0a1628');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // গোল্ডেন বর্ডার
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, width - 40, height - 40);
  
  // টাইটেল
  ctx.fillStyle = '#c9a227';
  ctx.font = 'bold 42px "Baloo Da 2", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌟 দৈনিক রাশিফল 🌟', width / 2, 100);
  
  // তারিখ
  const bnDate = date.toLocaleDateString('bn-IN', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  ctx.fillStyle = '#e8e8e8';
  ctx.font = '28px "Baloo Da 2", sans-serif';
  ctx.fillText(bnDate, width / 2, 180);
  
  // চন্দ্র ও সূর্য তথ্য
  ctx.fillStyle = '#c9a227';
  ctx.font = '32px "Baloo Da 2", sans-serif';
  ctx.fillText(`🌙 চন্দ্র: ${moonRashi}`, width / 2, 280);
  
  ctx.fillStyle = '#e8e8e8';
  ctx.font = '28px "Baloo Da 2", sans-serif';
  ctx.fillText(`☀️ সূর্য: ${sunRashi}`, width / 2, 350);
  
  // নিচের লাইন
  ctx.fillStyle = '#a0b0c8';
  ctx.font = '22px "Baloo Da 2", sans-serif';
  ctx.fillText('ড. প্রদ্যুৎ আচার্য — MyAstrology, রানাঘাট', width / 2, 550);
  
  // URL
  ctx.fillStyle = '#c9a227';
  ctx.font = '18px monospace';
  ctx.fillText('www.myastrology.in', width / 2, 600);
  
  // ইমেজ সেভ
  const buffer = canvas.toBuffer('image/webp');
  fs.writeFileSync(imagePath, buffer);
  console.log(`✅ OG ইমেজ তৈরি: ${imagePath}`);
  
  return imageUrl;
}

module.exports = { generateOgImage };
