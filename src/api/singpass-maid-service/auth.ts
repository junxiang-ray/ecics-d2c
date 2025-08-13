import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { ProductTypeWeb } from '@/app/api/constants/product';
import { API_GET_USER_INFO, API_LOGIN } from '@/constants/api.constant';

import singpassMaidService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLoginMaid(productType: ProductTypeWeb) {
    return singpassMaidService.get<LoginResponse>(
      `${API_LOGIN}/${productType}`,
    );
  },
  postUserInfoMaid({
    payload,
    productType,
  }: {
    payload: UserInfoPayload;
    productType: ProductTypeWeb;
  }) {
    return singpassMaidService.post<any>(
      `${API_GET_USER_INFO}/${productType}`,
      payload,
    );
  },
};
