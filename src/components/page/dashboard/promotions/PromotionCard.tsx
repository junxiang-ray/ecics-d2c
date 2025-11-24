import { Promotion } from '@/libs/types/promotion';

import { formatDateString } from '@/libs/utils/dayjs';

import React from 'react';

import Badge from '@/components/ui/Badge';
import RightOutlined from '@/assets/icons/add-on/right-outlined.svg';
import ExternalOutlined from '@/assets/icons/add-on/external-outlined.svg';

type Props = {
  data: Promotion;
  onClick: (evt: MouseEvent) => void;
};

const PromotionCard = ({ data, onClick }: Props): React.ReactNode => {
  if (!data) return null;

  const formatExpiredDate = (dateStr: string): string =>
    formatDateString(dateStr, 'YYYY-MM-DD', 'DD MMM YYYY') ?? '';

  return (
    <div
      className='oerflow-hidden group mb-2.5 max-h-[282px] cursor-pointer select-none rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#02ADEF]/30 hover:shadow-md'
      title={data?.attributes?.title}
      onClick={onClick}
    >
      <div className='relative h-40 select-none overflow-hidden rounded-tl-xl rounded-tr-xl bg-gradient-to-r from-[#02ADEF]/10 to-blue-50'>
        <img
          src={data?.attributes?.featured_image?.data?.attributes?.url}
          alt={data?.attributes?.title}
          className='h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-90'
        />
        <div className='absolute right-2 top-2 rounded bg-black/20 p-1 text-[.6rem] text-white/70 group-hover:bg-black/30 group-hover:text-white/90 '>
          <ExternalOutlined />
        </div>
      </div>
      <div className='p-6'>
        <div className='mb-3 flex items-start justify-between'>
          <h3 className='truncate pr-2 font-heading text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#02ADEF]'>
            {data?.attributes?.title}
          </h3>
          <Badge
            color='cyan'
            content={formatExpiredDate(data?.attributes?.expired_date)}
          />
        </div>
        <p
          className='mb-4 line-clamp-3 overflow-hidden font-body text-sm text-gray-600'
          title={data?.attributes?.description}
        >
          {data?.attributes?.description}
        </p>
        <div className='flex items-center text-[#02ADEF] transition-colors duration-200 group-hover:text-[#02ADEF]/80'>
          <span className='mr-2 font-body text-sm font-normal'>Learn More</span>
          <RightOutlined />
        </div>
      </div>
    </div>
  );
};
export default PromotionCard;
