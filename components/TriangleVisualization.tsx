
import React from 'react';

export const TriangleVisualization: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center my-8 md:my-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="text-light-accent dark:text-dark-accent" stopColor="currentColor" />
            <stop offset="100%" className="text-blue-400 dark:text-blue-300" stopColor="currentColor" />
          </linearGradient>
        </defs>
        <polygon
          points="50,10 95,85 5,85"
          className="fill-transparent stroke-[2]"
          stroke="url(#triangleGradient)"
        />
        <text x="50" y="8" className="text-[6px] font-semibold fill-current text-light-text dark:text-dark-text text-center" textAnchor="middle">Future</text>
        <text x="6" y="94" className="text-[6px] font-semibold fill-current text-light-text dark:text-dark-text" textAnchor="start">Past</text>
        <text x="94" y="94" className="text-[6px] font-semibold fill-current text-light-text dark:text-dark-text" textAnchor="end">Present</text>
      </svg>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div className="text-center font-bold text-light-text dark:text-dark-text">
          <p className="text-lg">Futures</p>
          <p className="text-lg">Triangle</p>
        </div>
      </div>
    </div>
  );
};
