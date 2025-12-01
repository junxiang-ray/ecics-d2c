import type { AxiosResponse } from 'axios';
import { Address } from '@/libs/types/common';
import { UserProfileResponse } from '@/libs/types/user-profile';

import {
  API_USER_PROFILE_GET,
  API_USER_PROFILE_UPDATE,
  API_CHANGE_PASSWORD,
} from '@/constants/api.constant';
import { getCookie } from '@/libs/utils/utils';

import baseClient from './api.config';

const getAuthCode = (): string => getCookie('code') ?? '';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getUserProfile<T = UserProfileResponse>(): Promise<AxiosResponse<T>> {
    return baseClient.get<T>(`${API_USER_PROFILE_GET}${getAuthCode()}`);
  },
  updateMaritalStatus<T = unknown>(
    maritalStatus: string,
  ): Promise<AxiosResponse<T>> {
    return baseClient.put<T>(API_USER_PROFILE_UPDATE, {
      key: getAuthCode(),
      marital_status: maritalStatus,
    });
  },
  updateEmail<T = unknown>(email: string): Promise<AxiosResponse<T>> {
    return baseClient.put<T>(API_USER_PROFILE_UPDATE, {
      key: getAuthCode(),
      email,
    });
  },
  updatePhone<T = unknown>(phone: string): Promise<AxiosResponse<T>> {
    return baseClient.put<T>(API_USER_PROFILE_UPDATE, {
      key: getAuthCode(),
      phone,
    });
  },
  updateAddress<T = unknown>(address: Address): Promise<AxiosResponse<T>> {
    return baseClient.put<T>(API_USER_PROFILE_UPDATE, {
      key: getAuthCode(),
      address: {
        address_line_1: address?.address_line_1,
        address_line_2: address?.address_line_2,
        address_line_3: address?.address_line_3,
        postal_code: address?.postal_code,
      },
    });
  },
  changePassword<T = unknown>(password: string): Promise<AxiosResponse<T>> {
    return baseClient.put<T>(API_CHANGE_PASSWORD, {
      code: getAuthCode(),
      password,
    });
  },
};
