import type { AxiosResponse } from 'axios';

import { PrivacyPolicyResponseData } from '@/libs/types/privacy-policy';

import { API_PRIVACY_POLICY_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getPrivacyPolicies<T = PrivacyPolicyResponseData>(): Promise<
    AxiosResponse<T>
  > {
    return baseClient.get<T>(`${API_PRIVACY_POLICY_GET}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_CMS_TOKEN}`,
      },
      baseURL: process.env.NEXT_PUBLIC_API_CMS_BASE_URL,
    });
  },
};
