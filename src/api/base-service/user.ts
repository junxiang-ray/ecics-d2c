import type { AxiosResponse } from 'axios';
import { Address } from '@/libs/types/common';
import { UserProfileUpdatePayload } from '@/libs/types/user-profile';

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
  getUserProfile() {
    return baseClient.get(`${API_USER_PROFILE_GET}/${getAuthCode()}`);
  },
  updateUserProfile(payload: UserProfileUpdatePayload) {
    return baseClient.put(API_USER_PROFILE_UPDATE, {
      key: getAuthCode(),
      ...payload,
    });
  },
  changePassword(password: string) {
    return baseClient.put(API_CHANGE_PASSWORD, {
      code: getAuthCode(),
      password,
    });
  },
};
