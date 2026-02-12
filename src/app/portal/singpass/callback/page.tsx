// src/app/portal/singpass/callback/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin, notification } from 'antd';
import { getCookie, removeCookie } from '@/libs/utils/utils';
import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';

const OAUTH_COOKIE = 'pa_oauth';

interface OAuthSessionData {
  state?: string;
  nonce?: string;
  code_verifier?: string;
}

const SingpassCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      console.log('⏭️ Skipping duplicate execution');
      return;
    }
    hasRun.current = true;

    const init = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      console.log('🔑 Singpass callback received:', {
        code: code?.substring(0, 20) + '...',
        state,
      });

      if (!code) {
        notification.error({
          message: 'Authentication failed',
          description: 'No authorization code received from Singpass',
        });
        router.replace('/portal/login?error=no_code');
        return;
      }

      try {
        const oauthCookie = getCookie(OAUTH_COOKIE) as string | undefined;
        if (!oauthCookie || typeof oauthCookie !== 'string') {
          throw new Error('OAuth session expired. Please try again.');
        }

        const decrypted = await decryptValue(
          oauthCookie,
          process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? '',
        );

        const sessionData = parseJSON(decrypted ?? '') as OAuthSessionData;

        if (sessionData?.state !== state) {
          throw new Error('Invalid state parameter. Possible CSRF attack.');
        }

        if (!sessionData?.code_verifier) {
          throw new Error('Invalid OAuth session.');
        }

        console.log('📦 OAuth session valid, exchanging code for NRIC...');

        removeCookie(OAUTH_COOKIE);

        const exchangeRes = await fetch('/api/v1/auth/singpass/exchange-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            code_verifier: sessionData.code_verifier,
          }),
        });

        const exchangeData = await exchangeRes.json();

        if (!exchangeRes.ok) {
          throw new Error(
            exchangeData?.message || 'Failed to get NRIC from Singpass',
          );
        }

        const nric = exchangeData.nric;
        console.log('✅ NRIC obtained:', nric);

        const checkRes = await fetch('/api/v1/auth/check-nric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nric }),
        });

        const checkData = await checkRes.json();

        if (!checkRes.ok) {
          throw new Error(checkData?.message || 'Failed to check user status');
        }

        if (!checkData.exists) {
          console.log('👤 New user, redirecting to signup');
          router.replace(`/portal/signup?nric=${nric}`);
          return;
        }

        console.log('👤 Existing user, auto-logging in:', checkData.email);

        const authRes = await fetch('/api/v1/auth/cognito-custom-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: checkData.email,
            nric: nric,
          }),
        });

        const authData = await authRes.json();

        if (!authRes.ok || !authData.success) {
          throw new Error(authData?.message || 'Auto-login failed');
        }

        console.log('✅ Auto-login successful, redirecting to portal');
        router.replace('/portal/home');
      } catch (error: any) {
        console.error('❌ Callback error:', error);
        notification.error({
          message: 'Authentication failed',
          description: error.message,
        });
        router.replace('/portal/login?error=auth_failed');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Spin size='large' tip='Processing Singpass authentication...' />
      </div>
    );
  }

  return null;
};

export default SingpassCallbackPage;
