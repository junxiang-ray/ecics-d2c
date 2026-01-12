import { useMutation, useQuery } from '@tanstack/react-query';

import {
  HomeContentQuoteCreationPayload,
  HomeContentQuoteSavePayload,
} from '@/libs/types/homeContents';

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
    data: HomeContentQuoteSavePayload,
  ) => {
    try {
      const res = await homecontents.generateHomeContentQuote(data);
      console.log('res output', res.data);
    } catch (error) {
      console.log('something wrong', error);
    }
  };

  return useMutation({
    mutationFn: generateHomeContentQuote,
    mutationKey: ['generate-homecontent-quote'],
  });
};

export const useGetProductDetails = () => {
  const getProductDetails = async () => {
    console.log('I am Here');
    const res = await homecontents.getProductDetails();
    return res.data.data;
  };

  return useMutation({
    mutationFn: getProductDetails,
    mutationKey: ['get-homecontent-details'],
  });
};

export const useGetPremiumCalc = () => {
  const getPremiumCalc = async (data: HomeContentQuoteCreationPayload) => {
    const res = await homecontents.getPremiumCalc(data);
    return res.data.data;
  };

  return useMutation({
    mutationFn: getPremiumCalc,
    mutationKey: ['get-homecontent-calc'],
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
    mutationKey: ['save-homecontent-quote'],
  });
};

export const usePayment = () => {
  const payment = async (key: string) => {
    const res = await homecontents.payment({
      key,
      product_type: 'home_contents',
    });
    return res.data.data;
  };
  return useMutation({
    mutationFn: payment,
    mutationKey: ['payload'],
  });
};
