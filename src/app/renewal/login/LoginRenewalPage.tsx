'use client';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

const LoginRenewalPage = () => {
  const { isMobile } = useDeviceDetection();

  if (isMobile) {
    return <div className='relative min-h-[100svh]'></div>;
  }

  return (
    <div className='relative flex h-screen w-full flex-row bg-white'></div>
  );
};

export default LoginRenewalPage;
