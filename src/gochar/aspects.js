/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: gochar/aspects.js
 * কাজ: গ্রহের দৃষ্টি (aspect) গণনা – সব গুরুত্বপূর্ণ গ্রহের জন্য
 * প্রকল্প: Daily Rashifal Generator
 * 
 * আন্তর্জাতিক মানের বৈশিষ্ট্য:
 *   - প্রতিটি গ্রহের দৃষ্টির জন্য বিস্তারিত আধ্যাত্মিক ব্যাখ্যা
 *   - রাশি ও ভাবভেদে ভিন্ন প্রভাব
 *   - সময়ানুযায়ী কাস্টমাইজেশন
 *   - গভীর মনস্তাত্ত্বিক বিশ্লেষণ
 * ============================================================
 */

const { RASHI_NAMES } = require('../utils/constants');

// ==================== গ্রহের দৃষ্টির সংজ্ঞা (ভাব সংখ্যা) ====================
const ASPECT_DEFINITIONS = {
  saturn: { houses: [3, 7, 10], strength: 'full', nature: 'neutral', element: 'বায়ু', deity: 'শনিদেব', mantra: 'ওঁ প্রাং প্রীং প্রৌং সঃ শনৈশ্চরায় নমঃ' },
  jupiter: { houses: [5, 7, 9], strength: 'full', nature: 'positive', element: 'আকাশ', deity: 'গুরুদেব', mantra: 'ওঁ গ্রাং গ্রীং গ্রৌং সঃ গুরুবে নমঃ' },
  mars: { houses: [4, 7, 8], strength: 'full', nature: 'mixed', element: 'অগ্নি', deity: 'মঙ্গল', mantra: 'ওঁ ক্রাং ক্রীং ক্রৌং সঃ ভৌমায় নমঃ' },
  mercury: { houses: [7], strength: 'full', nature: 'positive', element: 'পৃথিবী', deity: 'বুধদেব', mantra: 'ওঁ ব্রাং ব্রীং ব্রৌং সঃ বুধায় নমঃ' },
  venus: { houses: [7], strength: 'full', nature: 'positive', element: 'জল', deity: 'শুক্রদেব', mantra: 'ওঁ দ্রাং দ্রীং দ্রৌং সঃ শুক্রায় নমঃ' }
};

// দৃষ্টির তীব্রতা (পূর্ণ/অর্ধ/ক্ষীণ)
const ASPECT_STRENGTH = {
  full: { name: 'পূর্ণ দৃষ্টি', multiplier: 1.0, icon: '🔆', meaning: 'গ্রহের সম্পূর্ণ প্রভাব অনুভূত হবে' },
  half: { name: 'অর্ধ দৃষ্টি', multiplier: 0.5, icon: '🌓', meaning: 'গ্রহের প্রভাব আংশিক থাকবে' },
  weak: { name: 'ক্ষীণ দৃষ্টি', multiplier: 0.25, icon: '🌙', meaning: 'গ্রহের প্রভাব খুবই ক্ষীণ থাকবে' }
};

