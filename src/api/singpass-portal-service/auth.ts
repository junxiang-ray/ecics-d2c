// src\api\singpass-portal-service\auth.ts
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
    // console.log("ENV VALUE:", process.env.NEXT_PUBLIC_MOCK_SINGPASS);
    // console.log("TYPE:", typeof process.env.NEXT_PUBLIC_MOCK_SINGPASS);

    // const isMockSingpass = process.env.NEXT_PUBLIC_MOCK_SINGPASS === 'true';
    // console.log("IS MOCK?", isMockSingpass);
    // console.log("LOGGED DATA ====================== ",process.env.NEXT_PUBLIC_MOCK_SINGPASS)

    // if (isMockSingpass) {
    //   return Promise.resolve({
    //     data: {
    //       message: 'MOCK_SINGPASS',
    //       data: {
    //         url: '/portal/singpass/mock-callback',
    //         state: 'mock_state',
    //         nonce: 'mock_nonce',
    //         code_verifier: 'mock_code_verifier',
    //       },
    //     },
    //   } as AxiosResponse<LoginResponse>);
    // }
    return axiosClient.get<LoginResponse>(
      `${API_LOGIN}/${PRODUCT_NAME.PORTAL}`,
    );
  },

  retriveNricSingpass(
    payload: UserInfoPayload,
  ): Promise<AxiosResponse<NRICResponse>> {
    console.log('🔧 [auth.ts] retriveNricSingpass called');
    console.log('📤 [auth.ts] Payload:', payload);
    console.log('🌐 [auth.ts] API endpoint:', API_RETRIVE_NRIC_SINGPASS_PORTAL);

    return axiosClient.post<NRICResponse>(
      API_RETRIVE_NRIC_SINGPASS_PORTAL,
      payload,
    );
  },
};
