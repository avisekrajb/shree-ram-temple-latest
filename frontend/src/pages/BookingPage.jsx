import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import api from '../services/api';
import PageHero from '../components/common/PageHero';
import { Hand, AlertCircle, Check } from 'lucide-react';

const BookingPage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    date: '',
    type: '',
  });

  const pujaTypes = {
    en: ['Ram Puja', 'Satyanarayan Puja', 'Griha Pravesh Puja', 'Birthday Puja', 'General Darshan Booking'],
    ne: ['राम पूजा', 'सत्यनारायण पूजा', 'गृह प्रवेश पूजा', 'जन्मदिन पूजा', 'साधारण दर्शन बुकिङ'],
    hi: ['राम पूजा', 'सत्यनारायण पूजा', 'गृह प्रवेश पूजा', 'जन्मदिन पूजा', 'सामान्य दर्शन बुकिंग'],
    zh: ['罗摩祈福', '萨蒂亚那罗延祈福', '乔迁祈福', '生日祈福', '普通参拜预约'],
    ta: ['ராம பூஜை', 'சத்யநாராயண பூஜை', 'கிரக பிரவேச பூஜை', 'பிறந்தநாள் பூஜை', 'பொது தரிசன பதிவு'],
  };

  const types = pujaTypes[lang] || pujaTypes.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.type) {
      showToast(t.fillAll);
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', form);
      setDone(true);
      showToast(t.thankYouBooking);
      setTimeout(() => {
        navigate('/mybookings');
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      showToast(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main>
        <PageHero title={t.bookingTitle} sub={t.bookingIntro} />
        <section className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white border border-line rounded-rt p-8 text-center shadow-rt">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={26} />
            </div>
            <h3 className="text-lg font-serif font-semibold">{t.loginRequired}</h3>
            <p className="text-sm text-ink-soft mt-2">{t.loginRequiredBooking}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all"
            >
              {t.loginToContinue}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHero title={t.bookingTitle} sub={t.bookingIntro} />
      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white border border-line rounded-rt p-6 shadow-rt">
          {done && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 mb-4">
              <Check size={16} /> {t.thankYouBooking}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">{t.yourName}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
                placeholder={t.yourName}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">{t.contactPhone}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
                placeholder="98XXXXXXXX"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">{t.pujaDate}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">{t.pujaType}</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
                required
              >
                <option value="">-- Select Puja Type --</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || done}
              className="w-full py-3 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Hand size={16} />
              {loading ? 'Booking...' : t.bookNow}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;