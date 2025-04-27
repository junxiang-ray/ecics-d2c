import { LoginResponse, UserInfoPayload } from '@/libs/types/auth';

import singpassService from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  requestLogin() {
    return singpassService.get<LoginResponse>('/login');
  },
  getUserInfo({ params, payload }: { params: any; payload: UserInfoPayload }) {
    return singpassService.post<any>('/user-info', payload, { params });
  },
};
