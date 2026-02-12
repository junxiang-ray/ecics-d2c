'use client';

import { useSearchParams } from 'next/navigation';
import SignupForm from './SignupForm';

const PortalSignupPage = () => {
  const searchParams = useSearchParams();
  const nric = searchParams.get('nric');

  if (!nric) {
    return <div>Invalid signup link</div>;
  }

  return <SignupForm nric={nric} />;
};

export default PortalSignupPage;
