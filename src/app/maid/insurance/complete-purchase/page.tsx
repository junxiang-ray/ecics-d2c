'use client';

import { useAppSelector } from '@/redux/store';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';

interface PolicyDetailPageProps {}

export default function PolicyDetailPage({}: PolicyDetailPageProps) {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MaidInsuranceLayout>
      {({ onSave }) => (
        <CompletePurchaseDetail
          onSaveRegister={onSave}
          isSingPassFlow={isSingPassFlow}
        />
      )}
    </MaidInsuranceLayout>
  );
}
