/**
 * ============================================================
 * MYASTROLOGY DAILY RASHIFAL GENERATOR v3.0
 * ============================================================
 * ফাইল: gochar/aspectEffects.js
 * কাজ: গ্রহের দৃষ্টির ভিত্তিতে রাশিফলের টেক্সট কাস্টমাইজেশন
 * প্রকল্প: Daily Rashifal Generator
 * 
 * আন্তর্জাতিক মানের বৈশিষ্ট্য:
 *   - প্রতিটি গ্রহের দৃষ্টির জন্য ভাব-ভিত্তিক গভীর বিশ্লেষণ
 *   - শুভ/অশুভ দৃষ্টির ভিন্ন প্রভাব
 *   - সময়ের সাথে পরিবর্তনশীল টেক্সট (দিনের অংশ অনুযায়ী)
 *   - আধ্যাত্মিক ও ব্যবহারিক পরামর্শের সমন্বয়
 * ============================================================
 */

/**
 * বৃহস্পতির দৃষ্টির গভীর বিশ্লেষণ
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @param {Object} context - { timeOfDay, isPositive, rashiElement }
 * @returns {string}
 */
function getJupiterAspectDeep(category, context = {}) {
  const { timeOfDay = 'general', isPositive = true, rashiElement = 'অগ্নি' } = context;
  
  const texts = {
    love: {
      positive: {
        morning: ' ভোরের আলোয় বৃহস্পতির আশীর্বাদে সম্পর্কে নতুন সূচনা হবে। বিশ্বাস ও আন্তরিকতা বাড়বে।',
        day: ' দিনের বেলায় বৃহস্পতির দৃষ্টিতে সম্পর্কে সম্প্রসারণ আসবে। নতুন পরিচয় বা বাগদানের সম্ভাবনা।',
        evening: ' সন্ধ্যায় বৃহস্পতির প্রভাবে প্রেমের গভীরতা অনুভব করবেন। আধ্যাত্মিক সংযোগ তৈরি হবে।',
        night: ' রাতে বৃহস্পতির দৃষ্টিতে সম্পর্কের দীর্ঘমেয়াদী পরিকল্পনা করতে পারবেন। পরিবারের সাথে আলোচনা সফল হবে।',
        general: ' বৃহস্পতির দৃষ্টিতে সম্পর্কে সম্প্রসারণ ও বিশ্বাস বৃদ্ধি পাবে। প্রেমে আধ্যাত্মিকতা আসবে।'
      },
      negative: {
        general: ' বৃহস্পতির দৃষ্টিতে সম্পর্কে অতিরিক্ত আশাবাদ বাস্তবতা থেকে দূরে সরিয়ে নিতে পারে। সতর্ক থাকুন।'
      }
    },
    work: {
      positive: {
        morning: ' সকালে বৃহস্পতির আশীর্বাদে কর্মক্ষেত্রে নতুন সুযোগ তৈরি হবে। গুরুর সহায়তা পাবেন।',
        day: ' দুপুরে বৃহস্পতির দৃষ্টিতে ব্যবসায়িক সাফল্য ও সম্প্রসারণের সুযোগ আসবে। বিনিয়োগে লাভ।',
        evening: ' সন্ধ্যায় বৃহস্পতির প্রভাবে শিক্ষা ও গবেষণায় সাফল্য আসবে। উচ্চপদস্থ ব্যক্তির প্রশংসা পাবেন।',
        night: ' রাতে বৃহস্পতির দৃষ্টিতে দীর্ঘমেয়াদী পরিকল্পনা করতে পারবেন। গুরুজনের পরামর্শ কাজে আসবে।',
        general: ' বৃহস্পতির আশীর্বাদে কর্মক্ষেত্রে সাফল্য ও উন্নতির সুযোগ আসবে। গুরুর সহায়তা পাবেন।'
      },
      negative: {
        general: ' বৃহস্পতির দৃষ্টিতে কর্মক্ষেত্রে অতিরিক্ত আশাবাদ ভুল সিদ্ধান্ত নিতে পারে। বাস্তবতা যাচাই করুন।'
      }
    },
    health: {
      positive: {
        general: ' বৃহস্পতির দৃষ্টিতে স্বাস্থ্যের উন্নতি হবে। রোগ প্রতিরোধ ক্ষমতা বাড়বে। আধ্যাত্মিক চর্চা উপকারী।'
      },
      negative: {
        general: ' বৃহস্পতির দৃষ্টিতে অতিরিক্ত খাওয়া বা বিলাসিতা স্বাস্থ্যের জন্য ক্ষতিকর হতে পারে। সংযম রাখুন।'
      }
    },
    finance: {
      positive: {
        morning: ' সকালে বৃহস্পতির আশীর্বাদে দীর্ঘমেয়াদী বিনিয়োগে লাভের সুযোগ আসবে।',
        day: ' দুপুরে বৃহস্পতির দৃষ্টিতে ব্যবসায়িক সম্প্রসারণ ও নতুন ক্লায়েন্ট আসবে।',
        evening: ' সন্ধ্যায় বৃহস্পতির প্রভাবে পুরনো পাওনা ফেরত আসবে। আর্থিক স্থিতিশীলতা বাড়বে।',
        night: ' রাতে বৃহস্পতির দৃষ্টিতে উত্তরাধিকার বা গোপন সম্পদের সুযোগ আসতে পারে।',
        general: ' বৃহস্পতির দৃষ্টিতে আর্থিক লাভ ও সম্প্রসারণের সুযোগ আসবে। বিনিয়োগে সাফল্য।'
      },
      negative: {
        general: ' বৃহস্পতির দৃষ্টিতে অতিরিক্ত আশাবাদে ঝুঁকিপূর্ণ বিনিয়োগ করতে পারেন। সতর্ক থাকুন।'
      }
    }
  };
  
  const categoryTexts = texts[category];
  if (!categoryTexts) return '';
  
  const tone = isPositive ? 'positive' : 'negative';
  const timeTexts = categoryTexts[tone];
  if (!timeTexts) return '';
  
  return timeTexts[timeOfDay] || timeTexts.general || '';
}

