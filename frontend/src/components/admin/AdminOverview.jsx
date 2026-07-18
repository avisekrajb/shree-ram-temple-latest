import React from 'react';
import StatCard from '../common/StatCard';
import { Users, CalendarDays, Gift, ClipboardList, Check, X, BadgeCheck } from 'lucide-react';

const AdminOverview = ({ settings, users, events, donations, bookings, t, lang }) => {
  const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  bookings?.forEach((b) => {
    if (statusCounts[b.status] !== undefined) statusCounts[b.status]++;
  });

  const statusColors = {
    pending: '#F59E0B',
    confirmed: '#16A34A',
    completed: '#0EA5E9',
    cancelled: '#EF4444',
  };

  const totalDonors = (settings?.donate?.baseCount || 0) + (donations?.length || 0);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard icon={Users} label={t.totalUsers} value={users?.length || 0} color="#0EA5E9" />
        <StatCard icon={CalendarDays} label={t.totalEvents} value={events?.length || 0} color="#F59E0B" />
        <StatCard icon={Gift} label={t.totalDonors} value={totalDonors} color="#16A34A" />
        <StatCard icon={ClipboardList} label={t.manageBooking} value={bookings?.length || 0} color="#7A1F2B" />
      </div>

      <div className="bg-white border border-line rounded-rt p-4 shadow-rt mb-4">
        <h4 className="text-sm font-serif font-semibold mb-3">{t.bookingsByStatus}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={ClipboardList} label={t.statusPending} value={statusCounts.pending} color={statusColors.pending} />
          <StatCard icon={Check} label={t.statusConfirmed} value={statusCounts.confirmed} color={statusColors.confirmed} />
          <StatCard icon={BadgeCheck} label={t.statusCompleted} value={statusCounts.completed} color={statusColors.completed} />
          <StatCard icon={X} label={t.statusCancelled} value={statusCounts.cancelled} color={statusColors.cancelled} />
        </div>
      </div>

      <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
        <h4 className="text-sm font-serif font-semibold mb-3">{t.upcomingEvents}</h4>
        {events?.filter(e => e.upcoming).length > 0 ? (
          <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
            {events.filter(e => e.upcoming).slice(0, 5).map((e) => (
              <li key={e._id} className="flex items-center gap-2 text-sm text-ink-soft py-1.5 border-b border-line last:border-0">
                <CalendarDays size={14} className="text-vermilion" />
                {e.title?.en} — {e.date}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-soft">{t.noEventsUpcoming}</p>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;