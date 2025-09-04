'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import CheckCircle from '@/components/icons/CheckCircle';
import MailIcon from '@/components/icons/MailIcon';
import PhoneIcon from '@/components/icons/PhoneIcon';
import {
  DownloadIcon,
  GiftIcon,
  MapPinIcon,
  PolicyDetailsIcon,
  ShieldIcon,
  StarFillIcon,
  StarIcon,
  TickIcon,
} from '@/components/icons/renewal-icons';

import { ROUTES } from '@/constants/routes';
import { useGetRenewalPaymentSuccess } from '@/hook/insurance/renewal';
import { formatCurrency } from '@/libs/utils/utils';
import { Spin } from 'antd';
import ImportantDoc from './ImportantDoc';

const StepItem = ({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) => (
  <div className='flex items-start gap-3'>
    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#D1FAE5] text-[11px] font-semibold text-[#00C950]'>
      {number}
    </div>
    <span className='self-center text-justify'>{children}</span>
  </div>
);

const PaymentSuccessful = () => {
  const router = useRouter();
  const key = '5a250f5d-4054-4353-a0db-96b33fc465d1';
  const { data, isLoading } = useGetRenewalPaymentSuccess(key);

  const handleBackToHome = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_DASHBOARD);
  };

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='relative flex min-h-screen w-full flex-col bg-gray-50'>
      <div className='flex items-center border-b border-gray-300 bg-white px-4 py-3'>
        <h1 className='flex-1 text-center text-lg font-semibold'>
          Payment Successful
        </h1>
      </div>

      <div className='space-y-6 p-6'>
        <div className='relative grid place-items-center overflow-hidden rounded-lg border border-[#DCFCE7] bg-[#EFF6FF] p-5 pb-14'>
          <div className='absolute right-0 top-0 h-20 w-20 -translate-y-1/3 translate-x-1/3 rounded-full bg-[#E6F4FF]'></div>
          <div className='absolute bottom-0 left-0 h-20 w-20 -translate-x-1/3 translate-y-1/3 rounded-full bg-[#E6F4FF]'></div>
          <div className='relative z-10 space-y-2 text-center'>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500'>
              <CheckCircle className='text-white' size={48} />
            </div>
            <div className='flex items-center justify-center gap-2 pt-4'>
              <StarFillIcon size={20} />
              <div className='text-[26px] font-bold text-[#00A63E]'>
                Congratulations!
              </div>
              <StarFillIcon size={20} />
            </div>
            <div className='text-lg font-semibold'>
              Your policy has been renewed successfully
            </div>
            <div className='text-base font-normal'>
              🎉 You're all set! Check your email for policy details.
            </div>
          </div>
          <div className='grid w-full grid-cols-1 gap-4 pt-6 text-center md:grid-cols-2'>
            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <ShieldIcon className='text-[#00A63E]' size={20} />
              <div className='text-xs font-normal'>Coverage</div>
              <div className='text-sm font-semibold'>
                {data?.renewal_data?.renewal_summary?.coverage ?? 'N/A'}
              </div>
            </div>
            <div className='rounded-lg bg-white p-4 shadow-sm'>
              <GiftIcon className='text-[#00A63E]' size={20} />
              <div className='text-xs font-normal'>Total Paid</div>
              <div className='text-sm font-semibold'>
                {formatCurrency(
                  data?.renewal_data?.renewal_summary?.total_paid,
                ) ?? 'N/A'}
              </div>
            </div>
          </div>

          <div className='mt-6 w-full rounded-lg border border-[#B9F8CF] bg-white p-5 text-left shadow-sm'>
            <div className='mb-4 flex items-center justify-center gap-1'>
              <StarIcon className='text-[#00C950]' size={20} />
              <div className='text-center font-semibold'>What's Next?</div>
            </div>

            <div className='space-y-3 text-xs font-normal text-gray-700'>
              <StepItem number={1}>
                Your policy documents will be emailed within 24 hours
              </StepItem>
              <StepItem number={2}>
                Keep your policy number handy:{' '}
                <span className='font-medium text-[#008236]'>
                  {data?.renewal_data?.renewal_summary?.poily_no ?? 'N/A'}
                </span>
              </StepItem>
              <StepItem number={3}>
                Access your online account for easy claims and support
              </StepItem>
              <StepItem number={4}>Your coverage starts immediately</StepItem>
            </div>
          </div>
        </div>
      </div>
      <div className='mb-[80px] space-y-6 px-6'>
        {/* Policy Summary */}
        <div className='rounded-2xl border border-gray-200 shadow-md'>
          <div className='space-y-4 p-5'>
            <div>
              <div className='mb-2 flex items-center gap-2'>
                <PolicyDetailsIcon
                  className='h-8 w-8 rounded-lg bg-[#D1FAE5] text-[#02ADEF]'
                  size={18}
                />
                <h2 className='text-base font-semibold'>Policy Summary</h2>
              </div>
              <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-normal text-gray-600 md:grid-cols-4'>
                <span className='text-left'>Policy Type</span>
                <span className='text-right text-gray-800'>
                  {data?.renewal_data?.policy_summary?.policy_type ?? 'N/A'}
                </span>

                <span className='text-left'>Vehicle</span>
                <span className='text-right text-gray-800'>
                  {data?.renewal_data?.policy_summary?.veh_reg_no ?? 'N/A'}
                </span>

                <span className='text-left'>Start Date</span>
                <span className='text-right text-gray-800'>
                  {data?.renewal_data?.policy_summary?.policy_start_date ??
                    'N/A'}
                </span>

                <span className='text-left'>Policy Number</span>
                <span className='text-right text-gray-800'>
                  {data?.renewal_data?.renewal_summary?.poily_no ?? 'N/A'}
                </span>

                <span className='text-left'>End Date</span>
                <span className='text-right text-gray-800'>
                  {data?.renewal_data?.policy_summary?.policy_end_date ?? 'N/A'}
                </span>
              </div>
            </div>

            <div className='rounded-xl border border-[#DCFCE7] bg-blue-50 p-4'>
              <div className='mb-2 text-sm font-medium'>
                Your Coverage Includes
              </div>
              <div className='grid grid-cols-2 gap-2'>
                {data?.renewal_data?.coverage_includes.map(
                  (item: any, i: string) => (
                    <p
                      key={i}
                      className='flex items-center gap-1 text-xs text-gray-700'
                    >
                      <TickIcon className='text-[#00A63E]' size={16} />
                      {item}
                    </p>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Important Documents */}
        <div className='rounded-2xl border border-gray-200 shadow-md'>
          <div className='space-y-3 p-5'>
            <div className='mb-2 flex items-center gap-2'>
              <DownloadIcon
                className='h-8 w-8 rounded-lg bg-[#F3E8FF] text-[#9810FA]'
                size={18}
              />
              <h2 className='text-base font-semibold'>Important Documents</h2>
            </div>
            <div className='space-y-2'>
              {data?.renewal_data?.documents.map((doc: any, index: number) => (
                <ImportantDoc key={index} title={doc.name} url={doc.url} />
              ))}
            </div>
          </div>
        </div>

        {/* Need Assistance */}
        <div className='rounded-2xl border border-gray-200 shadow-md'>
          <div className='space-y-3 p-5'>
            <h2 className='text-center text-base font-semibold'>
              Need Assistance?
            </h2>
            <p className='text-center text-sm text-gray-600'>
              We're here to help with any questions
            </p>
            <div className='grid gap-4 text-sm sm:grid-cols-3'>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE}`}
                className='flex cursor-pointer flex-col items-center justify-center rounded-xl border border-[#BEDBFF] bg-blue-50 p-4'
              >
                <PhoneIcon
                  className='mb-2 h-10 w-10 rounded-full bg-[#DCFCE7] text-[#155DFC]'
                  size={18}
                />
                <span className='font-medium'>Call Us</span>
                <span className='text-[#155DFC]'>6206 5588</span>
                <span className='text-xs text-gray-500'>
                  Mon-Fri 8:30–18:00
                </span>
              </a>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex cursor-pointer flex-col items-center justify-center rounded-xl border border-[#B9F8CF] bg-green-50 p-4'
              >
                <MailIcon
                  className='mb-2 h-10 w-10 rounded-full bg-[#DCFCE7] text-[#00A63E]'
                  size={18}
                />
                <span className='font-medium'>Email</span>
                <span className='text-[#00A63E]'>claims@ecics.com.sg</span>
                <span className='text-xs text-gray-500'>2–5 business days</span>
              </a>
              <a
                href={process.env.NEXT_PUBLIC_SUPPORT_ADDRESS}
                target='_blank'
                rel='noopener noreferrer'
                className='flex cursor-pointer flex-col items-center justify-center rounded-xl border border-[#E9D4FF] bg-purple-50 p-4'
              >
                <MapPinIcon
                  className='mb-2 h-10 w-10 rounded-full bg-[#F3E8FF] text-[#9810FA]'
                  size={18}
                />
                <span className='font-medium'>Visit</span>
                <span className='text-[#9810FA]'>Eunos Office</span>
                <span className='text-xs text-gray-500'>Get directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/*<div className='fixed bottom-0 left-0 w-full border-t border-[#F7F7F9] bg-[#FFFEFF]'>*/}
      {/*  <div className='flex justify-center py-4'>*/}
      {/*    <div className='w-full px-6 md:w-2/3'>*/}
      {/*      <PrimaryButton*/}
      {/*        onClick={handleBackToHome}*/}
      {/*        className='w-full rounded-xl bg-[linear-gradient(90deg,#00A63E_0%,#008236_100%)] text-base font-normal'*/}
      {/*      >*/}
      {/*        Back to Home*/}
      {/*      </PrimaryButton>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default PaymentSuccessful;
