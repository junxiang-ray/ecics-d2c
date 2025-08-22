'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { BackIcon, WarningNoticeIcon } from '@/components/icons/renewal-icons';

import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalDetailForm from '@/app/renewal/detail/RenewalDetailForm';
import ModalPremiumRenewal from '@/app/renewal/modal/ModalPremiumRenewal';
import { ROUTES } from '@/constants/routes';

const RenewalDetail = () => {
  const router = useRouter();
  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);

  const handleBackRenewalNotice = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
  };

  const handleNext = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_REVIEW);
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
              handleBackRenewalNotice?.();
            }}
            className='p-0'
          />
          <h1 className='flex-1 text-center text-lg font-semibold'>
            Policy Renewal
          </h1>
        </div>

        <div className='p-6'>
          <div className='rounded-lg border border-orange-200 bg-[#FFF7ED] p-5'>
            <div className='flex items-start gap-2'>
              <WarningNoticeIcon className='mt-1 text-[#F54900]' size={22} />
              <div>
                <h2 className='mb-2 text-[16px] font-semibold text-[#9F2D00]'>
                  Important Notice - Private Motor Insurance
                </h2>
                <p className='mb-3 text-sm text-[#CA3500]'>
                  Please note that your motor insurance policy includes specific
                  terms regarding the use of your vehicle. To ensure continuous
                  coverage and avoid any potential issues with your policy:
                </p>
                <ul className='list-disc space-y-1 pl-5 text-sm text-[#CA3500]'>
                  <li>
                    Ensure that all drivers listed on the policy have valid
                    driving licences
                  </li>
                  <li>
                    Declare any modifications to your vehicle to avoid voiding
                    your coverage
                  </li>
                  <li>
                    Report any changes in vehicle usage (e.g., commercial use,
                    ride-sharing)
                  </li>
                  <li>
                    Update your contact information to receive important policy
                    communications
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <RenewalDetailForm />
        </div>
      </div>
      <div className='mt-32 w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-10'>
        <PricingSummaryRenewal
          textButton='Next'
          textButtonLeft='Back'
          onClickButtonLeft={handleBackRenewalNotice}
          onClick={handleNext}
          isPolicyRenewalScreen={true}
          setIsShowPopupPremium={setIsShowPopupPremium}
        />
      </div>
      {/*<ModalPremiumRenewal*/}
      {/*    isShowPopupPremium={isShowPopupPremium}*/}
      {/*    setIsShowPopupPremium={setIsShowPopupPremium}*/}
      {/*    quoteInfo={quoteInfo}*/}
      {/*    dataSelectedAddOn={*/}
      {/*        quoteInfo?.data?.review_info_premium?.data_section_add_ons*/}
      {/*    }*/}
      {/*    drivers={quoteInfo?.data?.review_info_premium?.drivers ?? []}*/}
      {/*    addonAdditionalDriver={*/}
      {/*        quoteInfo?.data?.review_info_premium?.addon_additional_driver*/}
      {/*    }*/}
      {/*    pricePlanMain={quoteInfo?.data?.review_info_premium?.price_plan ?? 0}*/}
      {/*    couponDiscount={*/}
      {/*        quoteInfo?.data?.review_info_premium?.coupon_discount ?? 0*/}
      {/*    }*/}
      {/*    tax={1.09}*/}
      {/*    gst={quoteInfo?.data?.review_info_premium?.gst ?? 0}*/}
      {/*    netPremium={quoteInfo?.data?.review_info_premium?.net_premium ?? 0}*/}
      {/*    addonsIncluded={*/}
      {/*        quoteInfo?.data?.review_info_premium?.add_ons_included_in_this_plan*/}
      {/*    }*/}
      {/*/>*/}
    </>
  );
};

export default RenewalDetail;
