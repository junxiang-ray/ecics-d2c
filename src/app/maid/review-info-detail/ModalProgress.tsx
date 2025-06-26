'use client';

import { Drawer, Modal } from 'antd';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { PrimaryButton } from '@/components/ui/buttons';

interface Props {
  isShowModal: boolean;
  setIsShowModal: (isShowModal: boolean) => void;
}

export const ModalProgress = ({ isShowModal, setIsShowModal }: Props) => {
  const isMobile = useDeviceDetection();
  const content = (
    <div className='flex flex-col gap-4'>
      <p className='text-center text-[24px] font-semibold text-[#000000]'>
        Save Your Progress?
      </p>
      <p className='text-center text-[16px] font-light text-[#000000]'>
        We can email you a link to continue later from where you left off.
      </p>
      <div className='flex flex-col gap-3'>
        <PrimaryButton className='w-[90vw] bg-green-promo md:w-40'>
          Save my progress
        </PrimaryButton>
        <PrimaryButton className='w-[90vw] rounded-none border border-[#FF3B30] bg-white text-center text-base font-bold leading-[21px] !text-[#FF3B30] md:w-40'>
          Exit without saving
        </PrimaryButton>
      </div>
    </div>
  );
  return (
    <>
      {isMobile.isMobile ? (
        <Drawer
          placement='bottom'
          open={isShowModal}
          onClose={() => setIsShowModal(false)}
          closable={false}
          height='auto'
          className='rounded-t-xl'
        >
          {content}
        </Drawer>
      ) : (
        <Modal
          open={isShowModal}
          onCancel={() => setIsShowModal(false)}
          closable={false}
          maskClosable={true}
          keyboard={true}
          footer={null}
          width={385}
          centered
        >
          {content}
        </Modal>
      )}
    </>
  );
};
