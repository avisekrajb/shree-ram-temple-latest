import React, { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Save, Image, Upload, Plus, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';

const AdminAbout = ({ settings, updateSettings, t }) => {
  const { showToast } = useToast();
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const aboutInputRef = useRef(null);

  // About Section
  const [aboutTitle, setAboutTitle] = useState(settings?.about?.title?.[activeLang] || '');
  const [aboutText, setAboutText] = useState(settings?.about?.text?.[activeLang] || '');
  const [aboutPhoto, setAboutPhoto] = useState(settings?.about?.photo || null);
  const [aboutImages, setAboutImages] = useState(settings?.about?.images || []);

  // Timings
  const [timings, setTimings] = useState(settings?.timings || {
    open: '05:00 AM',
    close: '08:00 PM',
    openLabel: { en: 'Opening Time', ne: 'खुल्ने समय', hi: 'खुलने का समय', zh: '开放时间', ta: 'திறக்கும் நேரம்' },
    closeLabel: { en: 'Closing Time', ne: 'बन्द हुने समय', hi: 'बन्द होने का समय', zh: '关闭时间', ta: 'மூடும் நேரம்' },
    dailyAarti: { en: 'Daily Aarti', ne: 'दैनिक आरती', hi: 'दैनिक आरती', zh: '每日祈祷', ta: 'தினசரி ஆரத்தி' },
  });

  const getLocalized = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[activeLang] || obj.en || '';
  };

  // Handle About Photo Upload
  const handleAboutPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/admin/upload/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAboutPhoto(response.data.url);
      showToast('About photo uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  // Handle About Images (gallery within about)
  const handleAboutImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/admin/upload/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newImage = {
        id: Date.now().toString(),
        src: response.data.url,
        alt: { en: 'About Image', ne: 'बारेमा छवि', hi: 'बारे में छवि', zh: '关于图片', ta: 'பற்றிய படம்' },
        order: aboutImages.length,
        enabled: true,
      };
      setAboutImages([...aboutImages, newImage]);
      showToast('About image added', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleAboutImageRemove = (id) => {
    setAboutImages(aboutImages.filter(img => img.id !== id));
    showToast('Image removed', 'success');
  };

  const handleAboutImageToggle = (id) => {
    setAboutImages(aboutImages.map(img => 
      img.id === id ? { ...img, enabled: !img.enabled } : img
    ));
  };

  // Save all about settings
  const handleSave = async () => {
    setLoading(true);
    try {
      const data = {
        about: {
          photo: aboutPhoto,
          title: { ...settings?.about?.title, [activeLang]: aboutTitle },
          text: { ...settings?.about?.text, [activeLang]: aboutText },
          images: aboutImages,
        },
        timings: timings,
      };
      await updateSettings(data);
      showToast('About settings saved successfully', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast(error.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* About Title & Text */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-base font-serif font-semibold text-ink mb-4">About Section</h4>
        
        <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />

        <div className="mb-4">
          <label className="text-xs font-bold text-ink block mb-1.5">Title</label>
          <input
            type="text"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
            placeholder="About Title"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-ink block mb-1.5">Description</label>
          <textarea
            rows={4}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
            placeholder="About description..."
          />
        </div>

        <div>
          <label className="text-xs font-bold text-ink block mb-1.5">Main Photo</label>
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden h-32 flex items-center justify-center cursor-pointer bg-gray-50 hover:border-vermilion transition-colors"
            onClick={() => aboutInputRef.current?.click()}
          >
            <input
              ref={aboutInputRef}
              type="file"
              accept="image/*"
              onChange={handleAboutPhotoUpload}
              className="hidden"
            />
            {aboutPhoto ? (
              <img src={aboutPhoto} alt="About" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-ink-soft">
                <Image size={28} />
                <span className="text-xs font-semibold">Click to upload photo</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Gallery Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-serif font-semibold text-ink">About Gallery Images</h4>
            <p className="text-xs text-ink-soft">Additional images for the about section</p>
          </div>
          <button
            onClick={() => document.getElementById('about-gallery-upload').click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
          >
            <Plus size={14} /> Add Image
          </button>
          <input
            id="about-gallery-upload"
            type="file"
            accept="image/*"
            onChange={handleAboutImageUpload}
            className="hidden"
          />
        </div>

        {aboutImages.length === 0 ? (
          <div className="text-center py-8 text-ink-soft text-sm">No additional images added</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {aboutImages.map((img, index) => (
              <div key={img.id} className="relative group border rounded-lg overflow-hidden">
                <img src={img.src} alt={img.alt?.en} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleAboutImageToggle(img.id)}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    {img.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => handleAboutImageRemove(img.id)}
                    className="p-1.5 rounded-lg bg-red-500/70 text-white hover:bg-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {!img.enabled && (
                  <div className="absolute top-1 left-1 bg-gray-800/80 text-white text-xs px-2 py-0.5 rounded">
                    Hidden
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Temple Timings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-base font-serif font-semibold text-ink mb-4">Temple Timings</h4>

        <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Opening Time Label</label>
            <input
              type="text"
              value={getLocalized(timings.openLabel)}
              onChange={(e) => setTimings({
                ...timings,
                openLabel: { ...timings.openLabel, [activeLang]: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Opening Time</label>
            <input
              type="text"
              value={timings.open}
              onChange={(e) => setTimings({ ...timings, open: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              placeholder="05:00 AM"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Closing Time Label</label>
            <input
              type="text"
              value={getLocalized(timings.closeLabel)}
              onChange={(e) => setTimings({
                ...timings,
                closeLabel: { ...timings.closeLabel, [activeLang]: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Closing Time</label>
            <input
              type="text"
              value={timings.close}
              onChange={(e) => setTimings({ ...timings, close: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              placeholder="08:00 PM"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-ink block mb-1.5">Daily Aarti Label</label>
          <input
            type="text"
            value={getLocalized(timings.dailyAarti)}
            onChange={(e) => setTimings({
              ...timings,
              dailyAarti: { ...timings.dailyAarti, [activeLang]: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50 shadow-lg shadow-vermilion/20"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save About Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminAbout;