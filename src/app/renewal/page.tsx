'use client';

import Announcements from '@/app/renewal/components/announcements/Announcements';
import Promotions from '@/app/renewal/components/promotions/Promotions';
import QuickActions from '@/app/renewal/components/quick-action/QuickActions';
import PoliciesPendingRenewal from '@/app/renewal/components/policies-renewal/PoliciesPendingRenewal';
import RenewalHeader from '@/app/renewal/components/renewal-header/RenewalHeader';
import { usePostUserInfoRenewal } from '@/hook/auth/login-renewal';
import { useEffect, useState } from 'react';
import { PRODUCT_NAME } from '../api/constants/product';
import { ECICS_USER_INFO } from '@/constants/general.constant';

export default function RenewalPage() {
  const [payload, setPayload] = useState({
    code_verifier: '',
    nonce: '',
    state: '',
    code: '',
  });
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      const code = query.get('code') || '';
      const state = query.get('state') || '';
      const code_verifier = sessionStorage.getItem('code_verifier') || '';
      const nonce = sessionStorage.getItem('nonce') || '';

      setPayload({ code_verifier, nonce, state, code });
      setClientReady(true);
    }
  }, []);

  const { data, isLoading } = usePostUserInfoRenewal({
    payload,
    productType: PRODUCT_NAME.RENEWAL,
  });
  const RenewalUserInfo = sessionStorage.getItem(ECICS_USER_INFO);
  const personalInfo = RenewalUserInfo ? JSON.parse(RenewalUserInfo) : null;

  console.log(personalInfo?.name?.value, 'chinh123');

  return (
    <main className=''>
      <div className=' border-b border-gray-200'>
        <RenewalHeader />
      </div>
      <div className='px-14 py-8'>
        <h1 className='mb-2 text-3xl font-bold'>
          {' '}
          Welcome back, {personalInfo?.name?.value}
        </h1>
        <p className='mb-6 text-gray-500'>
          Manage your policies and stay protected
        </p>
      </div>
      <section className='mb-8'>
        <PoliciesPendingRenewal />
      </section>

      <div className='mb-8 grid gap-6 md:grid-cols-2'>
        <Promotions />
        <Announcements />
      </div>

      <QuickActions />
    </main>
  );
}
