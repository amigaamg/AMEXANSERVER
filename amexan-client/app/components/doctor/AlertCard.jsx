import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AlertCard({ alert }) {
  const [read, setRead] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const markRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/api/alerts/${alert._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRead(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (read) return null;

  return (
    <div className={`p-3 rounded shadow ${alert.severity === 'critical' ? 'bg-red-100' : 'bg-yellow-100'}`}>
      <p className="font-semibold">{alert.message}</p>
      <p className="text-sm">Patient: {alert.patientId?.name}</p>
      <div className="flex justify-between mt-2">
        <Link href={`/consultation/${alert.patientId?._id}?alert=${alert._id}`}>
          <button className="text-blue-600 text-sm">View</button>
        </Link>
        <button onClick={markRead} className="text-gray-600 text-sm">Dismiss</button>
      </div>
    </div>
  );
}
