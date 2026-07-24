import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Youtube, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

const iconMap = {
  Facebook: Facebook,
  Youtube: Youtube,
  Instagram: Instagram,
  Twitter: Twitter,
};

const SocialFloating = () => {
  const { socialLinks, loading, isVisible, isAtBottom } = useSocial();

  // Don't show if loading, no links, or at bottom (footer area)
  if (loading || socialLinks.length === 0 || isAtBottom) {
    return null;
  }

  // Also hide if not visible (scrolled down)
  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
        style={{
          top: isAtBottom ? 'auto' : '50%',
          bottom: isAtBottom ? 'calc(8rem + 16px)' : 'auto',
          transition: 'bottom 0.3s ease',
        }}
      >
        {/* Social Links - No Share Icon */}
        {socialLinks.map((link, index) => {
          const Icon = iconMap[link.icon] || MessageCircle;
          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 text-ink-soft hover:text-white transition-all duration-300 group"
              style={{
                color: link.color,
                borderColor: `${link.color}30`,
              }}
              title={link.label}
            >
              <Icon size={18} className="relative z-10" />
              
              {/* Tooltip */}
              <span className="absolute right-full mr-3 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {link.label}
              </span>
              
              {/* Hover background */}
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: `${link.color}20` }}
              />
            </motion.a>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default SocialFloating;