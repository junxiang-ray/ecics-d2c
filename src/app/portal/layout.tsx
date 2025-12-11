'use client';

import { ROUTES } from '@/constants/routes';

import { usePathname } from 'next/navigation';
import Header from '@/components/page/header/PortalPageHeader';
import ReduxSyncWatcher from '@/app/portal/ReduxSyncWatcher';
import Page from './page';

interface Props {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: Props): React.ReactNode => {
  const pathname = usePathname();

  if (pathname === ROUTES.PORTAL.LOGIN)
    return (
      <>
        <ReduxSyncWatcher />
        {children}
      </>
    );

  return (
    <>
      <ReduxSyncWatcher />
      <Page />
      <div className='site portal-site h-[100svh] min-h-fit bg-gray-50'>
        <Header />
        <div className='mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8'>
          {children}
        </div>
      </div>
    </>
  );
};
export default PortalLayout;
