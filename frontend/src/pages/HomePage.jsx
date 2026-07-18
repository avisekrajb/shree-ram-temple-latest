// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useLanguage } from '../context/LanguageContext';
// import api from '../services/api';
// import {
//   Hand, MapPinned, Clock, QuoteIcon, ChevronRight,
//   CalendarClock, Gift, Flower2, Star
// } from 'lucide-react';
// import TempleIcon from '../components/common/TempleIcon';

// const HomePage = () => {
//   const { t, lang } = useLanguage();
//   const navigate = useNavigate();
//   const [settings, setSettings] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [videoError, setVideoError] = useState(false);
//   const fetched = useRef(false);

//   useEffect(() => {
//     if (fetched.current) return;
//     fetched.current = true;

//     const fetchData = async () => {
//       try {
//         const [settingsRes, eventsRes] = await Promise.all([
//           api.get('/admin/settings'),
//           api.get('/events/upcoming')
//         ]);
//         setSettings(settingsRes.data);
//         setEvents(eventsRes.data.slice(0, 3));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-ink-soft text-sm">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const heroVideo = settings?.heroVideo;
//   const heroPoster = settings?.heroPoster || 'linear-gradient(160deg,#7A1F2B 0%,#5B1420 45%,#2B1810 100%)';
//   const quote = settings?.quotes?.[lang] || settings?.quotes?.en;
//   const timings = settings?.timings || { open: '05:00 AM', close: '08:00 PM' };
//   const about = settings?.about || {};

//   return (
//     <main>
//       {/* Hero Section with Cloudinary Video */}
//       <section 
//         className="relative min-h-[70vh] md:min-h-[78vh] flex items-center justify-center overflow-hidden text-white"
//         style={{ background: heroVideo && !videoError ? '#000' : heroPoster }}
//       >
//         {heroVideo && !videoError && (
//           <video 
//             className="absolute inset-0 w-full h-full object-cover"
//             src={heroVideo}
//             autoPlay 
//             muted 
//             loop 
//             playsInline
//             onError={() => setVideoError(true)}
//           />
//         )}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        
//         <div className="relative z-10 text-center px-4 max-w-3xl flex flex-col items-center gap-3.5">
//           <span className="text-5xl text-marigold animate-pulse">🕉</span>
//           <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg">{t.templeName}</h1>
//           <p className="text-base md:text-lg text-marigold font-semibold drop-shadow">{t.heroTagline}</p>
//           <p className="text-sm md:text-base text-white/90 max-w-lg drop-shadow">{t.heroSub}</p>
          
//           <div className="flex flex-wrap gap-3 justify-center mt-2">
//             <button 
//               onClick={() => navigate('/booking')}
//               className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold text-sm bg-vermilion text-white shadow-lg shadow-vermilion/30 hover:bg-[#a83a0c] hover:-translate-y-0.5 transition-all"
//             >
//               <Hand size={16} /> {t.heroCta2}
//             </button>
//             <button 
//               onClick={() => navigate('/contact')}
//               className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold text-sm bg-white/20 text-white border border-white/50 backdrop-blur-sm hover:bg-white/30 transition-all"
//             >
//               <MapPinned size={16} /> {t.heroCta}
//             </button>
//           </div>
          
//           <div className="flex items-center gap-2 text-xs md:text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mt-3">
//             <Clock size={15} />
//             <span>{t.openHours}: {timings.open} – {timings.close}</span>
//           </div>
//         </div>
//       </section>

//       {/* Quote Strip */}
//       <div className="bg-maroon text-white flex items-start gap-3 px-4 md:px-6 py-4 md:py-5 max-w-7xl mx-auto -mt-px rounded-b-xl shadow-lg">
//         <QuoteIcon size={18} className="text-marigold flex-shrink-0 mt-1" />
//         <div>
//           <span className="text-[10px] md:text-xs uppercase tracking-widest text-marigold font-bold">{t.quoteLabel}</span>
//           <p className="font-serif text-sm md:text-base text-white/90 mt-1 leading-relaxed">{quote}</p>
//         </div>
//       </div>

