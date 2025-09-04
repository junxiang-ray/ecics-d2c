'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';

import { BackIcon, WarningNoticeIcon } from '@/components/icons/renewal-icons';

import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalNoticeForm from '@/app/renewal/notice/RenewalNoticeForm';
import { ROUTES } from '@/constants/routes';
import { useGetRenewalContent } from '@/hook/cms/verify';

const RenewalNotice = () => {
  const router = useRouter();
  const { data: renewalContent } = useGetRenewalContent();

  const handleBackDashboard = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_DASHBOARD);
  };

  const handleEditRenewal = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_DETAIL);
  };

  const handleMakePayment = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_ACCOUNT_SETUP);
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
              handleBackDashboard?.();
            }}
            className='p-0'
          />
          <h1 className='flex-1 text-center text-lg font-semibold'>
            Renewal Notice
          </h1>
        </div>

        <div className='p-6'>
          <div className='rounded-lg border border-orange-200 bg-[#FFF7ED] p-5'>
            <div className='flex items-start gap-2'>
              <WarningNoticeIcon className='mt-1 text-[#F54900]' size={22} />
              <div
                className='prose prose-sm text-[#CA3500]'
                dangerouslySetInnerHTML={{
                  __html:
                    renewalContent?.data?.attributes?.renewal_notice || '',
                }}
              />
            </div>
          </div>
          <RenewalNoticeForm
            renewalContent={renewalContent?.data?.attributes}
          />
        </div>
      </div>
      <div className='w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-10'>
        <PricingSummaryRenewal
          onClickButtonLeft={handleEditRenewal}
          onClick={handleMakePayment}
        />
      </div>
    </>
  );
};

export default RenewalNotice;
