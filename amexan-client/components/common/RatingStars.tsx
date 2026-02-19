import React from 'react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  style?: React.CSSProperties;
}

export default function RatingStars({ rating, max = 5, size = 20, interactive = false, onChange, style }: RatingStarsProps) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => interactive && onChange?.(i)}
        style={{
          fontSize: size,
          cursor: interactive ? 'pointer' : 'default',
          color: i <= rating ? '#fbbf24' : '#e2e8f0',
          transition: 'color 0.2s',
        }}
      >
        ★
      </span>
    );
  }
  return <div style={{ display: 'flex', gap: 2, ...style }}>{stars}</div>;
}