//PlaceHolders
'use client';

import { useAppSelector } from '@/redux/store';

import { PolicyDetail } from './PolicyDetail';
import HomeContentInsuranceLayout from '../HomeContentInsuranceLayout';

export default function BasicDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    <HomeContentInsuranceLayout>
      {({ onSave }) => (
        <PolicyDetail onSaveRegister={onSave} isSingPassFlow={isSingPassFlow} />
      )}
    </HomeContentInsuranceLayout>
  );
}
