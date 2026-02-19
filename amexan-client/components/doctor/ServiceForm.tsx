import { useState } from 'react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

interface ServiceFormProps {
  service?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [form, setForm] = useState({
    name: service?.name || '',
    description: service?.description || '',
    specialty: service?.specialty || '',
    duration: service?.duration || 30,
    price: service?.price || 0,
    isFirstVisitOnly: service?.isFirstVisitOnly || false,
    requiresReferral: service?.requiresReferral || false,
    available: service?.available ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (service) {
        await api(`/api/clinics/${service._id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await api('/api/clinics', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
      onSave();
    } catch {
      alert('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{service ? 'Edit' : 'New'} Service</h2>
      <Input label="Clinic Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline rows={2} />
      <Input label="Specialty" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} required />
      <Input label="Duration (minutes)" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} />
      <Input label="Price (KES)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} />
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 16 }}><input type="checkbox" checked={form.isFirstVisitOnly} onChange={e => setForm(f => ({ ...f, isFirstVisitOnly: e.target.checked }))} /> First visit only</label>
        <label style={{ marginRight: 16 }}><input type="checkbox" checked={form.requiresReferral} onChange={e => setForm(f => ({ ...f, requiresReferral: e.target.checked }))} /> Requires referral</label>
        <label><input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} /> Available</label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" onClick={handleSubmit} loading={loading}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </Card>
  );
}