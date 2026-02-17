'use client';
import { useState } from 'react';
import axios from 'axios';

export default function VisitNoteForm({ appointment, patientId, doctorId, onSuccess }) {
  const [form, setForm] = useState({
    reason: '',
    findings: '',
    diagnosis: '',
    treatment: '',
    orders: '',
  });
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...form,
        orders: form.orders.split('\n').map(s => s.trim()).filter(s => s),
        clinicType: appointment.clinicType,
        appointmentId: appointment._id,
      };
      await axios.post(`${API_BASE}/api/patients/${patientId}/visits`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally mark appointment as completed
      alert('Visit note saved');
      onSuccess();
    } catch (err) {
      alert('Failed to save visit note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Visit Note</h2>
      <div className="mb-2">
        <label className="block">Reason for Visit</label>
        <input value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className="border p-2 w-full" required />
      </div>
      <div className="mb-2">
        <label className="block">Findings</label>
        <textarea value={form.findings} onChange={e => setForm({...form, findings: e.target.value})} className="border p-2 w-full" rows="3" required />
      </div>
      <div className="mb-2">
        <label className="block">Diagnosis</label>
        <input value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} className="border p-2 w-full" required />
      </div>
      <div className="mb-2">
        <label className="block">Treatment Plan</label>
        <textarea value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} className="border p-2 w-full" rows="2" required />
      </div>
      <div className="mb-2">
        <label className="block">Orders (one per line)</label>
        <textarea value={form.orders} onChange={e => setForm({...form, orders: e.target.value})} className="border p-2 w-full" rows="2" />
      </div>
      <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
        {loading ? 'Saving...' : 'Save Visit Note'}
      </button>
    </form>
  );
}