// ==================== দৃষ্টির বিস্তারিত প্রভাব বর্ণনা (আন্তর্জাতিক মান) ====================
const ASPECT_DESCRIPTIONS = {
  saturn: {
    positive: '🪐 শনির শুভ দৃষ্টি পড়েছে — কর্মফলের দেবতার এই দৃষ্টি বিরল আশীর্বাদ। দীর্ঘ সাধনার পর যেমন মাটি থেকে সোনা উঠে আসে, তেমনি কঠোর পরিশ্রমের প্রতিদান এখন স্পষ্ট হচ্ছে। শৃঙ্খলা ও সংযমের পথ ধরেই স্থায়ী উন্নতি আসবে।\n\n✨ **আধ্যাত্মিক দিক:** এই সময়ে "ওঁ প্রাং প্রীং প্রৌং সঃ শনৈশ্চরায় নমঃ" মন্ত্র জপ করুন। শনিবার তেল চড়িয়ে সন্ধ্যায় প্রদীপ জ্বালান। ধৈর্যের পরীক্ষায় উত্তীর্ণ হলে পুরস্কার নিশ্চিত।\n\n⏰ **সময়ানুযায়ী:** শনির দৃষ্টি সবচেয়ে শক্তিশালী হয় রাত ১২-২টার মধ্যে। এই সময় ধ্যান ও প্রার্থনা করলে শনির অশুভ প্রভাব কমে।',
    negative: '🪐 শনির দৃষ্টি পড়েছে — ন্যায়বিচারক এই গ্রহ এখন পরীক্ষা নিচ্ছেন। বিলম্ব ও বাধা আসলে বুঝবেন, কিছু পাওয়ার আগে আরও পরিপক্ব হওয়ার নির্দেশ আসছে। ধৈর্যই একমাত্র পথ — তাড়াহুড়া করলে ক্ষতি, শান্তিতে এগোলে ফল নিশ্চিত।\n\n✨ **আধ্যাত্মিক দিক:** শনিবার গরিবের সেবা করুন, কালো তিল দান করুন। "হনুমান চালিশা" পাঠ করলে শনির কঠিন প্রভাব সহজ হয়।\n\n⏰ **সময়ানুযায়ী:** সূর্যাস্তের সময় শনির প্রভাব সবচেয়ে তীব্র। এই সময় ঝগড়া বা গুরুত্বপূর্ণ সিদ্ধান্ত এড়িয়ে চলুন।',
    neutral: '🪐 শনির দৃষ্টি জীবনকে একটি কঠোর শিক্ষকের মতো নির্দেশ দিচ্ছে। দায়িত্ব পালনে সংযম, বাণীতে মিতব্যয়িতা এবং কাজে একাগ্রতা — এই তিনটি গুণ এখন বিশেষভাবে প্রয়োজন। স্থিতিশীলতা আসবে, তবে সময়ের নিয়মে।\n\n✨ **আধ্যাত্মিক দিক:** নিয়মিত যোগাসন ও প্রাণায়াম শনির প্রভাবকে ইতিবাচক করে। শনিবার উপবাস করলে মন স্থির হয়।\n\n⏰ **সময়ানুযায়ী:** ভোর ৪-৬টায় শনির ধ্যান করলে দিনের বাকি সময় শান্তিতে কাটে।',
    career: '🪐 শনির দৃষ্টি পড়েছে — কর্মক্ষেত্রে দায়িত্ব বাড়বে, পরিশ্রম বাড়বে, তবে স্বীকৃতিও আসবে। যারা নিষ্ঠার সঙ্গে কাজ করেছেন, তাদের জন্য পদোন্নতির সুযোগ দূরে নয়। কিন্তু এড়িয়ে যাওয়ার মনোভাব রাখলে শনি কঠোর হবেন।\n\n✨ **আধ্যাত্মিক দিক:** শনিবার কর্মস্থলে নিয়ম মেনে চলুন। অফিসের দক্ষিণ-পশ্চিম কোণে তিলের তেলের প্রদীপ জ্বালান।\n\n⏰ **সময়ানুযায়ী:** সকাল ৯-১১টায় গুরুত্বপূর্ণ কাজ করুন। দুপুর ১২-২টার মধ্যে বিশ্রাম নিন।',
    health: '🪐 শনির প্রভাবে হাড়, জয়েন্ট ও দাঁতের দিকে মনোযোগ দেওয়া জরুরি। বয়সজনিত ক্লান্তি বা দীর্ঘস্থায়ী রোগ থাকলে অবহেলা নয়। নিয়মিত ব্যায়াম, ক্যালসিয়াম সমৃদ্ধ খাবার ও পর্যাপ্ত বিশ্রাম — এই তিনটি শনির ওষুধ।\n\n✨ **আধ্যাত্মিক দিক:** শনিবার সকালে সূর্যকে প্রণাম করুন। তিলের তেল মালিশ করলে হাড়ের সমস্যা কমে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৬-৭টায় হালকা ব্যায়াম করুন। সন্ধ্যায় ১০ মিনিট ধ্যান করুন।',
    finance: '🪐 শনির দৃষ্টিতে অর্থের ক্ষেত্রে সংযম আবশ্যক। বড় বিনিয়োগে তাড়াহুড়া নয়, ঋণ নেওয়ার আগে দশবার ভাবুন। সঞ্চয়ই এই সময়ের সবচেয়ে নিরাপদ পথ — ক্ষুদ্র কিন্তু নিয়মিত সঞ্চয় ভবিষ্যতের ভিত তৈরি করবে।\n\n✨ **আধ্যাত্মিক দিক:** শনিবার তিল ও কালো উড়দ দান করুন। সঞ্চয়ের কিছু অংশ গরিবের সেবায় ব্যয় করুন।\n\n⏰ **সময়ানুযায়ী:** সন্ধ্যা ৫-৭টায় আর্থিক পরিকল্পনা করুন। রাত ৯টার পর লেনদেন এড়িয়ে চলুন।',
    love: '🪐 শনির দৃষ্টিতে সম্পর্কে একটি দূরত্বের অনুভূতি আসতে পারে, কিন্তু এটি শেষ নয় — পরীক্ষা। যে সম্পর্ক সত্যিকারের, তা এই কঠিন সময়ে আরও গভীর হয়। সঙ্গীকে সময় ও মনোযোগ দিন, অভিমান গিলে ফেলুন।\n\n✨ **আধ্যাত্মিক দিক:** শনিবার সঙ্গীর সাথে মন্দিরে যান। সম্পর্কের শান্তির জন্য "ওঁ নমঃ শিবায়" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** সন্ধ্যা ৬-৮টায় সঙ্গীর সাথে সময় কাটান। রাতে তর্কে না জড়িয়ে নীরবতা পালন করুন।'
  },

  jupiter: {
    positive: '♃ বৃহস্পতির শুভ দৃষ্টি পড়েছে — এটি আকাশের সবচেয়ে মহৎ আলো। দেবগুরুর এই দৃষ্টি যেখানে পড়ে, সেখানে জ্ঞান, সম্প্রসারণ ও সৌভাগ্য একসাথে আসে। ভেতরের প্রজ্ঞা জেগে উঠছে, জীবনের গভীরতর অর্থ খুঁজে পাওয়ার সময় এসেছে।\n\n✨ **আধ্যাত্মিক দিক:** বৃহস্পতিবার উপবাস করুন। "ওঁ গ্রাং গ্রীং গ্রৌং সঃ গুরুবে নমঃ" মন্ত্র ১০৮ বার জপ করলে গুরুর আশীর্বাদ লাভ হয়।\n\n⏰ **সময়ানুযায়ী:** সকাল ৭-৯টায় ধ্যান ও প্রার্থনা করুন। দুপুরে গুরুজনকে প্রণাম করুন।',
    negative: '♃ বৃহস্পতির দৃষ্টি আছে, তবে সাবধান — অতিরিক্ত আশাবাদ বা অহংকার এই শুভ শক্তিকে নষ্ট করতে পারে। গুরুর আশীর্বাদ তখনই ফলপ্রসূ হয়, যখন বিনয় থাকে। বাস্তবতার মাটিতে পা রেখে স্বপ্ন দেখুন।\n\n✨ **আধ্যাত্মিক দিক:** বৃহস্পতিবার দান-ধ্যানে মন দিন। অহংকার কমাতে "ওঁ নমঃ শিবায়" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** দুপুর ১২-২টায় অতিরিক্ত আশাবাদী সিদ্ধান্ত নেবেন না। সন্ধ্যায় পরিকল্পনা পুনর্বিবেচনা করুন।',
    neutral: '♃ বৃহস্পতির দৃষ্টি জীবনে একটি প্রসারমান শক্তি এনেছে। গুরুজনের আশীর্বাদ মিলবে, নতুন জ্ঞান আসবে, আত্মার গভীরতা বাড়বে। এই দৃষ্টি সৌভাগ্যের দ্বার খোলে — তবে কেবল তাদের জন্য যারা যোগ্যতার সঙ্গে এগিয়ে আসে।\n\n✨ **আধ্যাত্মিক দিক:** বৃহস্পতিবার ধর্মীয় গ্রন্থ পাঠ করুন। জ্ঞান দান করলে পুণ্য অর্জন হয়।\n\n⏰ **সময়ানুযায়ী:** সকাল ৮-১০টায় জ্ঞানার্জনের কাজ করুন। রাতে গুরুর ধ্যান করুন।',
    career: '♃ বৃহস্পতির দৃষ্টিতে কর্মক্ষেত্রে উন্নতির দরজা খুলছে। পদোন্নতি, নতুন দায়িত্ব বা উচ্চশিক্ষার সুযোগ আসতে পারে। শিক্ষা, গবেষণা ও আইন সংক্রান্ত কাজে এই সময় বিশেষ অনুকূল। দেরি না করে এগিয়ে যান।\n\n✨ **আধ্যাত্মিক দিক:** বৃহস্পতিবার অফিসে হলুদ রঙের বস্তু রাখুন। গুরুর ছবি স্থাপন করলে কর্মক্ষেত্রে স্থিতিশীলতা আসে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৯-১১টায় গুরুত্বপূর্ণ প্রস্তাব জমা দিন। দুপুরে কর্তৃপক্ষের সাথে সাক্ষাৎ করুন।',
    health: '♃ বৃহস্পতির প্রভাবে রোগ প্রতিরোধ ক্ষমতা বাড়বে, শরীর ও মনে একটি প্রাণময়তা অনুভব হবে। তবে অতিভোজন ও অলসতা থেকে সাবধান — বৃহস্পতির অতিরিক্ততার দোষও আছে। আধ্যাত্মিক চর্চা ও প্রকৃতির কাছাকাছি থাকুন।\n\n✨ **আধ্যাত্মিক দিক:** বৃহস্পতিবার সূর্যনমস্কার করুন। হলুদ রঙের খাবার (ছোলা, ডাল) স্বাস্থ্যের জন্য উপকারী।\n\n⏰ **সময়ানুযায়ী:** সকাল ৬-৭টায় হাঁটতে যান। সন্ধ্যায় প্রাণায়াম করুন।',
    finance: '♃ বৃহস্পতির দৃষ্টিতে আর্থিক সম্প্রসারণের সুযোগ আসছে। দীর্ঘমেয়াদী বিনিয়োগ — শিক্ষা, সম্পদ বা ব্যবসায় — এই সময়ে ফলদায়ক। তবে অতিরিক্ত সম্প্রসারণের প্রলোভন এড়িয়ে চলুন, ভিত মজবুত করুন।\n\n✨ **আধ্যাত্মিক দিক:** বৃহস্পতিবার লক্ষ্মীপূজা করুন। সঞ্চয়ের কিছু অংশ দান করুন।\n\n⏰ **সময়ানুযায়ী:** সকাল ৮-১০টায় বিনিয়োগের পরিকল্পনা করুন। সন্ধ্যায় লাভের হিসাব করুন।',
    love: '♃ বৃহস্পতির দৃষ্টিতে সম্পর্কে বিশ্বাস ও গভীরতা বাড়বে। বিবাহ, বাগদান বা সন্তানের সুখবর আসতে পারে। আত্মিক মিলনের এই সময় — সঙ্গীকে কেবল শরীর নয়, মন দিয়ে ভালোবাসুন।\n\n✨ **আধ্যাত্মিক দিক:** বৃহস্পতিবার সঙ্গীর সাথে মন্দিরে যান। সম্পর্কের পবিত্রতা রক্ষায় মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** সকাল ১০-১২টায় সঙ্গীর সাথে সময় কাটান। রাতে একসাথে প্রার্থনা করুন।'
  },

  mars: {
    positive: '♂ মঙ্গলের শুভ দৃষ্টি পড়েছে — এটি যুদ্ধের দেবতার বিজয়ী হাত। সাহস, উদ্যম ও প্রতিযোগিতায় এগিয়ে যাওয়ার শক্তি এখন চরমে। নতুন উদ্যোগ শুরু করার, শত্রুকে পরাজিত করার এবং নিজেকে প্রমাণ করার এটাই শ্রেষ্ঠ সময়।\n\n✨ **আধ্যাত্মিক দিক:** মঙ্গলবার হনুমান চালিশা পাঠ করুন। "ওঁ ক্রাং ক্রীং ক্রৌং সঃ ভৌমায় নমঃ" মন্ত্র জপ করলে সাহস বাড়ে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৬-৮টায় শারীরিক ব্যায়াম করুন। দুপুরে গুরুত্বপূর্ণ কাজের সিদ্ধান্ত নিন।',
    negative: '♂ মঙ্গলের দৃষ্টি পড়েছে — এই শক্তি আগুনের মতো, নিয়ন্ত্রণে রাখলে আলো দেয়, বেপরোয়া হলে পোড়ায়। রাগ, তর্ক ও দুর্ঘটনার সম্ভাবনা বেশি। মাথা ঠান্ডা রাখুন, সিদ্ধান্ত নেওয়ার আগে একবার নিশ্বাস ফেলুন।\n\n✨ **আধ্যাত্মিক দিক:** মঙ্গলবার ধ্যান করুন। রাগ নিয়ন্ত্রণে "ওঁ হনুমতে নমঃ" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** দুপুর ১২-২টায় ঝগড়া এড়িয়ে চলুন। সন্ধ্যায় শান্ত পরিবেশে থাকুন।',
    neutral: '♂ মঙ্গলের দৃষ্টি উদ্যম ও কর্মশক্তি বাড়াচ্ছে। প্রতিযোগিতায় সক্রিয় হওয়ার সময় এসেছে। তবে এই শক্তিকে গঠনমূলক কাজে লাগান — অকারণ সংঘর্ষে নষ্ট করবেন না।\n\n✨ **আধ্যাত্মিক দিক:** মঙ্গলবার সূর্যকে প্রণাম করুন। নিয়মিত ব্যায়াম করলে মঙ্গলের শক্তি সঠিক দিকে যায়।\n\n⏰ **সময়ানুযায়ী:** সকাল ৭-৯টায় নতুন কাজ শুরু করুন। বিকালে পরিকল্পনা করুন।',
    career: '♂ মঙ্গলের দৃষ্টিতে কর্মক্ষেত্রে প্রতিযোগিতা তীব্র হবে। যারা সাহস নিয়ে এগিয়ে আসবেন, তারা এগিয়ে যাবেন। নতুন প্রকল্পে নেতৃত্ব নিতে পারেন — মঙ্গল সাহসীদের পক্ষে।\n\n✨ **আধ্যাত্মিক দিক:** মঙ্গলবার অফিসে লাল রঙের বস্তু রাখুন। হনুমানজির ছবি স্থাপন করলে সাহস বাড়ে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৯-১১টায় গুরুত্বপূর্ণ প্রস্তাব জমা দিন। দুপুরে প্রতিযোগিতায় অংশ নিন।',
    health: '♂ মঙ্গলের প্রভাবে রক্তচাপ, প্রদাহ ও আঘাতের প্রবণতা বাড়তে পারে। রাগ নিয়ন্ত্রণ করুন, কারণ মানসিক উত্তেজনা সরাসরি শরীরে প্রভাব ফেলে। তীক্ষ্ণ যন্ত্র ও যানবাহনে সাবধান থাকুন।\n\n✨ **আধ্যাত্মিক দিক:** মঙ্গলবার সকালে ঠান্ডা জল পান করুন। রক্তচাপ নিয়ন্ত্রণে "ওঁ হনুমতে নমঃ" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** সকাল ৫-৭টায় হালকা ব্যায়াম করুন। রাতে তাড়াতাড়ি ঘুমাতে যান।',
    finance: '♂ মঙ্গলের দৃষ্টিতে ঝুঁকিপূর্ণ বিনিয়োগ থেকে দূরে থাকুন — এই গ্রহ দ্রুতগতির, কিন্তু পরিণামে অস্থির। প্রতিযোগিতামূলক ব্যবসা বা ঠিকাদারিতে লাভ আসতে পারে। তবে চুক্তি সই করার আগে খুঁটিনাটি দেখুন।\n\n✨ **আধ্যাত্মিক দিক:** মঙ্গলবার দান-ধ্যানে মন দিন। অর্থের অপচয় রোধে সঞ্চয়ী হোন।\n\n⏰ **সময়ানুযায়ী:** সকাল ৮-১০টায় বিনিয়োগের পরিকল্পনা করুন। সন্ধ্যায় লাভের হিসাব করুন।',
    love: '♂ মঙ্গলের দৃষ্টিতে সম্পর্কে আবেগ ও উত্তেজনা দুটোই বাড়বে। প্রেমের গভীরতা অনুভব করবেন, কিন্তু অহং ও জেদ সামলাতে হবে। ছোট্ট বিষয়কে বড় ঝগড়ায় পরিণত করবেন না — সংঘর্ষ নয়, সংলাপ বেছে নিন।\n\n✨ **আধ্যাত্মিক দিক:** মঙ্গলবার সঙ্গীর সাথে মন্দিরে যান। সম্পর্কের শান্তির জন্য "ওঁ নমঃ শিবায়" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** সন্ধ্যা ৬-৮টায় সঙ্গীর সাথে সময় কাটান। রাতে ঝগড়া এড়িয়ে চলুন।'
  },

  mercury: {
    positive: '☿ বুধের শুভ দৃষ্টি পড়েছে — বুদ্ধির দেবতার এই দৃষ্টি মনকে তীক্ষ্ণ করে, ভাষাকে সাবলীল করে। যোগাযোগ, লেখালেখি, ব্যবসা বা পড়াশোনায় এই সময় বিশেষ অনুকূল। নতুন জ্ঞান দ্রুত আত্মস্থ হবে, ধারণাগুলো স্পষ্ট হবে।\n\n✨ **আধ্যাত্মিক দিক:** বুধবার সরস্বতী পূজা করুন। "ওঁ ব্রাং ব্রীং ব্রৌং সঃ বুধায় নমঃ" মন্ত্র জপ করলে বুদ্ধি বাড়ে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৬-৮টায় নতুন কিছু শিখুন। দুপুরে লেখালেখি ও আলোচনায় মন দিন।',
    negative: '☿ বুধের দৃষ্টি আছে, তবে সাবধান — বাকবিতণ্ডা, তথ্যের বিভ্রান্তি বা চুক্তিতে গোলমাল হতে পারে। কথা বলার আগে ভাবুন, কলম চালানোর আগে পড়ুন। দ্বিধার মুহূর্তে তৃতীয় কারও পরামর্শ নিন।\n\n✨ **আধ্যাত্মিক দিক:** বুধবার সত্য কথা বলার অভ্যাস গড়ে তুলুন। বিভ্রান্তি দূর করতে "ওঁ নমঃ শিবায়" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** দুপুর ১২-২টায় গুরুত্বপূর্ণ আলোচনা এড়িয়ে চলুন। সন্ধ্যায় চুক্তি পুনর্বিবেচনা করুন।',
    neutral: '☿ বুধের দৃষ্টি বুদ্ধিবৃত্তিক কাজে সহায়তা দিচ্ছে। বিশ্লেষণ, পরিকল্পনা ও যোগাযোগে দক্ষতা বাড়বে। এই সময় যা পড়বেন বা শিখবেন, তা দীর্ঘস্থায়ী ছাপ ফেলবে।\n\n✨ **আধ্যাত্মিক দিক:** বুধবার সরস্বতী বন্দনা করুন। নিয়মিত অধ্যয়ন করলে বুদ্ধি তীক্ষ্ণ হয়।\n\n⏰ **সময়ানুযায়ী:** সকাল ৭-৯টায় নতুন জ্ঞান অর্জন করুন। বিকালে পরিকল্পনা করুন।',
    career: '☿ বুধের দৃষ্টিতে ব্যবসা, উপস্থাপনা ও যোগাযোগ-নির্ভর কাজে সাফল্য আসবে। লেখালেখি, সাংবাদিকতা, শিক্ষকতা বা আইটিতে বিশেষ সুবিধা। গুরুত্বপূর্ণ বৈঠক বা প্রস্তাব পেশ করার উপযুক্ত সময়।\n\n✨ **আধ্যাত্মিক দিক:** বুধবার অফিসে সবুজ রঙের বস্তু রাখুন। সরস্বতীর ছবি স্থাপন করলে বুদ্ধি বাড়ে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৯-১১টায় গুরুত্বপূর্ণ উপস্থাপনা দিন। দুপুরে চুক্তি সই করুন।',
    health: '☿ বুধের প্রভাবে স্নায়ুতন্ত্র ও শ্বাসতন্ত্রের যত্ন নেওয়া জরুরি। অতিরিক্ত মানসিক চাপ স্নায়ুকে দুর্বল করে — মেডিটেশন ও গভীর শ্বাসের অভ্যাস করুন। কথা বলা ও লেখা নিজেই এক ধরনের মানসিক চিকিৎসা।\n\n✨ **আধ্যাত্মিক দিক:** বুধবার প্রাণায়াম করুন। সবুজ রঙের খাবার (শাক, ফল) স্বাস্থ্যের জন্য উপকারী।\n\n⏰ **সময়ানুযায়ী:** সকাল ৬-৭টায় গভীর শ্বাসের ব্যায়াম করুন। সন্ধ্যায় মেডিটেশন করুন।',
    finance: '☿ বুধের দৃষ্টিতে ছোট ও মাঝারি বিনিয়োগে লাভ আসবে। ব্যবসায়িক চুক্তি ও অংশীদারিতে সুবিধা। তবে মৌখিক প্রতিশ্রুতিতে নির্ভর না করে সব লিখিতে রাখুন — বুধ নথিপত্রের দেবতাও বটে।\n\n✨ **আধ্যাত্মিক দিক:** বুধবার দান-ধ্যানে মন দিন। অর্থের অপচয় রোধে সঞ্চয়ী হোন।\n\n⏰ **সময়ানুযায়ী:** সকাল ৮-১০টায় বিনিয়োগের পরিকল্পনা করুন। সন্ধ্যায় লাভের হিসাব করুন।',
    love: '☿ বুধের দৃষ্টিতে সম্পর্কে যোগাযোগের মান উন্নত হবে। যা মনে পুষে রাখছিলেন, তা বলার সাহস এখন আসবে। খোলামেলা কথোপকথনই এই সময়ের সেরা প্রেমের ভাষা — চুপ থাকলে ভুল বোঝাবুঝি বাড়বে।\n\n✨ **আধ্যাত্মিক দিক:** বুধবার সঙ্গীর সাথে মন্দিরে যান। সম্পর্কের শান্তির জন্য সরস্বতী বন্দনা করুন।\n\n⏰ **সময়ানুযায়ী:** সকাল ১০-১২টায় সঙ্গীর সাথে কথা বলুন। রাতে একসাথে প্রার্থনা করুন।'
  },

  venus: {
    positive: '♀ শুক্রের শুভ দৃষ্টি পড়েছে — সৌন্দর্য ও প্রেমের দেবীর এই দৃষ্টি জীবনকে রঙিন করে তোলে। সম্পর্কে মাধুর্য আসবে, শিল্প ও সৌন্দর্যের প্রতি আগ্রহ বাড়বে, সামাজিক জীবনে নতুন বন্ধন তৈরি হবে। আনন্দ ও সৌকর্যের সময় এটি।\n\n✨ **আধ্যাত্মিক দিক:** শুক্রবার লক্ষ্মীপূজা করুন। "ওঁ দ্রাং দ্রীং দ্রৌং সঃ শুক্রায় নমঃ" মন্ত্র জপ করলে প্রেম ও সৌন্দর্যে সাফল্য আসে।\n\n⏰ **সময়ানুযায়ী:** সন্ধ্যা ৬-৮টায় প্রিয়জনের সাথে সময় কাটান। রাতে সঙ্গীত ও শিল্পচর্চা করুন।',
    negative: '♀ শুক্রের দৃষ্টি আছে, কিন্তু বিলাসিতা ও ইন্দ্রিয়সুখের প্রতি আকর্ষণ বিপদ ডাকতে পারে। অতিরিক্ত খরচ, অলস আনন্দ বা ভুল আকর্ষণে না জড়ানোই ভালো। সংযমের সঙ্গে সৌন্দর্য উপভোগ করুন।\n\n✨ **আধ্যাত্মিক দিক:** শুক্রবার ধ্যান করুন। ইন্দ্রিয় নিয়ন্ত্রণে "ওঁ নমঃ শিবায়" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** দুপুর ১২-২টায় বিলাসিতায় খরচ এড়িয়ে চলুন। সন্ধ্যায় বাজেট পরিকল্পনা করুন।',
    neutral: '♀ শুক্রের দৃষ্টি সামাজিক ও সৃজনশীল জীবনে আলো এনেছে। নতুন বন্ধুত্ব বা পরিচয় হতে পারে। সৌন্দর্যবোধ ও শিল্পকলার প্রতি আগ্রহ বাড়বে। জীবনের ছোট ছোট আনন্দগুলো উপভোগ করুন।\n\n✨ **আধ্যাত্মিক দিক:** শুক্রবার সৌন্দর্যচর্চায় মন দিন। নিয়মিত পূজা করলে মনে প্রশান্তি আসে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৮-১০টায় সামাজিক কাজে অংশ নিন। বিকালে সৃজনশীল কাজ করুন।',
    career: '♀ শুক্রের দৃষ্টিতে শিল্প, সংগীত, ফ্যাশন, সৌন্দর্য ও বিনোদন শিল্পে বিশেষ সাফল্য আসবে। সামাজিক সম্পর্ক ও কূটনীতির কাজে শুক্র সহায়। নতুন ক্লায়েন্ট বা অংশীদারিত্বের সুযোগ আসতে পারে।\n\n✨ **আধ্যাত্মিক দিক:** শুক্রবার অফিসে সাদা বা গোলাপি রঙের বস্তু রাখুন। লক্ষ্মীর ছবি স্থাপন করলে সৌভাগ্য আসে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৯-১১টায় সামাজিক যোগাযোগ করুন। দুপুরে সৃজনশীল কাজে মন দিন।',
    health: '♀ শুক্রের প্রভাবে ত্বক, কিডনি ও হরমোনজনিত বিষয়ে সচেতন থাকুন। অতিরিক্ত মিষ্টি ও চর্বিজাতীয় খাবার এড়িয়ে চলুন। সৌন্দর্য চর্চার মাধ্যমে নিজেকে ভালো রাখুন — মন ভালো থাকলে শরীরও সুস্থ থাকে।\n\n✨ **আধ্যাত্মিক দিক:** শুক্রবার সকালে স্নানের পর চন্দন লাগান। সাদা রঙের খাবার (দুধ, দই) স্বাস্থ্যের জন্য উপকারী।\n\n⏰ **সময়ানুযায়ী:** সকাল ৬-৭টায় হালকা ব্যায়াম করুন। সন্ধ্যায় সৌন্দর্যচর্চা করুন।',
    finance: '♀ শুক্রের দৃষ্টিতে বিলাসিতায় খরচ বাড়ার প্রবণতা থাকবে — বাজেট মেনে চলুন। সৌন্দর্য, শিল্প বা বিনোদনে বিনিয়োগ লাভজনক হতে পারে। তবে আবেগে পড়ে বড় কোনো কেনাকাটা করবেন না।\n\n✨ **আধ্যাত্মিক দিক:** শুক্রবার দান-ধ্যানে মন দিন। লক্ষ্মীপূজা করলে আর্থিক স্থিতিশীলতা আসে।\n\n⏰ **সময়ানুযায়ী:** সকাল ৮-১০টায় বিনিয়োগের পরিকল্পনা করুন। সন্ধ্যায় সঞ্চয়ের হিসাব করুন।',
    love: '♀ শুক্রের দৃষ্টি প্রেম ও সম্পর্কে সবচেয়ে মধুর আলো ফেলে। সঙ্গীর সঙ্গে ঘনিষ্ঠতা বাড়বে, আনন্দময় মুহূর্ত তৈরি হবে। নতুন প্রেমের সম্ভাবনাও উড়িয়ে দেওয়া যায় না। হৃদয়কে খোলা রাখুন।\n\n✨ **আধ্যাত্মিক দিক:** শুক্রবার সঙ্গীর সাথে মন্দিরে যান। সম্পর্কের মধুরতার জন্য "ওঁ শ্রীং মহালক্ষ্মী নমঃ" মন্ত্র জপ করুন।\n\n⏰ **সময়ানুযায়ী:** সন্ধ্যা ৬-৮টায় ডেট নাইট প্ল্যান করুন। রাতে একসাথে প্রার্থনা করুন।'
  }
};

