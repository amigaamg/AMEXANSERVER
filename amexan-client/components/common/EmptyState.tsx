import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

export default function EmptyState({ icon = '📭', title, description, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8', ...style }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>{title}</h3>
      {description && <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}