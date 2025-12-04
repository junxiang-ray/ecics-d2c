'use client';

import { useState } from 'react';
import { Announcement } from '@/libs/types/announcement';
import { useAnnouncementPreview } from '@/hook/announcement/announcement';

import ModalAnnouncement from './ModalAnnouncement';
import ModalDetail from '@/components/page/announcement/ModalAnnouncementDetail';
import Card from '@/components/page/announcement/AnnouncementCard';
import RightOutlined from '@/assets/icons/add-on/right-outlined.svg';

const ImportantAnnouncements = (): JSX.Element => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selAnnouncement, setSelAnnouncement] = useState<Announcement | null>(
    null,
  );
  const { data, isFetching } = useAnnouncementPreview();

  const announcements: Array<Announcement | null> =
    data?.data == null && isFetching ? [null, null] : (data?.data ?? []);

  return (
    <>
      <div>
        <div className='mb-6 flex items-center justify-between'>
          <div className='display-2 font-heading text-xl font-semibold text-gray-900'>
            Important Announcements
          </div>
          <button
            className='font-body flex items-center gap-1 rounded text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
            onClick={() => setIsOpenModal(true)}
          >
            View More
            <RightOutlined className='text-lg' />
          </button>
        </div>
        <div className='[&_>:not(:last-child)]:mb-4'>
          {announcements.map((ann, idx) => (
            <Card
              key={ann?.id ?? idx}
              data={ann}
              onShowDetail={(ann) => setSelAnnouncement(ann)}
            />
          ))}
        </div>
      </div>

      <ModalAnnouncement
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onShowDetail={(ann) => setSelAnnouncement(ann)}
      />
      <ModalDetail
        open={!!selAnnouncement}
        announcement={selAnnouncement}
        onModalCancel={() => setSelAnnouncement(null)}
      />
    </>
  );
};
export default ImportantAnnouncements;
