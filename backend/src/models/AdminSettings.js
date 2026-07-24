const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  // Hero Section
  heroVideo: {
    type: String,
    default: null,
  },
  heroPoster: {
    type: String,
    default: 'linear-gradient(160deg,#7A1F2B 0%,#5B1420 45%,#2B1810 100%)',
  },
  heroEnabled: {
    type: Boolean,
    default: true,
  },
  
  // Daily Quotes (Multi-language)
  quotes: {
    en: { type: String, default: 'Where there is righteousness in the heart, there is beauty in the character.' },
    ne: { type: String, default: 'जहाँ हृदयमा धार्मिकता हुन्छ, त्यहाँ चरित्रमा सुन्दरता हुन्छ।' },
    hi: { type: String, default: 'जहाँ हृदय में धार्मिकता है, वहाँ चरित्र में सुंदरता है।' },
    zh: { type: String, default: '心中有正义，性格便有美。' },
    ta: { type: String, default: 'இதயத்தில் நேர்மை இருந்தால், குணத்தில் அழகு இருக்கும்.' },
  },
  
  // Temple Timings (Multi-language)
  timings: {
    open: { type: String, default: '05:00 AM' },
    close: { type: String, default: '08:00 PM' },
    openLabel: {
      en: { type: String, default: 'Opening Time' },
      ne: { type: String, default: 'खुल्ने समय' },
      hi: { type: String, default: 'खुलने का समय' },
      zh: { type: String, default: '开放时间' },
      ta: { type: String, default: 'திறக்கும் நேரம்' },
    },
    closeLabel: {
      en: { type: String, default: 'Closing Time' },
      ne: { type: String, default: 'बन्द हुने समय' },
      hi: { type: String, default: 'बन्द होने का समय' },
      zh: { type: String, default: '关闭时间' },
      ta: { type: String, default: 'மூடும் நேரம்' },
    },
    dailyAarti: {
      en: { type: String, default: 'Daily Aarti' },
      ne: { type: String, default: 'दैनिक आरती' },
      hi: { type: String, default: 'दैनिक आरती' },
      zh: { type: String, default: '每日祈祷' },
      ta: { type: String, default: 'தினசரி ஆரத்தி' },
    },
  },
  
  // About Section (Multi-language)
  about: {
    photo: { type: String, default: null },
    title: {
      en: { type: String, default: 'About the Temple' },
      ne: { type: String, default: 'मन्दिरको बारेमा' },
      hi: { type: String, default: 'मंदिर के बारे में' },
      zh: { type: String, default: '关于神庙' },
      ta: { type: String, default: 'கோயிலைப் பற்றி' },
    },
    text: {
      en: { type: String, default: 'Nestled in the heart of Gaushala, Shree Ramchandra Temple has stood as a beacon of devotion for generations, welcoming devotees of Lord Ram with open doors and open hearts.' },
      ne: { type: String, default: 'गौशालाको हृदयमा अवस्थित श्री रामचन्द्र मन्दिर पुस्तौंदेखि भक्तिको प्रतीकको रूपमा उभिएको छ, भगवान रामका भक्तहरूलाई खुला मन र खुला ढोकाले स्वागत गर्दै।' },
      hi: { type: String, default: 'गौशाला के हृदय में स्थित श्री रामचन्द्र मंदिर पीढ़ियों से भक्ति का प्रतीक बना हुआ है, भगवान राम के भक्तों का खुले दिल और खुले द्वार से स्वागत करते हुए।' },
      zh: { type: String, default: '室利罗摩钱德拉神庙坐落于高沙拉的中心，世代以来一直是信仰的象征，以开放的大门和心怀敬意的态度欢迎罗摩神的信众。' },
      ta: { type: String, default: 'கௌஷாலாவின் இதயத்தில் அமைந்துள்ள ஸ்ரீ ராமச்சந்திர கோயில், தலைமுறை தலைமுறையாக பக்தியின் ஒளிவிளக்காக நின்று, ராமர் பக்தர்களை திறந்த மனதுடன் வரவேற்கிறது.' },
    },
    // About Preview Images
    images: {
      type: [{
        id: { type: String },
        src: { type: String },
        alt: {
          en: { type: String, default: '' },
          ne: { type: String, default: '' },
          hi: { type: String, default: '' },
          zh: { type: String, default: '' },
          ta: { type: String, default: '' },
        },
        order: { type: Number, default: 0 },
        enabled: { type: Boolean, default: true },
      }],
      default: [],
    },
  },
  
  // ============================================
  // LOGO SETTINGS (Multi-language with full customization)
  // ============================================
  logo: {
    photo: { type: String, default: null },
    text: {
      en: { type: String, default: 'Shree Ramchandra' },
      ne: { type: String, default: 'श्री रामचन्द्र' },
      hi: { type: String, default: 'श्री रामचन्द्र' },
      zh: { type: String, default: '室利罗摩钱德拉' },
      ta: { type: String, default: 'ஸ்ரீ ராமச்சந்திர' },
    },
    // Logo customization fields
    size: { type: String, default: 'w-14 h-14' },
    shape: { type: String, default: 'rounded-xl' },
    bgColor: { type: String, default: 'from-vermilion to-maroon-deep' },
    showText: { type: Boolean, default: true },
    textColor: { type: String, default: 'text-maroon' },
    textSize: { type: String, default: 'text-base md:text-xl' },
    fontWeight: { type: String, default: 'font-bold' },
    showLocation: { type: Boolean, default: true },
    width: { type: String, default: 'w-auto' },
  },
  
  // Donation Settings
  donate: {
    qrPhoto: { type: String, default: null },
    baseCount: { type: Number, default: 1248 },
    bankNumber: { type: String, default: 'eSewa / COD — 98XXXXXXXX' },
    bankName: { type: String, default: 'Nepal Investment Bank' },
    accountHolder: { type: String, default: 'Temple Trust Fund' },
  },
  
  // Gallery Images (for homepage)
  galleryImages: {
    type: [{
      id: { type: String },
      src: { type: String },
      alt: {
        en: { type: String, default: '' },
        ne: { type: String, default: '' },
        hi: { type: String, default: '' },
        zh: { type: String, default: '' },
        ta: { type: String, default: '' },
      },
      order: { type: Number, default: 0 },
      enabled: { type: Boolean, default: true },
    }],
    default: [],
  },
  
  // YouTube Live Video
  liveVideo: {
    enabled: { type: Boolean, default: true },
    url: { type: String, default: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf&autoplay=1&mute=1' },
    title: {
      en: { type: String, default: 'Live Darshan' },
      ne: { type: String, default: 'लाइभ दर्शन' },
      hi: { type: String, default: 'लाइव दर्शन' },
      zh: { type: String, default: '现场朝拜' },
      ta: { type: String, default: 'நேரடி தரிசனம்' },
    },
    description: {
      en: { type: String, default: 'Experience the divine presence of Lord Ram from anywhere in the world' },
      ne: { type: String, default: 'संसारको कुनै पनि स्थानबाट भगवान रामको दिव्य उपस्थिति अनुभव गर्नुहोस्' },
      hi: { type: String, default: 'दुनिया में कहीं से भी भगवान राम की दिव्य उपस्थिति का अनुभव करें' },
      zh: { type: String, default: '从世界任何地方体验罗摩神的神圣存在' },
      ta: { type: String, default: 'உலகில் எங்கிருந்தும் ராமரின் தெய்வீக இருப்பை அனுபவியுங்கள்' },
    },
  },
  
  // Notice Modal Settings
  notice: {
    enabled: { type: Boolean, default: true },
    title: { 
      en: { type: String, default: 'Heartfelt Request' },
      ne: { type: String, default: 'हार्दिक अनुरोध' },
      hi: { type: String, default: 'हार्दिक अनुरोध' },
      zh: { type: String, default: '诚挚请求' },
      ta: { type: String, default: 'மனமார்ந்த வேண்டுகோள்' },
    },
    banner: { 
      en: { type: String, default: "Let's participate in installing the 'Lift'." },
      ne: { type: String, default: "'लिफ्ट' राख्ने कार्यमा सहभागी बनौं ।" },
      hi: { type: String, default: "'लिफ्ट' रखने कार्य में सहभागी बनें ।" },
      zh: { type: String, default: "让我们参与安装'电梯'。" },
      ta: { type: String, default: "'லிஃப்ட்' அமைப்பதில் பங்கேற்போம்." },
    },
    body: {
      en: { type: String, default: 'To make it easier for the elderly and differently-abled to visit and move around at the Shree Ramchandra Temple, we are installing a lift on the eastern side of the temple that can accommodate up to 8 people. The work is expected to be completed within 6 months.' },
      ne: { type: String, default: 'भगवान् श्रीरामचन्द्रको मन्दिरमा वृद्ध-वृद्धा एवं विकलाङ्गहरूलाई दर्शन एवं आउ-जाउ गर्न सजिलो होस् भनी मन्दिरको ठिक पूर्वपट्टि ८ जनासम्म अटाउने लिफ्टको स्थापना ६ महीनाभित्र सक्ने गरी कार्य अगाडि बढिरहेको सन्दर्भमा यहाँहरूको सहयोगको अपेक्षासाथ यो सूचना जनसमक्ष जारी गरिएको छ ।' },
      hi: { type: String, default: 'श्रीरामचन्द्र मंदिर में बुजुर्गों और दिव्यांगों को दर्शन और आने-जाने में सुविधा हो, इसके लिए मंदिर के ठीक पूर्व की ओर 8 लोगों तक की क्षमता वाली लिफ्ट स्थापित की जा रही है, जो 6 महीने के भीतर पूरी हो जाएगी।' },
      zh: { type: String, default: '为了方便老年人和残障人士在室利罗摩钱德拉神庙参观和活动，我们正在神庙东侧安装一部可容纳8人的电梯，预计在6个月内完工。' },
      ta: { type: String, default: 'ஸ்ரீ ராமச்சந்திர கோயிலில் முதியவர்கள் மற்றும் ஊனமுற்றோர் எளிதில் வந்து செல்லும் வகையில், கோயிலின் கிழக்குப் பக்கத்தில் 8 பேர் பயணிக்கும் வகையில் உள்ள லிஃப்ட் அமைக்கும் பணி 6 மாதங்களில் முடிக்க திட்டமிடப்பட்டுள்ளது.' },
    },
    cost: {
      en: { type: String, default: 'The estimated cost for the lift structure is approximately Rs. 55,00,000/- (Fifty-five lakh).' },
      ne: { type: String, default: 'लिफ्टसहितको संरचनाको लागि करिब रु. ५५,००,०००/- (पचपन्न लाख) पर्ने अनुमान गरिएको छ ।' },
      hi: { type: String, default: 'लिफ्ट सहित की संरचना के लिए लगभग रु. ५५,००,०००/- (पचपन्न लाख) खर्च होने का अनुमान है।' },
      zh: { type: String, default: '电梯结构的估计成本约为550万卢比。' },
      ta: { type: String, default: 'லிஃப்ட் கட்டமைப்பிற்கான மதிப்பீடு ரூ. 55,00,000/- (ஐம்பத்தி ஐந்து லட்சம்) ஆகும்.' },
    },
    donors: {
      en: { type: String, default: 'The names of generous donors contributing Rs. 15,000/- (Fifteen thousand) and above will be prominently engraved on a stone plaque on the left side of the lift entrance.' },
      ne: { type: String, default: 'यस कार्यमा रु. १५,०००/- (पन्ध्र हजार) देखि माथि सहयोग गर्ने उदारमना दाताहरूको नाम लिफ्टको प्रवेशद्वारको वायाँपट्टि आकर्षक रूपले शिलापत्रमा उत्कीर्ण गरी राखिने जानकारी गराउँदछौं ।' },
      hi: { type: String, default: 'इस कार्य में रु. १५,०००/- (पंद्रह हजार) से अधिक सहयोग करने वाले उदार दाताओं के नाम लिफ्ट के प्रवेश द्वार के बाईं ओर आकर्षक रूप से शिलापत्र पर उत्कीर्ण किए जाएंगे।' },
      zh: { type: String, default: '捐赠15,000卢比及以上的慷慨捐助者姓名将刻在电梯入口左侧的石碑上。' },
      ta: { type: String, default: 'ரூ. 15,000/- (பதினைந்து ஆயிரம்) மற்றும் அதற்கு மேல் நன்கொடை அளிக்கும் தாராள மனம் கொண்ட தானியர்களின் பெயர்கள் லிஃப்ட் நுழைவாயிலின் இடது பக்கத்தில் கல்வெட்டில் பொறிக்கப்படும்.' },
    },
    applicant: {
      en: { type: String, default: 'Applicant' },
      ne: { type: String, default: 'प्रार्थी' },
      hi: { type: String, default: 'प्रार्थी' },
      zh: { type: String, default: '申请人' },
      ta: { type: String, default: 'விண்ணப்பதாரர்' },
    },
    committee: {
      en: { type: String, default: 'Shree Ramchandra Temple Renovation & Development Committee' },
      ne: { type: String, default: 'श्रीरामचन्द्रमन्दिर जीर्णोद्धार एवं संवर्द्धन समिति' },
      hi: { type: String, default: 'श्रीरामचन्द्र मंदिर जीर्णोद्धार एवं संवर्द्धन समिति' },
      zh: { type: String, default: '室利罗摩钱德拉神庙修缮与发展委员会' },
      ta: { type: String, default: 'ஸ்ரீ ராமச்சந்திர கோயில் புனரமைப்பு மற்றும் மேம்பாட்டுக் குழு' },
    },
    location: {
      en: { type: String, default: 'Battisputali, Kathmandu, Nepal' },
      ne: { type: String, default: 'बत्तीसपुतली, काठमाडौं, नेपाल' },
      hi: { type: String, default: 'बत्तीसपुतली, काठमाडौं, नेपाल' },
      zh: { type: String, default: '尼泊尔加德满都巴提斯普塔利' },
      ta: { type: String, default: 'பட்டீஸ்புதாலி, காத்மாண்டு, நேபாளம்' },
    },
    contactNo: {
      en: { type: String, default: 'Contact No.' },
      ne: { type: String, default: 'सम्पर्क नं.' },
      hi: { type: String, default: 'सम्पर्क नं.' },
      zh: { type: String, default: '联系电话' },
      ta: { type: String, default: 'தொடர்பு எண்' },
    },
    contactDetails: {
      en: { type: String, default: '01-4598526, 9851154432' },
      ne: { type: String, default: '01-4598526, 9851154432' },
      hi: { type: String, default: '01-4598526, 9851154432' },
      zh: { type: String, default: '01-4598526, 9851154432' },
      ta: { type: String, default: '01-4598526, 9851154432' },
    },
    qrLabel: {
      en: { type: String, default: 'QR Code' },
      ne: { type: String, default: 'क्यू आर कोड' },
      hi: { type: String, default: 'क्यू आर कोड' },
      zh: { type: String, default: '二维码' },
      ta: { type: String, default: 'கியூ ஆர் குறியீடு' },
    },
    donateBtn: {
      en: { type: String, default: 'Donate Now' },
      ne: { type: String, default: 'सहयोग गर्नुहोस्' },
      hi: { type: String, default: 'सहयोग करें' },
      zh: { type: String, default: '立即捐赠' },
      ta: { type: String, default: 'தானம் செய்யுங்கள்' },
    },
  },
  
  // ============================================
  // BOOKING MANAGEMENT SETTINGS
  // ============================================
  
  // Puja Types - Customizable list
  pujaTypes: {
    type: [String],
    default: ['Ram Puja', 'Satyanarayan Puja', 'Griha Pravesh Puja', 'Birthday Puja', 'General Darshan Booking'],
  },
  
  // Date-wise booking limits
  dateLimits: {
    type: Map,
    of: Number,
    default: {},
    description: 'Date limits for bookings (date string -> max bookings)',
  },
  
  // Booking availability toggle
  bookingAvailable: {
    type: Boolean,
    default: true,
  },
  
  // Message shown when booking is unavailable
  availabilityMessage: {
    type: String,
    default: 'Bookings are currently unavailable. Please check back later.',
  },
  
  // Booking stats for frontend display
  bookingStats: {
    pujaTypes: { type: Number, default: 5 },
    secureBooking: { type: String, default: '100%' },
    support: { type: String, default: '24/7' },
  },
  
  // Booking Background Photo (for the 50% image on booking page)
  bookingBgPhoto: {
    type: String,
    default: '/4.jpg',
  },
  
  // ============================================
  // FOOTER SETTINGS
  // ============================================
  
  footer: {
    enabled: { type: Boolean, default: true },
    bgType: { type: String, enum: ['color', 'image', 'video'], default: 'color' },
    bgColor: { type: String, default: '#f8f5f0' },
    bgImage: { type: String, default: null },
    bgVideo: { type: String, default: null },
    logoShape: { type: String, enum: ['circle', 'square', 'rectangle'], default: 'circle' },
    logoSize: { type: String, enum: ['sm', 'md', 'lg'], default: 'md' },
    showSocial: { type: Boolean, default: true },
    showQuickLinks: { type: Boolean, default: true },
    showContact: { type: Boolean, default: true },
    showSupport: { type: Boolean, default: true },
    showMap: { type: Boolean, default: true },
    showMadeBy: { type: Boolean, default: true },
    mapUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.245849736379!2d85.3221176!3d27.7170489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190c9f5c8d7b%3A0x4f8b3f8b3f8b3f8b!2sGaushala%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000' },
    socialLinks: {
      facebook: { enabled: { type: Boolean, default: true }, url: { type: String, default: 'https://facebook.com' } },
      youtube: { enabled: { type: Boolean, default: true }, url: { type: String, default: 'https://youtube.com' } },
      instagram: { enabled: { type: Boolean, default: true }, url: { type: String, default: 'https://instagram.com' } },
      twitter: { enabled: { type: Boolean, default: true }, url: { type: String, default: 'https://twitter.com' } },
    },
    quickLinks: [{
      path: { type: String, default: '' },
      label: {
        en: { type: String, default: '' },
        ne: { type: String, default: '' },
        hi: { type: String, default: '' },
        zh: { type: String, default: '' },
        ta: { type: String, default: '' },
      }
    }],
    contactInfo: {
      phone: { type: String, default: '+977-1-4XXXXXX' },
      email: { type: String, default: 'info@ramchandratemple.org.np' },
      address: {
        en: { type: String, default: 'Battisputali, Gaushala, Kathmandu, Nepal' },
        ne: { type: String, default: 'बत्तिसपुतली, गौशाला, काठमाडौं, नेपाल' },
        hi: { type: String, default: 'बत्तीसपुतली, गौशाला, काठमाडौं, नेपाल' },
        zh: { type: String, default: '尼泊尔加德满都巴提斯普塔利' },
        ta: { type: String, default: 'பட்டீஸ்புதாலி, கௌஷாலா, காத்மாண்டு, நேபாளம்' },
      }
    },
    footerText: {
      rights: {
        en: { type: String, default: 'All rights reserved.' },
        ne: { type: String, default: 'सबै अधिकार सुरक्षित।' },
        hi: { type: String, default: 'सभी अधिकार सुरक्षित।' },
        zh: { type: String, default: '版权所有。' },
        ta: { type: String, default: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' },
      },
      blessing: {
        en: { type: String, default: 'Jai Shree Ram' },
        ne: { type: String, default: 'जय श्री राम' },
        hi: { type: String, default: 'जय श्री राम' },
        zh: { type: String, default: '斋·什里·拉姆' },
        ta: { type: String, default: 'ஜெய் ஸ்ரீ ராம்' },
      }
    },
    madeBy: {
      text: {
        en: { type: String, default: 'Made by ZeroInfinity Technology' },
        ne: { type: String, default: 'जिरोइन्फिनिटी टेक्नोलोजीद्वारा निर्मित' },
        hi: { type: String, default: 'जीरोइन्फिनिटी टेक्नोलोजी द्वारा निर्मित' },
        zh: { type: String, default: '由零无限科技制作' },
        ta: { type: String, default: 'ஜீரோஇன்ஃபினிட்டி டெக்னாலஜி மூலம் உருவாக்கப்பட்டது' },
      },
      url: { type: String, default: 'https://www.zeroinfinitytechnologies.com/' },
      logo: { type: String, default: 'https://zeroinfinitytechnologies.com/images/logo-1771865164119.webp?t=1784551924378' },
    },
  },
  
  // ============================================
  // TIMESTAMP
  // ============================================
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ============================================
// STATIC METHODS
// ============================================

// Ensure only one settings document exists
adminSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// ============================================
// PRE-SAVE MIDDLEWARE
// ============================================

// Update timestamp on save
adminSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);