import {
  API_GET_LIST_VEHICLE_MAKES,
  API_GET_LIST_VEHICLE_MODELS,
  API_POST_CHECK_VEHICLE,
} from '@/constants/api.constant';

import baseClient from './api.config';
interface VerifyPromoCodeData {
  promo_code: string;
  product_type: string;
}
export interface PromoCodeResponse {
  message: string;
  data: {
    code: string;
    discount: number;
    startTime: string;
    endTime: string;
    description: string;
    products: string[];
    isPublic: boolean;
    isShowCountdown: boolean;
    is_valid: boolean;
  };
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

export interface VehicleResponse {
  id: string;
  name: string;
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
    return baseClient.get<VehicleMakeResponse>(`${API_GET_LIST_VEHICLE_MAKES}`);
  },
  getVehicleModels(id: string) {
    return baseClient.get<VehicleModelResponse>(
      `${API_GET_LIST_VEHICLE_MODELS}` + id,
    );
  },

  postCheckVehicle(payload: { vehicle_make: string; vehicle_model: string }) {
    return baseClient.post<any>(`${API_POST_CHECK_VEHICLE}`, payload);
  },
};
