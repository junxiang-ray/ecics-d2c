import {
  Address,
  MaritalStatus,
  Pagination,
  PaginationMetaData,
} from '@/libs/types/common';
import { Company, AddNamedDriverInfo, Vehicle } from '@/libs/types/quote';
import { MaidInfo, MaidPersonalInfo } from '@/libs/types/maidQuote';

export type PlanCode = 'c' | 'cp' | 'cm' | 'cs' | 'cfncdb' | 'p';

export type PolicyType =
  | 'maid'
  | 'car'
  | 'motorcycle'
  | 'home'
  | 'travel'
  | 'all';

export type PolicyStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export type PolicyTag = 'renewed' | 'pending_renewal' | 'pending';

export type DriverInfo = AddNamedDriverInfo & {
  is_main_driver: boolean;
};

export type Plan = {
  plan_code: PlanCode;
  plan_name: string;
};

export type VehicleInfo = Vehicle & {
  registration_no: string;
  chassis_no: string;
  vehicle_usage: string;
  hire_purchase_company: string;
  company: Company;
};

type ExcessDetail = {
  name: string;
  description?: string;
  amount: number;
};

export type Excess = {
  policy_excess: ExcessDetail[];
  additional_excess: ExcessDetail[];
};

export type PolicyHolder = {
  name: string;
  marital_status: MaritalStatus;
  mobile: string;
  email: string;
  address: Address;
};

type Maid = MaidInfo &
  MaidPersonalInfo & {
    coverage_details: CoverageDetail[];
  };

type SubCoverageDetail = {
  letter: string;
  name: string;
  amount?: number;
  notes?: string;
};

type CoverageDetail = {
  id: number;
  name: string;
  amount?: number;
  notes?: string;
  sub_details?: SubCoverageDetail[];
};

export type Policy = {
  id: number;
  policy_no: string;
  policy_type: PolicyType;
  policy_type_name: string;
  policy_name: string;
  start_date: string;
  end_date: string;
  expire_date: string;
  issue_date: string;
  plan: Plan;
  scheme: string;
  intermediary_name: string;
  premium: number;
  policy_status: PolicyStatus;
  tags?: PolicyTag;
  policy_holder: PolicyHolder;
  maid_info: Maid;
  drivers: DriverInfo[];
  vehicle: VehicleInfo;
  excess: Excess;
};

export type PolicySummary = {
  total: number;
  active: number;
  pending_renewal: number;
  expired: number;
  cancelled: number;
};

export type PolicyPayload = Partial<Pagination> &
  Partial<{
    policyNo: Policy['policy_no'];
    queryStr: string;
    policyStatus: PolicyStatus;
    policyType: PolicyType;
    tags: string;
  }>;

export type PolicyResponseData = {
  data: {
    summary: Record<string, unknown>;
    results: Array<Record<string, unknown>>;
  };
  meta: { pagination: PaginationMetaData };
};

export type PolicyResponse = Pick<PolicyResponseData, 'meta'> & {
  data: {
    summary: PolicySummary;
    results: Policy[];
  };
};
