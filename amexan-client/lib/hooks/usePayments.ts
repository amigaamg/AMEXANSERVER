import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/utils/api';
import { API_ROUTES } from '@/lib/config/api-routes';
import type { Payment } from '@/types/payment';

interface UsePaymentsReturn {
  payments: Payment[];
  balance: number;
  loading: boolean;
  error: string | null;
  initiateMpesa: (phone: string, amount: number, description: string) => Promise<void>;
  refresh: () => void;
}

export function usePayments(patientId: string): UsePaymentsReturn {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await api(API_ROUTES.PAYMENTS.HISTORY(patientId));
      setPayments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const balance = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const initiateMpesa = async (phone: string, amount: number, description: string) => {
    try {
      await api(API_ROUTES.PAYMENTS.INITIATE, {
        method: 'POST',
        body: JSON.stringify({ patientId, phone, amount, description }),
      });
      fetchPayments();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return { payments, balance, loading, error, initiateMpesa, refresh: fetchPayments };
}