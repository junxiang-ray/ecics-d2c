import type { AxiosResponse } from 'axios';

import {
  PromotionPayload,
  PromotionResponseData,
} from '@/libs/types/promotion';

import { API_PROMOTION_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getPromotions<T = PromotionResponseData>(
    payload: PromotionPayload,
  ): Promise<AxiosResponse<T>> {
    const params = {
      populate: '*',
      sort: payload.sortField
        ? `${payload.sortField}:${payload.sortOrder}`
        : undefined,
      pagination: {
        page: payload.pageNo,
        pageSize: payload.pageSize,
      },
    };

    return baseClient.get<T>(`${API_PROMOTION_GET}`, {
      params,
    });
  },
};
