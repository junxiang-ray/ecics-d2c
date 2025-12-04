import type { AxiosResponse } from 'axios';
import { Address, MaritalStatus } from '@/libs/types/common';
import {
  UserProfileUpdatePayload,
  UserProfileResponse,
} from '@/libs/types/user-profile';

import { Observable, of, from } from 'rxjs';
import { useMutation, useQuery } from '@tanstack/react-query';

import user from '@/api/base-service/user';

export const useGetUserProfile = () => {
  const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    try {
      const resp = await user.getUserProfile();
      return resp?.data as unknown as UserProfileResponse;
    } catch (e) {
      return {} as UserProfileResponse;
    }
  };

  return useQuery({
    queryFn: fetchUserProfile,
    queryKey: ['user_profile'],
    enabled: true,
  });
};

export const useUpdateUserInfo = () => {
  const updateUser = async (
    payload: UserProfileUpdatePayload,
  ): Promise<AxiosResponse> => {
    const resp = await user.updateUserProfile(payload);
    return resp;
  };

  return useMutation({
    mutationFn: updateUser,
    mutationKey: ['user_profile'],
  });
};

export const useChangePassword = () => {
  const changePassword = async (password: string): Promise<AxiosResponse> => {
    const resp = await user.changePassword(password);
    return resp;
  };

  return useMutation({
    mutationFn: changePassword,
    mutationKey: ['change_password'],
  });
};
