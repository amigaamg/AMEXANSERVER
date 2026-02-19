export const formatPhoneForMpesa = (phone: string): string => {
  // Remove any non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  }
  if (cleaned.startsWith('7')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
};

export const validateMpesaPhone = (phone: string): boolean => {
  const cleaned = formatPhoneForMpesa(phone);
  return /^254[17]\d{8}$/.test(cleaned);
};