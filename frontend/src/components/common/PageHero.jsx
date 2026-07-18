import React from 'react';

const PageHero = ({ title, sub }) => {
  return (
    <div className="bg-gradient-to-br from-maroon to-maroon-deep text-white text-center py-14 px-5">
      <h1 className="text-3xl md:text-4xl font-serif">{title}</h1>
      {sub && <p className="text-white/80 max-w-lg mx-auto mt-2.5 text-sm">{sub}</p>}
    </div>
  );
};

export default PageHero;