import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { 
  User, Mail, Phone, X, Users, Award, MapPin
} from 'lucide-react';

// Team Member Card Component
const TeamCard = ({ member, onClick, index }) => {
  const { lang } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  
  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  const nameText = getLocalizedText(member.name);
  const roleText = getLocalizedText(member.role);
  const bioText = getLocalizedText(member.bio);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick(member)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden rounded-t-xl">
        {member.photo ? (
          <img
            src={member.photo}
            alt={nameText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vermilion to-maroon-deep flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-vermilion/20">
              {nameText.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Role badge overlay */}
        {roleText && (
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
              <Award size={12} />
              {roleText}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {nameText}
        </h3>
        
        {/* Show Role by default, Bio on hover */}
        <div className="min-h-[20px]">
          {isHovered && bioText ? (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed transition-all duration-300">
              {bioText}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mt-1 truncate transition-all duration-300">
              {roleText}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 truncate max-w-[120px] hover:text-vermilion transition-colors"
              title={`Send email to ${member.email}`}
            >
              <Mail size={12} className="flex-shrink-0" /> {member.email}
            </a>
          )}
          {member.phone && (
            <a
              href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 truncate max-w-[120px] hover:text-green-600 transition-colors"
              title={`Chat on WhatsApp`}
            >
              <Phone size={12} className="flex-shrink-0" /> {member.phone}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Member Detail Modal Component
const MemberModal = ({ member, isOpen, onClose, isMobile }) => {
  const { lang } = useLanguage();
  
  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  if (!member) return null;

  const nameText = getLocalizedText(member.name);
  const roleText = getLocalizedText(member.role);
  const bioText = getLocalizedText(member.bio);

  // Modal animation variants based on device
  const modalVariants = {
    mobile: {
      hidden: { y: "100%", opacity: 0 },
      visible: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 }
    },
    desktop: {
      hidden: { scale: 0.95, opacity: 0, y: 10 },
      visible: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.95, opacity: 0, y: 10 }
    }
  };

  const modalContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const currentVariant = isMobile ? 'mobile' : 'desktop';

  return (
    <AnimatePresence>
      {isOpen && member && (
        <motion.div
          variants={modalContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 z-50 ${isMobile ? 'flex items-end justify-center' : 'flex items-center justify-center'} bg-black/60 backdrop-blur-sm`}
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ 
              duration: 0.4, 
              ease: isMobile ? [0.16, 1, 0.3, 1] : "easeOut"
            }}
            className={`bg-white ${isMobile ? 'rounded-t-2xl w-full max-w-md max-h-[85vh]' : 'rounded-2xl max-w-md w-full max-h-[90vh]'} overflow-y-auto shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Drag handle indicator - only on mobile */}
              {isMobile && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>
              )}

              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Photo */}
              <div className={`aspect-[4/3] bg-gray-100 relative overflow-hidden ${isMobile ? 'rounded-t-2xl' : 'rounded-t-2xl'}`}>
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={nameText}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vermilion to-maroon-deep flex items-center justify-center text-white text-4xl font-bold">
                      {nameText.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 pb-8">
                {/* Name and Role */}
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {nameText}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {roleText}
                  </p>
                </div>

                {/* Bio */}
                {bioText && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {bioText}
                    </p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-vermilion transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-vermilion/10 transition-colors">
                        <Mail size={16} className="text-gray-500 group-hover:text-vermilion transition-colors" />
                      </div>
                      <span className="break-all">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <Phone size={16} className="text-gray-500 group-hover:text-green-600 transition-colors" />
                      </div>
                      <span>{member.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TeamPage = () => {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMobile, setIsMobile] = useState(false);
  
  const INITIAL_VISIBLE = 12;
  const INCREMENT = 4;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get('/admin/team');
        const sorted = response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
        const enabledMembers = sorted.filter(m => m.enabled !== false);
        setTeam(enabledMembers);
      } catch (error) {
        console.error('Error fetching team:', error);
        showToast(t.teamFetchError || 'Failed to load team members', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  // Get visible members (pagination)
  const visibleMembers = team.slice(0, visibleCount);
  const hasMore = team.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + INCREMENT, team.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">{t.loading || 'Loading team...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #faf8f5 100%)' }}
    >
      {/* Header */}
      <div className="pt-24 pb-8 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light" style={{ color: '#7A0000' }}>
            {t.teamTitle || 'हाम्रो टिम'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-mute max-w-xl mx-auto leading-relaxed">
            {t.teamSubtitle || 'मन्दिरको व्यवस्थापन र सेवामा समर्पित हाम्रो टिम'}
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {/* Team Grid */}
        {team.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">{t.teamNoMembers || 'No team members available'}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visibleMembers.map((member, index) => (
                <TeamCard
                  key={member._id}
                  member={member}
                  onClick={handleMemberClick}
                  index={index}
                />
              ))}
            </div>

            {/* Show More / Show Less */}
            {team.length > INITIAL_VISIBLE && (
              <div className="flex justify-center mt-8">
                {hasMore ? (
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    {t.viewMore || 'View More'} ({team.length - visibleCount} {t.more || 'more'})
                  </button>
                ) : (
                  <button
                    onClick={handleShowLess}
                    className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    {t.viewLess || 'View Less'}
                  </button>
                )}
              </div>
            )}

            {/* Footer Blessing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
              </div>
              <p className="text-sm text-ink-soft">
                {t.teamFooter || 'श्री रामचन्द्र मन्दिरको सेवामा समर्पित हाम्रो टिम'}
              </p>
              <p className="text-xs text-ink-soft/60 mt-1">
                {t.teamBlessing || 'जय श्री राम ! 🙏'}
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* Member Detail Modal */}
      <MemberModal
        member={selectedMember}
        isOpen={showModal}
        onClose={handleCloseModal}
        isMobile={isMobile}
      />
    </div>
  );
};

export default TeamPage;