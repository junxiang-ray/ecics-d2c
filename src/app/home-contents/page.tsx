'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { saveToLocalStorage } from '@/libs/utils/utils';

import { ROUTES } from '@/constants/routes';
import { useGetProductDetails } from '@/hook/insurance/homeContentQuote';
import { useAppDispatch } from '@/redux/store';

export default function HomeContentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { mutateAsync: getProductDetails } = useGetProductDetails();

  const basePath = ROUTES.HOMECONTENT.QUOTE_DETAIL;

  const promoCode = searchParams.get('promo_code') || '';
  const partnerCode = searchParams.get('partner_code') || '';

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (promoCode) params.append('promo_code', promoCode);
    if (partnerCode) params.append('partner_code', partnerCode);
    return params.toString();
  }, [promoCode, partnerCode]);

  useEffect(() => {
    const init = async () => {
      try {
        sessionStorage.clear();
        localStorage.clear();

        saveToLocalStorage({
          promo_code: promoCode,
          partner_code: partnerCode,
        });
        console.log('CALLING');
        const response = await getProductDetails();

        // Save result map to local storage
        saveToLocalStorage({
          hc_result_map: JSON.stringify(response),
        });

        // console.log(`response from details: ${JSON.stringify(response)}`);

        router.push(`${basePath}${queryString ? `?${queryString}` : ''}`);
      } catch (error) {
        console.error('Failed to get product details:', error);
      }
    };

    init();
  }, []);

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <LoadingOutlined style={{ fontSize: 60 }} spin />
    </div>
  );
}
