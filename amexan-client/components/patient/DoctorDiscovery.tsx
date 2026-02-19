'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/utils/api';
import DoctorCard from './DoctorCard';
import SearchBar from '@/components/common/SearchBar';
import FilterPanel from '@/components/common/FilterPanel';
import Button from '@/components/common/Button';
import type { Doctor } from '@/types/doctor';

export default function DoctorDiscovery() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    minRating: 0,
    maxFee: 10000,
    availableOnly: false,
  });

  const filterOptions = [
    { id: 'specialty', label: 'Specialty', type: 'select' as const, options: [] }, // will populate from API
    { id: 'minRating', label: 'Minimum Rating', type: 'range' as const, min: 0, max: 5 },
    { id: 'maxFee', label: 'Max Consultation Fee', type: 'range' as const, min: 0, max: 10000 },
    { id: 'availableOnly', label: 'Available Today', type: 'checkbox' as const },
  ];

  useEffect(() => {
    api('/api/doctors').then(data => {
      setDoctors(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = doctors;
    if (searchTerm) {
      result = result.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filters.specialty) {
      result = result.filter(d => d.specialty === filters.specialty);
    }
    if (filters.minRating > 0) {
      result = result.filter(d => d.rating >= filters.minRating);
    }
    if (filters.maxFee < 10000) {
      result = result.filter(d => d.consultationFee <= filters.maxFee);
    }
    if (filters.availableOnly) {
      result = result.filter(d => d.available);
    }
    setFiltered(result);
  }, [searchTerm, filters, doctors]);

  const handleFilterChange = (id: string, value: any) => {
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const handleBook = (doctorId: string) => {
    router.push(`/dashboard/patient/book/${doctorId}`);
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Find a Doctor</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Search by name, specialty, or use filters to find the right care.</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <SearchBar onSearch={setSearchTerm} placeholder="Search doctors..." style={{ flex: 1 }} />
        <Button variant="outline" onClick={() => router.push('/triage')}>Symptom Check</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 20 }}>
        <FilterPanel
          filters={filterOptions}
          values={filters}
          onChange={handleFilterChange}
          onApply={() => {}}
          onClear={() => setFilters({ specialty: '', minRating: 0, maxFee: 10000, availableOnly: false })}
        />
        <div>
          {loading ? (
            <p>Loading doctors...</p>
          ) : filtered.length === 0 ? (
            <p>No doctors match your criteria.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filtered.map(doctor => (
                <DoctorCard key={doctor._id} doctor={doctor} onBook={() => handleBook(doctor._id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}