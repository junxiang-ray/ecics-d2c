'use client';

import { useSearchParams } from 'next/navigation';

import ManualReviewInfoDetail from '@/app/(auth)/review-info-detail/ManualReviewInfoDetail';
import ReviewInfoDetail from '@/app/(auth)/review-info-detail/ReviewInfoDetail'; // import thêm
import { useGetUserInfo } from '@/hook/auth/login';

export default function ReviewInfoDetailPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state') ?? '';
  const code_verifier = sessionStorage.getItem('code_verifier') ?? '';
  const nonce = sessionStorage.getItem('nonce') ?? '';
  const params = {
    code,
    state,
  };
  const payload = {
    code_verifier,
    nonce,
    state,
  };
  const { data, isLoading } = useGetUserInfo({
    params,
    payload,
  });

  if (isLoading) {
    return 'isloading...';
  }

  return <div>{code ? <ReviewInfoDetail /> : <ManualReviewInfoDetail />}</div>;
}
