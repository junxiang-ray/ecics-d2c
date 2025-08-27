'use client';

import { useAppSelector } from '@/redux/store';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MotorcycleInsuranceLayout from '../MotorcycleInsuranceLayout';

export default function CompletePurchasePage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MotorcycleInsuranceLayout>
      {({ onSave }) => (
        <CompletePurchaseDetail
          onSaveRegister={onSave}
          isSingPassFlow={isSingPassFlow}
        />
      )}
    </MotorcycleInsuranceLayout>
  );
}
