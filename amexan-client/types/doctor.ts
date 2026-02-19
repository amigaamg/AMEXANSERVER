// ─── DOCTOR TYPES ─────────────────────────────────────────────────────────────

export interface Doctor {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  universalId: string;            // D-XXXXXXXX
  role: 'doctor';
  avatar?: string;
  specialty: string;
  subSpecialties?: string[];
  qualifications?: string[];
  bio?: string;
  languages?: string[];
  yearsExperience?: number;
  rating?: number;
  reviewCount?: number;
  location?: string;
  city?: string;
  county?: string;
  country?: string;
  clinics?: DoctorClinic[];
  services?: DoctorServiceDefinition[];
  availability?: DoctorAvailability[];
  isVerified?: boolean;
  isActive?: boolean;
  licenseNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DoctorClinic {
  _id: string;
  name: string;
  address: string;
  city?: string;
  county?: string;
  phone?: string;
  email?: string;
  description?: string;
  specialties?: string[];
}

export interface DoctorServiceDefinition {
  _id: string;
  doctorId: string;
  name: string;
  description?: string;
  specialty: string;
  clinicId?: string;
  clinicName?: string;
  fee: number;
  currency: string;
  duration: number;               // minutes
  mode: 'in-person' | 'telemedicine' | 'both';
  available: boolean;
  requiresReferral?: boolean;
  maxPatientsPerDay?: number;
}

export interface DoctorAvailability {
  _id?: string;
  doctorId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0 = Sunday
  startTime: string;              // "09:00"
  endTime: string;                // "17:00"
  clinicId?: string;
  mode: 'in-person' | 'telemedicine' | 'both';
  slotDurationMinutes: number;
  isActive: boolean;
}

export interface DoctorReview {
  _id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  rating: number;                 // 1-5
  comment?: string;
  tags?: string[];                // 'helpful', 'professional', 'punctual'
  createdAt: string;
  verified: boolean;
}

export interface DoctorStats {
  totalPatients: number;
  appointmentsThisMonth: number;
  revenueThisMonth: number;
  avgRating: number;
  reviewCount: number;
  followUpRate: number;
}

// ─── APPOINTMENT BOOKING ──────────────────────────────────────────────────────

export interface BookingSlot {
  date: string;                   // ISO date
  startTime: string;              // "09:00"
  endTime: string;                // "09:30"
  available: boolean;
  doctorId: string;
  serviceId?: string;
  clinicId?: string;
  mode: 'in-person' | 'telemedicine';
}

export interface BookingRequest {
  patientId: string;
  doctorId: string;
  serviceId: string;
  clinicId?: string;
  date: string;
  startTime: string;
  mode: 'in-person' | 'telemedicine';
  chiefComplaint: string;
  notes?: string;
  isUrgent?: boolean;
  referralId?: string;
}

export interface TriageResult {
  recommendedSpecialty: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  reason: string;
  keywords: string[];
  alternativeSpecialties?: string[];
}