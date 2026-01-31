import { WithId, WithTimestamps } from './index';

export enum CallType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  EMERGENCY = 'emergency',
  SECOND_OPINION = 'second_opinion',
  MULTI_DISCIPLINARY = 'multi_disciplinary',
  GROUP_THERAPY = 'group_therapy',
  TRAINING = 'training'
}

export enum CallStatus {
  SCHEDULED = 'scheduled',
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  NO_SHOW = 'no_show'
}

export enum ParticipantRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  SPECIALIST = 'specialist',
  CAREGIVER = 'caregiver',
  INTERPRETER = 'interpreter',
  OBSERVER = 'observer',
  TECHNICIAN = 'technician'
}

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
  SCREEN_SHARE = 'screen_share',
  WHITEBOARD = 'whiteboard',
  FILE_SHARE = 'file_share'
}

export enum ConnectionQuality {
  EXCELLENT = 'excellent', // > 80%
  GOOD = 'good',          // 60-80%
  FAIR = 'fair',          // 40-60%
  POOR = 'poor',          // 20-40%
  VERY_POOR = 'very_poor' // < 20%
}

export interface VideoCall extends WithId, WithTimestamps {
  // Basic Info
  appointmentId?: string;
  type: CallType;
  title: string;
  description?: string;
  
  // Scheduling
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  duration?: number; // minutes
  
  // Participants
  participants: Participant[];
  hostId: string;
  waitingRoom: WaitingParticipant[];
  
  // Technical Settings
  settings: CallSettings;
  roomConfig: RoomConfiguration;
  
  // Status & Flow
  status: CallStatus;
  currentState: CallState;
  recording: RecordingInfo;
  
  // Medical Context
  medicalContext: MedicalCallContext;
  
  // Quality & Metrics
  qualityMetrics: QualityMetrics;
  
  // Cost & Billing
  billing: CallBilling;
  
  // Metadata
  notes?: string;
  attachments?: CallAttachment[];
  metadata?: Record<string, any>;
}

export interface Participant {
  userId: string;
  role: ParticipantRole;
  joinedAt?: Date;
  leftAt?: Date;
  duration?: number; // minutes
  
  // Media Status
  media: MediaStatus;
  permissions: ParticipantPermissions;
  
  // Connection Info
  connection: ConnectionInfo;
  deviceInfo: DeviceInfo;
  
  // Activity
  isActive: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  
  // Quality
  quality: ParticipantQuality;
}

export interface MediaStatus {
  video: boolean;
  audio: boolean;
  screenShare: boolean;
  whiteboard: boolean;
}

export interface ParticipantPermissions {
  canShareVideo: boolean;
  canShareAudio: boolean;
  canShareScreen: boolean;
  canRecord: boolean;
  canInvite: boolean;
  canRemove: boolean;
  canMuteOthers: boolean;
  canEndCall: boolean;
}

export interface ConnectionInfo {
  connectionId: string;
  connectionType: 'p2p' | 'sfu' | 'mcu';
  iceServers: string[];
  turnServer: boolean;
  quality: ConnectionQuality;
  stats: ConnectionStats;
}

export interface ConnectionStats {
  bitrate: {
    video: number;
    audio: number;
    total: number;
  };
  packetLoss: {
    video: number;
    audio: number;
  };
  latency: number;
  jitter: number;
  resolution?: {
    width: number;
    height: number;
    frameRate: number;
  };
}

export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser?: string;
  camera: string;
  microphone: string;
  speakers: string;
  networkType: string;
  ipAddress?: string;
}

export interface ParticipantQuality {
  video: StreamQuality;
  audio: StreamQuality;
  overall: ConnectionQuality;
}

export interface StreamQuality {
  resolution?: string;
  frameRate?: number;
  bitrate?: number;
  codec?: string;
}

