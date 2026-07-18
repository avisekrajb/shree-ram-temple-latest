import React, { useState } from 'react';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AdminBookings = ({ bookings, setBookings, t }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const statusColors = {
    pending: '#F59E0B',
    confirmed: '#16A34A',
    completed: '#0EA5E9',
    cancelled: '#EF4444',
  };

  const handleStatusChange = async (id, status) => {
    setLoading(true);
    try {
      await api.put(`/admin/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      showToast(t.bookingStatusUpdated || 'Booking status updated', 'success');
    } catch (error) {
      console.error('Update status error:', error);
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-serif font-semibold">{t.manageBooking}</h4>
        <span className="text-xs text-ink-soft">{bookings?.length || 0} bookings</span>
      </div>

      {bookings?.length === 0 ? (
        <p className="text-center text-ink-soft py-8">{t.noBookingsRecorded}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.yourName}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden sm:table-cell">{t.contactPhone}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden md:table-cell">{t.pujaType}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden lg:table-cell">{t.pujaDate}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice().reverse().map((booking) => (
                <tr key={booking._id} className="border-b border-line last:border-0">
                  <td className="py-2.5 font-medium flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-maroon text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {booking.name?.charAt(0).toUpperCase()}
                    </span>
                    {booking.name}
                  </td>
                  <td className="py-2.5 hidden sm:table-cell text-ink-soft">{booking.phone}</td>
                  <td className="py-2.5 hidden md:table-cell text-ink-soft">{booking.type}</td>
                  <td className="py-2.5 hidden lg:table-cell text-ink-soft">{booking.date}</td>
                  <td className="py-2.5">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      disabled={loading}
                      className="text-xs font-bold px-2 py-1 rounded-full border border-line bg-panel focus:border-vermilion focus:outline-none disabled:opacity-50"
                      style={{ color: statusColors[booking.status] }}
                    >
                      <option value="pending">{t.statusPending}</option>
                      <option value="confirmed">{t.statusConfirmed}</option>
                      <option value="completed">{t.statusCompleted}</option>
                      <option value="cancelled">{t.statusCancelled}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;