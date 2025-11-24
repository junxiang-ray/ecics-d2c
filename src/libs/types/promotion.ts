import { SortOrder, Pagination, PaginationMetaData } from '@/libs/types/common';
import { NotificationPriority } from '@/libs/types/notification';

type SortField = keyof PromotionAttributes;

export type PromotionPayload = Pagination &
  Partial<{
    sortField?: SortField;
    sortOrder?: SortOrder;
  }>;

export type PromotionResponseData = {
  data: Array<{
    id: number;
    attributes: PromotionAttributes;
  }>;
  meta: { pagination: PaginationMetaData };
};

export type PromotionResponse = {
  message: string;
  pagination: Partial<PaginationMetaData>;
  results: Promotion[];
};

export type Promotion = {
  id: PromotionResponseData['data'][number]['id'];
  attributes: PromotionAttributes;
};

export type PromotionAttributes = {
  title: string;
  description: string;
  redirect_url: string;
  expired_date: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  featured_image: {
    data: ImageData;
  };
};

export type ImageAttributes = {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    small?: ImageFormat;
    medium?: ImageFormat;
    thumbnail?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
};

export type ImageData = {
  id: number;
  attributes: ImageAttributes;
};

export type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
};
