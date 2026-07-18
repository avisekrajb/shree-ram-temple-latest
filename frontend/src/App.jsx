import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { useToast } from './context/ToastContext';
import Layout from './components/common/Layout';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import NoticeModal from './components/modals/NoticeModal';

// Components
import AuthModal from './components/modals/AuthModal';
import ConfirmModal from './components/modals/ConfirmModal';
import ForgotPasswordModal from './components/modals/ForgotPasswordModal';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));

function App() {
  const { user, logout, loading } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const location = useLocation();
  const [authModal, setAuthModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [forgotModal, setForgotModal] = useState(false);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    setConfirmModal({
      open: true,
      title: t.logout,
      message: t.logoutPromptMsg,
      confirmLabel: t.yesLogout,
      cancelLabel: t.notNow,
      danger: true,
      onConfirm: () => {
        logout();
        setConfirmModal({ ...confirmModal, open: false });
        showToast(t.loggedOut, 'success');
      },
      onCancel: () => setConfirmModal({ ...confirmModal, open: false })
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" color="maroon" />
      </div>
    );
  }

  return (
    <>
      {/* Notice Modal - Shows on first visit */}
      <NoticeModal />

      {!isAdminRoute ? (
        <Layout onLogout={handleLogout} setAuthModal={setAuthModal}>
          <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <LoadingSpinner size="lg" color="maroon" />
            </div>
          }>
            <Routes>
              {/* Public Routes - Accessible without login */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/:tab" element={<GalleryPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/templeteams" element={<TeamPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              
              {/* Protected Routes - Require Login */}
              <Route path="/booking" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/mybookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
              
              {/* 404 - Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      ) : (
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-panel">
            <LoadingSpinner size="lg" color="maroon" />
          </div>
        }>
          <Routes>
            <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
          </Routes>
        </Suspense>
      )}

      {/* Auth Modal */}
      <AuthModal 
        open={authModal} 
        onClose={() => setAuthModal(null)} 
        onSuccess={() => setAuthModal(null)}
        setForgotModal={setForgotModal}
      />
      
      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal?.open || false}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmLabel={confirmModal?.confirmLabel}
        cancelLabel={confirmModal?.cancelLabel}
        danger={confirmModal?.danger}
        onConfirm={confirmModal?.onConfirm}
        onCancel={confirmModal?.onCancel}
      />
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={forgotModal}
        onClose={() => setForgotModal(false)}
      />
    </>
  );
}

export default App;
