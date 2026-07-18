import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, User, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminTeam = ({ team, setTeam, t }) => {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const blank = () => ({
    photo: null,
    name: { en: '', ne: '', hi: '', zh: '', ta: '' },
    role: { en: '', ne: '', hi: '', zh: '', ta: '' },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing._id) {
        const response = await api.put(`/admin/team/${editing._id}`, editing);
        setTeam(team.map(m => m._id === editing._id ? response.data : m));
        showToast(t.teamSaved || 'Team member updated', 'success');
      } else {
        const response = await api.post('/admin/team', editing);
        setTeam([...team, response.data]);
        showToast(t.teamSaved || 'Team member added', 'success');
      }
      setEditing(null);
    } catch (error) {
      console.error('Save team error:', error);
      showToast(error.response?.data?.message || 'Failed to save team member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/team/${id}`);
      setTeam(team.filter(m => m._id !== id));
      showToast(t.teamRemoved || 'Team member deleted', 'success');
    } catch (error) {
      console.error('Delete team error:', error);
      showToast(error.response?.data?.message || 'Failed to delete team member', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Separate upload for team photo
  const handleTeamPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('teamId', editing._id || 'new');

    try {
      const response = await api.post('/admin/upload/team', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEditing({ ...editing, photo: response.data.url });
      showToast(t.photoUploaded || 'Team photo uploaded successfully', 'success');
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
          <h4 className="text-sm font-serif font-semibold">{t.manageTeam}</h4>
          <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-panel transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-ink block mb-1.5">{t.teamPhoto}</label>
          <div
            className="relative border-2 border-dashed border-line rounded-rt overflow-hidden h-32 flex items-center justify-center cursor-pointer bg-panel hover:border-vermilion transition-colors"
          >
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleTeamPhotoUpload} 
              className="hidden" 
              id="team-photo-upload" 
            />
            <label htmlFor="team-photo-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
              {editing.photo ? (
                <img src={editing.photo} alt="Team" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-ink-soft">
                  <User size={32} />
                  <span className="text-sm font-medium">Click to upload team photo</span>
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
          <label className="text-xs font-bold text-ink block mb-1.5">{t.teamName}</label>
          <input
            type="text"
            value={editing.name[activeLang] || ''}
            onChange={(e) => setEditing({ ...editing, name: { ...editing.name, [activeLang]: e.target.value } })}
            className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">{t.teamRole}</label>
          <input
            type="text"
            value={editing.role[activeLang] || ''}
            onChange={(e) => setEditing({ ...editing, role: { ...editing.role, [activeLang]: e.target.value } })}
            className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
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
        <h4 className="text-sm font-serif font-semibold">{t.manageTeam}</h4>
        <button
          onClick={() => setEditing(blank())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
        >
          <Plus size={14} /> {t.add}
        </button>
      </div>

      {team?.length === 0 ? (
        <p className="text-center text-ink-soft py-8">No team members</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.teamPhoto}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.teamName}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden md:table-cell">{t.teamRole}</th>
                <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member._id} className="border-b border-line last:border-0">
                  <td className="py-2">
                    <span className="w-10 h-10 rounded-full bg-panel border border-line flex items-center justify-center overflow-hidden">
                      {member.photo ? (
                        <img src={member.photo} alt={member.name?.en} className="w-full h-full object-cover" />
                      ) : (
                        <User size={16} className="text-ink-soft" />
                      )}
                    </span>
                  </td>
                  <td className="py-2 font-medium">{member.name?.en}</td>
                  <td className="py-2 hidden md:table-cell text-ink-soft">{member.role?.en}</td>
                  <td className="py-2 text-right">
                    <button onClick={() => setEditing(member)} className="p-1.5 rounded-lg text-ink-soft hover:text-maroon hover:bg-panel transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(member._id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
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

export default AdminTeam;