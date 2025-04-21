import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import MButton from '@/components/ui/button/MButton';

interface BusinessPartnerBarProps {
  businessName?: string;
  companyName?: string;
  onBackClick?: () => void;
  onSaveClick?: () => void;
}

export default function BusinessPartnerBar({
  businessName = 'Business Partner Name',
  companyName = 'Leo Management Consultancy Pte Ltd',
  onBackClick,
  onSaveClick,
}: BusinessPartnerBarProps) {
  return (
    <div className='fixed left-0 top-0 z-50 flex w-full flex-row items-center justify-between bg-white px-8 py-3 shadow-md'>
      <MButton
        type='text'
        shape='circle'
        icon={<ArrowBackIcon />}
        onClick={onBackClick}
      />
      <div className='text-left'>
        <div className='text-base'>{businessName}</div>
        <div className='max-w-[200px] truncate text-sm font-semibold md:max-w-none'>
          {companyName}
        </div>
      </div>
      <MButton
        color='primary'
        variant='outlined'
        onClick={onSaveClick}
        className='link rounded-none'
      >
        Save
      </MButton>
    </div>
  );
}
