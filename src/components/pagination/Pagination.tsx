import type { ReactNode } from 'react';

import { Pagination as AntPagination } from 'antd';

import RightOutlined from '@/assets/icons/add-on/right-outlined.svg';
import LeftOutlined from '@/assets/icons/add-on/left-outlined.svg';

interface Props {
  total: number;
  pageNo: number;
  pageSize: number;
  onChange: (pageNo: number, pageSize: number) => void;
}

const Pagination = ({
  total,
  pageNo,
  pageSize,
  onChange,
}: Props): ReactNode => {
  const itemFrom: number = (pageNo - 1) * pageSize + 1;
  const itemTo: number = Math.min(pageNo * pageSize, total);

  return (
    <div className='flex items-center justify-between gap-2'>
      <span className='font-body text-sm text-gray-600'>
        Showing {itemFrom} to {itemTo} of {total} announcements
      </span>
      <AntPagination
        align='start'
        size='small'
        total={total || 0}
        current={pageNo}
        pageSize={pageSize}
        defaultPageSize={1}
        itemRender={(
          _: unknown,
          type: 'next' | 'page' | 'prev' | 'jump-prev' | 'jump-next',
          originalElement: ReactNode,
        ): ReactNode => {
          if (type === 'prev')
            return (
              <a className='mr-2 flex h-8 flex-nowrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm leading-none'>
                <LeftOutlined />
                Previous
              </a>
            );

          if (type === 'next')
            return (
              <a className='ml-2 flex h-8 flex-nowrap items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm leading-none'>
                Next
                <RightOutlined />
              </a>
            );

          return originalElement;
        }}
        onChange={onChange}
      />
    </div>
  );
};
export default Pagination;
