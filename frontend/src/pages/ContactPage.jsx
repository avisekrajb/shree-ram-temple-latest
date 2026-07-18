import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const ContactPage = () => {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = t.contactNameError || 'Name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contactEmailError || 'Please enter a valid email';
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = t.contactMsgError || 'Message must be at least 5 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      showToast(t.contactSent || 'Message sent successfully!', 'success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Contact error:', error);
      showToast(error.response?.data?.message || t.contactError || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #faf8f5 100%)' }}
    >
      {/* Header */}
      <div className="pt-24 pb-6 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light"
          style={{ color: '#7A0000' }}
        >
          {t.contactTitle || 'Get in Touch'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-base sm:text-lg text-mute max-w-xl mx-auto leading-relaxed"
        >
          {t.contactSubtitle || 'We would love to hear from you. Reach out to us for any inquiries or blessings.'}
        </motion.p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8 pt-2"
          >
            <div>
              <h3 className="font-serif text-lg mb-3" style={{ color: '#7A0000' }}>
                {t.contactAddress || 'Address'}
              </h3>
              <a
                href="https://www.google.com/maps?q=Battisputali,Kathmandu,Nepal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-mute hover:text-ink transition-colors leading-relaxed block"
              >
                {t.templeAddressLine || 'Battisputali, Gaushala, Kathmandu 44600, Nepal'}
              </a>
            </div>

            <div>
              <h3 className="font-serif text-lg mb-3" style={{ color: '#7A0000' }}>
                {t.contactPhone || 'Phone'}
              </h3>
              <p className="text-sm text-mute">+977-1-4598526</p>
            </div>

            <div>
              <h3 className="font-serif text-lg mb-3" style={{ color: '#7A0000' }}>
                {t.contactEmail || 'Email'}
              </h3>
              <a href="mailto:shreramchandra@gmail.com" className="text-sm text-mute hover:text-ink transition-colors">
                shreramchandra@gmail.com
              </a>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm" style={{ height: 200 }}>
              <iframe
                title="Shree Ramchandra Mandir Location"
                className="w-full h-full"
                src="https://www.google.com/maps?q=Battisputali,Kathmandu,Nepal&output=embed"
                loading="lazy"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-10">
              <h2 className="font-serif text-2xl sm:text-3xl mb-2" style={{ color: '#7A0000' }}>
                {t.contactMessage || 'Send us a Message'}
              </h2>
              <p className="text-sm text-mute mb-8">{t.contactSubtitle || 'We will get back to you as soon as possible.'}</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-xs font-medium text-mute mb-1.5 uppercase tracking-wider">
                    {t.contactYourName || 'Your Name'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contactNamePlaceholder || 'Enter your name'}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-vermilion focus:ring-vermilion/20'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-xs mt-1 block text-red-600">{errors.name}</span>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-mute mb-1.5 uppercase tracking-wider">
                    {t.contactYourEmail || 'Your Email'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contactEmailPlaceholder || 'Enter your email'}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-vermilion focus:ring-vermilion/20'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-xs mt-1 block text-red-600">{errors.email}</span>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-medium text-mute mb-1.5 uppercase tracking-wider">
                    {t.contactYourMessage || 'Your Message'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder={t.contactMsgPlaceholder || 'Write your message here...'}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-vermilion focus:ring-vermilion/20'
                    }`}
                  />
                  {errors.message && (
                    <span className="text-xs mt-1 block text-red-600">{errors.message}</span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-3.5 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#7A0000' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#5a0000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#7A0000'; }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.contactSending || 'Sending...'}
                    </span>
                  ) : (
                    t.contactSend || 'Send Message'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;