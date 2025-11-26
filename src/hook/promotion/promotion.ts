import type { AxiosResponse } from 'axios';

import {
  Promotion,
  PromotionResponse,
  PromotionResponseData,
} from '@/libs/types/promotion';

import { useQuery } from '@tanstack/react-query';
import promotion from '@/api/base-service/promotion';

export const usePromotions = () => {
  const fetchPromotion = async (): Promise<PromotionResponse> => {
    try {
      const resp: AxiosResponse<PromotionResponseData> =
        await promotion.getPromotions({
          sortField: 'publishedAt',
          sortOrder: 'desc',
          pageNo: 1,
          pageSize: 6,
        });

      return resp?.data as unknown as PromotionResponse;
    } catch (e) {
      return {
        meta: {},
        data: null,
      } as unknown as PromotionResponse;
    }
  };

  return useQuery({
    queryFn: fetchPromotion,
    queryKey: ['promotions'],
    enabled: true,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
