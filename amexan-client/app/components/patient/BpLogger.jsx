'use client';
import { useState } from 'react';
import axios from 'axios';

export default function BpLogger({ patientId }) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/patients/${patientId}/measurements`, {
        type: 'bp',
        value: { systolic: Number(systolic), diastolic: Number(diastolic) },
        unit: 'mmHg',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('BP logged successfully');
      setSystolic('');
      setDiastolic('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to log BP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Log Blood Pressure</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-sm">Systolic (mmHg)</label>
          <input
            type="number"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Diastolic (mmHg)</label>
          <input
            type="number"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}