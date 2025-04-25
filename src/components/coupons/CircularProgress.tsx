
import React from 'react';

interface CircularProgressProps {
  value: string;
  color?: string;
}

export function CircularProgress({ value, color = "#3B82F6" }: CircularProgressProps) {
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-current text-gray-200"
          strokeWidth="8"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          className="stroke-current transition-all duration-300 ease-in-out"
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            stroke: color,
            strokeDasharray: `${251.2}`,
            strokeDashoffset: `${251.2 * 0.25}`,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
