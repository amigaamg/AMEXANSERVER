import React from 'react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import Countdown from '@/components/common/Countdown'; // we'll add later
import type { Patient, Appointment } from '@/types/patient';

interface HeroSectionProps {
  patient: Patient;
  nextAppointment?: Appointment;
  criticalAlerts: number;
  hasWarnings: boolean;
}

export default function HeroSection({ patient, nextAppointment, criticalAlerts, hasWarnings }: HeroSectionProps) {
  const riskVariant = criticalAlerts > 0 ? 'danger' : hasWarnings ? 'warning' : 'success';
  const riskLabel = criticalAlerts > 0 ? 'Urgent' : hasWarnings ? 'Needs Review' : 'Stable';

  const daysToNext = nextAppointment
    ? Math.ceil((new Date(nextAppointment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar name={patient.name} size={64} />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{patient.name}</h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
              <span style={{ color: '#64748b', fontSize: 14 }}>{patient.age || '—'} years</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: 14 }}>{patient.universalId || '—'}</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <Badge variant={riskVariant}>{riskLabel}</Badge>
              {patient.condition && (
                <>
                  <span style={{ color: '#94a3b8' }}>•</span>
                  <span style={{ color: '#2563eb', fontSize: 14 }}>{patient.condition}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {nextAppointment && daysToNext !== null && (
          <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: 12, textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>NEXT REVIEW</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
              {daysToNext === 0 ? 'Today' : daysToNext === 1 ? 'Tomorrow' : `In ${daysToNext} days`}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{nextAppointment.doctorName || 'Doctor'}</div>
          </div>
        )}
      </div>
    </Card>
  );
}