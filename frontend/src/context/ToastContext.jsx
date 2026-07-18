import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timerRef = useRef({});

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    // Auto remove toast after duration
    if (timerRef.current[id]) {
      clearTimeout(timerRef.current[id]);
    }
    
    timerRef.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timerRef.current[id];
    }, duration);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timerRef.current[id]) {
      clearTimeout(timerRef.current[id]);
      delete timerRef.current[id];
    }
  }, []);

  const clearAllToasts = useCallback(() => {
    Object.values(timerRef.current).forEach(timer => clearTimeout(timer));
    timerRef.current = {};
    setToasts([]);
  }, []);

  // Toast component
  const ToastContainer = () => {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const bgColor = toast.type === 'success' ? 'bg-green-600' :
                          toast.type === 'error' ? 'bg-red-600' :
                          toast.type === 'warning' ? 'bg-yellow-600' :
                          'bg-gray-800';
          
          const icon = toast.type === 'success' ? '✅' :
                       toast.type === 'error' ? '❌' :
                       toast.type === 'warning' ? '⚠️' :
                       'ℹ️';

          return (
            <div
              key={toast.id}
              className={`${bgColor} text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-semibold pointer-events-auto animate-toast-in max-w-[90vw]`}
              onClick={() => removeToast(toast.id)}
            >
              <span>{icon}</span>
              <span>{toast.message}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
                className="ml-2 text-white/70 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};