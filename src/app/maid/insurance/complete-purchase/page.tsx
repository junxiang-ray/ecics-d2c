'use client';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

interface PolicyDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PolicyDetailPage({
  searchParams,
}: PolicyDetailPageProps) {
  const params = searchParams;
  const isManual = params?.manual === 'true' ? true : false;

  return (
    <MaidInsuranceLayout>
      {({ onSave }) => <CompletePurchaseDetail onSaveRegister={onSave} />}
    </MaidInsuranceLayout>
  );
}
