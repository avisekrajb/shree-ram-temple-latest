import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, User, Clock, ArrowRight, Tag, Heart, Eye } from 'lucide-react';

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: {
      en: 'The Sacred History of Shree Ramchandra Temple',
      ne: 'श्री रामचन्द्र मन्दिरको पवित्र इतिहास',
      hi: 'श्री रामचन्द्र मंदिर का पवित्र इतिहास',
      zh: '室利罗摩钱德拉神庙的神圣历史',
      ta: 'ஸ்ரீ ராமச்சந்திர கோயிலின் புனித வரலாறு'
    },
    excerpt: {
      en: 'Discover the rich history and spiritual significance of the temple that has stood for generations on the banks of the Bagmati River.',
      ne: 'बागमती नदीको किनारमा पुस्तौंदेखि उभिएको मन्दिरको समृद्ध इतिहास र आध्यात्मिक महत्व पत्ता लगाउनुहोस्।',
      hi: 'बागमती नदी के तट पर पीढ़ियों से खड़े मंदिर के समृद्ध इतिहास और आध्यात्मिक महत्व को जानें।',
      zh: '探索世代以来矗立在巴格马蒂河畔的寺庙的丰富历史和精神意义。',
      ta: 'பாக்மதி ஆற்றங்கரையில் தலைமுறைகளாக நின்று வரும் கோயிலின் வளமான வரலாறு மற்றும் ஆன்மீக முக்கியத்துவத்தை கண்டறியவும்.'
    },
    content: {
      en: 'The temple\'s history dates back centuries, with legends of sages performing penance on these sacred banks. The temple has been a center of devotion and community service, hosting daily aartis, festivals, and spiritual gatherings that bring together devotees from all walks of life.',
      ne: 'मन्दिरको इतिहास शताब्दीयौं पुरानो छ, यी पवित्र किनारमा ऋषिहरूले तपस्या गरेका किंवदन्तीहरू छन्। मन्दिर भक्ति र समुदायिक सेवाको केन्द्र भएको छ, दैनिक आरती, चाडपर्व र आध्यात्मिक भेलाहरू आयोजना गर्दै जसले सबै क्षेत्रका भक्तहरूलाई एकत्रित गर्दछ।',
      hi: 'मंदिर का इतिहास सदियों पुराना है, इन पवित्र तटों पर ऋषियों द्वारा तपस्या करने की किंवदंतियाँ हैं। मंदिर भक्ति और सामुदायिक सेवा का केंद्र रहा है, जो दैनिक आरती, त्योहारों और आध्यात्मिक समारोहों का आयोजन करता है जो सभी वर्गों के भक्तों को एक साथ लाते हैं।',
      zh: '寺庙的历史可以追溯到几个世纪前，传说圣人在这些神圣的河岸上苦修。寺庙一直是虔诚和社区服务的中心，举办每日祈祷、节日和精神聚会，将各行各业的信徒聚集在一起。',
      ta: 'கோயிலின் வரலாறு பல நூற்றாண்டுகள் பழமையானது, இந்த புனித கரைகளில் முனிவர்கள் தவம் செய்த புராணக்கதைகள் உள்ளன. கோயில் பக்தி மற்றும் சமூக சேவையின் மையமாக உள்ளது, தினசரி ஆரத்திகள், திருவிழாக்கள் மற்றும் ஆன்மீக கூட்டங்களை நடத்துகிறது, இது அனைத்து தரப்பு பக்தர்களையும் ஒன்றிணைக்கிறது.'
    },
    image: '/1.jpg',
    date: '2026-07-15',
    author: 'Shree Ramchandra Temple Trust',
    category: 'History',
    readTime: '5 min read',
    views: 1245,
    likes: 89
  },
  {
    id: 2,
    title: {
      en: 'Ram Navami: The Grand Celebration',
      ne: 'राम नवमी: भव्य महोत्सव',
      hi: 'राम नवमी: भव्य महोत्सव',
      zh: '罗摩诞辰：盛大庆祝',
      ta: 'ராம் நவமி: பிரம்மாண்ட கொண்டாட்டம்'
    },
    excerpt: {
      en: 'Experience the vibrant celebrations of Ram Navami at the temple, with special pujas, bhajans, and community feasts that bring devotees together.',
      ne: 'मन्दिरमा राम नवमीको जीवन्त महोत्सव अनुभव गर्नुहोस्, विशेष पूजा, भजन र सामुदायिक भोजको साथ जसले भक्तहरूलाई एकत्रित गर्दछ।',
      hi: 'मंदिर में राम नवमी के जीवंत उत्सव का अनुभव करें, विशेष पूजा, भजन और सामुदायिक भोज के साथ जो भक्तों को एक साथ लाता है।',
      zh: '体验寺庙中罗摩诞辰的热闹庆祝活动，包括特别祈祷、颂歌和社区宴席，将信徒聚集在一起。',
      ta: 'கோயிலில் ராம் நவமியின் துடிப்பான கொண்டாட்டங்களை அனுபவியுங்கள், சிறப்பு பூஜைகள், பஜனைகள் மற்றும் சமூக விருந்துகளுடன் பக்தர்களை ஒன்றிணைக்கிறது.'
    },
    content: {
      en: 'Ram Navami is one of the most significant festivals celebrated at the temple, marking the birth of Lord Ram. The day begins with Mangala Aarti at 4:30 AM, followed by Abhishek, Akhand Ramayan Path, and a grand bhandara. Devotees from far and wide gather to participate in the celebrations.',
      ne: 'राम नवमी मन्दिरमा मनाइने सबैभन्दा महत्वपूर्ण चाडपर्वहरू मध्ये एक हो, जसले भगवान रामको जन्मको स्मरण गर्दछ। दिन बिहान ४:३० बजे मङ्गलाआरतीबाट सुरु हुन्छ, त्यसपछि अभिषेक, अखण्ड रामायण पाठ र भव्य भण्डारा हुन्छ। टाढा-टाढाबाट भक्तजनहरू महोत्सवमा सहभागी हुन जम्मा हुन्छन्।',
      hi: 'राम नवमी मंदिर में मनाए जाने वाले सबसे महत्वपूर्ण त्योहारों में से एक है, जो भगवान राम के जन्म का स्मरण कराता है। दिन की शुरुआत सुबह 4:30 बजे मंगला आरती से होती है, इसके बाद अभिषेक, अखण्ड रामायण पाठ और भव्य भंडारा होता है। दूर-दूर से भक्त उत्सव में भाग लेने के लिए एकत्रित होते हैं।',
      zh: '罗摩诞辰是寺庙庆祝的最重要节日之一，纪念罗摩神的诞生。一天从凌晨4:30的晨间祈祷开始，然后是沐浴仪式、不间断的罗摩衍那诵经和盛大的圣餐。来自各地的信徒聚集参加庆祝活动。',
      ta: 'ராம் நவமி கோயிலில் கொண்டாடப்படும் மிக முக்கியமான திருவிழாக்களில் ஒன்றாகும், இது ராமர் பிறந்த நாளை நினைவுகூருகிறது. நாள் அதிகாலை 4:30 மணிக்கு மங்கள ஆரத்தியுடன் தொடங்குகிறது, அதைத் தொடர்ந்து அபிஷேகம், அகண்ட ராமாயண பாராயணம் மற்றும் பிரம்மாண்ட பண்டாரா. தூர தூரத்திலிருந்து பக்தர்கள் கொண்டாட்டங்களில் பங்கேற்க கூடுகிறார்கள்.'
    },
    image: '/2.jpg',
    date: '2026-07-10',
    author: 'Shree Ramchandra Temple Trust',
    category: 'Festivals',
    readTime: '4 min read',
    views: 2345,
    likes: 156
  },
  {
    id: 3,
    title: {
      en: 'The Spiritual Significance of Daily Aarti',
      ne: 'दैनिक आरतीको आध्यात्मिक महत्व',
      hi: 'दैनिक आरती का आध्यात्मिक महत्व',
      zh: '每日祈祷的精神意义',
      ta: 'தினசரி ஆரத்தியின் ஆன்மீக முக்கியத்துவம்'
    },
    excerpt: {
      en: 'Learn about the profound spiritual meaning behind the daily aarti ceremonies and how they connect devotees with the divine.',
      ne: 'दैनिक आरती समारोहको पछाडिको गहिरो आध्यात्मिक अर्थ र तिनीहरूले भक्तहरूलाई दिव्यसँग कसरी जोड्छन् भन्ने बारे जान्नुहोस्।',
      hi: 'दैनिक आरती समारोह के पीछे गहन आध्यात्मिक अर्थ और वे भक्तों को दिव्य से कैसे जोड़ते हैं, इसके बारे में जानें।',
      zh: '了解每日祈祷仪式背后深刻的精神意义，以及它们如何将信徒与神圣联系起来。',
      ta: 'தினசரி ஆரத்தி விழாக்களின் பின்னணியில் உள்ள ஆழமான ஆன்மீக அர்த்தத்தையும், அவை பக்தர்களை தெய்வீகத்துடன் எவ்வாறு இணைக்கின்றன என்பதையும் அறியுங்கள்.'
    },
    content: {
      en: 'The daily aarti is a sacred ritual that symbolizes the offering of light to the divine. Each aarti has its own significance - Mangala Aarti at dawn welcomes the new day, Bhog Aarti offers food to the Lord, Sandhya Aarti marks the evening, and Shayan Aarti prepares the Lord for rest. These rituals create a rhythm of devotion that permeates the temple atmosphere.',
      ne: 'दैनिक आरती एक पवित्र अनुष्ठान हो जसले दिव्यलाई प्रकाशको अर्पणको प्रतीक हो। प्रत्येक आरतीको आफ्नै महत्व छ - मङ्गलाआरती बिहान नयाँ दिनको स्वागत गर्दछ, भोग आरतीले भगवानलाई भोजन अर्पण गर्दछ, सन्ध्या आरतीले साँझको सङ्केत गर्दछ, र शयन आरतीले भगवानलाई विश्रामको लागि तयार गर्दछ। यी अनुष्ठानहरूले मन्दिरको वातावरणमा व्याप्त भक्तिको लय सिर्जना गर्दछ।',
      hi: 'दैनिक आरती एक पवित्र अनुष्ठान है जो दिव्य को प्रकाश अर्पित करने का प्रतीक है। प्रत्येक आरती का अपना महत्व है - मंगला आरती भोर में नए दिन का स्वागत करती है, भोग आरती भगवान को भोजन अर्पित करती है, संध्या आरती शाम का संकेत देती है, और शयन आरती भगवान को विश्राम के लिए तैयार करती है। ये अनुष्ठान भक्ति की एक लय बनाते हैं जो मंदिर के वातावरण में व्याप्त है।',
      zh: '每日祈祷是一种神圣的仪式，象征着向神圣献上光明。每次祈祷都有其独特的意义 - 黎明的晨间祈祷欢迎新的一天，供奉祈祷向神献上食物，傍晚祈祷标志着夜晚，睡前祈祷为神的休息做准备。这些仪式创造了一种虔诚的节奏，弥漫在寺庙的氛围中。',
      ta: 'தினசரி ஆரத்தி என்பது தெய்வீகத்திற்கு ஒளியை அளிப்பதைக் குறிக்கும் ஒரு புனித சடங்கு. ஒவ்வொரு ஆரத்திக்கும் அதன் சொந்த முக்கியத்துவம் உள்ளது - மங்கள ஆரத்தி விடியலில் புதிய நாளை வரவேற்கிறது, போக் ஆரத்தி இறைவனுக்கு உணவு படைக்கிறது, சந்தியா ஆரத்தி மாலையைக் குறிக்கிறது, மற்றும் சயன ஆரத்தி இறைவனை ஓய்வுக்குத் தயார்படுத்துகிறது. இந்த சடங்குகள் கோயில் சூழ்நிலையில் பரவியிருக்கும் பக்தியின் ஒரு தாளத்தை உருவாக்குகின்றன.'
    },
    image: '/1.jpg',
    date: '2026-07-05',
    author: 'Pandit Ram Prasad Acharya',
    category: 'Rituals',
    readTime: '6 min read',
    views: 1890,
    likes: 112
  },
  {
    id: 4,
    title: {
      en: 'Community Service at the Temple',
      ne: 'मन्दिरमा सामुदायिक सेवा',
      hi: 'मंदिर में सामुदायिक सेवा',
      zh: '寺庙的社区服务',
      ta: 'கோயிலில் சமூக சேவை'
    },
    excerpt: {
      en: 'The temple has been a pillar of community service, providing food, education, and spiritual guidance to those in need.',
      ne: 'मन्दिर सामुदायिक सेवाको स्तम्भ भएको छ, जसले आवश्यकतामा परेकाहरूलाई भोजन, शिक्षा र आध्यात्मिक मार्गदर्शन प्रदान गर्दछ।',
      hi: 'मंदिर सामुदायिक सेवा का स्तंभ रहा है, जरूरतमंदों को भोजन, शिक्षा और आध्यात्मिक मार्गदर्शन प्रदान करता है।',
      zh: '寺庙一直是社区服务的支柱，为有需要的人提供食物、教育和精神指导。',
      ta: 'கோயில் சமூக சேவையின் தூணாக உள்ளது, தேவைப்படுபவர்களுக்கு உணவு, கல்வி மற்றும் ஆன்மீக வழிகாட்டுதலை வழங்குகிறது.'
    },
    content: {
      en: 'Beyond its spiritual role, the temple is deeply involved in community service. Daily annadaan (food distribution) feeds hundreds of devotees. The temple also runs educational programs, health camps, and supports local families in need. This tradition of seva (selfless service) is at the heart of the temple\'s mission.',
      ne: 'यसको आध्यात्मिक भूमिका बाहेक, मन्दिर सामुदायिक सेवामा गहिरो रूपमा संलग्न छ। दैनिक अन्नदान (खाना वितरण) ले सयौं भक्तहरूलाई खुवाउँछ। मन्दिरले शैक्षिक कार्यक्रमहरू, स्वास्थ्य शिविरहरू पनि चलाउँछ र आवश्यकतामा परेका स्थानीय परिवारहरूलाई सहयोग गर्दछ। सेवाको यो परम्परा मन्दिरको मिशनको केन्द्रमा छ।',
      hi: 'अपनी आध्यात्मिक भूमिका के अलावा, मंदिर सामुदायिक सेवा में गहराई से शामिल है। दैनिक अन्नदान (भोजन वितरण) सैकड़ों भक्तों को भोजन कराता है। मंदिर शैक्षिक कार्यक्रम, स्वास्थ्य शिविर भी चलाता है और जरूरतमंद स्थानीय परिवारों की सहायता करता है। सेवा की यह परंपरा मंदिर के मिशन के केंद्र में है।',
      zh: '除了精神角色之外，寺庙还深入参与社区服务。每日的免费餐食为数百名信徒提供食物。寺庙还开展教育项目、健康营，并支持有需要的当地家庭。这种无私服务的传统是寺庙使命的核心。',
      ta: 'அதன் ஆன்மீக பாத்திரத்திற்கு அப்பால், கோயில் சமூக சேவையில் ஆழமாக ஈடுபட்டுள்ளது. தினசரி அன்னதானம் (உணவு விநியோகம்) நூற்றுக்கணக்கான பக்தர்களுக்கு உணவளிக்கிறது. கோயில் கல்வி திட்டங்கள், சுகாதார முகாம்களையும் நடத்துகிறது மற்றும் தேவைப்படும் உள்ளூர் குடும்பங்களுக்கு ஆதரவளிக்கிறது. இந்த சேவை பாரம்பரியம் கோயிலின் பணியின் மையத்தில் உள்ளது.'
    },
    image: '/2.jpg',
    date: '2026-06-28',
    author: 'Shree Ramchandra Temple Trust',
    category: 'Community',
    readTime: '4 min read',
    views: 1567,
    likes: 98
  }
];

