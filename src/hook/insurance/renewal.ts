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

export const useCheckPolicyRenewal = () => {
  const checkPolicyRenewal = async (data: {
    veh_reg_no: string;
    passphrase: string;
  }) => {
    const res = await renewal.checkPolicyRenewal(
      data.veh_reg_no,
      data.passphrase,
    );
    return res.data.data;
  };
  return useMutation({
    mutationFn: checkPolicyRenewal,
    mutationKey: ['check-policy'],
  });
};

export const useGetRenewalPaymentSuccess = (key: string) => {
  const fetchPaymentSuccess = async () => {
    const res = await renewal.getRenewalPaymentSuccess(key);
    return res.data.data;
  };
  return useQuery({
    queryFn: fetchPaymentSuccess,
    queryKey: ['payment-success', key],
    enabled: !!key,
  });
};
