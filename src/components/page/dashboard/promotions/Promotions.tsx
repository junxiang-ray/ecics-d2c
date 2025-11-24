'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { Promotion } from '@/libs/types/promotion';
import { usePromotions } from '@/hook/promotion/promotion';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import PromotionCard from './PromotionCard';

const Promotions = (): React.ReactNode => {
  const { data, isFetching } = usePromotions();

  const promotions: Promotion[] = (data?.data ?? []) as unknown as Promotion[];

  const openLink = (url: string): void => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className='overflow-hidden'>
      <h2 className='mb-6 font-heading text-xl font-semibold text-gray-900'>
        Current Promotions
      </h2>
      <Swiper
        className='pb-[2.5rem] [&_.swiper-pagination-bullet-active]:scale-110 [&_.swiper-pagination-bullet]:transition-transform [&_.swiper-pagination-bullet]:duration-200'
        modules={[Pagination]}
        spaceBetween={14}
        loop
        slidesPerView={2}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
        }}
        pagination={{ clickable: true }}
        style={{
          '--swiper-pagination-bullet-width': '.75rem',
          '--swiper-pagination-bullet-height': '.75rem',
          '--swiper-pagination-color': '#02adef',
        }}
      >
        {promotions.map((promotion, idx) => (
          <SwiperSlide key={promotion?.id ?? `promot_${idx}`}>
            <PromotionCard
              data={promotion}
              onClick={() => openLink(promotion?.attributes?.redirect_url)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default Promotions;
