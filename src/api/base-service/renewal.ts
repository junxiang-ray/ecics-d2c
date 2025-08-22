import { API_LOGIN_RENEWAL } from '@/constants/api.constant';
import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getRenewaluoteByKey() {
    return baseClient.get<any>(`${API_LOGIN_RENEWAL}`);
  },
};
