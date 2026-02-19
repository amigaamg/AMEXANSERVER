import type { Alert, Measurement } from '@/types/patient';

export const calculateRiskLevel = (alerts: Alert[], latestBP?: Measurement): 'stable' | 'needs_review' | 'urgent' => {
  if (alerts.some(a => a.severity === 'high')) return 'urgent';
  if (alerts.some(a => a.severity === 'medium')) return 'needs_review';
  if (latestBP && (latestBP.systolic >= 180 || latestBP.diastolic >= 120)) return 'urgent';
  if (latestBP && (latestBP.systolic >= 140 || latestBP.diastolic >= 90)) return 'needs_review';
  return 'stable';
};