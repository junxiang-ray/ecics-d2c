import type { AxiosResponse } from 'axios';

import {
  AnnouncementRequest,
  AnnouncementResponseData,
} from '@/libs/types/announcement';

import { API_ANNOUNCEMENT_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAnnouncement<T = AnnouncementResponseData>(
    payload: AnnouncementRequest,
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
    });
  },
};
