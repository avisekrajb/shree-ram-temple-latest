import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

const AdminQuote = ({ settings, updateSettings, t }) => {
  const { showToast } = useToast();
  const [activeLang, setActiveLang] = useState('en');
  const [quote, setQuote] = useState(settings?.quotes?.[activeLang] || '');

  const handleLangChange = (lang) => {
    setActiveLang(lang);
    setQuote(settings?.quotes?.[lang] || '');
  };

  const handleSave = async () => {
    try {
      const newQuotes = { ...settings?.quotes, [activeLang]: quote };
      await updateSettings({ quotes: newQuotes });
      showToast(t.savedSuccess || 'Quote saved successfully', 'success');
    } catch (error) {
      console.error('Save quote error:', error);
      showToast(error.response?.data?.message || 'Failed to save quote', 'error');
    }
  };

  return (
    <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
      <h4 className="text-sm font-serif font-semibold mb-1">{t.dailyQuote}</h4>
      
      <LanguageSwitcher active={activeLang} onChange={handleLangChange} t={t} />

      <textarea
        rows={3}
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm resize-none"
        placeholder="Enter daily quote..."
      />

      <button
        onClick={handleSave}
        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all"
      >
        <Save size={15} /> {t.save}
      </button>
    </div>
  );
};

export default AdminQuote;