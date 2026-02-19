import { useState, useEffect } from 'react';
import { api } from '@/lib/utils/api';

export function useDoctorServices(doctorId: string) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = () => {
    api(`/api/doctors/${doctorId}/clinics`)
      .then(setServices)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, [doctorId]);

  return { services, loading, error, refresh: fetchServices };
}