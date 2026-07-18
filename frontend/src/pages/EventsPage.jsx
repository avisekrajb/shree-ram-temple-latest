// import React, { useState, useEffect } from 'react';
// import { useLanguage } from '../context/LanguageContext';
// import api from '../services/api';
// import PageHero from '../components/common/PageHero';
// import { CalendarClock, Flower2 } from 'lucide-react';

// const EventsPage = () => {
//   const { t, lang } = useLanguage();
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await api.get('/events');
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="w-8 h-8 border-3 border-maroon rounded-full animate-spin border-t-transparent" />
//       </div>
//     );
//   }

//   const upcoming = events.filter(e => e.upcoming).sort((a, b) => new Date(a.date) - new Date(b.date));
//   const past = events.filter(e => !e.upcoming).sort((a, b) => new Date(b.date) - new Date(a.date));

//   const EventCard = ({ event }) => {
//     const dt = new Date(event.date);
//     const day = dt.getDate();
//     const month = dt.toLocaleString('en-US', { month: 'short' });

//     return (
//       <div className="bg-white rounded-rt overflow-hidden shadow-rt border border-line">
//         <div className="relative aspect-[16/10] bg-maroon">
//           {event.photo ? (
//             <img src={event.photo} alt={event.title?.en} className="w-full h-full object-cover" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-white/50 bg-gradient-to-br from-vermilion to-maroon-deep">
//               <CalendarClock size={26} />
//             </div>
//           )}
//           <div className="absolute top-2.5 left-2.5 bg-white rounded-lg px-3 py-1.5 text-center shadow-md">
//             <span className="block font-extrabold text-base text-maroon">{day}</span>
//             <small className="text-[10px] uppercase text-ink-soft">{month}</small>
//           </div>
//         </div>
//         <div className="p-4">
//           <h4 className="text-base font-serif font-semibold">{event.title?.[lang] || event.title?.en}</h4>
//           <p className="text-xs text-ink-soft mt-1">{event.desc?.[lang] || event.desc?.en}</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <main>
//       <PageHero title={t.eventsTitle} sub={t.historyIntro} />

//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="text-center max-w-lg mx-auto mb-8 flex flex-col items-center gap-2">
//           <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-vermilion">
//             <Flower2 size={13} /> {t.upcomingEvents}
//           </span>
//           <h2 className="text-2xl md:text-3xl font-serif">{t.upcomingEvents}</h2>
//         </div>
//         {upcoming.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {upcoming.map(event => <EventCard key={event._id} event={event} />)}
//           </div>
//         ) : (
//           <p className="text-center text-ink-soft">{t.noEventsUpcoming}</p>
//         )}
//       </section>

//       <section className="max-w-7xl mx-auto px-6 pb-16">
//         <div className="text-center max-w-lg mx-auto mb-8 flex flex-col items-center gap-2">
//           <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft">
//             <CalendarClock size={13} /> {t.pastEvents}
//           </span>
//           <h2 className="text-2xl md:text-3xl font-serif">{t.pastEvents}</h2>
//         </div>
//         {past.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {past.map(event => <EventCard key={event._id} event={event} />)}
//           </div>
//         ) : (
//           <p className="text-center text-ink-soft">{t.noEventsPast}</p>
//         )}
//       </section>
//     </main>
//   );
// };

// export default EventsPage;
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

// Local images from public folder
const eventImage1 = '/1.jpg';
const eventImage2 = '/2.jpg';
const eventImage3 = '/3.jpg';
const eventImage4 = '/4.jpg';
const eventImage5 = '/6.jpg';

// Daily Aarti timings
const dailyKeys = [
  { key: "mangala", time: { en: "4:30 AM", ne: "४:३० बिहान", hi: "४:३० सुबह" } },
  { key: "bhog", time: { en: "9:00 AM", ne: "९:०० बिहान", hi: "९:०० सुबह" } },
  { key: "madhyahna", time: { en: "12:30 PM", ne: "१२:३० दिउँसो", hi: "१२:३० दोपहर" } },
  { key: "sandhya", time: { en: "6:30 PM", ne: "६:३० साँझ", hi: "६:३० शाम" } },
  { key: "shayan", time: { en: "8:00 PM", ne: "८:०० राति", hi: "८:०० रात" } },
];

