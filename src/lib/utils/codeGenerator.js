/**
 * Secure Tracking Code Generator
 * Format: XXX-XXXX-XXXX
 * Character set: [A-HJ-NP-Z0-9] (no ambiguous chars like 0/O)
 */

// Character set excluding ambiguous characters (0, O, I, 1, etc.)
const SECURE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generate a random character from the secure character set
 * @returns {string} A random secure character
 */
function getRandomSecureChar() {
  return SECURE_CHARS.charAt(Math.floor(Math.random() * SECURE_CHARS.length));
}

/**
 * Generate a secure tracking code in format XXX-XXXX-XXXX
 * @returns {string} A secure tracking code
 */
export function generateSecureTrackingCode() {
  // Generate first group (3 characters)
  const group1 = Array.from({ length: 3 }, () => getRandomSecureChar()).join('');
  
  // Generate second group (4 characters)
  const group2 = Array.from({ length: 4 }, () => getRandomSecureChar()).join('');
  
  // Generate third group (4 characters)
  const group3 = Array.from({ length: 4 }, () => getRandomSecureChar()).join('');
  
  // Combine with hyphens
  return `${group1}-${group2}-${group3}`;
}

/**
 * Generate multiple secure tracking codes
 * @param {number} count - Number of codes to generate
 * @returns {string[]} Array of secure tracking codes
 */
export function generateMultipleCodes(count) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateSecureTrackingCode());
  }
  return codes;
}

/**
 * Validate a tracking code format
 * @param {string} code - The tracking code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateTrackingCode(code) {
  const pattern = /^[A-HJ-NP-Z0-9]{3}-[A-HJ-NP-Z0-9]{4}-[A-HJ-NP-Z0-9]{4}$/;
  return pattern.test(code);
}

/**
 * Check if a tracking code is already in use
 * @param {string} code - The tracking code to check
 * @param {string[]} existingCodes - Array of existing codes
 * @returns {boolean} True if code exists, false otherwise
 */
export function isCodeInUse(code, existingCodes) {
  return existingCodes.includes(code);
}

/**
 * Generate a unique tracking code
 * @param {string[]} existingCodes - Array of existing codes
 * @returns {string} A unique secure tracking code
 */
export function generateUniqueCode(existingCodes) {
  let code;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    code = generateSecureTrackingCode();
    attempts++;
    
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate unique code after maximum attempts');
    }
  } while (isCodeInUse(code, existingCodes));
  
  return code;
}

/**
 * Generate a batch of unique tracking codes
 * @param {number} count - Number of codes to generate
 * @param {string[]} existingCodes - Array of existing codes
 * @returns {string[]} Array of unique secure tracking codes
 */
export function generateUniqueCodes(count, existingCodes) {
  const codes = [];
  const usedCodes = [...existingCodes];
  
  for (let i = 0; i < count; i++) {
    const code = generateUniqueCode(usedCodes);
    codes.push(code);
    usedCodes.push(code);
  }
  
  return codes;
} 