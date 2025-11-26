export type SortOrder = 'asc' | 'desc';

export type Gener = 'MALE' | 'FEMALE';

export type MaritalStatus = 'MARRIED' | 'SINGLE' | 'WIDOWED' | 'DIVORCED';

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

export type Address = {
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  postal_code?: string;
};
