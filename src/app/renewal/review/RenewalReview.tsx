'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';

import { BackIcon } from '@/components/icons/renewal-icons';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalReviewForm from '@/app/renewal/review/RenewalReviewForm';
import { ROUTES } from '@/constants/routes';
import { useGetRenewalContent } from '@/hook/cms/verify';
import { usePostRenewalProcessPayment } from '@/hook/renewal/renewalQuote';

const RenewalReview = () => {
  const router = useRouter();
  const { data: renewalContent } = useGetRenewalContent();
  const { mutate: postPayment } = usePostRenewalProcessPayment();

  const handleBackPolicyRenewal = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_DETAIL);
  };

  const handleMakePayment = () => {
    // router.push(ROUTES.RENEWAL.RENEWAL_ACCOUNT_SETUP);
    const payload = {
      email_address: 'David_lee@ecics.com.sg',
      contact_no: '88886666',
      proposal_id: 'PR000000035072',
    };
    const productType = PRODUCT_NAME.MOTOR;

    postPayment(
      { productType, payload },
      {
        onSuccess: (data) => {
          console.log('data', data);
          // router.push(ROUTES.RENEWAL.RENEWAL_ACCOUNT_SETUP);
        },
        onError: (error) => {
          console.error('Payment failed:', error);
        },
      },
    );
  };

  return (
    <>
      <div className='relative mb-[80px] flex min-h-screen w-full flex-col bg-gray-50'>
        <div className='flex items-center border-b border-gray-300 bg-white px-4 py-3'>
          <Button
            type='text'
            icon={<BackIcon size={20} className='mt-1' />}
            onClick={(e) => {
              e.stopPropagation();
              handleBackPolicyRenewal?.();
            }}
            className='p-0'
          />
          <h1 className='flex-1 text-center text-lg font-semibold'>
            Review & Confirm
          </h1>
        </div>

        <div className='p-6'>
          <RenewalReviewForm
            renewalContent={renewalContent?.data?.attributes}
          />
        </div>
      </div>
      <div className='w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-10'>
        <PricingSummaryRenewal
          textButtonLeft='Back'
          onClickButtonLeft={handleBackPolicyRenewal}
          onClick={handleMakePayment}
        />
      </div>
    </>
  );
};

export default RenewalReview;