// ==================== দৃষ্টির মৌলিক ফাংশন ====================

/**
 * দৃষ্টি গণনার সাধারণ ফাংশন
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @param {Array} aspectHouses - দৃষ্টির ভাবের তালিকা
 * @returns {boolean}
 */
function hasAspect(sourceRashi, targetRashi, aspectHouses) {
  const diff = (targetRashi - sourceRashi + 12) % 12;
  return aspectHouses.includes(diff);
}

/**
 * শনির দৃষ্টি (3, 7, 10 – পূর্ণ দৃষ্টি)
 * @param {number} saturnRashi - শনির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isSaturnAspect(saturnRashi, targetRashi) {
  return hasAspect(saturnRashi, targetRashi, ASPECT_DEFINITIONS.saturn.houses);
}

/**
 * বৃহস্পতির দৃষ্টি (5, 7, 9 – পূর্ণ দৃষ্টি)
 * @param {number} jupiterRashi - বৃহস্পতির রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isJupiterAspect(jupiterRashi, targetRashi) {
  return hasAspect(jupiterRashi, targetRashi, ASPECT_DEFINITIONS.jupiter.houses);
}

/**
 * মঙ্গলের দৃষ্টি (4, 7, 8 – পূর্ণ দৃষ্টি)
 * @param {number} marsRashi - মঙ্গলের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isMarsAspect(marsRashi, targetRashi) {
  return hasAspect(marsRashi, targetRashi, ASPECT_DEFINITIONS.mars.houses);
}

/**
 * বুধের দৃষ্টি (7 – পূর্ণ দৃষ্টি)
 * @param {number} mercuryRashi - বুধের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isMercuryAspect(mercuryRashi, targetRashi) {
  return hasAspect(mercuryRashi, targetRashi, ASPECT_DEFINITIONS.mercury.houses);
}

/**
 * শুক্রের দৃষ্টি (7 – পূর্ণ দৃষ্টি)
 * @param {number} venusRashi - শুক্রের রাশি (0-11)
 * @param {number} targetRashi - লক্ষ্য রাশি (0-11)
 * @returns {boolean}
 */
