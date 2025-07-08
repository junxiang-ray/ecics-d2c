'use client';

import { Drawer, Modal } from 'antd';
import { PrimaryButton } from '@/components/ui/buttons';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import CloseCircleIcon from '@/components/icons/CloseCircleIcon';

function PaymentGatewayModal({
  visible,
  setShowSecondErrorModal,
}: {
  visible: boolean;
  setShowSecondErrorModal: (visible: boolean) => void;
}) {
  const { isMobile } = useDeviceDetection();

  const content = (
    <div className='flex flex-col items-center justify-center gap-4'>
      <CloseCircleIcon size={70} />
      <p className='text-center text-[24px] font-normal leading-[32px] text-[#000000D9]'>
        Payment Gateway Redirect Failed
      </p>
      <div className='flex flex-col items-center justify-center gap-4 text-[14px] font-normal leading-[22px] text-[#00000073]'>
        <p className='text-center'>
          We apologize for the inconvenience. It looks like an unexpected error
          has occurred.
        </p>
        <p className='text-center'>
          Our team is ready to assist you—please don't hesitate to reach out and
          we'll do our best to resolve the issue as quickly as possible.
        </p>
        <div className='flex flex-col items-center'>
          <p>📞 Call us: +65 6206 5588</p>
          <p>📧 Email us: customerservice@ecics.com.sg</p>
        </div>
        <p>Thank you for your patience and understanding.</p>
      </div>

      <div className='flex flex-row justify-between'>
        <a href='tel:+6562065588'>
          <PrimaryButton className='mr-[10px] w-[150px] rounded-lg border-none bg-[#52C41A] py-3 text-left text-base font-semibold text-white'>
            📞 Call
          </PrimaryButton>
        </a>
        <a href='mailto:customerservice@ecics.com.sg'>
          <PrimaryButton className='ml-[10px] w-[150px] bg-[#00ADEF] py-3 text-end text-base font-semibold text-white'>
            📧 Email
          </PrimaryButton>
        </a>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement='bottom'
        open={visible}
        onClose={() => setShowSecondErrorModal(false)}
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
      // onOk={onOk}
      onCancel={() => {
        setShowSecondErrorModal(false);
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

export default PaymentGatewayModal;
