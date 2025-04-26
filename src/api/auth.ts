import { HTTP_STATUS_CODE } from '@/constants';
import {
  API_GET_USER_INFO,
  API_LOGIN,
  API_POST_PERSONAL_INFO_SAVE,
} from '@/constants/api.constant';

import myClient from './configAPI';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authApi = {
  requestLogin: async (): Promise<string | null> => {
    if (!BASE_URL) {
      console.error('API base URL is not defined.');
      return null;
    }
    try {
      const response = await myClient.get(`${BASE_URL}${API_LOGIN}`);
      if (response?.meta?.code === HTTP_STATUS_CODE.SUCCESS) {
        return response.data ?? null;
      }
    } catch (error) {
      console.error('Login request failed:', error);
    }
    return null;
  },
  getUserInfoByCode: async (code: string): Promise<any | null> => {
    if (!BASE_URL) {
      console.error('API base URL is not defined.');
      return null;
    }
    try {
      const response = await myClient.get(
        `${BASE_URL}${API_GET_USER_INFO}?code=${code}`,
      );
      if (response?.meta?.code === HTTP_STATUS_CODE.SUCCESS) {
        return response.data ?? null;
      }
    } catch (error) {
      console.error('Get user info failed:', error);
    }
    return null;
  },
  savePersonalInfo: async (payload: any): Promise<boolean> => {
    if (!BASE_URL) {
      console.error('API base URL is not defined.');
      return false;
    }
    try {
      const response = await myClient.post(
        `${BASE_URL}${API_POST_PERSONAL_INFO_SAVE}`,
        payload,
      );
      if (response?.meta?.code === HTTP_STATUS_CODE.SUCCESS) {
        return true;
      }
    } catch (error) {
      console.error('Save personal info failed:', error);
    }
    return false;
  },
};
