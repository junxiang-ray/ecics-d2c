import { Announcement } from '@/libs/types/announcement';
import { Props as BadgeProps } from '@/components/ui/Badge';

import { formatDateString } from '@/libs/utils/dayjs';

import { Button, Modal } from 'antd';

import Badge from '@/components/ui/Badge';
import BellOutlined from '@/assets/icons/add-on/bell-outlined.svg';
import BoxIcon from '@/components/ui/BoxIcon';
import CalendarOutlined from '@/assets/icons/add-on/calendar-outlined.svg';
import InfoCircleOutlined from '@/assets/icons/add-on/info-circle-outlined.svg';
import WarnTriableOutlined from '@/assets/icons/add-on/warning-triangle-outlined.svg';

interface Props {
  open: boolean;
  announcement: Announcement | null;
  onModalCancel: () => void;
}

const ModalAnnouncementDetail = ({
  open,
  announcement,
  onModalCancel,
}: Props): JSX.Element | null => {
  const detail: Announcement['attributes'] = announcement?.attributes ?? {};

  if (!announcement) return null;

  const notiIconClr: string =
    detail.priority === 'Urgent'
      ? 'text-red-600'
      : detail.priority === 'Notice'
        ? 'text-orange-600'
        : 'text-gray-600';

  const notiBadgeClr: BadgeProps['color'] =
    detail.priority === 'Urgent'
      ? 'red'
      : detail.priority === 'Notice'
        ? 'orange'
        : 'gray';

  const notiIcon: JSX.Element =
    detail.priority === 'Urgent' ? (
      <WarnTriableOutlined width='18' height='18' />
    ) : detail.priority === 'Notice' ? (
      <InfoCircleOutlined width='18' height='18' />
    ) : (
      <BellOutlined width='18' height='18' />
    );

  const publishDate: string =
    formatDateString(
      detail.publishedAt,
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
      'DD MMM YYYY',
    ) ?? '';

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
      footer={
        <div className='mx-6 mb-6 mt-8 flex justify-end border-t border-gray-200 pt-4'>
          <Button
            className='rounded-lg bg-[#02ADEF] px-6 py-2 font-body text-sm font-medium text-white transition-colors duration-200 hover:bg-[#02ADEF]/90'
            type='primary'
            onClick={onModalCancel}
          >
            Close
          </Button>
        </div>
      }
      title={
        <div className='border-b border-gray-200 bg-gray-50 p-6 shadow-sm'>
          <h2 className='font-heading text-2xl font-semibold text-gray-900'>
            {detail.title}&nbsp;
          </h2>
          <p className='mt-1 font-body text-sm text-gray-600'>
            Published on {publishDate}
          </p>
        </div>
      }
      onCancel={onModalCancel}
    >
      <div className='flex h-[60vh] w-fit flex-col overflow-y-hidden'>
        <div className='h-0 flex-1 overflow-auto will-change-transform'>
          <div className='mb-6 mt-4 flex items-start gap-4 px-5'>
            <BoxIcon className={notiIconClr} icon={notiIcon} />
            <div className='items-top flex min-w-0 flex-1 gap-4 text-sm text-gray-500'>
              <div className='flex items-center gap-1'>
                <CalendarOutlined className='' width='14' height='14' />
                <span className='font-body'>{publishDate}</span>
              </div>
              <Badge
                bordered
                color={notiBadgeClr}
                content={detail.priority}
                size='lg'
              />
            </div>
          </div>

          <div className='whitespace-pre-line px-5 font-body leading-relaxed text-gray-700'>
            {detail.content}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ModalAnnouncementDetail;
