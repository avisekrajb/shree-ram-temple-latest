// context/VisitorContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const VisitorContext = createContext(null);

export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitor must be used within VisitorProvider');
  }
  return context;
};

export const VisitorProvider = ({ children }) => {
  const location = useLocation();
  const [visitorId, setVisitorId] = useState(null);
  const [totalVisits, setTotalVisits] = useState(0);
  const trackedPages = useRef(new Set());
  const entryTime = useRef(null);
  const currentPage = useRef('');
  const isTracking = useRef(false);

  // Generate or retrieve session ID
  useEffect(() => {
    try {
      let sessionId = sessionStorage.getItem('visitor_session_id');
      if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem('visitor_session_id', sessionId);
      }
      setVisitorId(sessionId);

      const isNewSession = !sessionStorage.getItem('visitor_session_started');
      if (isNewSession) {
        sessionStorage.setItem('visitor_session_started', 'true');
        sessionStorage.setItem('visitor_visit_count', '1');
      } else {
        const count = parseInt(sessionStorage.getItem('visitor_visit_count') || '1');
        sessionStorage.setItem('visitor_visit_count', String(count + 1));
      }
      setTotalVisits(parseInt(sessionStorage.getItem('visitor_visit_count') || '1'));
    } catch (error) {
      console.error('Visitor session error:', error);
    }
  }, []);

  // Update time spent on page
  const updateTimeSpent = async (page, timeSpent) => {
    if (!visitorId) return;
    try {
      await api.post('/visitors/time', {
        sessionId: visitorId,
        page,
        timeSpent,
      });
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  };

  // Track page views
  useEffect(() => {
    if (!visitorId || isTracking.current) return;

    const currentPath = location.pathname;
    const pageTitle = document.title || 'Shree Ramchandra Temple';

    const pageKey = `${currentPath}`;
    if (trackedPages.current.has(pageKey)) {
      if (entryTime.current && currentPage.current) {
        const timeSpent = Math.floor((Date.now() - entryTime.current) / 1000);
        if (timeSpent > 0) {
          updateTimeSpent(currentPage.current, timeSpent);
        }
      }
      entryTime.current = Date.now();
      currentPage.current = currentPath;
      return;
    }

    trackedPages.current.add(pageKey);

    const trackVisitor = async () => {
      try {
        isTracking.current = true;
        const isNewSession = !sessionStorage.getItem('visitor_session_started');
        
        await api.post('/visitors/track', {
          sessionId: visitorId,
          page: currentPath,
          pageTitle: pageTitle,
          referrer: document.referrer || '',
          userAgent: navigator.userAgent,
          isNewVisitor: isNewSession,
          visitCount: parseInt(sessionStorage.getItem('visitor_visit_count') || '1'),
        });

        entryTime.current = Date.now();
        currentPage.current = currentPath;
        console.log('✅ Visitor tracked:', currentPath);
      } catch (error) {
        console.error('Error tracking visitor:', error);
      } finally {
        isTracking.current = false;
      }
    };

    const timeoutId = setTimeout(trackVisitor, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location, visitorId]);

  // Track time spent on page when leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (entryTime.current && currentPage.current) {
        const timeSpent = Math.floor((Date.now() - entryTime.current) / 1000);
        if (timeSpent > 0) {
          updateTimeSpent(currentPage.current, timeSpent);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  return (
    <VisitorContext.Provider value={{ visitorId, totalVisits }}>
      {children}
    </VisitorContext.Provider>
  );
};