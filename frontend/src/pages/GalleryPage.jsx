import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { X, Download, Image as ImageIcon, Youtube } from 'lucide-react';
import api from '../services/api';

// Fallback images for when API fails
const fallbackImages = [
  { _id: '1', photo: '/1.jpg', cap: { en: 'Temple View' }, type: 'photo', category: 'temple' },
  { _id: '2', photo: '/2.jpg', cap: { en: 'Temple Interior' }, type: 'photo', category: 'temple' },
  { _id: '3', photo: '/3.jpg', cap: { en: 'Temple Deity' }, type: 'photo', category: 'deity' },
  { _id: '4', photo: '/4.jpg', cap: { en: 'Festival Celebration' }, type: 'photo', category: 'festival' },
  { _id: '5', photo: '/6.jpg', cap: { en: 'Devotional Gathering' }, type: 'photo', category: 'devotion' },
  { _id: '6', photo: '/5.jpg', cap: { en: 'Temple Ceremony' }, type: 'photo', category: 'ceremony' },
  { _id: '7', photo: '/2.jpg', cap: { en: 'Sacred Rituals' }, type: 'photo', category: 'ritual' },
  { _id: '8', photo: '/1.jpg', cap: { en: 'Temple Architecture' }, type: 'photo', category: 'architecture' },
  { _id: '9', photo: '/3.jpg', cap: { en: 'Evening Aarti' }, type: 'photo', category: 'aarti' },
  { _id: '10', photo: '/4.jpg', cap: { en: 'Temple Courtyard' }, type: 'photo', category: 'courtyard' },
];

// Helper to get text in current language
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

// ─── Lightbox Modal ──────────────────────────────────────────────────────────
function LightboxModal({ items, index, t, lang, onClose, onPrev, onNext }) {
  const item = items[index];
  if (!item) return null;

  const isVideo = item.type === 'video';
  const caption = getLocalizedText(item.cap, lang);

  const handleDownload = async () => {
    try {
      const res = await fetch(item.photo);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = isVideo ? 'mp4' : 'jpg';
      a.download = `${caption.replace(/\s+/g, '-').toLowerCase() || 'download'}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(item.photo, '_blank');
    }
  };

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
          onClick={handleDownload}
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <motion.div
        key={index}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[92vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={item.photo}
            className="max-w-full max-h-[82vh] object-contain rounded-lg"
            controls
            autoPlay
          />
        ) : (
          <img
            src={item.photo}
            alt={caption}
            className="max-w-full max-h-[82vh] object-contain rounded-lg"
            onError={(e) => { e.target.src = '/1.jpg'; }}
          />
        )}
        <div className="mt-3 text-center">
          <p className="text-white/80 text-sm">{caption}</p>
          <p className="text-white/35 text-xs mt-1">{index + 1} / {items.length}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Gallery Page ──────────────────────────────────────────────────────
const GalleryPage = () => {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('photos');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lbState, setLbState] = useState(null);
  const fetched = useRef(false);

  // Fetch gallery items from API
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchGallery = async () => {
      try {
        const response = await api.get('/admin/gallery/all');
        if (response.data && response.data.data && response.data.data.length > 0) {
          setItems(response.data.data);
        } else {
          setItems(fallbackImages);
        }
      } catch (error) {
        console.error('Fetch gallery error:', error);
        setItems(fallbackImages);
        showToast('Using sample images', 'warning');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [showToast]);

  // Filter items based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'photos') {
      return items.filter(item => item.type === 'photo' || !item.type);
    }
    return items.filter(item => item.type === 'video');
  }, [items, activeTab]);

  const openLb = useCallback((idx, source) => {
    setLbState({ items: source || filteredItems, index: idx });
    document.body.style.overflow = 'hidden';
  }, [filteredItems]);

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: '#faf8f5' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-soft text-sm">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>
      {/* Header */}
      <div className="pt-28 pb-6 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
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
      </div>

      {/* Tab Navigation - Clean, no extra box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'photos'
                ? 'bg-vermilion text-white shadow-lg shadow-vermilion/20'
                : 'text-ink-soft hover:text-ink hover:bg-gray-100/50'
            }`}
          >
            <ImageIcon size={16} />
            {t.galleryPhotos || 'Photos'}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-vermilion text-white shadow-lg shadow-vermilion/20'
                : 'text-ink-soft hover:text-ink hover:bg-gray-100/50'
            }`}
          >
            <Youtube size={16} />
            {t.galleryVideos || 'Videos'}
          </button>
        </div>
      </div>

      {/* Gallery Grid - Same size images, 5 per row on desktop, 2 on mobile */}
      {filteredItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
            {filteredItems.map((item, index) => {
              const isVideo = item.type === 'video';
              
              return (
                <motion.button
                  key={item._id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index % 10) * 0.03, duration: 0.4 }}
                  onClick={() => openLb(index)}
                  className="relative overflow-hidden rounded-lg group cursor-zoom-in aspect-square w-full"
                  style={{ background: '#1a1a1a' }}
                >
                  {isVideo ? (
                    <video
                      src={item.photo}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                      muted
                    />
                  ) : (
                    <img
                      src={item.photo}
                      alt={getLocalizedText(item.cap, lang)}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                      onError={(e) => { e.target.src = '/1.jpg'; }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-400" />
                  
                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Youtube size={10} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="py-20 text-center">
          <ImageIcon size={64} className="mx-auto text-ink-soft/20 mb-4" />
          <p className="text-ink-soft">No {activeTab} available</p>
        </div>
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

      {/* Hide scrollbar */}
      <style>{`
        html {
          overflow-y: scroll;
          scrollbar-width: none;
        }
        html::-webkit-scrollbar {
          width: 0;
          display: none;
        }
        body {
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;