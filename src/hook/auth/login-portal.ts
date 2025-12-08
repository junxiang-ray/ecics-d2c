import type { AxiosResponse, AxiosError } from 'axios';

import { LoginData, LoginResponse, UserInfoPayload } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import auth from '@/api/singpass-renewal-service/auth';
import { PRODUCT_NAME, ProductTypeWeb } from '@/app/api/constants/product';
import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
} from '@/constants/general.constant';

export const useRequestSignIn = () => {
  const requestSignIn = async (): Promise<LoginResponse> => {
    const res = await auth.requestSignInSingpass(PRODUCT_NAME.PORTAL);
    return res.data;
  };

  return useMutation({
    mutationFn: requestSignIn,
    mutationKey: ['portal_login'],
    // onSuccess: (data: LoginResponse) => {
    //     const { url, state, nonce, code_verifier } = data.data;
    //     const params = new URL(url).searchParams;
    //     const redirectUrl =
    //     // params.get('code');
    //   // params.get('code');
    //
    //     // todo: extract the url
    //     // window.location.href = url;
    //     saveToSessionStorage({
    //         state: state,
    //         nonce: nonce,
    //         code_verifier: code_verifier,
    //     });
    // },
    // onError: (error: AxiosError<unknown>, variables: unknown, context: unknown) => {
    //     options?.onError?.(error, variables, context);
    // },
  });
};

export const useRequestSignInSingpass = () => {
  const requestSignIn = async (): Promise<LoginResponse> => {
    const res = await auth.requestSignInSingpass(PRODUCT_NAME.PORTAL);
    return res.data;
  };

  return useMutation({
    mutationFn: requestSignIn,
    mutationKey: ['portal_singpass_login'],
    onSuccess: (data: LoginResponse) => {
      const { url, state, nonce, code_verifier } = data.data;
      window.location.href = url;

      // todo: Cache to cookie
      saveToSessionStorage({
        state: state,
        nonce: nonce,
        code_verifier: code_verifier,
      });
    },
    // onError: (error: AxiosError<unknown>, variables: unknown, context: unknown) => {
    //     options?.onError?.(error, variables, context);
    // },
  });
};

export const useRetriveNricSingpass = () => {
  const retriveNricSingpass = async ({
    payload,
  }: {
    payload: UserInfoPayload;
  }): Promise<AxiosResponse<{ data: unknown }>> => {
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
