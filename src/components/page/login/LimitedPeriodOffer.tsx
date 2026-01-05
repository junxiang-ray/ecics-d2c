'use client';

import { useState } from 'react';

import CouponIcon from '@/components/icons/CouponIcon';
import PromoTickIcon from '@/components/icons/PromoTickIcon';

import { PromoCodeResponse } from '@/api/base-service/verify';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import MaidItem from './limited-offer-products/MaidItem';
import CarItem from './limited-offer-products/CarItem';
import MotorcycleItem from './limited-offer-products/MotorcycleItem';

type LimitedPeriodOfferProps = {
  promoCode: string;
  promoCodeData: PromoCodeResponse;
  productType: ProductType;
};

const LimitedPeriodOffer = ({
  promoCode,
  promoCodeData,
  productType,
}: LimitedPeriodOfferProps) => {
  const { isMobile } = useDeviceDetection();
  const description = promoCodeData?.data?.description;
  const isMaid = productType === ProductType.MAID;
  const isMotorcycle = productType === ProductType.MOTORCYCLE;
  const [copied, setCopied] = useState(false);

  return isMaid ? (
    <MaidItem
      promoCode={promoCode}
      discount={promoCodeData?.data?.discount}
      description={description}
      isMobile={isMobile}
      startTime={promoCodeData?.data?.start_time}
      endTime={promoCodeData?.data?.end_time}
    ></MaidItem>
  ) : isMotorcycle ? (
    <MotorcycleItem
      promoCode={promoCode}
      discount={promoCodeData?.data?.discount}
      description={description}
      isMobile={isMobile}
    ></MotorcycleItem>
  ) : (
    <CarItem
      promoCode={promoCode}
      discount={promoCodeData?.data?.discount}
      description={description}
      isMobile={isMobile}
    ></CarItem>
  );

  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(promoCode);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
  //   } catch (err) {
  //     console.error('Failed to copy promo code:', err);
  //   }
  // };

  // return (
  //   <div className='relative z-10 mx-auto max-w-md px-4'>
  //     <div
  //       className='mt-6 rounded-[10px] bg-white p-4 shadow-xl'
  //       style={{ borderLeft: '8px solid #C80F1E' }}
  //     >
  //       <div className='mb-[8px] text-2xl font-bold leading-[100%]'>
  //         {isMaid
  //           ? 'Fuel Your Savings – But Only If You’re Fast!'
  //           : 'Don’t Let This Deal Dust Off Without You!'}
  //       </div>
  //       <div className='text-justify text-sm'>
  //         {isMaid ? (
  //           <>
  //             Snag{' '}
  //             <span className='font-bold'>
  //               {promoCodeData?.data?.discount}% OFF
  //             </span>{' '}
  //             Maid Insurance for the next 50 employers. Use the code and tidy up
  //             your savings!
  //           </>
  //         ) : (
  //           <>
  //             Just 50 spots left to save{' '}
  //             <span className='font-bold'>
  //               {promoCodeData?.data?.discount}%
  //             </span>{' '}
  //             on Car Insurance. Use the code below before this deal runs out of
  //             road.
  //           </>
  //         )}
  //       </div>
  //       {description && (
  //         <div className='mt-2 text-[14px] text-base font-bold'>
  //           {description}
  //         </div>
  //       )}
  //       <div className='flex items-center'>
  //         <div
  //           className={`mt-2 flex w-max cursor-pointer flex-row items-center gap-2 whitespace-nowrap rounded-lg border-2 p-2 transition-all ${
  //             isMobile
  //               ? 'border-[#C80F1E] bg-white text-[#C80F1E]'
  //               : 'border-coupon-red bg-coupon-red text-white'
  //           }`}
  //           onClick={handleCopy}
  //         >
  //           <CouponIcon size={32} />
  //           <div className='text-[12px] text-base font-bold'>{promoCode}</div>
  //         </div>
  //         {copied && (
  //           <div className='ml-4 mt-2 flex items-center gap-1 text-[#52C41A]'>
  //             <PromoTickIcon size={24} />
  //             <span className='text-[14px] font-bold'>Code Copied</span>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default LimitedPeriodOffer;
