// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useLanguage } from '../../context/LanguageContext';
// import api from '../../services/api';
// import { Phone, Mail, MapPin, Sun } from 'lucide-react';

// const Footer = () => {
//   const { t, lang } = useLanguage();
//   const [settings, setSettings] = useState(null);

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const response = await api.get('/admin/settings');
//         setSettings(response.data);
//       } catch (error) {
//         console.error('Error fetching settings:', error);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const logoText = settings?.logo?.text?.[lang] || t.templeName;
//   const logoPhoto = settings?.logo?.photo || null;

//   return (
//     <footer className="bg-white border-t border-line">
//       <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
//           {/* Brand */}
//           <div>
//             <div className="flex items-center gap-2.5">
//               <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-vermilion to-maroon-deep text-white flex items-center justify-center overflow-hidden">
//                 {logoPhoto ? (
//                   <img src={logoPhoto} alt="Logo" className="w-full h-full object-cover" />
//                 ) : (
//                   <Sun size={16} />
//                 )}
//               </div>
//               <span className="font-serif font-bold text-lg text-ink">{logoText}</span>
//             </div>
//             <p className="text-sm text-ink-soft mt-3 flex items-center gap-1.5">
//               <MapPin size={14} /> {t.templeAddressLine}
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h5 className="text-xs font-extrabold text-ink uppercase tracking-wider mb-3">{t.quickLinks}</h5>
//             <div className="flex flex-col gap-1.5">
//               {[
//                 { path: '/about', label: t.navAbout },
//                 { path: '/history', label: t.navHistory },
//                 { path: '/events', label: t.navEvents },
//                 { path: '/donate', label: t.navDonate },
//               ].map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className="text-sm text-ink-soft hover:text-vermilion transition-colors"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Contact */}
//           <div>
//             <h5 className="text-xs font-extrabold text-ink uppercase tracking-wider mb-3">{t.followUs}</h5>
//             <div className="flex flex-col gap-2">
//               <p className="text-sm text-ink-soft flex items-center gap-2">
//                 <Phone size={14} className="text-vermilion" /> +977-1-4XXXXXX
//               </p>
//               <p className="text-sm text-ink-soft flex items-center gap-2">
//                 <Mail size={14} className="text-vermilion" /> info@ramchandratemple.org.np
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-line mt-8 pt-6 text-center">
//           <p className="text-xs text-ink-soft">🕉 {t.templeName} — {t.rightsReserved}</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Sun, 
  Facebook, 
  Youtube, 
  Instagram, 
  Twitter,
  ArrowRight,
  Heart,
  Clock
} from 'lucide-react';

const Footer = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
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

  const logoText = settings?.logo?.text?.[lang] || t.templeName || 'Shree Ramchandra Temple';
  const logoPhoto = settings?.logo?.photo || null;
  const timings = settings?.timings || { open: '05:00 AM', close: '08:00 PM' };
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/about', label: t.navAbout || 'About Us' },
    { path: '/history', label: t.navHistory || 'History' },
    { path: '/events', label: t.navEvents || 'Events' },
    { path: '/gallery', label: t.navGallery || 'Gallery' },
    { path: '/booking', label: t.navBooking || 'Book Puja' },
    { path: '/donate', label: t.navDonate || 'Donate' },
    { path: '/contact', label: t.navContact || 'Contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vermilion to-maroon-deep text-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg shadow-vermilion/20">
                {logoPhoto ? (
                  <img src={logoPhoto} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Sun size={22} />
                )}
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-ink block leading-tight">{logoText}</span>
                <span className="text-xs text-ink-soft">Gaushala, Kathmandu</span>
              </div>
            </div>
            
            <p className="text-sm text-ink-soft leading-relaxed mt-3 max-w-sm">
              {t.footerDescription || 'A sacred Vaishnava temple dedicated to Lord Ram, Sita, and Lakshman, serving devotees for generations on the banks of the Bagmati River.'}
            </p>

            {/* Temple Timings */}
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
              <Clock size={16} className="text-vermilion" />
              <span>
                <span className="font-medium text-ink">{t.openHours || 'Darshan'}:</span> {timings.open} – {timings.close}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-50 hover:bg-vermilion/10 text-ink-soft hover:text-vermilion flex items-center justify-center transition-all duration-300 border border-gray-100 hover:border-vermilion/20"
                    aria-label={social.label}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-extrabold text-ink uppercase tracking-wider mb-4">
              {t.quickLinks || 'Quick Links'}
            </h5>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-ink-soft hover:text-vermilion transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-xs font-extrabold text-ink uppercase tracking-wider mb-4">
              {t.contactInfo || 'Contact Info'}
            </h5>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-vermilion flex-shrink-0 mt-0.5" />
                <span className="text-sm text-ink-soft leading-relaxed">
                  {t.templeAddressLine || 'Battisputali, Gaushala, Kathmandu, Nepal'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-vermilion flex-shrink-0" />
                <span className="text-sm text-ink-soft">+977-1-4XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-vermilion flex-shrink-0" />
                <span className="text-sm text-ink-soft">info@ramchandratemple.org.np</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Donate CTA */}
          <div>
            <h5 className="text-xs font-extrabold text-ink uppercase tracking-wider mb-4">
              {t.support || 'Support Us'}
            </h5>
            <p className="text-sm text-ink-soft leading-relaxed mb-4">
              {t.footerDonateText || 'Help us preserve this sacred place for generations to come.'}
            </p>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all shadow-lg shadow-vermilion/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Heart size={16} />
              {t.navDonate || 'Donate Now'}
            </Link>

            {/* Quick stats */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-ink-soft">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span>{t.footerOnline || 'Online'} 24/7</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{t.footerSecure || 'Secure'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-ink-soft/70">
              © {currentYear} {logoText}. {t.rightsReserved || 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-4 text-xs text-ink-soft/70">
              <Link to="/privacy" className="hover:text-vermilion transition-colors">
                {t.privacy || 'Privacy Policy'}
              </Link>
              <span className="w-px h-4 bg-gray-200" />
              <Link to="/terms" className="hover:text-vermilion transition-colors">
                {t.terms || 'Terms of Service'}
              </Link>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1">
                <span>🕉</span>
                <span>{t.footerBlessing || 'Jai Shree Ram'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;