import {
  API_CHECK_POLICY,
  API_LOGIN_RENEWAL,
  API_RENEWAL_PAYMENT,
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
  signInRenewal(veh_reg_no: string, passphrase: string) {
    return baseClient.post<any>(API_CHECK_POLICY, { veh_reg_no, passphrase });
  },
  getRenewalPaymentSuccess(key: string) {
    return baseClient.get<any>(API_RENEWAL_PAYMENT, { params: { key } });
  },
};
