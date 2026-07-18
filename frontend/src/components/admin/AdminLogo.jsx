import React, { useState, useRef } from 'react';
import { Save, Image, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminLogo = ({ settings, updateSettings, t }) => {
  const { showToast } = useToast();
  const [activeLang, setActiveLang] = useState('en');
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [logoText, setLogoText] = useState(settings?.logo?.text?.[activeLang] || '');
  const [logoPhoto, setLogoPhoto] = useState(settings?.logo?.photo || null);

  const handleLangChange = (lang) => {
    setActiveLang(lang);
    setLogoText(settings?.logo?.text?.[lang] || '');
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/admin/upload/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLogoPhoto(response.data.url);
      await updateSettings({ logo: { ...settings?.logo, photo: response.data.url } });
      showToast(t.photoUploaded || 'Logo uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
    e.target.value = '';
  };

  const handleSave = async () => {
    try {
      const newLogo = {
        ...settings?.logo,
        text: { ...settings?.logo?.text, [activeLang]: logoText },
        photo: logoPhoto,
      };
      await updateSettings({ logo: newLogo });
      showToast(t.savedSuccess || 'Logo saved successfully', 'success');
    } catch (error) {
      console.error('Save logo error:', error);
      showToast(error.response?.data?.message || 'Failed to save logo', 'error');
    }
  };

  return (
    <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
      <h4 className="text-sm font-serif font-semibold mb-1">{t.logoQr}</h4>
      <p className="text-xs text-ink-soft mb-4">{t.uploadPhoto} — Logo</p>

      <div
        className="relative border-2 border-dashed border-line rounded-rt overflow-hidden h-28 flex items-center justify-center cursor-pointer bg-panel hover:border-vermilion transition-colors mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        {logoPhoto ? (
          <img src={logoPhoto} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-ink-soft">
            <Image size={28} />
            <span className="text-xs font-semibold">{t.uploadPhoto}</span>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-bold py-1.5 flex items-center justify-center gap-1.5">
          <Upload size={13} /> {t.uploadPhoto}
        </div>
      </div>

      <LanguageSwitcher active={activeLang} onChange={handleLangChange} t={t} />

      <div className="mb-3">
        <label className="text-xs font-bold text-ink block mb-1.5">Logo Text</label>
        <input
          type="text"
          value={logoText}
          onChange={(e) => setLogoText(e.target.value)}
          className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
          placeholder="Logo text"
        />
      </div>

      <button
        onClick={handleSave}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all"
      >
        <Save size={15} /> {t.save}
      </button>
    </div>
  );
};

export default AdminLogo;