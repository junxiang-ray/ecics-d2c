//src\app\portal\page.tsx
'use client';

import Loading from '@/app/portal/loading';
import { notification } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRetriveNricSingpass } from '@/hook/auth/login-portal';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  decryptValue,
  encryptValue,
  parseJSON,
  stringifyJSON,
} from '@/libs/utils/secureStorage-utils';
import { getCookie, setCookie } from '@/libs/utils/utils';
import { UserInfoPayload } from '@/libs/types/auth';
import { ROUTES } from '@/constants/routes';
import { MehOutlined } from '@ant-design/icons';
import { useGetUserProfile } from '@/hook/user-profile/user-profile';
import { useAppDispatch } from '@/redux/store';
import { setUser } from '@/redux/slices/portalUser.slice';
import { COOKIE_NAME } from '@/constants/general.constant';

const Page = (): JSX.Element | null => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const retriveNRICMutation = useRetriveNricSingpass();

  const [auth, setAuth] = useState<Record<string, any> | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const singpassCodeRef = useRef(searchParams.get('code'));

  const userInfoQuery = useGetUserProfile(!!auth?.nric);
  const userResp = userInfoQuery.data;

  /* -------------------------------
   * Helpers (defined first with useCallback)
   * ------------------------------- */
  const signOut = useCallback(() => {
    router.replace(ROUTES.PORTAL.LOGOUT);
  }, [router]);

  const showErrorNoti = useCallback((message: string) => {
    notification.error({
      key: Date.now(),
      type: 'error',
      message,
      icon: <MehOutlined className='text-red-500' />,
      duration: 3,
      showProgress: true,
    });
  }, []);

  const requestNRIC = useCallback(() => {
    const payload: UserInfoPayload = {
      code: singpassCodeRef.current ?? '',
      code_verifier: auth?.code_verifier,
    };

    retriveNRICMutation.mutate(payload, {
      onSuccess: async ({ data: nric } = { data: '', message: '' }) => {
        const verifiedAuth = { ...auth, code: payload.code, nric };

        const encrypted = await encryptValue(
          stringifyJSON(verifiedAuth),
          process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? '',
        );

        setCookie({
          name: COOKIE_NAME.PORTAL_AUTHORIZATION,
          value: encrypted,
          expireAfter: { days: 30 },
        });

        setAuth(verifiedAuth);
      },
      onError: () => {
        showErrorNoti('Error');
        setTimeout(signOut, 1500);
      },
    });
  }, [auth, retriveNRICMutation, showErrorNoti, signOut]);

  /* -------------------------------
   * Hydrate auth from _pa
   * ------------------------------- */
  useEffect(() => {
    (async () => {
      const decryptedStr = await decryptValue(
        getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION) ?? '',
        process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? '',
      );

      setAuth(parseJSON(decryptedStr ?? '') || null);
      setAuthInitialized(true);
    })();
  }, []);

  /* -------------------------------
   * 🔐 DEFENSIVE COOKIE GUARD (NEW)
   * ------------------------------- */
  useEffect(() => {
    if (!authInitialized) return;

    const hasCookie = !!getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION);

    if (!hasCookie) {
      router.replace(`${ROUTES.PORTAL.LOGIN}?expired=true`);
    }
  }, [authInitialized, pathname, router]);

  /* -------------------------------
   * Debug auth payload
   * ------------------------------- */
  useEffect(() => {
    if (!auth) return;
  }, [auth]);

  /* -------------------------------
   * Populate Redux once authenticated
   * ------------------------------- */
  useEffect(() => {
    if (userResp?.data) {
      dispatch(setUser(userResp.data));
    }
  }, [userResp, dispatch]);

  /* -------------------------------
   * Token expiry check
   * ------------------------------- */
  useEffect(() => {
    if (!auth?.accessTokenExpiresAt) return;

    const expiresIn = auth.accessTokenExpiresAt - Date.now();
    if (expiresIn < 5 * 60 * 1000) {
      // Less than 5 minutes
      // Refresh token or redirect to login
      signOut();
    }
  }, [auth, signOut]);

  /* -------------------------------
   * CORE AUTH LOGIC
   * ------------------------------- */
  useEffect(() => {
    if (!authInitialized) return;

    // ✅ Authenticated → allow
    if (auth?.nric) return;

    // ⛔ Below is Singpass-only flow
    if (retriveNRICMutation.isPending) return;

    if (!singpassCodeRef.current && auth?.code) {
      singpassCodeRef.current = auth.code;
    }

    if (singpassCodeRef.current) {
      return requestNRIC();
    }

    // ❌ Truly unauthenticated
    signOut();
  }, [
    auth,
    authInitialized,
    retriveNRICMutation.isPending,
    pathname,
    requestNRIC,
    signOut,
  ]);

  /* -------------------------------
   * Profile error → sign out
   * ------------------------------- */
  useEffect(() => {
    if (!userInfoQuery.isError) return;

    showErrorNoti('Unauthorized');
    setTimeout(signOut, 500);
  }, [userInfoQuery.isError, signOut, showErrorNoti]);

  if (auth?.nric) return null;
  return <Loading />;
};

export default Page;
