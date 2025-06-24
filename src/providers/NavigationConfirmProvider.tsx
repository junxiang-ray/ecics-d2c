'use client';

import { Button, Modal } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function NavigationConfirmProvider() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const hasInterceptedRef = useRef(false);
  const fullUrlRef = useRef<string>(''); // keep the original full URL

  useEffect(() => {
    fullUrlRef.current = `${pathName}?${searchParams.toString()}`;
    window.history.pushState({ custom: true }, '', fullUrlRef.current);

    const handlePopState = (event: PopStateEvent) => {
      if (hasInterceptedRef.current) return;

      event.preventDefault();
      hasInterceptedRef.current = true;
      setIsModalVisible(true);

      // Push the original URL back into the stack to preserve it when the Stay button is clicked.
      window.history.pushState({ custom: true }, '', fullUrlRef.current);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathName, searchParams]);

  const handleLeave = () => {
    setIsModalVisible(false);
    hasInterceptedRef.current = false;

    const basePath = pathName.startsWith('/maid')
      ? '/maid'
      : pathName.startsWith('/motor')
        ? '/motor'
        : '/';

    router.replace(basePath);
  };

  const handleStay = () => {
    setIsModalVisible(false);
    hasInterceptedRef.current = false;

    // Push the current state again so that the user has to press back one more time
    window.history.pushState({ custom: true }, '', fullUrlRef.current);
  };

  return (
    <Modal
      open={isModalVisible}
      closable={false}
      mask={true}
      footer={
        <div className='grid grid-cols-2 gap-2'>
          <Button danger onClick={handleLeave} style={{ width: '100%' }}>
            Leave
          </Button>
          <Button type='primary' onClick={handleStay} style={{ width: '100%' }}>
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
