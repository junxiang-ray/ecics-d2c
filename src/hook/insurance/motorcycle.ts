///Change relevant car to motorcycle
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';

import { ProposalPayload, QuoteCreationPayload } from '@/libs/types/quote';

// import insurance from '@/api/base-service/insurance';
import { ProductTypeWeb } from '@/app/api/constants/product';
import motorcycle from '@/api/base-service/motorcycle';

export const useGetQuote = (key: string) => {
  const fetchQuote = async () => {
    const res = await motorcycle.getMotorcycleQuoteByKey(key);
    return res.data.data;
  };

  return useQuery({
    queryFn: fetchQuote,
    queryKey: ['quote', key],
    enabled: !!key,
  });
};

export const useGenerateMotorcycleQuote = () => {
  const generateQuote = async (data: QuoteCreationPayload | any) => {
    const res = await motorcycle.generateMotorcycleQuote(data);
    return res.data.data;
  };

  return useMutation({
    mutationFn: generateQuote,
    mutationKey: ['generate-quote'],
  });
};

export const useSaveProposal = () => {
  const saveProposal = async ({
    data,
    productType,
  }: {
    data: ProposalPayload;
    productType: ProductTypeWeb;
  }) => {
    const res = await motorcycle.saveMotorcycleProposal(data, productType);
    return res.data.data;
  };
  return useMutation({
    mutationFn: saveProposal,
    mutationKey: ['save-proposal'],
  });
};

export const useSaveQuote = () => {
  const saveQuote = async ({
    key,
    data,
    is_sending_email,
  }: {
    key: string;
    data: any;
    is_sending_email: boolean;
  }) => {
    const res = await motorcycle.saveMotorcycleQuote(
      key,
      data,
      is_sending_email,
    );
    return res.data.data;
  };
  return useMutation({
    mutationFn: saveQuote,
    mutationKey: ['save-quote'],
  });
};

export const useMotorcycleGetHirePurchaseList = (product_type: string) => {
  const fetchHirePurchaseList = async () => {
    const res = await motorcycle.getHirePurchaseList(product_type);
    return res.data.data;
  };
  return useQuery({
    queryFn: fetchHirePurchaseList,
    queryKey: ['hire-purchase', product_type],
  });
};

export const useRequestLog = (product_type: string) => {
  const requestLog = async () => {
    const res = await motorcycle.requestLog(product_type);
    return res.data;
  };
  return useMutation({
    mutationFn: requestLog,
    mutationKey: ['request-log'],
  });
};

export const useSaveProposalFinalize = () => {
  const saveProposalFinalize = async (key: string) => {
    const res = await motorcycle.saveProposalFinalize({ key });
    return res.data.data;
  };
  return useMutation({
    mutationFn: saveProposalFinalize,
    mutationKey: ['save-proposal-finalize'],
  });
};

export const usePayment = () => {
  const payment = async (key: string) => {
    const res = await motorcycle.payment({ key, product_type: 'motorcycle' });
    return res.data.data;
  };
  return useMutation({
    mutationFn: payment,
    mutationKey: ['payload'],
  });
};

export const usePostZipFilesDownload = (): UseMutationResult<
  Blob,
  Error,
  string[],
  unknown
> => {
  const zipFilesDownload = async (documents: string[]) => {
    const res = await motorcycle.postZipFilesDownload({ documents });
    return res.data;
  };

  return useMutation<Blob, Error, string[], unknown>({
    mutationFn: zipFilesDownload,
    mutationKey: ['zip-files-download'],
  });
};