/**
 * শনির দৃষ্টির গভীর বিশ্লেষণ
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @param {Object} context - { timeOfDay, isPositive, rashiElement }
 * @returns {string}
 */
function getSaturnAspectDeep(category, context = {}) {
  const { timeOfDay = 'general', isPositive = false, rashiElement = 'পৃথিবী' } = context;
  
  const texts = {
    love: {
      positive: {
        general: ' শনির দৃষ্টিতে সম্পর্কে স্থিতিশীলতা ও দায়িত্ববোধ আসবে। দীর্ঘমেয়াদী প্রতিশ্রুতি গড়ে উঠবে।'
      },
      negative: {
        morning: ' সকালে শনির দৃষ্টিতে সম্পর্কে দূরত্ব ও কঠোরতা আসতে পারে। ধৈর্য ধরুন।',
        day: ' দিনের বেলায় শনির দৃষ্টিতে প্রিয়জনের সাথে মতভেদ হতে পারে। সংযম রাখুন।',
        evening: ' সন্ধ্যায় শনির দৃষ্টিতে সম্পর্কের জটিলতা বোঝার সুযোগ পাবেন। ধৈর্য ধরে আলোচনা করুন।',
        night: ' রাতে শনির দৃষ্টিতে সম্পর্কের পুরনো সমস্যা সামনে আসবে। ধৈর্য ও বোঝাপড়া দরকার।',
        general: ' শনির দৃষ্টিতে সম্পর্কে ধৈর্য ও দায়িত্ববোধ বাড়বে। তবে প্রকাশে সংযম প্রয়োজন।'
      }
    },
    work: {
      positive: {
        general: ' শনির দৃষ্টিতে কর্মক্ষেত্রে কঠোর পরিশ্রমের ফল পাবেন। দীর্ঘমেয়াদী স্থিতিশীলতা আসবে।'
      },
      negative: {
        morning: ' সকালে শনির দৃষ্টিতে কাজে বিলম্ব ও বাধা আসতে পারে। ধৈর্য ধরুন।',
        day: ' দিনের বেলায় শনির দৃষ্টিতে কর্তৃপক্ষের সাথে মতভেদ হতে পারে। সংযম রাখুন।',
        evening: ' সন্ধ্যায় শনির দৃষ্টিতে পুরনো কাজের চাপ বাড়বে। ধৈর্য ধরে শেষ করুন।',
        night: ' রাতে শনির দৃষ্টিতে কর্মক্ষেত্রের গোপন বিষয় সামনে আসবে। সতর্ক থাকুন।',
        general: ' শনির দৃষ্টিতে পরিশ্রম বাড়বে, ফল পেতে বিলম্ব হবে। ধৈর্য ধরলে সাফল্য আসবে।'
      }
    },
    health: {
      positive: {
        general: ' শনির দৃষ্টিতে স্বাস্থ্যে স্থিতিশীলতা আসবে। নিয়মিত ব্যায়াম ও সঠিক খাদ্যাভ্যাস গড়ে তুলুন।'
      },
      negative: {
        general: ' শনির দৃষ্টিতে হাড়, জয়েন্ট ও দীর্ঘস্থায়ী রোগে সতর্কতা প্রয়োজন। নিয়মিত ব্যায়াম করুন।'
      }
    },
    finance: {
      positive: {
        general: ' শনির দৃষ্টিতে দীর্ঘমেয়াদী সঞ্চয় ও বিনিয়োগে লাভ হবে। আর্থিক স্থিতিশীলতা বাড়বে।'
      },
      negative: {
        general: ' শনির দৃষ্টিতে সঞ্চয় ও ব্যয়ের ভারসাম্য রাখুন। দীর্ঘমেয়াদী বিনিয়োগে লাভ।'
      }
    }
  };
  
  const categoryTexts = texts[category];
  if (!categoryTexts) return '';
  
  const tone = isPositive ? 'positive' : 'negative';
  const timeTexts = categoryTexts[tone];
  if (!timeTexts) return '';
  
  return timeTexts[timeOfDay] || timeTexts.general || '';
}

