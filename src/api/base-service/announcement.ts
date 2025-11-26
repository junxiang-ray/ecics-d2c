import type { AxiosResponse } from 'axios';

import {
  AnnouncementPayload,
  AnnouncementResponseData,
} from '@/libs/types/announcement';

import { API_ANNOUNCEMENT_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAnnouncements<T = AnnouncementResponseData>(
    payload: AnnouncementPayload,
  ): Promise<AxiosResponse<T>> {
    const params = {
      sort: payload.sortField
        ? `${payload.sortField}:${payload.sortOrder}`
        : undefined,
      pagination: {
        page: payload.pageNo,
        pageSize: payload.pageSize,
      },
    };

    return baseClient.get<T>(`${API_ANNOUNCEMENT_GET}`, {
      params,
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_CMS_TOKEN}`,
      },
      baseURL: process.env.NEXT_PUBLIC_API_CMS_BASE_URL,
    });
  },
};
