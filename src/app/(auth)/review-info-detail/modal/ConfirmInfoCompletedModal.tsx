import TickCircleIcon from '@/components/icons/TickCircleIcon';
import { LinkButton } from '@/components/ui/buttons';

const ConfirmInfoCompletedModal = () => {
  return (
    <div className='flex h-full flex-col justify-between p-6 text-center'>
      <div className='relative z-10 flex-grow p-6'>
        <TickCircleIcon size={32} className='mx-auto text-[#10B707]' />
        <div className='mt-4 text-lg font-bold'>Progress Saved!</div>
        <div className='mt-4 text-sm'>
          A link has been sent to your email. Use it anytime to continue your
          car insurance journey.'
        </div>
      </div>

      <div className='flex justify-center gap-4 border-t bg-white p-4'>
        <LinkButton type='link'>Go Back to Home</LinkButton>
      </div>
    </div>
  );
};

export default ConfirmInfoCompletedModal;
