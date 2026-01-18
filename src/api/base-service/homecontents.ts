import {
  HomeContentQuoteCreationPayload,
  HomeContentQuoteSavePayload,
  HomeContentResponse,
} from '@/libs/types/homeContents';

import {
  API_GET_QUOTE_BY_KEY,
  API_POST_PAYMENT,
  API_SAVE_QUOTE,
} from '@/constants/api.constant';

import baseClient from './api.config';
import logger from '@/app/api/libs/logger';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getHomeContentQuoteByKey(key: string) {
    return baseClient.get<HomeContentResponse>(`${API_GET_QUOTE_BY_KEY}` + key);
  },
  generateHomeContentQuote(data: HomeContentQuoteSavePayload) {
    return baseClient.post<HomeContentResponse>('/b2c_hc/quote', data); //TRIGGER FOR THE BACKEND CALL
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
  payment(data: { key: string; product_type: string }) {
    return baseClient.post<any>(`${API_POST_PAYMENT}`, data);
  },
};
