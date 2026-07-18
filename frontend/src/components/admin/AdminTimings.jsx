import React, { useState } from 'react';
import { Save, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminTimings = ({ settings, updateSettings, t }) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(settings?.timings?.open || '05:00 AM');
  const [close, setClose] = useState(settings?.timings?.close || '08:00 PM');

  const handleSave = async () => {
    try {
      await updateSettings({ timings: { open, close } });
      showToast(t.savedSuccess || 'Timings saved successfully', 'success');
    } catch (error) {
      console.error('Save timings error:', error);
      showToast(error.response?.data?.message || 'Failed to save timings', 'error');
    }
  };

  return (
    <div className="bg-white border border-line rounded-rt p-4 shadow-rt">
      <h4 className="text-sm font-serif font-semibold mb-1">{t.templeTimings}</h4>
      <p className="text-xs text-ink-soft mb-4">{t.openHours}</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-ink block mb-1.5">Open</label>
          <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel">
            <Clock size={16} className="text-ink-soft" />
            <input
              type="text"
              value={open}
              onChange={(e) => setOpen(e.target.value)}
              className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
              placeholder="05:00 AM"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-ink block mb-1.5">Close</label>
          <div className="flex items-center gap-2 border border-line rounded-lg px-3 bg-panel">
            <Clock size={16} className="text-ink-soft" />
            <input
              type="text"
              value={close}
              onChange={(e) => setClose(e.target.value)}
              className="w-full py-2.5 bg-transparent border-0 focus:outline-none text-sm"
              placeholder="08:00 PM"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermilion text-white font-semibold text-sm hover:bg-[#a83a0c] transition-all"
      >
        <Save size={15} /> {t.save}
      </button>
    </div>
  );
};

export default AdminTimings;