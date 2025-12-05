import {
  HomeContentQuoteCreationPayload,
  HomeContentResponse,
} from '@/libs/types/homeContents';

import { API_GET_QUOTE_BY_KEY, API_SAVE_QUOTE } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getHomeContentQuoteByKey(key: string) {
    return baseClient.get<HomeContentResponse>(`${API_GET_QUOTE_BY_KEY}` + key);
  },
  generateHomeContentQuote(data: HomeContentQuoteCreationPayload) {
    return baseClient.post<HomeContentResponse>('/b2c_hc/quote', data);
  },
  getProductDetails() {
    return baseClient.post<HomeContentResponse>('/b2c_hc/details');
  },
  getPremiumCalc(data: HomeContentQuoteCreationPayload) {
    return baseClient.post<HomeContentResponse>('/b2c_hc/calc', data);
  },

  saveHomeContentQuote(key: string, data: any, is_sending_email: boolean) {
    const formatData = {
      data: { ...data },
      key: key,
      is_sending_email: is_sending_email,
    };
    return baseClient.post<HomeContentResponse>(
      `${API_SAVE_QUOTE}`,
      formatData,
    );
  },
};