export interface WaitingParticipant {
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  notes?: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface CallSettings {
  // Access Control
  access: {
    type: 'public' | 'private' | 'invite_only';
    password?: string;
    waitingRoom: boolean;
    lobbyTimeout: number; // minutes
    maxParticipants: number;
  };
  
  // Media Settings
  media: {
    video: {
      enabled: boolean;
      defaultOn: boolean;
      maxResolution: string;
      maxFrameRate: number;
    };
    audio: {
      enabled: boolean;
      defaultOn: boolean;
      echoCancellation: boolean;
      noiseSuppression: boolean;
    };
    screenShare: {
      enabled: boolean;
      requireApproval: boolean;
      maxResolution: string;
    };
  };
  
  // Recording
  recording: {
    enabled: boolean;
    requireConsent: boolean;
    storageDuration: number; // days
    autoStart: boolean;
    cloudStorage: boolean;
  };
  
  // Features
  features: {
    chat: boolean;
    whiteboard: boolean;
    fileSharing: boolean;
    polling: boolean;
    breakoutRooms: boolean;
    handRaise: boolean;
    liveCaptions: boolean;
    translation: boolean;
  };
  
  // Security
  security: {
    encryption: 'none' | 'e2e' | 'transport';
    watermark: boolean;
    preventRecording: boolean;
    lockRoom: boolean;
    expelParticipant: boolean;
  };
}

export interface RoomConfiguration {
  roomId: string;
  provider: 'agora' | 'zoom' | 'teams' | 'jitsi' | 'custom';
  url: string;
  meetingId?: string;
  passcode?: string;
  dialIn?: DialInInfo;
  webRTCConfig: WebRTCConfig;
}

export interface DialInInfo {
  numbers: DialInNumber[];
  globalNumbers: DialInNumber[];
  pin?: string;
}

export interface DialInNumber {
  country: string;
  number: string;
  type: 'toll' | 'toll_free';
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceTransportPolicy: 'all' | 'relay';
  bundlePolicy: 'balanced' | 'max-compat' | 'max-bundle';
  rtcpMuxPolicy: 'require';
  iceCandidatePoolSize: number;
}

export interface RTCIceServer {
  urls: string[];
  username?: string;
  credential?: string;
}

export interface CallState {
  phase: 'pre_call' | 'waiting_room' | 'in_call' | 'post_call';
  currentActivity?: string;
  activeParticipants: number;
  screensShared: number;
  recordings: number;
  chatMessages: number;
  whiteboards: number;
}

export interface RecordingInfo {
  enabled: boolean;
  consentObtained: boolean;
  recordings: Recording[];
  autoStart: boolean;
  autoStop: boolean;
  storageLocation: string;
}

export interface Recording {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  type: 'video' | 'audio' | 'transcript';
  url?: string;
  size?: number;
  status: 'recording' | 'processing' | 'ready' | 'failed';
  participants: string[];
  thumbnail?: string;
  encryptionKey?: string;
}

export interface MedicalCallContext {
  patientId: string;
  doctorId: string;
  condition?: string;
  priority: 'routine' | 'urgent' | 'emergency';
  medicalNotes?: string;
  vitalSigns?: VitalSigns;
  prescriptions?: CallPrescription[];
  testsOrdered?: TestOrder[];
  followUpRequired: boolean;
  followUpDate?: Date;
  consentForms: ConsentForm[];
  attachments: MedicalAttachment[];
}

export interface VitalSigns {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painScale?: number;
  measuredAt: Date;
}

export interface CallPrescription {
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startDate: Date;
  refills: number;
  prescribedBy: string;
}

export interface ConsentForm {
  type: 'treatment' | 'recording' | 'telemedicine' | 'payment';
  signed: boolean;
  signedBy: string;
  signedAt: Date;
  documentUrl?: string;
}

export interface QualityMetrics {
  // Network Metrics
  network: {
    averageBitrate: number;
    averagePacketLoss: number;
    averageLatency: number;
    averageJitter: number;
  };
  
  // Audio Quality
  audio: {
    mos: number; // Mean Opinion Score 1-5
    clarity: number; // 0-100
    echo: boolean;
    noise: boolean;
  };
  
  // Video Quality
  video: {
    mos: number;
    resolution: string;
    frameRate: number;
    freezeRate: number;
    blurriness: number;
  };
  
  // User Experience
  userExperience: {
    satisfaction: number; // 1-5
    wouldRecommend: boolean;
    issues: string[];
  };
  
  // Reliability
  reliability: {
    uptime: number; // percentage
    reconnections: number;
    failures: number;
  };
}

export interface CallBilling {
  billingEnabled: boolean;
  ratePerMinute: number;
  totalMinutes: number;
  totalAmount: number;
  insuranceCovered: boolean;
  insuranceAmount?: number;
  patientAmount?: number;
  paid: boolean;
  paymentMethod?: string;
  invoiceId?: string;
}

export interface CallAttachment {
  type: 'prescription' | 'lab_result' | 'image' | 'document' | 'consent';
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number;
}

// Real-time Events
export interface CallEvent {
  type: CallEventType;
  timestamp: Date;
  callId: string;
  participantId?: string;
  data: any;
}

export enum CallEventType {
  CALL_STARTED = 'call_started',
  CALL_ENDED = 'call_ended',
  PARTICIPANT_JOINED = 'participant_joined',
  PARTICIPANT_LEFT = 'participant_left',
  PARTICIPANT_MUTED = 'participant_muted',
  PARTICIPANT_UNMUTED = 'participant_unmuted',
  SCREEN_SHARE_STARTED = 'screen_share_started',
  SCREEN_SHARE_STOPPED = 'screen_share_stopped',
  RECORDING_STARTED = 'recording_started',
  RECORDING_STOPPED = 'recording_stopped',
  HAND_RAISED = 'hand_raised',
  HAND_LOWERED = 'hand_lowered',
  CHAT_MESSAGE = 'chat_message',
  WHITEBOARD_UPDATED = 'whiteboard_updated',
  FILE_SHARED = 'file_shared',
  QUALITY_CHANGED = 'quality_changed',
  NETWORK_ISSUE = 'network_issue',
  CALL_RECONNECTED = 'call_reconnected',
  CALL_FAILED = 'call_failed',
  PARTICIPANT_REMOVED = 'participant_removed',
  WAITING_ROOM_APPROVED = 'waiting_room_approved',
  WAITING_ROOM_DENIED = 'waiting_room_denied'
}

// Whiteboard Types
export interface Whiteboard {
  id: string;
  callId: string;
  title: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Content
  elements: WhiteboardElement[];
  background?: WhiteboardBackground;
  
