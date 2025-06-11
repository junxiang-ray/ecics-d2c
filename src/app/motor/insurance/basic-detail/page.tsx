'use client';

import { useSearchParams } from 'next/navigation';

import { PolicyDetail } from './PolicyDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

export default function PolicyDetailPage() {
  const params = useSearchParams();
  const manual = params?.get('manual') || '';
  const isManual = manual === 'true' ? true : false;

  return (
    <MotorInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={!isManual} />
      )}
    </MotorInsuranceLayout>
  );
}
