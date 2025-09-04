'use client';

import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Announcements from '@/app/renewal/components/announcements/Announcements';
import PoliciesPendingRenewal from '@/app/renewal/components/policies-renewal/PoliciesPendingRenewal';
import Promotions from '@/app/renewal/components/promotions/Promotions';
import QuickActions from '@/app/renewal/components/quick-action/QuickActions';
import RenewalHeader from '@/app/renewal/components/renewal-header/RenewalHeader';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { usePostUserInfoRenewal } from '@/hook/auth/login-renewal';
import { useVerifyRetrieveRenewal } from '@/hook/insurance/renewal';

import { PRODUCT_NAME } from '../api/constants/product';

export default function RenewalPage() {
  const router = useRouter();
  const [payload, setPayload] = useState({
    code_verifier: '',
    nonce: '',
    state: '',
    code: '',
  });

  const [personalInfo, setPersonalInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const RenewalUserInfo = sessionStorage.getItem(ECICS_USER_INFO);
      setPersonalInfo(RenewalUserInfo ? JSON.parse(RenewalUserInfo) : null);

      const query = new URLSearchParams(window.location.search);
      const code = query.get('code') || '';
      const state = query.get('state') || '';
      const code_verifier = sessionStorage.getItem('code_verifier') || '';
      const nonce = sessionStorage.getItem('nonce') || '';
      setPayload({ code_verifier, nonce, state, code });
    }
  }, []);

  const { data, isLoading } = usePostUserInfoRenewal({
    payload,
    productType: PRODUCT_NAME.RENEWAL,
  });

  const { data: vehData, isLoading: isVehLoading } = useVerifyRetrieveRenewal(
    personalInfo?.uinfin?.value,
  );

  useEffect(() => {
    if (!vehData) return;
    if (vehData.length < 2) {
      router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
    } else if (vehData.length >= 2) {
      router.push(ROUTES.RENEWAL.RENEWAL_DASHBOARD);
    }
  }, [vehData, router]);

  if (isVehLoading || isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <main>
      <div className='border-b border-gray-200 '>
        <RenewalHeader />
      </div>
      <div className='mx-auto max-w-[1200px] px-4 py-4 md:px-0 md:py-8'>
        <h1 className='mb-2 text-2xl font-bold md:text-3xl'>
          Welcome back, {personalInfo?.name?.value}
        </h1>
        <p className='mb-6 text-gray-500'>
          Manage your policies and stay protected
        </p>
      </div>
      <section className='mb-8'>
        <PoliciesPendingRenewal policies={vehData || []} />
      </section>

      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        <Promotions />
        <Announcements />
      </div>

      <QuickActions />
    </main>
  );
}
