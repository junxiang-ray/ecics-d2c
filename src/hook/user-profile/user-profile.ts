import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

import { PortalAuthorization } from '@/libs/types/auth';
import {
  UserProfileResponse,
  UserProfileUpdatePayload,
} from '@/libs/types/user-profile';
import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import { getCookie } from '@/libs/utils/utils';

import user from '@/api/base-service/user';
import { COOKIE_NAME } from '@/constants/general.constant';

export const getNric = async (): Promise<string> => {
  const decryptedStr = await decryptValue(
    getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION) ?? '',
    process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? '',
  );

  if (!decryptedStr) return '';

  return parseJSON<PortalAuthorization>(decryptedStr)?.nric ?? '';
};

export const useGetUserProfile = (enabled = true) => {
  const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    const nric = await getNric();
    if (!nric) throw new Error('Unauthorized!');

    // const resp = await user.getUserProfile(nric);
    const resp = await user.getUserProfile();

    console.log('🧪 MOCK PROFILE RESPONSE:', resp.data);

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
