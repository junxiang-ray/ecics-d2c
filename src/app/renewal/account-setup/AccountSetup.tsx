'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';

import { BackIcon } from '@/components/icons/renewal-icons';

import AccountSetupForm from '@/app/renewal/account-setup/AccountSetupForm';
import { ROUTES } from '@/constants/routes';

const AccountSetup = () => {
  const router = useRouter();

  const handleBackDashboard = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_DASHBOARD);
  };

  return (
    <>
      <div className='relative flex min-h-screen w-full flex-col bg-gray-50'>
        <div className='flex items-center border-b border-gray-300 bg-white px-4 py-3'>
          <Button
            type='text'
            icon={<BackIcon size={20} className='mt-1' />}
            onClick={(e) => {
              e.stopPropagation();
              handleBackDashboard?.();
            }}
            className='p-0'
          />
          <h1 className='flex-1 text-center text-lg font-semibold'>
            Account Setup
          </h1>
        </div>
        <AccountSetupForm />
      </div>
    </>
  );
};

export default AccountSetup;
