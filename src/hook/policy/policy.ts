// src/hook/policy/policy.ts
import type { AxiosResponse } from 'axios';
import {
  Policy,
  PolicyStatus,
  PolicyTag,
  PolicyPayload,
  PolicyResponseData,
  PolicyResponse,
} from '@/libs/types/policy';

import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import policy from '@/api/base-service/policy';

export const usePoliciePreviews = (
  policyStatus?: PolicyStatus,
  policyTags?: PolicyTag[],
) => {
  console.log('🔍 usePoliciePreviews called', { policyStatus, policyTags });

  // Stable query key from primitives
  const queryKey = useMemo(() => {
    return ['policy_previews', policyStatus, policyTags?.join(',') || 'all'];
  }, [policyStatus, policyTags]);

  const fetchPolicies = async (): Promise<PolicyResponse> => {
    try {
      const resp: AxiosResponse<PolicyResponseData> = await policy.getPolicies({
        policyStatus: policyStatus,
        tags: policyTags?.join(','),
        pageNo: 1,
        pageSize: 3,
      });

      return resp?.data as unknown as PolicyResponse;
    } catch (e) {
      return {
        meta: {},
        data: null,
      } as unknown as PolicyResponse;
    }
  };

  return useQuery({
    queryKey,
    queryFn: fetchPolicies,
    enabled: true,
    staleTime: 5 * 60 * 1000,      // 5 minutes — use cached data
    gcTime: 10 * 60 * 1000,        // 10 minutes — keep in memory
    refetchOnWindowFocus: false,   // Don't refetch when switching tabs
    refetchOnMount: false,         // Don't refetch on remount if data exists
  });
};

export const usePolicies = (params: PolicyPayload | null) => {
  // Stable query key — only policyNo affects API response
  const queryKey = useMemo(() => {
    return ['policies', 'list'];  // Always use 'list' for caching
  }, []);

  const fetchPolicies = async (): Promise<PolicyResponse> => {
    try {
      const resp: AxiosResponse<PolicyResponse> = await policy.getPolicies(
        params as unknown as PolicyPayload,
      );

      return resp?.data as unknown as PolicyResponse;
    } catch (e) {
      return {
        meta: {},
        data: null,
      } as unknown as PolicyResponse;
    }
  };

  return useQuery({
    queryKey,
    queryFn: fetchPolicies,
    enabled: !!params,
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 10 * 60 * 1000,        // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// ⭐ NEW: Get single policy with initial data from list cache
// src/hook/policy/policy.ts
export const usePolicyDetail = (policyNo: string | null) => {
  const queryClient = useQueryClient();

  // ⭐ Check if we have it in list cache BEFORE enabling the query
  const listData = queryClient.getQueryData<PolicyResponse>(['policies', 'list']);
  const cachedPolicy = listData?.data?.results?.find(p => p.policy_no === policyNo);
  
  console.log('🔍 usePolicyDetail check:', { 
    policyNo, 
    hasListCache: !!listData,
    foundInCache: !!cachedPolicy 
  });

  return useQuery({
    queryKey: ['policy', 'detail', policyNo],
    queryFn: async () => {
      console.log('🌐 Fetching policy detail from API:', policyNo);
      const resp = await policy.getPolicies({ policyNo } as PolicyPayload);
      return resp?.data?.data?.results?.[0] || null;
    },
    // ⭐ Only enable if NOT in cache (prevents API call)
    enabled: !!policyNo && !cachedPolicy,
    // ⭐ Use cached data as initial
    initialData: cachedPolicy,
    staleTime: 5 * 60 * 1000,
  });
};