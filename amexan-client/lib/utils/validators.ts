export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^(\+254|0)[17]\d{8}$/.test(phone);
};

export const isValidBP = (systolic: number, diastolic: number): boolean => {
  return systolic > 0 && diastolic > 0 && systolic < 300 && diastolic < 200;
};

export const isValidGlucose = (value: number): boolean => {
  return value > 0 && value < 50;
};