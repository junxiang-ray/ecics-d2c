'use client';

import { useAppSelector } from '@/redux/store';

const Welcome = (): React.ReactNode => {
  const user = useAppSelector((state) => state.portalUserInfo.user);

  const displayName = user?.name
    ? user.name.split(',')[0] // optional: nicer greeting
    : 'there';

  return (
    <div className='mb-12'>
      <p className='font-heading mb-3 text-3xl font-bold text-gray-900'>
        Welcome back, <span>{displayName}</span>
      </p>
      <p className='font-body text-lg text-gray-600'>
        Manage your policies and stay protected
      </p>
    </div>
  );
};

export default Welcome;
