import { SortOrder, Pagination, PaginationMetaData } from '@/libs/types/common';
import { NotificationPriority } from '@/libs/types/notification';

type SortField = keyof Announcement['attributes'];

export type AnnouncementRequest = Pagination &
  Partial<{
    sortField?: SortField;
    sortOrder?: SortOrder;
  }>;

export type AnnouncementResponseData = {
  data: Array<{
    id: number;
    attributes: {
      title: string;
      description: string;
      content: string;
      priority: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }>;
  meta: { pagination: PaginationMetaData };
};

export interface AnnouncementResponse {
  message: string;
  pagination: Partial<PaginationMetaData>;
  results: Announcement[];
}

export type Announcement = {
  id: AnnouncementResponseData['data'][number]['id'];
  attributes: Omit<
    AnnouncementResponseData['data'][number]['attributes'],
    'priority'
  > & {
    priority: NotificationPriority;
  };
};

export interface AnnouncementDetail extends Announcement {
  content: string;
}
