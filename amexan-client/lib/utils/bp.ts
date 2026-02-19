// lib/utils/bp.ts
// ─────────────────────────────────────────────────────────────────────────────
// Blood Pressure classification helpers (AHA 2017 guidelines)
// ─────────────────────────────────────────────────────────────────────────────

export type BPCategory =
  | 'Normal'
  | 'Elevated'
  | 'High — Stage 1'
  | 'High — Stage 2'
  | 'Hypertensive Crisis'
  | 'Low';

/**
 * Return the AHA category label for a BP reading.
 */
export function bpCategory(systolic: number, diastolic: number): BPCategory {
  if (systolic > 180 || diastolic > 120) return 'Hypertensive Crisis';
  if (systolic >= 140 || diastolic >= 90) return 'High — Stage 2';
  if (systolic >= 130 || diastolic >= 80) return 'High — Stage 1';
  if (systolic >= 120 && diastolic < 80)  return 'Elevated';
  if (systolic < 90  || diastolic < 60)   return 'Low';
  return 'Normal';
}

/**
 * Return the foreground colour for a BP reading (use in text / icons).
 */
export function bpColor(systolic: number, diastolic: number): string {
  const cat = bpCategory(systolic, diastolic);
  const map: Record<BPCategory, string> = {
    'Normal':               '#22c55e',
    'Elevated':             '#f59e0b',
    'High — Stage 1':       '#f97316',
    'High — Stage 2':       '#ef4444',
    'Hypertensive Crisis':  '#dc2626',
    'Low':                  '#3b82f6',
  };
  return map[cat];
}

/**
 * Return the background colour for a BP category badge.
 */
export function bpBg(systolic: number, diastolic: number): string {
  const cat = bpCategory(systolic, diastolic);
  const map: Record<BPCategory, string> = {
    'Normal':               '#dcfce7',
    'Elevated':             '#fef3c7',
    'High — Stage 1':       '#ffedd5',
    'High — Stage 2':       '#fee2e2',
    'Hypertensive Crisis':  '#fecaca',
    'Low':                  '#dbeafe',
  };
  return map[cat];
}