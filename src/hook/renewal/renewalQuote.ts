import { useMutation } from '@tanstack/react-query';

import renewal from '@/api/base-service/renewal';
import verify from '@/api/cms-service/verify';
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

export const useGetTimeoutRenewal = () => {
  const getTimeoutRenewal = async () => {
    const res = await verify.getTimeoutRenewal();
    return res.data;
  };

  return useMutation({
    mutationFn: getTimeoutRenewal,
    mutationKey: ['get-timeout-renewal'],
  });
};

export const usePostCheckPolicies = () => {
  const postCheckPolicies = async (policies: { veh_reg_no: string }[]) => {
    const res = await verify.checkPolicies({ policies });
    return res.data;
  };

  return useMutation({
    mutationFn: postCheckPolicies,
    mutationKey: ['check-policies'],
  });
};
