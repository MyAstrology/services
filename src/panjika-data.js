// panjika-data.js — integration data layer for MyAstrology panjika
(function (global) {
  'use strict';

  var WEEKDAY_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  var NAKSHATRA_NAMES = ['অশ্বিনী','ভরণী','কৃত্তিকা','রোহিণী','মৃগশিরা','আর্দ্রা','পুনর্বসু','পুষ্যা','আশ্লেষা','মঘা','পূর্বফাল্গুনী','উত্তরফাল্গুনী','হস্তা','চিত্রা','স্বাতী','বিশাখা','অনুরাধা','জ্যেষ্ঠা','মূলা','পূর্বাষাঢ়া','উত্তরাষাঢ়া','শ্রবণা','ধনিষ্ঠা','শতভিষা','পূর্বভাদ্রপদ','উত্তরভাদ্রপদ','রেবতী'];

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function ensureArray(v) {
    return Array.isArray(v) ? v : [];
  }

  function matchesDate(ev, dateStr, mmdd) {
    if (!ev) return false;
    if (ev.date && ev.date === dateStr) return true;
    if (ev.d && ev.d === dateStr) return true;
    if (ev.mmdd && ev.mmdd === mmdd) return true;
    return false;
  }

  function withFestivalDefaults(ev, dateStr) {
    var out = clone(ev);
    out.date = out.date || out.d || dateStr || '';
    out.name = out.name || out.n || '';
    out.icon = out.icon || out.i || '🎉';
    out.significance = out.significance || out.message || 'আজকের দিনে এই বিশেষ উৎসব পালন করা হয়।';
    out.mantra = out.mantra || '';
    out.pujaTime = out.pujaTime || 'স্থানীয় পঞ্জিকা অনুসারে';
    return out;
  }

  function dedupeBy(list, keyFn) {
    var seen = new Set();
    return list.filter(function (item) {
      var key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  var PANJIKA_DATA = {
    malmas: [
      {
        startDate: '2026-05-17',
        endDate: '2026-06-15',
        monthName: 'অধিক জ্যৈষ্ঠ / পুরুষোত্তম মাস',
        significance: 'এই সময়কে মলমাস বা পুরুষোত্তম মাস বলা হয়। শাস্ত্রে বৈদিক জপ, দান, গীতা-পাঠ, বিষ্ণু-স্মরণ ও ব্রত পালনের জন্য বিশেষ উপযোগী বলা হয়েছে।',
        mantra: 'ॐ नमो भगवते वासुदेवाय'
      }
    ],

    festivals: [
      {
        date: '2026-01-15',
        name: 'পৌষ সংক্রান্তি / মকর সংক্রান্তি',
        icon: '🌾',
        significance: 'সূর্য মকর রাশিতে প্রবেশের সঙ্গে দান, স্নান ও তিলের আচার বিশেষভাবে পালনীয়।',
        mantra: 'গঙ্গাস্নান, তিলদান ও সূর্য নমস্কার শুভ।',
        pujaTime: 'প্রাতঃ থেকে মধ্যাহ্ন'
      },
      {
        date: '2026-02-18',
        name: 'মহাশিবরাত্রি',
        icon: '🔱',
        significance: 'শিবোপাসনা, উপবাস, রাত্রিজাগরণ ও বিল্বপত্র নিবেদন এই তিথির প্রধান আচার।',
        mantra: 'ॐ नमः शिवाय',
        pujaTime: 'নিশীথকাল সর্বোত্তম'
      },
      {
        date: '2026-03-04',
        name: 'দোল পূর্ণিমা / হোলি',
        icon: '🎨',
        significance: 'রাধা-কৃষ্ণ পূজা, গৌর পূর্ণিমা স্মরণ ও আনন্দোৎসবের দিন।',
        mantra: 'হরে কৃষ্ণ মহামন্ত্র জপ করুন।',
        pujaTime: 'পূর্ণিমা তিথি অনুসারে'
      },
      {
        date: '2026-04-15',
        name: 'পয়লা বৈশাখ – বাংলা নববর্ষ ১৪৩৩',
        icon: '🎉',
        significance: 'নতুন বঙ্গাব্দের সূচনা। গৃহদেবতার পূজা, হালখাতা ও মঙ্গলাচরণে দিনটি শুভ।',
        mantra: 'শ্রী গণেশায় নমঃ',
        pujaTime: 'প্রভাত থেকে পূর্বাহ্ন'
      },
      {
        date: '2026-05-31',
        name: 'বুদ্ধ পূর্ণিমা',
        icon: '☸️',
        significance: 'গৌতম বুদ্ধের জন্ম, বোধিলাভ ও মহাপরিনির্বাণ স্মরণের পুণ্যদিন।',
        mantra: 'बुद्धं शरणं गच्छामि',
        pujaTime: 'সকাল ও সন্ধ্যা'
      },
      {
        date: '2026-07-17',
        name: 'রথযাত্রা',
        icon: '🎡',
        significance: 'জগন্নাথদেবের মহারথোৎসব; দর্শন ও সেবায় বিশেষ পুণ্যলাভ হয়।',
        mantra: 'জয় জগন্নাথ',
        pujaTime: 'দিবাভাগে'
      },
      {
        date: '2026-08-28',
        name: 'জন্মাষ্টমী',
        icon: '🦚',
        significance: 'ভগবান শ্রীকৃষ্ণের আবির্ভাব তিথি; উপবাস, জপ ও নিশীথ পূজা বিশেষভাবে পালনীয়।',
        mantra: 'ॐ नमो भगवते वासुदेवाय',
        pujaTime: 'নিশীথকাল'
      },
      {
        date: '2026-10-17',
        name: 'মহালয়া',
        icon: '🌙',
        significance: 'পিতৃতর্পণ ও দেবীপক্ষ আরম্ভের মাহেন্দ্রক্ষণ।',
        mantra: 'মহিষাসুরমর্দিনী শ্রবণ ও তর্পণ করুন।',
        pujaTime: 'প্রভাত'
      },
      {
        date: '2026-10-20',
        name: 'মহাষষ্ঠী',
        icon: '🪔',
        significance: 'দুর্গাপূজার বোধন-অধিবাসের প্রধান দিন।',
        mantra: 'या देवी सर्वभूतेषु',
        pujaTime: 'সন্ধ্যা'
      },
      {
        date: '2026-10-21',
        name: 'মহাসপ্তমী',
        icon: '🪔',
        significance: 'কলাবউ স্নান ও নবপত্রিকা প্রবেশের শুভ তিথি।',
        mantra: 'দুর্গা সপ্তশতী পাঠ শুভ।',
        pujaTime: 'প্রাতঃকাল'
      },
      {
        date: '2026-10-22',
        name: 'মহাঅষ্টমী',
        icon: '🪔',
        significance: 'কুমারী পূজা ও সন্ধিপূজার মহাতিথি।',
        mantra: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता',
        pujaTime: 'অষ্টমী ও সন্ধিক্ষণ'
      },
      {
        date: '2026-10-23',
        name: 'মহানবমী',
        icon: '🪔',
        significance: 'হোম, পূর্ণাহুতি ও দেবীর চূড়ান্ত পূজার দিন।',
        mantra: 'দুর্গা নবমী হোম শুভ।',
        pujaTime: 'দিবা ও সন্ধ্যা'
      },
      {
        date: '2026-10-24',
        name: 'বিজয়াদশমী',
        icon: '🎊',
        significance: 'দেবীর বিসর্জন, প্রণাম ও শুভ বিজয়ার দিন।',
        mantra: 'শুভ বিজয়া',
        pujaTime: 'অপরাহ্ণ'
      },
      {
        date: '2026-11-08',
        name: 'কালীপূজা / দীপাবলি পর্ব',
        icon: '🪔',
        significance: 'মা কালী, লক্ষ্মী ও দীপপ্রজ্বলনের নিশীপূজা পালিত হয়।',
        mantra: 'ॐ क्रीं कालिकायै नमः',
        pujaTime: 'মহানিশা'
      }
    ],

    births: [
      {
        mmdd: '01-12',
        name: 'স্বামী বিবেকানন্দ',
        icon: '🕉️',
        birthYear: '1863',
        deathYear: '1902',
        message: 'আত্মবিশ্বাস, কর্ম ও মানবসেবার বাণী আজও অনুপ্রেরণা দেয়।',
        quote: 'উঠ, জাগো, এবং লক্ষ্য না পৌঁছানো পর্যন্ত থেমো না।',
        notableWorks: ['রাজযোগ', 'জ্ঞানযোগ', 'প্রাচ্য ও পাশ্চাত্য']
      },
      {
        mmdd: '02-18',
        name: 'শ্রী রামকৃষ্ণ পরমহংস',
        icon: '🙏',
        birthYear: '1836',
        deathYear: '1886',
        message: 'ভক্তি, সার্বজনীনতা ও ঈশ্বরসাধনার সহজ বাণী স্মরণীয়।',
        quote: 'যত মত তত পথ।',
        notableWorks: ['কথামৃত-প্রেরণা']
      },
      {
        mmdd: '05-07',
        name: 'রবীন্দ্রনাথ ঠাকুর',
        icon: '📚',
        birthYear: '1861',
        deathYear: '1941',
        message: 'সাহিত্য, সঙ্গীত ও মানবধর্মের বিশ্বকবি।',
        quote: 'যদি তোর ডাক শুনে কেউ না আসে তবে একলা চলো রে।',
        notableWorks: ['গীতাঞ্জলি', 'ঘরে বাইরে', 'গীতবিতান']
      },
      {
        mmdd: '01-23',
        name: 'নেতাজি সুভাষচন্দ্র বসু',
        icon: '🇮🇳',
        birthYear: '1897',
        deathYear: '1945?',
        message: 'দেশপ্রেম, সাহস ও আত্মত্যাগের জাগরণী স্মারক।',
        quote: 'তোমরা আমাকে রক্ত দাও, আমি তোমাদের স্বাধীনতা দেব।',
        notableWorks: ['আজাদ হিন্দ ফৌজ']
      }
    ],

    deaths: [
      {
        mmdd: '08-07',
        name: 'রবীন্দ্রনাথ ঠাকুর',
        icon: '🕯️',
        tribute: 'বিশ্বকবির তিরোধান দিবসে সাহিত্য ও সঙ্গীতসাধনায় শ্রদ্ধার্ঘ্য নিবেদন করা হয়।'
      },
      {
        mmdd: '08-16',
        name: 'শ্রী রামকৃষ্ণ পরমহংস',
        icon: '🕯️',
        tribute: 'আধ্যাত্মিক ভারতবর্ষের এক উজ্জ্বল সাধককে শ্রদ্ধার সঙ্গে স্মরণ করা হয়।'
      }
    ],

    modern: [
      {
        mmdd: '01-01',
        name: 'ইংরেজি নববর্ষ',
        icon: '🎆',
        message: 'নতুন সূচনার দিন; আত্মসমালোচনা ও সৎ সংকল্পের জন্য উপযোগী।',
        loveMantra: 'আজ ইতিবাচক প্রতিজ্ঞা নিন।'
      },
      {
        mmdd: '01-26',
        name: 'প্রজাতন্ত্র দিবস',
        icon: '🇮🇳',
        message: 'সংবিধান, গণতন্ত্র ও নাগরিক কর্তব্য স্মরণের দিন।',
        loveMantra: 'দেশপ্রেমই সর্বোচ্চ সেবা।'
      },
      {
        mmdd: '05-01',
        name: 'মে দিবস',
        icon: '✊',
        message: 'শ্রমের মর্যাদা ও কর্মনিষ্ঠার মূল্যায়নের দিন।',
        loveMantra: 'কর্মই পূজা।'
      },
      {
        mmdd: '08-15',
        name: 'স্বাধীনতা দিবস',
        icon: '🇮🇳',
        message: 'স্বাধীনতার মূল্য ও জাতীয় ঐক্যের প্রেরণা স্মরণীয়।',
        loveMantra: 'ঐক্যে শক্তি।'
      },
      {
        mmdd: '12-25',
        name: 'বড়দিন',
        icon: '🎄',
        message: 'ভালোবাসা, শান্তি ও সেবার চেতনা জাগ্রত করার দিন।',
        loveMantra: 'শান্তি ও সহমর্মিতা ছড়িয়ে দিন।'
      }
    ],

    auspiciousGuides: {
      marriage: {
        title: 'বিবাহ',
        icon: '💒',
        goodMonths: ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ় (নির্বাচিত)', 'অগ্রহায়ণ', 'মাঘ', 'ফাল্গুন'],
        badMonths: ['অধিক মাস / মলমাস', 'ধনু সংক্রান্তি-পর্ব', 'মীন সংক্রান্তি-পর্ব'],
        goodDays: ['সোমবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        badDays: ['মঙ্গলবার', 'শনিবার'],
        badTithis: ['অমাবস্যা', 'পূর্ণিমা', 'চতুর্থী', 'নবমী', 'চতুর্দশী'],
        goodNakshatras: ['রোহিণী','মৃগশিরা','পুষ্যা','হস্তা','চিত্রা','স্বাতী','অনুরাধা','উত্তরফাল্গুনী','উত্তরাষাঢ়া','উত্তরভাদ্রপদ','রেবতী'],
        badNakshatras: ['ভরণী','আর্দ্রা','আশ্লেষা','মঘা','পূর্বফাল্গুনী','বিশাখা','জ্যেষ্ঠা','মূলা'],
        badYogas: ['ব্যতীপাত', 'বৈধৃতি', 'বজ্র', 'ব্যাঘাত'],
        badKaranas: ['বিষ্টি', 'শকুনি', 'চতুষ্পাদ', 'নাগ'],
        sutahibukaYoga: 'বিশেষ গ্রহ-সম্বন্ধে কিছু অশুভতা শিথিল হয়; তবু নির্দিষ্ট মুহূর্ত বিচার আবশ্যক।',
        godhuli: 'গোধূলি লগ্নে নির্দিষ্ট ক্ষেত্রে বিবাহ শাস্ত্রে অনুমোদিত।',
        godhuliNishedha: ['বৃহস্পতিবার', 'শনিবার'],
        godhuliNishedhaNote: 'সবক্ষেত্রে নয়; পণ্ডিতীয় বিচার প্রয়োজন।',
        procedure: 'কুণ্ডলী, নাড়ি, গণ, লগ্ন, তিথি, নক্ষত্র ও দোষবিচার মিলিয়ে মুহূর্ত স্থির করুন।',
        mantra: 'ॐ वरप्रदायै नमः'
      },
      grihaPravesh: {
        title: 'গৃহপ্রবেশ',
        icon: '🏠',
        goodDays: ['সোমবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        badDays: ['মঙ্গলবার', 'শনিবার'],
        badTithis: ['অমাবস্যা', 'চতুর্থী', 'নবমী', 'চতুর্দশী'],
        goodNakshatras: ['রোহিণী','মৃগশিরা','পুষ্যা','হস্তা','অনুরাধা','উত্তরফাল্গুনী','উত্তরাষাঢ়া','উত্তরভাদ্রপদ','রেবতী'],
        procedure: 'বাস্তু-শুদ্ধি, গণেশ-পূজা, নবরাত্রি/লক্ষ্মী-নারায়ণ স্মরণ ও অগ্নিহোত্র শুভ।',
        mantra: 'ॐ गणेशाय नमः'
      },
      grihaNirman: {
        title: 'গৃহ নির্মাণ',
        icon: '🏗️',
        goodDays: ['সোমবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        badDays: ['মঙ্গলবার', 'শনিবার'],
        badTithis: ['অমাবস্যা', 'চতুর্থী', 'নবমী', 'চতুর্দশী'],
        goodNakshatras: ['রোহিণী','মৃগশিরা','পুষ্যা','হস্তা','অনুরাধা','উত্তরাষাঢ়া','উত্তরভাদ্রপদ','রেবতী'],
        procedure: 'ভূমিপূজা, স্তম্ভারম্ভ ও বাস্তুপূজা পৃথক শুভক্ষণে করা উত্তম।',
        mantra: 'ভূমি সূক্ত পাঠ করুন।'
      },
      garbhadharan: {
        title: 'গর্ভধারণ',
        icon: '🤰',
        goodDays: ['সোমবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        badDays: ['মঙ্গলবার', 'শনিবার'],
        badTithis: ['অমাবস্যা', 'পূর্ণিমা', 'চতুর্দশী'],
        goodNakshatras: ['অশ্বিনী','রোহিণী','পুনর্বসু','পুষ্যা','হস্তা','চিত্রা','স্বাতী','অনুরাধা','উত্তরফাল্গুনী','উত্তরাষাঢ়া','উত্তরভাদ্রপদ','রেবতী'],
        procedure: 'শান্ত মন, স্বাস্থ্যসম্মত জীবনযাপন ও শাস্ত্রোক্ত রাত্রি-বিচার গুরুত্বপূর্ণ।',
        mantra: 'সন্তান গোপাল মন্ত্র জপ শুভ।'
      },
      business: {
        title: 'ব্যবসা শুরু',
        icon: '💼',
        goodDays: ['বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        badDays: ['মঙ্গলবার'],
        badTithis: ['অমাবস্যা', 'চতুর্থী', 'নবমী', 'চতুর্দশী'],
        goodNakshatras: ['অশ্বিনী','পুষ্যা','হস্তা','স্বাতী','মূলা','উত্তরফাল্গুনী','রেবতী'],
        procedure: 'লক্ষ্মী-গণেশ পূজা, হিসাবখাতা/ডিজিটাল লেজার আরম্ভ ও দক্ষিণাবর্ত প্রদীপ শুভ।',
        mantra: 'ॐ श्रीं महालक्ष्म्यै नमः'
      },
      travel: {
        title: 'যাত্রা',
        icon: '✈️',
        goodDays: ['সোমবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'],
        badDays: ['মঙ্গলবার', 'শনিবার'],
        badTithis: ['অমাবস্যা', 'চতুর্থী', 'নবমী', 'চতুর্দশী'],
        goodNakshatras: ['অশ্বিনী','পুষ্যা','চিত্রা','স্বাতী','অনুরাধা','মূলা','রেবতী'],
        procedure: 'দিকশূল, বারশূল ও রাহুকাল এড়িয়ে যাত্রা শুরু করুন।',
        mantra: 'ॐ गं गणपतये नमः'
      }
    },

    specialYogas: [
      {
        name: 'রবিপুষ্য যোগ',
        icon: '☀️',
        weekdays: [0],
        nakshatras: ['পুষ্যা'],
        significance: 'ক্রয়, সম্পদ সঞ্চয়, শিক্ষারম্ভ ও জপ-তপের জন্য অত্যন্ত মঙ্গলজনক বলে ধরা হয়।',
        suitableWork: ['সোনা/রূপা ক্রয়', 'ব্যবসা আরম্ভ', 'গুরুপূজা', 'মন্ত্রদীক্ষা']
      },
      {
        name: 'গুরুপুষ্য যোগ',
        icon: '🌟',
        weekdays: [4],
        nakshatras: ['পুষ্যা'],
        significance: 'দীর্ঘমেয়াদি বিনিয়োগ, গৃহপ্রবেশ-পূর্ব প্রস্তুতি, শিক্ষালাভ ও আধ্যাত্মিক অনুশীলনে শুভ।',
        suitableWork: ['ধন সঞ্চয়', 'নতুন চুক্তি', 'বই/যন্ত্র ক্রয়', 'ব্রত আরম্ভ']
      },
      {
        name: 'অমৃতসিদ্ধি যোগ',
        icon: '✨',
        pairs: [
          { weekday: 0, nakshatra: 'হস্তা' },
          { weekday: 1, nakshatra: 'মৃগশিরা' },
          { weekday: 2, nakshatra: 'অশ্বিনী' },
          { weekday: 3, nakshatra: 'অনুরাধা' },
          { weekday: 4, nakshatra: 'পুষ্যা' },
          { weekday: 5, nakshatra: 'রেবতী' },
          { weekday: 6, nakshatra: 'রোহিণী' }
        ],
        significance: 'বহু শাস্ত্রে এই যোগকে সিদ্ধি, সাফল্য ও আরম্ভকর্মের জন্য প্রশস্ত বলা হয়েছে।',
        suitableWork: ['শুভ কাজের সূচনা', 'ক্রয়-বিক্রয়', 'যাত্রা', 'গুরুদর্শন']
      }
    ]
  };

  function getRichFestivals(dateStr, mmdd) {
    var list = ensureArray(PANJIKA_DATA.festivals)
      .filter(function (ev) { return matchesDate(ev, dateStr, mmdd); })
      .map(function (ev) { return withFestivalDefaults(ev, dateStr); });

    if (Array.isArray(global.FESTS)) {
      global.FESTS.forEach(function (f) {
        if (!matchesDate(f, dateStr, mmdd)) return;
        list.push(withFestivalDefaults({
          date: f.d || dateStr,
          name: f.n,
          icon: f.i,
          significance: 'পঞ্জিকা অনুসারে পালিত বিশেষ তিথি/উৎসব।',
          pujaTime: 'স্থানীয় পঞ্জিকা অনুসারে'
        }, dateStr));
      });
    }

    return dedupeBy(list, function (ev) {
      return [ev.date || dateStr, ev.name, ev.icon].join('|');
    });
  }

  function getPanjikaEvents(dateStr, mmdd) {
    mmdd = mmdd || String(dateStr || '').slice(5);
    var out = {
      festivals: getRichFestivals(dateStr, mmdd),
      births: ensureArray(PANJIKA_DATA.births).filter(function (ev) { return matchesDate(ev, dateStr, mmdd); }).map(clone),
      deaths: ensureArray(PANJIKA_DATA.deaths).filter(function (ev) { return matchesDate(ev, dateStr, mmdd); }).map(clone),
      modern: ensureArray(PANJIKA_DATA.modern).filter(function (ev) { return matchesDate(ev, dateStr, mmdd); }).map(clone),
      malmas: null
    };

    out.malmas = ensureArray(PANJIKA_DATA.malmas).find(function (ml) {
      return dateStr >= ml.startDate && dateStr <= ml.endDate;
    }) || null;

    return out;
  }

  function checkSpecialYogas(weekdayIdx, nakshatraIdx) {
    var nakName = typeof nakshatraIdx === 'number' ? NAKSHATRA_NAMES[((nakshatraIdx % 27) + 27) % 27] : nakshatraIdx;
    return ensureArray(PANJIKA_DATA.specialYogas).filter(function (yg) {
      if (Array.isArray(yg.pairs) && yg.pairs.length) {
        return yg.pairs.some(function (p) {
          return p.weekday === weekdayIdx && p.nakshatra === nakName;
        });
      }
      var weekdayOK = !yg.weekdays || yg.weekdays.indexOf(weekdayIdx) >= 0;
      var nakOK = !yg.nakshatras || yg.nakshatras.indexOf(nakName) >= 0;
      return weekdayOK && nakOK;
    }).map(clone);
  }

  global.PANJIKA_DATA = PANJIKA_DATA;
  global.getPanjikaEvents = getPanjikaEvents;
  global.checkSpecialYogas = checkSpecialYogas;
})(typeof window !== 'undefined' ? window : globalThis);
