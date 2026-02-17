'use client';

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: active === tab.id ? 'white' : 'transparent',
            color: active === tab.id ? '#2563eb' : '#64748b',
            fontWeight: active === tab.id ? 600 : 500,
            fontSize: 13,
            cursor: 'pointer',
            borderBottom: active === tab.id ? '2px solid #2563eb' : '2px solid transparent',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}