import { useMutation, useQuery } from '@tanstack/react-query';
import { ProposalPayload, QuoteCreationPayload } from '@/libs/types/quote';
import insurance from '@/api/base-service/insurance';
import { useApiErrorHandler } from '../useApiErrorHandler';

export const useGetQuote = (key: string) => {
  const fetchQuote = async () => {
    const res = await insurance.getQuoteByKey(key);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', key],
    enabled: !!key,
  });
};

export const useGenerateQuote = () => {
  const onError = useApiErrorHandler();
  const generateQuote = async (data: QuoteCreationPayload | any) => {
    const res = await insurance.generateQuote(data);
    return res.data.data;
  };

  return useMutation({
    mutationFn: generateQuote,
    mutationKey: ['generate-quote'],
    onError,
  });
};

export const useSaveProposal = () => {
  const onError = useApiErrorHandler();
  const saveProposal = async (data: ProposalPayload) => {
    const res = await insurance.saveProposal(data);
    return res.data.data;
  };
  return useMutation({
    mutationFn: saveProposal,
    mutationKey: ['save-proposal'],
    onError,
  });
};

export const useSaveQuote = () => {
  const onError = useApiErrorHandler();
  const saveQuote = async ({
    key,
    data,
    is_sending_email,
  }: {
    key: string;
    data: any;
    is_sending_email: boolean;
  }) => {
    const res = await insurance.saveQuote(key, data, is_sending_email);
    return res.data.data;
  };
  return useMutation({
    mutationFn: saveQuote,
    mutationKey: ['save-quote'],
    onError,
  });
};

export const useGetHirePurchaseList = (product_type: string) => {
  const fetchHirePurchaseList = async () => {
    const res = await insurance.getHirePurchaseList(product_type);
    return res.data.data;
  };
  return useQuery({
    queryFn: fetchHirePurchaseList,
    queryKey: ['hire-purchase', product_type],
  });
};

export const useRequestLogCar = () => {
  const onError = useApiErrorHandler();
  const requestLogCar = async () => {
    const res = await insurance.requestLogCar();
    return res.data;
  };
  return useMutation({
    mutationFn: requestLogCar,
    mutationKey: ['log-car'],
    onError,
  });
};

export const useSaveProposalFinalize = () => {
  const onError = useApiErrorHandler();
  const saveProposalFinalize = async (key: string) => {
    const res = await insurance.saveProposalFinalize({ key });
    return res.data.data;
  };
  return useMutation({
    mutationFn: saveProposalFinalize,
    mutationKey: ['save-proposal-finalize'],
    onError,
  });
};

export const usePayment = () => {
  const onError = useApiErrorHandler();
  const payment = async (key: string) => {
    const res = await insurance.payment({ key });
    return res.data.data;
  };
  return useMutation({
    mutationFn: payment,
    mutationKey: ['payload'],
    onError,
  });
};
