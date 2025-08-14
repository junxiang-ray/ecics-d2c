import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import { saveToSessionStorage } from '@/libs/utils/utils';

import { ProductTypeWeb } from '@/app/api/constants/product';
import auth from '@/api/singpass-renewal-service/auth';
import { UserInfoPayload } from '@/libs/types/auth';
import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
} from '@/constants/general.constant';

export const useRequestLoginRenewal = (
  productType: ProductTypeWeb,
  options?: UseMutationOptions<any, unknown, void, unknown>,
) => {
  const requestLoginRenewal = async () => {
    const res = await auth.requestLoginRenewal(productType);
    return res.data;
  };

  return useMutation({
    mutationFn: requestLoginRenewal,
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

export const usePostUserInfoRenewal = ({
  payload,
  productType,
}: {
  payload: UserInfoPayload;
  productType: ProductTypeWeb;
}) => {
  const postUserInfoRenewal = async () => {
    const res = await auth.postUserInfoRenewal({ payload, productType });
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(res.data.data) });
    saveToSessionStorage({
      [DATA_FROM_SINGPASS]: JSON.stringify(res.data.data),
    });
    return res.data;
  };
  return useQuery({
    queryFn: postUserInfoRenewal,
    queryKey: ['user-info-renewal', payload],
    enabled:
      !!payload.code_verifier &&
      !!payload.nonce &&
      !!payload.state &&
      !!payload?.code,
  });
};
