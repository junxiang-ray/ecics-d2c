import { ProductTypeWeb } from '@/app/api/constants/product';
import { API_EDIT_RENEWAL, API_LOGIN_RENEWAL } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getRenewaluoteByKey() {
    return baseClient.get<any>(`${API_LOGIN_RENEWAL}`);
  },
  postEditRenewal(productType: ProductTypeWeb, payload: any) {
    return baseClient.post<any>(API_EDIT_RENEWAL(productType), payload);
  },
};
