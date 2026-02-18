import { useState } from 'react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import PatientDetailModal from './PatientDetailModal';
import type { Patient } from '@/types/patient';

interface PatientListProps {
  patients: Patient[];
}

export default function PatientList({ patients }: PatientListProps) {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.universalId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b' }}>My Patients</h3>
        <Input
          placeholder="Search by name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 250 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(p => (
          <div
            key={p._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              background: '#f8fafc',
              borderRadius: 8,
              cursor: 'pointer',
            }}
            onClick={() => setSelectedPatient(p)}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{p.universalId}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {p.riskStatus === 'critical' && <span style={{ color: '#ef4444' }}>🔴</span>}
              {p.riskStatus === 'warning' && <span style={{ color: '#f59e0b' }}>🟡</span>}
            </div>
          </div>
        ))}
      </div>
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </Card>
  );
}