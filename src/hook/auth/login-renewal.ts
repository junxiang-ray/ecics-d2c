import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { UserInfoPayload } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import auth from '@/api/singpass-renewal-service/auth';
import { ProductTypeWeb } from '@/app/api/constants/product';
import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
} from '@/constants/general.constant';

export const useRequestSignInSingpass = (
  productType: ProductTypeWeb,
  options?: UseMutationOptions<any, unknown, void, unknown>,
) => {
  const requestSignInSingpass = async () => {
    const res = await auth.requestSignInSingpass(productType);
    return res.data;
  };

  return useMutation({
    mutationFn: requestSignInSingpass,
    mutationKey: ['login', productType],
    onSuccess: (data) => {
      const { url, state, nonce, code_verifier } = data.data;
      window.location.href = url;
      saveToSessionStorage({
        state: state,
        nonce: nonce,
        code_verifier: code_verifier,
      });
    },
    onError: (error, variables, context) => {
      console.log(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRetriveNricSingpass = () => {
  const retriveNricSingpass = async ({
    payload,
  }: {
    payload: UserInfoPayload;
  }) => {
    const res = await auth.retriveNricSingpass({ payload });
    const resData = {
      uinfin: {
        value: res?.data?.data || '',
      },
    };
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(resData) });
    saveToSessionStorage({
      [DATA_FROM_SINGPASS]: JSON.stringify(resData),
    });
    return res.data;
  };
  return useMutation({
    mutationFn: retriveNricSingpass,
    mutationKey: ['retrive-nric-singpass'],
  });
};
