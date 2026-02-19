import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import VitalsChart from '../VitalsChart';
import type { Measurement } from '@/types/patient';

interface DiabetesModuleProps {
  measurements: Measurement[];
  onLogGlucose: () => void;
}

export default function DiabetesModule({ measurements, onLogGlucose }: DiabetesModuleProps) {
  const glucoseReadings = measurements.filter(m => m.type === 'glucose').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  const latest = glucoseReadings[0];

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Diabetes Management</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Latest Glucose</div>
          {latest ? (
            <div style={{ fontSize: 32, fontWeight: 700 }}>{latest.value} <span style={{ fontSize: 14, color: '#94a3b8' }}>mmol/L</span></div>
          ) : (
            <div style={{ color: '#94a3b8' }}>No data</div>
          )}
        </div>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>HbA1c</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>7.0%</div>
        </div>
      </div>
      <VitalsChart measurements={glucoseReadings.slice(0, 10)} type="glucose" />
      <Button variant="primary" onClick={onLogGlucose} style={{ marginTop: 16, width: '100%' }}>Log Glucose</Button>
    </Card>
  );
}