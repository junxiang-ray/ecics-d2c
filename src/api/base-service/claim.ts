import type { AxiosResponse } from 'axios';
import { ClaimPayload, ClaimResponseData } from '@/libs/types/claim';

import { API_CLAIM_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getClaims<T = ClaimResponseData>(
    payload: ClaimPayload,
  ): Promise<AxiosResponse<T>> {
    const params = {
      claimNo: payload?.claimNo ?? undefined,
      queryStr: payload?.queryStr,
      status: payload?.claimStatus,
      type: payload?.policyType,
      pagination: {
        page: payload.pageNo,
        pageSize: payload.pageSize,
      },
    };

    return baseClient.get<T>(`${API_CLAIM_GET}`, { params });
  },
};
