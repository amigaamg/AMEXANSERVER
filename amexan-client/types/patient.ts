export interface Patient {
  _id: string;
  universalId: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  bloodType?: string;
  condition?: string;
  riskStatus?: 'stable' | 'warning' | 'critical';
  nextReview?: string;
  photoUrl?: string;
  careTeam?: CareTeamMember[];
}

export interface CareTeamMember {
  _id: string;
  name: string;
  role: string;
  specialty?: string;
  avatar?: string;
}

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName?: string;
  clinicName?: string;
  clinicType: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  isFirstVisit?: boolean;
  reason?: string;
}

export interface Alert {
  _id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Measurement {
  _id: string;
  type: 'bp' | 'glucose' | 'weight';
  systolic?: number;
  diastolic?: number;
  value?: number;
  unit: string;
  pulse?: number;
  recordedAt: string;
  notes?: string;
}

export interface Medication {
  _id: string;
  name: string;
  dose: string;
  frequency: string;
  scheduledTime: string;
  takenToday?: boolean;
  stockDays: number;
}

export interface Lab {
  _id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  date: string;
  trend: 'rising' | 'improving' | 'stable';
}

export interface ImagingStudy {
  _id: string;
  type: string;
  date: string;
  thumbnailUrl?: string;
  fullUrl?: string;
  report?: string;
  status: 'completed' | 'pending';
}

export interface Message {
  _id: string;
  from: string;
  fromId: string;
  subject?: string;
  preview: string;
  body?: string;
  createdAt: string;
  read: boolean;
}

export interface Visit {
  _id: string;
  date: string;
  doctorName: string;
  clinicName: string;
  type: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  signedBy?: string;
}

export interface ClinicService {
  _id: string;
  name: string;
  specialty: string;
  available: boolean;
  doctors: number;
  rating: number;
  price?: number;
}

export interface Payment {
  _id: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method: string;
  reference: string;
  createdAt: string;
}

export interface EducationItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface CarePlan {
  _id: string;
  type: string;
  condition: string;
  startDate: string;
  endDate?: string;
  active: boolean;
}