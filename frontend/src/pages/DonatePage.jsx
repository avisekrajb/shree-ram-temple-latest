import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PageHero from '../components/common/PageHero';
import { 
  QrCode, 
  Users, 
  Gift, 
  AlertCircle, 
  Check, 
  Hand,
  Building2,
  Smartphone,
  Wallet,
  User,
  Calendar,
  Clock,
  Send,
  Heart,
  TrendingUp
} from 'lucide-react';

const DonatePage = () => {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  // State
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [settings, setSettings] = useState(null);
  const [donationCount, setDonationCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [selectedMethod, setSelectedMethod] = useState('esewa');
  const [amount, setAmount] = useState(501);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Tiers configuration
  const tiers = [108, 501, 1100, 2100, 5100, 11000];

  // Dummy donors data
  const dummyDonors = [
    { id: 1, name: 'Ram Sharma', amount: 5000, date: '2026-07-15', message: 'Jai Mahakal! 🙏' },
    { id: 2, name: 'Sita Poudel', amount: 2500, date: '2026-07-14', message: 'Om Namah Shivaya' },
    { id: 3, name: 'Hari Gurung', amount: 10000, date: '2026-07-13', message: 'Har Har Mahadev' },
    { id: 4, name: 'Gita Adhikari', amount: 3000, date: '2026-07-12', message: 'Blessings to all' },
    { id: 5, name: 'Krishna Thapa', amount: 7500, date: '2026-07-11', message: 'Mahadev Bless Us' },
    { id: 6, name: 'Radha Karki', amount: 2000, date: '2026-07-10', message: 'Thank you Mahadev' },
  ];

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, donationsRes] = await Promise.all([
          api.get('/admin/settings'),
          api.get('/admin/donations')
        ]);
        setSettings(settingsRes.data);
        setDonationCount(settingsRes.data?.donate?.baseCount + (donationsRes.data?.length || 0));
      } catch (error) {
        console.error('Error fetching donate data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDonate = async () => {
    if (!user) {
      toast.warning(t.loginRequiredDonate || 'Please login to donate');
      navigate('/');
      return;
    }

    if (!amount || Number(amount) < 1) {
      toast.error(t.validAmount || 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await api.post('/donations', { 
        amount: Number(amount),
        paymentMethod: selectedMethod,
        name: name || user?.name || 'Anonymous',
        email: email || user?.email || ''
      });
      setDone(true);
      setDonationCount(prev => prev + 1);
      toast.success(t.donateThanks || `NPR ${amount} — Thank you for your generous donation!`);
      setName("");
      setEmail("");
    } catch (error) {
      console.error('Donation error:', error);
      toast.error(error.response?.data?.message || 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  const qrPhoto = settings?.donate?.qrPhoto;
  const bankNumber = settings?.donate?.bankNumber || '986XXXXXXX';
  const bankName = settings?.donate?.bankName || 'Nepal Investment Bank';
  const accountHolder = settings?.donate?.accountHolder || 'Temple Trust Fund';
  
  // Payment method icons and details
  const paymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      icon: <Smartphone size={24} />,
      color: '#60BB46',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      details: 'Scan QR or Pay via eSewa ID: 986XXXXXXX'
    },
    {
      id: 'khalti',
      name: 'Khalti',
      icon: <Wallet size={24} />,
      color: '#5C2D91',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      details: 'Scan QR or Pay via Khalti ID: 986XXXXXXX'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Building2 size={24} />,
      color: '#1a7a5a',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      details: `${bankName} - ${accountHolder} - ${bankNumber}`
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #faf8f5 100%)" }}>
      
      <PageHero 
        title={t.donateTitle || 'Support the Temple'} 
        sub={t.donateIntro || 'Your contribution helps preserve this sacred place'} 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left Column - Donation Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-10"
          >
            {done && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 mb-6">
                <Check size={16} /> {t.donateThanks || 'Thank you for your generous donation!'}
              </div>
            )}

            <h2 className={`font-display text-2xl sm:text-3xl mb-6 ${lang === "en" ? "font-english-serif" : ""}`} style={{ color: "#7A0000" }}>
              {t.donateTitle || 'Make a Donation'}
            </h2>

            <p className={`text-xs font-medium text-mute mb-3 ${lang === "en" ? "uppercase tracking-wider" : "tracking-normal"}`}>
              {t.quickAmounts || 'Quick Amounts'}
            </p>
            
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {tiers.map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className="py-3 px-2 rounded-lg border text-sm font-semibold transition-all duration-200"
                  style={{
                    background: amount === v ? "#7A0000" : "#fff",
                    color: amount === v ? "#fff" : "#333",
                    borderColor: amount === v ? "#7A0000" : "#e5e5e5",
                  }}
                >
                  NPR {v.toLocaleString()}
                </button>
              ))}
            </div>

            <p className="text-xs text-mute text-center mb-4">{t.or || 'or'}</p>

            <div className="mb-6">
              <label className={`block text-xs font-medium text-mute mb-1.5 ${lang === "en" ? "uppercase tracking-wider" : "tracking-normal"}`}>
                {t.customAmount || 'Custom Amount'} (NPR)
              </label>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7A0000] focus:ring-2 focus:ring-[#7A0000]/20 outline-none transition-all"
                placeholder="Enter amount"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div>
                <label className={`block text-xs font-medium text-mute mb-1.5 ${lang === "en" ? "uppercase tracking-wider" : "tracking-normal"}`}>
                  {t.yourName || 'Your Name'}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7A0000] focus:ring-2 focus:ring-[#7A0000]/20 outline-none transition-all"
                  placeholder="—"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium text-mute mb-1.5 ${lang === "en" ? "uppercase tracking-wider" : "tracking-normal"}`}>
                  {t.yourEmail || 'Your Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#7A0000] focus:ring-2 focus:ring-[#7A0000]/20 outline-none transition-all"
                  placeholder="—"
                />
              </div>
            </div>

            <button
              onClick={handleDonate}
              disabled={loading || done}
              className="w-full px-8 py-3.5 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50"
              style={{ background: "#7A0000" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#5a0000"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#7A0000"; }}
            >
              <Gift size={16} className="inline mr-2" />
              {loading ? t.processing || 'Processing...' : t.donateBtn || 'Donate Now'}
            </button>
            
            {!user && (
              <p className="text-xs text-ink-soft mt-3 text-center">
                <AlertCircle size={12} className="inline mr-1" />
                {t.loginRequiredDonate || 'Please login to record your donation'}
              </p>
            )}
          </motion.div>

          {/* Right Column - Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className={`font-display text-lg mb-4 ${lang === "en" ? "font-english-serif" : ""}`} style={{ color: "#7A0000" }}>
                {t.paymentMethods || 'Payment Methods'}
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedMethod === method.id 
                        ? `${method.bgColor} ${method.borderColor} border-2` 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: method.color }}
                      >
                        {method.name[0]}
                      </div>
                      <span className="text-sm font-medium text-ink">{method.name}</span>
                    </div>
                    <span className="text-xs text-mute">{method.id === 'bank' ? bankNumber : '980-XXXXXXX'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Details */}
            <div className="rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-white" style={{ background: "#7A0000" }}>
              <h3 className={`font-display text-lg mb-3 text-white ${lang === "en" ? "font-english-serif" : ""}`}>
                {t.bankTransferTitle || 'Bank Transfer Details'}
              </h3>
              <p className="text-sm text-white/80 mb-1">{bankName}</p>
              <p className="text-sm text-white/80 mb-1">{accountHolder}</p>
              <p className="text-sm text-white/80 font-mono">{bankNumber}</p>
              <p className="text-xs text-white/60 mt-3">Shree Ramchandra Mandir Trust</p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center">
              <h3 className={`font-display text-lg mb-4 ${lang === "en" ? "font-english-serif" : ""}`} style={{ color: "#7A0000" }}>
                {t.scanQR || 'Scan to Pay'}
              </h3>
              <div className="mx-auto w-44 h-44 bg-gray-50 rounded-xl grid place-items-center border border-gray-100 overflow-hidden">
                {qrPhoto ? (
                  <img src={qrPhoto} alt="QR Code" className="w-full h-full object-cover" />
                ) : (
                  <QrCode size={80} className="text-gray-400" />
                )}
              </div>
              <p className="text-xs text-mute mt-3">eSewa / Khalti / FonePay</p>
            </div>

            {/* Donation Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Users size={16} className="text-vermilion" />
                <span className="text-sm font-semibold">
                  <strong>{donationCount}</strong> {t.donorsSoFar || 'Devotees who have donated'}
                </span>
              </div>
            </div>

            {/* Dummy Donors */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Hand size={20} className="text-vermilion" />
                <h3 className={`font-display text-lg ${lang === "en" ? "font-english-serif" : ""}`} style={{ color: "#7A0000" }}>
                  {t.recentDonors || 'Recent Devotees'}
                </h3>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {dummyDonors.slice(0, 5).map((donor) => (
                  <div 
                    key={donor.id} 
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#7A0000]/10 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-[#7A0000]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{donor.name}</p>
                        <span className="text-xs font-bold text-[#7A0000]">Rs. {donor.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-mute">
                        <Calendar size={12} />
                        <span>{new Date(donor.date).toLocaleDateString()}</span>
                      </div>
                      {donor.message && (
                        <p className="text-xs text-mute mt-1 italic">"{donor.message}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;