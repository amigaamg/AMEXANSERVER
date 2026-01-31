import { WithId, WithTimestamps } from './index';
import { MedicalSpecialization } from './user.types';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
  PENDING = 'pending'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  EMERGENCY = 'emergency',
  TELEMEDICINE = 'telemedicine',
  LAB_TEST = 'lab_test',
  IMAGING = 'imaging',
  VACCINATION = 'vaccination',
  PHYSICAL_EXAM = 'physical_exam',
  SPECIALIST_REFERRAL = 'specialist_referral',
  COUNSELING = 'counseling',
  REHABILITATION = 'rehabilitation'
}

export enum AppointmentPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency'
}

export interface Appointment extends WithId, WithTimestamps {
  patientId: string;
  doctorId: string;
  clinicId?: string;
  department?: string;
  
  // Scheduling
  scheduledDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  timeZone: string;
  
  // Appointment Details
  type: AppointmentType;
  subType?: string;
  priority: AppointmentPriority;
  status: AppointmentStatus;
  reason: string;
  symptoms?: string[];
  chiefComplaint?: string;
  
  // Location & Mode
  locationType: 'in_person' | 'telemedicine' | 'home_visit';
  location?: AppointmentLocation;
  telemedicineDetails?: TelemedicineDetails;
  
  // Participants
  primaryProviderId: string;
  assistingProviders?: string[];
  interpreterRequired: boolean;
  interpreterLanguage?: string;
  caregiverPresent: boolean;
  caregiverName?: string;
  
  // Preparation
  preparationInstructions?: string[];
  fastingRequired: boolean;
  medicationsToHold?: string[];
  documentsRequired?: string[];
  
  // Check-in & Arrival
  checkInTime?: Date;
  waitTime?: number; // minutes
  roomAssignment?: string;
  triageNotes?: string;
  
  // Clinical
  vitalSigns?: VitalSigns;
  height?: number;
  weight?: number;
  bmi?: number;
  
  // Visit Details
  subjective?: string; // Patient's story
  objective?: string; // Clinical findings
  assessment?: string; // Diagnosis/assessment
  plan?: string; // Treatment plan
  
  // Procedures & Tests
  proceduresPerformed?: Procedure[];
  testsOrdered?: TestOrder[];
  referralsMade?: Referral[];
  
  // Prescriptions
  prescriptions?: Prescription[];
  
  // Follow-up
  followUpNeeded: boolean;
  followUpDate?: Date;
  followUpInstructions?: string;
  
  // Billing
  billingCode?: string;
  insuranceClaimId?: string;
  copayAmount?: number;
  paidAmount?: number;
  
  // Cancellation
  cancelledBy?: 'patient' | 'doctor' | 'system';
  cancellationReason?: string;
  cancellationFee?: number;
  
  // Quality Metrics
  patientSatisfaction?: number;
  waitTimeSatisfaction?: number;
  providerRating?: number;
  
  // Metadata
  tags?: string[];
  notes?: string;
  attachments?: AppointmentAttachment[];
  metadata?: Record<string, any>;
}

export interface AppointmentLocation {
  type: 'clinic' | 'hospital' | 'lab' | 'imaging_center' | 'home';
  name: string;
  address: string;
  room?: string;
  floor?: string;
  directions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface TelemedicineDetails {
  platform: 'zoom' | 'teams' | 'custom' | 'other';
  meetingUrl: string;
  meetingId: string;
  passcode?: string;
  dialInNumber?: string;
  dialInCode?: string;
  waitingRoomEnabled: boolean;
  recordingEnabled: boolean;
  recordingConsentObtained: boolean;
}

export interface VitalSigns {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    position?: 'sitting' | 'standing' | 'lying';
    arm?: 'left' | 'right';
  };
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  painLevel?: number; // 0-10
  glucose?: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

export interface Procedure {
  name: string;
  cptCode?: string;
  startTime?: Date;
  endTime?: Date;
  findings?: string;
  complications?: string[];
  specimensCollected?: Specimen[];
  imagesTaken?: MedicalImage[];
}

export interface Specimen {
  type: string;
  collectionTime: Date;
  collector: string;
  container: string;
  storage?: string;
  testsRequested: string[];
}

export interface MedicalImage {
  type: 'xray' | 'ct' | 'mri' | 'ultrasound' | 'echo' | 'other';
  bodyPart: string;
  views: string[];
  radiologist?: string;
  findings?: string;
  imageUrl?: string;
}

export interface TestOrder {
  test: string;
  loincCode?: string;
  priority: 'routine' | 'urgent' | 'stat';
  fastingRequired: boolean;
  specialInstructions?: string[];
  collectionTime?: Date;
  result?: TestResult;
}

export interface TestResult {
  value: number;
  unit: string;
  normalRange: string;
  flag?: 'low' | 'high' | 'normal' | 'critical';
  reportedBy: string;
  reportedDate: Date;
  verifiedBy?: string;
  verifiedDate?: Date;
  notes?: string;
}

export interface Referral {
  toSpecialty: MedicalSpecialization;
  toProviderId?: string;
  toProviderName?: string;
  reason: string;
  priority: 'routine' | 'urgent';
  requestedTests?: string[];
  notes?: string;
  status: 'pending' | 'scheduled' | 'completed';
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'topical' | 'inhalation' | 'injection' | 'other';
  duration: string;
  startDate: Date;
  endDate?: Date;
  refills: number;
  instructions?: string;
  warnings?: string[];
  prescribedBy: string;
  prescribedDate: Date;
}

export interface AppointmentAttachment {
  type: 'image' | 'document' | 'lab_result' | 'prescription' | 'consent_form';
  name: string;
  url: string;
  uploadedBy: string;
  uploadedDate: Date;
  size: number;
}

// Appointment Slot Management
export interface AppointmentSlot {
  id: string;
  doctorId: string;
  clinicId?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: AppointmentType;
  status: 'available' | 'booked' | 'blocked' | 'maintenance';
  bookingWindow: {
    opens: Date;
    closes: Date;
  };
  constraints?: SlotConstraints;
}

export interface SlotConstraints {
  minAge?: number;
  maxAge?: number;
  gender?: 'male' | 'female';
  newPatientsOnly?: boolean;
  followUpOnly?: boolean;
  insuranceAccepted?: string[];
}

// Waitlist Management
export interface WaitlistEntry {
  id: string;
  patientId: string;
  doctorId: string;
  preferredDates: Date[];
  preferredTimes: string[];
  reason: string;
  priority: AppointmentPriority;
  status: 'pending' | 'scheduled' | 'cancelled';
  addedDate: Date;
  scheduledDate?: Date;
  notes?: string;
}

// Appointment Statistics
export interface AppointmentStatistics {
  dateRange: {
    start: Date;
    end: Date;
  };
  totalAppointments: number;
  byStatus: Record<AppointmentStatus, number>;
  byType: Record<AppointmentType, number>;
  cancellationRate: number;
  noShowRate: number;
  averageWaitTime: number;
  utilizationRate: number;
  revenueByType: Record<string, number>;
  patientSatisfaction: number;
}

// Real-time Appointment Updates
export interface AppointmentUpdate {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  status: AppointmentStatus;
  timestamp: Date;
  location?: string;
  estimatedWaitTime?: number;
  message?: string;
}