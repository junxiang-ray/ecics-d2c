'use client';
import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';

import { useAppSelector } from '@/redux/store';

export default function QuoteDetailPage() {
  const isSingPassFlow = useAppSelector(
    (state) => state.general.isSingpassFlow,
  );

  return <QuoteDetail />;
}
