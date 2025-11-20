import {
  AnnouncementRequest,
  AnnouncementResponseData,
} from '@/libs/types/announcement';

import { API_ANNOUNCEMENT_GET } from '@/constants/api.constant';

import baseClient from './api.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAnnouncement<T = { data: AnnouncementResponseData }>(
    payload: AnnouncementRequest,
  ): Promise<T> {
    const params = {
      sort: payload.sortField
        ? `${payload.sortField}:${payload.sortOrder}`
        : undefined,
      pagination: {
        page: payload.pageNo,
        pageSize: payload.pageSize,
      },
    };

    return baseClient.get<AnnouncementResponseData>(`${API_ANNOUNCEMENT_GET}`, {
      params,
    });
  },
};
