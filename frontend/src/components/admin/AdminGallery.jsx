import React, { useState } from 'react';
import { Plus, Trash2, Image, Youtube, Camera, X, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import api from '../../services/api';

const AdminGallery = ({ gallery, setGallery, galleryVideos, setGalleryVideos, t }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('photos');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [photoCaption, setPhotoCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [activeLang, setActiveLang] = useState('en');

  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
    return match ? match[1] : null;
  };

  // Separate upload for Gallery photo
  const handleGalleryPhotoUpload = async (e) => {
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
    formData.append('cap', JSON.stringify({ en: photoCaption || 'Temple Photo' }));
    formData.append('hue', '#7A1F2B');

    try {
      const response = await api.post('/admin/upload/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setGallery([response.data.galleryItem, ...gallery]);
      setShowAddPhoto(false);
      setPhotoCaption('');
      showToast(t.galleryPhotoSaved || 'Photo added successfully', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Failed to add photo', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/gallery/${id}`);
      setGallery(gallery.filter(g => g._id !== id));
      showToast(t.galleryPhotoRemoved || 'Photo deleted successfully', 'success');
    } catch (error) {
      console.error('Delete photo error:', error);
      showToast(error.response?.data?.message || 'Failed to delete photo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    if (!videoUrl || !getYoutubeId(videoUrl)) {
      showToast(t.invalidYoutube || 'Invalid YouTube URL', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/admin/gallery/videos', {
        url: videoUrl,
        cap: { en: videoCaption || 'Temple Video' },
      });
      setGalleryVideos([response.data, ...galleryVideos]);
      setShowAddVideo(false);
      setVideoUrl('');
      setVideoCaption('');
      showToast(t.galleryVideoSaved || 'Video added successfully', 'success');
    } catch (error) {
      console.error('Add video error:', error);
      showToast(error.response?.data?.message || 'Failed to add video', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/gallery/videos/${id}`);
      setGalleryVideos(galleryVideos.filter(v => v._id !== id));
      showToast(t.galleryVideoRemoved || 'Video deleted successfully', 'success');
    } catch (error) {
      console.error('Delete video error:', error);
      showToast(error.response?.data?.message || 'Failed to delete video', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit mb-4">
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'photos' ? 'bg-white text-maroon shadow-sm' : 'text-ink-soft hover:text-ink'
          }`}
        >
          <Camera size={14} className="inline mr-1.5" /> {t.galleryPhotos}
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'videos' ? 'bg-white text-maroon shadow-sm' : 'text-ink-soft hover:text-ink'
          }`}
        >
          <Youtube size={14} className="inline mr-1.5" /> {t.galleryVideos}
        </button>
      </div>

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-serif font-semibold">{t.galleryPhotos}</h4>
            <button
              onClick={() => setShowAddPhoto(!showAddPhoto)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
            >
              <Plus size={14} /> {t.addPhoto}
            </button>
          </div>

          {showAddPhoto && (
            <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <LanguageSwitcher active={activeLang} onChange={setActiveLang} t={t} />
              <div className="mb-3">
                <label className="text-xs font-bold text-ink block mb-1.5">{t.photoCaption}</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:border-vermilion focus:outline-none text-sm"
                  placeholder="Enter caption..."
                />
              </div>
              <div
                className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden h-32 flex items-center justify-center cursor-pointer bg-white hover:border-vermilion transition-colors"
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleGalleryPhotoUpload} 
                  className="hidden" 
                  id="gallery-photo-upload" 
                />
                <label htmlFor="gallery-photo-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
                  <div className="flex flex-col items-center gap-2 text-ink-soft">
                    <Image size={32} />
                    <span className="text-sm font-medium">Click to upload photo</span>
                    <span className="text-xs text-ink-soft/60">JPG, PNG, WEBP • Max 5MB</span>
                  </div>
                </label>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAddPhoto(false)}
                className="mt-2 text-xs text-ink-soft hover:text-maroon transition-colors bg-transparent border-0"
              >
                Cancel
              </button>
            </div>
          )}

          {gallery?.length === 0 ? (
            <p className="text-center text-ink-soft py-8">{t.noPhotosYet}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((photo) => (
                <div key={photo._id} className="relative aspect-square rounded-xl overflow-hidden group">
                  {photo.photo ? (
                    <img src={photo.photo} alt={photo.cap?.en} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60 bg-gradient-to-br from-vermilion to-maroon-deep">
                      <Image size={26} />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white text-xs font-semibold px-3 py-4">
                    {photo.cap?.[activeLang] || photo.cap?.en}
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(photo._id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-serif font-semibold">{t.galleryVideos}</h4>
            <button
              onClick={() => setShowAddVideo(!showAddVideo)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-[#a83a0c] transition-all"
            >
              <Plus size={14} /> {t.addVideo}
            </button>
          </div>

          {showAddVideo && (
            <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <div className="mb-3">
                <label className="text-xs font-bold text-ink block mb-1.5">{t.youtubeLink}</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:border-vermilion focus:outline-none text-sm"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="mb-3">
                <label className="text-xs font-bold text-ink block mb-1.5">{t.photoCaption}</label>
                <input
                  type="text"
                  value={videoCaption}
                  onChange={(e) => setVideoCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:border-vermilion focus:outline-none text-sm"
                  placeholder="Enter caption..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddVideo}
                  disabled={loading}
                  className="px-4 py-2 rounded-full bg-vermilion text-white text-sm font-semibold hover:bg-[#a83a0c] transition-all disabled:opacity-50"
                >
                  {loading ? 'Adding...' : t.addVideo}
                </button>
                <button
                  onClick={() => setShowAddVideo(false)}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {galleryVideos?.length === 0 ? (
            <p className="text-center text-ink-soft py-8">{t.noVideosYet}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.photoCaption}</th>
                    <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden md:table-cell">{t.youtubeLink}</th>
                    <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryVideos.map((video) => (
                    <tr key={video._id} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 font-medium">{video.cap?.en || '—'}</td>
                      <td className="py-2.5 hidden md:table-cell text-ink-soft truncate max-w-xs">{video.url}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleDeleteVideo(video._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
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
      )}
    </div>
  );
};

export default AdminGallery;