import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import api from '../../services/api';

const Layout = ({ children, onLogout, setAuthModal }) => {
  const location = useLocation();

  useEffect(() => {
    // Track visitor on each page visit
    const trackVisitor = async () => {
      try {
        // Get or create session ID
        let sessionId = localStorage.getItem('visitor_session');
        if (!sessionId) {
          sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('visitor_session', sessionId);
        }
        
        await api.post('/visitors/track', { 
          sessionId,
          page: location.pathname 
        });
      } catch (error) {
        console.error('Track visitor error:', error);
      }
    };

    trackVisitor();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header onLogout={onLogout} setAuthModal={setAuthModal} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;