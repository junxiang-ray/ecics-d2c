'use client';

import { Drawer, Modal } from 'antd';

import PremiumBreakdownContent, {
  PremiumBreakdownContentProps,
} from '@/components/PremiumBreakdownContent';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface Props extends PremiumBreakdownContentProps {
  isShowPopupPremium: boolean;
  setIsShowPopupPremium: (isShowPopupPremium: boolean) => void;
}

const ModalPremium = (props: Props) => {
  const { isShowPopupPremium, setIsShowPopupPremium, ...rest } = props;
  const isMobile = useDeviceDetection();

  return (
    <>
      {isMobile.isMobile ? (
        <Drawer
          placement='bottom'
          open={isShowPopupPremium}
          onClose={() => setIsShowPopupPremium(false)}
          closable={false}
          height='auto'
          className='rounded-t-xl'
        >
          <PremiumBreakdownContent
            {...rest}
            onClose={() => setIsShowPopupPremium(false)}
          />
        </Drawer>
      ) : (
        <Modal
          open={isShowPopupPremium}
          onCancel={() => setIsShowPopupPremium(false)}
          closable={false}
          maskClosable={true}
          keyboard={true}
          footer={null}
          width={500}
          centered
        >
          <PremiumBreakdownContent
            {...rest}
            onClose={() => setIsShowPopupPremium(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default ModalPremium;
