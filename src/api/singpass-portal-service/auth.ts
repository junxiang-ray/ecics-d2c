import type { AxiosResponse } from 'axios';
import {
  LoginResponse,
  NRICResponse,
  UserInfoPayload,
} from '@/libs/types/auth';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import {
  API_LOGIN,
  API_RETRIVE_NRIC_SINGPASS_PORTAL,
} from '@/constants/api.constant';

import axiosClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestSignInSingpass(): Promise<AxiosResponse<LoginResponse>> {
    return axiosClient.get<LoginResponse>(
      `${API_LOGIN}/${PRODUCT_NAME.PORTAL}`,
    );
  },
  retriveNricSingpass(
    payload: UserInfoPayload,
  ): Promise<AxiosResponse<NRICResponse>> {
    return axiosClient.post<NRICResponse>(
      API_RETRIVE_NRIC_SINGPASS_PORTAL,
      payload,
    );
  },
};
