import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

// Local images from public folder
const defaultHeroImage = '/4.jpg';
const defaultSectionImage1 = '/1.jpg';
const defaultSectionImage2 = '/2.jpg';
const defaultSectionImage3 = '/3.jpg';

// Helper to get text in current language
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

// ── Full-screen parallax hero ─────────────────────────────────────────────────
function AboutHero({ heroImage, title, intro }) {
  const { lang } = useLanguage();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const imgScale = useTransform(smooth, [0, 1], [1, 1.16]);
  const overlayOp = useTransform(smooth, [0, 0.7], [0.32, 0.72]);
  const textY = useTransform(smooth, [0, 1], ["0%", "-26%"]);
  const textOpacity = useTransform(smooth, [0, 0.5], [1, 0]);

  const titleText = getLocalizedText(title, lang) || 'About Us';
  const introText = getLocalizedText(intro, lang) || 'Discover the rich history and spiritual significance of Shree Ramchandra Temple';

  const imageSrc = heroImage || defaultHeroImage;

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 520 }}
    >
      <motion.img
        src={imageSrc}
        alt=""
        aria-hidden
        style={{ scale: imgScale }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none origin-center"
        onError={(e) => {
          e.target.src = defaultHeroImage;
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,1)", opacity: overlayOp }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.08) 45%, transparent 70%)",
        }}
      />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-light leading-tight drop-shadow-2xl mb-6"
        >
          {titleText}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="text-white/70 text-base sm:text-lg max-w-xl leading-relaxed"
        >
          {introText}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs uppercase tracking-widest" style={{ fontFamily: "serif" }}>
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 32,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
          }}
        />
      </motion.div>
    </div>
  );
}

