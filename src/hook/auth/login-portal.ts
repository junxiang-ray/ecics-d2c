import type { AxiosError } from 'axios';

import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';
import { setCookie } from '@/libs/utils/utils';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { encryptValue, stringifyJSON } from '@/libs/utils/secureStorage-utils';

import auth from '@/api/singpass-portal-service/auth';
import { COOKIE_NAME } from '@/constants/general.constant';

export const useRequestSignInByMail = () => {
  const requestSignIn = async (): Promise<any> => {
    const resp = await new Promise<any>((resolve, reject) => {
      setTimeout(() => resolve({ data: {}, message: '' }), 1000);
    });
    return resp;
  };

  return useMutation({
    mutationFn: requestSignIn,
    mutationKey: ['portal_login'],
    onSuccess: (data: any) => {
      // todo: handle resp success;
    },
    onError: (
      error: AxiosError<unknown>,
      variables: unknown,
      context: unknown,
    ) => {
      // todo: handle resp error;
    },
  });
};

export const useRequestSignInSingpass = (
  options?: UseMutationOptions<any, unknown, void, unknown>,
) => {
  const requestSignIn = async (): Promise<LoginResponse> => {
    const res = await auth.requestSignInSingpass();
    return res.data;
  };

  return useMutation({
    mutationFn: requestSignIn,
    mutationKey: ['portal_singpass_login'],
    onSuccess: async (data: LoginResponse) => {
      const { url, state, nonce, code_verifier } = data.data;
      const encrypted = await encryptValue(
        stringifyJSON({ state, nonce, code_verifier }),
        process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? '',
      );
      setCookie<string>({
        name: COOKIE_NAME.PORTAL_AUTHORIZATION,
        value: encrypted,
        expireAfter: { days: 30 },
      });
      sessionStorage.setItem(COOKIE_NAME.PORTAL_AUTHORIZATION, encrypted);
      window.location.href = url;
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRetriveNricSingpass = () => {
  const retriveNricSingpass = async (payload: UserInfoPayload) => {
    const resp = await auth.retriveNricSingpass(payload);
    return resp.data;
  };

  return useMutation({
    mutationFn: retriveNricSingpass,
    mutationKey: ['retrive-nric-singpass-portal'],
  });
};
