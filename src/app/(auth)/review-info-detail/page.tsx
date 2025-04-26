'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { saveItemsToStorage } from '@/libs/utils/utils';

import { authApi } from '@/api/auth';
import ManualReviewInfoDetail from '@/app/(auth)/review-info-detail/ManualReviewInfoDetail';
import ReviewInfoDetail from '@/app/(auth)/review-info-detail/ReviewInfoDetail'; // import thêm
import { ECICS_USER_INFO } from '@/constants/general.constant';

export default function ReviewInfoDetailPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (code) {
          const userInfo = await authApi.getUserInfoByCode(code);
          if (userInfo) {
            saveItemsToStorage(
              { [ECICS_USER_INFO]: JSON.stringify(userInfo) },
              'session',
            );
            toast.success('User info retrieved!');
          } else {
            toast.error('Failed to retrieve user info.');
          }
        }
      } catch (error) {
        toast.error('Error retrieving user info.');
        console.error(error);
      }
    };

    fetchUserInfo();
  }, [code]);

  return <div>{code ? <ReviewInfoDetail /> : <ManualReviewInfoDetail />}</div>;
}
