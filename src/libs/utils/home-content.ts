import { boolean } from 'zod';
import {
  PersonalInfoForm,
  QuoteForm,
  backendValidation,
} from '../types/homeContents';

export const validateQuoteForm = (formData: QuoteForm): Partial<QuoteForm> => {
  const errors: Partial<QuoteForm> = {};

  // Validate ownership
  if (!formData.ownership) {
    errors.ownership = 'Ownership of your home is required';
  }

  // Validate home type
  if (!formData.homeType) {
    errors.homeType = 'Home type is required';
  }

  // Validate unit type (only if not landed property)
  if (
    formData.homeType !== 'Landed Property' &&
    formData.unitType === 'Landed'
  ) {
    console.log('[DEBUG] inside validation check');
    errors.unitType = 'Unit type is required';
  }

  // Validate policy start date
  if (!formData.policyStartDate) {
    errors.policyStartDate = 'Policy start date is required';
  } else {
    const startDate = new Date(formData.policyStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    thirtyDaysFromNow.setHours(23, 59, 59, 999); // Set to end of day

    if (startDate < today) {
      errors.policyStartDate = 'Policy start date cannot be in the past';
    } else if (startDate > thirtyDaysFromNow) {
      errors.policyStartDate =
        'Policy start date cannot be more than 30 days from today';
    }
  }

  return errors;
};

export const validatePersonalInfoForm = (
  formData: PersonalInfoForm,
): Partial<PersonalInfoForm> => {
  const errors: Partial<PersonalInfoForm> = {};

  // Policy holder details validation
  if (!formData.policyHolderFullName?.trim()) {
    errors.policyHolderFullName = 'Policy holder full name is required';
  }

  if (!formData.policyHolderNricFin?.trim()) {
    errors.policyHolderNricFin = 'NRIC/FIN is required';
  } else if (
    !/^[STFG]\d{7}[A-Z]$/.test(formData.policyHolderNricFin.toUpperCase())
  ) {
    errors.policyHolderNricFin =
      'Please enter a valid NRIC/FIN (e.g., S1234567A)';
  }

  if (!formData.policyHolderNationality) {
    errors.policyHolderNationality = 'Nationality is required';
  }

  if (!formData.policyHolderDateOfBirth) {
    errors.policyHolderDateOfBirth = 'Date of birth is required';
  } else {
    const birthDate = new Date(formData.policyHolderDateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      errors.policyHolderDateOfBirth =
        'Policy holder must be at least 18 years old';
    } else if (age > 100) {
      errors.policyHolderDateOfBirth = 'Please enter a valid date of birth';
    }
  }

  //marital status check
  if (!formData.policyHolderMaritalStatus)
    errors.policyHolderMaritalStatus = 'Please enter your marital status';

  // Mobile number validation
  if (!formData.policyHolderMobileNumber?.trim()) {
    errors.policyHolderMobileNumber = 'Mobile number is required';
  } else if (
    !/^[689]\d{7}$/.test(formData.policyHolderMobileNumber.replace(/\s+/g, ''))
  ) {
    errors.policyHolderMobileNumber =
      'Please enter a valid Singapore mobile number (e.g., 91234567)';
  }

  // Email validation
  if (!formData.policyHolderEmail?.trim()) {
    errors.policyHolderEmail = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.policyHolderEmail)) {
    errors.policyHolderEmail = 'Please enter a valid email address';
  }

  // Address validation
  if (!formData.addressLine1?.trim()) {
    errors.addressLine1 = 'Address Line 1 is required';
  }

  if (!formData.postalCode?.trim()) {
    errors.postalCode = 'Postal code is required';
  } else if (!/^\d{6}$/.test(formData.postalCode)) {
    errors.postalCode = 'Please enter a valid 6-digit postal code';
  }

  // Mailing address validation (only if different from insured premises)
  if (formData.mailingAddressDifferent === 'yes') {
    if (!formData.mailingAddressLine1?.trim()) {
      errors.mailingAddressLine1 = 'Mailing Address Line 1 is required';
    }

    if (!formData.mailingPostalCode?.trim()) {
      errors.mailingPostalCode = 'Mailing postal code is required';
    } else if (!/^\d{6}$/.test(formData.mailingPostalCode)) {
      errors.mailingPostalCode = 'Please enter a valid 6-digit postal code';
    }
  }

  // Previous insurer validation (optional)
  if (
    formData.previousInsurerName === 'Other' &&
    !formData.otherInsurerName?.trim()
  ) {
    errors.otherInsurerName = 'Other insurer name is required';
  }

  return errors;
};

//not a valid/working nric(after checking with from isp)
export const existNRIC = (backEndValidate: backendValidation) => {
  const errors: Partial<PersonalInfoForm> = {};

  if (backEndValidate.invalidNRIC) {
    errors.policyHolderNricFin = 'NRIC/ FIN does not exist or is invalid';
  }
  return errors;
};

export const isFormValid = (errors: Record<string, any>): boolean => {
  return Object.keys(errors).length === 0;
};
