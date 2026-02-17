import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export default function Card({ children, className = '', style, padding = 'md' }: CardProps) {
  const paddingMap = {
    none: 0,
    sm: '12px',
    md: '20px',
    lg: '28px',
  };
  return (
    <div
      className={className}
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: paddingMap[padding],
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}