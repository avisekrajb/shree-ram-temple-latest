import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, onLogout, setAuthModal }) => {
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