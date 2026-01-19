import type { AxiosResponse } from 'axios';
import {
  UserProfileResponse,
  UserProfileUpdatePayload,
} from '@/libs/types/user-profile';

import { useMutation, useQuery } from '@tanstack/react-query';

import user from '@/api/base-service/user';
import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import { getCookie } from '@/libs/utils/utils';
import { PortalAuthorization } from '@/libs/types/auth';
import { COOKIE_NAME } from '@/constants/general.constant';

// export const getNric = async (): Promise<string> => {
//   const decryptedStr = await decryptValue(
//     getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION) ?? '',
//     process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? '',
//   );

//   if (!decryptedStr) return '';

//   return parseJSON<PortalAuthorization>(decryptedStr)?.nric ?? '';
// };
export const getNric = async (): Promise<string> => {
  console.log('🔥 TEMP getNric BYPASS');
  return 'TEST_NRIC';
};

export const useGetUserProfile = (enabled = true) => {
  const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    console.log('🔥 fetchUserProfile start');

    const nric = await getNric();
    if (!nric) throw new Error('Unauthorized!');

    const resp = await user.getUserProfile(nric);
    console.log('🔥 fetchUserProfile got response');

    return resp?.data;
  };

  return useQuery({
    queryFn: fetchUserProfile,
    queryKey: ['user_profile', enabled],
    enabled,
    retry: false,
  });
};

export const useUpdateUserInfo = () => {
  const updateUser = async (
    payload: UserProfileUpdatePayload,
  ): Promise<AxiosResponse> => {
    const nric = await getNric();
    const resp = await user.updateUserProfile(nric, payload);
    return resp;
  };

  return useMutation({
    mutationFn: updateUser,
    mutationKey: ['user_profile'],
  });
};

export const useChangePassword = () => {
  const changePassword = async (password: string): Promise<AxiosResponse> => {
    const nric = await getNric();
    const resp = await user.changePassword(nric, password);
    return resp;
  };

  return useMutation({
    mutationFn: changePassword,
    mutationKey: ['change_password'],
  });
};
