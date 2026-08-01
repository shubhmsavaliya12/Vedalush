export const PHONE_CODES = [
  { code: '+91', country: 'India', min: 10, max: 10 },
  { code: '+1', country: 'US/Canada', min: 10, max: 10 },
  { code: '+44', country: 'UK', min: 10, max: 11 },
  { code: '+61', country: 'Australia', min: 9, max: 9 },
  { code: '+971', country: 'UAE', min: 9, max: 9 },
  { code: '+49', country: 'Germany', min: 10, max: 11 },
];

export const validatePhoneNumber = (countryCode, phoneNumber) => {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (!digitsOnly) return "Phone number is required";
  
  const rules = PHONE_CODES.find(c => c.code === countryCode);
  if (!rules) return true; // If somehow unsupported, let it pass for safety
  
  if (digitsOnly.length < rules.min || digitsOnly.length > rules.max) {
    if (rules.min === rules.max) {
      return `Phone number for ${rules.country} must be exactly ${rules.min} digits`;
    }
    return `Phone number for ${rules.country} must be between ${rules.min} and ${rules.max} digits`;
  }
  return true;
};

// Helper to safely split an existing phone string from database into [code, number]
export const splitPhoneData = (fullPhoneString) => {
  if (!fullPhoneString) return { code: '+91', number: '' };
  
  // Try to find if string starts with any known code
  // Sort by length descending to match +971 before +9
  const sortedCodes = [...PHONE_CODES].sort((a, b) => b.code.length - a.code.length);
  const matchedRule = sortedCodes.find(c => fullPhoneString.startsWith(c.code));
  
  if (matchedRule) {
    return {
      code: matchedRule.code,
      number: fullPhoneString.substring(matchedRule.code.length).trim()
    };
  }
  
  // Fallback if no matching country code is found
  return { code: '+91', number: fullPhoneString.trim() };
};
