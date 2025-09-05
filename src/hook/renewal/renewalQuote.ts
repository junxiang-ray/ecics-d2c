import { useMutation } from '@tanstack/react-query';

import renewal from '@/api/base-service/renewal';
import { ProductTypeWeb } from '@/app/api/constants/product';

type EditRenewalParams = {
  productType: ProductTypeWeb;
  payload: any;
};

export const usePostEditRenewal = () => {
  const postEditRenewal = async ({
    productType,
    payload,
  }: EditRenewalParams) => {
    const res = await renewal.postEditRenewal(productType, payload);
    return res.data;
  };

  return useMutation({
    mutationFn: postEditRenewal,
    mutationKey: ['edit-renewal'],
  });
};

export const usePostRenewalProcessPayment = () => {
  const postRenewalProcessPayment = async ({
    productType,
    payload,
  }: EditRenewalParams) => {
    const res = await renewal.postRenewalProcessPayment(productType, payload);
    return res.data;
  };

  return useMutation({
    mutationFn: postRenewalProcessPayment,
    mutationKey: ['renewal-process-payment'],
  });
};

export const usePostSavePolicy = () => {
  const postSavePolicyPayment = async ({
    productType,
    payload,
  }: EditRenewalParams) => {
    const res = await renewal.postSavePolicy(productType, payload);
    return res.data;
  };

  return useMutation({
    mutationFn: postSavePolicyPayment,
    mutationKey: ['save-policy'],
  });
};
