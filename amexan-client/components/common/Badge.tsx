import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: React.CSSProperties;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#f0fdf4', color: '#22c55e' },
  warning: { bg: '#fffbeb', color: '#f59e0b' },
  danger: { bg: '#fef2f2', color: '#ef4444' },
  info: { bg: '#eff6ff', color: '#2563eb' },
  default: { bg: '#f1f5f9', color: '#64748b' },
};

export default function Badge({ children, variant = 'default', style }: BadgeProps) {
  const { bg, color } = variantStyles[variant];
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