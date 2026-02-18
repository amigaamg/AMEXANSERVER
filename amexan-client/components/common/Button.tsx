import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  onClick,
  style,
  type = 'button',
}: ButtonProps) {
  const sizeStyles = {
    sm: { padding: '4px 12px', fontSize: 12, borderRadius: 8 },
    md: { padding: '10px 20px', fontSize: 14, borderRadius: 10 },
    lg: { padding: '14px 28px', fontSize: 16, borderRadius: 12 },
  };

  const baseStyle = {
    border: 'none',
    fontWeight: 600,
    cursor: loading || disabled ? 'default' : 'pointer',
    opacity: loading || disabled ? 0.6 : 1,
    transition: 'all 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...sizeStyles[size],
    ...style,
  };

  const variants = {
    primary: { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none' },
    success: { background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none' },
    danger:  { background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: 'white', border: 'none' },
    outline: { background: 'transparent', color: '#2563eb', border: '1.5px solid #2563eb' },
    text:    { background: 'transparent', color: '#64748b', border: 'none' },
  };

  return (
    <button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      style={{ ...baseStyle, ...variants[variant] }}
      disabled={disabled || loading}
    >
      {loading ? '…' : children}
    </button>
  );
}