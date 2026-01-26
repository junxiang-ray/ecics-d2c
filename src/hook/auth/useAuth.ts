// hooks/auth/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { getCookie } from '@/libs/utils/utils';
import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import { COOKIE_NAME } from '@/constants/general.constant';
import { PortalAuthPayload } from '@/libs/types/auth';

export function useAuth() {
  const [auth, setAuth] = useState<PortalAuthPayload | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // ✅ FIX: Provide empty string fallback
        const cookieValue = (getCookie(COOKIE_NAME.PORTAL_AUTHORIZATION) as string) ?? '';
        
        if (!cookieValue) {
          setInitialized(true);
          return;
        }

        const decrypted = await decryptValue(
          cookieValue,  // Now guaranteed string
          process.env.NEXT_PUBLIC_PORTAL_COOKIE_PASSPHRASE ?? ''
        );
        
        const parsed = parseJSON<PortalAuthPayload>(decrypted ?? '');
        setAuth(parsed || null);
      } catch (error) {
        console.error('Auth decode failed:', error);
        setAuth(null);
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  return { auth, initialized };
}