//       {/* About Preview */}
//       <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//           <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-maroon to-maroon-deep shadow-xl">
//             {about.photo ? (
//               <img 
//                 src={about.photo} 
//                 alt="Temple" 
//                 className="w-full h-full object-cover"
//                 loading="lazy"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-white/50">
//                 <TempleIcon size={64} />
//               </div>
//             )}
//             <div className="absolute inset-3 border border-white/20 rounded-xl pointer-events-none" />
//           </div>
//           <div className="flex flex-col gap-4 items-start">
//             <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-vermilion bg-vermilion/10 px-3 py-1.5 rounded-full">
//               <TempleIcon size={14} /> {t.aboutBadge}
//             </span>
//             <h2 className="text-2xl md:text-3xl font-serif">{about.title?.[lang] || t.aboutTitleDefault}</h2>
//             <p className="text-sm text-ink-soft leading-relaxed">
//               {about.text?.[lang] || t.aboutTextDefault}
//             </p>
//             <ul className="list-none p-0 m-0 flex flex-col gap-2">
//               <li className="flex items-center gap-2 text-sm text-ink-soft">
//                 <Star size={14} className="text-vermilion" /> {t.openHours}: {timings.open} – {timings.close}
//               </li>
//               <li className="flex items-center gap-2 text-sm text-ink-soft">
//                 <MapPinned size={14} className="text-vermilion" /> {t.templeAddressLine}
//               </li>
//             </ul>
//             <button 
//               onClick={() => navigate('/about')}
//               className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm border-2 border-maroon text-maroon hover:bg-maroon hover:text-white transition-all"
//             >
//               {t.navAbout} <ChevronRight size={15} />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Divider */}
//       <svg className="block w-full h-8 md:h-10 fill-white" viewBox="0 0 1200 60" preserveAspectRatio="none">
//         <path d="M0,60 L0,30 Q100,0 200,30 Q300,55 400,20 Q500,-5 600,25 Q700,50 800,20 Q900,-5 1000,25 Q1100,50 1200,30 L1200,60 Z" />
//       </svg>

//       {/* Events */}
//       <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
//         <div className="text-center max-w-lg mx-auto mb-8 flex flex-col items-center gap-2">
//           <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-vermilion bg-vermilion/10 px-3 py-1.5 rounded-full">
//             <Flower2 size={13} /> {t.navEvents}
//           </span>
//           <h2 className="text-2xl md:text-3xl font-serif">{t.upcomingEvents}</h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {events.length > 0 ? (
//             events.map((event) => (
//               <div key={event._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
//                 <div className="relative aspect-[16/10] bg-gradient-to-br from-vermilion to-maroon-deep">
//                   {event.photo ? (
//                     <img 
//                       src={event.photo} 
//                       alt={event.title?.en} 
//                       className="w-full h-full object-cover"
//                       loading="lazy"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-white/40">
//                       <CalendarClock size={32} />
//                     </div>
//                   )}
//                   <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center shadow-lg">
//                     <span className="block font-extrabold text-base text-maroon">
//                       {new Date(event.date).getDate()}
//                     </span>
//                     <small className="text-[9px] uppercase text-ink-soft font-semibold">
//                       {new Date(event.date).toLocaleString('en-US', { month: 'short' })}
//                     </small>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h4 className="text-sm md:text-base font-serif font-semibold">{event.title?.[lang] || event.title?.en}</h4>
//                   <p className="text-xs text-ink-soft mt-1 line-clamp-2">{event.desc?.[lang] || event.desc?.en}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-ink-soft col-span-full py-8">{t.noEventsUpcoming}</p>
//           )}
//         </div>
//         <div className="text-center mt-8">
//           <button 
//             onClick={() => navigate('/events')}
//             className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm border-2 border-maroon text-maroon hover:bg-maroon hover:text-white transition-all"
//           >
//             {t.navEvents} <ChevronRight size={15} />
//           </button>
//         </div>
//       </section>

//       {/* Donate Banner */}
//       <section className="bg-gradient-to-r from-vermilion to-maroon-deep text-white mt-5">
//         <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
//           <div>
//             <h3 className="text-2xl md:text-3xl font-serif">{t.donateTitle}</h3>
//             <p className="text-white/85 text-sm max-w-md mt-1">{t.donateIntro}</p>
//           </div>
//           <button 
//             onClick={() => navigate('/donate')}
//             className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-white text-maroon hover:bg-marigold hover:text-white transition-all shadow-lg"
//           >
//             <Gift size={16} /> {t.navDonate}
//           </button>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default HomePage;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight, X, Download, Play, Pause } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Local images and video from public folder
const heroVideo = '/Hero1.mp4';
const heroImage1 = '/1.jpg';
const heroImage2 = '/2.jpg';
const heroImage3 = '/3.jpg';
const heroImage4 = '/4.jpg';
const heroImage5 = '/6.jpg';

