import { useMutation, useQuery } from '@tanstack/react-query';

import { HomeContentQuoteCreationPayload } from '@/libs/types/homeContents';

import homecontents from '@/api/base-service/homecontents';

export const useGetHomeContentQuote = (key: string) => {
  const fetchQuote = async () => {
    const res = await homecontents.getHomeContentQuoteByKey(key);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', key],
    enabled: !!key,
  });
};

export const useGenerateHomeContentsQuote = () => {
  const generateHomeContentQuote = async (
    data: HomeContentQuoteCreationPayload | any,
  ) => {
    const res = await homecontents.generateHomeContentQuote(data);
    return res.data.data;
  };

  return useMutation({
    mutationFn: generateHomeContentQuote,
    mutationKey: ['generate-homecontent-quote'],
  });
};

export const useSaveHomeContentQuote = () => {
  const saveHomeContentQuote = async ({
    key,
    data,
    is_sending_email,
  }: {
    key: string;
    data: any;
    is_sending_email: boolean;
  }) => {
    const res = await homecontents.saveHomeContentQuote(
      key,
      data,
      is_sending_email,
    );
    return res.data.data;
  };
  return useMutation({
    mutationFn: saveHomeContentQuote,
    mutationKey: ['save-maid-quote'],
  });
};
