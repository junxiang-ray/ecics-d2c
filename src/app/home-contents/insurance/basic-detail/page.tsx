'use client';

import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';

import { useAppSelector } from '@/redux/store';
import HomeContentInsuranceLayout from '../HomeContentInsuranceLayout';
import { PolicyDetail } from './PolicyDetail';

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
