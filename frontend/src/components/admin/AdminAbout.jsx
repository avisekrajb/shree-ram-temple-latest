import React, { useState, useRef } from 'react';
import { Save, Image, Upload, Plus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminAboutPage = ({ settings, updateSettings, t }) => {
  const { showToast } = useToast();
  const [activeLang, setActiveLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const fileInputRefs = useRef({});

  // About data
  const [about, setAbout] = useState(settings?.about || {
    photo: null,
    title: '',
    intro: '',
    architecturePhoto: null,
    architectureTitle: '',
    architectureBody: '',
    deityPhoto: null,
    deityTitle: '',
    deityBody: '',
    locationPhoto: null,
    locationTitle: '',
    locationBody: '',
    activitiesTitle: '',
    closing: '',
  });

  // Activities
  const [activities, setActivities] = useState(settings?.activities || [
    { title: '', description: '', paragraphs: [] }
  ]);

  // Helper to get current language value
  const getCurrentValue = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[activeLang] || obj.en || '';
  };

  // Helper to update multi-language field
  const updateAboutField = (field, value) => {
    if (typeof about[field] === 'object' && !Array.isArray(about[field])) {
      setAbout({
        ...about,
        [field]: {
          ...about[field],
          [activeLang]: value,
        },
      });
    } else {
      setAbout({
        ...about,
        [field]: value,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, field) => {
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

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/admin/upload/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setAbout({
        ...about,
        [field]: response.data.url,
      });
      
      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
    e.target.value = '';
  };

  // Handle activity changes
  const updateActivity = (index, field, value) => {
    const newActivities = [...activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setActivities(newActivities);
  };

  const updateActivityParagraph = (actIndex, paraIndex, value) => {
    const newActivities = [...activities];
    if (!newActivities[actIndex].paragraphs) {
      newActivities[actIndex].paragraphs = [];
    }
    newActivities[actIndex].paragraphs[paraIndex] = value;
    setActivities(newActivities);
  };

  const addActivity = () => {
    setActivities([...activities, { title: '', description: '', paragraphs: [] }]);
  };

  const removeActivity = (index) => {
    if (activities.length <= 1) {
      showToast('At least one activity is required', 'warning');
      return;
    }
    setActivities(activities.filter((_, i) => i !== index));
  };

  const addParagraph = (actIndex) => {
    const newActivities = [...activities];
    if (!newActivities[actIndex].paragraphs) {
      newActivities[actIndex].paragraphs = [];
    }
    newActivities[actIndex].paragraphs.push('');
    setActivities(newActivities);
  };

  const removeParagraph = (actIndex, paraIndex) => {
    const newActivities = [...activities];
    newActivities[actIndex].paragraphs = newActivities[actIndex].paragraphs.filter((_, i) => i !== paraIndex);
    setActivities(newActivities);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSettings({ 
        about,
        activities,
      });
      showToast('About page saved successfully', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast(error.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Image upload component
  const ImageUploadField = ({ label, field, currentImage }) => (
    <div className="mb-4">
      <label className="text-xs font-bold text-ink block mb-1.5">{label}</label>
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden h-32 flex items-center justify-center cursor-pointer bg-gray-50 hover:border-vermilion transition-colors"
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e, field)} 
          className="hidden" 
          id={`upload-${field}`}
        />
        <label htmlFor={`upload-${field}`} className="absolute inset-0 flex items-center justify-center cursor-pointer">
          {currentImage ? (
            <img src={currentImage} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-ink-soft">
              <Image size={28} />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs text-ink-soft/60">JPG, PNG, WEBP • Max 5MB</span>
            </div>
          )}
        </label>
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {currentImage && !loading && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-bold py-1.5 flex items-center justify-center gap-1.5">
            <Upload size={13} /> Click to change
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-base font-serif font-semibold text-ink mb-4">Hero Section</h4>
        
        <ImageUploadField 
          label="Hero Background Image" 
          field="photo" 
          currentImage={about.photo} 
        />

        <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">Hero Title</label>
          <input
            type="text"
            value={getCurrentValue(about.title)}
            onChange={(e) => updateAboutField('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
            placeholder="About the Temple"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">Hero Intro</label>
          <textarea
            rows={2}
            value={getCurrentValue(about.intro)}
            onChange={(e) => updateAboutField('intro', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
            placeholder="Discover the rich history..."
          />
        </div>
      </div>

      {/* Sections */}
      {['architecture', 'deity', 'location'].map((section) => (
        <div key={section} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-base font-serif font-semibold text-ink mb-4 capitalize">{section} Section</h4>
          
          <ImageUploadField 
            label={`${section} Image`} 
            field={`${section}Photo`} 
            currentImage={about[`${section}Photo`]} 
          />

          <div className="mb-3">
            <label className="text-xs font-bold text-ink block mb-1.5">Title</label>
            <input
              type="text"
              value={getCurrentValue(about[`${section}Title`])}
              onChange={(e) => updateAboutField(`${section}Title`, e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              placeholder={`${section} Title`}
            />
          </div>

          <div className="mb-3">
            <label className="text-xs font-bold text-ink block mb-1.5">Body</label>
            <textarea
              rows={3}
              value={getCurrentValue(about[`${section}Body`])}
              onChange={(e) => updateAboutField(`${section}Body`, e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
              placeholder={`${section} description...`}
            />
          </div>
        </div>
      ))}

      {/* Activities Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-serif font-semibold text-ink">Activities</h4>
          <button
            onClick={addActivity}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
          >
            <Plus size={14} /> Add Activity
          </button>
        </div>

        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">Activities Section Title</label>
          <input
            type="text"
            value={getCurrentValue(about.activitiesTitle)}
            onChange={(e) => updateAboutField('activitiesTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
            placeholder="Temple Activities"
          />
        </div>

        {activities.map((activity, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
            <button
              onClick={() => removeActivity(index)}
              className="absolute top-2 right-2 p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
            >
              <X size={16} />
            </button>

            <div className="mb-3">
              <label className="text-xs font-bold text-ink block mb-1.5">Activity Title</label>
              <input
                type="text"
                value={activity.title || ''}
                onChange={(e) => updateActivity(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
                placeholder="Activity title..."
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-bold text-ink block mb-1.5">Description (or use paragraphs below)</label>
              <textarea
                rows={2}
                value={activity.description || ''}
                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
                placeholder="Activity description..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-ink">Paragraphs</label>
                <button
                  onClick={() => addParagraph(index)}
                  className="text-xs text-vermilion font-semibold hover:underline bg-transparent border-0"
                >
                  + Add Paragraph
                </button>
              </div>
              {(activity.paragraphs || []).map((para, pIndex) => (
                <div key={pIndex} className="flex gap-2 mb-2">
                  <textarea
                    rows={2}
                    value={para || ''}
                    onChange={(e) => updateActivityParagraph(index, pIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
                    placeholder={`Paragraph ${pIndex + 1}...`}
                  />
                  <button
                    onClick={() => removeParagraph(index, pIndex)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all self-start"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Closing Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-base font-serif font-semibold text-ink mb-4">Closing Message</h4>
        
        <div className="mb-3">
          <label className="text-xs font-bold text-ink block mb-1.5">Closing Text</label>
          <input
            type="text"
            value={getCurrentValue(about.closing)}
            onChange={(e) => updateAboutField('closing', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
            placeholder="May Lord Ram bless you all!"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all disabled:opacity-50"
      >
        <Save size={16} />
        {loading ? 'Saving...' : 'Save About Page'}
      </button>
    </div>
  );
};

export default AdminAboutPage;