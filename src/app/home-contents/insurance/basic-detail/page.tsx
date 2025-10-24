'use client';

import { useAppSelector } from '@/redux/store';

import { PolicyDetail } from './PolicyDetail';
import HomeContentInsuranceLayout from '../HomeContentInsuranceLayout';
import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';

export default function BasicDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return (
    // <HomeContentInsuranceLayout>
    //   {({ onSave }) => (
    //     <PolicyDetail onSaveRegister={onSave} isSingPassFlow={isSingPassFlow} />
    //   )}
    // </HomeContentInsuranceLayout>
    <QuoteDetail />
  );
}
