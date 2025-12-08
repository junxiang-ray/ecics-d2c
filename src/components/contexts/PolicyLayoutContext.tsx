'use client';

import {
  Policy,
  PolicyStatus,
  PolicySummary,
  PolicyTag,
  PolicyType,
} from '@/libs/types/policy';

import { createContext, useContext } from 'react';

export const QUERY_KEY = {
  POLICY_NO: 'no',
  POLICY_TYPE: 'type',
  POLICY_STATUS: 'status',
  POLICY_TAGS: 'tags',
  SEARCH_QUERY: 'search_query',
} as const;

export type QueryKeys = (typeof QUERY_KEY)[keyof typeof QUERY_KEY];
export type QueryValues = PolicyStatus | PolicyType | PolicyTag | '';
export type PolicyNo = Policy['policy_no'];

export type ContextValues = {
  loading: boolean;
  selPolicyType: PolicyType;
  searchQuery: string;
  policies: Policy[];
  summary: PolicySummary;
  policyDetail: Policy;
  pushQuery: (
    queryParams: { key: QueryKeys; value?: QueryValues }[],
    path?: string,
  ) => void;
};

export const PolicyContext = createContext<ContextValues>({} as ContextValues);

export const usePolicyContext = () => {
  const context = useContext(PolicyContext);
  if (!context)
    throw new Error('usePolicyContext must be used within an PolicyProvider');

  return context;
};
