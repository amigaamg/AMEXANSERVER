'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import HistoryEditor from './HistoryEditor';

export default function HistoryViewer({ patientId }) {
  const [history, setHistory] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/patients/${patientId}/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [patientId, API_BASE]);

  if (loading) return <div>Loading history...</div>;

  if (!history || !history.data) {
    return (
      <div>
        <p>No medical history recorded yet.</p>
        <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
          Create History
        </button>
        {editing && <HistoryEditor patientId={patientId} onClose={() => setEditing(false)} onSaved={() => window.location.reload()} />}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mb-2">Medical History (v{history.version})</h2>
        <button onClick={() => setEditing(true)} className="text-blue-600">Edit</button>
      </div>
      <p><strong>Past Medical:</strong> {history.data.pastMedical}</p>
      <p><strong>Family History:</strong> {history.data.familyHistory}</p>
      <p><strong>Social History:</strong> {history.data.socialHistory}</p>
      <p><strong>Allergies:</strong> {history.data.allergies?.join(', ') || 'None'}</p>
      <p><strong>Medications:</strong> {history.data.medications?.join(', ') || 'None'}</p>
      <p className="text-xs text-gray-500 mt-2">Last updated by Dr. {history.authorId?.name} on {new Date(history.createdAt).toLocaleString()}</p>
      {editing && <HistoryEditor patientId={patientId} currentHistory={history.data} onClose={() => setEditing(false)} onSaved={() => window.location.reload()} />}
    </div>
  );
}