import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { decryptValue, parseJSON } from '@/libs/utils/secureStorage-utils';
import { PortalAuthPayload } from '@/libs/types/auth';
import { machineTokenManager } from '@/libs/utils/machineToken';
import type { PolicySummary } from '@/hook/policy/usePolicyData';

export async function POST(_: NextRequest) {
  try {
    /* ───────── AUTH ───────── */
    const cookieStore = cookies();
    const paCookie = cookieStore.get('_pa');

    if (!paCookie?.value) {
      return NextResponse.json(
        { error: 'Missing _pa cookie' },
        { status: 401 },
      );
    }

    const encryptedAuth = Buffer.from(paCookie.value, 'base64').toString(
      'utf8',
    );
    const decryptedAuth = await decryptValue(
      encryptedAuth,
      process.env.PORTAL_COOKIE_PASSPHRASE!,
    );

    if (!decryptedAuth) {
      return NextResponse.json(
        { error: 'Auth decryption failed' },
        { status: 401 },
      );
    }

    const authPayload = parseJSON<PortalAuthPayload>(decryptedAuth);

    if (!authPayload?.accessToken || !authPayload.nric) {
      return NextResponse.json(
        { error: 'Invalid auth payload' },
        { status: 401 },
      );
    }

    /* ───────── FETCH POLICIES ───────── */
    const machineToken = await machineTokenManager.getToken();

    const fastifyRes = await fetch(
      `${process.env.FASTIFY_API_URL}/api/v1/o3/polmaster/by-icno`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${machineToken}`,
          'X-User-Token': authPayload.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ icno: authPayload.nric }),
      },
    );

    if (!fastifyRes.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch policies' },
        { status: fastifyRes.status },
      );
    }

    const policies: PolicySummary[] = await fastifyRes.json();

    /* ───────── RETURN DATA ONLY ───────── */
    return NextResponse.json({ policies });
  } catch (error) {
    console.error('💥 POLICY LIST ERROR:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
