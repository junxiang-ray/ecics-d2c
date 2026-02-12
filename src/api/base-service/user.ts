import type { AxiosResponse } from 'axios';
import { UserProfileUpdatePayload } from '@/libs/types/user-profile';

import {
  API_CHANGE_PASSWORD,
  API_USER_PROFILE_GET,
  API_USER_PROFILE_UPDATE,
} from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // getUserProfile_old(nric: string) {
  //   if (!nric) throw Error('Unauthorized!');

  //   return new Promise<AxiosResponse>((resolve) =>
  //     resolve({
  //       data: {
  //         data: {
  //           name: 'John Doe',
  //           phone: '+6591234567',
  //           email: 'john.doe@email.com',
  //           gender: 'MALE',
  //           marital_status: 'SINGLE',
  //           address: {
  //             address_line_1: '123 Orchard Road',
  //             address_line_2: '#05-10 ABC Building',
  //             address_line_3: 'Singapore',
  //             postal_code: '238858',
  //           },
  //         },
  //         meta: { pagination: {} },
  //       },
  //     } as any),
  //   );
  //   // return baseClient.get(`${API_USER_PROFILE_GET}/${nric}`);
  // },

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
