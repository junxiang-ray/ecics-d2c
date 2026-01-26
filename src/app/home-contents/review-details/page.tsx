'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { ROUTES } from '@/constants/routes';
import { usePostUserInfoHomeContent } from '@/hook/auth/login-home-content';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';

export default function ReviewInfoDetailPage() {
  const router = useRouterWithQuery();

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

  const { data, isLoading } = usePostUserInfoHomeContent({
    payload,
    productType: PRODUCT_NAME.HOME_CONTENT,
  });

  if (!clientReady || isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <LoadingOutlined style={{ fontSize: 60 }} spin />
      </div>
    );
  } else {
    router.push(ROUTES.HOMECONTENT.QUOTE_DETAIL);
  }

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <LoadingOutlined style={{ fontSize: 60 }} spin />
    </div>
  );
}
