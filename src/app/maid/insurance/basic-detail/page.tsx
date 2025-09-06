'use client';

import { PolicyDetail } from './PolicyDetail';
import MaidInsuranceLayout from '../MaidInsuranceLayout';
import { useAppSelector } from '@/redux/store/configureStore';

export default function PolicyDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <MaidInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={isSingPassFlow} />
      )}
    </MaidInsuranceLayout>
  );
}
