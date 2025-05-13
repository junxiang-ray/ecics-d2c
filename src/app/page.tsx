'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { STEP_TO_ROUTE } from '@/constants/routes';
import { useGetQuote } from '@/hook/insurance/quote';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get('key') || '';
  const { data: quoteInfo, isLoading } = useGetQuote(key);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (isLoading || !quoteInfo?.data) return;

    const currentStep = quoteInfo.data.current_step;
    const targetRoute = STEP_TO_ROUTE[currentStep];

    if (targetRoute) {
      router.push(targetRoute);
    } else {
      router.push('/login');
    }
  }, [quoteInfo, isLoading, router]);

  if (isLoading) return <div>Loading data...</div>;

  return null;
}
