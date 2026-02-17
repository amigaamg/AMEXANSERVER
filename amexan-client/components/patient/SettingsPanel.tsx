import { useState, useRef, useEffect } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { api } from '@/lib/utils/api';
import type { Patient } from '@/types/patient';

interface SettingsPanelProps {
  patient: Patient;
  patientId: string;
  onUpdate: () => void;
}

export default function SettingsPanel({ patient, patientId, onUpdate }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy'>('profile');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    dob: '',
    bloodType: '',
    gender: '',
    address: '',
    emergencyContact: '',
  });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [privacy, setPrivacy] = useState({
    shareHistory: true,
    shareAdherence: true,
    receiveBPReminders: true,
    receiveEmail: true,
    receiveEducation: false,
    shareAnonymous: false,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || '',
        phone: patient.phone || '',
        email: patient.email || '',
        dob: '',
        bloodType: patient.bloodType || '',
        gender: '',
        address: '',
        emergencyContact: '',
      });
    }
  }, [patient]);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await api(`/api/patients/${patientId}`, {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      alert('Profile updated');
      onUpdate();
    } catch {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password.new !== password.confirm) {
      alert("Passwords don't match");
      return;
    }
    if (password.new.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await api('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new,
        }),
      });
      alert('Password updated');
      setPassword({ current: '', new: '', confirm: '' });
    } catch {
      alert('Password change failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}/photo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('amexan_token')}` },
        body: formData,
      });
      alert('Photo updated');
      onUpdate();
    } catch {
      alert('Photo upload failed');
    }
  };

  return (
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>Account Settings</h3>
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
        {(['profile', 'security', 'privacy'] as const).map(tab => (
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
              {patient.photoUrl ? (
                <img src={patient.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                patient.name?.charAt(0)
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>Change Photo</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
            <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Date of Birth" type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            <Input label="Blood Type" value={form.bloodType} onChange={e => setForm(f => ({ ...f, bloodType: e.target.value }))} />
            <Input label="Gender" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} />
          </div>
          <Input label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          <Input label="Emergency Contact" value={form.emergencyContact} onChange={e => setForm(f => ({ ...f, emergencyContact: e.target.value }))} />
          <Button variant="primary" onClick={handleProfileSave} loading={saving} style={{ marginTop: 16 }}>Save Profile</Button>
        </>
      )}

      {activeTab === 'security' && (
        <>
          <Input label="Current Password" type="password" value={password.current} onChange={e => setPassword(p => ({ ...p, current: e.target.value }))} />
          <Input label="New Password" type="password" value={password.new} onChange={e => setPassword(p => ({ ...p, new: e.target.value }))} />
          <Input label="Confirm New Password" type="password" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} />
          <Button variant="primary" onClick={handlePasswordChange} loading={saving}>Update Password</Button>
        </>
      )}

      {activeTab === 'privacy' && (
        <div>
          {[
            ['Share clinical history with care team', 'shareHistory'],
            ['Allow medication adherence to be seen by doctor', 'shareAdherence'],
            ['Receive BP reminder notifications', 'receiveBPReminders'],
            ['Receive email appointment confirmations', 'receiveEmail'],
            ['Receive health education messages', 'receiveEducation'],
            ['Allow anonymous data for AMEXAN research', 'shareAnonymous'],
          ].map(([label, key]) => (
            <label key={key} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={privacy[key as keyof typeof privacy]}
                onChange={e => setPrivacy(p => ({ ...p, [key]: e.target.checked }))}
                style={{ accentColor: '#2563eb' }}
              />
              <span style={{ fontSize: 14, color: '#1e293b' }}>{label}</span>
            </label>
          ))}
          <Button variant="primary" style={{ marginTop: 16 }}>Save Preferences</Button>
        </div>
      )}
    </Card>
  );
}