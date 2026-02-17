import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, id, style, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            color: '#64748b',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          width: '100%',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: '12px 16px',
          color: '#1e293b',
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          transition: 'border 0.2s',
          ...style,
        }}
        {...props}
      />
    </div>
  );
}