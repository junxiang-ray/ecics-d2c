import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { ProductTypeWeb } from '@/app/api/constants/product';
import { API_GET_USER_INFO, API_LOGIN } from '@/constants/api.constant';
import singpassRenewalService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLoginRenewal(productType: ProductTypeWeb) {
    return singpassRenewalService.get<LoginResponse>(
      `${API_LOGIN}/${productType}`,
    );
  },
  postUserInfoRenewal({
    payload,
    productType,
  }: {
    payload: UserInfoPayload;
    productType: ProductTypeWeb;
  }) {
    return singpassRenewalService.post<any>(
      `${API_GET_USER_INFO}/${productType}`,
      payload,
    );
  },
};
