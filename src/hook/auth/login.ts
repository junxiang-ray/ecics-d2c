import { useMutation, useQuery } from '@tanstack/react-query';

import { UserInfoPayload } from '@/libs/types/auth';
import { saveItemsToStorage } from '@/libs/utils/utils';

import auth from '@/api/singpass-service/auth';
import { ECICS_USER_INFO } from '@/constants/general.constant';

export const useRequestLogin = () => {
  const requestLogin = async () => {
    const res = await auth.requestLogin();
    return res.data;
  };

  return useMutation({
    mutationFn: requestLogin,
    mutationKey: ['login'],
    onSuccess: (data) => {
      window.location.href = data.url;
      saveItemsToStorage(
        {
          state: data.state,
          nonce: data.nonce,
          code_verifier: data.code_verifier,
        },
        'session',
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetUserInfo = ({
  params,
  payload,
}: {
  params: any;
  payload: UserInfoPayload;
}) => {
  const getUserInfo = async () => {
    const res = await auth.getUserInfo({ params, payload });
    saveItemsToStorage(
      { [ECICS_USER_INFO]: JSON.stringify(res.data) },
      'session',
    );
    return res.data;
  };
  console.log(111111, payload, params);
  return useQuery({
    queryFn: getUserInfo,
    queryKey: ['user-info', params],
    enabled:
      !!payload.code_verifier &&
      !!payload.nonce &&
      !!payload.state &&
      !!params?.code,
  });
};
