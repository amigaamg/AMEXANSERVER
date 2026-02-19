import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import VitalsChart from '../VitalsChart';
import type { Measurement } from '@/types/patient';

interface HypertensionModuleProps {
  measurements: Measurement[];
  onLogBP: () => void;
}

export default function HypertensionModule({ measurements, onLogBP }: HypertensionModuleProps) {
  const bpReadings = measurements.filter(m => m.type === 'bp').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  const latest = bpReadings[0];

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Hypertension Management</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Latest BP</div>
          {latest ? (
            <div style={{ fontSize: 32, fontWeight: 700 }}>{latest.systolic}/{latest.diastolic} <span style={{ fontSize: 14, color: '#94a3b8' }}>mmHg</span></div>
          ) : (
            <div style={{ color: '#94a3b8' }}>No data</div>
          )}
        </div>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Target</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>130/80 <span style={{ fontSize: 14, color: '#94a3b8' }}>mmHg</span></div>
        </div>
      </div>
      <VitalsChart measurements={bpReadings.slice(0, 10)} type="bp" />
      <Button variant="primary" onClick={onLogBP} style={{ marginTop: 16, width: '100%' }}>Log BP Reading</Button>
    </Card>
  );
}