'use client';

import React, { useState } from 'react';

import ModalImportant from '@/components/page/insurance/complete-purchase/ModalImportant';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { useAppSelector } from '@/redux/store';

interface ReviewSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  data: {
    title: string;
    value: any;
    coverage_amount?: string;
    number_of_additional_drivers?: string;
  }[];
  isExpanded?: boolean;
  onToggle?: () => void;
  setShowModal: (showModal: boolean) => void;
  editRoute?: string;
  isPendingSave?: boolean;
  isPendingPay?: boolean;
  sectionKey?: string;
  productType?: ProductType;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  description,
  icon,
  data,
  isExpanded,
  onToggle,
  setShowModal,
  editRoute,
  isPendingSave,
  isPendingPay,
  sectionKey,
  productType,
}) => {
  const router = useRouterWithQuery();
  const isMaid = productType === ProductType.MAID;
  const isFinalized = useAppSelector((state) =>
    isMaid
      ? state.maidQuote?.maidQuote?.is_finalized
      : state.quote?.quote?.is_finalized,
  );

  const [isShowPopupImportant, setIsShowPopupImportant] = useState(false);

  const handleEditClick = () => {
    const isBasicDetailRoute = isMaid
      ? editRoute === ROUTES.INSURANCE_MAID.BASIC_DETAIL
      : editRoute === ROUTES.INSURANCE.BASIC_DETAIL;

    if (isBasicDetailRoute) {
      setIsShowPopupImportant(true);
    } else {
      handleRedirect();
    }
  };

  const handleRedirect = () => {
    if (editRoute) {
      router.push(editRoute);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className='mt-4 flex w-full flex-col gap-2 rounded-lg border shadow-sm'>
      <div className='w-full min-w-[335px] '>
        <div
          className={`border px-2 ${isExpanded ? 'w-full rounded-t-lg border-[#00ADEF] bg-[#F4FBFD]' : 'rounded-lg border-[#EDEDED]'}`}
        >
          <div className='flex w-full flex-row justify-between py-2'>
            <div className='flex w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                {!isExpanded && (
                  <div className='flex items-center justify-center rounded-lg bg-[#00ADEF] p-2 font-bold'>
                    {icon}
                  </div>
                )}
                <div className='flex flex-col pl-2'>
                  <p className='text-lg font-semibold'>{title}</p>
                  {!isExpanded && (
                    <p className='text-[14px] font-normal'>{description}</p>
                  )}
                </div>
              </div>
              <div onClick={onToggle} className='cursor-pointer'>
                {isExpanded && !isFinalized && (
                  <div className='gap flex flex-row items-center'>
                    <p
                      className='mr-2 font-bold text-[#00ADEF]'
                      onClick={() => {
                        if (!isPendingSave && !isPendingPay) {
                          handleEditClick();
                        }
                      }}
                    >
                      Edit
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='mt-[20px] flex min-h-1 flex-col gap-2 px-4 pb-2'>
          <div
            className={`grid grid-cols-1 text-start md:gap-4 ${sectionKey === 'addons' || sectionKey === 'policy_plan' ? '' : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col text-sm ${sectionKey === 'addons' ? 'rounded border p-[14px]' : 'p-2'}`}
              >
                {sectionKey === 'addons' ? (
                  <>
                    <div
                      className={`-mx-[14px] flex flex-row justify-between px-[14px] ${
                        item.coverage_amount ||
                        item.number_of_additional_drivers
                          ? 'border-b pb-2'
                          : ''
                      }`}
                    >
                      <div className='font-semibold'>{item.title}</div>
                      <div>{item.value || '-'}</div>
                    </div>
                    {item.coverage_amount && (
                      <div className='mt-2 pt-2'>
                        <div className='text-gray-500'>Coverage Amount</div>
                        <div className='font-semibold'>
                          {item.coverage_amount}
                        </div>
                      </div>
                    )}
                    {item.number_of_additional_drivers && (
                      <div className='mt-2 pt-2'>
                        <div className='text-gray-500'>
                          Number of Additional Drivers
                        </div>
                        <div className='font-semibold'>
                          {item.number_of_additional_drivers}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>{item.title}</div>
                    <div className='font-semibold'>
                      {item.value ? (
                        sectionKey === 'policy_plan' &&
                        item.title === 'Plan Details' ? (
                          <ul className='list-inside list-disc'>
                            {(item.value as string)
                              .split(/,(?!\d)/)
                              .map((part: string, idx: number) => (
                                <li key={idx}>{part.trim()}</li>
                              ))}
                          </ul>
                        ) : (
                          item.value
                        )
                      ) : (
                        '-'
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <ModalImportant
        isShowPopupImportant={isShowPopupImportant}
        handleRedirect={handleRedirect}
        setIsShowPopupImportant={setIsShowPopupImportant}
      />
    </div>
  );
};

export default ReviewSection;
