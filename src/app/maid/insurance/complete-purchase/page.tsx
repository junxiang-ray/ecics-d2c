'use client';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

interface CompletePurchaseDetailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CompletePurchaseDetailPage({
  searchParams,
}: CompletePurchaseDetailPageProps) {
  const params = searchParams;
  const isManual = params?.manual === 'true' ? true : false;

  return (
    <MaidInsuranceLayout>
      {({ onSave }) => <CompletePurchaseDetail onSaveRegister={onSave} />}
    </MaidInsuranceLayout>
  );
}
