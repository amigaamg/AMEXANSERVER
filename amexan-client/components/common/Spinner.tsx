import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export default function Spinner({ size = 40, color = '#2563eb', style }: SpinnerProps) {
  return (
    <div style={{ display: 'inline-block', ...style }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
          style={{ opacity: 0.2 }}
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray="15.7 15.7"
          strokeLinecap="round"
        />
      </svg>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}