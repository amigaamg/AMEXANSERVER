import { WithId, WithTimestamps } from './index';

export enum NotificationType {
  APPOINTMENT = 'appointment',
  MEDICATION = 'medication',
  LAB_RESULT = 'lab_result',
  BILLING = 'billing',
  HEALTH_ALERT = 'health_alert',
  SYSTEM = 'system',
  MESSAGE = 'message',
  REMINDER = 'reminder',
  SECURITY = 'security',
  PROMOTIONAL = 'promotional'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
  VOICE = 'voice',
  WEBHOOK = 'webhook'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface Notification extends WithId, WithTimestamps {
  userId: string;
  patientId?: string;
  
  // Content
  type: NotificationType;
  subtype?: string;
  title: string;
  message: string;
  data?: NotificationData;
  
  // Delivery
  channels: NotificationChannel[];
  scheduledFor?: Date;
  sentAt?: Date;
  deliveredAt?: Record<NotificationChannel, Date>;
  readAt?: Date;
  status: NotificationStatus;
  
  // Priority & Expiry
  priority: NotificationPriority;
  ttl?: number; // Time to live in seconds
  expiresAt?: Date;
  
  // Actions
  actions: NotificationAction[];
  requiresAcknowledgment: boolean;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  
  // Tracking
  trackingId?: string;
  deliveryAttempts: number;
  lastAttemptAt?: Date;
  failureReason?: string;
  
  // Metadata
  category?: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export type NotificationData = 
  | AppointmentNotificationData
  | MedicationNotificationData
  | LabResultNotificationData
  | BillingNotificationData
  | HealthAlertNotificationData
  | MessageNotificationData
  | SystemNotificationData;

export interface AppointmentNotificationData {
  appointmentId: string;
  doctorName: string;
  date: Date;
  time: string;
  location?: string;
  meetingUrl?: string;
  type: 'reminder' | 'confirmation' | 'cancellation' | 'reschedule';
}

export interface MedicationNotificationData {
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string;
  refillRemaining: number;
  type: 'reminder' | 'refill' | 'missed' | 'taken';
}

export interface LabResultNotificationData {
  labResultId: string;
  testName: string;
  result: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: Date;
  labName: string;
}

export interface BillingNotificationData {
  invoiceId: string;
  amount: number;
  dueDate: Date;
  status: 'due' | 'overdue' | 'paid';
  paymentMethod?: string;
}

export interface HealthAlertNotificationData {
  alertId: string;
  condition: string;
  reading: number;
  threshold: number;
  severity: 'warning' | 'critical' | 'emergency';
  recommendations: string[];
}

export interface MessageNotificationData {
  messageId: string;
  senderName: string;
  preview: string;
  conversationId: string;
  unreadCount: number;
}

export interface SystemNotificationData {
  system: string;
  component: string;
  action: string;
  impact: 'low' | 'medium' | 'high';
  maintenanceWindow?: {
    start: Date;
    end: Date;
  };
}

export interface NotificationAction {
  label: string;
  type: 'button' | 'link' | 'dismiss';
  url?: string;
  action: string;
  data?: Record<string, any>;
  primary: boolean;
}

// Notification Template
export interface NotificationTemplate extends WithId, WithTimestamps {
  name: string;
  description?: string;
  type: NotificationType;
  subtype?: string;
  
  // Content Templates
  templates: ChannelTemplate[];
  
  // Triggers
  triggers: NotificationTrigger[];
  
  // Audience
  audience: NotificationAudience;
  
  // Scheduling
  scheduling: NotificationScheduling;
  
  // Testing
  testData: Record<string, any>;
  
  // Status
  status: 'active' | 'inactive' | 'draft';
  version: string;
  
  metadata?: Record<string, any>;
}

export interface ChannelTemplate {
  channel: NotificationChannel;
  subject?: string;
  title?: string;
  body: string;
  htmlBody?: string;
  variables: TemplateVariable[];
  attachments?: TemplateAttachment[];
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object';
  required: boolean;
  defaultValue?: any;
}

export interface TemplateAttachment {
  name: string;
  type: string;
  url: string;
  inline: boolean;
}

export interface NotificationTrigger {
  event: string;
  conditions: TriggerCondition[];
  delay?: number; // seconds
  throttle?: number; // seconds
  deduplicationKey?: string;
}

export interface TriggerCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface NotificationAudience {
  users: string[];
  roles: string[];
  conditions: AudienceCondition[];
  excludeUsers: string[];
  excludeConditions: AudienceCondition[];
}

export interface AudienceCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface NotificationScheduling {
  type: 'immediate' | 'scheduled' | 'recurring';
  scheduledFor?: Date;
  recurrence?: RecurrenceRule;
  timezone: string;
  expiresAfter?: number; // seconds
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  months?: number[];
  endDate?: Date;
  occurrences?: number;
}

// Notification Preferences
export interface NotificationPreferences extends WithId, WithTimestamps {
  userId: string;
  
  // Channel Preferences
  channels: ChannelPreferences;
  
  // Type Preferences
  types: TypePreferences;
  
  // Quiet Hours
  quietHours: QuietHours[];
  
  // Emergency Overrides
  emergencyOverrides: EmergencyOverride[];
  
  // Do Not Disturb
  doNotDisturb: DoNotDisturbSettings;
  
  // Delivery Rules
  deliveryRules: DeliveryRule[];
  
  // Opt-outs
  optOuts: string[];
  
  metadata?: Record<string, any>;
}

export interface ChannelPreferences {
  email: ChannelPreference;
  sms: ChannelPreference;
  push: ChannelPreference;
  inApp: ChannelPreference;
  voice: ChannelPreference;
}

export interface ChannelPreference {
  enabled: boolean;
  verified: boolean;
  address?: string;
  deviceId?: string;
  token?: string;
}

export interface TypePreferences {
  appointment: TypePreference;
  medication: TypePreference;
  labResult: TypePreference;
  billing: TypePreference;
  healthAlert: TypePreference;
  message: TypePreference;
  system: TypePreference;
  reminder: TypePreference;
  security: TypePreference;
  promotional: TypePreference;
}

export interface TypePreference {
  enabled: boolean;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  quietHoursOverride: boolean;
}

export interface QuietHours {
  name: string;
  enabled: boolean;
  days: number[];
  startTime: string;
  endTime: string;
  timezone: string;
  exceptions: QuietHoursException[];
}

export interface QuietHoursException {
  date: Date;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface EmergencyOverride {
  type: NotificationType;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  conditions: EmergencyCondition[];
}

export interface EmergencyCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
  value: any;
}

export interface DoNotDisturbSettings {
  enabled: boolean;
  startTime?: string;
  endTime?: string;
  allowExceptions: boolean;
  allowedTypes: NotificationType[];
  allowedChannels: NotificationChannel[];
}

export interface DeliveryRule {
  id: string;
  name: string;
  conditions: DeliveryCondition[];
  actions: DeliveryAction[];
  enabled: boolean;
  priority: number;
}

export interface DeliveryCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface DeliveryAction {
  type: 'delay' | 'reroute' | 'escalate' | 'suppress' | 'transform';
  parameters: Record<string, any>;
}

// Notification Analytics
export interface NotificationAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  
  // Volume Metrics
  volume: {
    totalSent: number;
    totalDelivered: number;
    totalRead: number;
    byType: Record<NotificationType, number>;
    byChannel: Record<NotificationChannel, number>;
    byPriority: Record<NotificationPriority, number>;
    trend: NotificationTrend[];
  };
  
  // Performance Metrics
  performance: {
    deliveryRate: number;
    readRate: number;
    clickThroughRate: number;
    averageDeliveryTime: number;
    failureRate: number;
    byChannel: Record<NotificationChannel, PerformanceMetrics>;
  };
  
  // Engagement Metrics
  engagement: {
    uniqueRecipients: number;
    averageNotificationsPerUser: number;
    engagementRate: number;
    optOutRate: number;
    satisfaction?: number;
  };
  
  // Impact Metrics
  impact: {
    appointmentAttendance: number;
    medicationAdherence: number;
    billPayment: number;
    healthOutcomes: number;
    roi: number;
  };
  
  // Cost Metrics
  cost: {
    totalCost: number;
    costPerNotification: number;
    byChannel: Record<NotificationChannel, number>;
    roi: number;
  };
  
  // Insights
  insights: NotificationInsight[];
  recommendations: NotificationRecommendation[];
}

export interface NotificationTrend {
  date: Date;
  sent: number;
  delivered: number;
  read: number;
}

export interface PerformanceMetrics {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  deliveryRate: number;
  readRate: number;
  averageDeliveryTime: number;
}

export interface NotificationInsight {
  type: 'volume' | 'performance' | 'engagement' | 'impact' | 'cost';
  insight: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
  actionItems?: string[];
}

export interface NotificationRecommendation {
  type: 'content' | 'timing' | 'channel' | 'targeting' | 'cost';
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

// Real-time Notification Events
export interface NotificationEvent {
  type: NotificationEventType;
  timestamp: Date;
  notificationId: string;
  userId: string;
  data: any;
}

export enum NotificationEventType {
  NOTIFICATION_CREATED = 'notification_created',
  NOTIFICATION_SCHEDULED = 'notification_scheduled',
  NOTIFICATION_SENT = 'notification_sent',
  NOTIFICATION_DELIVERED = 'notification_delivered',
  NOTIFICATION_READ = 'notification_read',
  NOTIFICATION_FAILED = 'notification_failed',
  NOTIFICATION_ACKNOWLEDGED = 'notification_acknowledged',
  NOTIFICATION_CLICKED = 'notification_clicked',
  NOTIFICATION_DISMISSED = 'notification_dismissed',
  PREFERENCES_UPDATED = 'preferences_updated'
}

// Notification Provider Configuration
export interface NotificationProvider {
  name: string;
  type: NotificationChannel;
  enabled: boolean;
  configuration: ProviderConfiguration;
  limits: ProviderLimits;
  status: ProviderStatus;
}

export type ProviderConfiguration = 
  | EmailProviderConfig
  | SMSProviderConfig
  | PushProviderConfig
  | VoiceProviderConfig
  | WebhookProviderConfig;

export interface EmailProviderConfig {
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromAddress: string;
  fromName: string;
  replyTo?: string;
  tls: boolean;
}

export interface SMSProviderConfig {
  provider: 'twilio' | 'nexmo' | 'plivo' | 'custom';
  accountSid?: string;
  authToken?: string;
  phoneNumber: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface PushProviderConfig {
  provider: 'firebase' | 'apns' | 'fcm' | 'onesignal';
  serverKey?: string;
  appId?: string;
  certificate?: string;
  privateKey?: string;
  teamId?: string;
  keyId?: string;
}

export interface VoiceProviderConfig {
  provider: 'twilio' | 'nexmo' | 'custom';
  accountSid?: string;
  authToken?: string;
  phoneNumber: string;
  language: string;
  voice: string;
}

export interface WebhookProviderConfig {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers: Record<string, string>;
  timeout: number;
  retries: number;
}

export interface ProviderLimits {
  rateLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  concurrency: number;
}

export interface ProviderStatus {
  connected: boolean;
  lastConnected: Date;
  lastError?: string;
  errorCount: number;
  queueSize: number;
}