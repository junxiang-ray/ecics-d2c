import type { AxiosResponse } from 'axios';

import {
  AnnouncementRequest,
  AnnouncementResponse,
  AnnouncementResponseData,
} from '@/libs/types/announcement';

import { useQuery } from '@tanstack/react-query';
import announcement from '@/api/base-service/announcement';

export const useAnnouncementPreview = () => {
  const fetchAnnouncements = async (): Promise<AnnouncementResponse> => {
    try {
      const resp: AxiosResponse<AnnouncementResponseData> =
        await announcement.getAnnouncements({
          sortField: 'createdAt',
          sortOrder: 'desc',
          pageNo: 1,
          pageSize: 2,
        });

      return resp?.data as unknown as AnnouncementResponse;
    } catch (e) {
      return {
        meta: {},
        data: null,
      } as unknown as AnnouncementResponse;
    }
  };

  return useQuery({
    queryFn: fetchAnnouncements,
    queryKey: ['announcements'],
    enabled: true,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};

export const useAnnouncements = (params: AnnouncementRequest | null) => {
  const fetchAnnouncements = async (): Promise<AnnouncementResponse> => {
    try {
      const resp: AxiosResponse<AnnouncementResponseData> =
        await announcement.getAnnouncements(
          params as unknown as AnnouncementRequest,
        );

      return resp?.data as unknown as AnnouncementResponse;
    } catch (e) {
      return {
        meta: {},
        data: null,
      } as unknown as AnnouncementResponse;
    }
  };

  return useQuery({
    queryFn: fetchAnnouncements,
    queryKey: ['announcements', params],
    enabled: !!params,
  });
};
