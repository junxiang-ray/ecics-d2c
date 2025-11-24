import type { AxiosResponse } from 'axios';
import { PolicyPayload, PolicyResponse } from '@/libs/types/policy';

import { API_POLICY_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getPolicies<T = PolicyResponse>(
    payload: PolicyPayload,
  ): Promise<AxiosResponse<T>> {
    const params = {
      queryStr: payload?.queryStr,
      status: payload?.policyStatus,
      type: payload?.policyType,
      tags: payload?.tags,
      pagination: {
        page: payload.pageNo,
        pageSize: payload.pageSize,
      },
    };

    return baseClient.get<T>(`${API_POLICY_GET}`, { params });
  },
};
