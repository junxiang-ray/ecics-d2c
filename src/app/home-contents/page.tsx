'use client';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

import { ROUTES } from '@/constants/routes';

export default function HomeContentPage() {
  const router = useRouter();
  // const basePath = ROUTES.INSURANCE_HOMECONTENTS.QUOTE_DETAILS;
  const basePath = ROUTES.HOMECONTENT.QUOTE_DETAIL;
  const queryParams = new URLSearchParams();

  const searchParams = useSearchParams();
  const promoCode = searchParams.get('promo_code');
  const partnerCode = searchParams.get('partner_code');
  if (promoCode) queryParams.append('promo_code', promoCode);
  if (partnerCode) queryParams.append('partner_code', partnerCode);

  const queryString = queryParams.toString();
  console.log(`${basePath}${queryString ? `?${queryString}` : ''}`);
  router.push(`${basePath}${queryString ? `?${queryString}` : ''}`);
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <LoadingOutlined style={{ fontSize: 60 }} spin />
    </div>
  );
}
