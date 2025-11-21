export type SortOrder = 'asc' | 'desc';

export type Pagination = {
  pageNo?: number;
  pageSize?: number;
};

export type PaginationMetaData = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};
