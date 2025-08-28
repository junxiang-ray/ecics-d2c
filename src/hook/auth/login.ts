import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import { SavePersonalInfoPayload, UserInfoPayload } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import insurance from '@/api/base-service/insurance';
import auth from '@/api/singpass-car-service/auth';
import { ProductTypeWeb } from '@/app/api/constants/product';
import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';

export const useRequestLogin = (
  productType: ProductTypeWeb,
  options?: UseMutationOptions<any, unknown, void, unknown>,
) => {
  const requestLogin = async () => {
    const res = await auth.requestLogin(productType);
    return res.data;
  };

  return useMutation({
    mutationFn: requestLogin,
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

export const usePostUserInfo = ({
  payload,
  productType,
}: {
  payload: UserInfoPayload;
  productType: ProductTypeWeb;
}) => {
  const postUserInfo = async () => {
    const res = await auth.postUserInfo({ payload, productType });
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(res.data.data) });
    saveToSessionStorage({
      [DATA_FROM_SINGPASS]: JSON.stringify(res.data.data),
    });
    return res.data;
  };
  return useQuery({
    queryFn: postUserInfo,
    queryKey: ['user-info', payload],
    enabled:
      !!payload.code_verifier &&
      !!payload.nonce &&
      !!payload.state &&
      !!payload?.code,
    retry: false,
  });
};

export const usePostPersonalInfo = () => {
  const postPersonalInfo = async (payload: SavePersonalInfoPayload) => {
    const res = await insurance.postPersonalInfoSave(payload);
    return res.data;
  };
  return useMutation({
    mutationFn: postPersonalInfo,
    mutationKey: ['personal-info'],
    onSuccess: (_data, variables) => {
      if (variables.shouldRedirect === false) return;

      const queryParams = new URLSearchParams({
        key: variables.key,
      });

      const partnerCode = localStorage.getItem(PARTNER_CODE);
      const promoCode = localStorage.getItem(PROMO_CODE);

      if (partnerCode) {
        queryParams.append('partner_code', partnerCode);
      }

      if (promoCode) {
        queryParams.append('promo_code', promoCode);
      }

      window.location.href = `${ROUTES.INSURANCE.BASIC_DETAIL_SINGPASS}&${queryParams.toString()}`;
    },
  });
};
