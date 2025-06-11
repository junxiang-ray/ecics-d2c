'use client';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

interface PolicyDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PolicyDetailPage({
  searchParams,
}: PolicyDetailPageProps) {
  const params = searchParams;
  const isManual = params?.manual === 'true' ? true : false;

  return (
    <MotorInsuranceLayout>
      {({ onSave }) => <CompletePurchaseDetail onSaveRegister={onSave} />}
    </MotorInsuranceLayout>
  );
}
