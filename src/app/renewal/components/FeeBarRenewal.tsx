'use client';

import { useEffect, useState } from 'react';

import { formatCurrency } from '@/libs/utils/utils';

import { EditRenewalIcon } from '@/components/icons/renewal-icons';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { setIsLoadingStep } from '@/redux/slices/general.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

export function PricingSummaryRenewal({
  onClick,
  onClickButtonLeft,
  textButton,
  textButtonLeft,
  loading,
  isPolicyRenewalScreen,
  setIsShowPopupPremium,
  total,
}: {
  onClick?: () => void;
  onClickButtonLeft?: () => void;
  textButton?: string;
  textButtonLeft?: string;
  loading?: boolean;
  isPolicyRenewalScreen?: boolean;
  setIsShowPopupPremium?: (isShowPopupPremium: boolean) => void;
  total?: number;
}) {
  const { isMobile } = useDeviceDetection();
  const dispatch = useAppDispatch();

  const editRenewalState = useAppSelector(
    (state) => state.renewalQuote.editRenewal,
  );
  const [editRenewal, setEditRenewal] = useState<boolean>(false);

  useEffect(() => {
    setEditRenewal(!!editRenewalState);

    if (!loading) {
      dispatch(setIsLoadingStep(false));
    }
  }, [loading, dispatch, editRenewalState]);

  return (
    <div
      className={`w-full md:flex md:flex-row md:justify-center ${isPolicyRenewalScreen ? 'cursor-pointer' : ''}`}
    >
      <div className='item-center fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 transform justify-center border-[1px] border-gray-100 bg-white shadow-md shadow-gray-200'>
        <div
          className={`w-full border-t-2 bg-white px-4 md:border-none md:py-4 ${isPolicyRenewalScreen ? 'py-3 md:max-w-[1240px]' : 'py-2  md:max-w-7xl'}`}
        >
          {isMobile ? (
            <div className='flex w-full flex-col items-center gap-3'>
              <div className='flex w-full items-center justify-between gap-2'>
                {editRenewal && (
                  <SecondaryButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickButtonLeft && onClickButtonLeft();
                    }}
                    className='border-gray-300 text-[14px] font-normal text-gray-950 hover:bg-gray-100 '
                    disabled={loading}
                  >
                    {textButtonLeft || (
                      <div className='flex items-center gap-1'>
                        <EditRenewalIcon size={18} /> Edit
                      </div>
                    )}
                  </SecondaryButton>
                )}
                {isPolicyRenewalScreen && (
                  <div
                    className=' w-full'
                    onClick={() => setIsShowPopupPremium?.(true)}
                  >
                    <div className='text-center'>
                      <p className='text-[12px] font-normal text-[#080808]'>
                        Net Premium
                      </p>
                      <p className='text-[20px] font-bold leading-[26px] text-[#00ADEF] underline'>
                        {total ? formatCurrency(Number(total)) : ''}{' '}
                      </p>
                    </div>
                  </div>
                )}
                <PrimaryButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick();
                  }}
                  className='flex-grow bg-[#2ECC71] px-1 leading-4 text-white md:mt-5'
                  loading={loading}
                >
                  {textButton || 'Make Payment'}
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <div className='grid w-full grid-cols-3 items-center md:my-3'>
              <div>
                {editRenewal && (
                  <SecondaryButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickButtonLeft && onClickButtonLeft();
                    }}
                    className='w-[150px] border-gray-300 text-[14px] font-normal text-gray-950 hover:bg-gray-100'
                  >
                    {textButtonLeft || (
                      <div className='flex items-center'>
                        <EditRenewalIcon size={20} className='mr-1' /> Edit
                        Renewal
                      </div>
                    )}
                  </SecondaryButton>
                )}
              </div>
              <div className='text-center'>
                {isPolicyRenewalScreen && (
                  <div
                    onClick={() => setIsShowPopupPremium?.(true)}
                    className='cursor-pointer'
                  >
                    <p className='text-[12px] font-normal text-[#080808]'>
                      Net Premium
                    </p>
                    <p className='text-[20px] font-bold leading-[26px] text-[#00ADEF] underline'>
                      {total ? formatCurrency(Number(total)) : ''}
                    </p>
                  </div>
                )}
              </div>
              <div className='flex justify-end'>
                <PrimaryButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick();
                  }}
                  className='bg-[#2ECC71] px-1 leading-4 text-white md:w-40'
                  loading={loading}
                >
                  {textButton || 'Make Payment'}
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
