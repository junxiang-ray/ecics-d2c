'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Announcement, AnnouncementRequest } from '@/libs/types/announcement';
import { useAnnouncements } from '@/hook/announcement/announcement';

import { Modal, Pagination, Skeleton } from 'antd';

import Card from '@/components/page/announcement/AnnouncementCard';

import RightOutlined from '@/assets/icons/add-on/right-outlined.svg';
import LeftOutlined from '@/assets/icons/add-on/left-outlined.svg';

const SearchPayloadDefaults: AnnouncementRequest = {
  sortField: 'publishedAt',
  sortOrder: 'desc',
  pageNo: 1,
  pageSize: 5,
} as const;

interface Props {
  open: boolean;
  onCancel: () => void;
}

const ModalAnnouncement = ({ open, onCancel }: Props) => {
  const totalRecordRef = useRef(0);

  const [searchPayload, setSearchPayload] =
    useState<AnnouncementRequest | null>(null);

  const { data, isFetching } = useAnnouncements(searchPayload);

  useEffect(() => {
    if (open) setSearchPayload({ ...SearchPayloadDefaults });
  }, [open]);

  const totalRecords = useMemo<number>(() => {
    if (isFetching) return totalRecordRef.current;

    return (totalRecordRef.current = data?.pagination?.total ?? 0);
  }, [isFetching, data?.pagination?.total]);

  const pageNo: number = searchPayload?.pageNo ?? 0;
  const pageSize: number = searchPayload?.pageSize ?? 0;
  const totalPage: number = data?.pagination?.pageCount ?? 0;
  const itemFrom: number = (pageNo - 1) * pageSize + 1;
  const itemTo: number = Math.min(pageNo * pageSize, totalRecords);

  const announcements: Array<Announcement | null> =
    data == null && isFetching ? [null] : (data?.results ?? []);

  const onModalCancel = (): void => {
    setSearchPayload((prev) => ({ ...prev, pageNo: 0 }));
    onCancel();
  };

  const pageItemRender = (
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
  };

  const onPageChange = (pageNo: number): void => {
    setSearchPayload((prev) => ({ ...prev, pageNo }));
  };

  return (
    <Modal
      open={open}
      centered
      className='w-fit'
      classNames={{
        mask: 'bg-black/50 backdrop-blur-sm',
        content:
          'rouneded-3xl overflow-hidden p-0 max-h-[90vh] w-fit max-w-4xl shadow-2xl',
        body: 'w-fit',
        footer: 'm-0',
      }}
      title={
        <div className='border-b border-gray-200 bg-gray-50 p-6'>
          <h2 className='font-heading text-2xl font-semibold text-gray-900'>
            Announcements
          </h2>
          <p className='mt-1 font-body text-sm text-gray-600'>
            Stay updated with important information and updates
          </p>
        </div>
      }
      footer={
        <div className='rounded-bl-md rounded-br-md border-t border-gray-200 bg-gray-50 px-6 py-4 '>
          <div className='flex items-center justify-between gap-2'>
            <span className='font-body text-sm text-gray-600'>
              Showing {itemFrom} to {itemTo} of {totalRecords} announcements
            </span>
            <Pagination
              align='start'
              size='small'
              current={pageNo}
              total={totalRecords}
              defaultPageSize={pageSize}
              itemRender={pageItemRender}
              onChange={(pageNo: number) => onPageChange(pageNo)}
            />
          </div>
        </div>
      }
      onCancel={onModalCancel}
    >
      <div className='h-[60vh] w-fit px-5 py-6'>
        <div className='mb-4 flex items-center justify-between px-1'>
          <p className='font-body text-sm text-gray-600'>
            {totalRecords} announcements
          </p>
          <div className='flex items-center space-x-2'>
            <button
              className='rounded-md p-1 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
              disabled={pageNo === SearchPayloadDefaults.pageNo}
              onClick={() => onPageChange(pageNo - 1)}
            >
              <LeftOutlined />
            </button>
            <span className='font-body text-sm text-gray-600'>
              {pageNo} of {totalPage}
            </span>
            <button
              className='rounded-md p-1 transition-colors duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
              disabled={pageNo === totalPage}
              onClick={() => onPageChange(pageNo + 1)}
            >
              <RightOutlined />
            </button>
          </div>
        </div>

        <div className='mb-4 max-h-[calc(60vh-8rem)] w-fit min-w-[50rem] overflow-auto px-1 [&_>:not(:last-child)]:mb-3'>
          {data == null && isFetching ? (
            <div className='min-h-[200px]'>
              <Skeleton.Input block active className='h-[50px] opacity-50' />
            </div>
          ) : (
            announcements.map((ann, idx) => (
              <Card key={ann?.id ?? idx} data={ann} />
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
export default ModalAnnouncement;
