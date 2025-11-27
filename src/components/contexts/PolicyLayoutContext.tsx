'use client';

import {
  Policy,
  PolicyStatus,
  PolicySummary,
  PolicyTag,
  PolicyType,
} from '@/libs/types/policy';

import { createContext, useContext } from 'react';

export type QueryKeys = 'no' | 'status' | 'type' | 'tags' | 'query';
export type QueryValues = PolicyStatus | PolicyType | PolicyTag | '';
export type PolicyNo = Policy['policy_no'];

interface Props {
  children: React.ReactNode;
}

export type ContextValues = {
  loading: boolean;
  selPolicyType: PolicyType;
  policies: Policy[];
  summary: PolicySummary;
  policyDetail: Policy;
  pushQuery: (
    queryParams: { key: QueryKeys; value?: QueryValues }[],
    path?: string,
  ) => void;
};

export const PolicyContext = createContext<ContextValues>({} as ContextValues);

export const useInsurance = () => {
  const context = useContext(PolicyContext);
  if (!context)
    throw new Error('usePolicyContext must be used within an PolicyProvider');

  return context;
};
