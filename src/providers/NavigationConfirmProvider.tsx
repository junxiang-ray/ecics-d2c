'use client';

import { Button, Modal } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PRODUCT_NAME } from '@/app/api/constants/product';

function isPathAllowed(pathname: string) {
  return (
    pathname === `/${PRODUCT_NAME.MAID}` ||
    pathname.startsWith(`/${PRODUCT_NAME.MAID}/insurance/basic-detail`) ||
    pathname === `/${PRODUCT_NAME.MOTOR}` ||
    pathname.startsWith(`/${PRODUCT_NAME.MOTOR}/insurance/basic-detail`)
  );
}

export function NavigationConfirmProvider() {
  const router = useRouter();
  const pathName = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (isPathAllowed(pathName)) return;
    // Block the first back action.
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      setIsModalVisible(true);
      // Push the current state again to continue blocking.
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathName]);

  const handleLeave = () => {
    setIsModalVisible(false);

    const basePath = pathName.startsWith(`/${PRODUCT_NAME.MAID}`)
      ? `/${PRODUCT_NAME.MAID}`
      : pathName.startsWith(`/${PRODUCT_NAME.MOTOR}`)
        ? `/${PRODUCT_NAME.MOTOR}`
        : '/';

    router.push(basePath);
  };

  const handleStay = () => {
    setIsModalVisible(false);
    // Push a new history entry to intercept the next back button
    window.history.pushState(null, '', window.location.href);
  };

  return (
    <Modal
      open={isModalVisible}
      closable={false}
      mask={true}
      centered
      footer={
        <div className='grid grid-cols-2 gap-2'>
          <Button danger style={{ width: '100%' }} onClick={handleLeave}>
            Leave
          </Button>
          <Button type='primary' style={{ width: '100%' }} onClick={handleStay}>
            Stay
          </Button>
        </div>
      }
      bodyStyle={{
        paddingBottom: '24px',
      }}
    >
      <p className='text-lg font-semibold'>Do you want to leave this site?</p>
      <p className='text-base'>Changes you made may not be saved.</p>
    </Modal>
  );
}
