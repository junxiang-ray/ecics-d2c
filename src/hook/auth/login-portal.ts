// src/hook/auth/login-portal.ts
import type { AxiosError } from 'axios';
import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';
import { setCookie } from '@/libs/utils/utils';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { encryptValue, stringifyJSON } from '@/libs/utils/secureStorage-utils';
import auth from '@/api/singpass-portal-service/auth';

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

// src/hook/auth/login-portal.ts - Updated
// src/hook/auth/login-portal.ts - Updated useRequestSignInSingpass
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

      // Use separate cookie name!
      setCookie<string>({
        name: 'pa_oauth',
        value: encrypted,
        expireAfter: { hours: 1 },
      });

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
    onSuccess: (data) => {
      // console.info('🎉 [useRetriveNricSingpass] onSuccess - NRIC data:', data);
    },
    onError: (error) => {
      console.error('❌ [useRetriveNricSingpass] onError:', error);
    },
  });
};
