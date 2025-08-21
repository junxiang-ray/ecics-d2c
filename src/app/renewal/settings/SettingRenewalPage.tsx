'use client';

import { ROUTES } from '@/constants/routes';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function SettingRenewalPage() {
  const router = useRouter();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='relative flex h-[56px] w-full flex-row items-center justify-center border-b border-gray-200'>
        <div
          className='absolute left-4 cursor-pointer md:left-14'
          onClick={() => {
            router.push(ROUTES.RENEWAL.RENEWAL);
          }}
        >
          <ArrowLeftOutlined />
        </div>
        <p className='font-semibold'>Settings</p>
      </div>
      <div className='flex w-full flex-col justify-center p-3'>
        <div></div>
      </div>
    </div>
  );
}
