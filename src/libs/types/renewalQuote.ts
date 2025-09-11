interface VehicleDetails {
  reg_no: string;
  'make/model': string;
  make: string;
  model: string;
  first_reg_on: string;
  hire_purchase: string;
  model_type: string;
}

interface ClaimNcdDetails {
  no_of_claims: string;
  claim_incurred: string;
  current_ncd: string;
  renewal_ncd: string;
}

interface NamedDriver {
  name: string;
  icno: string;
  dob: string;
  martial_status: string;
  driv_exp: string;
  gender: string;
}

export interface PolicyDetails {
  current_policy_no: string;
  current_policy_expiry_date: string;
  agency: string;
  coverage: string;
  sum_insured: string;
  vehicle_details: VehicleDetails;
  claim_ncd_details: ClaimNcdDetails;
  named_drivers: NamedDriver[];
  dob: string;
}

interface Address {
  address_line1: string;
  address_line2: string;
  address_line3: string;
  postal: string;
}

interface InsuredInfo {
  name: string;
  nric: string;
  dob: string;
  gender: string;
  marital_status: string;
  driv_exp: string;
  address: Address;
  email: string;
  contact_no: string;
}

interface PolicyExcessItem {
  title: string;
  value: string;
}

interface RenewalExcess {
  policy_excess: PolicyExcessItem[];
  additional_excess: PolicyExcessItem[];
}

interface OptionalBenefit {
  id: number;
  name: string;
  description?: string;
  code?: string;
  sub_option?: string;
  prem?: string;
}

interface SubOption {
  id: number;
  name: string;
  prem: string;
}

interface AddOnOptionalBenefit {
  id: number;
  name: string;
  prem?: string;
  description?: string;
  sub_options?: SubOption[];
}

export interface PolicyOptionalBenefit {
  id: number;
  name: string;
  sub_option?: string;
  description?: string;
  prem: string;
  isIncluded: boolean;
}

export interface RenewalInfo {
  policy_details: PolicyDetails;
  renewal_start_date: string;
  renewal_end_date: string;
  insured_info: InsuredInfo;
  date_extracted: string;
  scheme: string;
  renewal_excess: RenewalExcess;
  optional_benefits: OptionalBenefit[];
  policy_optional_benefits?: PolicyOptionalBenefit[];
  renewalplanprem: string;
  renewalpremb4gst: string;
  renewalgst: string;
  renewalpremwgst: string;
  selected_add_on_optional_benefits?: SelectedAddon[];
  selectedAddons?: SelectedAddon[];
  coverage?: string;
}

export interface RenewalQuote {
  policy_id: string;
  quote_id: string;
  proposal_id: string;
  edit_renewal: boolean;
  renewal_info: RenewalInfo;
  add_on_optional_benefits: AddOnOptionalBenefit[];
  name: {
    value: string;
  };
  uinfin: {
    value: string;
  };
  token?: string;
}

export interface SelectedAddon {
  id: number;
  name: string;
  prem?: number;
  sub_options: {
    id: number;
    name: string;
    prem: number;
  }[];
}
