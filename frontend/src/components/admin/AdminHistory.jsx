import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Image, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminHistory = ({ history, setHistory, t }) => {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const blank = () => ({
    photo: null,
    period: { en: '', ne: '', hi: '', zh: '', ta: '' },
    desc: { en: '', ne: '', hi: '', zh: '', ta: '' },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing._id) {
        const response = await api.put(`/admin/history/${editing._id}`, editing);
        setHistory(history.map(h => h._id === editing._id ? response.data : h));
        showToast(t.historySaved || 'History entry updated', 'success');
      } else {
        const response = await api.post('/admin/history', editing);
        setHistory([...history, response.data]);
        showToast(t.historySaved || 'History entry added', 'success');
      }
      setEditing(null);
    } catch (error) {
      console.error('Save history error:', error);
      showToast(error.response?.data?.message || 'Failed to save history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this history entry?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/history/${id}`);
      setHistory(history.filter(h => h._id !== id));
      showToast(t.historyRemoved || 'History entry deleted', 'success');
    } catch (error) {
      console.error('Delete history error:', error);
      showToast(error.response?.data?.message || 'Failed to delete history', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Separate upload for History photo
  const handleHistoryPhotoUpload = async (e) => {
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
    formData.append('historyId', editing._id || 'new');

    try {
      const response = await api.post('/admin/upload/history', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditing({ ...editing, photo: response.data.url });
      showToast(t.photoUploaded || 'History photo uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  if (editing) {
    return (
      <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-serif font-semibold">{t.manageHistory}</h4>
          <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-panel transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-ink block mb-1.5">{t.historyPhoto}</label>
          <div
            className="relative border-2 border-dashed border-line rounded-rt overflow-hidden h-32 flex items-center justify-center cursor-pointer bg-panel hover:border-vermilion transition-colors"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleHistoryPhotoUpload} 
              className="hidden" 
              id="history-photo-upload" 
            />
            <label htmlFor="history-photo-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
              {editing.photo ? (
                <img src={editing.photo} alt="History" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-ink-soft">
                  <Image size={32} />
                  <span className="text-sm font-medium">Click to upload history photo</span>
                  <span className="text-xs text-ink-soft/60">JPG, PNG, WEBP • Max 5MB</span>
                </div>
              )}
            </label>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {editing.photo && !uploading && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-bold py-1.5 flex items-center justify-center gap-1.5">
                <Upload size={13} /> Click to change photo
              </div>
            )}
          </div>
        </div>

        <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">{t.historyPeriod}</label>
          <input
            type="text"
            value={editing.period[activeLang] || ''}
            onChange={(e) => setEditing({ ...editing, period: { ...editing.period, [activeLang]: e.target.value } })}
            className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">{t.eventDesc}</label>
          <textarea            rows={3}
            value={editing.desc[activeLang] || ''}
            onChange={(e) => setEditing({ ...editing, desc: { ...editing.desc, [activeLang]: e.target.value } })}
            className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50"
        >
          <Save size={15} /> {t.save}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-serif font-semibold">{t.manageHistory}</h4>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
        >
          <Plus size={14} /> {t.add}
        </button>
      </div>

      {history?.length === 0 ? (
        <p className="text-center text-ink-soft py-8">No history entries</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.historyPeriod}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden md:table-cell">{t.eventDesc}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} className="border-b border-line last:border-0">
                  <td className="py-2.5 font-medium flex items-center gap-2">
                    {item.photo && (
                      <img src={item.photo} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    {item.period?.en}
                  </td>
                  <td className="py-2.5 hidden md:table-cell text-ink-soft">{item.desc?.en?.slice(0, 60)}...</td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => setEditing(item)} className="p-1.5 rounded-lg text-ink-soft hover:text-maroon hover:bg-panel transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 size={15} />
                    </button>
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

export default AdminHistory;