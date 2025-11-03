// Base types for form data
export interface QuoteForm {
  ownership: string;
  homeType: string;
  unitType: string;
  policyStartDate: string;
  promoCode: string;
  // selectedPlan?: string;
}

export const QUOTE_FORM_KEYS: (keyof QuoteForm)[] = [
  'ownership',
  'homeType',
  'unitType',
  'policyStartDate',
  'promoCode',
  // 'selectedPlan',
];

export interface PersonalInfoForm {
  policyHolderFullName: string;
  policyHolderNricFin: string;
  policyHolderNationality: string;
  policyHolderMobileNumber: string;
  policyHolderEmail: string;
  policyHolderDateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postalCode: string;
  mailingAddressDifferent: 'yes' | 'no';
  mailingAddressLine1: string;
  mailingAddressLine2: string;
  mailingAddressLine3: string;
  mailingPostalCode: string;
  previousInsurerName: string;
  otherInsurerName: string;
}

// MyInfo integration
export interface MyInfoData {
  isRetrieved: boolean;
  isLoading: boolean;
  data?: Partial<PersonalInfoForm>;
}

// Insurance plans and add-ons
export interface Coverage {
  contents: number;
  personalAccident: number;
  personalLiability: number;
  alternativeAccommodation: number;
  lossOfRent: number;
  tenantLiability: number;
}

export interface InsurancePlan {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  coverage: Coverage;
  features: string[];
  isPopular?: boolean;
  highlights?: string[];
}

export interface AddOnOption {
  value: string;
  label: string;
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  details?: string;
  hasOptions?: boolean;
  options?: AddOnOption[];
  iconName?: string;
  popular?: boolean;
  savings?: string;
}

export interface SelectedAddOn {
  id: string;
  selectedOption?: string;
}

// Promo codes
export interface PromoCodeStatus {
  status: 'none' | 'applying' | 'applied' | 'invalid';
  code?: string;
  discount?: number;
  message?: string;
}

// Step indicator
export interface StepInfo {
  step: number;
  title: string;
  description: string;
}

export interface StepIndicatorProps {
  currentStep: number;
  visitedSteps: Set<number>;
  selectedPlan: string;
  onStepClick: (step: number) => void;
}

// Age limits
export interface AgeLimit {
  min: number;
  max: number;
}

// Ownership types
export interface OwnershipType {
  value: 'owner' | 'landlord' | 'tenant';
  label: string;
  description?: string;
}

// Home types
export interface HomeType {
  value: 'landed' | 'hdb' | 'condo';
  label: string;
  description?: string;
}

// Unit types
export interface UnitType {
  value: string;
  label: string;
  homeTypes: string[];
}

// Policy durations
export interface PolicyDuration {
  value: string;
  label: string;
  months: number;
}

// Customization types
export interface CoverageOption {
  value: string;
  label: string;
  amount: number;
}

export interface CustomizationData {
  hdbFireInsurance: 'yes' | 'no' | '';
  building: string;
  homeContent: string;
  renovation: string;
}

///ENDPOINTS
export interface HomeContentResponse {
  message: string;
  data: any;
}

export interface HomeContentQuoteCreationPayload {
  key: string;
  homeType: string;
  homeOwnership: string;
  unitType: string;
  StartDate: string;
  promoCode: string;
  redirectUrl: string;
  returnUrl: string;
}

export interface HomeContentQuote {
  status: number;
  txt: string;
  data: HomeContentQuoteData;
}

export interface HomeContentQuoteData {
  quoteId: string;
  proposalId: string;
  plan: HomeContentPlan[];
  coverageOptions: HomeContentsCoverage[];
  availableOptionalBenefit?: HomeContentAvailableOptionalBenefit[];
}

export interface HomeContentPlan {
  id: string;
  name: string;
  premiumBeforeGst: number;
}

export interface HomeContentsCoverage {
  id: string;
  name: string;
  applicableWhen?: HomeContentsApplicableWhen;
  options: HomeContentsCoverageOptions[];
}

export interface HomeContentsApplicableWhen {
  hasHDBFireInsurance: boolean;
}

export interface HomeContentsCoverageOptions {
  amount: number;
  label: string;
  premium: number;
}

export interface HomeContentAvailableOptionalBenefit {
  id: string;
  name: string;
  label: string;
  sublabel: string;
  subOptions?: HomeContentOptionalBenefitSubOptions[] | [];
  prem?: number | null;
}

export interface HomeContentOptionalBenefitSubOptions {
  amount: number;
  label: string;
  prem: number;
}
