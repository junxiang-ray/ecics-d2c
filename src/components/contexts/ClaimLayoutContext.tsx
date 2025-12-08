'use client';

import { PolicyType } from '@/libs/types/policy';
import { Claim, ClaimStatus, ClaimSummary } from '@/libs/types/claim';

import { createContext, useContext } from 'react';

export const QUERY_KEY = {
  CLAIM_NO: 'no',
  CLAIM_STATUS: 'status',
  POLICY_TYPE: 'type',
  SEARCH_QUERY: 'search_query',
} as const;

export type QueryKeys = (typeof QUERY_KEY)[keyof typeof QUERY_KEY];
export type QueryValues = ClaimStatus | PolicyType | '';
export type ClaimNo = Claim['claim_no'];

export type ContextValues = {
  loading: boolean;
  selPolicyType: PolicyType;
  searchQuery: string;
  claims: Claim[];
  summary: ClaimSummary;
  claimDetail: Claim | null;
  pushQuery: (
    queryParams: { key: QueryKeys; value?: QueryValues }[],
    path?: string,
  ) => void;
};

export const ClaimContext = createContext<ContextValues>({} as ContextValues);

export const useClaimContext = () => {
  const context = useContext(ClaimContext);

  if (!context)
    throw new Error('useClaimContext must be used within an ClaimProvider');

  return context;
};