/**
 * মঙ্গলের দৃষ্টির গভীর বিশ্লেষণ
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @param {Object} context - { timeOfDay, isPositive, rashiElement }
 * @returns {string}
 */
function getMarsAspectDeep(category, context = {}) {
  const { timeOfDay = 'general', isPositive = false, rashiElement = 'অগ্নি' } = context;
  
  const texts = {
    love: {
      positive: {
        general: ' মঙ্গলের দৃষ্টিতে সম্পর্কে আবেগ ও উৎসাহ বাড়বে। নতুনত্ব আনতে পারবেন।'
      },
      negative: {
        general: ' মঙ্গলের দৃষ্টিতে সম্পর্কে উত্তেজনা ও আবেগ বাড়বে। তবে রাগ নিয়ন্ত্রণে রাখুন।'
      }
    },
    work: {
      positive: {
        morning: ' সকালে মঙ্গলের দৃষ্টিতে কর্মক্ষেত্রে উদ্যোগ ও নেতৃত্বের গুণ বাড়বে।',
        day: ' দুপুরে মঙ্গলের দৃষ্টিতে প্রতিযোগিতায় সাফল্য আসবে। সাহসী সিদ্ধান্ত নিতে পারবেন।',
        evening: ' সন্ধ্যায় মঙ্গলের দৃষ্টিতে শারীরিক পরিশ্রমের কাজে সাফল্য আসবে।',
        night: ' রাতে মঙ্গলের দৃষ্টিতে নতুন প্রকল্পের পরিকল্পনা করতে পারবেন।',
        general: ' মঙ্গলের দৃষ্টিতে কর্মক্ষেত্রে প্রতিযোগিতা ও শক্তি বাড়বে। উদ্যোগ নিয়ে সাফল্য।'
      },
      negative: {
        general: ' মঙ্গলের দৃষ্টিতে কর্মক্ষেত্রে সংঘর্ষ ও প্রতিযোগিতা বাড়তে পারে। সংযম রাখুন।'
      }
    },
    health: {
      positive: {
        general: ' মঙ্গলের দৃষ্টিতে শরীরে শক্তি ও উদ্যম বাড়বে। ব্যায়ামের জন্য ভালো সময়।'
      },
      negative: {
        general: ' মঙ্গলের দৃষ্টিতে রক্তচাপ ও প্রদাহজনিত সমস্যা হতে পারে। সতর্ক থাকুন।'
      }
    },
    finance: {
      positive: {
        general: ' মঙ্গলের দৃষ্টিতে ঝুঁকিপূর্ণ বিনিয়োগে লাভের সম্ভাবনা। তবে হিসাব করে নিন।'
      },
      negative: {
        general: ' মঙ্গলের দৃষ্টিতে আর্থিক ঝুঁকি নেওয়ার সময়। তবে হিসাব করে বিনিয়োগ করুন।'
      }
    }
  };
  
  const categoryTexts = texts[category];
  if (!categoryTexts) return '';
  
  const tone = isPositive ? 'positive' : 'negative';
  const timeTexts = categoryTexts[tone];
  if (!timeTexts) return '';
  
  return timeTexts[timeOfDay] || timeTexts.general || '';
}

