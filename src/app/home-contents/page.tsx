'use client';
import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';
import { ROUTES } from '@/constants/routes';
import { Router } from 'lucide-react';
import { useRouter } from 'next/router';

export default function HomeContentPage() {
  return <QuoteDetail />;
}
