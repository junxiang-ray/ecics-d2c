'use client';

import { useAppSelector } from '@/redux/store';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import HomeContentInsuranceLayout from '../HomeContentInsuranceLayout';

interface PolicyDetailPageProps {}

export default function PolicyDetailPage({}: PolicyDetailPageProps) {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <HomeContentInsuranceLayout>
      {({ onSave }) => (
        <CompletePurchaseDetail
          onSaveRegister={onSave}
          isSingPassFlow={isSingPassFlow}
        />
      )}
    </HomeContentInsuranceLayout>
  );
}
