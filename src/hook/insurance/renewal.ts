import { useMutation, useQuery } from '@tanstack/react-query';
import renewal from '@/api/base-service/renewal';

export const useVerifyRetrieveRenewal = (nric: string) => {
  const fetchQuote = async () => {
    const res = await renewal.verifyRetrieveRenewal(nric);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['renewal', nric],
    enabled: !!nric,
  });
};

export const useCheckPolicy = () => {
  const checkPolicy = async (data: {
    veh_reg_no: string;
    passphrase: string;
  }) => {
    const res = await renewal.checkPolicy(data.veh_reg_no, data.passphrase);
    return res.data.data;
  };

  return useMutation({
    mutationFn: checkPolicy,
    mutationKey: ['check-policy'],
  });
};
