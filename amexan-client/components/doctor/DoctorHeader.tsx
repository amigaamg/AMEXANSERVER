import React from 'react';
import Avatar from '@/components/common/Avatar';

interface DoctorHeaderProps {
  doctor: {
    name: string;
    photoUrl?: string;
  };
}

export default function DoctorHeader({ doctor }: DoctorHeaderProps) {
  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2563eb,#1e40af)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18 }}>⚕️</div>
            <span style={{ color: '#1e293b', fontWeight: 700, fontSize: 18 }}>AMEXAN</span>
            <span style={{ color: '#94a3b8', fontSize: 12, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>Doctor Portal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar name={doctor.name} src={doctor.photoUrl} size={32} />
            <span style={{ fontSize: 14, color: '#2563eb' }}>Dr. {doctor.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}