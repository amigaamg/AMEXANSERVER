import Button from '@/components/common/Button';

interface QuickActionsProps {
  floating?: boolean;
}

export default function QuickActions({ floating }: QuickActionsProps) {
  const containerStyle = floating
    ? {
        position: 'fixed',
        bottom: 80,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 50,
      }
    : { display: 'flex', flexDirection: 'column', gap: 10 };

  return (
    <div style={containerStyle}>
      <Button variant="danger" style={{ width: 50, height: 50, borderRadius: '50%', fontSize: 20 }}>
        🚑
      </Button>
      <Button variant="primary" style={{ width: 50, height: 50, borderRadius: '50%', fontSize: 20 }}>
        📅
      </Button>
      <Button variant="success" style={{ width: 50, height: 50, borderRadius: '50%', fontSize: 20 }}>
        💬
      </Button>
    </div>
  );
}