'use client';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

interface CompletePurchasePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CompletePurchasePage({
  searchParams,
}: CompletePurchasePageProps) {
  const params = searchParams;
  const isManual = params?.manual === 'true' ? true : false;

  return (
    <MotorInsuranceLayout>
      {({ onSave }) => <CompletePurchaseDetail onSaveRegister={onSave} />}
    </MotorInsuranceLayout>
  );
}