// Helper to get localized text
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

const BlogsPage = () => {
  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'History', 'Festivals', 'Rituals', 'Community'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const titleText = getLocalizedText(post.title, lang).toLowerCase();
    const excerptText = getLocalizedText(post.excerpt, lang).toLowerCase();
    const matchesSearch = titleText.includes(searchTerm.toLowerCase()) || 
                          excerptText.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #faf8f5 100%)' }}
    >
      {/* Header */}
      <div className="pt-24 pb-8 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light"
          style={{ color: '#7A0000' }}
        >
          {t.blogsTitle || 'Temple Blogs'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-base sm:text-lg text-mute max-w-xl mx-auto leading-relaxed"
        >
          {t.blogsSubtitle || 'Stories, insights, and spiritual reflections from Shree Ramchandra Temple'}
        </motion.p>
      </div>

      {/* Filter and Search */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-vermilion text-white'
                    : 'bg-white border border-gray-200 text-ink-soft hover:border-vermilion hover:text-vermilion'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={t.blogsSearch || 'Search blogs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:border-vermilion focus:outline-none text-sm"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post, index) => {
            const titleText = getLocalizedText(post.title, lang);
            const excerptText = getLocalizedText(post.excerpt, lang);
            const contentText = getLocalizedText(post.content, lang);

            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={titleText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-vermilion/90 text-white text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center gap-4 text-white/80 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold text-ink mb-3 group-hover:text-red-900 transition-colors line-clamp-2">
                    {titleText}
                  </h2>
                  <p className="text-sm text-mute leading-relaxed mb-4 line-clamp-3">
                    {excerptText}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-ink-soft">
                      <User size={14} className="text-vermilion" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-soft">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} className="text-red-400" />
                        {post.likes}
                      </span>
                      <button className="inline-flex items-center gap-1 text-vermilion font-medium hover:gap-2 transition-all">
                        {t.blogsReadMore || 'Read More'}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-mute">{t.blogsNoPosts || 'No blog posts found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
