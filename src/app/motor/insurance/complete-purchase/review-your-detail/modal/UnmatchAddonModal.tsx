import { Drawer, Modal } from 'antd';
import React from 'react';

import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface NoInfoModalProps {
  onExit?: () => void;
  onContinue?: () => void;
  visible?: boolean;
  description?: string;
}

export const UnMatchAddonModal = ({
  onExit,
  onContinue,
  visible,
  description,
}: NoInfoModalProps) => {
  const { isMobile } = useDeviceDetection();

  const content = (
    <>
      <div className='flex flex-col gap-2'>
        <WarningTriangleIcon size={70} />
        <p className='text-center text-2xl font-normal leading-[32px] text-[#000000D9]'>
          Heads up!
        </p>
        <div className='flex flex-col items-center gap-6 text-center text-[#00000073]'>
          <p className='text-sm font-normal'>
            We've detected that you've changed your plan to{' '}
            <strong>{description}</strong>, but haven't confirmed your add-ons
            yet.
          </p>
          <p>
            {' '}
            Please proceed to <strong>Step 3 – Add-ons</strong> to complete your
            selection.
          </p>
        </div>
        <div className='mt-[10px] flex flex-row items-center justify-between gap-[10px]'>
          <SecondaryButton
            className={`${
              isMobile
                ? 'w-full'
                : 'w-[10vw] min-w-[150px] px-4 py-2 md:w-[10vw]'
            }`}
            onClick={onExit}
          >
            Close
          </SecondaryButton>
          <PrimaryButton
            className={`${isMobile ? 'w-full' : 'md:w-40'} bg-brand-blue`}
            onClick={onContinue}
          >
            Proceed
          </PrimaryButton>
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
