import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import AdminSidebar from '../components/admin/AdminSidebar';

// Admin Components
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminHero from '../components/admin/AdminHero';
import AdminQuote from '../components/admin/AdminQuote';
import AdminTimings from '../components/admin/AdminTimings';
import AdminAbout from '../components/admin/AdminAbout';
import AdminHistory from '../components/admin/AdminHistory';
import AdminTeam from '../components/admin/AdminTeam';
import AdminLogo from '../components/admin/AdminLogo';
import AdminEvents from '../components/admin/AdminEvents';
import AdminGallery from '../components/admin/AdminGallery';
import AdminDonations from '../components/admin/AdminDonations';
import AdminBookings from '../components/admin/AdminBookings';
import AdminNotice from '../components/admin/AdminNotice';
import CloudPhotoPage from '../pages/CloudPhotoPage';

import { Menu, Settings, Bell } from 'lucide-react';

const AdminPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [history, setHistory] = useState([]);
  const [team, setTeam] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchData = async () => {
      try {
        const [settingsRes, usersRes, eventsRes, historyRes, teamRes, galleryRes, videosRes, donationsRes, bookingsRes] = await Promise.all([
          api.get('/admin/settings'),
          api.get('/admin/users'),
          api.get('/events'),
          api.get('/admin/history'),
          api.get('/admin/team'),
          api.get('/admin/gallery'),
          api.get('/admin/gallery/videos'),
          api.get('/admin/donations'),
          api.get('/admin/bookings')
        ]);
        setSettings(settingsRes.data);
        setUsers(usersRes.data);
        setEvents(eventsRes.data);
        setHistory(historyRes.data);
        setTeam(teamRes.data);
        setGallery(galleryRes.data);
        setGalleryVideos(videosRes.data);
        setDonations(donationsRes.data);
        setBookings(bookingsRes.data);
        showToast('Admin data loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching admin data:', error);
        showToast(error.response?.data?.message || 'Error loading admin data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.put('/admin/settings', newSettings);
      setSettings(response.data);
      showToast(t.savedSuccess || 'Changes saved', 'success');
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      showToast(error.response?.data?.message || 'Error updating settings', 'error');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-vermilion border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-soft text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-ink-soft" />
            </button>
            <h2 className="text-lg font-serif font-semibold text-ink">
              {location.pathname.includes('/cloud') ? 'Cloud Storage' : 
               location.pathname.split('/admin/')[1]?.charAt(0).toUpperCase() + location.pathname.split('/admin/')[1]?.slice(1) || 'Overview'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell size={18} className="text-ink-soft" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-vermilion rounded-full"></span>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings size={18} className="text-ink-soft" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vermilion to-maroon-deep text-white flex items-center justify-center text-sm font-bold shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-ink hidden sm:block">
                {user?.name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Routes>
            <Route index element={<AdminOverview 
              settings={settings} users={users} events={events} 
              donations={donations} bookings={bookings} 
              t={t} lang={lang} 
            />} />
            <Route path="overview" element={<AdminOverview 
              settings={settings} users={users} events={events} 
              donations={donations} bookings={bookings} 
              t={t} lang={lang} 
            />} />
            <Route path="users" element={<AdminUsers 
              users={users} setUsers={setUsers} t={t} 
            />} />
            <Route path="hero" element={<AdminHero 
              settings={settings} updateSettings={updateSettings} t={t} 
            />} />
            <Route path="quote" element={<AdminQuote 
              settings={settings} updateSettings={updateSettings} t={t} 
            />} />
            <Route path="timings" element={<AdminTimings 
              settings={settings} updateSettings={updateSettings} t={t} 
            />} />
            <Route path="about" element={<AdminAbout 
              settings={settings} updateSettings={updateSettings} t={t} 
            />} />
            <Route path="history" element={<AdminHistory 
              history={history} setHistory={setHistory} t={t} 
            />} />
            <Route path="team" element={<AdminTeam 
              team={team} setTeam={setTeam} t={t} 
            />} />
            <Route path="logo" element={<AdminLogo 
              settings={settings} updateSettings={updateSettings} t={t} 
            />} />
            <Route path="events" element={<AdminEvents 
              events={events} setEvents={setEvents} t={t} 
            />} />
            <Route path="gallery" element={<AdminGallery 
              gallery={gallery} setGallery={setGallery} 
              galleryVideos={galleryVideos} setGalleryVideos={setGalleryVideos} 
              t={t} 
            />} />
            <Route path="donations" element={<AdminDonations 
              donations={donations} setDonations={setDonations} 
              settings={settings} updateSettings={updateSettings} 
              t={t} lang={lang} 
            />} />
            <Route path="bookings" element={<AdminBookings 
              bookings={bookings} setBookings={setBookings} t={t} 
            />} />
            <Route path="notice" element={<AdminNotice 
              settings={settings} updateSettings={updateSettings} t={t} 
            />} />
            <Route path="cloud" element={<CloudPhotoPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;