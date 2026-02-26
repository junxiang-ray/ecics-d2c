// src/hook/policy/usePolicyData.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation'; // ⭐ Add this
import { useAuth } from '@/hook/auth/useAuth';
import { Policy, PolicyStatus, PolicyTag } from '@/libs/types/policy';
import policy from '@/api/base-service/policy';

interface UsePolicyDataOptions {
  policyStatus?: PolicyStatus;
  tags?: PolicyTag[];
  limit?: number;
  readFromUrl?: boolean; // ⭐ New flag
}

export function usePolicyData(options?: UsePolicyDataOptions) {
  const { auth, initialized } = useAuth();
  const searchParams = useSearchParams(); // ⭐ Read URL here

  const {
    policyStatus: propStatus,
    tags: propTags,
    limit,
    readFromUrl,
  } = options || {};

  // ⭐ Read from URL if flag is set, otherwise use props
  const policyStatus = readFromUrl
    ? (searchParams.get('status') as PolicyStatus) || undefined
    : propStatus;

  const tags = readFromUrl
    ? searchParams.get('tags')
      ? [searchParams.get('tags') as PolicyTag]
      : undefined
    : propTags;

  return useQuery<Policy[]>({
    // ⭐ Include filters in query key
    queryKey: [
      'policies',
      'list',
      auth?.nric,
      policyStatus,
      tags?.join(','),
      readFromUrl,
    ],

    queryFn: async (): Promise<Policy[]> => {
      const response = await policy.getPolicies({});
      let policies = response.data.data?.results || [];

      if (policyStatus) {
        policies = policies.filter((p) => p.policy_status === policyStatus);
      }
      if (tags?.length) {
        policies = policies.filter((p) => tags.some((tag) => tag === p.tags));
      }
      if (limit) {
        policies = policies.slice(0, limit);
      }

      return policies;
    },

    enabled: !!auth?.nric && initialized,
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}

export function usePolicyDetail(policyNo: string | null) {
  const { data: allPolicies, isLoading, error } = usePolicyData();
  const policy = allPolicies?.find((p) => p.policy_no === policyNo);

  return {
    data: policy || null,
    isLoading,
    error: policy ? null : error || new Error('Policy not found'),
  };
}
