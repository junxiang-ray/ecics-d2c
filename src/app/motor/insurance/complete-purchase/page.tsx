'use client';

import { useAppSelector } from '@/redux/store';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';

export default function CompletePurchasePage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MotorInsuranceLayout>
      {({ onSave }) => (
        <CompletePurchaseDetail
          onSaveRegister={onSave}
          isSingPassFlow={isSingPassFlow}
        />
      )}
    </MotorInsuranceLayout>
  );
}
