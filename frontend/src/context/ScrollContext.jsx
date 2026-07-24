import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ScrollContext = createContext(null);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};

export const ScrollProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const footerRef = useRef(null);
  const checkInterval = useRef(null);

  const checkScrollPosition = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollableHeight = documentHeight - windowHeight;
    
    // Show arrow when scrolled down more than 300px
    const shouldBeVisible = scrollY > 300;
    setIsVisible(shouldBeVisible);
    
    // Check if at bottom (within 150px of bottom - increased threshold)
    const atBottom = scrollY + windowHeight >= documentHeight - 150;
    setIsAtBottom(atBottom);
    
    // Calculate scroll progress (0 to 100)
    const progress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));

    // Check if footer is visible
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      const footerRect = footerElement.getBoundingClientRect();
      const isFooterVisible = footerRect.top < windowHeight && footerRect.bottom > 0;
      if (isFooterVisible) {
        setIsAtBottom(true);
      }
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    // Check position on mount
    setTimeout(checkScrollPosition, 100);

    // Add scroll listener with throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkScrollPosition, { passive: true });

    // Also check periodically for footer visibility
    checkInterval.current = setInterval(checkScrollPosition, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollPosition);
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [checkScrollPosition]);

  return (
    <ScrollContext.Provider value={{ isVisible, isAtBottom, scrollProgress, scrollToTop }}>
      {children}
    </ScrollContext.Provider>
  );
};