/**
 * বুধের দৃষ্টির গভীর বিশ্লেষণ
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @param {Object} context - { timeOfDay, isPositive, rashiElement }
 * @returns {string}
 */
function getMercuryAspectDeep(category, context = {}) {
  const { timeOfDay = 'general', isPositive = true, rashiElement = 'বায়ু' } = context;
  
  const texts = {
    love: {
      positive: {
        morning: ' সকালে বুধের দৃষ্টিতে প্রিয়জনের সাথে যোগাযোগ মধুর হবে। ভুল বোঝাবুঝি কাটবে।',
        day: ' দিনের বেলায় বুধের দৃষ্টিতে সম্পর্কের নতুন দিক আবিষ্কার করবেন।',
        evening: ' সন্ধ্যায় বুধের দৃষ্টিতে প্রিয়জনের সাথে পরিকল্পনা করতে পারবেন।',
        night: ' রাতে বুধের দৃষ্টিতে সম্পর্কের গভীর বিশ্লেষণ করতে পারবেন।',
        general: ' বুধের দৃষ্টিতে সম্পর্কে যোগাযোগ ও বোঝাপড়া বাড়বে। প্রিয়জনের সাথে মধুর সম্পর্ক।'
      },
      negative: {
        general: ' বুধের দৃষ্টিতে সম্পর্কে কথার ফাঁদে জড়িয়ে পড়তে পারেন। স্পষ্টভাবে কথা বলুন।'
      }
    },
    work: {
      positive: {
        morning: ' সকালে বুধের দৃষ্টিতে ব্যবসায়িক আলোচনা ও চুক্তিতে সাফল্য আসবে।',
        day: ' দুপুরে বুধের দৃষ্টিতে যোগাযোগ ও নেটওয়ার্কিং-এ দক্ষতা বাড়বে।',
        evening: ' সন্ধ্যায় বুধের দৃষ্টিতে লেখালেখি ও উপস্থাপনায় সাফল্য আসবে।',
        night: ' রাতে বুধের দৃষ্টিতে নতুন আইডিয়া ও পরিকল্পনা তৈরি করতে পারবেন।',
        general: ' বুধের দৃষ্টিতে ব্যবসা ও যোগাযোগে সাফল্য। আলোচনা ও চুক্তিতে সুবিধা।'
      },
      negative: {
        general: ' বুধের দৃষ্টিতে কথা বলতে গিয়ে ভুল বোঝাবুঝি হতে পারে। স্পষ্টতা আনুন।'
      }
    },
    health: {
      positive: {
        general: ' বুধের দৃষ্টিতে স্নায়ুতন্ত্র ও শ্বাসতন্ত্রের উন্নতি হবে। মেডিটেশন উপকারী।'
      },
      negative: {
        general: ' বুধের দৃষ্টিতে স্নায়ুতন্ত্র ও শ্বাসতন্ত্রে যত্ন নিন।'
      }
    },
    finance: {
      positive: {
        general: ' বুধের দৃষ্টিতে ছোট বিনিয়োগ ও লেনদেনে লাভ। ব্যবসায়িক যোগাযোগে সুবিধা।'
      },
      negative: {
        general: ' বুধের দৃষ্টিতে লেনদেনে ভুল হিসাব হতে পারে। সতর্ক থাকুন।'
      }
    }
  };
  
  const categoryTexts = texts[category];
  if (!categoryTexts) return '';
  
  const tone = isPositive ? 'positive' : 'negative';
  const timeTexts = categoryTexts[tone];
  if (!timeTexts) return '';
  
  return timeTexts[timeOfDay] || timeTexts.general || '';
}

/**
 * শুক্রের দৃষ্টির গভীর বিশ্লেষণ
 * @param {string} category - 'love', 'work', 'health', 'finance'
 * @param {Object} context - { timeOfDay, isPositive, rashiElement }
 * @returns {string}
 */