function isVenusAspect(venusRashi, targetRashi) {
  return hasAspect(venusRashi, targetRashi, ASPECT_DEFINITIONS.venus.houses);
}

// ==================== উন্নত দৃষ্টি বিশ্লেষণ ====================

/**
 * দৃষ্টির তীব্রতা নির্ণয় (পূর্ণ/অর্ধ/ক্ষীণ)
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {string} planet - গ্রহের নাম
 * @returns {Object} - { strength, multiplier, icon, name, meaning }
 */
function getAspectStrengthDetailed(sourceRashi, targetRashi, planet) {
  const def = ASPECT_DEFINITIONS[planet];
  if (!def) return ASPECT_STRENGTH.weak;
  
  const diff = (targetRashi - sourceRashi + 12) % 12;
  if (def.houses.includes(diff)) {
    return ASPECT_STRENGTH.full;
  }
  
  // মঙ্গলের অর্ধ দৃষ্টি (৪র্থ ভাবে)
  if (planet === 'mars' && diff === 4) {
    return ASPECT_STRENGTH.half;
  }
  
  return ASPECT_STRENGTH.weak;
}

/**
 * দৃষ্টির প্রকৃতি নির্ণয় (শুভ/অশুভ/মধ্যম)
 * @param {string} planet - গ্রহের নাম
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {Object} additionalFactors - অতিরিক্ত ফ্যাক্টর (ঐচ্ছিক)
 * @returns {string} - 'shubha', 'ashubha', 'madhyama'
 */
