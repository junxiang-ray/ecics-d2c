'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import PlanItem, { DataPlanItem } from './PlanItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLayoutEffect, useState } from 'react';
import { PrimaryButton } from '@/components/ui/buttons';
import SelfDeclarationModal from './SelfDeclarationContent';
import { Drawer } from 'antd';
import SelfDeclarationContent from './SelfDeclarationContent';
const plans: DataPlanItem[] = [
  {
    title: 'Third Party & Theft',
    activeFeatures: [
      'Third-Party liability coverage relating to vehicle charging',
      'Free NCD Protector (from 10%) & Waiver of Excess',
      'Up to $50,000 complimentary Personal Accident coverage',
      'Complete Vehicle Coverage',
      'Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models',
    ],
    inactiveFeatures: [],
    price: 'S$ 2700',
    discountedPrice: 'S$ 3200',
    discount: 'CARS 15 (15% off applied)',
    recommended: true,
  },
  {
    title: 'Comprehensive Plan',
    activeFeatures: [
      'Third-Party liability coverage relating to vehicle charging',
      'Free NCD Protector (from 10%) & Waiver of Excess',
      'Up to $50,000 complimentary Personal Accident coverage',
    ],
    inactiveFeatures: [
      'Complete Vehicle Coverage',
      'Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models',
    ],
    price: 'S$ 2700',
    discountedPrice: 'S$ 3200',
    discount: 'CARS 15 (15% off applied)',
    recommended: false,
  },
  {
    title: 'Comprehensive Plan',
    activeFeatures: [
      'Third-Party liability coverage relating to vehicle charging',
      'Free NCD Protector (from 10%) & Waiver of Excess',
      'Up to $50,000 complimentary Personal Accident coverage',
    ],
    inactiveFeatures: [
      'Complete Vehicle Coverage',
      'Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models',
    ],
    price: 'S$ 2700',
    discountedPrice: 'S$ 3200',
    discount: 'CARS 15 (15% off applied)',
    recommended: false,
  },
];

const PlanPage = () => {
  const [screenWidth, setScreenWith] = useState(0);
  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  useLayoutEffect(() => {
    if (!window?.innerWidth) return;
    setScreenWith(window?.innerWidth - 32);
  }, []);

  return (
    <div className='flex w-full flex-col justify-center'>
      <div
        className='mx-4'
        // When using Next.js (SSR), Swiper may throw a "createContext" error due to server-side rendering issues.
        // This can lead to incorrect width calculations for the Swiper component.
        // To address this, we recalculate the width dynamically on the client side.
        style={{
          width: screenWidth,
        }}
      >
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation
          modules={[Navigation]}
        >
          {plans.map((plan, index) => (
            <SwiperSlide key={index}>
              <PlanItem
                isRecommended={plan.recommended}
                data={plan}
                active={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className='fixed bottom-0 z-10 mt-4 flex w-full justify-between border-t-2 bg-white p-4 py-2 shadow-md shadow-gray-500'>
        <div>
          <p>
            <span className='text-lg font-semibold'>S$ 2700</span>{' '}
            <span className='text-lg font-semibold text-red-500'>$3200</span>
          </p>
          <p className='font-semibold'>(inclusive of GST)</p>
        </div>
        <PrimaryButton onClick={() => setShowConfirmDeclaration(true)}>
          Continue
        </PrimaryButton>
      </div>
      <Drawer
        open={showConfirmDeclaration}
        onClose={() => setShowConfirmDeclaration(false)}
        placement='bottom'
        closable={false}
        height='auto'
      >
        <SelfDeclarationContent
          onSave={() => setShowConfirmDeclaration(false)}
        />
      </Drawer>
    </div>
  );
};

export default PlanPage;
