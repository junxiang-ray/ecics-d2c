import type { AxiosResponse } from 'axios';

import {
  ClaimPayload,
  ClaimResponse,
  ClaimResponseData,
} from '@/libs/types/claim';

import { useQuery } from '@tanstack/react-query';

import claim from '@/api/base-service/claim';

export const useClaims = (params: ClaimPayload | null) => {
  const fetchClaims = async (): Promise<ClaimResponse> => {
    try {
      const resp: AxiosResponse<ClaimResponseData> = await claim.getClaims(
        params as unknown as ClaimPayload,
      );

      return resp?.data as unknown as ClaimResponse;
    } catch (e) {
      return {
        meta: {},
        data: null,
      } as unknown as ClaimResponse;
    }
  };

  return useQuery({
    queryFn: fetchClaims,
    queryKey: ['claims', params],
    enabled: !!params,
  });
};