function getAspectNature(planet, targetRashi, additionalFactors = {}) {
  const def = ASPECT_DEFINITIONS[planet];
  if (!def) return 'madhyama';
  
  // গ্রহের স্বাভাবিক প্রকৃতি
  const naturalNatures = {
    saturn: 'ashubha',
    jupiter: 'shubha',
    mars: 'ashubha',
    mercury: 'shubha',
    venus: 'shubha'
  };
  
  let nature = naturalNatures[planet] || 'madhyama';
  
  // উচ্চ রাশি তালিকা (0-indexed: মেষ=0 … মীন=11)
  const exaltationRashis = {
    sun: 0,       // মেষ
    moon: 2,      // বৃষ
    mars: 9,      // মকর
    mercury: 5,   // কন্যা
    jupiter: 3,   // কর্কট
    venus: 11,    // মীন
    saturn: 6     // তুলা
  };

  if (exaltationRashis[planet] === targetRashi) {
    nature = nature === 'shubha' ? 'shubha' : 'madhyama';
  }
  
  return nature;
}

/**
 * দৃষ্টির সম্পূর্ণ বিশ্লেষণ (গ্রহ, রাশি, তীব্রতা, প্রকৃতি, প্রভাব)
 * @param {string} planet - গ্রহের নাম
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {string} category - 'general', 'career', 'health', 'finance', 'love'
 * @returns {Object}
 */