// ── Section Component ────────────────────────────────────────────────────────
function AboutSection({ section, index }) {
  const { lang } = useLanguage();

  const isEven = index % 2 === 0;

  const titleText = getLocalizedText(section.title, lang) || 'Section Title';
  const bodyText = getLocalizedText(section.body, lang) || 'Section description...';

  // Determine which image to show based on index
  const getDefaultImage = (idx) => {
    if (idx === 0) return defaultSectionImage1;
    if (idx === 1) return defaultSectionImage2;
    return defaultSectionImage3;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`grid md:grid-cols-2 gap-12 items-center ${!isEven ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      {/* Image */}
      <div className="rounded-xl overflow-hidden shadow-lg">
        <img
          src={section.image || getDefaultImage(index)}
          alt={titleText}
          loading="lazy"
          className="w-full h-80 object-cover"
          onError={(e) => {
            e.target.src = getDefaultImage(index);
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center">
        <h2
          className="font-serif text-2xl sm:text-3xl mb-4"
          style={{ color: "#7A0000" }}
        >
          {titleText}
        </h2>
        <p className="text-mute leading-relaxed text-base sm:text-lg">
          {bodyText}
        </p>
      </div>
    </motion.div>
  );
}

// ── Activities Section ──────────────────────────────────────────────────────
function ActivitiesSection({ activities, lang }) {
  const titleRef = useRef(null);

  const activityKeys = Object.keys(activities || {});

  if (activityKeys.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div
        ref={titleRef}
        className="max-w-4xl mx-auto px-6 text-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
        </div>
        <h2
          className="font-serif text-3xl sm:text-4xl"
          style={{ color: "#1a0a00" }}
        >
          Activities & Programs
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {activityKeys.map((key, index) => {
          const activity = activities[key];
          const isEven = index % 2 === 0;
          const isDaily = key === 'daily';

          const titleText = getLocalizedText(activity.title, lang) || key;
          const descText = getLocalizedText(activity.desc, lang) || '';

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className={`py-12 px-6 sm:px-10 lg:px-16 ${isEven ? "" : "bg-[#faf7f4]"} rounded-xl ${index > 0 ? "mt-6" : ""}`}
            >
              <div className="max-w-5xl mx-auto">
                <div className="flex items-baseline gap-4 mb-4">
                  <span
                    className="text-xs tracking-widest text-mute shrink-0"
                    style={{ fontFamily: "serif", minWidth: "2.5rem" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight"
                    style={{ color: "#520505" }}
                  >
                    {titleText}
                  </h3>
                </div>

                <div className="ml-10 max-w-3xl">
                  {isDaily && activity.paragraphs ? (
                    <div className="space-y-4">
                      {Object.keys(activity.paragraphs).map((pKey) => {
                        const paraText = getLocalizedText(activity.paragraphs[pKey], lang);
                        return (
                          <p key={pKey} className="text-sm sm:text-base text-mute leading-relaxed">
                            {paraText}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base text-mute leading-relaxed">
                      {descText || 'No description available'}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ── Main About Page ──────────────────────────────────────────────────────────
const AboutPage = () => {
  const { t, lang } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default sections with local images
  const defaultSections = [
    {
      key: 'architecture',
      title: { 
        en: 'Temple Architecture', 
        ne: 'मन्दिरको वास्तुकला', 
        hi: 'मंदिर की वास्तुकला', 
        zh: '寺庙建筑', 
        ta: 'கோயில் கட்டிடக்கலை' 
      },
      body: { 
        en: 'The temple showcases traditional Nepali architecture with intricate wood carvings, pagoda-style roofs, and sacred symbols that reflect centuries of craftsmanship and devotion.', 
        ne: 'मन्दिरले परम्परागत नेपाली वास्तुकलालाई प्रदर्शन गर्दछ, जसमा जटिल काठको नक्काशी, प्यागोडा-शैलीका छानाहरू र पवित्र प्रतीकहरू छन् जसले शताब्दीयौंको शिल्पकला र भक्तिलाई प्रतिबिम्बित गर्दछ।', 
        hi: 'मंदिर पारंपरिक नेपाली वास्तुकला को प्रदर्शन करता है, जिसमें जटिल लकड़ी की नक्काशी, पगोडा-शैली की छतें और पवित्र प्रतीक शामिल हैं जो सदियों के शिल्प और भक्ति को दर्शाते हैं।', 
        zh: '寺庙展示了传统尼泊尔建筑风格，包括精美的木雕、宝塔式屋顶和神圣符号，反映了几个世纪以来的工艺和虔诚。', 
        ta: 'கோயில் பாரம்பரிய நேபாள கட்டிடக்கலையை வெளிப்படுத்துகிறது, இதில் சிக்கலான மர வேலைப்பாடுகள், பகோடா பாணி கூரைகள் மற்றும் புனித சின்னங்கள் ஆகியவை பல நூற்றாண்டுகளின் கைவினைத்திறன் மற்றும் பக்தியை பிரதிபலிக்கின்றன.' 
      },
      image: defaultSectionImage1,
    },
    {
      key: 'deity',
      title: { 
        en: 'The Deity', 
        ne: 'देवता', 
        hi: 'देवता', 
        zh: '神像', 
        ta: 'கடவுள்' 
      },
      body: { 
        en: 'Lord Ram, along with Sita and Lakshman, is enshrined in the sanctum sanctorum, radiating peace and blessings to all who seek divine grace.', 
        ne: 'भगवान राम, सीता र लक्ष्मणसहित, गर्भगृहमा विराजमान छन्, जसले दिव्य कृपा खोज्ने सबैलाई शान्ति र आशीर्वाद प्रदान गर्दछन्।', 
        hi: 'भगवान राम, सीता और लक्ष्मण के साथ, गर्भगृह में विराजमान हैं, जो दिव्य कृपा चाहने वालों को शांति और आशीर्वाद प्रदान करते हैं।', 
        zh: '罗摩神与悉多和拉克什曼一同供奉在圣殿中，向寻求神圣恩典的人们散发和平与祝福。', 
        ta: 'ராமர், சீதை மற்றும் லக்ஷ்மணருடன் கருவறையில் எழுந்தருளியுள்ளார், தெய்வீக அருளை நாடும் அனைவருக்கும் அமைதியையும் ஆசீர்வாதத்தையும் வழங்குகிறார்.' 
      },
      image: defaultSectionImage2,
    },
    {
      key: 'location',
      title: { 
        en: 'Sacred Location', 
        ne: 'पवित्र स्थान', 
        hi: 'पवित्र स्थान', 
        zh: '神圣地点', 
        ta: 'புனித இடம்' 
      },
      body: { 
        en: 'Located in the heart of Gaushala, Kathmandu, the temple is situated on the sacred banks of the Bagmati River, making it a spiritual haven for devotees.', 
        ne: 'गौशाला, काठमाडौंको हृदयमा अवस्थित, मन्दिर बागमती नदीको पवित्र किनारमा अवस्थित छ, जसले यसलाई भक्तहरूको लागि आध्यात्मिक स्वर्ग बनाउँछ।', 
        hi: 'गौशाला, काठमाडौं के हृदय में स्थित, मंदिर बागमती नदी के पवित्र तट पर स्थित है, जो इसे भक्तों के लिए एक आध्यात्मिक स्वर्ग बनाता है।', 
        zh: '寺庙位于加德满都高沙拉的中心，坐落在巴格马蒂河的圣河畔，是信徒们的精神天堂。', 
        ta: 'கௌஷாலா, காத்மாண்டுவின் இதயத்தில் அமைந்துள்ள கோயில், பாக்மதி ஆற்றின் புனிதக் கரையில் அமைந்துள்ளது, இது பக்தர்களுக்கு ஒரு ஆன்மீக புகலிடமாக அமைகிறது.' 
      },
      image: defaultSectionImage3,
    },
  ];

  const defaultActivities = {
    daily: {
      title: { 
        en: 'Daily Puja (Nitya Puja)', 
        ne: 'दैनिक पूजा (नित्य पूजा)', 
        hi: 'दैनिक पूजा (नित्य पूजा)', 
        zh: '日常礼拜', 
        ta: 'தினசரி பூஜை' 
      },
      paragraphs: {
        p1: { 
          en: 'The daily activities at Shree Ramchandra Temple begin at 5:00 AM. Until 8:30 AM, the deity is bathed, adorned, and offered Balbhog (morning meal). During this time, devotees come for darshan, creating an atmosphere of devotion.', 
          ne: 'श्री रामचन्द्र मन्दिरका दैनिक कार्यक्रमहरू बिहान ५ बजेदेखि शुरु हुन्छन्। बिहान ८:३० सम्मा भगवानलाई नुहाई, सजाई तथा बालभोग (बिहान्को भोजन) दिइन्छ। यो समयमा भक्तजनहरू दर्शनको लागि आउँछन्, जसले मन्दिरमा भक्तिको वातावरण सृष्टि गर्छ।', 
          hi: 'श्री रामचन्द्र मंदिर की दैनिक गतिविधियाँ सुबह 5:00 बजे शुरू होती हैं। सुबह 8:30 बजे तक भगवान को स्नान कराया जाता है, सजाया जाता है और बालभोग (सुबह का भोजन) चढ़ाया जाता है। इस समय के दौरान, भक्त दर्शन के लिए आते हैं, जो मंदिर में भक्ति का वातावरण बनाता है।', 
          zh: '室利罗摩钱德拉神庙的日常活动从早上5点开始。直到上午8点30分，神像被沐浴、装饰并供奉早餐。在此期间，信徒前来朝拜，营造出虔诚的氛围。', 
          ta: 'ஸ்ரீ ராமச்சந்திர கோயிலில் தினசரி நடவடிக்கைகள் அதிகாலை 5:00 மணிக்கு தொடங்கும். காலை 8:30 வரை, கடவுளுக்கு குளிப்பாட்டப்பட்டு, அலங்கரிக்கப்பட்டு, பால்போக் (காலை உணவு) படைக்கப்படுகிறது. இந்த நேரத்தில், பக்தர்கள் தரிசனத்திற்காக வருகிறார்கள், இது கோயிலில் பக்தி சூழ்நிலையை உருவாக்குகிறது.' 
        },
        p2: { 
          en: 'At 9:00 AM, the morning Aarti and Bhog (offering of satvik vegetarian food) take place. During Bhog, the curtains are drawn as no one should see the Lord eating. Devotees gather in the prayer hall, women on the north side and men on the south. After Aarti, devotees prostrate before the deity.', 
          ne: 'बिहान ९ बजेदेखि सकालको आरती र भोगराग (सात्विक, शाकाहारी भोजनको अर्पण) हुन्छ। भोगरागको समयमा पर्दा खिचिन्छ, किनभने भगवानको खाना कसैले नहेर्नु हुँदैन। भक्तजनहरू यज्ञमोहनमा (प्रार्थना कक्षमा) जमा हुन्छन्, महिलाहरू उत्तरतर्फ र पुरुषहरू दक्षिणतर्फ खडा हुन्छन्। आरती पछि, भक्तजनहरूले दण्डवत् (नमस्कार) गर्छन्।', 
          hi: 'सुबह 9:00 बजे, सुबह की आरती और भोग (सात्विक शाकाहारी भोजन का अर्पण) होता है। भोग के दौरान, पर्दे खींचे जाते हैं क्योंकि किसी को भगवान को खाते हुए नहीं देखना चाहिए। भक्त प्रार्थना कक्ष में एकत्रित होते हैं, महिलाएं उत्तर दिशा में और पुरुष दक्षिण दिशा में। आरती के बाद, भक्त भगवान के सामने दंडवत प्रणाम करते हैं।', 
          zh: '上午9点，举行晨间祈祷和供奉（素食供奉）。在供奉期间，窗帘被拉上，因为没有人应该看到神在进食。信徒聚集在祈祷厅，妇女在北侧，男子在南侧。祈祷结束后，信徒向神像顶礼膜拜。', 
          ta: 'காலை 9:00 மணிக்கு, காலை ஆரத்தி மற்றும் போக் (சாத்விக சைவ உணவு படைப்பு) நடைபெறுகிறது. போக்கின் போது, திரைச்சீலைகள் இழுக்கப்படுகின்றன, ஏனெனில் இறைவன் சாப்பிடுவதை யாரும் பார்க்கக் கூடாது. பக்தர்கள் பிரார்த்தனை மண்டபத்தில் கூடுகிறார்கள், பெண்கள் வடக்கு பக்கத்திலும் ஆண்கள் தெற்கு பக்கத்திலும் நிற்கிறார்கள். ஆரத்திக்குப் பிறகு, பக்தர்கள் கடவுளுக்கு முன்னால் வணங்குகிறார்கள்.' 
        },
        p3: { 
          en: 'The priest blesses devotees by placing the Lord\'s crown and sandals on their heads. He distributes Teertha (holy water) and Gosthi (fruits or sweets - Prasad), which devotees consume immediately or take home for family members. After the Aarti, devotional songs and prayers are sung, ending with Jayakar.', 
          ne: 'पुजारीले भगवानको मुकुट र चप्पललाई भक्तजनको टाउकोमा लगाई आशीर्वाद दिन्छ। पुजारीले तीर्थ (पवित्र पानी) र गोष्ठी (फलफूल वा मिठाइ - प्रसाद) वितरण गर्छ, जसलाई भक्तजनहरूले तुरुन्तै खाउँछन् वा घरका सदस्यहरूको लागि लिएर जान्छन्। आरती पछि, भक्ति गीत र प्रार्थना गाइन्छ, जो जयकार (कल्याण गान) मा समाप्त हुन्छ।', 
          hi: 'पुजारी भगवान का मुकुट और चप्पल भक्तों के सिर पर रखकर आशीर्वाद देते हैं। वह तीर्थ (पवित्र जल) और गोष्ठी (फल या मिठाई - प्रसाद) वितरित करते हैं, जिसे भक्त तुरंत खाते हैं या परिवार के सदस्यों के लिए ले जाते हैं। आरती के बाद, भक्ति गीत और प्रार्थनाएं गाई जाती हैं, जो जयकार के साथ समाप्त होती हैं।', 
          zh: '祭司将神像的王冠和拖鞋放在信徒头上赐福。他分发圣水和供品（水果或糖果），信徒们立即食用或带回家给家人。礼拜结束后，唱诵 devotional songs and prayers，以Jayakar结束。', 
          ta: 'பூசாரி இறைவனின் கிரீடத்தையும் செருப்புகளையும் பக்தர்களின் தலைகளில் வைத்து ஆசீர்வதிக்கிறார். அவர் தீர்த்தம் (புனித நீர்) மற்றும் கோஷ்டி (பழங்கள் அல்லது இனிப்புகள் - பிரசாதம்) ஆகியவற்றை விநியோகிக்கிறார், இதை பக்தர்கள் உடனடியாக உட்கொள்கிறார்கள் அல்லது குடும்ப உறுப்பினர்களுக்காக எடுத்துச் செல்கிறார்கள். ஆரத்திக்குப் பிறகு, பக்தி பாடல்களும் பிரார்த்தனைகளும் பாடப்படுகின்றன, அவை ஜெயகருடன் முடிவடைகின்றன.' 
        },
        p4: { 
          en: 'The evening Aarti is held at 6:00 PM in summer and 5:30 PM in winter, followed by the Lord\'s resting period (Shukla). Evening Bhog is offered and the Aarti follows the same procedure as the morning.', 
          ne: 'साँझको आरती गर्मीमा ६ बजे र जाडोमा ५:३० बजे हुन्छ, त्यसपछि भगवानको विश्रामको अवधि (शुकला) आउँछ। साँझको भोजन दिइन्छ र आरती सकालको जस्तै प्रक्रियाअनुसार गरिन्छ।', 
          hi: 'शाम की आरती गर्मियों में शाम 6:00 बजे और सर्दियों में 5:30 बजे होती है, इसके बाद भगवान की विश्राम अवधि (शुक्ला) आती है। शाम का भोग चढ़ाया जाता है और आरती सुबह की तरह ही प्रक्रिया के अनुसार की जाती है।', 
          zh: '晚间祈祷夏季在下午6点，冬季在下午5点30分举行，之后是神的休息时间。晚上供奉食物，祈祷程序与早晨相同。', 
          ta: 'மாலை ஆரத்தி கோடையில் மாலை 6:00 மணிக்கும் குளிர்காலத்தில் 5:30 மணிக்கும் நடைபெறுகிறது, அதைத் தொடர்ந்து இறைவனின் ஓய்வு காலம் (சுக்லா) வருகிறது. மாலை போக் படைக்கப்பட்டு, ஆரத்தி காலை போன்ற அதே செயல்முறையைப் பின்பற்றுகிறது.' 
        },
      },
    },
    occasional: {
      title: { 
        en: 'Occasional Puja (Naimittika Puja)', 
        ne: 'अनौठो पूजा (नैमित्तिक पूजा)', 
        hi: 'अनौठो पूजा (नैमित्तिक पूजा)', 
        zh: '特殊礼拜', 
        ta: 'அவ்வப்போது பூஜை' 
      },
      desc: { 
        en: 'On the first day of every Nepali month (Sankranti), special rituals attract hundreds of devotees. Major festivals like Shri Panchami, Sita Jayanti, Vivah Panchami, Ekadashi, and Hanuman Jayanti feature grand ceremonies, filling the temple grounds with devotion.', 
        ne: 'हरेक नेपाली महिनाको पहिलो दिनमा (संक्रान्ति), विशेष त्रिरुमञ्जन (विस्तृत पूजा) सयौं भक्तजनलाई आकर्षित गर्छ। श्री पञ्चमी, सीता जयन्ती, विवाह पञ्चमी, एकादशी र हनुमान जयन्तीजस्ता प्रमुख पर्वहरूमा भव्य पूजा हुन्छ, मन्दिरको आङ्गन भक्तजनको भक्तिले गुञ्जायमान हुन्छ।', 
        hi: 'हर नेपाली महीने के पहले दिन (संक्रांति), विशेष त्रिरुमञ्जन (विस्तृत पूजा) सैकड़ों भक्तों को आकर्षित करता है। श्री पञ्चमी, सीता जयन्ती, विवाह पञ्चमी, एकादशी और हनुमान जयन्ती जैसे प्रमुख त्योहारों पर भव्य पूजा होती है, मंदिर का आंगन भक्ति से गूंज उठता है।', 
        zh: '在尼泊尔每个月的第一天，特殊仪式吸引数百名信徒。主要节日如Shri Panchami、Sita Jayanti、Vivah Panchami、Ekadashi和Hanuman Jayanti都会举行盛大的仪式，寺庙场地充满虔诚。', 
        ta: 'ஒவ்வொரு நேபாள மாதத்தின் முதல் நாளிலும் (சங்க்ராந்தி), சிறப்பு சடங்குகள் நூற்றுக்கணக்கான பக்தர்களை ஈர்க்கின்றன. ஸ்ரீ பஞ்சமி, சீதா ஜெயந்தி, விவாஹ பஞ்சமி, ஏகாதசி மற்றும் ஹனுமான் ஜெயந்தி போன்ற முக்கிய திருவிழாக்களில் பிரம்மாண்டமான சடங்குகள் நடைபெறுகின்றன, கோயில் வளாகம் பக்தியால் நிறைந்துள்ளது.' 
      },
    },
  };

  // State for sections and activities
  const [sections, setSections] = useState(defaultSections);
  const [activities, setActivities] = useState(defaultActivities);
  const [heroImage, setHeroImage] = useState(defaultHeroImage);
  const [aboutTitle, setAboutTitle] = useState({ 
    en: 'About Us', 
    ne: 'हाम्रो बारेमा', 
    hi: 'हमारे बारे में', 
    zh: '关于我们', 
    ta: 'எங்களைப் பற்றி' 
  });
  const [aboutIntro, setAboutIntro] = useState({ 
    en: 'Discover the rich history and spiritual significance of Shree Ramchandra Temple',
    ne: 'श्री रामचन्द्र मन्दिरको समृद्ध इतिहास र आध्यात्मिक महत्व पत्ता लगाउनुहोस्',
    hi: 'श्री रामचन्द्र मंदिर के समृद्ध इतिहास और आध्यात्मिक महत्व को जानें',
    zh: '探索室利罗摩钱德拉神庙丰富的历史和精神意义',
    ta: 'ஸ்ரீ ராமச்சந்திர கோயிலின் வளமான வரலாறு மற்றும் ஆன்மீக முக்கியத்துவத்தை கண்டறியவும்'
  });

  // Load settings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/settings');
        const data = response.data;
        setSettings(data);

        // Load about sections
        if (data.about?.sections && data.about.sections.length > 0) {
          setSections(data.about.sections);
        }

        // Load activities
        if (data.about?.activities) {
          setActivities(data.about.activities);
        }

        // Load hero
        if (data.about?.heroImage) {
          setHeroImage(data.about.heroImage);
        }
        if (data.about?.title) {
          setAboutTitle(data.about.title);
        }
        if (data.about?.intro) {
          setAboutIntro(data.about.intro);
        }

      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-maroon rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero */}
      <AboutHero 
        heroImage={heroImage} 
        title={aboutTitle} 
        intro={aboutIntro} 
      />

      {/* Sections - Removed borders */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-24">
        {sections.map((section, index) => (
          <AboutSection
            key={section.key || index}
            section={section}
            index={index}
          />
        ))}
      </div>

      {/* Activities - Properly aligned */}
      <ActivitiesSection 
        activities={activities} 
        lang={lang}
      />

      {/* Bottom CTA - Removed Jai Shree Ram and border */}
      <div className="bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 py-12 text-center"
        >
          <p className="font-serif text-2xl font-semibold text-red-900">
            Shree Ramchandra Temple — A Living Heritage
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;