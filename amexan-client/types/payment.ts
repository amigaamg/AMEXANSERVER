export interface Payment {
  _id: string;
  patientId: string;
  appointmentId?: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  method: 'mpesa' | 'card' | 'cash';
  reference: string;
  mpesaReceipt?: string;
  createdAt: string;
}

export interface Invoice {
  _id: string;
  patientId: string;
  items: {
    description: string;
    amount: number;
  }[];
  total: number;
  dueDate: string;
  status: 'pending' | 'paid';
  payments: string[]; // payment ids
}

export interface MpesaTransaction {
  _id: string;
  patientId: string;
  phone: string;
  amount: number;
  reference: string;
  status: 'initiated' | 'completed' | 'failed';
  mpesaReceipt?: string;
  createdAt: string;
}