'use client';

import { Button, Modal } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function NavigationConfirmProvider() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      router.push(`${pathName}${window.location.search}`);
      setIsModalVisible(true);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathName]);

  const handleLeave = () => {
    setIsModalVisible(false);
    const basePath = pathName.startsWith('/maid')
      ? '/maid'
      : pathName.startsWith('/motor')
        ? '/motor'
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
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0,
        padding: '10px 24px',
        width: '100%',
        maxWidth: 500,
      }}
      bodyStyle={{
        paddingBottom: '24px',
      }}
    >
      <p className='text-lg font-semibold'>Do you want to leave this site?</p>
      <p className='text-base'>Changes you made may not be saved.</p>
    </Modal>
  );
}
