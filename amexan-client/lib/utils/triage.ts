import { SPECIALTIES } from '@/lib/config/specialties';

export const recommendSpecialty = (symptoms: string): string => {
  const s = symptoms.toLowerCase();
  const matched = SPECIALTIES.find(spec =>
    spec.triageKeywords.some(keyword => s.includes(keyword))
  );
  return matched?.name || 'General Medicine';
};