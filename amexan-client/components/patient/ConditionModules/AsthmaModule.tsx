import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import VitalsChart from '../VitalsChart';
import type { Measurement } from '@/types/patient';

interface AsthmaModuleProps {
  measurements: Measurement[];
  onLogPeakFlow: () => void;
}

export default function AsthmaModule({ measurements, onLogPeakFlow }: AsthmaModuleProps) {
  const peakFlowReadings = measurements.filter(m => m.type === 'peakflow').sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  const latest = peakFlowReadings[0];

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Asthma Management</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Latest Peak Flow</div>
          {latest ? (
            <div style={{ fontSize: 32, fontWeight: 700 }}>{latest.value} <span style={{ fontSize: 14, color: '#94a3b8' }}>L/min</span></div>
          ) : (
            <div style={{ color: '#94a3b8' }}>No data</div>
          )}
        </div>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Personal Best</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>450 <span style={{ fontSize: 14, color: '#94a3b8' }}>L/min</span></div>
        </div>
      </div>
      <VitalsChart measurements={peakFlowReadings.slice(0, 10)} type="peakflow" />
      <Button variant="primary" onClick={onLogPeakFlow} style={{ marginTop: 16, width: '100%' }}>Log Peak Flow</Button>
    </Card>
  );
}