function getAspectAnalysis(planet, sourceRashi, targetRashi, category = 'general') {
  const has = hasAspect(sourceRashi, targetRashi, ASPECT_DEFINITIONS[planet]?.houses || []);
  if (!has) return null;
  
  const strength = getAspectStrengthDetailed(sourceRashi, targetRashi, planet);
  const nature = getAspectNature(planet, targetRashi);
  const desc = ASPECT_DESCRIPTIONS[planet];
  
  let text = '';
  if (desc) {
    if (category === 'general') text = desc.neutral;
    else if (category === 'career') text = desc.career || desc.neutral;
    else if (category === 'health') text = desc.health || desc.neutral;
    else if (category === 'finance') text = desc.finance || desc.neutral;
    else if (category === 'love') text = desc.love || desc.neutral;
    else text = desc.neutral;
  }
  
  return {
    planet: planet,
    planetName: getPlanetName(planet),
    planetIcon: getPlanetIcon(planet),
    hasAspect: true,
    strength: strength.name,
    strengthIcon: strength.icon,
    multiplier: strength.multiplier,
    nature: nature,
    isShubha: nature === 'shubha',
    isAshubha: nature === 'ashubha',
    description: text,
    mantra: ASPECT_DEFINITIONS[planet]?.mantra || '',
    deity: ASPECT_DEFINITIONS[planet]?.deity || '',
    category: category
  };
}

