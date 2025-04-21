import { Button } from 'antd';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';

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
      <Button
        type='text'
        shape='circle'
        icon={<ArrowBackIcon />}
        onClick={onBackClick}
      />
      <div className='text-left'>
        <div className='text-base'>{businessName}</div>
        <div className='text-sm font-semibold'>{companyName}</div>
      </div>
      <Button
        color='primary'
        variant='outlined'
        onClick={onSaveClick}
        className='rounded-none'
      >
        Save
      </Button>
    </div>
  );
}
