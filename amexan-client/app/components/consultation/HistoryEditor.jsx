'use client';
import { useState } from 'react';
import axios from 'axios';

export default function HistoryEditor({ patientId, currentHistory = {}, onClose, onSaved }) {
  const [form, setForm] = useState({
    pastMedical: currentHistory.pastMedical || '',
    familyHistory: currentHistory.familyHistory || '',
    socialHistory: currentHistory.socialHistory || '',
    allergies: currentHistory.allergies?.join(', ') || '',
    medications: currentHistory.medications?.join(', ') || '',
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
        allergies: form.allergies.split(',').map(s => s.trim()).filter(s => s),
        medications: form.medications.split(',').map(s => s.trim()).filter(s => s),
      };
      await axios.post(`${API_BASE}/api/patients/${patientId}/history`, { data }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSaved();
    } catch (err) {
      alert('Failed to save history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edit Medical History</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block">Past Medical History</label>
            <textarea value={form.pastMedical} onChange={e => setForm({...form, pastMedical: e.target.value})} className="border p-2 w-full" rows="2" />
          </div>
          <div className="mb-2">
            <label className="block">Family History</label>
            <textarea value={form.familyHistory} onChange={e => setForm({...form, familyHistory: e.target.value})} className="border p-2 w-full" rows="2" />
          </div>
          <div className="mb-2">
            <label className="block">Social History</label>
            <textarea value={form.socialHistory} onChange={e => setForm({...form, socialHistory: e.target.value})} className="border p-2 w-full" rows="2" />
          </div>
          <div className="mb-2">
            <label className="block">Allergies (comma separated)</label>
            <input type="text" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} className="border p-2 w-full" />
          </div>
          <div className="mb-2">
            <label className="block">Medications (comma separated)</label>
            <input type="text" value={form.medications} onChange={e => setForm({...form, medications: e.target.value})} className="border p-2 w-full" />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}