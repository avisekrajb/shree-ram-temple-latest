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
  
  // Daily Quotes (Multi-language)
  quotes: {
    en: { type: String, default: 'Where there is righteousness in the heart, there is beauty in the character.' },
    ne: { type: String, default: 'जहाँ हृदयमा धार्मिकता हुन्छ, त्यहाँ चरित्रमा सुन्दरता हुन्छ।' },
    hi: { type: String, default: 'जहाँ हृदय में धार्मिकता है, वहाँ चरित्र में सुंदरता है।' },
    zh: { type: String, default: '心中有正义，性格便有美。' },
    ta: { type: String, default: 'இதயத்தில் நேர்மை இருந்தால், குணத்தில் அழகு இருக்கும்.' },
  },
  
  // Temple Timings
  timings: {
    open: { type: String, default: '05:00 AM' },
    close: { type: String, default: '08:00 PM' },
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
  },
  
  // Logo Settings (Multi-language)
  logo: {
    photo: { type: String, default: null },
    text: {
      en: { type: String, default: 'Shree Ramchandra' },
      ne: { type: String, default: 'श्री रामचन्द्र' },
      hi: { type: String, default: 'श्री रामचन्द्र' },
      zh: { type: String, default: '室利罗摩钱德拉' },
      ta: { type: String, default: 'ஸ்ரீ ராமச்சந்திர' },
    },
  },
  
  // Donation Settings
  donate: {
    qrPhoto: { type: String, default: null },
    baseCount: { type: Number, default: 1248 },
    bankNumber: { type: String, default: 'eSewa / COD — 98XXXXXXXX' },
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
  
  // Timestamp
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure only one settings document exists
adminSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Update timestamp on save
adminSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);