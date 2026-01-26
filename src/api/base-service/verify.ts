import { CheckVehicleParams } from '@/libs/types/auth';
import { PromoCode } from '@/libs/types/quote';

import {
  API_CHECK_AI_MAKE_MODEL,
  API_GET_LIST_MOTORCYCLE_VEHICLE_MAKES,
  API_GET_LIST_MOTORCYCLE_VEHICLE_MODELS,
  API_GET_LIST_NATIONAL,
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

export interface VehicleResponse {
  id: string;
  name: string;
}

export interface NationalResponse {
  message: string;
  data: {
    id: string;
    name: string;
  }[];
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  verifyPartnerCode(partner_code: string) {
    return baseClient.get<any>('/partner-info/' + partner_code);
  },
  verifyPromoCode(data: VerifyPromoCodeData) {
    return baseClient.post<PromoCodeResponse>('/promo-code/validation', data);
  },
  getVehicleMakes(productType?: string) {
    if (productType === 'motorcycle') {
      return baseClient.get<VehicleMakeResponse>(
        `${API_GET_LIST_MOTORCYCLE_VEHICLE_MAKES}`,
      );
    }

    // else default to car
    return baseClient.get<VehicleMakeResponse>(`${API_GET_LIST_VEHICLE_MAKES}`);
  },
  getVehicleModels(id: string, productType?: string) {
    if (productType === 'motorcycle') {
      return baseClient.get<VehicleModelResponse>(
        `${API_GET_LIST_MOTORCYCLE_VEHICLE_MODELS}` + id,
      );
    }

    // else default to car
    return baseClient.get<VehicleModelResponse>(
      `${API_GET_LIST_VEHICLE_MODELS}` + id,
    );
  },

  postCheckVehicle(payload: { vehicle_make: string; vehicle_model: string }) {
    return baseClient.post<any>(`${API_POST_CHECK_VEHICLE}`, payload);
  },

  getNationality(group_name: string) {
    return baseClient.get<NationalResponse>(`${API_GET_LIST_NATIONAL}`, {
      params: { group_name },
    });
  },

  getCheckAIMakeModel(params: CheckVehicleParams) {
    return baseClient.get(`${API_CHECK_AI_MAKE_MODEL}`, { params });
  },
};
