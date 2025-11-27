import { Address, Pagination, PaginationMetaData } from '@/libs/types/common';
import { Policy, PolicyType } from '@/libs/types/policy';

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'processing'
  | 'approved'
  | 'settled'
  | 'rejected';
export type ClaimProgress =
  | 'submitted'
  | 'initial_review'
  | 'in_review'
  | 'decision'
  | 'settlement';

export type Claim = {
  claim_no: string;
  policy: Policy;
  status: ClaimStatus;
  progress: ClaimProgress;
  amount: number;
  last_update: string;
  incident_date: string;
  estimate_settlement: string;
  address: Address;
  description: string;
  short_description: string;
};

export type ClaimSummary = {
  total: number;
  draft: number;
  processing: number;
  approved: number;
  settled: number;
  rejected: number;
};

export type ClaimPayload = Partial<Pagination> &
  Partial<{
    claimNo: Claim['claim_no'];
    queryStr: string;
    claimStatus: ClaimStatus;
    policyType: PolicyType;
  }>;

export type ClaimResponseData = {
  data: {
    summary: Record<string, unknown>;
    results: Array<Record<string, unknown>>;
  };
  meta: { pagination: PaginationMetaData };
};

export type ClaimResponse = Pick<ClaimResponseData, 'meta'> & {
  data: {
    summary: ClaimSummary;
    results: Claim[];
  };
};
