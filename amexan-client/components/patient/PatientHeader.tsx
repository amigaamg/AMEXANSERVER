'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/Avatar';
import Badge from '@/components/common/Badge';
import type { Patient } from '@/types/patient';

interface PatientHeaderProps {
  patient: Patient;
  unreadAlerts: number;
  unreadNotifications: number;
  onShowQR: () => void;
  onShowNotifications: () => void;
}

export default function PatientHeader({
  patient,
  unreadAlerts,
  unreadNotifications,
  onShowQR,
  onShowNotifications,
}: PatientHeaderProps) {
  const router = useRouter();

  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg,#2563eb,#1e40af)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 18,
                cursor: 'pointer',
              }}
              onClick={() => router.push('/dashboard/patient')}
            >
              ⚕️
            </div>
            <span style={{ color: '#1e293b', fontWeight: 700, fontSize: 18 }}>AMEXAN</span>
            <span style={{ color: '#94a3b8', fontSize: 12, borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
              Patient Portal
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Notification bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={onShowNotifications}>
              <span style={{ fontSize: 22 }}>🔔</span>
              {unreadNotifications > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    fontSize: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadNotifications}
                </span>
              )}
            </div>
            {/* Alert indicator */}
            {unreadAlerts > 0 && (
              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: 22 }}>⚠️</span>
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    fontSize: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {unreadAlerts}
                </span>
              </div>
            )}
            <button
              onClick={onShowQR}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
                color: '#2563eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>🪪</span> Smartcard
            </button>
            <Avatar name={patient.name} size={36} />
          </div>
        </div>
      </div>
    </div>
  );
}