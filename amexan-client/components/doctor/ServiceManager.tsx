import { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import ServiceCard from './ServiceCard';
import { api } from '@/lib/utils/api';

export default function ServiceManager({ doctorId }) {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    specialty: '',
    duration: 30,
    price: 0,
    isFirstVisitOnly: false,
    requiresReferral: false,
    available: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [doctorId]);

  const fetchServices = async () => {
    const data = await api(`/api/doctors/${doctorId}/clinics`);
    setServices(data);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editing) {
        await api(`/api/clinics/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await api('/api/clinics', {
          method: 'POST',
          body: JSON.stringify({ ...form, doctorId }),
        });
      }
      fetchServices();
      setShowForm(false);
      setEditing(null);
      setForm({
        name: '',
        description: '',
        specialty: '',
        duration: 30,
        price: 0,
        isFirstVisitOnly: false,
        requiresReferral: false,
        available: true,
      });
    } catch (err) {
      alert('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditing(service);
    setForm(service);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api(`/api/clinics/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>My Services</h3>
        <Button variant="primary" onClick={() => { setShowForm(true); setEditing(null); }}>+ Add Clinic</Button>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{editing ? 'Edit' : 'New'} Clinic</h4>
          <Input label="Clinic Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <Input label="Specialty" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} />
          <Input label="Duration (minutes)" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} />
          <Input label="Price (KES)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} />
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <label><input type="checkbox" checked={form.isFirstVisitOnly} onChange={e => setForm(f => ({ ...f, isFirstVisitOnly: e.target.checked }))} /> First visit only</label>
            <label><input type="checkbox" checked={form.requiresReferral} onChange={e => setForm(f => ({ ...f, requiresReferral: e.target.checked }))} /> Requires referral</label>
            <label><input type="checkbox" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} /> Available</label>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={handleSubmit} loading={loading}>{editing ? 'Update' : 'Create'}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {services.map(s => (
          <ServiceCard key={s._id} service={s} onEdit={() => handleEdit(s)} onDelete={() => handleDelete(s._id)} />
        ))}
      </div>
    </Card>
  );
}