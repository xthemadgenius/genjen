import React from 'react';

const MovingStrip = () => {
  const text = "Collect your eco NTSs";
  const repeatedText = Array(8).fill(text).join(" + ");

  return (
    <div className="bg-purple-600 py-8 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee">
        <span className="text-white text-4xl md:text-6xl font-bold inline-block">
          {repeatedText}
        </span>
      </div>
    </div>
  );
};

export default MovingStrip;