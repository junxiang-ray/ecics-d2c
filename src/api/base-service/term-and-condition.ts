import type { AxiosResponse } from 'axios';

import { TermAndConditionResponseData } from '@/libs/types/term-and-condition';

import { API_TERM_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getTermAndConditions<T = TermAndConditionResponseData>(): Promise<
    AxiosResponse<T>
  > {
    return baseClient.get<T>(`${API_TERM_GET}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_CMS_TOKEN}`,
      },
      baseURL: process.env.NEXT_PUBLIC_API_CMS_BASE_URL,
    });
  },
};
