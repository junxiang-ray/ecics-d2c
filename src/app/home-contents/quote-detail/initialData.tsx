//#region Initial Form Data

import {
  MyInfoData,
  PersonalInfoForm,
  PromoCodeStatus,
  QuoteForm,
} from '@/libs/types/homeContents';

const TOMORROW_DATE = new Date(Date.now() + 86400000)
  .toISOString()
  .split('T')[0];

// Pre-computed initial state objects to prevent recreation
const INITIAL_FORM_DATA: QuoteForm = {
  ownership: 'Owner',
  homeType: 'HDB',
  unitType: '4-Room',
  policyStartDate: TOMORROW_DATE,
  promoCode: '',
  selectedPlan: '',
  coverageOptions: {
    worldwide_fpa: 'NA', // Default to "Yes" - most common case
    building: 'NA', // Default $100,000 (smallest option)
    homeContentCoverageValue: '40000', // Default $30,000 (smallest option)
    renovationCoverageValue: '30000', // Default $10,000 (smallest option)
  },
  addons: [],
  quoteStep: 0,
};

const INITIAL_PERSONAL_INFO: PersonalInfoForm = {
  policyHolderFullName: '',
  policyHolderNricFin: '',
  policyHolderNationality: 'Singaporean',
  policyHolderGender: 'Male',
  policyHolderMaritalStatus: '',
  policyHolderMobileNumber: '',
  policyHolderEmail: '',
  policyHolderDateOfBirth: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  postalCode: '',
  mailingAddressDifferent: 'no',
  mailingAddressLine1: '',
  mailingAddressLine2: '',
  mailingAddressLine3: '',
  mailingPostalCode: '',
  previousInsurerName: '',
  otherInsurerName: '',
  payNowAccountDifferent: 'no',
  payNowAccount: '',
};

const INITIAL_MYINFO_DATA: MyInfoData = {
  isRetrieved: false,
  isLoading: false,
  data: undefined,
};

const INITIAL_PROMO_STATUS: PromoCodeStatus = { status: 'none' };

export {
  INITIAL_FORM_DATA,
  INITIAL_MYINFO_DATA,
  INITIAL_PERSONAL_INFO,
  INITIAL_PROMO_STATUS,
};
//#endregion
