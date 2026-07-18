import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Lock, Eye, EyeOff, MapPin, Phone, User, X, Sparkles } from 'lucide-react';

const AuthModal = ({ open, onClose, onSuccess, setForgotModal }) => {
  const { t } = useLanguage();
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  // Auto-fill admin credentials
  const fillAdmin = () => {
    setLoginData({ email: 'a@gmail.com', password: '123456' });
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setError('');
      setLoginData({ email: '', password: '' });
      setSignupData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
      });
    }
  }, [open]);

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        showToast(`Welcome back, ${result.user.name}!`, 'success');
        onSuccess();
        onClose();
      } else {
        setError(result.error || t.invalidLogin);
        showToast(result.error || t.invalidLogin, 'error');
      }
    } catch (err) {
      setError(t.invalidLogin);
      showToast(t.invalidLogin, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signup(signupData);
      if (result.success) {
        showToast(`Welcome, ${result.user.name}!`, 'success');
        onSuccess();
        onClose();
      } else {
        setError(result.error || t.fillAll);
        showToast(result.error || t.fillAll, 'error');
      }
    } catch (err) {
      setError(t.fillAll);
      showToast(t.fillAll, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500] flex items-end md:items-center justify-center p-4 rt-modal-backdrop">
      <div className="bg-white rounded-2xl md:rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl rt-modal-sheet md:max-w-[440px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-lg font-serif font-bold">{mode === 'login' ? t.login : t.signup}</h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-panel transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold mb-4">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.email}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <Mail size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.password}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <Lock size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-ink-soft hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Auto-fill Admin Button */}
              <button
                type="button"
                onClick={fillAdmin}
                className="text-xs font-semibold text-vermilion bg-vermilion/10 px-3 py-1.5 rounded-full w-fit hover:bg-vermilion/20 transition-colors flex items-center gap-1.5"
              >
                <Sparkles size={12} /> Admin Login (a@gmail.com)
              </button>

              <button
                type="button"
                onClick={() => { setForgotModal(true); onClose(); }}
                className="text-xs font-bold text-vermilion text-right hover:underline bg-transparent border-0"
              >
                {t.forgotPw}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  t.login
                )}
              </button>

              <p className="text-sm text-ink-soft text-center">
                {t.noAccount}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-vermilion font-bold hover:underline bg-transparent border-0"
                >
                  {t.signup}
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.fullName}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <User size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.email}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <Mail size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.password}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <Lock size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-ink-soft hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.phone}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <Phone size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.address}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <MapPin size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type="text"
                    value={signupData.address}
                    onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                    placeholder="Your Address"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  t.createAcc
                )}
              </button>

              <p className="text-sm text-ink-soft text-center">
                {t.haveAccount}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-vermilion font-bold hover:underline bg-transparent border-0"
                >
                  {t.login}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;