import React, { useState } from 'react';
import { Save, Trash2, QrCode } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AdminDonations = ({ donations, setDonations, settings, updateSettings, t, lang }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [qrPhoto, setQrPhoto] = useState(settings?.donate?.qrPhoto || null);
  const [baseCount, setBaseCount] = useState(settings?.donate?.baseCount || 1248);
  const [bankNumber, setBankNumber] = useState(settings?.donate?.bankNumber || 'eSewa / COD — 98XXXXXXXX');

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this donation record?')) return;
    setLoading(true);
    try {
      await api.delete(`/admin/donations/${id}`);
      setDonations(donations.filter(d => d._id !== id));
      showToast(t.donationRemoved || 'Donation deleted successfully', 'success');
    } catch (error) {
      console.error('Delete donation error:', error);
      showToast(error.response?.data?.message || 'Failed to delete donation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/admin/upload/qr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setQrPhoto(response.data.url);
      await updateSettings({ donate: { ...settings?.donate, qrPhoto: response.data.url } });
      showToast(t.photoUploaded || 'QR code uploaded', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    }
    e.target.value = '';
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings({ donate: { qrPhoto, baseCount, bankNumber } });
      showToast(t.savedSuccess || 'Donation settings saved', 'success');
    } catch (error) {
      console.error('Save donation settings error:', error);
      showToast(error.response?.data?.message || 'Failed to save settings', 'error');
    }
  };

  return (
    <div>
      {/* Donation Settings */}
      <div className="bg-white border border-line rounded-rt p-4 shadow-rt mb-4">
        <h4 className="text-sm font-serif font-semibold mb-1">{t.manageDonate}</h4>
        <p className="text-xs text-ink-soft mb-4">QR Code</p>

        <div
          className="relative border-2 border-dashed border-line rounded-rt overflow-hidden h-28 flex items-center justify-center cursor-pointer bg-panel hover:border-vermilion transition-colors mb-4"
        >
          <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" id="qr-upload" />
          <label htmlFor="qr-upload" className="absolute inset-0 flex items-center justify-center cursor-pointer">
            {qrPhoto ? (
              <img src={qrPhoto} alt="QR" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-ink-soft">
                <QrCode size={28} />
                <span className="text-xs font-semibold">{t.uploadPhoto}</span>
              </div>
            )}
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">{t.startingCount}</label>
            <input
              type="number"
              value={baseCount}
              onChange={(e) => setBaseCount(Number(e.target.value) || 0)}
              className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink block mb-1.5">{t.bankDonationNumber}</label>
            <input
              type="text"
              value={bankNumber}
              onChange={(e) => setBankNumber(e.target.value)}
              className="w-full px-3 py-2.5 border border-line rounded-lg bg-panel focus:border-vermilion focus:outline-none transition-colors text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all"
        >
          <Save size={15} /> {t.save}
        </button>
      </div>

      {/* Donation Records */}
      <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-serif font-semibold">{t.donationRecords}</h4>
          <span className="text-xs text-ink-soft">{donations?.length || 0} records</span>
        </div>

        {donations?.length === 0 ? (
          <p className="text-center text-ink-soft py-8">{t.noDonationsYet}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-line">
                  <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide">{t.fullName}</th>
                  <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden sm:table-cell">{t.email}</th>
                  <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide hidden md:table-cell">{t.bookedOn}</th>
                  <th className="pb-2 text-xs font-bold text-ink-soft uppercase tracking-wide text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice().reverse().map((donation) => (
                  <tr key={donation._id} className="border-b border-line last:border-0">
                    <td className="py-2.5 font-medium flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-maroon text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {donation.name?.charAt(0).toUpperCase()}
                      </span>
                      {donation.name}
                    </td>
                    <td className="py-2.5 hidden sm:table-cell text-ink-soft">{donation.email}</td>
                    <td className="py-2.5 hidden md:table-cell text-ink-soft">
                      {new Date(donation.date).toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-US')}
                    </td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => handleDelete(donation._id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
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
    </div>
  );
};

export default AdminDonations;