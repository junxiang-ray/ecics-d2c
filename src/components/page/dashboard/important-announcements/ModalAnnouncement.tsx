'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Announcement, AnnouncementPayload } from '@/libs/types/announcement';
import { useAnnouncements } from '@/hook/announcement/announcement';

import { Modal, Skeleton } from 'antd';
import Pagination from '@/components/pagination/Pagination';
import PaginationSimple from '@/components/pagination/PaginationSimple';
import Card from '@/components/page/announcement/AnnouncementCard';

const SearchPayloadDefaults: Required<AnnouncementPayload> = {
  sortField: 'publishedAt',
  sortOrder: 'desc',
  pageNo: 1,
  pageSize: 5,
} as const;

interface Props {
  open: boolean;
  onCancel: () => void;
  onShowDetail: (data: Announcement) => void;
}

const ModalAnnouncement = ({
  open,
  onCancel,
  onShowDetail,
}: Props): ReactNode => {
  const totalRecordRef = useRef(0);

  const [searchPayload, setSearchPayload] =
    useState<AnnouncementPayload | null>(null);

  const { data, isFetching } = useAnnouncements(searchPayload);

  useEffect(() => {
    if (open) setSearchPayload({ ...SearchPayloadDefaults });
  }, [open]);

  const totalRecords = useMemo<number>(() => {
    if (isFetching) return totalRecordRef.current;

    return (totalRecordRef.current = data?.meta?.pagination?.total ?? 0);
  }, [isFetching, data?.meta?.pagination?.total]);

  const pageNo: number = searchPayload?.pageNo ?? 0;
  const pageSize: number = searchPayload?.pageSize ?? 0;
  const totalPage: number = data?.meta?.pagination?.pageCount ?? 0;

  const announcements: Array<Announcement | null> =
    data?.data == null && isFetching ? [null] : (data?.data ?? []);

  const onModalCancel = (): void => {
    setSearchPayload((prev) => ({ ...prev, pageNo: 0 }));
    onCancel();
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
          'rounded-3xl overflow-hidden p-0 max-h-[90vh] w-fit max-w-4xl shadow-2xl',
        body: 'w-fit',
        footer: 'm-0',
      }}
      destroyOnClose
      title={
        <div className='border-b border-gray-200 bg-gray-50 p-6 pr-[4rem]'>
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
          <Pagination
            total={totalRecords}
            pageNo={pageNo}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </div>
      }
      onCancel={onModalCancel}
    >
      <div className='h-[60vh] w-fit px-5 py-6'>
        <div className='mb-4 px-1'>
          <PaginationSimple
            total={totalRecords}
            page={pageNo}
            pageCount={totalPage}
            defaultPage={SearchPayloadDefaults.pageNo}
            onChange={onPageChange}
          />
        </div>

        <div className='mb-4 max-h-[calc(60vh-8rem)] w-fit min-w-[min(50rem,80svw)] overflow-auto px-1 [&_>:not(:last-child)]:mb-3'>
          {data == null && isFetching ? (
            <div className='min-h-[200px]'>
              <Skeleton.Input block active className='h-[50px] opacity-50' />
            </div>
          ) : (
            announcements.map((ann, idx) => (
              <Card
                key={ann?.id ?? idx}
                data={ann}
                onShowDetail={onShowDetail}
              />
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
export default ModalAnnouncement;
