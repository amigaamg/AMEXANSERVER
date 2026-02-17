interface QuickActionsProps {
  onEmergency: () => void;
  onLogBP: () => void;
  onBook: () => void;
}

export default function QuickActions({ onEmergency, onLogBP, onBook }: QuickActionsProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      right: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      zIndex: 50,
    }}>
      <button
        onClick={onEmergency}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#ef4444',
          border: '2px solid #dc2626',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(239,68,68,0.4)',
          animation: 'pulse 2s infinite',
        }}
      >
        🚑
      </button>
      <button
        onClick={onLogBP}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#2563eb',
          border: 'none',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
        }}
      >
        ❤️
      </button>
      <button
        onClick={onBook}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#16a34a',
          border: 'none',
          color: 'white',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(22,163,74,0.4)',
        }}
      >
        📅
      </button>
      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  );
}