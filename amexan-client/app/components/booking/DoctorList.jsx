'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorCard from './DoctorCard';

export default function DoctorList({ recommendation, onSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Get all clinics (which include doctor info)
        const res = await axios.get(`${API_BASE}/api/clinics`);
        // Group by doctor? For simplicity, we'll show all clinics
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [API_BASE]);

  // Filter clinics based on recommendation
  const filtered = doctors.filter(clinic => {
    if (recommendation === 'hypertension_first_visit') {
      return clinic.name.toLowerCase().includes('hypertension') && clinic.isFirstVisitOnly;
    }
    if (recommendation === 'hypertension_followup') {
      return clinic.name.toLowerCase().includes('hypertension') && !clinic.isFirstVisitOnly;
    }
    if (recommendation === 'hypertension_evaluation') {
      return clinic.name.toLowerCase().includes('hypertension');
    }
    // default: show all
    return true;
  });

  if (loading) return <div>Loading doctors...</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Recommended Doctors</h2>
      <div className="space-y-4">
        {filtered.map(clinic => (
          <DoctorCard key={clinic._id} clinic={clinic} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}