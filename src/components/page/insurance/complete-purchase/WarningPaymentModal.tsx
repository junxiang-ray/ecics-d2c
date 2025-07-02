'use client';

import { Drawer, Modal } from 'antd';
import { PrimaryButton } from '@/components/ui/buttons';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';

function WarningPaymentModal({
  visible,
  setShowFirstErrorModal,
}: {
  visible: boolean;
  setShowFirstErrorModal: (visible: boolean) => void;
}) {
  const { isMobile } = useDeviceDetection();

  const content = (
    <div className='flex flex-col items-center justify-center gap-6'>
      <WarningTriangleIcon size={70} />
      <p className='text-center text-[24px] font-normal leading-[32px] text-[#000000D9]'>
        We're Sorry Something Went Wrong
      </p>
      <div className='flex flex-col items-center justify-center gap-6 text-[14px] font-normal leading-[22px] text-[#00000073]'>
        <p className='text-center'>
          It looks like we couldn't redirect you to the payment gateway due to a
          technical issue (e.g., timeout or connection error).
        </p>
        <p className='text-center'>
          We sincerely apologize for the inconvenience. Kindly try again.
        </p>
      </div>
      <div className='w-full'>
        <PrimaryButton
          onClick={() => {
            setShowFirstErrorModal(false);
          }}
          className='w-full bg-[#00ADEF] py-3 text-center text-base font-bold text-white'
        >
          Try again
        </PrimaryButton>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={() => {
          setShowFirstErrorModal(false);
        }}
        closable={false}
        height='auto'
        className='rounded-t-xl'
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal
      open={visible}
      onOk={() => {
        setShowFirstErrorModal(false);
      }}
      onCancel={() => {
        setShowFirstErrorModal(false);
      }}
      closable={true}
      maskClosable={true}
      keyboard={true}
      footer={null}
      centered
      width={385}
    >
      {content}
    </Modal>
  );
}

export default WarningPaymentModal;
