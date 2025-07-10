import { useMutation, useQuery } from '@tanstack/react-query';

import { UserInfoPayload } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import insurance from '@/api/base-service/insurance';
import auth from '@/api/singpass-maid-service/auth';
import { ProductTypeWeb } from '@/app/api/constants/product';
import {
  DATA_FROM_SINGPASS,
  ECICS_USER_INFO,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';

export const useRequestLoginMaid = (productType: ProductTypeWeb) => {
  const requestLoginMaid = async () => {
    const res = await auth.requestLoginMaid(productType);
    return res.data;
  };

  return useMutation({
    mutationFn: requestLoginMaid,
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
    onError: (error) => {
      console.log(error);
    },
  });
};

export const usePostUserInfoMaid = ({
  payload,
  productType,
}: {
  payload: UserInfoPayload;
  productType: ProductTypeWeb;
}) => {
  const postUserInfoMaid = async () => {
    const res = await auth.postUserInfoMaid({ payload, productType });
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(res.data.data) });
    saveToSessionStorage({
      [DATA_FROM_SINGPASS]: JSON.stringify(res.data.data),
    });
    return res.data;
  };
  return useQuery({
    queryFn: postUserInfoMaid,
    queryKey: ['user-info-maid', payload],
    enabled:
      !!payload.code_verifier &&
      !!payload.nonce &&
      !!payload.state &&
      !!payload?.code,
  });
};

export const usePostPersonalInfoMaid = () => {
  const postPersonalInfoMaid = async (payload: any) => {
    const res = await insurance.postPersonalInfoSave(payload);
    return res.data;
  };
  return useMutation({
    mutationFn: postPersonalInfoMaid,
    mutationKey: ['personal-info-maid'],
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

      window.location.href = `${ROUTES.INSURANCE_MAID.BASIC_DETAIL_SINGPASS}&${queryParams.toString()}`;
    },
  });
};
