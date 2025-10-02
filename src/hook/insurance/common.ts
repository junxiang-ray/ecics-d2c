import { useMutation, useQuery } from '@tanstack/react-query';

import {
  CheckAIMakeModelResponse,
  CheckVehicleParams,
  VehicleCheckResponse,
} from '@/libs/types/auth';
import { formatPromoCode } from '@/libs/utils/utils';

import verify from '@/api/base-service/verify';

interface CheckVehiclePayload {
  vehicle_make: string;
  vehicle_model: string;
}

export const useVerifyPartnerCode = (partner_code: string) => {
  const fetchQuote = async () => {
    const res = await verify.verifyPartnerCode(partner_code);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', partner_code],
    enabled: !!partner_code,
  });
};

export const useVerifyPromoCode = (product_type: string) => {
  const fetchQuote = async (promo_code: string) => {
    const formattedPromoCode = formatPromoCode(promo_code);
    const res = await verify.verifyPromoCode({
      promo_code: formattedPromoCode,
      product_type,
    });
    return res.data;
  };

  return useMutation({
    mutationFn: fetchQuote,
    mutationKey: ['promo', product_type],
  });
};

export const useGetVehicleMakes = () => {
  const fetchVehicleMakes = async () => {
    const res = await verify.getVehicleMakes();
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchVehicleMakes,
    queryKey: ['vehicle-makes'],
  });
};

export const useGetVehicleModels = (id: string) => {
  const fetchVehicleModels = async () => {
    const res = await verify.getVehicleModels(id);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchVehicleModels,
    queryKey: ['vehicle-models', id],
    enabled: !!id,
  });
};

export const usePostCheckVehicle = (onUnmatch: () => void) => {
  const fetchCheckVehicle = async (
    payload: CheckVehiclePayload,
  ): Promise<VehicleCheckResponse> => {
    const res = await verify.postCheckVehicle(payload);
    return res.data.data;
  };

  return useMutation<VehicleCheckResponse, Error, CheckVehiclePayload>({
    mutationFn: fetchCheckVehicle,
    mutationKey: ['check-vehicle'],
    onError: (error) => {
      const errorMessage = (error as any)?.response?.data?.message;
      if (errorMessage === 'Vehicle make or model not found') {
        onUnmatch(); // Trigger modal
      }
      console.error(error);
    },
  });
};

export const useGetNationality = (group_name: string) => {
  const fetchNational = async () => {
    const res = await verify.getNationality(group_name);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchNational,
    queryKey: ['nationalities', group_name],
  });
};

export const useCheckAIMakeModel = (
  params: CheckVehicleParams,
  enabled = true,
) => {
  const fetchCheckAIVehicle = async (): Promise<CheckAIMakeModelResponse> => {
    const res = await verify.getCheckAIMakeModel(params);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchCheckAIVehicle,
    queryKey: [
      'check-ai-make-model',
      params.vehicle_make,
      params.vehicle_model,
      params.vehicle_capacity,
      params.vehicle_type,
    ],
    enabled: enabled && !!params.vehicle_make && !!params.vehicle_model,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
