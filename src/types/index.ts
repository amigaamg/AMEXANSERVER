// Re-export all types for easy imports
export * from './user.types';
export * from './patient.types';
export * from './doctor.types';
export * from './appointment.types';
export * from './chronic-disease.types';
export * from './medication.types';
export * from './chat.types';
export * from './video.types';
export * from './insurance.types';
export * from './billing.types';
export * from './supply.types';
export * from './notification.types';
export * from './analytics.types';
export * from './firebase.types';

// Common utility types
export type WithId<T> = T & { id: string };
export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
    [key: string]: any;
  };
};

export type Range<T> = {
  min: T;
  max: T;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export type FileAttachment = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  metadata?: Record<string, any>;
};