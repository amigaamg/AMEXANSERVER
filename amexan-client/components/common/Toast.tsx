'use client';

import React, { useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: () => void;
}

const variantStyles: Record<ToastVariant, { bg: string; color: string; icon: string }> = {
  success: { bg: '#f0fdf4', color: '#22c55e', icon: '✓' },
  error: { bg: '#fef2f2', color: '#ef4444', icon: '✕' },
  info: { bg: '#eff6ff', color: '#2563eb', icon: 'ℹ' },
  warning: { bg: '#fffbeb', color: '#f59e0b', icon: '⚠' },
};

export default function Toast({ message, variant = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const { bg, color, icon } = variantStyles[variant];

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        background: bg,
        border: `1px solid ${color}`,
        borderRadius: 8,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease',
      }}
    >
      <span style={{ color, fontWeight: 700 }}>{icon}</span>
      <span style={{ color: '#1e293b', fontSize: 14 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}