import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, X } from 'lucide-react';

const PER_PAGE = 6;

// Default videos - replace with your actual video IDs
const defaultVideos = [
  { id: 'v1', ytId: 'dQw4w9WgXcQ', title: { en: 'Morning Aarti at Temple', ne: 'मन्दिरमा बिहानको आरती', hi: 'मंदिर में सुबह की आरती' } },
  { id: 'v2', ytId: 'dQw4w9WgXcQ', title: { en: 'Ram Navami Celebration', ne: 'राम नवमी महोत्सव', hi: 'राम नवमी महोत्सव' } },
  { id: 'v3', ytId: 'dQw4w9WgXcQ', title: { en: 'Evening Bhajan Sandhya', ne: 'साँझको भजन सन्ध्या', hi: 'शाम की भजन संध्या' } },
  { id: 'v4', ytId: 'dQw4w9WgXcQ', title: { en: 'Special Puja Ceremony', ne: 'विशेष पूजा समारोह', hi: 'विशेष पूजा समारोह' } },
  { id: 'v5', ytId: 'dQw4w9WgXcQ', title: { en: 'Temple Architecture Tour', ne: 'मन्दिर वास्तुकला भ्रमण', hi: 'मंदिर वास्तुकला यात्रा' } },
  { id: 'v6', ytId: 'dQw4w9WgXcQ', title: { en: 'Festival Celebrations', ne: 'महोत्सव मनाउँदै', hi: 'त्योहार मनाते हुए' } },
  { id: 'v7', ytId: 'dQw4w9WgXcQ', title: { en: 'Daily Rituals', ne: 'दैनिक अनुष्ठान', hi: 'दैनिक अनुष्ठान' } },
  { id: 'v8', ytId: 'dQw4w9WgXcQ', title: { en: 'Temple History Documentary', ne: 'मन्दिर इतिहास वृत्तचित्र', hi: 'मंदिर इतिहास वृत्तचित्र' } },
];

// Helper to get text in current language
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

const VideosPage = () => {
  const { t, lang } = useLanguage();
  const [vids, setVids] = useState(defaultVideos);
  const [playing, setPlaying] = useState(null);
  const [page, setPage] = useState(0);
  const [featured, setFeatured] = useState(null);

  const totalPages = Math.max(1, Math.ceil(vids.length / PER_PAGE));
  const pageVids = useMemo(() => vids.slice(page * PER_PAGE, (page + 1) * PER_PAGE), [vids, page]);

  const goPage = (p) => {
    setPage(Math.max(0, Math.min(p, totalPages - 1)));
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const heroVid = featured || vids[0];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #faf8f5 100%)' }}>
      {/* Header */}
      <div className="pt-24 pb-8 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light"
          style={{ color: '#7A0000' }}
        >
          {t.videosTitle || 'Temple Videos'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-base sm:text-lg text-mute max-w-xl mx-auto leading-relaxed"
        >
          {t.videosSubtitle || 'Watch devotional videos, aartis, and temple ceremonies'}
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {/* Featured Video */}
        {heroVid && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#7A0000' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#7A0000' }} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7A0000' }}>
                {t.videosLive || 'Live Now'}
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-xl">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${heroVid.ytId}?autoplay=0&rel=0`}
                    title={getLocalizedText(heroVid.title, lang)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="px-5 py-4">
                  <h2 className="text-white text-base sm:text-lg font-medium">
                    {getLocalizedText(heroVid.title, lang)}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col">
                <h3
                  className="text-sm font-semibold mb-3 hidden lg:block uppercase tracking-wider"
                  style={{ color: '#7A0000' }}
                >
                  {t.videosMore || 'More Videos'}
                </h3>
                <div 
                  className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[370px] pb-2 lg:pb-0"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {vids.slice(0, 8).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setFeatured(v)}
                      className={`shrink-0 flex gap-3 items-start text-left rounded-lg p-2 transition-all duration-200 w-56 lg:w-full ${
                        heroVid.id === v.id ? 'bg-white shadow-md border border-gray-100' : 'hover:bg-white/60'
                      }`}
                    >
                      <div className="relative w-24 lg:w-28 shrink-0 rounded-md overflow-hidden">
                        <img
                          src={`https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg`}
                          alt={getLocalizedText(v.title, lang)}
                          className="w-full aspect-video object-cover"
                        />
                        {heroVid.id === v.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#7A0000' }}>
                              <div className="w-0 h-0 ml-0.5 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <span className={`text-xs leading-snug line-clamp-2 pt-0.5 ${
                        heroVid.id === v.id ? 'font-semibold text-ink' : 'text-mute'
                      }`}>
                        {getLocalizedText(v.title, lang)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Videos */}
        <div className="mb-8">
          <h2
            className="font-serif text-2xl sm:text-3xl"
            style={{ color: '#7A0000' }}
          >
            {t.videosRecent || 'Recent Videos'}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {pageVids.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => setPlaying(v.ytId)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <img
                    src={`https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`}
                    alt={getLocalizedText(v.title, lang)}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-0 h-0 ml-1 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-sm sm:text-base font-medium leading-snug drop-shadow-lg">
                      {getLocalizedText(v.title, lang)}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: '#7A0000', borderColor: page === 0 ? '#e5e5e5' : '#7A0000' }}
            >
              <span className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                {t.videosPrev || 'Prev'}
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goPage(i)}
                  className="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: i === page ? '#7A0000' : 'transparent',
                    color: i === page ? '#fff' : '#7A0000',
                    border: i === page ? 'none' : '1px solid #e5e5e5',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: '#7A0000', borderColor: page >= totalPages - 1 ? '#e5e5e5' : '#7A0000' }}
            >
              <span className="flex items-center gap-1.5">
                {t.videosNext || 'Next'}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <span className="text-xs text-mute ml-2 hidden sm:inline">
              {t.videosPage || 'Page'} {page + 1} {t.videosOf || 'of'} {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {playing && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setPlaying(null)}
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(6px)' }}
        >
          <button
            onClick={() => setPlaying(null)}
            className="absolute top-5 right-5 z-10 flex items-center justify-center w-9 h-9 border border-white/25 hover:border-white/60 text-white/80 hover:text-white transition-all rounded"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-full max-w-4xl aspect-video mx-4" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${playing}?autoplay=1`}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideosPage;