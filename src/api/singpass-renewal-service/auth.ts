import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import { ProductTypeWeb } from '@/app/api/constants/product';
import {
  API_LOGIN,
  API_RETRIVE_NRIC_SINGPASS_RENEWAL,
} from '@/constants/api.constant';

import singpassRenewalService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestSignInSingpass(productType: ProductTypeWeb) {
    return singpassRenewalService.get<LoginResponse>(
      `${API_LOGIN}/${productType}`,
    );
  },

  retriveNricSingpass({ payload }: { payload: UserInfoPayload }) {
    return singpassRenewalService.post<any>(
      API_RETRIVE_NRIC_SINGPASS_RENEWAL,
      payload,
    );
  },
};