function getVenusAspectDeep(category, context = {}) {
  const { timeOfDay = 'general', isPositive = true, rashiElement = 'পৃথিবী' } = context;
  
  const texts = {
    love: {
      positive: {
        morning: ' সকালে শুক্রের দৃষ্টিতে প্রেমে রোমান্টিকতা ও মধুরতা আসবে।',
        day: ' দিনের বেলায় শুক্রের দৃষ্টিতে প্রিয়জনের সাথে আনন্দময় সময় কাটবে।',
        evening: ' সন্ধ্যায় শুক্রের দৃষ্টিতে রোমান্টিক মুহূর্ত তৈরি হবে। ডেট নাইটের জন্য ভালো সময়।',
        night: ' রাতে শুক্রের দৃষ্টিতে সম্পর্কের গভীরতা অনুভব করবেন।',
        general: ' শুক্রের দৃষ্টিতে প্রেম ও রোমান্সে ভরপুর দিন। সম্পর্কে মাধুর্য আসবে。'
      },
      negative: {
        general: ' শুক্রের দৃষ্টিতে সম্পর্কে অতিরিক্ত আশা বাস্তবতা থেকে দূরে সরিয়ে নিতে পারে।'
      }
    },
    work: {
      positive: {
        general: ' শুক্রের দৃষ্টিতে সৃজনশীল কাজে সাফল্য। শিল্প ও সৌন্দর্য সংক্রান্ত কাজে লাভ।'
      },
      negative: {
        general: ' শুক্রের দৃষ্টিতে কাজের চেয়ে বিলাসিতায় মন বেশি থাকতে পারে। মনোযোগ ধরে রাখুন।'
      }
    },
    health: {
      positive: {
        general: ' শুক্রের দৃষ্টিতে ত্বক ও সৌন্দর্যের উন্নতি হবে। স্পা বা ম্যাসাজ উপকারী।'
      },
      negative: {
        general: ' শুক্রের দৃষ্টিতে ত্বক ও হরমোনজনিত সমস্যা হতে পারে। সতর্ক থাকুন।'
      }
    },
    finance: {
      positive: {
        general: ' শুক্রের দৃষ্টিতে সৌন্দর্য ও বিলাসিতায় বিনিয়োগে লাভ। শিল্পকর্ম ক্রয় উপকারী।'
      },
      negative: {
        general: ' শুক্রের দৃষ্টিতে বিলাসিতা ও আনন্দে খরচ বাড়বে। বাজেট মেনে চলুন。'
      }
    }
  };
  
  const categoryTexts = texts[category];
  if (!categoryTexts) return '';
  
  const tone = isPositive ? 'positive' : 'negative';
  const timeTexts = categoryTexts[tone];
  if (!timeTexts) return '';
  
  return timeTexts[timeOfDay] || timeTexts.general || '';
}

/**
 * দিনের অংশ নির্ণয় (সকাল/দুপুর/বিকেল/সন্ধ্যা/রাত)
 * @param {Date} date - তারিখ ও সময়
 * @returns {string}
 */
function getTimeOfDay(date = new Date()) {
  const hour = date.getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 15) return 'day';
  if (hour < 18) return 'evening';
  if (hour < 21) return 'evening';
  return 'night';
}

/**
 * দৃষ্টির শুভ/অশুভ নির্ণয় (গ্রহ ও রাশি অনুযায়ী)
 * @param {string} planet - গ্রহের নাম
 * @param {number} targetRashi - লক্ষ্য রাশি
 * @param {Object} planetRashis - সব গ্রহের রাশি
 * @returns {boolean}
 */
function isAspectPositive(planet, targetRashi, planetRashis) {
  // সাধারণত: শুক্র, বৃহস্পতি, বুধ শুভ; মঙ্গল, শনি অশুভ
  const positivePlanets = ['jupiter', 'venus', 'mercury'];
  const negativePlanets = ['mars', 'saturn'];
  
  if (positivePlanets.includes(planet)) return true;
  if (negativePlanets.includes(planet)) return false;
  
  return true; // ডিফল্ট
}

/**
 * দৃষ্টির ভিত্তিতে প্রেমের ফল কাস্টমাইজ (আন্তর্জাতিক মান)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {Object} context - { date, rashiElement, targetRashi, planetRashis }
 * @returns {string}
 */
