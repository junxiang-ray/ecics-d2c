'use client';

import HelpersDetail from './HelpersDetail';
import HomeContentInsuranceLayout from '../HomeContentInsuranceLayout';

export default function HelpersDetailPage() {
  return (
    <HomeContentInsuranceLayout>
      {({ onSave }) => <HelpersDetail onSaveRegister={onSave} />}
    </HomeContentInsuranceLayout>
  );
}
