import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export interface PhoneValidationResult {
  isValid: boolean;
  formattedNumber: string;
  error?: string;
}

export const validatePhoneNumber = (
  countryCode: string,
  number: string
): PhoneValidationResult => {
  try {
    // If the number is empty, return invalid
    if (!number) {
      return {
        isValid: false,
        formattedNumber: '',
        error: 'Phone number is required',
      };
    }

    // Remove any non-digit characters except + from the number
    const cleanNumber = number.replace(/[^\d+]/g, '');

    // If the number already includes the country code, use it as is
    if (cleanNumber.startsWith('+')) {
      const phoneNumber = parsePhoneNumber(cleanNumber);
      if (phoneNumber && isValidPhoneNumber(cleanNumber)) {
        return {
          isValid: true,
          formattedNumber: phoneNumber.format('INTERNATIONAL'),
        };
      }
    }

    // Combine country code and number
    const fullNumber = `${countryCode}${cleanNumber}`;

    // Parse the phone number
    const phoneNumber = parsePhoneNumber(fullNumber);

    if (!phoneNumber) {
      return {
        isValid: false,
        formattedNumber: fullNumber,
        error: 'Invalid phone number format',
      };
    }

    // Validate the phone number
    if (!isValidPhoneNumber(fullNumber)) {
      return {
        isValid: false,
        formattedNumber: phoneNumber.format('INTERNATIONAL'),
        error: 'Invalid phone number for the selected country',
      };
    }

    return {
      isValid: true,
      formattedNumber: phoneNumber.format('INTERNATIONAL'),
    };
  } catch (error) {
    // If validation fails, return the original number
    return {
      isValid: true,
      formattedNumber: `${countryCode}${number}`,
    };
  }
};

export const formatPhoneNumber = (
  countryCode: string,
  number: string
): string => {
  try {
    const fullNumber = `${countryCode}${number.replace(/[^\d+]/g, '')}`;
    const phoneNumber = parsePhoneNumber(fullNumber);
    return phoneNumber ? phoneNumber.format('INTERNATIONAL') : fullNumber;
  } catch {
    return `${countryCode}${number}`;
  }
};
