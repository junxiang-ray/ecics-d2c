// src/api/base-services/policy.ts
import type { AxiosResponse } from 'axios';
import { PolicyPayload, PolicyResponse } from '@/libs/types/policy';
import {
  mapRealApiPolicyToPolicy,
  RealApiPolicy,
} from '@/libs/mappers/policy.api.mapper';
import { API_POLICY_GET } from '@/constants/api.constant';

import baseClient from './api.config';

export default {
  async getPolicies<T = PolicyResponse>(
    _payload: PolicyPayload,
  ): Promise<AxiosResponse<T>> {
    /**
     * NOTE:
     * - This calls the EXISTING Next.js API route
     * - Auth, cookies, machine token are handled server-side
     * - No client-side filtering/pagination here
     */

    // 1️⃣ Call Next.js API route (POST)
    const response = await baseClient.post<{
      policies: RealApiPolicy[];
    }>(
      API_POLICY_GET,
      {}, // body currently unused
      {
        withCredentials: true,
      },
    );

    // 2️⃣ Map REAL API → canonical Policy[]
    const mappedResults = response.data.policies.map((item, idx) =>
      mapRealApiPolicyToPolicy(item, idx),
    );

    // 3️⃣ Fabricate summary (same behavior MOCK_DATA provided)
    const summary = {
      total: mappedResults.length,
      active: mappedResults.filter((p) => p.policy_status === 'active').length,
      pending_renewal: mappedResults.filter((p) => p.tags === 'pending_renewal')
        .length,
      expired: mappedResults.filter((p) => p.policy_status === 'expired')
        .length,
      cancelled: mappedResults.filter((p) => p.policy_status === 'cancelled')
        .length,
    };

    // 4️⃣ Return EXACT shape expected by hooks + UI
    return {
      ...response,
      data: {
        data: {
          summary,
          results: mappedResults,
        },
        meta: {
          pagination: {},
        },
      },
    } as AxiosResponse<T>;
  },
};
