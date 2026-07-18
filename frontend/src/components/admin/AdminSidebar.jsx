import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  Quote, 
  Clock, 
  Info, 
  ScrollText, 
  Users as UsersIcon, 
  Image, 
  CalendarDays, 
  Image as GalleryIcon, 
  QrCode, 
  ClipboardList,
  LogOut,
  ArrowLeft,
  Sun,
  ChevronRight,
  Gift,
  Bell,
  Cloud,
  FolderOpen,
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.split('/admin/')[1] || 'overview';

  const menuItems = [
    { key: 'overview', label: t.overview || 'Overview', icon: LayoutDashboard },
    { key: 'users', label: t.manageUsers || 'Users', icon: Users },
    { key: 'hero', label: t.heroBanner || 'Hero Banner', icon: Video },
    { key: 'quote', label: t.dailyQuote || 'Daily Quote', icon: Quote },
    { key: 'timings', label: t.templeTimings || 'Timings', icon: Clock },
    { key: 'about', label: t.aboutSection || 'About', icon: Info },
    { key: 'history', label: t.manageHistory || 'History', icon: ScrollText },
    { key: 'team', label: t.manageTeam || 'Team', icon: UsersIcon },
    { key: 'logo', label: t.logoQr || 'Logo', icon: Image },
    { key: 'events', label: t.manageEvents || 'Events', icon: CalendarDays },
    { key: 'gallery', label: t.manageGallery || 'Gallery', icon: GalleryIcon },
    { key: 'donations', label: t.manageDonate || 'Donations', icon: Gift },
    { key: 'bookings', label: t.manageBooking || 'Bookings', icon: ClipboardList },
    // Add to menuItems array
{ key: 'notice', label: 'Notice Modal', icon: Bell },
    { key: 'cloud', label: 'Cloud Storage', icon: Cloud },
    
  ];

  const handleNavigate = (key) => {
    navigate(`/admin/${key}`);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onClose) onClose();
  };

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-100 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:shadow-none flex flex-col`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vermilion to-maroon-deep text-white flex items-center justify-center shadow-lg shadow-vermilion/20">
            <Sun size={20} />
          </div>
          <div>
            <span className="font-bold text-sm text-ink block">{t.adminDashboard || 'Admin Panel'}</span>
            <span className="text-[10px] text-ink-soft font-medium">{user?.name || 'Administrator'}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-vermilion/10 to-maroon/5 text-vermilion shadow-sm'
                    : 'text-ink-soft hover:bg-gray-50 hover:text-ink'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors ${
                    isActive ? 'text-vermilion' : 'text-ink-soft group-hover:text-ink'
                  }`} 
                />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight size={14} className="text-vermilion" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-4 space-y-1">
          <button
            onClick={() => { navigate('/'); if (onClose) onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-soft hover:bg-gray-50 hover:text-ink transition-all duration-200"
          >
            <ArrowLeft size={18} />
            <span>{t.goHome || 'Back to Site'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>{t.logout || 'Logout'}</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default AdminSidebar;