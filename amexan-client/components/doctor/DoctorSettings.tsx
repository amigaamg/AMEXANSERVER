import { useState, useRef } from 'react';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { api } from '@/lib/utils/api';

export default function DoctorSettings({ doctor }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    name: doctor.name || '',
    email: doctor.email || '',
    phone: doctor.phone || '',
    specialty: doctor.specialty || '',
    qualifications: doctor.qualifications?.join(', ') || '',
    languages: doctor.languages?.join(', ') || '',
    experienceYears: doctor.experienceYears || 0,
    consultationFee: doctor.consultationFee || 0,
    location: doctor.location?.address || '',
  });
  const [bank, setBank] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    branch: '',
  });
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      await api(`/api/doctors/${doctor._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          qualifications: form.qualifications.split(',').map(s => s.trim()),
          languages: form.languages.split(',').map(s => s.trim()),
        }),
      });
      alert('Profile updated');
    } catch {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    try {
      await fetch(`/api/doctors/${doctor._id}/photo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('amexan_token')}` },
        body: formData,
      });
      alert('Photo updated');
    } catch {
      alert('Photo upload failed');
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
        {['profile', 'banking', 'privacy'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? '#2563eb' : '#64748b',
              fontWeight: activeTab === tab ? 600 : 500,
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#2563eb,#1e40af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 28,
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {doctor.photoUrl ? (
                <img src={doctor.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                doctor.name?.charAt(0)
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>Change Photo</Button>
          </div>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input label="Specialty" value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} />
          <Input label="Qualifications (comma separated)" value={form.qualifications} onChange={e => setForm(f => ({ ...f, qualifications: e.target.value }))} />
          <Input label="Languages (comma separated)" value={form.languages} onChange={e => setForm(f => ({ ...f, languages: e.target.value }))} />
          <Input label="Years of Experience" type="number" value={form.experienceYears} onChange={e => setForm(f => ({ ...f, experienceYears: +e.target.value }))} />
          <Input label="Consultation Fee (KES)" type="number" value={form.consultationFee} onChange={e => setForm(f => ({ ...f, consultationFee: +e.target.value }))} />
          <Input label="Address" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <Button variant="primary" onClick={handleProfileSave} loading={loading}>Save Profile</Button>
        </>
      )}

      {activeTab === 'banking' && (
        <>
          <Input label="Account Name" value={bank.accountName} onChange={e => setBank(b => ({ ...b, accountName: e.target.value }))} />
          <Input label="Account Number" value={bank.accountNumber} onChange={e => setBank(b => ({ ...b, accountNumber: e.target.value }))} />
          <Input label="Bank Name" value={bank.bankName} onChange={e => setBank(b => ({ ...b, bankName: e.target.value }))} />
          <Input label="Branch" value={bank.branch} onChange={e => setBank(b => ({ ...b, branch: e.target.value }))} />
          <Button variant="primary" onClick={() => alert('Bank details saved')}>Save Bank Info</Button>
        </>
      )}

      {activeTab === 'privacy' && (
        <div>
          <p style={{ color: '#64748b', marginBottom: 16 }}>Control who can see your profile and availability.</p>
          <label style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#2563eb' }} />
            <span>Show profile in patient search</span>
          </label>
          <label style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#2563eb' }} />
            <span>Show consultation fee publicly</span>
          </label>
          <label style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#2563eb' }} />
            <span>Allow online booking</span>
          </label>
          <Button variant="primary" style={{ marginTop: 16 }}>Save Preferences</Button>
        </div>
      )}
    </Card>
  );
}