// Hardcoded events data
const events = [
  {
    id: 'ram_navami',
    title: { 
      en: 'Ram Navami Mahotsav', 
      ne: 'राम नवमी महोत्सव', 
      hi: 'राम नवमी महोत्सव',
      zh: '罗摩诞辰大典',
      ta: 'ராம் நவமி மகோத்சவ்'
    },
    desc: { 
      en: 'Mangala Aarti at 4:30 AM, Abhishek, Akhand Ramayan Path, evening bhajan and bhandara.', 
      ne: 'प्रातः ४:३० को मङ्गलाआरती, अभिषेक, अखण्ड रामायण पाठ, साँझको भजन र भण्डारा।', 
      hi: 'प्रातः ४:३० की मंगल आरती, अभिषेक, अखण्ड रामायण पाठ, शाम का भजन और भंडारा।',
      zh: '凌晨4:30的晨间祈祷、沐浴仪式、不间断的罗摩衍那诵经、晚间颂歌和圣餐。',
      ta: 'அதிகாலை 4:30 மணிக்கு மங்கள ஆரத்தி, அபிஷேகம், அகண்ட ராமாயண பாராயணம், மாலை பஜனை மற்றும் பண்டாரா.'
    },
    image: eventImage1,
    date: { 
      en: 'Chaitra Shukla Navami', 
      ne: 'चैत्र शुक्ल नवमी', 
      hi: 'चैत्र शुक्ल नवमी',
      zh: 'Chaitra Shukla Navami',
      ta: 'சைத்ர சுக்ல நவமி'
    },
    greg: { 
      en: 'April 2026', 
      ne: 'अप्रिल २०२६', 
      hi: 'अप्रैल २०२६',
      zh: '2026年4月',
      ta: 'ஏப்ரல் 2026'
    }
  },
  {
    id: 'janai_purnima',
    title: { 
      en: 'Janai Purnima', 
      ne: 'जनै पूर्णिमा', 
      hi: 'जनै पूर्णिमा',
      zh: '圣线满月节',
      ta: 'ஜனை பூர்ணிமா'
    },
    desc: { 
      en: 'Sacred thread changing ceremony and Rakshabandhan.', 
      ne: 'पवित्र धागो बदल्ने समारोह र राक्षाबन्धन।', 
      hi: 'पवित्र धागा बदलने का समारोह और रक्षाबंधन।',
      zh: '圣线更换仪式和兄弟姊妹节。',
      ta: 'புனித நூல் மாற்றும் விழா மற்றும் ரக்ஷாபந்தன்.'
    },
    image: eventImage2,
    date: { 
      en: 'Shrawan Purnima', 
      ne: 'श्रावण पूर्णिमा', 
      hi: 'श्रावण पूर्णिमा',
      zh: 'Shrawan Purnima',
      ta: 'ஸ்ராவண பூர்ணிமா'
    },
    greg: { 
      en: 'August 19, 2026', 
      ne: 'अगस्ट १९, २०२६', 
      hi: 'अगस्त १९, २०२६',
      zh: '2026年8月19日',
      ta: 'ஆகஸ்ட் 19, 2026'
    }
  },
  {
    id: 'sita_jayanti',
    title: { 
      en: 'Sita Jayanti', 
      ne: 'सीता जयन्ती', 
      hi: 'सीता जयन्ती',
      zh: '悉多诞辰',
      ta: 'சீதா ஜெயந்தி'
    },
    desc: { 
      en: 'Celebration of Goddess Sita\'s birth with special rituals and devotional programs.', 
      ne: 'देवी सीताको जन्मोत्सव विशेष अनुष्ठान र भक्ति कार्यक्रमहरूको साथ मनाइन्छ।', 
      hi: 'देवी सीता के जन्म का उत्सव विशेष अनुष्ठान और भक्ति कार्यक्रमों के साथ मनाया जाता है।',
      zh: '以特别仪式和虔诚节目庆祝悉多女神的诞辰。',
      ta: 'சீதை தேவியின் பிறந்த நாளை சிறப்பு சடங்குகள் மற்றும் பக்தி நிகழ்ச்சிகளுடன் கொண்டாடப்படுகிறது.'
    },
    image: eventImage3,
    date: { 
      en: 'Vaishakh Shukla Navami', 
      ne: 'वैशाख शुक्ल नवमी', 
      hi: 'वैशाख शुक्ल नवमी',
      zh: 'Vaishakh Shukla Navami',
      ta: 'வைசாக சுக்ல நவமி'
    },
    greg: { 
      en: 'May 2026', 
      ne: 'मई २०२६', 
      hi: 'मई २०२६',
      zh: '2026年5月',
      ta: 'மே 2026'
    }
  },
  {
    id: 'vivah_panchami',
    title: { 
      en: 'Vivah Panchami', 
      ne: 'विवाह पञ्चमी', 
      hi: 'विवाह पञ्चमी',
      zh: '婚礼庆典',
      ta: 'விவாஹ பஞ்சமி'
    },
    desc: { 
      en: 'Celebration of the divine marriage of Lord Ram and Goddess Sita with grand ceremonies.', 
      ne: 'भगवान राम र देवी सीताको दिव्य विवाहको भव्य समारोहको साथ मनाइन्छ।', 
      hi: 'भगवान राम और देवी सीता के दिव्य विवाह का भव्य समारोह के साथ मनाया जाता है।',
      zh: '以盛大仪式庆祝罗摩神和悉多女神的圣婚。',
      ta: 'ராமர் மற்றும் சீதை தேவியின் தெய்வீக திருமணத்தை பிரம்மாண்டமான விழாக்களுடன் கொண்டாடப்படுகிறது.'
    },
    image: eventImage4,
    date: { 
      en: 'Margashirsha Shukla Panchami', 
      ne: 'मार्गशीर्ष शुक्ल पञ्चमी', 
      hi: 'मार्गशीर्ष शुक्ल पञ्चमी',
      zh: 'Margashirsha Shukla Panchami',
      ta: 'மார்கஷீர்ஷ சுக்ல பஞ்சமி'
    },
    greg: { 
      en: 'December 2026', 
      ne: 'डिसेम्बर २०२६', 
      hi: 'दिसम्बर २०२६',
      zh: '2026年12月',
      ta: 'டிசம்பர் 2026'
    }
  },
  {
    id: 'hanuman_jayanti',
    title: { 
      en: 'Hanuman Jayanti', 
      ne: 'हनुमान जयन्ती', 
      hi: 'हनुमान जयन्ती',
      zh: '哈努曼诞辰',
      ta: 'ஹனுமான் ஜெயந்தி'
    },
    desc: { 
      en: 'Celebration of Lord Hanuman\'s birth with special pujas, chanting, and devotional singing.', 
      ne: 'भगवान हनुमानको जन्मोत्सव विशेष पूजा, जप र भक्ति गायनको साथ मनाइन्छ।', 
      hi: 'भगवान हनुमान के जन्म का उत्सव विशेष पूजा, जप और भक्ति गायन के साथ मनाया जाता है।',
      zh: '以特别祈祷、念诵和虔诚歌唱庆祝哈努曼神的诞辰。',
      ta: 'ஹனுமான் பிறந்த நாளை சிறப்பு பூஜைகள், ஜபம் மற்றும் பக்தி பாடல்களுடன் கொண்டாடப்படுகிறது.'
    },
    image: eventImage5,
    date: { 
      en: 'Chaitra Purnima', 
      ne: 'चैत्र पूर्णिमा', 
      hi: 'चैत्र पूर्णिमा',
      zh: 'Chaitra Purnima',
      ta: 'சைத்ர பூர்ணிமா'
    },
    greg: { 
      en: 'April 2026', 
      ne: 'अप्रिल २०२६', 
      hi: 'अप्रैल २०२६',
      zh: '2026年4月',
      ta: 'ஏப்ரல் 2026'
    }
  }
];

