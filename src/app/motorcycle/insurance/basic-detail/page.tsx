'use client';

import { useAppSelector } from '@/redux/store';

import { PolicyDetail } from './PolicyDetail';
import MotorcycleInsuranceLayout from '../MotorcycleInsuranceLayout';

export default function BasicDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MotorcycleInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={isSingPassFlow} />
      )}
    </MotorcycleInsuranceLayout>
  );
}
