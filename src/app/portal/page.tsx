'use client';

import Loading from '@/app/portal/loading';
import { notification } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRetriveNricSingpass } from '@/hook/auth/login-portal';
import { useEffect, useRef, useState } from 'react';
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

  const [auth, setAuth] = useState<Record<string, any>>();
  const singpassCodeRef = useRef(searchParams.get('code'));
  const userInfoQuery = useGetUserProfile(auth?.nric != null);
  const userResp = userInfoQuery.data;

  useEffect(() => {
    if (userResp?.data) dispatch(setUser(userResp.data));
  }, [userResp]);

  useEffect(() => {
    (async () => {
      const decryptedStr = await decryptValue(
        getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION) ||
          sessionStorage.getItem(COOKIE_NAME.PORTAL_AUTHORIZATION) ||
          '',
        process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? '',
      );
      setAuth(parseJSON(decryptedStr ?? '') || {});
    })();
  }, []);

  useEffect(() => {
    router.push(pathname);
    if (!auth || auth?.nric || retriveNRICMutation.isPending) return;

    if (singpassCodeRef.current == null && !auth.nric)
      singpassCodeRef.current = auth.code;

    if (singpassCodeRef.current) return requestNRIC();

    signOut();
  }, [singpassCodeRef.current, auth]);

  useEffect(() => {
    if (!userInfoQuery.isError) return;

    showErrorNoti('Unauthorized');
    setTimeout(() => signOut(), 500);
  }, [userInfoQuery.isError]);

  const showErrorNoti = (message: string) => {
    notification.error({
      key: Date.now(),
      type: 'error',
      message,
      icon: <MehOutlined className='text-red-500' />,
      duration: 3,
      showProgress: true,
    });
  };

  const requestNRIC = (): void => {
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
        setCookie<string>({
          name: COOKIE_NAME.PORTAL_AUTHORIZATION,
          value: encrypted,
          expireAfter: { days: 30 },
        });
        setAuth(verifiedAuth);
      },
      onError: () => {
        showErrorNoti('Error');
        setTimeout(() => {
          signOut();
        }, 1500);
      },
    });
  };

  const signOut = () => {
    router.push(ROUTES.PORTAL.LOGOUT);
  };

  if (auth?.nric) return null;

  return <Loading />;
};
export default Page;
