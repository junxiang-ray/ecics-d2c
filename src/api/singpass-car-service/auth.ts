import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { ProductTypeWeb } from '@/app/api/constants/product';
import { API_GET_USER_INFO, API_LOGIN } from '@/constants/api.constant';

import singpassCarService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLogin(productType: ProductTypeWeb) {
    return singpassCarService.get<LoginResponse>(`${API_LOGIN}/${productType}`);
  },
  postUserInfo({
    payload,
    productType,
  }: {
    payload: UserInfoPayload;
    productType: ProductTypeWeb;
  }) {
    return singpassCarService.post<any>(
      `${API_GET_USER_INFO}/${productType}`,
      payload,
    );
  },
};
