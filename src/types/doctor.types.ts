import { WithId, WithTimestamps } from './index';
import { MedicalSpecialization, Qualification, HospitalAffiliation, Award, Publication, Certification } from './user.types';

export interface DoctorProfile extends WithId, WithTimestamps {
  userId: string;
  doctorId: string;
  
  // Professional Information
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: Date;
  npiNumber?: string;
  deaNumber?: string;
  upinNumber?: string;
  stateControlledSubstanceLicense?: string;
  
  // Education & Qualifications
  medicalSchool: MedicalSchool;
  residency: Residency;
  fellowship?: Fellowship;
  boardCertifications: BoardCertification[];
  qualifications: Qualification[];
  awards: Award[];
  publications: Publication[];
  certifications: Certification[];
  
  // Practice Information
  specializations: MedicalSpecialization[];
  subSpecializations: string[];
  yearsOfExperience: number;
  biography?: string;
  languages: DoctorLanguage[];
  hospitalAffiliations: HospitalAffiliation[];
  clinicAffiliations: ClinicAffiliation[];
  
  // Availability & Scheduling
  availability: DoctorAvailability;
  appointmentTypes: AppointmentType[];
  consultationFee: number;
  followUpFee?: number;
  telemedicineFee?: number;
  homeVisitFee?: number;
  
  // Patient Management
  patientLimit: number;
  currentPatientCount: number;
  acceptingNewPatients: boolean;
  referralRequired: boolean;
  averageWaitTime: number; // days
  
  // Ratings & Reviews
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
  patientSatisfaction: number;
  responseTime: number; // hours
  
  // Communication Preferences
  communicationPreferences: DoctorCommunicationPreferences;
  notificationSettings: DoctorNotificationSettings;
  
  // Practice Philosophy
  philosophy?: string;
  treatmentApproaches: string[];
  specialInterests: string[];
  
  // Administrative
  adminStaff: AdminStaff[];
  billingContact?: BillingContact;
  malpracticeInsurance: MalpracticeInsurance;
  
  // Metadata
  metadata?: Record<string, any>;
  isVerified: boolean;
  verificationDate?: Date;
  lastCredentialReview?: Date;
}

export interface MedicalSchool {
  name: string;
  location: string;
  degree: string;
  graduationYear: number;
}

export interface Residency {
  specialty: MedicalSpecialization;
  hospital: string;
  location: string;
  startYear: number;
  endYear: number;
  chiefResident: boolean;
}

export interface Fellowship {
  specialty: string;
  hospital: string;
  location: string;
  startYear: number;
  endYear: number;
}

export interface BoardCertification {
  board: string;
  specialty: string;
  certificationDate: Date;
  expiryDate?: Date;
  status: 'active' | 'expired' | 'revoked';
  credentialId?: string;
}

export interface DoctorLanguage {
  language: string;
  proficiency: 'basic' | 'conversational' | 'professional' | 'native';
  medicalProficiency: boolean;
}

export interface ClinicAffiliation {
  clinicId: string;
  clinicName: string;
  address: string;
  phoneNumber: string;
  isPrimary: boolean;
  daysAtClinic: number[];
  appointmentTypes: string[];
}

export interface DoctorAvailability {
  general: WeeklySchedule;
  exceptions: AvailabilityException[];
  timeZone: string;
  appointmentDurations: AppointmentDuration[];
  bufferTime: number; // minutes
  sameDayAppointments: boolean;
  afterHoursAvailability: boolean;
  emergencyContactNumber?: string;
}

export interface WeeklySchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  appointmentTypes?: string[];
  location?: string;
}

export interface AvailabilityException {
  date: Date;
  reason: 'vacation' | 'conference' | 'training' | 'emergency' | 'other';
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface AppointmentDuration {
  type: 'consultation' | 'follow_up' | 'procedure' | 'telemedicine';
  duration: number; // minutes
}

export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  duration: number;
  fee: number;
  requiresReferral: boolean;
  canBeTelemedicine: boolean;
  preparationInstructions?: string[];
  cancellationPolicy: CancellationPolicy;
}

export interface CancellationPolicy {
  noticeRequired: number; // hours
  feePercentage: number; // 0-100
  noShowFee: number;
}

export interface RatingBreakdown {
  bedsideManner: number;
  waitTime: number;
  expertise: number;
  communication: number;
  officeEnvironment: number;
}

export interface DoctorCommunicationPreferences {
  patientMessaging: boolean;
  messageResponseTime: number; // hours
  preferredContactMethod: 'app' | 'email' | 'phone' | 'sms';
  afterHoursContact: boolean;
  emergencyContactMethod?: string;
}

export interface DoctorNotificationSettings {
  newAppointment: boolean;
  cancellation: boolean;
  patientMessage: boolean;
  labResults: boolean;
  prescriptionRefill: boolean;
  criticalAlerts: boolean;
  billingAlerts: boolean;
}

export interface AdminStaff {
  name: string;
  role: 'receptionist' | 'nurse' | 'medical_assistant' | 'billing_specialist';
  email?: string;
  phoneNumber?: string;
  canScheduleAppointments: boolean;
  canAccessMedicalRecords: boolean;
  canProcessBilling: boolean;
}

export interface BillingContact {
  name: string;
  email: string;
  phoneNumber: string;
  billingAddress: string;
  taxId?: string;
}

export interface MalpracticeInsurance {
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  expiryDate: Date;
  claimsHistory: MalpracticeClaim[];
}

export interface MalpracticeClaim {
  year: number;
  claimAmount?: number;
  settlementAmount?: number;
  status: 'pending' | 'settled' | 'dismissed';
  details?: string;
}

// Doctor Dashboard Summary
export interface DoctorDashboardSummary {
  todayAppointments: number;
  pendingMessages: number;
  criticalAlerts: number;
  revenueToday: number;
  revenueThisMonth: number;
  patientSatisfaction: number;
  appointmentCompletionRate: number;
  topConditions: ConditionFrequency[];
  upcomingSchedule: UpcomingScheduleItem[];
}

export interface ConditionFrequency {
  condition: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface UpcomingScheduleItem {
  id: string;
  patientName: string;
  time: Date;
  type: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'arrived' | 'in_progress';
  notes?: string;
}

// Patient Load Management
export interface PatientLoad {
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  patientDistribution: PatientDistribution[];
  waitlistLength: number;
  averageAppointmentsPerPatient: number;
}

export interface PatientDistribution {
  ageGroup: string;
  count: number;
  percentage: number;
}

// Performance Metrics
export interface DoctorPerformanceMetrics {
  clinical: ClinicalMetrics;
  operational: OperationalMetrics;
  financial: FinancialMetrics;
  patientExperience: PatientExperienceMetrics;
}

export interface ClinicalMetrics {
  readmissionRate: number;
  complicationRate: number;
  medicationAdherenceRate: number;
  preventiveCareRate: number;
  chronicDiseaseControlRate: number;
}

export interface OperationalMetrics {
  appointmentUtilization: number;
  noShowRate: number;
  averageWaitTime: number;
  chartCompletionRate: number;
  prescriptionAccuracy: number;
}

export interface FinancialMetrics {
  collectionRate: number;
  averageReimbursement: number;
  denialsRate: number;
  daysInAR: number;
  revenuePerPatient: number;
}

export interface PatientExperienceMetrics {
  satisfactionScore: number;
  wouldRecommend: number;
  waitTimeSatisfaction: number;
  communicationSatisfaction: number;
  accessSatisfaction: number;
}