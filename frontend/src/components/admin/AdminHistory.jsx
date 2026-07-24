import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, Upload, MoveUp, MoveDown, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminHistory = ({ history, setHistory, t }) => {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const blank = () => ({
    photo: null,
    period: { en: '', ne: '', hi: '', zh: '', ta: '' },
    title: { en: '', ne: '', hi: '', zh: '', ta: '' },
    desc: { en: '', ne: '', hi: '', zh: '', ta: '' },
    year: '',
    order: history.length,
    enabled: true,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing._id) {
        const response = await api.put(`/admin/history/${editing._id}`, editing);
        setHistory(history.map(h => h._id === editing._id ? response.data : h));
        showToast('History entry updated successfully', 'success');
      } else {
        const response = await api.post('/admin/history', editing);
        setHistory([...history, response.data]);
        showToast('History entry added successfully', 'success');
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
      showToast('History entry deleted successfully', 'success');
    } catch (error) {
      console.error('Delete history error:', error);
      showToast(error.response?.data?.message || 'Failed to delete history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be less than 10MB', 'error');
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
      showToast('Photo uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleMove = (id, direction) => {
    const index = history.findIndex(h => h._id === id);
    if (direction === 'up' && index > 0) {
      const newHistory = [...history];
      [newHistory[index], newHistory[index - 1]] = [newHistory[index - 1], newHistory[index]];
      setHistory(newHistory);
    } else if (direction === 'down' && index < history.length - 1) {
      const newHistory = [...history];
      [newHistory[index], newHistory[index + 1]] = [newHistory[index + 1], newHistory[index]];
      setHistory(newHistory);
    }
  };

  const handleToggle = (id) => {
    setHistory(history.map(h => 
      h._id === id ? { ...h, enabled: !h.enabled } : h
    ));
  };

  const getLocalizedValue = (obj, lang) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  };

  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-serif font-semibold text-ink">
            {editing._id ? 'Edit History Entry' : 'Add New History Entry'}
          </h4>
          <button 
            onClick={() => setEditing(null)} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Photo Upload */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Photo</label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden h-48 flex items-center justify-center cursor-pointer bg-gray-50 hover:border-vermilion transition-colors"
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
                id="history-photo-upload" 
              />
              <label htmlFor="history-photo-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
                {editing.photo ? (
                  <img src={editing.photo} alt="History" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-ink-soft">
                    <ImageIcon size={40} />
                    <span className="text-sm font-medium">Click to upload photo</span>
                    <span className="text-xs text-ink-soft/60">JPG, PNG, WEBP • Max 10MB</span>
                  </div>
                )}
              </label>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {editing.photo && !uploading && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-bold py-2 flex items-center justify-center gap-1.5">
                  <Upload size={14} /> Click to change photo
                </div>
              )}
            </div>
            {editing.photo && (
              <p className="text-xs text-green-600 mt-1">✅ Photo uploaded</p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Year (Optional)</label>
            <input
              type="text"
              value={editing.year || ''}
              onChange={(e) => setEditing({ ...editing, year: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              placeholder="e.g., 1800, 1950, Present"
            />
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />

          {/* Period */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Period / Era</label>
            <input
              type="text"
              value={getLocalizedValue(editing.period, activeLang)}
              onChange={(e) => setEditing({ 
                ...editing, 
                period: { ...editing.period, [activeLang]: e.target.value } 
              })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              placeholder="Enter period name..."
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Title</label>
            <input
              type="text"
              value={getLocalizedValue(editing.title, activeLang)}
              onChange={(e) => setEditing({ 
                ...editing, 
                title: { ...editing.title, [activeLang]: e.target.value } 
              })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              placeholder="Enter title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Description</label>
            <textarea
              rows={4}
              value={getLocalizedValue(editing.desc, activeLang)}
              onChange={(e) => setEditing({ 
                ...editing, 
                desc: { ...editing.desc, [activeLang]: e.target.value } 
              })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
              placeholder="Enter description..."
            />
          </div>

          {/* Enabled */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={editing.enabled !== false}
                onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-vermilion focus:ring-vermilion"
              />
              Show on website
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="w-full py-3 rounded-xl bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editing._id ? 'Update Entry' : 'Add Entry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h4 className="text-lg font-serif font-semibold text-ink">History Entries</h4>
          <p className="text-xs text-ink-soft">Manage the history timeline entries</p>
        </div>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-vermilion text-white text-sm font-semibold hover:bg-[#a83a0c] transition-all"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {history?.length === 0 ? (
        <div className="text-center py-12 text-ink-soft">
          <ImageIcon size={48} className="mx-auto text-ink-soft/30 mb-3" />
          <p>No history entries yet</p>
          <p className="text-sm mt-1">Click "Add Entry" to create your first history entry</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-soft uppercase tracking-wider w-16">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-soft uppercase tracking-wider w-20">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-soft uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-soft uppercase tracking-wider hidden md:table-cell">Title</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-soft uppercase tracking-wider hidden lg:table-cell">Year</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-soft uppercase tracking-wider w-24">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-ink-soft uppercase tracking-wider w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-ink-soft">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {item.photo ? (
                        <img src={item.photo} alt={item.period?.en} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-soft/30">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{item.period?.en || 'Untitled'}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-ink-soft">{item.title?.en || ''}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-ink-soft">{item.year || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      item.enabled !== false ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.enabled !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      {item.enabled !== false ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(item._id, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMove(item._id, 'down')}
                        disabled={index === history.length - 1}
                        className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown size={16} />
                      </button>
                      <button
                        onClick={() => handleToggle(item._id)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                        title={item.enabled !== false ? 'Hide' : 'Show'}
                      >
                        {item.enabled !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button
                        onClick={() => setEditing(item)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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