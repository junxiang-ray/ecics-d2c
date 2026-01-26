import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import type { PolicySummary } from '@/hook/policy/usePolicyData';

interface PolicyCookiePayload {
  policies: PolicySummary[];
  timestamp: string;
  nric: string;
}

// Restore Base64URL → Base64
function fromBase64Url(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) base64 += '=';
  return base64;
}

export async function GET() {
  console.log('🔍 === SERVER-SIDE _pd READ ===');

  try {
    const pdCookie = cookies().get('_pd');

    if (!pdCookie?.value) {
      console.log('ℹ️ No _pd cookie found');
      return NextResponse.json({ policies: [] });
    }

    console.log('📦 _pd cookie found:', pdCookie.value.length, 'chars');

    // ✅ FIX: Base64URL → Base64 ONLY
    const encryptedPayload = fromBase64Url(pdCookie.value);

    const decrypted = await decryptValue(
      encryptedPayload,
      process.env.PORTAL_COOKIE_PASSPHRASE!
    );

    if (!decrypted) {
      console.log('❌ _pd decryption failed');
      return NextResponse.json({ policies: [] });
    }

    const policyData = parseJSON<PolicyCookiePayload>(decrypted);
    console.log('✅ Server read _pd:', policyData.policies.length, 'policies');

    return NextResponse.json({ policies: policyData.policies });

  } catch (error) {
    console.error('💥 Server cookie read error:', error);
    return NextResponse.json({ policies: [] });
  }
}
