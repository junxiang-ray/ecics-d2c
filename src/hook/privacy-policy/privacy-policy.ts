import type { AxiosResponse } from 'axios';
import {
  PrivacyPolicyResponse,
  PrivacyPolicyResponseData,
} from '@/libs/types/privacy-policy';

import { useQuery } from '@tanstack/react-query';

import privacyPolicy from '@/api/base-service/privacy-policy';

export const usePrivacyPolicies = () => {
  const fetchPrivacyPolicies = async (): Promise<PrivacyPolicyResponse> => {
    try {
      const resp: AxiosResponse<PrivacyPolicyResponseData> =
        await privacyPolicy.getPrivacyPolicies();
      return resp?.data as unknown as PrivacyPolicyResponse;
    } catch (e) {
      return {
        meta: {},
        data: null,
      } as unknown as PrivacyPolicyResponse;
    }
  };

  return useQuery({
    queryFn: fetchPrivacyPolicies,
    queryKey: ['privacy_policies'],
    enabled: true,
  });
};