// Helper to get text in current language
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

const EventsPage = () => {
  const { t, lang } = useLanguage();

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
          style={{ color: "#7A0000" }}
        >
          {t.eventsTitle || 'Temple Events'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-base sm:text-lg text-mute max-w-xl mx-auto leading-relaxed"
        >
          {t.eventsSubtitle || 'Stay connected with the spiritual calendar of Shree Ramchandra Temple'}
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {/* Upcoming Events */}
        <div className="mb-14">
          <h2 
            className="font-serif text-2xl sm:text-3xl mb-8"
            style={{ color: "#7A0000" }}
          >
            {t.upcomingEvents || 'Upcoming Events'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((e, i) => {
              const titleText = getLocalizedText(e.title, lang);
              const descText = getLocalizedText(e.desc, lang);
              const dateText = getLocalizedText(e.date, lang);
              const gregText = getLocalizedText(e.greg, lang);

              return (
                <motion.div
                  key={e.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={e.image || eventImage1}
                      alt={titleText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.src = eventImage1;
                      }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)" }}
                    />
                    <div className="absolute top-4 right-4 bg-red-900 text-white px-3.5 py-1.5 text-xs font-display rounded-md pointer-events-none shadow-md">
                      {gregText || 'Coming Soon'}
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-white/90 text-xs uppercase drop-shadow tracking-widest">
                        {dateText || ''}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-7">
                    <h3 className="text-ink font-serif text-xl sm:text-2xl mb-3 group-hover:text-red-900 transition-colors">
                      {titleText || 'Event'}
                    </h3>
                    <p className="text-sm sm:text-base text-mute leading-relaxed line-clamp-3">
                      {descText || ''}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Daily Aarti & Temple Info */}
        <div className="pt-10">
          <h2 
            className="font-serif text-2xl sm:text-3xl mb-8"
            style={{ color: "#7A0000" }}
          >
            {t.dailyTitle || 'Daily Aarti & Temple Information'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Daily Aarti Timings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8"
            >
              <h3 
                className="font-serif text-lg sm:text-xl mb-6"
                style={{ color: "#7A0000" }}
              >
                {t.dailyTimings || 'दैनिक आरती तालिका'}
              </h3>
              <div className="space-y-0">
                {dailyKeys.map((d, i) => {
                  const timeValue = d.time[lang] || d.time.en;
                  const aartiName = t[`aarti_${d.key}`] || d.key;
                  return (
                    <div
                      key={d.key}
                      className={`flex justify-between items-center py-4 ${i < dailyKeys.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <span className="text-ink text-sm sm:text-base font-medium">
                        {aartiName}
                      </span>
                      <span className="text-mute font-serif text-sm sm:text-base">
                        {timeValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Temple Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8"
            >
              <h3 
                className="font-serif text-lg sm:text-xl mb-6"
                style={{ color: "#7A0000" }}
              >
                {t.templeInfo || 'मन्दिर जानकारी'}
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-mute uppercase tracking-wider mb-1">
                    {t.openingHours || 'खुल्ने समय'}
                  </p>
                  <p className="text-ink text-sm sm:text-base">
                    {t.openingValue || 'बिहान ४:३० – साँझ ८:३० दैनिक'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-mute uppercase tracking-wider mb-1">
                    {t.locationLabel || 'स्थान'}
                  </p>
                  <p className="text-ink text-sm sm:text-base">
                    {t.locationValue || 'बत्तिसपुतली, गौशाला, काठमाडौँ, नेपाल'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-mute uppercase tracking-wider mb-1">
                    {t.specialAartis || 'विशेष आरती'}
                  </p>
                  <p className="text-ink text-sm sm:text-base">
                    {t.specialValue || 'सूर्योदय र साँझ ६:३०'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;