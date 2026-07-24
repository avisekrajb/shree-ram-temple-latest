import React, { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { 
  Save, Video, Trash2, Plus, MoveUp, MoveDown, Eye, EyeOff, X
} from 'lucide-react';

const AdminHome = ({ settings, updateSettings, t }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const aboutInputRef = useRef(null);

  // Hero Video
  const [heroVideo, setHeroVideo] = useState(settings?.heroVideo || null);
  const [heroEnabled, setHeroEnabled] = useState(settings?.heroEnabled !== false);

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState(settings?.galleryImages || []);
  
  // About Images
  const [aboutImages, setAboutImages] = useState(settings?.aboutImages || []);

  // Live Video
  const [liveVideo, setLiveVideo] = useState(settings?.liveVideo || {
    enabled: true,
    url: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf&autoplay=1&mute=1',
    title: { en: 'Live Darshan', ne: 'लाइभ दर्शन', hi: 'लाइव दर्शन', zh: '现场朝拜', ta: 'நேரடி தரிசனம்' },
    description: { en: 'Experience the divine presence of Lord Ram from anywhere in the world', ne: 'संसारको कुनै पनि स्थानबाट भगवान रामको दिव्य उपस्थिति अनुभव गर्नुहोस्', hi: 'दुनिया में कहीं से भी भगवान राम की दिव्य उपस्थिति का अनुभव करें', zh: '从世界任何地方体验罗摩神的神圣存在', ta: 'உலகில் எங்கிருந்தும் ராமரின் தெய்வீக இருப்பை அனுபவியுங்கள்' },
  });

  // Hero Video Upload
  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Please upload a video file', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showToast('Video must be less than 50MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await api.post('/admin/upload/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setHeroVideo(response.data.url);
      showToast('Hero video uploaded successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleHeroRemove = () => {
    setHeroVideo(null);
    showToast('Hero video removed', 'success');
  };

  // Gallery Image Upload
  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('data', JSON.stringify({
      cap: { en: 'Gallery Image' },
      hue: '#7A1F2B',
    }));

    try {
      const response = await api.post('/admin/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const newImageData = response.data.data || response.data;
      const newImage = {
        id: newImageData._id || Date.now().toString(),
        src: newImageData.photo || newImageData.url,
        alt: { en: 'Gallery Image', ne: 'ग्यालरी छवि', hi: 'गैलरी छवि', zh: '图库图片', ta: 'கேலரி படம்' },
        order: galleryImages.length,
        enabled: true,
      };
      setGalleryImages([...galleryImages, newImage]);
      showToast('Image added to gallery', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleGalleryRemove = (id) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
    showToast('Image removed from gallery', 'success');
  };

  const handleGalleryToggle = (id) => {
    setGalleryImages(galleryImages.map(img => 
      img.id === id ? { ...img, enabled: !img.enabled } : img
    ));
  };

  const handleGalleryMove = (id, direction) => {
    const index = galleryImages.findIndex(img => img.id === id);
    if (direction === 'up' && index > 0) {
      const newImages = [...galleryImages];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      setGalleryImages(newImages);
    } else if (direction === 'down' && index < galleryImages.length - 1) {
      const newImages = [...galleryImages];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setGalleryImages(newImages);
    }
  };

  // About Images
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
    showToast('About image removed', 'success');
  };

  const handleAboutImageToggle = (id) => {
    setAboutImages(aboutImages.map(img => 
      img.id === id ? { ...img, enabled: !img.enabled } : img
    ));
  };

  // Save all settings
  const handleSave = async () => {
    setLoading(true);
    try {
      const data = {
        heroVideo,
        heroEnabled,
        galleryImages,
        aboutImages,
        liveVideo,
      };
      await updateSettings(data);
      showToast('Home page settings saved successfully', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showToast(error.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-serif font-semibold text-ink">Hero Video</h4>
            <p className="text-xs text-ink-soft">Upload a hero video for the homepage</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
              <input
                type="checkbox"
                checked={heroEnabled}
                onChange={(e) => setHeroEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-vermilion focus:ring-vermilion"
              />
              Show on Homepage
            </label>
          </div>
        </div>

        <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 hover:border-vermilion transition-colors">
          {heroVideo ? (
            <div className="relative aspect-video">
              <video src={heroVideo} className="w-full h-full object-cover" controls />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={handleHeroRemove}
                  className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center justify-center h-48 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Video size={40} className="text-ink-soft/40 mb-2" />
              <span className="text-sm font-medium text-ink-soft">Click to upload hero video</span>
              <span className="text-xs text-ink-soft/60">MP4, MOV, AVI • Max 50MB</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleHeroVideoUpload}
            className="hidden"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}
        </div>
        {heroVideo && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 text-xs text-vermilion hover:text-[#a83a0c] transition-colors"
          >
            Change Video
          </button>
        )}
      </div>

      {/* Gallery Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-serif font-semibold text-ink">Gallery Images</h4>
            <p className="text-xs text-ink-soft">Manage images shown in the homepage gallery carousel</p>
          </div>
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
          >
            <Plus size={14} /> Add Image
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryUpload}
            className="hidden"
          />
        </div>

        {galleryImages.length === 0 ? (
          <div className="text-center py-8 text-ink-soft text-sm">
            No gallery images added yet
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleryImages.map((img, index) => (
              <div key={img.id} className="relative group border rounded-lg overflow-hidden">
                <img src={img.src} alt={img.alt?.en} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleGalleryToggle(img.id)}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
                    title={img.enabled ? 'Hide' : 'Show'}
                  >
                    {img.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => handleGalleryMove(img.id, 'up')}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all disabled:opacity-30"
                    disabled={index === 0}
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    onClick={() => handleGalleryMove(img.id, 'down')}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all disabled:opacity-30"
                    disabled={index === galleryImages.length - 1}
                  >
                    <MoveDown size={14} />
                  </button>
                  <button
                    onClick={() => handleGalleryRemove(img.id)}
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
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Preview Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-serif font-semibold text-ink">About Preview Images</h4>
            <p className="text-xs text-ink-soft">Manage images shown in the About section preview</p>
          </div>
          <button
            onClick={() => aboutInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
          >
            <Plus size={14} /> Add Image
          </button>
          <input
            ref={aboutInputRef}
            type="file"
            accept="image/*"
            onChange={handleAboutImageUpload}
            className="hidden"
          />
        </div>

        {aboutImages.length === 0 ? (
          <div className="text-center py-8 text-ink-soft text-sm">
            No about preview images added yet
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {aboutImages.map((img) => (
              <div key={img.id} className="relative group border rounded-lg overflow-hidden">
                <img src={img.src} alt={img.alt?.en} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleAboutImageToggle(img.id)}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
                    title={img.enabled ? 'Hide' : 'Show'}
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

      {/* Live Video Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-serif font-semibold text-ink">Live Video</h4>
            <p className="text-xs text-ink-soft">Manage the live video section on the homepage</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
            <input
              type="checkbox"
              checked={liveVideo.enabled}
              onChange={(e) => setLiveVideo({ ...liveVideo, enabled: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-vermilion focus:ring-vermilion"
            />
            Show on Homepage
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">YouTube URL</label>
            <input
              type="text"
              value={liveVideo.url}
              onChange={(e) => setLiveVideo({ ...liveVideo, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              placeholder="https://www.youtube.com/embed/..."
            />
            <p className="text-xs text-ink-soft mt-1">Paste the embed URL from YouTube</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Title (English)</label>
              <input
                type="text"
                value={liveVideo.title?.en || ''}
                onChange={(e) => setLiveVideo({ ...liveVideo, title: { ...liveVideo.title, en: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">Title (Nepali)</label>
              <input
                type="text"
                value={liveVideo.title?.ne || ''}
                onChange={(e) => setLiveVideo({ ...liveVideo, title: { ...liveVideo.title, ne: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Description (English)</label>
            <textarea
              rows={2}
              value={liveVideo.description?.en || ''}
              onChange={(e) => setLiveVideo({ ...liveVideo, description: { ...liveVideo.description, en: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">Description (Nepali)</label>
            <textarea
              rows={2}
              value={liveVideo.description?.ne || ''}
              onChange={(e) => setLiveVideo({ ...liveVideo, description: { ...liveVideo.description, ne: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-vermilion focus:outline-none text-sm resize-none"
            />
          </div>
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
              Save Home Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminHome;