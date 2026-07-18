import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Calendar, Image, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminEvents = ({ events, setEvents, t }) => {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const blank = () => ({
    date: '',
    photo: null,
    upcoming: true,
    title: { en: '', ne: '', hi: '', zh: '', ta: '' },
    desc: { en: '', ne: '', hi: '', zh: '', ta: '' },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing._id) {
        const response = await api.put(`/admin/events/${editing._id}`, editing);
        setEvents(events.map(e => e._id === editing._id ? response.data : e));
        showToast(t.eventSaved || 'Event updated successfully', 'success');
      } else {
        const response = await api.post('/admin/events', editing);
        setEvents([...events, response.data]);
        showToast(t.eventSaved || 'Event added successfully', 'success');
      }
      setEditing(null);
    } catch (error) {
      console.error('Save event error:', error);
      showToast(error.response?.data?.message || 'Failed to save event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      showToast(t.eventRemoved || 'Event deleted successfully', 'success');
    } catch (error) {
      console.error('Delete event error:', error);
      showToast(error.response?.data?.message || 'Failed to delete event', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Separate upload for Event photo
  const handleEventPhotoUpload = async (e) => {
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
    formData.append('eventId', editing._id || 'new');

    try {
      const response = await api.post('/admin/upload/event', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditing({ ...editing, photo: response.data.url });
      showToast(t.photoUploaded || 'Event photo uploaded successfully', 'success');
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
          <h4 className="text-sm font-serif font-semibold">{t.eventTitle}</h4>
          <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-panel transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-ink block mb-1.5">Event Photo</label>
          <div
            className="relative border-2 border-dashed border-line rounded-rt overflow-hidden h-32 flex items-center justify-center cursor-pointer bg-panel hover:border-vermilion transition-colors"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleEventPhotoUpload} 
              className="hidden" 
              id="event-photo-upload" 
            />
            <label htmlFor="event-photo-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
              {editing.photo ? (
                <img src={editing.photo} alt="Event" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-ink-soft">
                  <Image size={32} />
                  <span className="text-sm font-medium">Click to upload event photo</span>
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

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">{t.eventDate}</label>
            <input
              type="date"
              value={editing.date}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
              className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-xs font-bold text-ink">
              <input
                type="checkbox"
                checked={editing.upcoming}
                onChange={(e) => setEditing({ ...editing, upcoming: e.target.checked })}
                className="w-4 h-4 rounded border-line text-vermilion focus:ring-vermilion"
              />
              {t.markUpcoming}
            </label>
          </div>
        </div>

        <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">{t.eventTitle}</label>
          <input
            type="text"
            value={editing.title[activeLang] || ''}
            onChange={(e) => setEditing({ ...editing, title: { ...editing.title, [activeLang]: e.target.value } })}
            className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">{t.eventDesc}</label>
          <textarea
            rows={3}
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
        <h4 className="text-sm font-serif font-semibold">{t.manageEvents}</h4>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
        >
          <Plus size={14} /> {t.add}
        </button>
      </div>

      {events?.length === 0 ? (
        <p className="text-center text-ink-soft py-8">No events</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.eventTitle}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden sm:table-cell">{t.eventDate}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden md:table-cell">{t.upcomingEvents}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b border-line last:border-0">
                  <td className="py-2.5 font-medium flex items-center gap-2">
                    {event.photo && <img src={event.photo} alt="" className="w-8 h-8 rounded object-cover" />}
                    {event.title?.en}
                  </td>
                  <td className="py-2.5 hidden sm:table-cell text-ink-soft">{event.date}</td>
                  <td className="py-2.5 hidden md:table-cell">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${event.upcoming ? 'bg-green-50 text-green-600' : 'bg-panel text-ink-soft'}`}>
                      {event.upcoming ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => setEditing(event)} className="p-1.5 rounded-lg text-ink-soft hover:text-maroon hover:bg-panel transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(event._id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
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

export default AdminEvents;