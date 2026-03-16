// tag-config.js
const tagConfig = {
  // Pillar Topics - এগুলো main cluster center
  pillars: [
    {
      id: 'astrology',
      name: 'জ্যোতিষ শাস্ত্র',
      relatedTags: ['জন্মকুণ্ডলী', 'গ্রহ প্রভাব', 'মাঙ্গলিক দোষ'],
      description: 'জ্যোতিষ শাস্ত্র সম্পর্কিত সব পোস্ট'
    },
    {
      id: 'palmistry',
      name: 'হস্তরেখা বিশ্লেষণ',
      relatedTags: ['হাতের চিহ্ন', 'পেশা নির্ণয়', 'ব্যক্তিত্ব বিশ্লেষণ'],
      description: 'হস্তরেখা ও সামুদ্রিক শাস্ত্র'
    },
    {
      id: 'philosophy',
      name: 'জীবন দর্শন',
      relatedTags: ['মানসিক শান্তি', 'সফলতার রহস্য', 'আত্মউন্নয়ন'],
      description: 'জীবন ও মানসিক উন্নয়ন'
    }
  ],
  
  // Cluster linking tags
  clusterTags: {
    'জন্মকুণ্ডলী': ['দোষ', 'গ্রহ প্রভাব', 'মারক ভাব'],
    'হস্তরেখা': ['বিশেষ চিহ্ন', 'পর্বত', 'জীবনরেখা'],
    'জীবন': ['সফলতা', 'ব্যর্থতা', 'মানসিক শক্তি']
  }
};

module.exports = tagConfig;
