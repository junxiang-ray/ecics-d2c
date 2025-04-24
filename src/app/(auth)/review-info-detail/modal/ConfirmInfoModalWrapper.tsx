import { useState } from 'react';
import ConfirmInfoModal from './ConfirmInfoModal';
import ConfirmInfoCompletedModal from './ConfirmInfoCompletedModal';

const ConfirmInfoModalWrapper = () => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50'>
      <div className='flex h-1/3 w-full animate-slide-up flex-col rounded-t-lg bg-white shadow-lg sm:w-[480px]'>
        {isSaved ? (
          <ConfirmInfoCompletedModal />
        ) : (
          <ConfirmInfoModal onSave={() => setIsSaved(true)} />
        )}
      </div>
    </div>
  );
};

export default ConfirmInfoModalWrapper;
