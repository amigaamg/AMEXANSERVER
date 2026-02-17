import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import type {
  Patient,
  Appointment,
  Alert,
  Measurement,
  Medication,
  Lab,
  Message,
  Visit,
  ClinicService,
  Payment,
  ImagingStudy,
  EducationItem,
  CarePlan,
} from '@/types/patient';

interface PatientDataState {
  patient: Patient | null;
  appointments: Appointment[];
  alerts: Alert[];
  measurements: Measurement[];
  medications: Medication[];
  labs: Lab[];
  messages: Message[];
  visits: Visit[];
  services: ClinicService[];
  payments: Payment[];
  imaging: ImagingStudy[];
  education: EducationItem[];
  carePlans: CarePlan[];
  loading: boolean;
  error: string | null;
}

export function usePatientData(patientId?: string) {
  const [state, setState] = useState<PatientDataState>({
    patient: null,
    appointments: [],
    alerts: [],
    measurements: [],
    medications: [],
    labs: [],
    messages: [],
    visits: [],
    services: [],
    payments: [],
    imaging: [],
    education: [],
    carePlans: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!patientId) return;

    setState((s) => ({ ...s, loading: true }));

    try {
      const [
        patient,
        appointments,
        alerts,
        measurements,
        medications,
        labs,
        messages,
        visits,
        services,
        payments,
        imaging,
        education,
        carePlans,
      ] = await Promise.all([
        api(`/api/patients/${patientId}`).catch(() => null),
        api(`/api/appointments/patient/${patientId}`).catch(() => []),
        api(`/api/patients/${patientId}/alerts`).catch(() => []),
        api(`/api/patients/${patientId}/measurements?limit=20`).catch(() => []),
        api(`/api/patients/${patientId}/medications`).catch(() => []),
        api(`/api/patients/${patientId}/labs`).catch(() => []),
        api(`/api/messages/patient/${patientId}`).catch(() => []),
        api(`/api/visits/patient/${patientId}`).catch(() => []),
        api('/api/clinics').catch(() => []),
        api(`/api/payments/patient/${patientId}`).catch(() => []),
        api(`/api/patients/${patientId}/imaging`).catch(() => []),
        api(`/api/patients/${patientId}/education`).catch(() => []),
        api(`/api/patients/${patientId}/careplan`).catch(() => []),
      ]);

      const extractArray = (val: any, key: string) =>
        Array.isArray(val) ? val : val?.[key] || [];

      setState({
        patient: patient || null,
        appointments: extractArray(appointments, 'appointments'),
        alerts: extractArray(alerts, 'alerts'),
        measurements: extractArray(measurements, 'measurements'),
        medications: extractArray(medications, 'medications'),
        labs: extractArray(labs, 'labs'),
        messages: extractArray(messages, 'messages'),
        visits: extractArray(visits, 'visits'),
        services: extractArray(services, 'clinics'),
        payments: extractArray(payments, 'payments'),
        imaging: extractArray(imaging, 'imaging'),
        education: extractArray(education, 'education'),
        carePlans: extractArray(carePlans, 'carePlans'),
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState((s) => ({ ...s, loading: false, error: err.message }));
    }
  }, [patientId]);

  useEffect(() => {
    if (!patientId) return;

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [fetchData, patientId]);

  return {
    ...state,
    refresh: fetchData, // ✅ function returned separately (NOT inside state)
  };
}