  // Permissions
  permissions: WhiteboardPermissions;
  
  // Version Control
  version: number;
  history: WhiteboardHistory[];
  
  metadata?: Record<string, any>;
}

export type WhiteboardElement = 
  | TextElement 
  | ShapeElement 
  | LineElement 
  | ImageElement 
  | StickyNoteElement
  | MedicalAnnotationElement;

export interface TextElement {
  type: 'text';
  id: string;
  content: string;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  bold: boolean;
  italic: boolean;
}

export interface ShapeElement {
  type: 'shape';
  id: string;
  shape: 'rectangle' | 'circle' | 'triangle' | 'arrow';
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  fillColor?: string;
  strokeWidth: number;
}

export interface LineElement {
  type: 'line';
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
  strokeWidth: number;
}

export interface ImageElement {
  type: 'image';
  id: string;
  url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface StickyNoteElement {
  type: 'sticky_note';
  id: string;
  content: string;
  position: { x: number; y: number };
  color: string;
}

export interface MedicalAnnotationElement {
  type: 'medical_annotation';
  id: string;
  annotationType: 'measurement' | 'label' | 'highlight' | 'arrow';
  position: { x: number; y: number };
  label?: string;
  measurement?: number;
  unit?: string;
  color: string;
}

export interface WhiteboardBackground {
  type: 'color' | 'image' | 'grid' | 'ruled';
  value: string;
  opacity?: number;
}

export interface WhiteboardPermissions {
  canEdit: boolean;
  canAddElements: boolean;
  canDeleteElements: boolean;
  canClearBoard: boolean;
  canExport: boolean;
  canSave: boolean;
}

export interface WhiteboardHistory {
  version: number;
  timestamp: Date;
  action: string;
  userId: string;
  changes: WhiteboardChange[];
}

export interface WhiteboardChange {
  elementId: string;
  property: string;
  oldValue: any;
  newValue: any;
}

// Call Analytics
export interface CallAnalytics {
  callId: string;
  
  // Usage Metrics
  usage: {
    totalCalls: number;
    totalDuration: number;
    averageDuration: number;
    peakConcurrentCalls: number;
    byType: Record<CallType, number>;
    byTime: {
      byHour: Record<string, number>;
      byDay: Record<string, number>;
      byMonth: Record<string, number>;
    };
  };
  
  // Quality Metrics
  quality: {
    averageQuality: ConnectionQuality;
    failedCalls: number;
    reconnections: number;
    qualityDistribution: Record<ConnectionQuality, number>;
    issues: QualityIssue[];
  };
  
  // Participant Metrics
  participants: {
    totalParticipants: number;
    averageParticipants: number;
    retentionRate: number;
    satisfaction: number;
  };
  
  // Medical Metrics
  medical: {
    prescriptionsIssued: number;
    testsOrdered: number;
    followUpsScheduled: number;
    emergencyCalls: number;
    clinicalOutcomes: ClinicalOutcome[];
  };
  
  // Financial Metrics
  financial: {
    totalRevenue: number;
    averageRevenuePerCall: number;
    insuranceCollection: number;
    patientCollection: number;
  };
  
  insights: CallInsight[];
  recommendations: CallRecommendation[];
}

export interface QualityIssue {
  type: 'network' | 'audio' | 'video' | 'device' | 'software';
  frequency: number;
  averageDuration: number;
  impact: 'low' | 'medium' | 'high';
  resolution: string;
}

export interface ClinicalOutcome {
  outcome: string;
  count: number;
  effectiveness: number; // 0-100
}

export interface CallInsight {
  type: 'quality' | 'usage' | 'clinical' | 'financial';
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
}

export interface CallRecommendation {
  type: 'technical' | 'clinical' | 'operational' | 'financial';
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

// Device Compatibility
export interface DeviceCompatibility {
  deviceId: string;
  browser: string;
  os: string;
  camera: CompatibilityStatus;
  microphone: CompatibilityStatus;
  speakers: CompatibilityStatus;
  network: CompatibilityStatus;
  overall: CompatibilityStatus;
  issues: string[];
  recommendations: string[];
}

export enum CompatibilityStatus {
  COMPATIBLE = 'compatible',
  LIMITED = 'limited',
  INCOMPATIBLE = 'incompatible',
  UNKNOWN = 'unknown'
}