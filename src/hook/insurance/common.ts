import verify from '@/api/base-service/verify';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useVerifyPartnerCode = (partner_code: string) => {
  const fetchQuote = async () => {
    const res = await verify.verifyPartnerCode(partner_code);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', partner_code],
    enabled: false,
  });
};

export const useVerifyPromoCode = () => {
  const fetchQuote = async (promo_code: string) => {
    const res = await verify.verifyPromoCode({
      promo_code,
      product_type: 'car',
    });
    return res.data;
  };

  return useMutation({
    mutationFn: fetchQuote,
    mutationKey: ['promo'],
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
