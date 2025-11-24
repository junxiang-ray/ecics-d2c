'use client';

import { Promotion } from '@/libs/types/promotion';

import { formatDateString } from '@/libs/utils/dayjs';

import { useRef } from 'react';
import { usePromotions } from '@/hook/promotion/promotion';

import { Carousel } from 'antd';

import Badge from '@/components/ui/Badge';
import RightOutlined from '@/assets/icons/add-on/right-outlined.svg';
import ExternalOutlined from '@/assets/icons/add-on/external-outlined.svg';

const Promotion = (): React.ReactNode => {
  const { data, isFetching } = usePromotions();

  const isDraggingRef = useRef(false);

  const promotions: Promotion[] = (data?.data ?? []) as unknown as Promotion[];

  const formatExpiredDate = (dateStr: string): string =>
    formatDateString(dateStr, 'YYYY-MM-DD', 'DD MMM YYYY') ?? '';
  const openLink = (url: string): void => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className='overflow-hdden'>
      <h2 className='mb-6 font-heading text-xl font-semibold text-gray-900'>
        Current Promotions
      </h2>
      <Carousel
        className='[&_.slick-slide]:shrink-0  [&_.slick-slide]:px-2'
        dots={{
          className: `bottom-[-1.5em] mr-[.2rem]
                        [&>li]:w-3 [&>li]:h-3 [&>li]:rounded-full [&>li]:bg-gray-300 [&>li:after]:h-full [&_.slick-active_button]:bg-primary-500 [&>li.slick-active:after]:bg-primary-500 [&_li:after]:transition-all [&_li:after]:duration-200
                        [&_button]:absolute [&_button]:inset-0 [&_button]:z-10 [&_button]:w-full [&_button]:h-full`,
        }}
        draggable
        slidesToShow={2}
        slidesToScroll={1}
        responsive={[
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
            },
          },
        ]}
        beforeChange={() => (isDraggingRef.current = true)}
        afterChange={() => {
          setTimeout(() => (isDraggingRef.current = false), 5);
        }}
      >
        {promotions.map((promotion, idx) => (
          <div
            key={promotion?.id ?? `promot_${idx}`}
            className='oerflow-hidden group mb-2.5 max-h-[282px] cursor-pointer select-none rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:border-[#02ADEF]/30 hover:shadow-md'
            title={promotion?.attributes?.title}
            onClick={() =>
              !isDraggingRef.current &&
              openLink(promotion?.attributes?.redirect_url)
            }
          >
            <div className='relative h-40 select-none overflow-hidden rounded-tl-xl rounded-tr-xl bg-gradient-to-r from-[#02ADEF]/10 to-blue-50'>
              <img
                src={
                  promotion?.attributes?.featured_image?.data?.attributes?.url
                }
                alt={promotion?.attributes?.title}
                className='h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-90'
              />
              <div className='absolute right-2 top-2 rounded bg-black/20 p-1 text-[.6rem] text-white/70 group-hover:bg-black/30 group-hover:text-white/90 '>
                <ExternalOutlined />
              </div>
            </div>
            <div className='p-6'>
              <div className='mb-3 flex items-start justify-between'>
                <h3 className='truncate pr-2 font-heading text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#02ADEF]'>
                  {promotion?.attributes?.title}
                </h3>
                <Badge
                  color='cyan'
                  content={formatExpiredDate(
                    promotion?.attributes?.expired_date,
                  )}
                />
              </div>
              <p
                className='mb-4 line-clamp-3 overflow-hidden font-body text-sm text-gray-600'
                title={promotion?.attributes?.description}
              >
                {promotion?.attributes?.description}
              </p>
              <div className='flex items-center text-[#02ADEF] transition-colors duration-200 group-hover:text-[#02ADEF]/80'>
                <span className='mr-2 font-body text-sm font-normal'>
                  Learn More
                </span>
                <RightOutlined />
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
export default Promotion;
