export interface QuoteResponse {
  message: string;
  data: Quote;
}
export interface Quote {
  id: number;
  quote_id: string;
  quote_no: string;
  policy_id: string;
  product_id: string;
  proposal_id: string;
  phone: string;
  email: string;
  name: string;
  data: QuoteData;
  partner_code: string;
  is_finalized: boolean;
  is_paid: boolean;
  is_sending_email: boolean;
  expiration_date: string; // ISO string date
  key: string;
  created_at: string; // ISO string date
  update_at: string; // ISO string date
  personal_info_id: string | null;
  company_id: number;
  payment_result_id: string | null;
  country_nationality_id: string | null;
  product_type_id: string | null;
  promo_code_id: string | null;
  promo_code: PromoCode | null;
  company: Company;
  country_nationality: any;
  product_type: any;
}
export interface Company {
  id: number;
  name: string;
}
export interface QuoteData {
  plans: Plan[];
  vehicles: Vehicle[];
  personal_info: PersonalInfo;
  vehicle_info_selected: Vehicle;
  insurance_additional_info: InsuranceAdditionalInfo;
}

export interface Plan {
  id: number;
  code: string;
  title: string;
  addons: Addon[];
  key_map: string;
  benefits: Benefit[]; // Benefits array is empty in the sample; adjust if needed.
  sub_title: string | null;
  created_at: string;
  updated_at: string;
  subtitle?: string;
  product_type: ProductType;
  is_recommended: boolean;
  premium_bef_gst: number;
  premium_with_gst: number;
}
export interface Benefit {
  id: number;
  name: string;
  is_active: boolean;
  order: number;
}
export interface Vehicle {
  vehicle_make: string;
  chasis_number: string;
  vehicle_model: string;
  first_registered_year: string;
}

export interface InsuranceAdditionalInfo {
  end_date: string;
  start_date: string;
  no_of_claim: number;
  no_claim_discount: number;
}
export interface PersonalInfo {
  name: string;
  nric: string;
  email: string;
  gender: string;
  address: string;
  phone: string;
  date_of_birth: string;
  marital_status: string;
  driving_experience: number;
}
export interface ProductType {
  id: number;
  name: string;
}
export interface QuoteCreationPayload {
  key: string;
  partner_code: string;
  promo_code: string;
  company_id: number;
  personal_info: PersonalPayload;
  vehicle_info_selected: Vehicle;
  insurance_additional_info: InsuranceAdditionalInfo;
}

export interface QuoteInfo {
  product_id: string;
  policy_id: string;
  quote_no: string;
  proposal_id: string;
  quote_expiry_date: string;
  key: string;
  partner_code: string;
  partner_name: string;
  promo_code: string;
}

export interface Benefit {
  name: string;
  is_active: boolean;
}

export interface Condition {
  addon_id: string;
  value: boolean;
}

export interface Dependency {
  conditions: Condition[];
  premium_with_gst: number;
  premium_bef_gst: number;
}

export interface Option {
  id: string;
  label: string;
  description: string;
  value: string;
  dependencies: Dependency[];
  premium_with_gst: number;
  premium_bef_gst: number;
}

export interface Addon {
  id: string;
  title: string;
  type: 'with_options' | 'without_options';
  is_display: boolean;
  is_recommended: boolean;
  description: string;
  default_option_id: string | null;
  depends_on?: string[];
  options: Option[];
}

export interface PersonalPayload {
  name?: string;
  gender?: string;
  maritalStatus?: string;
  date_of_birth?: string;
  nric?: string;
  address?: string;
  driving_experience: number;
  phone: string;
  email: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  startTime: string;
  endTime: string;
  description: string;
  products: string[];
  isPublic: boolean;
  isShowCountdown: boolean;
  is_valid: boolean;
}
