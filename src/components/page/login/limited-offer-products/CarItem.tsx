import { useState } from 'react';

import CouponIcon from '@/components/icons/CouponIcon';
import PromoTickIcon from '@/components/icons/PromoTickIcon';

interface CarItemProps {
  promoCode: string;
  discount: number;
  description?: string;
  isMobile: boolean;
}

const CarItem: React.FC<CarItemProps> = ({
  promoCode,
  discount,
  description,
  isMobile,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error('Failed to copy promo code:', err);
    }
  };

  return (
    <div className='relative z-10 mx-auto max-w-md px-4'>
      <div
        className='mt-6 rounded-[10px] bg-white p-4 shadow-xl'
        style={{ borderLeft: '8px solid #C80F1E' }}
      >
        <div className='mb-[8px] text-2xl font-bold leading-[100%]'>
          Don’t Let This Deal Dust Off Without You!
        </div>

        <div className='text-justify text-sm'>
          Just 50 spots left to save{' '}
          <span className='font-bold'>{discount}%</span> on Car Insurance. Use
          the code below before this deal runs out of road.
        </div>

        {description && (
          <div className='mt-2 text-[14px] font-bold'>{description}</div>
        )}

        <div className='flex items-center'>
          <div
            className={`mt-2 flex w-max cursor-pointer flex-row items-center gap-2 whitespace-nowrap rounded-lg border-2 p-2 transition-all ${
              isMobile
                ? 'border-[#C80F1E] bg-white text-[#C80F1E]'
                : 'border-coupon-red bg-coupon-red text-white'
            }`}
            onClick={handleCopy}
          >
            <CouponIcon size={32} />
            <div className='text-[12px] font-bold'>{promoCode}</div>
          </div>

          {copied && (
            <div className='ml-4 mt-2 flex items-center gap-1 text-[#52C41A]'>
              <PromoTickIcon size={24} />
              <span className='text-[14px] font-bold'>Code Copied</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarItem;