function enhanceLoveTextAdvanced(baseText, aspects, context = {}) {
  let text = baseText;
  const additions = [];
  const timeOfDay = getTimeOfDay(context.date);
  const rashiElement = context.rashiElement || 'অগ্নি';
  
  if (aspects.jupiter) {
    const isPositive = isAspectPositive('jupiter', context.targetRashi, context.planetRashis);
    additions.push(getJupiterAspectDeep('love', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.saturn) {
    const isPositive = isAspectPositive('saturn', context.targetRashi, context.planetRashis);
    additions.push(getSaturnAspectDeep('love', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mars) {
    const isPositive = isAspectPositive('mars', context.targetRashi, context.planetRashis);
    additions.push(getMarsAspectDeep('love', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mercury) {
    const isPositive = isAspectPositive('mercury', context.targetRashi, context.planetRashis);
    additions.push(getMercuryAspectDeep('love', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.venus) {
    const isPositive = isAspectPositive('venus', context.targetRashi, context.planetRashis);
    additions.push(getVenusAspectDeep('love', { timeOfDay, isPositive, rashiElement }));
  }
  
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে কর্মের ফল কাস্টমাইজ (আন্তর্জাতিক মান)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {Object} context - { date, rashiElement, targetRashi, planetRashis }
 * @returns {string}
 */
function enhanceWorkTextAdvanced(baseText, aspects, context = {}) {
  let text = baseText;
  const additions = [];
  const timeOfDay = getTimeOfDay(context.date);
  const rashiElement = context.rashiElement || 'অগ্নি';
  
  if (aspects.jupiter) {
    const isPositive = isAspectPositive('jupiter', context.targetRashi, context.planetRashis);
    additions.push(getJupiterAspectDeep('work', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.saturn) {
    const isPositive = isAspectPositive('saturn', context.targetRashi, context.planetRashis);
    additions.push(getSaturnAspectDeep('work', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mars) {
    const isPositive = isAspectPositive('mars', context.targetRashi, context.planetRashis);
    additions.push(getMarsAspectDeep('work', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mercury) {
    const isPositive = isAspectPositive('mercury', context.targetRashi, context.planetRashis);
    additions.push(getMercuryAspectDeep('work', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.venus) {
    const isPositive = isAspectPositive('venus', context.targetRashi, context.planetRashis);
    additions.push(getVenusAspectDeep('work', { timeOfDay, isPositive, rashiElement }));
  }
  
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে স্বাস্থ্যের ফল কাস্টমাইজ (আন্তর্জাতিক মান)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {Object} context - { date, rashiElement, targetRashi, planetRashis }
 * @returns {string}
 */
function enhanceHealthTextAdvanced(baseText, aspects, context = {}) {
  let text = baseText;
  const additions = [];
  const timeOfDay = getTimeOfDay(context.date);
  const rashiElement = context.rashiElement || 'অগ্নি';
  
  if (aspects.jupiter) {
    const isPositive = isAspectPositive('jupiter', context.targetRashi, context.planetRashis);
    additions.push(getJupiterAspectDeep('health', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.saturn) {
    const isPositive = isAspectPositive('saturn', context.targetRashi, context.planetRashis);
    additions.push(getSaturnAspectDeep('health', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mars) {
    const isPositive = isAspectPositive('mars', context.targetRashi, context.planetRashis);
    additions.push(getMarsAspectDeep('health', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mercury) {
    const isPositive = isAspectPositive('mercury', context.targetRashi, context.planetRashis);
    additions.push(getMercuryAspectDeep('health', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.venus) {
    const isPositive = isAspectPositive('venus', context.targetRashi, context.planetRashis);
    additions.push(getVenusAspectDeep('health', { timeOfDay, isPositive, rashiElement }));
  }
  
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির ভিত্তিতে আর্থিক ফল কাস্টমাইজ (আন্তর্জাতিক মান)
 * @param {string} baseText - মৌলিক টেক্সট
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {Object} context - { date, rashiElement, targetRashi, planetRashis }
 * @returns {string}
 */
function enhanceFinanceTextAdvanced(baseText, aspects, context = {}) {
  let text = baseText;
  const additions = [];
  const timeOfDay = getTimeOfDay(context.date);
  const rashiElement = context.rashiElement || 'অগ্নি';
  
  if (aspects.jupiter) {
    const isPositive = isAspectPositive('jupiter', context.targetRashi, context.planetRashis);
    additions.push(getJupiterAspectDeep('finance', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.saturn) {
    const isPositive = isAspectPositive('saturn', context.targetRashi, context.planetRashis);
    additions.push(getSaturnAspectDeep('finance', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mars) {
    const isPositive = isAspectPositive('mars', context.targetRashi, context.planetRashis);
    additions.push(getMarsAspectDeep('finance', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.mercury) {
    const isPositive = isAspectPositive('mercury', context.targetRashi, context.planetRashis);
    additions.push(getMercuryAspectDeep('finance', { timeOfDay, isPositive, rashiElement }));
  }
  if (aspects.venus) {
    const isPositive = isAspectPositive('venus', context.targetRashi, context.planetRashis);
    additions.push(getVenusAspectDeep('finance', { timeOfDay, isPositive, rashiElement }));
  }
  
  if (additions.length === 1) {
    text += additions[0];
  } else if (additions.length > 1) {
    text += ' ' + additions.join(' ');
  }
  
  return text;
}

/**
 * দৃষ্টির সংক্ষিপ্ত বিবরণ তৈরি (উন্নত)
 * @param {Object} aspects - দৃষ্টির তথ্য
 * @param {Object} context - { date, rashiElement }
 * @returns {string}
 */
function getAspectSummaryAdvanced(aspects, context = {}) {
  const activeAspects = [];
  const timeOfDay = getTimeOfDay(context.date);
  const rashiElement = context.rashiElement || '';
  
  if (aspects.jupiter) activeAspects.push('♃ বৃহস্পতি');
  if (aspects.saturn) activeAspects.push('🪐 শনি');
  if (aspects.mars) activeAspects.push('♂ মঙ্গল');
  if (aspects.mercury) activeAspects.push('☿ বুধ');
  if (aspects.venus) activeAspects.push('♀ শুক্র');
  
  if (activeAspects.length === 0) return '';
  
  let timePrefix = '';
  if (timeOfDay === 'morning') timePrefix = 'ভোরের';
  else if (timeOfDay === 'day') timePrefix = 'দিনের';
  else if (timeOfDay === 'evening') timePrefix = 'সন্ধ্যার';
  else if (timeOfDay === 'night') timePrefix = 'রাতের';
  
  if (activeAspects.length === 1) {
    return `${timePrefix} ${activeAspects[0]}র দৃষ্টি বিদ্যমান।`;
  }
  return `${timePrefix} ${activeAspects.join(', ')}র দৃষ্টি বিদ্যমান।`;
}

// পুরনো ফাংশনগুলোর সাথে সামঞ্জস্য রাখতে (ব্যাকওয়ার্ড কম্প্যাটিবিলিটি)
function enhanceLoveText(baseText, aspects) {
  return enhanceLoveTextAdvanced(baseText, aspects, {});
}

function enhanceWorkText(baseText, aspects) {
  return enhanceWorkTextAdvanced(baseText, aspects, {});
}

function enhanceHealthText(baseText, aspects) {
  return enhanceHealthTextAdvanced(baseText, aspects, {});
}

function enhanceFinanceText(baseText, aspects) {
  return enhanceFinanceTextAdvanced(baseText, aspects, {});
}

function getAspectSummary(aspects) {
  return getAspectSummaryAdvanced(aspects, {});
}

module.exports = {
  // উন্নত ফাংশন (আন্তর্জাতিক মান)
  enhanceLoveTextAdvanced,
  enhanceWorkTextAdvanced,
  enhanceHealthTextAdvanced,
  enhanceFinanceTextAdvanced,
  getAspectSummaryAdvanced,
  getTimeOfDay,
  isAspectPositive,
  
  // পৃথক গ্রহের টেক্সট ফাংশন (গভীর বিশ্লেষণ)
  getJupiterAspectDeep,
  getSaturnAspectDeep,
  getMarsAspectDeep,
  getMercuryAspectDeep,
  getVenusAspectDeep,
  
  // পুরনো ফাংশন (ব্যাকওয়ার্ড কম্প্যাটিবিলিটি)
  enhanceLoveText,
  enhanceWorkText,
  enhanceHealthText,
  enhanceFinanceText,
  getAspectSummary,
  
  // পৃথক গ্রহের টেক্সট ফাংশন (সংক্ষিপ্ত)
  getJupiterAspectText: getJupiterAspectDeep,
  getSaturnAspectText: getSaturnAspectDeep,
  getMarsAspectText: getMarsAspectDeep,
  getMercuryAspectText: getMercuryAspectDeep,
  getVenusAspectText: getVenusAspectDeep
};
