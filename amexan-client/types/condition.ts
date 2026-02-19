export interface Condition {
  _id: string;
  name: string;
  icd10Code?: string;
  diagnosedDate: string;
  status: 'active' | 'resolved';
  notes?: string;
}

export interface Medication {
  _id: string;
  patientId: string;
  doctorId: string;
  name: string;
  dose: string;
  frequency: string;
  scheduledTime: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  stockDays: number;
  takenToday?: boolean;
}

export interface AdherenceRecord {
  _id: string;
  medicationId: string;
  date: string;
  taken: boolean;
}

export interface Referral {
  _id: string;
  patientId: string;
  fromDoctorId: string;
  toDoctorId: string;
  reason: string;
  priority: 'routine' | 'urgent';
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
}