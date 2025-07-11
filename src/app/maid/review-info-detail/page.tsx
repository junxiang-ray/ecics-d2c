'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { usePostUserInfoMaid } from '@/hook/auth/login-maid';

import { ReviewInfoDetailMaid } from './ReviewInfoDetail';

export default function ReviewInfoDetailPage() {
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

  const { data, isLoading } = usePostUserInfoMaid({
    payload,
    productType: PRODUCT_NAME.MAID,
  });

  if (!clientReady || isLoading) {
    return (
      <div className='flex h-96 w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='relative flex w-full justify-center p-4 pb-0 md:px-10'>
      <ReviewInfoDetailMaid />
    </div>
  );
}
