import maid from '@/api/base-service/maid';
import { MaidQuoteCreationPayload } from '@/libs/types/maidQuote';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetMaidQuote = (key: string) => {
  const fetchQuote = async () => {
    const res = await maid.getMaidQuoteByKey(key);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', key],
    enabled: !!key,
  });
};

export const useGenerateMaidQuote = () => {
  const generateMaidQuote = async (data: MaidQuoteCreationPayload | any) => {
    const res = await maid.generateMaidQuote(data);
    return res.data.data;
  };

  return useMutation({
    mutationFn: generateMaidQuote,
    mutationKey: ['generate-maid-quote'],
  });
};
