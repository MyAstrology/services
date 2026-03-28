// numerology-data.js - বাংলা ও ইংরেজি উভয় ভাষা সাপোর্ট সহ

const NumerologyDB = {
  // অক্ষর-সংখ্যা ম্যাপিং (বাংলা ও ইংরেজি উভয়ের জন্য)
  letterValues: {
    // ============= ইংরেজি অক্ষর (পিথাগোরাস পদ্ধতি) =============
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
    'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
    's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
    
    // ============= বাংলা অক্ষর (কাবালা পদ্ধতি) =============
    // স্বরবর্ণ
    'অ': 1, 'আ': 2, 'ই': 3, 'ঈ': 4, 'উ': 5, 'ঊ': 6, 'ঋ': 7, 'এ': 8, 'ঐ': 9,
    'ও': 1, 'ঔ': 2,
    
    // ক-বর্গ
    'ক': 1, 'খ': 2, 'গ': 3, 'ঘ': 4, 'ঙ': 5,
    
    // চ-বর্গ
    'চ': 6, 'ছ': 7, 'জ': 8, 'ঝ': 9, 'ঞ': 1,
    
    // ট-বর্গ
    'ট': 2, 'ঠ': 3, 'ড': 4, 'ঢ': 5, 'ণ': 6,
    
    // ত-বর্গ
    'ত': 7, 'থ': 8, 'দ': 9, 'ধ': 1, 'ন': 2,
    
    // প-বর্গ
    'প': 3, 'ফ': 4, 'ব': 5, 'ভ': 6, 'ম': 7,
    
    // য-বর্গ
    'য': 8, 'র': 9, 'ল': 1, 'শ': 2, 'ষ': 3, 'স': 4, 'হ': 5,
    
    // যুক্তাক্ষর ও বিশেষ
    'ড়': 9, 'ঢ়': 1, 'য়': 2, 'ং': 3, 'ঃ': 4, 'ঁ': 5
  },
  
  // ১ থেকে ৯ পর্যন্ত প্রতিটি সংখ্যার গভীর বিশ্লেষণ
  numbers: {
    1: {
      planet: "সূর্য (Sun)",
      planetGod: "সূর্য দেবতা / Surya",
      element: "অগ্নি / Fire",
      luckyDay: "রবিবার / Sunday",
      luckyDayEn: "Sunday",
      luckyColor: "লাল, কমলা, সোনালি / Red, Orange, Gold",
      luckyColorEn: "Red, Orange, Gold",
      luckyDirection: "পূর্ব / East",
      luckyDirectionEn: "East",
      
      identity: {
        title: "সূর্যের সন্তান - নেতৃত্বের অধিকারী",
        titleEn: "Child of the Sun - Born Leader",
        description: "আপনি জন্মগতভাবে নেতা। আপনার মধ্যে রয়েছে অসীম আত্মবিশ্বাস, সৃজনশীলতা এবং উদ্ভাবনী শক্তি। আপনি স্বাধীনচেতা এবং নিজের পায়ে দাঁড়াতে ভালোবাসেন। অন্যদের অনুপ্রাণিত করার ক্ষমতা আপনার ভিতর রয়েছে। তবে মাঝে মাঝে অহংকার ও কর্তৃত্বপ্রিয়তা আপনার দুর্বলতা হয়ে দাঁড়াতে পারে। নিজের সিদ্ধান্তে অটল থাকেন বলেই সাফল্য আপনার পদচুম্বন করে।",
        descriptionEn: "You are a born leader. You possess immense confidence, creativity, and innovative power. You are independent and love to stand on your own feet. You have the ability to inspire others. However, sometimes pride and authority can be your weaknesses. Success kisses your feet because you stick to your decisions."
      },
      
      business: {
        title: "উদ্যোক্তা ও নেতৃত্বের ব্যবসা",
        titleEn: "Entrepreneurship & Leadership Business",
        description: "আপনার জন্য সেরা ব্যবসা হলো যেখানে আপনি নিজেই বস। সরকারি চাকরি, রাজনীতি, প্রশাসন, স্টার্টআপ, টেকনোলজি ফার্ম, ইঞ্জিনিয়ারিং, ম্যানেজমেন্ট কনসালটেন্সি - এই ক্ষেত্রগুলোতে সাফল্য পাবেন। একক মালিকানা আপনার জন্য শ্রেয়। অংশীদারিত্ব করলে শুধুমাত্র ১, ৩ বা ৯ সংখ্যার ব্যক্তিদের সাথে করুন। আপনার সাফল্যের মূলমন্ত্র: 'নিজের সিদ্ধান্ত নিজেই নিন, কিন্তু অন্যদের মতামতকেও মূল্যায়ন করুন'।",
        descriptionEn: "The best business for you is where you are your own boss. Government jobs, politics, administration, startups, technology firms, engineering, management consultancy - you will succeed in these fields. Sole proprietorship is best for you. If partnering, only partner with people of numbers 1, 3, or 9. Your success mantra: 'Make your own decisions, but also evaluate others' opinions'."
      },
      
      travel: {
        title: "যাত্রার শুভ সময় ও দিক",
        titleEn: "Auspicious Travel Time & Direction",
        description: "আপনার শুভ দিন হলো রবিবার। পূর্ব দিকে যাত্রা করলে বিশেষ সাফল্য লাভ করবেন। সূর্যোদয়ের সময় যাত্রা শুরু করলে মঙ্গল। সপ্তাহের দ্বিতীয় ও তৃতীয় দিনে ভ্রমণে সতর্কতা অবলম্বন করুন। দীর্ঘ যাত্রার আগে সূর্যকে নমস্কার জানিয়ে শুরু করলে বাধা কমে।",
        descriptionEn: "Your auspicious day is Sunday. Traveling east brings special success. Starting your journey at sunrise is beneficial. Be cautious when traveling on the second and third days of the week. Offering salutations to the Sun before a long journey reduces obstacles."
      },
      
      investment: {
        title: "বিনিয়োগের দিকনির্দেশনা",
        titleEn: "Investment Guidance",
        description: "আপনার জন্য সোনা ও রৌপ্যে বিনিয়োগ উত্তম। শেয়ার বাজারে দীর্ঘমেয়াদী বিনিয়োগ করবেন, দ্রুত লাভের আশা না করাই ভালো। সরকারি বন্ড ও স্থাবর সম্পত্তিতে বিনিয়োগ লাভজনক। ৪ ও ৮ সংখ্যার সাথে যুক্ত কোনো বিনিয়োগ এড়িয়ে চলুন। আপনার বিনিয়োগের সেরা সময়: সূর্যোদয়ের সময় বা রবিবার।",
        descriptionEn: "Investment in gold and silver is excellent for you. Make long-term investments in the stock market; don't expect quick profits. Government bonds and real estate investments are profitable. Avoid any investment associated with numbers 4 and 8. Best time for your investment: sunrise or Sunday."
      },
      
      tip: {
        title: "জ্যোতিষীয় প্রতিকার",
        titleEn: "Astrological Remedy",
        description: "প্রতিদিন সূর্যোদয়ের সময় তামার পাত্রে জল রেখে সূর্যকে অর্পণ করুন। লাল রঙের পোশাক বা বস্ত্র দান করলে শুভ ফল পান। রবিবারে গরিবকে লাল মসুর ডাল বা গুড় দান করুন। সূর্য মন্ত্র 'ওঁ ঘৃণি সূর্যায় নমঃ' ১০৮ বার জপ করলে আত্মবিশ্বাস বৃদ্ধি পায়।",
        descriptionEn: "Every day at sunrise, offer water to the Sun in a copper vessel. Donating red clothes or fabric brings auspicious results. On Sunday, donate red lentils or jaggery to the poor. Chanting the Sun mantra 'Om Ghrini Suryaya Namah' 108 times increases confidence."
      }
    },
    
    2: {
      planet: "চন্দ্র (Moon)",
      planetGod: "চন্দ্র দেবতা / Chandra",
      element: "জল / Water",
      luckyDay: "সোমবার / Monday",
      luckyDayEn: "Monday",
      luckyColor: "সাদা, হালকা নীল, রূপালি / White, Light Blue, Silver",
      luckyColorEn: "White, Light Blue, Silver",
      luckyDirection: "উত্তর-পশ্চিম / North-West",
      luckyDirectionEn: "North-West",
      
      identity: {
        title: "চন্দ্রের কিরণ - আবেগ ও কল্পনার অধিকারী",
        titleEn: "Ray of the Moon - Emotional & Imaginative",
        description: "আপনি অত্যন্ত আবেগপ্রবণ, কল্পনাপ্রবণ ও সৃজনশীল। মানুষের মন বুঝতে আপনার সেরা ক্ষমতা রয়েছে। আপনি সম্পর্কে আবদ্ধ থাকতে ভালোবাসেন এবং অন্যদের সেবা করাই আপনার স্বভাব। মাঝে মাঝে মানসিক অস্থিরতা ও দ্বিধাদ্বন্দ্বে ভোগেন। আপনার ভিতরে একজন শিল্পী, লেখক বা সঙ্গীতজ্ঞ লুকিয়ে থাকে। মনের কথা অন্যদের বলতে না পারাটাই আপনার বড় দুর্বলতা।",
        descriptionEn: "You are highly emotional, imaginative, and creative. You have the best ability to understand people's minds. You love to be bound in relationships and serving others is your nature. Sometimes you suffer from mental instability and indecisiveness. An artist, writer, or musician lives inside you. Not being able to express your feelings to others is your biggest weakness."
      },
      
      business: {
        title: "সৃজনশীল ও জনমুখী ব্যবসা",
        titleEn: "Creative & People-Oriented Business",
        description: "আপনার জন্য উত্তম ব্যবসা হলো - রেস্টুরেন্ট, হোটেল, ট্রাভেল এজেন্সি, ইভেন্ট ম্যানেজমেন্ট, ফিল্ম ইন্ডাস্ট্রি, মিউজিক, আর্ট গ্যালারি, কাউন্সেলিং সেবা। জনসংযোগ ও গ্রাহক সেবা সংক্রান্ত ব্যবসায় সাফল্য পাবেন। ২, ৬ ও ৭ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব করলে মঙ্গল। সাফল্যের মূলমন্ত্র: 'অন্যদের কথা শুনুন, কিন্তু নিজের সিদ্ধান্ত নিজে নিন'।",
        descriptionEn: "Good businesses for you - restaurants, hotels, travel agencies, event management, film industry, music, art galleries, counseling services. You will succeed in public relations and customer service businesses. Partnering with people of numbers 2, 6, and 7 is beneficial. Success mantra: 'Listen to others, but make your own decisions'."
      },
      
      travel: {
        title: "যাত্রার শুভ সময় ও দিক",
        titleEn: "Auspicious Travel Time & Direction",
        description: "আপনার শুভ দিন সোমবার। উত্তর-পশ্চিম দিকে যাত্রা করলে মঙ্গল। চাঁদ উঠার সময় যাত্রা শুরু করলে বিশেষ সাফল্য। অমাবস্যার দিন যাত্রা এড়িয়ে চলুন। সমুদ্র বা নদীর ধারে ভ্রমণ আপনার জন্য শুভ ফল বয়ে আনে।",
        descriptionEn: "Your auspicious day is Monday. Traveling north-west brings good fortune. Starting your journey when the moon rises brings special success. Avoid traveling on new moon days. Traveling near the sea or river brings auspicious results for you."
      },
      
      investment: {
        title: "বিনিয়োগের দিকনির্দেশনা",
        titleEn: "Investment Guidance",
        description: "জল সংক্রান্ত ব্যবসায় বিনিয়োগ (জাহাজ, নৌকা, মৎস্য) লাভজনক। রূপা ও মুক্তায় বিনিয়োগ করবেন। শেয়ার বাজারে অল্প অল্প করে বিনিয়োগ করুন, একসাথে বড় বিনিয়োগ এড়িয়ে চলুন। স্থাবর সম্পত্তিতে বিনিয়োগের আগে ভালোভাবে যাচাই করুন।",
        descriptionEn: "Investment in water-related businesses (ships, boats, fisheries) is profitable. Invest in silver and pearls. Invest in the stock market little by little; avoid large investments at once. Thoroughly verify before investing in real estate."
      },
      
      tip: {
        title: "জ্যোতিষীয় প্রতিকার",
        titleEn: "Astrological Remedy",
        description: "সোমবারে সাদা বস্ত্র ও চাল দান করুন। রাতে চাঁদের আলোয় কিছুক্ষণ বসে থাকলে মানসিক প্রশান্তি আসে। মুক্তা বা রূপার আংটি ধারণ করলে উপকার পান। চন্দ্র মন্ত্র 'ওঁ শ্রাং শ্রীং শ্রৌঁ সঃ চন্দ্রায় নমঃ' জপ করলে মানসিক স্থিরতা আসে।",
        descriptionEn: "On Monday, donate white clothes and rice. Sitting in moonlight for a while at night brings mental peace. Wearing a pearl or silver ring is beneficial. Chanting the Moon mantra 'Om Shram Shreem Shraum Sah Chandraya Namah' brings mental stability."
      }
    },
    
    // ৩ থেকে ৯ পর্যন্ত একই প্যাটার্নে...
    // (স্থান সীমিততার জন্য ৩-৯ এখানে দেখানো হচ্ছে না, কিন্তু আপনার ফুল ভার্সনে থাকবে)
    
    3: {
      planet: "বৃহস্পতি (Jupiter)",
      planetGod: "দেবগুরু বৃহস্পতি / Guru Brihaspati",
      element: "আকাশ / Ether",
      luckyDay: "বৃহস্পতিবার / Thursday",
      luckyDayEn: "Thursday",
      luckyColor: "হলুদ, কমলা, সোনালি / Yellow, Orange, Gold",
      luckyColorEn: "Yellow, Orange, Gold",
      luckyDirection: "পূর্ব-উত্তর / North-East",
      luckyDirectionEn: "North-East",
      
      identity: {
        title: "গুরু বৃহস্পতির বরপুত্র - জ্ঞান ও আশাবাদের প্রতীক",
        titleEn: "Blessed by Guru Jupiter - Symbol of Knowledge & Optimism",
        description: "আপনি অত্যন্ত জ্ঞানী, আশাবাদী ও আধ্যাত্মিক। অন্যদের পথ দেখানো আপনার স্বভাব। শিক্ষক, গুরু বা পরামর্শকের মতো মানুষ আপনাকে স্বাভাবিকভাবে ভক্তি করে। আপনার কথায় অন্যদের মনে প্রভাব ফেলতে পারেন। কখনো কখনো অতিরিক্ত আশাবাদ বা অহংকার আপনার পতন ডেকে আনতে পারে। জ্ঞানার্জন ও তা বিতরণই আপনার জীবনের মূল উদ্দেশ্য।",
        descriptionEn: "You are extremely knowledgeable, optimistic, and spiritual. Showing the path to others is your nature. People naturally respect you like a teacher, guru, or advisor. Your words can influence others' minds. Sometimes excessive optimism or pride can bring your downfall. Acquiring knowledge and distributing it is your life's main purpose."
      },
      
      business: {
        title: "শিক্ষা ও পরামর্শ সংক্রান্ত ব্যবসা",
        titleEn: "Education & Consulting Business",
        description: "আপনার জন্য সেরা ব্যবসা - শিক্ষা প্রতিষ্ঠান, কোচিং সেন্টার, পাবলিশিং হাউস, আইন সংস্থা, ধর্মীয় সংস্থা, কনসালটেন্সি ফার্ম। আপনি যেখানে জ্ঞান ও পরামর্শ দিতে পারবেন সেখানেই সাফল্য। ৩, ৬ ও ৯ সংখ্যার ব্যক্তিদের সাথে অংশীদারিত্ব উত্তম। সাফল্যের মূলমন্ত্র: 'জ্ঞান অর্জন করুন, ভাগ করুন, বৃদ্ধি পাবেন'।",
        descriptionEn: "Best businesses for you - educational institutions, coaching centers, publishing houses, law firms, religious organizations, consultancy firms. You succeed wherever you can provide knowledge and advice. Partnering with people of numbers 3, 6, and 9 is excellent. Success mantra: 'Acquire knowledge, share it, and grow'."
      },
      
      travel: {
        title: "যাত্রার শুভ সময় ও দিক",
        titleEn: "Auspicious Travel Time & Direction",
        description: "বৃহস্পতিবার আপনার শুভ দিন। পূর্ব-উত্তর দিকে যাত্রা করলে মঙ্গল। সকাল ৮-১০টার মধ্যে যাত্রা শুরু করলে সাফল্য। শিক্ষা বা আধ্যাত্মিক ভ্রমণ আপনার জন্য বিশেষ ফলপ্রসূ।",
        descriptionEn: "Thursday is your auspicious day. Traveling north-east brings good fortune. Starting your journey between 8-10 AM brings success. Educational or spiritual travel is especially fruitful for you."
      },
      
      investment: {
        title: "বিনিয়োগের দিকনির্দেশনা",
        titleEn: "Investment Guidance",
        description: "শিক্ষা ও প্রকাশনা সংক্রান্ত ব্যবসায় বিনিয়োগ লাভজনক। সোনা ও হলুদ রঙের ধাতুতে বিনিয়োগ করবেন। দীর্ঘমেয়াদী বিনিয়োগ আপনার জন্য শ্রেয়। বন্ড ও মিউচুয়াল ফান্ডে বিনিয়োগ করলে স্থিতিশীল আয় হয়।",
        descriptionEn: "Investment in education and publishing businesses is profitable. Invest in gold and yellow metals. Long-term investments are best for you. Investing in bonds and mutual funds provides stable income."
      },
      
      tip: {
        title: "জ্যোতিষীয় প্রতিকার",
        titleEn: "Astrological Remedy",
        description: "বৃহস্পতিবার হলুদ বস্ত্র, ছোলা বা হলুদ চাল দান করুন। পীতাম্বর (হলুদ রঙের পোশাক) ধারণ করলে উপকার পান। বৃহস্পতি মন্ত্র 'ওঁ গুং গ্রহপতয়ে নমঃ' ১০৮ বার জপ করলে জ্ঞানবৃদ্ধি হয়।",
        descriptionEn: "On Thursday, donate yellow clothes, chickpeas, or yellow rice. Wearing Pitambar (yellow clothes) is beneficial. Chanting the Jupiter mantra 'Om Gung Grahapataye Namah' 108 times increases knowledge."
      }
    },
    
    // ৪-৯ এর জন্য একই স্ট্রাকচার (আমি সম্পূর্ণ দিতে পারি, কিন্তু স্থান সীমিত)
    // আপনি চাইলে আমি আলাদা করে ৪-৯ পর্যন্ত সম্পূর্ণ দেব
  },
  
  // নামের সংখ্যা গণনা (বাংলা ও ইংরেজি উভয় সাপোর্ট)
  calculateNameNumber: function(name) {
    if (!name || name.trim() === "") return null;
    
    let sum = 0;
    const lowerName = name.toLowerCase();
    
    for (let char of lowerName) {
      if (this.letterValues[char]) {
        sum += this.letterValues[char];
      }
    }
    
    // রুট নাম্বারে নিয়ে আসা
    while (sum > 9) {
      sum = sum.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    
    return sum;
  },
  
  // তারিখ থেকে মূলাংক গণনা
  calculateMulank: function(dateString) {
    // DD-MM-YYYY or DD/MM/YYYY or YYYY-MM-DD
    let day = null;
    
    // DD-MM-YYYY ফরম্যাট
    let match = dateString.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) {
      day = parseInt(match[1]);
    }
    
    // YYYY-MM-DD ফরম্যাট
    if (!day) {
      match = dateString.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
      if (match) {
        day = parseInt(match[3]);
      }
    }
    
    if (!day || isNaN(day)) return null;
    
    while (day > 9) {
      day = day.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return day;
  },
  
  // সংখ্যা থেকে রুট বের করা
  getRootNumber: function(num) {
    if (typeof num !== 'number') {
      num = parseInt(num);
    }
    if (isNaN(num)) return null;
    
    while (num > 9) {
      num = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
  },
  
  // সংখ্যা অনুযায়ী বিশ্লেষণ পাওয়া
  getNumberAnalysis: function(number) {
    if (this.numbers[number]) {
      return this.numbers[number];
    }
    return null;
  },
  
  // নামের বিশ্লেষণ (বাংলা/ইংরেজি)
  analyzeName: function(name) {
    const number = this.calculateNameNumber(name);
    if (!number) return null;
    
    const analysis = this.getNumberAnalysis(number);
    if (!analysis) return null;
    
    return {
      number: number,
      planet: analysis.planet,
      analysis: analysis
    };
  },
  
  // মোবাইল/গাড়ি নম্বর বিশ্লেষণ
  analyzeNumber: function(numberString) {
    const digits = numberString.replace(/[^0-9]/g, '');
    if (digits.length === 0) return null;
    
    let sum = 0;
    for (let digit of digits) {
      sum += parseInt(digit);
    }
    
    const rootNumber = this.getRootNumber(sum);
    return {
      original: numberString,
      sum: sum,
      rootNumber: rootNumber,
      analysis: this.getNumberAnalysis(rootNumber)
    };
  },
  
  // মূল্য বিশ্লেষণ
  analyzePrice: function(priceString) {
    const digits = priceString.replace(/[^0-9]/g, '');
    if (digits.length === 0) return null;
    
    let sum = 0;
    for (let digit of digits) {
      sum += parseInt(digit);
    }
    
    const rootNumber = this.getRootNumber(sum);
    const analysis = this.getNumberAnalysis(rootNumber);
    
    // শুভ বিকল্প সুপারিশ
    const alternatives = [];
    const recommended = [3, 6, 9]; // ব্যবসার জন্য শুভ সংখ্যা
    const avoid = [4, 8]; // এড়িয়ে চলার সংখ্যা
    
    if (recommended.includes(rootNumber)) {
      alternatives.push(`বর্তমান মূল্য ${rootNumber} সংখ্যা যা ব্যবসার জন্য শুভ।`);
    } else if (avoid.includes(rootNumber)) {
      alternatives.push(`বর্তমান মূল্য ${rootNumber} সংখ্যা। বিকল্প মূল্য চিন্তা করুন।`);
      // কিছু শুভ বিকল্প সংখ্যার উদাহরণ
      for (let rec of recommended) {
        alternatives.push(`শুভ বিকল্প: ${rec} সংখ্যার দাম (যেমন: ${rec}99, ${rec}88 টাকা)`);
      }
    }
    
    return {
      original: priceString,
      sum: sum,
      rootNumber: rootNumber,
      isAuspicious: recommended.includes(rootNumber),
      shouldAvoid: avoid.includes(rootNumber),
      analysis: analysis,
      alternatives: alternatives
    };
  }
};

// Export for browser
if (typeof window !== 'undefined') {
  window.NumerologyDB = NumerologyDB;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NumerologyDB;
}
