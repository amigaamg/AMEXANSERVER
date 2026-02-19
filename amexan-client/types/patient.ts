// ─── PATIENT TYPES ────────────────────────────────────────────────────────────

export interface Patient {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bloodType?: string;
  universalId: string;            // P-XXXXXXXX
  role: 'patient';
  avatar?: string;
  condition?: string;             // primary condition label
  conditions?: string[];          // all active conditions
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  careTeam?: CareTeamMember[];
  address?: {
    street?: string;
    city?: string;
    county?: string;
    country?: string;
  };
  insurance?: {
    provider: string;
    memberId: string;
    group?: string;
  };
  consent?: {
    shareHistory: boolean;
    shareAdherence: boolean;
    notifications: boolean;
    researchConsent: boolean;
  };
  onboardingComplete?: boolean;
  riskLevel?: 'stable' | 'needs-review' | 'urgent';
  createdAt: string;
  updatedAt?: string;
}

export interface CareTeamMember {
  _id: string;
  name: string;
  role: string;
  specialty?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  clinicName?: string;
}

// ─── MEASUREMENTS / VITALS ───────────────────────────────────────────────────

export interface Measurement {
  _id: string;
  patientId: string;
  type: 'bp' | 'glucose' | 'weight' | 'temperature' | 'spo2' | 'heartrate' | 'peak_flow';
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  value?: number;
  unit?: string;
  notes?: string;
  recordedAt: string;
  recordedBy?: 'patient' | 'doctor' | 'nurse';
  deviceId?: string;
}

// ─── ALERTS ──────────────────────────────────────────────────────────────────

export interface Alert {
  _id: string;
  patientId: string;
  type: 'bp_high' | 'bp_low' | 'missed_med' | 'lab_ready' | 'appointment_reminder' | 'doctor_message' | 'overdue_followup' | 'referral' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  actionLabel?: string;
  actionTarget?: string;          // tab name or URL
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  issuedBy?: {
    doctorId: string;
    doctorName: string;
  };
}

// ─── MEDICATIONS ─────────────────────────────────────────────────────────────

export interface Medication {
  _id: string;
  patientId: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;              // e.g. "twice daily"
  route?: string;                 // oral, injection, topical
  instructions?: string;
  prescribedBy: string;           // doctor name
  prescribedById?: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  stockDays?: number;             // days of supply remaining
  adherenceToday?: boolean;
  adherencePct?: number;          // 0-100
  refillRequested?: boolean;
  sideEffects?: string[];
  category?: string;
}

export interface AdherenceRecord {
  date: string;
  taken: boolean;
  medicationId: string;
}

// ─── VISITS ──────────────────────────────────────────────────────────────────

export interface Visit {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  clinicId?: string;
  clinicName?: string;
  specialty?: string;
  date: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'telemedicine' | 'procedure';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'in-progress';
  chiefComplaint?: string;
  notes?: string;
  diagnosis?: string[];
  prescriptions?: string[];
  labOrders?: string[];
  followUpDate?: string;
  duration?: number;              // minutes
  fee?: number;
  paid?: boolean;
  isFirstVisit?: boolean;
  referredFrom?: string;
  referredTo?: string;
  telemedicineLink?: string;
  recordingUrl?: string;
}

// ─── MEDICAL HISTORY ─────────────────────────────────────────────────────────

export interface MedicalHistoryRecord {
  _id: string;
  patientId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  signatureHash?: string;
  sections: {
    pastMedical: string[];
    familyHistory: string[];
    allergies: string[];
    socialHistory: {
      smoking?: string;
      alcohol?: string;
      occupation?: string;
      exercise?: string;
    };
    surgicalHistory: string[];
    immunizations: string[];
  };
}

// ─── LABS & IMAGING ──────────────────────────────────────────────────────────

export interface LabResult {
  _id: string;
  patientId: string;
  orderedBy: string;
  orderedById?: string;
  testName: string;
  category: string;               // CBC, Lipid Panel, Metabolic, etc.
  value?: number | string;
  unit?: string;
  referenceRange?: string;
  status: 'pending' | 'completed' | 'critical' | 'abnormal' | 'normal';
  collectedAt?: string;
  resultAt?: string;
  orderedAt: string;
  notes?: string;
  trend?: 'up' | 'down' | 'stable';
  previousValue?: number;
  reportUrl?: string;
}

export interface ImagingStudy {
  _id: string;
  patientId: string;
  orderedBy: string;
  type: 'xray' | 'ct' | 'mri' | 'ultrasound' | 'echo' | 'other';
  bodyPart: string;
  indication?: string;
  status: 'pending' | 'completed' | 'reported';
  orderedAt: string;
  performedAt?: string;
  reportedAt?: string;
  impression?: string;
  thumbnailUrl?: string;
  reportUrl?: string;
  imagesUrl?: string;
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────

export interface Message {
  _id: string;
  threadId?: string;
  patientId: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor' | 'nurse' | 'admin';
  recipientId: string;
  recipientName: string;
  subject?: string;
  body: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: string;
  replyTo?: string;
}

// ─── EDUCATION ───────────────────────────────────────────────────────────────

export interface EducationItem {
  _id: string;
  title: string;
  summary: string;
  content?: string;
  type: 'article' | 'video' | 'infographic' | 'checklist';
  tags: string[];
  conditions: string[];
  readingTime?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  source?: string;
  publishedAt: string;
  featured?: boolean;
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

export interface Payment {
  _id: string;
  patientId: string;
  appointmentId?: string;
  description: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partial';
  method?: 'mpesa' | 'card' | 'insurance' | 'cash';
  mpesaRef?: string;
  receiptUrl?: string;
  createdAt: string;
  paidAt?: string;
}

// ─── REFERRALS ───────────────────────────────────────────────────────────────

export interface Referral {
  _id: string;
  patientId: string;
  fromDoctorId: string;
  fromDoctorName: string;
  toDoctorId?: string;
  toDoctorName?: string;
  toSpecialty: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  reason: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  referralLetterUrl?: string;
}

// ─── SERVICES (what BookingModal needs) ──────────────────────────────────────

export interface DoctorService {
  _id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  description?: string;
  fee: number;
  currency: string;
  duration: number;               // minutes
  mode: 'in-person' | 'telemedicine' | 'both';
  available: boolean;
  rating?: number;
  reviewCount?: number;
  location?: string;
  avatar?: string;
}

// ─── HOOK RETURN ─────────────────────────────────────────────────────────────

export interface PatientDataHookReturn {
  patient: Patient | null;
  measurements: Measurement[];
  alerts: Alert[];
  medications: Medication[];
  appointments: Visit[];
  visits: Visit[];
  labs: LabResult[];
  imaging: ImagingStudy[];
  messages: Message[];
  payments: Payment[];
  education: EducationItem[];
  referrals: Referral[];
  services: DoctorService[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}