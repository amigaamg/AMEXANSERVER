'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Timeline({ patientId }) {
  const [visits, setVisits] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const visitsRes = await axios.get(`${API_BASE}/api/patients/${patientId}/visits`, { headers });
        const measRes = await axios.get(`${API_BASE}/api/patients/${patientId}/measurements`, { headers });
        setVisits(visitsRes.data);
        setMeasurements(measRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, [patientId, API_BASE]);

  if (loading) return <div>Loading timeline...</div>;

  // Combine and sort by date
  const allEvents = [
    ...visits.map(v => ({ type: 'visit', date: v.createdAt, data: v })),
    ...measurements.map(m => ({ type: 'measurement', date: m.createdAt, data: m })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Patient Timeline</h2>
      {allEvents.map((event, idx) => (
        <div key={idx} className="border-l-4 pl-4 py-2">
          {event.type === 'visit' ? (
            <>
              <p className="font-semibold text-blue-800">Visit: {event.data.clinicType}</p>
              <p>Diagnosis: {event.data.diagnosis}</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-green-800">Measurement: {event.data.type}</p>
              <p>Value: {event.data.type === 'bp' ? `${event.data.value.systolic}/${event.data.value.diastolic} mmHg` : JSON.stringify(event.data.value)}</p>
            </>
          )}
          <p className="text-xs text-gray-500">{new Date(event.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}