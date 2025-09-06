'use client';

import { PolicyDetail } from './PolicyDetail';
import MotorInsuranceLayout from '../MotorInsuranceLayout';
import { useAppSelector } from '@/redux/store/configureStore';

export default function PolicyDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MotorInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={isSingPassFlow} />
      )}
    </MotorInsuranceLayout>
  );
}
