'use client';

import { PrimaryButton } from '@/components/ui/buttons';
import { useCreateQuote, useGetQuote } from '@/hook/insurance/quote';
import { useEffect, useLayoutEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import PlanCardDesktop from './components/PlanCardDesktop';
import PlanCardMobile from './components/PlanCardMobile';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';
import { useSearchParams } from 'next/navigation';

function PlanPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';

  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  const { data: quoteInfo, isLoading } = useGetQuote(key);
  const plans = quoteInfo?.data?.plans ?? [];

  return (
    <div className='flex w-full flex-col justify-center'>
      {/* UI for Mobile */}
      <div className='mx-4 md:hidden'>
        <PlanCardMobile plans={plans} />
      </div>

      {/* UI for Desktop */}
      <div className='hidden pt-4 md:block'>
        <PlanCardDesktop plans={plans} />
      </div>
      <div className='fixed bottom-0 left-1/2 z-10 mt-4 w-full -translate-x-1/2 transform shadow-sm shadow-gray-300 md:bottom-14  md:max-w-[600px] md:rounded-md md:border-none'>
        <div className='flex w-full justify-between border-t-2 bg-white p-4 py-2 md:border-none md:py-4'>
          <div className='md:flex md:items-center md:gap-4'>
            <p>
              <span className='text-lg font-semibold md:text-3xl'>S$ 2700</span>{' '}
              <span className='text-lg font-semibold text-red-500 md:text-2xl'>
                $3200
              </span>
            </p>
            <p className='font-semibold'>(15 inclusive of GST)</p>
          </div>
          <PrimaryButton
            onClick={() => setShowConfirmDeclaration(true)}
            className='md:w-40'
          >
            Continue
          </PrimaryButton>
        </div>
      </div>

      <SelfDeclarationConfirmModal
        visible={showConfirmDeclaration}
        onOk={() => setShowConfirmDeclaration(false)}
      />
    </div>
  );
}

export default PlanPage;
