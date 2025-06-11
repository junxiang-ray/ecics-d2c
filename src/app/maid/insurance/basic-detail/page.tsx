'use client';

import { useSearchParams } from 'next/navigation';

import { PolicyDetail } from './PolicyDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

export default function PolicyDetailPage() {
  const params = useSearchParams();
  const manual = params?.get('manual') || '';
  const isManual = manual === 'true' ? true : false;

  return (
    <MaidInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={!isManual} />
      )}
    </MaidInsuranceLayout>
  );
}
