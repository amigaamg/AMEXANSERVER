export function bpCategory(systolic: number, diastolic: number): {
  label: string;
  color: string;
  bg: string;
  icon: string;
} {
  if (systolic >= 180 || diastolic >= 120) {
    return { label: 'Crisis', color: '#ef4444', bg: '#fef2f2', icon: '🔴' };
  }
  if (systolic >= 160 || diastolic >= 100) {
    return { label: 'Stage 2', color: '#f97316', bg: '#fff7ed', icon: '🟠' };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { label: 'Stage 1', color: '#f59e0b', bg: '#fffbeb', icon: '🟡' };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return { label: 'Elevated', color: '#fbbf24', bg: '#fef9c3', icon: '🟨' };
  }
  return { label: 'Controlled', color: '#22c55e', bg: '#f0fdf4', icon: '🟢' };
}