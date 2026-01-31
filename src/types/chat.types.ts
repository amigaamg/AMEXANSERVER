import { WithId, WithTimestamps } from './index';

export enum ConversationType {
  DIRECT = 'direct',
  GROUP = 'group',
  PATIENT_DOCTOR = 'patient_doctor',
  CARE_TEAM = 'care_team',
  SUPPORT = 'support'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  PRESCRIPTION = 'prescription',
  LAB_RESULT = 'lab_result',
  APPOINTMENT = 'appointment',
  MEDICATION = 'medication',
  SYSTEM = 'system'
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export interface Conversation extends WithId, WithTimestamps {
  // Basic Info
  type: ConversationType;
  title?: string;
  description?: string;
  avatar?: string;
  
  // Participants
  participants: Participant[];
  participantIds: string[];
  lastActiveParticipants: string[];
  
  // Settings
  settings: ConversationSettings;
  permissions: ConversationPermissions;
  
  // Metadata
  lastMessage?: MessagePreview;
  unreadCount: number;
  muted: boolean;
  archived: boolean;
  pinned: boolean;
  
  // Medical Context (if applicable)
  medicalContext?: MedicalConversationContext;
  
  metadata?: Record<string, any>;
}

export interface Participant {
  userId: string;
  role: 'patient' | 'doctor' | 'nurse' | 'admin' | 'caregiver' | 'support';
  joinedAt: Date;
  leftAt?: Date;
  isActive: boolean;
  lastReadAt?: Date;
  notificationSettings: ParticipantNotificationSettings;
  permissions: ParticipantPermissions;
}

export interface ConversationSettings {
  allowNewMembers: boolean;
  requireApproval: boolean;
  messageHistory: 'full' | 'last_30_days' | 'last_7_days' | 'none';
  fileSharing: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  encryptionEnabled: boolean;
  retentionPeriod: number; // days
}

export interface ConversationPermissions {
  canSendMessages: boolean;
  canSendFiles: boolean;
  canAddParticipants: boolean;
  canRemoveParticipants: boolean;
  canChangeSettings: boolean;
  canPinMessages: boolean;
  canDeleteMessages: boolean;
}

export interface ParticipantNotificationSettings {
  mute: boolean;
  muteUntil?: Date;
  desktopNotifications: boolean;
  mobileNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface ParticipantPermissions {
  canInvite: boolean;
  canRemove: boolean;
  canPin: boolean;
  canDelete: boolean;
  canEdit: boolean;
}

export interface MessagePreview {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  type: MessageType;
  status: MessageStatus;
}

export interface MedicalConversationContext {
  patientId?: string;
  doctorId?: string;
  appointmentId?: string;
  condition?: string;
  priority: 'routine' | 'urgent' | 'emergency';
  tags: string[];
  attachments: MedicalAttachment[];
  consentObtained: boolean;
  confidentialityLevel: 'standard' | 'sensitive' | 'restricted';
}

export interface MedicalAttachment {
  type: 'medical_record' | 'lab_result' | 'prescription' | 'image' | 'ecg' | 'other';
  name: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

// Message Types
export interface Message extends WithId, WithTimestamps {
  conversationId: string;
  senderId: string;
  
  // Content
  type: MessageType;
  content: string;
  richContent?: RichContent;
  
  // Status & Delivery
  status: MessageStatus;
  readBy: ReadReceipt[];
  deliveredTo: string[];
  
  // References
  replyToId?: string;
  forwardFromId?: string;
  threadId?: string;
  
  // Attachments
  attachments: MessageAttachment[];
  
  // Reactions
  reactions: Reaction[];
  
  // Medical Context
  medicalContext?: MessageMedicalContext;
  
