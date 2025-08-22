import { useQuery } from '@tanstack/react-query';
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
