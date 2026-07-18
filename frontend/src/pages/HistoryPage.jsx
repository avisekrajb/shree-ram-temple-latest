import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TempleIcon from '../components/common/TempleIcon';
import {
  Clock,
  MapPin,
  Users,
  Award,
  Sparkles,
  ScrollText,
  Building,
  Heart,
  Crown
} from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Local images from public folder
const heroImage = '/1.jpg';
const founderImage = '/2.jpg';
const timelineImage1 = '/3.jpg';
const timelineImage2 = '/4.jpg';
const timelineImage3 = '/1.jpg';
const timelineImage4 = '/6.jpg';

const HistoryPage = () => {
  const { t, lang } = useLanguage();
  const timelineRef = useRef(null);

  useEffect(() => {
    // GSAP animations for timeline cards
    const items = document.querySelectorAll('.timeline-card');
    
    items.forEach((item) => {
      const imageEl = item.querySelector('.card-image');
      const contentEl = item.querySelector('.card-content');
      
      if (imageEl) {
        gsap.fromTo(
          imageEl,
          { opacity: 0, scale: 0.95, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.8,
            }
          }
        );
      }
      
      if (contentEl) {
        gsap.fromTo(
          contentEl,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: item,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 0.6,
            }
          }
        );
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Timeline data with translations
  const timelineItems = [
    {
      id: 't1',
      title: t.history?.t1?.title || 'Ancient Era',
      body: t.history?.t1?.body || 'Local legend holds that sages performed penance to Lord Ram on these banks of the Bagmati, marking the site as sacred ground for centuries to come.',
      image: timelineImage1,
      icon: <Crown className="text-marigold" size={24} />
    },
    {
      id: 't2',
      title: t.history?.t2?.title || 'The Founding',
      body: t.history?.t2?.body || 'A modest shrine was raised by the community of Gaushala to formally honour Lord Ram, Sita, and Lakshman. This marked the beginning of a tradition that would span generations.',
      image: timelineImage2,
      icon: <Building className="text-marigold" size={24} />
    },
    {
      id: 't3',
      title: t.history?.t3?.title || 'Expansion & Growth',
      body: t.history?.t3?.body || 'As devotion grew, the temple was expanded with a proper sanctum, courtyard, and space for community gatherings. The temple became a cornerstone of spiritual life.',
      image: timelineImage3,
      icon: <Sparkles className="text-marigold" size={24} />
    },
    {
      id: 't4',
      title: t.history?.t4?.title || 'Present Day',
      body: t.history?.t4?.body || 'Today the temple stands renovated and welcoming, hosting daily aarti, festivals, and community seva throughout the year. A living legacy of faith and service.',
      image: timelineImage4,
      icon: <Heart className="text-marigold" size={24} />
    },
  ];

  return (
    <div 
      className="w-full overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 30%, #ffffff 70%, #faf8f5 100%)' 
      }}
    >
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center text-white px-6 max-w-4xl"
        >
          <TempleIcon size={56} className="mx-auto text-marigold mb-4" />
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light mb-4 text-white leading-tight">
            {t.historyTitle || 'Our History'}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t.historyIntro || 'A journey of faith, community, and unbroken tradition spanning generations.'}
          </p>
        </motion.div>
      </div>

      {/* Founder Section */}
      <div className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center mb-16"
          >
            <motion.div
              className="rounded-xl overflow-hidden shadow-2xl"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={founderImage} 
                alt="Founder" 
                loading="lazy" 
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = heroImage;
                }}
              />
            </motion.div>

            <div className="flex flex-col justify-center space-y-5">
              <div>
                <p className="text-sm text-ink-soft mb-2 flex items-center gap-2">
                  <Users size={16} className="text-vermilion" />
                  {t.founder?.name || 'Pandit Ram Prasad Acharya'}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl mb-2 text-maroon">
                  {t.founder?.title || 'The Visionary Founder'}
                </h2>
                <p className="text-xs text-ink-soft">
                  {t.founder?.subtitle || 'Head Priest & Spiritual Leader'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Founder Paragraphs */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((n) => (
              <motion.p
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: n * 0.08 }}
                className="text-ink-soft leading-relaxed text-base sm:text-lg"
              >
                {t.founder?.[`para${n}`] || `The temple's rich history is woven with stories of devotion, community service, and unwavering faith. Generation after generation, this sacred place has been a beacon of hope and spiritual solace for countless devotees.`}
              </motion.p>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 pt-10 border-t border-gray-200"
          >
            <blockquote className="text-ink italic text-lg sm:text-xl leading-relaxed max-w-3xl font-serif">
              "{t.founder?.quote || 'Where there is righteousness in the heart, there is beauty in the character. Where there is beauty in the character, there is harmony in the home.'}"
            </blockquote>
            <p className="mt-4 text-sm text-ink-soft">— {t.founder?.name || 'Pandit Ram Prasad Acharya'}</p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-24 px-4 sm:px-6" ref={timelineRef}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-vermilion bg-vermilion/10 px-4 py-1.5 rounded-full">
              <ScrollText size={14} /> {t.historyTitle || 'Timeline'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mt-4 text-ink">
              {t.historySubtitle || 'The Temple Through the Ages'}
            </h2>
          </motion.div>

          <div className="space-y-24">
            {timelineItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                className={`timeline-card grid md:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  index % 2 !== 0 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <motion.div
                  className="card-image rounded-xl overflow-hidden shadow-2xl relative"
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    loading="lazy" 
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      e.target.src = heroImage;
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 rounded-full p-2 shadow-lg">
                    {item.icon}
                  </div>
                </motion.div>

                <div className="card-content flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-serif font-bold text-maroon/20">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="w-12 h-px bg-maroon/20" />
                    <Clock size={16} className="text-ink-soft" />
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-maroon">
                    {item.title}
                  </h2>
                  <p className="text-ink-soft leading-relaxed text-base sm:text-lg">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Heritage Section */}
      <div className="py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3 text-marigold">
            <Award size={32} />
            <Sparkles size={24} />
            <Award size={32} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-maroon">
            {t.history?.heritage?.title || 'A Living Heritage'}
          </h2>
          <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
            {t.history?.heritage?.body || 'Shree Ramchandra Temple stands as a testament to the enduring faith and devotion of the Nepali people. From its humble beginnings to its present grandeur, the temple continues to be a sanctuary of peace and spiritual fulfillment.'}
          </p>
          <div className="pt-6 flex items-center justify-center gap-6 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-maroon">100+</div>
              <div className="text-xs text-ink-soft">Years of Service</div>
            </div>
            <div className="w-px h-10 bg-gray-300 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-maroon">50K+</div>
              <div className="text-xs text-ink-soft">Devotees Served</div>
            </div>
            <div className="w-px h-10 bg-gray-300 hidden sm:block" />
            <div className="text-center">
              <div className="text-2xl font-serif font-bold text-maroon">365</div>
              <div className="text-xs text-ink-soft">Days of Aarti</div>
            </div>
          </div>
          <p className="text-lg font-serif font-semibold pt-4 text-maroon">
            {t.history?.heritage?.closing || 'Jai Shree Ram! 🙏'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;