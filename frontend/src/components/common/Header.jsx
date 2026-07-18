import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Home, Info, ScrollText, CalendarDays, ImageIcon, Hand, Gift, Phone,
  Globe, User, LogOut, Menu, X, ChevronDown, MapPin, Sun, BadgeCheck,
  CircleDot, LayoutDashboard, ClipboardList, ChevronRight, Plus, Camera
} from 'lucide-react';

const Header = ({ onLogout, setAuthModal }) => {
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const headerRef = useRef(null);

  // Fetch admin settings for logo
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

  const navItems = [
    { key: '/', label: t.navHome, icon: Home, protected: false },
    { key: '/about', label: t.navAbout, icon: Info, protected: false },
    { key: '/history', label: t.navHistory, icon: ScrollText, protected: false },
    { key: '/events', label: t.navEvents, icon: CalendarDays, protected: false },
    { key: '/gallery', label: t.navGallery, icon: ImageIcon, protected: false },
    { key: '/booking', label: t.navBooking, icon: Hand, protected: true },
    { key: '/donate', label: t.navDonate, icon: Gift, protected: true },
    { key: '/contact', label: t.navContact, icon: Phone, protected: false },
  ];

  const languages = [
    { code: 'en', label: t.langEnglish },
    { code: 'ne', label: t.langNepali },
    { code: 'hi', label: t.langHindi },
    { code: 'zh', label: t.langChinese },
    { code: 'ta', label: t.langTamil },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setLangMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleNavClick = (path, isProtected) => {
    setMobileNavOpen(false);
    if (isProtected && !user) {
      setAuthModal('login');
      return;
    }
    navigate(path);
  };

  const handleLangSelect = (code) => {
    setLang(code);
    setLangMenuOpen(false);
  };

  // Get user profile photo or fallback
  const userProfilePhoto = user?.profilePhoto || null;
  
  // Get logo from admin settings
  const logoPhoto = settings?.logo?.photo || null;
  const logoText = settings?.logo?.text?.[lang] || t.templeName;

  return (
    <header className="rt-header" ref={headerRef}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('/', false)} 
          className="flex items-center gap-2.5 bg-transparent border-0 p-0 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vermilion to-maroon-deep text-white flex items-center justify-center flex-shrink-0 overflow-hidden">
            {logoPhoto ? (
              <img src={logoPhoto} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Sun size={20} strokeWidth={2.2} />
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-bold text-sm md:text-base text-maroon">{logoText}</span>
            <span className="text-[10px] md:text-[11px] text-ink-soft flex items-center gap-1">
              <MapPin size={11} /> {t.templeSub}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key, item.protected)}
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
                isActive(item.key) 
                  ? 'bg-maroon text-white' 
                  : 'text-ink-soft hover:text-maroon hover:bg-maroon/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 bg-white border border-line rounded-full px-3 py-2 text-sm hover:border-vermilion transition-colors"
            >
              <Globe size={16} />
              <span className="font-bold text-xs hidden sm:inline">{lang.toUpperCase()}</span>
              <ChevronDown size={12} />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-line rounded-xl shadow-lg min-w-[180px] p-1.5 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangSelect(l.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-panel ${
                      lang === l.code ? 'text-vermilion font-bold' : 'text-ink'
                    }`}
                  >
                    {l.label}
                    {lang === l.code && <span className="text-vermilion">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={`flex items-center justify-center w-9 h-9 rounded-full border ${
                user ? 'bg-maroon text-white border-maroon' : 'bg-white border-line'
              } transition-colors overflow-hidden`}
            >
              {user ? (
                userProfilePhoto ? (
                  <img 
                    src={userProfilePhoto} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                )
              ) : (
                <User size={17} />
              )}
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-line rounded-xl shadow-lg min-w-[240px] p-2 z-50">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-line">
                      <div className="w-10 h-10 rounded-full bg-maroon text-white flex items-center justify-center font-bold text-base overflow-hidden">
                        {userProfilePhoto ? (
                          <img src={userProfilePhoto} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-ink-soft">{user.email}</div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          user.role === 'admin' ? 'bg-marigold/20 text-marigold' : 'bg-panel text-maroon'
                        }`}>
                          {user.role === 'admin' ? (
                            <BadgeCheck size={10} />
                          ) : (
                            <CircleDot size={10} />
                          )}
                          {user.role === 'admin' ? t.adminDashboard : t.profile}
                        </span>
                      </div>
                    </div>
                    <div className="py-1">
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => { navigate('/admin'); setProfileMenuOpen(false); }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-panel"
                        >
                          <span className="flex items-center gap-2">
                            <LayoutDashboard size={15} /> {t.adminDashboard}
                          </span>
                          <ChevronRight size={13} className="text-ink-soft" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => { navigate('/profile'); setProfileMenuOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-panel"
                          >
                            <span className="flex items-center gap-2">
                              <User size={15} /> {t.profile}
                            </span>
                            <ChevronRight size={13} className="text-ink-soft" />
                          </button>
                          <button
                            onClick={() => { navigate('/mybookings'); setProfileMenuOpen(false); }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-panel"
                          >
                            <span className="flex items-center gap-2">
                              <ClipboardList size={15} /> {t.myBookings}
                            </span>
                            <ChevronRight size={13} className="text-ink-soft" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => { handleNavClick('/donate', true); setProfileMenuOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-panel"
                      >
                        <span className="flex items-center gap-2">
                          <Gift size={15} /> {t.navDonate}
                        </span>
                        <ChevronRight size={13} className="text-ink-soft" />
                      </button>
                    </div>
                    <div className="border-t border-line pt-1">
                      <button
                        onClick={() => { onLogout(); setProfileMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={15} /> {t.logout}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setAuthModal('login'); setProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-panel"
                    >
                      <User size={15} /> {t.login}
                    </button>
                    <button
                      onClick={() => { setAuthModal('signup'); setProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-panel"
                    >
                      <Plus size={15} /> {t.signup}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden bg-white border border-line rounded-xl p-2.5 hover:border-vermilion transition-colors"
            aria-label="Menu"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white ${
        mobileNavOpen ? 'max-h-[calc(100vh-64px)] border-t border-line' : 'max-h-0'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key, item.protected)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm font-semibold border-b border-line ${
                isActive(item.key) ? 'text-vermilion bg-vermilion/5' : 'text-ink-soft'
              }`}
            >
              <Icon size={17} /> {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Header;