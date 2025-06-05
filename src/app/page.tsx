'use client';

import { Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { saveToSessionStorage } from '@/libs/utils/utils';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES, STEP_TO_ROUTE } from '@/constants/routes';
import { useGetQuote } from '@/hook/insurance/quote';
import { useApiErrorHandler } from '@/hook/useApiErrorHandler';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const { data: quoteInfo, isLoading, isError, error } = useGetQuote(key);
  const onError = useApiErrorHandler();

  useEffect(() => {
    sessionStorage.clear();
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!quoteInfo?.data) {
      router.push(ROUTES.MOTOR.LOGIN);
      return;
    }

    const currentStep = quoteInfo.data.current_step;
    const targetRoute = STEP_TO_ROUTE[currentStep];
    const ecicsData = quoteInfo.data.data_from_singpass;
    saveToSessionStorage({ [ECICS_USER_INFO]: JSON.stringify(ecicsData) });

    if (targetRoute) {
      router.push(`${targetRoute}?key=${key}`);
    } else {
      router.push(ROUTES.MOTOR.LOGIN);
    }
  }, [quoteInfo, isLoading]);

  useEffect(() => {
    if (isError && error) {
      onError(error);
    }
  }, [isError, error, onError]);

  if (isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return null;
}
