'use client';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

const QuickActions = () => {
  const { isMobile } = useDeviceDetection();

  if (isMobile) {
    return <div className='relative min-h-[100svh]'></div>;
  }

  return <div className=''></div>;
};

export default QuickActions;
