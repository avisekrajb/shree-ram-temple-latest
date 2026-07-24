import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight, X, Download, Play, Pause, QuoteIcon, Clock, MapPin, Gift, Star, Share2, ThumbsUp, Loader2, Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';
import TempleIcon from '../components/common/TempleIcon';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

<<<<<<< HEAD
// Default fallback images
const defaultHeroImage = '/1.jpg';
const defaultGalleryImages = [
  { id: 'g1', src: '/1.jpg', alt: { en: 'Temple View', ne: 'मन्दिर दृश्य' } },
  { id: 'g2', src: '/2.jpg', alt: { en: 'Temple Interior', ne: 'मन्दिर भित्री भाग' } },
  { id: 'g3', src: '/3.jpg', alt: { en: 'Temple Deity', ne: 'मन्दिर देवता' } },
  { id: 'g4', src: '/4.jpg', alt: { en: 'Festival Celebration', ne: 'महोत्सव मनाउँदै' } },
  { id: 'g5', src: '/6.jpg', alt: { en: 'Devotional Gathering', ne: 'भक्ति भेला' } },
  { id: 'g6', src: '/1.jpg', alt: { en: 'Temple Architecture', ne: 'मन्दिर वास्तुकला' } },
  { id: 'g7', src: '/2.jpg', alt: { en: 'Evening Aarti', ne: 'साँझको आरती' } },
  { id: 'g8', src: '/3.jpg', alt: { en: 'Sacred Rituals', ne: 'पवित्र अनुष्ठान' } },
];
=======
// Local images and video from public folder
const heroVideo = '/hero1.mp4';
const heroImage1 = '/1.jpg';
const heroImage2 = '/2.jpg';
const heroImage3 = '/3.jpg';
const heroImage4 = '/4.jpg';
const heroImage5 = '/6.jpg';
>>>>>>> 1e9d40e76286b11a3b6991021c16b58e5c638ead

