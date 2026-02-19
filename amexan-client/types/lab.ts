export interface LabResult {
  _id: string;
  patientId: string;
  name: string;
  value: string;
  unit: string;
  range?: string;
  status: 'normal' | 'warning' | 'critical';
  date: string;
  trend?: 'rising' | 'improving' | 'stable';
  orderedBy?: string;
}

export interface ImagingStudy {
  _id: string;
  patientId: string;
  type: string; // e.g. "X-Ray Chest"
  date: string;
  thumbnailUrl?: string;
  fullUrl?: string;
  report?: string;
  status: 'pending' | 'completed';
  orderedBy?: string;
}