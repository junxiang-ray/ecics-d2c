'use client';
import { useAppSelector } from '@/redux/store';
import HomeContentInsuranceLayout from '../HomeContentInsuranceLayout';
import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';

export default function QuoteDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return <QuoteDetail />;
}