// ─── Fullscreen Image Modal ──────────────────────────────────────────────────
function ImageModal({ src, alt, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleDownload = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = src.split(".").pop()?.split("?")[0] || "jpg";
      a.download = `${alt.replace(/\s+/g, "-").toLowerCase() || "image"}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="absolute top-5 right-5 flex gap-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs uppercase tracking-widest px-3 py-2 border border-white/25 hover:border-white/60 transition-all rounded"
          title="Download"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 border border-white/25 hover:border-white/60 text-white/80 hover:text-white transition-all rounded"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <motion.div
        className="relative max-w-[92vw] max-h-[90vh] flex items-center justify-center"
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain shadow-2xl"
          style={{ borderRadius: 2 }}
        />
      </motion.div>
    </motion.div>
  );
}

// Hook to manage modal state
function useImageModal() {
  const [modal, setModal] = useState(null);
  const open = useCallback((src, alt) => setModal({ src, alt }), []);
  const close = useCallback(() => setModal(null), []);
  return { modal, open, close };
}

// Clickable image wrapper
function ClickableImg({ src, alt, className, style, loading, onOpen }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ ...style, cursor: "zoom-in" }}
      loading={loading}
      onClick={() => onOpen(src, alt)}
    />
  );
}

// ─── Helper Functions ──────────────────────────────────────────────────────────
const getLocalizedText = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || '';
};

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero({ settings }) {
  const { t, lang } = useLanguage();
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const heroVideo = settings?.heroVideo;
  const heroEnabled = settings?.heroEnabled !== false;
  const heroPoster = settings?.heroPoster || 'linear-gradient(160deg,#7A1F2B 0%,#5B1420 45%,#2B1810 100%)';
  const timings = settings?.timings || { open: '05:00 AM', close: '08:00 PM' };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const videoScale = useTransform(smooth, [0, 1], [1, 1.1]);
  const overlayOp = useTransform(smooth, [0, 0.7], [0.35, 0.8]);
  const textY = useTransform(smooth, [0, 1], ["0%", "-30%"]);
  const textOpacity = useTransform(smooth, [0, 0.5], [1, 0]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Show hero only if enabled
  if (!heroEnabled) {
    return (
      <section
        ref={ref}
        className="relative w-full overflow-hidden"
        style={{ height: "100svh", minHeight: 560, background: heroPoster }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="font-serif text-5xl sm:text-6xl lg:text-8xl text-white font-light leading-tight drop-shadow-2xl mb-6"
          >
            {t.templeName || 'Shree Ramchandra Temple'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-white/70 text-base sm:text-lg max-w-xl leading-relaxed mb-10"
          >
            {t.heroTagline || 'Where devotion meets the sacred banks of Bagmati'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-vermilion/30 hover:bg-[#a83a0c] hover:-translate-y-0.5 transition-all" style={{ backgroundColor: "#7A0000", color: "white" }}>
              {t.heroCta2 || 'Book Puja'} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white border border-white/50 hover:bg-white/10 transition-all">
              {t.navDonate || 'Donate'}
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 560 }}
    >
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0 w-full h-full origin-center"
      >
        {heroVideo && !videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            src={heroVideo}
            onError={() => setVideoError(true)}
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{ background: heroPoster }}
          />
        )}
        <button
          onClick={togglePlay}
          className="absolute bottom-24 left-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all text-white"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,1)", opacity: overlayOp }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
        }}
      />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="font-serif text-5xl sm:text-6xl lg:text-8xl text-white font-light leading-tight drop-shadow-2xl mb-6"
        >
          {t.templeName || 'Shree Ramchandra Temple'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-white/70 text-base sm:text-lg max-w-xl leading-relaxed mb-10"
        >
          {t.heroTagline || 'Where devotion meets the sacred banks of Bagmati'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-vermilion/30 hover:bg-[#a83a0c] hover:-translate-y-0.5 transition-all" style={{ backgroundColor: "#7A0000", color: "white" }}>
            {t.heroCta2 || 'Book Puja'} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white border border-white/50 hover:bg-white/10 transition-all">
            {t.navDonate || 'Donate'}
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/35 text-xs uppercase tracking-widest" style={{ fontFamily: "serif" }}>
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
          style={{
            width: 1,
            height: 36,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}

// ─── Quote Strip ──────────────────────────────────────────────────────────────
function QuoteStrip({ quote }) {
  return (
    <div className="bg-maroon text-white flex items-start gap-3 px-4 md:px-6 py-4 md:py-5 max-w-7xl mx-auto -mt-px rounded-b-xl shadow-lg">
      <QuoteIcon size={18} className="text-marigold flex-shrink-0 mt-1" />
      <div>
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-marigold font-bold">Thought for the Day</span>
        <p className="font-serif text-sm md:text-base text-white/90 mt-1 leading-relaxed">{quote}</p>
      </div>
    </div>
  );
}

// ─── About Preview ────────────────────────────────────────────────────────────
function AboutPreview({ settings, onOpen }) {
  const { t, lang } = useLanguage();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imagesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        const children = textRef.current.querySelectorAll("h2, p, a");
        gsap.set(children, { opacity: 0, x: -52, clipPath: "inset(0 100% 0 0)" });
        gsap.to(children, {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 78%",
            once: true,
          },
        });
      }

      if (imagesRef.current) {
        const cards = imagesRef.current.querySelectorAll(".img-card");
        gsap.set(cards, { opacity: 0, x: 60, scale: 0.97 });
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.0,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: imagesRef.current,
            start: "top 78%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const about = settings?.about || {};
  const aboutImages = settings?.aboutImages?.filter(img => img.enabled) || [];
  
  const title = getLocalizedText(about.title, lang) || t.aboutTitleDefault || 'About the Temple';
  const text = getLocalizedText(about.text, lang) || t.aboutTextDefault || 'Nestled in the heart of Gaushala, Shree Ramchandra Temple has stood as a beacon of devotion for generations.';
  const timings = settings?.timings || { open: '05:00 AM', close: '08:00 PM' };

  // Get images for grid
  const image1 = aboutImages[0]?.src || '/2.jpg';
  const image2 = aboutImages[1]?.src || '/3.jpg';
  const image3 = aboutImages[2]?.src || '/1.jpg';

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div ref={textRef}>
          <h2 className="font-serif text-3xl sm:text-4xl mb-6" style={{ color: "#520505" }}>
            {title}
          </h2>
          <p className="text-base sm:text-lg text-mute leading-relaxed mb-8">
            {text}
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-2 mb-6">
            <li className="flex items-center gap-2 text-sm text-ink-soft">
              <Clock size={14} className="text-vermilion" /> {t.openHours || 'Darshan Hours'}: {timings.open} – {timings.close}
            </li>
            <li className="flex items-center gap-2 text-sm text-ink-soft">
              <MapPin size={14} className="text-vermilion" /> {t.templeAddressLine || 'Gaushala, Kathmandu, Nepal'}
            </li>
          </ul>
          <Link
            to="/about"
            className="text-vermilion text-sm font-medium hover:opacity-80 transition-all"
          >
            View More
          </Link>
        </div>

        <div ref={imagesRef} className="grid grid-cols-2 gap-4">
          <div className="img-card overflow-hidden rounded-lg border border-line shadow-lg">
            <ClickableImg
              src={image1}
              alt="Temple"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              onOpen={onOpen}
            />
          </div>
          <div className="img-card overflow-hidden rounded-lg border border-line shadow-lg">
            <ClickableImg
              src={image2}
              alt="Temple Deity"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              onOpen={onOpen}
            />
          </div>
          <div className="img-card col-span-2 overflow-hidden rounded-lg border border-line shadow-lg">
            <ClickableImg
              src={image3}
              alt="Temple Architecture"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              onOpen={onOpen}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Events Teaser (FULLY WORKING WITH BACKEND) ────────────────────────────
function EventsTeaser({ onOpen }) {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interestedEvents, setInterestedEvents] = useState({});
  const [interestedCounts, setInterestedCounts] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const formatEventDate = (dateString) => {
    if (!dateString) return 'Coming Soon';
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric' };
    const year = date.getFullYear();
    if (year >= 2026) {
      options.year = 'numeric';
    }
    return date.toLocaleDateString('en-US', options);
  };

  // Fetch events and interested status
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/upcoming');
        const eventsData = response.data.slice(0, 4);
        setEvents(eventsData);
        
        // Initialize interested counts
        const counts = {};
        eventsData.forEach(e => {
          counts[e._id] = e.interestedCount || 0;
        });
        setInterestedCounts(counts);

        // If user is logged in, fetch their interested events
        if (user) {
          try {
            const interestedRes = await api.get('/events/interested');
            const interestedMap = {};
            interestedRes.data.forEach(e => {
              interestedMap[e._id] = true;
            });
            setInterestedEvents(interestedMap);
          } catch (error) {
            console.error('Error fetching interested events:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user]);

  const handleInterested = async (eventId, e) => {
    if (e) e.stopPropagation();
    
    if (!user) {
      showToast('Please login to mark as interested', 'warning');
      return;
    }

    if (!eventId) {
      console.error('No event ID provided');
      showToast('Error: Event ID is missing', 'error');
      return;
    }

    setActionLoading(prev => ({ ...prev, [eventId]: true }));
    
    try {
      const isCurrentlyInterested = interestedEvents[eventId];
      const endpoint = isCurrentlyInterested 
        ? `/events/${eventId}/uninterested` 
        : `/events/${eventId}/interested`;
      
      const response = await api.post(endpoint);
      
      // Update interested state
      setInterestedEvents(prev => ({
        ...prev,
        [eventId]: !isCurrentlyInterested
      }));
      
      // Update count
      setInterestedCounts(prev => ({
        ...prev,
        [eventId]: response.data.count || (isCurrentlyInterested ? prev[eventId] - 1 : prev[eventId] + 1)
      }));

      showToast(
        isCurrentlyInterested 
          ? 'Removed from interested' 
          : 'Marked as interested!',
        'success'
      );
    } catch (error) {
      console.error('Error updating interest:', error);
      showToast(error.response?.data?.message || 'Failed to update interest', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleShare = async (event, e) => {
    if (e) e.stopPropagation();
    
    const titleText = getLocalizedText(event.title, lang);
    const dateText = getLocalizedText(event.dateNepali, lang);
    const gregText = getLocalizedText(event.greg, lang);
    
    const shareData = {
      title: titleText || 'Event',
      text: `${titleText} - ${dateText || gregText || ''}`,
      url: `${window.location.origin}/events/${event._id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        showToast('Event link copied to clipboard!', 'success');
      }
      
      // Track share
      try {
        await api.post(`/events/${event._id}/share`);
      } catch (e) {
        console.error('Share tracking error:', e);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        showToast('Failed to share event', 'error');
      }
    }
  };

  if (loading) {
    return (
      <section className="py-24" style={{ background: "linear-gradient(180deg, #faf8f5 0%, #ffffff 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-8 h-8 border-3 border-vermilion border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg, #faf8f5 0%, #ffffff 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl">
            {t.upcomingEvents || 'Upcoming Events'}
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {events.map((e, i) => {
            const titleText = getLocalizedText(e.title, lang);
            const descText = getLocalizedText(e.desc, lang);
            const isInterested = interestedEvents[e._id] || false;
            const count = interestedCounts[e._id] || 0;
            const isLoading = actionLoading[e._id] || false;

            return (
              <motion.div
                key={e._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] }}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <ClickableImg
                    src={e.photo || '/4.jpg'}
                    alt={titleText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onOpen={onOpen}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)" }}
                  />
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-display rounded-md pointer-events-none shadow-md border border-white/10">
                    {e.date ? formatEventDate(e.date) : 'Coming Soon'}
                  </div>
                  
                  {/* Interested count badge */}
                  {count > 0 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                      <Heart size={12} className="fill-red-400 text-red-400" />
                      {count}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-ink font-serif text-lg mb-2 group-hover:text-red-900 transition-colors line-clamp-2">
                    {titleText}
                  </h3>
                  <p className="text-sm text-mute leading-relaxed line-clamp-2">
                    {descText}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={(ev) => handleInterested(e._id, ev)}
                      disabled={isLoading}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all disabled:opacity-50 ${
                        isInterested
                          ? 'bg-vermilion text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <ThumbsUp size={14} />
                      )}
                      {isInterested ? 'Interested' : "I'm Interested"}
                    </button>
                    <button
                      onClick={(ev) => handleShare(e, ev)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all ml-auto"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center mt-12">
          <Link to="/events" className="text-vermilion font-medium text-sm hover:opacity-80 transition-all">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Teaser ───────────────────────────────────────────────────────────
function GalleryTeaser({ settings, onOpen }) {
  const { t, lang } = useLanguage();
  const galleryImages = settings?.galleryImages?.filter(img => img.enabled) || defaultGalleryImages;
  const imgs = galleryImages.slice(0, 8);
  const count = imgs.length;
  
  // Triple the images for seamless infinite scroll
  const tripledImages = [...imgs, ...imgs, ...imgs];
  const [isHovered, setIsHovered] = useState(false);

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  if (count === 0) return null;

  // SPEED CONTROL: Adjust this value to control scroll speed
  // Higher number = slower, Lower number = faster
  const SCROLL_DURATION = count * 8;

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl" style={{ color: "#7A0000" }}>
            {t.galleryTitle || 'Photo Gallery'}
          </h2>
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="flex gap-4"
            style={{
              width: 'max-content',
              animation: isHovered ? 'none' : `scroll-left ${SCROLL_DURATION}s linear infinite`,
            }}
          >
            {tripledImages.map((img, idx) => (
              <motion.div
                key={`${img.id}-${idx}`}
                className="flex-shrink-0 rounded-xl shadow-lg group cursor-zoom-in overflow-hidden relative"
                onClick={() => onOpen(img.src, getLocalizedText(img.alt))}
                style={{ 
                  width: 280,
                  height: 280
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={img.src}
                  alt={getLocalizedText(img.alt)}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)" }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${(count / 3) * 100}%);
            }
          }
        `}</style>

        <div className="text-center mt-8">
          <Link
            to="/gallery"
            className="text-vermilion font-medium text-sm hover:opacity-80 transition-all"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Live Darshan ────────────────────────────────────────────────────────────
function LiveDarshan({ settings }) {
  const { t, lang } = useLanguage();
  const [videoError, setVideoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [useAlternativeEmbed, setUseAlternativeEmbed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);
  
  // Default live video with proper autoplay URL
  const liveVideo = settings?.liveVideo || {
    enabled: true,
    url: 'https://www.youtube.com/embed/aPGvK6tJMXk?autoplay=1&mute=1&playsinline=1&rel=0',
    title: { en: 'Live Darshan', ne: 'लाइभ दर्शन' },
    description: { en: 'Experience the divine presence of Lord Ram from anywhere in the world', ne: 'संसारको कुनै पनि स्थानबाट भगवान रामको दिव्य उपस्थिति अनुभव गर्नुहोस्' },
  };
  const timings = settings?.timings || { open: '05:00 AM', close: '08:00 PM' };

  // ── YouTube URL Parser with Autoplay Support ──────────────────────────────
  const parseYouTubeUrl = (url) => {
    let videoId = null;
    let playlistId = null;
    let embedUrl = null;
    let watchUrl = null;
    let isLiveStream = false;

    // Clean the URL
    url = url.trim();

    // Check if it's already an embed URL with proper parameters
    if (url.includes('/embed/')) {
      embedUrl = url;
      const match = url.match(/\/embed\/([^?]+)/);
      if (match) videoId = match[1];
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      // Check if URL already has autoplay and mute parameters
      if (!url.includes('autoplay=1')) {
        // Add autoplay and mute if missing
        const separator = url.includes('?') ? '&' : '?';
        embedUrl = `${url}${separator}autoplay=1&mute=1&playsinline=1&rel=0`;
      }
      return { videoId, playlistId, embedUrl, watchUrl, isLiveStream };
    }

    // Extract video ID from youtube.com/watch?v=
    if (url.includes('youtube.com/watch?v=')) {
      const params = new URLSearchParams(url.split('?')[1]);
      videoId = params.get('v');
      playlistId = params.get('list');
      watchUrl = url;
    }
    // Extract from youtu.be/
    else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')[1]?.split('?');
      videoId = parts?.[0];
      if (parts?.[1]) {
        const params = new URLSearchParams(parts[1]);
        playlistId = params.get('list');
      }
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Extract from youtube.com/embed/
    else if (url.includes('youtube.com/embed/')) {
      const parts = url.split('youtube.com/embed/')[1]?.split('?');
      videoId = parts?.[0];
      if (parts?.[1]) {
        const params = new URLSearchParams(parts[1]);
        playlistId = params.get('list');
      }
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Extract from youtube.com/shorts/
    else if (url.includes('youtube.com/shorts/')) {
      const parts = url.split('youtube.com/shorts/')[1]?.split('?');
      videoId = parts?.[0];
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Extract from live stream URL
    else if (url.includes('/live/')) {
      const match = url.match(/\/live\/([^?]+)/);
      if (match) videoId = match[1];
      isLiveStream = true;
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Extract from URL with v= parameter
    else if (url.includes('v=')) {
      const params = new URLSearchParams(url.split('?')[1]);
      videoId = params.get('v');
      playlistId = params.get('list');
      watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
    // Check if it's a live stream based on URL patterns
    else if (url.includes('live') || url.includes('stream')) {
      isLiveStream = true;
    }

    // ── BUILD EMBED URL WITH AUTOPLAY AND MUTE (REQUIRED FOR AUTOPLAY) ──
    const origin = window.location.origin;
    
    if (playlistId) {
      // Playlist embed with autoplay and mute
      embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1&origin=${origin}`;
    } else if (videoId) {
      // Video embed with autoplay and mute - REQUIRED for autoplay in modern browsers
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1&origin=${origin}`;
    } else {
      // Fallback: use a working default URL with autoplay
      embedUrl = 'https://www.youtube.com/embed/aPGvK6tJMXk?autoplay=1&mute=1&playsinline=1&rel=0';
      watchUrl = 'https://www.youtube.com/watch?v=aPGvK6tJMXk';
    }

    return { videoId, playlistId, embedUrl, watchUrl, isLiveStream };
  };

  const { videoId, playlistId, embedUrl, watchUrl, isLiveStream } = parseYouTubeUrl(liveVideo.url);

  // ─── ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURN ─────────────────────
  // ── Handle iframe load timeout ─────────────────────────────────────────────
  useEffect(() => {
    let timeoutId;
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        // If still loading after 15 seconds, show error
        if (!videoError) {
          setVideoError(true);
          setErrorMessage('Video is taking too long to load. Please try again.');
        }
      }, 15000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, videoError]);

  // ── NOW WE CAN DO EARLY RETURN AFTER ALL HOOKS ────────────────────────────
  if (!liveVideo.enabled) return null;

  const titleText = getLocalizedText(liveVideo.title, lang) || 'Live Darshan';
  const descText = getLocalizedText(liveVideo.description, lang) || 'Experience the divine presence of Lord Ram from anywhere in the world';

  // ── Handle iframe error ────────────────────────────────────────────────────
  const handleIframeError = (e) => {
    console.error('YouTube iframe error:', e);
    setVideoError(true);
    setErrorMessage('Video playback error. Please try again or watch on YouTube directly.');
    setIsLoading(false);
  };

  // ── Handle iframe load success ─────────────────────────────────────────────
  const handleIframeLoad = () => {
    setIsLoading(false);
    setVideoError(false);
    setErrorMessage('');
  };

  // ── Retry function ──────────────────────────────────────────────────────────
  const handleRetry = () => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    setVideoError(false);
    setErrorMessage('');
    setIsLoading(true);
    
    // Toggle between embed methods if retry count > 2
    if (newRetryCount >= 2) {
      setUseAlternativeEmbed(true);
    }
    
    // Reset after 5 retries to try original again
    if (newRetryCount >= 5) {
      setUseAlternativeEmbed(false);
      setRetryCount(0);
    }
  };

  // ── Get embed URL based on retry attempts ──────────────────────────────────
  const getEmbedUrl = () => {
    if (useAlternativeEmbed && videoId) {
      // Alternative: no autoplay to avoid some errors, but still muted
      const origin = window.location.origin;
      return `https://www.youtube.com/embed/${videoId}?mute=1&playsinline=1&rel=0&enablejsapi=1&origin=${origin}`;
    }
    if (useAlternativeEmbed && playlistId) {
      const origin = window.location.origin;
      return `https://www.youtube.com/embed/videoseries?list=${playlistId}&mute=1&playsinline=1&rel=0&enablejsapi=1&origin=${origin}`;
    }
    return embedUrl;
  };

  const currentEmbedUrl = getEmbedUrl();

  return (
    <section className="bg-red-900 text-white py-20 border-t border-line">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-white">
          {titleText}
        </h2>
        <p className="mt-3 text-white/70">
          {descText}
        </p>
        
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg border border-white/20 bg-black relative">
          {/* Loading Spinner */}
          {isLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-white/70 text-sm">Loading live stream...</span>
              </div>
            </div>
          )}

          {!videoError ? (
            // ── Iframe with proper autoplay support ──
            <iframe
              key={`youtube-iframe-${retryCount}`}
              ref={iframeRef}
              className="w-full h-full"
              src={currentEmbedUrl}
              title="Live Darshan"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms allow-popups"
              onError={handleIframeError}
              onLoad={handleIframeLoad}
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            // ── Error fallback UI ──
            <div className="w-full h-full flex items-center justify-center flex-col gap-4 p-6 bg-black/90">
              <div className="text-4xl mb-2">📺</div>
              <div className="text-white/80 text-sm max-w-md text-center">
                <p className="font-semibold mb-1">Unable to load the live stream</p>
                <p className="text-white/60 text-xs">{errorMessage || 'The live stream may be unavailable or restricted in your region.'}</p>
              </div>
              
              {videoId && (
                <div className="text-white/40 text-xs max-w-md text-center">
                  <p>Try these options:</p>
                </div>
              )}
              
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <span>🔄</span> Retry {retryCount > 0 && `(${retryCount})`}
                </button>
                
                {watchUrl && (
                  <a 
                    href={watchUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <span>▶</span> Watch on YouTube
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-vermilion/30 hover:bg-[#a83a0c] hover:-translate-y-0.5 transition-all" style={{ backgroundColor: "#7A0000", color: "white" }}>
            {t.heroCta2 || 'Book Puja'} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white border border-white/50 hover:bg-white/10 transition-all">
            {t.navDonate || 'Donate'}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Home Page ──────────────────────────────────────────────────────────
const HomePage = () => {
  const { modal, open, close } = useImageModal();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchData = async () => {
      try {
        const [settingsRes, eventsRes] = await Promise.all([
          api.get('/admin/settings'),
          api.get('/events/upcoming')
        ]);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-soft text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const quote = settings?.quotes?.['en'] || settings?.quotes?.en || 'Where there is righteousness in the heart, there is beauty in the character.';

  return (
    <>
      <Hero settings={settings} />
      <QuoteStrip quote={quote} />
      <AboutPreview settings={settings} onOpen={open} />
      <EventsTeaser onOpen={open} />
      <GalleryTeaser settings={settings} onOpen={open} />
      <LiveDarshan settings={settings} />

      {modal && (
        <ImageModal src={modal.src} alt={modal.alt} onClose={close} />
      )}
    </>
  );
};

export default HomePage;