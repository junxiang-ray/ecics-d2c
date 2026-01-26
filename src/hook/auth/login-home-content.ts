import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import { UserInfoPayload } from '@/libs/types/auth';
import { saveToSessionStorage } from '@/libs/utils/utils';

import insurance from '@/api/base-service/insurance';
import auth from '@/api/singpass-home-content-service/auth';
import { ProductTypeWeb } from '@/app/api/constants/product';
import {
  DATA_FROM_SINGPASS,
  PARTNER_CODE,
  PROMO_CODE,
} from '@/constants/general.constant';
import { updateEcicsUserInfo } from '@/redux/slices/ecicsUserInfo.slice';
import { useAppDispatch } from '@/redux/store';

export const useRequestLoginHomeContent = (
  productType: ProductTypeWeb,
  options?: UseMutationOptions<any, unknown, void, unknown>,
) => {
  const requestLoginHomeContent = async () => {
    const res = await auth.requestLoginHomeContent(productType);
    return res.data;
  };

  return useMutation({
    mutationFn: requestLoginHomeContent,
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

export const usePostUserInfoHomeContent = ({
  payload,
  productType,
}: {
  payload: UserInfoPayload;
  productType: ProductTypeWeb;
}) => {
  const dispatch = useAppDispatch();
  console.log('CALLING');
  const postUserInfoHomeContent = async () => {
    const res = await auth.postUserInfoHomeContent({ payload, productType });
    dispatch(updateEcicsUserInfo(JSON.stringify(res.data.data)));
    saveToSessionStorage({
      [DATA_FROM_SINGPASS]: JSON.stringify(res.data.data),
    });
    return res.data;
  };
  return useQuery({
    queryFn: postUserInfoHomeContent,
    queryKey: ['user-info-home-contents', payload],
    enabled:
      !!payload.code_verifier &&
      !!payload.nonce &&
      !!payload.state &&
      !!payload?.code,
  });
};

export const usePostPersonalInfoHomeContent = () => {
  const postPersonalInfoHomeContent = async (payload: any) => {
    const res = await insurance.postPersonalInfoSave(payload);
    return res.data;
  };
  return useMutation({
    mutationFn: postPersonalInfoHomeContent,
    mutationKey: ['personal-info-home-content'],
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

      //   window.location.href = `${ROUTES.INSURANCE_MAID.BASIC_DETAIL_SINGPASS}&${queryParams.toString()}`;
    },
  });
};
