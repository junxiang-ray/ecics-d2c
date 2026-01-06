import React, { useState } from 'react';
import CouponIcon from '@/components/icons/CouponIcon';
import PromoTickIcon from '@/components/icons/PromoTickIcon'; // adjust your imports
import dayjs from 'dayjs';

interface MaidItemProps {
  promoCode: string;
  discount: number;
  description?: string;
  isMobile: boolean;
  startTime: string;
  endTime: string;
}

const MaidItem: React.FC<MaidItemProps> = ({
  promoCode,
  discount,
  description,
  isMobile,
  startTime,
  endTime,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy promo code:', err);
    }
  };

  const getTitle = () => {
    switch (promoCode.toUpperCase()) {
      case 'BONUS6ME':
        return 'Secure Your Savings – While They Last!';
      case 'STAFFBONUS6ME':
        return 'Secure Your Savings – While They Last!';
      default:
        return 'Fuel Your Savings – But Only If You’re Fast!';
    }
  };

  const formattedPromoCodeRange = `from ${dayjs(startTime, 'YYYY-MM-DD HH:mm:ss.SSS').format('DD MMM YYYY')} – ${dayjs(endTime, 'YYYY-MM-DD HH:mm:ss.SSS').format('DD MMM YYYY')}.`;

  const getDescription = () => {
    switch (promoCode.toUpperCase()) {
      case 'BONUS6ME':
        return (
          <div className='text-justify text-sm'>
            Snag{' '}
            <span className='font-bold'>
              {discount}% OFF ECICS Maid Insurance + 6ME check-ups
            </span>{' '}
            (worth up to S$211.20) {formattedPromoCodeRange}
            {/* <span className='font-bold'>
              Protect your helper and your wallet today.
            </span> */}
          </div>
        );
      case 'STAFFBONUS6ME':
        return (
          <div className='text-justify text-sm'>
            Enjoy{' '}
            <span className='font-bold'>
              {discount}% OFF ECICS Maid Insurance + 6ME check-ups and Bond
              Waiver
            </span>{' '}
            (worth up to S$265.70) {formattedPromoCodeRange}
            {/* <span className='font-bold'>
              Exclusive for staff – care smarter and save more.
            </span> */}
          </div>
        );
      default:
        return (
          <div className='text-justify text-sm'>
            Snag <span className='font-bold'>{discount}% OFF</span> Maid
            Insurance for the next 50 employers. Use the code and tidy up your
            savings!
          </div>
        );
    }
  };

  return (
    <div className='relative z-10 mx-auto max-w-md px-4'>
      <div
        className='mt-6 rounded-[10px] bg-white p-4 shadow-xl'
        style={{ borderLeft: '8px solid #C80F1E' }}
      >
        <div className='mb-[8px] text-2xl font-bold leading-[100%]'>
          {getTitle()}
        </div>
        {getDescription()}
        {/* <div className='text-justify text-sm'>
          Snag <span className='font-bold'>{discount}% OFF</span> Maid Insurance
          for the next 50 employers. Use the code and tidy up your savings!
        </div> */}
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

export default MaidItem;
