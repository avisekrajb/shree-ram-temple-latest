import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PageHero from '../components/common/PageHero';
import { 
  Calendar, User, Phone, Tag, FileText, Clock, 
  CheckCircle, XCircle, AlertCircle, ChevronRight,
  Grid, List, CalendarDays
} from 'lucide-react';

const MyBookingsPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle size={16} className="text-green-500" />;
      case 'completed': return <CheckCircle size={16} className="text-blue-500" />;
      case 'cancelled': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-50 border-green-200 text-green-700';
      case 'completed': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'cancelled': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Booking Card Component
  const BookingCard = ({ booking }) => (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#7A0000]/20 hover:-translate-y-1">
      <div className={`h-1 w-full ${getStatusBg(booking.status)}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)} border`}>
            {getStatusIcon(booking.status)}
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            #{booking._id.slice(-6)}
          </span>
        </div>

        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A0000] bg-[#7A0000]/10 px-3 py-1 rounded-full">
            <Tag size={12} />
            {booking.type}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-800 truncate">
          {booking.name}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Phone size={13} className="text-[#7A0000]" />
          <span>{booking.phone}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <Calendar size={13} className="text-[#7A0000]" />
          <span>{booking.date}</span>
        </div>

        {booking.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-start gap-1.5">
              <FileText size={13} className="text-[#7A0000] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 line-clamp-2">
                {booking.description}
              </p>
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">
            Booked: {formatDate(booking.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );

  // Booking List Item Component
  const BookingListItem = ({ booking }) => (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#7A0000]/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
        <div className={`w-1 h-12 rounded-full flex-shrink-0 ${getStatusBg(booking.status)}`} />
        
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{booking.name}</p>
            <p className="text-xs text-gray-500 truncate">{booking.phone}</p>
          </div>
          
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#7A0000] bg-[#7A0000]/10 px-2 py-0.5 rounded-full">
              <Tag size={10} />
              {booking.type}
            </span>
          </div>
          
          <div className="min-w-0">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} className="text-[#7A0000]" />
              {booking.date}
            </p>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(booking.status)} border whitespace-nowrap`}>
              {getStatusIcon(booking.status)}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
            {booking.description && (
              <span className="text-[10px] text-gray-400 truncate max-w-[100px] hidden lg:block">
                {booking.description}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7A0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #faf8f5 100%)' }}>
      <PageHero title={t.myBookings} sub={t.bookingIntro} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarDays size={20} className="text-[#7A0000]" />
            <h2 className="text-lg font-serif font-semibold text-gray-800">
              My Bookings
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {bookings.length}
            </span>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-[#7A0000] text-white shadow-md shadow-[#7A0000]/20' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid size={14} />
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-[#7A0000] text-white shadow-md shadow-[#7A0000]/20' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List size={14} />
              List
            </button>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-24 h-24 rounded-full bg-[#7A0000]/10 flex items-center justify-center mx-auto mb-4">
              <Calendar size={40} className="text-[#7A0000]" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800">No Bookings Yet</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
              You haven't made any bookings yet. Book a puja to receive divine blessings.
            </p>
            <button
              onClick={() => window.location.href = '/booking'}
              className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#7A0000] text-white font-semibold text-sm hover:bg-[#5A0000] transition-all shadow-lg shadow-[#7A0000]/20 hover:shadow-xl"
            >
              Book Now <ChevronRight size={16} />
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View - 4 Columns */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {bookings.map((booking) => (
              <BookingListItem key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyBookingsPage;