import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { ProductTypeWeb } from '@/app/api/constants/product';
import { API_GET_USER_INFO, API_LOGIN } from '@/constants/api.constant';

import singpassHomeContentService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLoginHomeContent(productType: ProductTypeWeb) {
    return singpassHomeContentService.get<LoginResponse>(
      `${API_LOGIN}/${productType}`,
    );
  },
  postUserInfoHomeContent({
    payload,
    productType,
  }: {
    payload: UserInfoPayload;
    productType: ProductTypeWeb;
  }) {
    return singpassHomeContentService.post<any>(
      `${API_GET_USER_INFO}/${productType}`,
      payload,
    );
  },
};
