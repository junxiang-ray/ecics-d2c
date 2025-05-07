import { PromoCode } from '@/libs/types/quote';
import baseClient from './api.config';
interface VerifyPromoCodeData {
  promo_code: string;
  product_type: string;
}
export interface PromoCodeResponse {
  message: string;
  data: PromoCode;
}

export interface VehicleMakeResponse {
  message: string;
  data: {
    id: string;
    name: string;
    group_name: string;
  }[];
}
export interface VehicleModelResponse {
  message: string;
  data: {
    id: string;
    name: string;
  }[];
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  verifyPartnerCode(partner_code: string) {
    return baseClient.get<any>('/partner/info/' + partner_code);
  },
  verifyPromoCode(data: VerifyPromoCodeData) {
    return baseClient.post<PromoCodeResponse>('/promo-code/validation', data);
  },
  getVehicleMakes() {
    return baseClient.get<VehicleMakeResponse>('/vehicle-makes/car');
  },
  getVehicleModels(id: string) {
    return baseClient.get<VehicleModelResponse>('/vehicle-models/car/' + id);
  },
};
