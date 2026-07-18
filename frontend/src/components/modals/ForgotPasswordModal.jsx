import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Mail, X, Check, ArrowLeft } from 'lucide-react';

const ForgotPasswordModal = ({ open, onClose }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setEmail('');
      setSent(false);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError(t.fillAll);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      showToast(t.resetLinkSent, 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
      showToast(err.response?.data?.message || 'Error sending reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500] flex items-end md:items-center justify-center p-4 rt-modal-backdrop">
      <div className="bg-white rounded-2xl md:rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl rt-modal-sheet md:max-w-[400px]">
        <div className="flex items-center justify-between p-4 border-b border-line sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-lg font-serif font-bold">{t.forgotPasswordTitle}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-panel transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h4 className="text-lg font-semibold">Check Your Email</h4>
              <p className="text-sm text-ink-soft mt-2">{t.resetLinkSent}</p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-2.5 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all"
              >
                {t.close}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-ink-soft">{t.forgotPasswordMsg}</p>

              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-ink block mb-1.5">{t.email}</label>
                <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel focus-within:border-vermilion transition-colors">
                  <Mail size={16} className="text-ink-soft flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  t.sendResetLink
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-sm text-ink-soft font-medium hover:text-vermilion transition-colors bg-transparent border-0 flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} /> {t.backToLogin}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;