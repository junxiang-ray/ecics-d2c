// Base types for form data
export interface QuoteForm {
  ownership: string;
  homeType: string;
  unitType: string;
  policyStartDate: string;
  promoCode: string;
  //Selecting of plan
  selectedPlan: string;
  // Coverage
  coverageOptions: CustomizationData;
  // Addons
  addons: SelectedAddOn[];
  quoteStep: number;
}

export interface PersonalInfoForm {
  policyHolderFullName: string;
  policyHolderNricFin: string;
  policyHolderNationality: string;
  policyHolderGender: string;
  policyHolderMaritalStatus: string;
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
  payNowAccountDifferent: 'yes' | 'no';
  payNowAccount: string;
}

export interface backendValidation {
  invalidNRIC: boolean;
}

// MyInfo integration
export interface MyInfoData {
  isRetrieved: boolean;
  isLoading: boolean;
  data?: Partial<PersonalInfoForm>;
}

// Insurance plans and add-ons
export interface Coverage {
  renovations: string;
  renovationsFixturesDebris: string;
  renovationsProfessionalFees: string;
  contents: string;
  contentsValuables: string;
  contentsCash: string;
  alternativeAccommodation: string;
  incidentalExpensesOrEmergencyCashAllowance: string;
  accidentalBreakageOfMirrorOrFixedGlass: string;
  petDogOrCatCover: string;
  accidentalDamageOfEVCharger: string;
  accidentalDamageOfSolarPanels: string;
  emergencyHomeAssistance: string;
  tenantsLiability: string;
  lossOfRentalAfterInsuredEvent: string;
  buildingCoverage: string;
  personalWorldwideFPA: string;
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
  totalPricePlanB4GST: number;
  totalPricePlan: number;
  // Add building and worldwide FPA costs
  buildingCoverageNoDiscount?: number;
  worldwideFpaNoDiscount?: number;
  buildingCoverageWithDiscount?: number;
  worldwideFpaWithDiscount?: number;
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
  hasList?: boolean;
  options?: AddOnOption[];
  iconName?: string;
  popular?: boolean;
  savings?: string;
}

export interface SelectedAddOn {
  id: string;
  selectedOption?: string;
  price: number;
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
  value: 'Owner' | 'Landlord' | 'Tenant';
  label: string;
  description?: string;
}

// Home types
export interface HomeType {
  value: 'Landed Property' | 'HDB' | 'Condo/Executive Condo';
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
  worldwide_fpa: string;
  building: string;
  homeContentCoverageValue: string;
  renovationCoverageValue: string;
}

///ENDPOIN
export interface HomeContentResponse {
  status: string;
  message: string;
  data: any;
}

// Mapping of input IDs for Home Contents product
export interface HomeContentResultMap {
  property_type_input_id: string;
  ownership_input_id: string;
  unit_type_input_id: string;
  policy_start_date_input_id: string;
  policy_period_input_id: string;
  promo_code_input_id: string;
  renovations_si_input_id: string;
  contents_si_input_id: string;
  building_si_input_id: string;
  selected_plan_input_id: string;
}

// OLD
// export interface HomeContentQuoteCreationPayload {
//   key: string;
//   homeType: string;
//   homeOwnership: string;
//   unitType: string;
//   homeContents: string;
//   renovations: string;
//   startDate: string;
//   promoCode: string;
//   redirectUrl: string;
//   returnUrl: string;
// }

// NEW
export interface HomeContentQuoteCreationPayload {
  key: string;
  homeType: string;
  homeOwnership: string;
  unitType: string;
  homeContents: string;
  renovations: string;
  startDate: string;
  promoCode: string;
  redirectUrl: string;
  returnUrl: string;
  building?: string;
  worldwideFpa?: string;
  resultMap?: HomeContentResultMap;
}

//Save Quote
export interface HomeContentQuoteSavePayload {
  key: string;
  proposerDetails: HomeContentProposerDetailsMap;
  planDetails: HomeContentPlanDetailsMap;
  __finalize: number;
}

interface HomeContentProposerDetailsMap {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postCode: string;
  name: string;
  nric: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  mobile: string;
  email: string;
  differentMailingAddress: string;
  mailingAddress1: string;
  mailingAddress2: string;
  mailingAddress3: string;
  mailingPostCode: string;
}

interface HomeContentPlanDetailsMap {
  homeOwnership: string;
  homeType: string;
  unitType: string;
  homeContentCoverage: string;
  renovationsCoverage: string;
  buildingCoverage: string;
  wpaCoverage: string;
  policyPeriod: string;
  promoCode: string;
  selectedPlan: string;
  startDate: string;
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
