export const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
];

// Accepts 0803 123 4567, +234 803 123 4567 and 2348031234567. Returns digits only, or null.
export function cleanNigerianPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (/^234\d{10}$/.test(digits)) return digits;
  if (/^0\d{10}$/.test(digits)) return `234${digits.slice(1)}`;
  if (/^\d{10}$/.test(digits)) return `234${digits}`;
  return null;
}