// ─── Fullscreen Image Modal ───────────────────────────────────────────────────
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

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  const { t, lang } = useLanguage();
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

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
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src={heroVideo}
        />
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
          <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-vermilion text-white font-semibold text-sm shadow-lg shadow-vermilion/30 hover:bg-[#a83a0c] hover:-translate-y-0.5 transition-all">
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

// ─── About Preview ────────────────────────────────────────────────────────────
function AboutPreview({ onOpen }) {
  const { t, lang } = useLanguage();
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const imagesRef = useRef(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

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
  const title = about.title?.[lang] || t.aboutTitleDefault || 'About the Temple';
  const text = about.text?.[lang] || t.aboutTextDefault || 'Nestled in the heart of Gaushala, Shree Ramchandra Temple has stood as a beacon of devotion for generations.';

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div ref={textRef}>
          <h2 className="font-serif text-3xl sm:text-4xl mb-6" style={{ color: "#520505" }}>
            {title}
          </h2>
          <p className="text-base sm:text-lg text-mute leading-relaxed mb-8">
            {text}
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-vermilion text-sm font-medium hover:gap-3 transition-all"
          >
            {t.navAbout || 'Learn More'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div ref={imagesRef} className="grid grid-cols-2 gap-4">
          <div className="img-card overflow-hidden rounded-lg border border-line shadow-lg">
            <ClickableImg
              src={heroImage2}
              alt="Temple Interior"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              onOpen={onOpen}
            />
          </div>
          <div className="img-card overflow-hidden rounded-lg border border-line shadow-lg">
            <ClickableImg
              src={heroImage3}
              alt="Temple Deity"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              onOpen={onOpen}
            />
          </div>
          <div className="img-card col-span-2 overflow-hidden rounded-lg border border-line shadow-lg">
            <ClickableImg
              src={heroImage1}
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

// ─── Events Teaser ────────────────────────────────────────────────────────────
function EventsTeaser({ onOpen }) {
  const { t, lang } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events/upcoming');
        setEvents(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching events:', error);
        // Fallback events
        setEvents([
          { id: '1', title: { en: 'Ram Navami', ne: 'राम नवमी' }, desc: { en: 'Grand celebration of Lord Ram\'s birth', ne: 'भगवान रामको जन्मोत्सव' }, image: heroImage4, date: '2026-04-15' },
          { id: '2', title: { en: 'Sita Jayanti', ne: 'सीता जयन्ती' }, desc: { en: 'Celebration of Goddess Sita\'s birth', ne: 'देवी सीताको जन्मोत्सव' }, image: heroImage3, date: '2026-05-10' },
          { id: '3', title: { en: 'Vivah Panchami', ne: 'विवाह पञ्चमी' }, desc: { en: 'Celebration of divine marriage', ne: 'दिव्य विवाहको समारोह' }, image: heroImage5, date: '2026-12-15' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  if (loading) return null;

  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg, #faf8f5 0%, #ffffff 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl">
            {t.upcomingEvents || 'Upcoming Events'}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((e, i) => (
            <motion.div
              key={e.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] }}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <ClickableImg
                  src={e.image || heroImage4}
                  alt={getLocalizedText(e.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onOpen={onOpen}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)" }}
                />
                <div className="absolute top-4 right-4 bg-red-900 text-white px-3.5 py-1.5 text-xs font-display rounded-md pointer-events-none shadow-md">
                  {e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Coming Soon'}
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-white/90 text-xs uppercase drop-shadow tracking-widest">
                    {e.date || ''}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="text-ink font-serif text-xl sm:text-2xl mb-3 group-hover:text-red-900 transition-colors">
                  {getLocalizedText(e.title)}
                </h3>
                <p className="text-sm sm:text-base text-mute leading-relaxed line-clamp-3">
                  {getLocalizedText(e.desc)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/events" className="text-vermilion font-medium text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            {t.navEvents || 'View All'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Teaser ───────────────────────────────────────────────────────────
function GalleryTeaser({ onOpen }) {
  const { t, lang } = useLanguage();
  const galleryImages = [
    { id: 'g1', src: heroImage1, alt: { en: 'Temple View', ne: 'मन्दिर दृश्य' } },
    { id: 'g2', src: heroImage2, alt: { en: 'Temple Interior', ne: 'मन्दिर भित्री भाग' } },
    { id: 'g3', src: heroImage3, alt: { en: 'Temple Deity', ne: 'मन्दिर देवता' } },
    { id: 'g4', src: heroImage4, alt: { en: 'Festival Celebration', ne: 'महोत्सव मनाउँदै' } },
    { id: 'g5', src: heroImage5, alt: { en: 'Devotional Gathering', ne: 'भक्ति भेला' } },
    { id: 'g6', src: heroImage1, alt: { en: 'Temple Architecture', ne: 'मन्दिर वास्तुकला' } },
    { id: 'g7', src: heroImage2, alt: { en: 'Evening Aarti', ne: 'साँझको आरती' } },
    { id: 'g8', src: heroImage3, alt: { en: 'Sacred Rituals', ne: 'पवित्र अनुष्ठान' } },
  ];

  const imgs = galleryImages.slice(0, 8);
  const count = imgs.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  const next = useCallback(() => setCurrent(p => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrent(p => (p - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  const getOffset = (i) => {
    let diff = i - current;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl" style={{ color: "#7A0000" }}>
            {t.galleryTitle || 'Photo Gallery'}
          </h2>
        </div>

        <div
          className="relative mx-auto"
          style={{ height: 440, maxWidth: 1200 }}
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {imgs.map((g, i) => {
            const offset = getOffset(i);
            const isActive = offset === 0;
            const absOff = Math.abs(offset);
            const visible = absOff <= 3;

            if (!visible) return null;

            return (
              <motion.div
                key={g.id}
                className="absolute top-0 cursor-zoom-in"
                style={{ width: 320, left: "50%", marginLeft: -160 }}
                animate={{
                  x: offset * 260,
                  scale: isActive ? 1 : 0.82 - absOff * 0.04,
                  zIndex: count - absOff,
                  opacity: absOff <= 2 ? 1 : 0,
                  rotateY: offset * -8,
                }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                onClick={() => {
                  if (isActive) { onOpen(g.src, getLocalizedText(g.alt)); }
                  else { pause(); setCurrent(i); }
                }}
              >
                <div
                  className="relative overflow-hidden rounded-xl shadow-lg w-full group"
                  style={{
                    height: isActive ? 420 : 360,
                    transition: "height 0.5s cubic-bezier(0.25,1,0.5,1)",
                  }}
                >
                  <img
                    src={g.src}
                    alt={getLocalizedText(g.alt)}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium leading-snug drop-shadow-lg">
                      {getLocalizedText(g.alt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <button
            onClick={() => { pause(); prev(); }}
            className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors backdrop-blur-sm"
            style={{ color: "#7A0000" }}
            aria-label="Previous"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={() => { pause(); next(); }}
            className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors backdrop-blur-sm"
            style={{ color: "#7A0000" }}
            aria-label="Next"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {imgs.map((_, i) => (
            <button
              key={i}
              onClick={() => { pause(); setCurrent(i); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                background: i === current ? "#7A0000" : "#d4d4d4",
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/gallery"
            className="text-vermilion font-medium text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            {t.navGallery || 'View All'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Live Darshan ─────────────────────────────────────────────────────────────
function LiveDarshan() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const timings = settings?.timings || { open: '05:00 AM', close: '08:00 PM' };

  return (
    <section className="bg-red-900 text-white py-20 border-t border-line">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-white">
          {t.liveDarshan || 'Live Darshan'}
        </h2>
        <p className="mt-3 text-white/70">
          {t.liveDarshanDesc || 'Experience the divine presence of Lord Ram from anywhere in the world'}
        </p>
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg border border-white/20">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf&autoplay=1&mute=1"
            title="Live Aarti"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-vermilion text-white font-semibold text-sm shadow-lg shadow-vermilion/30 hover:bg-[#a83a0c] hover:-translate-y-0.5 transition-all">
            {t.heroCta2 || 'Book Puja'} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white border border-white/50 hover:bg-white/10 transition-all">
            {t.navDonate || 'Donate'}
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-serif font-bold">{timings.open}</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">{t.openHours || 'Opening Time'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl font-serif font-bold">{timings.close}</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">{t.closeHours || 'Closing Time'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 col-span-2 sm:col-span-1">
            <div className="text-2xl font-serif font-bold">🕉</div>
            <div className="text-xs text-white/60 uppercase tracking-wider">{t.dailyAarti || 'Daily Aarti'}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Home Page ──────────────────────────────────────────────────────────
const HomePage = () => {
  const { modal, open, close } = useImageModal();

  return (
    <>
      <Hero />
      <AboutPreview onOpen={open} />
      <EventsTeaser onOpen={open} />
      <GalleryTeaser onOpen={open} />
      <LiveDarshan />

      {modal && (
        <ImageModal src={modal.src} alt={modal.alt} onClose={close} />
      )}
    </>
  );
};

export default HomePage;
