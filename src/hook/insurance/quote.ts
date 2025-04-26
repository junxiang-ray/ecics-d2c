import baseClient from '@/api/base-service/api.config';
import insurance from '@/api/base-service/insurance';
import { useQuery } from '@tanstack/react-query';

export const useGetQuote = (key: string) => {
  const fetchQuote = async () => {
    const res = await insurance.getQuoteByKey(key);
    return res.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', key],
  });
};