/**
 * গ্রহের বাংলা নাম
 * @param {string} planet - ইংরেজি নাম
 * @returns {string}
 */
function getPlanetName(planet) {
  const names = {
    saturn: 'শনি',
    jupiter: 'বৃহস্পতি',
    mars: 'মঙ্গল',
    mercury: 'বুধ',
    venus: 'শুক্র'
  };
  return names[planet] || planet;
}

/**
 * গ্রহের প্রতীক
 * @param {string} planet - ইংরেজি নাম
 * @returns {string}
 */
function getPlanetIcon(planet) {
  const icons = {
    saturn: '🪐',
    jupiter: '♃',
    mars: '♂',
    mercury: '☿',
    venus: '♀'
  };
  return icons[planet] || '⭐';
}

// ==================== কম্বাইন্ড ফাংশন ====================

/**
 * সব গ্রহের দৃষ্টি একসাথে গণনা
 * @param {Object} planetRashis - { saturn, jupiter, mars, mercury, venus }
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @returns {Object} - { saturn, jupiter, mars, mercury, venus }
 */
function getAllAspects(planetRashis, targetRashi) {
  return {
    saturn: planetRashis.saturn !== undefined ? isSaturnAspect(planetRashis.saturn, targetRashi) : false,
    jupiter: planetRashis.jupiter !== undefined ? isJupiterAspect(planetRashis.jupiter, targetRashi) : false,
    mars: planetRashis.mars !== undefined ? isMarsAspect(planetRashis.mars, targetRashi) : false,
    mercury: planetRashis.mercury !== undefined ? isMercuryAspect(planetRashis.mercury, targetRashi) : false,
    venus: planetRashis.venus !== undefined ? isVenusAspect(planetRashis.venus, targetRashi) : false
  };
}

/**
 * সব গ্রহের বিস্তারিত দৃষ্টি বিশ্লেষণ
 * @param {Object} planetRashis - { saturn, jupiter, mars, mercury, venus }
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {string} category - 'general', 'career', 'health', 'finance', 'love'
 * @returns {Array}
 */
function getAllAspectsDetailed(planetRashis, targetRashi, category = 'general') {
  const results = [];
  const planets = ['saturn', 'jupiter', 'mars', 'mercury', 'venus'];
  
  for (const planet of planets) {
    const sourceRashi = planetRashis[planet];
    if (sourceRashi !== undefined) {
      const analysis = getAspectAnalysis(planet, sourceRashi, targetRashi, category);
      if (analysis) {
        results.push(analysis);
      }
    }
  }
  
  return results;
}

