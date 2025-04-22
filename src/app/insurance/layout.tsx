import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { SecondaryButton } from '@/components/ui/buttons';
import { Button } from 'antd';
import BusinessPartnerBar from './components/BusinessPartnerBar';

function InsuranceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <BusinessPartnerBar
        businessName='Business Partner Name'
        companyName='Leo Management Consultancy Pte Ltd'
      />
      <ProgressBar />
      {children}
    </div>
  );
}

export default InsuranceLayout;

function ProgressBar() {
  return <div className=''></div>;
}
