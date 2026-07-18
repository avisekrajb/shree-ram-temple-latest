import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, X, Download, ArrowLeft, ArrowRight, Youtube, Image as ImageIcon } from 'lucide-react';
import VideosPage from './VideosPage';

// Local images from public folder
const galleryImages = [
  { id: 'g1', src: '/1.jpg', cat: 'festival', alt: { en: 'Ram Navami Celebration', ne: 'राम नवमी महोत्सव', hi: 'राम नवमी महोत्सव', zh: '罗摩诞辰庆典', ta: 'ராம் நவமி கொண்டாட்டம்' } },
  { id: 'g2', src: '/2.jpg', cat: 'festival', alt: { en: 'Temple Festival', ne: 'मन्दिर महोत्सव', hi: 'मंदिर महोत्सव', zh: '寺庙节日', ta: 'கோயில் திருவிழா' } },
  { id: 'g3', src: '/3.jpg', cat: 'architecture', alt: { en: 'Temple Architecture', ne: 'मन्दिर वास्तुकला', hi: 'मंदिर वास्तुकला', zh: '寺庙建筑', ta: 'கோயில் கட்டிடக்கலை' } },
  { id: 'g4', src: '/4.jpg', cat: 'architecture', alt: { en: 'Sacred Temple', ne: 'पवित्र मन्दिर', hi: 'पवित्र मंदिर', zh: '神圣寺庙', ta: 'புனித கோயில்' } },
  { id: 'g5', src: '/6.jpg', cat: 'devotion', alt: { en: 'Devotional Gathering', ne: 'भक्ति भेला', hi: 'भक्ति समागम', zh: '虔诚聚会', ta: 'பக்தி கூட்டம்' } },
  { id: 'g6', src: '/1.jpg', cat: 'festival', alt: { en: 'Religious Ceremony', ne: 'धार्मिक समारोह', hi: 'धार्मिक समारोह', zh: '宗教仪式', ta: 'மத விழா' } },
  { id: 'g7', src: '/2.jpg', cat: 'architecture', alt: { en: 'Temple Details', ne: 'मन्दिर विवरण', hi: 'मंदिर विवरण', zh: '寺庙细节', ta: 'கோயில் விவரங்கள்' } },
  { id: 'g8', src: '/3.jpg', cat: 'devotion', alt: { en: 'Evening Aarti', ne: 'साँझको आरती', hi: 'शाम की आरती', zh: '晚间祈祷', ta: 'மாலை ஆரத்தி' } },
  { id: 'g9', src: '/4.jpg', cat: 'festival', alt: { en: 'Festival Celebration', ne: 'महोत्सव मनाउँदै', hi: 'त्योहार मनाते हुए', zh: '节日庆典', ta: 'திருவிழா கொண்டாட்டம்' } },
  { id: 'g10', src: '/6.jpg', cat: 'architecture', alt: { en: 'Temple Courtyard', ne: 'मन्दिर आँगन', hi: 'मंदिर प्रांगण', zh: '寺庙庭院', ta: 'கோயில் முற்றம்' } },
  { id: 'g11', src: '/1.jpg', cat: 'devotion', alt: { en: 'Devotees Praying', ne: 'भक्तजन प्रार्थना गर्दै', hi: 'भक्त प्रार्थना करते हुए', zh: '信徒祈祷', ta: 'பக்தர்கள் பிரார்த்தனை' } },
  { id: 'g12', src: '/2.jpg', cat: 'festival', alt: { en: 'Special Puja', ne: 'विशेष पूजा', hi: 'विशेष पूजा', zh: '特别祈祷', ta: 'சிறப்பு பூஜை' } },
];

const GRID_PER_PAGE = 8;

// Helper to get text in current language
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