  // Metadata
  metadata?: Record<string, any>;
  clientId?: string; // For optimistic updates
}

export interface RichContent {
  formattedText?: string;
  mentions?: Mention[];
  hashtags?: string[];
  links?: LinkPreview[];
  emojis?: string[];
}

export interface Mention {
  userId: string;
  position: number;
  length: number;
}

export interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video' | 'prescription' | 'lab_result';
  name: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  mimeType: string;
  duration?: number; // for audio/video
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

export interface ReadReceipt {
  userId: string;
  readAt: Date;
  deviceId?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface MessageMedicalContext {
  patientId?: string;
  isClinical: boolean;
  requiresResponse: boolean;
  urgency: 'routine' | 'urgent' | 'emergency';
  tags: string[];
  relatedTo?: {
    appointmentId?: string;
    medicationId?: string;
    labResultId?: string;
    condition?: string;
  };
  confidentiality: 'standard' | 'sensitive' | 'restricted';
}

// Specialized Message Types
export interface PrescriptionMessage extends Message {
  type: MessageType.PRESCRIPTION;
  prescription: EmbeddedPrescription;
}

export interface EmbeddedPrescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: Date;
  pharmacy?: string;
  refills: number;
}

export interface LabResultMessage extends Message {
  type: MessageType.LAB_RESULT;
  labResult: EmbeddedLabResult;
}

export interface EmbeddedLabResult {
  id: string;
  test: string;
  result: string;
  unit: string;
  normalRange: string;
  flag?: 'high' | 'low' | 'normal' | 'critical';
  collectedDate: Date;
  reportedDate: Date;
  labName: string;
}

export interface AppointmentMessage extends Message {
  type: MessageType.APPOINTMENT;
  appointment: EmbeddedAppointment;
}

export interface EmbeddedAppointment {
  id: string;
  date: Date;
  time: string;
  type: string;
  doctor: string;
  location: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
  notes?: string;
}

// Real-time Events
export interface ChatEvent {
  type: ChatEventType;
  timestamp: Date;
  data: any;
  senderId?: string;
}

export enum ChatEventType {
  MESSAGE_SENT = 'message_sent',
  MESSAGE_DELIVERED = 'message_delivered',
  MESSAGE_READ = 'message_read',
  TYPING_STARTED = 'typing_started',
  TYPING_STOPPED = 'typing_stopped',
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  USER_AWAY = 'user_away',
  CONVERSATION_UPDATED = 'conversation_updated',
  PARTICIPANT_ADDED = 'participant_added',
  PARTICIPANT_REMOVED = 'participant_removed',
  MESSAGE_REACTION = 'message_reaction',
  MESSAGE_DELETED = 'message_deleted',
  MESSAGE_EDITED = 'message_edited'
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  startedAt: Date;
}

export interface PresenceStatus {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy' | 'do_not_disturb';
  lastSeen: Date;
  device?: string;
  customStatus?: string;
}

// Search & Filter
export interface ChatSearchCriteria {
  query: string;
  conversationId?: string;
  senderId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  messageTypes?: MessageType[];
  hasAttachments?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  messages: Message[];
  conversations: Conversation[];
  total: number;
  query: string;
}

// Chat Analytics
export interface ChatAnalytics {
  conversationId: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Volume Metrics
  volume: {
    totalMessages: number;
    messagesPerDay: number;
    peakHours: number[];
    busiestDay: string;
  };
  
  // Participant Metrics
  participants: {
    activeCount: number;
    mostActive: ParticipantActivity[];
    responseTimes: ResponseTimeMetrics;
  };
  
  // Content Analysis
  content: {
    messageTypes: Record<MessageType, number>;
    medicalMessages: number;
    attachments: number;
    averageMessageLength: number;
  };
  
  // Engagement Metrics
  engagement: {
    responseRate: number;
    averageResponseTime: number; // minutes
    engagementScore: number; // 0-100
    satisfaction?: number; // 1-5
  };
  
  // Quality Metrics
  quality: {
    clinicalAccuracy: number;
    completeness: number;
    timeliness: number;
  };
  
  insights: ChatInsight[];
}

export interface ParticipantActivity {
  userId: string;
  messageCount: number;
  responseRate: number;
  averageResponseTime: number;
  lastActivity: Date;
}

export interface ResponseTimeMetrics {
  average: number;
  median: number;
  p95: number;
  byHour: Record<string, number>;
  byDay: Record<string, number>;
}

export interface ChatInsight {
  type: 'engagement' | 'efficiency' | 'quality' | 'satisfaction';
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  recommendations?: string[];
}

// Chat Settings
export interface UserChatSettings {
  // Notifications
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    preview: boolean;
    groupNotifications: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  
  // Privacy
  privacy: {
    onlineStatus: 'everyone' | 'contacts' | 'nobody';
    readReceipts: boolean;
    typingIndicators: boolean;
    lastSeen: 'everyone' | 'contacts' | 'nobody';
    profilePhoto: 'everyone' | 'contacts' | 'nobody';
  };
  
  // Media & Storage
  media: {
    autoDownload: {
      photos: boolean;
      videos: boolean;
      documents: boolean;
      maximumSize: number;
    };
    storage: {
      saveToCameraRoll: boolean;
      maxStorage: number;
      autoCleanup: boolean;
    };
  };
  
  // Appearance
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    chatBackground?: string;
    bubbleStyle: 'default' | 'minimal' | 'rounded';
  };
  
  // Security
  security: {
    appLock: boolean;
    biometricLock: boolean;
    messageEncryption: boolean;
    selfDestructingMessages: boolean;
    selfDestructTimer?: number; // hours
  };
  
  // Accessibility
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    colorBlindMode: boolean;
  };
}