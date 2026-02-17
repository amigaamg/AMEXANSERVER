import { ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
}

export default function Pill({ children, color = '#2563eb', bg = '#eff6ff', style }: PillProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color: color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}