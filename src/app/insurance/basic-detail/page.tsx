'use client';
import { useSearchParams } from 'next/navigation';
import InsuranceLayout from '../InsuranceLayout';
import { PolicyDetail } from './PolicyDetail';

export default function PolicyDetailPage() {
  const params = useSearchParams();
  const manual = params?.get('manual') || '';
  const isManual = manual === 'true' ? true : false;

  return (
    <InsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={!isManual} />
      )}
    </InsuranceLayout>
  );
}