/**
 * দৃষ্টির সংক্ষিপ্ত বিবরণ (যেমন: "শনি, বৃহস্পতির দৃষ্টি")
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @returns {string}
 */
function getAspectSummary(aspects) {
  const activeAspects = [];
  if (aspects.saturn) activeAspects.push('🪐 শনি');
  if (aspects.jupiter) activeAspects.push('♃ বৃহস্পতি');
  if (aspects.mars) activeAspects.push('♂ মঙ্গল');
  if (aspects.mercury) activeAspects.push('☿ বুধ');
  if (aspects.venus) activeAspects.push('♀ শুক্র');
  
  if (activeAspects.length === 0) return '';
  if (activeAspects.length === 1) return `${activeAspects[0]}র দৃষ্টি বিদ্যমান।`;
  return `${activeAspects.slice(0, -1).join(', ')} ও ${activeAspects.slice(-1)}র দৃষ্টি বিদ্যমান।`;
}

/**
 * দৃষ্টির বিস্তারিত বিবরণ (প্রভাব সহ)
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {string} tone - 'positive', 'negative', 'neutral' (ডিফল্ট: 'neutral')
 * @returns {string}
 */
function getAspectText(aspects, tone = 'neutral') {
  const parts = [];
  
  if (aspects.saturn) {
    const desc = ASPECT_DESCRIPTIONS.saturn[tone] || ASPECT_DESCRIPTIONS.saturn.neutral;
    parts.push(desc);
  }
  if (aspects.jupiter) {
    const desc = ASPECT_DESCRIPTIONS.jupiter[tone] || ASPECT_DESCRIPTIONS.jupiter.neutral;
    parts.push(desc);
  }
  if (aspects.mars) {
    const desc = ASPECT_DESCRIPTIONS.mars[tone] || ASPECT_DESCRIPTIONS.mars.neutral;
    parts.push(desc);
  }
  if (aspects.mercury) {
    const desc = ASPECT_DESCRIPTIONS.mercury[tone] || ASPECT_DESCRIPTIONS.mercury.neutral;
    parts.push(desc);
  }
  if (aspects.venus) {
    const desc = ASPECT_DESCRIPTIONS.venus[tone] || ASPECT_DESCRIPTIONS.venus.neutral;
    parts.push(desc);
  }
  
  if (parts.length === 0) return '';
  return parts.join(' ');
}

/**
 * দৃষ্টির বিস্তারিত বিবরণ (বিভাগভিত্তিক)
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {string} category - 'career', 'health', 'finance', 'love'
 * @returns {string}
 */
function getAspectTextByCategory(aspects, category) {
  const parts = [];
  
  if (aspects.saturn && ASPECT_DESCRIPTIONS.saturn[category]) {
    parts.push(ASPECT_DESCRIPTIONS.saturn[category]);
  }
  if (aspects.jupiter && ASPECT_DESCRIPTIONS.jupiter[category]) {
    parts.push(ASPECT_DESCRIPTIONS.jupiter[category]);
  }
  if (aspects.mars && ASPECT_DESCRIPTIONS.mars[category]) {
    parts.push(ASPECT_DESCRIPTIONS.mars[category]);
  }
  if (aspects.mercury && ASPECT_DESCRIPTIONS.mercury[category]) {
    parts.push(ASPECT_DESCRIPTIONS.mercury[category]);
  }
  if (aspects.venus && ASPECT_DESCRIPTIONS.venus[category]) {
    parts.push(ASPECT_DESCRIPTIONS.venus[category]);
  }
  
  if (parts.length === 0) return '';
  return parts.join(' ');
}

/**
 * দৃষ্টির তীব্রতা নির্ণয় (পূর্ণ দৃষ্টি / অর্ধ দৃষ্টি) – সরল সংস্করণ
 * @param {number} sourceRashi - দৃষ্টিদাতা গ্রহের রাশি
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {Array} aspectHouses - দৃষ্টির ভাবের তালিকা
 * @returns {string} - 'full', 'half', 'none'
 */
function getAspectStrengthSimple(sourceRashi, targetRashi, aspectHouses) {
  const diff = (targetRashi - sourceRashi + 12) % 12;
  if (aspectHouses.includes(diff)) return 'full';
  return 'none';
}

/**
 * দৃষ্টির প্রভাবের সারাংশ (এক লাইনে)
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {string} category - 'general', 'career', 'health', 'finance', 'love'
 * @returns {string}
 */
function getAspectOneLiner(aspects, category = 'general') {
  const active = [];
  if (aspects.saturn) active.push('শনি');
  if (aspects.jupiter) active.push('বৃহস্পতি');
  if (aspects.mars) active.push('মঙ্গল');
  if (aspects.mercury) active.push('বুধ');
  if (aspects.venus) active.push('শুক্র');
  
  if (active.length === 0) return '';
  
  const categoryNames = {
    love: 'প্রেমে',
    career: 'কর্মক্ষেত্রে',
    health: 'স্বাস্থ্যে',
    finance: 'আর্থিক ক্ষেত্রে',
    general: 'জীবনে'
  };
  
  const catName = categoryNames[category] || 'জীবনে';
  return `${active.join(', ')}র দৃষ্টি ${catName} বিশেষ প্রভাব ফেলছে।`;
}

module.exports = {
  // মৌলিক দৃষ্টি ফাংশন
  isSaturnAspect,
  isJupiterAspect,
  isMarsAspect,
  isMercuryAspect,
  isVenusAspect,
  hasAspect,
  
  // উন্নত বিশ্লেষণ
  getAspectStrengthDetailed,
  getAspectNature,
  getAspectAnalysis,
  getPlanetName,
  getPlanetIcon,
  
  // কম্বাইন্ড ফাংশন
  getAllAspects,
  getAllAspectsDetailed,
  getAspectSummary,
  getAspectText,
  getAspectTextByCategory,
  getAspectStrengthSimple,
  getAspectOneLiner,
  
  // কনস্ট্যান্ট
  ASPECT_DEFINITIONS,
  ASPECT_DESCRIPTIONS,
  ASPECT_STRENGTH
};
