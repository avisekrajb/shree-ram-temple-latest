import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TempleIcon from '../components/common/TempleIcon';
import api from '../services/api';
import {
  Clock,
  Users,
  Award,
  Sparkles,
  ScrollText,
  Building,
  Heart,
  Crown,
  Image as ImageIcon
} from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Default fallback images
const defaultHeroImage = '/1.jpg';
const defaultFounderImage = '/2.jpg';

// Helper to get localized text
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

// Animated Counter Component
const AnimatedCounter = ({ target, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            let start = 0;
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / 60));
            const interval = Math.floor(duration / 60);

            const timer = setInterval(() => {
              start += step;
              if (start >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(start);
              }
            }, interval);

            return () => clearInterval(timer);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [target]);

  return (
    <div ref={counterRef} className="text-center">
      <div className="text-2xl sm:text-3xl font-serif font-bold text-maroon">
        {count}{suffix}
      </div>
      <div className="text-xs text-ink-soft">{label}</div>
    </div>
  );
};

const HistoryPage = () => {
  const { t, lang } = useLanguage();
  const timelineRef = useRef(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [founderData, setFounderData] = useState(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchData = async () => {
      try {
        const [historyRes, settingsRes] = await Promise.all([
          api.get('/admin/history'),
          api.get('/admin/settings')
        ]);
        
        const historyItems = historyRes.data || [];
        const sorted = historyItems.sort((a, b) => (a.order || 0) - (b.order || 0));
        setHistoryData(sorted);
        
        const settings = settingsRes.data;
        setFounderData(settings?.founder || null);
      } catch (error) {
        console.error('Error fetching history data:', error);
        setHistoryData([
          {
            _id: '1',
            period: { en: 'Ancient Era', ne: 'प्राचीन युग' },
            title: { en: 'The Sacred Beginnings', ne: 'पवित्र सुरुवात' },
            desc: { en: 'Local legend holds that sages performed penance to Lord Ram on these banks of the Bagmati, marking the site as sacred ground for centuries to come.', ne: 'स्थानीय जनश्रुति अनुसार ऋषिहरूले बागमतीको यस किनारमा भगवान रामको तपस्या गरेका थिए, जसले यस स्थललाई पवित्र बनायो।' },
            year: 'Ancient',
            enabled: true,
            photo: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, historyData]);

  const enabledItems = historyData.filter(item => item.enabled !== false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-soft text-sm">Loading history...</p>
        </div>
      </div>
    );
  }

  const heroImage = defaultHeroImage;
  const founderImage = defaultFounderImage;

  return (
    <div 
      className="w-full overflow-hidden"
      style={{ 
        background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 30%, #ffffff 70%, #faf8f5 100%)' 
      }}
    >
      {/* Hero Section - Removed TempleIcon */}
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
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light mb-4 text-white leading-tight">
            {t.historyTitle || 'Our History'}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t.historyIntro || 'A journey of faith, community, and unbroken tradition spanning generations.'}
          </p>
        </motion.div>
      </div>

      {/* Founder Section */}
      {founderData && (
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
                  src={founderData.photo || founderImage} 
                  alt="Founder" 
                  loading="lazy" 
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src = founderImage;
                  }}
                />
              </motion.div>

              <div className="flex flex-col justify-center space-y-5">
                <div>
                  <p className="text-sm text-ink-soft mb-2 flex items-center gap-2">
                    {getLocalizedText(founderData.name, lang) || 'Pandit Ram Prasad Acharya'}
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl mb-2 text-maroon">
                    {getLocalizedText(founderData.title, lang) || 'The Visionary Founder'}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    {getLocalizedText(founderData.subtitle, lang) || 'Head Priest & Spiritual Leader'}
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
                  {getLocalizedText(founderData[`para${n}`], lang) || `The temple's rich history is woven with stories of devotion, community service, and unwavering faith. Generation after generation, this sacred place has been a beacon of hope and spiritual solace for countless devotees.`}
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
                "{getLocalizedText(founderData.quote, lang) || 'Where there is righteousness in the heart, there is beauty in the character. Where there is beauty in the character, there is harmony in the home.'}"
              </blockquote>
              <p className="mt-4 text-sm text-ink-soft">— {getLocalizedText(founderData.name, lang) || 'Pandit Ram Prasad Acharya'}</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="py-24 px-4 sm:px-6" ref={timelineRef}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              {t.historySubtitle || 'The Temple Through the Ages'}
            </h2>
          </motion.div>

          {enabledItems.length === 0 ? (
            <p className="text-center text-ink-soft">No history entries available</p>
          ) : (
            <div className="space-y-24">
              {enabledItems.map((item, index) => {
                const titleText = getLocalizedText(item.title, lang) || getLocalizedText(item.period, lang) || 'History';
                const descText = getLocalizedText(item.desc, lang) || '';
                const periodText = getLocalizedText(item.period, lang) || '';
                const imageSrc = item.photo || `/${(index % 5) + 1}.jpg`;

                return (
                  <motion.div
                    key={item._id}
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
                        src={imageSrc} 
                        alt={titleText}
                        loading="lazy" 
                        className="w-full h-80 object-cover"
                        onError={(e) => {
                          e.target.src = defaultHeroImage;
                        }}
                      />
                      {item.year && (
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-bold">
                          {item.year}
                        </div>
                      )}
                    </motion.div>

                    <div className="card-content flex flex-col justify-center space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-serif font-bold text-maroon/20">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="w-12 h-px bg-maroon/20" />
                        <Clock size={16} className="text-ink-soft" />
                        {periodText && (
                          <span className="text-sm text-ink-soft font-medium">{periodText}</span>
                        )}
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl text-maroon">
                        {titleText}
                      </h2>
                      <p className="text-ink-soft leading-relaxed text-base sm:text-lg">
                        {descText}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Heritage Section - Removed icons and Jai Shree Ram */}
      <div className="py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-maroon">
            {t.history?.heritage?.title || 'A Living Heritage'}
          </h2>
          <p className="text-ink-soft text-base sm:text-lg leading-relaxed">
            {t.history?.heritage?.body || 'Shree Ramchandra Temple stands as a testament to the enduring faith and devotion of the Nepali people. From its humble beginnings to its present grandeur, the temple continues to be a sanctuary of peace and spiritual fulfillment.'}
          </p>
          
          {/* Animated Counters */}
          <div className="pt-6 flex items-center justify-center gap-6 flex-wrap">
            <AnimatedCounter target={100} label="Years of Service" suffix="+" />
            <div className="w-px h-10 bg-gray-300 hidden sm:block" />
            <AnimatedCounter target={50} label="Devotees Served" suffix="K+" />
            <div className="w-px h-10 bg-gray-300 hidden sm:block" />
            <AnimatedCounter target={365} label="Days of Aarti" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;