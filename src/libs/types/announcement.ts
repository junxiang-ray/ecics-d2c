import { Pagination, PaginationMetaData, SortOrder } from '@/libs/types/common';
import { NotificationCategory } from '@/libs/types/notification';

type SortField = keyof Announcement['attributes'];

export type AnnouncementPayload = Pagination &
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
      category: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }>;
  meta: { pagination: PaginationMetaData };
};

export interface AnnouncementResponse
  extends Pick<AnnouncementResponseData, 'meta'> {
  data: Announcement[];
}

export type Announcement = {
  id: AnnouncementResponseData['data'][number]['id'];
  attributes: Omit<
    AnnouncementResponseData['data'][number]['attributes'],
    'category'
  > & {
    category: NotificationCategory;
  };
};

export interface AnnouncementDetail extends Announcement {
  content: string;
}
