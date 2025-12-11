import { Drawer, Modal } from 'antd';
import React from 'react';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface NoInfoModalProps {
  onExit?: () => void;
  onContinue?: () => void;
  visible?: boolean;
}

export const SingpassDownModal = ({
  onExit,
  onContinue,
  visible,
}: NoInfoModalProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='flex flex-col gap-2'>
        <WarningTriangleIcon size={70} />
        <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
          Singpass is currently down
        </p>
        <div className='flex flex-col items-center gap-6 text-center text-[#00000073]'>
          <p className='text-sm font-normal'>
            We’re unable to connect to Singpass at the moment.
          </p>
          <p>
            {' '}
            You may continue by{' '}
            <strong>manually entering your information</strong> if you wish to
            proceed.
          </p>
          <p>If you need assistance, feel free to contact us:</p>
          <p>
            📞 Call us:{' '}
            <a href='tel:+6562065588' className='text-[#00000073]'>
              +65 6206 5588
            </a>
            <br />
            📧 Email us:{' '}
            <a
              href='mailto:customerservice@ecics.com.sg'
              className='text-[#00000073] underline'
            >
              customerservice@ecics.com.sg
            </a>
          </p>
          <p>We appreciate your patience and understanding.</p>
        </div>
        <div className='mt-[10px] flex flex-row items-center justify-between gap-[10px]'>
          <SecondaryButton
            className={`mx-auto ${
              isMobile
                ? 'w-full'
                : 'w-[10vw] min-w-[150px] px-4 py-2 md:w-[10vw]'
            }`}
            onClick={onExit}
          >
            Close
          </SecondaryButton>
          {onContinue && (
            <PrimaryButton
              className={`mx-auto ${isMobile ? 'w-full' : 'md:w-40'} bg-brand-blue`}
              onClick={onContinue}
            >
              Continue
            </PrimaryButton>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        onClose={onContinue}
        open={visible}
        closable={false}
        maskClosable={false}
        height='auto'
        className='rounded-t-xl'
      >
        <div>{content}</div>
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onOk={onContinue}
      onCancel={onContinue}
      closable={false}
      maskClosable={false}
      keyboard={true}
      footer={null}
      centered
      width={400}
    >
      <div>{content}</div>
    </Modal>
  );
};
