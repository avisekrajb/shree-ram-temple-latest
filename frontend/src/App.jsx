import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { useToast } from './context/ToastContext';
import { ScrollProvider } from './context/ScrollContext';
import { SocialProvider } from './context/SocialContext';
import { VisitorProvider } from './context/VisitorContext';
import { CropProvider } from './context/CropContext';
import { BackupProvider } from './context/BackupContext';
import { AdminLogsProvider } from './context/AdminLogsContext';
import Layout from './components/common/Layout';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import NoticeModal from './components/modals/NoticeModal';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import SocialFloating from './components/common/SocialFloating';

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
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const DonateSuccess = lazy(() => import('./pages/DonateSuccess'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const CloudGalleryPage = lazy(() => import('./pages/CloudGalleryPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RamPage = lazy(() => import('./pages/RamPage'));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));

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
    <ScrollProvider>
      <SocialProvider>
        <VisitorProvider>
          <CropProvider>
            <BackupProvider>
              <AdminLogsProvider>
                {/* Scroll to top on route change */}
                <ScrollToTop />

                {/* Scroll to top button - shows when scrolling down */}
                <ScrollToTopButton />

                {/* Notice Modal - Shows on first visit */}
                <NoticeModal />

                {/* Floating Social Icons - Shows on all pages */}
                <SocialFloating />

                {!isAdminRoute ? (
                  <Layout onLogout={handleLogout} setAuthModal={setAuthModal}>
                    <Suspense fallback={
                      <div className="min-h-[60vh] flex items-center justify-center">
                        <LoadingSpinner size="lg" color="maroon" />
                      </div>
                    }>
                      <Routes>
                        {/* ==============================================================
                            PUBLIC ROUTES - Accessible without login (No authentication required)
                            ============================================================== */}
                        
                        {/* Home */}
                        <Route path="/" element={<HomePage />} />
                        
                        {/* About & Team */}
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/templeteams" element={<TeamPage />} />
                        
                        {/* History */}
                        <Route path="/history" element={<HistoryPage />} />
                        
                        {/* Blogs */}
                        <Route path="/blogs" element={<BlogsPage />} />
                        <Route path="/blogs/:id" element={<BlogDetail />} />
                        
                        {/* Events */}
                        <Route path="/events" element={<EventsPage />} />
                        
                        {/* Gallery - PUBLIC (No login required) */}
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/gallery/:tab" element={<GalleryPage />} />
                        
                        {/* Donate - PUBLIC (No login required) */}
                        <Route path="/donate" element={<DonatePage />} />
                        <Route path="/donate/success" element={<DonateSuccess />} />
                        <Route path="/donate/failure" element={<DonatePage />} />
                        
                        {/* Contact */}
                        <Route path="/contact" element={<ContactPage />} />
                        
                        {/* Reset Password */}
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                        
                        {/* Privacy & Terms & Ram */}
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/ram" element={<RamPage />} />
                        
                        {/* Dynamic Pages for custom footer links */}
                        <Route path="/page-*" element={<DynamicPage />} />
                        
                        {/* ==============================================================
                            PROTECTED ROUTES - Login required
                            ============================================================== */}
                        
                        {/* Booking - Requires login */}
                        <Route path="/booking" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
                        
                        {/* Profile - Requires login */}
                        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                        
                        {/* My Bookings - Requires login */}
                        <Route path="/mybookings" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
                        
                        {/* ==============================================================
                            ADMIN ROUTES - Admin only
                            ============================================================== */}
                        <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
                        
                        {/* Cloud Gallery - Admin only */}
                        <Route path="/cloudgallery" element={<AdminRoute><CloudGalleryPage /></AdminRoute>} />
                        
                        {/* ==============================================================
                            404 - Catch all
                            ============================================================== */}
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
              </AdminLogsProvider>
            </BackupProvider>
          </CropProvider>
        </VisitorProvider>
      </SocialProvider>
    </ScrollProvider>
  );
}

export default App;