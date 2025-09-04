'use client';

import dynamic from 'next/dynamic';

const RenewalDetail = dynamic(() => import('./RenewalDetail'), { ssr: false });

export default function RenewalDetailPage() {
  return <RenewalDetail />;
}
