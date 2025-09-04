import { ProductTypeWeb } from '@/app/api/constants/product';
import {
  API_CHECK_POLICY,
  API_EDIT_RENEWAL,
  API_LOGIN_RENEWAL,
  API_POST_SAVE_POLICY,
  API_RENEWAL_PAYMENT,
  API_RENEWAL_PROCESS_PAYMENT,
  API_RETRIEVE_POLICY,
} from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getRenewalQuoteByKey() {
    return baseClient.get<any>(API_LOGIN_RENEWAL);
  },
  verifyRetrieveRenewal(nric: string) {
    return baseClient.post<any>(API_RETRIEVE_POLICY, { nric });
  },
  checkPolicyRenewal(veh_reg_no: string, passphrase: string) {
    return baseClient.post<any>(API_CHECK_POLICY, { veh_reg_no, passphrase });
  },
  getRenewalPaymentSuccess(key: string) {
    return baseClient.get<any>(API_RENEWAL_PAYMENT, { params: { key } });
  },
  postEditRenewal(productType: ProductTypeWeb, payload: any) {
    return baseClient.post<any>(API_EDIT_RENEWAL(productType), payload);
  },
  postRenewalProcessPayment(productType: ProductTypeWeb, payload: any) {
    return baseClient.post<any>(
      API_RENEWAL_PROCESS_PAYMENT(productType),
      payload,
    );
  },
  postSavePolicy(productType: ProductTypeWeb, payload: any) {
    return baseClient.post<any>(API_POST_SAVE_POLICY(productType), payload);
  },
};
