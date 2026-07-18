import React from 'react';

export const Divider = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300" />
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300" />
    </div>
  );
};