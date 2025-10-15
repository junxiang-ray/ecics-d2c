'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

import PremiumBreakdownRenewalContent, {
  PremiumBreakdownRenewalContentProps,
} from '@/app/renewal/modal/PremiumBreakdownModal';
import { useBottomSheet } from '@/hook/useBottomSheet';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

interface Props extends PremiumBreakdownRenewalContentProps {
  isShowPopupPremium: boolean;
  setIsShowPopupPremium: (isShowPopupPremium: boolean) => void;
}

const ModalPremiumRenewal = (props: Props) => {
  const { isShowPopupPremium, setIsShowPopupPremium, ...rest } = props;
  const isMobile = useDeviceDetection();

  const { controls, sheetProps } = useBottomSheet(isShowPopupPremium, () =>
    setIsShowPopupPremium(false),
  );

  // Disable background scroll
  useEffect(() => {
    if (isShowPopupPremium) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isShowPopupPremium]);

  if (!isShowPopupPremium) return null;

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-end justify-center bg-black/40'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsShowPopupPremium(false)}
    >
      <motion.div
        {...sheetProps}
        animate={controls}
        className='flex w-full flex-col rounded-t-2xl bg-white p-4'
        style={{ maxHeight: isMobile ? '85vh' : '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300' />
        <div className='scrollbar-hide flex-1 overflow-y-auto'>
          <PremiumBreakdownRenewalContent
            {...rest}
            onClose={() => setIsShowPopupPremium(false)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalPremiumRenewal;
