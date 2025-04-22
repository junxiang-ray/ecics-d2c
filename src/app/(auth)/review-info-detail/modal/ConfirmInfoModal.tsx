import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

const ConfirmInfoModal = ({ onSave }: { onSave: () => void }) => {
  return (
    <div className='flex h-full flex-col justify-between p-6'>
      <div>
        <div className='text-center text-lg font-bold'>Save Your Progress</div>
        <div className='mt-4 text-center text-sm'>
          We can email you a link to continue later from where you left off.
        </div>
      </div>

      <div className='flex justify-center gap-4'>
        <SecondaryButton>Exit without saving</SecondaryButton>
        <PrimaryButton
          onClick={onSave}
          className='rounded-md px-4 py-2 text-white transition'
        >
          Save my progress
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ConfirmInfoModal;