// ─── Section 1: Hero Showcase Slider ─────────────────────────────────────────
function HeroShowcase({ items, t, lang, onOpen }) {
  const slides = items.slice(0, 4);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
  }, [slides.length]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const go = (dir) => {
    setCurrent((c) => (c + dir + slides.length) % slides.length);
    resetTimer();
  };

  return (
    <section className="pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-8 sm:mb-10"
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ color: "#7A0000" }}>
          {t.galleryFeatured || 'Featured Gallery'}
        </p>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight font-serif"
          style={{ color: "#7A0000" }}
        >
          {t.galleryTitle || 'Photo Gallery'}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-mute max-w-xl mx-auto leading-relaxed">
          {t.gallerySubtitle || 'Capturing moments of devotion and celebration at Shree Ramchandra Temple'}
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto relative">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ background: '#111', minHeight: '360px', height: 'clamp(360px, 55vh, 580px)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center cursor-zoom-in"
              onClick={() => onOpen(current)}
            >
              <img
                src={slides[current]?.src}
                alt={getLocalizedText(slides[current]?.alt, lang)}
                className="max-w-full max-h-full object-contain"
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
              >
                <p className="text-white text-sm sm:text-base font-medium drop-shadow-lg">
                  {getLocalizedText(slides[current]?.alt, lang)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => { setCurrent(i); resetTimer(); }}
              className="relative overflow-hidden rounded-lg transition-all duration-300"
              style={{
                width: i === current ? '72px' : '48px',
                height: i === current ? '48px' : '36px',
                opacity: i === current ? 1 : 0.5,
                border: i === current ? '2px solid #7A0000' : '2px solid transparent',
              }}
            >
              <img src={slide.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: Draggable Filmstrip ──────────────────────────────────────────
function Filmstrip({ items, t, onOpen }) {
  const featured = items.slice(0, 6);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const handleMouseDown = (e) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: trackRef.current.scrollLeft };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const walk = (e.pageX - dragStart.current.x) * 1.5;
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - walk;
  };

  const handleEnd = () => setIsDragging(false);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <section
      className="py-16 sm:py-20"
      style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #f0ebe4 50%, #faf8f5 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 px-4"
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ color: "#7A0000" }}>
          {t.galleryExplore || 'Explore'}
        </p>
        <h2 className="text-3xl sm:text-4xl font-light font-serif" style={{ color: "#1a1a1a" }}>
          {t.galleryParallaxTitle || 'Moments in Time'}
        </h2>
        <p className="mt-3 text-base text-mute max-w-md mx-auto leading-relaxed">
          {t.galleryParallaxDesc || 'Scroll through our collection of sacred moments'}
        </p>
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        <button
          onClick={() => scroll(-1)}
          className="hidden sm:flex absolute -left-2 lg:left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:shadow-xl transition-all"
          style={{ color: "#7A0000" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="hidden sm:flex absolute -right-2 lg:right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:shadow-xl transition-all"
          style={{ color: "#7A0000" }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto px-6 sm:px-12 lg:px-16 pb-4 snap-x snap-mandatory"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex-shrink-0 snap-center"
              style={{ width: 'min(320px, 80vw)' }}
            >
              <button
                onClick={() => { if (!isDragging) onOpen(items.indexOf(item)); }}
                className="relative w-full overflow-hidden rounded-xl group cursor-zoom-in block"
                style={{ background: '#1a1a1a' }}
              >
                <div className="relative w-full" style={{ paddingBottom: '130%' }}>
                  <img
                    src={item.src}
                    alt={getLocalizedText(item.alt, 'en')}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)' }}
                  />
                </div>
                <div className="px-4 py-3" style={{ background: '#1a1a1a' }}>
                  <p className="text-white/90 text-sm font-medium leading-snug truncate">
                    {getLocalizedText(item.alt, 'en')}
                  </p>
                  <p className="text-white/35 text-xs mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Bento Grid ──────────────────────────────────────────────────
function BentoGrid({ items, t, lang, onOpen }) {
  const [cat, setCat] = useState('all');
  const [page, setPage] = useState(0);
  const sectionRef = useRef(null);

  const cats = useMemo(() => {
    const set = new Set(items.map((i) => i.cat));
    return ['all', ...Array.from(set)];
  }, [items]);

  const visible = useMemo(() => cat === 'all' ? items : items.filter((i) => i.cat === cat), [items, cat]);
  const totalPages = Math.max(1, Math.ceil(visible.length / GRID_PER_PAGE));
  const pageItems = useMemo(() => visible.slice(page * GRID_PER_PAGE, (page + 1) * GRID_PER_PAGE), [visible, page]);

  const selectCat = (c) => { setCat(c); setPage(0); };
  const goPage = (p) => {
    setPage(Math.max(0, Math.min(p, totalPages - 1)));
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getBentoClass = (i) => {
    const p = i % 8;
    if (p === 0) return 'col-span-2 row-span-2';
    if (p === 5) return 'col-span-2 row-span-2';
    return 'col-span-1 row-span-1';
  };

  const getBentoMobile = (i) => {
    if (i % 5 === 0) return 'col-span-2';
    return 'col-span-1';
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-24" style={{ background: '#faf8f5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase mb-3" style={{ color: "#7A0000" }}>
            {t.galleryCollection || 'Collection'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-light font-serif" style={{ color: "#1a1a1a" }}>
            {t.galleryExplore || 'Explore All'}
          </h2>
        </motion.div>

        <div
          className="sticky top-20 z-30 py-3 mb-6"
          style={{
            background: 'linear-gradient(180deg, rgba(250,248,245,0.97) 0%, rgba(250,248,245,0.85) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => selectCat(c)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 uppercase tracking-wider`}
                  style={{
                    background: cat === c ? '#7A0000' : 'transparent',
                    color: cat === c ? '#fff' : '#5a5a5a',
                    border: cat === c ? '1px solid #7A0000' : '1px solid #ddd',
                  }}
                >
                  {t[`gallery_${c}`] || c}
                </button>
              ))}
            </div>
            <span className="text-xs text-mute hidden sm:block">
              {visible.length} {t.galleryPhotos || 'photos'}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${cat}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="hidden md:grid grid-cols-4 auto-rows-[220px] lg:auto-rows-[250px] gap-3 rounded-2xl overflow-hidden">
              {pageItems.map((it, i) => (
                <motion.button
                  key={it.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  onClick={() => onOpen(visible.indexOf(it), visible)}
                  className={`relative overflow-hidden rounded-xl group cursor-zoom-in ${getBentoClass(i)}`}
                  style={{ background: '#1a1a1a' }}
                >
                  <img
                    src={it.src}
                    alt={getLocalizedText(it.alt, lang)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-600 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
                    <p className="text-white text-xs lg:text-sm font-medium drop-shadow-lg leading-snug">
                      {getLocalizedText(it.alt, lang)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="grid md:hidden grid-cols-2 auto-rows-[180px] gap-2 rounded-xl overflow-hidden">
              {pageItems.map((it, i) => (
                <motion.button
                  key={it.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  onClick={() => onOpen(visible.indexOf(it), visible)}
                  className={`relative overflow-hidden rounded-lg cursor-zoom-in ${getBentoMobile(i)}`}
                  style={{ background: '#1a1a1a' }}
                >
                  <img
                    src={it.src}
                    alt={getLocalizedText(it.alt, lang)}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 30%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-white text-[11px] font-medium drop-shadow leading-snug">
                      {getLocalizedText(it.alt, lang)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => goPage(page - 1)}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: '#7A0000', borderColor: page === 0 ? '#e5e5e5' : '#7A0000' }}
            >
              <span className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.galleryPrev || 'Prev'}
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
                {t.galleryNext || 'Next'}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
            <span className="text-xs text-mute ml-2 hidden sm:inline">
              {t.galleryPage || 'Page'} {page + 1} {t.galleryOf || 'of'} {totalPages}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function LightboxModal({ items, index, t, lang, onClose, onPrev, onNext }) {
  const item = items[index];
  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(8px)' }}
    >
      <div className="absolute top-4 right-4 flex gap-3 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={async () => {
            try {
              const res = await fetch(item.src);
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${getLocalizedText(item.alt, lang).replace(/\s+/g, '-') || 'photo'}.jpg`;
              a.click();
              URL.revokeObjectURL(url);
            } catch {
              window.open(item.src, '_blank');
            }
          }}
          className="flex items-center text-white/60 hover:text-white text-xs px-3 py-2 border border-white/15 hover:border-white/40 transition-all rounded-lg"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 border border-white/15 hover:border-white/40 text-white/60 hover:text-white transition-all rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <motion.div
        key={index}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[92vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={getLocalizedText(item.alt, lang)}
          className="max-w-full max-h-[82vh] object-contain rounded-lg"
        />
        <div className="mt-3 text-center">
          <p className="text-white/80 text-sm">{getLocalizedText(item.alt, lang)}</p>
          <p className="text-white/35 text-xs mt-1">{index + 1} / {items.length}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Gallery Page ──────────────────────────────────────────────────────
const GalleryPage = () => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('photos');
  const [items] = useState(galleryImages);
  const [lbState, setLbState] = useState(null);

  const openLb = useCallback((idx, source) => {
    setLbState({ items: source || items, index: idx });
    document.body.style.overflow = 'hidden';
  }, [items]);

  const closeLb = useCallback(() => {
    setLbState(null);
    document.body.style.overflow = '';
  }, []);

  const lbPrev = useCallback(() => {
    setLbState((s) => s ? { ...s, index: (s.index - 1 + s.items.length) % s.items.length } : null);
  }, []);

  const lbNext = useCallback(() => {
    setLbState((s) => s ? { ...s, index: (s.index + 1) % s.items.length } : null);
  }, []);

  useEffect(() => {
    if (!lbState) return;
    const handler = (e) => {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lbState, closeLb, lbPrev, lbNext]);

  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>
      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-3">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'photos'
                  ? 'bg-vermilion text-white shadow-lg shadow-vermilion/20'
                  : 'text-ink-soft hover:text-ink hover:bg-gray-50'
              }`}
            >
              <ImageIcon size={18} />
              {t.galleryPhotos || 'Photos'}
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-vermilion text-white shadow-lg shadow-vermilion/20'
                  : 'text-ink-soft hover:text-ink hover:bg-gray-50'
              }`}
            >
              <Youtube size={18} />
              {t.galleryVideos || 'Videos'}
            </button>
          </div>
        </div>
      </div>

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <>
          <HeroShowcase items={items} t={t} lang={lang} onOpen={(idx) => openLb(idx)} />
          <Filmstrip items={items} t={t} onOpen={(idx) => openLb(idx)} />
          <BentoGrid items={items} t={t} lang={lang} onOpen={(idx, filtered) => openLb(idx, filtered)} />
        </>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <VideosPage />
      )}

      <AnimatePresence>
        {lbState && (
          <LightboxModal
            items={lbState.items}
            index={lbState.index}
            t={t}
            lang={lang}
            onClose={closeLb}
            onPrev={lbPrev}
            onNext={lbNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;