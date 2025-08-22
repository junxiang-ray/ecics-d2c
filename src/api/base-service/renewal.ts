import {
  API_LOGIN_RENEWAL,
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
};
