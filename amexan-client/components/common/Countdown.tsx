import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string | Date;
  onComplete?: () => void;
  style?: React.CSSProperties;
}

export default function Countdown({ targetDate, onComplete, style }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('0d 0h 0m');
        onComplete?.();
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return <span style={style}>{timeLeft}</span>;
}