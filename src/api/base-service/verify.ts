import { API_POST_CHECK_VEHICLE } from '@/constants/api.constant';

import baseClient from './api.config';
interface VerifyPromoCodeData {
  promo_code: string;
  product_type: string;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  verifyPartnerCode(partner_code: string) {
    return baseClient.get<any>('/partner/info/' + partner_code);
  },
  verifyPromoCode(data: VerifyPromoCodeData) {
    return baseClient.post<any>('/promo-code/validation', data);
  },

  postCheckVehicle(payload: { vehicle_make: string; vehicle_model: string }) {
    return baseClient.post<any>(`${API_POST_CHECK_VEHICLE}`, payload);
  },
};
