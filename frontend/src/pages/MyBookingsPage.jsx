import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PageHero from '../components/common/PageHero';
import { Hand, ClipboardList } from 'lucide-react';

const MyBookingsPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const statusColors = {
    pending: '#F59E0B',
    confirmed: '#16A34A',
    completed: '#0EA5E9',
    cancelled: '#EF4444',
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-maroon rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <main>
      <PageHero title={t.myBookings} sub={t.bookingIntro} />

      <section className="max-w-3xl mx-auto px-6 py-12">
        {bookings.length === 0 ? (
          <div className="bg-white border border-line rounded-rt p-8 text-center shadow-rt">
            <ClipboardList size={40} className="text-ink-soft mx-auto mb-3" />
            <p className="text-ink-soft">{t.noBookingsYet}</p>
            <button
              onClick={() => navigate('/booking')}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all"
            >
              <Hand size={16} /> {t.navBooking}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white border border-line rounded-rt p-4 shadow-rt flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="text-sm font-serif font-semibold">{booking.type}</h4>
                  <p className="text-xs text-ink-soft">{t.pujaDate}: {booking.date}</p>
                  <p className="text-xs text-ink-soft">{t.bookedOn}: {new Date(booking.createdAt).toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-US')}</p>
                </div>
                <span
                  className="text-xs font-extrabold px-3 py-1.5 rounded-full"
                  style={{
                    background: `${statusColors[booking.status]}1A`,
                    color: statusColors[booking.status],
                  }}
                >
                  {statusLabels[booking.status] || booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MyBookingsPage;