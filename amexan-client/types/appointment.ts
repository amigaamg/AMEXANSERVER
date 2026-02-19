export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  clinicName?: string;
  doctorName?: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'transferred';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  isFirstVisit: boolean;
  triageAnswers?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BookingSlot {
  doctorId: string;
  clinicId: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}