import type { AxiosResponse } from 'axios';
import {
  Policy,
  PolicyStatus,
  PolicyTag,
  PolicyPayload,
  PolicyResponseData,
  PolicyResponse,
} from '@/libs/types/policy';

import { useQuery } from '@tanstack/react-query';

import policy from '@/api/base-service/policy';

export const usePoliciePreviews = (
  policyStatus?: PolicyStatus,
  policyTags?: PolicyTag[],
) => {
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
    queryFn: fetchPolicies,
    queryKey: ['policy_previews', policyStatus, policyTags],
    enabled: true,
  });
};

export const usePolicies = (params: PolicyPayload | null) => {
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
    queryFn: fetchPolicies,
    queryKey: ['policies', params],
    enabled: !!params,
  });
};
