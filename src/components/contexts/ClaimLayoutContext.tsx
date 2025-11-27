'use client';

import { PolicyType } from '@/libs/types/policy';
import { Claim, ClaimStatus, ClaimSummary } from '@/libs/types/claim';

import { createContext, useContext } from 'react';

export type QueryKeys = 'no' | 'status' | 'type' | 'query';
export type QueryValues = ClaimStatus | PolicyType | '';
export type ClaimNo = Claim['claim_no'];

interface Props {
  children: React.ReactNode;
}

export type ContextValues = {
  loading: boolean;
  selPolicyType: PolicyType;
  claims: Claim[];
  summary: ClaimSummary;
  claimDetail: Claim | null;
  pushQuery: (
    queryParams: { key: QueryKeys; value?: QueryValues }[],
    path?: string,
  ) => void;
};

export const ClaimContext = createContext<ContextValues>({} as ContextValues);

export const useClaim = () => {
  const context = useContext(ClaimContext);

  if (!context)
    throw new Error('useClaimContext must be used within an ClaimProvider');

  return context;
};
