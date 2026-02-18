import { useState } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Pill from '@/components/common/Pill';
import { api } from '@/lib/utils/api';
import type { Lab, ImagingStudy } from '@/types/patient';

interface PatientLabsImagingProps {
  patientId: string;
  labs: Lab[];
  imaging: ImagingStudy[];
  onUpdate: () => void;
}

export default function PatientLabsImaging({ patientId, labs, imaging, onUpdate }: PatientLabsImagingProps) {
  const [labOrder, setLabOrder] = useState({ test: '', notes: '' });
  const [imagingOrder, setImagingOrder] = useState({ type: '', notes: '' });
  const [showLabForm, setShowLabForm] = useState(false);
  const [showImagingForm, setShowImagingForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const orderLab = async () => {
    if (!labOrder.test) return;
    setSaving(true);
    try {
      await api(`/api/patients/${patientId}/labs`, {
        method: 'POST',
        body: JSON.stringify(labOrder),
      });
      setShowLabForm(false);
      setLabOrder({ test: '', notes: '' });
      onUpdate();
    } catch {
      alert('Failed to order lab');
    } finally {
      setSaving(false);
    }
  };

  const orderImaging = async () => {
    if (!imagingOrder.type) return;
    setSaving(true);
    try {
      await api(`/api/patients/${patientId}/imaging`, {
        method: 'POST',
        body: JSON.stringify(imagingOrder),
      });
      setShowImagingForm(false);
      setImagingOrder({ type: '', notes: '' });
      onUpdate();
    } catch {
      alert('Failed to order imaging');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Labs & Imaging</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="primary"
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={() => setShowLabForm(true)}
          >
            🧪 Order Lab
          </Button>
          <Button
            variant="primary"
            style={{ padding: '4px 12px', fontSize: 12 }}
            onClick={() => setShowImagingForm(true)}
          >
            📷 Order Imaging
          </Button>
        </div>
      </div>

      {showLabForm && (
        <div style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Order Lab Test</h4>
          <Input label="Test name" value={labOrder.test} onChange={e => setLabOrder(l => ({ ...l, test: e.target.value }))} />
          <Input label="Notes" value={labOrder.notes} onChange={e => setLabOrder(l => ({ ...l, notes: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={orderLab} loading={saving}>Order</Button>
            <Button variant="outline" onClick={() => setShowLabForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {showImagingForm && (
        <div style={{ marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Order Imaging</h4>
          <Input label="Imaging type (e.g., X-ray Chest)" value={imagingOrder.type} onChange={e => setImagingOrder(i => ({ ...i, type: e.target.value }))} />
          <Input label="Notes" value={imagingOrder.notes} onChange={e => setImagingOrder(i => ({ ...i, notes: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <Button variant="primary" onClick={orderImaging} loading={saving}>Order</Button>
            <Button variant="outline" onClick={() => setShowImagingForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Labs list */}
      <h4 style={{ fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>Recent Labs</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {labs.slice(0, 3).map(lab => (
          <div key={lab._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{lab.name}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{lab.value} {lab.unit} · {new Date(lab.date).toLocaleDateString()}</div>
            </div>
            <Pill
              color={lab.status === 'critical' ? '#ef4444' : lab.status === 'warning' ? '#f59e0b' : '#22c55e'}
              bg={lab.status === 'critical' ? '#fef2f2' : lab.status === 'warning' ? '#fffbeb' : '#f0fdf4'}
            >
              {lab.status}
            </Pill>
          </div>
        ))}
      </div>

      {/* Imaging list */}
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Recent Imaging</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {imaging.slice(0, 3).map(img => (
          <div key={img._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{img.type}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(img.date).toLocaleDateString()}</div>
            </div>
            <Pill
              color={img.status === 'completed' ? '#22c55e' : '#f59e0b'}
              bg={img.status === 'completed' ? '#f0fdf4' : '#fffbeb'}
            >
              {img.status}
            </Pill>
          </div>
        ))}
      </div>
    </Card>
  );
}