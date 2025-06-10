import maid from '@/api/base-service/maid';
import { MaidQuoteCreationPayload } from '@/libs/types/maidQuote';
import { useMutation } from '@tanstack/react-query';

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
