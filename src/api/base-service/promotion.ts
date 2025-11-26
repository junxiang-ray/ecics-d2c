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
      headers: {
        Authorization:
          'Bearer 01adf500f461b4941905d6fba440f6914ea8ed66a703c1067986530c723aab5f41a0e80330828fc3f5ac4fcf1259afba136fd724982c71775a1e5454105bf7289788a6214dd31abf6c860b66485f7134fc41b0851123f996d1856478a14bbd3d232a4057056bfe4362347d9bd83bd63513e6153f0f617df342a9e4cff581b8ff',
      },
      baseURL: 'https://cms.triceratopdev.com/api',
    });
  },
};
