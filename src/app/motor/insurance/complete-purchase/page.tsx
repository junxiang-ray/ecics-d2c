'use client';

import CompletePurchaseDetail from './CompletePurchaseDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';
import { useAppSelector } from '@/redux/store/configureStore';

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
