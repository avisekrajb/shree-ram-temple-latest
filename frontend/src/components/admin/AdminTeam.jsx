import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, User, Upload, Search, Eye, Users, Award, Mail, Phone, MapPin, Check, XCircle, EyeOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminTeam = ({ team, setTeam, t }) => {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const blank = () => ({
    photo: null,
    name: { en: '', ne: '', hi: '', zh: '', ta: '' },
    role: { en: '', ne: '', hi: '', zh: '', ta: '' },
    bio: { en: '', ne: '', hi: '', zh: '', ta: '' },
    email: '',
    phone: '',
    order: team.length,
    enabled: true,
  });

  const handleSave = async () => {
    // Validate required fields
    if (!editing.name?.en?.trim()) {
      showToast('Name is required (English)', 'error');
      return;
    }
    if (!editing.role?.en?.trim()) {
      showToast('Role is required (English)', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editing._id) {
        const response = await api.put(`/admin/team/${editing._id}`, editing);
        setTeam(team.map(m => m._id === editing._id ? response.data : m));
        showToast('Team member updated successfully', 'success');
        if (editing.email) {
          showToast('Team member updated. Email notification sent.', 'info');
        }
      } else {
        const response = await api.post('/admin/team', editing);
        setTeam([...team, response.data]);
        showToast('Team member added successfully', 'success');
        if (response.data.email) {
          showToast('Welcome email sent to team member', 'success');
        }
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
      showToast('Team member deleted successfully', 'success');
    } catch (error) {
      console.error('Delete team error:', error);
      showToast(error.response?.data?.message || 'Failed to delete team member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamPhotoUpload = async (e) => {
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
    formData.append('teamId', editing._id || 'new');

    try {
      const response = await api.post('/admin/upload/team', formData, {
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

  const handleToggleEnabled = async (member) => {
    const newEnabled = !member.enabled;
    try {
      const updated = { ...member, enabled: newEnabled };
      const response = await api.put(`/admin/team/${member._id}`, updated);
      setTeam(team.map(m => m._id === member._id ? response.data : m));
      showToast(newEnabled ? 'Member enabled' : 'Member disabled', 'success');
    } catch (error) {
      console.error('Toggle enabled error:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[activeLang] || obj.en || '';
  };

  // Filter team members based on search
  const filteredTeam = team.filter(member => {
    const name = member.name?.en?.toLowerCase() || '';
    const role = member.role?.en?.toLowerCase() || '';
    const email = (member.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || role.includes(search) || email.includes(search);
  });

  if (editing) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-serif font-semibold text-ink">
            {editing._id ? 'Edit Team Member' : 'Add New Team Member'}
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
            <label className="text-xs font-bold text-ink block mb-1.5">Profile Photo</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden h-40 flex items-center justify-center cursor-pointer bg-gray-50 hover:border-vermilion transition-colors">
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
                    <User size={40} />
                    <span className="text-sm font-medium">Click to upload profile photo</span>
                    <span className="text-xs text-ink-soft/60">JPG, PNG, WEBP • Max 5MB</span>
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
          </div>

          <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Name *</label>
              <input
                type="text"
                value={editing.name[activeLang] || ''}
                onChange={(e) => setEditing({ ...editing, name: { ...editing.name, [activeLang]: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
                placeholder="Enter name..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Role *</label>
              <input
                type="text"
                value={editing.role[activeLang] || ''}
                onChange={(e) => setEditing({ ...editing, role: { ...editing.role, [activeLang]: e.target.value } })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
                placeholder="Enter role..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Bio / Description</label>
            <textarea
              rows={3}
              value={editing.bio?.[activeLang] || ''}
              onChange={(e) => setEditing({ ...editing, bio: { ...editing.bio, [activeLang]: e.target.value } })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm bg-gray-50 hover:bg-white transition-colors resize-none"
              placeholder="Enter bio..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5 flex items-center gap-1">
                <Mail size={14} className="text-ink-soft" /> Email
              </label>
              <input
                type="email"
                value={editing.email || ''}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
                placeholder="email@example.com"
              />
              <p className="text-xs text-ink-soft/60 mt-1">Welcome email will be sent to this address</p>
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5 flex items-center gap-1">
                <Phone size={14} className="text-ink-soft" /> Phone
              </label>
              <input
                type="text"
                value={editing.phone || ''}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
                placeholder="+977-XXXXXXXXXX"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
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

          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="w-full py-3 rounded-xl bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editing._id ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-100 gap-4">
        <div>
          <h4 className="text-lg font-serif font-semibold text-ink flex items-center gap-2">
            <Users size={20} className="text-vermilion" />
            {t.manageTeam || 'Team Members'}
          </h4>
          <p className="text-xs text-ink-soft">
            Total: <span className="font-bold text-ink">{team?.length || 0}</span> members
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
            />
          </div>
          <button
            onClick={() => setEditing(blank())}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-vermilion text-white text-sm font-semibold hover:bg-[#a83a0c] transition-all whitespace-nowrap"
          >
            <Plus size={16} /> {t.add || 'Add Member'}
          </button>
        </div>
      </div>

      {/* Team Grid */}
      {filteredTeam?.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-ink-soft">{searchTerm ? 'No members found matching your search' : 'No team members added yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 max-h-[600px] overflow-y-auto scroll-smooth">
          {filteredTeam.map((member) => (
            <div
              key={member._id}
              className="group bg-white rounded-xl border border-gray-100 hover:border-vermilion/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Photo */}
              <div className="relative aspect-square bg-gradient-to-br from-vermilion/10 to-maroon-deep/5">
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name?.en} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-ink-soft/30" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    member.enabled !== false 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {member.enabled !== false ? <Check size={10} /> : <XCircle size={10} />}
                    {member.enabled !== false ? 'Active' : 'Hidden'}
                  </span>
                </div>
                {/* Actions on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditing(member)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleToggleEnabled(member)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all"
                    title={member.enabled !== false ? 'Hide' : 'Show'}
                  >
                    {member.enabled !== false ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-2 rounded-lg bg-red-500/70 hover:bg-red-500 text-white transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h5 className="font-serif font-semibold text-ink text-sm truncate">
                  {member.name?.en || 'Unknown'}
                </h5>
                <p className="text-xs text-vermilion font-medium truncate">
                  {member.role?.en || 'Member'}
                </p>
                {member.bio?.en && (
                  <p className="text-xs text-ink-soft mt-1 line-clamp-2">
                    {member.bio.en}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-ink-soft/60">
                  {member.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {member.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTeam;