import { useQuery } from '@tanstack/react-query';

import {
  Announcement,
  AnnouncementRequest,
  AnnouncementResponse,
  AnnouncementResponseData,
} from '@/libs/types/announcement';

import announcement from '@/api/base-service/announcement';

export const useAnnouncementPreview = () => {
  const fetchAnnouncements = async (): Promise<AnnouncementResponse> => {
    try {
      const resp: AnnouncementResponseData = await announcement.getAnnouncement(
        { sortField: 'createdAt', sortOrder: 'desc', pageNo: 1, pageSize: 2 },
      );

      return {
        message: '',
        pagination: resp?.data?.meta?.pagination,
        results: (resp?.data?.data ?? []) as unknown as Announcement[],
      };
    } catch (e) {
      return {
        message: '',
        pagination: { total: 0 },
        results: [],
      };
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

export const useAnnouncements = (params: AnnouncementRequest) => {
  const fetchAnnouncements = async (): Promise<AnnouncementResponse> => {
    try {
      const resp: AnnouncementResponseData =
        await announcement.getAnnouncement(params);

      return {
        message: '',
        pagination: resp?.data?.meta?.pagination,
        results: (resp?.data?.data ?? []) as unknown as Announcement[],
      };
    } catch (e) {
      return {
        message: '',
        pagination: { total: 0 },
        results: [],
      };
    }
  };

  return useQuery({
    queryFn: fetchAnnouncements,
    queryKey: ['announcements', params],
    enabled: !!params,
  });
};
