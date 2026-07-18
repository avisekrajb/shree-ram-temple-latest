import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'maroon' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colors = {
    maroon: 'border-maroon',
    white: 'border-white',
    vermilion: 'border-vermilion',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size] || sizes.md} ${colors[color] || colors.maroon} rounded-full animate-spin border-t-transparent`}
      />
    </div>
  );
};

export default LoadingSpinner;