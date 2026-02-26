import { UserProfileUpdatePayload } from '@/libs/types/user-profile';

import {
  API_CHANGE_PASSWORD,
  API_USER_PROFILE_UPDATE,
} from '@/constants/api.constant';

import baseClient from './api.config';

export default {
  getUserProfile() {
    return baseClient.post('/policy/get-user-profile');
  },
  updateUserProfile(nric: string, payload: UserProfileUpdatePayload) {
    return baseClient.put(`${API_USER_PROFILE_UPDATE}/${nric}`, payload);
  },
  changePassword(nric: string, password: string) {
    return baseClient.put(`${API_CHANGE_PASSWORD}/${nric}`, {
      password,
    });
  },
};
