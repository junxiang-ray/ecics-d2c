'use client';

import { ROUTES } from '@/constants/routes';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Header from '@/components/page/header/PortalPageHeader';

interface Props {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: Props): React.ReactNode => {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === ROUTES.PORTAL.LOGIN) return children;

  return (
    <div className='site portal-site h-[100svh] min-h-fit bg-gray-50'>
      <Header />
      <div className='mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8'>
        {children}
      </div>
    </div>
  );
};
export default PortalLayout;
