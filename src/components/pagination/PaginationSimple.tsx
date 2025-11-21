import type { ReactNode } from 'react';

import { Button, Pagination as AntPagination } from 'antd';

import RightOutlined from '@/assets/icons/add-on/right-outlined.svg';
import LeftOutlined from '@/assets/icons/add-on/left-outlined.svg';

interface Props {
  total: number;
  page: number;
  defaultPage: number;
  pageCount: number;
  onChange: (page: number) => void;
}

const PaginationSimple = ({
  total,
  page,
  defaultPage,
  pageCount,
  onChange,
}: Props) => {
  const isFirstPage: boolean = page === defaultPage;
  const isLastPage: boolean = page === pageCount;

  const onPrevious = (): void => {
    onChange(page - 1);
  };

  const onNext = (): void => {
    onChange(page + 1);
  };

  return (
    <div className='flex items-center justify-between'>
      <p className='font-body text-sm text-gray-600'>{total} announcements</p>
      <div className='flex items-center space-x-2'>
        <Button
          className='rounded-md p-1 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          type='text'
          disabled={isFirstPage}
          onClick={onPrevious}
        >
          <LeftOutlined />
        </Button>
        <span className='font-body text-sm text-gray-600'>
          {page} of {pageCount}
        </span>
        <Button
          className='rounded-md p-1 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={isLastPage}
          type='text'
          onClick={onNext}
        >
          <RightOutlined />
        </Button>
      </div>
    </div>
  );
};
export default PaginationSimple;
