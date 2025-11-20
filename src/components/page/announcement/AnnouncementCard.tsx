import { Announcement } from '@/libs/types/announcement';
import { formatDateString } from '@/libs/utils/dayjs';

import { Skeleton } from 'antd';

import Badge from '@/components/ui/Badge';
import BellOutlined from '@/assets/icons/add-on/bell-outlined.svg';
import BoxIcon from '@/components/ui/BoxIcon';
import InfoCircleOutlined from '@/assets/icons/add-on/info-circle-outlined.svg';
import RightOulined from '@/assets/icons/add-on/right-outlined.svg';
import WarnTriableOutlined from '@/assets/icons/add-on/warning-triangle-outlined.svg';

interface Props {
  data?: Announcement | null;
  onShowDetail?: (data: Announcement) => void;
}

const AnnouncementCard = ({ data, onShowDetail }: Props): JSX.Element => {
  if (data == null)
    return (
      <div className='group rounded-xl border border-gray-200 bg-white'>
        <Skeleton.Input active block className='h-[141px] opacity-50' />
      </div>
    );

  const announcementDetail: Announcement['attributes'] = data?.attributes ?? {};

  const notiIconClr: string =
    announcementDetail.priority === 'Urgent'
      ? 'text-red-600'
      : announcementDetail.priority === 'Notice'
        ? 'text-orange-600'
        : 'text-gray-600';

  const notiBadgeClr =
    announcementDetail.priority === 'Urgent'
      ? 'red'
      : announcementDetail.priority === 'Notice'
        ? 'orange'
        : 'gray';

  const notiIcon: JSX.Element =
    announcementDetail.priority === 'Urgent' ? (
      <WarnTriableOutlined width='14' height='14' />
    ) : announcementDetail.priority === 'Notice' ? (
      <InfoCircleOutlined width='14' height='14' />
    ) : (
      <BellOutlined width='14' height='14' />
    );

  const createdDate: string =
    formatDateString(
      announcementDetail.publishedAt,
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
      'DD MMM YYYY',
    ) ?? '';

  return (
    <div
      className='group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-orange-300 hover:shadow-lg'
      onClick={onShowDetail && (() => onShowDetail(data))}
    >
      <div className='mb-3 flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <BoxIcon className={notiIconClr} icon={notiIcon} size='sm' />
          <div>
            <h3 className='font-heading text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-orange-600'>
              {announcementDetail.title}
            </h3>
            <p className='mt-1 font-body text-xs text-gray-500'>
              {createdDate}
            </p>
          </div>
        </div>
        <Badge
          size='sm'
          color={notiBadgeClr}
          content={announcementDetail.priority}
        />
      </div>
      <p className='mb-4 font-body text-sm text-gray-600'>
        {announcementDetail.description}
      </p>
      <div className='flex items-center text-orange-600 transition-colors duration-200 group-hover:text-orange-700'>
        <span className='mr-2 font-body text-sm font-semibold'>
          Read Full Details
        </span>
        <RightOulined />
      </div>
    </div>
  );
};
export default AnnouncementCard;
